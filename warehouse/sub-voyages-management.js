function initSubvoyagesPlannerModule() {
  // Опорна поточна дата для розрахунку дедлайнів (≤ 3 дні до відправки = Critical)
  const REFERENCE_TODAY = '2026-10-18';

  const headerUnassignedCount = document.getElementById('header-unassigned-count');

  // Фільтри перевезень
  const searchInput = document.getElementById('search-input-sv') || document.getElementById('search-input');
  const btnQuickResetFilters = document.getElementById('btn-quick-reset-filters-sv') || document.getElementById('btn-quick-reset-filters');
  const btnQuickFilterReady = document.getElementById('btn-quick-filter-ready');
  const btnQuickFilterAttached = document.getElementById('btn-quick-filter-attached');
  const btnQuickFilterLastmile = document.getElementById('btn-quick-filter-lastmile');
  const btnQuickFilterOthers = document.getElementById('btn-quick-filter-others');

  // SLA Urgency (Перевезення)
  const btnUrgencyAll = document.getElementById('btn-urgency-all');
  const btnUrgencyCritical = document.getElementById('btn-urgency-critical');
  const btnUrgencyHigh = document.getElementById('btn-urgency-high');
  const btnUrgencyNormal = document.getElementById('btn-urgency-normal');

  // SLA Urgency (Підрейси)
  const btnSvUrgencyAll = document.getElementById('btn-sv-urgency-all');
  const btnSvUrgencyCritical = document.getElementById('btn-sv-urgency-critical');
  const btnSvUrgencyHigh = document.getElementById('btn-sv-urgency-high');
  const btnSvUrgencyNormal = document.getElementById('btn-sv-urgency-normal');

  // Hubs Popover
  const btnToggleHubFilter = document.getElementById('btn-toggle-hub-filter');
  const hubFilterPopover = document.getElementById('hub-filter-popover');
  const hubFilterLabel = document.getElementById('hub-filter-label');
  const hubCheckboxesList = document.getElementById('hub-checkboxes-list');
  const btnResetHubFilter = document.getElementById('btn-reset-hub-filter');

  // Фільтрація Дошки Підрейсів за Складом доставки
  const subvoyageDestinationHubFilter = document.getElementById('subvoyage-destination-hub-filter');

  // Modal
  const filterModal = document.getElementById('filter-modal');
  const btnToggleFilterPanel = document.getElementById('btn-toggle-filter-panel');
  const btnCloseFilterModal = document.getElementById('btn-close-filter-modal');
  const btnApplyFilterModal = document.getElementById('btn-apply-filter-modal');
  const btnResetFilters = document.getElementById('btn-reset-filters');

  // Таблиця перевезень
  const shipmentsTableHeader = document.getElementById('shipments-table-header');
  const tbodyUnassignedShipments = document.getElementById('tbody-unassigned-shipments');
  const tableMasterTitle = document.getElementById('table-master-title');
  const tableMasterHint = document.getElementById('table-master-hint');
  const shipmentsListCount = document.getElementById('shipments-list-count');
  const unassignedStatsSummary = document.getElementById('unassigned-stats-summary');
  const bulkSelectedCounter = document.getElementById('bulk-selected-counter');
  const btnBulkAssignToActive = document.getElementById('btn-bulk-assign-to-active');
  const btnBulkAssignLabel = document.getElementById('btn-bulk-assign-label');
  const shipmentsItemsPerPageSelect = document.getElementById('sv-shipments-items-per-page');
  const shipmentsPaginationInfo = document.getElementById('sv-shipments-pagination-info');
  const shipmentsPaginationControls = document.getElementById('sv-shipments-pagination-controls');

  // Дошка підрейсів
  const activeSubvoyageHeaderTitle = document.getElementById('active-subvoyage-header-title');
  const subvoyagesTimelineCards = document.getElementById('subvoyages-timeline-cards');
  const currentSubvoyageStatusSelect = document.getElementById('current-subvoyage-status-select');
  const currentSubvoyageCommentInput = document.getElementById('current-subvoyage-comment-input');
  const btnSaveSubvoyageComment = document.getElementById('btn-save-subvoyage-comment');
  const currentSubvoyageSpecialAttributesSummary = document.getElementById('current-subvoyage-special-attributes-summary');
  const currentSubvoyageCapacityPillsContainer = document.getElementById('current-subvoyage-capacity-pills-container');
  const tbodySubvoyageAssignedShipments = document.getElementById('tbody-subvoyage-assigned-shipments');
  const subvoyageTotalCargoCount = document.getElementById('subvoyage-total-cargo-count');
  const subvoyageTotalVol = document.getElementById('subvoyage-total-vol');
  const subvoyageMaxVol = document.getElementById('subvoyage-max-vol');
  const subvoyageTotalWeight = document.getElementById('subvoyage-total-weight');
  const subvoyageMaxWeight = document.getElementById('subvoyage-max-weight');
  const subvoyageTotalPlaces = document.getElementById('subvoyage-total-places');
  const subvoyageMaxPlaces = document.getElementById('subvoyage-max-places');

  // Drawer (Повна інформація про Перевезення та Вантаж)
  const contextDrawerBackdrop = document.getElementById('context-drawer-backdrop');
  const contextDrawer = document.getElementById('context-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const drawerShipmentId = document.getElementById('drawer-shipment-id');
  const drawerStatusBadge = document.getElementById('drawer-status-badge');
  const drawerUrgencyBadge = document.getElementById('drawer-urgency-badge');
  const drawerShipmentPromise = document.getElementById('drawer-shipment-promise');
  const drawerClientLink = document.getElementById('drawer-client-link');
  const drawerClientName = document.getElementById('drawer-client-name');
  const drawerLogistName = document.getElementById('drawer-logist-name');
  const drawerDeliveryMethod = document.getElementById('drawer-delivery-method');
  const drawerSenderContacts = document.getElementById('drawer-sender-contacts');
  const drawerRoute = document.getElementById('drawer-route');
  const drawerHubBadge = document.getElementById('drawer-hub-badge');
  const drawerOriginAddress = document.getElementById('drawer-origin-address');
  const drawerDestinationAddress = document.getElementById('drawer-destination-address');
  const drawerDateReady = document.getElementById('drawer-date-ready');
  const drawerDateShipped = document.getElementById('drawer-date-shipped');
  const drawerDateArrival = document.getElementById('drawer-date-arrival');
  const drawerCustomsClearance = document.getElementById('drawer-customs-clearance');
  const drawerCustomsTerms = document.getElementById('drawer-customs-terms');
  const drawerTransportType = document.getElementById('drawer-transport-type');
  const drawerPlannedMetrics = document.getElementById('drawer-planned-metrics');
  const drawerAdditionalDeliveryParams = document.getElementById('drawer-additional-delivery-params');
  const drawerWarehouseAddress = document.getElementById('drawer-warehouse-address');
  const drawerWaybillNumber = document.getElementById('drawer-waybill-number');
  const drawerCourierDetails = document.getElementById('drawer-courier-details');
  const drawerPropertyBadges = document.getElementById('drawer-property-badges');

  const drawerLastmileBlock = document.getElementById('drawer-lastmile-block');
  const drawerLastmileType = document.getElementById('drawer-lastmile-type');
  const drawerLastmileRecipient = document.getElementById('drawer-lastmile-recipient');
  const drawerLastmilePhone = document.getElementById('drawer-lastmile-phone');
  const drawerLastmileAddress = document.getElementById('drawer-lastmile-address');

  const drawerCargoCount = document.getElementById('drawer-cargo-count');
  const drawerCargoesList = document.getElementById('drawer-cargoes-list');
  const drawerBtnDetach = document.getElementById('drawer-btn-detach');
  const drawerBtnAssign = document.getElementById('drawer-btn-assign');

  // Стан додатку
  let subVoyagesData = [];
  let transportsData = [];

  // null = режим огляду «Усі підрейси та всі перевезення» (без фокусу на одному підрейсі)
  let activeSubvoyageId = null;
  // Режим лівої таблиці при вибраному підрейсі: 'pool' (доступні/сумісні) або 'assigned' (перевезення, додані у цей підрейс)
  let leftTableSubvoyageMode = 'pool';
  // Кейс 2.5: Перемикач «Скинути рекомендації» (дозволяє додати виняток у вибраний підрейс, не скидаючи сам підрейс)
  let isRecommendationFilterIgnored = false;
  let selectedUnassignedIds = new Set();
  let selectedDestinationHub = 'all';
  let selectedSubvoyageUrgency = 'all';
  let selectedSubvoyageStatuses = new Set();
  let selectedSubvoyageLogists = new Set();
  let isAssignedShipmentsCollapsed = true;

  // Сортування списку перевезень: 'dateReady' (Дата готовності) або 'volume' (Габарити/об'єм)
  let sortField = 'dateReady';
  let sortDirection = 'asc';

  // Пагінація таблиці перевезень
  let shipmentsCurrentPage = 1;
  let shipmentsItemsPerPage = Number(shipmentsItemsPerPageSelect?.value) || 20;

  let filters = {
    search: '',
    quickFilter: 'ready', // По дефолту Готові до завантаження ('ready' | 'not_ready' | 'planned' | 'unmarked' | 'all')
    deliveryMode: 'all',  // Блок 4.1: 'all' | 'Морський' | 'Авіа' | 'Авто'
    routeDirection: 'all', // Блок 4.1: 'all' або 'Китай ➔ Україна' тощо
    cargoType: 'all',      // Блок 4.1: 'all' | 'Карго' | 'Фрахт'
    urgency: 'all',
    hubs: new Set(),
    logists: new Set(),
    transports: new Set()
  };

  // Блок 4.3: Множина розгорнутих акордеонів підрейсів у правій панелі
  let expandedSubvoyageIds = new Set();

  function showToast(message, isWarning = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `border text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-3 transition-all duration-300 pointer-events-auto transform translate-x-10 opacity-0 ${isWarning ? 'bg-amber-900 border-amber-700' : 'bg-slate-900 border-slate-700'
      }`;
    const icon = isWarning ? 'fa-triangle-exclamation text-amber-400' : 'fa-circle-check text-brand-400';
    toast.innerHTML = `<i class="fa-solid ${icon} text-base"></i><span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('translate-x-10', 'opacity-0'));
    setTimeout(() => {
      toast.classList.add('translate-x-10', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function getDaysUntilDeparture(dateStr) {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) return null;
    const ref = new Date(REFERENCE_TODAY + 'T00:00:00');
    const target = new Date(dateStr.trim() + 'T00:00:00');
    return Math.round((target - ref) / (1000 * 60 * 60 * 24));
  }

  function computeUrgencyByDeparture(departureDateStr, status) {
    if (status === 'Прибув на склад отримання') {
      return {
        level: 'normal',
        days: null,
        shortLabel: '✅ Normal',
        detailLabel: 'Доставлено на склад'
      };
    }

    const days = getDaysUntilDeparture(departureDateStr);
    if (days === null) {
      return {
        level: 'normal',
        days: null,
        shortLabel: '✅ Normal',
        detailLabel: 'План'
      };
    }

    if (days <= 3) {
      const daysText = days < 0 ? `${Math.abs(days)} дн. тому` : days === 0 ? 'Сьогодні' : `${days} дн.`;
      return {
        level: 'critical',
        days,
        shortLabel: `🔥 Critical (${daysText})`,
        detailLabel: `До відправки: ${daysText}`
      };
    } else if (days <= 7) {
      return {
        level: 'high',
        days,
        shortLabel: `⚠️ High (${days} дн.)`,
        detailLabel: `До відправки: ${days} дн.`
      };
    } else {
      return {
        level: 'normal',
        days,
        shortLabel: `✅ Normal (${days} дн.)`,
        detailLabel: `До відправки: ${days} дн.`
      };
    }
  }

  function getSubvoyageUrgencyInfo(sv) {
    if (!sv) return { level: 'normal', shortLabel: '✅ Normal', detailLabel: '' };
    return computeUrgencyByDeparture(sv.plannedDeparture, sv.status);
  }

  function getShipmentUrgencyInfo(tr) {
    if (!tr) return { level: 'normal', shortLabel: '✅ Normal', detailLabel: '' };
    if (tr.status === 'Прибув на склад отримання') {
      return {
        level: 'normal',
        days: null,
        shortLabel: '✅ Normal',
        detailLabel: 'Прибув на склад'
      };
    }

    // Якщо перевезення додано до підрейсу — терміновість рахується від дати відправки цього підрейсу
    if (tr.subvoyageId) {
      const depInfo = getShipmentDepartureInfo(tr);
      return computeUrgencyByDeparture(depInfo.date, tr.status);
    }

    // Поки перевезення НЕ додано до підрейсу, дати відправки у нього немає — використовуємо пріоритет готовності вантажу
    const explicitLevel = tr.urgency || 'normal';
    const labelMap = {
      critical: '🔥 Critical',
      high: '⚠️ High',
      normal: '✅ Normal'
    };
    return {
      level: explicitLevel,
      days: null,
      shortLabel: labelMap[explicitLevel] || '✅ Normal',
      detailLabel: tr.dateReady ? `Готовність вантажу: ${tr.dateReady} (очікує рейсу)` : 'Очікує призначення в підрейс'
    };
  }

  // Кейс 2.3: Статуси терміновості (Critical, High, Normal) повністю прибрано
  function renderUrgencyBadge() {
    return '';
  }

  // Відображення маршруту в таблиці перевезень:
  // Тільки перша і остання точка (Країна відправки ➔ Країна призначення), без проміжних точок та без міток плеча підрейсу
  function renderShipmentFinalRouteInfo(tr) {
    if (!tr) return '';
    const origin = tr.originCountry || 'Китай';
    const destination = tr.destinationCountry || tr.finalDestination || 'Україна';

    return `
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="font-bold text-slate-800 text-[11px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1" title="Маршрут перевезення: ${origin} ➔ ${destination}">
          <i class="fa-solid fa-location-dot text-rose-500 text-[10px]"></i>
          <span>${origin} ➔ ${destination}</span>
        </span>
        ${renderTransportBadge(tr.transport, 'bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-2xs')}
      </div>
    `;
  }

  function renderStatusBadge(status) {
    const styles = {
      'Формування': 'bg-amber-50 text-amber-800 border-amber-300',
      'Завантажений': 'bg-emerald-50 text-emerald-800 border-emerald-300',
      'Формується': 'bg-amber-50 text-amber-800 border-amber-300',
      'Готовий до завантаження': 'bg-sky-50 text-sky-800 border-sky-300',
      'В дорозі': 'bg-indigo-50 text-indigo-800 border-indigo-300',
      'Прибув на склад отримання': 'bg-purple-50 text-purple-800 border-purple-300',
      'Очікує готовності': 'bg-slate-100 text-slate-700 border-slate-300',
      'Новий': 'bg-slate-100 text-slate-700 border-slate-300'
    };
    const cls = styles[status] || 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return `<span class="px-2 py-0.5 rounded-full text-[9px] font-bold border ${cls}">${status}</span>`;
  }

  // Іконка та стиль для Способу перевезення (Морський, Авіа, Авто, Залізниця)
  function getTransportIcon(mode) {
    const icons = {
      'Морський': { icon: 'fa-solid fa-ship', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
      'Авіа': { icon: 'fa-solid fa-plane', color: 'text-sky-500', bg: 'bg-sky-50 border-sky-200' },
      'Авто': { icon: 'fa-solid fa-truck', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
      'Залізниця': { icon: 'fa-solid fa-train', color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' }
    };
    return icons[mode] || { icon: 'fa-solid fa-truck-moving', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' };
  }

  function renderTransportBadge(mode, extraClass = '') {
    const cfg = getTransportIcon(mode);
    return `<span class="inline-flex items-center gap-1 font-semibold text-slate-700 ${extraClass}"><i class="${cfg.icon} ${cfg.color}"></i><span>${mode || '—'}</span></span>`;
  }

  // Бейджі Митного оформлення та Митних умов для перевезення
  function renderCustomsBadges(tr) {
    const clearance = tr.customsClearance || 'Брокер компанії';
    const terms = tr.customsTerms || 'EXW';
    return `
      <div class="flex items-center gap-1 flex-wrap mb-1">
        <span class="bg-indigo-50 text-indigo-900 border border-indigo-200 px-1.5 py-0.2 rounded text-[9px] font-bold inline-flex items-center gap-1" title="Митні умови (Incoterms)">
          <i class="fa-solid fa-scale-balanced text-indigo-600"></i> ${terms}
        </span>
        <span class="bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.2 rounded text-[9px] font-semibold truncate max-w-[130px]" title="Митне оформлення: ${clearance}">
          ${clearance}
        </span>
      </div>
    `;
  }

  function getShipmentDepartureInfo(tr) {
    // Дата відправки існує ТІЛЬКИ якщо перевезення додано до підрейсу (вимога п.1)
    if (tr.subvoyageId) {
      const sv = subVoyagesData.find(s => s.id === tr.subvoyageId);
      if (sv && sv.plannedDeparture) {
        return {
          date: sv.plannedDeparture,
          label: sv.plannedDeparture,
          source: `Підрейс ${sv.id}`,
          isPlannedFromSubvoyage: true
        };
      }
    }

    return {
      date: tr.dateReady || '9999-12-31',
      label: 'Не призначено (очікує підрейсу)',
      source: 'Не додано до підрейсу',
      isPlannedFromSubvoyage: false
    };
  }

  function getSubvoyageStatusPriority(status) {
    // 1. Ті, що формуються / в роботі логіста
    if (status === 'Формування' || status === 'Формується') return 1;
    // 2. Завантажені (готуються до виходу)
    if (status === 'Завантажений') return 2;
    // 3. В дорозі
    if (status === 'В дорозі') return 3;
    // 4. Прибув на склад / завершені
    return 4;
  }

  function getSortedSubvoyages() {
    return [...subVoyagesData].sort((a, b) => {
      const pA = getSubvoyageStatusPriority(a.status);
      const pB = getSubvoyageStatusPriority(b.status);
      if (pA !== pB) return pA - pB;

      const dA = a.plannedDeparture || '9999-12-31';
      const dB = b.plannedDeparture || '9999-12-31';
      return dA.localeCompare(dB);
    });
  }

  function syncSubvoyageAndShipmentsStatuses() {
    subVoyagesData.forEach(sv => {
      if (sv.status === 'Відкритий') sv.status = 'В дорозі';
      if (sv.status === 'Заплановано' || sv.status === 'Формується') sv.status = 'Формування';
    });

    transportsData.forEach(tr => {
      // Непромарковані позиції — це завжди Вантажі (не перевезення)
      if (tr.readinessCategory === 'unmarked' && !tr.entityType) tr.entityType = 'cargo';
      if (tr.subvoyageId) {
        const sv = subVoyagesData.find(s => s.id === tr.subvoyageId);
        if (sv) {
          if (tr.readinessCategory === 'ready' || !tr.readinessCategory) {
            tr.status = sv.status;
          }
          if (sv.plannedDeparture) {
            tr.dateShipped = sv.plannedDeparture;
          }
        }
      } else {
        // Поки перевезення не в підрейсі — дати відправки немає
        tr.dateShipped = null;
        if (tr.readinessCategory === 'planned') tr.status = 'Плановий (обіцянка)';
        else if (tr.readinessCategory === 'unmarked') tr.status = 'Непромаркований';
        else if (tr.readinessCategory === 'not_ready') tr.status = 'Не готовий до завантаження';
        else tr.status = 'Готовий до завантаження';
      }
      tr.urgency = getShipmentUrgencyInfo(tr).level;
    });

    // Синхронізуємо глобальний масив для 5-категорійного блоку «Розподіл об'єму» дашборду та списку підрейсів
    window.svManagementShipments = transportsData.map(t => ({
      ...t,
      totalVolume: t.volume,
      totalWeight: t.weight,
      totalPlaces: t.places
    }));
    window.svManagementSubvoyages = subVoyagesData;
    if (window.DashboardModule && typeof window.DashboardModule.updateStats === 'function') {
      window.DashboardModule.updateStats(window.cargoesData || [], subVoyagesData);
    }
  }

  function getSubvoyageSpecialAttributes(svId) {
    const sv = subVoyagesData.find(s => s.id === svId);
    const assigned = transportsData.filter(t => t.subvoyageId === svId);

    let adrCount = 0;
    let battCount = 0;
    let exporterDocsCount = 0;
    let visaCount = 0;
    let missingVisaCount = 0;

    assigned.forEach(tr => {
      const hasAdr = Boolean(tr.isHazardous || tr.cargoes?.some(c => c.hazardousDetails?.isHazardous));
      const hasBatt = Boolean(tr.hasBatteries || tr.cargoes?.some(c => c.hasBatteries));
      if (hasAdr) adrCount++;
      if (hasBatt) battCount++;
      if (tr.closeExporterDocs) exporterDocsCount++;
      if (tr.hasVisa) visaCount++;
      else missingVisaCount++;
    });

    const adrConflict = sv && !sv.adrPermitted && adrCount > 0;

    return {
      total: assigned.length,
      adrCount,
      battCount,
      exporterDocsCount,
      visaCount,
      missingVisaCount,
      adrConflict,
      adrPermitted: sv ? sv.adrPermitted : false
    };
  }

  function renderSubvoyageSpecialAttributesBadges(svId) {
    const sv = subVoyagesData.find(s => s.id === svId);
    const assigned = transportsData.filter(t => t.subvoyageId === svId);

    if (assigned.length === 0) {
      return `<span class="text-[9px] text-slate-400 italic">Маркери відсутні</span>`;
    }

    // Збираємо агреговані маркери із усіх доданих до підрейсу перевезень (динамічний перетин/об'єднання)
    const markerMap = new Map();

    assigned.forEach(tr => {
      const markers = getAllShipmentMarkers(tr);
      markers.forEach(m => {
        // Спосіб перевезення підрейсу вже показаний окремим бейджем у картці, не дублюємо його тут
        if (m.key === 'transport_mode') return;
        const key = m.key || m.id;
        if (!markerMap.has(key)) {
          markerMap.set(key, { marker: m, count: 1 });
        } else {
          markerMap.get(key).count += 1;
        }
      });
    });

    if (markerMap.size === 0) {
      return `<span class="text-[9px] text-slate-400 italic">Без спеціальних маркерів</span>`;
    }

    // Перевірка конфлікту ADR: підрейс не дозволяє ADR, але хоча б в одному перевезенні є ADR
    const hasAdr = markerMap.has('adr');
    const adrConflict = Boolean(hasAdr && sv && sv.adrPermitted === false);

    const badgesHtml = Array.from(markerMap.values()).map(({ marker: m, count }) => {
      const isFaIcon = typeof m.icon === 'string' && m.icon.startsWith('fa-');
      const text = m.shortLabel || m.label.replace(m.icon, '').trim();
      const countBadge = count > 1 ? `<span class="text-[8px] font-mono opacity-85">(${count})</span>` : '';

      const isThisAdrConflict = m.key === 'adr' && adrConflict;
      const cls = isThisAdrConflict
        ? 'bg-rose-600 text-white border-rose-700 animate-pulse font-bold'
        : `${m.cls} border font-bold`;

      const titleAttr = isThisAdrConflict
        ? `УВАГА: Підрейс НЕ підтримує ADR, але містить ${count} вантаж(ів) з ADR!`
        : `${m.fullLabel} (у ${count} перевезенн${count === 1 ? 'і' : 'ях'})`;

      return `
        <span class="${cls} px-1.5 py-0.5 rounded text-[9px] inline-flex items-center gap-1 shadow-2xs whitespace-nowrap select-none hover:brightness-95 transition"
              title="${titleAttr}">
          ${isFaIcon ? `<i class="${m.icon} text-[8px]"></i>` : `<span class="text-[10px]">${m.icon}</span>`}
          <span class="tracking-tight">${text}</span>
          ${countBadge}
          ${isThisAdrConflict ? '<i class="fa-solid fa-triangle-exclamation text-[8px]"></i>' : ''}
        </span>
      `;
    }).join('');

    return `<div class="flex items-center gap-1 flex-wrap">${badgesHtml}</div>`;
  }

  function enrichShipmentsAndSubvoyagesData() {
    const markerPresetsByShipment = {
      'DF-9901-FULL': [
        'adr', 'batt_li', 'temp_deep_freeze', 'pharma', 'oversized',
        'fragile', 'high_value', 'perishable', 'military',
        'export_open', 'close_exporter_docs', 'customs_official',
        'transit_t1', 'carnet_tir', 'pre_declaration', 'special_control',
        'lcl', 'groupage', 'intl_bilateral', 'cross_trade',
        'visa_req', 'eco_reg', 'truck_curtain', 'pkg_pallets', 'pkg_straps'
      ],
      'DF540-101': ['customs_cargo', 'pkg_pallets', 'lcl', 'groupage', 'pkg_straps'],
      'DF540-102': ['adr', 'batt_li', 'customs_cargo', 'pkg_rigid'],
      'DF540-103': ['temp_fresh', 'pharma', 'air_freight', 'export_closed', 'pre_declaration'],
      'DF540-104': ['customs_official', 'export_open', 'pkg_pallets', 'transit_t1', 'eco_reg'],
      'DF540-105': ['oversized', 'high_value', 'pkg_straps', 'multimodal', 'project_cargo'],
      'DF540-106': ['temp_plus', 'perishable', 'pkg_rigid', 'special_control'],
      'DF540-107': ['military', 'high_value', 'export_closed', 'bonded_warehouse', 'diplomatic'],
      'DF540-108': ['batt_lead', 'adr', 'pkg_rigid', 'waste'],
      'DF540-110': ['ftl', 'truck_curtain', 'intl_bilateral', 'carnet_tir', 'customs_official'],
      'DF540-111': ['ltl', 'truck_reefer', 'temp_fresh', 'pkg_pallets'],
      'DF540-112': ['oversized', 'truck_flatbed', 'pkg_straps'],
      'PRM-9022-BOOKED': ['batt_li', 'close_exporter_docs', 'visa_req', 'pkg_pallets', 'customs_cargo'],
      'DF-8410-NR': ['export_open', 'pkg_rigid', 'customs_official', 'temp_fresh'],
      'DF-8412-NR': ['batt_li', 'pkg_pallets', 'customs_cargo'],
      'PRM-9015-PLAN': ['customs_cargo', 'pkg_pallets', 'lcl', 'groupage'],
      'PRM-9018-PLAN': ['export_open', 'pkg_rigid', 'customs_official'],
      'DF-UNM-701': ['pkg_rigid', 'groupage', 'general'],
      'DF-UNM-702': ['oversized', 'pkg_straps', 'multimodal']
    };

    // 1. Збагачуємо існуючі позиції атрибутами Карго/Фрахт, маркерами та readinessCategory
    transportsData.forEach((tr, idx) => {
      if (!Array.isArray(tr.markers) || tr.markers.length === 0) {
        tr.markers = markerPresetsByShipment[tr.id] ? [...markerPresetsByShipment[tr.id]] : [];
      }
      if (!tr.cargoType) {
        tr.cargoType = idx % 2 === 0 ? 'Карго' : 'Фрахт';
      }
      if (!tr.packagingType) {
        const firstCargoPkg = tr.cargoes?.[0]?.packageType || '';
        if (firstCargoPkg.toLowerCase().includes('палет')) tr.packagingType = 'Палети';
        else if (firstCargoPkg.toLowerCase().includes('ящик') || firstCargoPkg.toLowerCase().includes('негабарит')) tr.packagingType = 'Негабарит';
        else tr.packagingType = idx % 3 === 0 ? 'Палети' : (idx % 3 === 1 ? 'Коробки' : 'Негабарит');
      }
      if (typeof tr.isFragile === 'undefined') {
        tr.isFragile = idx % 4 === 0;
      }
      if (typeof tr.isOversized === 'undefined') {
        tr.isOversized = tr.packagingType === 'Негабарит' || idx % 5 === 0;
      }
      if (!tr.readinessCategory) {
        if (tr.status === 'Готовий до завантаження' || tr.subvoyageId) {
          tr.readinessCategory = 'ready';
        } else if (tr.status === 'Формування' || tr.status === 'Очікує готовності') {
          tr.readinessCategory = 'not_ready';
        } else {
          tr.readinessCategory = 'ready';
        }
      }
    });

    // 2. Додаємо демонстраційні позиції для кожної з 4 категорій готовності (Блок 4.1, 4.2, 4.3), включаючи позицію з УСІМА активними маркерами одночасно
    const demoExtraItems = [
      {
        id: 'DF-9901-FULL',
        dfShipment: 'DF-9901-FULL',
        dfPromise: 'PRM-2026-9901',
        client: 'ТОВ МегаЕнерго Імпорт (Тестове: Найзаповненіше перевезення)',
        logist: 'О. Коваль',
        originCountry: 'Китай',
        destinationCountry: 'Україна',
        routeStages: ['Китай', 'Польща', 'Україна'],
        transitSegment: 'Китай ➔ Польща ➔ Україна',
        hub: 'Центральний Хаб Київ (Гостомель)',
        transport: 'Морський',
        cargoType: 'Карго',
        packagingType: 'Палети',
        readinessCategory: 'ready',
        status: 'Готовий до завантаження',
        dateReady: '2026-10-16',
        volume: 14.5,
        weight: 3.4,
        places: 22,
        subvoyageId: null,
        isHazardous: true,
        hasBatteries: true,
        isFragile: true,
        isOversized: true,
        closeExporterDocs: true,
        hasVisa: true,
        customsTerms: 'DDP',
        customsClearance: 'Брокер компанії',
        markers: [
          'adr', 'batt_li', 'temp_deep_freeze', 'pharma', 'oversized',
          'fragile', 'high_value', 'perishable', 'military',
          'export_open', 'close_exporter_docs', 'customs_official',
          'transit_t1', 'carnet_tir', 'pre_declaration', 'special_control',
          'lcl', 'groupage', 'intl_bilateral', 'cross_trade',
          'visa_req', 'eco_reg', 'truck_curtain', 'pkg_pallets', 'pkg_straps'
        ],
        cargoes: [
          {
            cargoId: 'ARR-9901-1',
            titleUa: 'Промислові гібридні інвертори з LiFePO4 модулями (Тестове найзаповненіше перевезення)',
            nameEn: 'Industrial Hybrid Inverters & LiFePO4 Packs (Full Markers Test)',
            places: 22,
            grossWeight: 3.4,
            volume: 14.5,
            packageType: 'Палети + Негабарит',
            status: 'На складі'
          }
        ]
      },
      {
        id: 'DF-8410-NR',
        dfShipment: 'DF-8410-NR',
        dfPromise: 'PRM-2026-8410',
        client: 'ФОП Мельник С.В.',
        logist: 'І. Сидоренко',
        originCountry: 'Китай',
        destinationCountry: 'Польща',
        routeStages: ['Китай', 'Польща'],
        transitSegment: 'Китай ➔ Польща',
        hub: 'Транзитний хаб Варшава (Прушкув)',
        transport: 'Морський',
        cargoType: 'Фрахт',
        packagingType: 'Коробки',
        readinessCategory: 'not_ready',
        notReadyReason: 'Чекає на консолідацію (2 з 3 партій на складі) та оригінал інвойсу',
        status: 'Не готовий до завантаження',
        dateReady: '2026-10-21',
        volume: 9.2,
        weight: 1.8,
        places: 38,
        subvoyageId: 'SV-4402',
        isHazardous: false,
        hasBatteries: false,
        isFragile: true,
        isOversized: false,
        closeExporterDocs: true,
        hasVisa: false,
        customsTerms: 'EXW',
        customsClearance: 'Брокер компанії',
        cargoes: [
          {
            cargoId: 'ARR-8410-1',
            titleUa: 'Керамічні ізолятори та фурнітура (очікує доукомплектування)',
            places: 38,
            grossWeight: 1.8,
            volume: 9.2,
            packageType: 'Коробки',
            status: 'Очікує консолідації'
          }
        ]
      },
      {
        id: 'DF-8412-NR',
        dfShipment: 'DF-8412-NR',
        dfPromise: 'PRM-2026-8412',
        client: 'ТОВ АвтоСпецПостач',
        logist: 'О. Коваль',
        originCountry: 'Китай',
        destinationCountry: 'Україна',
        routeStages: ['Китай', 'Польща', 'Україна'],
        transitSegment: 'Китай ➔ Польща ➔ Україна',
        hub: 'Центральний Хаб Київ (Гостомель)',
        transport: 'Авто',
        cargoType: 'Карго',
        packagingType: 'Палети',
        readinessCategory: 'not_ready',
        notReadyReason: 'Не оплачений інвойс за пакування, перевірка митної декларації',
        status: 'Не готовий до завантаження',
        dateReady: '2026-10-23',
        volume: 6.8,
        weight: 1.4,
        places: 12,
        subvoyageId: null,
        isHazardous: false,
        hasBatteries: true,
        isFragile: false,
        isOversized: false,
        closeExporterDocs: false,
        hasVisa: false,
        customsTerms: 'FCA',
        customsClearance: 'Брокер компанії',
        cargoes: []
      },
      {
        id: 'PRM-9015-PLAN',
        dfShipment: 'PRM-9015-PLAN',
        dfPromise: 'PRM-9015-PLAN',
        client: 'ТОВ ГрінТех Україна (Обіцянка клієнта)',
        logist: 'О. Коваль',
        originCountry: 'Китай',
        destinationCountry: 'Україна',
        routeStages: ['Китай', 'Польща', 'Україна'],
        transitSegment: 'Китай ➔ Польща ➔ Україна',
        hub: 'Центральний Хаб Київ (Гостомель)',
        transport: 'Морський',
        cargoType: 'Карго',
        packagingType: 'Палети',
        readinessCategory: 'planned',
        status: 'Плановий (обіцянка)',
        dateReady: '2026-10-25',
        volume: 16.0,
        weight: 3.1,
        places: 24,
        subvoyageId: null,
        isHazardous: false,
        hasBatteries: true,
        isFragile: false,
        isOversized: false,
        closeExporterDocs: true,
        hasVisa: true,
        customsTerms: 'FOB',
        customsClearance: 'Брокер компанії',
        cargoes: []
      },
      {
        id: 'PRM-9018-PLAN',
        dfShipment: 'PRM-9018-PLAN',
        dfPromise: 'PRM-9018-PLAN',
        client: 'ФОП Бойко А.М. (Обіцянка під бронь)',
        logist: 'І. Сидоренко',
        originCountry: 'Китай',
        destinationCountry: 'Польща',
        routeStages: ['Китай', 'Польща'],
        transitSegment: 'Китай ➔ Польща',
        hub: 'Транзитний хаб Варшава (Прушкув)',
        transport: 'Авіа',
        cargoType: 'Фрахт',
        packagingType: 'Коробки',
        readinessCategory: 'planned',
        status: 'Плановий (обіцянка)',
        dateReady: '2026-10-26',
        volume: 4.5,
        weight: 0.9,
        places: 18,
        subvoyageId: null,
        isHazardous: false,
        hasBatteries: false,
        isFragile: true,
        isOversized: false,
        closeExporterDocs: false,
        hasVisa: true,
        customsTerms: 'EXW',
        customsClearance: 'Клієнт самостійно',
        cargoes: []
      },
      // Непромарковані — це НЕ перевезення, а фізичні ВАНТАЖІ (entityType: 'cargo'), прийняті на склад без маркування DF.
      // Вантаж можна додати до підрейсу; після прорахунку менеджером він конвертується в Обіцянку (entityType: 'promise').
      ...[
        {
          id: 'ARR-UNM-701', trackNumber: 'SF-99201', receiveDate: '2026-10-19', warehouseLocation: 'Зона B · Ряд 4 · Стелаж 2',
          contentDescription: 'Картонні коробки без маркування клієнта (побутова електроніка)', packagingType: 'Коробки',
          places: 15, weight: 0.85, volume: 5.4, length: 60, width: 40, height: 50,
          originCountry: 'Китай', destinationCountry: 'Україна', transport: 'Морський', hub: 'Центральний Хаб Київ (Гостомель)', logist: 'М. Бондар',
          markers: ['pkg_rigid', 'groupage', 'general', 'customs_cargo'], isHazardous: false, isOversized: false
        },
        {
          id: 'ARR-UNM-704', trackNumber: 'GATE3-0412', receiveDate: '2026-10-20', warehouseLocation: 'Ворота #3 · Майданчик негабариту',
          contentDescription: 'Металева конструкція в обрешітці, без документів', packagingType: 'Негабарит',
          places: 4, weight: 2.1, volume: 7.2, length: 240, width: 120, height: 150,
          originCountry: 'Китай', destinationCountry: 'Польща', transport: 'Авто', hub: 'Транзитний хаб Варшава (Прушкув)', logist: 'О. Коваль',
          markers: ['oversized', 'adr', 'pkg_straps', 'multimodal'], isHazardous: true, isOversized: true
        },
        {
          id: 'ARR-UNM-709', trackNumber: 'YT-5508812', receiveDate: '2026-10-22', warehouseLocation: 'Зона A · Ряд 1 · Палетне місце 7',
          contentDescription: 'Палета з акумуляторними блоками, маркування пошкоджене', packagingType: 'Палети',
          places: 2, weight: 0.64, volume: 1.9, length: 120, width: 80, height: 100,
          originCountry: 'Китай', destinationCountry: 'Україна', transport: 'Морський', hub: 'Центральний Хаб Київ (Гостомель)', logist: 'І. Сидоренко',
          markers: ['batt_li', 'fragile', 'pkg_pallets'], hasBatteries: true, isFragile: true
        }
      ].map(c => ({
        isHazardous: false, hasBatteries: false, isFragile: false, isOversized: false,
        ...c,
        entityType: 'cargo',
        cargoNumber: c.id,
        dfShipment: c.id,
        dfPromise: null,
        client: 'Не ідентифіковано',
        routeStages: [c.originCountry, c.destinationCountry],
        transitSegment: `${c.originCountry} ➔ ${c.destinationCountry}`,
        cargoType: null,
        readinessCategory: 'unmarked',
        status: 'Непромаркований',
        dateReady: c.receiveDate,
        subvoyageId: null,
        closeExporterDocs: false,
        hasVisa: false,
        customsTerms: '—',
        customsClearance: 'Очікує ідентифікації клієнта',
        cargoes: []
      }))
    ];

    demoExtraItems.forEach(item => {
      if (!transportsData.some(t => t.id === item.id)) {
        transportsData.unshift(item);
      }
    });

    // 3. Для наочної демонстрації поділу на Фактичні куби та Планові куби в першому підрейсі зі статусом "Формування",
    // додаємо 1 планову обіцянку всередину першого підрейсу на формуванні (щоб одразу було видно і вкладений акордеон, і поділ кубів, і блокування статусу!)
    const firstFormationSv = subVoyagesData.find(s => s.status === 'Формування' || s.status === 'Формується');
    if (firstFormationSv) {
      const demoBookedPromiseId = 'PRM-9022-BOOKED';
      if (!transportsData.some(t => t.id === demoBookedPromiseId)) {
        transportsData.push({
          id: demoBookedPromiseId,
          dfShipment: demoBookedPromiseId,
          dfPromise: 'PRM-9022-BOOKED',
          client: 'ТОВ ЕлектроСвіт (Заброньована обіцянка)',
          logist: firstFormationSv.logist || 'О. Коваль',
          originCountry: firstFormationSv.originCountry || 'Китай',
          destinationCountry: firstFormationSv.destinationCountry || 'Польща',
          routeStages: [firstFormationSv.originCountry || 'Китай', firstFormationSv.destinationCountry || 'Польща'],
          transitSegment: `${firstFormationSv.originCountry || 'Китай'} ➔ ${firstFormationSv.destinationCountry || 'Польща'}`,
          hub: firstFormationSv.hub || 'Транзитний хаб',
          transport: firstFormationSv.transport || 'Морський',
          cargoType: 'Карго',
          packagingType: 'Палети',
          readinessCategory: 'planned',
          status: 'Плановий (обіцянка)',
          dateReady: '2026-10-24',
          volume: 8.5,
          weight: 1.6,
          places: 10,
          subvoyageId: firstFormationSv.id,
          isHazardous: false,
          hasBatteries: true,
          isFragile: false,
          isOversized: false,
          closeExporterDocs: true,
          hasVisa: true,
          customsTerms: 'FOB',
          customsClearance: 'Брокер компанії',
          cargoes: []
        });
      }
    }

    // Публікуємо глобально для синхронізації з 5 категоріями блоку «Розподіл об'єму» в dashboard.js
    window.svManagementShipments = transportsData.map(t => ({
      ...t,
      totalVolume: t.volume,
      totalWeight: t.weight,
      totalPlaces: t.places
    }));
    window.svManagementSubvoyages = subVoyagesData;
  }

  async function loadData() {
    try {
      const response = await fetch('../data/sub-voyages-data.json').catch(() => fetch('data/sub-voyages-data.json'));
      if (!response || !response.ok) throw new Error('Помилка завантаження sub-voyages-data.json');
      const data = await response.json();
      subVoyagesData = data.subVoyages || [];
      transportsData = data.shipments || [];

      enrichShipmentsAndSubvoyagesData();
      syncSubvoyageAndShipmentsStatuses();

      const sortedSv = getSortedSubvoyages();
      const urlParams = new URLSearchParams(window.location.search);
      const paramSvId = urlParams.get('subvoyageId');
      if (paramSvId && sortedSv.some(s => s.id === paramSvId)) {
        activeSubvoyageId = paramSvId;
      } else {
        const firstSv = sortedSv.find(s => s.status === 'Формування' || s.status === 'Формується') || sortedSv[0];
        if (firstSv) {
          activeSubvoyageId = firstSv.id;
        }
      }

      setupHubFilterOptions();
      setupSubvoyageDestinationHubOptions();
      setupSubvoyageBoardFilters();
      setupSubvoyageStatusSelect();
      setupSubvoyageCommentActions();
      setupAssignedShipmentsToggle();
      setupSubvoyageFocusAndModalsActions();
      setupAdvancedFilterOptions();
      updateActiveSubvoyageState();
      renderAll();
    } catch (err) {
      console.error(err);
      showToast('Не вдалося завантажити дані перевезень', true);
    }
  }

  // Блок 4.3: Жорстке правило валідації при зміні статусу підрейсу на «Завантажений» або «В дорозі»
  function getBlockingItemsForSubvoyage(svId) {
    return transportsData.filter(t => t.subvoyageId === svId && t.readinessCategory && t.readinessCategory !== 'ready');
  }

  window.closeSubvoyageDepartureBlockModal = function () {
    const modal = document.getElementById('modal-subvoyage-departure-block');
    if (modal) modal.classList.add('hidden');
  };

  window.convertShipmentToReady = function (shipmentId, event) {
    if (event) event.stopPropagation();
    const tr = transportsData.find(t => t.id === shipmentId);
    if (!tr) return;
    tr.readinessCategory = 'ready';
    if (tr.id.startsWith('UNM-')) {
      tr.dfShipment = `DF-${tr.id.replace('UNM-', '')}`;
    } else if (tr.id.startsWith('PRM-')) {
      tr.dfShipment = `DF-${tr.id.replace('PRM-', '')}`;
    }
    tr.status = tr.subvoyageId
      ? (subVoyagesData.find(s => s.id === tr.subvoyageId)?.status || 'Готовий до завантаження')
      : 'Готовий до завантаження';
    syncSubvoyageAndShipmentsStatuses();
    renderAll();
    showToast(`Позицію ${tr.dfShipment || tr.id} промарковано та переведено у статус «Готовий до завантаження» (Фактичні куби)!`);
  };

  function openSubvoyageDepartureBlockModal(sv, targetStatus, blockingItems) {
    const modal = document.getElementById('modal-subvoyage-departure-block');
    if (!modal) return;
    const svIdSpan = document.getElementById('sv-block-modal-sv-id');
    if (svIdSpan) svIdSpan.textContent = `${sv.name} (${sv.id}) ➔ «${targetStatus}»`;

    const listEl = document.getElementById('sv-block-modal-items-list');
    if (listEl) {
      const catLabels = {
        planned: { text: 'Плановий (обіцянка — ще не на складі)', cls: 'bg-purple-100 text-purple-900 border-purple-300' },
        not_ready: { text: 'Не готовий до завантаження (консолідація/документи)', cls: 'bg-amber-100 text-amber-900 border-amber-300' },
        unmarked: { text: 'Непромаркований вантаж (без ідентифікації)', cls: 'bg-rose-100 text-rose-900 border-rose-300' }
      };
      listEl.innerHTML = blockingItems.map(item => {
        const cfg = catLabels[item.readinessCategory] || { text: item.status, cls: 'bg-slate-100 text-slate-800 border-slate-300' };
        return `
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 flex-wrap">
            <div class="space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-mono font-bold text-slate-900 text-xs">${item.dfShipment || item.id}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${cfg.cls}">${cfg.text}</span>
              </div>
              <div class="text-[11px] text-slate-600">${item.client || ''} • <strong class="font-mono">${item.volume} м³ | ${item.weight} т | ${item.places} шт</strong></div>
            </div>
            <div class="flex items-center gap-1.5">
              ${(item.readinessCategory === 'planned' || item.readinessCategory === 'not_ready' || isUnmarkedCargo(item)) ? '' : `
                <button type="button" onclick="window.convertShipmentToReady('${item.id}', event); window.closeSubvoyageDepartureBlockModal();"
                  class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition cursor-pointer">
                  <i class="fa-solid fa-check mr-1"></i>Готовий
                </button>
              `}
              <button type="button" onclick="detachShipmentFromSubvoyage('${item.id}'); window.closeSubvoyageDepartureBlockModal();"
                class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold transition cursor-pointer">
                <i class="fa-solid fa-xmark mr-1"></i>Прибрати з рейсу
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    const btnConvertAll = document.getElementById('btn-sv-block-convert-all');
    if (btnConvertAll) {
      btnConvertAll.onclick = () => {
        blockingItems.forEach(item => {
          if (isUnmarkedCargo(item)) convertCargoToPromise(item, {});
          item.readinessCategory = 'ready';
          if (item.id.startsWith('UNM-')) item.dfShipment = `DF-${item.id.replace('UNM-', '')}`;
          else if (item.id.startsWith('PRM-')) item.dfShipment = `DF-${item.id.replace('PRM-', '')}`;
        });
        sv.status = targetStatus;
        selectedSubvoyageStatuses.add(targetStatus);
        syncSubvoyageAndShipmentsStatuses();
        window.closeSubvoyageDepartureBlockModal();
        renderAll();
        showToast(`Усі позиції підтверджено! Підрейс ${sv.id} переведено у статус «${targetStatus}».`);
      };
    }

    modal.classList.remove('hidden');
  }

  window.changeSubvoyageStatusWithValidation = function (svId, newStatus, selectElement = null) {
    const sv = subVoyagesData.find(s => s.id === svId);
    if (!sv) return;

    if (newStatus === 'Завантажений' || newStatus === 'В дорозі') {
      const blocking = getBlockingItemsForSubvoyage(sv.id);
      if (blocking.length > 0) {
        if (selectElement) selectElement.value = sv.status;
        if (currentSubvoyageStatusSelect && activeSubvoyageId === sv.id) {
          currentSubvoyageStatusSelect.value = sv.status;
        }
        openSubvoyageDepartureBlockModal(sv, newStatus, blocking);
        showToast(`Блокування відправки ${sv.id}: знайдено ${blocking.length} не готових / планових позицій!`, true);
        return;
      }
    }

    // Блок 3.2: Якщо користувач у випадаючому списку обирає «Прибув на склад отримання» для підрейсу, що їде («В дорозі»),
    // відкриваємо обов'язкове модальне вікно звіту приймання («Захист від дурня») — без звіту вантаж не переходить на баланс складу!
    if (newStatus === 'Прибув на склад отримання' && sv.status === 'В дорозі') {
      if (selectElement) selectElement.value = sv.status;
      if (currentSubvoyageStatusSelect && activeSubvoyageId === sv.id) {
        currentSubvoyageStatusSelect.value = sv.status;
      }
      if (window.DashboardModule && typeof window.DashboardModule.openAcceptVoyageModal === 'function') {
        window.DashboardModule.openAcceptVoyageModal(sv.id);
      }
      return;
    }

    sv.status = newStatus;
    selectedSubvoyageStatuses.add(newStatus);
    let updatedCount = 0;
    transportsData.forEach(tr => {
      if (tr.subvoyageId === sv.id) {
        tr.status = newStatus;
        updatedCount++;
      }
    });

    syncSubvoyageAndShipmentsStatuses();
    showToast(`Статус підрейсу ${sv.id} та ${updatedCount} перевезень змінено на «${newStatus}»`);
    renderAll();
  };

  // Блок 3.2: Приймання підрейсу зі статусом «В дорозі» на баланс складу після заповнення звіту приймання
  window.acceptSubvoyageToWarehouse = function (svId, reportData = {}) {
    const sv = subVoyagesData.find(s => s.id === svId);
    if (!sv) return;

    sv.status = 'Прибув на склад отримання';
    sv.actualArrival = new Date().toISOString().split('T')[0];
    sv.acceptanceReport = reportData;
    selectedSubvoyageStatuses.add('Прибув на склад отримання');

    const problemIds = new Set(reportData.selectedProblemShipments || []);
    let acceptedCount = 0;

    transportsData.forEach(tr => {
      if (tr.subvoyageId === sv.id) {
        const hasProblem = !reportData.isAllGood && (problemIds.has(tr.id) || problemIds.has(tr.dfShipment));
        tr.status = hasProblem ? 'Пошкоджено / Нестача' : 'Прибув на склад отримання';
        tr.readinessCategory = hasProblem ? 'not_ready' : 'ready';
        tr.acceptedToday = true;
        if (hasProblem && reportData.notes) {
          tr.notReadyReason = `Акт приймання (${(reportData.selectedProblemTypes || []).join(', ')}): ${reportData.notes}`;
        }
        acceptedCount++;
      }
    });

    syncSubvoyageAndShipmentsStatuses();
    renderAll();

    if (typeof showToast === 'function') {
      showToast(`Підрейс ${sv.id} прийнято на склад! Звіт приймання збережено (${acceptedCount} перевезень зараховано на баланс).`);
    }
  };

  function setupSubvoyageStatusSelect() {
    if (!currentSubvoyageStatusSelect) return;
    currentSubvoyageStatusSelect.addEventListener('change', (e) => {
      const newStatus = e.target.value;
      if (!activeSubvoyageId) return;
      window.changeSubvoyageStatusWithValidation(activeSubvoyageId, newStatus, currentSubvoyageStatusSelect);
    });
  }

  // Збереження поля Коментар для активного підрейсу
  function setupSubvoyageCommentActions() {
    if (!btnSaveSubvoyageComment || !currentSubvoyageCommentInput) return;

    const saveComment = () => {
      const sv = subVoyagesData.find(s => s.id === activeSubvoyageId);
      if (!sv) return;
      sv.comment = currentSubvoyageCommentInput.value.trim();
      renderSubvoyagesTimeline();
      showToast(`Коментар до підрейсу ${sv.id} збережено`);
    };

    btnSaveSubvoyageComment.addEventListener('click', saveComment);
    currentSubvoyageCommentInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveComment();
    });
  }

  // Можливість ховати / показувати перевезення в підрейсі (із розширенням блоку підрейсів)
  function setupAssignedShipmentsToggle() {
    const btnToggle = document.getElementById('btn-toggle-assigned-shipments');
    const tableWrapper = document.getElementById('subvoyage-assigned-shipments-table-wrapper');
    const toggleIcon = document.getElementById('icon-toggle-assigned-shipments');
    const toggleText = document.getElementById('text-toggle-assigned-shipments');
    const timelineBlock = document.getElementById('subvoyages-timeline-block');
    const timelineCards = document.getElementById('subvoyages-timeline-cards');

    if (!btnToggle || !tableWrapper) return;

    // Якщо немає id="subvoyages-timeline-block", беремо батьківський блок карток
    const resolvedTimelineBlock = timelineBlock || (timelineCards ? timelineCards.parentElement : null);

    function updateExpandedLayout() {
      if (isAssignedShipmentsCollapsed) {
        tableWrapper.classList.add('hidden');
        if (toggleIcon) toggleIcon.classList.add('-rotate-90');
        if (toggleText) toggleText.textContent = 'Показати перевезення';
        btnToggle.classList.add('bg-slate-100', 'text-brand-700');
        btnToggle.classList.remove('bg-white', 'text-slate-700');

        // Збільшуємо блок підрейсів на всю вивільнену висоту, щоб було видно значно більше підрейсів
        if (resolvedTimelineBlock) {
          resolvedTimelineBlock.classList.remove('shrink-0');
          resolvedTimelineBlock.classList.add('flex-1', 'min-h-0', 'flex', 'flex-col');
        }
        if (timelineCards) {
          timelineCards.classList.remove('max-h-60');
          timelineCards.classList.add('flex-1', 'min-h-0', 'max-h-[560px]');
        }
      } else {
        tableWrapper.classList.remove('hidden');
        if (toggleIcon) toggleIcon.classList.remove('-rotate-90');
        if (toggleText) toggleText.textContent = 'Сховати перевезення';
        btnToggle.classList.remove('bg-slate-100', 'text-brand-700');
        btnToggle.classList.add('bg-white', 'text-slate-700');

        // Повертаємо стандартну компактну висоту блоку підрейсів
        if (resolvedTimelineBlock) {
          resolvedTimelineBlock.classList.add('shrink-0');
          resolvedTimelineBlock.classList.remove('flex-1', 'min-h-0', 'flex', 'flex-col');
        }
        if (timelineCards) {
          timelineCards.classList.add('max-h-60');
          timelineCards.classList.remove('flex-1', 'min-h-0', 'max-h-[560px]');
        }
      }
    }

    updateExpandedLayout();

    btnToggle.onclick = () => {
      isAssignedShipmentsCollapsed = !isAssignedShipmentsCollapsed;
      updateExpandedLayout();
    };
  }

  let currentModalTransport = 'Морський';

  window.openCreateSubvoyageModal = function () {
    const modal = document.getElementById('modal-create-subvoyage');
    if (!modal) return;
    modal.classList.remove('hidden');

    const today = new Date().toISOString().split('T')[0];
    const in30Days = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    const dateLoadInput = document.getElementById('new-sv-date-load');
    const etdInput = document.getElementById('new-sv-etd');
    const etaInput = document.getElementById('new-sv-eta');
    if (dateLoadInput && !dateLoadInput.value) dateLoadInput.value = today;
    if (etdInput && !etdInput.value) etdInput.value = today;
    if (etaInput && !etaInput.value) etaInput.value = in30Days;

    setCreateSvTransport('Морський');
  };

  window.closeCreateSubvoyageModal = function () {
    const modal = document.getElementById('modal-create-subvoyage');
    if (modal) modal.classList.add('hidden');
  };

  window.setCreateSvTransport = function (mode) {
    currentModalTransport = mode;
    const btnAuto = document.getElementById('btn-create-sv-mode-auto');
    const btnSea = document.getElementById('btn-create-sv-mode-sea');
    const btnAir = document.getElementById('btn-create-sv-mode-air');
    const heading = document.getElementById('new-sv-route-heading');
    const lineHeading = document.getElementById('new-sv-line-heading');
    const originPortLabel = document.getElementById('new-sv-origin-port-label');
    const destPortLabel = document.getElementById('new-sv-dest-port-label');
    const carrierLabel = document.getElementById('new-sv-carrier-label');
    const bookingLabel = document.getElementById('new-sv-booking-label');

    const activeCls = 'py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 bg-brand-600 text-white shadow-2xs cursor-pointer';
    const normalCls = 'py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer';

    if (btnAuto) btnAuto.className = mode === 'Авто' ? activeCls : normalCls;
    if (btnSea) btnSea.className = mode === 'Морський' ? activeCls : normalCls;
    if (btnAir) btnAir.className = mode === 'Авіа' ? activeCls : normalCls;

    if (mode === 'Авто') {
      if (heading) heading.textContent = 'Маршрут - Авто';
      if (lineHeading) lineHeading.textContent = 'Автоперевізник / ТТН';
      if (originPortLabel) originPortLabel.textContent = 'Пункт / Термінал відправки';
      if (destPortLabel) destPortLabel.textContent = 'Пункт доставки (Отримання)';
      if (carrierLabel) carrierLabel.textContent = 'Автопідприємство / Перевізник';
      if (bookingLabel) bookingLabel.textContent = 'Номер CMR / ТТН';
    } else if (mode === 'Авіа') {
      if (heading) heading.textContent = 'Маршрут - Авіа';
      if (lineHeading) lineHeading.textContent = 'Авіалінія / AWB';
      if (originPortLabel) originPortLabel.textContent = 'Аеропорт вильоту (POL)';
      if (destPortLabel) destPortLabel.textContent = 'Аеропорт доставки (POD)';
      if (carrierLabel) carrierLabel.textContent = 'Авіакомпанія';
      if (bookingLabel) bookingLabel.textContent = 'Номер AWB';
    } else {
      if (heading) heading.textContent = 'Маршрут - Море';
      if (lineHeading) lineHeading.textContent = 'Морська лінія';
      if (originPortLabel) originPortLabel.textContent = 'Порт відправки';
      if (destPortLabel) destPortLabel.textContent = 'Порт доставки';
      if (carrierLabel) carrierLabel.textContent = 'Морська лінія';
      if (bookingLabel) bookingLabel.textContent = 'Номер букінгу';
    }
  };

  window.submitCreateSubvoyageModal = function () {
    const parentVoyage = document.getElementById('new-sv-parent-voyage')?.value || 'VOY-2026-09';
    const template = document.getElementById('new-sv-template')?.value || 'Морський (Мультимодальне плече)';
    const status = document.getElementById('new-sv-status')?.value || 'Формування';
    const name = document.getElementById('new-sv-name')?.value.trim();
    const logist = document.getElementById('new-sv-logist')?.value || 'І. Сидоренко';
    const originCountry = document.getElementById('new-sv-origin-country')?.value || 'Китай';
    const destCountry = document.getElementById('new-sv-dest-country')?.value || 'Польща';
    const isMain = document.getElementById('new-sv-is-main')?.checked ?? true;
    const isTransit = document.getElementById('new-sv-is-transit')?.checked ?? true;

    const loadingPlace = document.getElementById('new-sv-loading-place')?.value.trim() || `${originCountry} (Термінал)`;
    const originPort = document.getElementById('new-sv-origin-port')?.value.trim() || `${originCountry}`;
    const unloadingPlace = document.getElementById('new-sv-unloading-place')?.value.trim() || `${destCountry} (Термінал отримання)`;
    const destPort = document.getElementById('new-sv-dest-port')?.value.trim() || `${destCountry}`;

    const dateLoad = document.getElementById('new-sv-date-load')?.value;
    const etd = document.getElementById('new-sv-etd')?.value || dateLoad;
    const atd = document.getElementById('new-sv-atd')?.value || null;
    const eta = document.getElementById('new-sv-eta')?.value;
    const ata = document.getElementById('new-sv-ata')?.value || null;

    const carrier = document.getElementById('new-sv-carrier')?.value.trim() || 'CMA CGM';
    const booking = document.getElementById('new-sv-booking')?.value.trim() || `BKG-${Math.floor(100000 + Math.random() * 900000)}`;
    const tracking = document.getElementById('new-sv-tracking')?.value.trim() || `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    const comment = document.getElementById('new-sv-comment')?.value.trim();

    if (!name) {
      alert('Будь ласка, введіть назву підрейсу!');
      return;
    }
    if (!eta) {
      alert('Будь ласка, оберіть планову дату прибуття/судозаходу (ETA)!');
      return;
    }

    const newId = `SV-${Math.floor(4420 + Math.random() * 500)}`;
    const newSubvoyage = {
      id: newId,
      name: name,
      parentVoyage: parentVoyage === 'Не обрано' ? 'VOY-2026-09' : parentVoyage,
      status: status,
      logist: logist,
      loadingType: template.includes('LCL') ? 'LCL' : (template.includes('Air') ? 'Air Consolid' : 'LTL'),
      originCountry: originCountry,
      destinationCountry: destCountry, // Точка доставки ЦЬОГО підрейсу!
      routeStages: [originCountry, destCountry],
      hub: `Транзитний хаб ${destCountry} (${unloadingPlace})`,
      transitSegment: `${originCountry} ➔ ${destCountry}`,
      plannedDeparture: etd || dateLoad || '2026-11-05',
      plannedArrival: eta,
      actualDeparture: atd,
      actualArrival: ata,
      maxPlaces: 600,
      maxWeight: 24.0,
      maxVolume: 68.0,
      transport: currentModalTransport,
      temperatureSupported: false,
      adrPermitted: true,
      transportDetails: {
        shippingLine: carrier,
        carrier: carrier,
        airline: carrier,
        bookingNumber: booking,
        awbNumber: booking,
        tracking: tracking,
        ports: `${originPort} ➔ ${destPort}`
      },
      template: template,
      isMain: isMain,
      isTransit: isTransit,
      loadingPlace: loadingPlace,
      originPort: originPort,
      unloadingPlace: unloadingPlace,
      destinationPort: destPort,
      comment: comment || `Підрейс закриває транспортне плече ${originCountry} ➔ ${destCountry}. Точка отримання у цьому підрейсі: ${destCountry} (${unloadingPlace}).`
    };

    subVoyagesData.unshift(newSubvoyage);
    selectedSubvoyageStatuses.add(newSubvoyage.status);
    closeCreateSubvoyageModal();
    activeSubvoyageId = newSubvoyage.id;
    leftTableSubvoyageMode = 'pool';
    updateActiveSubvoyageState();
    renderAll();
    showToast(`Підрейс «${newSubvoyage.name}» (${newSubvoyage.id}) успішно створено! Маршрут: ${newSubvoyage.originCountry} ➔ ${newSubvoyage.destinationCountry} (отримання: ${newSubvoyage.destinationCountry})`);
  };

  function setupSubvoyageFocusAndModalsActions() {
    // Кнопка "Створити підрейс" (відкриває форму створення нового підрейсу)
    const btnCreateDummy = document.getElementById('btn-create-subvoyage-dummy');
    if (btnCreateDummy) {
      btnCreateDummy.onclick = () => openCreateSubvoyageModal();
    }
    const btnCreateReal = document.getElementById('btn-create-subvoyage');
    if (btnCreateReal) {
      btnCreateReal.onclick = () => openCreateSubvoyageModal();
    }

    // Кнопка "Усі підрейси" (скидання вибору підрейсу -> перехід у режим всіх підрейсів та всіх перевезень)
    const btnShowAllSv = document.getElementById('btn-show-all-subvoyages');
    if (btnShowAllSv) {
      btnShowAllSv.onclick = () => {
        activeSubvoyageId = null;
        leftTableSubvoyageMode = 'pool';
        isRecommendationFilterIgnored = false;
        shipmentsCurrentPage = 1;
        updateActiveSubvoyageState();
        renderAll();
      };
    }

    const btnClearFocus = document.getElementById('btn-clear-active-sv-focus');
    if (btnClearFocus) {
      btnClearFocus.onclick = () => {
        activeSubvoyageId = null;
        leftTableSubvoyageMode = 'pool';
        isRecommendationFilterIgnored = false;
        shipmentsCurrentPage = 1;
        updateActiveSubvoyageState();
        renderAll();
      };
    }

    // Блок 4.1: Кнопка «Скинути рекомендації» на верхній панелі керування (завжди видима і доступна)
    const btnToggleIgnoreRec = document.getElementById('btn-toggle-ignore-recommendations');
    if (btnToggleIgnoreRec) {
      btnToggleIgnoreRec.onclick = () => {
        isRecommendationFilterIgnored = !isRecommendationFilterIgnored;
        leftTableSubvoyageMode = 'pool';
        shipmentsCurrentPage = 1;
        updateActiveSubvoyageState();
        renderAll();
        if (isRecommendationFilterIgnored) {
          showToast(activeSubvoyageId
            ? `Рекомендації вимкнено: показані всі доступні позиції для ручного підбору в ${activeSubvoyageId}`
            : `Рекомендації вимкнено: при виборі підрейсу будуть показані всі доступні позиції без фільтра маршруту/типу`);
        } else {
          showToast(`Автоматичний підбір рекомендацій увімкнено`);
        }
      };
    }

    // Перемикачі режиму лівої таблиці: "Доступні для рейсу" / "У цьому підрейсі" (вимога п.5)
    const btnLeftPool = document.getElementById('btn-left-mode-pool');
    const btnLeftAssigned = document.getElementById('btn-left-mode-assigned');
    if (btnLeftPool) {
      btnLeftPool.onclick = () => {
        leftTableSubvoyageMode = 'pool';
        shipmentsCurrentPage = 1;
        renderAll();
      };
    }
    if (btnLeftAssigned) {
      btnLeftAssigned.onclick = () => {
        leftTableSubvoyageMode = 'assigned';
        shipmentsCurrentPage = 1;
        renderAll();
      };
    }

    const btnShowAssignedInLeft = document.getElementById('btn-show-assigned-in-left-table');
    if (btnShowAssignedInLeft) {
      btnShowAssignedInLeft.onclick = () => {
        if (!activeSubvoyageId) return;
        leftTableSubvoyageMode = leftTableSubvoyageMode === 'assigned' ? 'pool' : 'assigned';
        shipmentsCurrentPage = 1;
        renderAll();
      };
    }

    const btnOpenActiveSvDetails = document.getElementById('btn-open-active-sv-details');
    if (btnOpenActiveSvDetails) {
      btnOpenActiveSvDetails.onclick = () => {
        if (activeSubvoyageId) window.openSubvoyageDrawer(activeSubvoyageId);
      };
    }

    // Закриття Drawer підрейсу
    const svBackdrop = document.getElementById('subvoyage-drawer-backdrop');
    const btnCloseSvDrawer = document.getElementById('btn-close-sv-drawer');
    const btnCloseSvBottom = document.getElementById('sv-drawer-btn-close-bottom');
    const closeSvDrawer = () => {
      const dr = document.getElementById('subvoyage-drawer');
      if (svBackdrop) svBackdrop.classList.add('hidden');
      if (dr) dr.classList.add('translate-x-full');
    };
    if (svBackdrop) svBackdrop.onclick = closeSvDrawer;
    if (btnCloseSvDrawer) btnCloseSvDrawer.onclick = closeSvDrawer;
    if (btnCloseSvBottom) btnCloseSvBottom.onclick = closeSvDrawer;
  }

  function setupSubvoyageDestinationHubOptions() {
    if (!subvoyageDestinationHubFilter) return;
    const hubs = Array.from(new Set(subVoyagesData.map(sv => sv.hub))).filter(Boolean);

    subvoyageDestinationHubFilter.innerHTML = `
      <option value="all">Усі склади доставки</option>
      ${hubs.map(h => `<option value="${h}">${h}</option>`).join('')}
    `;

    subvoyageDestinationHubFilter.addEventListener('change', (e) => {
      selectedDestinationHub = e.target.value;
      updateActiveSubvoyageState();
      renderAll();
    });
  }

  // Налаштування multiselect фільтрів Дошки Підрейсів: Статуси та Логісти
  function setupSubvoyageBoardFilters() {
    const allStatuses = Array.from(new Set(subVoyagesData.map(s => s.status))).filter(Boolean);
    const allLogists = Array.from(new Set(subVoyagesData.map(s => s.logist))).filter(Boolean);

    // По дефолту на Дошці Підрейсів відображаємо тільки підрейси зі статусом "Формування" (вимога п.4)
    const defaultFormationStatuses = allStatuses.filter(st => st === 'Формування');
    selectedSubvoyageStatuses = new Set(defaultFormationStatuses.length > 0 ? defaultFormationStatuses : allStatuses);
    selectedSubvoyageLogists = new Set(allLogists);

    // 1. Статуси
    const statusBtn = document.getElementById('sv-status-multiselect-btn');
    const statusMenu = document.getElementById('sv-status-multiselect-menu');
    const statusContainer = document.getElementById('sv-status-checkboxes-container');
    const statusSelectAll = document.getElementById('sv-status-select-all');
    const statusClearAll = document.getElementById('sv-status-clear-all');

    if (statusContainer) {
      statusContainer.innerHTML = allStatuses.map(st => {
        const isChecked = selectedSubvoyageStatuses.has(st);
        return `
          <label class="flex items-center gap-2 text-xs text-slate-700 hover:bg-slate-50 p-1 rounded cursor-pointer select-none">
            <input type="checkbox" value="${st}" ${isChecked ? 'checked' : ''} class="sv-status-cb rounded text-brand-600 focus:ring-brand-500 cursor-pointer">
            <span class="truncate">${st}</span>
          </label>
        `;
      }).join('');

      statusContainer.querySelectorAll('.sv-status-cb').forEach(cb => {
        cb.addEventListener('change', () => {
          if (cb.checked) selectedSubvoyageStatuses.add(cb.value);
          else selectedSubvoyageStatuses.delete(cb.value);
          updateSubvoyageStatusFilterLabel(allStatuses.length);
          updateActiveSubvoyageState();
          renderAll();
        });
      });
    }

    if (statusBtn && statusMenu) {
      statusBtn.onclick = (e) => {
        e.stopPropagation();
        const logistMenu = document.getElementById('sv-logist-multiselect-menu');
        if (logistMenu) logistMenu.classList.add('hidden');
        statusMenu.classList.toggle('hidden');
      };
      statusMenu.onclick = (e) => e.stopPropagation();
    }

    if (statusSelectAll && statusContainer) {
      statusSelectAll.onclick = () => {
        statusContainer.querySelectorAll('.sv-status-cb').forEach(cb => cb.checked = true);
        selectedSubvoyageStatuses = new Set(allStatuses);
        updateSubvoyageStatusFilterLabel(allStatuses.length);
        updateActiveSubvoyageState();
        renderAll();
      };
    }

    if (statusClearAll && statusContainer) {
      statusClearAll.onclick = () => {
        statusContainer.querySelectorAll('.sv-status-cb').forEach(cb => cb.checked = false);
        selectedSubvoyageStatuses.clear();
        updateSubvoyageStatusFilterLabel(allStatuses.length);
        updateActiveSubvoyageState();
        renderAll();
      };
    }

    updateSubvoyageStatusFilterLabel(allStatuses.length);

    // 2. Логісти
    const logistBtn = document.getElementById('sv-logist-multiselect-btn');
    const logistMenu = document.getElementById('sv-logist-multiselect-menu');
    const logistContainer = document.getElementById('sv-logist-checkboxes-container');
    const logistSelectAll = document.getElementById('sv-logist-select-all');
    const logistClearAll = document.getElementById('sv-logist-clear-all');

    if (logistContainer) {
      logistContainer.innerHTML = allLogists.map(lg => `
        <label class="flex items-center gap-2 text-xs text-slate-700 hover:bg-slate-50 p-1 rounded cursor-pointer select-none">
          <input type="checkbox" value="${lg}" checked class="sv-logist-cb rounded text-brand-600 focus:ring-brand-500 cursor-pointer">
          <span class="truncate">${lg}</span>
        </label>
      `).join('');

      logistContainer.querySelectorAll('.sv-logist-cb').forEach(cb => {
        cb.addEventListener('change', () => {
          if (cb.checked) selectedSubvoyageLogists.add(cb.value);
          else selectedSubvoyageLogists.delete(cb.value);
          updateSubvoyageLogistFilterLabel(allLogists.length);
          updateActiveSubvoyageState();
          renderAll();
        });
      });
    }

    if (logistBtn && logistMenu) {
      logistBtn.onclick = (e) => {
        e.stopPropagation();
        const smenu = document.getElementById('sv-status-multiselect-menu');
        if (smenu) smenu.classList.add('hidden');
        logistMenu.classList.toggle('hidden');
      };
      logistMenu.onclick = (e) => e.stopPropagation();
    }

    if (logistSelectAll && logistContainer) {
      logistSelectAll.onclick = () => {
        logistContainer.querySelectorAll('.sv-logist-cb').forEach(cb => cb.checked = true);
        selectedSubvoyageLogists = new Set(allLogists);
        updateSubvoyageLogistFilterLabel(allLogists.length);
        updateActiveSubvoyageState();
        renderAll();
      };
    }

    if (logistClearAll && logistContainer) {
      logistClearAll.onclick = () => {
        logistContainer.querySelectorAll('.sv-logist-cb').forEach(cb => cb.checked = false);
        selectedSubvoyageLogists.clear();
        updateSubvoyageLogistFilterLabel(allLogists.length);
        updateActiveSubvoyageState();
        renderAll();
      };
    }

    updateSubvoyageLogistFilterLabel(allLogists.length);

    // Закриття випадних меню при кліку зовні
    document.addEventListener('click', () => {
      if (statusMenu) statusMenu.classList.add('hidden');
      if (logistMenu) logistMenu.classList.add('hidden');
    });
  }

  function updateSubvoyageStatusFilterLabel(totalCount) {
    const label = document.getElementById('sv-status-multiselect-label');
    if (!label) return;
    const count = selectedSubvoyageStatuses.size;
    if (count === totalCount) {
      label.textContent = 'Усі статуси';
    } else if (count === 0) {
      label.textContent = 'Не обрано (0)';
    } else if (count <= 2) {
      label.textContent = Array.from(selectedSubvoyageStatuses).join(', ');
    } else {
      label.textContent = `Статусів: ${count}`;
    }
  }

  function updateSubvoyageLogistFilterLabel(totalCount) {
    const label = document.getElementById('sv-logist-multiselect-label');
    if (!label) return;
    const count = selectedSubvoyageLogists.size;
    if (count === totalCount) {
      label.textContent = 'Усі логісти';
    } else if (count === 0) {
      label.textContent = 'Не обрано (0)';
    } else if (count <= 2) {
      label.textContent = Array.from(selectedSubvoyageLogists).join(', ');
    } else {
      label.textContent = `Логістів: ${count}`;
    }
  }

  function setupHubFilterOptions() {
    if (!hubCheckboxesList) return;
    const allHubs = Array.from(new Set(transportsData.map(t => t.hub))).filter(Boolean);
    hubCheckboxesList.innerHTML = allHubs.map(hub => {
      const count = transportsData.filter(t => t.hub === hub && t.subvoyageId === null).length;
      const checked = filters.hubs.has(hub);
      return `
        <label class="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer">
          <span class="truncate mr-2 ${checked ? 'font-bold text-brand-900' : 'text-slate-700'}">${hub}</span>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-400 font-mono">(${count})</span>
            <input type="checkbox" value="${hub}" ${checked ? 'checked' : ''} class="hub-cb rounded text-brand-600 cursor-pointer">
          </div>
        </label>
      `;
    }).join('');

    hubCheckboxesList.querySelectorAll('.hub-cb').forEach(cb => {
      cb.addEventListener('change', (e) => {
        if (e.target.checked) filters.hubs.add(e.target.value);
        else filters.hubs.delete(e.target.value);
        shipmentsCurrentPage = 1;
        updateHubFilterButtonLabel();
        renderAll();
      });
    });
  }

  function updateHubFilterButtonLabel() {
    if (!hubFilterLabel) return;
    if (filters.hubs.size === 0) {
      hubFilterLabel.textContent = 'Усі склади прибуття';
    } else {
      hubFilterLabel.textContent = `Складів: ${filters.hubs.size}`;
    }
  }

  function getFilteredSubvoyagesList() {
    return getSortedSubvoyages().filter(sv => {
      if (selectedDestinationHub !== 'all' && sv.hub !== selectedDestinationHub) return false;
      if (selectedSubvoyageUrgency !== 'all') {
        const u = getSubvoyageUrgencyInfo(sv);
        if (u.level !== selectedSubvoyageUrgency) return false;
      }
      if (selectedSubvoyageStatuses.size > 0 && !selectedSubvoyageStatuses.has(sv.status)) {
        return false;
      }
      if (selectedSubvoyageLogists.size > 0 && !selectedSubvoyageLogists.has(sv.logist)) {
        return false;
      }
      return true;
    });
  }

  function updateActiveSubvoyageState() {
    if (activeSubvoyageId !== null && !subVoyagesData.some(s => s.id === activeSubvoyageId)) {
      activeSubvoyageId = null;
      leftTableSubvoyageMode = 'pool';
    }

    const currentSv = subVoyagesData.find(s => s.id === activeSubvoyageId);
    if (activeSubvoyageHeaderTitle) {
      activeSubvoyageHeaderTitle.textContent = currentSv
        ? `${currentSv.name} (${currentSv.id})`
        : 'Усі підрейси';
    }
    if (currentSubvoyageStatusSelect && currentSv) {
      currentSubvoyageStatusSelect.value = currentSv.status;
    }
    if (currentSubvoyageCommentInput && currentSv) {
      currentSubvoyageCommentInput.value = currentSv.comment || '';
    }

    // Показ / приховування панелі обраного підрейсу та перемикачів режиму
    const activeControlPanel = document.getElementById('active-subvoyage-control-panel');
    const leftModeSwitcher = document.getElementById('left-table-sv-mode-switcher');
    const btnClearFocus = document.getElementById('btn-clear-active-sv-focus');
    const btnToggleIgnoreRec = document.getElementById('btn-toggle-ignore-recommendations');
    const btnToggleIgnoreRecText = document.getElementById('btn-toggle-ignore-recommendations-text');
    const btnShowAllSv = document.getElementById('btn-show-all-subvoyages');

    if (btnToggleIgnoreRec) {
      if (currentSv) {
        btnToggleIgnoreRec.classList.remove('hidden');
        btnToggleIgnoreRec.classList.add('inline-flex');
        if (isRecommendationFilterIgnored) {
          btnToggleIgnoreRec.className = 'px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white border border-amber-700 rounded text-[10px] font-bold transition cursor-pointer inline-flex items-center gap-1 shadow-2xs';
          if (btnToggleIgnoreRecText) btnToggleIgnoreRecText.textContent = 'Увімкнути рекомендації';
        } else {
          btnToggleIgnoreRec.className = 'px-2 py-0.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded text-[10px] font-bold transition cursor-pointer inline-flex items-center gap-1 shadow-2xs';
          if (btnToggleIgnoreRecText) btnToggleIgnoreRecText.textContent = 'Скинути рекомендації';
        }
      } else {
        btnToggleIgnoreRec.classList.add('hidden');
        btnToggleIgnoreRec.classList.remove('inline-flex');
      }
    }

    if (currentSv) {
      if (activeControlPanel) activeControlPanel.classList.remove('hidden');
      if (btnClearFocus) btnClearFocus.classList.remove('hidden');
      if (btnShowAllSv) {
        btnShowAllSv.className = 'text-[10px] px-2 py-0.5 rounded-md font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition cursor-pointer';
      }
    } else {
      if (activeControlPanel) activeControlPanel.classList.add('hidden');
      if (btnClearFocus) btnClearFocus.classList.add('hidden');
      if (btnShowAllSv) {
        btnShowAllSv.className = 'text-[10px] px-2 py-0.5 rounded-md font-bold bg-brand-600 text-white shadow-2xs transition cursor-pointer';
      }
    }

    const contextHintText = document.getElementById('left-table-context-hint-text');
    if (contextHintText) {
      contextHintText.innerHTML = '';
    }
  }

  function calculateSubvoyageCapacity(svId) {
    const sv = subVoyagesData.find(s => s.id === svId);
    if (!sv) {
      return {
        vol: 0, actualVol: 0, plannedVol: 0, weight: 0, places: 0,
        pctVol: 0, pctActualVol: 0, pctPlannedVol: 0, pctWeight: 0, pctPlaces: 0,
        projPctVol: 0, projPctWeight: 0, projPctPlaces: 0,
        deltaVol: 0, deltaWeight: 0, deltaPlaces: 0,
        isOverloaded: false,
        assignedCount: 0,
        blockingCount: 0
      };
    }

    const assigned = transportsData.filter(t => t.subvoyageId === svId);
    // Блок 4.3: Поділ на Фактичні куби та Планові куби (обіцянки)
    const actualVol = assigned
      .filter(t => t.readinessCategory !== 'planned')
      .reduce((sum, t) => sum + (Number(t.volume) || 0), 0);
    const plannedVol = assigned
      .filter(t => t.readinessCategory === 'planned')
      .reduce((sum, t) => sum + (Number(t.volume) || 0), 0);

    const vol = actualVol + plannedVol;
    const weight = assigned.reduce((sum, t) => sum + (Number(t.weight) || 0), 0);
    const places = assigned.reduce((sum, t) => sum + (Number(t.places) || 0), 0);

    const blockingCount = assigned.filter(t => t.readinessCategory && t.readinessCategory !== 'ready').length;

    let deltaVol = 0;
    let deltaWeight = 0;
    let deltaPlaces = 0;

    selectedUnassignedIds.forEach(id => {
      const tr = transportsData.find(t => t.id === id && t.subvoyageId !== svId);
      if (tr) {
        deltaVol += (Number(tr.volume) || 0);
        deltaWeight += (Number(tr.weight) || 0);
        deltaPlaces += (Number(tr.places) || 0);
      }
    });

    const totalVol = vol + deltaVol;
    const totalWeight = weight + deltaWeight;
    const totalPlaces = places + deltaPlaces;

    const pctVol = Math.round((vol / sv.maxVolume) * 100);
    const pctActualVol = Math.round((actualVol / sv.maxVolume) * 100);
    const pctPlannedVol = Math.round((plannedVol / sv.maxVolume) * 100);
    const pctWeight = Math.round((weight / sv.maxWeight) * 100);
    const pctPlaces = Math.round((places / sv.maxPlaces) * 100);

    const projPctVol = Math.round((totalVol / sv.maxVolume) * 100);
    const projPctWeight = Math.round((totalWeight / sv.maxWeight) * 100);
    const projPctPlaces = Math.round((totalPlaces / sv.maxPlaces) * 100);

    const isOverloaded = projPctVol > 100 || projPctWeight > 100 || projPctPlaces > 100;

    return {
      vol, actualVol, plannedVol, weight, places,
      deltaVol, deltaWeight, deltaPlaces,
      totalVol, totalWeight, totalPlaces,
      pctVol, pctActualVol, pctPlannedVol, pctWeight, pctPlaces,
      projPctVol, projPctWeight, projPctPlaces,
      isOverloaded,
      assignedCount: assigned.length,
      blockingCount
    };
  }

  function getCapacityColorTheme(pct) {
    if (pct > 100) {
      return {
        badge: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse font-bold',
        bar: 'bg-rose-500 animate-pulse',
        text: 'text-rose-600 font-bold'
      };
    } else if (pct >= 80) {
      return {
        badge: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
        bar: 'bg-amber-500',
        text: 'text-amber-700 font-bold'
      };
    } else {
      return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
        bar: 'bg-emerald-500',
        text: 'text-emerald-700 font-bold'
      };
    }
  }

  // Повний каталог маркерів вантажу за групами (72 маркери)
  const CARGO_MARKERS_CATALOG = [
    // 1. Специфіка та властивості вантажу
    { id: 'general', icon: '📦', category: 'Специфіка та властивості вантажу', name: 'Генеральні (General Cargo)', shortLabel: 'Генеральний', cls: 'bg-slate-100 text-slate-800 border-slate-300' },
    { id: 'adr', icon: '☣️', category: 'Специфіка та властивості вантажу', name: 'Небезпечні (ADR / IMO / DGR — 1–9 класи)', shortLabel: 'ADR', cls: 'bg-rose-100 text-rose-800 border-rose-300' },
    { id: 'batt_li', icon: '🔋', category: 'Специфіка та властивості вантажу', name: 'Вантажі з батареями: Літій-іонні / Літій-металеві (UN 3480, 3481, 3090, 3091)', shortLabel: 'Li-ion', cls: 'bg-amber-100 text-amber-800 border-amber-300' },
    { id: 'batt_lead', icon: '🪫', category: 'Специфіка та властивості вантажу', name: 'Вантажі з батареями: Свинцево-кислотні (UN 2794)', shortLabel: 'Lead АКБ', cls: 'bg-amber-100 text-amber-900 border-amber-300' },
    { id: 'batt_waste', icon: '♻️', category: 'Специфіка та властивості вантажу', name: 'Вантажі з батареями: Нові vs Вживані / Пошкоджені (відходи)', shortLabel: 'АКБ відходи', cls: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { id: 'temp_deep_freeze', icon: '❄️', category: 'Специфіка та властивості вантажу', name: 'Температурні: Глибока заморозка (-18°C...-25°C)', shortLabel: '-18°C', cls: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
    { id: 'temp_fresh', icon: '🧊', category: 'Специфіка та властивості вантажу', name: 'Температурні: Охолоджені / Fresh (+2°C...+6°C)', shortLabel: '+2...+6°C', cls: 'bg-sky-100 text-sky-800 border-sky-300' },
    { id: 'temp_plus', icon: '🌡️', category: 'Специфіка та властивості вантажу', name: 'Температурні: Підтримка плюсової температури (+15°C...+25°C)', shortLabel: '+15...+25°C', cls: 'bg-orange-100 text-orange-800 border-orange-300' },
    { id: 'temp_multi', icon: '🌗', category: 'Специфіка та властивості вантажу', name: 'Температурні: Мультитемпературні (двозонні)', shortLabel: 'Мультитемп', cls: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    { id: 'pharma', icon: '💊', category: 'Специфіка та властивості вантажу', name: 'Фармацевтичні (GDP-вантажі)', shortLabel: 'GDP', cls: 'bg-teal-100 text-teal-800 border-teal-300' },
    { id: 'fragile', icon: '🍷', category: 'Специфіка та властивості вантажу', name: 'Крихкий вантаж (обережне поводження)', shortLabel: 'Крихке', cls: 'bg-rose-50 text-rose-800 border-rose-200' },
    { id: 'oversized', icon: '🚜', category: 'Специфіка та властивості вантажу', name: 'Негабаритні та великовагові (Oversized / Heavy Lift / OOG)', shortLabel: 'Негабарит', cls: 'bg-purple-100 text-purple-900 border-purple-300' },
    { id: 'perishable', icon: '🍎', category: 'Специфіка та властивості вантажу', name: 'Швидкопсувні (Perishable / ATP)', shortLabel: 'Швидкопсувне', cls: 'bg-red-100 text-red-800 border-red-300' },
    { id: 'liquid_food', icon: '🛢️', category: 'Специфіка та властивості вантажу', name: 'Наливні (Liquid Bulk): Харчові', shortLabel: 'Харч.наливний', cls: 'bg-amber-50 text-amber-900 border-amber-300' },
    { id: 'liquid_chem', icon: '🧪', category: 'Специфіка та властивості вантажу', name: 'Наливні (Liquid Bulk): Хімічні, нафтопродукти та гази (LNG/LPG)', shortLabel: 'Хімія/Газ', cls: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300' },
    { id: 'dry_bulk', icon: '🌾', category: 'Специфіка та властивості вантажу', name: 'Насипні та навалювальні (Dry Bulk)', shortLabel: 'Насипний', cls: 'bg-yellow-50 text-yellow-900 border-yellow-300' },
    { id: 'livestock', icon: '🐄', category: 'Специфіка та властивості вантажу', name: 'Живий вантаж (Livestock)', shortLabel: 'Тварини', cls: 'bg-emerald-50 text-emerald-900 border-emerald-300' },
    { id: 'high_value', icon: '💎', category: 'Специфіка та властивості вантажу', name: 'Високоцінні (High-Value Cargo / TAPA)', shortLabel: 'Цінне', cls: 'bg-violet-100 text-violet-800 border-violet-300' },
    { id: 'excise', icon: '🥃', category: 'Специфіка та властивості вантажу', name: 'Акцизні вантажі', shortLabel: 'Акциз', cls: 'bg-rose-50 text-rose-900 border-rose-300' },
    { id: 'military', icon: '🎯', category: 'Специфіка та властивості вантажу', name: 'Товари подвійного призначення та військові (Dual-Use / Military)', shortLabel: 'Military', cls: 'bg-stone-200 text-stone-900 border-stone-400 font-extrabold' },
    { id: 'diplomatic', icon: '🏛️', category: 'Специфіка та властивості вантажу', name: 'Дипломатичні вантажі', shortLabel: 'Диппошта', cls: 'bg-blue-100 text-blue-900 border-blue-300' },
    { id: 'personal_effects', icon: '🧳', category: 'Специфіка та властивості вантажу', name: 'Особисті речі (Removal Goods / Переїзди)', shortLabel: 'Особисті речі', cls: 'bg-orange-50 text-orange-900 border-orange-300' },
    { id: 'empty_packaging', icon: '🔄', category: 'Специфіка та властивості вантажу', name: 'Порожня тара / Зворотна тара', shortLabel: 'Зворотна тара', cls: 'bg-slate-100 text-slate-700 border-slate-300' },
    { id: 'waste', icon: '🗑️', category: 'Специфіка та властивості вантажу', name: 'Відходи та вторсировина ("Зелений" та "Жовтий" списки)', shortLabel: 'Відходи', cls: 'bg-zinc-100 text-zinc-800 border-zinc-300' },

    // 2. Митний статус та документи
    { id: 'customs_official', icon: '📄', category: 'Митний статус та документи', name: 'Офіційне ("Біле" / Не карго) перевезення', shortLabel: 'Біле', cls: 'bg-indigo-50 text-indigo-800 border-indigo-200 font-bold' },
    { id: 'customs_cargo', icon: '🛍️', category: 'Митний статус та документи', name: '"Карго" (збірна / спрощена схема "під ключ")', shortLabel: 'Карго', cls: 'bg-blue-50 text-blue-800 border-blue-200' },
    { id: 'export_open', icon: '🔓', category: 'Митний статус та документи', name: 'З відкритою експортною декларацією (EX-1 / EX-A — закриття на кордоні)', shortLabel: 'EX-1', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { id: 'export_closed', icon: '🔒', category: 'Митний статус та документи', name: 'Із закритою експортною декларацією (оформлено на внутрішній митниці)', shortLabel: 'Закр. EX-1', cls: 'bg-slate-100 text-slate-800 border-slate-300' },
    { id: 'export_none', icon: '🚫', category: 'Митний статус та документи', name: 'Без експортної декларації (Intra-EU або до 1000 € / 1000 кг)', shortLabel: 'Intra-EU', cls: 'bg-gray-100 text-gray-700 border-gray-300' },
    { id: 'transit_t1', icon: '🛂', category: 'Митний статус та документи', name: 'Транзитні: T1 / NCTS (T1UA)', shortLabel: 'T1 / NCTS', cls: 'bg-teal-50 text-teal-800 border-teal-200' },
    { id: 'transit_t2', icon: '🛃', category: 'Митний статус та документи', name: 'Транзитні: T2', shortLabel: 'T2', cls: 'bg-teal-50 text-teal-800 border-teal-200' },
    { id: 'carnet_tir', icon: '📘', category: 'Митний статус та документи', name: 'Перевезення під Carnet TIR (МДП)', shortLabel: 'TIR', cls: 'bg-blue-100 text-blue-900 border-blue-300 font-bold' },
    { id: 'carnet_ata', icon: '🎪', category: 'Митний статус та документи', name: 'Тимчасове ввезення / вивезення (Carnet ATA)', shortLabel: 'ATA', cls: 'bg-purple-50 text-purple-800 border-purple-200' },
    { id: 'tolling', icon: '⚙️', category: 'Митний статус та документи', name: 'Переробка на митній / поза митною територією (Толінг)', shortLabel: 'Толінг', cls: 'bg-amber-50 text-amber-900 border-amber-300' },
    { id: 'bonded_warehouse', icon: '🏢', category: 'Митний статус та документи', name: 'Митний склад (Bond / митний режим)', shortLabel: 'Мит.склад', cls: 'bg-violet-50 text-violet-800 border-violet-200' },
    { id: 'pre_declaration', icon: '💻', category: 'Митний статус та документи', name: 'Попереднє декларування (ПД / ЗДП / ЄА / ENS / ICS2)', shortLabel: 'ПД', cls: 'bg-sky-50 text-sky-800 border-sky-200' },
    { id: 'special_control', icon: '🌿', category: 'Митний статус та документи', name: 'Спецконтролі: Фітосанітарний / Ветеринарний / Екологічний', shortLabel: 'Фіто/Вет', cls: 'bg-lime-50 text-lime-900 border-lime-300' },

    // 3. Завантаження та формат відправки
    { id: 'ftl', icon: '🚛', category: 'Завантаження та формат відправки', name: 'FTL (Full Truck Load — повне завантаження авто)', shortLabel: 'FTL', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { id: 'ltl', icon: '🧩', category: 'Завантаження та формат відправки', name: 'LTL (Less than Truck Load — довантаження / догруз)', shortLabel: 'LTL', cls: 'bg-amber-50 text-amber-800 border-amber-300' },
    { id: 'groupage', icon: '🏭', category: 'Завантаження та формат відправки', name: 'Збірні вантажі (Groupage / Консолідація через хаб)', shortLabel: 'Groupage', cls: 'bg-blue-50 text-blue-800 border-blue-200' },
    { id: 'fcl', icon: '🚢', category: 'Завантаження та формат відправки', name: 'FCL (Full Container Load — цілий контейнер)', shortLabel: 'FCL', cls: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { id: 'lcl', icon: '📦', category: 'Завантаження та формат відправки', name: 'LCL (Less than Container Load — збірний контейнер)', shortLabel: 'LCL', cls: 'bg-sky-50 text-sky-800 border-sky-200' },
    { id: 'project_cargo', icon: '🏗️', category: 'Завантаження та формат відправки', name: 'Проєктні перевезення (Project Cargo)', shortLabel: 'Project', cls: 'bg-orange-50 text-orange-900 border-orange-300 font-bold' },

    // 4. Географія, дозволи та допуски
    { id: 'domestic', icon: '🏠', category: 'Географія, дозволи та допуски', name: 'Внутрішні перевезення (Domestic)', shortLabel: 'Domestic', cls: 'bg-slate-100 text-slate-800 border-slate-300' },
    { id: 'intl_bilateral', icon: '🌍', category: 'Географія, дозволи та допуски', name: 'Міжнародні двосторонні (за дозволами або "транспортний безвіз")', shortLabel: 'Міжнародне', cls: 'bg-blue-50 text-blue-900 border-blue-200' },
    { id: 'transit_geo', icon: '🛣️', category: 'Географія, дозволи та допуски', name: 'Транзитні перевезення', shortLabel: 'Транзит', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
    { id: 'cross_trade', icon: '🔀', category: 'Географія, дозволи та допуски', name: 'У треті країни / з третіх країн (Cross-trade / ЄКМТ / CEMT)', shortLabel: 'CEMT', cls: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { id: 'cabotage', icon: '🔄', category: 'Географія, дозволи та допуски', name: 'Каботажні перевезення (Cabotage)', shortLabel: 'Каботаж', cls: 'bg-purple-50 text-purple-800 border-purple-200' },
    { id: 'visa_req', icon: '🪪', category: 'Географія, дозволи та допуски', name: 'Візові: Безвіз (Біометрія) / Шенген / UK / США / Китай / Туреччина', shortLabel: 'Віза', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { id: 'port_pass', icon: '⚓', category: 'Географія, дозволи та допуски', name: 'Портові та термінальні перепустки (Alfa-Pass, CargoCard)', shortLabel: 'Alfa-Pass', cls: 'bg-sky-100 text-sky-900 border-sky-300' },
    { id: 'eco_reg', icon: '🌱', category: 'Географія, дозволи та допуски', name: 'Екологічні та цифрові реєстри (Євро-5/6, SENT, EKAER, RO e-Transport)', shortLabel: 'SENT', cls: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { id: 'crew_type', icon: '👥', category: 'Географія, дозволи та допуски', name: 'За екіпажем: Одиночний (1 водій) / Подвійний екіпаж (2 водії)', shortLabel: '2 водії', cls: 'bg-slate-100 text-slate-800 border-slate-300' },

    // 5. Вид транспорту та рухомий склад
    { id: 'truck_curtain', icon: '🚚', category: 'Вид транспорту та рухомий склад', name: 'Авто: Тент / Штора (Standard Tilt / Curtain Sider)', shortLabel: 'Штора', cls: 'bg-amber-50 text-amber-900 border-amber-200' },
    { id: 'truck_mega', icon: '📏', category: 'Вид транспорту та рухомий склад', name: 'Авто: Мега (Mega) / Юмбо (Jumbo)', shortLabel: 'Mega', cls: 'bg-amber-50 text-amber-900 border-amber-200' },
    { id: 'truck_road_train', icon: '🚛', category: 'Вид транспорту та рухомий склад', name: 'Авто: Зчіпка / Автопоїзд (Road Train / Тандем)', shortLabel: 'Зчіпка', cls: 'bg-amber-50 text-amber-900 border-amber-200' },
    { id: 'truck_box', icon: '🔒', category: 'Вид транспорту та рухомий склад', name: 'Авто: Суцільнометалевий фургон (Box) / Одяг на вішаках (GOH)', shortLabel: 'Фургон', cls: 'bg-slate-100 text-slate-800 border-slate-300' },
    { id: 'truck_reefer', icon: '❄️', category: 'Вид транспорту та рухомий склад', name: 'Авто: Рефрижератор (Reefer) / Ізотерм (Isotherm)', shortLabel: 'Реф', cls: 'bg-cyan-50 text-cyan-900 border-cyan-300' },
    { id: 'truck_chassis', icon: '⛓️', category: 'Вид транспорту та рухомий склад', name: 'Авто: Контейнеровоз (Container Chassis / з Genset)', shortLabel: 'Контейнеровоз', cls: 'bg-slate-100 text-slate-800 border-slate-300' },
    { id: 'truck_flatbed', icon: '📐', category: 'Вид транспорту та рухомий склад', name: 'Авто: Платформа / Низькорамний трал (Flatbed / Lowboy)', shortLabel: 'Трал', cls: 'bg-purple-50 text-purple-900 border-purple-200' },
    { id: 'truck_autotransporter', icon: '🚗', category: 'Вид транспорту та рухомий склад', name: 'Авто спецтранспорт: Автовоз / Скловоз (Inloader) / Лісовоз', shortLabel: 'Автовоз', cls: 'bg-slate-100 text-slate-800 border-slate-300' },
    { id: 'truck_tipper', icon: '🚜', category: 'Вид транспорту та рухомий склад', name: 'Авто спецтранспорт: Зерновоз / Самоскид / Цистерна / Силос', shortLabel: 'Самоскид', cls: 'bg-yellow-50 text-yellow-900 border-yellow-300' },
    { id: 'truck_van', icon: '🚐', category: 'Вид транспорту та рухомий склад', name: 'Авто: Бус / Малотоннажник (Sprinter / Van до 3,5 т)', shortLabel: 'Бус', cls: 'bg-slate-100 text-slate-800 border-slate-200' },
    { id: 'sea_freight', icon: '⛴️', category: 'Вид транспорту та рухомий склад', name: 'Морські (Sea): Контейнерні, Ro-Ro, Балкерні, Танкерні, Breakbulk', shortLabel: 'Море', cls: 'bg-blue-50 text-blue-900 border-blue-200' },
    { id: 'air_freight', icon: '✈️', category: 'Вид транспорту та рухомий склад', name: 'Авіаційні (Air): Генеральне, DGR, Чартер, Belly Cargo, Борт-кур\'єр (OBC)', shortLabel: 'Авіа', cls: 'bg-sky-50 text-sky-900 border-sky-200' },
    { id: 'rail_freight', icon: '🚂', category: 'Вид транспорту та рухомий склад', name: 'Залізничні (Rail): Криті, Піввагони, Хопери, Платформи, Контрейлери', shortLabel: 'Ж/Д', cls: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
    { id: 'multimodal', icon: '🔗', category: 'Вид транспорту та рухомий склад', name: 'Мультимодальні та Інтермодальні перевезення', shortLabel: 'Мультимодал', cls: 'bg-violet-50 text-violet-900 border-violet-200' },

    // 6. Спосіб пакування та кріплення
    { id: 'pkg_pallets', icon: '🪵', category: 'Спосіб пакування та кріплення', name: 'Палетовані: EUR / EPAL, FIN, Індустріальні (Stackable / Non-stackable)', shortLabel: 'Палети', cls: 'bg-amber-50 text-amber-900 border-amber-300' },
    { id: 'pkg_bags', icon: '🛍️', category: 'Спосіб пакування та кріплення', name: 'М\'яка тара: Біг-беги (Big-Bags), мішки', shortLabel: 'Біг-беги', cls: 'bg-slate-100 text-slate-800 border-slate-200' },
    { id: 'pkg_rigid', icon: '🛢️', category: 'Спосіб пакування та кріплення', name: 'Жорстка тара: Ящики, обрешітка, бочки, IBC-контейнери (єврокуби)', shortLabel: 'Ящики', cls: 'bg-stone-100 text-stone-800 border-stone-300' },
    { id: 'pkg_floor', icon: '📦', category: 'Спосіб пакування та кріплення', name: 'Навалом / Внакид (Floor loaded — без палет)', shortLabel: 'Навалом', cls: 'bg-slate-100 text-slate-800 border-slate-200' },
    { id: 'pkg_coils', icon: '🌀', category: 'Спосіб пакування та кріплення', name: 'Довгомірні та рулонні: Труби, кабель, сталь у рулонах (Coilmulde)', shortLabel: 'Рулони', cls: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
    { id: 'pkg_straps', icon: '🪢', category: 'Спосіб пакування та кріплення', name: 'Кріплення: Ремені, гумові килимки, кутники, розпірні планки, ланцюги', shortLabel: 'Ремені', cls: 'bg-orange-50 text-orange-900 border-orange-300' },
    { id: 'close_exporter_docs', icon: '📑', category: 'Митний статус та документи', name: 'Закрити Док. експортеру', shortLabel: 'Закр.док', cls: 'bg-teal-100 text-teal-900 border-teal-300 font-bold' }
  ];

  // Блок 4.2: Вичерпний список маркерів вантажу з урахуванням офіційного каталогу
  function getAllShipmentMarkers(tr) {
    if (!tr) return [];
    const markers = [];
    const addedKeys = new Set();

    const pushMarker = (item) => {
      if (!item || addedKeys.has(item.key || item.id)) return;
      addedKeys.add(item.key || item.id);
      markers.push(item);
    };

    // 1. Спосіб перевезення — завжди ПЕРШИМ у списку маркерів (вимога користувача)
    if (tr.transport) {
      const tIcon = getTransportIcon(tr.transport);
      const shortLabels = {
        'Морський': 'Море',
        'Авіа': 'Авіа',
        'Авто': 'Авто',
        'Залізниця': 'Ж/Д'
      };
      const text = shortLabels[tr.transport] || tr.transport;
      pushMarker({
        key: 'transport_mode',
        shortLabel: text,
        label: text,
        fullLabel: `Спосіб перевезення: ${tr.transport}`,
        cls: `${tIcon.bg} ${tIcon.color} font-bold`,
        icon: tIcon.icon
      });
    }

    // 2. Прямі маркери з масиву tr.markers (якщо передано масив ID або назв з каталогу)
    if (Array.isArray(tr.markers)) {
      tr.markers.forEach(mKey => {
        const found = CARGO_MARKERS_CATALOG.find(c => c.id === mKey || c.name.toLowerCase() === String(mKey).toLowerCase() || c.shortLabel.toLowerCase() === String(mKey).toLowerCase());
        if (found) {
          pushMarker({
            key: found.id,
            shortLabel: found.shortLabel,
            label: `${found.icon} ${found.shortLabel}`,
            fullLabel: `[${found.category}] ${found.name}`,
            cls: found.cls,
            icon: found.icon
          });
        }
      });
    }

    // 3. Логічний мапінг наявних полів перевезення на каталог маркерів
    const mapToCatalog = (catalogId) => {
      const found = CARGO_MARKERS_CATALOG.find(c => c.id === catalogId);
      if (found) {
        pushMarker({
          key: found.id,
          shortLabel: found.shortLabel,
          label: `${found.icon} ${found.shortLabel}`,
          fullLabel: `[${found.category}] ${found.name}`,
          cls: found.cls,
          icon: found.icon
        });
      }
    };

    if (tr.isHazardous || tr.cargoes?.some(c => c.hazardousDetails?.isHazardous)) mapToCatalog('adr');
    if (tr.hasBatteries || tr.cargoes?.some(c => c.hasBatteries)) mapToCatalog('batt_li');
    if (tr.isFragile) mapToCatalog('fragile');
    if (tr.isOversized || tr.packagingType === 'Негабарит') mapToCatalog('oversized');
    if (tr.closeExporterDocs) mapToCatalog('close_exporter_docs');
    if (tr.hasVisa) mapToCatalog('visa_req');
    if (tr.cargoType === 'Карго') mapToCatalog('customs_cargo');
    else if (tr.cargoType === 'Фрахт' || tr.cargoType === 'Біле') mapToCatalog('customs_official');

    if (tr.packagingType === 'Палети') mapToCatalog('pkg_pallets');
    else if (tr.packagingType === 'Коробки' || tr.packagingType === 'Ящики') mapToCatalog('pkg_rigid');
    else if (tr.packagingType === 'Мішки' || tr.packagingType === 'Біг-беги') mapToCatalog('pkg_bags');

    if (tr.loadingType === 'LCL') mapToCatalog('lcl');
    else if (tr.loadingType === 'FCL') mapToCatalog('fcl');
    else if (tr.loadingType === 'FTL') mapToCatalog('ftl');
    else if (tr.loadingType === 'LTL') mapToCatalog('ltl');

    return markers;
  }

  function renderShipmentPropertyBadges(tr) {
    const markers = getAllShipmentMarkers(tr);
    if (!markers || markers.length === 0) {
      return '<span class="text-[11px] text-slate-300 italic">—</span>';
    }
    const fullTooltip = markers.map(m => `• ${m.fullLabel}`).join('\n');

    const visibleHtml = markers.map(m => {
      const isFaIcon = typeof m.icon === 'string' && m.icon.startsWith('fa-');
      const text = m.shortLabel || m.label.replace(m.icon, '').trim();
      return `
        <span class="${m.cls} border px-1.5 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 shadow-2xs whitespace-nowrap leading-none select-none hover:brightness-95 transition"
              title="${m.fullLabel}">
          ${isFaIcon ? `<i class="${m.icon} text-[9px]"></i>` : `<span class="text-[10px]">${m.icon}</span>`}
          <span class="tracking-tight">${text}</span>
        </span>
      `;
    }).join('');

    return `<div class="flex flex-wrap items-center gap-1 max-w-full" title="${fullTooltip}">${visibleHtml}</div>`;
  }

  // Компактна мікро-позначка маршруту (Звідки -> Куди) з краю рядка для орієнтації (Блок 4.2)
  function renderMicroRouteBadge(tr) {
    const origin = tr.originCountry || 'Китай';
    const dest = tr.destinationCountry || tr.finalDestination || 'Україна';
    const shortMap = {
      'Китай': 'CN',
      'Україна': 'UA',
      'Польща': 'PL',
      'Німеччина': 'DE',
      'США': 'US',
      'Туреччина': 'TR'
    };
    const origCode = shortMap[origin] || origin.slice(0, 3).toUpperCase();
    const destCode = shortMap[dest] || dest.slice(0, 3).toUpperCase();
    const tIcon = getTransportIcon(tr.transport);

    return `
      <span class="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-mono font-bold shrink-0" title="Маршрут: ${origin} ➔ ${dest} (${tr.transport || '—'})">
        <i class="${tIcon.icon} ${tIcon.color} text-[8px]"></i>
        <span>${origCode}→${destCode}</span>
      </span>
    `;
  }

  function renderReadinessMicroBadge(tr) {
    const cat = tr.readinessCategory || 'ready';
    if (cat === 'planned') {
      return `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-900 border border-purple-300" title="Плановий об'єм (Обіцянка клієнта, ще не надійшов на склад)">Обіцянка (План)</span>`;
    }
    if (cat === 'not_ready') {
      return `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300" title="${tr.notReadyReason || 'Фізично на складі, але не готовий до відправки'}">Не готовий</span>`;
    }
    if (cat === 'unmarked') {
      return `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-900 border border-rose-300" title="Фізично прийнятий на склад без маркування клієнта">Непромаркований</span>`;
    }
    return '';
  }

  window.toggleSubvoyageAccordion = function (svId, event) {
    if (event) event.stopPropagation();
    if (expandedSubvoyageIds.has(svId)) {
      expandedSubvoyageIds.delete(svId);
    } else {
      expandedSubvoyageIds.add(svId);
      activeSubvoyageId = svId;
    }
    updateActiveSubvoyageState();
    renderAll();
  };

  // Блок 4.3: Права частина екрана — Список підрейсів (контейнерів) з вкладеним списком-акордеоном (ті самі 6 колонок) та поділом на Фактичні куби і Планові куби
  function renderSubvoyagesTimeline() {
    if (!subvoyagesTimelineCards) return;

    const filteredSubvoyages = getFilteredSubvoyagesList();

    if (filteredSubvoyages.length === 0) {
      subvoyagesTimelineCards.innerHTML = `
        <div class="p-4 text-center text-slate-400 italic text-xs bg-white rounded-xl border border-slate-200">
          Немає підрейсів за обраними фільтрами складу або статусу
        </div>
      `;
      return;
    }

    subvoyagesTimelineCards.innerHTML = filteredSubvoyages.map(sv => {
      const cap = calculateSubvoyageCapacity(sv.id);
      const themeVol = getCapacityColorTheme(cap.projPctVol);
      const isActive = sv.id === activeSubvoyageId;
      const isExpanded = expandedSubvoyageIds.has(sv.id);
      const assignedList = transportsData
        .filter(t => t.subvoyageId === sv.id)
        .sort((a, b) => (a.dateReady || '9999-12-31').localeCompare(b.dateReady || '9999-12-31'));

      const deltaVolText = cap.deltaVol > 0 ? `<span class="text-brand-600 font-bold ml-1">(+${cap.deltaVol.toFixed(1)} м³)</span>` : '';
      const specialAttributesHtml = renderSubvoyageSpecialAttributesBadges(sv.id);

      const maxVol = Number(sv.maxVolume) || 1;
      const isVolOverloaded = cap.projPctVol > 100 || cap.isOverloaded;

      const actualPct = Math.round((cap.actualVol / maxVol) * 100);
      const plannedPct = Math.round((cap.plannedVol / maxVol) * 100);
      const deltaPct = cap.deltaVol > 0 ? Math.round((cap.deltaVol / maxVol) * 100) : 0;

      const actualBarWidth = Math.min(100, actualPct);
      const plannedBarWidth = Math.min(100 - actualBarWidth, plannedPct);
      const deltaBarWidth = Math.min(100 - actualBarWidth - plannedBarWidth, deltaPct);

      // Вкладений список-акордеон перевезень підрейсу з тими самими 6 колонками, що й у лівій таблиці (Блок 4.3)
      const accordionHtml = isExpanded ? `
        <div class="mt-2 pt-2 border-t border-slate-200/90 space-y-2" onclick="event.stopPropagation()">
          ${assignedList.length === 0 ? `
            <div class="p-3 text-center text-slate-400 italic text-[11px] bg-slate-50 rounded-lg border border-dashed border-slate-200">
              У підрейсі ще немає перевезень. Натисніть «+ У ${sv.id}» у таблиці ліворуч для додавання.
            </div>
          ` : `
            <div class="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table class="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr class="bg-slate-100 text-slate-600 uppercase text-[9px] border-b border-slate-200">
                    <th class="p-1.5">DF номер</th>
                    <th class="p-1.5">Дата готовності</th>
                    <th class="p-1.5">Габарити</th>
                    <th class="p-1.5">Маркери</th>
                    <th class="p-1.5 text-center">Підрейс</th>
                    <th class="p-1.5 text-right">Інфо</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${assignedList.map(tr => {
        const isNonReady = tr.readinessCategory && tr.readinessCategory !== 'ready';
        return `
                      <tr class="hover:bg-slate-50 transition ${isNonReady ? 'bg-amber-50/30' : ''}" onclick="openContextDrawer('${tr.id}')">
                        <td class="p-1.5">
                          <div class="flex items-center gap-1.5 flex-wrap">
                            ${isUnmarkedCargo(tr) ? `<span class="px-1 py-0.2 rounded text-[9px] font-bold bg-slate-800 text-white" title="Це вантаж, а не перевезення">📦 Вантаж</span>` : ''}
                            <span class="font-mono font-bold text-brand-700 text-[10px]">${tr.dfShipment || tr.id}</span>
                            ${renderReadinessMicroBadge(tr)}
                          </div>
                        </td>
                        <td class="p-1.5 font-mono text-[10px] text-slate-700 whitespace-nowrap">
                          ${tr.dateReady || '—'}
                        </td>
                        <td class="p-1.5 font-mono text-[10px] text-slate-800 whitespace-nowrap">
                          <div><strong>${tr.volume}</strong> м³ | <strong>${tr.weight}</strong> т | ${tr.places} шт</div>
                          <div class="text-[9px] ${tr.readinessCategory === 'planned' ? 'text-purple-700 font-bold' : 'text-emerald-700'}">
                            ${tr.readinessCategory === 'planned' ? 'Планові куби' : 'Фактичні куби'}
                          </div>
                        </td>
                        <td class="p-1.5">
                          ${renderShipmentPropertyBadges(tr)}
                        </td>
                        <td class="p-1.5 text-center whitespace-nowrap" onclick="event.stopPropagation()">
                          <div class="inline-flex items-center gap-1">
                            ${(tr.readinessCategory === 'planned' || tr.readinessCategory === 'not_ready' || isUnmarkedCargo(tr)) ? '' : (isNonReady ? `
                              <button type="button" onclick="window.convertShipmentToReady('${tr.id}', event)"
                                class="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-300 rounded text-[9px] font-bold transition cursor-pointer"
                                title="Промаркувати / підтвердити готовність на складі">
                                ✓ Готовий
                              </button>
                            ` : '')}
                            <button type="button" onclick="detachShipmentFromSubvoyage('${tr.id}')"
                              class="px-1.5 py-0.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 rounded text-[9px] font-bold transition cursor-pointer"
                              title="Відкріпити з підрейсу назад у пул (мінус)">
                              − В пул
                            </button>
                          </div>
                        </td>
                        <td class="p-1.5 text-right whitespace-nowrap" onclick="event.stopPropagation()">
                          <button type="button" onclick="openContextDrawer('${tr.id}')"
                            class="px-1.5 py-0.5 text-slate-500 hover:text-brand-600 rounded border border-slate-200 hover:bg-slate-100 text-[10px] cursor-pointer"
                            title="Інформація про перевезення">
                            <i class="fa-solid fa-circle-info"></i>
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
      ` : '';

      return `
        <div onclick="selectActiveSubvoyage('${sv.id}')"
             class="p-2.5 rounded-xl border transition cursor-pointer select-none space-y-2 ${isActive
          ? 'bg-brand-50/90 border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
        }">
          
          <!-- Рядок 1: Назва, ID, Статус + Кількість перевезень (кнопка розгортання акордеона) та Інфо -->
          <div class="flex justify-between items-start gap-2">
            <div class="flex items-center gap-1.5 flex-wrap min-w-0">
              <span class="font-bold text-xs text-slate-900 truncate">${sv.name}</span>
              <span class="text-[10px] font-mono font-bold text-brand-700 bg-brand-100 px-1.5 py-0.2 rounded">${sv.id}</span>
              ${renderStatusBadge(sv.status)}
              ${cap.blockingCount > 0 ? `
                <span class="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-800 border border-rose-300 font-bold text-[9px] inline-flex items-center gap-1 shadow-2xs" title="Блокує відправку підрейсу: ${cap.blockingCount} позицій ще не готові або є обіцянками">
                  <i class="fa-solid fa-lock text-[8px]"></i>
                  <span>Блокують відправку: ${cap.blockingCount}</span>
                </span>
              ` : (cap.assignedCount > 0 ? `
                <span class="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[9px] inline-flex items-center gap-1" title="Усі додані вантажі готові до відправки">
                  <i class="fa-solid fa-check text-[8px]"></i>
                  <span>Готовий до виходу</span>
                </span>
              ` : '')}
            </div>
            <div class="flex items-center gap-1 shrink-0" onclick="event.stopPropagation()">
              ${sv.status === 'В дорозі' ? `
                <button type="button" onclick="window.DashboardModule && window.DashboardModule.openAcceptVoyageModal('${sv.id}', event)"
                        class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="Прийняти підрейс на склад з обов'язковим заповненням звіту («Захист від дурня»)">
                  <i class="fa-solid fa-clipboard-check text-[9px]"></i>
                  <span>Прийняти на склад</span>
                </button>
              ` : ''}
              <button type="button" onclick="window.toggleSubvoyageAccordion('${sv.id}', event)"
                      class="px-2 py-0.5 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${isExpanded
          ? 'bg-brand-600 text-white border-brand-700 shadow-2xs'
          : 'bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 border-slate-200'}"
                      title="Розгорнути / згорнути список перевезень цього підрейсу всередині картки">
                <i class="fa-solid fa-boxes-stacked text-[9px]"></i>
                <span>Перевезень: ${cap.assignedCount}</span>
                <i class="fa-solid fa-chevron-down text-[8px] transition-transform ${isExpanded ? 'rotate-180' : ''}"></i>
              </button>
              <button type="button" onclick="openSubvoyageDrawer('${sv.id}', event)"
                      class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Подивитись усю інформацію про підрейс">
                <i class="fa-solid fa-circle-info text-brand-600"></i>
                <span>Інфо</span>
              </button>
            </div>
          </div>

          <!-- Рядок 2: Спосіб перевезення, Маршрут підрейсу, Спец. маркери, Дата відправлення -->
          <div class="flex items-center justify-between gap-1.5 flex-wrap text-[10px]">
            <div class="flex items-center gap-1.5 flex-wrap">
              ${renderTransportBadge(sv.transport, 'bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[9px] font-bold')}
              <span class="inline-flex items-center gap-1 bg-sky-50 text-sky-900 border border-sky-200 px-2 py-0.5 rounded-md font-bold text-[10px]" title="Маршрут підрейсу: ${sv.originCountry} ➔ ${sv.destinationCountry}">
                <i class="fa-solid fa-arrows-left-right text-sky-600"></i>
                <span>${sv.originCountry || 'Китай'} ➔ ${sv.destinationCountry || 'Польща'}</span>
              </span>
              ${specialAttributesHtml}
            </div>
            <span class="bg-brand-50 text-brand-900 border border-brand-200 px-2 py-0.5 rounded font-mono font-bold text-[10px] inline-flex items-center gap-1">
              <i class="fa-regular fa-calendar-check text-brand-600"></i>
              <span>Відпр: ${sv.plannedDeparture || '—'}</span>
            </span>
          </div>

          <!-- Рядок 3: Поділ на Фактичні куби та Планові куби + комбінований прогрес-бар (Блок 4.3) -->
          <div class="pt-1 border-t border-slate-100 space-y-1">
            <div class="flex justify-between items-center text-[10px] font-mono text-slate-600 flex-wrap gap-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-emerald-700 font-bold" title="Фактичні куби на складі">Факт: ${cap.actualVol.toFixed(1)} м³</span>
                <span class="text-slate-300">+</span>
                <span class="text-purple-700 font-bold" title="Планові куби (обіцянки клієнтів)">План: ${cap.plannedVol.toFixed(1)} м³</span>
                <span class="text-slate-400">/ ${sv.maxVolume} м³ ${deltaVolText}</span>
                <span class="text-slate-300">•</span>
                <span title="Вага"><strong>${cap.weight.toFixed(1)}</strong>/${sv.maxWeight} т</span>
                <span class="text-slate-300">•</span>
                <span title="Кількість вантажних місць"><strong>${cap.places}</strong>${sv.maxPlaces ? `/${sv.maxPlaces}` : ''} місць${cap.deltaPlaces > 0 ? ` <span class="text-brand-600 font-bold">(+${cap.deltaPlaces})</span>` : ''}</span>
              </div>
              <span class="px-1.5 py-0.2 rounded text-[10px] border ${themeVol.badge}">
                ${cap.projPctVol}% ${cap.isOverloaded ? '⚠️' : ''}
              </span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex border border-slate-300/40 ${isVolOverloaded ? 'ring-1 ring-rose-400' : ''}" title="Заповненість об'єму: ${cap.projPctVol}% (${cap.vol.toFixed(1)}${cap.deltaVol > 0 ? ` +${cap.deltaVol.toFixed(1)}` : ''} / ${sv.maxVolume} м³)">
              ${isVolOverloaded ? `
                <div class="bg-rose-500 h-2 w-full transition-all duration-300 animate-pulse" title="Переліміт завантаження: ${cap.projPctVol}% (${cap.vol.toFixed(1)} / ${sv.maxVolume} м³)"></div>
              ` : `
                ${actualBarWidth > 0 ? `<div class="bg-emerald-500 h-2 transition-all duration-300" style="width: ${actualBarWidth}%" title="Фактичні куби на складі: ${cap.actualVol.toFixed(1)} м³ (${actualBarWidth}%)"></div>` : ''}
                ${plannedBarWidth > 0 ? `<div class="bg-purple-500 h-2 transition-all duration-300" style="width: ${plannedBarWidth}%" title="Планові куби (обіцянки): ${cap.plannedVol.toFixed(1)} м³ (${plannedBarWidth}%)"></div>` : ''}
                ${deltaBarWidth > 0 ? `<div class="bg-brand-500 h-2 transition-all duration-300 animate-pulse" style="width: ${deltaBarWidth}%" title="Проєкція обраних перевезень: +${cap.deltaVol.toFixed(1)} м³ (+${deltaBarWidth}%)"></div>` : ''}
              `}
            </div>
          </div>

          ${accordionHtml}

        </div>
      `;
    }).join('');
  }

  window.selectActiveSubvoyage = function (svId) {
    if (activeSubvoyageId === svId) {
      activeSubvoyageId = null;
    } else {
      activeSubvoyageId = svId;
      leftTableSubvoyageMode = 'pool';
    }
    shipmentsCurrentPage = 1;
    updateActiveSubvoyageState();
    renderAll();
  };

  window.viewSubvoyageShipments = function (svId, event) {
    window.toggleSubvoyageAccordion(svId, event);
  };

  window.toggleDepartureSort = function () {
    if (sortField === 'dateReady') {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = 'dateReady';
      sortDirection = 'asc';
    }
    shipmentsCurrentPage = 1;
    renderShipmentsTable();
  };

  window.toggleDimensionsSort = function () {
    if (sortField === 'volume') {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = 'volume';
      sortDirection = 'desc';
    }
    shipmentsCurrentPage = 1;
    renderShipmentsTable();
  };

  // Допоміжна функція розбору ланцюжка маршруту для підтримки мультимодальних маршрутів (Кейс 2.4)
  function extractRouteNodes(entity) {
    if (!entity) return [];
    if (Array.isArray(entity.routeStages) && entity.routeStages.length > 0) {
      return entity.routeStages.map(s => String(s).trim().toLowerCase()).filter(Boolean);
    }
    if (typeof entity.transitSegment === 'string' && (entity.transitSegment.includes('➔') || entity.transitSegment.includes('→') || entity.transitSegment.includes('->'))) {
      return entity.transitSegment
        .split(/➔|→|->/)
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
    }
    return [entity.originCountry, entity.destinationCountry]
      .filter(Boolean)
      .map(s => String(s).trim().toLowerCase());
  }

  function isNodeMatchingStage(stageText, targetNode) {
    if (!stageText || !targetNode) return false;
    const st = stageText.toLowerCase();
    const tg = targetNode.toLowerCase();
    return st === tg || st.includes(tg) || tg.includes(st);
  }

  // Кейс 2.4: Логіка рекомендацій перевезень під вибраний підрейс (Матчинг маршрутів)
  // Підбір працює ВИКЛЮЧНО за двома параметрами: 1) тип доставки та 2) місце доставки (маршрут, включаючи мультимодальні плечі)
  function isShipmentCompatibleWithSubvoyage(tr, sv) {
    if (!tr || !sv) return false;

    // Вже розподілені у підрейс перевезення не є вільними кандидатами пулу
    if (tr.subvoyageId !== null) return false;

    // 1. Параметр №1: Тип доставки (Морський / Авіа / Авто / Залізниця)
    if (sv.transport && tr.transport !== sv.transport) return false;

    // 2. Параметр №2: Місце доставки / Маршрут (включаючи обробку складних мультимодальних маршрутів)
    const svOrigin = (sv.originCountry || '').trim().toLowerCase();
    const svDest = (sv.destinationCountry || '').trim().toLowerCase();
    const trNodes = extractRouteNodes(tr);

    // Перевіряємо, чи покриває підрейс (svOrigin -> svDest) плече або частину загального маршруту перевезення
    // Наприклад, підрейс Китай -> Польща має рекомендувати перевезення з маршрутом Китай -> Польща -> Київ/Україна
    let routeMatches = false;
    if (svOrigin && svDest && trNodes.length >= 2) {
      const originIdx = trNodes.findIndex(n => isNodeMatchingStage(n, svOrigin));
      const destIdx = trNodes.findIndex((n, idx) => idx > originIdx && isNodeMatchingStage(n, svDest));
      if (originIdx !== -1 && destIdx !== -1 && destIdx > originIdx) {
        routeMatches = true;
      }
    }

    // Якщо прямий або мультимодальний ланцюжок країн/етапів співпав, також перевіряємо хаб (якщо кінцева країна підрейсу збігається з кінцевою країною перевезення)
    if (!routeMatches) {
      const trDest = (tr.destinationCountry || '').trim().toLowerCase();
      if (svDest && trDest && isNodeMatchingStage(trDest, svDest)) {
        if (!sv.hub || !tr.hub || sv.hub === tr.hub) {
          routeMatches = true;
        }
      }
    } else {
      // Якщо це прямий рейс у країну фінального призначення (напр. Китай -> Україна) і вказані конкретні українські хаби, враховуємо хаб доставки
      const trDest = (tr.destinationCountry || '').trim().toLowerCase();
      const isFinalLegToSameCountry = svDest && trDest && isNodeMatchingStage(trDest, svDest) && trNodes.length <= 2;
      if (isFinalLegToSameCountry && sv.hub && tr.hub && sv.hub !== tr.hub) {
        routeMatches = false;
      }
    }

    return routeMatches;
  }

  function getShipmentWorkPriority(tr, currentSv) {
    // Коли обрано конкретний підрейс і ми в режимі підбору пулу ("Доступні для рейсу")
    if (currentSv && leftTableSubvoyageMode === 'pool') {
      // Перевага тим, де співпадає відповідальний логіст та вже є допуск/віза
      if (tr.logist === currentSv.logist && tr.hasVisa) return 1;
      if (tr.hasVisa) return 2;
      if (tr.logist === currentSv.logist) return 3;
      return 4;
    }

    // Режим огляду (не вибрано підрейс): зверху ті, що ще не завантажені, ті що формуються та ті, з якими логіст зараз працює
    if (!tr.subvoyageId && tr.status === 'Готовий до завантаження') return 1;
    if (!tr.subvoyageId) return 2;
    if (tr.status === 'Формування') return 3;
    if (tr.status === 'Завантажений' || tr.status === 'В дорозі') return 4;
    if (tr.status === 'Прибув на склад отримання') return 5;
    return 6;
  }

  function getFilteredShipments() {
    const currentSv = subVoyagesData.find(s => s.id === activeSubvoyageId);
    const currentSvCap = currentSv ? calculateSubvoyageCapacity(currentSv.id) : null;

    return transportsData.filter(t => {
      // Ліва таблиця ЗАВЖДИ показує нерозподілені перевезення в пулі складу (перевезення в підрейсах відображаються всередині карток підрейсів справа)
      if (t.subvoyageId !== null) return false;

      // Якщо обрано підрейс:
      if (currentSv) {
        // Якщо натиснуто «Скинути рекомендації» — показуємо всі доступні в пулі без примусового фільтру маршруту/транспорту підрейсу
        if (!isRecommendationFilterIgnored) {
          if (!isShipmentCompatibleWithSubvoyage(t, currentSv)) return false;
        }
      }

      // Блок 4.1: Швидкі перемикачі за статусом готовності на складі
      const cat = t.readinessCategory || (t.status === 'Готовий до завантаження' ? 'ready' : 'not_ready');
      if (filters.quickFilter === 'ready' && cat !== 'ready') return false;
      if (filters.quickFilter === 'not_ready' && cat !== 'not_ready') return false;
      if (filters.quickFilter === 'planned' && cat !== 'planned') return false;
      if (filters.quickFilter === 'unmarked' && cat !== 'unmarked') return false;

      // Блок 4.1: Швидкий перемикач за типом доставки (Море / Авіа / Авто)
      if (filters.deliveryMode && filters.deliveryMode !== 'all' && t.transport !== filters.deliveryMode) {
        return false;
      }

      // Блок 4.1: Швидкий перемикач за напрямком маршруту (напр., Китай ➔ Україна)
      if (filters.routeDirection && filters.routeDirection !== 'all') {
        const parts = filters.routeDirection.split('➔').map(s => s.trim().toLowerCase());
        const trOrigin = (t.originCountry || '').trim().toLowerCase();
        const trDest = (t.destinationCountry || '').trim().toLowerCase();
        if (parts.length === 2) {
          const matchesDirect = trOrigin === parts[0] && trDest === parts[1];
          const nodes = extractRouteNodes(t);
          const oIdx = nodes.findIndex(n => isNodeMatchingStage(n, parts[0]));
          const dIdx = nodes.findIndex((n, idx) => idx > oIdx && isNodeMatchingStage(n, parts[1]));
          if (!matchesDirect && !(oIdx !== -1 && dIdx !== -1)) return false;
        }
      }

      // Блок 4.1: Швидкий перемикач Карго / Фрахт
      if (filters.cargoType && filters.cargoType !== 'all' && !isUnmarkedCargo(t)) {
        const cType = t.cargoType || 'Карго';
        if (cType !== filters.cargoType) return false;
      }

      if (filters.hubs.size > 0 && !filters.hubs.has(t.hub)) return false;
      if (filters.transports.size > 0 && !filters.transports.has(t.transport)) return false;
      if (filters.logists.size > 0 && !filters.logists.has(t.logist)) return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        const mId = t.id && t.id.toLowerCase().includes(q);
        const mClient = t.client && t.client.toLowerCase().includes(q);
        const mCustoms = (t.customsTerms && t.customsTerms.toLowerCase().includes(q)) ||
          (t.customsClearance && t.customsClearance.toLowerCase().includes(q));
        const mRecipient = t.lastMile?.recipientName && t.lastMile.recipientName.toLowerCase().includes(q);
        const mCargo = (t.trackNumber && t.trackNumber.toLowerCase().includes(q)) ||
          (t.contentDescription && t.contentDescription.toLowerCase().includes(q));
        if (!mId && !mClient && !mCustoms && !mRecipient && !mCargo) return false;
      }

      return true;
    }).sort((a, b) => {
      // 1. Сортування за габаритами (об'єм, вага, місця)
      if (sortField === 'volume') {
        const volA = Number(a.volume) || 0;
        const volB = Number(b.volume) || 0;
        if (Math.abs(volA - volB) > 0.0001) {
          return sortDirection === 'asc' ? volA - volB : volB - volA;
        }
        const wtA = Number(a.weight) || 0;
        const wtB = Number(b.weight) || 0;
        if (Math.abs(wtA - wtB) > 0.0001) {
          return sortDirection === 'asc' ? wtA - wtB : wtB - wtA;
        }
        const plA = Number(a.places) || 0;
        const plB = Number(b.places) || 0;
        if (plA !== plB) {
          return sortDirection === 'asc' ? plA - plB : plB - plA;
        }
        return (a.id || '').localeCompare(b.id || '');
      }

      // 2. Кейс 2.3: Сортування за замовчуванням — за Датою готовності (dateReady) від старших дат до молодших (asc)
      const emptyFallback = sortDirection === 'desc' ? '0000-00-00' : '9999-12-31';
      const readyA = a.dateReady || a.cargoReadyDate || emptyFallback;
      const readyB = b.dateReady || b.cargoReadyDate || emptyFallback;
      const cmp = readyA.localeCompare(readyB);
      if (cmp !== 0) {
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      return (a.id || '').localeCompare(b.id || '');
    });
  }

  function evaluateShipmentFitForSubvoyage(tr, sv, cap) {
    if (!tr || !sv || !cap || tr.subvoyageId === sv.id) return null;

    const isSelected = selectedUnassignedIds.has(tr.id);
    const trVol = Number(tr.volume) || 0;
    const trWeight = Number(tr.weight) || 0;
    const trPlaces = Number(tr.places) || 0;

    // Якщо перевезення вже відмічено чекбоксом, його об'єм/вага/місця вже враховані в cap.totalVol.
    // Для невідміченого перевезення перевіряємо, чи влізе воно поверх уже доданих + відмічених чекбоксами.
    const usedVolBefore = isSelected ? Math.max(cap.vol, cap.totalVol - trVol) : cap.totalVol;
    const usedWeightBefore = isSelected ? Math.max(cap.weight, cap.totalWeight - trWeight) : cap.totalWeight;
    const usedPlacesBefore = isSelected ? Math.max(cap.places, cap.totalPlaces - trPlaces) : cap.totalPlaces;

    const remVol = Math.max(0, sv.maxVolume - usedVolBefore);
    const remWeight = Math.max(0, sv.maxWeight - usedWeightBefore);
    const remPlaces = Math.max(0, sv.maxPlaces - usedPlacesBefore);

    const diffVol = (usedVolBefore + trVol) - sv.maxVolume;
    const diffWeight = (usedWeightBefore + trWeight) - sv.maxWeight;
    const diffPlaces = (usedPlacesBefore + trPlaces) - sv.maxPlaces;

    const overVol = diffVol > 0.001;
    const overWeight = diffWeight > 0.001;
    const overPlaces = diffPlaces > 0;

    const fits = !overVol && !overWeight && !overPlaces;

    const afterVolRem = Math.max(0, sv.maxVolume - (usedVolBefore + trVol));
    const afterWeightRem = Math.max(0, sv.maxWeight - (usedWeightBefore + trWeight));
    const afterPlacesRem = Math.max(0, sv.maxPlaces - (usedPlacesBefore + trPlaces));

    if (fits) {
      const isTight = (afterVolRem / sv.maxVolume < 0.1) || (afterWeightRem / sv.maxWeight < 0.1) || (afterPlacesRem / sv.maxPlaces < 0.1);
      return {
        fits: true,
        isTight,
        remVol,
        remWeight,
        remPlaces,
        afterVolRem,
        afterWeightRem,
        afterPlacesRem,
        diffVol: 0,
        diffWeight: 0,
        diffPlaces: 0,
        badgeHtml: `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${isTight ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}" title="Влазить у вільний залишок ${sv.id}. Залишиться після додавання: ${afterVolRem.toFixed(1)} м³ | ${afterWeightRem.toFixed(1)} т | ${afterPlacesRem} місць">
          <i class="fa-solid fa-check text-[8px]"></i> Влазить (зал: ${remVol.toFixed(1)} м³ · ${remWeight.toFixed(1)} т)
        </span>`,
        tooltip: `Влазить у залишок місця ${sv.id} (вільно: ${remVol.toFixed(1)} м³ / ${remWeight.toFixed(1)} т / ${remPlaces} місць)`
      };
    }

    const overParts = [];
    if (overVol) overParts.push(`+${diffVol.toFixed(1)} м³`);
    if (overWeight) overParts.push(`+${diffWeight.toFixed(1)} т`);
    if (overPlaces) overParts.push(`+${diffPlaces} шт`);

    return {
      fits: false,
      isTight: false,
      remVol,
      remWeight,
      remPlaces,
      diffVol,
      diffWeight,
      diffPlaces,
      afterVolRem,
      afterWeightRem,
      afterPlacesRem,
      overText: overParts.join(', '),
      badgeHtml: `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-300" title="Перевищує вільний залишок підрейсу ${sv.id}! Доступно: ${remVol.toFixed(1)} м³ | ${remWeight.toFixed(1)} т | ${remPlaces} місць">
        <i class="fa-solid fa-triangle-exclamation text-[8px]"></i> Не влазить (${overParts.join(', ')})
      </span>`,
      tooltip: `УВАГА: Перевищує залишок місця у ${sv.id} (${overParts.join(', ')}). Вільно лише: ${remVol.toFixed(1)} м³ / ${remWeight.toFixed(1)} т / ${remPlaces} місць`
    };
  }

  function renderShipmentsPagination(totalItems, totalPages, startIndex, endIndex) {
    if (shipmentsPaginationInfo) {
      if (totalItems === 0) {
        shipmentsPaginationInfo.textContent = 'Показано 0 з 0';
      } else {
        shipmentsPaginationInfo.textContent = `Показано ${startIndex + 1}–${endIndex} з ${totalItems}`;
      }
    }

    if (!shipmentsPaginationControls) return;

    if (totalPages <= 1) {
      shipmentsPaginationControls.innerHTML = '';
      return;
    }

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= shipmentsCurrentPage - 1 && i <= shipmentsCurrentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    const prevDisabled = shipmentsCurrentPage <= 1;
    const nextDisabled = shipmentsCurrentPage >= totalPages;

    shipmentsPaginationControls.innerHTML = `
      <button type="button" data-page="${shipmentsCurrentPage - 1}" ${prevDisabled ? 'disabled' : ''}
        class="px-2 py-0.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold text-[11px] transition cursor-pointer">
        <i class="fa-solid fa-chevron-left text-[9px]"></i> Назад
      </button>
      ${pages.map(p => p === '...'
      ? `<span class="px-1.5 text-slate-400 font-mono text-[10px]">...</span>`
      : `<button type="button" data-page="${p}"
             class="min-w-[24px] px-1.5 py-0.5 rounded-lg border text-[11px] font-bold transition cursor-pointer ${p === shipmentsCurrentPage
        ? 'bg-brand-600 text-white border-brand-600 shadow-2xs'
        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'}">
             ${p}
           </button>`
    ).join('')}
      <button type="button" data-page="${shipmentsCurrentPage + 1}" ${nextDisabled ? 'disabled' : ''}
        class="px-2 py-0.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold text-[11px] transition cursor-pointer">
        Вперед <i class="fa-solid fa-chevron-right text-[9px]"></i>
      </button>
    `;

    shipmentsPaginationControls.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPage = Number(btn.getAttribute('data-page'));
        if (!targetPage || targetPage < 1 || targetPage > totalPages || targetPage === shipmentsCurrentPage) return;
        shipmentsCurrentPage = targetPage;
        renderShipmentsTable();
      });
    });
  }

  // ================================================================
  // НЕПРОМАРКОВАНІ ВАНТАЖІ (entityType: 'cargo')
  // Непромаркованими можуть бути тільки вантажі, не перевезення.
  // Життєвий цикл: Вантаж (unmarked) ➔ [+ у підрейс] ➔ менеджер прораховує обіцянку ➔ Обіцянка (planned)
  // ================================================================
  function isUnmarkedCargo(tr) {
    return Boolean(tr && tr.entityType === 'cargo');
  }

  function formatCargoDimensions(c) {
    const l = Number(c.length) || 0;
    const w = Number(c.width) || 0;
    const h = Number(c.height) || 0;
    return (l && w && h) ? `${l}×${w}×${h} см` : '—';
  }

  // Маркери вантажу — лише з каталогу маркерів (без маркера способу перевезення, бо вантаж ще не має перевезення)
  function renderCargoMarkerBadges(c) {
    const markers = getAllShipmentMarkers(c).filter(m => m.key !== 'transport_mode');
    if (markers.length === 0) return '<span class="text-[11px] text-slate-300 italic">—</span>';
    return `<div class="flex flex-wrap items-center gap-1">${markers.map(m => {
      const isFaIcon = typeof m.icon === 'string' && m.icon.startsWith('fa-');
      return `<span class="${m.cls} border px-1.5 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 whitespace-nowrap leading-none" title="${m.fullLabel}">
        ${isFaIcon ? `<i class="${m.icon} text-[9px]"></i>` : `<span class="text-[10px]">${m.icon}</span>`}<span>${m.shortLabel}</span></span>`;
    }).join('')}</div>`;
  }

  function renderShipmentsDimensionsHeader(currentSv) {
    const isDimSort = sortField === 'volume';
    const dimSortIcon = isDimSort
      ? (sortDirection === 'asc' ? 'fa-sort-up text-brand-600' : 'fa-sort-down text-brand-600')
      : 'fa-sort text-slate-300 group-hover:text-slate-400';

    const colTitle = `Габарити ${currentSv ? '& Залишок' : '(м³ / т / шт)'}`;

    return `
      <th class="p-2 cursor-pointer hover:text-brand-700 transition select-none group" onclick="toggleDimensionsSort()" title="Сортування за габаритами (об'єм, вага)">
        <span>${colTitle}</span> <i class="fa-solid ${dimSortIcon} ml-0.5"></i>
      </th>
    `;
  }

  function renderUnmarkedCargoTable(list, currentSv, currentSvCap) {
    const totalItems = list.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / shipmentsItemsPerPage));
    if (shipmentsCurrentPage > totalPages) shipmentsCurrentPage = totalPages;
    if (shipmentsCurrentPage < 1) shipmentsCurrentPage = 1;
    const startIndex = (shipmentsCurrentPage - 1) * shipmentsItemsPerPage;
    const endIndex = Math.min(startIndex + shipmentsItemsPerPage, totalItems);
    const pageList = list.slice(startIndex, endIndex);

    const sumVol = list.reduce((s, c) => s + (Number(c.volume) || 0), 0);
    const sumWeight = list.reduce((s, c) => s + (Number(c.weight) || 0), 0);
    const sumPlaces = list.reduce((s, c) => s + (Number(c.places) || 0), 0);
    if (shipmentsListCount) shipmentsListCount.textContent = '';
    renderShipmentsPagination(totalItems, totalPages, startIndex, endIndex);

    if (tableMasterTitle) {
      tableMasterTitle.textContent = 'Вантажі';
    }
    const cargoFocusPill = document.getElementById('active-sv-focus-pill');
    if (cargoFocusPill) {
      if (currentSv) {
        cargoFocusPill.textContent = `для ${currentSv.id}`;
        cargoFocusPill.classList.remove('hidden');
      } else {
        cargoFocusPill.classList.add('hidden');
      }
    }

    const isDateSort = sortField === 'dateReady';
    const dateSortIcon = isDateSort
      ? (sortDirection === 'asc' ? 'fa-sort-up text-brand-600' : 'fa-sort-down text-brand-600')
      : 'fa-sort text-slate-300 group-hover:text-slate-400';

    const allOnPageSelected = pageList.length > 0 && pageList.every(c => selectedUnassignedIds.has(c.id));
    shipmentsTableHeader.innerHTML = `
      <th class="p-2">
        <div class="flex items-center gap-2">
          <input type="checkbox" id="select-all-master-shipments" ${allOnPageSelected ? 'checked' : ''} class="rounded text-brand-600 cursor-pointer" title="Вибрати всі на сторінці">
          <span>Номер</span>
        </div>
      </th>
      <th class="p-2 cursor-pointer hover:text-brand-700 transition select-none group" onclick="toggleDepartureSort()" title="Сортування за Датою надходження">
        <span>Дата надходження</span> <i class="fa-solid ${dateSortIcon} ml-0.5"></i>
      </th>
      ${renderShipmentsDimensionsHeader(currentSv)}
      <th class="p-2">Маркери</th>
      <th class="p-2 text-center">Підрейс</th>
      <th class="p-2 text-right">Інформація</th>
    `;

    if (totalItems === 0) {
      tbodyUnassignedShipments.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-400 italic">Немає непромаркованих вантажів за обраними фільтрами</td></tr>`;
      return;
    }

    tbodyUnassignedShipments.innerHTML = pageList.map(c => {
      const isSelected = selectedUnassignedIds.has(c.id);
      const fitInfo = (currentSv && currentSvCap) ? evaluateShipmentFitForSubvoyage(c, currentSv, currentSvCap) : null;
      const assignHtml = currentSv
        ? `<button onclick="assignShipmentToSubvoyage('${c.id}', '${currentSv.id}')"
                   class="px-2.5 py-1 ${fitInfo && !fitInfo.fits ? 'bg-rose-600 hover:bg-rose-700' : 'bg-brand-600 hover:bg-brand-700'} text-white rounded-lg text-[10px] font-bold shadow-2xs transition cursor-pointer"
                   title="Додати вантаж у підрейс ${currentSv.id}">+ У ${currentSv.id}</button>`
        : `<span class="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-semibold">На складі</span>`;

      return `
        <tr class="hover:bg-slate-50 transition cursor-pointer ${isSelected ? 'bg-brand-50/50' : ''}" onclick="handleShipmentRowClick('${c.id}', event)">
          <td class="p-2">
            <div class="flex items-center gap-2 min-w-0">
              <input type="checkbox" value="${c.id}" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation()" class="cb-unassigned-shipment rounded text-brand-600 cursor-pointer shrink-0">
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="px-1 py-0.2 rounded text-[9px] font-bold bg-slate-800 text-white">📦 Вантаж</span>
                  <span class="font-mono font-bold text-brand-700 text-xs">${c.cargoNumber || c.id}</span>
                </div>
                <div class="text-[10px] text-slate-500 font-mono">Трек: ${c.trackNumber || '—'}</div>
              </div>
            </div>
          </td>
          <td class="p-2 font-mono text-[11px] font-bold text-slate-700 whitespace-nowrap">
            <i class="fa-regular fa-calendar text-slate-400 mr-1"></i>${c.receiveDate || c.dateReady || '—'}
          </td>
          <td class="p-2 font-mono text-[11px] text-slate-700 whitespace-nowrap">
            <div><strong>${c.volume}</strong> м³ <span class="text-slate-300">|</span> <strong>${c.weight}</strong> т <span class="text-slate-300">|</span> <span class="text-slate-500">${c.places} шт</span></div>
            ${fitInfo ? `<div class="mt-0.5 font-sans">${fitInfo.badgeHtml}</div>` : ''}
          </td>
          <td class="p-2">${renderCargoMarkerBadges(c)}</td>
          <td class="p-2 text-center whitespace-nowrap" onclick="event.stopPropagation()">${assignHtml}</td>
          <td class="p-2 text-right whitespace-nowrap" onclick="event.stopPropagation()">
            <button onclick="openCargoInfoModal('${c.id}')" class="px-2 py-1 text-slate-600 hover:text-brand-700 rounded-lg border border-slate-200 hover:bg-slate-100 text-[10px] font-semibold inline-flex items-center gap-1 cursor-pointer" title="Інформація про вантаж">
              <i class="fa-solid fa-circle-info text-brand-600"></i><span>Інфо</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbodyUnassignedShipments.querySelectorAll('.cb-unassigned-shipment').forEach(cb => {
      cb.addEventListener('change', (e) => {
        if (e.target.checked) selectedUnassignedIds.add(e.target.value);
        else selectedUnassignedIds.delete(e.target.value);
        renderShipmentsTable();
        updateBulkCounter();
        renderSubvoyagesTimeline();
        renderSubvoyageAssignedTable();
      });
    });
    const master = document.getElementById('select-all-master-shipments');
    if (master) {
      master.addEventListener('change', (e) => {
        pageList.forEach(c => e.target.checked ? selectedUnassignedIds.add(c.id) : selectedUnassignedIds.delete(c.id));
        renderShipmentsTable();
        updateBulkCounter();
        renderSubvoyagesTimeline();
        renderSubvoyageAssignedTable();
      });
    }
  }

  function ensureCargoModalHost() {
    let host = document.getElementById('modal-unmarked-cargo');
    if (!host) {
      host = document.createElement('div');
      host.id = 'modal-unmarked-cargo';
      host.className = 'fixed inset-0 z-[9999] hidden items-center justify-center bg-slate-900/50 p-4';
      host.addEventListener('click', (e) => { if (e.target === host) closeCargoModal(); });
      document.body.appendChild(host);
    }
    return host;
  }

  function closeCargoModal() {
    const host = document.getElementById('modal-unmarked-cargo');
    if (host) { host.classList.add('hidden'); host.classList.remove('flex'); host.innerHTML = ''; }
  }
  window.closeCargoModal = closeCargoModal;

  function showCargoModal(html) {
    const host = ensureCargoModalHost();
    host.innerHTML = `<div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">${html}</div>`;
    host.classList.remove('hidden');
    host.classList.add('flex');
  }

  // Картка ВАНТАЖУ (не перевезення): номер, трек, габарити, пакування, склад, маркери
  function openCargoInfoModal(cargoId) {
    const c = transportsData.find(t => t.id === cargoId);
    if (!c) return;
    const sv = c.subvoyageId ? subVoyagesData.find(s => s.id === c.subvoyageId) : null;
    const row = (label, value) => `
      <div class="p-2 bg-slate-50 rounded-lg border border-slate-200">
        <div class="text-[10px] uppercase text-slate-500 font-bold">${label}</div>
        <div class="text-xs text-slate-900 font-semibold">${value ?? '—'}</div>
      </div>`;

    showCargoModal(`
      <div class="p-4 border-b border-slate-200 flex items-start justify-between gap-3">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-white">📦 Вантаж</span>
            <span class="font-mono font-extrabold text-brand-700">${c.cargoNumber || c.id}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">Отримано непромаркованим</span>
          </div>
          <div class="text-[11px] text-slate-500 mt-1">Вантаж без маркування DF. Не є перевезенням — після прорахунку менеджером конвертується в обіцянку.</div>
        </div>
        <button onclick="closeCargoModal()" class="text-slate-400 hover:text-slate-700 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-4 space-y-3">
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          ${row('Номер вантажу', `<span class="font-mono">${c.cargoNumber || c.id}</span>`)}
          ${row('Трек-номер', `<span class="font-mono">${c.trackNumber || '—'}</span>`)}
          ${row('Дата отримання', c.receiveDate || c.dateReady)}
          ${row('Склад', c.hub)}
          ${row('Локація на складі', c.warehouseLocation)}
          ${row('Підрейс', sv ? `${sv.name} (${sv.id})` : 'Не призначено')}
        </div>
        <div class="text-[11px] font-bold text-slate-700 uppercase">Фізичні показники</div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          ${row('Габарити місця (Д×Ш×В)', formatCargoDimensions(c))}
          ${row('Тип пакування', c.packagingType)}
          ${row('Кількість місць', `${c.places} шт`)}
          ${row('Вага брутто', `${c.weight} т`)}
          ${row("Об'єм", `${c.volume} м³`)}
          ${row('Негабарит', c.isOversized ? 'Так' : 'Ні')}
        </div>
        ${row('Опис вмісту', c.contentDescription)}
        <div>
          <div class="text-[11px] font-bold text-slate-700 uppercase mb-1">Маркери вантажу</div>
          ${renderCargoMarkerBadges(c)}
        </div>
      </div>
      <div class="p-4 border-t border-slate-200 flex justify-end gap-2">
        <button onclick="closeCargoModal()" class="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold cursor-pointer hover:bg-slate-50">Закрити</button>
      </div>
    `);
  }
  window.openCargoInfoModal = openCargoInfoModal;

  // Форма конвертації: менеджер вказує клієнта та номер прорахованої обіцянки
  window.openConvertCargoToPromise = function (cargoId, event) {
    if (event) event.stopPropagation();
    const c = transportsData.find(t => t.id === cargoId);
    if (!c || !isUnmarkedCargo(c)) return;
    const suggested = `PRM-${(c.cargoNumber || c.id).replace(/\D/g, '') || Date.now().toString().slice(-4)}`;

    showCargoModal(`
      <div class="p-4 border-b border-slate-200 flex items-center justify-between">
        <div class="font-bold text-sm text-slate-900">Конвертація вантажу <span class="font-mono text-brand-700">${c.cargoNumber || c.id}</span> в обіцянку</div>
        <button onclick="closeCargoModal()" class="text-slate-400 hover:text-slate-700 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-4 space-y-3 text-xs">
        <div class="p-2 rounded-lg bg-violet-50 border border-violet-200 text-violet-900">
          Менеджер створив і прорахував обіцянку та поклав у неї цей вантаж. Після конвертації позиція стане <strong>Обіцянкою</strong> (Планові куби)${c.subvoyageId ? ` і залишиться в підрейсі <strong>${c.subvoyageId}</strong>` : ''}.
        </div>
        <label class="block">
          <span class="font-bold text-slate-700">Номер обіцянки (DF)</span>
          <input id="cargo-promise-number" value="${suggested}" class="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5 font-mono">
        </label>
        <label class="block">
          <span class="font-bold text-slate-700">Клієнт</span>
          <input id="cargo-promise-client" placeholder="Назва клієнта" class="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5">
        </label>
        <label class="block">
          <span class="font-bold text-slate-700">Менеджер</span>
          <input id="cargo-promise-manager" placeholder="ПІБ менеджера" class="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5">
        </label>
      </div>
      <div class="p-4 border-t border-slate-200 flex justify-end gap-2">
        <button onclick="closeCargoModal()" class="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-xs cursor-pointer hover:bg-slate-50">Скасувати</button>
        <button id="cargo-promise-confirm" class="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs cursor-pointer">Конвертувати</button>
      </div>
    `);

    document.getElementById('cargo-promise-confirm').onclick = () => {
      const promiseNumber = document.getElementById('cargo-promise-number').value.trim();
      const client = document.getElementById('cargo-promise-client').value.trim();
      const manager = document.getElementById('cargo-promise-manager').value.trim();
      if (!promiseNumber || !client) {
        showToast('Вкажіть номер обіцянки та клієнта', true);
        return;
      }
      convertCargoToPromise(c, { promiseNumber, client, manager });
      closeCargoModal();
      syncSubvoyageAndShipmentsStatuses();
      renderAll();
      showToast(`Вантаж ${c.cargoNumber} конвертовано в обіцянку ${promiseNumber}`);
    };
  };

  function convertCargoToPromise(c, { promiseNumber, client, manager } = {}) {
    const number = promiseNumber || `PRM-${(c.cargoNumber || c.id).replace(/\D/g, '')}`;
    c.entityType = 'promise';
    c.readinessCategory = 'planned';
    c.status = 'Плановий (обіцянка)';
    c.dfPromise = number;
    c.dfShipment = number;
    c.client = client || c.client;
    if (manager) c.manager = manager;
    c.sourceCargoNumber = c.cargoNumber; // зв'язок з вихідним вантажем
    c.cargoType = c.cargoType || 'Карго';
    c.customsClearance = 'Брокер компанії';
    c.cargoes = [{
      cargoId: c.cargoNumber,
      titleUa: c.contentDescription || 'Вантаж',
      places: c.places,
      grossWeight: c.weight,
      volume: c.volume,
      packageType: c.packagingType,
      status: 'На складі'
    }];
  }

  function renderShipmentsTable() {
    if (!tbodyUnassignedShipments || !shipmentsTableHeader) return;
    const currentSv = subVoyagesData.find(s => s.id === activeSubvoyageId);
    const currentSvCap = currentSv ? calculateSubvoyageCapacity(currentSv.id) : null;
    const list = getFilteredShipments();

    // Вкладка «Непромарковані» показує ВАНТАЖІ (не перевезення) — окрема таблиця з даними вантажу
    if (filters.quickFilter === 'unmarked') {
      renderUnmarkedCargoTable(list, currentSv, currentSvCap);
      return;
    }

    const totalItems = list.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / shipmentsItemsPerPage));
    if (shipmentsCurrentPage > totalPages) shipmentsCurrentPage = totalPages;
    if (shipmentsCurrentPage < 1) shipmentsCurrentPage = 1;

    const startIndex = (shipmentsCurrentPage - 1) * shipmentsItemsPerPage;
    const endIndex = Math.min(startIndex + shipmentsItemsPerPage, totalItems);
    const paginatedList = list.slice(startIndex, endIndex);

    // Оновлення лічильника сумарної ваги, об'єму та місць у контекстному банері (#unassigned-stats-summary)
    const listTotalVol = list.reduce((sum, t) => sum + (Number(t.volume) || 0), 0);
    const listTotalWeight = list.reduce((sum, t) => sum + (Number(t.weight) || 0), 0);
    const listTotalPlaces = list.reduce((sum, t) => sum + (Number(t.places) || 0), 0);

    if (shipmentsListCount) shipmentsListCount.textContent = '';
    renderShipmentsPagination(totalItems, totalPages, startIndex, endIndex);

    if (tableMasterTitle) {
      tableMasterTitle.textContent = 'Перевезення';
    }
    const shipFocusPill = document.getElementById('active-sv-focus-pill');
    if (shipFocusPill) {
      if (currentSv) {
        shipFocusPill.textContent = `для ${currentSv.id}`;
        shipFocusPill.classList.remove('hidden');
      } else {
        shipFocusPill.classList.add('hidden');
      }
    }

    const isDateSort = sortField === 'dateReady';
    const dateSortIcon = isDateSort
      ? (sortDirection === 'asc' ? 'fa-sort-up text-brand-600' : 'fa-sort-down text-brand-600')
      : 'fa-sort text-slate-300 group-hover:text-slate-400';

    const allOnPageSelected = paginatedList.length > 0 && paginatedList.every(t => selectedUnassignedIds.has(t.id));

    // Блок 4.2: Строго 6 обов'язкових колонок лівої таблиці перевезень
    shipmentsTableHeader.innerHTML = `
      <th class="p-2">
        <div class="flex items-center gap-2">
          <input type="checkbox" id="select-all-master-shipments" ${allOnPageSelected ? 'checked' : ''} class="rounded text-brand-600 cursor-pointer" title="Вибрати всі на сторінці">
          <span>DF номер</span>
        </div>
      </th>
      <th class="p-2 cursor-pointer hover:text-brand-700 transition select-none group" onclick="toggleDepartureSort()" title="Сортування за Датою готовності">
        <span>Дата готовності</span> <i class="fa-solid ${dateSortIcon} ml-0.5"></i>
      </th>
      ${renderShipmentsDimensionsHeader(currentSv)}
      <th class="p-2">Маркери</th>
      <th class="p-2 text-center">Підрейс (пул)</th>
      <th class="p-2 text-right">Інформація</th>
    `;

    if (list.length === 0) {
      const emptyMsg = currentSv && !isRecommendationFilterIgnored
        ? `Немає рекомендованих перевезень категорії «${activeReadinessTitle}» за типом доставки (${currentSv.transport}) та маршрутом (${currentSv.originCountry} ➔ ${currentSv.destinationCountry}). Натисніть «Скинути рекомендації» зверху або перемкніть вкладку готовності.`
        : `Немає перевезень у категорії «${activeReadinessTitle}» за обраними фільтрами`;
      tbodyUnassignedShipments.innerHTML = `
        <tr>
          <td colspan="6" class="p-8 text-center text-slate-400 italic">
            ${emptyMsg}
          </td>
        </tr>
      `;
      return;
    }

    tbodyUnassignedShipments.innerHTML = paginatedList.map(tr => {
      const isSelected = selectedUnassignedIds.has(tr.id);
      const propBadges = renderShipmentPropertyBadges(tr);
      const readyDateStr = tr.dateReady || tr.cargoReadyDate || '—';

      const isRecommendedForActiveSv = Boolean(currentSv && isShipmentCompatibleWithSubvoyage(tr, currentSv));
      const isExceptionCandidate = Boolean(currentSv && isRecommendationFilterIgnored && !isRecommendedForActiveSv);
      const fitInfo = (currentSv && currentSvCap)
        ? evaluateShipmentFitForSubvoyage(tr, currentSv, currentSvCap)
        : null;

      let poolOrAssignHtml = '';
      if (currentSv) {
        const btnStyleClass = fitInfo && !fitInfo.fits
          ? 'bg-rose-600 hover:bg-rose-700 text-white ring-1 ring-rose-300'
          : isExceptionCandidate
            ? 'bg-amber-600 hover:bg-amber-700 text-white'
            : 'bg-brand-600 hover:bg-brand-700 text-white';

        const btnTitle = fitInfo
          ? fitInfo.tooltip
          : (isExceptionCandidate ? 'Додати перевезення як виняток у поточний підрейс' : 'Додати рекомендоване перевезення у підрейс');

        poolOrAssignHtml = `
          <button onclick="assignShipmentToSubvoyage('${tr.id}', '${currentSv.id}')"
                  class="px-2.5 py-1 ${btnStyleClass} rounded-lg text-[10px] font-bold shadow-2xs transition inline-flex items-center gap-1 cursor-pointer"
                  title="${btnTitle}">
            ${fitInfo && !fitInfo.fits ? '<i class="fa-solid fa-triangle-exclamation text-[9px]"></i>' : ''}
            <span>+ У ${currentSv.id}</span>
          </button>
        `;
      } else {
        poolOrAssignHtml = `<span class="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-semibold">В пулі</span>`;
      }

      const cat = tr.readinessCategory || 'ready';
      const catMiniTag = cat === 'planned'
        ? `<span class="text-[9px] bg-violet-100 text-violet-800 border border-violet-200 px-1.5 py-0.2 rounded font-bold" title="Плановий об'єм (Обіцянка)">🔮 План (Обіцянка)</span>`
        : cat === 'not_ready'
          ? `<span class="text-[9px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-bold">⏳ Не готовий</span>`
          : cat === 'unmarked'
            ? `<span class="text-[9px] bg-rose-100 text-rose-800 border border-rose-200 px-1.5 py-0.2 rounded font-bold">🏷️ Непромаркований</span>`
            : '';

      return `
        <tr class="hover:bg-slate-50 transition cursor-pointer ${isSelected ? 'bg-brand-50/50' : (fitInfo && !fitInfo.fits) ? 'bg-rose-50/30' : isRecommendedForActiveSv ? 'bg-emerald-50/30' : isExceptionCandidate ? 'bg-amber-50/20' : ''}" onclick="handleShipmentRowClick('${tr.id}', event)">
          <!-- 1. Номер -->
          <td class="p-2">
            <div class="flex items-center gap-2 min-w-0">
              <input type="checkbox" value="${tr.id}" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation()" class="cb-unassigned-shipment rounded text-brand-600 cursor-pointer shrink-0">
              <div class="flex items-center gap-1.5 flex-wrap min-w-0">
                <span class="font-mono font-bold text-brand-700 text-xs">${tr.dfShipment || tr.id}</span>
                ${catMiniTag}
              </div>
            </div>
          </td>
          <!-- 2. Дата готовності -->
          <td class="p-2 font-mono text-[11px] font-bold text-slate-700 whitespace-nowrap">
            <i class="fa-regular fa-calendar text-slate-400 mr-1"></i>${readyDateStr}
          </td>
          <!-- 3. Габарити -->
          <td class="p-2 font-mono text-[11px] text-slate-700 whitespace-nowrap">
            <div><strong>${tr.volume}</strong> м³ <span class="text-slate-300">|</span> <strong>${tr.weight}</strong> т <span class="text-slate-300">|</span> <span class="text-slate-500">${tr.places} шт</span></div>
            ${fitInfo ? `<div class="mt-0.5 font-sans">${fitInfo.badgeHtml}</div>` : ''}
          </td>
          <!-- 4. Маркери (з компактним згортанням +N та повною підказкою при наведенні) -->
          <td class="p-2">
            ${propBadges}
          </td>
          <!-- 5. Підрейс (пулі) -->
          <td class="p-2 text-center whitespace-nowrap" onclick="event.stopPropagation()">
            ${poolOrAssignHtml}
          </td>
          <!-- 6. Інформація -->
          <td class="p-2 text-right whitespace-nowrap" onclick="event.stopPropagation()">
            <button onclick="openContextDrawer('${tr.id}')" class="px-2 py-1 text-slate-600 hover:text-brand-700 rounded-lg border border-slate-200 hover:bg-slate-100 text-[10px] font-semibold inline-flex items-center gap-1 cursor-pointer" title="Уся детальна інформація про перевезення (Маршрут, Статус, Логіст, Спосіб перевезення, Ерайви)">
              <i class="fa-solid fa-circle-info text-brand-600"></i>
              <span>Інфо</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbodyUnassignedShipments.querySelectorAll('.cb-unassigned-shipment').forEach(cb => {
      cb.addEventListener('change', (e) => {
        if (e.target.checked) selectedUnassignedIds.add(e.target.value);
        else selectedUnassignedIds.delete(e.target.value);
        renderShipmentsTable();
        updateBulkCounter();
        renderSubvoyagesTimeline();
        renderSubvoyageAssignedTable();
      });
    });

    const masterCheckbox = document.getElementById('select-all-master-shipments');
    if (masterCheckbox) {
      masterCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) paginatedList.forEach(t => selectedUnassignedIds.add(t.id));
        else paginatedList.forEach(t => selectedUnassignedIds.delete(t.id));
        renderShipmentsTable();
        updateBulkCounter();
        renderSubvoyagesTimeline();
        renderSubvoyageAssignedTable();
      });
    }
  }

  function updateBulkCounter() {
    let selVol = 0;
    let selWeight = 0;
    let selPlaces = 0;
    selectedUnassignedIds.forEach(id => {
      const tr = transportsData.find(t => t.id === id);
      if (tr) {
        selVol += (Number(tr.volume) || 0);
        selWeight += (Number(tr.weight) || 0);
        selPlaces += (Number(tr.places) || 0);
      }
    });

    if (bulkSelectedCounter) {
      if (selectedUnassignedIds.size > 0) {
        bulkSelectedCounter.innerHTML = `Обрано: <strong class="text-brand-700">${selectedUnassignedIds.size}</strong> перевезень (<strong class="text-slate-700">${selVol.toFixed(1)} м³</strong> | <strong class="text-slate-700">${selWeight.toFixed(1)} т</strong> | ${selPlaces} шт)`;
      } else {
        bulkSelectedCounter.textContent = `Обрано: 0 перевезень`;
      }
    }

    const currentSv = subVoyagesData.find(s => s.id === activeSubvoyageId);
    if (btnBulkAssignLabel) {
      if (currentSv) {
        btnBulkAssignLabel.textContent = selectedUnassignedIds.size > 0
          ? `Додати обрані (${selectedUnassignedIds.size}) в ${currentSv.id}`
          : `Додати обрані в ${currentSv.id}`;
      } else {
        btnBulkAssignLabel.textContent = 'Оберіть підрейс справа для додавання';
      }
    }

    if (btnBulkAssignToActive) {
      btnBulkAssignToActive.disabled = selectedUnassignedIds.size === 0 || !currentSv;
    }
  }

  // Відображення повної інформації про перевезення у вибраному підрейсі (без обіцянок, з митними умовами)
  function renderSubvoyageAssignedTable() {
    const currentSv = subVoyagesData.find(s => s.id === activeSubvoyageId);
    if (!currentSv) return;

    if (activeSubvoyageHeaderTitle) activeSubvoyageHeaderTitle.textContent = `${currentSv.name} (${currentSv.id})`;
    if (currentSubvoyageStatusSelect) currentSubvoyageStatusSelect.value = currentSv.status;
    if (currentSubvoyageCommentInput && document.activeElement !== currentSubvoyageCommentInput) {
      currentSubvoyageCommentInput.value = currentSv.comment || '';
    }

    const assigned = transportsData
      .filter(t => t.subvoyageId === activeSubvoyageId)
      .sort((a, b) => (a.dateReady || '9999-12-31').localeCompare(b.dateReady || '9999-12-31'));

    const cap = calculateSubvoyageCapacity(activeSubvoyageId);
    const themeVol = getCapacityColorTheme(cap.projPctVol);
    const themeWeight = getCapacityColorTheme(cap.projPctWeight);
    const themePlaces = getCapacityColorTheme(cap.projPctPlaces);

    if (currentSubvoyageSpecialAttributesSummary) {
      currentSubvoyageSpecialAttributesSummary.innerHTML = renderSubvoyageSpecialAttributesBadges(activeSubvoyageId);
    }

    if (currentSubvoyageCapacityPillsContainer) {
      const deltaVolBadge = cap.deltaVol > 0 ? `<span class="bg-brand-100 text-brand-900 border border-brand-300 px-2 py-0.5 rounded-full font-bold text-[10px]">+${cap.deltaVol.toFixed(1)} м³</span>` : '';
      const deltaWeightBadge = cap.deltaWeight > 0 ? `<span class="bg-brand-100 text-brand-900 border border-brand-300 px-2 py-0.5 rounded-full font-bold text-[10px]">+${cap.deltaWeight.toFixed(1)} т</span>` : '';
      const deltaPlacesBadge = cap.deltaPlaces > 0 ? `<span class="bg-brand-100 text-brand-900 border border-brand-300 px-2 py-0.5 rounded-full font-bold text-[10px]">+${cap.deltaPlaces} місць</span>` : '';

      currentSubvoyageCapacityPillsContainer.innerHTML = `
        ${deltaVolBadge}
        ${deltaWeightBadge}
        ${deltaPlacesBadge}
        <span class="px-2.5 py-0.5 rounded-full font-bold border text-xs ${themeVol.badge}">
          ${cap.projPctVol}% ${cap.isOverloaded ? '⚠️ ПЕРЕЛІМІТ' : ''}
        </span>
      `;
    }

    // Оновлюємо закріплений блок заповнення рейсу (Capacity Details Block)
    const svSummaryBadge = document.getElementById('active-sv-capacity-summary-badge');
    if (svSummaryBadge) {
      svSummaryBadge.textContent = `${cap.projPctVol}% ${cap.isOverloaded ? '⚠️ ПЕРЕЛІМІТ' : ''}`;
      svSummaryBadge.className = `font-mono text-[10px] px-2 py-0.2 rounded-full font-extrabold border ${themeVol.badge}`;
    }
    const svCargoCountEl = document.getElementById('active-sv-cargo-count');
    if (svCargoCountEl) svCargoCountEl.textContent = assigned.length;
    const svDatesEl = document.getElementById('active-sv-dates');
    if (svDatesEl) {
      svDatesEl.innerHTML = `<i class="fa-regular fa-calendar-check text-brand-600 mr-1"></i>Відпр: <strong>${currentSv.plannedDeparture || '—'}</strong> ➔ Приб: ${currentSv.plannedArrival || '—'}`;
    }

    // Метрики Об'єму + Фактичні / Планові куби (Блок 4.3)
    const svVolPct = document.getElementById('active-sv-vol-pct');
    if (svVolPct) { svVolPct.textContent = `${cap.projPctVol}%`; svVolPct.className = `font-extrabold ${themeVol.text}`; }
    const svVolBar = document.getElementById('active-sv-vol-bar');
    if (svVolBar) { svVolBar.style.width = `${Math.min(cap.projPctVol, 100)}%`; svVolBar.className = `h-1.5 rounded-full transition-all duration-300 ${themeVol.bar}`; }
    const svVolText = document.getElementById('active-sv-vol-text');
    if (svVolText) svVolText.textContent = cap.vol.toFixed(1);
    const svVolMax = document.getElementById('active-sv-vol-max');
    if (svVolMax) svVolMax.textContent = currentSv.maxVolume.toFixed(1);
    const svVolDelta = document.getElementById('active-sv-vol-delta');
    if (svVolDelta) svVolDelta.textContent = cap.deltaVol > 0 ? `(+${cap.deltaVol.toFixed(1)})` : '';
    const svActualVolEl = document.getElementById('active-sv-actual-vol');
    if (svActualVolEl) svActualVolEl.textContent = (cap.actualVol || 0).toFixed(1);
    const svPlannedVolEl = document.getElementById('active-sv-planned-vol');
    if (svPlannedVolEl) svPlannedVolEl.textContent = (cap.plannedVol || 0).toFixed(1);

    // Метрики Ваги
    const svWeightPct = document.getElementById('active-sv-weight-pct');
    if (svWeightPct) { svWeightPct.textContent = `${cap.projPctWeight}%`; svWeightPct.className = `font-extrabold ${themeWeight.text}`; }
    const svWeightBar = document.getElementById('active-sv-weight-bar');
    if (svWeightBar) { svWeightBar.style.width = `${Math.min(cap.projPctWeight, 100)}%`; svWeightBar.className = `h-1.5 rounded-full transition-all duration-300 ${themeWeight.bar}`; }
    const svWeightText = document.getElementById('active-sv-weight-text');
    if (svWeightText) svWeightText.textContent = cap.weight.toFixed(1);
    const svWeightMax = document.getElementById('active-sv-weight-max');
    if (svWeightMax) svWeightMax.textContent = currentSv.maxWeight.toFixed(1);
    const svWeightDelta = document.getElementById('active-sv-weight-delta');
    if (svWeightDelta) svWeightDelta.textContent = cap.deltaWeight > 0 ? `(+${cap.deltaWeight.toFixed(1)})` : '';

    // Метрики Місць
    const svPlacesPct = document.getElementById('active-sv-places-pct');
    if (svPlacesPct) { svPlacesPct.textContent = `${cap.projPctPlaces}%`; svPlacesPct.className = `font-extrabold ${themePlaces.text}`; }
    const svPlacesBar = document.getElementById('active-sv-places-bar');
    if (svPlacesBar) { svPlacesBar.style.width = `${Math.min(cap.projPctPlaces, 100)}%`; svPlacesBar.className = `h-1.5 rounded-full transition-all duration-300 ${themePlaces.bar}`; }
    const svPlacesText = document.getElementById('active-sv-places-text');
    if (svPlacesText) svPlacesText.textContent = cap.places;
    const svPlacesMax = document.getElementById('active-sv-places-max');
    if (svPlacesMax) svPlacesMax.textContent = currentSv.maxPlaces;
    const svPlacesDelta = document.getElementById('active-sv-places-delta');
    if (svPlacesDelta) svPlacesDelta.textContent = cap.deltaPlaces > 0 ? `(+${cap.deltaPlaces})` : '';

    // Оновлюємо лічильник перевезень біля кнопки згортання (якщо присутня)
    const assignedCountBadge = document.getElementById('subvoyage-assigned-count-badge');
    if (assignedCountBadge) assignedCountBadge.textContent = assigned.length;

    if (subvoyageTotalCargoCount) subvoyageTotalCargoCount.textContent = assigned.length;
    if (subvoyageTotalVol) subvoyageTotalVol.textContent = cap.vol.toFixed(1);
    if (subvoyageMaxVol) subvoyageMaxVol.textContent = currentSv.maxVolume.toFixed(1);
    if (subvoyageTotalWeight) subvoyageTotalWeight.textContent = cap.weight.toFixed(1);
    if (subvoyageMaxWeight) subvoyageMaxWeight.textContent = currentSv.maxWeight.toFixed(1);
    if (subvoyageTotalPlaces) subvoyageTotalPlaces.textContent = cap.places;
    if (subvoyageMaxPlaces) subvoyageMaxPlaces.textContent = currentSv.maxPlaces;

    // Якщо таблиця в правій панелі присутня (застарілий блок, перенесений у режим лівої таблиці «У цьому підрейсі»)
    if (tbodySubvoyageAssignedShipments) {
      if (assigned.length === 0) {
        tbodySubvoyageAssignedShipments.innerHTML = `
          <tr>
            <td colspan="4" class="p-6 text-center text-slate-400 italic">У підрейсі немає доданих перевезень</td>
          </tr>
        `;
        return;
      }

      tbodySubvoyageAssignedShipments.innerHTML = assigned.map(tr => {
        const propBadges = renderShipmentPropertyBadges(tr);
        const routeInfo = renderShipmentFinalRouteInfo(tr);

        return `
          <tr class="hover:bg-slate-50 transition cursor-pointer" onclick="handleShipmentRowClick('${tr.id}', event)">
            <td class="p-1.5 space-y-0.5">
              <div class="font-mono font-bold text-brand-700 text-[11px]">${tr.dfShipment || tr.id}</div>
              <div class="flex items-center gap-1 flex-wrap">
                ${renderStatusBadge(tr.status)}
                ${routeInfo}
              </div>
            </td>
            <td class="p-1.5 font-mono text-[10px] text-slate-700 whitespace-nowrap">
              <div><strong>${tr.volume}</strong> м³ | <strong>${tr.weight}</strong> т</div>
              <div class="text-slate-500 text-[9px] font-bold">${tr.places || 0} місць</div>
            </td>
            <td class="p-1.5">
              <div class="flex items-center gap-1 flex-wrap">${propBadges}</div>
            </td>
            <td class="p-1.5 text-right whitespace-nowrap" onclick="event.stopPropagation()">
              <button onclick="detachShipmentFromSubvoyage('${tr.id}')" class="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[10px] font-bold border border-rose-200 transition cursor-pointer" title="Повернути в пул">
                <i class="fa-solid fa-arrow-left text-[9px]"></i> В пул
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Генерація інтерактивного мультимодального таймлайну (як на скріншотах 1-2)
  function renderMultimodalTimeline(tr) {
    const timeline = tr.multimodalTimeline || [];
    if (timeline.length === 0) {
      return `<div class="text-slate-400 italic text-[11px] p-2 text-center">Дані про детальні проміжні точки відсутні. Маршрут: ${tr.transitSegment || (tr.originCountry + ' ➔ ' + tr.destinationCountry)}</div>`;
    }

    return `
      <div class="flex items-center gap-0 min-w-max py-2 select-none">
        ${timeline.map((node, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === timeline.length - 1;
      const isSubvoyageDest = Boolean(node.isSubvoyageDest);
      const isFinalDest = Boolean(node.isFinalDest || isLast);

      let nodeIcon = 'fa-solid fa-location-dot';
      let circleColor = 'bg-slate-600 text-white';
      if (isFirst || (node.type === 'address' && !isLast)) {
        nodeIcon = 'fa-solid fa-warehouse';
        circleColor = 'bg-slate-600 text-white';
      } else if (node.type === 'port') {
        nodeIcon = 'fa-solid fa-anchor';
        circleColor = isSubvoyageDest ? 'bg-purple-600 text-white ring-4 ring-purple-100' : 'bg-sky-500 text-white';
      } else if (isFinalDest) {
        nodeIcon = 'fa-solid fa-user-check';
        circleColor = 'bg-emerald-600 text-white ring-4 ring-emerald-100';
      } else {
        nodeIcon = 'fa-solid fa-location-dot';
        circleColor = 'bg-emerald-500 text-white';
      }

      let connectorHtml = '';
      if (idx < timeline.length - 1) {
        const nextNode = timeline[idx + 1];
        const dur = nextNode.duration || '2 дні';
        const mode = nextNode.mode || 'truck';
        const modeIcon = mode === 'ship' ? 'fa-solid fa-ship text-sky-500' : (mode === 'plane' ? 'fa-solid fa-plane text-indigo-500' : 'fa-solid fa-truck text-amber-500');
        const lineColor = mode === 'ship' ? 'bg-sky-400' : 'bg-amber-400';

        connectorHtml = `
              <div class="flex flex-col items-center justify-center px-1 shrink-0 w-20">
                <div class="bg-white border border-slate-200 text-slate-600 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded shadow-2xs mb-1">
                  ${dur}
                </div>
                <div class="w-full flex items-center justify-center relative">
                  <div class="h-0.5 w-full ${lineColor}"></div>
                  <div class="absolute bg-white px-1 text-[11px]">
                    <i class="${modeIcon}"></i>
                  </div>
                </div>
              </div>
            `;
      }

      let badgeHtml = '';
      if (isSubvoyageDest) {
        badgeHtml = `<span class="bg-purple-100 text-purple-900 border border-purple-300 text-[8px] font-extrabold px-1.5 py-0.2 rounded uppercase block mb-1">Точка в підрейсі</span>`;
      } else if (isFinalDest) {
        badgeHtml = `<span class="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[8px] font-extrabold px-1.5 py-0.2 rounded uppercase block mb-1">Кінцева точка</span>`;
      } else {
        badgeHtml = `<span class="opacity-0 text-[8px] px-1.5 py-0.2 block mb-1">Етап</span>`;
      }

      return `
            <div class="flex items-center shrink-0">
              <div class="flex flex-col items-center text-center w-28">
                ${badgeHtml}
                <div class="w-8 h-8 rounded-full ${circleColor} flex items-center justify-center text-xs shadow-sm transition">
                  <i class="${nodeIcon}"></i>
                </div>
                <span class="text-[9px] uppercase font-bold text-slate-400 mt-1">${node.label}</span>
                <span class="text-[10px] font-bold text-slate-800 leading-tight mt-0.5 line-clamp-2 max-w-[110px]" title="${node.location}">${node.location}</span>
              </div>
              ${connectorHtml}
            </div>
          `;
    }).join('')}
      </div>
    `;
  }

  // Drawer (Повна інформація про Перевезення та Вантаж/Ерайв за специфікацією)
  window.handleShipmentRowClick = function (shipmentId, event) {
    if (event.target.closest('input') || event.target.closest('button') || event.target.closest('a')) return;
    openContextDrawer(shipmentId);
  };

  window.openContextDrawer = function (shipmentId) {
    const tr = transportsData.find(t => t.id === shipmentId);
    if (!tr) return;
    if (isUnmarkedCargo(tr)) {
      openCargoInfoModal(tr.id);
      return;
    }

    const depInfo = getShipmentDepartureInfo(tr);
    const uInfo = getShipmentUrgencyInfo(tr);

    if (drawerShipmentId) drawerShipmentId.textContent = tr.dfShipment || tr.id;
    if (drawerStatusBadge) drawerStatusBadge.innerHTML = renderStatusBadge(tr.status);
    if (drawerUrgencyBadge) drawerUrgencyBadge.innerHTML = renderUrgencyBadge(uInfo);
    if (drawerShipmentPromise) drawerShipmentPromise.textContent = `Пов'язана Обіцянка: ${tr.dfPromise || '—'} | Підрейс: ${tr.subvoyageId || 'Не призначено'}`;
    if (drawerClientLink) drawerClientLink.href = tr.clientLink || '#';
    if (drawerClientName) drawerClientName.textContent = tr.client;
    if (drawerLogistName) drawerLogistName.textContent = tr.logist;
    if (drawerDeliveryMethod) drawerDeliveryMethod.textContent = tr.deliveryMethod || 'Склад — Склад';
    if (drawerSenderContacts) drawerSenderContacts.textContent = tr.senderContacts || 'Фабрика відправника (Китай)';

    // Маршрут та кінцева точка перевезення
    if (drawerRoute) {
      const finalPoint = tr.finalDestination || tr.destinationCountry || tr.hub || '—';
      const fullChainNote = tr.transitSegment ? `<span class="text-[10px] text-slate-500 font-normal ml-1.5">(Повний маршрут: ${tr.transitSegment})</span>` : '';
      drawerRoute.innerHTML = `<span class="inline-flex items-center gap-1.5"><i class="fa-solid fa-flag-checkered text-emerald-600"></i><span>Кінцева: ${finalPoint}</span></span> <span class="ml-1 inline-flex items-center gap-1">(${renderTransportBadge(tr.transport)})</span>${fullChainNote}`;
    }
    if (drawerHubBadge) {
      drawerHubBadge.innerHTML = `<i class="fa-solid fa-warehouse text-amber-700"></i> <span>Склад прибуття: ${tr.hub || 'Не вказано'}</span>`;
    }
    if (drawerOriginAddress) drawerOriginAddress.textContent = tr.originAddress || `${tr.originCountry}, Консолідаційний термінал`;
    if (drawerDestinationAddress) drawerDestinationAddress.textContent = tr.finalAddress || tr.destinationAddress || `${tr.destinationCountry}, ${tr.hub || 'Центральний склад'}`;

    // Рендеримо інтерактивний мультимодальний таймлайн маршруту (як на скріншотах 1-2)
    const drawerTimelineEl = document.getElementById('drawer-multimodal-timeline');
    if (drawerTimelineEl) {
      drawerTimelineEl.innerHTML = renderMultimodalTimeline(tr);
    }
    const drawerTimelineTransitTime = document.getElementById('drawer-timeline-transit-time');
    if (drawerTimelineTransitTime) {
      const transitDays = tr.multimodalTimeline ? (tr.multimodalTimeline.length >= 7 ? 87 : (tr.multimodalTimeline.length * 7)) : 45;
      drawerTimelineTransitTime.textContent = `Транзитний час: ~${transitDays} днів`;
    }

    // Точка А: Кінцева точка доставки перевезення
    const drawerFinalDestTitle = document.getElementById('drawer-final-dest-title');
    if (drawerFinalDestTitle) {
      drawerFinalDestTitle.innerHTML = `<span class="text-emerald-950 font-bold">${tr.finalDestination || tr.destinationCountry || tr.hub}</span>`;
    }
    const drawerHubName = document.getElementById('drawer-hub-name');
    if (drawerHubName) {
      drawerHubName.textContent = tr.hub || 'Центральний Хаб';
    }

    // Точка Б: Дані про отримання в підрейсі (поточне плече)
    const svDestCard = document.getElementById('drawer-subvoyage-receiving-card');
    const svDestTitle = document.getElementById('drawer-sv-dest-title');
    const svDestDesc = document.getElementById('drawer-sv-dest-desc');
    if (tr.subvoyageId) {
      const sv = subVoyagesData.find(s => s.id === tr.subvoyageId);
      if (sv) {
        if (svDestCard) svDestCard.className = 'bg-purple-50/90 p-2.5 rounded-lg border border-purple-300 space-y-1';
        if (svDestTitle) {
          svDestTitle.innerHTML = `<span>${sv.destinationCountry} — ${sv.unloadingPlace || sv.destinationPort || 'Транзитний термінал'}</span> <span class="ml-1 text-[10px] font-normal text-purple-700 font-mono">(${sv.id})</span>`;
        }
        if (svDestDesc) {
          svDestDesc.innerHTML = `Підрейс <strong>${sv.id}</strong> здійснює доставку на плечі <strong>${sv.originCountry} ➔ ${sv.destinationCountry}</strong>. Після прибуття в <strong>${sv.destinationCountry}</strong> вантаж прямує далі до кінцевої точки (${tr.destinationCountry}).`;
        }
      }
    } else if (activeSubvoyageId) {
      const sv = subVoyagesData.find(s => s.id === activeSubvoyageId);
      if (sv) {
        if (svDestCard) svDestCard.className = 'bg-amber-50/90 p-2.5 rounded-lg border border-amber-300 space-y-1';
        if (svDestTitle) {
          svDestTitle.innerHTML = `<span>Підбір у підрейс: ${sv.id} (${sv.originCountry} ➔ ${sv.destinationCountry})</span>`;
        }
        if (svDestDesc) {
          svDestDesc.innerHTML = `Точка отримання вантажу цим підрейсом: <strong>${sv.destinationCountry}</strong> (${sv.unloadingPlace || 'Термінал'}). Кінцева доставка вантажу: <strong>${tr.finalDestination || tr.destinationCountry}</strong>.`;
        }
      }
    } else {
      if (svDestCard) svDestCard.className = 'bg-slate-100 p-2.5 rounded-lg border border-slate-200 space-y-1';
      if (svDestTitle) svDestTitle.textContent = 'Не призначено в підрейс (В пулі)';
      if (svDestDesc) svDestDesc.textContent = 'Очікує вибору підрейсу на відповідне плече або прямий рейс.';
    }

    if (drawerDateReady) drawerDateReady.textContent = tr.dateReady || '—';
    if (drawerDateShipped) drawerDateShipped.textContent = `${depInfo.label} (${depInfo.source})`;
    if (drawerDateArrival) drawerDateArrival.textContent = tr.dateArrivalExpected || '—';

    if (drawerCustomsClearance) drawerCustomsClearance.textContent = tr.customsClearance || 'Брокер компанії (Під ключ)';
    if (drawerCustomsTerms) drawerCustomsTerms.textContent = tr.customsTerms || 'EXW / FOB';
    if (drawerTransportType) {
      drawerTransportType.innerHTML = `<span class="inline-flex items-center gap-1.5">${renderTransportBadge(tr.transport)} <span>•</span> <span>${tr.transportType || 'Консолідація'} / ${tr.loadingType || 'LCL'}</span></span>`;
    }
    if (drawerPlannedMetrics) drawerPlannedMetrics.textContent = `${tr.places || 0} місць | ${tr.weight || 0} т | ${tr.volume || 0} м³`;
    if (drawerAdditionalDeliveryParams) drawerAdditionalDeliveryParams.textContent = tr.additionalDeliveryParams || 'Стандартні умови перевезення, обов\'язковий фотозвіт при завантаженні';

    if (drawerWarehouseAddress) drawerWarehouseAddress.textContent = tr.warehouseAddress || `${tr.hub || 'Транзитний склад'}`;
    if (drawerWaybillNumber) drawerWaybillNumber.textContent = tr.waybillNumber || `WB-${tr.id}`;
    if (drawerCourierDetails) drawerCourierDetails.textContent = tr.courierDetails || (tr.lastMile ? tr.lastMile.deliveryType : 'Локальний перевізник не залучений');

    if (drawerPropertyBadges) {
      const allMarkers = getAllShipmentMarkers(tr);
      if (allMarkers.length > 0) {
        drawerPropertyBadges.innerHTML = allMarkers.map(m => {
          const isFaIcon = typeof m.icon === 'string' && m.icon.startsWith('fa-');
          return `
            <span class="${m.cls} border px-2 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1.5 shadow-2xs" title="${m.fullLabel}">
              ${isFaIcon ? `<i class="${m.icon} text-[10px]"></i>` : `<span>${m.icon}</span>`}
              <span>${m.fullLabel}</span>
            </span>
          `;
        }).join('');
      } else {
        drawerPropertyBadges.innerHTML = `<span class="text-xs text-slate-400 italic">Спеціальні маркери не призначені</span>`;
      }
    }

    if (tr.lastMile && drawerLastmileBlock) {
      drawerLastmileBlock.classList.remove('hidden');
      if (drawerLastmileType) drawerLastmileType.textContent = tr.lastMile.deliveryType || '—';
      if (drawerLastmileRecipient) drawerLastmileRecipient.textContent = tr.lastMile.recipientName || '—';
      if (drawerLastmilePhone) drawerLastmilePhone.textContent = tr.lastMile.recipientPhone || '—';
      if (drawerLastmileAddress) drawerLastmileAddress.textContent = tr.lastMile.destinationAddress || '—';
    } else if (drawerLastmileBlock) {
      drawerLastmileBlock.classList.add('hidden');
    }

    // Відображення Вантажів (Ерайвів): Кількість місць, вага, об'єм, тип пакування, додаткові послуги, примітка логіста
    const cargoes = tr.cargoes || [];
    if (drawerCargoCount) drawerCargoCount.textContent = `${cargoes.length} ерайвів`;

    if (drawerCargoesList) {
      drawerCargoesList.innerHTML = cargoes.map(c => `
        <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
          <div class="flex justify-between items-start gap-2">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <strong class="text-slate-900 text-xs">${c.titleUa}</strong>
                ${c.nameEn ? `<span class="text-[10px] text-slate-400 font-mono">/ ${c.nameEn}</span>` : ''}
              </div>
              <p class="text-[11px] text-slate-500 italic mt-0.5">${c.contentDescription || ''}</p>
            </div>
            <div class="text-right shrink-0">
              <span class="text-[10px] font-mono font-bold bg-brand-50 text-brand-800 border border-brand-200 px-2 py-0.5 rounded block">Ерайв: ${c.cargoId}</span>
              <span class="text-[9px] text-slate-400 font-mono">Трек: ${c.trackingNumber || 'TRK-' + c.cargoId}</span>
            </div>
          </div>

          <!-- Основні габарити та пакування вантажу -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono bg-slate-50 p-2 rounded-lg border border-slate-200">
            <div>
              <span class="text-slate-400 block text-[9px] font-sans uppercase font-bold">Кількість місць:</span>
              <strong class="text-slate-900 text-xs">${c.places || 0} місць</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[9px] font-sans uppercase font-bold">Вага брутто:</span>
              <strong class="text-slate-900 text-xs">${c.grossWeight || 0} т</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[9px] font-sans uppercase font-bold">Об'єм:</span>
              <strong class="text-slate-900 text-xs">${c.volume || 0} м³</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[9px] font-sans uppercase font-bold">Тип пакування:</span>
              <strong class="text-amber-900 font-sans font-bold">${c.packageType || '—'}</strong>
            </div>
          </div>

          <!-- Додаткові послуги та Примітка логіста по вантажу -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div class="bg-indigo-50/60 border border-indigo-100 p-2 rounded-lg">
              <span class="text-[9px] uppercase font-bold text-indigo-700 block"><i class="fa-solid fa-screwdriver-wrench mr-1"></i>Додаткові послуги:</span>
              <span class="text-slate-800 font-semibold">${c.additionalServices || 'Перепакування, фотозвіт, маркування'}</span>
            </div>
            <div class="bg-amber-50/70 border border-amber-200/80 p-2 rounded-lg">
              <span class="text-[9px] uppercase font-bold text-amber-800 block"><i class="fa-regular fa-note-sticky mr-1"></i>Примітка логіста:</span>
              <span class="text-slate-800 italic">${c.logistNote || 'Перевірено на складі відправлення, зауважень немає'}</span>
            </div>
          </div>

          <div class="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Локація: <strong class="text-slate-700">${c.warehouseLocation || 'Склад'}</strong></span>
            <span>Статус ерайву: <strong class="text-emerald-700">${c.status || 'На складі'}</strong></span>
          </div>
        </div>
      `).join('');
    }

    if (drawerBtnDetach) {
      drawerBtnDetach.style.display = tr.subvoyageId ? 'inline-flex' : 'none';
      drawerBtnDetach.onclick = () => { detachShipmentFromSubvoyage(tr.id); closeContextDrawer(); };
    }

    if (drawerBtnAssign) {
      const canAssignToActive = activeSubvoyageId && tr.subvoyageId !== activeSubvoyageId;
      drawerBtnAssign.style.display = canAssignToActive ? 'inline-flex' : 'none';
      if (canAssignToActive) {
        drawerBtnAssign.textContent = `Призначити в ${activeSubvoyageId}`;
      }
      drawerBtnAssign.onclick = () => { assignShipmentToSubvoyage(tr.id, activeSubvoyageId); closeContextDrawer(); };
    }

    if (contextDrawerBackdrop) contextDrawerBackdrop.classList.remove('hidden');
    if (contextDrawer) contextDrawer.classList.remove('translate-x-full');
  };

  function closeContextDrawer() {
    if (contextDrawerBackdrop) contextDrawerBackdrop.classList.add('hidden');
    if (contextDrawer) contextDrawer.classList.add('translate-x-full');
  }

  // Вікно повної інформації про Підрейс (вимога п.4 та п.1)
  window.openSubvoyageDrawer = function (svId, event) {
    if (event) event.stopPropagation();
    const sv = subVoyagesData.find(s => s.id === svId);
    if (!sv) return;

    const cap = calculateSubvoyageCapacity(sv.id);
    const themeVol = getCapacityColorTheme(cap.projPctVol);
    const themeWeight = getCapacityColorTheme(cap.projPctWeight);
    const themePlaces = getCapacityColorTheme(cap.projPctPlaces);
    const svUrgency = getSubvoyageUrgencyInfo(sv);
    const assigned = transportsData.filter(t => t.subvoyageId === sv.id);

    const setElHtml = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };
    const setElText = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setElText('sv-drawer-title', `${sv.name} (${sv.id})`);
    setElHtml('sv-drawer-status-badge', renderStatusBadge(sv.status));
    setElHtml('sv-drawer-urgency-badge', renderUrgencyBadge(svUrgency));
    setElText('sv-drawer-subtitle', `Зовнішній рейс: ${sv.parentVoyage || '—'} | Шаблон: ${sv.template || 'Стандартний'}`);

    setElText('sv-drawer-logist', sv.logist || '—');
    setElHtml('sv-drawer-transport', renderTransportBadge(sv.transport, 'bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-xs font-bold'));
    setElText('sv-drawer-loading-type', sv.loadingType || 'Консолідація (LCL)');

    const flags = [];
    if (sv.isMain) flags.push('<span class="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[10px] font-bold">Основний</span>');
    if (sv.isTransit) flags.push('<span class="bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded text-[10px] font-bold">Транзит</span>');
    if (sv.adrPermitted) flags.push('<span class="bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded text-[10px] font-bold">ADR дозволено</span>');
    setElHtml('sv-drawer-flags', flags.length > 0 ? flags.join(' ') : '<span class="text-slate-400 text-xs">Стандартний рейс</span>');

    setElText('sv-drawer-route', `${sv.originCountry || '—'} ➔ ${sv.destinationCountry || '—'}`);
    setElHtml('sv-drawer-hub', `<i class="fa-solid fa-location-arrow text-amber-700"></i> <span>Точка отримання підрейсу: ${sv.destinationCountry} (${sv.unloadingPlace || sv.hub || '—'})</span>`);
    setElText('sv-drawer-loading-place', `${sv.originCountry}: ${sv.loadingPlace || sv.originPort || '—'}`);
    setElText('sv-drawer-unloading-place', `${sv.destinationCountry}: ${sv.unloadingPlace || sv.destinationPort || '—'}`);

    setElText('sv-drawer-plan-dep', sv.plannedDeparture || '—');
    setElText('sv-drawer-plan-arr', sv.plannedArrival || '—');
    setElText('sv-drawer-act-dep', sv.actualDeparture || 'Ще не відправлено');
    setElText('sv-drawer-act-arr', sv.actualArrival || 'В очікуванні');

    // Специфіка транспорту (Морський / Авіа / Авто / Залізниця)
    let specificsHtml = '';
    if (sv.transport === 'Морський' && sv.transportDetails) {
      specificsHtml = `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div><span class="text-[10px] text-slate-400 block">Судноплавна лінія:</span><strong class="text-slate-900">${sv.transportDetails.shippingLine || '—'}</strong></div>
          <div><span class="text-[10px] text-slate-400 block">Номер букінгу:</span><strong class="text-slate-900">${sv.transportDetails.bookingNumber || '—'}</strong></div>
          <div><span class="text-[10px] text-slate-400 block">Порти (POL ➔ POD):</span><strong class="text-slate-900">${sv.transportDetails.ports || '—'}</strong></div>
        </div>
      `;
    } else if (sv.transport === 'Авіа' && sv.transportDetails) {
      specificsHtml = `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div><span class="text-[10px] text-slate-400 block">Авіалінія:</span><strong class="text-slate-900">${sv.transportDetails.airline || '—'}</strong></div>
          <div><span class="text-[10px] text-slate-400 block">Номер AWB:</span><strong class="text-slate-900">${sv.transportDetails.awbNumber || '—'}</strong></div>
          <div><span class="text-[10px] text-slate-400 block">Аеропорти:</span><strong class="text-slate-900">${sv.transportDetails.airports || '—'}</strong></div>
        </div>
      `;
    } else if (sv.transportDetails) {
      specificsHtml = `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div><span class="text-[10px] text-slate-400 block">Перехід кордону:</span><strong class="text-slate-900">${sv.transportDetails.borderCrossing || '—'}</strong></div>
          <div><span class="text-[10px] text-slate-400 block">Митний термінал:</span><strong class="text-slate-900">${sv.transportDetails.customsClearancePlaces || 'Київ / Львів'}</strong></div>
          <div><span class="text-[10px] text-slate-400 block">ТЗ / Потяг:</span><strong class="text-slate-900">${sv.transportDetails.vehicleDetails || sv.transportDetails.trainNumber || '—'}</strong></div>
        </div>
      `;
    } else {
      specificsHtml = '<span class="text-slate-400">Додаткові транспортні реквізити не вказані</span>';
    }
    setElHtml('sv-drawer-transport-specifics', specificsHtml);
    setElHtml('sv-drawer-special-badges', renderSubvoyageSpecialAttributesBadges(sv.id));

    const capBadgeEl = document.getElementById('sv-drawer-cap-badge');
    if (capBadgeEl) {
      capBadgeEl.className = `text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${themeVol.badge}`;
      capBadgeEl.textContent = `${cap.projPctVol}% заповнено`;
    }

    setElHtml('sv-drawer-capacity-bars', `
      <div>
        <div class="flex justify-between text-xs font-mono text-slate-700 mb-1">
          <span>Об'єм (м³): <strong>${cap.vol.toFixed(1)}</strong> / ${sv.maxVolume} м³</span>
          <span class="${themeVol.text}">${cap.projPctVol}%</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div class="${themeVol.bar} h-2 rounded-full" style="width: ${Math.min(cap.projPctVol, 100)}%"></div>
        </div>
        <div class="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
          <span>Фактичні: <strong class="text-emerald-700">${(cap.actualVol || 0).toFixed(1)} м³</strong></span>
          <span>Планові: <strong class="text-violet-700">${(cap.plannedVol || 0).toFixed(1)} м³</strong></span>
        </div>
      </div>
      <div>
        <div class="flex justify-between text-xs font-mono text-slate-700 mb-1">
          <span>Вага брутто (т): <strong>${cap.weight.toFixed(1)}</strong> / ${sv.maxWeight} т</span>
          <span class="${themeWeight.text}">${cap.projPctWeight}%</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div class="${themeWeight.bar} h-2 rounded-full" style="width: ${Math.min(cap.projPctWeight, 100)}%"></div>
        </div>
      </div>
      <div>
        <div class="flex justify-between text-xs font-mono text-slate-700 mb-1">
          <span>Кількість місць (шт): <strong>${cap.places}</strong> / ${sv.maxPlaces} місць</span>
          <span class="${themePlaces.text}">${cap.projPctPlaces}%</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div class="${themePlaces.bar} h-2 rounded-full" style="width: ${Math.min(cap.projPctPlaces, 100)}%"></div>
        </div>
      </div>
    `);

    setElText('sv-drawer-comment', sv.comment || 'Коментарі до підрейсу відсутні.');
    setElText('sv-drawer-shipments-count', `${assigned.length} перевезень`);

    if (assigned.length === 0) {
      setElHtml('sv-drawer-shipments-list', `<div class="p-4 text-center text-slate-400 italic text-xs bg-white rounded-xl border border-slate-200">До цього підрейсу ще не додано перевезень</div>`);
    } else {
      setElHtml('sv-drawer-shipments-list', assigned.map(tr => {
        const routeInfo = renderShipmentFinalRouteInfo(tr);
        return `
          <div onclick="openContextDrawer('${tr.id}')" class="p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 cursor-pointer transition shadow-2xs">
            <div class="space-y-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-mono font-bold text-xs text-brand-700">${tr.dfShipment || tr.id}</span>
                ${renderStatusBadge(tr.status)}
                ${routeInfo}
              </div>
              <div class="text-[11px] text-slate-700 font-semibold">${tr.client} <span class="text-slate-400 font-normal">• ${tr.logist}</span></div>
            </div>
            <div class="text-right font-mono text-[11px] text-slate-700 shrink-0">
              <div><strong>${tr.volume}</strong> м³ | <strong>${tr.weight}</strong> т | <strong>${tr.places}</strong> шт</div>
              <div class="text-[10px] text-slate-500">Готовність: ${tr.dateReady || '—'}</div>
            </div>
          </div>
        `;
      }).join(''));
    }

    const btnViewInTable = document.getElementById('sv-drawer-btn-view-shipments');
    if (btnViewInTable) {
      btnViewInTable.onclick = () => {
        activeSubvoyageId = sv.id;
        expandedSubvoyageIds.add(sv.id);
        const svBackdrop = document.getElementById('subvoyage-drawer-backdrop');
        const dr = document.getElementById('subvoyage-drawer');
        if (svBackdrop) svBackdrop.classList.add('hidden');
        if (dr) dr.classList.add('translate-x-full');
        updateActiveSubvoyageState();
        renderAll();
      };
    }

    const svBackdrop = document.getElementById('subvoyage-drawer-backdrop');
    const dr = document.getElementById('subvoyage-drawer');
    if (svBackdrop) svBackdrop.classList.remove('hidden');
    if (dr) dr.classList.remove('translate-x-full');
  };

  if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeContextDrawer);
  if (contextDrawerBackdrop) contextDrawerBackdrop.addEventListener('click', closeContextDrawer);

  window.assignShipmentToSubvoyage = function (shipmentId, svId) {
    const tr = transportsData.find(t => t.id === shipmentId);
    const sv = subVoyagesData.find(s => s.id === svId);
    if (!tr || !sv) return;
    tr.subvoyageId = svId;
    tr.status = sv.status;
    if (sv.plannedDeparture) {
      tr.dateShipped = sv.plannedDeparture;
    }
    syncSubvoyageAndShipmentsStatuses();
    selectedUnassignedIds.delete(shipmentId);
    showToast(`${isUnmarkedCargo(tr) ? 'Вантаж' : 'Перевезення'} ${tr.dfShipment || tr.id} додано в ${svId}`);
    renderAll();
  };

  window.detachShipmentFromSubvoyage = function (shipmentId) {
    const tr = transportsData.find(t => t.id === shipmentId);
    if (!tr) return;
    tr.subvoyageId = null;
    tr.dateShipped = null;
    if (tr.readinessCategory === 'planned') {
      tr.status = 'Плановий (обіцянка)';
    } else if (tr.readinessCategory === 'not_ready') {
      tr.status = 'Очікує документів';
    } else if (tr.readinessCategory === 'unmarked') {
      tr.status = 'Непромаркований';
    } else {
      tr.status = 'Готовий до завантаження';
    }
    syncSubvoyageAndShipmentsStatuses();
    showToast(`${isUnmarkedCargo(tr) ? 'Вантаж' : 'Перевезення'} ${tr.dfShipment || tr.id} повернуто в пул (${tr.status})`);
    renderAll();
  };

  window.clearCurrentSubvoyageShipments = function () {
    const assigned = transportsData.filter(t => t.subvoyageId === activeSubvoyageId);
    if (assigned.length === 0) return;
    if (confirm(`Відкріпити всі перевезення з підрейсу ${activeSubvoyageId}?`)) {
      assigned.forEach(t => {
        t.subvoyageId = null;
        t.dateShipped = null;
        if (t.readinessCategory === 'planned') t.status = 'Плановий (обіцянка)';
        else if (t.readinessCategory === 'not_ready') t.status = 'Очікує документів';
        else if (t.readinessCategory === 'unmarked') t.status = 'Непромаркований';
        else t.status = 'Готовий до завантаження';
      });
      syncSubvoyageAndShipmentsStatuses();
      showToast(`Підрейс очищено`);
      renderAll();
    }
  };

  if (btnBulkAssignToActive) {
    btnBulkAssignToActive.onclick = () => {
      if (selectedUnassignedIds.size === 0) return;
      const sv = subVoyagesData.find(s => s.id === activeSubvoyageId);
      if (!sv) return;

      const count = selectedUnassignedIds.size;
      selectedUnassignedIds.forEach(id => {
        const tr = transportsData.find(t => t.id === id);
        if (tr) {
          tr.subvoyageId = sv.id;
          tr.status = sv.status;
          if (sv.plannedDeparture) tr.dateShipped = sv.plannedDeparture;
        }
      });
      selectedUnassignedIds.clear();
      syncSubvoyageAndShipmentsStatuses();
      showToast(`Додано ${count} перевезень до ${sv.id} (Єдиний статус: ${sv.status})`);
      renderAll();
    };
  }

  function updateReadinessBadgesCounts() {
    const pool = transportsData.filter(t => t.subvoyageId === null);
    const counts = {
      ready: 0,
      not_ready: 0,
      planned: 0,
      unmarked: 0,
      all: pool.length
    };
    pool.forEach(t => {
      const cat = t.readinessCategory || (t.status === 'Готовий до завантаження' ? 'ready' : 'not_ready');
      if (counts[cat] !== undefined) counts[cat]++;
    });
    const setBadge = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setBadge('badge-readiness-ready', counts.ready);
    setBadge('badge-readiness-not_ready', counts.not_ready);
    setBadge('badge-readiness-planned', counts.planned);
    setBadge('badge-readiness-unmarked', counts.unmarked);
    setBadge('badge-readiness-all', counts.all);
  }

  function applyQuickFiltersUIState() {
    // 1. Вкладки статусу готовності (.sv-readiness-tab)
    document.querySelectorAll('.sv-readiness-tab').forEach(btn => {
      const rMode = btn.getAttribute('data-readiness');
      const isActive = filters.quickFilter === rMode;
      if (isActive) {
        btn.className = 'sv-readiness-tab px-2.5 py-1 rounded-md transition bg-white text-brand-700 font-bold shadow-2xs cursor-pointer inline-flex items-center gap-1';
      } else {
        btn.className = 'sv-readiness-tab px-2.5 py-1 rounded-md transition text-slate-600 hover:text-slate-900 font-medium cursor-pointer inline-flex items-center gap-1';
      }
    });

    // 2. Тип доставки (.sv-quick-delivery-btn)
    document.querySelectorAll('.sv-quick-delivery-btn').forEach(btn => {
      const dMode = btn.getAttribute('data-delivery');
      const isActive = filters.deliveryMode === dMode;
      if (isActive) {
        btn.className = 'sv-quick-delivery-btn px-2 py-1 rounded-md transition bg-white text-brand-700 font-bold shadow-2xs cursor-pointer';
      } else {
        btn.className = 'sv-quick-delivery-btn px-2 py-1 rounded-md transition text-slate-600 hover:text-slate-900 font-medium cursor-pointer';
      }
    });

    // 3. Маршрут (#sv-quick-route-select)
    const routeSel = document.getElementById('sv-quick-route-select');
    if (routeSel) routeSel.value = filters.routeDirection || 'all';

    // 4. Тип Карго / Фрахт (.sv-quick-cargotype-btn)
    document.querySelectorAll('.sv-quick-cargotype-btn').forEach(btn => {
      const cType = btn.getAttribute('data-cargotype');
      const isActive = filters.cargoType === cType;
      if (isActive) {
        btn.className = 'sv-quick-cargotype-btn px-2 py-1 rounded-md transition bg-white text-brand-700 font-bold shadow-2xs cursor-pointer';
      } else {
        btn.className = 'sv-quick-cargotype-btn px-2 py-1 rounded-md transition text-slate-600 hover:text-slate-900 font-medium cursor-pointer';
      }
    });
  }

  function setupQuickFilters() {
    // 1. Вкладки статусу готовності на складі
    document.querySelectorAll('.sv-readiness-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        filters.quickFilter = btn.getAttribute('data-readiness') || 'ready';
        shipmentsCurrentPage = 1;
        applyQuickFiltersUIState();
        renderAll();
      });
    });

    // 2. Перемикач типу доставки (Море / Авіа / Авто)
    document.querySelectorAll('.sv-quick-delivery-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filters.deliveryMode = btn.getAttribute('data-delivery') || 'all';
        shipmentsCurrentPage = 1;
        applyQuickFiltersUIState();
        renderAll();
      });
    });

    // 3. Вибір напрямку маршруту (напр., Китай ➔ Україна)
    const routeSel = document.getElementById('sv-quick-route-select');
    if (routeSel) {
      routeSel.addEventListener('change', (e) => {
        filters.routeDirection = e.target.value || 'all';
        shipmentsCurrentPage = 1;
        renderAll();
      });
    }

    // 4. Перемикач типу Карго / Фрахт
    document.querySelectorAll('.sv-quick-cargotype-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filters.cargoType = btn.getAttribute('data-cargotype') || 'all';
        shipmentsCurrentPage = 1;
        applyQuickFiltersUIState();
        renderAll();
      });
    });
  }

  if (shipmentsItemsPerPageSelect) {
    shipmentsItemsPerPageSelect.addEventListener('change', (e) => {
      shipmentsItemsPerPage = Number(e.target.value) || 20;
      shipmentsCurrentPage = 1;
      renderShipmentsTable();
    });
  }

  function setupUrgencyButtons() {
    const buttons = [
      { el: btnUrgencyAll, val: 'all', activeCls: 'px-2.5 py-1 rounded-md transition font-bold bg-white text-slate-800 shadow-2xs cursor-pointer', inactiveCls: 'px-2.5 py-1 rounded-md transition text-slate-600 hover:bg-white/60 font-semibold cursor-pointer' },
      { el: btnUrgencyCritical, val: 'critical', activeCls: 'px-2.5 py-1 rounded-md transition font-bold bg-rose-600 text-white shadow-2xs flex items-center gap-1 cursor-pointer', inactiveCls: 'px-2.5 py-1 rounded-md transition text-rose-700 hover:bg-white/60 font-semibold flex items-center gap-1 cursor-pointer' },
      { el: btnUrgencyHigh, val: 'high', activeCls: 'px-2.5 py-1 rounded-md transition font-bold bg-amber-500 text-white shadow-2xs flex items-center gap-1 cursor-pointer', inactiveCls: 'px-2.5 py-1 rounded-md transition text-amber-700 hover:bg-white/60 font-semibold flex items-center gap-1 cursor-pointer' },
      { el: btnUrgencyNormal, val: 'normal', activeCls: 'px-2.5 py-1 rounded-md transition font-bold bg-emerald-600 text-white shadow-2xs flex items-center gap-1 cursor-pointer', inactiveCls: 'px-2.5 py-1 rounded-md transition text-emerald-700 hover:bg-white/60 font-semibold flex items-center gap-1 cursor-pointer' }
    ];

    const updateStyles = () => {
      buttons.forEach(b => {
        if (!b.el) return;
        b.el.className = filters.urgency === b.val ? b.activeCls : b.inactiveCls;
      });
    };

    buttons.forEach(b => {
      if (!b.el) return;
      b.el.addEventListener('click', () => {
        filters.urgency = b.val;
        updateStyles();
        renderAll();
      });
    });

    const svButtons = [
      { el: btnSvUrgencyAll, val: 'all' },
      { el: btnSvUrgencyCritical, val: 'critical' },
      { el: btnSvUrgencyHigh, val: 'high' },
      { el: btnSvUrgencyNormal, val: 'normal' }
    ];

    const updateSvStyles = () => {
      svButtons.forEach(b => {
        if (!b.el) return;
        if (selectedSubvoyageUrgency === b.val) {
          b.el.className = 'px-2 py-0.5 rounded transition font-bold bg-white text-slate-900 shadow-2xs cursor-pointer';
        } else {
          const color = b.val === 'critical' ? 'text-rose-700' : b.val === 'high' ? 'text-amber-700' : b.val === 'normal' ? 'text-emerald-700' : 'text-slate-600';
          b.el.className = `px-2 py-0.5 rounded transition ${color} hover:bg-white/60 cursor-pointer`;
        }
      });
    };

    svButtons.forEach(b => {
      if (!b.el) return;
      b.el.addEventListener('click', () => {
        selectedSubvoyageUrgency = b.val;
        updateSvStyles();
        updateActiveSubvoyageState();
        renderAll();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filters.search = e.target.value.trim();
      shipmentsCurrentPage = 1;
      renderAll();
    });
  }

  if (btnQuickResetFilters) {
    btnQuickResetFilters.addEventListener('click', () => {
      filters.search = '';
      filters.quickFilter = 'ready';
      filters.deliveryMode = 'all';
      filters.routeDirection = 'all';
      filters.cargoType = 'all';
      filters.urgency = 'all';
      filters.hubs.clear();
      activeSubvoyageId = null;
      leftTableSubvoyageMode = 'pool';
      isRecommendationFilterIgnored = false;
      shipmentsCurrentPage = 1;
      sortField = 'dateReady';
      sortDirection = 'asc';
      selectedSubvoyageUrgency = 'all';
      selectedDestinationHub = 'all';
      if (subvoyageDestinationHubFilter) subvoyageDestinationHubFilter.value = 'all';
      if (searchInput) searchInput.value = '';

      applyQuickFiltersUIState();

      const allStatuses = Array.from(new Set(subVoyagesData.map(s => s.status))).filter(Boolean);
      const allLogists = Array.from(new Set(subVoyagesData.map(s => s.logist))).filter(Boolean);
      const defaultFormationStatuses = allStatuses.filter(st => st === 'Формування');
      selectedSubvoyageStatuses = new Set(defaultFormationStatuses.length > 0 ? defaultFormationStatuses : allStatuses);
      selectedSubvoyageLogists = new Set(allLogists);
      document.querySelectorAll('.sv-status-cb').forEach(cb => {
        cb.checked = selectedSubvoyageStatuses.has(cb.value);
      });
      document.querySelectorAll('.sv-logist-cb').forEach(cb => cb.checked = true);
      updateSubvoyageStatusFilterLabel(allStatuses.length);
      updateSubvoyageLogistFilterLabel(allLogists.length);

      renderAll();
      showToast('Фільтри скинуто — показано перевезення, готові до завантаження');
    });
  }

  function setupAdvancedFilterOptions() {
    const listLogist = document.getElementById('list-filter-logist');
    const listTransport = document.getElementById('list-filter-transport');
    if (listLogist) {
      const logists = Array.from(new Set(transportsData.map(t => t.logist))).filter(Boolean);
      listLogist.innerHTML = logists.map(l => `<label class="block"><input type="checkbox" value="${l}"> ${l}</label>`).join('');
    }
    if (listTransport) {
      const transports = ['Морський', 'Авіа', 'Авто', 'Залізниця'];
      listTransport.innerHTML = transports.map(t => {
        const iconCfg = getTransportIcon(t);
        return `
          <label class="flex items-center justify-between p-1 hover:bg-slate-50 rounded cursor-pointer text-xs">
            <span class="flex items-center gap-1.5"><i class="${iconCfg.icon} ${iconCfg.color}"></i> ${t}</span>
            <input type="checkbox" value="${t}" class="rounded text-brand-600">
          </label>
        `;
      }).join('');
    }
  }

  function renderAll() {
    const unassignedTotal = transportsData.filter(t => t.subvoyageId === null).length;
    if (headerUnassignedCount) headerUnassignedCount.textContent = unassignedTotal;

    window.svManagementShipments = transportsData.map(t => ({
      ...t,
      totalVolume: t.volume,
      totalWeight: t.weight,
      totalPlaces: t.places
    }));
    window.svManagementSubvoyages = subVoyagesData;

    updateReadinessBadgesCounts();
    updateActiveSubvoyageState();
    renderSubvoyagesTimeline();
    renderShipmentsTable();
    renderSubvoyageAssignedTable();
    updateBulkCounter();
    if (typeof window.refreshDashboardCargoStats === 'function') {
      window.refreshDashboardCargoStats();
    }
    if (window.DashboardModule && typeof window.DashboardModule.updateStats === 'function') {
      window.DashboardModule.updateStats(window.cargoesData || [], subVoyagesData);
    }
  }

  window.refreshSubvoyagesWorkspace = function () {
    renderAll();
  };

  setupUrgencyButtons();
  setupQuickFilters();
  loadData();

  window.reloadSubvoyagesPlannerData = function () {
    loadData();
  };
}

window.initSubvoyagesPlanner = function () {
  initSubvoyagesPlannerModule();
};

document.addEventListener('DOMContentLoaded', () => {
  // If standing alone on sub-voyages-management.html, auto-init
  if (document.getElementById('panel-shipments-master') && !document.getElementById('cargo-registry-container')) {
    initSubvoyagesPlannerModule();
  }
});