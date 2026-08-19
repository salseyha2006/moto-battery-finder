// script.js
// Logic សម្រាប់ស្វែងរក + បង្ហាញទិន្នន័យអាគុយម៉ូតូ

const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const makeFilter = document.getElementById('makeFilter');
const resultsGrid = document.getElementById('resultsGrid');
const resultCount = document.getElementById('resultCount');
const noResults = document.getElementById('noResults');

const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

// ---------- បំពេញ Dropdown ម៉ាកម៉ូតូ ----------
function populateMakeFilter() {
  const makes = [...new Set(batteryData.map(item => item.make))].sort();
  makes.forEach(make => {
    const opt = document.createElement('option');
    opt.value = make;
    opt.textContent = make;
    makeFilter.appendChild(opt);
  });
}

// ---------- បង្កើត Card មួយ ----------
function createCard(item) {
  const card = document.createElement('div');
  card.className = 'battery-card';
  card.innerHTML = `
    <img src="${item.motorcycle_image}" alt="${item.make} ${item.model}" loading="lazy">
    <div class="battery-card-body">
      <span class="make-tag">${item.make}</span>
      <h3>${item.model}</h3>
      <div class="battery-code">🔋 ${item.battery_code}</div>
      <div class="dims">${item.dimensions_mm} mm | ${item.voltage} ${item.capacity}</div>
    </div>
  `;
  card.addEventListener('click', () => openModal(item));
  return card;
}

// ---------- បង្ហាញលទ្ធផល ----------
function renderResults(list) {
  resultsGrid.innerHTML = '';

  if (list.length === 0) {
    noResults.hidden = false;
    resultCount.textContent = '';
    return;
  }

  noResults.hidden = true;
  resultCount.textContent = `រកឃើញ ${list.length} លទ្ធផល`;

  const fragment = document.createDocumentFragment();
  list.forEach(item => fragment.appendChild(createCard(item)));
  resultsGrid.appendChild(fragment);
}

// ---------- តម្រង + ស្វែងរក ----------
function filterData() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedMake = makeFilter.value;

  const filtered = batteryData.filter(item => {
    const matchesQuery =
      query === '' ||
      item.model.toLowerCase().includes(query) ||
      item.make.toLowerCase().includes(query) ||
      item.battery_code.toLowerCase().includes(query);

    const matchesMake = selectedMake === '' || item.make === selectedMake;

    return matchesQuery && matchesMake;
  });

  renderResults(filtered);
}

// ---------- Modal លម្អិត ----------
function openModal(item) {
  modalBody.innerHTML = `
    <h2>${item.make} ${item.model}</h2>
    <p style="color:#666; font-size:0.85rem;">ឆ្នាំផលិត: ${item.year_range}</p>

    <div class="modal-images">
      <figure>
        <img src="${item.motorcycle_image}" alt="${item.model}">
        <figcaption>រូបភាពម៉ូតូ</figcaption>
      </figure>
      <figure>
        <img src="${item.battery_image}" alt="${item.battery_code}">
        <figcaption>រូបភាពអាគុយ</figcaption>
      </figure>
    </div>

    <table class="spec-table">
      <tr><td>លេខកូដអាគុយ</td><td>${item.battery_code}</td></tr>
      <tr><td>វ៉ុល (Voltage)</td><td>${item.voltage}</td></tr>
      <tr><td>ចំណុះ (Capacity)</td><td>${item.capacity}</td></tr>
      <tr><td>ទំហំ (L×W×H)</td><td>${item.dimensions_mm} mm</td></tr>
    </table>
  `;
  modal.hidden = false;
}

function hideModal() {
  modal.hidden = true;
}

// ---------- Event Listeners ----------
searchInput.addEventListener('input', filterData);
makeFilter.addEventListener('change', filterData);

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  filterData();
  searchInput.focus();
});

closeModal.addEventListener('click', hideModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) hideModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideModal();
});

// ---------- ចាប់ផ្តើម App ----------
populateMakeFilter();
renderResults(batteryData); // បង្ហាញទិន្នន័យទាំងអស់ពេលបើកដំបូង