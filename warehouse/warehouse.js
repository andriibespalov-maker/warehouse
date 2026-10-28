// Status Groups Mapping
const STATUS_GROUP_MAPPING = {
  // 1. ГРУПА: НА СКЛАДІ (on_warehouse)
  'new': 'on_warehouse',
  'at_origin_warehouse': 'on_warehouse',
  'transfered_to_logistician_for_marking': 'on_warehouse',
  'transferred_to_logistician': 'on_warehouse',
  'storaging_in_warehouse': 'on_warehouse',
  'waiting_for_task_execution': 'on_warehouse',
  'waiting_for_other_parts': 'on_warehouse',
  'awaiting_readiness': 'on_warehouse',
  'ready_for_loading': 'on_warehouse',

  // 2. ГРУПА: НЕПРОМАРКОВАНІ (unmarked) — Окремо для опрацювання менеджером
  'received_unmarked': 'unmarked',

  // 3. ГРУПА: ОЧІКУВАННЯ ПРИБУТТЯ (awaiting_arrival)
  'in_transit': 'awaiting_arrival',

  // 4. ГРУПА: ОСТАННЯ МИЛЯ (last_mile)
  'at_destination_warehouse': 'last_mile',
  'handed_over_to_self_pickup': 'last_mile',
  'preparing_for_last_mile': 'last_mile',
  'shipped_courier_service': 'last_mile',

  // 5. ГРУПА: АРХІВ (archive)
  'issued': 'archive',
  'returned_to_customer': 'archive'
};

const STATUS_CONFIG = {
  'at_origin_warehouse': {title: 'На складі відправки', class: 'bg-blue-100 text-blue-800 border-blue-300'},
  'received_unmarked': {title: 'Отримано непромаркованим', class: 'bg-amber-100 text-amber-800 border-amber-300'},
  'transfered_to_logistician_for_marking': {
    title: 'Передано логісту на маркування',
    class: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  'transferred_to_logistician': {
    title: 'Передано Складу на маркування',
    class: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  'storaging_in_warehouse': {title: 'Зберігання на складі', class: 'bg-slate-100 text-slate-800 border-slate-300'},
  'waiting_for_task_execution': {
    title: 'Очікує виконання завдання по вантажу',
    class: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  'waiting_for_other_parts': {title: 'Очікує інші частини', class: 'bg-amber-100 text-amber-800 border-amber-300'},
  'awaiting_readiness': {title: 'Очікує готовності', class: 'bg-indigo-100 text-indigo-800 border-indigo-300'},
  'ready_for_loading': {title: 'Готовий до завантаження', class: 'bg-emerald-100 text-emerald-800 border-emerald-300'},
  'in_transit': {title: 'В дорозі', class: 'bg-purple-100 text-purple-800 border-purple-300'},
  'at_destination_warehouse': {title: 'На складі призначення', class: 'bg-teal-100 text-teal-800 border-teal-300'},
  'handed_over_to_self_pickup': {title: 'Передано на самовивіз', class: 'bg-sky-100 text-sky-800 border-sky-300'},
  'preparing_for_last_mile': {
    title: 'Готується до відправки останньої милі',
    class: 'bg-cyan-100 text-cyan-800 border-cyan-300'
  },
  'shipped_courier_service': {
    title: 'Відправлено кур`єрською службою',
    class: 'bg-violet-100 text-violet-800 border-violet-300'
  },
  'issued': {title: 'Виданий', class: 'bg-emerald-200 text-emerald-900 border-emerald-400'},
  'returned_to_customer': {title: 'Повернено клієнту', class: 'bg-rose-100 text-rose-800 border-rose-300'}
};

// Global Dynamic Datasets
let subvoyagesData = [];
let cargoesData = [];
let selectedCargoIds = [];

// System State Variables
let activeSubvoyageId = 'ALL';
let subvoyageLogistFilter = [];
let activeStatusGroup = 'on_warehouse';
let isGroupedByShipment = false;
let currentAssignShipmentKey = null;
let currentShipmentContext = null;
let currentPage = 1;
let itemsPerPage = 20;

let cargoFilterManager = null;

/**
 * Отримання відповідної групи статусів для вантажу
 */
function getCargoStatusGroup(cargo) {
  if (cargo.isUnmarked === true || cargo.statusCode === 'received_unmarked') {
    return 'unmarked';
  }
  return STATUS_GROUP_MAPPING[cargo.statusCode] || 'on_warehouse';
}

function getCapacityTheme(percentage) {
  if (percentage >= 100) {
    return {bg: 'bg-rose-600', badge: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'};
  } else if (percentage > 80) {
    return {bg: 'bg-amber-500', badge: 'bg-amber-100 text-amber-800 border-amber-300'};
  } else {
    return {bg: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300'};
  }
}

/**
 * Управління активністю полів Напрямок та Отримувач залежно від статусу
 */
function toggleLastMileFields(statusCode) {
  const lastMileStatuses = [
    'at_destination_warehouse',
    'handed_over_to_self_pickup',
    'preparing_for_last_mile',
    'shipped_courier_service'
  ];

  const isLastMile = lastMileStatuses.includes(statusCode) || STATUS_GROUP_MAPPING[statusCode] === 'last_mile';

  const dirElem = document.getElementById('arrive-direction');
  const recElem = document.getElementById('arrive-recipient');

  if (dirElem) {
    dirElem.disabled = !isLastMile;
    if (isLastMile) {
      dirElem.classList.remove('bg-slate-100', 'cursor-not-allowed');
      dirElem.classList.add('bg-white');
    } else {
      dirElem.classList.add('bg-slate-100', 'cursor-not-allowed');
      dirElem.classList.remove('bg-white');
    }
  }

  if (recElem) {
    recElem.disabled = !isLastMile;
    if (isLastMile) {
      recElem.classList.remove('bg-slate-100', 'cursor-not-allowed');
      recElem.classList.add('bg-white');
    } else {
      recElem.classList.add('bg-slate-100', 'cursor-not-allowed');
      recElem.classList.remove('bg-white');
    }
  }
}

// Динамічне заповнення чекбоксів логістів та прив'язка обробників
function populateSubvoyageLogistFilter() {
  const container = document.getElementById('subvoyage-logist-checkboxes-container');
  if (!container || !Array.isArray(subvoyagesData)) return;

  const logists = Array.from(new Set(subvoyagesData.map(s => s.logist))).filter(Boolean);
  subvoyageLogistFilter = [...logists]; // За дефолтом обрано усіх

  container.innerHTML = logists.map(l => `
    <label class="flex items-center gap-2 text-xs text-slate-700 hover:bg-slate-50 p-1 rounded cursor-pointer select-none">
        <input type="checkbox" value="${l}" checked class="subvoyage-logist-cb rounded text-brand-600 focus:ring-brand-500">
        <span class="truncate">${l}</span>
    </label>
  `).join('');

  updateSubvoyageLogistFilterUI(logists.length);
  setupSubvoyageLogistDropdownListeners(logists.length);
}

function getSelectedSubvoyageLogists() {
  const checkboxes = document.querySelectorAll('.subvoyage-logist-cb');
  return Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
}

function updateSubvoyageLogistFilterUI(totalCount) {
  const selected = getSelectedSubvoyageLogists();
  subvoyageLogistFilter = selected;

  const btnText = document.getElementById('subvoyage-logist-btn-text');
  if (btnText) {
    if (selected.length === totalCount) {
      btnText.innerText = 'Усі логісти';
    } else if (selected.length === 0) {
      btnText.innerText = 'Не обрано (0)';
    } else if (selected.length <= 2) {
      btnText.innerText = selected.join(', ');
    } else {
      btnText.innerText = `Обрано: ${selected.length}`;
    }
  }
  renderSubvoyageTabs();
  renderTable();
}

function setupSubvoyageLogistDropdownListeners(totalCount) {
  const btn = document.getElementById('subvoyage-logist-dropdown-btn');
  const menu = document.getElementById('subvoyage-logist-dropdown-menu');
  const selectAllBtn = document.getElementById('subvoyage-logist-select-all');
  const clearAllBtn = document.getElementById('subvoyage-logist-clear-all');

  if (!btn || !menu) return;

  btn.onclick = (e) => {
    e.stopPropagation();
    document.querySelectorAll('.filter-menu').forEach(m => {
      if (m.id !== 'subvoyage-logist-dropdown-menu') m.classList.add('hidden');
    });
    menu.classList.toggle('hidden');
  };

  menu.onclick = (e) => e.stopPropagation();

  document.querySelectorAll('.subvoyage-logist-cb').forEach(cb => {
    cb.onchange = () => updateSubvoyageLogistFilterUI(totalCount);
  });

  if (selectAllBtn) {
    selectAllBtn.onclick = () => {
      document.querySelectorAll('.subvoyage-logist-cb').forEach(cb => cb.checked = true);
      updateSubvoyageLogistFilterUI(totalCount);
    };
  }

  if (clearAllBtn) {
    clearAllBtn.onclick = () => {
      document.querySelectorAll('.subvoyage-logist-cb').forEach(cb => cb.checked = false);
      updateSubvoyageLogistFilterUI(totalCount);
    };
  }
}

function renderSubvoyageTabs() {
  const container = document.getElementById('subvoyage-tabs-container');
  if (!container) return;
  container.innerHTML = '';

  const btnManage = document.getElementById('btn-manage-subvoyages');
  const btnManageText = document.getElementById('btn-manage-subvoyages-text');
  if (btnManage) {
    if (activeSubvoyageId && activeSubvoyageId !== 'ALL') {
      btnManage.href = `sub-voyages-management.html?subvoyageId=${activeSubvoyageId}`;
      if (btnManageText) btnManageText.innerText = `Управління (${activeSubvoyageId})`;
    } else {
      btnManage.href = 'sub-voyages-management.html';
      if (btnManageText) btnManageText.innerText = 'Управління Підрейсами';
    }
  }

  let visibleSubvoyages = subvoyagesData;
  if (Array.isArray(subvoyageLogistFilter)) {
    visibleSubvoyages = subvoyagesData.filter(s => subvoyageLogistFilter.includes(s.logist));
  }

  const activeSubvoyageIds = new Set(visibleSubvoyages.map(s => s.id));
  const subvoyagesCargoes = cargoesData.filter(c => c.subvoyage && activeSubvoyageIds.has(c.subvoyage));

  let subvolActual = subvoyagesCargoes.reduce((sum, c) => sum + c.volume, 0);
  let subweightActual = subvoyagesCargoes.reduce((sum, c) => sum + c.weight, 0);
  let subplacesActual = subvoyagesCargoes.reduce((sum, c) => sum + c.places, 0);

  let subvolMax = visibleSubvoyages.reduce((sum, s) => sum + (s.capacity?.volMax || 0), 0);
  let subweightMax = visibleSubvoyages.reduce((sum, s) => sum + (s.capacity?.weightMax || 0), 0);
  let subplacesMax = visibleSubvoyages.reduce((sum, s) => sum + (s.capacity?.placesMax || 0), 0);

  const allLogists = Array.from(new Set(subvoyagesData.map(s => s.logist))).filter(Boolean);
  let logistLabel = 'Усі логісти';
  if (Array.isArray(subvoyageLogistFilter)) {
    if (subvoyageLogistFilter.length === allLogists.length) logistLabel = 'Усі логісти';
    else if (subvoyageLogistFilter.length === 0) logistLabel = 'Не обрано';
    else if (subvoyageLogistFilter.length <= 2) logistLabel = subvoyageLogistFilter.join(', ');
    else logistLabel = `Обрано: ${subvoyageLogistFilter.length}`;
  }

  const allTabObj = {
    id: 'ALL',
    name: 'Усі підрейси',
    mode: 'Сумарно за підрейсами',
    logist: logistLabel,
    capacity: {volMax: subvolMax, weightMax: subweightMax, placesMax: subplacesMax}
  };

  const listToRender = [allTabObj, ...visibleSubvoyages];

  listToRender.forEach(sv => {
    const isActive = sv.id === activeSubvoyageId;

    let volActual = 0, weightActual = 0, placesActual = 0;

    if (sv.id === 'ALL') {
      volActual = subvolActual;
      weightActual = subweightActual;
      placesActual = subplacesActual;
    } else {
      const svCargoes = cargoesData.filter(c => c.subvoyage === sv.id);
      volActual = svCargoes.reduce((sum, c) => sum + c.volume, 0);
      weightActual = svCargoes.reduce((sum, c) => sum + c.weight, 0);
      placesActual = svCargoes.reduce((sum, c) => sum + c.places, 0);
    }

    const volMax = sv.capacity?.volMax ?? 67.0;
    const weightMax = sv.capacity?.weightMax ?? 10.0;
    const placesMax = sv.capacity?.placesMax ?? 300;

    const volPct = volMax > 0 ? Math.min(100, Math.round((volActual / volMax) * 100)) : 0;
    const weightPct = weightMax > 0 ? Math.min(100, Math.round((weightActual / weightMax) * 100)) : 0;
    const placesPct = placesMax > 0 ? Math.min(100, Math.round((placesActual / placesMax) * 100)) : 0;

    const compositeMax = Math.max(volPct, weightPct, placesPct);
    const theme = getCapacityTheme(compositeMax);

    const cardHtml = `
            <div data-sv-id="${sv.id}" class="tab-card cursor-pointer rounded-xl p-3 border transition-all duration-200 relative overflow-hidden select-none ${
      isActive
        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-brand-500/50'
        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
    }">
                <div class="flex items-center justify-between mb-1">
                    <span class="font-bold text-xs uppercase tracking-wide ${isActive ? 'text-brand-400' : 'text-slate-700'}">${sv.name}</span>
                    <div class="flex items-center gap-1.5">
                        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full border ${theme.badge}">
                            ${compositeMax}%
                        </span>
                    </div>
                </div>

                <div class="text-[10px] opacity-75 font-medium mb-1.5 flex items-center justify-between">
                    <span><i class="fa-solid ${getTransportIcon(sv.mode)} mr-1"></i>${sv.mode}</span>
                    <span class="font-semibold text-brand-600 dark:text-brand-300"><i class="fa-regular fa-user mr-0.5"></i>${sv.logist}</span>
                </div>

                <div class="space-y-1 text-[10px]">
                    <div>
                        <div class="flex justify-between mb-0.5 opacity-90">
                            <span>Об'єм: ${volActual.toFixed(1)}/${volMax.toFixed(1)} m³</span>
                            <span class="font-bold">${volPct}%</span>
                        </div>
                        <div class="w-full h-1.5 bg-slate-200/40 rounded-full overflow-hidden">
                            <div class="h-full ${getCapacityTheme(volPct).bg} transition-all duration-300" style="width: ${volPct}%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between mb-0.5 opacity-90">
                            <span>Вага: ${weightActual.toFixed(2)}/${weightMax.toFixed(2)} кг</span>
                            <span class="font-bold">${weightPct}%</span>
                        </div>
                        <div class="w-full h-1.5 bg-slate-200/40 rounded-full overflow-hidden">
                            <div class="h-full ${getCapacityTheme(weightPct).bg} transition-all duration-300" style="width: ${weightPct}%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between mb-0.5 opacity-90">
                            <span>Місця: ${placesActual}/${placesMax} шт</span>
                            <span class="font-bold">${placesPct}%</span>
                        </div>
                        <div class="w-full h-1.5 bg-slate-200/40 rounded-full overflow-hidden">
                            <div class="h-full ${getCapacityTheme(placesPct).bg} transition-all duration-300" style="width: ${placesPct}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    container.insertAdjacentHTML('beforeend', cardHtml);
  });

  document.querySelectorAll('.tab-card').forEach(tab => {
    tab.addEventListener('click', () => {
      activeSubvoyageId = tab.getAttribute('data-sv-id');
      renderSubvoyageTabs();
      renderTable();
    });
  });
}

function isCargoInSubvoyageScope(c) {
  if (activeSubvoyageId !== 'ALL') {
    return c.subvoyage === activeSubvoyageId;
  }

  if (Array.isArray(subvoyageLogistFilter)) {
    const allLogists = Array.from(new Set(subvoyagesData.map(s => s.logist))).filter(Boolean);
    if (subvoyageLogistFilter.length === allLogists.length) {
      return true;
    }

    const allowedSubvoyageIds = new Set(
      subvoyagesData.filter(s => subvoyageLogistFilter.includes(s.logist)).map(s => s.id)
    );

    if (c.subvoyage) {
      return allowedSubvoyageIds.has(c.subvoyage);
    }
    if (c.logist) {
      return subvoyageLogistFilter.includes(c.logist);
    }
  }

  return true;
}

function updateStatusGroupTabs() {
  const groupCounts = {on_warehouse: 0, unmarked: 0, awaiting_arrival: 0, last_mile: 0, archive: 0};
  const groupKeys = ['on_warehouse', 'unmarked', 'awaiting_arrival', 'last_mile', 'archive'];

  (cargoesData || []).forEach(c => {
    if (!isCargoInSubvoyageScope(c)) return;

    if (typeof cargoFilterManager !== 'undefined' && cargoFilterManager && cargoFilterManager.matches) {
      if (!cargoFilterManager.matches(c)) return;
    }

    const grp = getCargoStatusGroup(c);
    if (groupCounts[grp] !== undefined) {
      groupCounts[grp]++;
    }
  });

  groupKeys.forEach(grp => {
    const badge = document.getElementById(`badge-count-${grp}`);
    const count = groupCounts[grp] || 0;
    if (badge) badge.innerText = count;
  });

  document.querySelectorAll('.status-group-tab').forEach(btn => {
    const grp = btn.getAttribute('data-status-group');
    const badge = document.getElementById(`badge-count-${grp}`);
    const isActive = (grp === activeStatusGroup);
    const count = groupCounts[grp] || 0;

    if (isActive) {
      btn.className = 'status-group-tab bg-white text-slate-900 shadow-xs ring-1 ring-slate-900/5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer select-none whitespace-nowrap';
      if (badge) badge.className = 'badge-count bg-slate-900 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold';
    } else {
      btn.className = 'status-group-tab hover:bg-white/60 text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer select-none whitespace-nowrap';
      if (badge) badge.className = `badge-count ${count > 0 ? 'bg-slate-200/80 text-slate-700' : 'bg-slate-200/50 text-slate-400'} px-2 py-0.5 rounded-full text-[10px] font-extrabold`;
    }
  });
}

function openPhotoModal(cargoId) {
  const cargo = cargoesData.find(c => c.id === cargoId);
  if (!cargo) return;

  const hasShipment = Boolean(cargo.dfShipment && cargo.dfShipment.trim() !== '');

  document.getElementById('m-photo-id').innerText = cargo.id;
  document.getElementById('m-photo-route').innerText = hasShipment ? `${cargo.origin} ➔ ${cargo.destination}` : '—';
  document.getElementById('m-photo-status').innerText = cargo.status;

  renderPhotoStagesList(cargo);
  document.getElementById('modal-photo').classList.remove('hidden');
}

function renderPhotoStagesList(cargo) {
  const stagesContainer = document.getElementById('m-photo-stages-container');
  if (!stagesContainer) return;
  stagesContainer.innerHTML = '';

  if (cargo.photoStages && cargo.photoStages.length > 0) {
    cargo.photoStages.forEach((st) => {
      const hasPhotos = st.photos && st.photos.length > 0;

      let photosGridHtml = '';
      if (hasPhotos) {
        photosGridHtml = `
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 mt-3">
                ${st.photos.map(p => `
                    <div class="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                        <img src="${p.url}" alt="Cargo Condition Photo" class="w-full h-24 object-cover group-hover:opacity-85 transition duration-200">
                        <div class="absolute bottom-0 inset-x-0 bg-slate-900/85 text-white text-[9px] p-1 truncate">
                            ${p.caption}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
      }

      let tagsHtml = '';
      if (st.tags && st.tags.length > 0) {
        tagsHtml = st.tags.map(t => `<span class="bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded text-[11px] font-medium">${t}</span>`).join(' ');
      }

      const stageCard = `
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 relative space-y-2">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-lg ${hasPhotos ? 'bg-brand-600 text-white' : 'bg-slate-300 text-slate-600'} flex items-center justify-center font-bold text-xs">
                            <i class="fa-solid fa-camera"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-slate-800 text-xs">${st.warehouseName}</h4>
                            <span class="text-[11px] text-slate-500">${st.stageType || 'Фіксація стану'} (${st.photos ? st.photos.length : 0} фото)</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 text-xs">
                        <span class="px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${st.conditionClass || 'bg-slate-100 text-slate-700 border-slate-300'}">
                            ${st.condition || 'Норма'}
                        </span>
                        <span class="text-slate-400 font-mono text-[11px]"><i class="fa-regular fa-clock mr-1"></i>${st.date}</span>
                        <span class="text-slate-600 font-medium text-[11px]"><i class="fa-regular fa-user mr-1"></i>${st.operator}</span>
                    </div>
                </div>

                ${st.comment ? `<p class="text-xs text-slate-700 bg-white p-2 rounded border border-slate-100 italic"><i class="fa-regular fa-comment-dots text-brand-600 mr-1"></i>"${st.comment}"</p>` : ''}

                ${photosGridHtml}

                ${tagsHtml ? `<div class="mt-2 flex flex-wrap gap-1.5 items-center">${tagsHtml}</div>` : ''}
            </div>
        `;
      stagesContainer.insertAdjacentHTML('beforeend', stageCard);
    });
  } else {
    stagesContainer.innerHTML = `
        <div class="p-8 text-center text-slate-400 border border-dashed border-slate-300 rounded-xl">
            <i class="fa-solid fa-camera text-3xl mb-2 block text-slate-300"></i>
            Історія фотофіксацій та зареєстрованих станів порожня
        </div>
    `;
  }
}

function openTasksModal(cargoId) {
  const cargo = cargoesData.find(c => c.id === cargoId);
  if (!cargo) return;

  document.getElementById('m-task-cargo-id').innerText = cargo.id;
  renderTasksList(cargo);
  document.getElementById('modal-tasks').classList.remove('hidden');
}

function renderTasksList(cargo) {
  const container = document.getElementById('tasks-list-container');
  if (!container) return;
  container.innerHTML = '';

  if (cargo.tasks && cargo.tasks.length > 0) {
    cargo.tasks.forEach((t) => {
      let statusBadge = 'bg-blue-100 text-blue-800 border-blue-200';
      if (t.status === 'В роботі') statusBadge = 'bg-amber-100 text-amber-800 border-amber-200 font-bold';
      if (t.status === 'Завершено') statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';

      const cardHtml = `
            <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs shadow-sm">
                <div class="flex items-center gap-2.5">
                    <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-mono text-[10px] font-bold">
                        ${t.id}
                    </div>
                    <div>
                        <div class="font-bold text-slate-800">${t.title}</div>
                        <div class="text-[10px] text-slate-500">Відповідальний: <strong class="text-brand-700">${t.logist}</strong></div>
                    </div>
                </div>

                <span class="px-2.5 py-0.5 rounded-full text-[10px] border ${statusBadge}">
                    ${t.status}
                </span>
            </div>
        `;
      container.insertAdjacentHTML('beforeend', cardHtml);
    });
  } else {
    container.innerHTML = `
        <div class="p-4 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg text-xs">
            Задач по даному вантажу не знайдено
        </div>
    `;
  }
}

function openAssignSubvoyageModal(shipmentKey, reqVol, reqWeight, reqPlaces, shipmentMode, shipmentLogist) {
  currentAssignShipmentKey = shipmentKey;
  currentShipmentContext = {shipmentKey, reqVol, reqWeight, reqPlaces, shipmentMode, shipmentLogist};

  document.getElementById('m-assign-shipment-id').innerText = shipmentKey;
  document.getElementById('m-assign-req-places').innerText = reqPlaces;
  document.getElementById('m-assign-req-vol').innerText = reqVol.toFixed(1);
  document.getElementById('m-assign-req-weight').innerText = reqWeight.toFixed(2);

  document.getElementById('m-assign-mode-badge').innerHTML = `<i class="fa-solid ${getTransportIcon(shipmentMode)} mr-1.5"></i>${shipmentMode || 'Без транспорту'}`;
  document.getElementById('m-assign-logist-badge').innerHTML = `<i class="fa-regular fa-user text-slate-500 mr-1.5"></i>Логіст: ${shipmentLogist || 'Не призначено'}`;

  const logistSelect = document.getElementById('m-filter-logist-select');
  if (logistSelect) {
    logistSelect.innerHTML = `<option value="ALL">Усі логісти</option>`;
    const uniqueLogists = Array.from(new Set(subvoyagesData.map(s => s.logist))).filter(Boolean);
    uniqueLogists.forEach(l => {
      const isSelected = (l === shipmentLogist) ? 'selected' : '';
      logistSelect.insertAdjacentHTML('beforeend', `<option value="${l}" ${isSelected}>${l}</option>`);
    });
  }

  const sameModeCb = document.getElementById('m-filter-same-mode');
  if (sameModeCb) sameModeCb.checked = Boolean(shipmentMode);

  renderAssignSubvoyagesList();
  document.getElementById('modal-assign-subvoyage').classList.remove('hidden');
}

function renderAssignSubvoyagesList() {
  if (!currentShipmentContext) return;
  const {shipmentKey, reqVol, reqWeight, reqPlaces, shipmentMode, shipmentLogist} = currentShipmentContext;

  const sameModeElem = document.getElementById('m-filter-same-mode');
  const filterSameMode = sameModeElem ? sameModeElem.checked : false;

  const logistSelectElem = document.getElementById('m-filter-logist-select');
  const selectedLogist = logistSelectElem ? logistSelectElem.value : 'ALL';

  const listContainer = document.getElementById('assign-subvoyage-list');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  let processed = subvoyagesData.map(sv => {
    const svCargoes = cargoesData.filter(c => c.subvoyage === sv.id && c.dfShipment !== shipmentKey);
    const currentVol = svCargoes.reduce((sum, c) => sum + c.volume, 0);
    const currentWeight = svCargoes.reduce((sum, c) => sum + c.weight, 0);
    const currentPlaces = svCargoes.reduce((sum, c) => sum + c.places, 0);

    const freeVol = (sv.capacity?.volMax ?? 67) - currentVol;
    const freeWeight = (sv.capacity?.weightMax ?? 10.0) - currentWeight;
    const freePlaces = (sv.capacity?.placesMax ?? 300) - currentPlaces;

    const isEnough = (freeVol >= reqVol) && (freeWeight >= reqWeight) && (freePlaces >= reqPlaces);
    const isModeMatch = shipmentMode ? (sv.mode.toLowerCase().includes(shipmentMode.toLowerCase()) || shipmentMode.toLowerCase().includes(sv.mode.toLowerCase())) : true;
    const isLogistMatch = shipmentLogist ? (sv.logist === shipmentLogist) : true;

    return {sv, freeVol, freeWeight, freePlaces, isEnough, isModeMatch, isLogistMatch};
  });

  if (filterSameMode && shipmentMode) {
    processed = processed.filter(item => item.isModeMatch);
  }
  if (selectedLogist !== 'ALL') {
    processed = processed.filter(item => item.sv.logist === selectedLogist);
  }

  processed.sort((a, b) => {
    if (a.freeVol !== b.freeVol) {
      return a.freeVol - b.freeVol;
    }
    return a.sv.mode.localeCompare(b.sv.mode, 'uk');
  });

  const countElem = document.getElementById('m-subvoyages-count');
  if (countElem) countElem.innerText = `Знайдено: ${processed.length}`;

  if (processed.length === 0) {
    listContainer.innerHTML = `
        <div class="p-6 text-center text-slate-400 border border-dashed border-slate-300 rounded-xl">
            <i class="fa-solid fa-filter-circle-xmark text-2xl mb-1 block"></i>
            Не знайдено підрейсів за обраними критеріями. Спробуйте послабити фільтри.
        </div>
    `;
    return;
  }

  processed.forEach(({sv, freeVol, freeWeight, freePlaces, isEnough, isLogistMatch}) => {
    const cardClass = isEnough
      ? 'bg-slate-50 hover:bg-brand-50 border-slate-200'
      : 'bg-slate-100 opacity-60 border-slate-200 cursor-not-allowed';

    const radioCard = `
        <label class="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition select-none ${cardClass}">
            <div class="flex items-center gap-3">
                <input type="radio" name="select-subvoyage-radio" value="${sv.id}" ${!isEnough ? 'disabled' : ''} class="text-brand-600 focus:ring-brand-500">
                <div>
                    <div class="flex items-center gap-2">
                        <strong class="text-slate-900 font-mono text-xs">${sv.name}</strong>
                        <span class="text-[11px] text-slate-600 font-semibold"><i class="fa-solid ${getTransportIcon(sv.mode)} mr-1"></i>${sv.mode}</span>
                    </div>
                    <span class="text-[10px] text-slate-500">Логіст: <strong class="${isLogistMatch ? 'text-brand-700' : 'text-slate-700'}">${sv.logist}</strong></span>
                </div>
            </div>

            <div class="text-right text-[10px] font-mono">
                <div class="text-slate-600">
                    Вільний об'єм: <strong>${freeVol.toFixed(1)} m³</strong> | Вага: <strong>${freeWeight.toFixed(2)} кг</strong> | Вільні місця: <strong>${freePlaces} шт</strong>
                </div>
            </div>
        </label>
    `;
    listContainer.insertAdjacentHTML('beforeend', radioCard);
  });
}

function showToast(message, duration = 2000) {
  let toast = document.getElementById('custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.className = 'fixed top-5 right-5 z-[100] bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-medium flex items-center gap-2 transition-all duration-300 opacity-0 transform -translate-y-2 pointer-events-none';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> <span>${message}</span>`;

  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', '-translate-y-2', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');
  });

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', '-translate-y-2', 'pointer-events-none');
  }, duration);
}

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
}

document.addEventListener('input', (e) => {
  if (e.target.classList.contains('custom-dropdown-search')) {
    const query = e.target.value.toLowerCase().trim();
    const menu = e.target.closest('.custom-select-menu');
    if (!menu) return;

    const options = menu.querySelectorAll('.custom-option');
    options.forEach(opt => {
      const text = opt.innerText.toLowerCase();
      if (!query || text.includes(query)) {
        opt.classList.remove('hidden');
      } else {
        opt.classList.add('hidden');
      }
    });
  }
});

// 2. Редагування вантажу: показуємо блок
function editCargo(cargoId) {
  const cargo = cargoesData.find(c => c.id === cargoId);
  if (!cargo) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  const titleElem = document.getElementById('m-arrive-title');
  if (titleElem) titleElem.innerText = `Редагувати ерайв ${cargo.id}`;

  const idElem = document.getElementById('arrive-cargo-id');
  if (idElem) idElem.value = cargo.id;

  const cargoTypeSelect = document.getElementById('arrive-cargo-type');
  if (cargoTypeSelect) cargoTypeSelect.value = cargo.cargoType || 'cargo';

  populateArriveModalDropdowns(cargo.dfShipment || '', cargo.dfPromise || '');

  const closeDocsCb = document.getElementById('arrive-close-docs-exporter');
  if (closeDocsCb) closeDocsCb.checked = Boolean(cargo.closeDocsExporter);

  const isCargoCb = document.getElementById('arrive-is-cargo');
  if (isCargoCb) isCargoCb.checked = (cargo.isCargo !== false && cargo.cargoType !== 'non_cargo');

  setVal('arrive-cargo-code', cargo.id || '');
  setVal('arrive-track', cargo.trackNumber || '');
  setVal('arrive-receive-date', cargo.receiveDate || '');
  setVal('arrive-title-ua', cargo.titleUa || '');
  setVal('arrive-title-cn', cargo.titleCn || '');
  setVal('arrive-title-en', cargo.titleEn || '');
  setVal('arrive-places', cargo.places || 0);
  setVal('arrive-weight', cargo.weight || 0);
  setVal('arrive-volume', cargo.volume || 0);
  setVal('arrive-package-type', cargo.packageType || '');
  setVal('arrive-extra-services', cargo.extraServices || '');
  setVal('arrive-photo-url', cargo.photoUrl || '');
  setVal('arrive-logist-note', cargo.logistNote || '');

  updateCustomDropdown('arrive-status', cargo.statusCode || 'new');
  updateCustomDropdown('arrive-manager', cargo.manager || 'О. Ковальчук');
  updateCustomDropdown('arrive-logist', cargo.logist || 'І. Сидоренко');

  document.getElementById('modal-arrive')?.classList.remove('hidden');
}

function openCreateArriveModal() {
  const titleElem = document.getElementById('m-arrive-title');
  if (titleElem) titleElem.innerText = 'Створити єрайв';

  const idElem = document.getElementById('arrive-cargo-id');
  if (idElem) idElem.value = '';

  const isCargoCb = document.getElementById('arrive-is-cargo');
  if (isCargoCb) isCargoCb.checked = true;

  document.getElementById('form-arrive')?.reset();

  // Скидання кастомних дропдаунів
  updateCustomDropdown('arrive-status', 'new');
  updateCustomDropdown('arrive-cargo-type', '');
  updateCustomDropdown('arrive-manager', '');
  updateCustomDropdown('arrive-logist', '');
  updateCustomDropdown('arrive-package-type', '');

  const lastMileBlock = document.getElementById('last-mile-fields-container');
  if (lastMileBlock) lastMileBlock.classList.add('hidden');

  document.getElementById('modal-arrive')?.classList.remove('hidden');
}

// Збереження (Створення / Оновлення) вантажу
function handleSaveArrive() {
  const cargoId = document.getElementById('arrive-cargo-id')?.value;
  const statusCode = document.getElementById('arrive-status')?.value || 'new';
  const statusCfg = STATUS_CONFIG[statusCode] || { title: 'Новий', class: 'bg-slate-100 text-slate-800' };
  const isCargoVal = Boolean(document.getElementById('arrive-is-cargo')?.checked);

  const receiveDateValue = document.getElementById('arrive-receive-date')?.value;
  if (!receiveDateValue) {
    showToast('Будь ласка, вкажіть дату отримання на складі!');
    return;
  }

  const formData = {
    statusCode: statusCode,
    status: statusCfg.title,
    statusClass: statusCfg.class,
    receiveDate: receiveDateValue,
    trackNumber: document.getElementById('arrive-track')?.value || '—',
    cargoCode: document.getElementById('arrive-cargo-code')?.value || '',
    isCargo: isCargoVal,
    cargoType: document.getElementById('arrive-cargo-type')?.value || 'cargo',
    dfShipment: document.getElementById('arrive-df-shipment')?.value || '',
    manager: document.getElementById('arrive-manager')?.value || '',
    logist: document.getElementById('arrive-logist')?.value || '',
    titleUa: document.getElementById('arrive-title-ua')?.value || 'Без назви',
    titleEn: document.getElementById('arrive-title-en')?.value || '',
    titleCn: document.getElementById('arrive-title-cn')?.value || '',
    places: parseInt(document.getElementById('arrive-places')?.value, 10) || 0,
    weight: parseFloat(document.getElementById('arrive-weight')?.value) || 0,
    volume: parseFloat(document.getElementById('arrive-volume')?.value) || 0,
    packageType: document.getElementById('arrive-package-type')?.value || '',
    oversizeComment: document.getElementById('arrive-oversize-comment')?.value || '',
    extraServices: document.getElementById('arrive-extra-services')?.value || '',
    photoUrl: document.getElementById('arrive-photo-url')?.value || '',
    logistNote: document.getElementById('arrive-logist-note')?.value || '',
    closeDocsExporter: Boolean(document.getElementById('arrive-close-docs-exporter')?.checked)
  };

  if (cargoId) {
    const cargo = cargoesData.find(c => c.id === cargoId);
    if (cargo) {
      Object.assign(cargo, formData);
      showToast(`Вантаж ${cargoId} успішно оновлено!`);
    }
  } else {
    const newCode = formData.cargoCode || `DF-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCargo = {
      id: newCode,
      ...formData,
      warehouse: 'New FOSHAN',
      client: 'Клієнт',
      createdStatus: 'Створено вручну'
    };

    cargoesData.unshift(newCargo);
    showToast(`Створено новий вантаж ${newCode}!`);
  }

  document.getElementById('modal-arrive')?.classList.add('hidden');
  if (typeof renderSubvoyageTabs === 'function') renderSubvoyageTabs();
  if (typeof renderTable === 'function') renderTable();
}

function copyCargoData(cargoId) {
  const cargo = cargoesData.find(c => c.id === cargoId);
  if (!cargo) return;

  const dataStr = `DF ерайв: ${cargo.id}\nТрек: ${cargo.trackNumber}\nТовар: ${cargo.titleUa}\nМісць: ${cargo.places} шт | Вага: ${cargo.weight} кг | Об'єм: ${cargo.volume} m³`;
  navigator.clipboard.writeText(dataStr).then(() => {
    showToast(`Дані вантажу ${cargoId} успішно скопійовано!`, 2000);
  });
}

function updateBulkActionsPanel() {
  const checkboxes = document.querySelectorAll('.row-checkbox:checked');
  selectedCargoIds = Array.from(checkboxes).map(cb => cb.getAttribute('data-cargo-id')).filter(Boolean);

  const panel = document.getElementById('bulk-actions-panel');
  const countElem = document.getElementById('bulk-selected-count');

  if (selectedCargoIds.length > 0) {
    if (countElem) countElem.innerText = selectedCargoIds.length;
    if (panel) panel.classList.remove('hidden');
  } else {
    if (panel) panel.classList.add('hidden');
  }
}

function clearSelections() {
  document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
  const selectAllCb = document.getElementById('select-all-rows');
  if (selectAllCb) selectAllCb.checked = false;
  updateBulkActionsPanel();
}

function openTransferModalSingle(cargoId) {
  selectedCargoIds = [cargoId];
  openTransferModal();
}

function openTransferModal() {
  if (selectedCargoIds.length === 0) return;
  const countElem = document.getElementById('transfer-items-count');
  if (countElem) countElem.innerText = selectedCargoIds.length;
  document.getElementById('modal-transfer-warehouse')?.classList.remove('hidden');
}

function deleteCargoSingle(cargoId) {
  if (confirm(`Ви дійсно бажаєте видалити вантаж ${cargoId}?`)) {
    cargoesData = cargoesData.filter(c => c.id !== cargoId);
    renderTable();
    updateBulkActionsPanel();
  }
}

function deleteSelectedCargoes() {
  if (selectedCargoIds.length === 0) return;
  if (confirm(`Ви дійсно бажаєте видалити обрані вантажі (${selectedCargoIds.length} шт.)?`)) {
    cargoesData = cargoesData.filter(c => !selectedCargoIds.includes(c.id));
    clearSelections();
    renderTable();
  }
}

function confirmTransferWarehouse() {
  const targetWarehouse = document.getElementById('transfer-target-warehouse')?.value;
  if (!targetWarehouse || selectedCargoIds.length === 0) return;

  cargoesData.forEach(c => {
    if (selectedCargoIds.includes(c.id)) {
      c.warehouse = targetWarehouse;
    }
  });

  showToast(`Успішно переміщено ${selectedCargoIds.length} вантаж(ів) на: ${targetWarehouse}`, 2000);
  document.getElementById('modal-transfer-warehouse')?.classList.add('hidden');
  clearSelections();
  renderTable();
}

function toggleCargoRowMenu(event, cargoId) {
  event.stopPropagation(); // Запобігаємо миттєвому закриттю від глобального click-обробника

  const currentMenu = document.getElementById(`cargo-menu-${cargoId}`);
  if (!currentMenu) return;

  const isHidden = currentMenu.classList.contains('hidden');

  // Закриваємо всі інші відкриті меню дій та знімаємо z-index
  document.querySelectorAll('.cargo-row-menu').forEach(m => {
    m.classList.add('hidden');
    const parentTd = m.closest('td');
    if (parentTd) {
      parentTd.classList.remove('z-40');
      parentTd.classList.add('z-10');
    }
  });

  // Якщо меню було закрите — відкриваємо його та піднімаємо z-index осередку
  if (isHidden) {
    currentMenu.classList.remove('hidden');
    const parentTd = currentMenu.closest('td');
    if (parentTd) {
      parentTd.classList.remove('z-10');
      parentTd.classList.add('z-40');
    }
  }
}

function buildCargoRowHtml(c) {
  const hasShipment = Boolean(c.dfShipment && c.dfShipment.trim() !== '');

  // 1. DF номер Обіцянки (Посилання)
  const dfPromiseDisplay = c.dfPromise
    ? `<a href="promises-management.html?id=${encodeURIComponent(c.dfPromise)}" onclick="event.stopPropagation();" class="text-brand-600 hover:text-brand-800 hover:underline font-mono font-bold transition">
         ${c.dfPromise}
       </a>`
    : `<span class="text-slate-400 italic font-sans">—</span>`;

  // 2. DF номер перевезення (Посилання)
  const shipmentDisplay = hasShipment
    ? `<a href="shipments-management.html?id=${encodeURIComponent(c.dfShipment)}" onclick="event.stopPropagation();" class="inline-flex items-center gap-1 text-brand-700 hover:text-brand-900 font-mono font-semibold text-xs bg-brand-50 hover:bg-brand-100 border border-brand-200 px-1.5 py-0.5 rounded transition">
         <i class="fa-solid fa-link text-[10px]"></i> ${c.dfShipment}
       </a>`
    : `<span class="text-slate-400 italic font-sans">—</span>`;

  // 3. Клієнт (Посилання)
  const clientDisplay = c.client
    ? `<a href="clients-management.html?name=${encodeURIComponent(c.client)}" onclick="event.stopPropagation();" class="text-brand-600 hover:text-brand-800 hover:underline font-semibold transition">
         ${c.client}
       </a>`
    : `<span class="text-slate-400 italic">—</span>`;

  // 4. Підрейс (Посилання)
  const subvoyageDisplay = (hasShipment && c.subvoyage)
    ? `<a href="sub-voyages-management.html?subvoyageId=${encodeURIComponent(c.subvoyage)}" onclick="event.stopPropagation();" class="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 hover:underline font-mono font-semibold transition">
         <i class="fa-solid fa-truck-fast text-[10px]"></i> ${c.subvoyage}
       </a>`
    : `<span class="text-slate-400 italic font-sans text-xs">—</span>`;

  const originDisplay = (hasShipment && c.origin) ? c.origin : `<span class="text-slate-400 italic font-sans">—</span>`;
  const destinationDisplay = (hasShipment && c.destination) ? c.destination : `<span class="text-slate-400 italic font-sans">—</span>`;

  const modeDisplay = (hasShipment && c.mode)
    ? `<span class="inline-flex items-center gap-1 text-xs text-slate-600">
        <i class="fa-solid ${getTransportIcon(c.mode)}"></i> ${c.mode}
       </span>`
    : `<span class="text-slate-400 italic font-sans">—</span>`;

  const arrivalDateDisplay = (hasShipment && c.arrivalDate) ? c.arrivalDate : `<span class="text-slate-400 italic font-sans">—</span>`;

  let tasksHtml = `<span class="text-slate-300 text-xs">—</span>`;
  if (c.tasks && c.tasks.length > 0) {
    const pendingTasksCount = c.tasks.filter(t => t.status !== 'Завершено').length;
    if (pendingTasksCount > 0) {
      tasksHtml = `
            <button onclick="openTasksModal('${c.id}')" class="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-2.5 py-0.5 rounded-full text-[11px] inline-flex items-center gap-1.5 shadow-sm transition animate-pulse" title="Увага! Є невиконані задачі">
                <i class="fa-solid fa-triangle-exclamation"></i> ${pendingTasksCount} з ${c.tasks.length} зач.
            </button>
        `;
    } else {
      tasksHtml = `
            <button onclick="openTasksModal('${c.id}')" class="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-[11px] inline-flex items-center gap-1 transition">
                <i class="fa-solid fa-circle-check text-emerald-600"></i> ${c.tasks.length} зач. (ОК)
            </button>
        `;
    }
  }

  const isCargo = c.isCargo !== false && c.cargoType !== 'non_cargo';
  const cargoTypeBadge = isCargo
    ? `<span class="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-semibold text-xs inline-flex items-center gap-1"><i class="fa-solid fa-box text-indigo-500"></i> Карго</span>`
    : `<span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-semibold text-xs inline-flex items-center gap-1"><i class="fa-solid fa-truck-ramp-box text-slate-400"></i> Не Карго</span>`;

  const exporterDocsBadge = c.closeDocsExporter
    ? `<span class="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs"><i class="fa-solid fa-check text-amber-600"></i> Так</span>`
    : `<span class="text-slate-400 text-xs">Ні</span>`;

  return `
    <tr class="hover:bg-slate-50 transition border-b border-slate-100 group">
        <!-- 1. Чекбокс -->
        <td class="p-3 text-center w-12 min-w-[48px] max-w-[48px] sticky left-0 z-20 bg-white group-hover:bg-slate-50">
            <input type="checkbox" data-cargo-id="${c.id}" class="row-checkbox rounded text-brand-600 focus:ring-brand-500 cursor-pointer">
        </td>
        <!-- 2. DF НОМЕР ОБІЦЯНКИ -->
        <td class="p-3 sticky left-12 z-20 bg-white group-hover:bg-slate-50 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
            ${dfPromiseDisplay}
        </td>
        <!-- 3. DF номер ерайва -->
        <td class="p-3 font-bold text-slate-700 font-mono">${c.id}</td>
        <!-- 4. Трек-номер -->
        <td class="p-3 font-mono text-xs text-slate-700">
            <span class="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                <i class="fa-solid fa-barcode text-[10px] text-slate-400 mr-1"></i>${c.trackNumber}
            </span>
        </td>
        <!-- 5. DF номер перевезення -->
        <td class="p-3 font-mono text-xs">${shipmentDisplay}</td>
        <!-- 6. Статус -->
        <td class="p-3">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.statusClass}">
                ${c.status}
            </span>
        </td>
        <!-- 7. Тип вантажу -->
        <td class="p-3">${cargoTypeBadge}</td>
        <!-- 8. Док. експортеру -->
        <td class="p-3">${exporterDocsBadge}</td>
        <!-- 7. Задачі -->
        <td class="p-3 text-center">${tasksHtml}</td>
        <!-- 8. Дата прибуття -->
        <td class="p-3 text-slate-700 font-mono text-xs font-semibold">${arrivalDateDisplay}</td>
        <!-- 9. Склад -->
        <td class="p-3 text-slate-700 font-medium">${c.warehouse}</td>
        <!-- 10. Клієнт -->
        <td class="p-3">${clientDisplay}</td>
        <!-- 11. Назва (укр) -->
        <td class="p-3 max-w-xs truncate" title="${c.titleUa}">${c.titleUa}</td>
        <!-- 12. Назва (кит) -->
        <td class="p-3 text-slate-500 max-w-xs truncate">${c.titleCn}</td>
        <!-- 13. Назва (англ) -->
        <td class="p-3 text-slate-500 max-w-xs truncate">${c.titleEn}</td>
        <!-- 14. Відправлення -->
        <td class="p-3 text-slate-700 font-medium">${originDisplay}</td>
        <!-- 15. Прибуття -->
        <td class="p-3 text-slate-700 font-medium">${destinationDisplay}</td>
        <!-- 16. Спосіб перевезення -->
        <td class="p-3">${modeDisplay}</td>
        <!-- 17. Підрейс -->
        <td class="p-3 font-mono font-medium">${subvoyageDisplay}</td>
        <!-- 18. Дата отримання -->
        <td class="p-3 text-slate-600 font-mono text-xs">${c.receiveDate}</td>
        <!-- 19. Створено / Завантажено -->
        <td class="p-3 text-slate-600 text-xs">${c.createdStatus}</td>
        <!-- 20. Кількість місць -->
        <td class="p-3 text-right font-bold text-brand-600 font-mono">${c.places} шт</td>
        <!-- 21. Вага брутто -->
        <td class="p-3 text-right font-bold text-slate-800 font-mono">${c.weight.toFixed(2)} т</td>
        <!-- 22. Об'єм -->
        <td class="p-3 text-right font-bold text-slate-800 font-mono">${c.volume} m³</td>
        <!-- 23. Негабарит -->
        <td class="p-3">
            ${c.isOversized
    ? `<span class="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-rose-300 inline-flex items-center gap-1" title="${c.oversizeComment}">
                   <i class="fa-solid fa-ruler-combined"></i> ${c.oversizeComment}
                 </span>`
    : `<span class="text-slate-400 text-xs">${c.oversizeComment || '—'}</span>`
  }
        </td>
        <!-- 24. Тип пакування -->
        <td class="p-3 text-slate-600 text-xs">${c.packageType || '—'}</td>
        <!-- 25. Додаткові послуги -->
        <td class="p-3 text-slate-600 text-xs">${c.extraServices || '—'}</td>
        <!-- 26. Відповідальний менеджер -->
        <td class="p-3 text-slate-700 text-xs">${c.manager || '—'}</td>
        <!-- 27. Відповідальний логіст -->
        <td class="p-3 text-slate-700 text-xs">${c.logist || '—'}</td>
        <!-- 28. Примітка логіста -->
        <td class="p-3 text-slate-500 italic max-w-xs truncate" title="${c.logistNote}">${c.logistNote || '—'}</td>
        <!-- 29. Посилання на фото -->
        <td class="p-3 text-center">
            ${c.photoUrl
    ? `<a href="${c.photoUrl}" target="_blank" onclick="event.stopPropagation();" class="text-brand-600 hover:text-brand-800 hover:underline font-medium inline-flex items-center gap-1">
                   <i class="fa-solid fa-image"></i> Фото
                 </a>`
    : `<span class="text-slate-400">Немає</span>`
  }
        </td>
        <!-- 30. ДІЇ (Закріплена колонка) -->
        <td class="p-3 text-center sticky right-0 z-10 bg-white group-hover:bg-slate-50">
            <div class="relative inline-block text-left">
                <button onclick="toggleCargoRowMenu(event, '${c.id}')" class="w-8 h-9 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200 transition" title="Дії з вантажем">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>

                <div id="cargo-menu-${c.id}" class="cargo-row-menu hidden absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-[100] py-1.5 text-xs text-left">
                    <button onclick="openPhotoModal('${c.id}')" class="w-full text-left px-3 py-2 text-indigo-950 hover:bg-indigo-50 font-medium flex items-center justify-between transition">
                        <span class="flex items-center gap-2.5">
                            <i class="fa-solid fa-camera text-slate-600"></i> Фотофіксація
                        </span>
                        ${c.photoStages && c.photoStages.length > 0 ? `<span class="w-2 h-2 bg-emerald-500 rounded-full" title="Є фотофіксація"></span>` : ''}
                    </button>

                    <button onclick="openTraceabilityModal('${c.id}')" class="w-full text-left px-3 py-2 text-indigo-950 hover:bg-indigo-50 font-medium flex items-center justify-between border-t border-slate-100 transition">
                        <span class="flex items-center gap-2.5">
                            <i class="fa-solid fa-route text-slate-600"></i> Історія маршруту
                        </span>
                        ${c.timeline && c.timeline.length > 0 ? `<span class="w-2 h-2 bg-brand-500 rounded-full" title="Є маршрут"></span>` : ''}
                    </button>

                    <button onclick="editCargo('${c.id}')" class="w-full text-left px-3 py-2 text-indigo-950 hover:bg-indigo-50 font-medium flex items-center gap-2.5 border-t border-slate-100 transition">
                        <i class="fa-regular fa-pen-to-square text-indigo-600"></i> Редагувати
                    </button>

                    <button onclick="copyCargoData('${c.id}')" class="w-full text-left px-3 py-2 text-indigo-950 hover:bg-indigo-50 font-medium flex items-center gap-2.5 border-t border-slate-100 transition">
                        <i class="fa-regular fa-copy text-slate-600"></i> Скопіювати дані
                    </button>

                    <button onclick="openTransferModalSingle('${c.id}')" class="w-full text-left px-3 py-2 text-indigo-950 hover:bg-indigo-50 font-medium flex items-center gap-2.5 border-t border-slate-100 transition">
                        <i class="fa-solid fa-angles-right text-indigo-600"></i> Перемістити на інший склад
                    </button>

                    <button onclick="deleteCargoSingle('${c.id}')" class="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2.5 border-t border-slate-100 transition">
                        <i class="fa-regular fa-trash-can text-rose-600"></i> Видалити
                    </button>
                </div>
            </div>
        </td>
    </tr>
  `;
}

function renderPaginationControls(totalPages) {
  const container = document.getElementById('pagination-controls');
  if (!container) return;
  container.innerHTML = '';

  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.className = `px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${currentPage === 1 ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'}`;
  prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left mr-1"></i>Назад';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  };
  container.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `px-3 py-1 rounded-lg border text-xs font-bold transition ${i === currentPage ? 'bg-brand-600 text-white border-brand-600 shadow-xs' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'}`;
      pageBtn.innerText = i;
      pageBtn.onclick = () => {
        currentPage = i;
        renderTable();
      };
      container.appendChild(pageBtn);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      const dots = document.createElement('span');
      dots.className = 'px-1 text-slate-400 font-bold';
      dots.innerText = '...';
      container.appendChild(dots);
    }
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = `px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'}`;
  nextBtn.innerHTML = 'Вперед<i class="fa-solid fa-chevron-right ml-1"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  };
  container.appendChild(nextBtn);
}

function renderTable() {
  const tbody = document.getElementById('cargo-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  updateStatusGroupTabs();

  let filtered = (cargoesData || []).filter(cargo => {
    if (typeof cargoFilterManager !== 'undefined' && cargoFilterManager && cargoFilterManager.matches) {
      if (!cargoFilterManager.matches(cargo)) return false;
    }

    if (!isCargoInSubvoyageScope(cargo)) return false;

    const grp = getCargoStatusGroup(cargo);
    return grp === activeStatusGroup;
  });

  let totalWeight = 0;
  let totalVolume = 0;
  let totalPlaces = 0;

  filtered.forEach(c => {
    totalWeight += c.weight;
    totalVolume += c.volume;
    totalPlaces += c.places;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  if (filtered.length === 0) {
    tbody.innerHTML = `
        <tr>
            <td colspan="32" class="p-0 border-0">
                <div class="sticky left-0 w-[calc(100vw-3rem)] sm:w-[calc(100vw-4rem)] max-w-[1650px] flex items-center justify-center py-12 px-4">
                    <div class="max-w-md w-full bg-white rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center space-y-3 text-center">
                        <div class="w-14 h-14 rounded-2xl bg-slate-100/80 border border-slate-200/60 flex items-center justify-center text-slate-400 shadow-2xs">
                            <i class="fa-solid fa-box-open text-2xl"></i>
                        </div>
                        <div class="space-y-1">
                            <h4 class="text-sm font-bold text-slate-800">Вантажі відсутні</h4>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    `;
  } else {
    if (!isGroupedByShipment) {
      paginatedItems.forEach(c => {
        tbody.insertAdjacentHTML('beforeend', buildCargoRowHtml(c));
      });
    } else {
      const groups = {};
      paginatedItems.forEach(c => {
        const shipKey = (c.dfShipment && c.dfShipment.trim() !== '') ? c.dfShipment : 'Без номера перевезення';
        if (!groups[shipKey]) groups[shipKey] = [];
        groups[shipKey].push(c);
      });

      Object.keys(groups).forEach(shipKey => {
        const groupCargoes = groups[shipKey];
        const gWeight = groupCargoes.reduce((s, x) => s + x.weight, 0);
        const gVolume = groupCargoes.reduce((s, x) => s + x.volume, 0);
        const gPlaces = groupCargoes.reduce((s, x) => s + x.places, 0);
        const isAnyCloseDocs = groupCargoes.some(x => x.closeDocsExporter === true);

        const isNoShipmentGroup = shipKey === 'Без номера перевезення';
        const shipmentBadgeHtml = isNoShipmentGroup
          ? `<span class="text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-sans italic">Вантажі без номера перевезення</span>`
          : `<strong class="font-mono text-brand-700 bg-white px-2 py-0.5 rounded border border-slate-300">${shipKey}</strong>`;

        const exporterShipmentBadge = isAnyCloseDocs
          ? `<span class="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs"><i class="fa-solid fa-file-signature text-amber-600"></i> Закрити док. експортером</span>`
          : '';

        const assignedSv = groupCargoes[0]?.subvoyage;
        let subvoyageBadgeHtml = '';
        if (!isNoShipmentGroup) {
          subvoyageBadgeHtml = assignedSv
            ? `<span class="bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded font-mono text-[11px] font-bold inline-flex items-center gap-1"><i class="fa-solid fa-truck-loading"></i> ${assignedSv}</span>`
            : `<span class="text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-bold">Не прив'язано до підрейсу</span>`;
        }

        const headerHtml = `
            <tr class="${isNoShipmentGroup ? 'bg-slate-100' : 'bg-slate-200/90'} text-slate-900 font-bold border-y-2 border-slate-300">
                <td colspan="32" class="p-2.5 sticky left-0 z-10 ${isNoShipmentGroup ? 'bg-slate-100' : 'bg-slate-200'}">
                    <div class="flex flex-wrap items-center justify-start gap-4 px-2 text-xs">
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-truck-ramp-box ${isNoShipmentGroup ? 'text-slate-400' : 'text-brand-600'} text-sm"></i>
                            <span>Перевезення: ${shipmentBadgeHtml}</span>
                            ${subvoyageBadgeHtml}
                            ${exporterShipmentBadge}
                        </div>

                        <div class="font-mono text-xs text-slate-700 font-medium flex items-center gap-3 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                            <span>Сума ваги: <strong>${gWeight.toFixed(2)} т</strong></span>
                            <span>•</span>
                            <span>Об'єм: <strong>${gVolume.toFixed(1)} m³</strong></span>
                            <span>•</span>
                            <span>Місць: <strong>${gPlaces} шт</strong></span>
                            <span class="text-slate-400 font-normal">(${groupCargoes.length} вантажів)</span>
                        </div>
                    </div>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', headerHtml);

        groupCargoes.forEach(c => {
          tbody.insertAdjacentHTML('beforeend', buildCargoRowHtml(c));
        });
      });
    }
  }

  function updateLastMileColumnsVisibility() {
    applyCargoColumnVisibility();
  }

  const pagInfoElem = document.getElementById('pagination-info');
  if (pagInfoElem) {
    const endItem = Math.min(startIndex + itemsPerPage, totalItems);
    pagInfoElem.innerText = `Показано ${totalItems > 0 ? startIndex + 1 : 0}-${endItem} з ${totalItems}`;
  }

  const sumWeight = document.getElementById('page-sum-weight');
  if (sumWeight) sumWeight.innerText = `${totalWeight.toFixed(2)} т`;

  const sumVol = document.getElementById('page-sum-volume');
  if (sumVol) sumVol.innerText = `${totalVolume.toFixed(1)} m³`;

  const sumPlaces = document.getElementById('page-sum-places');
  if (sumPlaces) sumPlaces.innerText = `${totalPlaces} шт`;

  renderPaginationControls(totalPages);
  updateLastMileColumnsVisibility();

  document.querySelectorAll('.row-checkbox').forEach(cb => {
    cb.addEventListener('change', updateBulkActionsPanel);
  });

  if (typeof applyCargoColumnVisibility === 'function') applyCargoColumnVisibility();
}

function populateArriveModalDropdowns(selectedShipment = '', selectedPromise = '') {
  const shipmentSelect = document.getElementById('arrive-df-shipment');
  if (shipmentSelect) {
    const existingShipments = Array.from(new Set((cargoesData || []).map(c => c.dfShipment).filter(Boolean)));
    if (!existingShipments.includes('DF73-229')) existingShipments.push('DF73-229');

    shipmentSelect.innerHTML = `<option value="">Не обрано (Без перевезення)</option>` +
      existingShipments.map(s => `<option value="${s}" ${s === selectedShipment ? 'selected' : ''}>${s}</option>`).join('');
  }

  const promiseSelect = document.getElementById('arrive-df-promise');
  if (promiseSelect) {
    const existingPromises = Array.from(new Set((cargoesData || []).map(c => c.dfPromise).filter(Boolean)));
    promiseSelect.innerHTML = `<option value="">Не обрано</option>` +
      existingPromises.map(p => `<option value="${p}" ${p === selectedPromise ? 'selected' : ''}>${p}</option>`).join('');
  }
}

function applyCargoColumnVisibility() {
  const table = document.querySelector('#cargo-table-body')?.closest('table');
  if (!table) return;
  const toggles = document.querySelectorAll('.cargo-column-toggle');
  toggles.forEach(toggle => {
    const colIndex = toggle.getAttribute('data-col');
    const isChecked = toggle.checked;
    const cells = table.querySelectorAll(`tr > *:nth-child(${colIndex})`);
    cells.forEach(cell => {
      if (isChecked) {
        cell.classList.remove('hidden');
      } else {
        cell.classList.add('hidden');
      }
    });
  });
}

function getStatusGroupTitle(grp) {
  switch (grp) {
    case 'on_warehouse':
      return 'На складі';
    case 'unmarked':
      return 'Отримано непромаркованим';
    case 'awaiting_arrival':
      return 'Очікування прибуття';
    case 'last_mile':
      return 'Остання миля';
    case 'archive':
      return 'Архів';
    default:
      return 'На складі';
  }
}

function getTransportIcon(mode) {
  switch (mode) {
    case 'Авіа':
      return 'fa-plane text-sky-500';
    case 'Море':
      return 'fa-ship text-blue-600';
    case 'Залізниця':
      return 'fa-train text-amber-600';
    case 'Авто':
      return 'fa-truck text-emerald-600';
    default:
      return 'fa-box';
  }
}

function setupMultiSelectDropdown({
                                    btnId,
                                    menuId,
                                    btnTextId,
                                    selectAllId,
                                    clearAllId,
                                    checkboxClass,
                                    labelPrefix,
                                    totalCount
                                  }) {
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);
  const btnText = document.getElementById(btnTextId);
  const selectAllBtn = document.getElementById(selectAllId);
  const clearAllBtn = document.getElementById(clearAllId);
  const checkboxes = document.querySelectorAll(`.${checkboxClass}`);

  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.filter-menu').forEach(m => {
      if (m.id !== menuId) m.classList.add('hidden');
    });
    menu.classList.toggle('hidden');
  });

  menu.addEventListener('click', (e) => e.stopPropagation());

  function updateBtnText() {
    const checked = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
    if (checked.length === totalCount) {
      btnText.innerText = `${labelPrefix}: Усі (${totalCount})`;
    } else if (checked.length === 0) {
      btnText.innerText = `${labelPrefix}: Обрано (0)`;
    } else if (checked.length <= 2) {
      btnText.innerText = `${labelPrefix}: ${checked.join(', ')}`;
    } else {
      btnText.innerText = `${labelPrefix}: Обрано (${checked.length})`;
    }
    renderTable();
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateBtnText));

  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', () => {
      checkboxes.forEach(cb => cb.checked = true);
      updateBtnText();
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      checkboxes.forEach(cb => cb.checked = false);
      updateBtnText();
    });
  }
}

function openTraceabilityModal(cargoId) {
  const cargo = cargoesData.find(c => c.id === cargoId);
  if (!cargo) return;

  document.getElementById('m-trace-cargo-id').innerText = cargo.id;
  document.getElementById('m-trace-desc').innerText = `${cargo.titleUa}`;

  const badgeElem = document.getElementById('m-trace-status-badge');
  badgeElem.innerText = cargo.status;
  badgeElem.className = `font-bold px-2 py-0.5 rounded text-xs border ${cargo.statusClass}`;

  const timelineContainer = document.getElementById('traceability-timeline');
  if (timelineContainer) {
    timelineContainer.innerHTML = '';

    if (cargo.timeline && cargo.timeline.length > 0) {
      cargo.timeline.forEach((step) => {
        const stepHtml = `
            <div class="relative pl-6">
                <div class="absolute -left-[17px] top-0 w-8 h-8 bg-white border-2 border-brand-500 rounded-full flex items-center justify-center text-brand-600 text-xs shadow-sm">
                    <i class="fa-solid ${step.icon || 'fa-warehouse'}"></i>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 hover:bg-slate-100/80 transition">
                    <div class="flex items-center justify-between mb-1">
                        <h5 class="text-xs font-bold text-slate-900">${step.title}</h5>
                        <span class="text-[10px] font-mono text-slate-400"><i class="fa-regular fa-clock mr-1"></i>${step.time}</span>
                    </div>
                    <p class="text-xs text-slate-600">${step.desc}</p>
                </div>
            </div>
        `;
        timelineContainer.insertAdjacentHTML('beforeend', stepHtml);
      });
    } else {
      timelineContainer.innerHTML = `
        <div class="p-6 text-center text-slate-400">
            <i class="fa-solid fa-route text-2xl mb-1 block"></i>
            Записи про міжскладські переміщення відсутні
        </div>
    `;
    }
  }

  document.getElementById('modal-traceability').classList.remove('hidden');
}

function resetAllFilters() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  document.querySelectorAll('.filter-origin-cb').forEach(cb => cb.checked = true);
  document.querySelectorAll('.filter-dest-cb').forEach(cb => cb.checked = true);
  document.querySelectorAll('.filter-mode-cb').forEach(cb => cb.checked = true);

  const originText = document.getElementById('origin-btn-text');
  if (originText) originText.innerText = 'Відправлення: Усі (3)';

  const destText = document.getElementById('dest-btn-text');
  if (destText) destText.innerText = 'Прибуття: Усі (3)';

  const modeText = document.getElementById('mode-btn-text');
  if (modeText) modeText.innerText = 'Транспорт: Усі (4)';

  if (typeof subvoyagesData !== 'undefined') {
    const allLogists = Array.from(new Set(subvoyagesData.map(s => s.logist))).filter(Boolean);
    subvoyageLogistFilter = [...allLogists];
  }
  document.querySelectorAll('.subvoyage-logist-cb').forEach(cb => cb.checked = true);
  const logistBtnText = document.getElementById('subvoyage-logist-btn-text');
  if (logistBtnText) logistBtnText.innerText = 'Усі логісти';

  activeSubvoyageId = 'ALL';
  activeStatusGroup = 'on_warehouse';
  isGroupedByShipment = false;
  currentPage = 1;

  if (typeof cargoFilterManager !== 'undefined' && cargoFilterManager) {
    cargoFilterManager.resetModalFilters();
  }

  const groupingText = document.getElementById('grouping-btn-text');
  if (groupingText) groupingText.innerText = 'Групувати за перевезенням: Вимк';

  const groupingBtn = document.getElementById('btn-toggle-grouping');
  if (groupingBtn) groupingBtn.classList.remove('bg-brand-600', 'text-white');

  if (typeof renderSubvoyageTabs === 'function') renderSubvoyageTabs();
  if (typeof renderTable === 'function') renderTable();
}

document.addEventListener('DOMContentLoaded', async () => {
  const loadComponent = async (id, file) => {
    try {
      const response = await fetch(file);
      const html = await response.text();
      const container = document.getElementById(id);
      if (container) container.innerHTML = html;
    } catch (err) {
      console.error('Error loading ', file, err);
    }
  };

  function copyRecipientText(event, text) {
    if (event) event.stopPropagation();
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      showToast('Дані отримувача скопійовано!');
    });
  }

  document.getElementById('btn-copy-modal-recipient')?.addEventListener('click', () => {
    const recipientVal = document.getElementById('arrive-recipient')?.value;
    if (!recipientVal) {
      showToast('Поле отримувача порожнє!');
      return;
    }
    copyRecipientText(null, recipientVal);
  });

  const selects = document.querySelectorAll('.custom-select-wrapper');

  selects.forEach(wrapper => {
    const btn = wrapper.querySelector('.custom-select-btn');
    const menu = wrapper.querySelector('.custom-select-menu');
    const arrow = wrapper.querySelector('.custom-select-arrow');
    const hiddenInput = wrapper.querySelector('input[type="hidden"]');
    const selectedContent = wrapper.querySelector('.selected-content');

    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();

      document.querySelectorAll('.custom-select-menu').forEach(m => {
        if (m !== menu) {
          m.classList.replace('opacity-100', 'opacity-0');
          m.classList.replace('visible', 'invisible');
          m.classList.replace('translate-y-0', 'translate-y-2');
        }
      });
      document.querySelectorAll('.custom-select-arrow').forEach(a => {
        if (a !== arrow) a.classList.remove('rotate-180');
      });

      menu.classList.toggle('opacity-0');
      menu.classList.toggle('opacity-100');
      menu.classList.toggle('invisible');
      menu.classList.toggle('visible');
      menu.classList.toggle('translate-y-2');
      menu.classList.toggle('translate-y-0');
      if (arrow) arrow.classList.toggle('rotate-180');
    });

    menu.querySelectorAll('.custom-option').forEach(option => {
      option.addEventListener('click', () => {
        hiddenInput.value = option.dataset.value;

        selectedContent.innerHTML = option.querySelector('.option-content').innerHTML;

        menu.querySelectorAll('.custom-option').forEach(opt => {
          opt.classList.remove('bg-indigo-50', 'text-indigo-700');
        });
        option.classList.add('bg-indigo-50', 'text-indigo-700');

        if (hiddenInput.id === 'arrive-status') {
          toggleLastMileFields(option.dataset.value);
        }

        menu.classList.replace('opacity-100', 'opacity-0');
        menu.classList.replace('visible', 'invisible');
        menu.classList.replace('translate-y-0', 'translate-y-2');
        if (arrow) arrow.classList.remove('rotate-180');
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
      document.querySelectorAll('.custom-select-menu').forEach(m => {
        m.classList.add('opacity-0', 'invisible', 'translate-y-2');
        m.classList.remove('opacity-100', 'visible', 'translate-y-0');
      });
      document.querySelectorAll('.custom-select-arrow').forEach(a => {
        a.classList.remove('rotate-180');
      });
    }
  });

  const loadVoyagesData = async () => {
    try {
      const response = await fetch('../data/voyages.json');
      if (!response.ok) throw new Error('Не вдалося завантажити voyages.json');
      const data = await response.json();

      subvoyagesData = data.subvoyagesData || [];
      cargoesData = data.cargoesData || [];
    } catch (err) {
      console.error('Error loading voyages data:', err);
    }
  };

  await Promise.all([
    loadComponent('dashboard-container', 'dashboard.html'),
    loadComponent('sub-voyages-container', 'sub-voyages.html'),
    loadComponent('filters-container', 'filters.html'),
    loadComponent('cargo-registry-container', 'cargo-registry.html'),
    loadVoyagesData()
  ]);

  if (window.DashboardModule) {
    DashboardModule.renderWarehouseInfo();
    DashboardModule.updateStats(cargoesData, subvoyagesData);
  }

  populateSubvoyageLogistFilter();
  renderSubvoyageTabs();

  const btnCargoSettings = document.getElementById('btn-cargo-settings');
  const modalCargoSettings = document.getElementById('modal-cargo-settings');
  if (btnCargoSettings && modalCargoSettings) {
    btnCargoSettings.addEventListener('click', () => {
      modalCargoSettings.classList.remove('hidden');
    });
  }
  document.querySelectorAll('.cargo-column-toggle').forEach(toggle => {
    toggle.addEventListener('change', applyCargoColumnVisibility);
  });
  const resetCargoColumnsBtn = document.getElementById('reset-cargo-columns-btn');
  if (resetCargoColumnsBtn) {
    resetCargoColumnsBtn.addEventListener('click', () => {
      document.querySelectorAll('.cargo-column-toggle').forEach(toggle => {
        const col = toggle.getAttribute('data-col');
        // Колонки 7 ("Тип вантажу") та 8 ("Док. експортеру") за дефолтом вимкнені, решта — увімкнені
        toggle.checked = !(col === '7' || col === '8');
      });
      applyCargoColumnVisibility();
    });
  }

  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.close-modal, .close-modal-field, .close-modal-tpl, .close-modal-edit-tpl, .close-transfer-modal');
    if (closeBtn) {
      const modal = closeBtn.closest('.fixed');
      if (modal) modal.classList.add('hidden');
      return;
    }

    if (e.target.classList.contains('fixed') && e.target.id && e.target.id.startsWith('modal-')) {
      e.target.classList.add('hidden');
    }
  });

  document.getElementById('btn-save-subvoyage-assign')?.addEventListener('click', () => {
    const selectedRadio = document.querySelector('input[name="select-subvoyage-radio"]:checked');

    if (!selectedRadio) {
      showToast('Будь ласка, оберіть підрейс зі списку!');
      return;
    }

    const targetSubvoyageId = selectedRadio.value;
    if (!currentAssignShipmentKey) return;

    cargoesData.forEach(cargo => {
      if (cargo.dfShipment === currentAssignShipmentKey) {
        cargo.subvoyage = targetSubvoyageId;
      }
    });

    showToast(`Перевезення ${currentAssignShipmentKey} успішно прив'язано до підрейсу ${targetSubvoyageId}!`);

    document.getElementById('modal-assign-subvoyage')?.classList.add('hidden');
    renderSubvoyageTabs();
    renderTable();
  });

  document.getElementById('m-filter-same-mode')?.addEventListener('change', renderAssignSubvoyagesList);
  document.getElementById('m-filter-sufficient-cap')?.addEventListener('change', renderAssignSubvoyagesList);
  document.getElementById('m-filter-logist-select')?.addEventListener('change', renderAssignSubvoyagesList);

  document.getElementById('items-per-page')?.addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value, 10);
    currentPage = 1;
    renderTable();
  });

  document.querySelectorAll('.status-group-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeStatusGroup = tab.getAttribute('data-status-group');
      currentPage = 1;
      renderTable();
    });
  });

  document.getElementById('btn-apply-cargo-columns')?.addEventListener('click', () => {
    applyCargoColumnVisibility();
    document.getElementById('modal-cargo-settings')?.classList.add('hidden');
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.cargo-row-menu').forEach(m => {
      m.classList.add('hidden');
      const parentTd = m.closest('td');
      if (parentTd) {
        parentTd.classList.remove('z-40');
        parentTd.classList.add('z-10');
      }
    });
    document.querySelectorAll('.filter-menu').forEach(m => m.classList.add('hidden'));
  });

  document.getElementById('btn-bulk-cancel')?.addEventListener('click', clearSelections);
  document.getElementById('btn-bulk-delete')?.addEventListener('click', deleteSelectedCargoes);
  document.getElementById('btn-bulk-transfer')?.addEventListener('click', openTransferModal);

  document.getElementById('btn-confirm-transfer')?.addEventListener('click', confirmTransferWarehouse);

  const selectAllRowsElem = document.getElementById('select-all-rows');
  if (selectAllRowsElem) {
    selectAllRowsElem.addEventListener('change', (e) => {
      document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = e.target.checked);
      updateBulkActionsPanel();
    });
  }

  setupMultiSelectDropdown({
    btnId: 'origin-dropdown-btn',
    menuId: 'origin-dropdown-menu',
    btnTextId: 'origin-btn-text',
    selectAllId: 'origin-select-all',
    clearAllId: 'origin-clear-all',
    checkboxClass: 'filter-origin-cb',
    labelPrefix: 'Відправлення',
    totalCount: 3
  });

  setupMultiSelectDropdown({
    btnId: 'dest-dropdown-btn',
    menuId: 'dest-dropdown-menu',
    btnTextId: 'dest-btn-text',
    selectAllId: 'dest-select-all',
    clearAllId: 'dest-clear-all',
    checkboxClass: 'filter-dest-cb',
    labelPrefix: 'Прибуття',
    totalCount: 3
  });

  setupMultiSelectDropdown({
    btnId: 'mode-dropdown-btn',
    menuId: 'mode-dropdown-menu',
    btnTextId: 'mode-btn-text',
    selectAllId: 'mode-select-all',
    clearAllId: 'mode-clear-all',
    checkboxClass: 'filter-mode-cb',
    labelPrefix: 'Транспорт',
    totalCount: 4
  });

  setInterval(() => {
    const now = new Date();
    const clockElem = document.getElementById('live-clock');
    if (clockElem) clockElem.innerText = now.toLocaleTimeString('uk-UA');
  }, 1000);

  const searchInputElem = document.getElementById('search-input');
  if (searchInputElem) searchInputElem.addEventListener('input', () => {
    currentPage = 1;
    renderTable();
  });

  const resetBtnElem = document.getElementById('btn-reset-filters');
  if (resetBtnElem) resetBtnElem.addEventListener('click', resetAllFilters);

  const toggleGroupingBtn = document.getElementById('btn-toggle-grouping');
  if (toggleGroupingBtn) {
    toggleGroupingBtn.addEventListener('click', () => {
      isGroupedByShipment = !isGroupedByShipment;
      const btnText = document.getElementById('grouping-btn-text');
      const btn = document.getElementById('btn-toggle-grouping');

      if (isGroupedByShipment) {
        if (btnText) btnText.innerText = 'Групувати за перевезенням: Увімк';
        btn.classList.add('bg-brand-600', 'text-white');
        btn.classList.remove('bg-slate-100', 'text-slate-700');
      } else {
        if (btnText) btnText.innerText = 'Групувати за перевезенням: Вимк';
        btn.classList.remove('bg-brand-600', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-700');
      }
      renderTable();
    });
  }

  cargoFilterManager = new CargoFilterManager({
    onFilterChange: () => {
      currentPage = 1;
      renderTable();
    },
    openModal: (modalId) => document.getElementById(modalId)?.classList.remove('hidden'),
    closeModal: (modalId) => document.getElementById(modalId)?.classList.add('hidden')
  });

  cargoFilterManager.init();

  const addArriveBtn = document.getElementById('btn-add-arrive');
  if (addArriveBtn) {
    addArriveBtn.addEventListener('click', () => {
      openCreateArriveModal();
    });
  }

  document.getElementById('btn-save-arrive')?.addEventListener('click', handleSaveArrive);

  renderTable();
});
