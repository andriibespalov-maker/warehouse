/**
 * Модуль керування видимістю колонок таблиці
 */
export class ColumnVisibilityManager {
  constructor(options = {}) {
    this.tableSelector = options.tableSelector || '#warehouses-table';
    this.toggleSelector = options.toggleSelector || '.column-toggle';
    this.resetBtnSelector = options.resetBtnSelector || '#reset-columns-btn';
    this.archivedColSelector = options.archivedColSelector || '.archived-only-col';
    this.onVisibilityChange = options.onVisibilityChange || null;

    this.table = null;
    this.columnToggles = [];
    this.resetBtn = null;
  }

  init() {
    this.table = document.querySelector(this.tableSelector);
    this.columnToggles = document.querySelectorAll(this.toggleSelector);
    this.resetBtn = document.querySelector(this.resetBtnSelector);

    if (!this.table) return;

    this.bindEvents();
    this.applyColumnVisibility();
  }

  /**
   * Застосовує видимість колонок на основі стану чекбоксів
   */
  applyColumnVisibility() {
    if (!this.table) return;

    this.columnToggles.forEach(toggle => {
      const colIndex = toggle.getAttribute('data-col');
      const isChecked = toggle.checked;

      const cells = this.table.querySelectorAll(`tr > *:nth-child(${colIndex})`);
      cells.forEach(cell => {
        if (isChecked) {
          cell.classList.remove('hidden');
        } else {
          cell.classList.add('hidden');
        }
      });
    });

    if (typeof this.onVisibilityChange === 'function') {
      this.onVisibilityChange();
    }
  }

  /**
   * Перемикає відображення колонок, призначених тільки для архіву
   * @param {boolean} isArchived - Чи обрано вкладку «Архів»
   */
  toggleArchivedColumns(isArchived) {
    const archivedElements = document.querySelectorAll(this.archivedColSelector);
    archivedElements.forEach(el => {
      if (isArchived) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  }

  /**
   * Скидає стан колонок до початкового (всі видимі)
   */
  resetToDefault() {
    this.columnToggles.forEach(toggle => {
      toggle.checked = true;
    });
    this.applyColumnVisibility();
  }

  bindEvents() {
    this.columnToggles.forEach(toggle => {
      toggle.addEventListener('change', () => this.applyColumnVisibility());
    });

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetToDefault());
    }
  }
}
