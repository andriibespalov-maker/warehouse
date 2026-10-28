/**
 * Модуль керування розширеними фільтрами, мультиселектами та шаблонами
 */
export class FilterManager {
  constructor(options = {}) {
    this.onFilterChange = options.onFilterChange || null;
    this.openModal = options.openModal || null;
    this.closeModal = options.closeModal || null;

    this.filterTemplates = [
      {
        id: 'tpl-china',
        name: 'Склади в Китаї',
        filters: { country: ['Китай'], countryOp: 'equals', type: ['Difreight'], typeOp: 'equals' }
      }
    ];

    this.activeTemplateId = null;
    this.editingTemplateId = null;

    this.availableFilterFields = [
      { id: 'name', label: 'Назва', icon: 'fa-font' },
      { id: 'country', label: 'Країна', icon: 'fa-earth-europe' },
      { id: 'city', label: 'Місто', icon: 'fa-city' },
      { id: 'address', label: 'Адреса', icon: 'fa-location-dot' },
      { id: 'type', label: 'Тип', icon: 'fa-boxes-stacked' },
      { id: 'status', label: 'Статус', icon: 'fa-toggle-on' }
    ];

    this.fieldHTMLMap = {
      name: `
        <div class="filter-row flex items-center gap-2 bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/60" data-field="name">
          <span class="w-20 text-xs font-semibold text-slate-700 shrink-0">Назва:</span>
          <div class="relative flex-1">
            <input type="text" id="filter-name" placeholder="Введіть назву..." class="filter-input w-full bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition">
            <button type="button" class="clear-single-val-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 text-xs hidden cursor-pointer" title="Очистити поле">&times;</button>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </div>`,
      country: `
        <div class="filter-row flex items-center gap-2 bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/60" data-field="country">
          <span class="w-20 text-xs font-semibold text-slate-700 shrink-0">Країна:</span>
          <select id="operator-country" class="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-brand-500 cursor-pointer shrink-0">
            <option value="equals">дорівнює</option>
            <option value="not_equals">не дорівнює</option>
          </select>
          <div class="relative flex-1">
            <button type="button" class="multiselect-toggle-btn w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-left flex justify-between items-center transition focus:outline-none focus:border-brand-500 cursor-pointer" data-field="country">
              <span id="multiselect-btn-text-country" class="text-slate-400 truncate">Обрати значення...</span>
              <i class="fa-solid fa-chevron-down text-slate-400 text-[10px]"></i>
            </button>
            <div id="multiselect-menu-country" class="multiselect-menu hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 space-y-1">
              <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                <input type="checkbox" value="Китай" class="multiselect-cb rounded border-slate-300 text-brand-600 focus:ring-brand-500" data-field="country"> Китай
              </label>
              <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                <input type="checkbox" value="Україна" class="multiselect-cb rounded border-slate-300 text-brand-600 focus:ring-brand-500" data-field="country"> Україна
              </label>
              <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                <input type="checkbox" value="Польща" class="multiselect-cb rounded border-slate-300 text-brand-600 focus:ring-brand-500" data-field="country"> Польща
              </label>
            </div>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </div>`,
      city: `
        <div class="filter-row flex items-center gap-2 bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/60" data-field="city">
          <span class="w-20 text-xs font-semibold text-slate-700 shrink-0">Місто:</span>
          <div class="relative flex-1">
            <input type="text" id="filter-city" placeholder="Введіть місто..." class="filter-input w-full bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition">
            <button type="button" class="clear-single-val-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 text-xs hidden cursor-pointer" title="Очистити поле">&times;</button>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </div>`,
      address: `
        <div class="filter-row flex items-center gap-2 bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/60" data-field="address">
          <span class="w-20 text-xs font-semibold text-slate-700 shrink-0">Адреса:</span>
          <div class="relative flex-1">
            <input type="text" id="filter-address" placeholder="Введіть адресу..." class="filter-input w-full bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition">
            <button type="button" class="clear-single-val-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 text-xs hidden cursor-pointer" title="Очистити поле">&times;</button>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </div>`,
      type: `
        <div class="filter-row flex items-center gap-2 bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/60" data-field="type">
          <span class="w-20 text-xs font-semibold text-slate-700 shrink-0">Тип:</span>
          <select id="operator-type" class="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-brand-500 cursor-pointer shrink-0">
            <option value="equals">дорівнює</option>
            <option value="not_equals">не дорівнює</option>
          </select>
          <div class="relative flex-1">
            <button type="button" class="multiselect-toggle-btn w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-left flex justify-between items-center transition focus:outline-none focus:border-brand-500 cursor-pointer" data-field="type">
              <span id="multiselect-btn-text-type" class="text-slate-400 truncate">Обрати значення...</span>
              <i class="fa-solid fa-chevron-down text-slate-400 text-[10px]"></i>
            </button>
            <div id="multiselect-menu-type" class="multiselect-menu hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 space-y-1">
              <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                <input type="checkbox" value="Difreight" class="multiselect-cb rounded border-slate-300 text-brand-600 focus:ring-brand-500" data-field="type"> Difreight
              </label>
              <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                <input type="checkbox" value="Партнерський" class="multiselect-cb rounded border-slate-300 text-brand-600 focus:ring-brand-500" data-field="type"> Партнерський
              </label>
            </div>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </div>`,
      status: `
        <div class="filter-row flex items-center gap-2 bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/60" data-field="status">
          <span class="w-20 text-xs font-semibold text-slate-700 shrink-0">Статус:</span>
          <select id="operator-status" class="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-brand-500 cursor-pointer shrink-0">
            <option value="equals">дорівнює</option>
            <option value="not_equals">не дорівнює</option>
          </select>
          <div class="relative flex-1">
            <button type="button" class="multiselect-toggle-btn w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-left flex justify-between items-center transition focus:outline-none focus:border-brand-500 cursor-pointer" data-field="status">
              <span id="multiselect-btn-text-status" class="text-slate-400 truncate">Обрати значення...</span>
              <i class="fa-solid fa-chevron-down text-slate-400 text-[10px]"></i>
            </button>
            <div id="multiselect-menu-status" class="multiselect-menu hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 space-y-1">
              <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                <input type="checkbox" value="active" class="multiselect-cb rounded border-slate-300 text-brand-600 focus:ring-brand-500" data-field="status"> Активний
              </label>
              <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                <input type="checkbox" value="inactive" class="multiselect-cb rounded border-slate-300 text-brand-600 focus:ring-brand-500" data-field="status"> Неактивний
              </label>
              <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                <input type="checkbox" value="archived" class="multiselect-cb rounded border-slate-300 text-brand-600 focus:ring-brand-500" data-field="status"> Заархівований
              </label>
            </div>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </div>`
    };
  }

  init() {
    this.bindEvents();
    this.renderTemplatesList();
  }

  // --- Multiselect Helpers ---
  getSelectedMultiselectValues(fieldId) {
    const checkboxes = document.querySelectorAll(`.multiselect-cb[data-field="${fieldId}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
  }

  setMultiselectValues(fieldId, values = []) {
    const checkboxes = document.querySelectorAll(`.multiselect-cb[data-field="${fieldId}"]`);
    checkboxes.forEach(cb => {
      cb.checked = values.includes(cb.value);
    });
    this.updateMultiselectButtonText(fieldId);
  }

  updateMultiselectButtonText(fieldId) {
    const btnText = document.getElementById(`multiselect-btn-text-${fieldId}`);
    if (!btnText) return;

    const selected = this.getSelectedMultiselectValues(fieldId);
    if (selected.length === 0) {
      btnText.textContent = 'Обрати значення...';
      btnText.classList.add('text-slate-400');
      btnText.classList.remove('text-slate-800', 'font-semibold');
    } else if (selected.length === 1) {
      btnText.textContent = selected[0];
      btnText.classList.remove('text-slate-400');
      btnText.classList.add('text-slate-800', 'font-semibold');
    } else {
      btnText.textContent = `Обрано (${selected.length})`;
      btnText.classList.remove('text-slate-400');
      btnText.classList.add('text-slate-800', 'font-semibold');
    }
  }

  // Завантаження фільтрів шаблону в поля шторки
  loadTemplateToDrawer(tpl) {
    if (!tpl || !tpl.filters) return;

    const container = document.getElementById('filter-fields-container');
    if (container) {
      Object.keys(tpl.filters).forEach(fieldKey => {
        if (this.fieldHTMLMap[fieldKey] && !container.querySelector(`[data-field="${fieldKey}"]`)) {
          container.insertAdjacentHTML('beforeend', this.fieldHTMLMap[fieldKey]);
        }
      });
    }

    document.querySelectorAll('.filter-input').forEach(input => input.value = '');
    document.querySelectorAll('.clear-single-val-btn').forEach(btn => btn.classList.add('hidden'));

    if (tpl.filters.name && document.getElementById('filter-name')) {
      document.getElementById('filter-name').value = tpl.filters.name;
    }
    if (tpl.filters.city && document.getElementById('filter-city')) {
      document.getElementById('filter-city').value = tpl.filters.city;
    }
    if (tpl.filters.address && document.getElementById('filter-address')) {
      document.getElementById('filter-address').value = tpl.filters.address;
    }

    if (tpl.filters.countryOp && document.getElementById('operator-country')) {
      document.getElementById('operator-country').value = tpl.filters.countryOp;
    }
    if (tpl.filters.typeOp && document.getElementById('operator-type')) {
      document.getElementById('operator-type').value = tpl.filters.typeOp;
    }
    if (tpl.filters.statusOp && document.getElementById('operator-status')) {
      document.getElementById('operator-status').value = tpl.filters.statusOp;
    }

    this.setMultiselectValues('country', tpl.filters.country || []);
    this.setMultiselectValues('type', tpl.filters.type || []);
    this.setMultiselectValues('status', tpl.filters.status || []);
  }

  // --- Current Filters State ---
  getCurrentFilters() {
    return {
      name: document.getElementById('filter-name')?.value.trim() || '',
      country: this.getSelectedMultiselectValues('country'),
      countryOp: document.getElementById('operator-country')?.value || 'equals',
      city: document.getElementById('filter-city')?.value.trim() || '',
      address: document.getElementById('filter-address')?.value.trim() || '',
      type: this.getSelectedMultiselectValues('type'),
      typeOp: document.getElementById('operator-type')?.value || 'equals',
      status: this.getSelectedMultiselectValues('status'),
      statusOp: document.getElementById('operator-status')?.value || 'equals'
    };
  }

  matches(item) {
    const filters = this.getCurrentFilters();

    const name = (item.name || '').toLowerCase();
    const country = item.country || '';
    const city = (item.city || '').toLowerCase();
    const address = (item.address || '').toLowerCase();
    const type = item.type || '';
    const status = item.status || '';

    const matchesName = !filters.name || name.includes(filters.name.toLowerCase());
    const matchesCity = !filters.city || city.includes(filters.city.toLowerCase());
    const matchesAddress = !filters.address || address.includes(filters.address.toLowerCase());

    let matchesCountry = true;
    if (filters.country.length > 0) {
      const inSelected = filters.country.includes(country);
      matchesCountry = filters.countryOp === 'equals' ? inSelected : !inSelected;
    }

    let matchesType = true;
    if (filters.type.length > 0) {
      const inSelected = filters.type.includes(type);
      matchesType = filters.typeOp === 'equals' ? inSelected : !inSelected;
    }

    let matchesStatus = true;
    if (filters.status.length > 0) {
      const inSelected = filters.status.includes(status);
      matchesStatus = filters.statusOp === 'equals' ? inSelected : !inSelected;
    }

    return matchesName && matchesCity && matchesAddress && matchesCountry && matchesType && matchesStatus;
  }

  // --- Active Filters Summary Bar ---
  updateActiveFiltersBar() {
    const activeFiltersBar = document.getElementById('active-filters-bar');
    const activeTemplateBadge = document.getElementById('active-template-badge');
    const activeTemplateNameText = document.getElementById('active-template-name-text');
    const activeChipsContainer = document.getElementById('active-chips-container');
    const filterBadge = document.getElementById('filter-badge');

    if (!activeFiltersBar || !activeChipsContainer) return;

    const currentFilters = this.getCurrentFilters();

    const isAnyActive = currentFilters.name || currentFilters.city || currentFilters.address ||
      currentFilters.country.length > 0 || currentFilters.type.length > 0 || currentFilters.status.length > 0;

    if (isAnyActive) {
      filterBadge?.classList.remove('hidden');
    } else {
      filterBadge?.classList.add('hidden');
    }

    const activeEntries = [];
    if (currentFilters.name) activeEntries.push(['name', 'Назва', currentFilters.name]);
    if (currentFilters.country.length) {
      const opText = currentFilters.countryOp === 'not_equals' ? '≠' : '=';
      activeEntries.push(['country', `Країна (${opText})`, currentFilters.country.join(', ')]);
    }
    if (currentFilters.city) activeEntries.push(['city', 'Місто', currentFilters.city]);
    if (currentFilters.address) activeEntries.push(['address', 'Адреса', currentFilters.address]);
    if (currentFilters.type.length) {
      const opText = currentFilters.typeOp === 'not_equals' ? '≠' : '=';
      activeEntries.push(['type', `Тип (${opText})`, currentFilters.type.join(', ')]);
    }
    if (currentFilters.status.length) {
      const opText = currentFilters.statusOp === 'not_equals' ? '≠' : '=';
      const statusLabels = currentFilters.status.map(s => s === 'active' ? 'Активний' : (s === 'inactive' ? 'Неактивний' : 'Заархівований'));
      activeEntries.push(['status', `Статус (${opText})`, statusLabels.join(', ')]);
    }

    if (activeEntries.length === 0 && !this.activeTemplateId) {
      activeFiltersBar.classList.add('hidden');
      return;
    }

    activeFiltersBar.classList.remove('hidden');

    if (this.activeTemplateId) {
      const tpl = this.filterTemplates.find(t => t.id === this.activeTemplateId);
      if (tpl && activeTemplateBadge && activeTemplateNameText) {
        activeTemplateNameText.textContent = tpl.name;
        activeTemplateBadge.classList.remove('hidden');
        activeTemplateBadge.classList.add('flex');
      }
    } else if (activeTemplateBadge) {
      activeTemplateBadge.classList.add('hidden');
      activeTemplateBadge.classList.remove('flex');
    }

    activeChipsContainer.innerHTML = activeEntries.map(([field, label, val]) => `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200/80 font-medium text-xs">
        <span class="text-slate-400 font-normal">${label}:</span> ${val}
        <button type="button" class="remove-filter-chip-btn text-slate-400 hover:text-rose-600 transition cursor-pointer ml-0.5" data-field="${field}">
          &times;
        </button>
      </span>
    `).join('');
  }

  // --- Templates Management ---
  renderTemplatesList() {
    const savedTemplatesList = document.getElementById('saved-templates-list');
    if (!savedTemplatesList) return;

    if (this.filterTemplates.length === 0) {
      savedTemplatesList.innerHTML = `
        <div class="text-center py-6 text-slate-400">
          <i class="fa-solid fa-bookmark text-2xl mb-2 text-slate-300"></i>
          <p class="text-slate-600 font-medium text-xs">Немає шаблонів</p>
          <p class="text-[11px] text-slate-400 mt-0.5">Збережіть поточні умови як шаблон</p>
        </div>`;
      return;
    }

    savedTemplatesList.innerHTML = this.filterTemplates.map(tpl => {
      const isActive = tpl.id === this.activeTemplateId;
      const isEditing = tpl.id === this.editingTemplateId;

      if (isEditing) {
        return `
          <div class="group flex flex-col gap-2 p-2.5 rounded-xl border border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-2xs transition">
            <div class="flex items-center justify-between text-xs font-bold text-amber-900">
              <span class="flex items-center gap-1.5"><i class="fa-solid fa-pen text-amber-600"></i> Редагування шаблону</span>
              <button type="button" class="cancel-edit-template-btn text-slate-400 hover:text-rose-600 text-xs cursor-pointer" title="Скасувати редагування">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Назва:</label>
              <input type="text" id="input-editing-template-name" value="${tpl.name}" class="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500 transition">
            </div>
            <p class="text-[10px] text-amber-700 leading-tight">Змініть поля або назву та натисніть «Застосувати» для збереження</p>
          </div>`;
      }

      const activeClasses = isActive
        ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20 font-semibold shadow-2xs'
        : 'border-slate-200/80 bg-white hover:border-brand-300 text-slate-800';

      return `
        <div class="group flex items-center justify-between p-2.5 rounded-xl border ${activeClasses} transition">
          <div class="flex-1 min-w-0 cursor-pointer apply-template-btn" data-tpl-id="${tpl.id}">
            <div class="flex items-center gap-2">
              ${isActive ? '<i class="fa-solid fa-circle-check text-brand-600 text-xs shrink-0"></i>' : '<i class="fa-solid fa-bookmark text-slate-300 text-xs shrink-0 group-hover:text-brand-500 transition"></i>'}
              <p class="text-xs font-bold truncate ${isActive ? 'text-brand-700' : 'text-slate-800 group-hover:text-brand-600'} transition">${tpl.name}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 pl-1">
            <button type="button" class="edit-template-btn p-1.5 text-slate-300 hover:text-brand-600 transition cursor-pointer" data-tpl-id="${tpl.id}" title="Редагувати шаблон">
              <i class="fa-solid fa-pen-to-square text-xs"></i>
            </button>
            <button type="button" class="delete-template-btn p-1.5 text-slate-300 hover:text-rose-600 transition cursor-pointer" data-tpl-id="${tpl.id}" title="Видалити шаблон">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>`;
    }).join('');
  }

  resetDrawerFilters() {
    this.activeTemplateId = null;
    this.editingTemplateId = null;
    const filterFieldsContainer = document.getElementById('filter-fields-container');
    if (filterFieldsContainer) {
      filterFieldsContainer.innerHTML = `
        ${this.fieldHTMLMap.name}
        ${this.fieldHTMLMap.country}
        ${this.fieldHTMLMap.city}
        ${this.fieldHTMLMap.address}
        ${this.fieldHTMLMap.type}
        ${this.fieldHTMLMap.status}
      `;
    }
    this.renderTemplatesList();
    this.triggerChange();
  }

  triggerChange() {
    this.updateActiveFiltersBar();
    if (typeof this.onFilterChange === 'function') {
      this.onFilterChange();
    }
  }

  bindEvents() {
    // Multiselect toggles
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.multiselect-toggle-btn');
      if (toggleBtn) {
        e.stopPropagation();
        const fieldId = toggleBtn.getAttribute('data-field');
        const menu = document.getElementById(`multiselect-menu-${fieldId}`);

        document.querySelectorAll('.multiselect-menu').forEach(m => {
          if (m !== menu) m.classList.add('hidden');
        });

        menu?.classList.toggle('hidden');
        return;
      }

      if (e.target.closest('.multiselect-menu')) {
        e.stopPropagation();
        const cb = e.target.closest('.multiselect-cb');
        if (cb) {
          const fieldId = cb.getAttribute('data-field');
          this.updateMultiselectButtonText(fieldId);
        }
        return;
      }

      document.querySelectorAll('.multiselect-menu').forEach(m => m.classList.add('hidden'));
    });

    // Add field button in drawer
    document.getElementById('add-filter-btn')?.addEventListener('click', () => {
      const currentActiveFields = Array.from(document.querySelectorAll('.filter-row')).map(row => row.getAttribute('data-field'));
      const missingFields = this.availableFilterFields.filter(f => !currentActiveFields.includes(f.id));

      if (missingFields.length === 0) {
        alert('Усі доступні поля фільтрації вже присутні у шторці!');
        return;
      }

      const missingFieldsList = document.getElementById('missing-fields-list');
      if (missingFieldsList) {
        missingFieldsList.innerHTML = missingFields.map(f => `
          <button type="button" class="select-field-to-add-btn w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 hover:border-brand-500 hover:bg-brand-50/60 text-slate-800 text-xs font-semibold transition cursor-pointer group" data-field-id="${f.id}">
            <div class="flex items-center gap-2.5">
              <i class="fa-solid ${f.icon} text-slate-400 group-hover:text-brand-600 transition"></i>
              <span>${f.label}</span>
            </div>
            <i class="fa-solid fa-plus text-slate-300 group-hover:text-brand-600 text-xs transition"></i>
          </button>
        `).join('');
      }

      if (typeof this.openModal === 'function') this.openModal('modal-add-filter-field');
    });

    document.getElementById('missing-fields-list')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.select-field-to-add-btn');
      if (!btn) return;

      const fieldId = btn.getAttribute('data-field-id');
      const container = document.getElementById('filter-fields-container');
      if (fieldId && this.fieldHTMLMap[fieldId]) {
        container?.insertAdjacentHTML('beforeend', this.fieldHTMLMap[fieldId]);
        if (typeof this.closeModal === 'function') this.closeModal('modal-add-filter-field');
      }
    });

    // Dynamic row input clear & remove
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('filter-input')) {
        const row = e.target.closest('.filter-row');
        const clearBtn = row?.querySelector('.clear-single-val-btn');
        if (clearBtn) {
          if (e.target.value.trim() !== '') clearBtn.classList.remove('hidden');
          else clearBtn.classList.add('hidden');
        }
      }
    });

    document.addEventListener('click', (e) => {
      const clearSingleBtn = e.target.closest('.clear-single-val-btn');
      if (clearSingleBtn) {
        const row = clearSingleBtn.closest('.filter-row');
        const input = row?.querySelector('.filter-input');
        if (input) {
          input.value = '';
          clearSingleBtn.classList.add('hidden');
          this.triggerChange();
        }
      }

      const removeRowBtn = e.target.closest('.remove-filter-row-btn');
      if (removeRowBtn) {
        const row = removeRowBtn.closest('.filter-row');
        if (row) {
          row.remove();
          this.triggerChange();
        }
      }
    });

    // Save Template Modal Trigger
    document.getElementById('btn-open-save-template')?.addEventListener('click', () => {
      const currentFilters = this.getCurrentFilters();
      const activeEntries = [];

      if (currentFilters.name) activeEntries.push(['Назва', currentFilters.name]);
      if (currentFilters.country.length) activeEntries.push([`Країна (${currentFilters.countryOp === 'equals' ? '=' : '!='})`, currentFilters.country.join(', ')]);
      if (currentFilters.city) activeEntries.push(['Місто', currentFilters.city]);
      if (currentFilters.address) activeEntries.push(['Адреса', currentFilters.address]);
      if (currentFilters.type.length) activeEntries.push([`Тип (${currentFilters.typeOp === 'equals' ? '=' : '!='})`, currentFilters.type.join(', ')]);
      if (currentFilters.status.length) activeEntries.push([`Статус (${currentFilters.statusOp === 'equals' ? '=' : '!='})`, currentFilters.status.join(', ')]);

      if (activeEntries.length === 0) {
        alert('Заповніть хоча б одне поле фільтрації, щоб зберегти шаблон!');
        return;
      }

      const preview = document.getElementById('template-conditions-preview');
      if (preview) {
        preview.innerHTML = activeEntries.map(([label, val]) => `
          <div class="flex justify-between items-center bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 text-xs">
            <span class="text-slate-400 font-medium">${label}:</span>
            <span class="font-semibold text-slate-800">${val}</span>
          </div>
        `).join('');
      }

      const nameInput = document.getElementById('input-template-name');
      if (nameInput) nameInput.value = '';
      if (typeof this.openModal === 'function') this.openModal('modal-save-template');
    });

    // Save Template Submit
    document.getElementById('form-save-template')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('input-template-name');
      const name = nameInput?.value.trim();
      if (!name) return;

      const newTemplate = {
        id: `tpl-${Date.now()}`,
        name: name,
        filters: this.getCurrentFilters()
      };

      this.filterTemplates.push(newTemplate);
      this.activeTemplateId = newTemplate.id;
      this.editingTemplateId = null;
      this.renderTemplatesList();
      if (typeof this.closeModal === 'function') this.closeModal('modal-save-template');
      this.triggerChange();
    });

    // Template item click (Apply, Delete, Edit, Cancel Edit)
    document.getElementById('saved-templates-list')?.addEventListener('click', (e) => {
      const applyBtn = e.target.closest('.apply-template-btn');
      const deleteBtn = e.target.closest('.delete-template-btn');
      const editBtn = e.target.closest('.edit-template-btn');
      const cancelEditBtn = e.target.closest('.cancel-edit-template-btn');

      if (applyBtn) {
        const tplId = applyBtn.getAttribute('data-tpl-id');
        const tpl = this.filterTemplates.find(t => t.id === tplId);
        if (!tpl) return;

        this.editingTemplateId = null;
        this.activeTemplateId = tplId;
        this.loadTemplateToDrawer(tpl);
        this.renderTemplatesList();
        this.triggerChange();
      }

      if (editBtn) {
        const tplId = editBtn.getAttribute('data-tpl-id');
        const tpl = this.filterTemplates.find(t => t.id === tplId);
        if (!tpl) return;

        this.editingTemplateId = tplId;
        this.activeTemplateId = tplId;
        this.loadTemplateToDrawer(tpl);
        this.renderTemplatesList();
      }

      if (cancelEditBtn) {
        this.editingTemplateId = null;
        this.renderTemplatesList();
      }

      if (deleteBtn) {
        const tplId = deleteBtn.getAttribute('data-tpl-id');
        if (this.editingTemplateId === tplId) this.editingTemplateId = null;
        if (this.activeTemplateId === tplId) this.activeTemplateId = null;
        this.filterTemplates = this.filterTemplates.filter(t => t.id !== tplId);
        this.renderTemplatesList();
        this.triggerChange();
      }
    });

    // Active chips bar click
    document.getElementById('active-filters-bar')?.addEventListener('click', (e) => {
      const chipBtn = e.target.closest('.remove-filter-chip-btn');
      if (chipBtn) {
        const field = chipBtn.getAttribute('data-field');
        if (['country', 'type', 'status'].includes(field)) {
          this.setMultiselectValues(field, []);
        } else {
          const input = document.getElementById(`filter-${field}`);
          if (input) input.value = '';
        }
        this.triggerChange();
      }

      if (e.target.closest('#clear-all-active-chips')) {
        this.activeTemplateId = null;
        this.editingTemplateId = null;
        document.querySelectorAll('.filter-input').forEach(input => input.value = '');
        document.querySelectorAll('.clear-single-val-btn').forEach(btn => btn.classList.add('hidden'));
        ['country', 'type', 'status'].forEach(f => this.setMultiselectValues(f, []));
        this.renderTemplatesList();
        this.triggerChange();
      }
    });

    // Drawer Buttons
    document.getElementById('clear-filter-fields-btn')?.addEventListener('click', () => {
      document.querySelectorAll('.filter-input').forEach(input => input.value = '');
      document.querySelectorAll('.clear-single-val-btn').forEach(btn => btn.classList.add('hidden'));
      ['country', 'type', 'status'].forEach(f => this.setMultiselectValues(f, []));
      this.triggerChange();
    });

    document.getElementById('reset-drawer-filters')?.addEventListener('click', () => {
      this.resetDrawerFilters();
    });

    document.getElementById('apply-drawer-filters')?.addEventListener('click', () => {
      if (this.editingTemplateId) {
        const tpl = this.filterTemplates.find(t => t.id === this.editingTemplateId);
        if (tpl) {
          const nameInput = document.getElementById('input-editing-template-name');
          const newName = nameInput?.value.trim();
          if (newName) {
            tpl.name = newName;
          }
          tpl.filters = this.getCurrentFilters();
        }
        this.editingTemplateId = null;
        this.renderTemplatesList();
      }
      this.triggerChange();
    });
  }
}
