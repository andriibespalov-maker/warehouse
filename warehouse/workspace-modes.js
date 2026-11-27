// Модуль керування 4 робочими режимами: Відправка, Отримання, Транзит, Робота з вантажами (Комірник)
(function () {
  let currentMode = 'dispatch'; // 'dispatch' | 'receiving' | 'transit' | 'cargo_ops'
  let prototypeShowAllTabs = false; // false = Тільки по типу складу, true = Усі таби (Тільки для прототипу)
  let recFilter = 'inbound'; // 'inbound' | 'unloaded' | 'all'
  let recTransportFilter = 'all'; // 'all' | 'Морський' | 'Авіа' | 'Авто'
  let recExpandedInboundSvIds = new Set();
  let recInboundAutoInitialized = false;
  const recModalFilters = {
    damage: new Set(),
    transports: new Set(),
    logists: new Set(),
    dests: new Set()
  };

  let trFilter = 'in_transit'; // 'in_transit' | 'unloaded' | 'all'
  let trSelectedIds = new Set();
  let trActiveOutboundSvId = null;
  let trExpandedSvIds = new Set();
  let trExpandedInboundSvIds = new Set();
  let trInboundAutoInitialized = false;
  const trModalFilters = {
    prevSvs: new Set(),
    dests: new Set(),
    conditions: new Set()
  };
  let trOutboundStatuses = null; // Set<string> | null
  let trOutboundDestHub = 'all';
  let trOutboundSortMode = 'plannedDeparture_asc';
  let trOutboundFiltersInitialized = false;

  let opsFilter = 'unmarked'; // 'unmarked' | 'on_warehouse' | 'all'
  const opsSelectedIds = new Set();
  let opsClientGroupsCollapsed = false;
  let opsTransferTargetIds = [];
  let opsDeleteTargetIds = [];
  let opsOpenMenuCargoId = null;
  let opsWarehousesCatalog = [
    'New FOSHAN',
    'Shenzhen Hub',
    'Склад Київ-1',
    'Склад Холм (Транзит)',
    'Склад Варшава'
  ];
  const opsModalFilters = {
    cargoType: 'all',
    logist: 'all',
    modes: new Set(),
    specials: new Set()
  };

  function loadOpsWarehousesCatalog() {
    fetch('../data/warehouses.json')
      .catch(() => fetch('data/warehouses.json'))
      .then(res => (res && res.ok ? res.json() : null))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const names = data.map(w => w.name).filter(Boolean);
          if (names.length > 0) opsWarehousesCatalog = names;
        }
      })
      .catch(() => {});
  }

  function getSubvoyages() {
    return Array.isArray(window.svManagementSubvoyages) ? window.svManagementSubvoyages : [];
  }

  function getTransports() {
    return Array.isArray(window.svManagementTransportsRef)
      ? window.svManagementTransportsRef
      : (Array.isArray(window.svManagementShipments) ? window.svManagementShipments : []);
  }

  function getStorekeeperCargoes() {
    const transports = getTransports();
    const whCargoes = Array.isArray(window.cargoesData) ? window.cargoesData : [];
    const seen = new Set();
    const list = [];

    transports.forEach(t => {
      if (t.entityType === 'cargo' || t.readinessCategory === 'unmarked' || (t.tasks && t.tasks.length > 0)) {
        const key = t.id || t.dfShipment || t.cargoNumber;
        if (!seen.has(key)) {
          seen.add(key);
          list.push(t);
        }
      }
    });

    whCargoes.forEach(c => {
      const key = c.id || c.cargoCode || c.dfNumber;
      if (!seen.has(key)) {
        seen.add(key);
        list.push(c);
      }
    });

    return list;
  }

  function toast(msg, isError = false) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg, isError);
    } else {
      console.log(isError ? '[ERR]' : '[INFO]', msg);
    }
  }

  function getCurrentWarehouseConfig() {
    const whData = window.DashboardModule?.data || {};
    const fnCatalog = window.WAREHOUSE_FUNCTIONAL_TYPES_CATALOG || {};
    const fnKey = whData.functionalType || 'dispatch_warehouse';
    const fnCfg = fnCatalog[fnKey] || {
      key: fnKey,
      label: 'Склад відправки (Консолідація)',
      shortLabel: 'Склад відправки',
      defaultModes: ['dispatch', 'cargo_ops']
    };
    const allowedModes = Array.isArray(whData.allowedModes) && whData.allowedModes.length > 0
      ? whData.allowedModes
      : (fnCfg.defaultModes || ['dispatch', 'cargo_ops']);
    return {
      functionalType: fnKey,
      typeLabel: fnCfg.label,
      shortLabel: fnCfg.shortLabel || fnCfg.label,
      allowedModes
    };
  }

  function renderModeSwitcher() {
    const container = document.getElementById('workspace-mode-switcher-container');
    if (!container) return;

    const whConfig = getCurrentWarehouseConfig();
    const allowedSet = new Set(whConfig.allowedModes);
    const isModeVisible = (modeKey) => prototypeShowAllTabs || allowedSet.has(modeKey);

    // Якщо перемикач у режимі «Тільки по типу складу», а поточний активний таб недоступний для цього типу складу — перемикаємо на перший доступний активний таб
    const selectableModes = ['dispatch', 'receiving', 'transit', 'cargo_ops'];
    if (!prototypeShowAllTabs && !allowedSet.has(currentMode)) {
      const firstAllowed = selectableModes.find(m => allowedSet.has(m)) || 'cargo_ops';
      if (firstAllowed !== currentMode) {
        currentMode = firstAllowed;
        applyModePanelsVisibility(currentMode);
      }
    }

    const btnCls = (mode) => currentMode === mode
      ? 'bg-slate-900 text-white shadow-sm border-slate-900'
      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-slate-300';

    const activeAllowedCount = selectableModes.filter(m => allowedSet.has(m)).length;
    const hiddenByTypeCount = selectableModes.length - activeAllowedCount;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl p-2.5 flex flex-col gap-2">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <!-- Ліва частина: Таби робочих режимів складу -->
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1.5 hidden sm:inline">Робочий режим:</span>

            ${isModeVisible('dispatch') ? `
              <button type="button" data-workspace-mode="dispatch"
                class="ws-mode-btn px-3.5 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${btnCls('dispatch')}">
                <i class="fa-solid fa-truck-ramp-box ${currentMode === 'dispatch' ? 'text-brand-400' : 'text-brand-600'}"></i>
                <span>1. Відправка рейсів</span>
                ${prototypeShowAllTabs && !allowedSet.has('dispatch') ? `<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-semibold" title="Цей таб за замовчуванням прихований для типу «${whConfig.shortLabel}»">Поза типом</span>` : ''}
              </button>
            ` : ''}

            ${isModeVisible('receiving') ? `
              <button type="button" data-workspace-mode="receiving"
                class="ws-mode-btn px-3.5 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${btnCls('receiving')}">
                <i class="fa-solid fa-plane-arrival ${currentMode === 'receiving' ? 'text-amber-400' : 'text-amber-600'}"></i>
                <span>2. Приймання рейсів</span>
                ${prototypeShowAllTabs && !allowedSet.has('receiving') ? `<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-semibold" title="Цей таб за замовчуванням прихований для типу «${whConfig.shortLabel}»">Поза типом</span>` : ''}
              </button>
            ` : ''}

            ${isModeVisible('transit') ? `
              <button type="button" data-workspace-mode="transit"
                class="ws-mode-btn px-3.5 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${btnCls('transit')}">
                <i class="fa-solid fa-shuffle ${currentMode === 'transit' ? 'text-indigo-400' : 'text-indigo-600'}"></i>
                <span>3. Транзит</span>
                ${prototypeShowAllTabs && !allowedSet.has('transit') ? `<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-semibold" title="Цей таб за замовчуванням прихований для типу «${whConfig.shortLabel}»">Поза типом</span>` : ''}
              </button>
            ` : ''}

            ${isModeVisible('cargo_ops') ? `
              <button type="button" data-workspace-mode="cargo_ops"
                class="ws-mode-btn px-3.5 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${btnCls('cargo_ops')}">
                <i class="fa-solid fa-boxes-stacked ${currentMode === 'cargo_ops' ? 'text-emerald-400' : 'text-emerald-600'}"></i>
                <span>4. Вантажі (Комірник)</span>
                ${prototypeShowAllTabs && !allowedSet.has('cargo_ops') ? `<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-semibold" title="Цей таб за замовчуванням прихований для типу «${whConfig.shortLabel}»">Поза типом</span>` : ''}
              </button>
            ` : ''}

            ${!prototypeShowAllTabs && hiddenByTypeCount > 0 ? `
              <span class="text-[11px] text-slate-400 font-medium px-2 py-1 rounded-lg bg-slate-50 border border-dashed border-slate-200"
                title="Решта ${hiddenByTypeCount} табів приховані відповідно до типу складу «${whConfig.typeLabel}»">
                <i class="fa-solid fa-filter text-[10px] text-slate-400 mr-1"></i>Приховано за типом складу: ${hiddenByTypeCount}
              </span>
            ` : ''}
          </div>

          <!-- Права частина: Спеціальний перемикач ТІЛЬКИ ДЛЯ ПРОТОТИПУ -->
          <div class="flex items-center gap-2 flex-wrap bg-amber-50/90 border border-amber-300 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-2xs"
              title="Цей перемикач додано виключно для демонстрації прототипу">
              <i class="fa-solid fa-flask text-[9px]"></i>
              <span>Тільки для прототипу</span>
            </span>

            <div class="inline-flex items-center bg-white p-0.5 rounded-lg border border-amber-300 text-[11px] font-bold">
              <button type="button" id="proto-btn-tabs-by-type"
                class="px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${!prototypeShowAllTabs ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}"
                title="Показувати тільки ті таби, що увімкнені для цього складу (Тільки для прототипу)">
                <i class="fa-solid fa-warehouse text-[10px]"></i>
                <span>Тільки по типу складу (${activeAllowedCount})</span>
              </button>
              <button type="button" id="proto-btn-tabs-all"
                class="px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${prototypeShowAllTabs ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}"
                title="Примусово показати всі 4 таби на цьому складі (Тільки для прототипу)">
                <i class="fa-solid fa-layer-group text-[10px]"></i>
                <span>Усі таби (4)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.ws-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchMode(btn.getAttribute('data-workspace-mode'));
      });
    });

    document.getElementById('proto-btn-tabs-by-type')?.addEventListener('click', () => {
      prototypeShowAllTabs = false;
      renderModeSwitcher();
      toast('Прототип: увімкнено відображення табів тільки за типом складу');
    });

    document.getElementById('proto-btn-tabs-all')?.addEventListener('click', () => {
      prototypeShowAllTabs = true;
      renderModeSwitcher();
      toast('Прототип: увімкнено показ усіх 4 табів незалежно від типу складу');
    });

    document.getElementById('proto-warehouse-type-select')?.addEventListener('change', (e) => {
      const newType = e.target.value;
      if (window.DashboardModule && typeof window.DashboardModule.setWarehouseFunctionalType === 'function') {
        window.DashboardModule.setWarehouseFunctionalType(newType);
        const cfg = window.WAREHOUSE_FUNCTIONAL_TYPES_CATALOG?.[newType];
        toast(`Прототип: змінено тип складу на «${cfg?.label || newType}»`);
      }
    });
  }

  function applyModePanelsVisibility(mode) {
    const dispatchEl = document.getElementById('subvoyages-workspace-container');
    const panelsWrapper = document.getElementById('workspace-modes-panels-container');
    const recEl = document.getElementById('workspace-mode-receiving');
    const trEl = document.getElementById('workspace-mode-transit');
    const opsEl = document.getElementById('workspace-mode-cargo-ops');

    [recEl, trEl, opsEl].forEach(el => {
      el?.classList.add('hidden');
      el?.classList.remove('flex');
    });

    if (mode === 'dispatch') {
      dispatchEl?.classList.remove('hidden');
      panelsWrapper?.classList.add('hidden');
    } else if (mode === 'receiving') {
      dispatchEl?.classList.add('hidden');
      panelsWrapper?.classList.remove('hidden');
      recEl?.classList.remove('hidden');
      recEl?.classList.add('flex');
      renderReceivingMode();
    } else if (mode === 'transit') {
      dispatchEl?.classList.add('hidden');
      panelsWrapper?.classList.remove('hidden');
      trEl?.classList.remove('hidden');
      trEl?.classList.add('flex');
      renderTransitMode();
    } else if (mode === 'cargo_ops') {
      dispatchEl?.classList.add('hidden');
      panelsWrapper?.classList.remove('hidden');
      opsEl?.classList.remove('hidden');
      opsEl?.classList.add('flex');
      renderCargoOpsMode();
    }
  }

  function switchMode(mode) {
    currentMode = mode;
    applyModePanelsVisibility(mode);
    renderModeSwitcher();
  }

  // =========================================================================
  // РЕЖИМ 2: ПРИЙМАННЯ ТА РОЗФОРМУВАННЯ (ОТРИМАННЯ + ТРАНЗИТ)
  // =========================================================================
  function isInboundVoyage(sv) {
    return sv.status === 'В дорозі' || sv.status === 'На митниці на імпорт' || sv.status === 'Вивантажений';
  }

  function getSvTransportBadge(transport) {
    const t = (transport || '').toLowerCase();
    if (t.includes('авіа') || t.includes('air')) {
      return `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold" title="Тип перевезення: Авіа"><i class="fa-solid fa-plane text-[9px]"></i> Авіа</span>`;
    }
    if (t.includes('авто') || t.includes('road') || t.includes('truck')) {
      return `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold" title="Тип перевезення: Авто"><i class="fa-solid fa-truck text-[9px]"></i> Авто</span>`;
    }
    if (t.includes('заліз') || t.includes('rail') || t.includes('train')) {
      return `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold" title="Тип перевезення: Залізниця"><i class="fa-solid fa-train text-[9px]"></i> Залізниця</span>`;
    }
    if (t.includes('мор') || t.includes('sea') || t.includes('ocean')) {
      return `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold" title="Тип перевезення: Морський"><i class="fa-solid fa-ship text-[9px]"></i> Море</span>`;
    }
    return transport ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold">${transport}</span>` : '';
  }

  function renderReceivingMode() {
    const subvoyages = getSubvoyages();
    const transports = getTransports();
    const query = (document.getElementById('rec-search-input')?.value || '').trim().toLowerCase();

    const inboundOnly = subvoyages.filter(s => s.status === 'В дорозі' || s.status === 'На митниці на імпорт');
    const unloadedOnly = subvoyages.filter(s => s.status === 'Вивантажений');
    const allInbound = subvoyages.filter(isInboundVoyage);

    const badgeIn = document.getElementById('rec-badge-inbound');
    const badgeUn = document.getElementById('rec-badge-unloaded');
    if (badgeIn) badgeIn.textContent = inboundOnly.length;
    if (badgeUn) badgeUn.textContent = unloadedOnly.length;

    let visibleVoyages = recFilter === 'inbound' ? inboundOnly : (recFilter === 'unloaded' ? unloadedOnly : allInbound);
    if (recTransportFilter !== 'all') {
      visibleVoyages = visibleVoyages.filter(sv => (sv.transport || '').toLowerCase().includes(recTransportFilter.toLowerCase()));
    }
    if (query) {
      visibleVoyages = visibleVoyages.filter(sv =>
        (sv.id || '').toLowerCase().includes(query) ||
        (sv.name || '').toLowerCase().includes(query) ||
        (sv.route || '').toLowerCase().includes(query) ||
        (sv.receivingWarehouse || '').toLowerCase().includes(query)
      );
    }

    const countLabel = document.getElementById('rec-inbound-count-label');
    if (countLabel) countLabel.textContent = `${visibleVoyages.length} рейсів`;

    if (!recInboundAutoInitialized && visibleVoyages.length > 0) {
      recExpandedInboundSvIds.add(visibleVoyages[0].id);
      recInboundAutoInitialized = true;
    }

    const ui = window.SubvoyageSharedUI || {};
    const currentWhName = window.DashboardModule?.data?.name || 'Склад Варшава';
    const getMarkers = typeof ui.getShipmentMarkerGroups === 'function'
      ? ui.getShipmentMarkerGroups
      : (typeof window.getShipmentMarkerGroups === 'function' ? window.getShipmentMarkerGroups : () => ({ docs: [], loading: [], special: [] }));
    const renderMarkers = typeof ui.renderMarkerListBadges === 'function'
      ? ui.renderMarkerListBadges
      : (typeof window.renderMarkerListBadges === 'function' ? window.renderMarkerListBadges : () => '<span class="text-[10px] text-slate-300 italic">—</span>');

    const listEl = document.getElementById('rec-inbound-voyages-list');
    if (listEl) {
      if (visibleVoyages.length === 0) {
        listEl.innerHTML = `<div class="p-8 text-center text-slate-400 italic text-xs bg-white rounded-xl border border-slate-200">Немає вхідних рейсів за обраним фільтром</div>`;
      } else {
        listEl.innerHTML = visibleVoyages.map(sv => {
          const svShipments = transports.filter(t => t.subvoyageId === sv.id || t.previousSubvoyageId === sv.id || t.acceptance?.subvoyageId === sv.id);
          const isExpanded = recExpandedInboundSvIds.has(sv.id);
          const isUnloaded = sv.status === 'Вивантажений';
          const receiveDateVal = sv.receivedAt || sv.actualArrival || sv.plannedArrival || '—';

          const totalVol = svShipments.reduce((acc, t) => acc + Number(t.volume || 0), 0);
          const totalWeight = svShipments.reduce((acc, t) => acc + Number(t.weight || 0), 0);
          const totalPlaces = svShipments.reduce((acc, t) => acc + Number(t.places || 0), 0);
          const maxVol = Number(sv.maxVolume) || 1;
          const pctVol = Math.min(100, Math.round((totalVol / maxVol) * 100));

          const statusCls = isUnloaded
            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
            : 'bg-amber-100 text-amber-800 border-amber-200';

          return `
            <div data-rec-sv-id="${sv.id}"
              class="p-2.5 rounded-xl border transition select-none space-y-2 ${isExpanded
                ? 'bg-white border-indigo-400 ring-2 ring-indigo-500/15 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'}">

              <!-- Рядок 1: Назва, ID, Системний стан + Перевезення, Прийняти/Завершити та Інфо -->
              <div class="flex justify-between items-start gap-2 cursor-pointer" onclick="window.toggleReceivingInboundAccordion('${sv.id}')">
                <div class="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span class="font-bold text-xs text-slate-900 truncate">${sv.name || 'Вхідний підрейс'}</span>
                  <span class="text-[10px] font-mono font-bold text-brand-700 bg-brand-100 px-1.5 py-0.2 rounded">${sv.id}</span>
                  <span class="px-1.5 py-0.2 rounded-full border text-[10px] font-bold ${statusCls}">${sv.status}</span>
                </div>
                <div class="flex items-center gap-1 shrink-0" onclick="event.stopPropagation()">
                  <button type="button" onclick="window.toggleReceivingInboundAccordion('${sv.id}')"
                    class="px-2 py-0.5 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${isExpanded
                      ? 'bg-brand-600 text-white border-brand-700 shadow-2xs'
                      : 'bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 border-slate-200'}"
                    title="Розгорнути / згорнути список перевезень цього підрейсу">
                    <i class="fa-solid fa-boxes-stacked text-[9px]"></i>
                    <span>Перевезень: ${svShipments.length}</span>
                    <i class="fa-solid fa-chevron-down text-[8px] transition-transform ${isExpanded ? 'rotate-180' : ''}"></i>
                  </button>
                  ${!isUnloaded ? `
                    <button type="button" onclick="window.DashboardModule && window.DashboardModule.openAcceptVoyageModal('${sv.id}', event)"
                      class="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-2xs cursor-pointer flex items-center gap-1">
                      <i class="fa-solid fa-clipboard-check text-[9px]"></i>
                      <span>Прийняти на склад</span>
                    </button>
                  ` : `
                    <button type="button" data-complete-sv-id="${sv.id}"
                      class="rec-btn-complete-sv px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold shadow-2xs cursor-pointer flex items-center gap-1"
                      title="Позначити підрейс як Завершений та прибрати зі списку активного розформування">
                      <i class="fa-solid fa-check-double text-emerald-400 text-[9px]"></i>
                      <span>Завершити рейс</span>
                    </button>
                  `}
                  <button type="button" onclick="window.openSubvoyageDrawer && window.openSubvoyageDrawer('${sv.id}', event)"
                    class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Подивитись усю інформацію про підрейс">
                    <i class="fa-solid fa-circle-info text-brand-600"></i>
                    <span>Інфо</span>
                  </button>
                </div>
              </div>

              <!-- Рядок 2: Зовнішній рейс та Дата отримання -->
              <div class="flex items-center justify-between gap-1.5 flex-wrap text-[10px]">
                <div class="flex items-center gap-1.5 flex-wrap">
                  ${sv.externalFlight ? `<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono font-bold text-[10px]"><i class="fa-solid fa-globe text-slate-400 mr-1"></i>${sv.externalFlight}</span>` : ''}
                </div>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="bg-brand-50 text-brand-900 border border-brand-200 px-2 py-0.5 rounded font-mono font-bold text-[10px] inline-flex items-center gap-1" title="Планова / фактична дата отримання на складі">
                    <i class="fa-regular fa-calendar-check text-brand-600"></i>
                    <span>${sv.receivedAt ? 'Прийнято' : 'Отрим'}: ${receiveDateVal}</span>
                  </span>
                </div>
              </div>

              <!-- Рядок 3: Габарити та прогрес-бар -->
              <div class="pt-1 border-t border-slate-100 space-y-1">
                <div class="flex justify-between items-center text-[10px] font-mono text-slate-600 flex-wrap gap-1">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-indigo-700 font-bold">${totalVol.toFixed(1)} м³</span>
                    <span class="text-slate-400">/ ${sv.maxVolume || 0} м³</span>
                    <span class="text-slate-300">•</span>
                    <span><strong>${Math.round(totalWeight)}</strong>/${sv.maxWeight || 0} кг</span>
                    <span class="text-slate-300">•</span>
                    <span><strong>${totalPlaces}</strong>${sv.maxPlaces ? `/${sv.maxPlaces}` : ''} місць</span>
                  </div>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex border border-slate-300/40">
                  <div class="bg-indigo-500 h-2 transition-all duration-300" style="width: ${pctVol}%"></div>
                </div>
              </div>

              <!-- Розгорнутий список перевезень усередині вхідного підрейсу -->
              ${isExpanded ? `
                <div class="mt-2 pt-2 border-t border-slate-200/90 space-y-1.5" onclick="event.stopPropagation()">
                  ${svShipments.length === 0 ? `
                    <div class="p-2.5 text-center text-slate-400 italic text-[11px] bg-slate-50 rounded-lg border border-dashed border-slate-200">Немає перевезень у цьому підрейсі.</div>
                  ` : `
                    <div class="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                      <table class="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr class="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                            <th class="py-1.5 px-2">Перевезення</th>
                            <th class="py-1.5 px-2">Габарити</th>
                            <th class="py-1.5 px-2 text-right">Інфо</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 bg-white">
                          ${svShipments.map(tr => {
                            return `
                              <tr class="hover:bg-slate-50 transition cursor-pointer"
                                  onclick="window.openContextDrawer && window.openContextDrawer('${tr.id}')">
                                <td class="py-2 px-2.5">
                                  <div class="flex items-center gap-1.5 flex-wrap">
                                    <span class="font-mono font-bold text-brand-700 text-xs">${tr.dfShipment || tr.cargoNumber || tr.id}</span>
                                  </div>
                                </td>
                                <td class="py-2 px-2 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                                  <strong>${tr.volume || 0}</strong> м³ <span class="text-slate-300">|</span> <strong>${tr.weight || 0}</strong> кг <span class="text-slate-300">|</span> <span class="text-slate-500">${tr.places || 0} шт</span>
                                </td>
                                <td class="py-2 px-2.5 text-right whitespace-nowrap" onclick="event.stopPropagation()">
                                  <button type="button" onclick="window.openContextDrawer && window.openContextDrawer('${tr.id}')"
                                    class="px-2 py-1 text-slate-600 hover:text-brand-700 rounded-lg border border-slate-200 hover:bg-slate-100 text-[10px] font-semibold inline-flex items-center gap-1 cursor-pointer">
                                    <i class="fa-solid fa-circle-info text-brand-600"></i>
                                  </button>
                                </td>
                              </tr>
                            `;
                          }).join('')}
                        </tbody>
                      </table>
                    </div>
                  `}
                </div>
              ` : ''}
            </div>
          `;
        }).join('');

        listEl.querySelectorAll('.rec-btn-complete-sv').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const svId = btn.getAttribute('data-complete-sv-id');
            const target = subvoyages.find(s => s.id === svId);
            if (!target) return;
            target.status = 'Завершений';
            recExpandedInboundSvIds.delete(svId);
            if (typeof window.refreshSubvoyagesWorkspace === 'function') window.refreshSubvoyagesWorkspace();
            renderReceivingMode();
            toast(`Підрейс ${svId} переведено у статус «Завершений»`);
          });
        });
      }
    }

    // Права таблиця розформованих перевезень
    const thead = document.getElementById('rec-shipments-thead');
    if (thead) {
      thead.innerHTML = `
        <th class="py-2 px-2">Перевезення</th>
        <th class="py-2 px-2">Дата прийняття / вивантаження</th>
        <th class="py-2 px-2">Габарити</th>
        <th class="py-2 px-2 text-right">Інфо</th>
      `;
    }

    const resolveShipmentUnloadDate = (tr, prevSv) => {
      return (
        tr.acceptance?.receiveDate ||
        tr.receivedAt ||
        tr.unloadedAt ||
        prevSv?.receivedAt ||
        prevSv?.actualArrival ||
        tr.dateArrivalExpected ||
        prevSv?.plannedArrival ||
        tr.cargoes?.[0]?.receiveDate ||
        tr.dateReady ||
        '2026-10-05 14:20'
      );
    };

    let recShipments = transports.filter(tr => {
      return Boolean(tr.acceptance) ||
        Boolean(tr.receivedAt) ||
        Boolean(tr.previousSubvoyageId) ||
        tr.status === 'Отримано на складі' ||
        tr.status === 'Прийнято з коригуванням / уточненням' ||
        unloadedOnly.some(sv => sv.id === tr.subvoyageId);
    });

    if (recModalFilters.transports.size > 0) {
      recShipments = recShipments.filter(tr => {
        const prevSvId = tr.previousSubvoyageId || tr.acceptance?.subvoyageId || tr.subvoyageId || null;
        const prevSv = subvoyages.find(s => s.id === prevSvId);
        const mode = tr.transport || tr.mode || tr.transport_mode || prevSv?.transport || '';
        return Array.from(recModalFilters.transports).some(t => mode.toLowerCase().includes(t.toLowerCase()));
      });
    }

    if (recModalFilters.damage.size > 0) {
      recShipments = recShipments.filter(tr => {
        const dmg = tr.acceptance?.damageLevel || 'green';
        if (recModalFilters.damage.has('shortage') && tr.acceptance?.shortage) return true;
        return recModalFilters.damage.has(dmg);
      });
    }

    if (recModalFilters.logists.size > 0) {
      recShipments = recShipments.filter(tr => recModalFilters.logists.has(tr.logist || tr.responsible_logist || ''));
    }

    if (recModalFilters.dests.size > 0) {
      recShipments = recShipments.filter(tr => recModalFilters.dests.has(tr.destination || tr.destinationCountry || ''));
    }

    const recBadge = document.getElementById('rec-active-filters-badge');
    if (recBadge) {
      const cnt = recModalFilters.damage.size + recModalFilters.transports.size + recModalFilters.logists.size + recModalFilters.dests.size;
      recBadge.textContent = String(cnt);
      recBadge.classList.toggle('hidden', cnt === 0);
    }

    if (query) {
      recShipments = recShipments.filter(tr =>
        (tr.dfShipment || tr.id || '').toLowerCase().includes(query) ||
        (tr.client || '').toLowerCase().includes(query)
      );
    }

    const tbody = document.getElementById('rec-shipments-tbody');
    if (tbody) {
      if (recShipments.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="py-10 text-center text-slate-400">Оберіть вхідний рейс ліворуч або прийміть рейс на склад</td></tr>`;
      } else {
        tbody.innerHTML = recShipments.map(tr => {
          const prevSvId = tr.previousSubvoyageId || tr.acceptance?.subvoyageId || tr.subvoyageId || null;
          const prevSv = subvoyages.find(s => s.id === prevSvId);
          const acceptDate = resolveShipmentUnloadDate(tr, prevSv);
          const shortageBadge = tr.acceptance?.shortage ? `<span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">−${tr.acceptance.shortagePlaces} шт</span>` : '';

          return `
            <tr class="hover:bg-slate-50/80 transition cursor-pointer"
                onclick="window.openContextDrawer && window.openContextDrawer('${tr.id}')">
              <td class="py-2 px-2">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="font-mono font-bold text-brand-700 text-xs">${tr.dfShipment || tr.cargoNumber || tr.id}</span>
                </div>
              </td>
              <td class="py-2 px-2 font-mono text-[11px] font-semibold text-emerald-800 whitespace-nowrap">
                <i class="fa-regular fa-calendar-check text-emerald-600 mr-1"></i>${acceptDate}
              </td>
              <td class="py-2 px-2 whitespace-nowrap">
                <div class="font-mono text-[11px] text-slate-800">${tr.volume || 0} м³ • ${tr.weight || 0} кг • ${tr.places || 0} шт</div>
                ${shortageBadge ? `<div class="mt-0.5">${shortageBadge}</div>` : ''}
              </td>
              <td class="py-2 px-2 text-right whitespace-nowrap" onclick="event.stopPropagation()">
                <button type="button" onclick="window.openContextDrawer && window.openContextDrawer('${tr.id}')"
                  class="px-2 py-1 text-slate-600 hover:text-brand-700 rounded-lg border border-slate-200 hover:bg-slate-100 text-[10px] font-semibold inline-flex items-center gap-1 cursor-pointer">
                  <i class="fa-solid fa-circle-info text-brand-600"></i>
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  window.toggleReceivingInboundAccordion = function (svId) {
    if (recExpandedInboundSvIds.has(svId)) {
      recExpandedInboundSvIds.delete(svId);
    } else {
      recExpandedInboundSvIds.add(svId);
    }
    renderReceivingMode();
  };

  // =========================================================================
  // РЕЖИМ 3 (ТАБА): ТРАНЗИТ (КРОС-ДОКІНГ: ВХІДНІ ПІДРЕЙСИ ➔ ВИХІДНІ ПІДРЕЙСИ)
  // =========================================================================
  function isTransitShipmentCompatible(tr, sv) {
    if (!tr || !sv) return { compatible: true, reasons: [] };
    const reasons = [];
    const trDest = (tr.destinationCountry || tr.destination || '').trim().toLowerCase();
    const svDest = (sv.destinationCountry || sv.destination || '').trim().toLowerCase();
    const stages = Array.isArray(sv.routeStages) ? sv.routeStages.map(s => String(s).toLowerCase()) : [];
    if (trDest && svDest && trDest !== svDest && !stages.includes(trDest)) {
      reasons.push(`Напрямок (${tr.destinationCountry || tr.destination} ≠ ${sv.destinationCountry || sv.destination})`);
    }
    if ((tr.isHazardous || tr.dangerous_goods) && sv.adrPermitted === false) {
      reasons.push('ADR заборонено');
    }
    if ((tr.temperatureControl || tr.temperatureRequired) && sv.temperatureSupported === false) {
      reasons.push('Потрібен рефрижератор');
    }
    return { compatible: reasons.length === 0, reasons };
  }

  function getTransitPrevSvId(tr) {
    return tr?.previousSubvoyageId || tr?.acceptance?.subvoyageId || null;
  }

  function isTransitCandidate(tr) {
    return Boolean(getTransitPrevSvId(tr));
  }

  function isInboundTransitSubvoyage(sv) {
    if (!sv) return false;
    // У Транзиті зліва тільки вхідні підрейси "В дорозі" або вже перевантажені ("Вивантажений")
    return sv.status === 'В дорозі' || sv.status === 'Вивантажений';
  }

  function getInboundSubvoyageShipments(svId, transports) {
    return transports.filter(tr =>
      tr.subvoyageId === svId ||
      tr.previousSubvoyageId === svId ||
      tr.acceptance?.subvoyageId === svId
    );
  }

  function isShipmentTransferredFromInbound(tr, inboundSvId) {
    return Boolean(tr.subvoyageId && tr.subvoyageId !== inboundSvId);
  }

  function syncTransitSourceSubvoyageStatus(sourceSvId) {
    if (!sourceSvId) return;
    const subvoyages = getSubvoyages();
    const transports = getTransports();
    const sourceSv = subvoyages.find(s => s.id === sourceSvId);
    if (!sourceSv) return;

    const svShipments = getInboundSubvoyageShipments(sourceSvId, transports);
    if (svShipments.length === 0) return;

    const allTransferred = svShipments.every(tr => isShipmentTransferredFromInbound(tr, sourceSvId));
    if (allTransferred && sourceSv.status === 'В дорозі') {
      sourceSv.status = 'Вивантажений';
      trExpandedInboundSvIds.delete(sourceSvId);
      toast(`Усі перевезення з ${sourceSvId} перевантажено — статус змінено на «Вивантажений»`);
    } else if (!allTransferred && sourceSv.status === 'Вивантажений') {
      sourceSv.status = 'В дорозі';
    }
  }

  function renderTransitMode() {
    const subvoyages = getSubvoyages();
    const transports = getTransports();
    const query = (document.getElementById('tr-search-input')?.value || '').trim().toLowerCase();

    const inTransitSvs = subvoyages.filter(sv => sv.status === 'В дорозі');
    const unloadedSvs = subvoyages.filter(sv => sv.status === 'Вивантажений');

    const setBadge = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setBadge('tr-badge-in-transit', inTransitSvs.length);
    setBadge('tr-badge-unloaded', unloadedSvs.length);
    setBadge('tr-badge-all', inTransitSvs.length + unloadedSvs.length);

    const activeSv = subvoyages.find(s => s.id === trActiveOutboundSvId) || null;
    const focusPill = document.getElementById('tr-active-sv-focus-pill');
    const headerTitle = document.getElementById('tr-active-sv-header-title');

    if (activeSv) {
      focusPill?.classList.remove('hidden');
      if (focusPill) focusPill.textContent = `Куди: ${activeSv.id}`;
      if (headerTitle) headerTitle.textContent = `${activeSv.id} • ${activeSv.destinationCountry || activeSv.destination || ''}`;
    } else {
      focusPill?.classList.add('hidden');
      if (headerTitle) headerTitle.textContent = 'Усі підрейси';
    }

    let visibleInboundSvs = trFilter === 'unloaded'
      ? unloadedSvs
      : (trFilter === 'in_transit' ? inTransitSvs : [...inTransitSvs, ...unloadedSvs]);

    if (trModalFilters.prevSvs.size > 0) {
      visibleInboundSvs = visibleInboundSvs.filter(sv => trModalFilters.prevSvs.has(sv.id));
    }

    if (query) {
      visibleInboundSvs = visibleInboundSvs.filter(sv => {
        const svMatch =
          (sv.id || '').toLowerCase().includes(query) ||
          (sv.name || '').toLowerCase().includes(query) ||
          (sv.externalFlight || '').toLowerCase().includes(query) ||
          (sv.receivingWarehouse || '').toLowerCase().includes(query) ||
          (sv.route || '').toLowerCase().includes(query);
        if (svMatch) return true;
        const svShipments = getInboundSubvoyageShipments(sv.id, transports);
        return svShipments.some(tr =>
          (tr.dfShipment || tr.id || '').toLowerCase().includes(query) ||
          (tr.client || '').toLowerCase().includes(query)
        );
      });
    }

    // Сортуємо за плановою датою прибуття (найближчі зверху) та показуємо до 3 вхідних підрейсів у транзиті
    visibleInboundSvs = [...visibleInboundSvs].sort((a, b) => {
      const da = a.plannedArrival || a.receivedAt || '9999-12-31';
      const db = b.plannedArrival || b.receivedAt || '9999-12-31';
      return da.localeCompare(db);
    }).slice(0, 3);

    if (!trInboundAutoInitialized && visibleInboundSvs.length > 0) {
      trExpandedInboundSvIds.add(visibleInboundSvs[0].id);
      trInboundAutoInitialized = true;
    }

    const trBadge = document.getElementById('tr-active-filters-badge');
    if (trBadge) {
      const cnt = trModalFilters.prevSvs.size + trModalFilters.dests.size + trModalFilters.conditions.size;
      trBadge.textContent = String(cnt);
      trBadge.classList.toggle('hidden', cnt === 0);
    }

    const ui = window.SubvoyageSharedUI || {};
    const currentWhName = window.DashboardModule?.data?.name || 'Склад Варшава';
    const getMarkers = typeof ui.getShipmentMarkerGroups === 'function'
      ? ui.getShipmentMarkerGroups
      : () => ({ docs: [], loading: [], special: [] });
    const renderMarkers = typeof ui.renderMarkerListBadges === 'function'
      ? ui.renderMarkerListBadges
      : () => '<span class="text-[10px] text-slate-300 italic">—</span>';

    const inboundListEl = document.getElementById('tr-inbound-voyages-list');
    if (inboundListEl) {
      if (visibleInboundSvs.length === 0) {
        inboundListEl.innerHTML = `<div class="p-8 text-center text-slate-400 italic text-xs bg-white rounded-xl border border-slate-200">${trFilter === 'in_transit' ? 'Немає вхідних підрейсів у статусі «В дорозі».' : 'Немає вивантажених (перевантажених) підрейсів.'}</div>`;
      } else {
        const currentSvCap = activeSv && typeof ui.calculateSubvoyageCapacity === 'function'
          ? ui.calculateSubvoyageCapacity(activeSv.id)
          : null;

        inboundListEl.innerHTML = visibleInboundSvs.map(sv => {
          const isInTransit = sv.status === 'В дорозі';
          // Якщо підрейс вже «Вивантажений», у ньому більше немає активних перевезень
          const allSvShipments = isInTransit ? getInboundSubvoyageShipments(sv.id, transports) : [];
          let svShipments = allSvShipments;

          if (trModalFilters.dests.size > 0) {
            svShipments = svShipments.filter(tr => trModalFilters.dests.has(tr.destination || tr.destinationCountry || ''));
          }
          if (trModalFilters.conditions.size > 0) {
            svShipments = svShipments.filter(tr => {
              const hasIssue = Boolean(tr.acceptance?.shortage) || tr.acceptance?.damageLevel === 'yellow' || tr.acceptance?.damageLevel === 'red';
              if (trModalFilters.conditions.has('issues') && hasIssue) return true;
              if (trModalFilters.conditions.has('ok') && !hasIssue) return true;
              return false;
            });
          }

          const transferredCount = allSvShipments.filter(tr => isShipmentTransferredFromInbound(tr, sv.id)).length;
          const totalCount = allSvShipments.length;
          const pendingInSv = svShipments.filter(tr => !isShipmentTransferredFromInbound(tr, sv.id));
          const pendingVol = pendingInSv.reduce((acc, t) => acc + Number(t.volume || 0), 0);
          const pendingWeight = pendingInSv.reduce((acc, t) => acc + Number(t.weight || 0), 0);
          const pendingPlaces = pendingInSv.reduce((acc, t) => acc + Number(t.places || 0), 0);
          const maxVol = Number(sv.maxVolume) || 1;
          const pctVol = Math.min(100, Math.round((pendingVol / maxVol) * 100));

          const isExpanded = isInTransit && trExpandedInboundSvIds.has(sv.id);
          const statusCls = isInTransit
            ? 'bg-amber-100 text-amber-800 border-amber-200'
            : 'bg-emerald-100 text-emerald-800 border-emerald-200';
          const receiveDateVal = sv.receivedAt || sv.actualArrival || sv.plannedArrival || '—';
          const tIcon = typeof ui.getTransportIcon === 'function'
            ? ui.getTransportIcon(sv.transport)
            : { icon: 'fa-solid fa-truck', color: 'text-slate-500' };

          return `
            <div class="p-2.5 rounded-xl border transition select-none space-y-2 ${isExpanded
              ? 'bg-white border-indigo-400 ring-2 ring-indigo-500/15 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'}">

              <!-- Рядок 1: Назва, ID, Системний стан + Кількість перевезень, Вибрати всі / Завершити та Інфо -->
              <div class="flex justify-between items-start gap-2 ${isInTransit ? 'cursor-pointer' : ''}" ${isInTransit ? `onclick="window.toggleTransitInboundAccordion('${sv.id}')"` : ''}>
                <div class="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span class="font-bold text-xs text-slate-900 truncate">${sv.name || 'Вхідний підрейс'}</span>
                  <span class="text-[10px] font-mono font-bold text-brand-700 bg-brand-100 px-1.5 py-0.2 rounded">${sv.id}</span>
                  <span class="px-1.5 py-0.2 rounded-full border text-[10px] font-bold ${statusCls}">${sv.status}</span>
                  ${isInTransit && pendingInSv.length > 0 ? `
                    <span class="px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold text-[9px] inline-flex items-center gap-1" title="Залишилось перевантажити перевезень">
                      <span>Залишилось: ${pendingInSv.length}/${totalCount}</span>
                    </span>
                  ` : ''}
                </div>
                <div class="flex items-center gap-1 shrink-0" onclick="event.stopPropagation()">
                  ${isInTransit ? `
                    ${pendingInSv.length > 0 ? `
                      <button type="button" onclick="window.selectAllTransitInboundShipments('${sv.id}')"
                        class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition flex items-center gap-1 cursor-pointer"
                        title="Вибрати всі ще не перевантажені перевезення з цього підрейсу">
                        <i class="fa-solid fa-check-double text-[9px]"></i>
                        <span>Вибрати всі (${pendingInSv.length})</span>
                      </button>
                    ` : ''}
                    <button type="button" onclick="window.toggleTransitInboundAccordion('${sv.id}')"
                      class="px-2 py-0.5 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${isExpanded
                        ? 'bg-brand-600 text-white border-brand-700 shadow-2xs'
                        : 'bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 border-slate-200'}"
                      title="Розгорнути / згорнути список перевезень цього підрейсу">
                      <i class="fa-solid fa-boxes-stacked text-[9px]"></i>
                      <span>Перевезень: ${svShipments.length}</span>
                      <i class="fa-solid fa-chevron-down text-[8px] transition-transform ${isExpanded ? 'rotate-180' : ''}"></i>
                    </button>
                  ` : `
                    <button type="button" onclick="window.completeTransitSubvoyage('${sv.id}')"
                      class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1 cursor-pointer shadow-2xs">
                      <i class="fa-solid fa-flag-checkered text-emerald-400 text-[9px]"></i>
                      <span>Завершити підрейс</span>
                    </button>
                  `}
                  <button type="button" onclick="window.openSubvoyageDrawer && window.openSubvoyageDrawer('${sv.id}', event)"
                    class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Подивитись усю інформацію про підрейс">
                    <i class="fa-solid fa-circle-info text-brand-600"></i>
                    <span>Інфо</span>
                  </button>
                </div>
              </div>

              <!-- Рядок 2: Зовнішній рейс та Дата отримання -->
              <div class="flex items-center justify-between gap-1.5 flex-wrap text-[10px]">
                <div class="flex items-center gap-1.5 flex-wrap">
                  ${sv.externalFlight ? `<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono font-bold text-[10px]"><i class="fa-solid fa-globe text-slate-400 mr-1"></i>${sv.externalFlight}</span>` : ''}
                </div>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="bg-brand-50 text-brand-900 border border-brand-200 px-2 py-0.5 rounded font-mono font-bold text-[10px] inline-flex items-center gap-1" title="Планова / фактична дата отримання на складі">
                    <i class="fa-regular fa-calendar-check text-brand-600"></i>
                    <span>Отрим: ${receiveDateVal}</span>
                  </span>
                </div>
              </div>

              <!-- Рядок 3: Габарити та прогрес-бар (ідентичний до правої сторони) -->
              ${isInTransit ? `
                <div class="pt-1 border-t border-slate-100 space-y-1">
                  <div class="flex justify-between items-center text-[10px] font-mono text-slate-600 flex-wrap gap-1">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="text-indigo-700 font-bold">Залишок: ${pendingVol.toFixed(1)} м³</span>
                      <span class="text-slate-400">/ ${sv.maxVolume || 0} м³</span>
                      <span class="text-slate-300">•</span>
                      <span><strong>${Math.round(pendingWeight)}</strong>/${sv.maxWeight || 0} кг</span>
                      <span class="text-slate-300">•</span>
                      <span><strong>${pendingPlaces}</strong>${sv.maxPlaces ? `/${sv.maxPlaces}` : ''} місць</span>
                    </div>
                  </div>
                  <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex border border-slate-300/40">
                    <div class="bg-indigo-500 h-2 transition-all duration-300" style="width: ${pctVol}%"></div>
                  </div>
                </div>
              ` : `
                <div class="pt-1 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Усі перевезення перевантажено та виведено з цього підрейсу</span>
                </div>
              `}

              <!-- Розгорнутий список перевезень усередині вхідного підрейсу (з маркерами) -->
              ${isExpanded ? `
                <div class="mt-2 pt-2 border-t border-slate-200/90 space-y-1.5" onclick="event.stopPropagation()">
                  ${svShipments.length === 0 ? `
                    <div class="p-2.5 text-center text-slate-400 italic text-[11px] bg-slate-50 rounded-lg border border-dashed border-slate-200">Немає перевезень за обраним фільтром.</div>
                  ` : `
                    <div class="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                      <table class="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr class="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                            <th class="py-1.5 px-2">Перевезення / Маршрут</th>
                            <th class="py-1.5 px-2">Габарити</th>
                            <th class="py-1.5 px-2">Документи / Експорт</th>
                            <th class="py-1.5 px-2">Склад / Завантаження</th>
                            <th class="py-1.5 px-2">Особливості</th>
                            <th class="py-1.5 px-2 text-center">Перевантаження</th>
                            <th class="py-1.5 px-2 text-right">Інфо</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 bg-white">
                        ${svShipments.map(tr => {
                          const isTransferred = isShipmentTransferredFromInbound(tr, sv.id);
                          const targetSv = isTransferred ? subvoyages.find(s => s.id === tr.subvoyageId) : null;
                          const isSelected = trSelectedIds.has(tr.id);
                          const mGroups = getMarkers(tr);
                          const compat = activeSv ? isTransitShipmentCompatible(tr, activeSv) : { compatible: true, reasons: [] };
                          const fitInfo = (activeSv && currentSvCap && typeof ui.evaluateShipmentFitForSubvoyage === 'function')
                            ? ui.evaluateShipmentFitForSubvoyage(tr, activeSv, currentSvCap)
                            : null;

                          let actionHtml = '';
                          if (isTransferred) {
                            actionHtml = `
                              <div class="inline-flex items-center gap-1 flex-wrap justify-center">
                                <span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono text-[10px] font-bold">➔ ${targetSv ? targetSv.id : tr.subvoyageId}</span>
                                <button type="button" onclick="window.undoTransitTransfer('${tr.id}', '${sv.id}')"
                                  class="w-5 h-5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition inline-flex items-center justify-center cursor-pointer"
                                  title="Скасувати перевантаження і повернути в ${sv.id}">
                                  <i class="fa-solid fa-xmark text-[10px]"></i>
                                </button>
                              </div>
                            `;
                          } else if (activeSv) {
                            const btnCls = (fitInfo && !fitInfo.fits) || !compat.compatible
                              ? 'bg-amber-600 hover:bg-amber-700 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white';
                            const btnTitle = !compat.compatible
                              ? `Увага: ${compat.reasons.join(', ')}`
                              : (fitInfo ? fitInfo.tooltip : `Перевантажити в ${activeSv.id}`);
                            actionHtml = `
                              <button type="button" onclick="window.assignTransitShipmentToSubvoyage('${tr.id}', '${activeSv.id}', '${sv.id}')"
                                class="px-2.5 py-1 ${btnCls} rounded-lg text-[10px] font-bold shadow-2xs transition inline-flex items-center gap-1 cursor-pointer"
                                title="${btnTitle}">
                                ${!compat.compatible || (fitInfo && !fitInfo.fits) ? '<i class="fa-solid fa-triangle-exclamation text-[9px]"></i>' : ''}
                                <span>+ У ${activeSv.id}</span>
                              </button>
                            `;
                          } else {
                            actionHtml = `<span class="text-[10px] text-slate-400 font-medium">Очікує вибору рейсу</span>`;
                          }

                          return `
                            <tr class="hover:bg-slate-50 transition cursor-pointer ${isSelected ? 'bg-indigo-50/50' : (activeSv && !isTransferred && compat.compatible) ? 'bg-emerald-50/20' : ''}"
                                onclick="window.openContextDrawer && window.openContextDrawer('${tr.id}')">
                              <td class="py-2 px-2.5">
                                <div class="flex items-center gap-2">
                                  <input type="checkbox" class="tr-row-cb rounded text-indigo-600 cursor-pointer shrink-0"
                                    data-tr-id="${tr.id}" data-source-sv-id="${sv.id}"
                                    ${isSelected ? 'checked' : ''} ${isTransferred ? 'disabled' : ''}
                                    onclick="event.stopPropagation()">
                                  <div class="min-w-0">
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                      <span class="font-mono font-bold text-brand-700 text-xs">${tr.dfShipment || tr.cargoNumber || tr.id}</span>
                                      ${typeof ui.renderCompactTransportTypeBadge === 'function' ? ui.renderCompactTransportTypeBadge(tr) : ''}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td class="py-2 px-2 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                                <div><strong>${tr.volume || 0}</strong> м³ <span class="text-slate-300">|</span> <strong>${tr.weight || 0}</strong> кг <span class="text-slate-300">|</span> <span class="text-slate-500">${tr.places || 0} шт</span></div>
                                ${fitInfo && !isTransferred && fitInfo.badgeHtml ? `<div class="mt-0.5 font-sans">${fitInfo.badgeHtml}</div>` : ''}
                              </td>
                              <td class="py-2 px-2">${renderMarkers(mGroups.docs)}</td>
                              <td class="py-2 px-2">${renderMarkers(mGroups.loading)}</td>
                              <td class="py-2 px-2">${renderMarkers(mGroups.special)}</td>
                              <td class="py-2 px-2 text-center whitespace-nowrap" onclick="event.stopPropagation()">
                                ${actionHtml}
                              </td>
                              <td class="py-2 px-2.5 text-right whitespace-nowrap" onclick="event.stopPropagation()">
                                <button type="button" onclick="window.openContextDrawer && window.openContextDrawer('${tr.id}')"
                                  class="px-2 py-1 text-slate-600 hover:text-brand-700 rounded-lg border border-slate-200 hover:bg-slate-100 text-[10px] font-semibold inline-flex items-center gap-1 cursor-pointer">
                                  <i class="fa-solid fa-circle-info text-brand-600"></i>
                                </button>
                              </td>
                            </tr>
                          `;
                        }).join('')}
                        </tbody>
                      </table>
                    </div>
                  `}
                </div>
              ` : ''}
            </div>
          `;
        }).join('');

        inboundListEl.querySelectorAll('.tr-row-cb').forEach(cb => {
          cb.addEventListener('change', () => {
            const id = cb.getAttribute('data-tr-id');
            if (cb.checked) trSelectedIds.add(id);
            else trSelectedIds.delete(id);
            updateTrSelectionUI();
          });
        });
      }
    }

    // Права панель: Дошка Вихідних Підрейсів транзиту з фільтрами як у Дошці Підрейсів
    const TR_OUTBOUND_ALLOWED_STATUSES = new Set(['Формування', 'Формується', 'Завантажений']);
    const transitOutboundPool = subvoyages.filter(s => s.isTransitOutbound && TR_OUTBOUND_ALLOWED_STATUSES.has(s.status));
    const baseOutboundSvs = transitOutboundPool.length > 0
      ? transitOutboundPool
      : subvoyages.filter(s => TR_OUTBOUND_ALLOWED_STATUSES.has(s.status));

    const allOutboundStatuses = Array.from(new Set(baseOutboundSvs.map(s => s.status).filter(Boolean)));
    if (!allOutboundStatuses.includes('Формування')) allOutboundStatuses.unshift('Формування');
    if (!allOutboundStatuses.includes('Завантажений')) allOutboundStatuses.push('Завантажений');
    const allOutboundHubs = Array.from(new Set(baseOutboundSvs.map(s => s.destinationHub || s.destinationCountry || s.destination).filter(Boolean))).sort();

    if (!trOutboundFiltersInitialized) {
      const defaultFormationStatuses = allOutboundStatuses.filter(st => st === 'Формування');
      trOutboundStatuses = new Set(defaultFormationStatuses.length > 0 ? defaultFormationStatuses : allOutboundStatuses);
      trOutboundFiltersInitialized = true;
    }

    const updateTrOutboundStatusLabel = () => {
      const label = document.getElementById('tr-sv-status-multiselect-label');
      if (!label || !trOutboundStatuses) return;
      const count = trOutboundStatuses.size;
      if (count === allOutboundStatuses.length) label.textContent = 'Усі статуси';
      else if (count === 0) label.textContent = 'Не обрано (0)';
      else if (count <= 2) label.textContent = Array.from(trOutboundStatuses).join(', ');
      else label.textContent = `Статусів: ${count}`;
    };

    const statusContainer = document.getElementById('tr-sv-status-checkboxes-container');
    if (statusContainer) {
      statusContainer.innerHTML = allOutboundStatuses.map(st => `
        <label class="flex items-center gap-2 text-xs text-slate-700 hover:bg-slate-50 p-1 rounded cursor-pointer select-none">
          <input type="checkbox" value="${st}" ${trOutboundStatuses?.has(st) ? 'checked' : ''} class="tr-sv-status-cb rounded text-brand-600 focus:ring-brand-500 cursor-pointer">
          <span class="truncate">${st}</span>
        </label>
      `).join('');
      statusContainer.querySelectorAll('.tr-sv-status-cb').forEach(cb => {
        cb.addEventListener('change', () => {
          if (cb.checked) trOutboundStatuses.add(cb.value);
          else trOutboundStatuses.delete(cb.value);
          updateTrOutboundStatusLabel();
          renderTransitMode();
        });
      });
    }
    updateTrOutboundStatusLabel();

    const hubSelect = document.getElementById('tr-sv-destination-hub-filter');
    if (hubSelect) {
      hubSelect.innerHTML = `
        <option value="all">Усі склади доставки</option>
        ${allOutboundHubs.map(h => `<option value="${h}" ${h === trOutboundDestHub ? 'selected' : ''}>${h}</option>`).join('')}
      `;
    }

    const sortSelect = document.getElementById('tr-sv-sort-select');
    if (sortSelect) sortSelect.value = trOutboundSortMode;

    let outboundSvs = baseOutboundSvs.filter(sv => {
      if (trOutboundStatuses && !trOutboundStatuses.has(sv.status)) return false;
      if (trOutboundDestHub !== 'all') {
        const hubVal = sv.destinationHub || sv.destinationCountry || sv.destination || '';
        if (hubVal !== trOutboundDestHub) return false;
      }
      return true;
    });

    const getTrStatusPriority = (st) => {
      if (st === 'Формування' || st === 'Формується') return 1;
      if (st === 'Завантажений') return 2;
      return 3;
    };
    outboundSvs = [...outboundSvs].sort((a, b) => {
      if (trOutboundSortMode === 'plannedDeparture_asc') {
        const depA = a.plannedDeparture || '9999-12-31';
        const depB = b.plannedDeparture || '9999-12-31';
        return depA.localeCompare(depB);
      }
      if (trOutboundSortMode === 'plannedDeparture_desc') {
        const depA = a.plannedDeparture || '0000-01-01';
        const depB = b.plannedDeparture || '0000-01-01';
        return depB.localeCompare(depA);
      }
      const pA = getTrStatusPriority(a.status);
      const pB = getTrStatusPriority(b.status);
      if (pA !== pB) return pA - pB;
      return (a.plannedDeparture || '9999-12-31').localeCompare(b.plannedDeparture || '9999-12-31');
    });

    const outboundListEl = document.getElementById('tr-outbound-voyages-list');
    if (outboundListEl) {
      if (outboundSvs.length === 0) {
        outboundListEl.innerHTML = `<div class="p-4 text-center text-slate-400 italic text-xs bg-white rounded-xl border border-slate-200">Немає вихідних підрейсів у статусі «Формування» або «Завантажений». Створіть новий підрейс.</div>`;
      } else {
        let orderedOutboundSvs = outboundSvs;
        const hasActiveInList = Boolean(trActiveOutboundSvId && outboundSvs.some(s => s.id === trActiveOutboundSvId));
        if (hasActiveInList) {
          const activeSvObj = outboundSvs.find(s => s.id === trActiveOutboundSvId);
          const otherSvs = outboundSvs.filter(s => s.id !== trActiveOutboundSvId);
          orderedOutboundSvs = [activeSvObj, ...otherSvs];
        }

        if (typeof ui.buildSubvoyageCardHtml === 'function') {
          outboundListEl.innerHTML = orderedOutboundSvs.map(sv => ui.buildSubvoyageCardHtml(sv, {
            isActive: sv.id === trActiveOutboundSvId,
            hasActiveInList,
            isExpanded: trExpandedSvIds.has(sv.id),
            isTransitMode: true,
            onSelectFnName: 'window.selectTransitOutboundSubvoyage',
            onToggleAccordionFnName: 'window.toggleTransitSubvoyageAccordion'
          })).join('');
        }
      }
    }

    updateTrSelectionUI();
  }

  window.completeTransitSubvoyage = function (svId) {
    const subvoyages = getSubvoyages();
    const sv = subvoyages.find(s => s.id === svId);
    if (!sv) return;
    sv.status = 'Завершений';
    trExpandedInboundSvIds.delete(svId);
    if (typeof window.refreshSubvoyagesWorkspace === 'function') window.refreshSubvoyagesWorkspace();
    renderTransitMode();
    toast(`Підрейс ${svId} переведено у статус «Завершений»`);
  };

  window.toggleTransitInboundAccordion = function (svId) {
    if (trExpandedInboundSvIds.has(svId)) trExpandedInboundSvIds.delete(svId);
    else trExpandedInboundSvIds.add(svId);
    renderTransitMode();
  };

  window.selectAllTransitInboundShipments = function (svId) {
    const transports = getTransports();
    const svShipments = getInboundSubvoyageShipments(svId, transports);
    let added = 0;
    svShipments.forEach(tr => {
      if (!isShipmentTransferredFromInbound(tr, svId)) {
        trSelectedIds.add(tr.id);
        added++;
      }
    });
    trExpandedInboundSvIds.add(svId);
    renderTransitMode();
    if (added > 0) toast(`Обрано ${added} перевезень із вхідного підрейсу ${svId}`);
  };

  window.undoTransitTransfer = function (shipmentId, sourceSvId) {
    const transports = getTransports();
    const tr = transports.find(t => t.id === shipmentId);
    if (!tr) return;
    tr.subvoyageId = sourceSvId;
    if (tr.previousSubvoyageId === sourceSvId) delete tr.previousSubvoyageId;
    tr.transitPlanned = false;
    syncTransitSourceSubvoyageStatus(sourceSvId);
    if (typeof window.refreshSubvoyagesWorkspace === 'function') window.refreshSubvoyagesWorkspace();
    renderTransitMode();
    toast(`Перевезення ${tr.dfShipment || tr.id} повернуто у вхідний підрейс ${sourceSvId}`);
  };

  window.selectTransitOutboundSubvoyage = function (svId) {
    if (trActiveOutboundSvId === svId) {
      trActiveOutboundSvId = null;
      trExpandedSvIds.clear();
    } else {
      trActiveOutboundSvId = svId;
      trExpandedSvIds = new Set([svId]);
      const listEl = document.getElementById('tr-outbound-voyages-list');
      if (listEl) listEl.scrollTop = 0;
    }
    renderTransitMode();
  };

  window.toggleTransitSubvoyageAccordion = function (svId, event) {
    if (event) event.stopPropagation();
    if (trExpandedSvIds.has(svId)) trExpandedSvIds.delete(svId);
    else trExpandedSvIds.add(svId);
    renderTransitMode();
  };

  function applyTransitTransferToShipment(tr, targetSvId, explicitSourceSvId) {
    const sourceSvId = explicitSourceSvId || tr.previousSubvoyageId || tr.subvoyageId || null;

    if (sourceSvId && sourceSvId !== targetSvId && !tr.previousSubvoyageId) {
      tr.previousSubvoyageId = sourceSvId;
    }
    tr.subvoyageId = targetSvId;
    tr.readinessCategory = 'ready';
    tr.status = 'Готовий до завантаження';
    tr.transitPlanned = false;
    return sourceSvId;
  }

  window.assignTransitShipmentToSubvoyage = function (shipmentId, svId, explicitSourceSvId) {
    const transports = getTransports();
    const tr = transports.find(t => t.id === shipmentId);
    if (!tr) return;
    const sourceSvId = applyTransitTransferToShipment(tr, svId, explicitSourceSvId);
    trSelectedIds.delete(tr.id);
    syncTransitSourceSubvoyageStatus(sourceSvId);
    if (typeof window.refreshSubvoyagesWorkspace === 'function') window.refreshSubvoyagesWorkspace();
    renderTransitMode();
    toast(`Перевантажено ${tr.dfShipment || tr.id} у вихідний підрейс ${svId}`);
  };

  function updateTrSelectionUI() {
    const count = trSelectedIds.size;
    const counter = document.getElementById('tr-selected-counter');
    if (counter) counter.textContent = `Обрано: ${count} перевезень`;

    const btnReassign = document.getElementById('tr-btn-reassign-outbound');
    const btnLabel = document.getElementById('tr-btn-reassign-label');
    if (btnLabel) {
      btnLabel.textContent = trActiveOutboundSvId
        ? `Перевантажити обрані в ${trActiveOutboundSvId}`
        : 'Оберіть вихідний підрейс праворуч';
    }
    if (btnReassign) btnReassign.disabled = count === 0 || !trActiveOutboundSvId;
  }

  // =========================================================================
  // РЕЖИМ 3: РОБОТА З ВАНТАЖАМИ (ЗАГАЛЬНА ТАБЛИЦЯ ПО ВСІЙ ШИРИНІ)
  // =========================================================================
  function getCargoPhotoList(c) {
    const list = [];
    if (Array.isArray(c.photos)) list.push(...c.photos);
    if (Array.isArray(c.photoStages)) {
      c.photoStages.forEach(st => {
        if (Array.isArray(st.photos)) st.photos.forEach(p => list.push({ url: p, stage: st.stage || 'Етап' }));
      });
    }
    return list;
  }

  // Довідник статусів Вантажу (Ерайву) згідно з Розділом 2.2 документації
  const CARGO_STATUS_LABELS = {
    new: 'Новий',
    at_origin_warehouse: 'На складі відправки',
    received_unmarked: 'Отримано непромаркованим',
    transferred_to_logistician: 'Передано',
    transfered_to_logistician_for_marking: 'Передано логісту на маркування',
    storaging_in_warehouse: 'Зберігання на складі',
    waiting_for_other_parts: 'Очікує інші частини',
    awaiting_readiness: 'Очікує готовності',
    ready_for_loading: 'Готовий до завантаження',
    in_transit: 'В дорозі',
    at_destination_warehouse: 'На складі призначення',
    issued: 'Виданий',
    returned_to_customer: 'Повернено клієнту',
    waiting_for_task_execution: 'Очікує виконання завдання по вантажу'
  };

  const CARGO_UNMARKED_STATUSES = new Set([
    'received_unmarked', 'Отримано непромаркованим',
    'transfered_to_logistician_for_marking', 'Передано логісту на маркування'
  ]);

  const CARGO_WAREHOUSE_STATUSES = new Set([
    'at_origin_warehouse', 'На складі відправки'
  ]);

  function getCargoCanonicalStatus(c) {
    const raw = c.statusCode || c.status || (c.readinessCategory === 'unmarked' ? 'received_unmarked' : 'at_origin_warehouse');
    return CARGO_STATUS_LABELS[raw] || c.status || raw;
  }

  function isCargoUnmarked(c) {
    return c.readinessCategory === 'unmarked' || CARGO_UNMARKED_STATUSES.has(c.statusCode) || CARGO_UNMARKED_STATUSES.has(c.status);
  }

  function isCargoOnWarehouse(c) {
    if (isCargoUnmarked(c)) return false;
    return CARGO_WAREHOUSE_STATUSES.has(c.statusCode) || CARGO_WAREHOUSE_STATUSES.has(c.status);
  }

  function getOpsCargoKey(c) {
    return String(c.id || c.cargoNumber || c.cargoCode || c.dfShipment || '');
  }

  function escapeOpsHtml(val) {
    return String(val ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatOpsNum(val, decimals = 2) {
    const n = Number(val) || 0;
    return Number.isInteger(n) ? String(n) : n.toFixed(decimals).replace(/\.?0+$/, '');
  }

  function closeOpsRowActionMenu() {
    const menu = document.getElementById('ops-row-action-menu');
    if (menu) {
      menu.classList.add('hidden');
      menu.innerHTML = '';
    }
    opsOpenMenuCargoId = null;
  }

  function findOpsCargoById(cid) {
    const key = String(cid);
    return getStorekeeperCargoes().find(c => getOpsCargoKey(c) === key) || null;
  }

  function syncAfterOpsMutation() {
    if (typeof window.refreshSubvoyagesWorkspace === 'function') window.refreshSubvoyagesWorkspace();
    if (window.DashboardModule && typeof window.DashboardModule.updateStats === 'function') {
      window.DashboardModule.updateStats(window.cargoesData || [], getSubvoyages());
    }
    renderCargoOpsMode();
  }

  function opsCopyCargoData(cid) {
    const c = findOpsCargoById(cid);
    if (!c) return;
    const code = c.cargoNumber || c.cargoCode || c.dfShipment || c.id || '—';
    const track = c.trackNumber || c.trackingNumber || '—';
    const promise = c.dfPromise || c.df_promise || '—';
    const client = c.client || '—';
    const titleUa = c.titleUa || c.name_ua || c.cargoName || '—';
    const places = Number(c.places ?? c.places_count ?? 0) || 0;
    const weight = formatOpsNum(c.weight ?? c.grossWeight ?? c.gross_weight ?? 0, 2);
    const volume = formatOpsNum(c.volume ?? 0, 3);
    const warehouse = c.warehouse || '—';
    const location = c.warehouseLocation || '—';

    const text = [
      `DF ерайв: ${code}`,
      `Трек-номер: ${track}`,
      `DF Обіцянки: ${promise}`,
      `Клієнт: ${client}`,
      `Товар: ${titleUa}`,
      `Місць: ${places} шт | Вага: ${weight} кг | Об'єм: ${volume} м³`,
      `Склад: ${warehouse}${location !== '—' ? ` (${location})` : ''}`
    ].join('\n');

    const onSuccess = () => toast(`Дані вантажу ${code} скопійовано`);
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        fallbackCopyText(text, onSuccess);
      });
    } else {
      fallbackCopyText(text, onSuccess);
    }
  }

  function fallbackCopyText(text, onSuccess) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (onSuccess) onSuccess();
    } catch (e) {
      toast('Не вдалося скопіювати дані вантажу', true);
    }
  }

  function opsOpenTransferModal(cids) {
    const ids = Array.isArray(cids) ? cids.map(String).filter(Boolean) : [];
    if (ids.length === 0) return;
    opsTransferTargetIds = ids;

    const allCargoes = getStorekeeperCargoes();
    const targets = allCargoes.filter(c => ids.includes(getOpsCargoKey(c)));

    const countEl = document.getElementById('ops-transfer-count');
    if (countEl) countEl.textContent = String(targets.length || ids.length);

    const previewEl = document.getElementById('ops-transfer-preview');
    if (previewEl) {
      previewEl.innerHTML = targets.map(c => {
        const code = c.cargoNumber || c.cargoCode || c.dfShipment || c.id;
        return `<span class="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-[11px] font-semibold text-slate-700">${escapeOpsHtml(code)}</span>`;
      }).join('');
    }

    const selectEl = document.getElementById('ops-transfer-warehouse-select');
    if (selectEl) {
      const warehouseSet = new Set(opsWarehousesCatalog);
      allCargoes.forEach(c => { if (c.warehouse) warehouseSet.add(c.warehouse); });
      const currentWarehouses = new Set(targets.map(c => c.warehouse).filter(Boolean));
      const list = Array.from(warehouseSet);
      selectEl.innerHTML = list.map(wh => {
        const isCurrent = currentWarehouses.size === 1 && currentWarehouses.has(wh);
        return `<option value="${escapeOpsHtml(wh)}" ${isCurrent ? 'disabled' : ''}>${escapeOpsHtml(wh)}${isCurrent ? ' (поточний)' : ''}</option>`;
      }).join('');
      const firstAvailable = list.find(wh => !(currentWarehouses.size === 1 && currentWarehouses.has(wh)));
      if (firstAvailable) selectEl.value = firstAvailable;
    }

    document.getElementById('ops-transfer-modal')?.classList.remove('hidden');
  }

  function opsConfirmTransfer() {
    const targetWarehouse = document.getElementById('ops-transfer-warehouse-select')?.value;
    if (!targetWarehouse || opsTransferTargetIds.length === 0) return;

    const idSet = new Set(opsTransferTargetIds);
    const nowStr = new Date().toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    let movedCount = 0;

    const updateList = (arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(item => {
        const key = getOpsCargoKey(item);
        if (idSet.has(key)) {
          const prevWarehouse = item.warehouse || 'Не вказано';
          if (prevWarehouse !== targetWarehouse) {
            item.warehouse = targetWarehouse;
            item.warehouseLocation = 'Зона приймання (переміщено)';
            if (Array.isArray(item.timeline)) {
              item.timeline.unshift({
                date: nowStr,
                title: `Переміщено на склад: ${targetWarehouse}`,
                desc: `Зі складу «${prevWarehouse}» на «${targetWarehouse}»`,
                status: 'info'
              });
            }
            if (Array.isArray(item.movementHistory)) {
              item.movementHistory.unshift({
                date: nowStr,
                from: prevWarehouse,
                to: targetWarehouse,
                action: 'Переміщення між складами'
              });
            }
          }
        }
      });
    };

    const touched = new Set();
    getStorekeeperCargoes().forEach(c => {
      const k = getOpsCargoKey(c);
      if (idSet.has(k)) touched.add(k);
    });
    movedCount = touched.size;

    updateList(window.cargoesData);
    updateList(window.svManagementTransportsRef);
    updateList(window.svManagementShipments);

    idSet.forEach(id => opsSelectedIds.delete(id));
    opsTransferTargetIds = [];
    document.getElementById('ops-transfer-modal')?.classList.add('hidden');
    syncAfterOpsMutation();
    toast(`Переміщено ${movedCount} вантаж(ів) на склад «${targetWarehouse}»`);
  }

  function opsOpenDeleteModal(cids) {
    const ids = Array.isArray(cids) ? cids.map(String).filter(Boolean) : [];
    if (ids.length === 0) return;
    opsDeleteTargetIds = ids;

    const allCargoes = getStorekeeperCargoes();
    const targets = allCargoes.filter(c => ids.includes(getOpsCargoKey(c)));

    const countEl = document.getElementById('ops-delete-count');
    if (countEl) countEl.textContent = String(targets.length || ids.length);

    const previewEl = document.getElementById('ops-delete-preview');
    if (previewEl) {
      previewEl.innerHTML = targets.map(c => {
        const code = c.cargoNumber || c.cargoCode || c.dfShipment || c.id;
        return `<span class="px-2 py-0.5 rounded bg-white border border-rose-200 font-mono text-[11px] font-semibold text-rose-700">${escapeOpsHtml(code)}</span>`;
      }).join('');
    }

    document.getElementById('ops-delete-modal')?.classList.remove('hidden');
  }

  function opsConfirmDelete() {
    if (opsDeleteTargetIds.length === 0) return;
    const idSet = new Set(opsDeleteTargetIds);
    const deleteCount = idSet.size;

    const removeFromArrayInPlace = (arr) => {
      if (!Array.isArray(arr)) return;
      for (let i = arr.length - 1; i >= 0; i--) {
        if (idSet.has(getOpsCargoKey(arr[i]))) {
          arr.splice(i, 1);
        }
      }
    };

    removeFromArrayInPlace(window.cargoesData);
    removeFromArrayInPlace(window.svManagementTransportsRef);
    removeFromArrayInPlace(window.svManagementShipments);

    idSet.forEach(id => opsSelectedIds.delete(id));
    opsDeleteTargetIds = [];
    document.getElementById('ops-delete-modal')?.classList.add('hidden');
    syncAfterOpsMutation();
    toast(`Видалено ${deleteCount} вантаж(ів)`);
  }

  window.toggleOpsRowActionMenu = function (cid, event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('ops-row-action-menu');
    if (!menu) return;

    const key = String(cid);
    if (opsOpenMenuCargoId === key && !menu.classList.contains('hidden')) {
      closeOpsRowActionMenu();
      return;
    }

    opsOpenMenuCargoId = key;
    const safeKey = escapeOpsHtml(key);

    menu.innerHTML = `
      <button type="button" data-ops-action="edit" data-cid="${safeKey}"
        class="w-full text-left px-3 py-2 text-slate-800 hover:bg-brand-50 hover:text-brand-700 font-semibold flex items-center gap-2.5 transition cursor-pointer">
        <i class="fa-solid fa-pen text-brand-600 w-3.5 text-center"></i>
        <span>Редагувати</span>
      </button>
      <button type="button" data-ops-action="history" data-cid="${safeKey}"
        class="w-full text-left px-3 py-2 text-slate-800 hover:bg-slate-50 font-semibold flex items-center gap-2.5 border-t border-slate-100 transition cursor-pointer">
        <i class="fa-solid fa-route text-slate-500 w-3.5 text-center"></i>
        <span>Історія переміщень</span>
      </button>
      <button type="button" data-ops-action="copy" data-cid="${safeKey}"
        class="w-full text-left px-3 py-2 text-slate-800 hover:bg-slate-50 font-semibold flex items-center gap-2.5 border-t border-slate-100 transition cursor-pointer">
        <i class="fa-regular fa-copy text-slate-500 w-3.5 text-center"></i>
        <span>Скопіювати дані</span>
      </button>
      <button type="button" data-ops-action="transfer" data-cid="${safeKey}"
        class="w-full text-left px-3 py-2 text-indigo-700 hover:bg-indigo-50 font-semibold flex items-center gap-2.5 border-t border-slate-100 transition cursor-pointer">
        <i class="fa-solid fa-angles-right text-indigo-600 w-3.5 text-center"></i>
        <span>Перемістити на інший склад</span>
      </button>
      <button type="button" data-ops-action="delete" data-cid="${safeKey}"
        class="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2.5 border-t border-slate-100 transition cursor-pointer">
        <i class="fa-regular fa-trash-can text-rose-600 w-3.5 text-center"></i>
        <span>Видалити</span>
      </button>
    `;

    menu.classList.remove('hidden');

    const btn = event?.currentTarget;
    if (btn && typeof btn.getBoundingClientRect === 'function') {
      const rect = btn.getBoundingClientRect();
      const menuWidth = menu.offsetWidth || 224;
      const menuHeight = menu.offsetHeight || 200;
      let left = rect.right - menuWidth;
      if (left < 8) left = 8;
      if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8;

      let top = rect.bottom + 4;
      if (top + menuHeight > window.innerHeight - 8) {
        top = Math.max(8, rect.top - menuHeight - 4);
      }

      menu.style.left = `${left}px`;
      menu.style.top = `${top}px`;
    }
  };

  window.deselectOpsPromiseGroup = function (promiseKeyEncoded) {
    const promiseKey = decodeURIComponent(promiseKeyEncoded);
    const allCargoes = getStorekeeperCargoes();
    allCargoes.forEach(c => {
      const prRaw = (c.dfPromise || c.df_promise || '').trim();
      const pr = (prRaw && prRaw !== '—') ? prRaw : 'Без обіцянки';
      if (pr === promiseKey) {
        opsSelectedIds.delete(getOpsCargoKey(c));
      }
    });
    renderCargoOpsMode();
  };

  function formatOpsFixed(val) {
    const n = Number(val) || 0;
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderOpsSelectionBar(allCargoes, filteredCargoes) {
    const selectAllCb = document.getElementById('ops-select-all');
    if (selectAllCb) {
      const visibleIds = filteredCargoes.map(getOpsCargoKey);
      const selectedVisibleCount = visibleIds.filter(id => opsSelectedIds.has(id)).length;
      selectAllCb.checked = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
      selectAllCb.indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length;
    }

    const bar = document.getElementById('ops-selection-bar');
    if (!bar) return;

    const selectedCargoes = allCargoes.filter(c => opsSelectedIds.has(getOpsCargoKey(c)));
    if (selectedCargoes.length === 0) {
      bar.classList.add('hidden');
      return;
    }

    bar.classList.remove('hidden');

    const totalCountEl = document.getElementById('ops-sel-total-count');
    if (totalCountEl) totalCountEl.textContent = String(selectedCargoes.length);

    const promiseGroupsMap = new Map();

    selectedCargoes.forEach(c => {
      const places = Number(c.places ?? c.places_count ?? 0) || 0;
      const weight = Number(c.weight ?? c.grossWeight ?? c.gross_weight ?? 0) || 0;
      const volume = Number(c.volume ?? 0) || 0;
      const promiseRaw = (c.dfPromise || c.df_promise || '').trim();
      const hasPromise = Boolean(promiseRaw && promiseRaw !== '—');
      const promiseKey = hasPromise ? promiseRaw : 'Інше';
      const client = (c.client && String(c.client).trim()) ? String(c.client).trim() : '';

      if (!promiseGroupsMap.has(promiseKey)) {
        promiseGroupsMap.set(promiseKey, {
          promiseKey,
          hasPromise,
          count: 0,
          clients: new Set(),
          places: 0,
          weight: 0,
          volume: 0
        });
      }
      const grp = promiseGroupsMap.get(promiseKey);
      grp.count += 1;
      if (hasPromise && client && client !== '—' && client !== 'Не ідентифіковано') grp.clients.add(client);
      grp.places += places;
      grp.weight += weight;
      grp.volume += volume;
    });

    const groupsContainer = document.getElementById('ops-sel-promise-groups');
    if (!groupsContainer) return;

    const sortedGroups = Array.from(promiseGroupsMap.values()).sort((a, b) => {
      if (a.hasPromise !== b.hasPromise) return a.hasPromise ? -1 : 1;
      if (b.count !== a.count) return b.count - a.count;
      return a.promiseKey.localeCompare(b.promiseKey, 'uk');
    });

    groupsContainer.innerHTML = sortedGroups.map(g => `
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5">
        <span class="font-mono font-bold ${g.hasPromise ? 'text-purple-300' : 'text-slate-300 font-sans'}">
          ${escapeOpsHtml(g.promiseKey)} - ${g.count} шт:
        </span>
        <span class="text-slate-300">Місць - <strong class="font-mono text-white">${formatOpsFixed(g.places)}</strong></span>
        <span class="text-slate-300">Вага партії брутто - <strong class="font-mono text-amber-300">${formatOpsFixed(g.weight)} кг</strong></span>
        <span class="text-slate-300">Об'єм - <strong class="font-mono text-emerald-300">${formatOpsFixed(g.volume)} м³</strong></span>
        <span class="text-slate-300">Унікальні клієнти - <strong class="font-mono text-sky-300">${g.clients.size}</strong></span>
      </div>
    `).join('');
  }

  function renderCargoOpsMode() {
    closeOpsRowActionMenu();
    const allCargoes = getStorekeeperCargoes();
    const existingKeys = new Set(allCargoes.map(getOpsCargoKey));
    Array.from(opsSelectedIds).forEach(id => {
      if (!existingKeys.has(id)) opsSelectedIds.delete(id);
    });
    const query = (document.getElementById('ops-search-input')?.value || '').trim().toLowerCase();

    const setBadge = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setBadge('ops-badge-unmarked', allCargoes.filter(isCargoUnmarked).length);
    setBadge('ops-badge-on_warehouse', allCargoes.filter(isCargoOnWarehouse).length);
    setBadge('ops-badge-all', allCargoes.length);

    let filtered = allCargoes.filter(c => {
      if (opsFilter === 'unmarked') return isCargoUnmarked(c);
      if (opsFilter === 'on_warehouse') return isCargoOnWarehouse(c);
      return true;
    });

    if (opsModalFilters.cargoType !== 'all') {
      filtered = filtered.filter(c => {
        const isCargo = c.isCargo === true || c.cargo_type === 'Карго';
        const isNonCargo = c.isCargo === false || c.cargo_type === 'Не Карго';
        return opsModalFilters.cargoType === 'cargo' ? isCargo : isNonCargo;
      });
    }

    if (opsModalFilters.logist !== 'all') {
      filtered = filtered.filter(c => (c.logist || c.responsible_logist || '') === opsModalFilters.logist);
    }

    if (opsModalFilters.specials.size > 0) {
      filtered = filtered.filter(c => {
        if (opsModalFilters.specials.has('has_tasks') && !(Array.isArray(c.tasks) && c.tasks.some(t => t.status !== 'done'))) return false;
        if (opsModalFilters.specials.has('no_photos') && getCargoPhotoList(c).length !== 0) return false;
        if (opsModalFilters.specials.has('oversized') && !Boolean(c.isOversized || c.is_oversized)) return false;
        if (opsModalFilters.specials.has('close_docs') && !Boolean(c.closeDocsExporter || c.close_docs_exporter)) return false;
        return true;
      });
    }

    if (opsModalFilters.modes.size > 0) {
      filtered = filtered.filter(c => {
        const m = (c.mode || c.transport_mode || c.transport || '').toLowerCase();
        return Array.from(opsModalFilters.modes).some(sel => m.includes(sel.toLowerCase()));
      });
    }

    const opsBadge = document.getElementById('ops-active-filters-badge');
    if (opsBadge) {
      const cnt = (opsModalFilters.cargoType !== 'all' ? 1 : 0) +
        (opsModalFilters.logist !== 'all' ? 1 : 0) +
        opsModalFilters.modes.size +
        opsModalFilters.specials.size;
      opsBadge.textContent = String(cnt);
      opsBadge.classList.toggle('hidden', cnt === 0);
    }

    if (query) {
      filtered = filtered.filter(c =>
        (c.dfShipment || c.cargoNumber || c.cargoCode || c.id || '').toLowerCase().includes(query) ||
        (c.trackNumber || c.trackingNumber || '').toLowerCase().includes(query) ||
        (c.client || '').toLowerCase().includes(query) ||
        (c.titleUa || c.name_ua || c.nameEn || c.name_en || '').toLowerCase().includes(query) ||
        (c.warehouseLocation || '').toLowerCase().includes(query)
      );
    }

    const listCountEl = document.getElementById('ops-list-count');
    if (listCountEl) listCountEl.textContent = `${filtered.length} позицій`;

    const tbody = document.getElementById('ops-cargo-tbody');
    if (!tbody) return;

    renderOpsSelectionBar(allCargoes, filtered);

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="34" class="py-12 text-center text-slate-400">Вантажів за цим фільтром не знайдено</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(c => {
      const cid = getOpsCargoKey(c);
      const isSelected = opsSelectedIds.has(cid);
      const rowBgCls = isSelected ? 'bg-emerald-50/60 hover:bg-emerald-50' : 'hover:bg-slate-50/80';
      const stickyCellBgCls = isSelected ? 'bg-emerald-50/95' : 'bg-white';
      const code = c.cargoNumber || c.cargoCode || c.dfShipment || c.id || '—';
      const track = c.trackNumber || c.trackingNumber || '—';
      const dfShipment = c.dfShipment || c.related_transportation || '—';
      const dfPromise = c.dfPromise || c.df_promise || '—';
      const client = c.client || '—';
      const subvoyage = c.subvoyageId || c.subvoyage || '—';
      const warehouse = c.warehouse || '—';
      const location = c.warehouseLocation || '—';
      const mode = c.mode || c.transport_mode || '—';
      const origin = c.origin || '—';
      const destination = c.destination || '—';
      const arrivalDate = c.arrivalDate || c.arrival_date || '—';
      const receiveDate = c.receiveDate || c.receive_date || '—';
      const titleUa = c.titleUa || c.name_ua || c.cargoName || '—';
      const titleEn = c.titleEn || c.nameEn || c.name_en || '—';
      const titleCn = c.titleCn || c.nameCn || c.name_zh || '—';
      const contentDesc = c.contentDescription || '—';
      const places = c.places ?? c.places_count ?? 0;
      const weight = c.weight ?? c.grossWeight ?? c.gross_weight ?? 0;
      const volume = c.volume ?? 0;
      const dims = (c.length || c.width || c.height) ? `${c.length || 0}×${c.width || 0}×${c.height || 0} см` : '—';
      const pkgType = c.packageType || c.packaging_type || '—';
      const oversized = c.isOversized || c.is_oversized ? `Так${c.oversizeComment ? ` (${c.oversizeComment})` : ''}` : 'Ні';
      const cargoTypeLabel = (c.isCargo === true || c.cargo_type === 'Карго') ? 'Карго' : (c.isCargo === false || c.cargo_type === 'Не Карго' ? 'Не Карго' : '—');
      const closeDocs = (c.closeDocsExporter || c.close_docs_exporter) ? 'Так' : 'Ні';
      const extraRaw = c.extraServices || c.additionalServices || c.additional_services;
      const extraServices = Array.isArray(extraRaw) ? (extraRaw.join(', ') || '—') : (extraRaw || '—');
      const manager = c.manager || c.responsible_manager || '—';
      const logist = c.logist || c.responsible_logist || '—';
      const logistNote = c.logistNote || c.logist_note || '—';
      const photosCount = getCargoPhotoList(c).length;
      const tasks = Array.isArray(c.tasks) ? c.tasks : [];

      const statusLabel = getCargoCanonicalStatus(c);
      const statusBadge = isCargoUnmarked(c)
        ? `<span class="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">${statusLabel}</span>`
        : (statusLabel === 'Готовий до завантаження' || statusLabel === 'На складі призначення')
          ? `<span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">${statusLabel}</span>`
          : (statusLabel === 'В дорозі' || statusLabel === 'Виданий' || statusLabel === 'Повернено клієнту')
            ? `<span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">${statusLabel}</span>`
            : `<span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">${statusLabel}</span>`;

      const tasksHtml = tasks.length === 0
        ? '<span class="text-slate-400">—</span>'
        : `<div class="flex flex-col gap-1">${tasks.map(t => {
            const done = t.status === 'done';
            return `<span class="text-[10px] px-1.5 py-0.5 rounded border ${done ? 'bg-emerald-50 text-emerald-700 border-emerald-200 line-through' : 'bg-amber-50 text-amber-800 border-amber-200 font-semibold'}">${t.title || t.text || 'Задача'}</span>`;
          }).join('')}</div>`;

      return `
        <tr class="${rowBgCls} transition">
          <td class="py-2.5 px-2.5 w-11 min-w-[44px] max-w-[44px] text-center sticky left-0 ${stickyCellBgCls} z-20 border-r border-slate-100">
            <input type="checkbox" class="ops-row-checkbox rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" data-cid="${escapeOpsHtml(cid)}" ${isSelected ? 'checked' : ''}>
          </td>
          <td class="py-2.5 px-3 font-mono font-bold ${dfPromise !== '—' ? 'text-purple-700' : 'text-slate-400'} sticky left-[44px] ${stickyCellBgCls} z-10 border-r border-slate-100">${dfPromise}</td>
          <td class="py-2.5 px-3 font-mono text-slate-700">${track}</td>
          <td class="py-2.5 px-3 font-mono text-slate-700">${dfShipment}</td>
          <td class="py-2.5 px-3 font-mono font-semibold text-slate-900">${code}</td>
          <td class="py-2.5 px-3 font-semibold text-slate-800">${client}</td>
          <td class="py-2.5 px-3 font-mono text-brand-700">${subvoyage}</td>
          <td class="py-2.5 px-3 text-slate-800">${warehouse}</td>
          <td class="py-2.5 px-3 text-slate-700">${location}</td>
          <td class="py-2.5 px-3 text-slate-700">${mode}</td>
          <td class="py-2.5 px-3 text-slate-700">${origin}</td>
          <td class="py-2.5 px-3 text-slate-700">${destination}</td>
          <td class="py-2.5 px-3 font-mono text-slate-600">${arrivalDate}</td>
          <td class="py-2.5 px-3 font-mono text-slate-600">${receiveDate}</td>
          <td class="py-2.5 px-3 font-medium text-slate-800 max-w-[200px] truncate" title="${titleUa}">${titleUa}</td>
          <td class="py-2.5 px-3 text-slate-600 max-w-[180px] truncate" title="${titleEn}">${titleEn}</td>
          <td class="py-2.5 px-3 text-slate-600 max-w-[180px] truncate" title="${titleCn}">${titleCn}</td>
          <td class="py-2.5 px-3 text-slate-600 max-w-[220px] truncate" title="${contentDesc}">${contentDesc}</td>
          <td class="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">${places}</td>
          <td class="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">${weight}</td>
          <td class="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">${volume}</td>
          <td class="py-2.5 px-3 font-mono text-slate-600">${dims}</td>
          <td class="py-2.5 px-3 text-slate-700">${pkgType}</td>
          <td class="py-2.5 px-3 text-slate-700">${oversized}</td>
          <td class="py-2.5 px-3 text-slate-700">${cargoTypeLabel}</td>
          <td class="py-2.5 px-3 text-slate-700">${closeDocs}</td>
          <td class="py-2.5 px-3 text-slate-600 max-w-[180px] truncate" title="${extraServices}">${extraServices}</td>
          <td class="py-2.5 px-3 text-slate-700">${manager}</td>
          <td class="py-2.5 px-3 text-slate-700">${logist}</td>
          <td class="py-2.5 px-3 text-slate-600 max-w-[200px] truncate" title="${logistNote}">${logistNote}</td>
          <td class="py-2.5 px-3">${statusBadge}</td>
          <td class="py-2.5 px-3">${tasksHtml}</td>
          <td class="py-2.5 px-3 font-mono text-brand-700 font-semibold">${photosCount} фото</td>
          <td class="py-2.5 px-3 text-right sticky right-0 ${stickyCellBgCls} z-10 border-l border-slate-100">
            <button type="button" onclick="window.toggleOpsRowActionMenu('${escapeOpsHtml(cid)}', event)"
              class="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-lg transition inline-flex items-center justify-center cursor-pointer"
              title="Дії з вантажем">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function bindEvents() {
    // Режим 2 події
    document.querySelectorAll('.rec-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        recFilter = btn.getAttribute('data-rec-filter');
        document.querySelectorAll('.rec-filter-btn').forEach(b => {
          const active = b === btn;
          b.className = `rec-filter-btn px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${active ? 'bg-white text-brand-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900 font-medium'}`;
        });
        renderReceivingMode();
      });
    });

    document.getElementById('rec-search-input')?.addEventListener('input', renderReceivingMode);
    document.querySelectorAll('.rec-transport-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        recTransportFilter = btn.getAttribute('data-rec-transport');
        document.querySelectorAll('.rec-transport-btn').forEach(b => {
          const active = b === btn;
          b.className = `rec-transport-btn px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${active ? 'bg-white text-brand-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900 font-medium'}`;
        });
        renderReceivingMode();
      });
    });
    document.getElementById('rec-reset-btn')?.addEventListener('click', () => {
      recFilter = 'inbound';
      recTransportFilter = 'all';
      recModalFilters.damage.clear();
      recModalFilters.transports.clear();
      recModalFilters.logists.clear();
      recModalFilters.dests.clear();
      const searchEl = document.getElementById('rec-search-input');
      if (searchEl) searchEl.value = '';
      document.querySelectorAll('.rec-filter-btn').forEach(b => {
        const active = b.getAttribute('data-rec-filter') === 'inbound';
        b.className = `rec-filter-btn px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${active ? 'bg-white text-brand-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900 font-medium'}`;
      });
      document.querySelectorAll('.rec-transport-btn').forEach(b => {
        const active = b.getAttribute('data-rec-transport') === 'all';
        b.className = `rec-transport-btn px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${active ? 'bg-white text-brand-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900 font-medium'}`;
      });
      renderReceivingMode();
    });

    // Модальне вікно фільтрів Приймання (Перевезення)
    const recModal = document.getElementById('rec-filter-modal');
    document.getElementById('rec-btn-filter-modal')?.addEventListener('click', () => {
      const transports = getTransports();
      const logists = [...new Set(transports.map(t => t.logist || t.responsible_logist).filter(Boolean))].sort();
      const dests = [...new Set(transports.map(t => t.destination || t.destinationCountry).filter(Boolean))].sort();
      const logistEl = document.getElementById('rec-list-filter-logist');
      if (logistEl) {
        logistEl.innerHTML = logists.map(l => `<label class="flex items-center justify-between p-1 hover:bg-slate-50 rounded cursor-pointer"><span>${l}</span><input type="checkbox" value="${l}" ${recModalFilters.logists.has(l) ? 'checked' : ''} class="rounded text-brand-600"></label>`).join('') || '<span class="text-slate-400">Немає даних</span>';
      }
      const destEl = document.getElementById('rec-list-filter-dest');
      if (destEl) {
        destEl.innerHTML = dests.map(d => `<label class="flex items-center justify-between p-1 hover:bg-slate-50 rounded cursor-pointer"><span>${d}</span><input type="checkbox" value="${d}" ${recModalFilters.dests.has(d) ? 'checked' : ''} class="rounded text-brand-600"></label>`).join('') || '<span class="text-slate-400">Немає даних</span>';
      }
      document.querySelectorAll('#rec-list-filter-damage input[type="checkbox"]').forEach(cb => {
        cb.checked = recModalFilters.damage.has(cb.value);
      });
      document.querySelectorAll('#rec-list-filter-transport input[type="checkbox"]').forEach(cb => {
        cb.checked = recModalFilters.transports.has(cb.value);
      });
      recModal?.classList.remove('hidden');
    });
    document.getElementById('rec-btn-close-filter-modal')?.addEventListener('click', () => recModal?.classList.add('hidden'));
    recModal?.addEventListener('click', (e) => { if (e.target === recModal) recModal.classList.add('hidden'); });
    document.getElementById('rec-btn-apply-filter-modal')?.addEventListener('click', () => {
      recModalFilters.damage = new Set(Array.from(document.querySelectorAll('#rec-list-filter-damage input:checked')).map(c => c.value));
      recModalFilters.transports = new Set(Array.from(document.querySelectorAll('#rec-list-filter-transport input:checked')).map(c => c.value));
      recModalFilters.logists = new Set(Array.from(document.querySelectorAll('#rec-list-filter-logist input:checked')).map(c => c.value));
      recModalFilters.dests = new Set(Array.from(document.querySelectorAll('#rec-list-filter-dest input:checked')).map(c => c.value));
      recModal?.classList.add('hidden');
      renderReceivingMode();
    });
    document.getElementById('rec-btn-reset-filter-modal')?.addEventListener('click', () => {
      recModalFilters.damage.clear();
      recModalFilters.transports.clear();
      recModalFilters.logists.clear();
      recModalFilters.dests.clear();
      recModal?.classList.add('hidden');
      renderReceivingMode();
    });

    // Режим 3 (Таба: Транзит) події
    document.querySelectorAll('.tr-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        trFilter = btn.getAttribute('data-tr-filter');
        document.querySelectorAll('.tr-filter-btn').forEach(b => {
          const active = b === btn;
          b.className = `tr-filter-btn px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${active ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900 font-medium'}`;
        });
        renderTransitMode();
      });
    });

    document.getElementById('tr-search-input')?.addEventListener('input', renderTransitMode);

    // Фільтри панелі «Вихідні Підрейси» у Транзиті (Статус, Хаб, Сортування)
    const trSvStatusBtn = document.getElementById('tr-sv-status-multiselect-btn');
    const trSvStatusMenu = document.getElementById('tr-sv-status-multiselect-menu');

    if (trSvStatusBtn && trSvStatusMenu) {
      trSvStatusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        trSvStatusMenu.classList.toggle('hidden');
      });
      trSvStatusMenu.addEventListener('click', (e) => e.stopPropagation());
    }
    document.addEventListener('click', () => {
      trSvStatusMenu?.classList.add('hidden');
    });

    document.getElementById('tr-sv-status-select-all')?.addEventListener('click', () => {
      document.querySelectorAll('.tr-sv-status-cb').forEach(cb => {
        cb.checked = true;
        trOutboundStatuses?.add(cb.value);
      });
      renderTransitMode();
    });
    document.getElementById('tr-sv-status-clear-all')?.addEventListener('click', () => {
      document.querySelectorAll('.tr-sv-status-cb').forEach(cb => { cb.checked = false; });
      trOutboundStatuses?.clear();
      renderTransitMode();
    });
    document.getElementById('tr-sv-destination-hub-filter')?.addEventListener('change', (e) => {
      trOutboundDestHub = e.target.value || 'all';
      renderTransitMode();
    });
    document.getElementById('tr-sv-sort-select')?.addEventListener('change', (e) => {
      trOutboundSortMode = e.target.value || 'plannedDeparture_asc';
      renderTransitMode();
    });
    document.getElementById('tr-reset-btn')?.addEventListener('click', () => {
      trFilter = 'in_transit';
      trModalFilters.prevSvs.clear();
      trModalFilters.dests.clear();
      trModalFilters.conditions.clear();
      const searchEl = document.getElementById('tr-search-input');
      if (searchEl) searchEl.value = '';
      document.querySelectorAll('.tr-filter-btn').forEach(b => {
        const active = b.getAttribute('data-tr-filter') === 'in_transit';
        b.className = `tr-filter-btn px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${active ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900 font-medium'}`;
      });
      renderTransitMode();
    });

    // Модальне вікно фільтрів Транзиту
    const trModal = document.getElementById('tr-filter-modal');
    document.getElementById('tr-btn-filter-modal')?.addEventListener('click', () => {
      const inboundIds = getSubvoyages().filter(isInboundTransitSubvoyage).map(s => s.id).sort();
      const transports = getTransports();
      const dests = [...new Set(transports.map(tr => tr.destination || tr.destinationCountry).filter(Boolean))].sort();
      const prevEl = document.getElementById('tr-list-filter-prev-sv');
      if (prevEl) {
        prevEl.innerHTML = inboundIds.map(id => `<label class="flex items-center justify-between p-1 hover:bg-slate-50 rounded cursor-pointer font-mono"><span>${id}</span><input type="checkbox" value="${id}" ${trModalFilters.prevSvs.has(id) ? 'checked' : ''} class="rounded text-indigo-600"></label>`).join('') || '<span class="text-slate-400">Немає вхідних рейсів</span>';
      }
      const destEl = document.getElementById('tr-list-filter-dest');
      if (destEl) {
        destEl.innerHTML = dests.map(d => `<label class="flex items-center justify-between p-1 hover:bg-slate-50 rounded cursor-pointer"><span>${d}</span><input type="checkbox" value="${d}" ${trModalFilters.dests.has(d) ? 'checked' : ''} class="rounded text-indigo-600"></label>`).join('') || '<span class="text-slate-400">Немає даних</span>';
      }
      document.querySelectorAll('#tr-list-filter-condition input[type="checkbox"]').forEach(cb => {
        cb.checked = trModalFilters.conditions.has(cb.value);
      });
      trModal?.classList.remove('hidden');
    });
    document.getElementById('tr-btn-close-filter-modal')?.addEventListener('click', () => trModal?.classList.add('hidden'));
    trModal?.addEventListener('click', (e) => { if (e.target === trModal) trModal.classList.add('hidden'); });
    document.getElementById('tr-btn-apply-filter-modal')?.addEventListener('click', () => {
      trModalFilters.prevSvs = new Set(Array.from(document.querySelectorAll('#tr-list-filter-prev-sv input:checked')).map(c => c.value));
      trModalFilters.dests = new Set(Array.from(document.querySelectorAll('#tr-list-filter-dest input:checked')).map(c => c.value));
      trModalFilters.conditions = new Set(Array.from(document.querySelectorAll('#tr-list-filter-condition input:checked')).map(c => c.value));
      trModal?.classList.add('hidden');
      renderTransitMode();
    });
    document.getElementById('tr-btn-reset-filter-modal')?.addEventListener('click', () => {
      trModalFilters.prevSvs.clear();
      trModalFilters.dests.clear();
      trModalFilters.conditions.clear();
      trModal?.classList.add('hidden');
      renderTransitMode();
    });

    document.getElementById('tr-btn-reassign-outbound')?.addEventListener('click', () => {
      const targetSvId = trActiveOutboundSvId;
      if (!targetSvId || trSelectedIds.size === 0) return;

      const transports = getTransports();
      const touchedSourceIds = new Set();
      let moved = 0;
      transports.forEach(tr => {
        if (trSelectedIds.has(tr.id)) {
          const srcId = applyTransitTransferToShipment(tr, targetSvId);
          if (srcId) touchedSourceIds.add(srcId);
          moved++;
        }
      });

      touchedSourceIds.forEach(syncTransitSourceSubvoyageStatus);
      trSelectedIds.clear();
      if (typeof window.refreshSubvoyagesWorkspace === 'function') window.refreshSubvoyagesWorkspace();
      renderTransitMode();
      toast(`Перевантажено ${moved} перевезень у вихідний підрейс ${targetSvId}`);
    });

    // Режим 3 події
    document.getElementById('ops-btn-add-arrive')?.addEventListener('click', () => {
      if (typeof window.openCreateArriveModal === 'function') window.openCreateArriveModal();
      else document.getElementById('modal-arrive')?.classList.remove('hidden');
    });

    document.getElementById('ops-search-input')?.addEventListener('input', renderCargoOpsMode);

    document.getElementById('ops-reset-btn')?.addEventListener('click', () => {
      opsFilter = 'unmarked';
      opsModalFilters.cargoType = 'all';
      opsModalFilters.logist = 'all';
      opsModalFilters.modes.clear();
      opsModalFilters.specials.clear();
      const searchEl = document.getElementById('ops-search-input');
      if (searchEl) searchEl.value = '';
      document.querySelectorAll('.ops-filter-btn').forEach(b => {
        const active = b.getAttribute('data-ops-filter') === 'unmarked';
        b.className = `ops-filter-btn px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${active ? 'bg-white text-brand-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900 font-medium'}`;
      });
      renderCargoOpsMode();
    });

    // Модальна форма фільтрації Вантажів (Комірник)
    const opsModal = document.getElementById('ops-filter-modal');
    const opsForm = document.getElementById('ops-filter-form');
    document.getElementById('ops-btn-filter-modal')?.addEventListener('click', () => {
      const cargoes = getStorekeeperCargoes();
      const logists = [...new Set(cargoes.map(c => c.logist || c.responsible_logist).filter(Boolean))].sort();
      const logistSel = document.getElementById('ops-form-logist');
      if (logistSel) {
        logistSel.innerHTML = `<option value="all">Усі логісти</option>` + logists.map(l => `<option value="${l}">${l}</option>`).join('');
        logistSel.value = opsModalFilters.logist;
      }
      const cargoTypeSel = document.getElementById('ops-form-cargotype');
      if (cargoTypeSel) cargoTypeSel.value = opsModalFilters.cargoType;
      document.querySelectorAll('#ops-form-modes input[type="checkbox"]').forEach(cb => {
        cb.checked = opsModalFilters.modes.has(cb.value);
      });
      document.querySelectorAll('#ops-form-specials input[type="checkbox"]').forEach(cb => {
        cb.checked = opsModalFilters.specials.has(cb.value);
      });
      opsModal?.classList.remove('hidden');
    });
    document.getElementById('ops-btn-close-filter-modal')?.addEventListener('click', () => opsModal?.classList.add('hidden'));
    opsModal?.addEventListener('click', (e) => { if (e.target === opsModal) opsModal.classList.add('hidden'); });
    opsForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      opsModalFilters.cargoType = document.getElementById('ops-form-cargotype')?.value || 'all';
      opsModalFilters.logist = document.getElementById('ops-form-logist')?.value || 'all';
      opsModalFilters.modes = new Set(Array.from(document.querySelectorAll('#ops-form-modes input:checked')).map(c => c.value));
      opsModalFilters.specials = new Set(Array.from(document.querySelectorAll('#ops-form-specials input:checked')).map(c => c.value));
      opsModal?.classList.add('hidden');
      renderCargoOpsMode();
    });
    document.getElementById('ops-btn-reset-filter-modal')?.addEventListener('click', () => {
      opsModalFilters.cargoType = 'all';
      opsModalFilters.logist = 'all';
      opsModalFilters.modes.clear();
      opsModalFilters.specials.clear();
      opsModal?.classList.add('hidden');
      renderCargoOpsMode();
    });

    document.querySelectorAll('.ops-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        opsFilter = btn.getAttribute('data-ops-filter');
        document.querySelectorAll('.ops-filter-btn').forEach(b => {
          const active = b === btn;
          b.className = `ops-filter-btn px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${active ? 'bg-white text-brand-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900 font-medium'}`;
        });
        renderCargoOpsMode();
      });
    });

    // Мультивибір вантажів (Комірник)
    document.getElementById('ops-select-all')?.addEventListener('change', (e) => {
      const checked = Boolean(e.target.checked);
      document.querySelectorAll('#ops-cargo-tbody .ops-row-checkbox').forEach(cb => {
        const cid = cb.getAttribute('data-cid');
        if (!cid) return;
        if (checked) opsSelectedIds.add(cid);
        else opsSelectedIds.delete(cid);
      });
      renderCargoOpsMode();
    });

    document.getElementById('ops-cargo-tbody')?.addEventListener('change', (e) => {
      const cb = e.target.closest('.ops-row-checkbox');
      if (!cb) return;
      const cid = cb.getAttribute('data-cid');
      if (!cid) return;
      if (cb.checked) opsSelectedIds.add(cid);
      else opsSelectedIds.delete(cid);
      renderCargoOpsMode();
    });

    document.getElementById('ops-btn-clear-selection')?.addEventListener('click', () => {
      opsSelectedIds.clear();
      renderCargoOpsMode();
    });

    document.getElementById('ops-btn-toggle-client-groups')?.addEventListener('click', () => {
      opsClientGroupsCollapsed = !opsClientGroupsCollapsed;
      renderCargoOpsMode();
    });

    document.getElementById('ops-btn-bulk-transfer')?.addEventListener('click', () => {
      if (opsSelectedIds.size === 0) return;
      opsOpenTransferModal(Array.from(opsSelectedIds));
    });

    document.getElementById('ops-btn-bulk-delete')?.addEventListener('click', () => {
      if (opsSelectedIds.size === 0) return;
      opsOpenDeleteModal(Array.from(opsSelectedIds));
    });

    // Плаваюче меню дій рядка вантажу
    const opsRowMenu = document.getElementById('ops-row-action-menu');
    opsRowMenu?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-ops-action]');
      if (!btn) return;
      e.stopPropagation();
      const action = btn.getAttribute('data-ops-action');
      const cid = btn.getAttribute('data-cid');
      closeOpsRowActionMenu();
      if (!cid) return;

      if (action === 'edit') {
        if (typeof window.openEditCargoModal === 'function') window.openEditCargoModal(cid, null, e);
      } else if (action === 'history') {
        if (typeof window.openCargoMovementHistoryModal === 'function') window.openCargoMovementHistoryModal(cid, null, e);
      } else if (action === 'copy') {
        opsCopyCargoData(cid);
      } else if (action === 'transfer') {
        opsOpenTransferModal([cid]);
      } else if (action === 'delete') {
        opsOpenDeleteModal([cid]);
      }
    });

    document.addEventListener('click', () => {
      closeOpsRowActionMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeOpsRowActionMenu();
    });
    document.querySelector('#workspace-mode-cargo-ops .overflow-auto')?.addEventListener('scroll', () => {
      closeOpsRowActionMenu();
    }, { passive: true });

    // Модальне вікно переміщення на інший склад
    const opsTransferModal = document.getElementById('ops-transfer-modal');
    const closeOpsTransferModal = () => {
      opsTransferModal?.classList.add('hidden');
      opsTransferTargetIds = [];
    };
    document.getElementById('ops-btn-close-transfer-modal')?.addEventListener('click', closeOpsTransferModal);
    document.getElementById('ops-btn-cancel-transfer')?.addEventListener('click', closeOpsTransferModal);
    opsTransferModal?.addEventListener('click', (e) => { if (e.target === opsTransferModal) closeOpsTransferModal(); });
    document.getElementById('ops-btn-confirm-transfer')?.addEventListener('click', opsConfirmTransfer);

    // Модальне вікно підтвердження видалення
    const opsDeleteModal = document.getElementById('ops-delete-modal');
    const closeOpsDeleteModal = () => {
      opsDeleteModal?.classList.add('hidden');
      opsDeleteTargetIds = [];
    };
    document.getElementById('ops-btn-close-delete-modal')?.addEventListener('click', closeOpsDeleteModal);
    document.getElementById('ops-btn-cancel-delete')?.addEventListener('click', closeOpsDeleteModal);
    opsDeleteModal?.addEventListener('click', (e) => { if (e.target === opsDeleteModal) closeOpsDeleteModal(); });
    document.getElementById('ops-btn-confirm-delete')?.addEventListener('click', opsConfirmDelete);
  }

  window.initWorkspaceModes = function () {
    loadOpsWarehousesCatalog();
    bindEvents();
    renderModeSwitcher();
  };

  window.refreshWorkspaceModes = function () {
    renderModeSwitcher();
    if (currentMode === 'receiving') renderReceivingMode();
    if (currentMode === 'transit') renderTransitMode();
    if (currentMode === 'cargo_ops') renderCargoOpsMode();
  };
})();
