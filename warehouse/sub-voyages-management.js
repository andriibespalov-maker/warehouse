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

  let activeSubvoyageId = 'SV-4401';
  let selectedUnassignedIds = new Set();
  let selectedDestinationHub = 'all';
  let selectedSubvoyageUrgency = 'all';
  let selectedSubvoyageStatuses = new Set();
  let selectedSubvoyageLogists = new Set();
  let isAssignedShipmentsCollapsed = false;

  let sortField = 'departureDate';
  let sortDirection = 'asc';

  let filters = {
    search: '',
    quickFilter: 'ready',
    urgency: 'all',
    hubs: new Set(),
    logists: new Set(),
    transports: new Set()
  };

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

    const depInfo = getShipmentDepartureInfo(tr);
    const calc = computeUrgencyByDeparture(depInfo.date, tr.status);

    if (tr.subvoyageId) {
      return calc;
    }

    const rank = { critical: 1, high: 2, normal: 3 };
    const explicitLevel = tr.urgency || 'normal';
    if ((rank[explicitLevel] || 3) < (rank[calc.level] || 3)) {
      const labelMap = {
        critical: `🔥 Critical (${calc.days !== null ? calc.days + ' дн.' : 'Терміново'})`,
        high: `⚠️ High (${calc.days !== null ? calc.days + ' дн.' : 'Скоро'})`,
        normal: `✅ Normal`
      };
      return {
        level: explicitLevel,
        days: calc.days,
        shortLabel: labelMap[explicitLevel],
        detailLabel: tr.urgencyText || calc.detailLabel
      };
    }
    return calc;
  }

  function renderUrgencyBadge(urgencyInfo) {
    if (!urgencyInfo) return '';
    if (urgencyInfo.level === 'critical') {
      return `<span class="bg-rose-100 text-rose-800 border border-rose-300 px-1.5 py-0.2 rounded text-[9px] font-extrabold inline-flex items-center gap-1 shadow-2xs" title="${urgencyInfo.detailLabel || ''}">${urgencyInfo.shortLabel}</span>`;
    }
    if (urgencyInfo.level === 'high') {
      return `<span class="bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded text-[9px] font-bold inline-flex items-center gap-1" title="${urgencyInfo.detailLabel || ''}">${urgencyInfo.shortLabel}</span>`;
    }
    return `<span class="bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded text-[9px] font-bold inline-flex items-center gap-1" title="${urgencyInfo.detailLabel || ''}">${urgencyInfo.shortLabel}</span>`;
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
    const isIsoDate = (val) => typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val.trim());

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

    if (isIsoDate(tr.dateShipped)) {
      return {
        date: tr.dateShipped,
        label: tr.dateShipped,
        source: 'План перевезення',
        isPlannedFromSubvoyage: false
      };
    }

    const matchingSv = getSortedSubvoyages().find(
      s => s.hub === tr.hub && s.transport === tr.transport
    ) || subVoyagesData.find(s => s.id === activeSubvoyageId);

    if (matchingSv && matchingSv.plannedDeparture) {
      return {
        date: matchingSv.plannedDeparture,
        label: matchingSv.plannedDeparture,
        source: `Орієнтир (${matchingSv.id})`,
        isPlannedFromSubvoyage: true
      };
    }

    return {
      date: tr.dateReady || '9999-12-31',
      label: tr.dateShipped || 'Очікує рейсу',
      source: 'Очікує призначення',
      isPlannedFromSubvoyage: false
    };
  }

  function getSortedSubvoyages() {
    return [...subVoyagesData].sort((a, b) => {
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
      if (tr.subvoyageId) {
        const sv = subVoyagesData.find(s => s.id === tr.subvoyageId);
        if (sv) {
          tr.status = sv.status;
          if (sv.plannedDeparture) {
            tr.dateShipped = sv.plannedDeparture;
          }
        }
      }
      tr.urgency = getShipmentUrgencyInfo(tr).level;
    });
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
    const attr = getSubvoyageSpecialAttributes(svId);

    if (attr.total === 0) {
      return `<span class="text-[10px] text-slate-400 italic">Немає перевезень</span>`;
    }

    const badges = [];

    if (attr.adrCount > 0) {
      badges.push(`
        <span class="px-1.5 py-0.5 rounded text-[9px] font-bold inline-flex items-center gap-1 border ${attr.adrConflict
          ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
          : 'bg-rose-100 text-rose-800 border-rose-300'
        }" title="${attr.adrConflict ? 'УВАГА: Підрейс не підтримує ADR!' : 'Небезпечний вантаж ADR'}">
          <i class="fa-solid fa-triangle-exclamation"></i> ADR: ${attr.adrCount} ${attr.adrConflict ? '(ЗАБОРОНЕНО!)' : ''}
        </span>
      `);
    } else {
      badges.push(`
        <span class="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
          Без ADR
        </span>
      `);
    }

    if (attr.battCount > 0) {
      badges.push(`
        <span class="bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded text-[9px] font-bold inline-flex items-center gap-1">
          <i class="fa-solid fa-battery-half"></i> Batt: ${attr.battCount}
        </span>
      `);
    }

    if (attr.exporterDocsCount > 0) {
      badges.push(`
        <span class="bg-blue-100 text-blue-800 border border-blue-300 px-1.5 py-0.5 rounded text-[9px] font-bold inline-flex items-center gap-1">
          <i class="fa-solid fa-file-contract"></i> Док. експ: ${attr.exporterDocsCount}
        </span>
      `);
    }

    if (attr.missingVisaCount > 0) {
      badges.push(`
        <span class="bg-rose-100 text-rose-800 border border-rose-300 px-1.5 py-0.5 rounded text-[9px] font-bold inline-flex items-center gap-1">
          <i class="fa-solid fa-circle-xmark"></i> Без візи: ${attr.missingVisaCount}
        </span>
      `);
    } else {
      badges.push(`
        <span class="bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-bold inline-flex items-center gap-1">
          <i class="fa-solid fa-circle-check"></i> Візи: ${attr.visaCount}/${attr.total}
        </span>
      `);
    }

    return badges.join('');
  }

  async function loadData() {
    try {
      const response = await fetch('../data/sub-voyages-data.json');
      if (!response.ok) throw new Error('Помилка завантаження sub-voyages-data.json');
      const data = await response.json();
      subVoyagesData = data.subVoyages || [];
      transportsData = data.shipments || [];

      syncSubvoyageAndShipmentsStatuses();

      const sortedSv = getSortedSubvoyages();
      const urlParams = new URLSearchParams(window.location.search);
      const paramSvId = urlParams.get('subvoyageId');
      if (paramSvId && sortedSv.some(s => s.id === paramSvId)) {
        activeSubvoyageId = paramSvId;
      } else if (sortedSv.length > 0) {
        activeSubvoyageId = sortedSv[0].id;
      }

      setupHubFilterOptions();
      setupSubvoyageDestinationHubOptions();
      setupSubvoyageBoardFilters();
      setupSubvoyageStatusSelect();
      setupSubvoyageCommentActions();
      setupAssignedShipmentsToggle();
      setupAdvancedFilterOptions();
      updateActiveSubvoyageState();
      renderAll();
    } catch (err) {
      console.error(err);
      showToast('Не вдалося завантажити дані перевезень', true);
    }
  }

  function setupSubvoyageStatusSelect() {
    if (!currentSubvoyageStatusSelect) return;
    currentSubvoyageStatusSelect.addEventListener('change', (e) => {
      const newStatus = e.target.value;
      const sv = subVoyagesData.find(s => s.id === activeSubvoyageId);
      if (!sv) return;

      sv.status = newStatus;
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

    selectedSubvoyageStatuses = new Set(allStatuses);
    selectedSubvoyageLogists = new Set(allLogists);

    // 1. Статуси
    const statusBtn = document.getElementById('sv-status-multiselect-btn');
    const statusMenu = document.getElementById('sv-status-multiselect-menu');
    const statusContainer = document.getElementById('sv-status-checkboxes-container');
    const statusSelectAll = document.getElementById('sv-status-select-all');
    const statusClearAll = document.getElementById('sv-status-clear-all');

    if (statusContainer) {
      statusContainer.innerHTML = allStatuses.map(st => `
        <label class="flex items-center gap-2 text-xs text-slate-700 hover:bg-slate-50 p-1 rounded cursor-pointer select-none">
          <input type="checkbox" value="${st}" checked class="sv-status-cb rounded text-brand-600 focus:ring-brand-500 cursor-pointer">
          <span class="truncate">${st}</span>
        </label>
      `).join('');

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
    const filteredSubvoyages = getFilteredSubvoyagesList();

    if (filteredSubvoyages.length > 0 && !filteredSubvoyages.some(s => s.id === activeSubvoyageId)) {
      activeSubvoyageId = filteredSubvoyages[0].id;
    }

    const currentSv = subVoyagesData.find(s => s.id === activeSubvoyageId);
    if (activeSubvoyageHeaderTitle) {
      activeSubvoyageHeaderTitle.textContent = currentSv
        ? `${currentSv.name} (${currentSv.id})`
        : 'Не обрано';
    }
    if (currentSubvoyageStatusSelect && currentSv) {
      currentSubvoyageStatusSelect.value = currentSv.status;
    }
    if (currentSubvoyageCommentInput && currentSv) {
      currentSubvoyageCommentInput.value = currentSv.comment || '';
    }
  }

  function calculateSubvoyageCapacity(svId) {
    const sv = subVoyagesData.find(s => s.id === svId);
    if (!sv) {
      return {
        vol: 0, weight: 0, places: 0,
        pctVol: 0, pctWeight: 0, pctPlaces: 0,
        projPctVol: 0, projPctWeight: 0, projPctPlaces: 0,
        deltaVol: 0, deltaWeight: 0, deltaPlaces: 0,
        isOverloaded: false
      };
    }

    const assigned = transportsData.filter(t => t.subvoyageId === svId);
    const vol = assigned.reduce((sum, t) => sum + (t.volume || 0), 0);
    const weight = assigned.reduce((sum, t) => sum + (t.weight || 0), 0);
    const places = assigned.reduce((sum, t) => sum + (t.places || 0), 0);

    let deltaVol = 0;
    let deltaWeight = 0;
    let deltaPlaces = 0;

    selectedUnassignedIds.forEach(id => {
      const tr = transportsData.find(t => t.id === id && t.subvoyageId !== svId);
      if (tr) {
        deltaVol += (tr.volume || 0);
        deltaWeight += (tr.weight || 0);
        deltaPlaces += (tr.places || 0);
      }
    });

    const totalVol = vol + deltaVol;
    const totalWeight = weight + deltaWeight;
    const totalPlaces = places + deltaPlaces;

    const pctVol = Math.round((vol / sv.maxVolume) * 100);
    const pctWeight = Math.round((weight / sv.maxWeight) * 100);
    const pctPlaces = Math.round((places / sv.maxPlaces) * 100);

    const projPctVol = Math.round((totalVol / sv.maxVolume) * 100);
    const projPctWeight = Math.round((totalWeight / sv.maxWeight) * 100);
    const projPctPlaces = Math.round((totalPlaces / sv.maxPlaces) * 100);

    const isOverloaded = projPctVol > 100 || projPctWeight > 100 || projPctPlaces > 100;

    return {
      vol, weight, places,
      deltaVol, deltaWeight, deltaPlaces,
      totalVol, totalWeight, totalPlaces,
      pctVol, pctWeight, pctPlaces,
      projPctVol, projPctWeight, projPctPlaces,
      isOverloaded,
      assignedCount: assigned.length
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

  function renderShipmentPropertyBadges(tr) {
    const adrBadge = (tr.isHazardous || tr.cargoes?.some(c => c.hazardousDetails?.isHazardous))
      ? `<span class="bg-rose-100 text-rose-800 border border-rose-300 px-1.5 py-0.2 rounded text-[9px] font-bold"><i class="fa-solid fa-triangle-exclamation"></i> ADR</span>` : '';
    const battBadge = (tr.hasBatteries || tr.cargoes?.some(c => c.hasBatteries))
      ? `<span class="bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded text-[9px] font-bold"><i class="fa-solid fa-battery-half"></i> Batt</span>` : '';
    const docsBadge = tr.closeExporterDocs
      ? `<span class="bg-blue-100 text-blue-800 border border-blue-300 px-1.5 py-0.2 rounded text-[9px] font-bold"><i class="fa-solid fa-file-contract"></i> Док. експ.</span>` : '';

    const visaBadge = tr.hasVisa
      ? `<span class="bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded text-[9px] font-bold inline-flex items-center gap-1"><i class="fa-solid fa-circle-check"></i> Є віза</span>`
      : `<span class="bg-slate-100 text-slate-600 border border-slate-300 px-1.5 py-0.2 rounded text-[9px] font-bold inline-flex items-center gap-1"><i class="fa-solid fa-circle-xmark"></i> Немає</span>`;

    return `${adrBadge} ${battBadge} ${docsBadge} ${visaBadge}`;
  }

  // Візуалізація на Дошці Підрейсів (усі поля підрейсу + коментар)
  function renderSubvoyagesTimeline() {
    if (!subvoyagesTimelineCards) return;

    const filteredSubvoyages = getFilteredSubvoyagesList();

    if (filteredSubvoyages.length === 0) {
      subvoyagesTimelineCards.innerHTML = `
        <div class="p-4 text-center text-slate-400 italic text-xs bg-white rounded-xl border border-slate-200">
          Немає підрейсів за обраними фільтрами складу або терміновості
        </div>
      `;
      return;
    }

    subvoyagesTimelineCards.innerHTML = filteredSubvoyages.map(sv => {
      const cap = calculateSubvoyageCapacity(sv.id);
      const themeVol = getCapacityColorTheme(cap.projPctVol);
      const themeWeight = getCapacityColorTheme(cap.projPctWeight);
      const themePlaces = getCapacityColorTheme(cap.projPctPlaces);
      const isActive = sv.id === activeSubvoyageId;
      const svUrgency = getSubvoyageUrgencyInfo(sv);

      // Ознаки підрейсу ("Основний", "Транзит", Шаблон, Зовнішній рейс)
      const mainFlag = sv.isMain ? `<span class="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded text-[9px] font-bold">Основний</span>` : '';
      const transitFlag = sv.isTransit ? `<span class="bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 rounded text-[9px] font-bold">Транзит</span>` : '';
      const extFlightBadge = sv.parentVoyage ? `<span class="text-[9px] font-mono text-slate-500">Зовн. рейс: <strong>${sv.parentVoyage}</strong></span>` : '';
      const templateBadge = sv.template ? `<span class="text-[9px] font-mono text-slate-400">Шаблон: ${sv.template}</span>` : '';

      // Умовні деталі залежно від способу перевезення (Морський / Авіа / Наземний)
      let detailsHtml = '';
      if (sv.transport === 'Морський' && sv.transportDetails) {
        detailsHtml = `<span class="text-slate-600"><i class="fa-solid fa-ship text-blue-500 mr-1"></i>Лінія: <strong>${sv.transportDetails.shippingLine || '—'}</strong> | Бронювання: <strong>${sv.transportDetails.bookingNumber || '—'}</strong> | Порти: ${sv.transportDetails.ports || '—'}</span>`;
      } else if (sv.transport === 'Авіа' && sv.transportDetails) {
        detailsHtml = `<span class="text-slate-600"><i class="fa-solid fa-plane text-sky-500 mr-1"></i>Авіалінія: <strong>${sv.transportDetails.airline || '—'}</strong> | AWB: <strong>${sv.transportDetails.awbNumber || '—'}</strong> | Аеропорти: ${sv.transportDetails.airports || '—'}</span>`;
      } else if ((sv.transport === 'Авто' || sv.transport === 'Залізниця') && sv.transportDetails) {
        const icon = sv.transport === 'Авто' ? 'fa-truck text-amber-500' : 'fa-train text-indigo-500';
        detailsHtml = `<span class="text-slate-600"><i class="fa-solid ${icon} mr-1"></i>Кордон: <strong>${sv.transportDetails.borderCrossing || '—'}</strong> | Митниця: <strong>${sv.transportDetails.customsClearancePlaces || 'Київ / Львів'}</strong> | ${sv.transportDetails.vehicleDetails || sv.transportDetails.trainNumber || ''}</span>`;
      }

      const deltaVolText = cap.deltaVol > 0 ? `<span class="text-brand-600 font-bold ml-1">(+${cap.deltaVol.toFixed(1)} м³)</span>` : '';
      const deltaWeightText = cap.deltaWeight > 0 ? `<span class="text-brand-600 font-bold ml-1">(+${cap.deltaWeight.toFixed(1)} т)</span>` : '';
      const deltaPlacesText = cap.deltaPlaces > 0 ? `<span class="text-brand-600 font-bold ml-1">(+${cap.deltaPlaces} шт)</span>` : '';

      const specialAttributesHtml = renderSubvoyageSpecialAttributesBadges(sv.id);

      const commentHtml = sv.comment
        ? `<div class="text-[10px] bg-amber-50/70 text-slate-700 border border-amber-200/80 px-2 py-1 rounded-lg flex items-start gap-1.5">
             <i class="fa-regular fa-comment-dots text-amber-600 mt-0.5"></i>
             <span><strong>Коментар:</strong> ${sv.comment}</span>
           </div>`
        : '';

      return `
        <div onclick="selectActiveSubvoyage('${sv.id}')"
             class="p-2.5 rounded-xl border transition cursor-pointer select-none space-y-2 ${isActive
          ? 'bg-brand-50/80 border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }">
          
          <!-- Основні атрибути, Статус, SLA Терміновість та Виділений Склад доставки -->
          <div class="flex justify-between items-start gap-1">
            <div class="space-y-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-bold text-xs text-slate-900">${sv.name}</span>
                <span class="text-[10px] font-mono font-bold text-brand-700 bg-brand-100 px-1.5 py-0.2 rounded">${sv.id}</span>
                ${renderStatusBadge(sv.status)}
                ${renderUrgencyBadge(svUrgency)}
                ${mainFlag}
                ${transitFlag}
                ${renderTransportBadge(sv.transport, 'bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded text-[9px]')}
              </div>
              <div class="text-[10px] text-slate-500 flex items-center gap-2 flex-wrap">
                <span><i class="fa-regular fa-user mr-1"></i>${sv.logist}</span>
                ${extFlightBadge}
                ${templateBadge}
                <span class="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md font-bold text-[10px] shadow-2xs">
                  <i class="fa-solid fa-warehouse text-amber-700"></i>
                  <span>Склад доставки: ${sv.hub}</span>
                </span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] border ${themeVol.badge}">
              ${cap.projPctVol}%
            </span>
          </div>

          <!-- Географія (Місце завантаження / розвантаження) та Виділена Дата відправлення -->
          <div class="text-[10px] font-mono text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
            <div>
              <span><i class="fa-solid fa-route text-slate-400 mr-1"></i>${sv.loadingPlace || sv.originCountry} ➔ ${sv.unloadingPlace || sv.destinationCountry}</span>
              <span class="text-slate-400 ml-1">(${sv.transitSegment || ''})</span>
            </div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="bg-brand-100 text-brand-900 border border-brand-300 px-2 py-0.5 rounded font-extrabold text-[10px] inline-flex items-center gap-1 shadow-2xs">
                <i class="fa-solid fa-calendar-check text-brand-600"></i>
                Відправлення: ${sv.plannedDeparture || '—'}
              </span>
              <span class="text-slate-500 text-[10px]">➔ Приб: ${sv.plannedArrival || '—'}</span>
            </div>
          </div>

          <!-- Транспортні деталі та Спеціальні атрибути перевезень у підрейсі -->
          <div class="flex items-center justify-between gap-2 flex-wrap pt-0.5">
            <div class="text-[10px] font-mono">
              ${detailsHtml}
            </div>
            <div class="flex items-center gap-1 flex-wrap">
              <span class="text-[9px] text-slate-400 uppercase font-bold mr-0.5">Спец. атрибути:</span>
              ${specialAttributesHtml}
            </div>
          </div>

          <!-- Коментар до підрейсу -->
          ${commentHtml}

          <!-- Capacity Meters (Об'єм, Вага, Місця) -->
          <div class="space-y-1.5 pt-1 border-t border-slate-100">
            <div>
              <div class="flex justify-between text-[10px] font-mono text-slate-600">
                <span>Об'єм (м³): <strong>${cap.vol.toFixed(1)}</strong> / ${sv.maxVolume} м³ ${deltaVolText}</span>
                <span class="${themeVol.text}">${cap.projPctVol}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div class="${themeVol.bar} h-1.5 rounded-full transition-all duration-300" style="width: ${Math.min(cap.projPctVol, 100)}%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[10px] font-mono text-slate-600">
                <span>Вага (т): <strong>${cap.weight.toFixed(1)}</strong> / ${sv.maxWeight} т ${deltaWeightText}</span>
                <span class="${themeWeight.text}">${cap.projPctWeight}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div class="${themeWeight.bar} h-1.5 rounded-full transition-all duration-300" style="width: ${Math.min(cap.projPctWeight, 100)}%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[10px] font-mono text-slate-600">
                <span>Місця (шт): <strong>${cap.places}</strong> / ${sv.maxPlaces} шт ${deltaPlacesText}</span>
                <span class="${themePlaces.text}">${cap.projPctPlaces}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div class="${themePlaces.bar} h-1.5 rounded-full transition-all duration-300" style="width: ${Math.min(cap.projPctPlaces, 100)}%"></div>
              </div>
            </div>
          </div>

        </div>
      `;
    }).join('');
  }

  window.selectActiveSubvoyage = function (svId) {
    activeSubvoyageId = svId;
    updateActiveSubvoyageState();
    renderAll();
  };

  window.toggleDepartureSort = function () {
    if (sortField === 'departureDate') {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = 'departureDate';
      sortDirection = 'asc';
    }
    renderShipmentsTable();
  };

  function getFilteredShipments() {
    return transportsData.filter(t => {
      if (filters.quickFilter === 'ready' && t.status !== 'Готовий до завантаження') return false;
      if (filters.quickFilter === 'attached' && t.subvoyageId === null) return false;
      if (filters.quickFilter === 'lastmile' && t.status !== 'Прибув на склад отримання') return false;

      const uInfo = getShipmentUrgencyInfo(t);
      if (filters.urgency !== 'all' && uInfo.level !== filters.urgency) return false;

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
        if (!mId && !mClient && !mCustoms && !mRecipient) return false;
      }

      return true;
    }).sort((a, b) => {
      const depA = getShipmentDepartureInfo(a).date;
      const depB = getShipmentDepartureInfo(b).date;
      const cmp = depA.localeCompare(depB);
      if (cmp !== 0) {
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      const rank = { critical: 1, high: 2, normal: 3 };
      const uA = getShipmentUrgencyInfo(a).level;
      const uB = getShipmentUrgencyInfo(b).level;
      return (rank[uA] || 99) - (rank[uB] || 99);
    });
  }

  function renderShipmentsTable() {
    if (!tbodyUnassignedShipments || !shipmentsTableHeader) return;
    const isLastMile = filters.quickFilter === 'lastmile';
    const list = getFilteredShipments();

    if (shipmentsListCount) shipmentsListCount.textContent = `Показано: ${list.length} перевезень`;
    if (tableMasterTitle) {
      tableMasterTitle.textContent = isLastMile
        ? "1. Доставка Клієнту («Остання Миля»)"
        : "1. Перевезення (Беклог та підготовка)";
    }

    const sortIcon = sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';

    // Обіцянка схована з таблиці: показуємо Перевезення, Статус, Критичність, Клієнт-Логіст, Місце прибуття, Спосіб перевезення, Параметри, Митницю & Властивості, Дату відправки, Підрейс, Дію
    if (isLastMile) {
      shipmentsTableHeader.innerHTML = `
        <th class="p-2 text-center w-8"><i class="fa-solid fa-grip-vertical text-slate-400"></i></th>
        <th class="p-2 text-center w-8"><input type="checkbox" id="select-all-master-shipments" class="rounded text-brand-600"></th>
        <th class="p-2">Перевезення / Статус & SLA</th>
        <th class="p-2">Клієнт & Логіст</th>
        <th class="p-2">Місце прибуття & Спосіб</th>
        <th class="p-2">Отримувач та Адреса</th>
        <th class="p-2">Митниця & Властивості</th>
        <th class="p-2 cursor-pointer hover:text-brand-700" onclick="toggleDepartureSort()">
          Відправка / Прибуття <i class="fa-solid ${sortIcon} ml-1 text-brand-600"></i>
        </th>
        <th class="p-2 text-center">Підрейс</th>
      `;
    } else {
      shipmentsTableHeader.innerHTML = `
        <th class="p-2 text-center w-8"><input type="checkbox" id="select-all-master-shipments" class="rounded text-brand-600"></th>
        <th class="p-2">Перевезення / Статус & SLA</th>
        <th class="p-2">Клієнт & Логіст</th>
        <th class="p-2">Місце прибуття & Спосіб перевезення</th>
        <th class="p-2">Параметри (м³/т/місць)</th>
        <th class="p-2">Митниця & Властивості</th>
        <th class="p-2 cursor-pointer hover:text-brand-700" onclick="toggleDepartureSort()">
          Дата відправки <i class="fa-solid ${sortIcon} ml-1 text-brand-600"></i>
        </th>
        <th class="p-2 text-center">Підрейс</th>
        <th class="p-2 text-right">Дія</th>
      `;
    }

    if (list.length === 0) {
      tbodyUnassignedShipments.innerHTML = `
        <tr>
          <td colspan="9" class="p-8 text-center text-slate-400 italic">
            Немає перевезень за обраними критеріями
          </td>
        </tr>
      `;
      return;
    }

    tbodyUnassignedShipments.innerHTML = list.map(tr => {
      const isSelected = selectedUnassignedIds.has(tr.id);
      const propBadges = renderShipmentPropertyBadges(tr);
      const customsBadges = renderCustomsBadges(tr);
      const depInfo = getShipmentDepartureInfo(tr);
      const uInfo = getShipmentUrgencyInfo(tr);

      const subvoyageBadge = tr.subvoyageId
        ? `<span class="bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
             <a href="#/subvoyage/${tr.subvoyageId}" class="hover:underline">${tr.subvoyageId}</a>
             <button onclick="detachShipmentFromSubvoyage('${tr.id}')" class="hover:text-rose-600 font-bold ml-1 text-xs cursor-pointer">×</button>
           </span>`
        : `<span class="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded text-[10px] font-bold">Незв'язано</span>`;

      const destinationHubBadge = `
        <div class="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded font-bold text-[10px] shadow-2xs">
          <i class="fa-solid fa-warehouse text-amber-700"></i>
          <span>${tr.hub || tr.destinationCountry}</span>
        </div>
      `;

      if (isLastMile) {
        const lm = tr.lastMile || { deliveryType: 'Не вказано', recipientName: '—', recipientPhone: '—', destinationAddress: '—' };
        return `
          <tr draggable="true" class="hover:bg-slate-50 transition cursor-pointer ${isSelected ? 'bg-brand-50/50' : ''}" onclick="handleShipmentRowClick('${tr.id}', event)">
            <td class="p-2 text-center text-slate-400 hover:text-slate-700 cursor-grab"><i class="fa-solid fa-grip-vertical"></i></td>
            <td class="p-2 text-center" onclick="event.stopPropagation()">
              <input type="checkbox" value="${tr.id}" ${isSelected ? 'checked' : ''} class="cb-unassigned-shipment rounded text-brand-600 cursor-pointer">
            </td>
            <td class="p-2 space-y-1">
              <a href="#/shipment/${tr.id}" class="font-mono font-bold text-brand-700 hover:underline block">${tr.dfShipment || tr.id}</a>
              <div class="flex items-center gap-1 flex-wrap">
                ${renderStatusBadge(tr.status)}
                ${renderUrgencyBadge(uInfo)}
              </div>
            </td>
            <td class="p-2">
              <a href="${tr.clientLink || '#'}" class="font-semibold text-slate-800 hover:underline block truncate max-w-[130px]">${tr.client}</a>
              <div class="text-[9px] text-slate-400"><i class="fa-regular fa-user mr-1"></i>${tr.logist}</div>
            </td>
            <td class="p-2 space-y-1">
              ${destinationHubBadge}
              <div class="flex items-center gap-1">
                <span class="px-2 py-0.5 rounded font-bold text-[10px] bg-purple-50 text-purple-800 border border-purple-200 inline-block">${lm.deliveryType}</span>
                <span class="text-[10px] text-slate-500 inline-flex items-center gap-1">(${renderTransportBadge(tr.transport)})</span>
              </div>
            </td>
            <td class="p-2">
              <div class="font-semibold text-slate-900 text-[11px]">${lm.recipientName}</div>
              <div class="text-[10px] text-slate-500 font-mono">${lm.recipientPhone}</div>
              <div class="text-[9px] text-slate-400 truncate max-w-[150px]">${lm.destinationAddress}</div>
            </td>
            <td class="p-2">
              ${customsBadges}
              <div class="flex items-center gap-1 flex-wrap">${propBadges}</div>
            </td>
            <td class="p-2 font-mono text-[10px] text-slate-600">
              <div class="font-bold text-brand-800">Відпр: ${depInfo.label}</div>
              <div>Прибув: ${tr.dateArrivalExpected || '—'}</div>
            </td>
            <td class="p-2 text-center" onclick="event.stopPropagation()">
              ${subvoyageBadge}
            </td>
          </tr>
        `;
      } else {
        return `
          <tr class="hover:bg-slate-50 transition cursor-pointer ${isSelected ? 'bg-brand-50/50' : ''}" onclick="handleShipmentRowClick('${tr.id}', event)">
            <td class="p-2 text-center" onclick="event.stopPropagation()">
              <input type="checkbox" value="${tr.id}" ${isSelected ? 'checked' : ''} class="cb-unassigned-shipment rounded text-brand-600 cursor-pointer">
            </td>
            <td class="p-2 space-y-1">
              <a href="#/shipment/${tr.id}" class="font-mono font-bold text-brand-700 hover:underline block">${tr.dfShipment || tr.id}</a>
              <div class="flex items-center gap-1 flex-wrap">
                ${renderStatusBadge(tr.status)}
                ${renderUrgencyBadge(uInfo)}
              </div>
            </td>
            <td class="p-2">
              <a href="${tr.clientLink || '#'}" class="font-semibold text-slate-800 hover:underline block truncate max-w-[120px]">${tr.client}</a>
              <div class="text-[9px] text-slate-400"><i class="fa-regular fa-user mr-1"></i>${tr.logist}</div>
            </td>
            <td class="p-2 space-y-1">
              ${destinationHubBadge}
              <div class="text-[10px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                <span><i class="fa-solid fa-route text-slate-400 mr-0.5"></i>${tr.originCountry} ➔ ${tr.destinationCountry}</span>
                <span>•</span>
                ${renderTransportBadge(tr.transport)}
                <span class="px-1 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-brand-700 border border-slate-200">${tr.loadingType || 'LCL'}</span>
              </div>
            </td>
            <td class="p-2 font-mono text-[11px] text-slate-700">
              <div><strong>${tr.volume}</strong> м³ | <strong>${tr.weight}</strong> т</div>
              <div class="text-slate-500 text-[10px] font-bold">${tr.places} місць</div>
            </td>
            <td class="p-2">
              ${customsBadges}
              <div class="flex items-center gap-1 flex-wrap">${propBadges}</div>
            </td>
            <td class="p-2 font-mono text-[10px]">
              <div class="inline-flex items-center gap-1 bg-brand-50 text-brand-900 border border-brand-200 px-2 py-0.5 rounded font-bold">
                <i class="fa-solid fa-calendar-day text-brand-600"></i>
                <span>${depInfo.label}</span>
              </div>
              <div class="text-[9px] text-slate-400 mt-0.5">${depInfo.source}</div>
            </td>
            <td class="p-2 text-center" onclick="event.stopPropagation()">
              ${subvoyageBadge}
            </td>
            <td class="p-2 text-right" onclick="event.stopPropagation()">
              <button onclick="assignShipmentToSubvoyage('${tr.id}', '${activeSubvoyageId}')"
                      class="px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition inline-flex items-center gap-1 cursor-pointer">
                <span>Додати</span>
                <i class="fa-solid fa-arrow-right text-[9px]"></i>
              </button>
            </td>
          </tr>
        `;
      }
    }).join('');

    tbodyUnassignedShipments.querySelectorAll('.cb-unassigned-shipment').forEach(cb => {
      cb.addEventListener('change', (e) => {
        if (e.target.checked) selectedUnassignedIds.add(e.target.value);
        else selectedUnassignedIds.delete(e.target.value);
        updateBulkCounter();
        renderSubvoyagesTimeline();
        renderSubvoyageAssignedTable();
      });
    });

    const masterCheckbox = document.getElementById('select-all-master-shipments');
    if (masterCheckbox) {
      masterCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) list.forEach(t => selectedUnassignedIds.add(t.id));
        else list.forEach(t => selectedUnassignedIds.delete(t.id));
        renderShipmentsTable();
        updateBulkCounter();
        renderSubvoyagesTimeline();
        renderSubvoyageAssignedTable();
      });
    }
  }

  function updateBulkCounter() {
    if (bulkSelectedCounter) bulkSelectedCounter.textContent = `Обрано: ${selectedUnassignedIds.size} перевезень`;
    if (btnBulkAssignToActive) btnBulkAssignToActive.disabled = selectedUnassignedIds.size === 0;
  }

  // Відображення повної інформації про перевезення у вибраному підрейсі (без обіцянок, з митними умовами)
  function renderSubvoyageAssignedTable() {
    if (!tbodySubvoyageAssignedShipments) return;
    const currentSv = subVoyagesData.find(s => s.id === activeSubvoyageId);
    if (!currentSv) return;

    if (activeSubvoyageHeaderTitle) activeSubvoyageHeaderTitle.textContent = `${currentSv.name} (${currentSv.id})`;
    if (currentSubvoyageStatusSelect) currentSubvoyageStatusSelect.value = currentSv.status;
    if (currentSubvoyageCommentInput && document.activeElement !== currentSubvoyageCommentInput) {
      currentSubvoyageCommentInput.value = currentSv.comment || '';
    }

    const assigned = transportsData
      .filter(t => t.subvoyageId === activeSubvoyageId)
      .sort((a, b) => getShipmentDepartureInfo(a).date.localeCompare(getShipmentDepartureInfo(b).date));

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

    // Метрики Об'єму
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

    // Оновлюємо лічильник перевезень біля кнопки згортання
    const assignedCountBadge = document.getElementById('subvoyage-assigned-count-badge');
    if (assignedCountBadge) assignedCountBadge.textContent = assigned.length;

    if (subvoyageTotalCargoCount) subvoyageTotalCargoCount.textContent = assigned.length;
    if (subvoyageTotalVol) subvoyageTotalVol.textContent = cap.vol.toFixed(1);
    if (subvoyageMaxVol) subvoyageMaxVol.textContent = currentSv.maxVolume.toFixed(1);
    if (subvoyageTotalWeight) subvoyageTotalWeight.textContent = cap.weight.toFixed(1);
    if (subvoyageMaxWeight) subvoyageMaxWeight.textContent = currentSv.maxWeight.toFixed(1);
    if (subvoyageTotalPlaces) subvoyageTotalPlaces.textContent = cap.places;
    if (subvoyageMaxPlaces) subvoyageMaxPlaces.textContent = currentSv.maxPlaces;

    if (assigned.length === 0) {
      tbodySubvoyageAssignedShipments.innerHTML = `
        <tr>
          <td colspan="7" class="p-8 text-center text-slate-400 italic">У підрейсі немає доданих перевезень</td>
        </tr>
      `;
      return;
    }

    tbodySubvoyageAssignedShipments.innerHTML = assigned.map(tr => {
      const propBadges = renderShipmentPropertyBadges(tr);
      const customsBadges = renderCustomsBadges(tr);
      const depInfo = getShipmentDepartureInfo(tr);
      const uInfo = getShipmentUrgencyInfo(tr);

      return `
        <tr class="hover:bg-slate-50 transition cursor-pointer" onclick="handleShipmentRowClick('${tr.id}', event)">
          <td class="p-1.5 space-y-0.5">
            <div class="font-mono font-bold text-brand-700 text-[11px]">${tr.dfShipment || tr.id}</div>
            <div class="flex items-center gap-1 flex-wrap">
              ${renderStatusBadge(tr.status)}
              ${renderUrgencyBadge(uInfo)}
            </div>
          </td>
          <td class="p-1.5">
            <div class="font-semibold text-slate-800 text-[11px] truncate max-w-[110px]">${tr.client}</div>
            <div class="text-[9px] text-slate-400"><i class="fa-regular fa-user mr-1"></i>${tr.logist}</div>
          </td>
          <td class="p-1.5 space-y-0.5">
            <div class="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-bold text-[9px]">
              <i class="fa-solid fa-warehouse text-amber-700"></i>
              <span>${tr.hub || tr.destinationCountry}</span>
            </div>
            <div class="text-[9px] text-slate-500 flex items-center gap-1 flex-wrap">
              <span>${tr.originCountry} ➔ ${tr.destinationCountry}</span>
              <span>(</span>${renderTransportBadge(tr.transport, 'text-[9px]')}<span>/ ${tr.loadingType || 'LCL'})</span>
            </div>
          </td>
          <td class="p-1.5 font-mono text-[10px] text-slate-700">
            <div><strong>${tr.volume}</strong> м³ | <strong>${tr.weight}</strong> т</div>
            <div class="text-slate-500 text-[9px] font-bold">${tr.places || 0} місць</div>
          </td>
          <td class="p-1.5">
            ${customsBadges}
            <div class="flex items-center gap-1 flex-wrap">${propBadges}</div>
          </td>
          <td class="p-1.5 font-mono text-[10px]">
            <span class="bg-brand-50 text-brand-900 border border-brand-200 px-1.5 py-0.5 rounded font-bold inline-block">
              ${depInfo.label}
            </span>
          </td>
          <td class="p-1.5 text-right" onclick="event.stopPropagation()">
            <button onclick="detachShipmentFromSubvoyage('${tr.id}')" class="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[10px] font-bold border border-rose-200 transition cursor-pointer" title="Повернути в пул">
              <i class="fa-solid fa-arrow-left text-[9px]"></i> В пул
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Drawer (Повна інформація про Перевезення та Вантаж/Ерайв за специфікацією)
  window.handleShipmentRowClick = function (shipmentId, event) {
    if (event.target.closest('input') || event.target.closest('button') || event.target.closest('a')) return;
    openContextDrawer(shipmentId);
  };

  window.openContextDrawer = function (shipmentId) {
    const tr = transportsData.find(t => t.id === shipmentId);
    if (!tr) return;

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

    if (drawerRoute) {
      drawerRoute.innerHTML = `<span>${tr.originCountry} ➔ ${tr.destinationCountry}</span> <span class="ml-1 inline-flex items-center gap-1">(${renderTransportBadge(tr.transport)})</span>`;
    }
    if (drawerHubBadge) {
      drawerHubBadge.innerHTML = `<i class="fa-solid fa-warehouse text-amber-700"></i> <span>Склад прибуття: ${tr.hub || 'Не вказано'}</span>`;
    }
    if (drawerOriginAddress) drawerOriginAddress.textContent = tr.originAddress || `${tr.originCountry}, Консолідаційний термінал`;
    if (drawerDestinationAddress) drawerDestinationAddress.textContent = tr.destinationAddress || `${tr.destinationCountry}, ${tr.hub || 'Центральний склад'}`;

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
      const adr = tr.isHazardous ? '<span class="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Небезпечний вантаж (ADR)</span>' : '<span class="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px]">Небезпечний вантаж: НІ</span>';
      const batt = tr.hasBatteries ? '<span class="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-battery-half"></i> Наявність батарей: ТАК</span>' : '<span class="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px]">Батареї: НІ</span>';
      const docs = tr.closeExporterDocs
        ? '<span class="bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-file-contract"></i> Закрити док. експортеру: ТАК</span>'
        : '<span class="bg-slate-100 text-slate-600 border border-slate-300 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-file-contract"></i> Закрити док. експортеру: НІ</span>';

      const visa = tr.hasVisa
        ? '<span class="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-circle-check"></i> Допуск/Віза: Є віза</span>'
        : '<span class="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-circle-xmark"></i> Допуск/Віза: Немає</span>';

      drawerPropertyBadges.innerHTML = `${adr} ${batt} ${docs} ${visa}`;
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
      drawerBtnAssign.style.display = tr.subvoyageId === activeSubvoyageId ? 'none' : 'inline-flex';
      drawerBtnAssign.onclick = () => { assignShipmentToSubvoyage(tr.id, activeSubvoyageId); closeContextDrawer(); };
    }

    if (contextDrawerBackdrop) contextDrawerBackdrop.classList.remove('hidden');
    if (contextDrawer) contextDrawer.classList.remove('translate-x-full');
  };

  function closeContextDrawer() {
    if (contextDrawerBackdrop) contextDrawerBackdrop.classList.add('hidden');
    if (contextDrawer) contextDrawer.classList.add('translate-x-full');
  }

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
    showToast(`Перевезення ${tr.id} додано в ${svId} (Статус: ${sv.status})`);
    renderAll();
  };

  window.detachShipmentFromSubvoyage = function (shipmentId) {
    const tr = transportsData.find(t => t.id === shipmentId);
    if (!tr) return;
    tr.subvoyageId = null;
    tr.status = 'Готовий до завантаження';
    syncSubvoyageAndShipmentsStatuses();
    showToast(`Перевезення ${tr.id} повернуто в пул (Готовий до завантаження)`);
    renderAll();
  };

  window.clearCurrentSubvoyageShipments = function () {
    const assigned = transportsData.filter(t => t.subvoyageId === activeSubvoyageId);
    if (assigned.length === 0) return;
    if (confirm(`Відкріпити всі перевезення з підрейсу ${activeSubvoyageId}?`)) {
      assigned.forEach(t => {
        t.subvoyageId = null;
        t.status = 'Готовий до завантаження';
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

  function setupQuickFilters() {
    const setQuick = (mode) => {
      filters.quickFilter = mode;
      const activeClass = 'px-2.5 py-1 rounded-md transition bg-white text-brand-700 font-bold shadow-2xs cursor-pointer';
      const normalClass = 'px-2.5 py-1 rounded-md transition text-slate-600 hover:text-slate-900 font-medium cursor-pointer';
      const lastMileActiveClass = 'px-2.5 py-1 rounded-md transition bg-purple-600 text-white font-bold shadow-2xs cursor-pointer';

      if (btnQuickFilterReady) btnQuickFilterReady.className = mode === 'ready' ? activeClass : normalClass;
      if (btnQuickFilterAttached) btnQuickFilterAttached.className = mode === 'attached' ? activeClass : normalClass;
      if (btnQuickFilterLastmile) btnQuickFilterLastmile.className = mode === 'lastmile' ? lastMileActiveClass : 'px-2.5 py-1 rounded-md transition text-purple-700 font-bold flex items-center gap-1 cursor-pointer';
      if (btnQuickFilterOthers) btnQuickFilterOthers.className = mode === 'others' ? activeClass : normalClass;

      renderAll();
    };

    if (btnQuickFilterReady) btnQuickFilterReady.addEventListener('click', () => setQuick('ready'));
    if (btnQuickFilterAttached) btnQuickFilterAttached.addEventListener('click', () => setQuick('attached'));
    if (btnQuickFilterLastmile) btnQuickFilterLastmile.addEventListener('click', () => setQuick('lastmile'));
    if (btnQuickFilterOthers) btnQuickFilterOthers.addEventListener('click', () => setQuick('others'));
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
      renderAll();
    });
  }

  if (btnQuickResetFilters) {
    btnQuickResetFilters.addEventListener('click', () => {
      filters.search = '';
      filters.quickFilter = 'ready';
      filters.urgency = 'all';
      filters.hubs.clear();
      selectedSubvoyageUrgency = 'all';
      selectedDestinationHub = 'all';
      if (subvoyageDestinationHubFilter) subvoyageDestinationHubFilter.value = 'all';
      if (searchInput) searchInput.value = '';

      const allStatuses = Array.from(new Set(subVoyagesData.map(s => s.status))).filter(Boolean);
      const allLogists = Array.from(new Set(subVoyagesData.map(s => s.logist))).filter(Boolean);
      selectedSubvoyageStatuses = new Set(allStatuses);
      selectedSubvoyageLogists = new Set(allLogists);
      document.querySelectorAll('.sv-status-cb').forEach(cb => cb.checked = true);
      document.querySelectorAll('.sv-logist-cb').forEach(cb => cb.checked = true);
      updateSubvoyageStatusFilterLabel(allStatuses.length);
      updateSubvoyageLogistFilterLabel(allLogists.length);

      renderAll();
      showToast('Фільтри скинуто');
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

    updateActiveSubvoyageState();
    renderSubvoyagesTimeline();
    renderShipmentsTable();
    renderSubvoyageAssignedTable();
    updateBulkCounter();
  }

  setupUrgencyButtons();
  setupQuickFilters();
  loadData();

  window.reloadSubvoyagesPlannerData = function() {
    loadData();
  };
}

window.initSubvoyagesPlanner = function() {
  initSubvoyagesPlannerModule();
};

document.addEventListener('DOMContentLoaded', () => {
  // If standing alone on sub-voyages-management.html, auto-init
  if (document.getElementById('panel-shipments-master') && !document.getElementById('cargo-registry-container')) {
    initSubvoyagesPlannerModule();
  }
});