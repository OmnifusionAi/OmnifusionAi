async function loadModels() {
  // fetch the registry relative to the page root
  const response = await fetch('data/models.json');
  const models = await response.json();

  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');

  function applyFilters() {
    const selected = categoryFilter ? categoryFilter.value : 'all';
    const keyword = searchInput ? searchInput.value.toLowerCase() : '';

    const filteredModels = models.filter(model => {
      const matchCategory = selected === 'all' || model.category === selected;
      const matchSearch =
        model.title.toLowerCase().includes(keyword) ||
        model.description.toLowerCase().includes(keyword);
      return matchCategory && matchSearch;
    });

    renderModels(filteredModels);
  }

  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', applyFilters);

  applyFilters();
}

function renderModels(models) {
  const grid = document.getElementById('modelGrid') || document.getElementById('model-list');
  if (!grid) return;

  grid.innerHTML = '';
  models.forEach(model => {
    const card = document.createElement('div');
    card.className = 'model-card';
    card.innerHTML = `
      <h3>${model.title}</h3>
      <p>${model.description}</p>
      <p><strong>Category:</strong> ${model.category}</p>
      <p><strong>Price:</strong> $${model.price}/week</p>
      ${model.trial ? '<button onclick="startTrial(\'' + model.id + '\')">Start Free Trial</button>' : ''}
      <button onclick="subscribeToGPT(\'' + model.id + '\')">Subscribe</button>
      <a href="${model.url}" target="_blank">Launch GPT</a>
    `;
    grid.appendChild(card);
  });
}

function startTrial(id) {
  const key = `trial_${id}`;
  const stored = localStorage.getItem(key);
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  if (!stored || now - parseInt(stored, 10) > week) {
    localStorage.setItem(key, now.toString());
    alert('Trial activated for ' + id);
  } else {
    alert('Trial already used for this GPT.');
  }
}

function subscribeToGPT(id) {
  // Placeholder for future Stripe integration
  alert('Subscribe flow for ' + id);
}

document.addEventListener('DOMContentLoaded', loadModels);
