const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === '/api/generate' && request.method === 'POST') {
        return await handleGenerate(request, env);
      } else if (url.pathname === '/api/image' && request.method === 'POST') {
        return await handleImage(request, env);
      } else if (url.pathname === '/api/products' && request.method === 'GET') {
        return await handleGetProducts(env);
      } else if (url.pathname === '/api/feedback' && request.method === 'POST') {
        return await handleFeedback(request, env);
      } else if (url.pathname === '/api/preferences' && request.method === 'GET') {
        return await handleGetPreferences(env);
      } else {
        return new Response('Not Found', { status: 404, headers: corsHeaders });
      }
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

async function handleGenerate(request, env) {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  let userPrompt = "";
  try {
    const body = await request.json();
    if (body.userPrompt) userPrompt = body.userPrompt;
  } catch (e) {
    // Ignore, no body provided
  }

  // 1. Fetch current preferences to guide the AI
  const { results: preferences } = await env.DB.prepare('SELECT category, weight FROM preferences ORDER BY weight DESC').all();
  
  const preferenceContext = preferences
    .filter(p => p.weight > 0)
    .map(p => `${p.category} (weight: ${p.weight})`)
    .join(', ');

  const systemInstruction = `You are an expert product designer and startup consultant. Create a highly detailed, data-backed, and proven money-making business idea or side hustle.
CRITICAL CONSTRAINTS:
1. NO STATIC CONTENT: The idea MUST NOT be a static directory, PDF guide, template bundle, or community forum.
2. ADDICTIVE SIMPLE DIGITAL PRODUCT: The product must be an addictive, ridiculously simple digital product or micro-tool (e.g., a viral web app, a simple hyper-casual game, a focused utility, or an interactive digital experience). It must be so trivial to execute that it can be built in a single afternoon.
3. PROVEN DEMAND + BETTER EXECUTION: The idea MUST be based on an existing concept ALREADY making money or getting high engagement. The core functionality MUST be 100% cloneable by an AI coding assistant like Gemini Antigravity in under an hour. You must take this basic concept and add one highly-visible tweak (better UI, gamification, or a missing feature) to capture attention quickly.
4. 24-HOUR SMOKE TEST: The idea must be testable today. You must define a strategy to validate payment intent or engagement (e.g., a viral loop or simple paywall) before heavy coding.
5. LOW LIABILITY: Avoid high-liability sectors.
6. ZERO MAINTENANCE & SELF-EVOLVING: Once built, the system must be highly automated and self-evolving. It must require near-zero ongoing manual operational maintenance.
7. HIGH ENGAGEMENT: The idea MUST have a psychological hook that makes users want to come back repeatedly or share it with friends (gamification, curiosity gap, instant gratification).
8. NO SAAS: ABSOLUTELY NO SaaS (Software as a Service) subscriptions. The product must be monetized via one-time purchase, in-app microtransactions, ads, or pay-per-usage.
${preferenceContext ? `The users currently prefer these industries/models: ${preferenceContext}. Try to lean into these areas.` : ''}
${userPrompt ? `CRITICAL: The user has requested a business idea based on this specific prompt: "${userPrompt}". You MUST base the idea entirely around this prompt.` : ''}
Return ONLY a valid JSON object with the following keys:
- name: A catchy business or service name
- description: A persuasive 2-3 sentence executive summary of the idea and why it's profitable/addictive
- features: An array of 3-4 key success factors, psychological hooks, or competitive advantages
- price: A string representing the estimated startup cost or potential monthly revenue (e.g., "$500 to start" or "$5k/mo revenue")
- competitors: An array of 1-3 existing competitors, formatted as strings containing their name and website URL (e.g., "CompetitorName (www.example.com)").
- category: A string representing the category of the idea. MUST be exactly one of: "Micro-Tool", "E-commerce", "Agency", "Content Creator"
- image_prompt: A prompt that could be used to generate a visualization of this product (e.g., an app UI mockup, a vibrant digital asset).`;

  // 2. Call Gemini API using fetch
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: "Generate a new fake product." }]
      }],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error: ${errText}`);
  }

  const data = await response.json();
  const productJsonString = data.candidates[0].content.parts[0].text;
  
  let product;
  try {
    product = JSON.parse(productJsonString);
  } catch(e) {
     throw new Error("Failed to parse Gemini output as JSON.");
  }

  // 3. Save to D1
  const result = await env.DB.prepare(`
    INSERT INTO products (name, description, features, price, image_prompt, competitors)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING id
  `).bind(
    product.name,
    product.description,
    JSON.stringify(product.features),
    product.price,
    product.image_prompt,
    product.competitors ? JSON.stringify(product.competitors) : null
  ).first();

  product.id = result.id;
  product.features = JSON.stringify(product.features); // keep flat for response or parse?
  // Let's return parsed features in response
  product.features = JSON.parse(product.features);

  return new Response(JSON.stringify(product), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleGetProducts(env) {
  const { results } = await env.DB.prepare('SELECT * FROM products ORDER BY created_at DESC LIMIT 20').all();
  
  // Parse features back to array
  const products = results.map(p => ({
    ...p,
    features: p.features ? JSON.parse(p.features) : [],
    competitors: p.competitors ? JSON.parse(p.competitors) : []
  }));

  return new Response(JSON.stringify(products), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleFeedback(request, env) {
  const { productId, rating, category } = await request.json(); // rating: 1 or -1

  if (!productId || rating === undefined) {
    return new Response(JSON.stringify({ error: "Missing productId or rating" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 1. Insert feedback if there's a valid productId
  if (productId !== 0) {
    await env.DB.prepare(`
      INSERT INTO feedback (product_id, user_rating) VALUES (?, ?)
    `).bind(productId, rating).run();
  }

  // 2. Update preference weight (simplistic approach: if user likes it, boost the chosen category or a random one, or simply we assume the client sends the primary category to boost)
  // For simplicity, let's randomly pick a category to boost/penalize if the client didn't send one, or just update the one sent by client.
  // Actually, we'll just update all weights slightly to learn, but to keep it simple, the client can optionally send a category to boost based on the product.
  // Let's allow the client to pass a `category` (e.g. 'tech')
  if (category) {
    await env.DB.prepare(`
      UPDATE preferences SET weight = weight + ? WHERE category = ?
    `).bind(rating, category).run();
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleGetPreferences(env) {
  const { results } = await env.DB.prepare('SELECT * FROM preferences ORDER BY weight DESC').all();
  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleImage(request, env) {
  const { prompt } = await request.json();
  if (!prompt) {
    return new Response(JSON.stringify({ error: "Missing prompt" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
      prompt: prompt
    });

    return new Response(response, {
      headers: { ...corsHeaders, 'Content-Type': 'image/png' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to generate image" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
