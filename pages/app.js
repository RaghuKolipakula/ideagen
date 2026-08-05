const API_BASE = 'https://ideagen-api.kolipakula.workers.dev';

// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const userPromptInput = document.getElementById('userPromptInput');
const loadingState = document.getElementById('loadingState');
const productShowcase = document.getElementById('productShowcase');

const productName = document.getElementById('productName');
const productPrice = document.getElementById('productPrice');
const productDesc = document.getElementById('productDesc');
const productFeatures = document.getElementById('productFeatures');
const productCompetitors = document.getElementById('productCompetitors');
const productImagePrompt = document.getElementById('productImagePrompt');
const copyIdeaBtn = document.getElementById('copyIdeaBtn');

const createImageBtn = document.getElementById('createImageBtn');
const productImage = document.getElementById('productImage');
const imageLoadingState = document.getElementById('imageLoadingState');

const feedbackBtns = document.querySelectorAll('.feedback-btn');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
const categoryFeedbackBtns = document.querySelectorAll('.category-feedback-btn');

// State
let currentProductId = null;
let currentProductCategory = null;

// Event Listeners
if (generateBtn) {
  generateBtn.addEventListener('click', generateProduct);
}
if (userPromptInput) {
  userPromptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateProduct();
  });
}
if (createImageBtn) {
  createImageBtn.addEventListener('click', generateImage);
}
if (copyIdeaBtn) {
  copyIdeaBtn.addEventListener('click', copyIdeaToClipboard);
}

feedbackBtns.forEach(btn => {
  btn.addEventListener('click', () => handleFeedback(btn.dataset.rating));
});

categoryFeedbackBtns.forEach(btn => {
  btn.addEventListener('click', () => handleCategoryFeedback(btn.dataset.category, btn));
});

// Functions
async function generateProduct() {
  // Update UI State
  productShowcase.classList.add('hidden');
  productShowcase.classList.remove('fade-in');
  loadingState.classList.remove('hidden');
  generateBtn.disabled = true;
  generateBtn.classList.add('opacity-50', 'cursor-not-allowed');
  generateBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i><span>Inventing...</span>';
  
  // Reset feedback buttons
  feedbackBtns.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('bg-green-500/20', 'bg-red-500/20', 'border-green-500', 'border-red-500');
  });

  // Reset image state
  productImage.classList.add('hidden');
  productImage.src = '';
  createImageBtn.classList.remove('hidden');
  imageLoadingState.classList.add('hidden');

  const userPrompt = userPromptInput ? userPromptInput.value.trim() : '';

  try {
    const response = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userPrompt ? { userPrompt } : {})
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate product');
    }

    const data = await response.json();
    currentProductId = data.id;
    currentProductCategory = data.category;

    // Populate UI
    productName.textContent = data.name;
    productPrice.textContent = data.price;
    productDesc.textContent = data.description;
    productImagePrompt.textContent = data.image_prompt;
    
    productFeatures.innerHTML = '';
    if(Array.isArray(data.features)) {
      data.features.forEach(feat => {
        productFeatures.innerHTML += `
          <li class="flex items-start gap-3 text-gray-300 text-sm">
            <i class="fa-solid fa-check text-indigo-400 mt-1"></i>
            <span>${feat}</span>
          </li>
        `;
      });
    }

    productCompetitors.innerHTML = '';
    if(Array.isArray(data.competitors) && data.competitors.length > 0) {
      data.competitors.forEach(comp => {
        productCompetitors.innerHTML += `
          <li class="flex items-start gap-3 text-gray-400 text-sm">
            <i class="fa-solid fa-link text-indigo-400 mt-1"></i>
            <span>${comp}</span>
          </li>
        `;
      });
    } else {
      productCompetitors.innerHTML = `
        <li class="text-gray-500 text-sm italic">No direct competitors identified, or they are too obscure.</li>
      `;
    }

    // Switch UI
    loadingState.classList.add('hidden');
    productShowcase.classList.remove('hidden');
    productShowcase.classList.add('fade-in');

  } catch (error) {
    console.error(error);
    showToast('Failed to generate product. Please try again.', true);
    loadingState.classList.add('hidden');
  } finally {
    generateBtn.disabled = false;
    generateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    generateBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i><span>Generate New Product</span>';
  }
}

async function generateImage() {
  const prompt = productImagePrompt.textContent;
  if (!prompt) return;

  createImageBtn.classList.add('hidden');
  imageLoadingState.classList.remove('hidden');

  try {
    const response = await fetch(`${API_BASE}/api/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    productImage.src = imageUrl;
    productImage.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    showToast('Failed to generate image. Please try again.', true);
    createImageBtn.classList.remove('hidden');
  } finally {
    imageLoadingState.classList.add('hidden');
  }
}

async function handleFeedback(rating) {
  if (!currentProductId) return;

  // Disable buttons visually
  feedbackBtns.forEach(btn => btn.disabled = true);
  
  const isUpvote = rating === '1';
  const activeBtn = document.querySelector(`.feedback-btn[data-rating="${rating}"]`);
  
  if(isUpvote) {
    activeBtn.classList.add('bg-green-500/20', 'border-green-500', 'text-green-400');
  } else {
    activeBtn.classList.add('bg-red-500/20', 'border-red-500', 'text-red-400');
  }

  try {
    await fetch(`${API_BASE}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        productId: currentProductId, 
        rating: parseInt(rating),
        category: currentProductCategory // Actually boosting the category of this idea
      })
    });

    showToast(isUpvote ? 'Thanks for the upvote! We\'ll prioritize this category.' : 'Got it. We\'ll deprioritize this category.');
  } catch (err) {
    console.error(err);
    showToast('Failed to submit feedback', true);
  }
}

async function handleCategoryFeedback(category, btn) {
  // Disable buttons visually
  categoryFeedbackBtns.forEach(b => b.disabled = true);
  
  btn.classList.add('bg-indigo-500/20', 'border-indigo-500');

  try {
    await fetch(`${API_BASE}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        productId: currentProductId || 0, // Fallback if they vote without generating
        rating: 1, // Positive reinforcement for category
        category: category
      })
    });

    showToast(`Thanks! We'll focus more on ${category}.`);
  } catch (err) {
    console.error(err);
    showToast('Failed to submit feedback', true);
  }
}

function showToast(message, isError = false) {
  toastMsg.textContent = message;
  toast.querySelector('i').className = isError 
    ? 'fa-solid fa-circle-exclamation text-red-400'
    : 'fa-solid fa-circle-check text-green-400';
  
  toast.classList.remove('opacity-0', 'translate-y-20');
  
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-20');
  }, 3000);
}

// Copy to Clipboard
function copyIdeaToClipboard() {
  const name = productName.textContent;
  const desc = productDesc.textContent;
  const price = productPrice.textContent;
  
  let featuresText = "Key Features:\n";
  Array.from(productFeatures.children).forEach(li => {
    featuresText += `- ${li.textContent.trim()}\n`;
  });

  let compsText = "Existing Competition:\n";
  Array.from(productCompetitors.children).forEach(li => {
    compsText += `- ${li.textContent.trim()}\n`;
  });

  const fullText = `Business Idea: ${name} (${price})\n\nDescription: ${desc}\n\n${featuresText}\n${compsText}`;

  navigator.clipboard.writeText(fullText).then(() => {
    showToast('Idea copied to clipboard!');
    const icon = copyIdeaBtn.querySelector('i');
    icon.classList.replace('fa-regular', 'fa-solid');
    icon.classList.replace('fa-copy', 'fa-check');
    icon.classList.add('text-green-400');
    setTimeout(() => {
      icon.classList.replace('fa-solid', 'fa-regular');
      icon.classList.replace('fa-check', 'fa-copy');
      icon.classList.remove('text-green-400');
    }, 2000);
  }).catch(err => {
    console.error('Could not copy text: ', err);
    showToast('Failed to copy', true);
  });
}
