class PresetManager {
  constructor(storageKey = 'erp_warehouse_presets') {
    this.storageKey = storageKey;
    this.presets = this.loadPresets();
    this.activePresetId = null;
  }

  // 1. Завантаження зі сховища
  loadPresets() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : this.getDefaultPresets();
  }

  // 2. Дефолтні пресети для старту
  getDefaultPresets() {
    return [
      {
        id: 'default',
        name: 'За замовчуванням (Усі колонки)',
        isDefault: true,
        filters: { statusGroup: 'on_warehouse', isGroupedByShipment: false },
        columns: this.getColumnsStateAllVisible()
      }
    ];
  }

  getColumnsStateAllVisible() {
    const cols = {};
    document.querySelectorAll('.cargo-column-toggle').forEach(cb => {
      const colIdx = cb.getAttribute('data-col');
      if (colIdx) cols[colIdx] = true;
    });
    return cols;
  }

  // 3. Зчитування ПОТОЧНОГО стану системи (Фільтри + Колонки)
  getCurrentState() {
    // 3.1. Зчитуємо стан колонок з модалки налаштувань
    const columnsState = {};
    document.querySelectorAll('.cargo-column-toggle').forEach(cb => {
      const colIdx = cb.getAttribute('data-col');
      if (colIdx) {
        columnsState[colIdx] = cb.checked;
      }
    });

    // 3.2. Зчитуємо стан фільтрів
    const filtersState = {
      searchQuery: document.getElementById('search-input')?.value || '',
      statusGroup: typeof activeStatusGroup !== 'undefined' ? activeStatusGroup : 'on_warehouse',
      isGroupedByShipment: typeof isGroupedByShipment !== 'undefined' ? isGroupedByShipment : false,
      modalConditions: (typeof cargoFilterManager !== 'undefined' && cargoFilterManager)
        ? cargoFilterManager.getConditions()
        : []
    };

    return { columns: columnsState, filters: filtersState };
  }

  // 4. Збереження нового пресета
  savePreset(name) {
    if (!name || !name.trim()) return;

    const currentState = this.getCurrentState();
    const newPreset = {
      id: 'preset_' + Date.now(),
      name: name.trim(),
      isDefault: false,
      columns: currentState.columns,
      filters: currentState.filters
    };

    this.presets.push(newPreset);
    this.persist();
    this.applyPreset(newPreset.id);
    this.renderUI();
  }

  // 5. Застосування Пресета до UI
  applyPreset(presetId) {
    const preset = this.presets.find(p => p.id === presetId);
    if (!preset) return;

    this.activePresetId = preset.id;

    // A. Застосовуємо відображення колонок
    if (preset.columns) {
      document.querySelectorAll('.cargo-column-toggle').forEach(cb => {
        const colIdx = cb.getAttribute('data-col');
        if (colIdx && preset.columns[colIdx] !== undefined) {
          cb.checked = preset.columns[colIdx];
        }
      });
      if (typeof applyCargoColumnVisibility === 'function') {
        applyCargoColumnVisibility();
      }
    }

    // B. Застосовуємо фільтри
    if (preset.filters) {
      // Пошуковий рядок
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = preset.filters.searchQuery || '';

      // Группа статусів
      if (preset.filters.statusGroup && typeof activeStatusGroup !== 'undefined') {
        activeStatusGroup = preset.filters.statusGroup;
      }

      // Групування за перевезенням
      if (typeof isGroupedByShipment !== 'undefined') {
        isGroupedByShipment = Boolean(preset.filters.isGroupedByShipment);
        const groupingBtnText = document.getElementById('grouping-btn-text');
        const groupingBtn = document.getElementById('btn-toggle-grouping');
        if (groupingBtnText && groupingBtn) {
          if (isGroupedByShipment) {
            groupingBtnText.innerText = 'Групувати за перевезенням: Увімк';
            groupingBtn.classList.add('bg-brand-600', 'text-white');
            groupingBtn.classList.remove('bg-slate-100', 'text-slate-700');
          } else {
            groupingBtnText.innerText = 'Групувати за перевезенням: Вимк';
            groupingBtn.classList.remove('bg-brand-600', 'text-white');
            groupingBtn.classList.add('bg-slate-100', 'text-slate-700');
          }
        }
      }

      // Умови з Розширеного фільтра
      if (typeof cargoFilterManager !== 'undefined' && cargoFilterManager && preset.filters.modalConditions) {
        cargoFilterManager.setConditions(preset.filters.modalConditions);
      }
    }

    // C. Оновлення таблиці
    if (typeof renderTable === 'function') {
      renderTable();
    }

    this.updateActiveLabel(preset.name);
    this.renderUI();
  }

  // 6. Видалення пресета
  deletePreset(presetId) {
    this.presets = this.presets.filter(p => p.id !== presetId);
    this.persist();
    if (this.activePresetId === presetId) {
      this.applyPreset('default');
    } else {
      this.renderUI();
    }
  }

  persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.presets));
  }

  updateActiveLabel(name) {
    const label = document.getElementById('active-preset-label');
    if (label) label.innerText = `Пресет: ${name}`;
  }

  // 7. Рендеринг списку в дропдауні
  renderUI() {
    const container = document.getElementById('presets-list-items');
    if (!container) return;

    container.innerHTML = this.presets.map(p => {
      const isActive = p.id === this.activePresetId;
      return `
        <div class="flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
        isActive ? 'bg-indigo-50 font-bold text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
      }">
          <button type="button" onclick="presetManager.applyPreset('${p.id}')" class="flex-1 text-left flex items-center gap-2 cursor-pointer truncate">
            <i class="fa-solid ${isActive ? 'fa-circle-check text-indigo-600' : 'fa-sliders text-slate-400'}"></i>
            <span class="truncate">${p.name}</span>
          </button>

          ${!p.isDefault ? `
            <button type="button" onclick="presetManager.deletePreset('${p.id}')" class="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer" title="Видалити пресет">
              <i class="fa-solid fa-xmark"></i>
            </button>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  init() {
    const btnMenu = document.getElementById('btn-presets-menu');
    const menu = document.getElementById('presets-dropdown-menu');
    const btnSave = document.getElementById('btn-save-current-preset');

    if (btnMenu && menu) {
      btnMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
      });

      document.addEventListener('click', () => menu.classList.add('hidden'));
      menu.addEventListener('click', (e) => e.stopPropagation());
    }

    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const name = prompt('Введіть назву для нового пресета (Фільтри + Колонки):');
        if (name) {
          this.savePreset(name);
          menu.classList.add('hidden');
          if (typeof showToast === 'function') {
            showToast(`Пресет "${name}" успішно збережено!`);
          }
        }
      });
    }

    this.renderUI();
  }
}

// Ініціалізація глобального екземпляра
let presetManager = null;
