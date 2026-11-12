import { ColumnVisibilityManager } from './column-visibility.js';
import { FilterManager } from './filters.js';

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
  let selectedContractorValue = '';

  const contractorsDirectory = [
    { name: 'Global Cargo Logistics', country: 'Китай', taxId: 'USCI-91440605', contact: 'Чжан Вей' },
    { name: 'Shenzhen Partner Express', country: 'Китай', taxId: 'USCI-91440300', contact: 'Лі Мін' },
    { name: 'ТОВ Логістік Груп', country: 'Україна', taxId: '40291847', contact: 'Олександр Коваль' },
    { name: 'Партнер-Логістик PL', country: 'Польща', taxId: 'NIP-52139014', contact: 'Марек Ковальський' },
    { name: 'EuroTransit Sp. z o.o.', country: 'Польща', taxId: 'NIP-53425891', contact: 'Пйотр Новак' },
    { name: 'Партнер-Логістик', country: 'Україна', taxId: '38910422', contact: 'Ірина Мельник' }
  ];

  function syncContractorsFromWarehouses() {
    warehousesData.forEach(w => {
      const cName = (w.contractor || '').trim();
      if (cName && !contractorsDirectory.some(c => c.name.toLowerCase() === cName.toLowerCase())) {
        contractorsDirectory.push({
          name: cName,
          country: w.country || 'Україна',
          taxId: '',
          contact: w.contacts?.[0]?.fullName || ''
        });
      }
    });
  }

  function escapeHtmlStr(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlightMatch(text, query) {
    const safeText = escapeHtmlStr(text);
    const cleanQ = (query || '').trim();
    if (!cleanQ) return safeText;
    const escapedQ = cleanQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQ})`, 'gi');
    return safeText.replace(regex, '<mark class="bg-brand-100 text-brand-800 rounded px-0.5 font-bold">$1</mark>');
  }

  function updateContractorBadgeAndClearBtn() {
    const inputEl = document.getElementById('input-contractor-search');
    const clearBtn = document.getElementById('btn-clear-contractor');
    const badgeEl = document.getElementById('contractor-selected-badge');
    const currentVal = (inputEl?.value || '').trim();

    if (clearBtn) {
      clearBtn.classList.toggle('hidden', !currentVal);
      clearBtn.classList.toggle('flex', Boolean(currentVal));
    }

    const isExactMatch = Boolean(
      currentVal &&
      contractorsDirectory.some(c => c.name.toLowerCase() === currentVal.toLowerCase())
    );

    if (badgeEl) {
      badgeEl.classList.toggle('hidden', !isExactMatch);
      badgeEl.classList.toggle('inline-flex', isExactMatch);
    }
  }

  function setContractorValue(name = '', highlight = false) {
    const cleanName = (name || '').trim();
    selectedContractorValue = cleanName;
    const inputEl = document.getElementById('input-contractor-search');
    if (inputEl) {
      inputEl.value = cleanName;
      if (highlight) {
        inputEl.classList.add('ring-2', 'ring-emerald-500/40', 'border-emerald-500');
        setTimeout(() => {
          inputEl.classList.remove('ring-2', 'ring-emerald-500/40', 'border-emerald-500');
        }, 1600);
      }
    }
    updateContractorBadgeAndClearBtn();
    closeContractorDropdownMenu();
  }

  function openContractorDropdownMenu(filterQuery = null) {
    const menu = document.getElementById('contractor-dropdown-menu');
    const arrow = document.getElementById('contractor-dropdown-arrow');
    const inputEl = document.getElementById('input-contractor-search');
    const q = filterQuery !== null ? filterQuery : (inputEl?.value || '');
    renderContractorComboboxList(q);
    if (menu) {
      menu.classList.remove('hidden');
      arrow?.classList.add('rotate-180');
    }
  }

  function closeContractorDropdownMenu() {
    const menu = document.getElementById('contractor-dropdown-menu');
    const arrow = document.getElementById('contractor-dropdown-arrow');
    if (menu) {
      menu.classList.add('hidden');
      arrow?.classList.remove('rotate-180');
    }
  }

  function openCreateContractorModalWithPrefill(prefillName = '') {
    const formCreateContractor = document.getElementById('form-create-contractor');
    formCreateContractor?.reset();

    const nameInp = document.getElementById('input-new-contractor-name');
    if (nameInp) nameInp.value = (prefillName || '').trim();

    const whCountry = document.getElementById('select-warehouse-country')?.value;
    const contractorCountrySelect = document.getElementById('select-new-contractor-country');
    if (contractorCountrySelect && whCountry) {
      contractorCountrySelect.value = whCountry;
    }

    closeContractorDropdownMenu();
    openModal('modal-create-contractor');
    setTimeout(() => {
      if (nameInp) {
        nameInp.focus();
        nameInp.setSelectionRange(nameInp.value.length, nameInp.value.length);
      }
    }, 50);
  }

  function renderContractorComboboxList(rawQuery = '') {
    const listContainer = document.getElementById('contractor-options-list');
    const smartCreateBar = document.getElementById('contractor-smart-create-bar');
    if (!listContainer || !smartCreateBar) return;

    const q = (rawQuery || '').trim();
    const qLower = q.toLowerCase();

    // Якщо в полі стоїть уже точно обраний підрядник і користувач просто відкрив меню — показуємо всіх, але виділяємо поточного
    const isShowingSelectedWithoutTyping = Boolean(
      q &&
      selectedContractorValue &&
      q.toLowerCase() === selectedContractorValue.toLowerCase()
    );

    const filtered = isShowingSelectedWithoutTyping
      ? [...contractorsDirectory]
      : contractorsDirectory.filter(c => {
        if (!qLower) return true;
        return (
          c.name.toLowerCase().includes(qLower) ||
          (c.country && c.country.toLowerCase().includes(qLower)) ||
          (c.taxId && c.taxId.toLowerCase().includes(qLower)) ||
          (c.contact && c.contact.toLowerCase().includes(qLower))
        );
      });

    const hasExactMatch = Boolean(
      q && contractorsDirectory.some(c => c.name.toLowerCase() === qLower)
    );

    if (filtered.length === 0) {
      const safeQ = escapeHtmlStr(q);
      listContainer.innerHTML = `
        <div class="p-3 text-center space-y-2.5">
          <div class="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center mx-auto">
            <i class="fa-solid fa-building-circle-arrow-right text-sm"></i>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-800">Підрядника «${safeQ}» ще немає в списку</p>
            <p class="text-[11px] text-slate-500 mt-0.5">Створіть його зараз за 5 секунд без переходу з форми складу</p>
          </div>
          <button type="button" data-create-contractor-name="${safeQ}"
            class="btn-smart-create-contractor w-full py-2 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-brand-500/20 transition flex items-center justify-center gap-2 cursor-pointer">
            <i class="fa-solid fa-plus text-[11px]"></i>
            <span>Створити «${safeQ}»</span>
            <kbd class="ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-brand-700/80 text-brand-100 rounded border border-brand-400/40">Enter ↵</kbd>
          </button>
        </div>
      `;
      smartCreateBar.classList.add('hidden');
      return;
    }

    smartCreateBar.classList.remove('hidden');

    listContainer.innerHTML = filtered.map(c => {
      const isSelected = Boolean(
        selectedContractorValue &&
        c.name.toLowerCase() === selectedContractorValue.toLowerCase()
      );
      const flag = countryFlags[c.country] || '🏢';
      const highlightQuery = isShowingSelectedWithoutTyping ? '' : q;
      const metaParts = [c.country ? `${flag} ${c.country}` : '', c.taxId || '', c.contact || ''].filter(Boolean);

      return `
        <button type="button" data-select-contractor="${escapeHtmlStr(c.name)}"
          class="contractor-option-item w-full text-left px-3 py-2 rounded-lg transition flex items-center justify-between gap-2 cursor-pointer ${isSelected
          ? 'bg-brand-50/90 text-brand-900 border border-brand-200/80 font-semibold'
          : 'hover:bg-slate-100/90 text-slate-700 border border-transparent'
        }">
          <div class="min-w-0">
            <div class="text-xs font-semibold text-slate-800 truncate">${highlightMatch(c.name, highlightQuery)}</div>
            ${metaParts.length > 0 ? `<div class="text-[10px] text-slate-400 truncate mt-0.5">${escapeHtmlStr(metaParts.join(' • '))}</div>` : ''}
          </div>
          ${isSelected ? `
            <span class="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
              <i class="fa-solid fa-check text-[9px]"></i> Обрано
            </span>
          ` : `
            <i class="fa-solid fa-arrow-turn-down -rotate-90 text-[10px] text-slate-300 shrink-0"></i>
          `}
        </button>
      `;
    }).join('');

    if (q && !hasExactMatch) {
      const safeQ = escapeHtmlStr(q);
      smartCreateBar.innerHTML = `
        <button type="button" data-create-contractor-name="${safeQ}"
          class="btn-smart-create-contractor w-full px-3 py-2 rounded-lg bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white border border-brand-200/80 hover:border-brand-600 text-xs font-semibold transition flex items-center justify-between gap-2 cursor-pointer group">
          <span class="flex items-center gap-2 min-w-0 truncate">
            <i class="fa-solid fa-plus-circle text-brand-600 group-hover:text-white transition"></i>
            <span class="truncate">Створити нового підрядника <strong>«${safeQ}»</strong></span>
          </span>
          <kbd class="shrink-0 px-1.5 py-0.5 text-[10px] font-mono bg-white group-hover:bg-brand-700 text-slate-500 group-hover:text-brand-100 rounded border border-slate-200 group-hover:border-brand-500">Enter ↵</kbd>
        </button>
      `;
    } else {
      smartCreateBar.innerHTML = `
        <button type="button" data-create-contractor-name=""
          class="btn-smart-create-contractor w-full px-3 py-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-brand-600 text-[11px] font-semibold transition flex items-center justify-between gap-2 cursor-pointer">
          <span class="text-[10px] text-brand-600 font-bold">+ Створити</span>
        </button>
      `;
    }
  }

  // Pagination State
  let currentPage = 1;
  let itemsPerPage = parseInt(itemsPerPageSelect?.value || '20', 10);

  const countryFlags = {
    'Китай': '🇨🇳',
    'Україна': '🇺🇦',
    'Польща': '🇵🇱',
    'Німеччина': '🇩🇪'
  };

  // --- 5 Макро-категорій послуг та мапінг старих назв ---
  const SERVICE_MACRO_CATEGORIES = {
    'Зберігання': {
      icon: 'fa-boxes-stacked',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      tooltip: 'Палетне, підлогове, коміркове, негабарит, відповідальне зберігання (CBM/день), ADR',
      subServices: [
        'Відповідальне зберігання (CBM / доба)',
        'Палетне зберігання (європалета / доба)',
        'Підлогове / коміркове зберігання дрібних вантажів',
        'Зберігання негабаритного вантажу (> 2.4м)',
        'Зберігання небезпечних вантажів (ADR / акумулятори)',
        'Зберігання з температурним режимом',
        'Понаднормове зберігання понад безкоштовний період'
      ]
    },
    'Пакування та обробка': {
      icon: 'fa-box-open',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      tooltip: 'Перепакування, палетування, обрешітка деревом, стретч-плівка, кутники жорсткості, бабл-плівка',
      subServices: [
        'Палетування вантажу (формування палети)',
        'Обмотка стретч-плівкою (прозора / чорна)',
        'Перепакування в нові картонні коробки',
        'Дерев\'яна обрешітка / каркас (фумігована)',
        'Встановлення захисних картонних / пластикових кутників',
        'Пакування в повітряно-бульбашкову плівку (бабл)',
        'Стягування поліпропіленовою / бандажною стрічкою',
        'Вакуумне / термоусадкове пакування від вологи',
        'Заміна пошкодженої тари постачальника',
        'Надання порожньої європалети (EPAL / стандарт)'
      ]
    },
    'Маркування та Фулфілмент': {
      icon: 'fa-tags',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      tooltip: 'DF-маркування коробок, штрих-коди, FBA/FBM стікери, комплектація наборів (кіттінг), вкладення',
      subServices: [
        'Маркування кожної коробки (DF-код клієнта)',
        'Друк та поклейка транспортних етикеток / штрих-кодів',
        'Поштучне стікерування товару (FBA / FBM / EAN / UPC)',
        'Комплектація наборів та бандлів (Kitting)',
        'Вкладення інструкцій, інвойсів або промо-матеріалів',
        'Видалення / заклеювання старих бірок постачальника',
        'Нанесення маніпуляційних знаків («Крихке», «Верх»)'
      ]
    },
    'Крос-докінг та ПРР': {
      icon: 'fa-truck-ramp-box',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      tooltip: 'Перевантаження фура-фура, вивантаження карою/вручну, рампа, гідроборт, консолідація LCL/LTL',
      subServices: [
        'Крос-докінг (пряме перевантаження фура-фура)',
        'Механізоване вивантаження / завантаження (карою за палету)',
        'Ручне вивантаження / завантаження коробок (навалом)',
        'Консолідація партій від різних постачальників (LCL / LTL)',
        'Розконсолідація (сплітування партії на декілька отримувачів)',
        'Робота з негабаритом або спецтехнікою (кран-балка / гідроборт)',
        'Оформлення T1 / MRN / супровідних складських документів'
      ]
    },
    'Інспекція та Сортування': {
      icon: 'fa-magnifying-glass-chart',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      tooltip: 'Сортування партій, поштучний перерахунок, зважування, заміри габаритів, фото/відеофіксація, перевірка браку',
      subServices: [
        'Сортування вантажу за артикулами / розмірами / клієнтами',
        'Поштучний перерахунок вмісту коробок',
        'Контрольне зважування та обмір габаритів кожного місця',
        'Фотофіксація вантажу при прийманні / відвантаженні',
        'Відеозйомка розпакування / перевірки товару',
        'Перевірка товару на видимий брак та працездатність',
        'Складання комерційного акту невідповідності / пошкодження'
      ]
    }
  };

  const LEGACY_SERVICE_MAP = {
    'Упаковка': 'Пакування та обробка',
    'Маркування': 'Маркування та Фулфілмент',
    'Крос-докінг': 'Крос-докінг та ПРР',
    'Сортування': 'Інспекція та Сортування',
    'Комплектація': 'Маркування та Фулфілмент'
  };

  function normalizeServiceMacro(serviceName) {
    return LEGACY_SERVICE_MAP[serviceName] || serviceName;
  }

  function renderMacroServicesBadges(wh) {
    const rawServices = Array.isArray(wh.services) ? wh.services : [];
    const normalized = Array.from(new Set(rawServices.map(normalizeServiceMacro)));
    if (normalized.length === 0) {
      return '<span class="text-slate-400 text-xs">-</span>';
    }

    const selectedSubs = Array.isArray(wh.selectedSubServices) ? new Set(wh.selectedSubServices) : null;

    return normalized.map(catName => {
      const meta = SERVICE_MACRO_CATEGORIES[catName] || {
        icon: 'fa-check',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        tooltip: catName,
        subServices: []
      };

      const customSubs = (wh.customSubServices && Array.isArray(wh.customSubServices[catName]))
        ? wh.customSubServices[catName]
        : [];
      const allCategorySubs = Array.from(new Set([...(meta.subServices || []), ...customSubs]));

      const activeCount = selectedSubs
        ? allCategorySubs.filter(sub => selectedSubs.has(sub)).length
        : allCategorySubs.length;

      const subListHtml = allCategorySubs.map(sub => {
        const isActive = !selectedSubs || selectedSubs.has(sub);
        if (isActive) {
          return `
            <li class="flex items-start gap-1.5 text-[10px] text-slate-200 leading-snug">
              <i class="fa-solid fa-check text-[9px] text-emerald-400 mt-0.5 shrink-0"></i>
              <span>${sub}</span>
            </li>
          `;
        } else {
          return `
            <li class="flex items-start gap-1.5 text-[10px] text-slate-400 leading-snug opacity-75">
              <i class="fa-solid fa-xmark text-[9px] text-rose-400 mt-0.5 shrink-0"></i>
              <span class="line-through">${sub}</span>
            </li>
          `;
        }
      }).join('');

      const countBadge = selectedSubs
        ? `${activeCount}/${allCategorySubs.length}`
        : `${allCategorySubs.length}`;

      return `
        <div class="relative group/macro inline-flex">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border cursor-help ${meta.badgeClass} ${selectedSubs && activeCount === 0 ? 'opacity-60 grayscale' : ''}">
            <i class="fa-solid ${meta.icon} text-[9px] opacity-80"></i>
            <span>${catName}</span>
            <span class="text-[9px] opacity-75 font-normal">(${countBadge})</span>
          </span>
          ${subListHtml ? `
            <div class="hidden group-hover/macro:block absolute left-0 bottom-full mb-1.5 w-72 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl z-40 pointer-events-none border border-slate-700">
              <div class="font-bold text-[11px] text-white border-b border-slate-700/80 pb-1 mb-1.5 flex items-center justify-between">
                <span class="flex items-center gap-1.5"><i class="fa-solid ${meta.icon} text-[10px] text-brand-400"></i> ${catName}</span>
                <span class="text-[9px] font-normal text-slate-400">${activeCount} з ${allCategorySubs.length} активні</span>
              </div>
              <ul class="space-y-1">
                ${subListHtml}
              </ul>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  // Оновлення стану картки сверхпослуги (підрахунок обраних послуг, стилі та стан головного чекбокса)
  function updateMacroCardStatus(card) {
    if (!card) return;
    const allPills = card.querySelectorAll('.macro-subservice-pill');
    const selectedPills = card.querySelectorAll('.macro-subservice-pill[data-selected="true"]');
    const total = allPills.length;
    const count = selectedPills.length;

    const badge = card.querySelector('.macro-count-badge');
    if (badge) {
      if (count > 0) {
        badge.textContent = `${count} з ${total} обрано`;
        badge.className = 'macro-count-badge text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 transition shrink-0';
      } else {
        badge.textContent = `0 з ${total} (не обрано)`;
        badge.className = 'macro-count-badge text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 transition shrink-0';
      }
    }

    const macroCb = card.querySelector('.service-macro-checkbox');
    if (macroCb) {
      macroCb.checked = count > 0;
    }

    if (count > 0) {
      card.classList.add('border-brand-500', 'ring-2', 'ring-brand-500/15');
      card.classList.remove('border-slate-200');
    } else {
      card.classList.remove('border-brand-500', 'ring-2', 'ring-brand-500/15');
      card.classList.add('border-slate-200');
    }
  }

  // Створення HTML окремої пігулки послуги всередині сверхпослуги (тільки вибір/скасування)
  function createSubServicePillHtml(sub, isSelected, macroName) {
    const escapedSub = sub.replace(/"/g, '&quot;');
    const pillClasses = isSelected
      ? 'macro-subservice-pill flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer select-none bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold shadow-2xs hover:bg-emerald-100'
      : 'macro-subservice-pill flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer select-none bg-rose-50/50 hover:bg-rose-100/70 text-slate-600 border border-rose-200/80 font-medium';

    const iconClass = isSelected
      ? 'service-status-icon fa-solid fa-check text-emerald-600 text-[10px] font-bold shrink-0'
      : 'service-status-icon fa-solid fa-xmark text-rose-500 text-[10px] font-bold shrink-0';

    const titleText = isSelected
      ? 'Послуга активна (клікніть, щоб вимкнути)'
      : 'Послуга не вибрана (клікніть, щоб увімкнути)';

    return `
      <div class="${pillClasses}"
           data-subservice="${sub.toLowerCase()}"
           data-subservice-name="${escapedSub}"
           data-macro="${macroName}"
           data-selected="${isSelected ? 'true' : 'false'}"
           title="${titleText}">
        <i class="${iconClass}"></i>
        <span class="truncate">${sub}</span>
      </div>
    `;
  }

  // Рендер карток сверхпослуг у формі створення/редагування складу (Блок 3)
  // За дефолтом (при створенні складу): selectedSubServices = [] -> усі послуги не вибрані з червоним хрестиком
  function renderFormMacroServicesCards(selectedMacroServices = [], selectedSubServices = [], customSubServices = {}) {
    const container = document.getElementById('services-checkbox-group');
    if (!container) return;

    const selectedSubsSet = new Set(Array.isArray(selectedSubServices) ? selectedSubServices : []);
    const normalizedSelectedMacros = new Set(
      (Array.isArray(selectedMacroServices) ? selectedMacroServices : []).map(normalizeServiceMacro)
    );

    container.innerHTML = Object.entries(SERVICE_MACRO_CATEGORIES).map(([macroName, meta]) => {
      const allSubs = meta.subServices || [];

      const pillsHtml = allSubs.map(sub => {
        // За дефолтом: якщо послуги не в selectedSubsSet, вони НЕ вибрані (false) з червоним хрестиком
        const isSelected = selectedSubsSet.has(sub);
        return createSubServicePillHtml(sub, isSelected, macroName);
      }).join('');

      const activeCount = allSubs.filter(sub => selectedSubsSet.has(sub)).length;
      const isCardActive = activeCount > 0 || normalizedSelectedMacros.has(macroName);

      return `
        <div class="macro-service-card flex flex-col justify-between gap-2.5 bg-white p-3.5 rounded-xl border ${isCardActive ? 'border-brand-500 ring-2 ring-brand-500/15' : 'border-slate-200'} transition shadow-2xs"
             data-macro-name="${macroName}"
             data-macro-card="${macroName.toLowerCase()}">
          
          <!-- Шапка сверхпослуги: чекбокс, назва, лічильник та швидкі дії -->
          <div class="flex items-center justify-between gap-2">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" name="warehouse-services" value="${macroName}" ${isCardActive ? 'checked' : ''}
                class="service-macro-checkbox rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer shrink-0">
              <div class="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span class="w-6 h-6 rounded-lg ${meta.badgeClass} border flex items-center justify-center text-[11px] shrink-0">
                  <i class="fa-solid ${meta.icon}"></i>
                </span>
                <span>${macroName}</span>
              </div>
            </label>

            <div class="flex items-center gap-1.5">
              <span class="macro-count-badge text-[10px] font-semibold px-2 py-0.5 rounded-full ${activeCount > 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'} transition shrink-0">
                ${activeCount > 0 ? `${activeCount} з ${allSubs.length} обрано` : `0 з ${allSubs.length} (не обрано)`}
              </span>
              <div class="inline-flex rounded-md shadow-2xs">
                <button type="button" class="btn-select-all-macro text-[10px] font-semibold px-2 py-0.5 rounded-l-md bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition cursor-pointer" data-macro="${macroName}">
                  Всі
                </button>
                <button type="button" class="btn-clear-all-macro text-[10px] font-semibold px-2 py-0.5 rounded-r-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-l-0 border-rose-200 transition cursor-pointer" data-macro="${macroName}">
                  Жодної
                </button>
              </div>
            </div>
          </div>

          <!-- Список послуг усередині сверхпослуги (тільки вибір послуг) -->
          <div class="border-t border-slate-100 pt-2 flex-1">
            <div class="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              <span>Послуги у сверхпослузі:</span>
              <span class="text-[9px] text-slate-400 font-normal">
                <span class="text-emerald-600 font-bold">✓</span> обрана / <span class="text-rose-500 font-bold">✕</span> не вибрана
              </span>
            </div>
            <div class="macro-subservices-list grid grid-cols-1 gap-1.5">
              ${pillsHtml}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Прив'язка подій для карток
    initMacroCardsInteractivity();
  }

  // Інтерактивність перемикання послуг та масового вибору
  function initMacroCardsInteractivity() {
    const container = document.getElementById('services-checkbox-group');
    if (!container) return;

    // 1. Клік на пігулку послуги (перемикання: не вибрано ✕ <-> обрано ✓)
    container.querySelectorAll('.macro-subservice-pill').forEach(pill => {
      pill.onclick = () => {
        const isNowSelected = pill.getAttribute('data-selected') !== 'true';
        pill.setAttribute('data-selected', isNowSelected ? 'true' : 'false');

        const icon = pill.querySelector('.service-status-icon');
        if (isNowSelected) {
          pill.className = 'macro-subservice-pill flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer select-none bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold shadow-2xs hover:bg-emerald-100';
          if (icon) icon.className = 'service-status-icon fa-solid fa-check text-emerald-600 text-[10px] font-bold shrink-0';
          pill.title = 'Послуга активна (клікніть, щоб вимкнути)';
        } else {
          pill.className = 'macro-subservice-pill flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer select-none bg-rose-50/50 hover:bg-rose-100/70 text-slate-600 border border-rose-200/80 font-medium';
          if (icon) icon.className = 'service-status-icon fa-solid fa-xmark text-rose-500 text-[10px] font-bold shrink-0';
          pill.title = 'Послуга не вибрана (клікніть, щоб увімкнути)';
        }

        updateMacroCardStatus(pill.closest('.macro-service-card'));
      };
    });

    // 2. Кнопка "Всі" для сверхпослуги
    container.querySelectorAll('.btn-select-all-macro').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const card = btn.closest('.macro-service-card');
        if (!card) return;
        card.querySelectorAll('.macro-subservice-pill').forEach(pill => {
          pill.setAttribute('data-selected', 'true');
          pill.className = 'macro-subservice-pill flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer select-none bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold shadow-2xs hover:bg-emerald-100';
          const icon = pill.querySelector('.service-status-icon');
          if (icon) icon.className = 'service-status-icon fa-solid fa-check text-emerald-600 text-[10px] font-bold shrink-0';
          pill.title = 'Послуга активна (клікніть, щоб вимкнути)';
        });
        updateMacroCardStatus(card);
      };
    });

    // 3. Кнопка "Жодної" для сверхпослуги (усі стають не вибраними з червоним хрестиком)
    container.querySelectorAll('.btn-clear-all-macro').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const card = btn.closest('.macro-service-card');
        if (!card) return;
        card.querySelectorAll('.macro-subservice-pill').forEach(pill => {
          pill.setAttribute('data-selected', 'false');
          pill.className = 'macro-subservice-pill flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer select-none bg-rose-50/50 hover:bg-rose-100/70 text-slate-600 border border-rose-200/80 font-medium';
          const icon = pill.querySelector('.service-status-icon');
          if (icon) icon.className = 'service-status-icon fa-solid fa-xmark text-rose-500 text-[10px] font-bold shrink-0';
          pill.title = 'Послуга не вибрана (клікніть, щоб увімкнути)';
        });
        updateMacroCardStatus(card);
      };
    });

    // 4. Перемикання головного чекбокса сверхпослуги
    container.querySelectorAll('.service-macro-checkbox').forEach(cb => {
      cb.onchange = (e) => {
        const card = cb.closest('.macro-service-card');
        if (!card) return;
        const targetState = cb.checked;
        card.querySelectorAll('.macro-subservice-pill').forEach(pill => {
          pill.setAttribute('data-selected', targetState ? 'true' : 'false');
          if (targetState) {
            pill.className = 'macro-subservice-pill flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer select-none bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold shadow-2xs hover:bg-emerald-100';
            const icon = pill.querySelector('.service-status-icon');
            if (icon) icon.className = 'service-status-icon fa-solid fa-check text-emerald-600 text-[10px] font-bold shrink-0';
            pill.title = 'Послуга активна (клікніть, щоб вимкнути)';
          } else {
            pill.className = 'macro-subservice-pill flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer select-none bg-rose-50/50 hover:bg-rose-100/70 text-slate-600 border border-rose-200/80 font-medium';
            const icon = pill.querySelector('.service-status-icon');
            if (icon) icon.className = 'service-status-icon fa-solid fa-xmark text-rose-500 text-[10px] font-bold shrink-0';
            pill.title = 'Послуга не вибрана (клікніть, щоб увімкнути)';
          }
        });
        updateMacroCardStatus(card);
      };
    });
  }

  // Пошук/підсвітка конкретних послуг усередині карток макропослуг у формі
  document.getElementById('macro-service-search')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.macro-service-card').forEach(card => {
      const macroTitle = card.getAttribute('data-macro-card') || '';
      let hasMatchingSub = false;

      card.querySelectorAll('.macro-subservice-pill').forEach(pill => {
        const subText = pill.getAttribute('data-subservice') || '';
        if (q && subText.includes(q)) {
          hasMatchingSub = true;
          pill.classList.add('ring-2', 'ring-amber-400');
        } else {
          pill.classList.remove('ring-2', 'ring-amber-400');
        }
      });

      if (!q || macroTitle.includes(q) || hasMatchingSub) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });

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
  let toastTimeout = null;
  function showToast(message) {
    const toast = document.getElementById('copy-toast');
    const toastText = document.getElementById('copy-toast-text');
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.remove('translate-y-16', 'opacity-0', 'pointer-events-none');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('translate-y-16', 'opacity-0', 'pointer-events-none');
    }, 2400);
  }

  function copyToClipboard(text, label = 'Скопійовано в буфер обміну') {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast(label)).catch(() => {
        fallbackCopy(text, label);
      });
    } else {
      fallbackCopy(text, label);
    }
  }

  function fallbackCopy(text, label) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(label);
    } catch (e) { }
    document.body.removeChild(ta);
  }

  // --- Блок 1.2: Динамічні статуси складу в реальному часі ---
  // Скасовано старе правило «3 місяці без вантажів»!
  // Логіка статусів:
  // - Усі: усі склади компанії, окрім заархівованих
  // - Активний: на складі є фактичний вантаж (occupiedVolume > 0 || activeArrives > 0)
  //             АБО туди очікується підрейс чи заплановано вантаж (expectedVolume > 0 || expectedSubflights > 0)
  // - Неактивний: на складі зараз порожньо і жоден вантаж туди не рухається та не планується
  // - Архівований: склад, з яким компанія більше не працює
  function evaluateWarehouseDynamicStatus(wh) {
    if (wh.status === 'archived') {
      return {
        status: 'archived',
        badgeText: 'В архіві',
        reasonText: 'Склад заархівовано (компанія більше не працює з обʼєктом)'
      };
    }

    const occupied = parseFloat(wh.occupiedVolume) || 0;
    const arrives = parseInt(wh.activeArrives, 10) || 0;
    const expected = parseFloat(wh.expectedVolume) || 0;
    const expectedSubflights = parseInt(wh.expectedSubflights, 10) || 0;

    const hasCargo = occupied > 0 || arrives > 0;
    const hasIncoming = expected > 0 || expectedSubflights > 0;

    if (hasCargo || hasIncoming) {
      const details = [];
      if (hasCargo) details.push(`факт: ${occupied} м³`);
      if (hasIncoming) details.push(`очікується: ${expected} м³`);
      return {
        status: 'active',
        badgeText: 'Активний',
        reasonText: `Склад активний (${details.join(', ')})`
      };
    }

    return {
      status: 'inactive',
      badgeText: 'Неактивний',
      reasonText: 'На складі зараз порожньо і жоден вантаж туди не рухається та не планується'
    };
  }

  function applyDynamicStatuses() {
    warehousesData.forEach(wh => {
      if (wh.status === 'archived') return;
      const evalResult = evaluateWarehouseDynamicStatus(wh);
      wh.status = evalResult.status;
    });
  }

  function formatLastArrivalShort(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function updateFormMdStatusPreview(dateStr) {
    const badgeEl = document.getElementById('form-md-status-badge');
    const hintEl = document.getElementById('form-md-status-hint');
    if (!badgeEl || !hintEl) return;

    if (!dateStr) {
      badgeEl.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200';
      badgeEl.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Активний (новий)';
      hintEl.textContent = 'Автоматично стає «Неактивним», якщо з моменту останнього Arrival минуло більше ніж 3 місяці.';
      return;
    }

    const evalRes = evaluateWarehouseMdStatus({ lastArrivalDate: dateStr });
    if (evalRes.isOver3Months) {
      badgeEl.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200';
      badgeEl.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Неактивний (> 3 міс. без Arrival)';
      hintEl.textContent = evalRes.reasonText;
    } else {
      badgeEl.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200';
      badgeEl.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Активний (< 3 міс.)';
      hintEl.textContent = evalRes.reasonText;
    }
  }

  async function loadWarehousesData() {
    try {
      const response = await fetch('../data/warehouses.json');
      if (!response.ok) throw new Error('Не вдалося завантажити warehouses.json');
      warehousesData = await response.json();
    } catch (error) {
      try {
        const res2 = await fetch('data/warehouses.json');
        if (!res2.ok) throw new Error('Не вдалося завантажити data/warehouses.json');
        warehousesData = await res2.json();
      } catch (err2) {
        console.warn('Не вдалося завантажити файл warehouses.json, використовуються початкові дані за замовчуванням:', err2);
        warehousesData = [
          {
            id: 'foshan',
            name: 'New FOSHAN',
            contractor: 'Global Cargo Logistics',
            country: 'Китай',
            flag: '🇨🇳',
            city: 'Foshan',
            address: 'No. 18 Logistics Park, Nanhai District',
            type: 'Difreight',
            isConsolidation: true,
            volume: 500,
            occupiedVolume: 120,
            activeArrives: 14,
            expectedSubflights: 3,
            lastArrivalDate: '2026-10-25',
            tariffs: [
              {
                service: 'Відповідальне зберігання (CBM / доба)',
                unitPrice: '1.50',
                currency: 'USD',
                standard: 'per CBM per day',
                dateFrom: '2026-01-01',
                dateTo: '2026-12-31',
                remark: 'Перші 3 дні безкоштовно при консолідації'
              }
            ],
            tariffDocuments: [
              {
                id: 'doc-foshan-1',
                name: 'Tariff_Foshan_GlobalCargo_2026.pdf',
                size: '420 KB',
                uploadedAt: '15.01.2026',
                comment: 'Офіційний прайс-лист від підрядника Global Cargo Logistics на 2026 рік'
              }
            ],
            status: 'active',
            services: ['Зберігання', 'Пакування та обробка', 'Маркування та Фулфілмент', 'Крос-докінг та ПРР'],
            workRules: 'Тільки палети. Наявна рампа для фур. Без негабариту понад 3м.',
            specialNotes: 'Прийом великогабаритного вантажу за попереднім узгодженням',
            schedule: {
              Mon: '09:00 - 18:00',
              Tue: '09:00 - 18:00',
              Wed: '09:00 - 18:00',
              Thu: '09:00 - 18:00',
              Fri: '09:00 - 18:00',
              Sat: '10:00 - 15:00',
              Sun: 'Вихідний'
            },
            contacts: [
              {
                fullName: 'Чжан Вей (Комірник)',
                position: 'Старший комірник',
                email: 'zhang.wei@foshan-wh.cn',
                comment: 'Відповідає за приймання негабаритних вантажів та перевірку пакування LCL.',
                phones: [
                  {
                    number: '+86 138 0013 8000',
                    socials: [{ type: 'WeChat', value: 'wxid_foshan_zhang' }]
                  }
                ]
              }
            ],
            shippingInstructions: 'Маркування обов\'язкове на кожній коробці: DF-КОД КЛІЄНТА. Відправка тільки після погодження з менеджером.',
            archivedDate: '-',
            link: 'warehouse/warehouse.html',
            isFulfillment: false
          },
          {
            id: 'shenzhen',
            name: 'Shenzhen Hub',
            contractor: 'Shenzhen Partner Express',
            country: 'Китай',
            flag: '🇨🇳',
            city: 'Shenzhen',
            address: 'Building 4, Baoan Airport Logistics Center',
            type: 'Партнерський',
            isConsolidation: true,
            volume: null,
            occupiedVolume: 85,
            activeArrives: 9,
            expectedSubflights: 2,
            lastArrivalDate: '2026-10-18',
            tariffs: [],
            tariffDocuments: [],
            status: 'active',
            services: ['Маркування та Фулфілмент', 'Крос-докінг та ПРР', 'Пакування та обробка'],
            workRules: 'Тільки палети, без небезпечних вантажів (ADR).',
            specialNotes: 'Працює біля аеропорту SZX, швидке відвантаження авіа.',
            schedule: {
              Mon: '08:30 - 19:00',
              Tue: '08:30 - 19:00',
              Wed: '08:30 - 19:00',
              Thu: '08:30 - 19:00',
              Fri: '08:30 - 19:00',
              Sat: '09:00 - 16:00',
              Sun: 'Вихідний'
            },
            contacts: [
              {
                fullName: 'Лі Мін',
                position: 'Менеджер зміни',
                email: 'liming@sz-cargo.com',
                comment: 'Координує експрес-відвантаження в аеропорт Шеньчжень (SZX).',
                phones: [
                  {
                    number: '+86 139 2233 4455',
                    socials: [{ type: 'WeChat', value: 'sz_liming_cargo' }]
                  }
                ]
              }
            ],
            shippingInstructions: 'Перед відправкою на склад обов\'язково надіслати трек-номер у WeChat.',
            archivedDate: '-',
            link: null,
            isFulfillment: false
          },
          {
            id: 'kyiv',
            name: 'Склад Київ-1',
            contractor: 'ТОВ Логістік Груп',
            country: 'Україна',
            flag: '🇺🇦',
            city: 'Київ',
            address: 'вул. Академіка Заболотного, 150А, корпус 3, склад 12',
            type: 'Difreight',
            isConsolidation: true,
            volume: 300,
            occupiedVolume: 245,
            activeArrives: 28,
            expectedSubflights: 4,
            lastArrivalDate: '2026-11-01',
            tariffs: [],
            tariffDocuments: [],
            status: 'active',
            services: ['Зберігання', 'Маркування та Фулфілмент', 'Інспекція та Сортування'],
            workRules: 'Рампа + гідроборт. Прийом великогабаритного вантажу за узгодженням.',
            specialNotes: 'Центральний розподільчий термінал у Києві',
            schedule: {
              Mon: '09:00 - 18:00',
              Tue: '09:00 - 18:00',
              Wed: '09:00 - 18:00',
              Thu: '09:00 - 18:00',
              Fri: '09:00 - 18:00',
              Sat: '10:00 - 15:00',
              Sun: 'Вихідний'
            },
            contacts: [
              {
                fullName: 'Олександр Бондаренко',
                position: 'Керівник складу',
                email: 'kyiv1@difreight.com',
                comment: 'Узгодження графіків вивантаження магістральних фур та видачі клієнтам.',
                phones: [
                  {
                    number: '+380 67 500 12 34',
                    socials: [{ type: 'Telegram', value: '@alex_warehouse_kyiv' }]
                  }
                ]
              }
            ],
            shippingInstructions: 'Заїзд з боку Кільцевої дороги. Повідомити номер авто за 1 год.',
            archivedDate: '-',
            link: null,
            isFulfillment: false
          },
          {
            id: 'chelm',
            name: 'Склад Холм (Транзит)',
            contractor: 'Партнер-Логістик PL',
            country: 'Польща',
            flag: '🇵🇱',
            city: 'Холм',
            address: 'ul. Przemysłowa 24, 22-100 Chełm',
            type: 'Партнерський',
            isConsolidation: false,
            volume: null,
            occupiedVolume: 0,
            activeArrives: 0,
            expectedSubflights: 1,
            lastArrivalDate: '2026-09-12',
            tariffs: [],
            tariffDocuments: [],
            status: 'active',
            services: ['Крос-докінг та ПРР', 'Зберігання'],
            workRules: 'Тільки палети. Перевантаження фура-фура.',
            specialNotes: 'Прикордонний крос-докінг склад біля п/п Ягодин',
            schedule: {
              Mon: '08:00 - 20:00',
              Tue: '08:00 - 20:00',
              Wed: '08:00 - 20:00',
              Thu: '08:00 - 20:00',
              Fri: '08:00 - 20:00',
              Sat: '09:00 - 17:00',
              Sun: 'Вихідний'
            },
            contacts: [
              {
                fullName: 'Марек Ковальські',
                position: 'Митний координатор / Брокер',
                email: 'marek@chelm.pl',
                comment: 'Оформлення T1/MRN та бронювання вікон під перевантаження фура-фура.',
                phones: [
                  {
                    number: '+48 501 234 567',
                    socials: [{ type: 'Telegram', value: '@marek_chelm_pl' }]
                  }
                ]
              }
            ],
            shippingInstructions: 'Обов\'язкова наявність MRN та T1 перед заїздом на термінал.',
            archivedDate: '-',
            link: null,
            isFulfillment: false
          },
          {
            id: 'poland',
            name: 'Склад Варшава',
            contractor: 'EuroTransit Sp. z o.o.',
            country: 'Польща',
            flag: '🇵🇱',
            city: 'Варшава',
            address: 'ul. Magazynowa 5, 05-800 Pruszków',
            type: 'Партнерський',
            isConsolidation: true,
            volume: 200,
            occupiedVolume: 0,
            activeArrives: 0,
            expectedSubflights: 0,
            lastArrivalDate: '2026-06-15',
            tariffs: [],
            tariffDocuments: [],
            status: 'inactive',
            services: ['Зберігання', 'Пакування та обробка', 'Маркування та Фулфілмент'],
            workRules: 'Без негабариту. Тільки стандартні європалети.',
            specialNotes: 'Тимчасово не приймає габарит через інвентаризацію',
            schedule: {
              Mon: 'Вихідний',
              Tue: 'Вихідний',
              Wed: 'Вихідний',
              Thu: 'Вихідний',
              Fri: 'Вихідний',
              Sat: 'Вихідний',
              Sun: 'Вихідний'
            },
            contacts: [
              {
                fullName: 'Пйотр Новак',
                position: 'Логіст складу',
                email: 'p.nowak@eurotransit.pl',
                comment: 'Контактна особа щодо залишків на складі під час інвентаризації.',
                phones: [
                  {
                    number: '+48 600 998 877',
                    socials: [{ type: 'Telegram', value: '@piotr_pruszkow' }]
                  }
                ]
              }
            ],
            shippingInstructions: 'Водію мати світловідбивний жилет та каску. Реєстрація на КПП №2.',
            archivedDate: '-',
            link: null,
            isFulfillment: false
          }
        ];
      }
    }
    syncContractorsFromWarehouses();
    renderAllWarehouses();
  }

  function renderAllWarehouses() {
    applyDynamicStatuses();
    renderTableRows();
    renderCards();
    warehouseItems = Array.from(document.querySelectorAll('.warehouse-item'));
    columnManager.applyColumnVisibility();
    filterRows();
  }

  // Допоміжна функція: Комірка — Завантаженість та Об'єм (Прогрес-бар із 3 зонами, прогнозом 7 днів та критичною індикацією)
  function renderVolumeCell(wh) {
    const limit = parseFloat(wh.volume);
    const occupied = parseFloat(wh.occupiedVolume) || 0;
    const expected = parseFloat(wh.expectedVolume) || 0;
    const hasLimit = !isNaN(limit) && limit > 0;

    // Сценарій А: Ліміт задано (volume > 0)
    if (hasLimit) {
      // Математика завантаженості:
      // Вільне місце = Загальний об'єм складу - Фактичний об'єм - Очікуваний об'єм (на найближчі 7 днів)
      const totalLoad = occupied + expected;
      const free = Math.max(0, limit - totalLoad);
      const isOverloaded = totalLoad > limit;
      const overflowVolume = isOverloaded ? Math.round((totalLoad - limit) * 10) / 10 : 0;

      // Відсотки від загального ліміту:
      const totalPct = Math.round((totalLoad / limit) * 100);
      const factPct = Math.min(100, (occupied / limit) * 100);
      const expectedPct = Math.min(Math.max(0, 100 - factPct), (expected / limit) * 100);

      // Порогові критерії маркерів (узгоджено з логістами):
      // ≥ 90% — критична червона індикація переповнення
      // ≥ 75% та < 90% — помаранчевий/жовтий попереджувальний маркер
      // < 75% — нормальна зелена зона
      const isCritical = totalPct >= 90;
      const isWarning = totalPct >= 75 && totalPct < 90;

      let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      let dotIcon = '🟢';
      let expectedBarColor = 'bg-amber-400';
      let barBorderClass = 'border-slate-200/60 bg-slate-100';

      if (isCritical) {
        dotIcon = '🔴';
        badgeColor = 'text-rose-700 bg-rose-50 border-rose-300 font-bold';
        expectedBarColor = 'bg-rose-500';
        barBorderClass = 'border-rose-400 ring-2 ring-rose-400/50 bg-rose-50/40 shadow-xs';
      } else if (isWarning) {
        dotIcon = '🟡';
        badgeColor = 'text-amber-800 bg-amber-50 border-amber-300 font-bold';
        expectedBarColor = 'bg-amber-400';
        barBorderClass = 'border-amber-300 bg-amber-50/20';
      }

      // Тултіп для смуги
      const tooltipText = `Факт: ${occupied} м³ (${Math.round(factPct)}%), Очікується (7 днів): ${expected} м³ (${Math.round((expected / limit) * 100)}%), Вільне: ${free} м³`;

      return `
        <div class="space-y-1.5 min-w-[200px]">
          <!-- Числовий формат: Факт / Очікується / Загальний ліміт -->
          <div class="flex items-center justify-between gap-1 text-xs">
            <div class="flex items-center gap-1 font-bold text-slate-800" title="Факт: ${occupied} м³ / Очікується: ${expected} м³ / Ліміт: ${limit} м³">
              <span class="text-emerald-700" title="Фактично на складі">${occupied}</span>
              <span class="text-slate-300">/</span>
              <span class="${isCritical ? 'text-rose-600 font-bold' : (isWarning ? 'text-amber-700 font-semibold' : 'text-amber-600')}" title="Очікується в дорозі (7 днів)">${expected}</span>
              <span class="text-slate-300">/</span>
              <span class="text-slate-500 font-semibold" title="Загальний ліміт">${limit} м³</span>
            </div>
            <span class="text-[10px] px-1.5 py-0.2 rounded border ${badgeColor}" title="Загальне навантаження: ${totalPct}%">
              ${dotIcon} ${totalPct}%
            </span>
          </div>

          <!-- 3-зонний прогрес-бар (Факт: зелений, Очікується: жовтий/червоний, Вільний об'єм: сірий фон) -->
          <div class="w-full h-2.5 rounded-full overflow-hidden border ${barBorderClass} flex transition-all duration-300 relative" title="${tooltipText}">
            <div class="h-full bg-emerald-500 transition-all duration-300" style="width: ${factPct}%" title="Фактично на складі: ${occupied} м³"></div>
            <div class="h-full ${expectedBarColor} transition-all duration-300" style="width: ${expectedPct}%" title="Очікується вантажів (7 днів): ${expected} м³"></div>
          </div>

          <!-- Нижній рядок: Вільне місце та статус -->
          <div class="flex items-center justify-between text-[11px] leading-tight font-medium">
            <span class="text-slate-500">
              Вільно: <strong class="${isCritical ? 'text-rose-600 font-bold' : (isWarning ? 'text-amber-800 font-semibold' : 'text-slate-700')}">${free} м³</strong>
            </span>
            ${isCritical ? `
              <span class="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-1 py-0.2 rounded border border-rose-200" title="Сумарне навантаження перевищує 90%">
                <i class="fa-solid fa-triangle-exclamation"></i> ${isOverloaded ? `+${overflowVolume} м³ переліміт` : 'Критично'}
              </span>
            ` : (isWarning ? `
              <span class="text-[10px] font-semibold text-amber-700" title="Заповненість понад 75%">
                Увага
              </span>
            ` : `
              <span class="text-[10px] text-slate-400">
                (7 днів)
              </span>
            `)}
          </div>
        </div>
      `;
    }

    // Сценарій Б: Ліміт НЕ задано, але вантажі є (volume == null, occupied > 0 або expected > 0)
    if (occupied > 0 || expected > 0) {
      return `
        <div class="space-y-1 min-w-[200px]">
          <div class="flex items-center justify-between gap-1">
            <div class="flex items-center gap-1 text-xs font-bold text-slate-800">
              <span class="text-emerald-700" title="Фактично на складі">${occupied}</span>
              <span class="text-slate-300">/</span>
              <span class="text-amber-600" title="Очікується в дорозі">${expected} м³</span>
            </div>
            <span class="px-1.5 py-0.2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-semibold">Безліміт</span>
          </div>
          <div class="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <span class="text-xs font-bold text-slate-500">&infin;</span> Ліміт не вказано
          </div>
        </div>
      `;
    }

    // Сценарій В: Порожній партнерський склад без ліміту (volume == null, occupied == 0, expected == 0)
    return `
      <div class="flex flex-col items-start gap-1 min-w-[200px]">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-medium">
          0 м³ (Без ліміту)
        </span>
      </div>
    `;
  }

  // Допоміжна функція: Комірка 6 — Графік та live-статус зараз + тултіп Пн-Нд
  function renderLiveScheduleCell(wh) {
    const defaultSchedule = {
      Mon: '09:00 - 18:00',
      Tue: '09:00 - 18:00',
      Wed: '09:00 - 18:00',
      Thu: '09:00 - 18:00',
      Fri: '09:00 - 18:00',
      Sat: '10:00 - 15:00',
      Sun: 'Вихідний'
    };
    const sched = wh.schedule || defaultSchedule;
    const dayLabels = [
      { key: 'Mon', label: 'Пн' },
      { key: 'Tue', label: 'Вт' },
      { key: 'Wed', label: 'Ср' },
      { key: 'Thu', label: 'Чт' },
      { key: 'Fri', label: 'Пт' },
      { key: 'Sat', label: 'Сб' },
      { key: 'Sun', label: 'Нд' }
    ];

    const jsDayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const todayKey = jsDayMap[now.getDay()];
    const todayVal = (sched[todayKey] || 'Вихідний').trim();

    let isOpenNow = false;
    let statusLabel = '🔴 Вихідний';
    let badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
    let subText = 'Сьогодні зачинено';

    if (wh.status === 'inactive') {
      statusLabel = '🔴 Неактивний';
      subText = 'Прийом призупинено';
    } else if (wh.status === 'archived') {
      statusLabel = '⚪ В архіві';
      badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
      subText = `Архів: ${wh.archivedDate || '-'}`;
    } else if (todayVal && todayVal.toLowerCase() !== 'вихідний') {
      const timeMatch = todayVal.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
      if (timeMatch) {
        const [, startStr, endStr] = timeMatch;
        const [startH, startM] = startStr.split(':').map(Number);
        const [endH, endM] = endStr.split(':').map(Number);
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
          isOpenNow = true;
          statusLabel = `🟢 Відчинено (до ${endStr})`;
          badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          subText = `Сьогодні: ${todayVal}`;
        } else if (currentMinutes < startMinutes) {
          statusLabel = `🟡 Зачинено (з ${startStr})`;
          badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
          subText = `Сьогодні: ${todayVal}`;
        } else {
          statusLabel = `🔴 Зачинено (до ${endStr})`;
          badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
          subText = `Сьогодні: ${todayVal}`;
        }
      } else {
        isOpenNow = true;
        statusLabel = `🟢 Відчинено (${todayVal})`;
        badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        subText = 'За графіком';
      }
    }

    const tooltipRows = dayLabels.map(d => {
      const val = sched[d.key] || 'Вихідний';
      const isToday = d.key === todayKey;
      const isOff = val.toLowerCase() === 'вихідний';
      return `
        <div class="flex items-center justify-between gap-3 py-0.5 ${isToday ? 'font-bold text-white bg-slate-700/80 px-1.5 rounded' : 'text-slate-300'}">
          <span>${d.label}${isToday ? ' (сьогодні)' : ''}:</span>
          <span class="${isOff ? 'text-rose-400' : 'text-emerald-300'}">${val}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="relative group/sched inline-flex flex-col items-start gap-1">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border cursor-help ${badgeClass}">
          ${statusLabel}
          <i class="fa-regular fa-calendar-days text-[10px] opacity-60"></i>
        </span>
        <span class="text-[10px] text-slate-400 pl-1">${subText}</span>

        <!-- Тултіп з графіком Пн–Нд -->
        <div class="hidden group-hover/sched:block absolute left-0 bottom-full mb-2 w-48 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl z-40 pointer-events-none border border-slate-700">
          <div class="font-bold text-slate-200 border-b border-slate-700 pb-1 mb-1 flex items-center justify-between">
            <span>Графік роботи (Пн–Нд)</span>
            <i class="fa-regular fa-clock text-[10px] text-brand-400"></i>
          </div>
          <div class="space-y-0.5">
            ${tooltipRows}
          </div>
        </div>
      </div>
    `;
  }

  // Допоміжна функція: Комірка — Правила та Обмеження (workRules + specialNotes)
  function renderRulesAndRestrictionsCell(wh) {
    const combinedText = [wh.workRules, wh.specialNotes].filter(Boolean).join(' • ');
    if (!combinedText) {
      return '<span class="text-slate-400 text-xs">-</span>';
    }

    return `
      <div class="note-container">
        <p class="note-text line-clamp-2 text-slate-600 text-[11px] leading-snug transition-all duration-200" title="${combinedText.replace(/"/g, '&quot;')}">
          ${combinedText}
        </p>
        ${combinedText.length > 65 ? `
          <button type="button" class="toggle-note-btn text-brand-600 hover:underline text-[10px] font-semibold mt-0.5 block cursor-pointer">
            ще...
          </button>
        ` : ''}
      </div>
    `;
  }

  function renderTableRows() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;

    tableBody.innerHTML = warehousesData.map(wh => {
      const flag = wh.flag || countryFlags[wh.country] || '🌐';
      const isOwn = wh.type === 'Difreight' || wh.type === 'Власні' || wh.type === 'Власний';
      const typeLabel = isOwn ? 'Власний' : 'Партнер';
      const typeBadgeClass = isOwn
        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200';

      const consolidationBadge = wh.isConsolidation
        ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200" title="Консолідаційний склад (можна збирати LCL/LTL)">
             <i class="fa-solid fa-Layer-group fa-cubes text-[9px] text-amber-600"></i> Консолідація
           </span>`
        : '';

      // 1. Назва + Ознаки (name, type, isConsolidation)
      const nameLinkHTML = wh.link
        ? `<a href="${wh.link}" id="link-${wh.id}" class="inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-brand-600 transition group/link text-sm">
             <i class="fa-solid fa-warehouse text-slate-400 group-hover/link:text-brand-600 transition text-xs"></i>
             <span class="hover:underline">${wh.name}</span>
           </a>`
        : `<button type="button" class="quick-edit-name-btn inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-brand-600 transition text-left text-sm cursor-pointer" data-id="${wh.id}">
             <i class="fa-solid fa-warehouse text-slate-400 text-xs"></i>
             <span class="hover:underline">${wh.name}</span>
           </button>`;

      const col1NameAndBadges = `
        <div class="space-y-1.5">
          <div>${nameLinkHTML}</div>
          <div class="flex flex-wrap items-center gap-1">
            <span class="px-1.5 py-0.5 ${typeBadgeClass} rounded text-[10px] font-semibold border">${typeLabel}</span>
            ${consolidationBadge}
          </div>
        </div>
      `;

      // 2. Країна та Адреса (country, address)
      const col2LocationAndAddress = `
        <div class="space-y-1">
          <div class="flex items-center gap-1.5">
            <span class="text-base leading-none" title="${wh.country || ''}">${flag}</span>
            <strong class="font-bold text-slate-900 text-xs">${wh.country || '-'}</strong>
          </div>
          <div>
            <span class="text-[11px] text-slate-600 font-medium leading-snug line-clamp-2 break-words" title="${(wh.address || '').replace(/"/g, '&quot;')}">${wh.address || '-'}</span>
          </div>
        </div>
      `;

      // 3. Завантаженість та Об'єм
      const col3Volume = renderVolumeCell(wh);

      // 4. Послуги (5 макро-категорій)
      const col5Services = `<div class="flex flex-wrap gap-1">${renderMacroServicesBadges(wh)}</div>`;

      // 5. Правила та Обмеження (workRules, specialNotes)
      const col7Rules = renderRulesAndRestrictionsCell(wh);

      return `
      <tr id="row-${wh.id}" data-id="${wh.id}" data-status="${wh.status}" data-country="${wh.country}" data-type="${wh.type}" data-name="${wh.name}" data-address="${wh.address}" class="warehouse-row warehouse-item hover:bg-slate-50/80 transition group align-top">
        <td class="p-3 text-center align-middle">
          <input type="checkbox" class="row-checkbox w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer" data-id="${wh.id}">
        </td>
        <td class="p-3">${col1NameAndBadges}</td>
        <td class="p-3">${col2LocationAndAddress}</td>
        <td class="p-3">${col3Volume}</td>
        <td class="p-3">${col5Services}</td>
        <td class="p-3 max-w-[220px]">${col7Rules}</td>
        <td class="p-3 archived-date-cell archived-only-col hidden text-slate-500 text-xs align-middle">${wh.archivedDate || '-'}</td>
        <td class="p-3 text-center align-middle">
          <button class="action-menu-btn p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition cursor-pointer" data-id="${wh.id}">
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
      const servicesList = renderMacroServicesBadges(wh);

      const primaryContact = Array.isArray(wh.contacts) && wh.contacts.length > 0
        ? (wh.contacts.find(c => c.isPrimary) || wh.contacts[0])
        : null;
      let primaryPhone = '';
      if (primaryContact) {
        if (Array.isArray(primaryContact.phones) && primaryContact.phones.length > 0) {
          primaryPhone = primaryContact.phones[0].number || '';
        } else if (primaryContact.phone) {
          primaryPhone = primaryContact.phone;
        }
      }

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

          <!-- Головний менеджер для комунікації (Блок 2.1) -->
          ${primaryContact ? `
            <div class="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2 text-[11px] space-y-1">
              <div class="flex items-center justify-between gap-1.5">
                <span class="text-amber-900 font-bold flex items-center gap-1.5 shrink-0">
                  <i class="fa-solid fa-star text-amber-500 text-[10px]"></i> Головний менеджер:
                </span>
                <span class="font-semibold text-slate-800 text-right truncate" title="${(primaryContact.fullName || '')} ${primaryContact.position ? `(${primaryContact.position})` : ''}">
                  ${primaryContact.fullName || '—'}${primaryContact.position ? ` <span class="text-slate-500 font-normal text-[10px]">(${primaryContact.position})</span>` : ''}
                </span>
              </div>
              ${(primaryPhone || primaryContact.email) ? `
                <div class="flex items-center justify-between text-[10px] text-slate-600 font-mono pt-0.5 border-t border-amber-200/50">
                  ${primaryPhone ? `<span><i class="fa-solid fa-phone text-slate-400 mr-1 text-[9px]"></i>${primaryPhone}</span>` : '<span></span>'}
                  ${primaryContact.email ? `<span class="truncate max-w-[130px]" title="${primaryContact.email}"><i class="fa-regular fa-envelope text-slate-400 mr-1 text-[9px]"></i>${primaryContact.email}</span>` : ''}
                </div>
              ` : ''}
            </div>
          ` : ''}

          <div class="space-y-1 mt-1">
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
    let allCount = 0;
    let activeCount = 0;
    let inactiveCount = 0;
    let archivedCount = 0;

    warehousesData.forEach(item => {
      if (item.status !== 'archived') allCount++;
      if (item.status === 'active') activeCount++;
      if (item.status === 'inactive') inactiveCount++;
      if (item.status === 'archived') archivedCount++;
    });

    const allTabCount = document.getElementById('all-tab-count');
    if (allTabCount) allTabCount.textContent = allCount;
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
      const matchesTab = (currentTab === 'all')
        ? (item.status !== 'archived')
        : (currentTab === item.status);
      const servicesText = [...(item.services || []), ...(item.selectedSubServices || [])].join(' ');
      const contactsText = Array.isArray(item.contacts) ? item.contacts.map(c => {
        const phonesList = Array.isArray(c.phones) ? c.phones.map(p => p.number || '').join(' ') : (c.phone || '');
        return `${c.fullName || ''} ${c.position || ''} ${phonesList}`;
      }).join(' ') : '';
      const textToSearch = `${item.name} ${item.country} ${item.city || ''} ${item.address} ${item.type} ${servicesText} ${item.workRules || ''} ${item.specialNotes || ''} ${contactsText}`.toLowerCase();
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

    // Копіювання адреси в 1 клік
    const copyAddrBtn = e.target.closest('.copy-address-btn');
    if (copyAddrBtn) {
      const addr = copyAddrBtn.getAttribute('data-copy');
      copyToClipboard(addr, 'Адресу складу скопійовано');
      return;
    }

    // Копіювання / відкриття соцмережі контакту
    const copySocialBtn = e.target.closest('.copy-social-btn');
    if (copySocialBtn) {
      const socialVal = copySocialBtn.getAttribute('data-copy');
      const socialType = copySocialBtn.getAttribute('data-social-type') || 'Контакт';
      if (socialVal) {
        copyToClipboard(socialVal, `${socialType} (${socialVal}) скопійовано`);
      }
      return;
    }

    // Швидке відкриття модалки "Інструкція" з рядка
    const openInstrBtn = e.target.closest('.open-instructions-btn');
    if (openInstrBtn) {
      const whId = openInstrBtn.getAttribute('data-id');
      const wh = warehousesData.find(w => w.id === whId);
      if (wh) {
        const titleEl = document.getElementById('modal-instructions-wh-name');
        const contentEl = document.getElementById('modal-instructions-content');
        const copyModalBtn = document.getElementById('btn-copy-modal-instructions');
        if (titleEl) titleEl.textContent = `Інструкція з відправки — ${wh.name}`;
        if (contentEl) contentEl.textContent = wh.shippingInstructions || 'Інструкція відсутня.';
        if (copyModalBtn) copyModalBtn.setAttribute('data-copy', wh.shippingInstructions || '');
        openModal('modal-shipping-instructions');
      }
      return;
    }

    // Пряме копіювання інструкції в 1 клік
    const copyInstrDirectBtn = e.target.closest('.copy-instructions-direct-btn');
    if (copyInstrDirectBtn) {
      const whId = copyInstrDirectBtn.getAttribute('data-id');
      const wh = warehousesData.find(w => w.id === whId);
      if (wh && wh.shippingInstructions) {
        copyToClipboard(wh.shippingInstructions, `Інструкцію для "${wh.name}" скопійовано`);
      }
      return;
    }

    // Клік на назву складу (якщо немає зовнішнього посилання) -> відкрити редагування
    const quickEditNameBtn = e.target.closest('.quick-edit-name-btn');
    if (quickEditNameBtn) {
      const whId = quickEditNameBtn.getAttribute('data-id');
      openEditWarehouseForm(whId);
      return;
    }

    // Швидкий перехід до управління прайс-листом із рядка таблиці (Блок 2.2)
    const quickOpenTariffsBtn = e.target.closest('.quick-open-tariffs-btn');
    if (quickOpenTariffsBtn) {
      const whId = quickOpenTariffsBtn.getAttribute('data-id');
      const mode = quickOpenTariffsBtn.getAttribute('data-mode') || 'document';
      openEditWarehouseForm(whId);
      setTimeout(() => {
        switchTariffMode(mode);
        const panel = document.getElementById(mode === 'text' ? 'tariff-panel-text' : 'tariff-panel-document');
        panel?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
      return;
    }

    // Перемикання вкладок у блоці 7 "Управління прайс-листом" (Документи / Вставка тексту)
    const tariffModeBtn = e.target.closest('.tariff-mode-tab');
    if (tariffModeBtn) {
      const mode = tariffModeBtn.getAttribute('data-tariff-mode') || 'document';
      switchTariffMode(mode);
      return;
    }

    // Додавання телефону в картці контакту
    const addPhoneBtn = e.target.closest('.btn-add-phone-row');
    if (addPhoneBtn) {
      const contactId = addPhoneBtn.getAttribute('data-contact-id');
      if (contactId) addPhoneBlock(contactId);
      return;
    }

    // Додавання соцмережі до конкретного телефону
    const addSocialBtn = e.target.closest('.btn-add-phone-social');
    if (addSocialBtn) {
      const phoneId = addSocialBtn.getAttribute('data-phone-id');
      if (phoneId) addSocialToPhone(phoneId);
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


  // Слухач зміни дати останнього Arrival у формі (Кейс 1.2)
  document.getElementById('input-last-arrival-date')?.addEventListener('change', (e) => {
    updateFormMdStatusPreview(e.target.value);
  });

  // Пошук підрядника (Searchable Combobox) + Smart Create у формі складу
  const contractorSearchInput = document.getElementById('input-contractor-search');
  const btnClearContractor = document.getElementById('btn-clear-contractor');
  const btnToggleContractorMenu = document.getElementById('btn-toggle-contractor-menu');
  const contractorDropdownMenu = document.getElementById('contractor-dropdown-menu');
  const formCreateContractor = document.getElementById('form-create-contractor');

  contractorSearchInput?.addEventListener('focus', () => {
    openContractorDropdownMenu(contractorSearchInput.value);
  });

  contractorSearchInput?.addEventListener('click', () => {
    openContractorDropdownMenu(contractorSearchInput.value);
  });

  contractorSearchInput?.addEventListener('input', (e) => {
    const val = e.target.value;
    const exact = contractorsDirectory.find(c => c.name.toLowerCase() === val.trim().toLowerCase());
    selectedContractorValue = exact ? exact.name : '';
    updateContractorBadgeAndClearBtn();
    openContractorDropdownMenu(val);
  });

  contractorSearchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeContractorDropdownMenu();
      return;
    }
    if (e.key === 'Enter') {
      const q = (contractorSearchInput.value || '').trim();
      if (!q) return;
      const exact = contractorsDirectory.find(c => c.name.toLowerCase() === q.toLowerCase());
      if (exact) {
        e.preventDefault();
        setContractorValue(exact.name, true);
      } else {
        e.preventDefault();
        openCreateContractorModalWithPrefill(q);
      }
    }
  });

  btnClearContractor?.addEventListener('click', (e) => {
    e.stopPropagation();
    setContractorValue('');
    openContractorDropdownMenu('');
    contractorSearchInput?.focus();
  });

  btnToggleContractorMenu?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = contractorDropdownMenu?.classList.contains('hidden');
    if (isHidden) {
      openContractorDropdownMenu(contractorSearchInput?.value || '');
      contractorSearchInput?.focus();
    } else {
      closeContractorDropdownMenu();
    }
  });

  contractorDropdownMenu?.addEventListener('click', (e) => {
    const optionBtn = e.target.closest('.contractor-option-item');
    if (optionBtn) {
      const name = optionBtn.getAttribute('data-select-contractor') || '';
      setContractorValue(name, true);
      return;
    }

    const createBtn = e.target.closest('.btn-smart-create-contractor');
    if (createBtn) {
      const prefill = createBtn.getAttribute('data-create-contractor-name') || contractorSearchInput?.value.trim() || '';
      openCreateContractorModalWithPrefill(prefill);
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#contractor-combobox-wrapper')) {
      closeContractorDropdownMenu();
    }
  });

  formCreateContractor?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInp = document.getElementById('input-new-contractor-name');
    const newContractorName = nameInp?.value.trim() || '';
    if (!newContractorName) return;

    const newCountry = document.getElementById('select-new-contractor-country')?.value || 'Україна';
    const newTaxId = document.getElementById('input-new-contractor-tax-id')?.value.trim() || '';
    const newContact = document.getElementById('input-new-contractor-contact')?.value.trim() || '';
    const newPhone = document.getElementById('input-new-contractor-phone')?.value.trim() || '';
    const newEmail = document.getElementById('input-new-contractor-email')?.value.trim() || '';
    const newNotes = document.getElementById('input-new-contractor-notes')?.value.trim() || '';

    const existingIdx = contractorsDirectory.findIndex(
      c => c.name.toLowerCase() === newContractorName.toLowerCase()
    );

    if (existingIdx === -1) {
      contractorsDirectory.unshift({
        name: newContractorName,
        country: newCountry,
        taxId: newTaxId,
        contact: newContact,
        phone: newPhone,
        email: newEmail,
        notes: newNotes
      });
    } else {
      contractorsDirectory[existingIdx] = {
        ...contractorsDirectory[existingIdx],
        country: newCountry || contractorsDirectory[existingIdx].country,
        taxId: newTaxId || contractorsDirectory[existingIdx].taxId,
        contact: newContact || contractorsDirectory[existingIdx].contact
      };
    }

    setContractorValue(newContractorName, true);
    closeModal('modal-create-contractor');
    formCreateContractor.reset();
    showToast(`Підрядника «${newContractorName}» створено та обрано`);
  });

  document.getElementById('btn-create')?.addEventListener('click', () => {
    activeTargetWarehouseId = null;
    if (formWarehouseId) formWarehouseId.value = '';
    if (modalWarehouseTitle) modalWarehouseTitle.textContent = 'Створити склад';
    if (formSubmitText) formSubmitText.textContent = 'Створити склад';

    if (inputWarehouseName) inputWarehouseName.value = '';
    setContractorValue('');

    // Встановлюємо дефолтне значення "Власні"
    updateCustomDropdown('select-warehouse-type', 'Власні');

    const inputVolume = document.getElementById('input-warehouse-volume');
    if (inputVolume) inputVolume.value = '';

    const lastArrivalInput = document.getElementById('input-last-arrival-date');
    const todayIso = new Date().toISOString().split('T')[0];
    if (lastArrivalInput) lastArrivalInput.value = todayIso;
    updateFormMdStatusPreview(todayIso);

    if (selectWarehouseStatus) selectWarehouseStatus.value = 'active';

    const contactsContainer = document.getElementById('contacts-repeater-container');
    if (contactsContainer) {
      contactsContainer.innerHTML = '';
      createContactRow({ isPrimary: true });
    }

    const tariffDocsList = document.getElementById('tariff-documents-list');
    if (tariffDocsList) tariffDocsList.innerHTML = '';

    const textInput = document.getElementById('input-warehouse-tariff-text');
    const textValidUntil = document.getElementById('input-warehouse-tariff-text-valid-until');
    if (textInput) textInput.value = '';
    if (textValidUntil) textValidUntil.value = '';

    currentFormTariffType = 'document';
    syncActiveTariffState('document');
    switchTariffMode('document');
    updateTariffCountersAndEmptyState();

    const macroSearchInp = document.getElementById('macro-service-search');
    if (macroSearchInp) macroSearchInp.value = '';
    // По дефолту послуги не вибрані з червоним хрестиком
    renderFormMacroServicesCards([], [], {});

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

    syncContractorsFromWarehouses();
    setContractorValue(item.contractor || '');

    const typeValue = item.type || 'Власні';
    updateCustomDropdown('select-warehouse-type', typeValue);

    const volumeInput = document.getElementById('input-warehouse-volume');
    if (volumeInput) volumeInput.value = item.volume || '';

    const lastArrivalInput = document.getElementById('input-last-arrival-date');
    if (lastArrivalInput) lastArrivalInput.value = item.lastArrivalDate || '';
    updateFormMdStatusPreview(item.lastArrivalDate || '');

    if (selectWarehouseStatus) selectWarehouseStatus.value = item.status || 'active';

    // 3. Заповнюємо адресу
    const countrySelect = document.getElementById('select-warehouse-country');
    if (countrySelect) countrySelect.value = item.country || '';

    const cityInput = document.getElementById('input-warehouse-city');
    if (cityInput) cityInput.value = item.city || '';

    const addressInput = document.getElementById('input-warehouse-address');
    if (addressInput) addressInput.value = item.address || '';

    // 4. Правила прийому та примітки
    const rulesInput = document.getElementById('input-warehouse-rules');
    if (rulesInput) rulesInput.value = item.workRules || '';

    const notesInput = document.getElementById('input-warehouse-notes');
    if (notesInput) notesInput.value = item.specialNotes || '';

    // 4.1 Графік роботи
    const defaultSchedule = {
      Mon: '09:00 - 18:00',
      Tue: '09:00 - 18:00',
      Wed: '09:00 - 18:00',
      Thu: '09:00 - 18:00',
      Fri: '09:00 - 18:00',
      Sat: '10:00 - 15:00',
      Sun: 'Вихідний'
    };
    const sched = item.schedule || defaultSchedule;
    document.querySelectorAll('#working-schedule-grid [data-day]').forEach(dayElem => {
      const day = dayElem.getAttribute('data-day');
      const val = sched[day] || '09:00 - 18:00';
      const isOff = val.toLowerCase() === 'вихідний';
      const offCb = dayElem.querySelector('.schedule-off');
      const timeInp = dayElem.querySelector('.schedule-time');
      if (offCb) offCb.checked = isOff;
      if (timeInp) {
        timeInp.disabled = isOff;
        timeInp.value = isOff ? '' : val;
      }
    });

    // 5. Оновлення стану складу консолідації та інструкцій
    const isConsolidation = !!item.isConsolidation;
    if (checkIsConsolidation) checkIsConsolidation.checked = isConsolidation;
    updateInstructionsVisibility();

    if (instructionsInput) {
      instructionsInput.value = item.shippingInstructions || '';
    }

    // 6. Відновлюємо обрані сверхпослуги та наочний перелік послуг у них (червоні хрестики для не вибраних, зелені для обраних)
    const macroSearchInp = document.getElementById('macro-service-search');
    if (macroSearchInp) macroSearchInp.value = '';
    renderFormMacroServicesCards(item.services || [], item.selectedSubServices || [], item.customSubServices || {});

    // 7. Перерендеримо контакти (Блок 2.1: вибір головного менеджера)
    const contactsContainer = document.getElementById('contacts-repeater-container');
    if (contactsContainer) contactsContainer.innerHTML = '';
    if (Array.isArray(item.contacts) && item.contacts.length > 0) {
      item.contacts.forEach(c => createContactRow(c));
    } else {
      createContactRow({ isPrimary: true });
    }

    // 8. Перерендеримо тарифи (Документи та Текстовий тариф — Блок 2.2)
    const tariffDocsList = document.getElementById('tariff-documents-list');
    if (tariffDocsList) tariffDocsList.innerHTML = '';
    if (Array.isArray(item.tariffDocuments) && item.tariffDocuments.length > 0) {
      item.tariffDocuments.forEach(doc => createTariffDocumentRow(doc));
    }

    const textInput = document.getElementById('input-warehouse-tariff-text');
    const textValidUntil = document.getElementById('input-warehouse-tariff-text-valid-until');
    if (textInput) textInput.value = item.tariffText || '';
    if (textValidUntil) textValidUntil.value = item.tariffTextValidUntil || '';

    // Визначаємо активний тип тарифу (Взаємозамінність Блок 2.2)
    const hasDocs = Array.isArray(item.tariffDocuments) && item.tariffDocuments.length > 0;
    const hasText = !!(item.tariffText && item.tariffText.trim());
    const determinedTariffType = item.tariffType || (hasDocs && item.tariffDocuments.some(d => d.isActive !== false) ? 'document' : (hasText ? 'text' : 'document'));
    currentFormTariffType = determinedTariffType;
    syncActiveTariffState(determinedTariffType);
    switchTariffMode(determinedTariffType);
    updateTariffCountersAndEmptyState();

    // 9. ВІДКРИВАЄМО МОДАЛЬНЕ ВІКНО
    openModal('modal-create');
  }

  document.getElementById('btn-copy-modal-instructions')?.addEventListener('click', (e) => {
    const text = e.currentTarget.getAttribute('data-copy') || '';
    copyToClipboard(text, 'Інструкцію з відправки скопійовано');
  });

  formCreateWarehouse?.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = formWarehouseId?.value;
    const newName = inputWarehouseName?.value.trim();
    const newContractor = document.getElementById('input-contractor-search')?.value.trim() || '';
    const newCountry = selectWarehouseCountry?.value;
    const newAddress = inputWarehouseAddress?.value.trim();
    const rawType = selectWarehouseType?.value;
    const newType = (rawType === 'Власні' || rawType === 'Difreight') ? 'Difreight' : 'Партнерський';
    const rawVol = document.getElementById('input-warehouse-volume')?.value;
    const newVolume = rawVol && parseFloat(rawVol) > 0 ? parseFloat(rawVol) : null;
    const lastArrivalDate = document.getElementById('input-last-arrival-date')?.value || '';
    const isConsolidation = checkIsConsolidation?.checked || false;
    const isFulfillment = document.getElementById('fulfillment-check')?.checked || false;
    const workRules = document.getElementById('input-warehouse-rules')?.value.trim() || '';
    const specialNotes = document.getElementById('input-warehouse-notes')?.value.trim() || '';
    const shippingInstructions = document.getElementById('input-shipping-instructions')?.value.trim() || '';

    // Збір обраних детальних послуг та активних сверхпослуг
    const selectedSubServices = [];
    const selectedServices = [];

    document.querySelectorAll('.macro-service-card').forEach(card => {
      const macroName = card.getAttribute('data-macro-name');
      if (!macroName) return;

      const selectedPills = card.querySelectorAll('.macro-subservice-pill[data-selected="true"]');
      const macroCb = card.querySelector('.service-macro-checkbox');

      selectedPills.forEach(pill => {
        const subName = pill.getAttribute('data-subservice-name');
        if (subName) selectedSubServices.push(subName);
      });

      // Сверхпослуга вважається активною, якщо обрано хоча б одну послугу або увімкнено її чекбокс
      if (selectedPills.length > 0 || (macroCb && macroCb.checked)) {
        selectedServices.push(macroName);
      }
    });

    const schedule = {};
    document.querySelectorAll('#working-schedule-grid [data-day]').forEach(dayElem => {
      const day = dayElem.getAttribute('data-day');
      const isOff = dayElem.querySelector('.schedule-off')?.checked;
      const time = dayElem.querySelector('.schedule-time')?.value || '';
      schedule[day] = isOff ? 'Вихідний' : time;
    });

    // Збір контактів (Блок 2.1: вибір головного менеджера через чекбокс)
    const contacts = Array.from(document.querySelectorAll('.contact-card')).map(card => {
      const isPrimary = !!card.querySelector('.contact-is-primary-checkbox')?.checked;
      const phones = Array.from(card.querySelectorAll('.phone-item')).map(pItem => {
        const number = pItem.querySelector('.phone-number')?.value.trim() || '';
        const socials = Array.from(pItem.querySelectorAll('.social-item')).map(s => ({
          type: s.querySelector('.social-type')?.value,
          value: s.querySelector('.social-value')?.value.trim()
        })).filter(s => s.value);

        return {
          number: number,
          socials: socials
        };
      }).filter(p => p.number || p.socials.length > 0);

      const firstPhone = phones[0]?.number || '';

      return {
        fullName: card.querySelector('.contact-fullname')?.value.trim(),
        position: card.querySelector('.contact-position')?.value.trim(),
        email: card.querySelector('.contact-email')?.value.trim(),
        comment: card.querySelector('.contact-comment')?.value.trim(),
        phone: firstPhone,
        phones: phones,
        isPrimary: isPrimary
      };
    }).filter(c => c.fullName || c.position || c.email || c.comment || c.phones.length > 0);

    // Якщо є хоча б один контакт, гарантуємо наявність одного головного менеджера
    if (contacts.length > 0 && !contacts.some(c => c.isPrimary)) {
      contacts[0].isPrimary = true;
    }

    // Збір документів прайс-листів (Блок 2.2: Взаємозамінність)
    const isTextActive = currentFormTariffType === 'text';
    const tariffDocuments = Array.from(document.querySelectorAll('.tariff-doc-item')).map(docEl => ({
      id: docEl.getAttribute('data-doc-id') || `doc-${Date.now()}`,
      name: docEl.getAttribute('data-doc-name') || 'Прайс-лист',
      size: docEl.getAttribute('data-doc-size') || '',
      uploadedAt: docEl.getAttribute('data-doc-date') || new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      validUntil: docEl.querySelector('.tariff-doc-valid-until')?.value || '',
      isActive: isTextActive ? false : (docEl.getAttribute('data-doc-active') === 'true'),
      dataUrl: docEl.getAttribute('data-doc-url') || '',
      comment: docEl.querySelector('.tariff-doc-comment')?.value.trim() || ''
    }));

    // Збір текстового тарифу (Блок 2.2)
    const tariffText = document.getElementById('input-warehouse-tariff-text')?.value.trim() || '';
    const tariffTextValidUntil = document.getElementById('input-warehouse-tariff-text-valid-until')?.value || '';

    if (id) {
      const index = warehousesData.findIndex(w => w.id === id);
      if (index !== -1) {
        const prevStatus = warehousesData[index].status;
        const nextStatus = prevStatus === 'archived' ? 'archived' : prevStatus;

        warehousesData[index] = {
          ...warehousesData[index],
          name: newName || warehousesData[index].name,
          contractor: newContractor || warehousesData[index].contractor,
          country: newCountry || warehousesData[index].country,
          flag: countryFlags[newCountry] || warehousesData[index].flag || '🌐',
          address: newAddress || warehousesData[index].address,
          type: newType,
          isConsolidation: isConsolidation,
          volume: newVolume,
          lastArrivalDate: lastArrivalDate || warehousesData[index].lastArrivalDate,
          services: selectedServices,
          selectedSubServices: selectedSubServices,
          customSubServices: warehousesData[index].customSubServices || {},
          workRules: workRules,
          specialNotes: specialNotes,
          schedule: schedule,
          contacts: contacts,
          tariffs: [],
          tariffType: currentFormTariffType,
          tariffDocuments: tariffDocuments,
          tariffText: tariffText,
          tariffTextValidUntil: tariffTextValidUntil,
          shippingInstructions: shippingInstructions,
          status: nextStatus,
          isFulfillment: isFulfillment
        };
      }
    } else {
      const newWarehouse = {
        id: `wh-${Date.now()}`,
        name: newName,
        contractor: newContractor,
        country: newCountry,
        flag: countryFlags[newCountry] || '🌐',
        address: newAddress,
        type: newType,
        isConsolidation: isConsolidation,
        volume: newVolume,
        occupiedVolume: 0,
        expectedVolume: 0,
        activeArrives: 0,
        expectedSubflights: 0,
        lastArrivalDate: lastArrivalDate || new Date().toISOString().split('T')[0],
        services: selectedServices,
        selectedSubServices: selectedSubServices,
        customSubServices: {},
        workRules: workRules,
        specialNotes: specialNotes,
        schedule: schedule,
        contacts: contacts,
        tariffs: [],
        tariffType: currentFormTariffType,
        tariffDocuments: tariffDocuments,
        tariffText: tariffText,
        tariffTextValidUntil: tariffTextValidUntil,
        shippingInstructions: shippingInstructions,
        status: 'inactive',
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
    const todayStr = new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  // Допоміжна функція: Додавання соцмережі до конкретного телефону
  function addSocialToPhone(phoneId, type = 'Telegram', value = '') {
    const container = document.getElementById(`phone-socials-container-${phoneId}`);
    if (!container) return;

    const socialId = `social-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const socialHtml = `
    <div id="${socialId}" class="social-item flex items-center gap-1.5">
      <select class="social-type bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 w-28 shrink-0 font-medium focus:border-brand-500 focus:outline-none">
        <option value="Telegram" ${type === 'Telegram' ? 'selected' : ''}>Telegram</option>
        <option value="Viber" ${type === 'Viber' ? 'selected' : ''}>Viber</option>
        <option value="WhatsApp" ${type === 'WhatsApp' ? 'selected' : ''}>WhatsApp</option>
        <option value="WeChat" ${type === 'WeChat' ? 'selected' : ''}>WeChat</option>
        <option value="LinkedIn" ${type === 'LinkedIn' ? 'selected' : ''}>LinkedIn</option>
        <option value="Інше" ${type === 'Інше' ? 'selected' : ''}>Інше</option>
      </select>
      <input type="text" placeholder="@username або номер/посилання" value="${(value || '').replace(/"/g, '&quot;')}" class="social-value flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:border-brand-500 focus:outline-none">
      <button type="button" onclick="document.getElementById('${socialId}').remove()" class="text-slate-300 hover:text-rose-500 p-1 transition cursor-pointer" title="Видалити соцмережу">
        <i class="fa-solid fa-trash-can text-xs"></i>
      </button>
    </div>
  `;
    container.insertAdjacentHTML('beforeend', socialHtml);
  }

  // Допоміжна функція: Додавання блоку телефону до картки особи
  function addPhoneBlock(contactId, phoneData = {}) {
    const container = document.getElementById(`phones-container-${contactId}`);
    if (!container) return;

    const phoneId = `phone-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const phoneNumber = phoneData.number || (typeof phoneData === 'string' ? phoneData : '') || '';

    const html = `
    <div id="${phoneId}" class="phone-item bg-slate-50/90 p-2.5 rounded-lg border border-slate-200 space-y-2 relative shadow-2xs">
      <div class="flex items-center justify-between gap-2">
        <div class="flex-1">
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">
            <i class="fa-solid fa-phone text-brand-500 mr-1"></i> Номер телефону
          </label>
          <input type="tel" placeholder="+380..." value="${phoneNumber.replace(/"/g, '&quot;')}" class="phone-number w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none transition">
        </div>
        <button type="button" onclick="document.getElementById('${phoneId}').remove()" class="text-slate-300 hover:text-rose-500 p-1.5 transition cursor-pointer mt-4" title="Видалити телефон">
          <i class="fa-solid fa-trash-can text-xs"></i>
        </button>
      </div>

      <!-- Прив'язані соцмережі саме до цього номера -->
      <div class="pt-1.5 border-t border-slate-200/70 space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <i class="fa-solid fa-share-nodes text-[10px] text-slate-400"></i> Соцмережі до цього телефону
          </span>
          <button type="button" data-phone-id="${phoneId}" class="btn-add-phone-social text-[11px] text-brand-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer">
            <i class="fa-solid fa-plus text-[9px]"></i> Додати соцмережу
          </button>
        </div>
        <div id="phone-socials-container-${phoneId}" class="space-y-1.5">
          <!-- Соцмережі до цього телефону -->
        </div>
      </div>
    </div>
    `;

    container.insertAdjacentHTML('beforeend', html);

    // Додаємо соцмережі телефону
    const socials = Array.isArray(phoneData.socials) ? phoneData.socials : [];
    if (socials.length > 0) {
      socials.forEach(s => addSocialToPhone(phoneId, s.type, s.value));
    } else {
      addSocialToPhone(phoneId);
    }
  }

  // 1. Динамічне додавання контактних осіб (Блок 2.1: вибір головного менеджера через чекбокс)
  function createContactRow(contact = {}) {
    const container = document.getElementById('contacts-repeater-container');
    if (!container) return;

    const contactId = `contact-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const isFirst = container.querySelectorAll('.contact-card').length === 0;
    const isPrimary = (contact.isPrimary === true) || (isFirst && contact.isPrimary !== false);

    const html = `
    <div id="${contactId}" class="contact-card bg-white p-3.5 rounded-xl border border-slate-200 space-y-3 relative shadow-2xs">
      
      <!-- Верхня плашка: Чекбокс вибору головного менеджера (Блок 2.1) + Кнопка видалення -->
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <label class="inline-flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-amber-50/80 px-2.5 py-1 rounded-lg border border-slate-200 transition select-none group/primary">
          <input type="checkbox" class="contact-is-primary-checkbox rounded border-slate-300 text-amber-500 focus:ring-amber-400 cursor-pointer" ${isPrimary ? 'checked' : ''}>
          <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5 group-hover/primary:text-amber-800">
            <i class="fa-solid fa-star text-amber-500 text-[11px]"></i> Головний менеджер для комунікації
          </span>
        </label>
        <button type="button" class="btn-remove-contact-card text-slate-400 hover:text-rose-600 transition cursor-pointer p-1" title="Видалити контакт">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>

      <!-- Рядок 1: Зв'язок Посадова особа -> Посада -->
      <div class="grid grid-cols-1 sm:grid-cols-11 gap-2 items-end">
        <div class="sm:col-span-5">
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Посадова особа (ПІБ)</label>
          <input type="text" placeholder="Іван Іванов" value="${(contact.fullName || '').replace(/"/g, '&quot;')}" class="contact-fullname w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:bg-white focus:border-brand-500 focus:outline-none transition">
        </div>
        <div class="hidden sm:flex sm:col-span-1 items-center justify-center pb-2 text-slate-400" title="Зв'язок: Посадова особа → Посада">
          <i class="fa-solid fa-arrow-right text-xs text-brand-500"></i>
        </div>
        <div class="sm:col-span-5">
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Посада</label>
          <input type="text" list="contact-positions-list" placeholder="Оберіть або введіть посаду (напр. Комірник)" value="${(contact.position || '').replace(/"/g, '&quot;')}" class="contact-position w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:bg-white focus:border-brand-500 focus:outline-none transition">
        </div>
      </div>

      <!-- Рядок 2: Електронна пошта та Коментар -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Електронна пошта</label>
          <input type="email" placeholder="example@mail.com" value="${(contact.email || '').replace(/"/g, '&quot;')}" class="contact-email w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:bg-white focus:border-brand-500 focus:outline-none transition">
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Коментар (зона відповідальності, питання, зміни)</label>
          <input type="text" placeholder="Відповідає за негабарит, фотозвіти тощо..." value="${(contact.comment || '').replace(/"/g, '&quot;')}" class="contact-comment w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:bg-white focus:border-brand-500 focus:outline-none transition">
        </div>
      </div>

      <!-- Блок Телефонів з прив'язаними соцмережами до кожного телефону -->
      <div class="bg-slate-50/60 p-2.5 rounded-lg border border-slate-200/80 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
            <i class="fa-solid fa-phone-volume text-brand-600 text-xs"></i> Телефони та соцмережі
          </span>
          <button type="button" data-contact-id="${contactId}" class="btn-add-phone-row text-[11px] text-brand-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer">
            <i class="fa-solid fa-plus text-[9px]"></i> Додати телефон
          </button>
        </div>
        <div id="phones-container-${contactId}" class="space-y-2">
          <!-- Блоки телефонів будуть додаватися сюди -->
        </div>
      </div>
    </div>
  `;

    container.insertAdjacentHTML('beforeend', html);

    const cardEl = document.getElementById(contactId);
    const primaryCheckbox = cardEl.querySelector('.contact-is-primary-checkbox');

    // Логіка перемикання головного менеджера (тільки один контакт може бути головним)
    primaryCheckbox?.addEventListener('change', () => {
      if (primaryCheckbox.checked) {
        container.querySelectorAll('.contact-is-primary-checkbox').forEach(cb => {
          if (cb !== primaryCheckbox) cb.checked = false;
        });
      }
    });

    // Видалення контакту із передачею статусу головного, якщо видалений був головним
    cardEl.querySelector('.btn-remove-contact-card')?.addEventListener('click', () => {
      const wasPrimary = primaryCheckbox?.checked;
      cardEl.remove();
      if (wasPrimary) {
        const firstRemaining = container.querySelector('.contact-is-primary-checkbox');
        if (firstRemaining) firstRemaining.checked = true;
      }
    });

    // Нормалізуємо телефони (підтримуємо як новий масив phones, так і legacy phone + socials)
    let phonesList = [];
    if (Array.isArray(contact.phones) && contact.phones.length > 0) {
      phonesList = contact.phones;
    } else if (contact.phone || (Array.isArray(contact.socials) && contact.socials.length > 0)) {
      phonesList = [
        {
          number: contact.phone || '',
          socials: contact.socials || []
        }
      ];
    }

    if (phonesList.length > 0) {
      phonesList.forEach(p => addPhoneBlock(contactId, p));
    } else {
      addPhoneBlock(contactId);
    }
  }

  // 2. Управління прайс-листом підрядника (Блок 2.2): Документи + Текстовий тариф
  function evaluateValidity(dateStr) {
    if (!dateStr) {
      return {
        status: 'missing',
        diffDays: null,
        text: 'Вкажіть термін дії *',
        classNames: 'bg-rose-50 text-rose-700 border-rose-300 font-semibold',
        icon: 'fa-solid fa-circle-exclamation text-rose-500'
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dateStr.split('-');
    if (parts.length < 3) {
      return {
        status: 'missing',
        diffDays: null,
        text: 'Некоректна дата',
        classNames: 'bg-rose-50 text-rose-700 border-rose-300',
        icon: 'fa-solid fa-circle-exclamation'
      };
    }

    const targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    targetDate.setHours(0, 0, 0, 0);

    const diffMs = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const formattedDate = targetDate.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });

    if (diffDays < 0) {
      return {
        status: 'expired',
        diffDays: diffDays,
        text: `Термін закінчився (${formattedDate})`,
        classNames: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
        icon: 'fa-solid fa-circle-xmark text-rose-600'
      };
    } else if (diffDays <= 7) {
      const dayWord = diffDays === 0 ? 'сьогодні' : `${diffDays} дн.`;
      return {
        status: 'expiring',
        diffDays: diffDays,
        text: `Спливає через ${dayWord} (${formattedDate})`,
        classNames: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
        icon: 'fa-solid fa-triangle-exclamation text-amber-600'
      };
    } else {
      return {
        status: 'valid',
        diffDays: diffDays,
        text: `Дійсний до ${formattedDate}`,
        classNames: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
        icon: 'fa-solid fa-circle-check text-emerald-600'
      };
    }
  }

  function renderValidityBadgeHtml(dateStr) {
    const v = evaluateValidity(dateStr);
    return `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] border ${v.classNames} shadow-2xs">
      <i class="${v.icon}"></i> <span>${v.text}</span>
    </span>`;
  }

  let currentFormTariffType = 'document';

  function switchTariffMode(mode = 'document') {
    const docPanel = document.getElementById('tariff-panel-document');
    const textPanel = document.getElementById('tariff-panel-text');
    const tabs = document.querySelectorAll('.tariff-mode-tab');

    tabs.forEach(tab => {
      const tabMode = tab.getAttribute('data-tariff-mode');
      if (tabMode === mode) {
        tab.classList.add('bg-white', 'text-teal-700', 'shadow-2xs', 'font-semibold');
        tab.classList.remove('text-slate-600', 'font-medium');
      } else {
        tab.classList.remove('bg-white', 'text-teal-700', 'shadow-2xs', 'font-semibold');
        tab.classList.add('text-slate-600', 'font-medium');
      }
    });

    if (mode === 'text') {
      docPanel?.classList.add('hidden');
      textPanel?.classList.remove('hidden');
    } else {
      textPanel?.classList.add('hidden');
      docPanel?.classList.remove('hidden');
    }
  }

  function syncActiveTariffState(type = 'document', hintDocName = '') {
    currentFormTariffType = type;
    const bannerLabel = document.getElementById('tariff-active-indicator-label');
    const textActiveBadge = document.getElementById('tariff-text-active-badge');
    const docItems = document.querySelectorAll('#tariff-documents-list .tariff-doc-item');

    if (type === 'document') {
      // Знаходимо документ, який має бути активним
      let activeItem = null;
      docItems.forEach((item) => {
        if (item.getAttribute('data-doc-active') === 'true') {
          if (!activeItem) activeItem = item;
          else item.setAttribute('data-doc-active', 'false');
        }
      });
      if (!activeItem && docItems.length > 0) {
        activeItem = docItems[0];
        activeItem.setAttribute('data-doc-active', 'true');
      }

      docItems.forEach(item => {
        const isAct = item === activeItem;
        item.setAttribute('data-doc-active', isAct ? 'true' : 'false');
        item.className = `tariff-doc-item p-3.5 rounded-xl border transition shadow-2xs space-y-2.5 ${isAct ? 'bg-white border-emerald-400 ring-1 ring-emerald-300' : 'bg-slate-50 border-slate-200'}`;
        const badgeWrap = item.querySelector('.tariff-doc-status-badge');
        if (badgeWrap) {
          badgeWrap.innerHTML = isAct
            ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1 shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Активний прайс-лист</span>`
            : `<span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200/70 text-slate-600 border border-slate-300/60 inline-flex items-center gap-1"><i class="fa-solid fa-box-archive text-[9px] text-slate-400"></i> Неактивний (архів)</span>`;
        }
        item.querySelector('.btn-activate-tariff-doc')?.remove();
      });

      const activeName = activeItem?.getAttribute('data-doc-name') || hintDocName || (docItems.length > 0 ? docItems[0].getAttribute('data-doc-name') : '');
      if (bannerLabel) {
        bannerLabel.innerHTML = activeName
          ? `<span class="font-bold text-teal-800">Файл:</span> <span class="font-medium underline">${activeName}</span>`
          : `<span class="text-slate-500 font-normal">Файли ще не завантажені</span>`;
      }

      if (textActiveBadge) {
        textActiveBadge.className = 'px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1';
        textActiveBadge.innerHTML = '⚪ Неактивний (діє завантажений файл)';
      }
    } else {
      // Текстовий тариф є єдиним діючим
      docItems.forEach(item => {
        item.setAttribute('data-doc-active', 'false');
        item.className = 'tariff-doc-item p-3.5 rounded-xl border transition shadow-2xs space-y-2.5 bg-slate-50 border-slate-200';
        const badgeWrap = item.querySelector('.tariff-doc-status-badge');
        if (badgeWrap) {
          badgeWrap.innerHTML = `<span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200/70 text-slate-600 border border-slate-300/60 inline-flex items-center gap-1"><i class="fa-solid fa-box-archive text-[9px] text-slate-400"></i> Неактивний (архів)</span>`;
        }
        item.querySelector('.btn-activate-tariff-doc')?.remove();
      });

      if (bannerLabel) {
        bannerLabel.innerHTML = `<span class="font-bold text-teal-800">Текстовий тариф підрядника</span> <span class="text-[10px] text-teal-600">(всі завантажені файли — в архіві)</span>`;
      }

      if (textActiveBadge) {
        textActiveBadge.className = 'px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1 shadow-2xs';
        textActiveBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Активний діючий тариф (текстовий)';
      }
    }

    updateTariffCountersAndEmptyState();
  }

  function updateTariffCountersAndEmptyState() {
    const docCount = document.querySelectorAll('#tariff-documents-list .tariff-doc-item').length;
    const docBadge = document.getElementById('doc-tariffs-count-badge');
    const emptyDocs = document.getElementById('tariff-documents-empty');

    const textInput = document.getElementById('input-warehouse-tariff-text');
    const textBadge = document.getElementById('text-tariffs-count-badge');
    const textValidUntil = document.getElementById('input-warehouse-tariff-text-valid-until');
    const textBadgeContainer = document.getElementById('tariff-text-validity-badge-container');

    if (docBadge) docBadge.textContent = docCount;
    if (emptyDocs) {
      if (docCount === 0) emptyDocs.classList.remove('hidden');
      else emptyDocs.classList.add('hidden');
    }

    const textLen = textInput?.value?.trim()?.length || 0;
    if (textBadge) textBadge.textContent = textLen > 0 ? '1' : '0';

    if (textBadgeContainer && textValidUntil) {
      if (textValidUntil.value || textLen > 0) {
        textBadgeContainer.innerHTML = renderValidityBadgeHtml(textValidUntil.value);
        textBadgeContainer.classList.remove('hidden');
      } else {
        textBadgeContainer.innerHTML = '';
        textBadgeContainer.classList.add('hidden');
      }
    }
  }

  function getFileIconByExt(fileName = '') {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return 'fa-file-pdf text-rose-500 bg-rose-50 border-rose-200';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'fa-file-excel text-emerald-600 bg-emerald-50 border-emerald-200';
    if (['doc', 'docx'].includes(ext)) return 'fa-file-word text-blue-600 bg-blue-50 border-blue-200';
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return 'fa-file-image text-purple-600 bg-purple-50 border-purple-200';
    return 'fa-file-invoice-dollar text-teal-600 bg-teal-50 border-teal-200';
  }

  function formatFileSize(bytes) {
    if (!bytes || isNaN(bytes)) return '';
    if (bytes < 1024) return `${bytes} B`;
    const kb = Math.round(bytes / 1024);
    if (kb < 1024) return `${kb} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function createTariffDocumentRow(doc = {}) {
    const listContainer = document.getElementById('tariff-documents-list');
    if (!listContainer) return;

    const docId = doc.id || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const docName = doc.name || 'Прайс-лист.pdf';
    const docSize = doc.size || '';
    const docDate = doc.uploadedAt || new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const docUrl = doc.dataUrl || '';
    const isActive = doc.isActive !== false && currentFormTariffType !== 'text';
    const validUntil = doc.validUntil || '';
    const iconClasses = getFileIconByExt(docName);

    const downloadBtnHtml = docUrl
      ? `<a href="${docUrl}" download="${docName.replace(/"/g, '&quot;')}" class="px-2.5 py-1.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-lg text-[11px] font-semibold transition flex items-center gap-1" title="Завантажити файл">
           <i class="fa-solid fa-download text-[10px]"></i> Скачати
         </a>`
      : `<button type="button" class="btn-simulate-doc-download px-2.5 py-1.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer" data-filename="${docName.replace(/"/g, '&quot;')}" title="Завантажити прайс-лист">
           <i class="fa-solid fa-download text-[10px]"></i> Скачати
         </button>`;

    const html = `
      <div id="${docId}" class="tariff-doc-item p-3.5 rounded-xl border transition shadow-2xs space-y-2.5 ${isActive ? 'bg-white border-emerald-400 ring-1 ring-emerald-300' : 'bg-slate-50 border-slate-200'}"
           data-doc-id="${docId}"
           data-doc-name="${docName.replace(/"/g, '&quot;')}"
           data-doc-size="${docSize.replace(/"/g, '&quot;')}"
           data-doc-date="${docDate.replace(/"/g, '&quot;')}"
           data-doc-active="${isActive}"
           data-doc-url="${docUrl}">
        
        <!-- Верхній рядок: Іконка + Назва + Статус активності + Дії -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div class="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconClasses}">
              <i class="fa-solid ${iconClasses.split(' ')[0]} text-base"></i>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-bold text-slate-900 truncate" title="${docName}">${docName}</span>
                ${docSize ? `<span class="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-mono font-medium">${docSize}</span>` : ''}
                <span class="text-[10px] text-slate-400 font-medium"><i class="fa-regular fa-calendar-check text-[9px] mr-0.5"></i> Завантажено: ${docDate}</span>
              </div>
              <div class="mt-1 flex items-center gap-2 flex-wrap">
                <span class="tariff-doc-status-badge">
                  ${isActive
        ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1 shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Активний прайс-лист</span>`
        : `<span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200/70 text-slate-600 border border-slate-300/60 inline-flex items-center gap-1"><i class="fa-solid fa-box-archive text-[9px] text-slate-400"></i> Неактивний (архів)</span>`
      }
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 self-end sm:self-center shrink-0">
            <button type="button" class="btn-preview-tariff-doc px-2.5 py-1.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer" title="Попередній перегляд документа">
              <i class="fa-solid fa-eye text-[10px]"></i> Preview
            </button>
            ${downloadBtnHtml}
            <button type="button" class="btn-remove-tariff-doc p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer" title="Видалити документ">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Нижній рядок: Обов'язкова дата валідності з підсвічуванням + Коментар -->
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-100 items-center">
          <div class="sm:col-span-5 flex items-center gap-2 flex-wrap">
            <label class="text-[10px] font-bold uppercase text-slate-600 tracking-wider shrink-0">
              Термін дії: <span class="text-rose-500">*</span>
            </label>
            <input type="date" value="${validUntil}" required
                   class="tariff-doc-valid-until bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:bg-white focus:border-teal-500 focus:outline-none transition">
            <span class="tariff-doc-validity-badge-container">
              ${renderValidityBadgeHtml(validUntil)}
            </span>
          </div>
          <div class="sm:col-span-7">
            <input type="text" placeholder="Коментар або опис прайсу (напр. підрядник на Q4, сезонна знижка)..." value="${(doc.comment || '').replace(/"/g, '&quot;')}"
                   class="tariff-doc-comment w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-700 focus:bg-white focus:border-teal-500 focus:outline-none transition">
          </div>
        </div>
      </div>
    `;

    listContainer.insertAdjacentHTML('beforeend', html);
    updateTariffCountersAndEmptyState();
  }

  function handleTariffFilesUpload(fileList) {
    if (!fileList || fileList.length === 0) return;

    // Спочатку переводимо всі попередні документи в статус неактивних
    document.querySelectorAll('#tariff-documents-list .tariff-doc-item').forEach(item => {
      item.setAttribute('data-doc-active', 'false');
      item.className = 'tariff-doc-item p-3.5 rounded-xl border transition shadow-2xs space-y-2.5 bg-slate-50 border-slate-200';
      const badgeWrap = item.querySelector('.tariff-doc-status-badge');
      if (badgeWrap) {
        badgeWrap.innerHTML = `<span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200/70 text-slate-600 border border-slate-300/60 inline-flex items-center gap-1"><i class="fa-solid fa-box-archive text-[9px] text-slate-400"></i> Неактивний (архів)</span>`;
      }
      item.querySelector('.btn-activate-tariff-doc')?.remove();
    });

    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const defaultValidUntil = nextYear.toISOString().split('T')[0];

    Array.from(fileList).forEach((file, idx) => {
      const sizeStr = formatFileSize(file.size);
      const uploadedAt = new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const reader = new FileReader();
      reader.onload = (ev) => {
        createTariffDocumentRow({
          name: file.name,
          size: sizeStr,
          uploadedAt,
          validUntil: defaultValidUntil,
          isActive: idx === 0, // тільки перший завантажений файл стає єдиним активним
          dataUrl: ev.target?.result || '',
          comment: ''
        });
        if (idx === 0) {
          syncActiveTariffState('document', file.name);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast(`Завантажено файл(ів) прайс-листа: новий файл встановлено як єдиний активний тариф`);
  }

  // Функції показу та закриття Document Preview Modal (Блок 2.2)
  function openDocumentPreviewModal(doc = {}) {
    const modal = document.getElementById('modal-doc-preview');
    if (!modal) return;

    const titleElem = document.getElementById('doc-preview-title');
    const sizeElem = document.getElementById('doc-preview-size');
    const statusBadge = document.getElementById('doc-preview-status-badge');
    const uploadDateElem = document.getElementById('doc-preview-upload-date');
    const validityWrap = document.getElementById('doc-preview-validity-wrap');
    const commentWrap = document.getElementById('doc-preview-comment-wrap');
    const iconElem = document.getElementById('doc-preview-icon');
    const bodyElem = document.getElementById('modal-doc-preview-body');
    const downloadBtn = document.getElementById('doc-preview-download-btn');

    const docName = doc.name || 'Прайс-лист.pdf';
    const isAct = !!doc.isActive && currentFormTariffType !== 'text';
    const contractorName = document.getElementById('input-contractor-search')?.value || 'Підрядник складу';
    const warehouseName = document.getElementById('input-warehouse-name')?.value || 'Склад';

    if (titleElem) titleElem.textContent = docName;
    if (sizeElem) sizeElem.textContent = doc.size || '';
    if (uploadDateElem) uploadDateElem.textContent = `Завантажено: ${doc.uploadedAt || '—'}`;
    if (validityWrap) validityWrap.innerHTML = renderValidityBadgeHtml(doc.validUntil || '');
    if (commentWrap) commentWrap.textContent = doc.comment ? `«${doc.comment}»` : '';

    if (statusBadge) {
      statusBadge.innerHTML = isAct
        ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1 shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Активний</span>`
        : `<span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200/70 text-slate-600 border border-slate-300/60 inline-flex items-center gap-1"><i class="fa-solid fa-box-archive text-[9px] text-slate-400"></i> Неактивний (архів)</span>`;
    }

    if (iconElem) {
      const iconClasses = getFileIconByExt(docName);
      iconElem.className = `w-10 h-10 rounded-xl border flex items-center justify-center text-lg shrink-0 ${iconClasses}`;
      iconElem.innerHTML = `<i class="fa-solid ${iconClasses.split(' ')[0]}"></i>`;
    }

    if (bodyElem) {
      if (doc.dataUrl && doc.dataUrl.startsWith('data:image/')) {
        bodyElem.innerHTML = `
          <div class="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center shadow-inner">
            <img src="${doc.dataUrl}" alt="${docName}" class="max-h-[500px] w-auto object-contain rounded-lg shadow-sm">
          </div>
        `;
      } else if (doc.dataUrl && doc.dataUrl.startsWith('data:application/pdf')) {
        bodyElem.innerHTML = `
          <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-inner">
            <iframe src="${doc.dataUrl}" class="w-full h-[520px] border-none" title="PDF Preview"></iframe>
          </div>
        `;
      } else {
        const validityEval = evaluateValidity(doc.validUntil);
        bodyElem.innerHTML = `
          <div class="bg-white rounded-xl border border-slate-300/80 p-6 shadow-sm space-y-5 text-slate-800 font-sans">
            <div class="flex items-start justify-between border-b-2 border-slate-800 pb-4 flex-wrap gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center">DF</div>
                  <h2 class="font-extrabold text-slate-900 text-base tracking-tight uppercase">${contractorName}</h2>
                </div>
                <p class="text-[11px] text-slate-500 mt-1">Офіційний прайс-лист на послуги відповідального зберігання та складської логістики</p>
                <p class="text-[11px] font-semibold text-teal-800 mt-0.5"><i class="fa-solid fa-warehouse mr-1 text-teal-600"></i> ${warehouseName}</p>
              </div>
              <div class="text-right">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${isAct ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-300'}">
                  <i class="fa-solid ${isAct ? 'fa-circle-check text-emerald-600' : 'fa-box-archive text-slate-500'}"></i>
                  <span>${isAct ? 'ДІЮЧИЙ ПРАЙС-ЛИСТ' : 'АРХІВНА ВЕРСІЯ'}</span>
                </div>
                <div class="text-[10px] text-slate-400 font-mono mt-1.5">REF: TRF-${(doc.id || '2026').replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}</div>
                <div class="text-[10px] text-slate-500 font-medium">Дата фіксації: ${doc.uploadedAt || '—'}</div>
              </div>
            </div>

            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-700">Термін дії документа:</span>
                <span class="inline-flex items-center gap-1 font-semibold ${validityEval.classNames}">
                  <i class="${validityEval.icon}"></i> ${validityEval.text}
                </span>
              </div>
              <span class="text-[11px] text-slate-400 font-mono">Файл: ${docName}</span>
            </div>

            <div class="overflow-x-auto rounded-lg border border-slate-200">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                    <th class="py-2.5 px-3 w-12 text-center">№</th>
                    <th class="py-2.5 px-3">Найменування послуги</th>
                    <th class="py-2.5 px-3">Одиниця виміру</th>
                    <th class="py-2.5 px-3">Базовий тариф</th>
                    <th class="py-2.5 px-3">Примітки / особливості</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  <tr class="hover:bg-slate-50">
                    <td class="py-2 px-3 text-center text-slate-400 font-mono">1</td>
                    <td class="py-2 px-3 font-semibold text-slate-900">Відповідальне зберігання (сухий склад)</td>
                    <td class="py-2 px-3 font-mono">1 CBM / доба</td>
                    <td class="py-2 px-3 font-bold text-teal-700 font-mono">$1.50</td>
                    <td class="py-2 px-3 text-slate-500 text-[11px]">Перші 3 доби зберігання безкоштовно при консолідації</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="py-2 px-3 text-center text-slate-400 font-mono">2</td>
                    <td class="py-2 px-3 font-semibold text-slate-900">Приймання та вивантаження (механізоване)</td>
                    <td class="py-2 px-3 font-mono">палета (до 800 кг)</td>
                    <td class="py-2 px-3 font-bold text-teal-700 font-mono">$12.00</td>
                    <td class="py-2 px-3 text-slate-500 text-[11px]">Включаючи звірку місць та вхідний візуальний огляд</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="py-2 px-3 text-center text-slate-400 font-mono">3</td>
                    <td class="py-2 px-3 font-semibold text-slate-900">Відвантаження та завантаження на авто/контейнер</td>
                    <td class="py-2 px-3 font-mono">палета</td>
                    <td class="py-2 px-3 font-bold text-teal-700 font-mono">$10.00</td>
                    <td class="py-2 px-3 text-slate-500 text-[11px]">Фотофіксація пломби та кріплення у кузові</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="py-2 px-3 text-center text-slate-400 font-mono">4</td>
                    <td class="py-2 px-3 font-semibold text-slate-900">Палетування та стретчування вантажу</td>
                    <td class="py-2 px-3 font-mono">палета</td>
                    <td class="py-2 px-3 font-bold text-teal-700 font-mono">$12.00</td>
                    <td class="py-2 px-3 text-slate-500 text-[11px]">Стретч-плівка (4 шари) + картонні кутники захисту</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="py-2 px-3 text-center text-slate-400 font-mono">5</td>
                    <td class="py-2 px-3 font-semibold text-slate-900">Стікерування / маркування штрихкодом</td>
                    <td class="py-2 px-3 font-mono">1 коробка / шт</td>
                    <td class="py-2 px-3 font-bold text-teal-700 font-mono">$0.15</td>
                    <td class="py-2 px-3 text-slate-500 text-[11px]">Друк термостікерів за шаблоном замовника (DF-код)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
              <div class="font-bold text-slate-700 flex items-center gap-1.5">
                <i class="fa-solid fa-circle-exclamation text-amber-500"></i> Особливі умови та правила розрахунку:
              </div>
              <p class="text-slate-600 text-[11px] leading-relaxed">
                ${doc.comment || 'Тарифи зафіксовані в договорі з підрядником. Негабаритні місця довжиною понад 3.0 м або вагою понад 1200 кг тарифікуються за коефіцієнтом 1.35. Розрахунки щомісячні за фактичним актом виконаних робіт.'}
              </p>
            </div>

            <div class="pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs">
              <div>
                <span class="text-slate-500">Уповноважена особа підрядника:</span>
                <p class="font-bold text-slate-800 mt-0.5">Відділ взаєморозрахунків та складських операцій</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="px-3 py-1.5 rounded-lg border-2 border-dashed border-teal-500/70 text-teal-700 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 rotate-[-2deg]">
                  <i class="fa-solid fa-stamp"></i> ВЕРИФІКОВАНО ERP DIFREIGHT
                </div>
              </div>
            </div>
          </div>
        `;
      }
    }

    if (downloadBtn) {
      downloadBtn.onclick = () => {
        if (doc.dataUrl) {
          const a = document.createElement('a');
          a.href = doc.dataUrl;
          a.download = docName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          const content = `ОФІЦІЙНИЙ ПРАЙС-ЛИСТ СКЛАДУ\nСклад: ${warehouseName}\nПідрядник: ${contractorName}\nДокумент: ${docName}\nТермін дії: ${doc.validUntil || 'Не вказано'}\nЗавантажено: ${doc.uploadedAt || '—'}\n\nБазові ставки:\n- Зберігання: $1.50/CBM/доба\n- Приймання: $12.00/палета\n- Відвантаження: $10.00/палета\n- Палетування: $12.00/палета\n- Маркування DF-кодом: $0.15/коробка\n\nПримітки:\n${doc.comment || 'Стандартні умови зберігання'}`;
          const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = docName.endsWith('.txt') ? docName : `${docName}.txt`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        showToast(`Завантаження документа "${docName}"...`);
      };
    }

    modal.classList.remove('hidden');
  }

  function closeDocumentPreviewModal() {
    const modal = document.getElementById('modal-doc-preview');
    if (modal) modal.classList.add('hidden');
  }

  // Ініціалізація drag-and-drop та вибору файлів прайс-листа
  const tariffDropzone = document.getElementById('tariff-dropzone');
  const inputTariffFiles = document.getElementById('input-tariff-files');

  tariffDropzone?.addEventListener('click', () => {
    inputTariffFiles?.click();
  });

  inputTariffFiles?.addEventListener('change', (e) => {
    if (e.target.files?.length) {
      handleTariffFilesUpload(e.target.files);
      e.target.value = '';
    }
  });

  tariffDropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    tariffDropzone.classList.add('border-teal-500', 'bg-teal-50/50');
  });

  tariffDropzone?.addEventListener('dragleave', () => {
    tariffDropzone.classList.remove('border-teal-500', 'bg-teal-50/50');
  });

  tariffDropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    tariffDropzone.classList.remove('border-teal-500', 'bg-teal-50/50');
    if (e.dataTransfer?.files?.length) {
      handleTariffFilesUpload(e.dataTransfer.files);
    }
  });

  // Обробники кліків: Preview документа, встановлення тексту як діючого, видалення, скачування, очищення тексту
  document.addEventListener('click', (e) => {
    // 1. Попередній перегляд документа (Preview)
    const previewBtn = e.target.closest('.btn-preview-tariff-doc');
    if (previewBtn) {
      const docItem = previewBtn.closest('.tariff-doc-item');
      if (docItem) {
        openDocumentPreviewModal({
          id: docItem.getAttribute('data-doc-id'),
          name: docItem.getAttribute('data-doc-name') || 'Прайс-лист',
          size: docItem.getAttribute('data-doc-size') || '',
          uploadedAt: docItem.getAttribute('data-doc-date') || '',
          validUntil: docItem.querySelector('.tariff-doc-valid-until')?.value || '',
          isActive: docItem.getAttribute('data-doc-active') === 'true',
          dataUrl: docItem.getAttribute('data-doc-url') || '',
          comment: docItem.querySelector('.tariff-doc-comment')?.value.trim() || ''
        });
      }
      return;
    }

    // Закриття модального вікна Preview
    if (e.target.closest('.close-doc-preview') || e.target.id === 'modal-doc-preview') {
      closeDocumentPreviewModal();
      return;
    }

    // Друк з модального вікна Preview
    if (e.target.closest('#doc-preview-print-btn')) {
      window.print();
      return;
    }

    // 2. Встановлення текстового тарифу як діючого (Взаємозамінність Блок 2.2)
    if (e.target.closest('#btn-set-text-tariff-active')) {
      syncActiveTariffState('text');
      showToast('Текстовий тариф активовано як єдиний діючий (усі завантажені файли переведено в архів)');
      return;
    }

    // 3. Видалення документа
    const removeDocBtn = e.target.closest('.btn-remove-tariff-doc');
    if (removeDocBtn) {
      const docItem = removeDocBtn.closest('.tariff-doc-item');
      if (docItem) {
        const wasActive = docItem.getAttribute('data-doc-active') === 'true';
        docItem.remove();
        if (wasActive) {
          const remainingDocs = document.querySelectorAll('#tariff-documents-list .tariff-doc-item');
          if (remainingDocs.length > 0) {
            remainingDocs[0].setAttribute('data-doc-active', 'true');
            syncActiveTariffState('document', remainingDocs[0].getAttribute('data-doc-name'));
          } else {
            const hasText = !!document.getElementById('input-warehouse-tariff-text')?.value.trim();
            syncActiveTariffState(hasText ? 'text' : 'document');
          }
        } else {
          updateTariffCountersAndEmptyState();
        }
        showToast('Документ видалено');
      }
      return;
    }

    // 4. Скачування демо-документів
    const simBtn = e.target.closest('.btn-simulate-doc-download');
    if (simBtn) {
      const fname = simBtn.getAttribute('data-filename') || 'PriceList.pdf';
      showToast(`Завантаження документа "${fname}"...`);
      return;
    }

    // 5. Очищення тексту тарифів
    if (e.target.id === 'btn-clear-tariff-text') {
      const textInp = document.getElementById('input-warehouse-tariff-text');
      const validInp = document.getElementById('input-warehouse-tariff-text-valid-until');
      if (textInp) textInp.value = '';
      if (validInp) validInp.value = '';
      updateTariffCountersAndEmptyState();
      showToast('Текст тарифів очищено');
      return;
    }
  });

  // Оновлення валідності дат на льоту
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('tariff-doc-valid-until')) {
      const parent = e.target.closest('.tariff-doc-item');
      const badgeContainer = parent?.querySelector('.tariff-doc-validity-badge-container');
      if (badgeContainer) {
        badgeContainer.innerHTML = renderValidityBadgeHtml(e.target.value);
      }
    }
    if (e.target.id === 'input-warehouse-tariff-text-valid-until' || e.target.id === 'input-warehouse-tariff-text') {
      updateTariffCountersAndEmptyState();
      if (e.target.id === 'input-warehouse-tariff-text' && e.target.value.trim().length > 0) {
        const docCount = document.querySelectorAll('#tariff-documents-list .tariff-doc-item').length;
        if (docCount === 0 && currentFormTariffType !== 'text') {
          syncActiveTariffState('text');
        }
      }
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('row-checkbox')) {
      const id = e.target.getAttribute('data-id');
      const isChecked = e.target.checked;
      document.querySelectorAll(`.row-checkbox[data-id="${id}"]`).forEach(cb => cb.checked = isChecked);
      updateBulkBar();
    }
  });

  document.getElementById('btn-add-contact')?.addEventListener('click', () => createContactRow());

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

    // Збір контактів (Блок 2.1: вибір головного менеджера через чекбокс)
    const contacts = Array.from(document.querySelectorAll('.contact-card')).map(card => {
      const isPrimary = !!card.querySelector('.contact-is-primary-checkbox')?.checked;
      const phones = Array.from(card.querySelectorAll('.phone-item')).map(pItem => {
        const number = pItem.querySelector('.phone-number')?.value.trim() || '';
        const socials = Array.from(pItem.querySelectorAll('.social-item')).map(s => ({
          type: s.querySelector('.social-type')?.value,
          value: s.querySelector('.social-value')?.value.trim()
        })).filter(s => s.value);

        return {
          number: number,
          socials: socials
        };
      }).filter(p => p.number || p.socials.length > 0);

      const firstPhone = phones[0]?.number || '';

      return {
        fullName: card.querySelector('.contact-fullname')?.value.trim(),
        position: card.querySelector('.contact-position')?.value.trim(),
        email: card.querySelector('.contact-email')?.value.trim(),
        comment: card.querySelector('.contact-comment')?.value.trim(),
        phone: firstPhone,
        phones: phones,
        isPrimary: isPrimary
      };
    }).filter(c => c.fullName || c.position || c.email || c.comment || c.phones.length > 0);

    if (contacts.length > 0 && !contacts.some(c => c.isPrimary)) {
      contacts[0].isPrimary = true;
    }

    // Збір документів прайс-листів (Блок 2.2)
    const tariffDocuments = Array.from(document.querySelectorAll('.tariff-doc-item')).map(docEl => ({
      id: docEl.getAttribute('data-doc-id') || `doc-${Date.now()}`,
      name: docEl.getAttribute('data-doc-name') || 'Прайс-лист',
      size: docEl.getAttribute('data-doc-size') || '',
      uploadedAt: docEl.getAttribute('data-doc-date') || new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      validUntil: docEl.querySelector('.tariff-doc-valid-until')?.value || '',
      isActive: currentFormTariffType === 'text' ? false : (docEl.getAttribute('data-doc-active') === 'true'),
      dataUrl: docEl.getAttribute('data-doc-url') || '',
      comment: docEl.querySelector('.tariff-doc-comment')?.value.trim() || ''
    }));

    // Збір текстового тарифу (Блок 2.2)
    const tariffText = document.getElementById('input-warehouse-tariff-text')?.value.trim() || '';
    const tariffTextValidUntil = document.getElementById('input-warehouse-tariff-text-valid-until')?.value || '';

    return {
      name: document.getElementById('input-warehouse-name')?.value.trim(),
      contractor: document.getElementById('input-contractor-search')?.value.trim(),
      volume: document.getElementById('input-warehouse-volume')?.value || '',
      tariffType: currentFormTariffType,
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
      tariffs: [],
      tariffDocuments: tariffDocuments,
      tariffText: tariffText,
      tariffTextValidUntil: tariffTextValidUntil,
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
