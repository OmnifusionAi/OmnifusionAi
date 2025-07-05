async function loadModels() {
  const response = await fetch('data/models.json');
  const models = await response.json();
  renderModels(models);

  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');

  function applyFilters() {
    const selected = categoryFilter.value;
    const keyword = searchInput.value.toLowerCase();

    const filteredModels = models.filter(model => {
      const matchCategory = selected === 'all' || model.category === selected;
      const matchSearch =
        model.title.toLowerCase().includes(keyword) ||
        model.description.toLowerCase().includes(keyword);
      return matchCategory && matchSearch;
    });

    renderModels(filteredModels);
  }

  categoryFilter.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', applyFilters);

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
      ${model.trial ? '<p class="trial-badge">7-Day Free Trial Available</p>' : ''}
      <a href="${model.url}" target="_blank">Launch GPT</a>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', loadModels);
