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
        <i class="${getTransportIcon(tr.transport).icon} ${getTransportIcon(tr.transport).color} text-[11px]" title="Спосіб перевезення: ${tr.transport || '—'}"></i>
      </div>
    `;
  }

  const SHIPMENT_STATUS_LABELS = {
    unprocessed: 'Необроблений запит',
    tariff_request: 'Запит на тариф',
    tariff_added: 'Додано тариф',
    tariff_sent: 'Відправлено тариф клієнту',
    tariff_lost: 'Програно тариф',
    awaiting_warehouse: 'Очікується на складі',
    partially_received: 'Частково отримано на складі',
    received_at_warehouse: 'Отримано на складі',
    broker_recalculation: 'Перерахунок брокера',
    tariff_under_review: 'Тариф на узгодженні',
    ready_for_loading: 'Готовий до завантаження',
    unloaded: 'Вивантажено на складі призначення',
    ready_for_pickup: 'Готовий до видачі',
    last_mile: 'Остання миля',
    received: 'Завершено',
    cargo_issues: 'Проблеми з вантажем',
    rejected: 'Відхилено',
    self_pickup_completed: 'Видано отримувачу',
    handed_over_to_self_pickup: 'Передано на самовивіз',
    shipped_courier_service: 'Відправлено кур\'єрською службою',
    delivered_courier_service: 'Доставлено кур\'єрською службою'
  };

  const NOT_READY_SHIPMENT_STATUS_CODES = new Set([
    'unprocessed',
    'tariff_request',
    'tariff_added',
    'tariff_sent',
    'tariff_lost',
    'awaiting_warehouse',
    'partially_received',
    'received_at_warehouse',
    'broker_recalculation',
    'tariff_under_review'
  ]);

  const NOT_READY_SHIPMENT_STATUS_LABELS = new Set(
    Array.from(NOT_READY_SHIPMENT_STATUS_CODES).map(code => SHIPMENT_STATUS_LABELS[code])
  );

  function getShipmentStatusLabel(status) {
    return SHIPMENT_STATUS_LABELS[status] || status || '—';
  }

  function isNotReadyShipmentStatus(status) {
    return NOT_READY_SHIPMENT_STATUS_CODES.has(status) || NOT_READY_SHIPMENT_STATUS_LABELS.has(status);
  }

  function resolveNotReadyStatus(tr) {
    if (isNotReadyShipmentStatus(tr.status)) return getShipmentStatusLabel(tr.status);
    if (isNotReadyShipmentStatus(tr.notReadyStatus)) return getShipmentStatusLabel(tr.notReadyStatus);
    return 'Отримано на складі';
  }

  function renderStatusBadge(status) {
    const label = getShipmentStatusLabel(status);
    const styles = {
      'Формування': 'bg-amber-50 text-amber-800 border-amber-300',
      'Завантажений': 'bg-emerald-50 text-emerald-800 border-emerald-300',
      'Спаковано': 'bg-emerald-50 text-emerald-800 border-emerald-300',
      'Формується': 'bg-amber-50 text-amber-800 border-amber-300',
      'Готовий до завантаження': 'bg-sky-50 text-sky-800 border-sky-300',
      'В дорозі': 'bg-indigo-50 text-indigo-800 border-indigo-300',
      'На митниці на експорт': 'bg-amber-50 text-amber-900 border-amber-300',
      'На митниці на імпорт': 'bg-amber-50 text-amber-900 border-amber-300',
      'На митниці відправки': 'bg-amber-50 text-amber-900 border-amber-300',
      'На митниці призначення': 'bg-amber-50 text-amber-900 border-amber-300',
      'Вивантажений': 'bg-sky-50 text-sky-800 border-sky-300',
      'Відправлено': 'bg-sky-50 text-sky-800 border-sky-300',
      'Завершений': 'bg-purple-50 text-purple-800 border-purple-300',
      'Прибув на склад отримання': 'bg-purple-50 text-purple-800 border-purple-300',
      'Вантаж видано отримувачам': 'bg-emerald-50 text-emerald-800 border-emerald-300',
      'Видано отримувачу': 'bg-emerald-50 text-emerald-800 border-emerald-300',
      'Очікує готовності': 'bg-slate-100 text-slate-700 border-slate-300',
      'Новий': 'bg-slate-100 text-slate-700 border-slate-300',
      'Необроблений запит': 'bg-slate-100 text-slate-700 border-slate-300',
      'Запит на тариф': 'bg-amber-50 text-amber-800 border-amber-300',
      'Додано тариф': 'bg-amber-50 text-amber-800 border-amber-300',
      'Відправлено тариф клієнту': 'bg-amber-50 text-amber-800 border-amber-300',
      'Програно тариф': 'bg-rose-50 text-rose-800 border-rose-300',
      'Очікується на складі': 'bg-amber-50 text-amber-800 border-amber-300',
      'Частково отримано на складі': 'bg-orange-50 text-orange-800 border-orange-300',
      'Отримано на складі': 'bg-amber-50 text-amber-800 border-amber-300',
      'Перерахунок брокера': 'bg-orange-50 text-orange-800 border-orange-300',
      'Тариф на узгодженні': 'bg-amber-50 text-amber-800 border-amber-300',
      'Вивантажено на складі призначення': 'bg-purple-50 text-purple-800 border-purple-300',
      'Готовий до видачі': 'bg-emerald-50 text-emerald-800 border-emerald-300',
      'Остання миля': 'bg-indigo-50 text-indigo-800 border-indigo-300',
      'Завершено': 'bg-emerald-50 text-emerald-800 border-emerald-300',
      'Проблеми з вантажем': 'bg-rose-50 text-rose-800 border-rose-300',
      'Відхилено': 'bg-rose-50 text-rose-800 border-rose-300',
      'Видано отримувачу': 'bg-emerald-50 text-emerald-800 border-emerald-300',
      'Передано на самовивіз': 'bg-sky-50 text-sky-800 border-sky-300',
      'Відправлено кур\'єрською службою': 'bg-indigo-50 text-indigo-800 border-indigo-300',
      'Доставлено кур\'єрською службою': 'bg-emerald-50 text-emerald-800 border-emerald-300'
    };
    const cls = styles[label] || 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return `<span class="px-2 py-0.5 rounded-full text-[9px] font-bold border ${cls}">${label}</span>`;
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
    // 1. Ті, що формуються / в роботі логіста (formation)
    if (status === 'Формування' || status === 'Формується' || status === 'formation') return 1;
    // 2. Завантажені (packed)
    if (status === 'Завантажений' || status === 'Спаковано' || status === 'packed') return 2;
    // 3. В дорозі / митниці / вивантажений (in_transit, at_export_customs, at_import_customs, despatched)
    if (status === 'В дорозі' || status === 'На митниці на експорт' || status === 'На митниці на імпорт' || status === 'Вивантажений' ||
        status === 'На митниці відправки' || status === 'На митниці призначення' || status === 'Відправлено' ||
        status === 'in_transit' || status === 'at_export_customs' || status === 'at_import_customs' || status === 'despatched') return 3;
    // 4. Завершений / прибув на склад / вантаж видано отримувачам (completed, cargo_released_to_recipient)
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
      if (!sv.receivingWarehouse) {
        if (sv.destinationCountry === 'Польща') sv.receivingWarehouse = 'Склад Варшава';
        else if (sv.destinationCountry === 'Україна') {
          if (sv.hub && sv.hub.includes('Львів')) sv.receivingWarehouse = 'Склад Львів (EU Gate)';
          else if (sv.hub && sv.hub.includes('Одеса')) sv.receivingWarehouse = 'Склад Одеса (Південний Хаб)';
          else sv.receivingWarehouse = 'Склад Київ-1';
        } else {
          sv.receivingWarehouse = sv.hub || `${sv.destinationCountry} (Хаб)`;
        }
      }
    });

    transportsData.forEach(tr => {
      // Непромарковані позиції — це завжди Вантажі (не перевезення)
      if (tr.readinessCategory === 'unmarked' && !tr.entityType) tr.entityType = 'cargo';
      if (!tr.readinessCategory && isNotReadyShipmentStatus(tr.status)) {
        tr.readinessCategory = 'not_ready';
      }
      if (tr.subvoyageId) {
        const sv = subVoyagesData.find(s => s.id === tr.subvoyageId);
        if (sv) {
          if (tr.readinessCategory === 'ready' || !tr.readinessCategory) {
            tr.status = sv.status;
          } else if (tr.readinessCategory === 'not_ready') {
            tr.status = resolveNotReadyStatus(tr);
            tr.notReadyStatus = tr.status;
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
        else if (tr.readinessCategory === 'not_ready') {
          tr.status = resolveNotReadyStatus(tr);
          tr.notReadyStatus = tr.status;
        }
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
        if (isNotReadyShipmentStatus(tr.status) || tr.status === 'Формування' || tr.status === 'Очікує готовності') {
          tr.readinessCategory = 'not_ready';
          tr.status = resolveNotReadyStatus(tr);
          tr.notReadyStatus = tr.status;
        } else if (tr.status === 'Готовий до завантаження' || tr.subvoyageId) {
          tr.readinessCategory = 'ready';
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
        weight: 3400,
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
            trackingNumber: 'SF1488291009901',
            receiveDate: '2026-10-14 09:40',
            warehouse: 'Склад Шеньчжень (Баоань)',
            warehouseLocation: 'Зона DG-1 • Палета P-01',
            titleUa: 'Промислові гібридні інвертори 30kW з LiFePO4 модулями',
            nameEn: 'Industrial Hybrid Inverters 30kW & LiFePO4 Packs',
            nameCn: '工业混合逆变器及磷酸铁锂电池组',
            contentDescription: 'Гібридні інвертори DEYE 30kW та акумуляторні шафи LiFePO4 (UN3480)',
            places: 12,
            grossWeight: 2100,
            volume: 8.5,
            length: 120,
            width: 100,
            height: 165,
            isOversized: true,
            packageType: 'Палети + Обрешітка',
            additionalServices: 'UN3480 маркування, Фотозвіт, Стрейчування',
            logistNote: 'Партія №1 повністю промаркована та готова до відвантаження',
            status: 'Готовий до завантаження'
          },
          {
            cargoId: 'ARR-9901-2',
            trackingNumber: 'YT9920114820012',
            receiveDate: '2026-10-15 14:15',
            warehouse: 'Склад Іу (Центральний)',
            warehouseLocation: 'Сектор B • Стелаж 08',
            titleUa: 'Силові кабелі DC, BMS контролери та монтажні шафи',
            nameEn: 'Solar DC Cables, BMS Controllers & Racks',
            nameCn: '光伏直流电缆及电池管理系统控制柜',
            contentDescription: 'Комплектуючі для монтажу СЕС, конектори MC4, автоматика захисту',
            places: 6,
            grossWeight: 800,
            volume: 3.6,
            length: 110,
            width: 80,
            height: 95,
            isOversized: false,
            packageType: 'Деревʼяні ящики',
            additionalServices: 'Перепакування, Перевірка комплектності',
            logistNote: 'Перевезено з Іу на консолідаційний хаб у Гуанчжоу',
            status: 'На складі відправки'
          },
          {
            cargoId: 'ARR-9901-3',
            trackingNumber: 'JD7781203948115',
            receiveDate: '2026-10-16 11:20',
            warehouse: 'Склад Гуанчжоу (Байюнь)',
            warehouseLocation: 'Зона консолідації C-04',
            titleUa: 'Запасні плати керування та дисплейні модулі моніторингу',
            nameEn: 'Spare Control PCBs & Smart Monitoring Displays',
            nameCn: '备用控制主板及智能监控显示屏',
            contentDescription: 'Електронні плати керування (крихкий вантаж, антистатичне пакування)',
            places: 4,
            grossWeight: 500,
            volume: 2.4,
            length: 80,
            width: 60,
            height: 75,
            isOversized: false,
            packageType: 'Коробки на палеті',
            additionalServices: 'Крихке маркування, Плівка пухирчаста',
            logistNote: 'Очікує фінальної перевірки серійних номерів за інвойсом',
            status: 'Очікує виконання завдання по вантажу'
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
        status: 'Частково отримано на складі',
        notReadyStatus: 'Частково отримано на складі',
        dateReady: '2026-10-21',
        volume: 9.2,
        weight: 1800,
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
            trackingNumber: 'SF6620194827101',
            receiveDate: '2026-10-13 10:15',
            warehouse: 'Склад Нінбо (Порт)',
            warehouseLocation: 'Зона A • Стелаж 14',
            titleUa: 'Керамічні високовольтні ізолятори (Партія 1)',
            nameEn: 'High-Voltage Ceramic Insulators (Batch 1)',
            nameCn: '高压陶瓷绝缘子（第一批）',
            contentDescription: 'Ізолятори порцелянові 35кВ у посилених гофроящиках',
            places: 24,
            grossWeight: 1200,
            volume: 5.8,
            length: 100,
            width: 80,
            height: 90,
            packageType: 'Коробки',
            additionalServices: 'Обрешітка, Крихке маркування',
            logistNote: 'Прийнято без пошкоджень',
            status: 'Зберігання на складі'
          },
          {
            cargoId: 'ARR-8410-2',
            trackingNumber: 'ZTO883920194822',
            receiveDate: '2026-10-16 16:45',
            warehouse: 'Склад Нінбо (Порт)',
            warehouseLocation: 'Зона приймання B-02',
            titleUa: ' Арматура СІП та натяжні затискачі (Партія 2)',
            nameEn: ' Overhead Line Fittings & Tension Clamps (Batch 2)',
            nameCn: '架空线路金具及耐张线夹（第二批）',
            contentDescription: 'Металева фурнітура для ЛЕП, оцинкована сталь',
            places: 14,
            grossWeight: 600,
            volume: 3.4,
            length: 90,
            width: 75,
            height: 80,
            packageType: 'Коробки',
            additionalServices: 'Зважування, Фотозвіт',
            logistNote: 'Очікує 3-тю досилку від постачальника з Іу',
            status: 'Очікує інші частини'
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
        status: 'Перерахунок брокера',
        notReadyStatus: 'Перерахунок брокера',
        dateReady: '2026-10-23',
        volume: 6.8,
        weight: 1400,
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
        cargoes: [
          {
            cargoId: 'ARR-8412-1',
            trackingNumber: 'SF-8412-01',
            titleUa: 'Акумуляторні пуско-зарядні пристрої 24V',
            nameEn: 'Heavy Duty Battery Jump Starters 24V',
            nameCn: '汽车应急启动电源',
            contentDescription: 'Палета з пусковими станціями (вбудовані Li-Ion батареї)',
            places: 8,
            grossWeight: 950,
            volume: 4.5,
            packageType: 'Палети',
            warehouseLocation: 'Склад Фошань · Зона C · Ряд 2',
            additionalServices: 'Перевірка MSDS, обрешітка кутів, фотофіксація',
            logistNote: 'Очікує підтвердження оплати за пакування',
            status: 'Очікує виконання завдання по вантажу'
          },
          {
            cargoId: 'ARR-8412-2',
            trackingNumber: 'SF-8412-02',
            titleUa: 'Комплекти силових кабелів та клем',
            nameEn: 'Power Cable Kits & Clamps',
            nameCn: '电源线及夹子套件',
            contentDescription: 'Мідні силові кабелі у посилених коробках',
            places: 4,
            grossWeight: 450,
            volume: 2.3,
            packageType: 'Коробки',
            warehouseLocation: 'Склад Фошань · Зона C · Ряд 2',
            additionalServices: 'Стрейчування, маркування DF',
            logistNote: 'Прийнято без пошкоджень, готово до консолідації з основною партією',
            status: 'На складі відправки'
          }
        ]
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
        weight: 3100,
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
        cargoes: [
          {
            cargoId: 'ARR-9015-1',
            trackingNumber: 'YT-9015-A',
            titleUa: 'Сонячні панелі монокристалічні 550W',
            nameEn: 'Monocrystalline Solar Panels 550W',
            nameCn: '单晶太阳能电池板 550W',
            contentDescription: 'Палетовані сонячні модулі в заводській обрешітці',
            places: 16,
            grossWeight: 2200,
            volume: 11.5,
            packageType: 'Палети',
            warehouseLocation: 'Склад Нінбо · Сектор A-1',
            additionalServices: 'Додаткова дерев\'яна обрешітка, датчики удару',
            logistNote: 'Перша частина обіцянки вже прибула на склад у Китаї',
            status: 'На складі відправки'
          },
          {
            cargoId: 'ARR-9015-2',
            trackingNumber: 'YT-9015-B',
            titleUa: 'Контролери заряду MPPT та інверторні шафи',
            nameEn: 'MPPT Charge Controllers & Inverter Cabinets',
            nameCn: 'MPPT太阳能控制器及逆变柜',
            contentDescription: 'Електронні блоки керування для СЕС',
            places: 8,
            grossWeight: 900,
            volume: 4.5,
            packageType: 'Ящики',
            warehouseLocation: 'Очікується від постачальника (Фошань)',
            additionalServices: 'Перевірка серійних номерів, вологозахисна плівка',
            logistNote: 'Очікується підвезення з фабрики до 25.10',
            status: 'Очікує інші частини'
          }
        ]
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
        weight: 900,
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
        cargoes: [
          {
            cargoId: 'ARR-9018-1',
            trackingNumber: 'DHL-9018-77',
            titleUa: 'Оптичні сенсори та лазерні далекоміри',
            nameEn: 'Optical Sensors & Laser Rangefinders',
            nameCn: '光学传感器和激光测距仪',
            contentDescription: 'Точна оптика в захисних кейсах (Крихке)',
            places: 18,
            grossWeight: 900,
            volume: 4.5,
            packageType: 'Коробки',
            warehouseLocation: 'Термінал Шеньчжень · Авіа-бокс #4',
            additionalServices: 'Маркування Fragile, термоізоляційна плівка',
            logistNote: 'Заброньовано під авіа-консолідацію на Варшаву',
            status: 'Готовий до завантаження'
          }
        ]
      },
      // Непромарковані — це НЕ перевезення, а фізичні ВАНТАЖІ (entityType: 'cargo'), прийняті на склад без маркування DF.
      // Вантаж ще не має типу перевезення (transport: null). Його можна додати до підрейсу; коли менеджер прорахує обіцянку та прив'яже до неї вантаж, позиція перейде в Обіцянку (entityType: 'promise').
      ...[
        {
          id: 'ARR-UNM-701', trackNumber: 'SF-99201', receiveDate: '2026-10-19', warehouseLocation: 'Зона B · Ряд 4 · Стелаж 2',
          contentDescription: 'Картонні коробки без маркування клієнта (побутова електроніка)', packagingType: 'Коробки',
          places: 15, weight: 850, volume: 5.4, length: 60, width: 40, height: 50,
          originCountry: 'Китай', destinationCountry: 'Україна', transport: null, hub: 'Центральний Хаб Київ (Гостомель)', logist: 'М. Бондар',
          markers: ['pkg_rigid', 'groupage', 'general', 'customs_cargo'], isHazardous: false, isOversized: false
        },
        {
          id: 'ARR-UNM-704', trackNumber: 'GATE3-0412', receiveDate: '2026-10-20', warehouseLocation: 'Ворота #3 · Майданчик негабариту',
          contentDescription: 'Металева конструкція в обрешітці, без документів', packagingType: 'Негабарит',
          places: 4, weight: 2100, volume: 7.2, length: 240, width: 120, height: 150,
          originCountry: 'Китай', destinationCountry: 'Польща', transport: null, hub: 'Транзитний хаб Варшава (Прушкув)', logist: 'О. Коваль',
          markers: ['oversized', 'adr', 'pkg_straps', 'multimodal'], isHazardous: true, isOversized: true
        },
        {
          id: 'ARR-UNM-709', trackNumber: 'YT-5508812', receiveDate: '2026-10-22', warehouseLocation: 'Зона A · Ряд 1 · Палетне місце 7',
          contentDescription: 'Палета з акумуляторними блоками, маркування пошкоджене', packagingType: 'Палети',
          places: 2, weight: 640, volume: 1.9, length: 120, width: 80, height: 100,
          originCountry: 'Китай', destinationCountry: 'Україна', transport: null, hub: 'Центральний Хаб Київ (Гостомель)', logist: 'І. Сидоренко',
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
          weight: 1600,
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
          cargoes: [
            {
              cargoId: 'ARR-9022-1',
              trackingNumber: 'SF-9022-A',
              titleUa: 'Промислові LED-світильники IP65 (200W)',
              nameEn: 'Industrial High-Bay LED Lights IP65',
              nameCn: '工业LED高棚灯 200W',
              contentDescription: 'Світильники в індивідуальних коробках на палетах',
              places: 6,
              grossWeight: 1000,
              volume: 5.5,
              packageType: 'Палети',
              warehouseLocation: 'Склад Фошань · Сектор B-3',
              additionalServices: 'Кутники жорсткості, палетування',
              logistNote: 'Перша частина заброньованої обіцянки прийнята на склад',
              status: 'На складі відправки'
            },
            {
              cargoId: 'ARR-9022-2',
              trackingNumber: 'SF-9022-B',
              titleUa: 'Блоки аварійного живлення з LiFePO4 акумуляторами',
              nameEn: 'Emergency Power Units with LiFePO4 Battery',
              nameCn: '应急电源模块',
              contentDescription: 'Аварійні драйвери освітлення',
              places: 4,
              grossWeight: 600,
              volume: 3.0,
              packageType: 'Палети',
              warehouseLocation: 'В дорозі від фабрики (Гуанчжоу)',
              additionalServices: 'Перевірка UN3481, маркування',
              logistNote: 'Очікуємо прибуття на склад до 24.10',
              status: 'Очікує інші частини'
            }
          ]
        });
      }
    }

    // 4. Збагачуємо сутності задачами (лише для частини Обіцянок та Перевезень, щоб у таблиці було видно різницю: є задача -> позначка, немає -> пусто)
    // та історією переміщень між складами для кожного вантажу (Ерайву)
    const sampleTasksByEntity = {
      'DF-9901-FULL': [
        { id: 'TSK-901', title: 'Перевірити сертифікат MSDS та UN38.3 на LiFePO4 модулі', assignee: 'О. Коваль', dueDate: '2026-10-18', status: 'В роботі' },
        { id: 'TSK-902', title: 'Погодити схему кріплення негабаритних палет у контейнері', assignee: 'І. Сидоренко', dueDate: '2026-10-19', status: 'Виконано' }
      ],
      'DF540-101': [
        { id: 'TSK-101', title: 'Закрити експортну декларацію EX-1 (FOB Nansha)', assignee: 'І. Сидоренко', dueDate: '2026-10-19', status: 'В роботі' }
      ],
      'DF540-103': [
        { id: 'TSK-103', title: 'Перевірити налаштування термореєстратора (+2..+8°C) перед вильотом', assignee: 'О. Ковальчук', dueDate: '2026-10-18', status: 'Виконано' }
      ],
      'DF-8410-NR': [
        { id: 'TSK-841', title: 'Отримати оригінал комерційного інвойсу від фабрики', assignee: 'І. Сидоренко', dueDate: '2026-10-21', status: 'В роботі' },
        { id: 'TSK-842', title: 'Консолідувати 3-тю партію ізоляторів після прибуття', assignee: 'І. Сидоренко', dueDate: '2026-10-22', status: 'В роботі' }
      ],
      'PRM-9015-PLAN': [
        { id: 'TSK-915', title: 'Підтвердити фінальний об\'єм обіцянки з клієнтом ТОВ ГрінТех', assignee: 'О. Коваль', dueDate: '2026-10-24', status: 'В роботі' }
      ],
      'PRM-9022-BOOKED': [
        { id: 'TSK-922', title: 'Проконтролювати заїзд 2-ї частини вантажу (ARR-9022-2) до закриття підрейсу', assignee: 'О. Коваль', dueDate: '2026-10-23', status: 'В роботі' }
      ]
    };

    const buildDefaultCargoMovementHistory = (cargoObj, parentEntity) => {
      const originCity = (parentEntity?.originCountry || 'Китай') === 'Китай' ? 'Склад Фошань (Китай, Термінал А)' : `Склад відправки (${parentEntity?.originCountry || 'Китай'})`;
      const transitHub = parentEntity?.routeStages?.includes('Польща')
        ? 'Транзитний хаб Варшава / Гданськ (Польща)'
        : 'Митний термінал перетину кордону';
      const finalHub = parentEntity?.hub || 'Центральний Хаб Київ (Гостомель)';
      const loc = cargoObj.warehouseLocation || parentEntity?.warehouseLocation || 'Зона A · Ряд 2 · Секція 1';
      const recDate = cargoObj.receiveDate || parentEntity?.dateReady || '2026-10-14';
      const svId = parentEntity?.subvoyageId || null;
      const svObj = svId ? subVoyagesData.find(s => s.id === svId) : null;

      const history = [
        {
          step: 1,
          warehouse: originCity,
          location: 'Зона приймання (Рампа #2)',
          operation: 'Приймання вантажу на склад відправки',
          status: 'Прийнято на склад',
          date: `${recDate} 09:40`,
          operator: parentEntity?.logist || 'І. Сидоренко',
          transportInfo: `Вхідний трек: ${cargoObj.trackingNumber || cargoObj.trackNumber || ('TRK-' + (cargoObj.cargoId || cargoObj.id))}`,
          comment: 'Зважування, обмір габаритів, вхідний фотозвіт та первинне маркування.'
        },
        {
          step: 2,
          warehouse: originCity,
          location: loc,
          operation: 'Складська обробка та розміщення у зоні зберігання',
          status: cargoObj.status || 'На складі відправки',
          date: `${recDate} 14:15`,
          operator: parentEntity?.logist || 'О. Коваль',
          transportInfo: `Пакування: ${cargoObj.packageType || cargoObj.packagingType || 'Палети'} (${cargoObj.places || 1} місць, ${cargoObj.volume || 1} м³)`,
          comment: cargoObj.logistNote || cargoObj.contentDescription || 'Розміщено на адресне зберігання, підготовлено до консолідації.'
        }
      ];

      if (svObj) {
        history.push({
          step: 3,
          warehouse: svObj.loadingPlace || originCity,
          location: `Зона комплектації підрейсу ${svObj.id}`,
          operation: `Комплектація у підрейс ${svObj.id} (${svObj.name})`,
          status: svObj.status === 'В дорозі' || svObj.status === 'Прибув на склад отримання' ? 'Відвантажено зі складу' : 'Заплановано до відвантаження',
          date: `${svObj.plannedDeparture || recDate} 18:00`,
          operator: svObj.logist || 'І. Сидоренко',
          transportInfo: `${svObj.transport || 'Транспорт'} • Плече: ${svObj.originCountry} ➔ ${svObj.destinationCountry}`,
          comment: `Прив'язано до підрейсу ${svObj.id}. Точка розвантаження підрейсу: ${svObj.unloadingPlace || svObj.destinationCountry}.`
        });
      }

      history.push({
        step: history.length + 1,
        warehouse: transitHub,
        location: 'Зона крос-докінгу та митного транзиту',
        operation: 'Транзитний перевантажувальний склад (Проміжний хаб)',
        status: svObj && svObj.status === 'Прибув на склад отримання' ? 'Пройдено транзит' : 'Маршрутна точка (План)',
        date: svObj?.plannedArrival ? `${svObj.plannedArrival} 11:00` : 'За графіком маршруту',
        operator: 'Черговий логіст хабу',
        transportInfo: `Маршрут: ${parentEntity?.transitSegment || (parentEntity?.originCountry + ' ➔ ' + parentEntity?.destinationCountry)}`,
        comment: 'Перевірка цілісності пломб, перевантаження / оформлення транзитної декларації Т1.'
      });

      history.push({
        step: history.length + 1,
        warehouse: finalHub,
        location: 'Термінал прибуття та видачі клієнту',
        operation: 'Кінцевий склад призначення',
        status: parentEntity?.status === 'Прибув на склад отримання' ? 'На складі призначення' : 'Очікується прибуття',
        date: parentEntity?.dateArrivalExpected || svObj?.plannedArrival || 'План прибуття',
        operator: parentEntity?.logist || 'М. Петренко',
        transportInfo: `Кінцевий пункт: ${parentEntity?.finalDestination || parentEntity?.destinationCountry || finalHub}`,
        comment: 'Фінальне розвантаження, звірка місць та передача на видачу / останню милю.'
      });

      return history;
    };

    transportsData.forEach(tr => {
      if (!Array.isArray(tr.tasks)) {
        tr.tasks = sampleTasksByEntity[tr.id] ? sampleTasksByEntity[tr.id].map(t => ({ ...t })) : [];
      }
      if (isUnmarkedCargo(tr)) {
        if (!Array.isArray(tr.movementHistory) || tr.movementHistory.length === 0) {
          tr.movementHistory = buildDefaultCargoMovementHistory(tr, tr);
        }
      }
      if (Array.isArray(tr.cargoes)) {
        tr.cargoes.forEach((c, cIdx) => {
          if (!c.cargoId) c.cargoId = `${tr.id}-CRG-${cIdx + 1}`;
          if (!c.trackingNumber) c.trackingNumber = `TRK-${c.cargoId}`;
          if (!c.receiveDate) c.receiveDate = tr.dateReady || '2026-10-12';
          if (!c.warehouse) c.warehouse = tr.originCountry === 'Китай' ? 'Склад Фошань (CN)' : (tr.hub || 'Склад відправки');
          if (!c.warehouseLocation) c.warehouseLocation = `Склад A · Секція ${cIdx + 1}-B`;
          if (!c.status) c.status = tr.readinessCategory === 'planned' ? 'Очікує інші частини' : 'Готовий до завантаження';
          if (!Array.isArray(c.movementHistory) || c.movementHistory.length === 0) {
            c.movementHistory = buildDefaultCargoMovementHistory(c, tr);
          }
        });
      }
    });

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
      if (activeSubvoyageId) {
        expandedSubvoyageIds.add(activeSubvoyageId);
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
              <div class="text-[11px] text-slate-600">${item.client || ''} • <strong class="font-mono">${item.volume} м³ | ${item.weight} кг | ${item.places} шт</strong></div>
            </div>
            <div class="flex items-center gap-1.5">
              <button type="button" onclick="detachShipmentFromSubvoyage('${item.id}'); window.closeSubvoyageDepartureBlockModal();"
                class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold transition cursor-pointer">
                <i class="fa-solid fa-xmark mr-1"></i>Прибрати з рейсу
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    modal.classList.remove('hidden');
  }

  window.changeSubvoyageStatusWithValidation = function (svId, newStatus, selectElement = null) {
    const sv = subVoyagesData.find(s => s.id === svId);
    if (!sv) return;

    const isDepartureOrTransitStatus = newStatus !== 'Формування' && newStatus !== 'Формується' && newStatus !== 'formation';
    if (isDepartureOrTransitStatus) {
      const blocking = getBlockingItemsForSubvoyage(sv.id);
      if (blocking.length > 0) {
        if (selectElement) selectElement.value = sv.status;
        if (currentSubvoyageStatusSelect && activeSubvoyageId === sv.id) {
          currentSubvoyageStatusSelect.value = sv.status;
        }
        openSubvoyageDepartureBlockModal(sv, newStatus, blocking);
        showToast(`Блокування відправки ${sv.id}: знайдено ${blocking.length} позицій без статусу «Готовий до завантаження»!`, true);
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

    const receiveDate = reportData.receiveDate || new Date().toISOString().slice(0, 16).replace('T', ' ');
    sv.status = 'Прибув на склад отримання';
    sv.actualArrival = receiveDate.split(' ')[0];
    sv.receivedAt = receiveDate;
    sv.acceptanceReport = reportData;
    selectedSubvoyageStatuses.add('Прибув на склад отримання');

    const reportByShipment = new Map();
    (reportData.shipmentsReport || []).forEach(r => {
      reportByShipment.set(r.rawId, r);
      reportByShipment.set(r.id, r);
    });
    let acceptedCount = 0;
    let shortageCount = 0;

    transportsData.forEach(tr => {
      if (tr.subvoyageId === sv.id) {
        const rep = reportByShipment.get(tr.id) || reportByShipment.get(tr.dfShipment) || {};
        // Недостача або пошкодження НЕ зупиняють роботу з вантажем — перевезення стає на баланс складу
        tr.status = 'Прибув на склад отримання';
        tr.readinessCategory = 'ready';
        tr.acceptedToday = true;
        if (rep.manager && !tr.manager) tr.manager = rep.manager;
        tr.acceptance = {
          subvoyageId: sv.id,
          receiveDate,
          damageLevel: rep.damageLevel || null,
          shortage: !!rep.shortage,
          shortagePlaces: rep.shortagePlaces || 0,
          expectedPlaces: rep.expectedPlaces ?? tr.places,
          receivedPlaces: (rep.expectedPlaces ?? tr.places ?? 0) - (rep.shortagePlaces || 0),
          notes: reportData.notes || ''
        };
        if (rep.shortage) {
          shortageCount++;
          if (!Array.isArray(tr.tasks)) tr.tasks = [];
          tr.tasks.unshift({
            id: `TSK-SH-${sv.id}-${tr.id}`,
            title: `Недостача ${rep.shortagePlaces} з ${tr.acceptance.expectedPlaces} місць при отриманні ${sv.id} — запустити компенсацію`,
            assignee: rep.manager || tr.manager || 'Відповідальний менеджер',
            dueDate: receiveDate.split(' ')[0],
            status: 'open',
            type: 'shortage'
          });
        }
        acceptedCount++;
      }
    });

    syncSubvoyageAndShipmentsStatuses();
    renderAll();

    if (typeof showToast === 'function') {
      const ntf = shortageCount > 0 ? ` Недостача у ${shortageCount} перевез. — менеджерам надіслано сповіщення.` : '';
      showToast(`Підрейс ${sv.id} прийнято на склад (${acceptedCount} перевезень на балансі).${ntf}`, shortageCount > 0);
    }
  };

  // Бейджі результату отримання на складі: ступінь пошкодження коробок + недостача (видно логістам і менеджерам)
  const ACCEPTANCE_DAMAGE_UI = {
    green: { label: 'Коробки: зелений', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500', desc: 'Коробки максимально мають вигляд, як при відправці з Китаю' },
    yellow: { label: 'Коробки: жовтий', cls: 'bg-amber-50 text-amber-900 border-amber-300', dot: 'bg-amber-400', desc: 'Коробки мають пошкодження, їх реально підремонтувати' },
    red: { label: 'Коробки: червоний', cls: 'bg-rose-50 text-rose-800 border-rose-300', dot: 'bg-rose-500', desc: 'Коробки критично пошкоджені, мокрі, потребують повну заміну пакування' }
  };
  function renderBlockingDepartureBadge(tr) {
    if (!tr || !tr.readinessCategory || tr.readinessCategory === 'ready') return '';
    const reasonMap = {
      planned: 'Обіцянка (плановий вантаж)',
      not_ready: 'Не готовий до завантаження',
      unmarked: 'Непромаркований вантаж'
    };
    const reason = reasonMap[tr.readinessCategory] || tr.status || 'Не готовий до завантаження';
    return `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300 inline-flex items-center gap-0.5 whitespace-nowrap" title="Блокує відправку підрейсу зі статусу «Формування» (${reason})">⛔ Блокує вихід</span>`;
  }
  window.renderBlockingDepartureBadge = renderBlockingDepartureBadge;

  function renderAcceptanceBadges(tr) {
    const acc = tr && tr.acceptance;
    if (!acc) return '';
    const dmg = ACCEPTANCE_DAMAGE_UI[acc.damageLevel];
    const dmgHtml = dmg ? `
      <span class="px-1.5 py-0.2 rounded border ${dmg.cls} text-[9px] font-bold inline-flex items-center gap-1 whitespace-nowrap" title="${dmg.label} — ${dmg.desc} (отримано ${acc.receiveDate || ''})">
        <span class="w-1.5 h-1.5 rounded-full ${dmg.dot}"></span>${dmg.label.replace('Коробки: ', '')}
      </span>` : '';
    const shortHtml = acc.shortage ? `
      <span class="px-1.5 py-0.2 rounded border bg-rose-100 text-rose-800 border-rose-300 text-[9px] font-bold inline-flex items-center gap-1 whitespace-nowrap" title="Недостача при отриманні ${acc.subvoyageId || ''}: не вистачає ${acc.shortagePlaces} з ${acc.expectedPlaces} місць. Менеджеру надіслано сповіщення.">
        <i class="fa-solid fa-box-open text-[8px]"></i>−${acc.shortagePlaces} шт
      </span>` : '';
    return dmgHtml + shortHtml;
  }
  window.renderAcceptanceBadges = renderAcceptanceBadges;

  function renderDrawerAcceptanceBlock(tr) {
    const tasksSec = document.getElementById('drawer-entity-tasks-section');
    if (!tasksSec) return;
    let block = document.getElementById('drawer-entity-acceptance-block');
    if (!block) {
      block = document.createElement('div');
      block.id = 'drawer-entity-acceptance-block';
      tasksSec.parentNode.insertBefore(block, tasksSec);
    }
    const acc = tr && tr.acceptance;
    if (!acc) {
      block.className = 'hidden';
      block.innerHTML = '';
      return;
    }
    const dmg = ACCEPTANCE_DAMAGE_UI[acc.damageLevel];
    block.className = `p-3 rounded-xl border space-y-1.5 ${acc.shortage || acc.damageLevel === 'red' ? 'bg-rose-50/60 border-rose-200' : acc.damageLevel === 'yellow' ? 'bg-amber-50/60 border-amber-200' : 'bg-emerald-50/50 border-emerald-200'}`;
    block.innerHTML = `
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1.5"><i class="fa-solid fa-clipboard-check text-indigo-600"></i>Отримання на складі (${acc.subvoyageId || '—'})</h4>
        <span class="text-[10px] font-mono text-slate-500">${acc.receiveDate || ''}</span>
      </div>
      ${dmg ? `<div class="text-[11px] flex items-start gap-1.5"><span class="mt-1 w-2 h-2 rounded-full ${dmg.dot} shrink-0"></span><span><strong>${dmg.label}</strong> — ${dmg.desc}</span></div>` : ''}
      <div class="text-[11px] ${acc.shortage ? 'text-rose-800 font-bold' : 'text-slate-600'}">
        ${acc.shortage
          ? `<i class="fa-solid fa-box-open mr-1"></i>Недостача: не вистачає ${acc.shortagePlaces} з ${acc.expectedPlaces} місць (отримано ${acc.receivedPlaces}). Менеджеру ${tr.manager ? `<strong>${tr.manager}</strong> ` : ''}надіслано сповіщення.`
          : `<i class="fa-solid fa-check mr-1 text-emerald-600"></i>Недостачі не виявлено (${acc.expectedPlaces} місць)`}
      </div>
      ${acc.notes ? `<div class="text-[10px] text-slate-500 italic">Примітка логіста: ${acc.notes}</div>` : ''}
    `;
  }

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

  // Реєстр складів отримання для підрейсів (для підрейсу можливий виключно один склад)
  const DEFAULT_RECEIVING_WAREHOUSES = [
    { id: 'poland', name: 'Склад Варшава', country: 'Польща', city: 'Варшава', address: 'ul. Logistyczna 12, 05-800 Pruszków (Warszawa)', flag: '🇵🇱', type: 'Партнерський' },
    { id: 'chelm', name: 'Склад Холм (Транзит)', country: 'Польща', city: 'Холм', address: 'Chelm, ul. Lwowska 88, 22-100 Chelm', flag: '🇵🇱', type: 'Партнерський' },
    { id: 'gdansk', name: 'Склад Гданськ (Портовий)', country: 'Польща', city: 'Гданськ', address: 'ul. Kontenerowa 9, 80-601 Gdańsk', flag: '🇵🇱', type: 'Партнерський' },
    { id: 'kyiv', name: 'Склад Київ-1', country: 'Україна', city: 'Київ', address: 'м. Київ, вул. Пирогівський шлях, 135', flag: '🇺🇦', type: 'Власний (Difreight)' },
    { id: 'lviv', name: 'Склад Львів (EU Gate)', country: 'Україна', city: 'Львів', address: 'м. Львів, вул. Городоцька, 280', flag: '🇺🇦', type: 'Партнерський' },
    { id: 'odesa', name: 'Склад Одеса (Південний Хаб)', country: 'Україна', city: 'Одеса', address: 'м. Одеса, вул. Балтська дорога, 14', flag: '🇺🇦', type: 'Партнерський' },
    { id: 'hamburg', name: 'Склад Гамбург (Хаб)', country: 'Німеччина', city: 'Гамбург', address: 'Altenwerder Hauptstraße 11, 21129 Hamburg', flag: '🇩🇪', type: 'Партнерський' },
    { id: 'foshan', name: 'New FOSHAN', country: 'Китай', city: 'Foshan', address: 'м. Фошань (Foshan), No. 18 Logistics Park', flag: '🇨🇳', type: 'Власний (Difreight)' },
    { id: 'shenzhen', name: 'Shenzhen Hub', country: 'Китай', city: 'Shenzhen', address: 'м. Шеньчжень (Shenzhen), Baoan Int. Logistics Center', flag: '🇨🇳', type: 'Партнерський' }
  ];

  function getStoredCustomWarehouses() {
    try {
      const raw = localStorage.getItem('erp_custom_warehouses');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCustomWarehouse(wh) {
    try {
      const list = getStoredCustomWarehouses();
      list.push(wh);
      localStorage.setItem('erp_custom_warehouses', JSON.stringify(list));
    } catch (e) {
      console.warn('Could not save custom warehouse', e);
    }
  }

  function getAllReceivingWarehouses() {
    const custom = getStoredCustomWarehouses();
    const map = new Map();
    DEFAULT_RECEIVING_WAREHOUSES.forEach(w => map.set(w.name, w));
    custom.forEach(w => map.set(w.name, w));
    return Array.from(map.values());
  }

  function updateWarehouseHintAndSync() {
    const select = document.getElementById('new-sv-receiving-warehouse');
    const hint = document.getElementById('new-sv-warehouse-hint');
    const destCountrySelect = document.getElementById('new-sv-dest-country');
    const unloadingInput = document.getElementById('new-sv-unloading-place');

    if (!select) return;

    const opt = select.selectedOptions ? select.selectedOptions[0] : null;
    if (opt && opt.value) {
      const country = opt.getAttribute('data-country');
      const city = opt.getAttribute('data-city');
      const address = opt.getAttribute('data-address');
      const type = opt.getAttribute('data-type');

      if (hint) {
        hint.innerHTML = `<span class="text-slate-600 font-medium"><i class="fa-solid fa-location-dot text-brand-500 mr-1"></i>${country ? country + ', ' : ''}${city || ''}${address ? ' • ' + address : ''} <span class="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 ml-1 font-normal">${type || 'Склад'}</span></span>`;
      }

      if (destCountrySelect && country) {
        const hasOpt = Array.from(destCountrySelect.options).some(o => o.value === country);
        if (hasOpt) destCountrySelect.value = country;
      }

      if (unloadingInput) {
        if (!unloadingInput.value || unloadingInput.value.includes('(Термінал') || unloadingInput.value.includes('Склад') || unloadingInput.value.includes('Порт') || unloadingInput.value.includes('Гданськ')) {
          unloadingInput.value = `${city || country}, ${opt.value}${address ? ' (' + address + ')' : ''}`;
        }
      }
    } else {
      if (hint) {
        hint.textContent = '';
      }
    }
  }

  function populateReceivingWarehousesSelect(selectedName = null, filterCountry = null) {
    const select = document.getElementById('new-sv-receiving-warehouse');
    if (!select) return;

    const warehouses = getAllReceivingWarehouses();
    let html = '<option value="">-- Оберіть склад отримання --</option>';

    warehouses.forEach(wh => {
      const flag = wh.flag || (wh.country === 'Україна' ? '🇺🇦' : wh.country === 'Польща' ? '🇵🇱' : wh.country === 'Китай' ? '🇨🇳' : wh.country === 'Німеччина' ? '🇩🇪' : '🏢');
      const isSel = selectedName ? (wh.name === selectedName) : (filterCountry && wh.country === filterCountry && !selectedName);
      html += `<option value="${wh.name}" data-country="${wh.country}" data-city="${wh.city || ''}" data-address="${wh.address || ''}" data-type="${wh.type || ''}" ${isSel ? 'selected' : ''}>${flag} ${wh.name} (${wh.city || wh.country})</option>`;
    });

    select.innerHTML = html;

    updateWarehouseHintAndSync();
  }

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
    const allModeRadio = document.querySelector('input[name="new-sv-cargo-mode"][value="all"]');
    if (allModeRadio) allModeRadio.checked = true;
    document.querySelectorAll('input[name="new-sv-key-marker"]').forEach(cb => { cb.checked = false; });

    const destCountry = document.getElementById('new-sv-dest-country')?.value || 'Польща';
    populateReceivingWarehousesSelect(null, destCountry);
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

    const receivingWarehouse = document.getElementById('new-sv-receiving-warehouse')?.value || '';

    const loadingPlace = document.getElementById('new-sv-loading-place')?.value.trim() || `${originCountry} (Термінал)`;
    const originPort = document.getElementById('new-sv-origin-port')?.value.trim() || `${originCountry}`;
    const unloadingPlace = document.getElementById('new-sv-unloading-place')?.value.trim() || (receivingWarehouse ? `${destCountry} (${receivingWarehouse})` : `${destCountry} (Термінал отримання)`);
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
    const cargoMode = document.querySelector('input[name="new-sv-cargo-mode"]:checked')?.value || 'all';
    const keyMarkers = Array.from(document.querySelectorAll('input[name="new-sv-key-marker"]:checked')).map(el => el.value);

    if (!name) {
      alert('Будь ласка, введіть назву підрейсу!');
      document.getElementById('new-sv-name')?.focus();
      return;
    }
    // Склад отримання: обов'язково обирається один склад
    if (!receivingWarehouse) {
      alert('Будь ласка, оберіть склад отримання!');
      document.getElementById('new-sv-receiving-warehouse')?.focus();
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
      receivingWarehouse: receivingWarehouse,
      destinationWarehouse: receivingWarehouse,
      routeStages: [originCountry, destCountry],
      hub: receivingWarehouse,
      transitSegment: `${originCountry} ➔ ${destCountry}`,
      plannedDeparture: etd || dateLoad || '2026-11-05',
      plannedArrival: eta,
      actualDeparture: atd,
      actualArrival: ata,
      maxPlaces: 600,
      maxWeight: 24000,
      maxVolume: 68.0,
      transport: currentModalTransport,
      cargoMode: cargoMode,
      keyMarkers: keyMarkers,
      temperatureSupported: keyMarkers.includes('temp_control'),
      adrPermitted: keyMarkers.length === 0 || keyMarkers.includes('adr'),
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
      comment: comment || `Підрейс закриває транспортне плече ${originCountry} ➔ ${destCountry}. Склад отримання: ${receivingWarehouse} (${unloadingPlace}).`
    };

    subVoyagesData.unshift(newSubvoyage);
    selectedSubvoyageStatuses.add(newSubvoyage.status);
    closeCreateSubvoyageModal();
    activeSubvoyageId = newSubvoyage.id;
    expandedSubvoyageIds.add(newSubvoyage.id);
    leftTableSubvoyageMode = 'pool';
    updateActiveSubvoyageState();
    setupSubvoyageDestinationHubOptions();
    renderAll();
    showToast(`Підрейс «${newSubvoyage.name}» (${newSubvoyage.id}) успішно створено! Склад отримання: ${newSubvoyage.receivingWarehouse} (${newSubvoyage.destinationCountry})`);
  };

  function setupSubvoyageFocusAndModalsActions() {
    // Склад отримання у формі створення підрейсу (тільки один склад)
    const receivingWhSelect = document.getElementById('new-sv-receiving-warehouse');
    if (receivingWhSelect) {
      receivingWhSelect.onchange = updateWarehouseHintAndSync;
    }
    const destCountrySelect = document.getElementById('new-sv-dest-country');
    if (destCountrySelect) {
      destCountrySelect.onchange = (e) => {
        const c = e.target.value;
        const whSelect = document.getElementById('new-sv-receiving-warehouse');
        if (!whSelect) return;
        const curOpt = whSelect.selectedOptions ? whSelect.selectedOptions[0] : null;
        if (curOpt && curOpt.getAttribute('data-country') === c) return;
        const matchOpt = Array.from(whSelect.options).find(o => o.getAttribute('data-country') === c);
        if (matchOpt) {
          whSelect.value = matchOpt.value;
          updateWarehouseHintAndSync();
        }
      };
    }

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
    const hubs = Array.from(new Set(subVoyagesData.map(sv => sv.receivingWarehouse || sv.hub))).filter(Boolean);

    const prevVal = subvoyageDestinationHubFilter.value || selectedDestinationHub || 'all';
    subvoyageDestinationHubFilter.innerHTML = `
      <option value="all">Усі склади доставки</option>
      ${hubs.map(h => `<option value="${h}" ${h === prevVal ? 'selected' : ''}>${h}</option>`).join('')}
    `;

    subvoyageDestinationHubFilter.onchange = (e) => {
      selectedDestinationHub = e.target.value;
      updateActiveSubvoyageState();
      renderAll();
    };
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
      if (selectedDestinationHub !== 'all' && sv.hub !== selectedDestinationHub && sv.receivingWarehouse !== selectedDestinationHub) return false;
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
  // Тип перевезення винесено окремо (не в списку маркерів!)
  function getAllShipmentMarkers(tr) {
    if (!tr) return [];
    const markers = [];
    const addedKeys = new Set();

    const pushMarker = (item) => {
      if (!item || addedKeys.has(item.key || item.id)) return;
      addedKeys.add(item.key || item.id);
      markers.push(item);
    };

    // 1. Прямі маркери з масиву tr.markers (виключаючи загальні маркери виду транспорту sea_freight/air_freight/rail_freight, оскільки тип перевезення відображається окремо)
    const transportModeCatalogIds = new Set(['sea_freight', 'air_freight', 'rail_freight']);
    if (Array.isArray(tr.markers)) {
      tr.markers.forEach(mKey => {
        if (transportModeCatalogIds.has(mKey)) return;
        const found = CARGO_MARKERS_CATALOG.find(c => c.id === mKey || c.name.toLowerCase() === String(mKey).toLowerCase() || c.shortLabel.toLowerCase() === String(mKey).toLowerCase());
        if (found && !transportModeCatalogIds.has(found.id)) {
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

    // 2. Логічний мапінг наявних полів перевезення на каталог маркерів
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

  // Розподіл маркерів на 3 логічні категорії:
  // 1) docs — Документи / Експорт
  // 2) loading — Складська робота / Завантаження
  // 3) special — Додаткові особливості: ADR, крихке, кріплення
  function getMarkerGroup(markerKey) {
    if (markerKey === 'pkg_straps') return 'special';
    const catItem = CARGO_MARKERS_CATALOG.find(c => c.id === markerKey);
    const cat = catItem ? catItem.category : '';
    if (cat === 'Митний статус та документи' || cat === 'Географія, дозволи та допуски') return 'docs';
    if (cat === 'Завантаження та формат відправки' || cat === 'Спосіб пакування та кріплення' || cat === 'Вид транспорту та рухомий склад') return 'loading';
    return 'special';
  }

  function renderMarkerListBadges(markers, emptyText = '—') {
    if (!markers || markers.length === 0) {
      return `<span class="text-[10px] text-slate-300 italic">${emptyText}</span>`;
    }
    const fullTooltip = markers.map(m => `• ${m.fullLabel}`).join('\n');
    const html = markers.map(m => {
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
    return `<div class="flex flex-wrap items-center gap-1 max-w-full" title="${fullTooltip}">${html}</div>`;
  }

  function getShipmentMarkerGroups(tr) {
    const all = getAllShipmentMarkers(tr);
    return {
      docs: all.filter(m => getMarkerGroup(m.key) === 'docs'),
      loading: all.filter(m => getMarkerGroup(m.key) === 'loading'),
      special: all.filter(m => getMarkerGroup(m.key) === 'special')
    };
  }

  // Спосіб перевезення: тільки іконка без бейджа та тексту (п.1)
  function renderCompactTransportTypeBadge(tr) {
    if (!tr || !tr.transport || isUnmarkedCargo(tr)) return '';
    const tIcon = getTransportIcon(tr.transport);
    return `<i class="${tIcon.icon} ${tIcon.color} text-[11px] shrink-0" title="Спосіб перевезення: ${tr.transport}${tr.loadingType ? ' (' + tr.loadingType + ')' : ''}"></i>`;
  }

  // Завдання в таблицях не відображаються — залишаються тільки в самих сутностях (п.2)
  function renderEntityTasksTableBadge(tr) {
    return '';
  }

  window.openContextDrawerToTasks = function (shipmentId, event) {
    if (event) event.stopPropagation();
    window.openContextDrawer(shipmentId);
    setTimeout(() => {
      const tasksSec = document.getElementById('drawer-entity-tasks-section');
      if (tasksSec) {
        tasksSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
        tasksSec.classList.add('ring-2', 'ring-amber-400');
        setTimeout(() => tasksSec.classList.remove('ring-2', 'ring-amber-400'), 1600);
      }
    }, 150);
  };

  // Значок активних завдань для Підрейсу (якщо хоча б в одному перевезенні є активна задача)
  function getSubvoyageActiveTasksInfo(svId) {
    const assigned = transportsData.filter(t => t.subvoyageId === svId);
    let activeTasksCount = 0;
    const taskDetails = [];

    assigned.forEach(tr => {
      if (Array.isArray(tr.tasks)) {
        tr.tasks.forEach(task => {
          const isActive = task && task.status !== 'Виконано' && task.status !== 'Завершено' && task.status !== 'done';
          if (isActive) {
            activeTasksCount++;
            taskDetails.push({
              shipmentId: tr.dfShipment || tr.id,
              title: task.title,
              assignee: task.assignee || tr.logist || 'Логіст',
              dueDate: task.dueDate || ''
            });
          }
        });
      }
    });

    return {
      hasActiveTasks: activeTasksCount > 0,
      count: activeTasksCount,
      tasks: taskDetails
    };
  }

  function renderSubvoyageTasksBadge(sv) {
    if (!sv || !sv.id) return '';
    const info = getSubvoyageActiveTasksInfo(sv.id);
    if (!info.hasActiveTasks) return '';

    const lines = info.tasks.map(t => `• [${t.shipmentId}] ${t.title}${t.assignee ? ' (' + t.assignee + ')' : ''}${t.dueDate ? ' — до ' + t.dueDate : ''}`).join('\n');
    const titleText = `Підрейс містить активні завдання (${info.count}):\n${lines}\n\nНатисніть, щоб розгорнути перевезення підрейсу.`;

    return `
      <button type="button" onclick="window.openSubvoyageTasksView('${sv.id}', event)"
        class="px-1.5 py-0.2 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-[9px] inline-flex items-center gap-1 shadow-2xs transition cursor-pointer"
        title="${titleText}">
        <i class="fa-solid fa-list-check text-amber-600 text-[8px]"></i>
        <span>Завдання: ${info.count}</span>
      </button>
    `;
  }

  window.openSubvoyageTasksView = function (svId, event) {
    if (event) event.stopPropagation();
    expandedSubvoyageIds.add(svId);
    selectActiveSubvoyage(svId);
    renderSubvoyagesTimeline();
  };

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
                    <th class="p-1.5">Документи / Експорт</th>
                    <th class="p-1.5">Склад / Завантаження</th>
                    <th class="p-1.5">Особливості</th>
                    <th class="p-1.5 text-center">Підрейс</th>
                    <th class="p-1.5 text-right">Інфо</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${assignedList.map(tr => {
        const isNonReady = tr.readinessCategory && tr.readinessCategory !== 'ready';
        const mGroups = getShipmentMarkerGroups(tr);
        return `
                      <tr class="hover:bg-slate-50 transition ${isNonReady ? 'bg-rose-50/40' : ''}" onclick="openContextDrawer('${tr.id}')">
                        <td class="p-1.5">
                          <div class="flex items-center gap-1 flex-wrap">
                            ${isUnmarkedCargo(tr) ? `<span class="px-1 py-0.2 rounded text-[9px] font-bold bg-slate-800 text-white" title="Це вантаж, а не перевезення">📦 Вантаж</span>` : ''}
                            <span class="font-mono font-bold text-brand-700 text-[10px]">${tr.dfShipment || tr.id}</span>
                            ${renderCompactTransportTypeBadge(tr)}
                            ${renderBlockingDepartureBadge(tr)}
                            ${renderAcceptanceBadges(tr)}
                          </div>
                        </td>
                        <td class="p-1.5 font-mono text-[10px] text-slate-700 whitespace-nowrap">
                          ${tr.dateReady || '—'}
                        </td>
                        <td class="p-1.5 font-mono text-[10px] text-slate-800 whitespace-nowrap">
                          <div><strong>${tr.volume}</strong> м³ | <strong>${tr.weight}</strong> кг | ${tr.places} шт</div>
                          <div class="text-[9px] ${tr.readinessCategory === 'planned' ? 'text-purple-700 font-bold' : 'text-emerald-700'}">
                            ${tr.readinessCategory === 'planned' ? 'Планові куби' : 'Фактичні куби'}
                          </div>
                        </td>
                        <td class="p-1.5">
                          ${renderMarkerListBadges(mGroups.docs)}
                        </td>
                        <td class="p-1.5">
                          ${renderMarkerListBadges(mGroups.loading)}
                        </td>
                        <td class="p-1.5">
                          ${renderMarkerListBadges(mGroups.special)}
                        </td>
                        <td class="p-1.5 text-center whitespace-nowrap" onclick="event.stopPropagation()">
                          <div class="inline-flex items-center gap-1">
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
              <span class="inline-flex items-center text-xs mr-0.5" title="Спосіб перевезення: ${sv.transport || '—'}"><i class="${getTransportIcon(sv.transport).icon} ${getTransportIcon(sv.transport).color}"></i></span>
              <span class="inline-flex items-center gap-1 bg-sky-50 text-sky-900 border border-sky-200 px-2 py-0.5 rounded-md font-bold text-[10px]" title="Маршрут підрейсу: ${sv.originCountry} ➔ ${sv.destinationCountry}">
                <i class="fa-solid fa-arrows-left-right text-sky-600"></i>
                <span>${sv.originCountry || 'Китай'} ➔ ${sv.destinationCountry || 'Польща'}</span>
              </span>
              <span class="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-bold text-[10px]" title="Склад отримання: ${sv.receivingWarehouse || sv.hub || '—'}">
                <i class="fa-solid fa-warehouse text-amber-700"></i>
                <span>${sv.receivingWarehouse || sv.hub || '—'}</span>
              </span>
              ${sv.cargoMode && sv.cargoMode !== 'all' ? `<span class="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold text-[10px]">${sv.cargoMode}</span>` : ''}
              ${Array.isArray(sv.keyMarkers) && sv.keyMarkers.length > 0 ? sv.keyMarkers.map(k => `<span class="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-bold text-[10px]">${SUBVOYAGE_KEY_MARKER_LABELS[k] || k}</span>`).join('') : ''}
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
                <span title="Вага"><strong>${Math.round(cap.weight)}</strong>/${sv.maxWeight} кг</span>
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
      expandedSubvoyageIds.add(svId);
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

  const SUBVOYAGE_KEY_MARKER_LABELS = {
    adr: '☣️ ADR (Небезпечний)',
    batt_li: '🔋 Батареї (Li-ion / АКБ)',
    close_exporter_docs: '📑 Закриття експорту',
    fragile: '🍷 Крихке',
    temp_control: '❄️ Температурний режим',
    oversized: '🚜 Негабарит'
  };

  function shipmentHasKeyMarker(tr, key) {
    if (!tr) return false;
    const markers = getAllShipmentMarkers(tr);
    const ids = new Set(markers.map(m => m.key));
    if (key === 'batt_li') return ids.has('batt_li') || ids.has('batt_lead') || ids.has('batt_waste');
    if (key === 'temp_control') {
      return ids.has('temp_deep_freeze') || ids.has('temp_fresh') || ids.has('temp_plus') || ids.has('temp_multi') || ids.has('truck_reefer');
    }
    return ids.has(key);
  }

  function isRouteCompatibleWithSubvoyage(tr, sv) {
    const svOrigin = (sv.originCountry || '').trim().toLowerCase();
    const svDest = (sv.destinationCountry || '').trim().toLowerCase();
    const trNodes = extractRouteNodes(tr);

    let routeMatches = false;
    if (svOrigin && svDest && trNodes.length >= 2) {
      const originIdx = trNodes.findIndex(n => isNodeMatchingStage(n, svOrigin));
      const destIdx = trNodes.findIndex((n, idx) => idx > originIdx && isNodeMatchingStage(n, svDest));
      if (originIdx !== -1 && destIdx !== -1 && destIdx > originIdx) {
        routeMatches = true;
      }
    }

    if (!routeMatches) {
      const trDest = (tr.destinationCountry || '').trim().toLowerCase();
      if (svDest && trDest && isNodeMatchingStage(trDest, svDest)) {
        if (!sv.hub || !tr.hub || sv.hub === tr.hub) {
          routeMatches = true;
        }
      }
    } else {
      const trDest = (tr.destinationCountry || '').trim().toLowerCase();
      const isFinalLegToSameCountry = svDest && trDest && isNodeMatchingStage(trDest, svDest) && trNodes.length <= 2;
      if (isFinalLegToSameCountry && sv.hub && tr.hub && sv.hub !== tr.hub) {
        routeMatches = false;
      }
    }
    return routeMatches;
  }

  // Порівняння базових параметрів підрейсу (напрямок, спосіб, тип карго/не карго, ключові маркери) з перевезенням
  function getSubvoyageShipmentConflicts(tr, sv) {
    const conflicts = [];
    if (!tr || !sv) return conflicts;

    // 1. Спосіб перевезення (Море / Авіа / Авто)
    if (sv.transport && tr.transport && tr.transport !== sv.transport) {
      conflicts.push({
        key: 'transport',
        paramLabel: 'Спосіб перевезення',
        svValue: sv.transport,
        trValue: tr.transport
      });
    }

    // 2. Напрямок / Маршрут
    if (!isRouteCompatibleWithSubvoyage(tr, sv)) {
      conflicts.push({
        key: 'route',
        paramLabel: 'Напрямок маршруту',
        svValue: `${sv.originCountry || '—'} ➔ ${sv.destinationCountry || '—'}`,
        trValue: tr.transitSegment || `${tr.originCountry || '—'} ➔ ${tr.destinationCountry || '—'}`
      });
    }

    // 3. Тип перевезення (Карго / Не карго)
    if (sv.cargoMode && sv.cargoMode !== 'all') {
      const isCargoTr = tr.cargoType === 'Карго';
      const wantsCargo = sv.cargoMode === 'Карго';
      if (wantsCargo !== isCargoTr) {
        conflicts.push({
          key: 'cargoMode',
          paramLabel: 'Тип (Карго / Не карго)',
          svValue: sv.cargoMode,
          trValue: tr.cargoType || 'Не вказано'
        });
      }
    }

    // 4. Ключові маркери, задані на підрейсі
    if (Array.isArray(sv.keyMarkers) && sv.keyMarkers.length > 0) {
      sv.keyMarkers.forEach(mKey => {
        if (!shipmentHasKeyMarker(tr, mKey)) {
          const label = SUBVOYAGE_KEY_MARKER_LABELS[mKey] || mKey;
          conflicts.push({
            key: `marker_${mKey}`,
            paramLabel: `Маркер підрейсу: ${label}`,
            svValue: `Потрібен ${label}`,
            trValue: 'Відсутній у перевезенні'
          });
        }
      });
    }

    // 5. Обмеження ADR / Температурного режиму на існуючих підрейсах
    if (sv.adrPermitted === false && shipmentHasKeyMarker(tr, 'adr')) {
      conflicts.push({
        key: 'adr_not_permitted',
        paramLabel: 'Допуск ADR',
        svValue: 'ADR заборонено',
        trValue: 'Небезпечний вантаж (ADR)'
      });
    }
    if (sv.temperatureSupported === false && shipmentHasKeyMarker(tr, 'temp_control')) {
      conflicts.push({
        key: 'temp_not_supported',
        paramLabel: 'Температурний режим',
        svValue: 'Без рефрижератора',
        trValue: 'Потребує температурного режиму'
      });
    }

    return conflicts;
  }

  function isShipmentCompatibleWithSubvoyage(tr, sv) {
    if (!tr || !sv) return false;
    if (tr.subvoyageId !== null) return false;
    return getSubvoyageShipmentConflicts(tr, sv).length === 0;
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

      // Блок 4.1: Швидкий перемикач за типом доставки (Море / Авіа / Авто) — для непромаркованих вантажів тип перевезення ще невідомий
      if (filters.deliveryMode && filters.deliveryMode !== 'all' && !isUnmarkedCargo(t) && t.transport !== filters.deliveryMode) {
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
        badgeHtml: `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${isTight ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}" title="Влазить у вільний залишок ${sv.id}. Залишиться після додавання: ${afterVolRem.toFixed(1)} м³ | ${Math.round(afterWeightRem)} кг | ${afterPlacesRem} місць">
          <i class="fa-solid fa-check text-[8px]"></i> Влазить (зал: ${remVol.toFixed(1)} м³ · ${Math.round(remWeight)} кг)
        </span>`,
        tooltip: `Влазить у залишок місця ${sv.id} (вільно: ${remVol.toFixed(1)} м³ / ${Math.round(remWeight)} кг / ${remPlaces} місць)`
      };
    }

    const overParts = [];
    if (overVol) overParts.push(`+${diffVol.toFixed(1)} м³`);
    if (overWeight) overParts.push(`+${Math.round(diffWeight)} кг`);
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
      badgeHtml: `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-300" title="Перевищує вільний залишок підрейсу ${sv.id}! Доступно: ${remVol.toFixed(1)} м³ | ${Math.round(remWeight)} кг | ${remPlaces} місць">
        <i class="fa-solid fa-triangle-exclamation text-[8px]"></i> Не влазить (${overParts.join(', ')})
      </span>`,
      tooltip: `УВАГА: Перевищує залишок місця у ${sv.id} (${overParts.join(', ')}). Вільно лише: ${remVol.toFixed(1)} м³ / ${Math.round(remWeight)} кг / ${remPlaces} місць`
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

    const colTitle = `Габарити ${currentSv ? '& Залишок' : '(м³ / кг / шт)'}`;

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
            <div><strong>${c.volume}</strong> м³ <span class="text-slate-300">|</span> <strong>${c.weight}</strong> кг <span class="text-slate-300">|</span> <span class="text-slate-500">${c.places} шт</span></div>
            ${fitInfo ? `<div class="mt-0.5 font-sans">${fitInfo.badgeHtml}</div>` : ''}
          </td>
          <td class="p-2">${renderCargoMarkerBadges(c)}</td>
          <td class="p-2 text-center whitespace-nowrap" onclick="event.stopPropagation()">${assignHtml}</td>
          <td class="p-2 text-right whitespace-nowrap" onclick="event.stopPropagation()">
            <div class="inline-flex items-center gap-1">
              <button onclick="openCargoInfoModal('${c.id}')" class="px-2 py-1 text-slate-600 hover:text-brand-700 rounded-lg border border-slate-200 hover:bg-slate-100 text-[10px] font-semibold inline-flex items-center gap-1 cursor-pointer" title="Інформація про вантаж">
                <i class="fa-solid fa-circle-info text-brand-600"></i><span>Інфо</span>
              </button>
            </div>
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

  // Картка ВАНТАЖУ (не перевезення): номер, трек, габарити, пакування, склад, маркери, історія переміщень, редагування
  function openCargoInfoModal(cargoId) {
    const c = transportsData.find(t => t.id === cargoId);
    if (!c) return;
    const sv = c.subvoyageId ? subVoyagesData.find(s => s.id === c.subvoyageId) : null;
    const historyList = Array.isArray(c.movementHistory) ? c.movementHistory : [];
    const row = (label, value) => `
      <div class="p-2 bg-slate-50 rounded-lg border border-slate-200">
        <div class="text-[10px] uppercase text-slate-500 font-bold">${label}</div>
        <div class="text-xs text-slate-900 font-semibold">${value ?? '—'}</div>
      </div>`;

    showCargoModal(`
      <div class="p-4 border-b border-slate-200 flex items-start justify-between gap-3 bg-slate-900 text-white rounded-t-2xl">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-600 text-white">📦 Картка вантажу (Ерайв)</span>
            <span class="font-mono font-extrabold text-brand-300 text-sm">${c.cargoNumber || c.id}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-200 border border-rose-400/30">${c.status || 'Непромаркований'}</span>
          </div>
          <div class="text-[11px] text-slate-400 mt-1">Спеціалізована картка вантажу: фізичні параметри, складська локація та історія переміщень між складами.</div>
        </div>
        <button onclick="closeCargoModal()" class="text-slate-400 hover:text-white cursor-pointer"><i class="fa-solid fa-xmark text-base"></i></button>
      </div>
      <div class="p-4 space-y-3 text-xs">
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          ${row('Номер вантажу (DF)', `<span class="font-mono">${c.cargoNumber || c.id}</span>`)}
          ${row('Трек-номер', `<span class="font-mono">${c.trackNumber || '—'}</span>`)}
          ${row('Дата отримання', c.receiveDate || c.dateReady)}
          ${row('Склад', c.hub || c.warehouse)}
          ${row('Локація на складі', c.warehouseLocation)}
          ${row('Підрейс', sv ? `${sv.name} (${sv.id})` : 'Не призначено')}
        </div>
        <div class="text-[11px] font-bold text-slate-700 uppercase">Фізичні показники та пакування</div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          ${row('Габарити місця (Д×Ш×В)', formatCargoDimensions(c))}
          ${row('Тип пакування', c.packagingType)}
          ${row('Кількість місць', `${c.places} шт`)}
          ${row('Вага брутто', `${c.weight} кг`)}
          ${row("Об'єм", `${c.volume} м³`)}
          ${row('Негабарит', c.isOversized ? 'Так' : 'Ні')}
        </div>
        ${row('Опис вмісту / Товар', c.contentDescription || c.titleUa)}
        ${c.logistNote ? row('Примітка логіста', c.logistNote) : ''}
        <div>
          <div class="text-[11px] font-bold text-slate-700 uppercase mb-1">Маркери вантажу</div>
          ${renderCargoMarkerBadges(c)}
        </div>

        <!-- Короткий блок історії переміщень між складами прямо в картці -->
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <i class="fa-solid fa-route text-brand-600"></i>
              <span>Історія переміщень між складами (${historyList.length})</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button type="button" onclick="window.openCargoMovementHistoryModal && window.openCargoMovementHistoryModal('${c.id}', null, event)"
                class="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer">
                <i class="fa-solid fa-route text-sky-600"></i> Історія переміщень між складами
              </button>
            </div>
          </div>
          <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            ${historyList.map((st, idx) => `
              <div class="bg-white p-2 rounded-lg border border-slate-200 flex items-start justify-between gap-2 text-[11px]">
                <div class="flex items-start gap-2">
                  <span class="w-5 h-5 rounded-full bg-brand-100 text-brand-800 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">${idx + 1}</span>
                  <div>
                    <div class="font-bold text-slate-800">${st.warehouse} <span class="text-slate-400 font-normal">• ${st.location || 'Термінал'}</span></div>
                    <div class="text-[10px] text-slate-600">${st.operation}</div>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <span class="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold block">${st.status}</span>
                  <span class="text-[9px] font-mono text-slate-400">${st.date}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex flex-wrap justify-between items-center gap-2">
        <div class="flex items-center gap-2">
          <button type="button" onclick="window.openEditCargoModal && window.openEditCargoModal('${c.id}', null, event)"
            class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs">
            <i class="fa-regular fa-pen-to-square"></i> Редагувати вантаж
          </button>
        </div>
        <button onclick="closeCargoModal()" class="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold cursor-pointer hover:bg-slate-100">Закрити</button>
      </div>
    `);
  }
  window.openCargoInfoModal = openCargoInfoModal;

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
      <th class="p-2">Документи / Експорт</th>
      <th class="p-2">Склад / Завантаження</th>
      <th class="p-2">Особливості</th>
      <th class="p-2 text-center">Підрейс (пул)</th>
      <th class="p-2 text-right">Інформація</th>
    `;

    const readinessTitleMap = {
      ready: 'Готові до завантаження',
      not_ready: 'Не готові до завантаження',
      planned: 'Планові (обіцянки)',
      unmarked: 'Непромарковані',
      all: 'Усі позиції'
    };
    const activeReadinessTitle = readinessTitleMap[filters.quickFilter] || 'Готові до завантаження';

    if (list.length === 0) {
      const emptyMsg = currentSv && !isRecommendationFilterIgnored
        ? `Немає рекомендованих перевезень категорії «${activeReadinessTitle}» за заданими параметрами підрейсу (${currentSv.transport}, ${currentSv.originCountry} ➔ ${currentSv.destinationCountry}${currentSv.cargoMode && currentSv.cargoMode !== 'all' ? ', ' + currentSv.cargoMode : ''}). Натисніть «Скинути рекомендації» зверху або перемкніть вкладку готовності.`
        : `Немає перевезень у категорії «${activeReadinessTitle}» за обраними фільтрами`;
      tbodyUnassignedShipments.innerHTML = `
        <tr>
          <td colspan="8" class="p-8 text-center text-slate-400 italic">
            ${emptyMsg}
          </td>
        </tr>
      `;
      return;
    }

    tbodyUnassignedShipments.innerHTML = paginatedList.map(tr => {
      const isSelected = selectedUnassignedIds.has(tr.id);
      const mGroups = getShipmentMarkerGroups(tr);
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

      return `
        <tr class="hover:bg-slate-50 transition cursor-pointer ${isSelected ? 'bg-brand-50/50' : (fitInfo && !fitInfo.fits) ? 'bg-rose-50/30' : isRecommendedForActiveSv ? 'bg-emerald-50/30' : isExceptionCandidate ? 'bg-amber-50/20' : ''}" onclick="handleShipmentRowClick('${tr.id}', event)">
          <!-- 1. Номер -->
          <td class="p-2">
            <div class="flex items-center gap-2 min-w-0">
              <input type="checkbox" value="${tr.id}" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation()" class="cb-unassigned-shipment rounded text-brand-600 cursor-pointer shrink-0">
              <div class="flex items-center gap-1.5 flex-wrap min-w-0">
                <span class="font-mono font-bold text-brand-700 text-xs">${tr.dfShipment || tr.id}</span>
                ${renderCompactTransportTypeBadge(tr)}
                ${renderAcceptanceBadges(tr)}
              </div>
            </div>
          </td>
          <!-- 2. Дата готовності -->
          <td class="p-2 font-mono text-[11px] font-bold text-slate-700 whitespace-nowrap">
            <i class="fa-regular fa-calendar text-slate-400 mr-1"></i>${readyDateStr}
          </td>
          <!-- 3. Габарити -->
          <td class="p-2 font-mono text-[11px] text-slate-700 whitespace-nowrap">
            <div><strong>${tr.volume}</strong> м³ <span class="text-slate-300">|</span> <strong>${tr.weight}</strong> кг <span class="text-slate-300">|</span> <span class="text-slate-500">${tr.places} шт</span></div>
            ${fitInfo ? `<div class="mt-0.5 font-sans">${fitInfo.badgeHtml}</div>` : ''}
          </td>
          <!-- 4-6. Маркери (3 логічні категорії) -->
          <td class="p-2">${renderMarkerListBadges(mGroups.docs)}</td>
          <td class="p-2">${renderMarkerListBadges(mGroups.loading)}</td>
          <td class="p-2">${renderMarkerListBadges(mGroups.special)}</td>
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
        bulkSelectedCounter.innerHTML = `Обрано: <strong class="text-brand-700">${selectedUnassignedIds.size}</strong> перевезень (<strong class="text-slate-700">${selVol.toFixed(1)} м³</strong> | <strong class="text-slate-700">${Math.round(selWeight)} кг</strong> | ${selPlaces} шт)`;
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
      const deltaWeightBadge = cap.deltaWeight > 0 ? `<span class="bg-brand-100 text-brand-900 border border-brand-300 px-2 py-0.5 rounded-full font-bold text-[10px]">+${Math.round(cap.deltaWeight)} кг</span>` : '';
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
    if (svWeightText) svWeightText.textContent = Math.round(cap.weight);
    const svWeightMax = document.getElementById('active-sv-weight-max');
    if (svWeightMax) svWeightMax.textContent = currentSv.maxWeight;
    const svWeightDelta = document.getElementById('active-sv-weight-delta');
    if (svWeightDelta) svWeightDelta.textContent = cap.deltaWeight > 0 ? `(+${Math.round(cap.deltaWeight)})` : '';

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
    if (subvoyageTotalWeight) subvoyageTotalWeight.textContent = Math.round(cap.weight);
    if (subvoyageMaxWeight) subvoyageMaxWeight.textContent = currentSv.maxWeight;
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
                ${routeInfo}
                ${renderAcceptanceBadges(tr)}
              </div>
            </td>
            <td class="p-1.5 font-mono text-[10px] text-slate-700 whitespace-nowrap">
              <div><strong>${tr.volume}</strong> м³ | <strong>${tr.weight}</strong> кг</div>
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

  // ============================================================================
  // НОВІ МОЖЛИВОСТІ (П.1 - П.5):
  // 1. Редагування вантажу (в межах Обіцянки / Перевезення та Непромаркованого вантажу)
  // 2. Пошук вантажу по полям і статусам в рамках Обіцянки або Перевезення (всередині сутності)
  // 3. Задачі до Обіцянки та Перевезення (з мінімалістичною позначкою у таблиці тільки при наявності)
  // 4. Тип перевезення окремо від маркерів (компактний бейдж у таблицях та картках)
  // 5. Спеціалізовані картки вантажу (Ерайву): Історія переміщень між складами з друком маршруту
  // ============================================================================

  let currentDrawerEntityId = null;
  let drawerCargoSearchQuery = '';
  let drawerCargoStatusFilter = 'ALL';

  const ALL_CARGO_STATUSES = [
    'Новий',
    'На складі відправки',
    'Отримано непромаркованим',
    'Передано',
    'Передано логісту на маркування',
    'Зберігання на складі',
    'Очікує інші частини',
    'Очікує готовності',
    'Готовий до завантаження',
    'В дорозі',
    'На складі призначення',
    'Виданий',
    'Повернено клієнту',
    'Очікує виконання завдання по вантажу'
  ];

  function renderCargoStatusBadge(status) {
    const s = String(status || 'На складі відправки');
    let cls = 'bg-slate-100 text-slate-700 border-slate-200';
    let icon = 'fa-solid fa-box';
    if (s.includes('Готовий') || s.includes('Виданий')) {
      cls = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      icon = 'fa-solid fa-circle-check text-emerald-600';
    } else if (s.includes('В дорозі') || s.includes('Передано')) {
      cls = 'bg-sky-50 text-sky-800 border-sky-200';
      icon = 'fa-solid fa-truck-fast text-sky-600';
    } else if (s.includes('Очікує') || s.includes('маркування')) {
      cls = 'bg-amber-50 text-amber-800 border-amber-200';
      icon = 'fa-solid fa-clock text-amber-600';
    } else if (s.includes('непромаркованим') || s.includes('Повернено')) {
      cls = 'bg-rose-50 text-rose-800 border-rose-200';
      icon = 'fa-solid fa-tag text-rose-600';
    } else if (s.includes('складі') || s.includes('Зберігання')) {
      cls = 'bg-indigo-50 text-indigo-800 border-indigo-200';
      icon = 'fa-solid fa-warehouse text-indigo-600';
    }
    return `<span class="px-2 py-0.5 rounded-md border ${cls} text-[10px] font-bold inline-flex items-center gap-1 shadow-2xs"><i class="${icon} text-[9px]"></i><span>${s}</span></span>`;
  }

  // --- П.3: Задачі для Обіцянки та Перевезення ---
  function renderDrawerEntityTasks(tr) {
    if (!tr) return;
    if (!Array.isArray(tr.tasks)) tr.tasks = [];
    renderDrawerAcceptanceBlock(tr);

    const isPromise = tr.readinessCategory === 'planned' || tr.entityType === 'promise';
    const entityLabel = isPromise ? 'Обіцянці' : 'Перевезенню';
    const headingEl = document.getElementById('drawer-tasks-heading');
    if (headingEl) {
      headingEl.textContent = `Задачі по ${entityLabel}`;
    }

    const counterEl = document.getElementById('drawer-tasks-counter-badge');
    const openCount = tr.tasks.filter(t => t.status !== 'done').length;
    const totalCount = tr.tasks.length;
    if (counterEl) {
      if (totalCount === 0) {
        counterEl.className = 'px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold';
        counterEl.textContent = '0 задач';
      } else if (openCount > 0) {
        counterEl.className = 'px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold';
        counterEl.textContent = `${openCount} активн. / ${totalCount}`;
      } else {
        counterEl.className = 'px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold';
        counterEl.textContent = `Усі виконані (${totalCount})`;
      }
    }

    const listEl = document.getElementById('drawer-entity-tasks-list');
    if (!listEl) return;

    if (tr.tasks.length === 0) {
      listEl.innerHTML = `
        <div class="py-2.5 px-3 bg-white rounded-lg border border-dashed border-slate-200 text-[11px] text-slate-400 italic flex items-center gap-1.5">
          <i class="fa-regular fa-circle-check text-slate-300"></i>
          <span>Актуальні задачі по ${entityLabel.toLowerCase()} відсутні</span>
        </div>
      `;
      return;
    }

    listEl.innerHTML = tr.tasks.map(task => {
      const isDone = task.status === 'done';
      return `
        <div class="p-2.5 rounded-lg border ${isDone ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-white border-amber-200 shadow-2xs'} flex items-start justify-between gap-2.5 transition">
          <div class="flex items-start gap-2 min-w-0">
            <span class="mt-0.5 w-4 h-4 rounded-full ${isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} flex items-center justify-center shrink-0 text-[9px] font-bold">
              <i class="fa-solid ${isDone ? 'fa-check' : 'fa-clock'}"></i>
            </span>
            <div class="min-w-0">
              <div class="text-xs font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-800'} leading-snug break-words">${task.title}</div>
              <div class="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-500">
                <span class="inline-flex items-center gap-1"><i class="fa-regular fa-user text-slate-400"></i> ${task.assignee || tr.logist || 'Логіст'}</span>
                <span>•</span>
                <span class="inline-flex items-center gap-1 font-mono"><i class="fa-regular fa-calendar text-slate-400"></i> до ${task.dueDate || '—'}</span>
                <span class="px-1.5 py-0.2 rounded text-[9px] font-bold ${isDone ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}">
                  ${isDone ? 'Виконано' : 'В роботі'}
                </span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  window.toggleEntityTaskForm = function () { };
  window.submitNewEntityTask = function () { };
  window.toggleEntityTaskStatus = function (entityId, taskId) {
    const tr = transportsData.find(t => t.id === entityId);
    if (!tr || !Array.isArray(tr.tasks)) return;
    const task = tr.tasks.find(t => t.id === taskId);
    if (!task) return;
    task.status = task.status === 'done' ? 'open' : 'done';
    renderDrawerEntityTasks(tr);
    renderAll();
  };
  window.deleteEntityTask = function () { };

  // --- П.2: Пошук вантажу по полям і статусам в рамках Обіцянки або Перевезення ---
  function populateDrawerCargoStatusOptions(tr) {
    const selectEl = document.getElementById('drawer-cargo-status-filter');
    if (!selectEl || !tr) return;
    const cargoes = Array.isArray(tr.cargoes) ? tr.cargoes : [];
    const statusCounts = {};
    cargoes.forEach(c => {
      const st = c.status || 'На складі відправки';
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    const presentStatuses = Object.keys(statusCounts);
    const otherStatuses = ALL_CARGO_STATUSES.filter(st => !statusCounts[st]);

    let html = `<option value="ALL">Усі статуси вантажів (${cargoes.length})</option>`;
    if (presentStatuses.length > 0) {
      html += `<optgroup label="Наявні статуси у сутності">`;
      presentStatuses.forEach(st => {
        html += `<option value="${st}">${st} (${statusCounts[st]})</option>`;
      });
      html += `</optgroup>`;
    }
    html += `<optgroup label="Довідник статусів вантажу">`;
    otherStatuses.forEach(st => {
      html += `<option value="${st}">${st} (0)</option>`;
    });
    html += `</optgroup>`;

    selectEl.innerHTML = html;
    selectEl.value = drawerCargoStatusFilter || 'ALL';
  }

  window.handleDrawerCargoFilterChange = function () {
    const searchInputEl = document.getElementById('drawer-cargo-search-input');
    const clearBtnEl = document.getElementById('drawer-cargo-search-clear');
    const statusSelectEl = document.getElementById('drawer-cargo-status-filter');

    drawerCargoSearchQuery = searchInputEl ? searchInputEl.value.trim() : '';
    drawerCargoStatusFilter = statusSelectEl ? statusSelectEl.value : 'ALL';

    if (clearBtnEl) {
      if (drawerCargoSearchQuery.length > 0) {
        clearBtnEl.classList.remove('hidden');
      } else {
        clearBtnEl.classList.add('hidden');
      }
    }

    const tr = transportsData.find(t => t.id === currentDrawerEntityId);
    if (tr) renderDrawerCargoesSection(tr);
  };

  window.resetDrawerCargoFilters = function () {
    drawerCargoSearchQuery = '';
    drawerCargoStatusFilter = 'ALL';
    const searchInputEl = document.getElementById('drawer-cargo-search-input');
    const clearBtnEl = document.getElementById('drawer-cargo-search-clear');
    const statusSelectEl = document.getElementById('drawer-cargo-status-filter');
    if (searchInputEl) searchInputEl.value = '';
    if (clearBtnEl) clearBtnEl.classList.add('hidden');
    if (statusSelectEl) statusSelectEl.value = 'ALL';
    const tr = transportsData.find(t => t.id === currentDrawerEntityId);
    if (tr) renderDrawerCargoesSection(tr);
  };

  function renderDrawerCargoesSection(tr) {
    if (!tr || !drawerCargoesList) return;
    const allCargoes = Array.isArray(tr.cargoes) ? tr.cargoes : [];
    const q = (drawerCargoSearchQuery || '').toLowerCase();
    const stFilter = drawerCargoStatusFilter || 'ALL';

    const filtered = allCargoes.filter(c => {
      if (stFilter !== 'ALL' && (c.status || 'На складі відправки') !== stFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        c.cargoId,
        c.trackingNumber,
        c.titleUa,
        c.nameEn,
        c.nameCn,
        c.contentDescription,
        c.warehouse,
        c.warehouseLocation,
        c.packageType,
        c.additionalServices,
        c.logistNote,
        c.status,
        `${c.places || ''} місць`,
        `${c.grossWeight || ''} кг`,
        `${c.volume || ''} м3`,
        `${c.length || ''}x${c.width || ''}x${c.height || ''}`
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });

    if (drawerCargoCount) {
      if (filtered.length === allCargoes.length) {
        drawerCargoCount.textContent = `Всього: ${allCargoes.length} од.`;
      } else {
        drawerCargoCount.textContent = `Знайдено: ${filtered.length} з ${allCargoes.length} од.`;
      }
    }

    const isPromise = tr.readinessCategory === 'planned' || tr.entityType === 'promise';
    const entityWord = isPromise ? 'Обіцянки' : 'Перевезення';

    if (allCargoes.length === 0) {
      drawerCargoesList.innerHTML = `
        <div class="p-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 space-y-2">
          <div>У складі цього ${entityWord.toLowerCase()} ще немає доданих вантажів (Ерайвів).</div>
          <button type="button" onclick="window.openEditCargoModal('${tr.id}', '__NEW__', event)"
            class="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer">
            <i class="fa-solid fa-plus"></i> Додати вантаж
          </button>
        </div>
      `;
      return;
    }

    if (filtered.length === 0) {
      drawerCargoesList.innerHTML = `
        <div class="p-4 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
          <div>За пошуковим запитом або статусом у межах цієї ${entityWord.toLowerCase()} вантажів не знайдено.</div>
          <button type="button" onclick="window.resetDrawerCargoFilters()"
            class="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-[11px] cursor-pointer">
            Скинути фільтри пошуку вантажу
          </button>
        </div>
      `;
      return;
    }

    drawerCargoesList.innerHTML = filtered.map(c => {
      const dims = (c.length && c.width && c.height) ? `${c.length}×${c.width}×${c.height} см` : 'Стандарт';
      return `
        <div class="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-brand-300 shadow-2xs transition space-y-3">
          <!-- Шапка вантажу: DF номер, трек, статус, дата отримання та 2 дії: "Історія переміщень між складами" і "Редагувати" -->
          <div class="flex items-start justify-between gap-2.5 flex-wrap">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-mono font-extrabold text-xs text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
                <i class="fa-solid fa-cube text-[10px] mr-1"></i>${c.cargoId}
              </span>
              ${c.trackingNumber ? `<span class="font-mono text-[11px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md" title="Трек-номер"><i class="fa-solid fa-barcode text-slate-400 mr-1"></i>${c.trackingNumber}</span>` : ''}
              ${renderCargoStatusBadge(c.status)}
              ${c.receiveDate ? `<span class="font-mono text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded" title="Дата отримання на складі"><i class="fa-regular fa-calendar-check text-slate-400 mr-1"></i>${c.receiveDate}</span>` : ''}
            </div>

            <div class="flex items-center gap-1.5 flex-wrap">
              <button type="button" onclick="window.openCargoMovementHistoryModal('${tr.id}', '${c.cargoId}', event)"
                class="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                title="Історія переміщень">
                <i class="fa-solid fa-route text-sky-600"></i>
                <span>Історія переміщень</span>
              </button>
              <button type="button" onclick="window.openEditCargoModal('${tr.id}', '${c.cargoId}', event)"
                class="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                title="Редагувати вантаж">
                <i class="fa-regular fa-pen-to-square text-indigo-600"></i>
                <span>Редагувати</span>
              </button>
            </div>
          </div>

          <!-- Повні дані про товар: UA, EN, CN та опис вмісту прямо в картці -->
          <div>
            <div class="text-sm font-bold text-slate-900">${c.titleUa || c.contentDescription || 'Вантаж'}</div>
            ${(c.nameEn || c.nameCn) ? `
              <div class="text-xs text-slate-500 flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-0.5">
                ${c.nameEn ? `<span><strong class="text-slate-600">EN:</strong> ${c.nameEn}</span>` : ''}
                ${(c.nameEn && c.nameCn) ? `<span class="text-slate-300">•</span>` : ''}
                ${c.nameCn ? `<span><strong class="text-slate-600">CN:</strong> ${c.nameCn}</span>` : ''}
              </div>
            ` : ''}
            ${(c.contentDescription && c.contentDescription !== c.titleUa) ? `
              <div class="text-xs text-slate-600 mt-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                <span class="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Опис вмісту:</span>
                ${c.contentDescription}
              </div>
            ` : ''}
          </div>

          <!-- Повна сітка параметрів: склад, локація, пакування, місця, вага, об'єм, габарити, негабарит -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Поточний склад</span>
              <span class="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <i class="fa-solid fa-warehouse text-amber-600 text-[11px]"></i>
                <span>${c.warehouse || tr.hub || 'Склад відправки'}</span>
              </span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Локація на складі</span>
              <span class="font-semibold text-slate-800 mt-0.5 block">${c.warehouseLocation || 'Зона A • Стелаж 01'}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Тип пакування</span>
              <span class="font-semibold text-slate-800 mt-0.5 block">${c.packageType || 'Палети'}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block">К-сть місць</span>
              <span class="font-mono font-bold text-slate-900 mt-0.5 block">${c.places || 0} шт</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Вага брутто</span>
              <span class="font-mono font-bold text-slate-900 mt-0.5 block">${c.grossWeight || 0} кг</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Об'єм</span>
              <span class="font-mono font-bold text-slate-900 mt-0.5 block">${c.volume || 0} м³</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Габарити (Д×Ш×В)</span>
              <span class="font-mono font-semibold text-slate-800 mt-0.5 block">${dims}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Негабаритний</span>
              <span class="font-bold mt-0.5 block ${c.isOversized ? 'text-rose-600' : 'text-slate-600'}">
                ${c.isOversized ? 'Так (Негабарит)' : 'Ні (Стандарт)'}
              </span>
            </div>
          </div>

          <!-- Додаткові послуги та примітка логіста -->
          ${(c.additionalServices || c.logistNote) ? `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              ${c.additionalServices ? `
                <div class="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100 text-indigo-900">
                  <span class="text-[10px] font-bold uppercase text-indigo-600 block mb-0.5"><i class="fa-solid fa-screwdriver-wrench mr-1"></i>Додаткові послуги на складі:</span>
                  <span>${c.additionalServices}</span>
                </div>
              ` : ''}
              ${c.logistNote ? `
                <div class="bg-amber-50/70 p-2 rounded-lg border border-amber-200 text-amber-900">
                  <span class="text-[10px] font-bold uppercase text-amber-700 block mb-0.5"><i class="fa-regular fa-comment-dots mr-1"></i>Примітка логіста:</span>
                  <span>${c.logistNote}</span>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      `;
    }).join('') + `
      <div class="pt-1 flex justify-end">
        
      </div>
    `;
  }

  // Допоміжна функція пошуку цільового вантажу (вкладеного в Обіцянку/Перевезення або окремого непромаркованого)
  function resolveCargoTarget(entityId, cargoId) {
    const parentEntity = transportsData.find(t => t.id === entityId);
    if (!parentEntity) return null;

    if (!cargoId && isUnmarkedCargo(parentEntity)) {
      return {
        isStandaloneUnmarked: true,
        parentEntity,
        cargo: parentEntity
      };
    }

    if (!Array.isArray(parentEntity.cargoes)) parentEntity.cargoes = [];
    if (cargoId === '__NEW__') {
      return {
        isStandaloneUnmarked: false,
        isNew: true,
        parentEntity,
        cargo: {
          cargoId: `ARR-${(parentEntity.dfShipment || parentEntity.id).replace(/\D/g, '').slice(-4) || '9000'}-${parentEntity.cargoes.length + 1}`,
          trackingNumber: `TRK-${Date.now().toString().slice(-8)}`,
          receiveDate: '2026-10-18 12:00',
          warehouse: `Склад ${parentEntity.originCountry || 'Китай'} (Консолідаційний)`,
          warehouseLocation: 'Зона приймання A-01',
          titleUa: '',
          nameEn: '',
          nameCn: '',
          contentDescription: '',
          places: 1,
          grossWeight: 200,
          volume: 1.0,
          length: 100,
          width: 80,
          height: 90,
          isOversized: false,
          packageType: parentEntity.packagingType || 'Коробки',
          additionalServices: 'Зважування, Маркування',
          logistNote: '',
          status: 'На складі відправки',
          movementHistory: []
        }
      };
    }

    const cargo = parentEntity.cargoes.find(c => c.cargoId === cargoId) || parentEntity.cargoes[0];
    if (!cargo) return null;
    return {
      isStandaloneUnmarked: false,
      isNew: false,
      parentEntity,
      cargo
    };
  }

  function recalculateEntityMetricsFromCargoes(tr) {
    if (!tr || !Array.isArray(tr.cargoes) || tr.cargoes.length === 0) return;
    const totalPlaces = tr.cargoes.reduce((s, c) => s + (Number(c.places) || 0), 0);
    const totalWeight = tr.cargoes.reduce((s, c) => s + (Number(c.grossWeight) || 0), 0);
    const totalVol = tr.cargoes.reduce((s, c) => s + (Number(c.volume) || 0), 0);
    tr.places = totalPlaces;
    tr.weight = Number(totalWeight.toFixed(2));
    tr.volume = Number(totalVol.toFixed(2));
  }

  // --- П.1: Редагування вантажу (Ерайву) ---
  window.openEditCargoModal = function (entityId, cargoId, event) {
    if (event) event.stopPropagation();
    const target = resolveCargoTarget(entityId, cargoId);
    if (!target) return;

    const { isStandaloneUnmarked, isNew, parentEntity, cargo } = target;
    const currentNumber = isStandaloneUnmarked ? (cargo.cargoNumber || cargo.id) : cargo.cargoId;
    const currentStatus = cargo.status || 'На складі відправки';
    const currentWarehouse = cargo.warehouse || parentEntity.hub || 'Склад відправки';
    const currentLocation = cargo.warehouseLocation || 'Зона A • Стелаж 01';
    const currentTitleUa = cargo.titleUa || cargo.contentDescription || '';
    const currentNameEn = cargo.nameEn || '';
    const currentNameCn = cargo.nameCn || '';
    const currentDesc = cargo.contentDescription || cargo.titleUa || '';
    const currentPlaces = Number(cargo.places) || 1;
    const currentWeight = Number(isStandaloneUnmarked ? cargo.weight : cargo.grossWeight) || 100;
    const currentVolume = Number(cargo.volume) || 0.5;
    const currentLength = Number(cargo.length) || 100;
    const currentWidth = Number(cargo.width) || 80;
    const currentHeight = Number(cargo.height) || 90;
    const currentPkg = (isStandaloneUnmarked ? cargo.packagingType : cargo.packageType) || 'Палети';
    const currentOversized = Boolean(cargo.isOversized);
    const currentServices = cargo.additionalServices || '';
    const currentNote = cargo.logistNote || '';
    const currentTrack = cargo.trackingNumber || '';
    const currentReceiveDate = cargo.receiveDate || '2026-10-16 10:00';

    const statusOptionsHtml = ALL_CARGO_STATUSES.map(st =>
      `<option value="${st}" ${st === currentStatus ? 'selected' : ''}>${st}</option>`
    ).join('') + (!ALL_CARGO_STATUSES.includes(currentStatus) ? `<option value="${currentStatus}" selected>${currentStatus}</option>` : '');

    showCargoModal(`
      <div class="p-4 border-b border-slate-200 flex items-center justify-between bg-indigo-50/60 rounded-t-2xl">
        <div>
          <div class="text-[10px] font-bold uppercase text-indigo-700">${isNew ? 'Створення нового вантажу (Ерайву)' : 'Редагування картки вантажу (Ерайву)'}</div>
          <div class="text-base font-bold text-slate-900 font-mono">${isNew ? 'Новий вантаж' : currentNumber} <span class="text-xs font-normal text-slate-500">(${parentEntity.dfShipment || parentEntity.id})</span></div>
        </div>
        <button onclick="closeCargoModal()" class="text-slate-400 hover:text-slate-700 cursor-pointer"><i class="fa-solid fa-xmark text-lg"></i></button>
      </div>

      <div class="p-4 space-y-3 text-xs max-h-[72vh] overflow-y-auto">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">DF Номер вантажу (Ерайву)</span>
            <input id="edit-cargo-number" type="text" value="${currentNumber}" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-800 focus:outline-none focus:border-indigo-500">
          </label>
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Трек-номер</span>
            <input id="edit-cargo-tracking" type="text" value="${currentTrack}" placeholder="SF / YT / JD..." class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-slate-800 focus:outline-none focus:border-indigo-500">
          </label>
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Статус вантажу</span>
            <select id="edit-cargo-status" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 bg-white focus:outline-none focus:border-indigo-500">
              ${statusOptionsHtml}
            </select>
          </label>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Поточний склад</span>
            <input id="edit-cargo-warehouse" type="text" value="${currentWarehouse}" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500">
          </label>
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Локація на складі</span>
            <input id="edit-cargo-location" type="text" value="${currentLocation}" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500">
          </label>
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Дата/час отримання</span>
            <input id="edit-cargo-received" type="text" value="${currentReceiveDate}" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-slate-800 focus:outline-none focus:border-indigo-500">
          </label>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Назва товару (UA)</span>
            <input id="edit-cargo-title-ua" type="text" value="${currentTitleUa}" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-indigo-500">
          </label>
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Назва товару (EN)</span>
            <input id="edit-cargo-name-en" type="text" value="${currentNameEn}" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500">
          </label>
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Назва товару (CN)</span>
            <input id="edit-cargo-name-cn" type="text" value="${currentNameCn}" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500">
          </label>
        </div>

        <label class="block">
          <span class="text-[10px] font-bold text-slate-600 uppercase">Опис вмісту вантажу</span>
          <input id="edit-cargo-desc" type="text" value="${currentDesc}" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500">
        </label>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">К-сть місць (шт)</span>
            <input id="edit-cargo-places" type="number" min="1" step="1" value="${currentPlaces}" class="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1 font-mono font-bold text-slate-800 bg-white">
          </label>
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Вага брутто (кг)</span>
            <input id="edit-cargo-weight" type="number" min="0.1" step="1" value="${currentWeight}" class="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1 font-mono font-bold text-slate-800 bg-white">
          </label>
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Об'єм (м³)</span>
            <input id="edit-cargo-volume" type="number" min="0.01" step="0.1" value="${currentVolume}" class="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1 font-mono font-bold text-slate-800 bg-white">
          </label>
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Тип пакування</span>
            <input id="edit-cargo-pkg" type="text" value="${currentPkg}" class="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1 text-slate-800 bg-white">
          </label>
        </div>

        <div class="grid grid-cols-3 sm:grid-cols-4 gap-2.5 items-end">
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Довжина (см)</span>
            <input id="edit-cargo-length" type="number" min="1" value="${currentLength}" class="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1 font-mono text-slate-800">
          </label>
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Ширина (см)</span>
            <input id="edit-cargo-width" type="number" min="1" value="${currentWidth}" class="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1 font-mono text-slate-800">
          </label>
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Висота (см)</span>
            <input id="edit-cargo-height" type="number" min="1" value="${currentHeight}" class="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1 font-mono text-slate-800">
          </label>
          <label class="flex items-center gap-2 pb-1.5 cursor-pointer select-none">
            <input id="edit-cargo-oversized" type="checkbox" ${currentOversized ? 'checked' : ''} class="rounded text-indigo-600 cursor-pointer">
            <span class="text-xs font-bold text-slate-700">Негабаритний</span>
          </label>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Додаткові послуги</span>
            <input id="edit-cargo-services" type="text" value="${currentServices}" placeholder="Перепакування, фотозвіт..." class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800">
          </label>
          <label class="block">
            <span class="text-[10px] font-bold text-slate-600 uppercase">Примітка логіста</span>
            <input id="edit-cargo-note" type="text" value="${currentNote}" placeholder="Важливі деталі по вантажу..." class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800">
          </label>
        </div>
      </div>

      <div class="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between gap-2">
        <div class="text-[10px] text-slate-500">
          <i class="fa-solid fa-circle-info text-indigo-500 mr-1"></i>При зміні складу або статусу запис автоматично додається в історію переміщень.
        </div>
        <div class="flex items-center gap-2">
          <button type="button" onclick="closeCargoModal()" class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold cursor-pointer hover:bg-slate-100">Скасувати</button>
          <button type="button" id="btn-save-edited-cargo" class="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-2xs inline-flex items-center gap-1.5">
            <i class="fa-solid fa-check"></i> Зберегти зміни
          </button>
        </div>
      </div>
    `);

    const saveBtn = document.getElementById('btn-save-edited-cargo');
    if (saveBtn) {
      saveBtn.onclick = () => {
        const newNum = document.getElementById('edit-cargo-number').value.trim() || currentNumber;
        const newTrack = document.getElementById('edit-cargo-tracking').value.trim();
        const newStatus = document.getElementById('edit-cargo-status').value;
        const newWh = document.getElementById('edit-cargo-warehouse').value.trim() || currentWarehouse;
        const newLoc = document.getElementById('edit-cargo-location').value.trim() || currentLocation;
        const newReceived = document.getElementById('edit-cargo-received').value.trim() || currentReceiveDate;
        const newTitleUa = document.getElementById('edit-cargo-title-ua').value.trim() || 'Вантаж';
        const newNameEn = document.getElementById('edit-cargo-name-en').value.trim();
        const newNameCn = document.getElementById('edit-cargo-name-cn').value.trim();
        const newDesc = document.getElementById('edit-cargo-desc').value.trim() || newTitleUa;
        const newPlaces = Math.max(1, Number(document.getElementById('edit-cargo-places').value) || 1);
        const newWeight = Math.max(0.1, Number(document.getElementById('edit-cargo-weight').value) || 1);
        const newVolume = Math.max(0.01, Number(document.getElementById('edit-cargo-volume').value) || 0.1);
        const newPkg = document.getElementById('edit-cargo-pkg').value.trim() || 'Коробки';
        const newLen = Math.max(1, Number(document.getElementById('edit-cargo-length').value) || 100);
        const newWid = Math.max(1, Number(document.getElementById('edit-cargo-width').value) || 80);
        const newHei = Math.max(1, Number(document.getElementById('edit-cargo-height').value) || 90);
        const newOversized = document.getElementById('edit-cargo-oversized').checked;
        const newServices = document.getElementById('edit-cargo-services').value.trim();
        const newNote = document.getElementById('edit-cargo-note').value.trim();

        const whChanged = newWh !== currentWarehouse || newLoc !== currentLocation || newStatus !== currentStatus;

        if (isStandaloneUnmarked) {
          cargo.cargoNumber = newNum;
          cargo.dfShipment = newNum;
          cargo.trackingNumber = newTrack;
          cargo.status = newStatus;
          cargo.warehouse = newWh;
          cargo.warehouseLocation = newLoc;
          cargo.receiveDate = newReceived;
          cargo.titleUa = newTitleUa;
          cargo.nameEn = newNameEn;
          cargo.nameCn = newNameCn;
          cargo.contentDescription = newDesc;
          cargo.places = newPlaces;
          cargo.weight = newWeight;
          cargo.volume = newVolume;
          cargo.packagingType = newPkg;
          cargo.length = newLen;
          cargo.width = newWid;
          cargo.height = newHei;
          cargo.isOversized = newOversized;
          cargo.additionalServices = newServices;
          cargo.logistNote = newNote;
        } else {
          cargo.cargoId = newNum;
          cargo.trackingNumber = newTrack;
          cargo.status = newStatus;
          cargo.warehouse = newWh;
          cargo.warehouseLocation = newLoc;
          cargo.receiveDate = newReceived;
          cargo.titleUa = newTitleUa;
          cargo.nameEn = newNameEn;
          cargo.nameCn = newNameCn;
          cargo.contentDescription = newDesc;
          cargo.places = newPlaces;
          cargo.grossWeight = newWeight;
          cargo.volume = newVolume;
          cargo.packageType = newPkg;
          cargo.length = newLen;
          cargo.width = newWid;
          cargo.height = newHei;
          cargo.isOversized = newOversized;
          cargo.additionalServices = newServices;
          cargo.logistNote = newNote;

          if (isNew) {
            parentEntity.cargoes.push(cargo);
          }
          recalculateEntityMetricsFromCargoes(parentEntity);
          if (drawerPlannedMetrics && currentDrawerEntityId === parentEntity.id) {
            drawerPlannedMetrics.textContent = `${parentEntity.places || 0} місць | ${parentEntity.weight || 0} кг | ${parentEntity.volume || 0} м³`;
          }
        }

        if (!Array.isArray(cargo.movementHistory)) cargo.movementHistory = [];
        if (isNew || whChanged) {
          const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
          cargo.movementHistory.push({
            step: cargo.movementHistory.length + 1,
            date: nowStr,
            warehouse: newWh,
            location: newLoc,
            operation: isNew ? 'Первинна реєстрація вантажу на складі' : 'Оновлення даних / переміщення вантажу',
            status: newStatus,
            operator: parentEntity.logist || 'Оператор складу',
            transportRef: newTrack || parentEntity.dfShipment || newNum,
            comment: newNote || `Місць: ${newPlaces} шт, Вага: ${newWeight} кг, Об'єм: ${newVolume} м³`
          });
        }

        closeCargoModal();
        if (currentDrawerEntityId === parentEntity.id && !isStandaloneUnmarked) {
          populateDrawerCargoStatusOptions(parentEntity);
          renderDrawerCargoesSection(parentEntity);
        }
        renderAll();
        showToast(`Вантаж ${newNum} успішно збережено`);
      };
    }
  };

  // --- П.5: Спеціалізована картка вантажу (Ерайву) + Історія переміщень між складами + Друк маршруту ---
  window.openSpecializedCargoCardModal = function (entityId, cargoId, event) {
    if (event) event.stopPropagation();
    const target = resolveCargoTarget(entityId, cargoId);
    if (!target) return;
    if (target.isStandaloneUnmarked) {
      openCargoInfoModal(entityId);
      return;
    }

    const { parentEntity, cargo } = target;
    const historyList = Array.isArray(cargo.movementHistory) ? cargo.movementHistory : [];
    const dims = (cargo.length && cargo.width && cargo.height) ? `${cargo.length} × ${cargo.width} × ${cargo.height} см` : '110 × 80 × 95 см';
    const isPromise = parentEntity.readinessCategory === 'planned' || parentEntity.entityType === 'promise';

    const row = (label, value, mono = false) => `
      <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
        <span class="text-[10px] text-slate-400 uppercase font-bold block">${label}</span>
        <span class="text-xs font-bold text-slate-800 ${mono ? 'font-mono' : ''}">${value || '—'}</span>
      </div>`;

    showCargoModal(`
      <div class="p-4 border-b border-slate-200 flex items-center justify-between bg-brand-50/60 rounded-t-2xl">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold uppercase text-brand-700">Спеціалізована картка вантажу (Ерайву)</span>
            ${renderCargoStatusBadge(cargo.status)}
          </div>
          <div class="text-base font-bold text-slate-900 font-mono mt-0.5">${cargo.cargoId} <span class="text-xs font-normal text-slate-500">у складі ${isPromise ? 'Обіцянки' : 'Перевезення'} ${parentEntity.dfShipment || parentEntity.id}</span></div>
        </div>
        <button onclick="closeCargoModal()" class="text-slate-400 hover:text-slate-700 cursor-pointer"><i class="fa-solid fa-xmark text-lg"></i></button>
      </div>

      <div class="p-4 space-y-3 text-xs max-h-[72vh] overflow-y-auto">
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          ${row('DF Номер вантажу (Ерайв)', cargo.cargoId, true)}
          ${row('Трек-номер', cargo.trackingNumber, true)}
          ${row('Дата отримання', cargo.receiveDate, true)}
          ${row('Поточний склад', cargo.warehouse || parentEntity.hub)}
          ${row('Локація на складі', cargo.warehouseLocation || 'Зона A')}
          ${row('Клієнт / Логіст', `${parentEntity.client} (${parentEntity.logist})`)}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          ${row('Назва товару (UA)', cargo.titleUa)}
          ${row('Назва товару (EN)', cargo.nameEn)}
          ${row('Назва товару (CN)', cargo.nameCn)}
        </div>

        ${row('Повний опис вмісту вантажу', cargo.contentDescription || cargo.titleUa)}

        <div class="text-[11px] font-bold text-slate-700 uppercase">Фізичні габарити та пакування</div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          ${row('Кількість місць', `${cargo.places || 0} шт`, true)}
          ${row('Вага брутто', `${cargo.grossWeight || 0} кг`, true)}
          ${row("Об'єм", `${cargo.volume || 0} м³`, true)}
          ${row('Габарити Д×Ш×В', dims, true)}
          ${row('Тип пакування', cargo.packageType || 'Палети')}
          ${row('Негабарит', cargo.isOversized ? 'Так (Негабарит)' : 'Ні (Стандарт)')}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${row('Додаткові послуги на складі', cargo.additionalServices)}
          ${row('Примітка логіста', cargo.logistNote)}
        </div>

        <!-- Історія переміщень між складами всередині спеціалізованої картки -->
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <i class="fa-solid fa-route text-brand-600"></i>
              <span>Історія переміщень (${historyList.length})</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button type="button" onclick="window.printCargoRoute('${parentEntity.id}', '${cargo.cargoId}', event)"
                class="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer shadow-2xs">
                <i class="fa-solid fa-print"></i> Друкувати маршрут
              </button>
              <button type="button" onclick="window.openCargoMovementHistoryModal('${parentEntity.id}', '${cargo.cargoId}', event)"
                class="px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer">
                <i class="fa-solid fa-timeline"></i> Детальна історія та +Переміщення
              </button>
            </div>
          </div>

          <div class="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            ${historyList.map((st, idx) => `
              <div class="bg-white p-2 rounded-lg border border-slate-200 flex items-start justify-between gap-2 text-[11px]">
                <div class="flex items-start gap-2">
                  <span class="w-5 h-5 rounded-full bg-brand-100 text-brand-800 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">${idx + 1}</span>
                  <div>
                    <div class="font-bold text-slate-800">${st.warehouse} <span class="text-slate-400 font-normal">• ${st.location || 'Термінал'}</span></div>
                    <div class="text-[10px] text-slate-600">${st.operation}</div>
                    ${st.comment ? `<div class="text-[10px] text-slate-400 italic">${st.comment}</div>` : ''}
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <span class="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold block">${st.status}</span>
                  <span class="text-[9px] font-mono text-slate-400">${st.date}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <button type="button" onclick="window.openEditCargoModal('${parentEntity.id}', '${cargo.cargoId}', event)"
            class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs">
            <i class="fa-regular fa-pen-to-square"></i> Редагувати вантаж
          </button>
          <button type="button" onclick="window.printCargoRoute('${parentEntity.id}', '${cargo.cargoId}', event)"
            class="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-print"></i> Друкувати маршрут
          </button>
        </div>
        <button type="button" onclick="closeCargoModal()" class="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold cursor-pointer hover:bg-slate-100">Закрити</button>
      </div>
    `);
  };

  window.openCargoMovementHistoryModal = function (entityId, cargoId, event) {
    if (event) event.stopPropagation();
    const target = resolveCargoTarget(entityId, cargoId);
    if (!target) return;

    const { isStandaloneUnmarked, parentEntity, cargo } = target;
    const cNum = isStandaloneUnmarked ? (cargo.cargoNumber || cargo.id) : cargo.cargoId;
    if (!Array.isArray(cargo.movementHistory)) cargo.movementHistory = [];
    const historyList = cargo.movementHistory;

    const routeChainHtml = historyList.map((st, idx) => {
      const isLast = idx === historyList.length - 1;
      return `
        <div class="flex items-center gap-1.5 shrink-0">
          <div class="px-2.5 py-1.5 rounded-lg border ${isLast ? 'bg-brand-600 text-white border-brand-700 shadow-xs' : 'bg-white text-slate-800 border-slate-200'} text-[11px]">
            <div class="font-bold flex items-center gap-1">
              <span class="w-4 h-4 rounded-full ${isLast ? 'bg-white text-brand-700' : 'bg-slate-100 text-slate-700'} font-mono text-[9px] font-extrabold inline-flex items-center justify-center">${idx + 1}</span>
              <span>${st.warehouse}</span>
            </div>
            <div class="text-[9px] ${isLast ? 'text-brand-100' : 'text-slate-400'} font-mono mt-0.5">${st.location || 'Зона A'} • ${st.date}</div>
          </div>
          ${!isLast ? '<i class="fa-solid fa-arrow-right text-slate-400 text-xs mx-0.5"></i>' : ''}
        </div>
      `;
    }).join('');

    showCargoModal(`
      <div class="p-4 border-b border-slate-200 flex items-center justify-between bg-sky-50/70 rounded-t-2xl">
        <div>
          <div class="text-[10px] font-bold uppercase text-sky-700 flex items-center gap-1.5">
            <i class="fa-solid fa-route"></i>
            <span>Історія переміщень вантажу (Ерайву) між складами</span>
          </div>
          <div class="text-base font-bold text-slate-900 font-mono mt-0.5">${cNum} <span class="text-xs font-normal text-slate-500">(${cargo.titleUa || cargo.contentDescription || 'Вантаж'})</span></div>
        </div>
        <div>
          <button onclick="closeCargoModal()" class="text-slate-400 hover:text-slate-700 cursor-pointer p-1"><i class="fa-solid fa-xmark text-lg"></i></button>
        </div>
      </div>

      <div class="p-4 space-y-3 text-xs max-h-[72vh] overflow-y-auto">
        <!-- Візуальний ланцюжок складів -->
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div class="text-[10px] font-bold uppercase text-slate-500 mb-2">Маршрут складських терміналів та транзитних хабів</div>
          <div class="flex items-center gap-1 overflow-x-auto pb-1">
            ${routeChainHtml || '<span class="text-slate-400 italic">Немає записів переміщень</span>'}
          </div>
        </div>

        <!-- Таблиця всіх складських переміщень -->
        <div class="border border-slate-200 rounded-xl overflow-hidden">
          <table class="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr class="bg-slate-100 text-slate-600 border-b border-slate-200 text-[10px] uppercase font-bold">
                <th class="p-2">#</th>
                <th class="p-2">Дата / Час</th>
                <th class="p-2">Склад / Термінал</th>
                <th class="p-2">Локація</th>
                <th class="p-2">Операція</th>
                <th class="p-2">Статус</th>
                <th class="p-2">Відповідальний</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">
              ${historyList.map((st, idx) => `
                <tr class="hover:bg-slate-50">
                  <td class="p-2 font-mono font-bold text-slate-500">${idx + 1}</td>
                  <td class="p-2 font-mono whitespace-nowrap text-slate-700">${st.date}</td>
                  <td class="p-2 font-bold text-slate-800">${st.warehouse}</td>
                  <td class="p-2 text-slate-600">${st.location || '—'}</td>
                  <td class="p-2 text-slate-700">
                    <div>${st.operation}</div>
                    ${st.comment ? `<div class="text-[10px] text-slate-400">${st.comment}</div>` : ''}
                  </td>
                  <td class="p-2">${renderCargoStatusBadge(st.status)}</td>
                  <td class="p-2 text-slate-600 whitespace-nowrap">${st.operator || 'Оператор'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Форма додавання нового переміщення між складами -->
        <div class="bg-sky-50/60 p-3 rounded-xl border border-sky-200 space-y-2">
          <div class="text-[10px] font-bold uppercase text-sky-900 flex items-center gap-1.5">
            <i class="fa-solid fa-truck-ramp-box"></i>
            <span>Зафіксувати нове переміщення між складами / зміну локації</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input id="new-move-warehouse" type="text" placeholder="Новий склад (напр. Хаб Варшава)" value="${parentEntity.hub || 'Транзитний Хаб Варшава'}" class="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-xs">
            <input id="new-move-location" type="text" placeholder="Зона / Рампа / Стелаж" value="Крос-док • Рампа 04" class="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-xs">
            <select id="new-move-status" class="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-xs font-semibold">
              ${ALL_CARGO_STATUSES.map(st => `<option value="${st}" ${st === 'На складі призначення' ? 'selected' : ''}>${st}</option>`).join('')}
            </select>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input id="new-move-operation" type="text" placeholder="Операція (напр. Прибуття на транзитний склад)" value="Переміщення на транзитний склад та звірка місць" class="sm:col-span-2 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-xs">
            <button type="button" id="btn-add-cargo-movement" class="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer shadow-2xs inline-flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-plus"></i> Додати переміщення
            </button>
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between">
        <button type="button" onclick="window.openEditCargoModal('${parentEntity.id}', ${isStandaloneUnmarked ? 'null' : `'${cargo.cargoId}'`}, event)"
          class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer">
          <i class="fa-regular fa-pen-to-square"></i> Редагувати вантаж
        </button>
        <button type="button" onclick="closeCargoModal()" class="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold cursor-pointer hover:bg-slate-100">Закрити</button>
      </div>
    `);

    const addMoveBtn = document.getElementById('btn-add-cargo-movement');
    if (addMoveBtn) {
      addMoveBtn.onclick = () => {
        const wh = document.getElementById('new-move-warehouse').value.trim();
        const loc = document.getElementById('new-move-location').value.trim();
        const st = document.getElementById('new-move-status').value;
        const op = document.getElementById('new-move-operation').value.trim();
        if (!wh || !op) {
          showToast('Вкажіть склад та опис операції переміщення', true);
          return;
        }
        const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
        cargo.movementHistory.push({
          step: cargo.movementHistory.length + 1,
          date: nowStr,
          warehouse: wh,
          location: loc || 'Термінал',
          operation: op,
          status: st,
          operator: parentEntity.logist || 'Черговий логіст',
          transportRef: parentEntity.subvoyageId || parentEntity.dfShipment || cNum,
          comment: `К-сть місць: ${cargo.places || 1} шт (${(isStandaloneUnmarked ? cargo.weight : cargo.grossWeight) || 100} кг / ${cargo.volume || 0.5} м³)`
        });
        cargo.warehouse = wh;
        cargo.warehouseLocation = loc || cargo.warehouseLocation;
        cargo.status = st;

        if (currentDrawerEntityId === parentEntity.id && !isStandaloneUnmarked) {
          populateDrawerCargoStatusOptions(parentEntity);
          renderDrawerCargoesSection(parentEntity);
        }
        renderAll();
        window.openCargoMovementHistoryModal(parentEntity.id, isStandaloneUnmarked ? null : cargo.cargoId);
        showToast(`Додано переміщення на склад «${wh}»`);
      };
    }
  };

  // Друк маршрутного листа переміщень вантажу між складами
  window.printCargoRoute = function (entityId, cargoId, event) {
    if (event) event.stopPropagation();
    const target = resolveCargoTarget(entityId, cargoId);
    if (!target) return;

    const { isStandaloneUnmarked, parentEntity, cargo } = target;
    const cNum = isStandaloneUnmarked ? (cargo.cargoNumber || cargo.id) : cargo.cargoId;
    const weightVal = isStandaloneUnmarked ? cargo.weight : cargo.grossWeight;
    const pkgVal = isStandaloneUnmarked ? cargo.packagingType : cargo.packageType;
    const historyList = Array.isArray(cargo.movementHistory) ? cargo.movementHistory : [];
    const printDate = new Date().toLocaleString('uk-UA');

    const printHtml = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Маршрутний лист вантажу ${cNum}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0f172a; margin: 24px; font-size: 12px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
    .title { font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4px; }
    .subtitle { font-size: 12px; color: #475569; margin-top: 4px; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
    .meta-box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 10px; background: #f8fafc; }
    .meta-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; display: block; }
    .meta-val { font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 2px; display: block; }
    .route-chain { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px; border: 1px solid #94a3b8; border-radius: 8px; background: #f1f5f9; margin-bottom: 16px; }
    .route-node { border: 1px solid #475569; border-radius: 6px; padding: 6px 10px; background: #ffffff; font-weight: 700; }
    .route-arrow { font-weight: 900; color: #334155; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #e2e8f0; font-size: 10px; text-transform: uppercase; font-weight: 800; color: #1e293b; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 28px; padding-top: 16px; border-top: 1px dashed #94a3b8; }
    .sig-line { border-bottom: 1px solid #334155; height: 26px; margin-top: 16px; }
    @media print {
      .no-print { display: none !important; }
      body { margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 16px; display: flex; justify-content: flex-end; gap: 8px;">
    <button onclick="window.print()" style="padding: 8px 16px; background: #0284c7; color: #fff; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;">Друкувати документ</button>
    <button onclick="window.close()" style="padding: 8px 14px; background: #e2e8f0; color: #0f172a; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Закрити</button>
  </div>

  <div class="header">
    <div>
      <div class="title">Маршрутний лист переміщень вантажу (Ерайву) між складами</div>
      <div class="subtitle">DF Вантаж: <strong>${cNum}</strong> • Трек: <strong>${cargo.trackingNumber || '—'}</strong> • Сутність: <strong>${parentEntity.dfShipment || parentEntity.id}</strong> (Обіцянка: ${parentEntity.dfPromise || '—'})</div>
    </div>
    <div style="text-align: right; font-size: 11px;">
      <div><strong>Дата друку:</strong> ${printDate}</div>
      <div><strong>Підрейс:</strong> ${parentEntity.subvoyageId || 'В пулі'}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-box">
      <span class="meta-label">Найменування вантажу (UA / EN)</span>
      <span class="meta-val">${cargo.titleUa || cargo.contentDescription || 'Вантаж'} ${cargo.nameEn ? `/ ${cargo.nameEn}` : ''}</span>
    </div>
    <div class="meta-box">
      <span class="meta-label">Клієнт / Логіст</span>
      <span class="meta-val">${parentEntity.client || '—'} / ${parentEntity.logist || '—'}</span>
    </div>
    <div class="meta-box">
      <span class="meta-label">Поточний статус та склад</span>
      <span class="meta-val">${cargo.status || 'На складі'} (${cargo.warehouse || parentEntity.hub || '—'})</span>
    </div>
    <div class="meta-box">
      <span class="meta-label">Фізичні параметри</span>
      <span class="meta-val">${cargo.places || 0} місць | ${weightVal || 0} кг | ${cargo.volume || 0} м³</span>
    </div>
    <div class="meta-box">
      <span class="meta-label">Пакування та габарити</span>
      <span class="meta-val">${pkgVal || 'Палети'} (${cargo.length || 100}×${cargo.width || 80}×${cargo.height || 90} см)</span>
    </div>
    <div class="meta-box">
      <span class="meta-label">Маршрут перевезення</span>
      <span class="meta-val">${parentEntity.transitSegment || `${parentEntity.originCountry || 'Китай'} ➔ ${parentEntity.destinationCountry || 'Україна'}`}</span>
    </div>
  </div>

  <div style="font-weight: 800; text-transform: uppercase; font-size: 11px; margin-bottom: 6px;">Схема маршруту між складами:</div>
  <div class="route-chain">
    ${historyList.map((st, idx) => `
      <div class="route-node">${idx + 1}. ${st.warehouse} (${st.location || 'Термінал'})</div>
      ${idx < historyList.length - 1 ? '<span class="route-arrow">➔</span>' : ''}
    `).join('')}
  </div>

  <div style="font-weight: 800; text-transform: uppercase; font-size: 11px; margin-bottom: 6px;">Журнал складських операцій та переміщень:</div>
  <table>
    <thead>
      <tr>
        <th style="width: 28px;">№</th>
        <th style="width: 115px;">Дата та час</th>
        <th>Склад / Логістичний хаб</th>
        <th>Зона / Локація</th>
        <th>Операція переміщення</th>
        <th>Статус вантажу</th>
        <th>Відповідальний</th>
      </tr>
    </thead>
    <tbody>
      ${historyList.map((st, idx) => `
        <tr>
          <td><strong>${idx + 1}</strong></td>
          <td style="font-family: monospace;">${st.date}</td>
          <td><strong>${st.warehouse}</strong></td>
          <td>${st.location || '—'}</td>
          <td>${st.operation}${st.comment ? `<br><span style="color:#475569;font-size:11px;">${st.comment}</span>` : ''}</td>
          <td><strong>${st.status}</strong></td>
          <td>${st.operator || '—'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="signatures">
    <div>
      <strong>Відпустив зі складу (ПІБ, підпис, печатка):</strong>
      <div class="sig-line"></div>
    </div>
    <div>
      <strong>Прийняв на склад / перевізник (ПІБ, підпис):</strong>
      <div class="sig-line"></div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 250);
    };
  </script>
</body>
</html>`;

    const printWin = window.open('', '_blank', 'width=960,height=760');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(printHtml);
      printWin.document.close();
    } else {
      showToast('Дозвольте спливаючі вікна у браузері для друку маршруту', true);
    }
  };

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
    const drawerCargoTypeBadge = document.getElementById('drawer-cargo-type-badge');
    if (drawerCargoTypeBadge) {
      if (tr.cargoType === 'Карго') {
        drawerCargoTypeBadge.innerHTML = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-400/40 inline-flex items-center gap-1" title="Тип митного оформлення: Карго"><i class="fa-solid fa-box"></i> Карго</span>`;
      } else if (tr.cargoType === 'Фрахт' || tr.cargoType === 'Біле') {
        drawerCargoTypeBadge.innerHTML = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/40 inline-flex items-center gap-1" title="Тип митного оформлення: Фрахт (Офіціал)"><i class="fa-solid fa-landmark"></i> Фрахт</span>`;
      } else if (tr.cargoType) {
        drawerCargoTypeBadge.innerHTML = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-200 border border-slate-500">${tr.cargoType}</span>`;
      } else {
        drawerCargoTypeBadge.innerHTML = '';
      }
    }
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
    if (drawerPlannedMetrics) drawerPlannedMetrics.textContent = `${tr.places || 0} місць | ${tr.weight || 0} кг | ${tr.volume || 0} м³`;
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

    currentDrawerEntityId = tr.id;
    drawerCargoSearchQuery = '';
    drawerCargoStatusFilter = 'ALL';
    const searchInputEl = document.getElementById('drawer-cargo-search-input');
    if (searchInputEl) searchInputEl.value = '';

    renderDrawerEntityTasks(tr);
    populateDrawerCargoStatusOptions(tr);
    renderDrawerCargoesSection(tr);

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
    setElHtml('sv-drawer-tasks-badge', renderSubvoyageTasksBadge(sv));
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
    const receivingWh = sv.receivingWarehouse || sv.destinationWarehouse || sv.hub || '—';
    setElHtml('sv-drawer-hub', `<i class="fa-solid fa-warehouse text-amber-700"></i> <span>Склад отримання: ${receivingWh}</span>`);
    setElText('sv-drawer-receiving-wh-name', receivingWh);
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
          <span>Вага брутто (кг): <strong>${Math.round(cap.weight)}</strong> / ${sv.maxWeight} кг</span>
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
                ${renderBlockingDepartureBadge(tr)}
                ${renderStatusBadge(tr.status)}
                ${routeInfo}
                ${renderAcceptanceBadges(tr)}
              </div>
              <div class="text-[11px] text-slate-700 font-semibold">${tr.client} <span class="text-slate-400 font-normal">• ${tr.logist}</span></div>
            </div>
            <div class="text-right font-mono text-[11px] text-slate-700 shrink-0">
              <div><strong>${tr.volume}</strong> м³ | <strong>${tr.weight}</strong> кг | <strong>${tr.places}</strong> шт</div>
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

  // --- Attention: Вікно попередження при конфліктах параметрів підрейсу та перевезення ---
  let pendingAttentionAssign = null;

  function performAssignShipmentsToSubvoyage(shipmentIds, svId, confirmedRisk = false) {
    const sv = subVoyagesData.find(s => s.id === svId);
    if (!sv) return;
    let addedCount = 0;
    let lastTr = null;
    shipmentIds.forEach(id => {
      const tr = transportsData.find(t => t.id === id);
      if (!tr) return;
      tr.subvoyageId = svId;
      tr.status = sv.status;
      if (sv.plannedDeparture) tr.dateShipped = sv.plannedDeparture;
      if (confirmedRisk) tr.conflictConfirmed = true;
      selectedUnassignedIds.delete(id);
      addedCount++;
      lastTr = tr;
    });
    if (addedCount === 0) return;
    expandedSubvoyageIds.add(svId);
    syncSubvoyageAndShipmentsStatuses();
    const msg = addedCount === 1 && lastTr
      ? `${isUnmarkedCargo(lastTr) ? 'Вантаж' : 'Перевезення'} ${lastTr.dfShipment || lastTr.id} додано в ${svId}`
      : `Додано ${addedCount} перевезень до ${svId} (Єдиний статус: ${sv.status})`;
    showToast(confirmedRisk ? `${msg} (ризик підтверджено)` : msg);
    renderAll();
  }

  function renderAttentionConflictsModal() {
    if (!pendingAttentionAssign) return;
    const { sv, items } = pendingAttentionAssign;
    const listEl = document.getElementById('attention-conflicts-list');
    const summaryEl = document.getElementById('attention-conflicts-sv-summary');
    const progressEl = document.getElementById('attention-conflicts-progress');
    const saveBtn = document.getElementById('btn-attention-confirm-save');

    if (summaryEl) {
      const svSpecs = [
        sv.transport,
        `${sv.originCountry || '—'} ➔ ${sv.destinationCountry || '—'}`,
        sv.cargoMode && sv.cargoMode !== 'all' ? sv.cargoMode : null,
        ...(sv.keyMarkers || []).map(k => SUBVOYAGE_KEY_MARKER_LABELS[k] || k)
      ].filter(Boolean).join(' • ');
      summaryEl.innerHTML = `<strong>Підрейс ${sv.id} (${sv.name}):</strong> ${svSpecs}`;
    }

    if (listEl) {
      const groupedMap = new Map();
      items.forEach(item => {
        const key = item.shipmentId || item.shipmentLabel;
        if (!groupedMap.has(key)) {
          groupedMap.set(key, {
            shipmentId: item.shipmentId,
            shipmentLabel: item.shipmentLabel,
            items: []
          });
        }
        groupedMap.get(key).items.push(item);
      });

      listEl.innerHTML = Array.from(groupedMap.values()).map(group => {
        const groupConfirmedCount = group.items.filter(i => i.confirmed).length;
        const groupAllConfirmed = groupConfirmedCount === group.items.length;
        return `
          <div class="rounded-xl border ${groupAllConfirmed ? 'border-emerald-300 bg-emerald-50/20' : 'border-amber-200 bg-white'} overflow-hidden shadow-2xs">
            <div class="px-3.5 py-2 ${groupAllConfirmed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50/80 border-amber-200'} border-b flex items-center justify-between gap-2 flex-wrap">
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-brand-700 text-xs">${group.shipmentLabel}</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${groupAllConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}">
                  Підтверджено ${groupConfirmedCount} з ${group.items.length}
                </span>
              </div>
            </div>
            <div class="divide-y divide-slate-100">
              ${group.items.map(item => `
                <div class="p-3 flex items-center justify-between gap-3 transition ${item.confirmed ? 'bg-emerald-50/40' : 'bg-white'}">
                  <div class="space-y-0.5 min-w-0">
                    <div class="font-bold text-slate-900">${item.paramLabel}</div>
                    <div class="text-[11px] text-slate-600">
                      Підрейс: <strong class="text-slate-800">${item.svValue}</strong>
                      <span class="mx-1 text-slate-400">≠</span>
                      Перевезення: <strong class="text-rose-700">${item.trValue}</strong>
                    </div>
                  </div>
                  <button type="button" onclick="toggleAttentionConflictConfirm('${item.uid}')"
                    class="px-3 py-1.5 rounded-lg text-[11px] font-bold border transition shrink-0 cursor-pointer ${item.confirmed
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-400'}">
                    ${item.confirmed ? '<i class="fa-solid fa-check mr-1"></i>Підтверджено' : 'Підтверджую'}
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');
    }

    const confirmedCount = items.filter(i => i.confirmed).length;
    const allConfirmed = items.length > 0 && confirmedCount === items.length;
    if (progressEl) {
      progressEl.textContent = `Підтверджено ${confirmedCount} з ${items.length}`;
      progressEl.className = allConfirmed ? 'text-[11px] font-bold text-emerald-700' : 'text-[11px] font-bold text-amber-800';
    }
    if (saveBtn) saveBtn.disabled = !allConfirmed;
  }

  window.toggleAttentionConflictConfirm = function (uid) {
    if (!pendingAttentionAssign) return;
    const item = pendingAttentionAssign.items.find(i => i.uid === uid);
    if (!item) return;
    item.confirmed = !item.confirmed;
    renderAttentionConflictsModal();
  };

  window.closeAttentionConflictsModal = function () {
    pendingAttentionAssign = null;
    const modal = document.getElementById('modal-attention-conflicts');
    if (modal) modal.classList.add('hidden');
  };

  window.confirmAttentionConflictsAssign = function () {
    if (!pendingAttentionAssign) return;
    const { shipmentIds, svId, items } = pendingAttentionAssign;
    if (!items.every(i => i.confirmed)) return;
    closeAttentionConflictsModal();
    performAssignShipmentsToSubvoyage(shipmentIds, svId, true);
  };

  function ensureAttentionConflictsModal() {
    let modal = document.getElementById('modal-attention-conflicts');
    if (modal) return modal;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div id="modal-attention-conflicts" class="hidden fixed inset-0 z-[70] bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
        <div class="bg-white rounded-2xl shadow-2xl border border-amber-300 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          <div class="px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-xs"><i class="fa-solid fa-triangle-exclamation"></i></div>
              <div>
                <h3 class="font-extrabold text-amber-950 text-base">Attention: Виявлено розбіжності параметрів</h3>
                <p id="attention-conflicts-subtitle" class="text-[11px] text-amber-800 mt-0.5">Підтвердіть кожну розбіжність окремо, щоб додати перевезення на свій страх і ризик.</p>
              </div>
            </div>
            <button type="button" onclick="closeAttentionConflictsModal()" class="w-8 h-8 rounded-lg text-amber-700 hover:bg-amber-100 flex items-center justify-center transition cursor-pointer text-xl leading-none">&times;</button>
          </div>
          <div class="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-3 text-xs">
            <div id="attention-conflicts-sv-summary" class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700"></div>
            <div id="attention-conflicts-list" class="space-y-2"></div>
          </div>
          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3 shrink-0">
            <span id="attention-conflicts-progress" class="text-[11px] font-bold text-amber-800">Підтверджено 0 з 0</span>
            <div class="flex items-center gap-2.5">
              <button type="button" onclick="closeAttentionConflictsModal()" class="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer">Скасувати</button>
              <button type="button" id="btn-attention-confirm-save" disabled onclick="confirmAttentionConflictsAssign()" class="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-xs transition shadow-sm cursor-pointer inline-flex items-center gap-1.5">
                <i class="fa-solid fa-check-double"></i><span>Додати в підрейс</span>
              </button>
            </div>
          </div>
        </div>
      </div>`;
    modal = wrapper.firstElementChild;
    document.body.appendChild(modal);
    return modal;
  }

  function tryAssignShipmentsToSubvoyage(shipmentIds, svId) {
    const sv = subVoyagesData.find(s => s.id === svId);
    if (!sv || !shipmentIds.length) return;

    const items = [];
    shipmentIds.forEach(id => {
      const tr = transportsData.find(t => t.id === id);
      if (!tr) return;
      getSubvoyageShipmentConflicts(tr, sv).forEach(c => {
        items.push({
          uid: `${tr.id}__${c.key}`,
          shipmentId: tr.id,
          shipmentLabel: tr.dfShipment || tr.id,
          paramLabel: c.paramLabel,
          svValue: c.svValue,
          trValue: c.trValue,
          confirmed: false
        });
      });
    });

    if (items.length === 0) {
      performAssignShipmentsToSubvoyage(shipmentIds, svId, false);
      return;
    }

    pendingAttentionAssign = { shipmentIds, svId, sv, items };
    const modal = ensureAttentionConflictsModal();
    renderAttentionConflictsModal();
    if (modal) modal.classList.remove('hidden');
  }

  window.assignShipmentToSubvoyage = function (shipmentId, svId) {
    tryAssignShipmentsToSubvoyage([shipmentId], svId);
  };

  window.detachShipmentFromSubvoyage = function (shipmentId) {
    const tr = transportsData.find(t => t.id === shipmentId);
    if (!tr) return;
    tr.subvoyageId = null;
    tr.dateShipped = null;
    if (tr.readinessCategory === 'planned') {
      tr.status = 'Плановий (обіцянка)';
    } else if (tr.readinessCategory === 'not_ready') {
      tr.status = resolveNotReadyStatus(tr);
      tr.notReadyStatus = tr.status;
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
        else if (t.readinessCategory === 'not_ready') {
          t.status = resolveNotReadyStatus(t);
          t.notReadyStatus = t.status;
        }
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
      if (selectedUnassignedIds.size === 0 || !activeSubvoyageId) return;
      tryAssignShipmentsToSubvoyage(Array.from(selectedUnassignedIds), activeSubvoyageId);
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
      const dMode = btn.getAttribute('data-delivery') || btn.getAttribute('data-delivery-mode');
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
      const cType = btn.getAttribute('data-cargotype') || btn.getAttribute('data-cargo-type');
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
        filters.deliveryMode = btn.getAttribute('data-delivery') || btn.getAttribute('data-delivery-mode') || 'all';
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
        filters.cargoType = btn.getAttribute('data-cargotype') || btn.getAttribute('data-cargo-type') || 'all';
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