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
const productImagePrompt = document.getElementById('productImagePrompt');

const createImageBtn = document.getElementById('createImageBtn');
const productImage = document.getElementById('productImage');
const imageLoadingState = document.getElementById('imageLoadingState');

const feedbackBtns = document.querySelectorAll('.feedback-btn');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
const categoryFeedbackBtns = document.querySelectorAll('.category-feedback-btn');

// State
let currentProductId = null;

// Event Listeners
if (generateBtn) {
  generateBtn.addEventListener('click', generateProduct);
}
if (createImageBtn) {
  createImageBtn.addEventListener('click', generateImage);
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
    // For simplicity, we just send a random category or a hardcoded one to boost if upvoted.
    // In a full app, we might extract the category from the product metadata or AI response.
    // Here we'll just send 'tech' randomly 50% of the time, or 'lifestyle' to simulate learning.
    const cats = ['tech', 'lifestyle', 'humor', 'luxury', 'quirky'];
    const randomCat = cats[Math.floor(Math.random() * cats.length)];

    await fetch(`${API_BASE}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        productId: currentProductId, 
        rating: parseInt(rating),
        category: randomCat // Simulating category attribution
      })
    });

    showToast(isUpvote ? 'Thanks for the upvote! We\'ll make more like this.' : 'Got it. We\'ll avoid this style.');
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
  toast.className = `fixed bottom-6 right-6 glass-panel px-6 py-3 rounded-lg flex items-center gap-3 transform transition-all duration-300 z-50 ${isError ? 'border-red-500/50' : 'border-green-500/50'}`;
  
  const icon = toast.querySelector('i');
  icon.className = `fa-solid ${isError ? 'fa-circle-exclamation text-red-400' : 'fa-circle-check text-green-400'}`;

  // Show
  toast.classList.remove('translate-y-20', 'opacity-0');
  
  // Hide after 3s
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3000);
}
