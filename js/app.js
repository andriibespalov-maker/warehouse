import {ColumnVisibilityManager} from './column-visibility.js';
import {FilterManager} from './filters.js';

document.addEventListener('DOMContentLoaded', async () => {

  // --- 1. DOM Elements Reference ---
  let warehouseItems = [];
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tableSearchInput = document.getElementById('table-search');
  const clearSearchBtn = document.getElementById('clear-search');
  const selectAllCheckbox = document.getElementById('select-all');
  const bulkActionsBar = document.getElementById('bulk-actions-bar');
  const bulkArchiveBtn = document.getElementById('bulk-archive-btn');
  const selectedCountSpan = document.getElementById('selected-count');
  const cancelSelectionBtn = document.getElementById('cancel-selection');
  const visibleCountSpan = document.getElementById('visible-count');
  const totalWarehousesSpan = document.getElementById('total-warehouses-count');
  const emptyState = document.getElementById('empty-state');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');

  // Pagination & Page Size
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const paginationInfo = document.getElementById('pagination-info');
  const paginationControls = document.getElementById('pagination-controls');

  // Tab Badges
  const activeTabCount = document.getElementById('active-tab-count');
  const inactiveTabCount = document.getElementById('inactive-tab-count');
  const archivedTabCount = document.getElementById('archived-tab-count');

  // View Switcher Elements (Таблиця / Картки)
  const tableViewContainer = document.getElementById('table-view-container');
  const cardsViewContainer = document.getElementById('cards-view-container');
  const viewButtons = document.querySelectorAll('.view-btn');

  // Action Menu Dropdown & Modals
  const actionsDropdown = document.getElementById('actions-dropdown');
  const archiveWarehouseNameSpan = document.getElementById('archive-warehouse-name');
  const confirmArchiveBtn = document.getElementById('confirm-archive-btn');

  // Form Fields (Створення / Редагування складу)
  const formCreateWarehouse = document.getElementById('form-create-warehouse');
  const formWarehouseId = document.getElementById('form-warehouse-id');
  const modalWarehouseTitle = document.getElementById('modal-warehouse-title');
  const inputWarehouseName = document.getElementById('input-warehouse-name');
  const selectWarehouseCountry = document.getElementById('select-warehouse-country');
  const inputWarehouseCity = document.getElementById('input-warehouse-city');
  const inputWarehouseAddress = document.getElementById('input-warehouse-address');
  const selectWarehouseType = document.getElementById('select-warehouse-type');
  const selectWarehouseStatus = document.getElementById('select-warehouse-status');
  const formBtnArchive = document.getElementById('form-btn-archive');
  const formSubmitText = document.getElementById('form-submit-text');

  // Global State
  let warehousesData = [];
  let currentTab = 'active';
  let activeTargetWarehouseId = null;

  // Pagination State
  let currentPage = 1;
  let itemsPerPage = parseInt(itemsPerPageSelect?.value || '20', 10);

  const countryFlags = {
    'Китай': '🇨🇳',
    'Україна': '🇺🇦',
    'Польща': '🇵🇱',
    'Німеччина': '🇩🇪'
  };

  // --- Modal Helpers ---
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('[id^="modal-"]');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    });
  });

  function setupModalTrigger(triggerId, modalId) {
    const trigger = document.getElementById(triggerId);
    if (trigger) trigger.addEventListener('click', () => openModal(modalId));
  }

  // --- 2. Initialize Sub-Modules ---
  const columnManager = new ColumnVisibilityManager({
    tableSelector: '#warehouses-table',
    toggleSelector: '.column-toggle',
    resetBtnSelector: '#reset-columns-btn',
    archivedColSelector: '.archived-only-col'
  });
  columnManager.init();

  const filterManager = new FilterManager({
    openModal: openModal,
    closeModal: closeModal,
    onFilterChange: () => {
      currentPage = 1;
      filterRows();
    }
  });
  filterManager.init();

  // --- 3. Data Loading & Dynamic Rendering Engine ---
  async function loadWarehousesData() {
    try {
      const response = await fetch('../data/warehouses.json');
      if (!response.ok) throw new Error('Не вдалося завантажити warehouses.json');
      warehousesData = await response.json();
    } catch (error) {
      console.warn('Не вдалося завантажити файл warehouses.json, використовуються початкові дані за замовчуванням:', error);
      warehousesData = [
        {
          id: 'foshan',
          name: 'New FOSHAN',
          country: 'Китай',
          flag: '🇨🇳',
          city: 'Foshan',
          address: 'Warehouse address: No. 18 Logistics Park, Nanhai',
          type: 'Difreight',
          status: 'active',
          services: ['Зберігання', 'Упаковка'],
          specialNotes: 'Прийом за попереднім узгодженням',
          archivedDate: '-',
          link: 'warehouse/warehouse.html',
          isFulfillment: false
        },
        {
          id: 'kyiv',
          name: 'Склад Київ-1',
          country: 'Україна',
          flag: '🇺🇦',
          city: 'Київ',
          address: 'Україна, м. Київ, вул. Академіка Заболотного, 150А, корпус 3, склад 12',
          type: 'Difreight',
          status: 'active',
          services: ['Зберігання', 'Маркування', 'Сортування'],
          specialNotes: '',
          archivedDate: '-',
          link: null,
          isFulfillment: false
        },
        {
          id: 'poland',
          name: 'Склад Польща',
          country: 'Польща',
          flag: '🇵🇱',
          city: 'Варшава',
          address: 'ul. Magazynowa 5, Pruszków',
          type: 'Партнерський',
          status: 'inactive',
          services: ['Крос-докінг'],
          specialNotes: 'Тимчасово не приймає габарит',
          archivedDate: '-',
          link: null,
          isFulfillment: false
        }
      ];
    }
    renderAllWarehouses();
  }

  function renderAllWarehouses() {
    renderTableRows();
    renderCards();
    warehouseItems = Array.from(document.querySelectorAll('.warehouse-item'));
    columnManager.applyColumnVisibility();
    filterRows();
  }

  function renderTableRows() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;

    tableBody.innerHTML = warehousesData.map(wh => {
      const flag = wh.flag || countryFlags[wh.country] || '🌐';
      const servicesList = (wh.services || []).map(s =>
        `<span class="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium border border-slate-200">${s}</span>`
      ).join(' ');

      const nameHTML = wh.link
        ? `<a href="${wh.link}" id="link-${wh.id}" class="inline-flex items-center gap-2 text-slate-900 hover:text-brand-600 transition group/link">
           <i class="fa-solid fa-warehouse text-slate-400 group-hover/link:text-brand-600 transition"></i>
           <span class="hover:underline">${wh.name}</span>
         </a>`
        : `<div class="flex items-center gap-2">
           <i class="fa-solid fa-warehouse text-slate-400"></i> <span>${wh.name}</span>
         </div>`;

      return `
      <tr id="row-${wh.id}" data-id="${wh.id}" data-status="${wh.status}" data-country="${wh.country}" data-type="${wh.type}" data-name="${wh.name}" data-city="${wh.city}" data-address="${wh.address}" class="warehouse-row warehouse-item hover:bg-slate-50/80 transition group">
        <td class="p-3 text-center">
          <input type="checkbox" class="row-checkbox w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer" data-id="${wh.id}">
        </td>
        <td class="p-3 font-semibold text-slate-900">${nameHTML}</td>
        <td class="p-3"><span class="inline-flex items-center gap-1.5"><span class="text-base">${flag}</span> ${wh.country}</span></td>
        <td class="p-3 text-slate-500 whitespace-normal break-words font-normal">${wh.address}</td>
        <td class="p-3">
          <span class="px-2 py-0.5 ${wh.type === 'Difreight' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-700 border-slate-200'} rounded text-xs font-medium border">${wh.type}</span>
        </td>
        <td class="p-3"><div class="flex flex-wrap gap-1">${servicesList || '<span class="text-slate-400 text-xs">-</span>'}</div></td>

        <td class="p-3 max-w-[220px]">
  <div class="note-container">
    <p class="note-text line-clamp-2 text-slate-500 text-xs transition-all duration-200">
      ${wh.specialNotes || '-'}
    </p>
    <button type="button" class="toggle-note-btn text-brand-600 hover:underline text-[11px] font-semibold mt-0.5 block">
      ще...
    </button>
  </div>
</td>

        <td class="p-3 status-cell">${renderStatusBadge(wh.status)}</td>
        <td class="p-3 archived-date-cell archived-only-col hidden text-slate-500 text-xs">${wh.archivedDate || '-'}</td>
        <td class="p-3 text-center">
          <button class="action-menu-btn p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition" data-id="${wh.id}">
            <i class="fa-solid fa-ellipsis-vertical text-sm"></i>
          </button>
        </td>
      </tr>
    `;
    }).join('');
  }

  function renderCards() {
    const cardsContainer = document.getElementById('cards-view-container');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = warehousesData.map(wh => {
      const flag = wh.flag || countryFlags[wh.country] || '🌐';
      const servicesList = (wh.services || []).map(s =>
        `<span class="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium border border-slate-200">${s}</span>`
      ).join(' ');

      return `
        <div id="card-${wh.id}" data-id="${wh.id}" data-status="${wh.status}" data-country="${wh.country}" data-type="${wh.type}" data-name="${wh.name}" data-city="${wh.city}" data-address="${wh.address}" class="warehouse-card warehouse-item bg-white border border-slate-200 rounded-lg p-3 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between gap-2.5 relative">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
              <input type="checkbox" class="row-checkbox w-3.5 h-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer" data-id="${wh.id}">
              <div>
                ${wh.link
        ? `<a href="${wh.link}" class="font-bold text-slate-900 hover:text-brand-600 transition text-xs flex items-center gap-1.5">
                       <i class="fa-solid fa-warehouse text-slate-400 text-[11px]"></i> ${wh.name}
                     </a>`
        : `<h4 class="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                       <i class="fa-solid fa-warehouse text-slate-400 text-[11px]"></i> ${wh.name}
                     </h4>`
      }
                <p class="text-[11px] text-slate-500 mt-0.5">${flag} ${wh.country}, ${wh.city}</p>
              </div>
            </div>
            <button class="action-menu-btn p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition" data-id="${wh.id}">
              <i class="fa-solid fa-ellipsis-vertical text-xs"></i>
            </button>
          </div>

          <div class="space-y-1.5 text-[11px] text-slate-600 border-t border-b border-slate-100 py-2">
            <div class="flex justify-between items-center gap-1">
              <span class="text-slate-400">Адреса:</span>
              <span class="font-medium text-slate-700 whitespace-normal break-words text-right">${wh.address}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400">Тип:</span>
              <span class="px-1.5 py-0.5 ${wh.type === 'Difreight' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-700 border-slate-200'} rounded text-[10px] font-medium border">${wh.type}</span>
            </div>
          </div>
          <div class="space-y-1 mt-2">
            <div class="flex flex-wrap gap-1">${servicesList}</div>
            ${wh.specialNotes ? `<p class="text-[11px] text-slate-500 italic mt-1">${wh.specialNotes}</p>` : ''}
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-slate-400">Статус:</span>
            <span class="status-cell">${renderStatusBadge(wh.status)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- 4. Counts & Pagination Engine ---
  function updateCounts(matchingCount) {
    let activeCount = 0;
    let inactiveCount = 0;
    let archivedCount = 0;

    warehousesData.forEach(item => {
      if (item.status === 'active') activeCount++;
      if (item.status === 'inactive') inactiveCount++;
      if (item.status === 'archived') archivedCount++;
    });

    if (activeTabCount) activeTabCount.textContent = activeCount;
    if (inactiveTabCount) inactiveTabCount.textContent = inactiveCount;
    if (archivedTabCount) archivedTabCount.textContent = archivedCount;

    if (totalWarehousesSpan) {
      const word = matchingCount === 1 ? 'склад' : (matchingCount >= 2 && matchingCount <= 4 ? 'склади' : 'складів');
      totalWarehousesSpan.textContent = `${matchingCount} ${word}`;
    }
  }

  function renderPagination(totalItems) {
    if (!paginationInfo || !paginationControls) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

    paginationInfo.textContent = `Показано ${startIdx}-${endIdx} з ${totalItems}`;

    let controlsHTML = `
      <button type="button" class="page-prev-btn px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="fa-solid fa-chevron-left text-[10px]"></i> Назад
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      const isCurrent = i === currentPage;
      controlsHTML += `
        <button type="button" class="page-num-btn w-7 h-7 rounded-lg text-xs font-bold transition ${isCurrent ? 'bg-brand-600 text-white shadow-2xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}" data-page="${i}">
          ${i}
        </button>
      `;
    }

    controlsHTML += `
      <button type="button" class="page-next-btn px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold" ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}>
        Вперед <i class="fa-solid fa-chevron-right text-[10px]"></i>
      </button>
    `;

    paginationControls.innerHTML = controlsHTML;
  }

  paginationControls?.addEventListener('click', (e) => {
    const pageNumBtn = e.target.closest('.page-num-btn');
    const prevBtn = e.target.closest('.page-prev-btn');
    const nextBtn = e.target.closest('.page-next-btn');

    if (pageNumBtn) {
      currentPage = parseInt(pageNumBtn.getAttribute('data-page'), 10);
      filterRows();
    } else if (prevBtn && currentPage > 1) {
      currentPage--;
      filterRows();
    } else if (nextBtn) {
      currentPage++;
      filterRows();
    }
  });

  itemsPerPageSelect?.addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value, 10);
    currentPage = 1;
    filterRows();
  });

  // --- 5. Main Filtering Engine ---
  function filterRows() {
    const searchQuery = (tableSearchInput?.value || '').toLowerCase().trim();
    const matchingIds = new Set();

    warehousesData.forEach(item => {
      const matchesTab = (currentTab === item.status);
      const servicesText = (item.services || []).join(' ');
      const textToSearch = `${item.name} ${item.country} ${item.city} ${item.address} ${item.type} ${servicesText} ${item.specialNotes || ''}`.toLowerCase();
      const matchesSearch = !searchQuery || textToSearch.includes(searchQuery);
      const matchesAdvancedFilters = filterManager.matches(item);

      if (matchesTab && matchesSearch && matchesAdvancedFilters) {
        matchingIds.add(item.id);
      }
    });

    const matchingIdsArray = Array.from(matchingIds);
    const totalMatching = matchingIdsArray.length;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const visibleIdsOnPage = new Set(matchingIdsArray.slice(startIdx, endIdx));

    warehouseItems.forEach(item => {
      const id = item.getAttribute('data-id');
      if (visibleIdsOnPage.has(id)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
        const cb = item.querySelector('.row-checkbox');
        if (cb) cb.checked = false;
      }
    });

    if (visibleCountSpan) visibleCountSpan.textContent = totalMatching;

    columnManager.toggleArchivedColumns(currentTab === 'archived');
    updateCounts(totalMatching);
    renderPagination(totalMatching);
    updateBulkBar();

    if (emptyState) {
      if (totalMatching === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
      }
    }
  }

  // --- 6. Tab Switcher ---
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => {
        btn.classList.remove('bg-white', 'text-brand-600', 'shadow-2xs', 'font-semibold');
        btn.classList.add('text-slate-600', 'font-medium');
      });

      button.classList.add('bg-white', 'text-brand-600', 'shadow-2xs', 'font-semibold');
      button.classList.remove('text-slate-600', 'font-medium');

      currentTab = button.getAttribute('data-tab');
      currentPage = 1;
      filterRows();
    });
  });

  // --- 7. View Switcher ---
  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');

      viewButtons.forEach(b => {
        if (b.getAttribute('data-view') === view) {
          b.classList.add('bg-white', 'text-brand-600', 'shadow-2xs', 'font-semibold');
          b.classList.remove('text-slate-500', 'hover:text-slate-800');
        } else {
          b.classList.remove('bg-white', 'text-brand-600', 'shadow-2xs', 'font-semibold');
          b.classList.add('text-slate-500', 'hover:text-slate-800');
        }
      });

      if (view === 'cards') {
        tableViewContainer?.classList.add('hidden');
        cardsViewContainer?.classList.remove('hidden');
      } else {
        cardsViewContainer?.classList.add('hidden');
        tableViewContainer?.classList.remove('hidden');
      }

      filterRows();
    });
  });

  // --- 8. Search Input Events ---
  if (tableSearchInput) {
    tableSearchInput.addEventListener('input', (e) => {
      if (e.target.value) clearSearchBtn?.classList.remove('hidden');
      else clearSearchBtn?.classList.add('hidden');
      currentPage = 1;
      filterRows();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (tableSearchInput) tableSearchInput.value = '';
      clearSearchBtn.classList.add('hidden');
      currentPage = 1;
      filterRows();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (tableSearchInput) tableSearchInput.value = '';
      clearSearchBtn?.classList.add('hidden');
      filterManager.resetDrawerFilters();
    });
  }

  // --- 9. Actions Menu & Warehouse Form Logic ---
  document.addEventListener('click', (e) => {
    const selectBtn = e.target.closest('.custom-select-btn');
    const optionItem = e.target.closest('.custom-option');

    const btn = e.target.closest('.toggle-note-btn');

    if (btn) {
      const textElem = btn.previousElementSibling;
      const isExpanded = !textElem.classList.contains('line-clamp-2');

      if (isExpanded) {
        textElem.classList.add('line-clamp-2');
        btn.textContent = 'ще...';
      } else {
        textElem.classList.remove('line-clamp-2');
        btn.textContent = 'згорнути';
      }
      return;
    }

    // Перемикання банера меню
    if (selectBtn) {
      const wrapper = selectBtn.closest('.custom-select-wrapper');
      const menu = wrapper?.querySelector('.custom-select-menu');
      const arrow = wrapper?.querySelector('.custom-select-arrow');

      document.querySelectorAll('.custom-select-menu').forEach(m => {
        if (m !== menu) m.classList.add('hidden');
      });

      if (menu) {
        menu.classList.toggle('hidden');
        arrow?.classList.toggle('rotate-180', !menu.classList.contains('hidden'));
      }
      return;
    }

    // Вибір значення з меню
    if (optionItem) {
      const wrapper = optionItem.closest('.custom-select-wrapper');
      const hiddenInput = wrapper?.querySelector('input[type="hidden"]');
      const menu = wrapper?.querySelector('.custom-select-menu');
      const arrow = wrapper?.querySelector('.custom-select-arrow');
      const val = optionItem.getAttribute('data-value');

      if (hiddenInput && val) {
        updateCustomDropdown(hiddenInput.id, val);
      }

      menu?.classList.add('hidden');
      arrow?.classList.remove('rotate-180');
      return;
    }

    // Закриваємо меню при кліку поза його межами
    if (!e.target.closest('.custom-select-wrapper')) {
      document.querySelectorAll('.custom-select-menu').forEach(m => m.classList.add('hidden'));
      document.querySelectorAll('.custom-select-arrow').forEach(a => a.classList.remove('rotate-180'));
    }
  });

  actionsDropdown?.querySelectorAll('[data-action]').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      actionsDropdown.classList.add('hidden');

      if (!activeTargetWarehouseId) return;

      if (action === 'edit') {
        openEditWarehouseForm(activeTargetWarehouseId);
      } else if (action === 'open-archive') {
        openArchiveModal(activeTargetWarehouseId);
      } else if (action === 'unarchive') {
        updateWarehouseStatus(activeTargetWarehouseId, 'active');
      }
    });
  });

  function getWarehouseProp(id, prop) {
    const item = warehousesData.find(w => w.id === id);
    return item ? item[prop] : '';
  }

  // Перемикання обов'язковості поля "Об'єм складу" залежно від типу
  function toggleVolumeRequirement(type) {
    const inputVolume = document.getElementById('input-warehouse-volume');
    const volumeStar = document.getElementById('volume-required-star');
    const isRequired = (type === 'Власні');

    if (inputVolume) {
      inputVolume.required = isRequired;
    }
    if (volumeStar) {
      volumeStar.classList.toggle('hidden', !isRequired);
    }
  }

// Слухач події зміни значення у select
  selectWarehouseType?.addEventListener('change', (e) => {
    toggleVolumeRequirement(e.target.value);
  });


  document.getElementById('btn-create')?.addEventListener('click', () => {
    activeTargetWarehouseId = null;
    if (formWarehouseId) formWarehouseId.value = '';
    if (modalWarehouseTitle) modalWarehouseTitle.textContent = 'Створити склад';
    if (formSubmitText) formSubmitText.textContent = 'Створити склад';

    // Встановлюємо дефолтне значення "Власні"
    updateCustomDropdown('select-warehouse-type', 'Власні');

    const inputVolume = document.getElementById('input-warehouse-volume');
    if (inputVolume) inputVolume.value = '';

    if (selectWarehouseStatus) selectWarehouseStatus.value = 'active';

    openModal('modal-create');
  });

  const checkIsConsolidation = document.getElementById('check-is-consolidation');
  const instructionsContainer = document.getElementById('shipping-instructions-container');
  const instructionsInput = document.getElementById('input-shipping-instructions');

  function updateInstructionsVisibility() {
    if (!instructionsContainer || !instructionsInput) return;

    const isConsolidation = checkIsConsolidation?.checked || false;
    const warehouseType = selectWarehouseType?.value;
    const isPartner = (warehouseType === 'Партнерський' || warehouseType === 'Партнерські');

    // Показуємо інструкцію, якщо це склад консолідації АБО партнерський склад
    if (isConsolidation || isPartner) {
      instructionsContainer.classList.remove('hidden');
      instructionsInput.required = true;
    } else {
      instructionsContainer.classList.add('hidden');
      instructionsInput.required = false;
    }
  }

// Слухач зміни стану галочки
  checkIsConsolidation?.addEventListener('change', (e) => {
    updateInstructionsVisibility()
  });

  function openEditWarehouseForm(id) {
    const item = warehousesData.find(w => w.id === id);
    if (!item) return;

    // 1. Записуємо ID та оновлюємо текстовки модалки
    if (formWarehouseId) formWarehouseId.value = item.id;
    if (modalWarehouseTitle) modalWarehouseTitle.textContent = 'Редагувати склад';
    if (formSubmitText) formSubmitText.textContent = 'Зберегти зміни';

    // 2. Заповнюємо основні поля
    const nameInput = document.getElementById('input-warehouse-name');
    if (nameInput) nameInput.value = item.name || '';

    const contractorInput = document.getElementById('input-contractor-search');
    if (contractorInput) contractorInput.value = item.contractor || '';

    const typeValue = item.type || 'Власні';
    updateCustomDropdown('select-warehouse-type', typeValue);

    const volumeInput = document.getElementById('input-warehouse-volume');
    if (volumeInput) volumeInput.value = item.volume || '';

    if (selectWarehouseStatus) selectWarehouseStatus.value = item.status || 'active';

    // 3. Заповнюємо адресу
    const countrySelect = document.getElementById('select-warehouse-country');
    if (countrySelect) countrySelect.value = item.country || '';

    const addressInput = document.getElementById('input-warehouse-address');
    if (addressInput) addressInput.value = item.address || '';

    // 4. Правила прийому та примітки
    const rulesInput = document.getElementById('input-warehouse-rules');
    if (rulesInput) rulesInput.value = item.workRules || '';

    const notesInput = document.getElementById('input-warehouse-notes');
    if (notesInput) notesInput.value = item.specialNotes || '';

    // 5. Оновлення стану складу консолідації та інструкцій
    const isConsolidation = !!item.isConsolidation;
    if (checkIsConsolidation) checkIsConsolidation.checked = isConsolidation;
    updateInstructionsVisibility();

    if (instructionsInput) {
      instructionsInput.value = item.shippingInstructions || '';
    }

    // 6. Відновлюємо обрані послуги (чекбокси)
    document.querySelectorAll('.service-checkbox').forEach(cb => {
      cb.checked = Array.isArray(item.services) && item.services.includes(cb.value);
    });

    // 7. Перерендеримо контакти
    const contactsContainer = document.getElementById('contacts-repeater-container');
    if (contactsContainer) contactsContainer.innerHTML = '';
    if (Array.isArray(item.contacts) && item.contacts.length > 0) {
      item.contacts.forEach(c => createContactRow(c));
    }

    // 8. Перерендеримо тарифи
    const tariffsContainer = document.getElementById('tariffs-repeater-container');
    if (tariffsContainer) tariffsContainer.innerHTML = '';
    if (Array.isArray(item.tariffs) && item.tariffs.length > 0) {
      item.tariffs.forEach(t => createTariffRow(t));
    }

    // 9. ВІДКРИВАЄМО МОДАЛЬНЕ ВІКНО
    openModal('modal-create');
  }

  formCreateWarehouse?.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = formWarehouseId?.value;
    const newName = inputWarehouseName?.value.trim();
    const newCountry = selectWarehouseCountry?.value;
    const newAddress = inputWarehouseAddress?.value.trim();
    const newType = selectWarehouseType?.value;
    const newStatus = selectWarehouseStatus?.value;
    const newVolume = document.getElementById('input-warehouse-volume')?.value || '';
    const isFulfillment = document.getElementById('fulfillment-check')?.checked || false;
    const specialNotes = document.getElementById('input-warehouse-notes')?.value.trim() || '';
    const selectedServices = Array.from(document.querySelectorAll('.service-checkbox:checked')).map(cb => cb.value);

    if (id) {
      const index = warehousesData.findIndex(w => w.id === id);
      if (index !== -1) {
        warehousesData[index] = {
          ...warehousesData[index],
          name: newName || warehousesData[index].name,
          country: newCountry || warehousesData[index].country,
          flag: countryFlags[newCountry] || warehousesData[index].flag || '🌐',
          address: newAddress || warehousesData[index].address,
          type: newType || warehousesData[index].type,
          volume: newVolume,
          services: selectedServices,
          specialNotes: specialNotes,
          status: newStatus || warehousesData[index].status,
          isFulfillment: isFulfillment
        };
      }
    } else {
      const newWarehouse = {
        id: `wh-${Date.now()}`,
        name: newName,
        country: newCountry,
        flag: countryFlags[newCountry] || '🌐',
        address: newAddress,
        type: newType,
        volume: newVolume,
        services: selectedServices,
        specialNotes: specialNotes,
        status: newStatus,
        archivedDate: '-',
        link: null,
        isFulfillment: isFulfillment
      };
      warehousesData.unshift(newWarehouse);
    }

    closeModal('modal-create');
    renderAllWarehouses();
  });

  function updateWarehouseStatus(id, newStatus) {
    const todayStr = new Date().toLocaleDateString('uk-UA', {day: '2-digit', month: '2-digit', year: 'numeric'});
    const item = warehousesData.find(w => w.id === id);
    if (item) {
      item.status = newStatus;
      item.archivedDate = newStatus === 'archived' ? todayStr : '-';
    }
    renderAllWarehouses();
  }

  function renderStatusBadge(status) {
    if (status === 'active') {
      return `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Активний</span>`;
    } else if (status === 'inactive') {
      return `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Неактивний</span>`;
    } else if (status === 'archived') {
      return `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Заархівований</span>`;
    }
    return '';
  }

  function openArchiveModal(id) {
    activeTargetWarehouseId = id;
    const warehouseName = getWarehouseProp(id, 'name');
    if (archiveWarehouseNameSpan) archiveWarehouseNameSpan.textContent = `"${warehouseName}"`;

    openModal('modal-archive');
  }

  confirmArchiveBtn?.addEventListener('click', () => {
    if (activeTargetWarehouseId) {
      updateWarehouseStatus(activeTargetWarehouseId, 'archived');
      closeModal('modal-archive');
    }
  });

  // --- 10. Selection & Bulk Bar Logic ---
  function updateBulkBar() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    const checkedCount = new Set(Array.from(checkedBoxes).map(cb => cb.getAttribute('data-id'))).size;

    if (selectedCountSpan) selectedCountSpan.textContent = checkedCount;

    if (checkedCount > 0) bulkActionsBar?.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    else bulkActionsBar?.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
  }

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      document.querySelectorAll('.row-checkbox').forEach(cb => {
        const parentItem = cb.closest('.warehouse-item');
        if (parentItem && !parentItem.classList.contains('hidden')) cb.checked = isChecked;
      });
      updateBulkBar();
    });
  }

  function addSocialLink(contactId, type = 'Telegram', value = '') {
    const container = document.getElementById(`socials-container-${contactId}`);
    if (!container) return;

    const socialId = `social-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const socialHtml = `
    <div id="${socialId}" class="social-item flex items-center gap-2">
      <select class="social-type bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 w-32 shrink-0 font-medium">
        <option value="Telegram" ${type === 'Telegram' ? 'selected' : ''}>Telegram</option>
        <option value="Viber" ${type === 'Viber' ? 'selected' : ''}>Viber</option>
        <option value="WhatsApp" ${type === 'WhatsApp' ? 'selected' : ''}>WhatsApp</option>
        <option value="WeChat" ${type === 'WeChat' ? 'selected' : ''}>WeChat</option>
        <option value="LinkedIn" ${type === 'LinkedIn' ? 'selected' : ''}>LinkedIn</option>
        <option value="Інше" ${type === 'Інше' ? 'selected' : ''}>Інше</option>
      </select>
      <input type="text" placeholder="@username або посилання" value="${value}" class="social-value flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
      <button type="button" onclick="document.getElementById('${socialId}').remove()" class="text-slate-300 hover:text-rose-500 p-1 transition cursor-pointer">
        <i class="fa-solid fa-trash-can text-xs"></i>
      </button>
    </div>
  `;
    container.insertAdjacentHTML('beforeend', socialHtml);
  }

  // 1. Динамічне додавання контактних осіб
  function createContactRow(contact = {}) {
    const container = document.getElementById('contacts-repeater-container');
    if (!container) return;

    const contactId = `contact-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const html = `
    <div id="${contactId}" class="contact-card bg-white p-3.5 rounded-xl border border-slate-200 space-y-3 relative shadow-2xs">
      <button type="button" onclick="document.getElementById('${contactId}').remove()"
              class="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити контакт">
        <i class="fa-solid fa-xmark text-sm"></i>
      </button>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pr-6">
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Повне ім'я</label>
          <input type="text" placeholder="Іван Іванов" value="${contact.fullName || ''}" class="contact-fullname w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Електронна пошта</label>
          <input type="email" placeholder="example@mail.com" value="${contact.email || ''}" class="contact-email w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Телефон</label>
          <input type="tel" placeholder="+380..." value="${contact.phone || ''}" class="contact-phone w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
        </div>
      </div>

      <!-- Блок динамічних соцмереж -->
      <div class="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold text-slate-600">Соціальні мережі та месенджери</span>
          <button type="button" onclick="addSocialLink('${contactId}')" class="text-[11px] text-brand-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer">
            <i class="fa-solid fa-plus text-[9px]"></i> Додати соцмережу
          </button>
        </div>
        <div id="socials-container-${contactId}" class="space-y-1.5">
          <!-- Соцмережі будуть додаватися сюди -->
        </div>
      </div>
    </div>
  `;

    container.insertAdjacentHTML('beforeend', html);

    // Якщо є передані соцмережі — додаємо їх, інакше створюємо одне порожнє поле
    if (Array.isArray(contact.socials) && contact.socials.length > 0) {
      contact.socials.forEach(s => addSocialLink(contactId, s.type, s.value));
    } else {
      addSocialLink(contactId);
    }
  }

// 2. Динамічне додавання тарифів
  function createTariffRow(tariff = {}) {
    const container = document.getElementById('tariffs-repeater-container');
    if (!container) return;

    const tariffId = `tariff-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const html = `
    <div id="${tariffId}" class="tariff-card bg-white p-3.5 rounded-xl border border-slate-200 space-y-3 relative shadow-2xs">
      <button type="button" onclick="document.getElementById('${tariffId}').remove()"
              class="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити тариф">
        <i class="fa-solid fa-xmark text-sm"></i>
      </button>

      <!-- Верхній рядок: Послуга, Ціна, Валюта, Стандарт -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pr-6">
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Послуга / Сервіс</label>
          <select class="tariff-service w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium">
            <option value="Зберігання" ${tariff.service === 'Зберігання' ? 'selected' : ''}>Зберігання</option>
            <option value="Упаковка" ${tariff.service === 'Упаковка' ? 'selected' : ''}>Упаковка</option>
            <option value="Маркування" ${tariff.service === 'Маркування' ? 'selected' : ''}>Маркування</option>
            <option value="Сортування" ${tariff.service === 'Сортування' ? 'selected' : ''}>Сортування</option>
            <option value="Крос-докінг" ${tariff.service === 'Крос-докінг' ? 'selected' : ''}>Крос-докінг</option>
            <option value="Комплектація" ${tariff.service === 'Комплектація' ? 'selected' : ''}>Комплектація</option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ціна за одиницю</label>
          <input type="number" step="0.01" placeholder="0.00" value="${tariff.unitPrice || ''}" class="tariff-price w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Валюта</label>
          <select class="tariff-currency w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium">
            <option value="USD" ${tariff.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
            <option value="EUR" ${tariff.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
            <option value="UAH" ${tariff.currency === 'UAH' ? 'selected' : ''}>UAH (₴)</option>
            <option value="CNY" ${tariff.currency === 'CNY' ? 'selected' : ''}>CNY (¥)</option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Стандарт розрахунку</label>
          <select class="tariff-standard w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium">
            <option value="per CBM" ${tariff.standard === 'per CBM' ? 'selected' : ''}>за куб. м (per CBM)</option>
            <option value="per CBM per day" ${tariff.standard === 'per CBM per day' ? 'selected' : ''}>за куб. м на день (per CBM/day)</option>
            <option value="per order" ${tariff.standard === 'per order' ? 'selected' : ''}>за замовлення (per order)</option>
            <option value="per kg" ${tariff.standard === 'per kg' ? 'selected' : ''}>за кг (per kg)</option>
            <option value="per pallet" ${tariff.standard === 'per pallet' ? 'selected' : ''}>за палету (per pallet)</option>
          </select>
        </div>
      </div>

      <!-- Другий рядок: Період дії (з ... до) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Дійсно з</label>
          <input type="date" value="${tariff.dateFrom || ''}" class="tariff-date-from w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Дійсно до</label>
          <input type="date" value="${tariff.dateTo || ''}" class="tariff-date-to w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
        </div>
      </div>

      <!-- Третій рядок: Примітка / Додаткова інформація (Textarea) -->
      <div>
        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Примітка / Додаткова інформація</label>
        <textarea rows="2" placeholder="Опишіть особливості тарифу, знижки при об'ємах, додаткові умови..."
                  class="tariff-remark w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition">${tariff.remark || ''}</textarea>
      </div>
    </div>
  `;

    container.insertAdjacentHTML('beforeend', html);
  }

  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('row-checkbox')) {
      const id = e.target.getAttribute('data-id');
      const isChecked = e.target.checked;
      document.querySelectorAll(`.row-checkbox[data-id="${id}"]`).forEach(cb => cb.checked = isChecked);
      updateBulkBar();
    }
  });

  document.getElementById('btn-add-contact')?.addEventListener('click', () => createContactRow());
  document.getElementById('btn-add-tariff')?.addEventListener('click', () => createTariffRow());

  function updateCustomDropdown(inputId, value) {
    const hiddenInput = document.getElementById(inputId);
    if (!hiddenInput) return;

    hiddenInput.value = value;
    const wrapper = hiddenInput.closest('.custom-select-wrapper');
    if (!wrapper) return;

    let targetOption = wrapper.querySelector(`.custom-option[data-value="${value}"]`);

    if (!targetOption) {
      const allOptions = wrapper.querySelectorAll('.custom-option');
      targetOption = Array.from(allOptions).find(opt => opt.innerText.includes(value));
    }

    if (targetOption) {
      const selectedContent = wrapper.querySelector('.selected-content');
      const optionContent = targetOption.querySelector('.option-content');
      if (selectedContent && optionContent) {
        selectedContent.innerHTML = optionContent.innerHTML;
      }

      wrapper.querySelectorAll('.custom-option').forEach(opt => {
        opt.classList.remove('bg-indigo-50', 'text-indigo-700');
      });
      targetOption.classList.add('bg-indigo-50', 'text-indigo-700');
    }

    // Якщо оновлюється тип складу — перемикаємо обов'язковість поля Об'єм
    if (inputId === 'select-warehouse-type') {
      toggleVolumeRequirement(value);
      updateInstructionsVisibility(); // <--- ДОДАНО ТУТ
    }
  }

  // --- 3. Збір усіх даних з форми для відправки ---

  function collectWarehouseFormData() {
    // Збір графіку роботи
    const schedule = {};
    const isConsolidation = checkIsConsolidation?.checked || false;

    document.querySelectorAll('#working-schedule-grid [data-day]').forEach(dayElem => {
      const day = dayElem.getAttribute('data-day');
      const isOff = dayElem.querySelector('.schedule-off')?.checked;
      const time = dayElem.querySelector('.schedule-time')?.value || '';
      schedule[day] = isOff ? 'Вихідний' : time;
    });

    // Збір контактів
    const contacts = Array.from(document.querySelectorAll('.contact-card')).map(card => {
      const socials = Array.from(card.querySelectorAll('.social-item')).map(s => ({
        type: s.querySelector('.social-type')?.value,
        value: s.querySelector('.social-value')?.value.trim()
      })).filter(s => s.value);

      return {
        fullName: card.querySelector('.contact-fullname')?.value.trim(),
        email: card.querySelector('.contact-email')?.value.trim(),
        phone: card.querySelector('.contact-phone')?.value.trim(),
        socials: socials
      };
    }).filter(c => c.fullName || c.phone || c.email || c.socials.length > 0);

    // Збір тарифів
    const tariffs = Array.from(document.querySelectorAll('.tariff-card')).map(card => ({
      service: card.querySelector('.tariff-service')?.value,
      unitPrice: card.querySelector('.tariff-price')?.value,
      currency: card.querySelector('.tariff-currency')?.value,
      standard: card.querySelector('.tariff-standard')?.value,
      dateFrom: card.querySelector('.tariff-date-from')?.value,
      dateTo: card.querySelector('.tariff-date-to')?.value,
      remark: card.querySelector('.tariff-remark')?.value.trim()
    })).filter(t => t.unitPrice);

    return {
      name: document.getElementById('input-warehouse-name')?.value.trim(),
      contractor: document.getElementById('input-contractor-search')?.value.trim(),
      volume: document.getElementById('input-warehouse-volume')?.value || '',
      address: {
        country: document.getElementById('select-warehouse-country')?.value,
        city: document.getElementById('input-warehouse-city')?.value.trim(),
        street: document.getElementById('input-warehouse-street')?.value.trim()
      },
      isConsolidation: isConsolidation,
      services: Array.from(document.querySelectorAll('.service-checkbox:checked')).map(cb => cb.value),
      workRules: document.getElementById('input-warehouse-rules')?.value.trim(),
      schedule: schedule,
      contacts: contacts,
      tariffs: tariffs,
      shippingInstructions: document.getElementById('input-shipping-instructions')?.value.trim(),
      specialNotes: document.getElementById('input-warehouse-notes')?.value.trim()
    };
  }

  document.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('.action-menu-btn');

    if (actionBtn) {
      e.stopPropagation();
      activeTargetWarehouseId = actionBtn.getAttribute('data-id');

      // 1. Знаходимо поточний склад за його ID
      const warehouse = warehousesData.find(w => w.id === activeTargetWarehouseId);

      if (actionsDropdown && warehouse) {
        // 2. Отримуємо кнопки дій
        const btnArchive = actionsDropdown.querySelector('[data-action="open-archive"]');
        const btnUnarchive = actionsDropdown.querySelector('[data-action="unarchive"]');

        // 3. Якщо склад заархівований — показуємо "Відновити з архіву", ховаємо "Архівувати"
        if (warehouse.status === 'archived') {
          btnArchive?.classList.add('hidden');
          btnUnarchive?.classList.remove('hidden');
        } else {
          // Якщо активний або неактивний — навпаки
          btnArchive?.classList.remove('hidden');
          btnUnarchive?.classList.add('hidden');
        }

        // 4. Позиціонування випадаючого меню поруч із кнопкою
        const rect = actionBtn.getBoundingClientRect();
        actionsDropdown.style.top = `${rect.bottom + window.scrollY + 4}px`;
        actionsDropdown.style.left = `${rect.left + window.scrollX - 140}px`;

        actionsDropdown.classList.remove('hidden');
      }
      return;
    }

    // Закриття меню при кліку в будь-яку іншу область екрана
    if (actionsDropdown && !e.target.closest('#actions-dropdown')) {
      actionsDropdown.classList.add('hidden');
    }
  });

// Керування вихідними днями в графіку роботи
  document.querySelectorAll('.schedule-off').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const parent = e.target.closest('[data-day]');
      const timeInput = parent?.querySelector('.schedule-time');
      if (timeInput) {
        timeInput.disabled = e.target.checked;
        if (e.target.checked) timeInput.value = '';
      }
    });
  });

  function collectFormData() {
    // Збір графіка роботи
    const schedule = {};
    document.querySelectorAll('#working-schedule-grid [data-day]').forEach(dayElem => {
      const day = dayElem.getAttribute('data-day');
      const isOff = dayElem.querySelector('.schedule-off')?.checked;
      const time = dayElem.querySelector('.schedule-time')?.value || '';
      schedule[day] = isOff ? 'Вихідний' : time;
    });

    // Збір контактерів
    const contacts = Array.from(document.querySelectorAll('.contact-item')).map(item => ({
      fullName: item.querySelector('.contact-fullname')?.value.trim(),
      email: item.querySelector('.contact-email')?.value.trim(),
      phone: item.querySelector('.contact-phone')?.value.trim(),
      socials: item.querySelector('.contact-socials')?.value.trim()
    })).filter(c => c.fullName || c.phone || c.email);

    // Збір тарифів
    const tariffs = Array.from(document.querySelectorAll('.tariff-item')).map(item => ({
      service: item.querySelector('.tariff-service')?.value,
      unitPrice: item.querySelector('.tariff-price')?.value,
      currency: item.querySelector('.tariff-currency')?.value,
      standard: item.querySelector('.tariff-standard')?.value,
      remark: item.querySelector('.tariff-remark')?.value.trim(),
      dateFrom: item.querySelector('.tariff-date-from')?.value,
      dateTo: item.querySelector('.tariff-date-to')?.value
    })).filter(t => t.unitPrice);

    return {
      name: document.getElementById('input-warehouse-name')?.value.trim(),
      contractor: document.getElementById('input-contractor-search')?.value.trim(),
      address: {
        country: document.getElementById('select-warehouse-country')?.value,
        city: document.getElementById('input-warehouse-city')?.value.trim(),
        street: document.getElementById('input-warehouse-street')?.value.trim()
      },
      services: Array.from(document.querySelectorAll('.service-checkbox:checked')).map(cb => cb.value),
      workRules: document.getElementById('input-warehouse-rules')?.value.trim(),
      schedule: schedule,
      contacts: contacts,
      tariffs: tariffs,
      shippingInstructions: document.getElementById('input-shipping-instructions')?.value.trim(),
      specialNotes: document.getElementById('input-warehouse-notes')?.value.trim()
    };
  }

  if (cancelSelectionBtn) {
    cancelSelectionBtn.addEventListener('click', () => {
      document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
      if (selectAllCheckbox) selectAllCheckbox.checked = false;
      updateBulkBar();
    });
  }

  bulkArchiveBtn?.addEventListener('click', () => {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    const selectedIds = new Set(Array.from(checkedBoxes).map(cb => cb.getAttribute('data-id')));

    selectedIds.forEach(id => {
      if (id) updateWarehouseStatus(id, 'archived');
    });

    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
    if (selectAllCheckbox) selectAllCheckbox.checked = false;
    renderAllWarehouses();
  });

  // --- 11. Triggers Setup ---
  setupModalTrigger('btn-settings', 'modal-settings');
  setupModalTrigger('btn-filter', 'modal-filter');

  // --- 12. Initial Run ---
  await loadWarehousesData();
});
