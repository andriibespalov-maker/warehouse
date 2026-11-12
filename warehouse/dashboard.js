/**
 * dashboard.js - Модуль управління дашбордом та інформацією про склад
 */

// Структура даних складу
const warehouseInfoData = {
  // 1. Назва Складу
  name: "New FOSHAN",
  code: "WH-FOSHAN-01",

  // 2. Повна Адреса
  address: {
    country: "Китай",
    province: "Гуандун",
    city: "Фошань",
    district: "Наньхай",
    street: "No. 88 Logistics Avenue, Gate 3",
    zipCode: "528200",
    fullAddress: "Китай, провінція Гуандун, м. Фошань, р-н Наньхай, No. 88 Logistics Avenue, Gate 3"
  },

  // 3. Підрядник
  contractor: {
    id: "CTR-4029",
    name: "Difreight Logistics Ltd.",
    type: "3PL Оператор",
    profileUrl: "contractors.html?id=CTR-4029"
  },

  // 4. Послуги (новий контур: 5 сверхпослуг та обрані детальні послуги)
  services: [
    "Зберігання",
    "Пакування та обробка",
    "Маркування та Фулфілмент",
    "Крос-докінг та ПРР"
  ],
  selectedSubServices: [
    "Відповідальне зберігання (CBM / доба)",
    "Палетне зберігання (європалета / доба)",
    "Підлогове / коміркове зберігання дрібних вантажів",
    "Палетування вантажу (формування палети)",
    "Обмотка стретч-плівкою (прозора / чорна)",
    "Перепакування в нові картонні коробки",
    "Маркування кожної коробки (DF-код клієнта)",
    "Друк та поклейка транспортних етикеток / штрих-кодів",
    "Крос-докінг (пряме перевантаження фура-фура)",
    "Механізоване вивантаження / завантаження (карою за палету)"
  ],

  // 5. Умови роботи / Правила прийому вантажу
  rules: "1. Вантаж приймається суворо за наявності маркування та супровідного інвойсу/ТТН.\n2. Приймання важковагових місць (> 2000 кг) вимагає попереднього узгодження за 24 години.\n3. Обов'язкова вхідна фотофіксація стану упаковки та перевірка на наявність пошкоджень.",

  // 6. Графік роботи складу
  schedule: [
    { day: "Понеділок", hours: "08:30 - 18:30", isDayOff: false },
    { day: "Вівторок", hours: "08:30 - 18:30", isDayOff: false },
    { day: "Середа", hours: "08:30 - 18:30", isDayOff: false },
    { day: "Четвер", hours: "08:30 - 18:30", isDayOff: false },
    { day: "П'ятниця", hours: "08:30 - 18:30", isDayOff: false },
    { day: "Субота", hours: "09:00 - 15:00", isDayOff: false },
    { day: "Неділя", hours: "Вихідний", isDayOff: true }
  ],

  // 7. Контактні особи (Блок 2.1: вибір головного менеджера)
  contacts: [
    {
      fullName: "L. Wei",
      role: "Senior Warehouse Operator",
      email: "wei.fsh@difreight.com",
      comment: "Відповідає за приймання негабаритних вантажів, вхідну фотофіксацію та перевірку пакування LCL.",
      isPrimary: true,
      phone: "+86 757 8820 1102",
      socials: {
        wechat: "wxid_wei_foshan88",
        whatsapp: "+8675788201102",
        telegram: "@wei_foshan_logix"
      }
    },
    {
      fullName: "Chen Xiu",
      role: "Receiving & Inspection Supervisor",
      email: "chen.x@difreight.com",
      comment: "",
      isPrimary: false,
      phone: "+86 757 8820 1105",
      socials: {
        wechat: "chen_xiu_wh",
        whatsapp: "+8675788201105",
        telegram: "@chen_xiu_wh"
      }
    }
  ],

  // 8. Прайс-листи та Тарифи підрядника (Блок 2.2 та Блок 3.1: термін дії менше 1 місяця -> попередження)
  tariffDocuments: [
    {
      id: "doc-foshan-1",
      name: "Tariff_Foshan_GlobalCargo_2026.pdf",
      size: "420 KB",
      uploadedAt: "15.01.2026",
      validUntil: "2026-11-25",
      isActive: true,
      comment: "Офіційний прайс-лист від підрядника Global Cargo Logistics на 2026 рік"
    },
    {
      id: "doc-foshan-prev",
      name: "Tariff_Foshan_GlobalCargo_2025_Archive.pdf",
      size: "385 KB",
      uploadedAt: "10.01.2025",
      validUntil: "2025-12-31",
      isActive: false,
      comment: "Попередній прайс-лист на 2025 рік (архівний)"
    }
  ],
  tariffText: "Приймання вантажу: $15/палета\nЗберігання: $1.50/CBM/доба\nПалетування: $12/палета\nМаркування DF-кодом: $0.20/коробка",
  tariffTextValidUntil: "2026-11-25",

  // 9. Інструкція для клієнта
  clientInstruction: `ІНСТРУКЦІЯ З ВІДПРАВКИ ВАНТАЖУ НА СКЛАД NEW FOSHAN HUB:

1. АДРЕСА ДОСТАВКИ ДЛЯ ПОСТАЧАЛЬНИКА (КИТАЙСЬКОЮ):
广东省佛山市南海区物流大道88号3号门 New FOSHAN Hub
收货人 (Отримувач): L. Wei / LOGIX-ERP
电话 (Тел): +86 757 8820 1102

2. ОБОВ'ЯЗКОВЕ МАРКУВАННЯ НА КОЖНІЙ КОРОБЦІ/ПАЛЕТІ:
На кожному місці повинно бути чітко написано або наклеєно маркування:
[ КОД КЛІЄНТА / НОМЕР ОБІЦЯНКИ ] (Наприклад: DF540-101TR)

3. УМОВИ ПРИЙОМУ:
- Години прийому: Пн-Сб з 08:30 до 18:30 (UTC+8)
- Водій повинен надати видаткову накладну (Delivery Note) із зазначенням трек-номера доставки.`,

  // 10. Особливі Примітки
  specialNotes: "Склад обладнаний рампою для великогабаритного транспорту та вилковими навантажувачами до 5000 кг. У разі доставки небезпечних вантажів (напр. Lithium Batteries) обов'язково надавати MSDS та сертифікат UN38.3 до заїзду авто."
};

/**
 * Оновлення статистики Дашборду (включаючи Кейс 2.1: Оперативний рух — сумарна кількість підрейсів та загальний об'єм у м³)
 */
function updateDashboardStats(cargoes = [], subvoyages = []) {
  // Беремо дані з перевезень та підрейсів планувальника (window.svManagementShipments / window.svManagementSubvoyages), якщо вони вже завантажені
  const svShipments = Array.isArray(window.svManagementShipments) && window.svManagementShipments.length > 0
    ? window.svManagementShipments
    : null;
  const svSubvoyages = Array.isArray(window.svManagementSubvoyages) && window.svManagementSubvoyages.length > 0
    ? window.svManagementSubvoyages
    : (Array.isArray(subvoyages) ? subvoyages : []);

  let allocatedVolume = 0;
  let readyVolume = 0;
  let notReadyVolume = 0;
  let plannedPromisesVolume = 0;
  let unmarkedVolume = 0;

  if (svShipments) {
    // 1. Завантажені на рейси (розподілені по контейнерах/підрейсах на оформленні або завантаженні)
    allocatedVolume = svShipments
      .filter(s => s.subvoyageId && s.status !== 'В дорозі' && s.status !== 'Прибув на склад отримання')
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);

    // Для нерозподілених позицій ділимо за категорією готовності (readinessCategory)
    const unassigned = svShipments.filter(s => !s.subvoyageId);
    readyVolume = unassigned
      .filter(s => (s.readinessCategory || 'ready') === 'ready')
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);
    notReadyVolume = unassigned
      .filter(s => s.readinessCategory === 'not_ready')
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);
    plannedPromisesVolume = unassigned
      .filter(s => s.readinessCategory === 'planned')
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);
    unmarkedVolume = unassigned
      .filter(s => s.readinessCategory === 'unmarked')
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);
  } else {
    allocatedVolume = cargoes
      .filter(c => (c.subvoyage || c.dfShipment) && c.statusCode !== 'issued' && c.statusCode !== 'returned_to_customer')
      .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

    readyVolume = cargoes
      .filter(c => !c.subvoyage && (c.statusCode === 'ready_for_loading' || c.statusCode === 'storaging_in_warehouse'))
      .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

    notReadyVolume = cargoes
      .filter(c => !c.subvoyage && (c.statusCode === 'waiting_for_other_parts' || c.statusCode === 'damaged_delayed'))
      .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

    plannedPromisesVolume = cargoes
      .filter(c => !c.subvoyage && (c.statusCode === 'promise' || c.statusCode === 'in_transit'))
      .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

    unmarkedVolume = cargoes
      .filter(c => !c.subvoyage && c.statusCode === 'received_unmarked')
      .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);
  }

  const inWorkVolume = readyVolume + notReadyVolume + unmarkedVolume;

  // 1. Загальний фактичний обʼєм на складі (м³), кількість вантажів та підрейсів
  const rawCargoesVolume = cargoes.reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);
  const totalVolume = rawCargoesVolume > 0
    ? rawCargoesVolume
    : (allocatedVolume + readyVolume + notReadyVolume + unmarkedVolume);

  const totalCargoes = cargoes.length > 0
    ? cargoes.length
    : (svShipments
        ? svShipments.filter(s => s.readinessCategory !== 'planned' && s.status !== 'В дорозі').reduce((sum, s) => sum + (Array.isArray(s.cargoes) && s.cargoes.length > 0 ? s.cargoes.length : 1), 0)
        : 0);

  const activeSubvoyages = svSubvoyages.length > 0 ? svSubvoyages.length : subvoyages.length;

  // Опорна дата
  const now = new Date();
  const realTodayStr = now.toISOString().split('T')[0];
  const hasRealTodayEvents = cargoes.some(c =>
    (c.receiveDate && c.receiveDate.startsWith(realTodayStr)) ||
    (c.shippedDate && c.shippedDate.startsWith(realTodayStr)) ||
    (c.arrivalDate && c.arrivalDate.startsWith(realTodayStr))
  );
  const todayStr = hasRealTodayEvents ? realTodayStr : '2026-09-24';

  const baseDate = new Date(todayStr + 'T00:00:00');
  const sevenDaysLater = new Date(baseDate);
  sevenDaysLater.setDate(baseDate.getDate() + 7);
  const sevenDaysStr = sevenDaysLater.toISOString().split('T')[0];

  // 4. Отримано сьогодні (об'єм м³ та кількість підрейсів)
  const receivedTodayCargoes = cargoes.filter(c =>
    (c.receiveDate && c.receiveDate.startsWith(todayStr)) ||
    (c.arrivalDate && c.arrivalDate.startsWith(todayStr))
  );
  let receivedTodayVolume = receivedTodayCargoes.reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);
  const receivedTodaySvSet = new Set(receivedTodayCargoes.map(c => c.subvoyage).filter(Boolean));
  let receivedTodaySvCount = receivedTodaySvSet.size || (receivedTodayCargoes.length > 0 ? 1 : 0);

  if (receivedTodayVolume === 0 && svShipments) {
    const arrivedSvIds = new Set(svSubvoyages.filter(s => s.status === 'Прибув на склад отримання').map(s => s.id));
    const arrivedShipments = svShipments.filter(s => (s.subvoyageId && arrivedSvIds.has(s.subvoyageId)) || s.acceptedToday);
    receivedTodayVolume = arrivedShipments.reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);
    receivedTodaySvCount = arrivedSvIds.size || (arrivedShipments.length > 0 ? 1 : 0);
  }

  // 5. Відправлено сьогодні (об'єм м³ та кількість підрейсів)
  const shippedTodayCargoes = cargoes.filter(c =>
    c.shippedDate
      ? c.shippedDate.startsWith(todayStr)
      : ((c.statusCode === 'in_transit' || c.statusCode === 'issued') && (c.shipmentDate === todayStr || c.arrivalDate === todayStr))
  );
  let shippedTodayVolume = shippedTodayCargoes.reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);
  const shippedTodaySvSet = new Set(shippedTodayCargoes.map(c => c.subvoyage).filter(Boolean));
  let shippedTodaySvCount = shippedTodaySvSet.size || (shippedTodayCargoes.length > 0 ? 1 : 0);

  if (shippedTodayVolume === 0 && svShipments) {
    const loadedSvIds = new Set(svSubvoyages.filter(s => s.status === 'Завантажений').map(s => s.id));
    const loadedShipments = svShipments.filter(s => s.subvoyageId && loadedSvIds.has(s.subvoyageId));
    shippedTodayVolume = loadedShipments.reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);
    shippedTodaySvCount = loadedSvIds.size;
  }

  // 6. Очікуємо (7 днів) — об'єм м³ та кількість підрейсів в дорозі
  const expectedArrivalCargoes = cargoes.filter(c => {
    const arrDate = c.expectedArrivalDate || c.arrivalDate;
    return (arrDate && arrDate >= todayStr && arrDate <= sevenDaysStr && c.statusCode === 'in_transit') || c.statusCode === 'in_transit';
  });
  let expectedArrival3DaysVolume = expectedArrivalCargoes.reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);
  const expectedArrivalSvSet = new Set([
    ...expectedArrivalCargoes.map(c => c.subvoyage).filter(Boolean),
    ...svSubvoyages.filter(s => s.status === 'В дорозі').map(s => s.id)
  ]);
  let expectedArrival3DaysSvCount = expectedArrivalSvSet.size;

  if (expectedArrival3DaysVolume === 0 && svShipments) {
    const inTransitSvIds = new Set(svSubvoyages.filter(s => s.status === 'В дорозі').map(s => s.id));
    const inTransitVol = svShipments
      .filter(s => s.subvoyageId && inTransitSvIds.has(s.subvoyageId))
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);
    expectedArrival3DaysVolume = inTransitVol + plannedPromisesVolume;
  }

  // 7. Відправка (7 днів) — об'єм м³ та кількість підрейсів на формуванні/завантаженні
  const expectedShipmentCargoes = cargoes.filter(c => {
    const shipDate = c.expectedShipmentDate || c.plannedShipmentDate;
    if (shipDate && shipDate >= todayStr && shipDate <= sevenDaysStr && c.statusCode !== 'in_transit') return true;
    return Boolean(c.subvoyage && (c.statusCode === 'ready_for_loading' || c.statusCode === 'waiting_for_other_parts' || c.statusCode === 'storaging_in_warehouse'));
  });
  let expectedShipment3DaysVolume = expectedShipmentCargoes.reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);
  const expectedShipmentSvSet = new Set([
    ...expectedShipmentCargoes.map(c => c.subvoyage).filter(Boolean),
    ...svSubvoyages.filter(s => s.status === 'Формування' || s.status === 'Завантажений').map(s => s.id)
  ]);
  const expectedShipment3DaysSvCount = expectedShipmentSvSet.size;

  if (expectedShipment3DaysVolume === 0) {
    expectedShipment3DaysVolume = allocatedVolume;
  }

  // Сумарні показники блоку «Оперативний рух» (Кейс 2.1): сумарна кількість підрейсів та загальний об'єм у кубометрах (м³)
  const opTotalSubvoyagesSet = new Set([
    ...svSubvoyages.map(s => s.id),
    ...receivedTodaySvSet,
    ...shippedTodaySvSet,
    ...expectedArrivalSvSet,
    ...expectedShipmentSvSet
  ]);
  const opTotalSubvoyagesCount = opTotalSubvoyagesSet.size || activeSubvoyages;
  const opTotalMovementVolume = receivedTodayVolume + shippedTodayVolume + expectedArrival3DaysVolume + expectedShipment3DaysVolume;

  const pluralizeSubvoyages = (n) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return `${n} підрейс`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} підрейси`;
    return `${n} підрейсів`;
  };

  // Оновлення DOM елементів
  const totalCargoesElem = document.getElementById('stat-total-cargoes');
  const activeSubvoyagesElem = document.getElementById('stat-active-subvoyages');
  const totalVolumeElem = document.getElementById('stat-total-volume');
  const allocatedVolumeElem = document.getElementById('stat-allocated-volume');
  const readyVolumeElem = document.getElementById('stat-ready-volume');
  const notReadyVolumeElem = document.getElementById('stat-not-ready-volume');
  const plannedPromisesVolumeElem = document.getElementById('stat-planned-promises-volume');
  const unmarkedVolumeElem = document.getElementById('stat-unmarked-volume');
  const inWorkVolumeElem = document.getElementById('stat-in-work-volume');
  const receivedTodayElem = document.getElementById('stat-received-today');
  const shippedTodayElem = document.getElementById('stat-shipped-today');
  const expectedArrival3DaysElem = document.getElementById('stat-expected-arrival-3days');
  const expectedShipment3DaysElem = document.getElementById('stat-expected-shipment-3days');

  const opTotalSubvoyagesElem = document.getElementById('stat-op-total-subvoyages');
  const opTotalVolumeElem = document.getElementById('stat-op-total-volume');
  const receivedTodaySvElem = document.getElementById('stat-received-today-sv');
  const shippedTodaySvElem = document.getElementById('stat-shipped-today-sv');
  const expectedArrival3DaysSvElem = document.getElementById('stat-expected-arrival-3days-sv');
  const expectedShipment3DaysSvElem = document.getElementById('stat-expected-shipment-3days-sv');

  if (totalCargoesElem) totalCargoesElem.innerText = totalCargoes;
  if (activeSubvoyagesElem) activeSubvoyagesElem.innerText = activeSubvoyages;

  if (opTotalSubvoyagesElem) opTotalSubvoyagesElem.innerText = opTotalSubvoyagesCount;
  if (opTotalVolumeElem) opTotalVolumeElem.innerText = `${opTotalMovementVolume.toFixed(1)} м³`;

  if (totalVolumeElem) {
    totalVolumeElem.innerHTML = `${totalVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">/ 400.0 м³</span>`;
  }
  if (allocatedVolumeElem) {
    allocatedVolumeElem.innerHTML = `${allocatedVolume.toFixed(1)} <span class="text-[11px] font-normal text-slate-500">м³</span>`;
  }
  if (readyVolumeElem) {
    readyVolumeElem.innerHTML = `${readyVolume.toFixed(1)} <span class="text-[11px] font-normal text-slate-500">м³</span>`;
  }
  if (notReadyVolumeElem) {
    notReadyVolumeElem.innerHTML = `${notReadyVolume.toFixed(1)} <span class="text-[11px] font-normal text-slate-500">м³</span>`;
  }
  if (plannedPromisesVolumeElem) {
    plannedPromisesVolumeElem.innerHTML = `${plannedPromisesVolume.toFixed(1)} <span class="text-[11px] font-normal text-slate-500">м³</span>`;
  }
  if (unmarkedVolumeElem) {
    unmarkedVolumeElem.innerHTML = `${unmarkedVolume.toFixed(1)} <span class="text-[11px] font-normal text-slate-500">м³</span>`;
  }
  if (inWorkVolumeElem) {
    inWorkVolumeElem.innerHTML = `${inWorkVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">м³</span>`;
  }
  if (receivedTodayElem) {
    receivedTodayElem.innerHTML = `${receivedTodayVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">м³</span>`;
  }
  if (shippedTodayElem) {
    shippedTodayElem.innerHTML = `${shippedTodayVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">м³</span>`;
  }
  if (expectedArrival3DaysElem) {
    expectedArrival3DaysElem.innerHTML = `${expectedArrival3DaysVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">м³</span>`;
  }
  if (expectedShipment3DaysElem) {
    expectedShipment3DaysElem.innerHTML = `${expectedShipment3DaysVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">м³</span>`;
  }

  if (receivedTodaySvElem) receivedTodaySvElem.innerText = pluralizeSubvoyages(receivedTodaySvCount);
  if (shippedTodaySvElem) shippedTodaySvElem.innerText = pluralizeSubvoyages(shippedTodaySvCount);
  if (expectedArrival3DaysSvElem) expectedArrival3DaysSvElem.innerText = pluralizeSubvoyages(expectedArrival3DaysSvCount);
  if (expectedShipment3DaysSvElem) expectedShipment3DaysSvElem.innerText = pluralizeSubvoyages(expectedShipment3DaysSvCount);

  // Також оновлюємо блок вхідних рейсів в дорозі (Блок 3.2)
  renderIncomingVoyages();
}

// --- 5 Сверхпослуг (макро-категорій) та детальних послуг нового контуру ---
const SERVICE_MACRO_CATEGORIES = {
  'Зберігання': {
    icon: 'fa-boxes-stacked',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
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
  'Комплектація': 'Маркування та Фулфілмент',
  'Палетування': 'Пакування та обробка',
  'Перезважування та вимірювання': 'Інспекція та Сортування'
};

/**
 * Рендеринг доступних послуг складу у стилі нового контуру
 */
function renderWarehouseServices(data = warehouseInfoData) {
  const container = document.getElementById('wh-display-services');
  if (!container) return;

  const rawServices = Array.isArray(data.services) ? data.services : [];
  const normalizedServices = Array.from(new Set(rawServices.map(s => LEGACY_SERVICE_MAP[s] || s)));
  const selectedSubs = Array.isArray(data.selectedSubServices) ? new Set(data.selectedSubServices) : null;

  if (normalizedServices.length === 0) {
    container.innerHTML = '<span class="text-slate-400 text-xs italic">Послуги не вказано</span>';
    return;
  }

  // 1. Бейджі сверхпослуг нового контуру з бейджами, лічильниками та інтерактивними тултіпами
  const badgesHtml = normalizedServices.map(catName => {
    const meta = SERVICE_MACRO_CATEGORIES[catName] || {
      icon: 'fa-check',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      subServices: []
    };

    const allSubs = meta.subServices || [];
    const activeCount = selectedSubs
      ? allSubs.filter(sub => selectedSubs.has(sub)).length
      : allSubs.length;

    const subListHtml = allSubs.map(sub => {
      const isActive = !selectedSubs || selectedSubs.has(sub);
      if (isActive) {
        return `
          <li class="flex items-start gap-1.5 text-[11px] text-slate-200 leading-snug">
            <i class="fa-solid fa-check text-[9px] text-emerald-400 mt-1 shrink-0"></i>
            <span>${sub}</span>
          </li>
        `;
      } else {
        return `
          <li class="flex items-start gap-1.5 text-[11px] text-slate-400 leading-snug opacity-75">
            <i class="fa-solid fa-xmark text-[9px] text-rose-400 mt-1 shrink-0"></i>
            <span class="line-through">${sub}</span>
          </li>
        `;
      }
    }).join('');

    const countBadge = selectedSubs ? `${activeCount}/${allSubs.length}` : `${allSubs.length}`;

    return `
      <div class="relative group/macro inline-flex">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-help ${meta.badgeClass} transition shadow-2xs hover:shadow-xs">
          <i class="fa-solid ${meta.icon} text-[11px] opacity-80"></i>
          <span>${catName}</span>
          <span class="text-[10px] font-bold opacity-85 px-1 py-0.2 rounded-full bg-white/70 border border-black/5">(${countBadge})</span>
        </span>

        <!-- Тултіп нового контуру з переліком послуг: активні (✓) та неактивні (✕) -->
        <div class="hidden group-hover/macro:block absolute left-0 bottom-full mb-2 w-72 p-3 bg-slate-900 text-white rounded-xl shadow-2xl z-50 pointer-events-none border border-slate-700">
          <div class="font-bold text-xs text-white border-b border-slate-700 pb-1.5 mb-2 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <i class="fa-solid ${meta.icon} text-brand-400 text-xs"></i>
              <span>${catName}</span>
            </span>
            <span class="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
              ${activeCount} з ${allSubs.length} активні
            </span>
          </div>
          <ul class="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
            ${subListHtml}
          </ul>
        </div>
      </div>
    `;
  }).join('');

  // 2. Детальний розгорнутий список послуг (групування за сверхпослугами з зеленими галочками та червоними хрестиками)
  const detailedGroupHtml = normalizedServices.map(catName => {
    const meta = SERVICE_MACRO_CATEGORIES[catName] || {
      icon: 'fa-check',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      subServices: []
    };

    const allSubs = meta.subServices || [];
    const activeSubs = selectedSubs ? allSubs.filter(sub => selectedSubs.has(sub)) : allSubs;
    const inactiveSubs = selectedSubs ? allSubs.filter(sub => !selectedSubs.has(sub)) : [];

    const activePills = activeSubs.map(sub => `
      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs">
        <i class="fa-solid fa-check text-emerald-600 text-[8px] shrink-0"></i>
        <span>${sub}</span>
      </span>
    `).join('');

    const inactivePills = inactiveSubs.map(sub => `
      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium bg-rose-50/40 text-slate-400 border border-rose-200/50 opacity-60 line-through">
        <i class="fa-solid fa-xmark text-rose-400 text-[8px] shrink-0"></i>
        <span>${sub}</span>
      </span>
    `).join('');

    return `
      <div class="bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 space-y-1.5">
        <div class="flex items-center justify-between border-b border-slate-200/60 pb-1">
          <div class="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <span class="w-5 h-5 rounded ${meta.badgeClass} flex items-center justify-center text-[10px] shrink-0">
              <i class="fa-solid ${meta.icon}"></i>
            </span>
            <span>${catName}</span>
          </div>
          <span class="text-[9px] font-bold text-slate-500 bg-white px-1.5 py-0.2 rounded-full border border-slate-200">
            ${activeSubs.length} з ${allSubs.length} обрано
          </span>
        </div>
        <div class="flex flex-wrap gap-1">
          ${activePills}
          ${inactivePills}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="space-y-2.5 w-full">
      <!-- Компактний вигляд (сверхпослуги з тултіпами нового контуру) -->
      <div class="flex flex-wrap gap-1.5" id="wh-services-badges-view">
        ${badgesHtml}
      </div>

      <!-- Детальний вигляд (прихований за замовчуванням) -->
      <div class="hidden space-y-2 pt-1 border-t border-slate-100" id="wh-services-detailed-view">
        <div class="text-[10px] text-slate-400 flex items-center gap-2 mb-0.5">
          <span><span class="text-emerald-600 font-bold">✓</span> увімкнена послуга</span>
          <span>•</span>
          <span><span class="text-rose-500 font-bold">✕</span> послуга не надається складом</span>
        </div>
        ${detailedGroupHtml}
      </div>
    </div>
  `;

  // Навішуємо перемикання кнопки "Всі послуги" / "Згорнути"
  const toggleBtn = document.getElementById('btn-toggle-services-view');
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      const detailedView = document.getElementById('wh-services-detailed-view');
      const label = document.getElementById('btn-services-view-label');
      if (!detailedView) return;

      const isHidden = detailedView.classList.contains('hidden');
      if (isHidden) {
        detailedView.classList.remove('hidden');
        if (label) label.textContent = 'Згорнути послуги';
      } else {
        detailedView.classList.add('hidden');
        if (label) label.textContent = 'Всі послуги';
      }
    };
  }
}

/**
 * Оцінка валідності терміну дії прайс-листа підрядника (Блок 2.2)
 */
function evaluateDashboardValidity(dateStr) {
  if (!dateStr) {
    return {
      status: 'missing',
      text: 'Термін дії не вказано',
      classNames: 'bg-slate-100 text-slate-500 border-slate-200',
      icon: 'fa-regular fa-calendar'
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = dateStr.split('-');
  if (parts.length < 3) {
    return {
      status: 'missing',
      text: dateStr,
      classNames: 'bg-slate-100 text-slate-500 border-slate-200',
      icon: 'fa-regular fa-calendar'
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
      diffDays,
      formattedDate,
      text: `Термін закінчився (${formattedDate})`,
      classNames: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
      icon: 'fa-solid fa-circle-xmark text-rose-600'
    };
  } else if (diffDays <= 14) {
    const dayWord = diffDays === 0 ? 'сьогодні' : `${diffDays} дн.`;
    return {
      status: 'expiring',
      diffDays,
      formattedDate,
      text: `Спливає через ${dayWord} (${formattedDate})`,
      classNames: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      icon: 'fa-solid fa-triangle-exclamation text-amber-600'
    };
  } else {
    return {
      status: 'valid',
      diffDays,
      formattedDate,
      text: `Дійсний до ${formattedDate}`,
      classNames: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
      icon: 'fa-solid fa-circle-check text-emerald-600'
    };
  }
}

/**
 * Рендеринг детальної інформації про склад у дашборд
 */
function renderWarehouseInfo(data = warehouseInfoData) {
  // 1. Назва
  const nameElem = document.getElementById('wh-display-name');
  if (nameElem) nameElem.innerText = data.name;

  // 2. Повна Адреса
  const addressElem = document.getElementById('wh-display-address');
  if (addressElem) addressElem.innerText = data.address.fullAddress;

  // 3. Підрядник
  const contractorElem = document.getElementById('wh-display-contractor');
  if (contractorElem) {
    contractorElem.innerHTML = `
      <a href="${data.contractor.profileUrl}" class="inline-flex items-center gap-1.5 font-bold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg border border-brand-200 transition text-xs">
        <i class="fa-solid fa-building text-brand-500"></i>
        <span>${data.contractor.name}</span>
        <i class="fa-solid fa-arrow-up-right-from-square text-[10px] ml-0.5"></i>
      </a>
    `;
  }

  // 4. Послуги (новий контур)
  renderWarehouseServices(data);

  // 5. Умови роботи / Правила прийому
  const rulesElem = document.getElementById('wh-display-rules');
  if (rulesElem) rulesElem.innerText = data.rules;

  // 6. Графік роботи (модалка + спойлер на головному екрані Блок 3.1)
  const scheduleArray = Array.isArray(data.schedule)
    ? data.schedule
    : [
        { day: "Понеділок", hours: data.schedule?.Mon || "09:00 - 18:00", isDayOff: (data.schedule?.Mon || '').toLowerCase().includes('вихідний') },
        { day: "Вівторок", hours: data.schedule?.Tue || "09:00 - 18:00", isDayOff: (data.schedule?.Tue || '').toLowerCase().includes('вихідний') },
        { day: "Середа", hours: data.schedule?.Wed || "09:00 - 18:00", isDayOff: (data.schedule?.Wed || '').toLowerCase().includes('вихідний') },
        { day: "Четвер", hours: data.schedule?.Thu || "09:00 - 18:00", isDayOff: (data.schedule?.Thu || '').toLowerCase().includes('вихідний') },
        { day: "П'ятниця", hours: data.schedule?.Fri || "09:00 - 18:00", isDayOff: (data.schedule?.Fri || '').toLowerCase().includes('вихідний') },
        { day: "Субота", hours: data.schedule?.Sat || "10:00 - 15:00", isDayOff: (data.schedule?.Sat || '').toLowerCase().includes('вихідний') },
        { day: "Неділя", hours: data.schedule?.Sun || "Вихідний", isDayOff: (data.schedule?.Sun || 'Вихідний').toLowerCase().includes('вихідний') }
      ];

  const scheduleElem = document.getElementById('wh-display-schedule');
  if (scheduleElem) {
    scheduleElem.innerHTML = scheduleArray.map(s => `
      <div class="flex justify-between items-center py-1 border-b border-slate-100 last:border-0 text-xs">
        <span class="font-medium text-slate-600">${s.day}</span>
        <span class="font-mono font-bold ${s.isDayOff ? 'text-rose-600' : 'text-slate-800'}">${s.hours}</span>
      </div>
    `).join('');
  }

  const spoilerScheduleElem = document.getElementById('wh-spoiler-schedule');
  if (spoilerScheduleElem) {
    spoilerScheduleElem.innerHTML = scheduleArray.map(s => `
      <div class="flex justify-between items-center py-0.5 border-b border-slate-200/50 last:border-0 text-[11px]">
        <span class="text-slate-600 font-medium">${s.day}</span>
        <span class="font-mono font-bold ${s.isDayOff ? 'text-rose-600' : 'text-slate-900'}">${s.hours}</span>
      </div>
    `).join('');
  }

  // 7. Контактні особи
  const contactsElem = document.getElementById('wh-display-contacts');
  if (contactsElem) {
    contactsElem.innerHTML = data.contacts.map((c, idx) => {
      // Підтримка як масиву телефонів із соцмережами phones, так і одиничного phone + socials
      let phonesHtml = '';
      if (Array.isArray(c.phones) && c.phones.length > 0) {
        phonesHtml = c.phones.map(p => {
          const socialsHtml = Array.isArray(p.socials) ? p.socials.map(s => {
            const isWeChat = (s.type || '').toLowerCase() === 'wechat';
            const isTelegram = (s.type || '').toLowerCase() === 'telegram';
            const icon = isWeChat ? 'fa-brands fa-weixin' : (isTelegram ? 'fa-brands fa-telegram' : 'fa-solid fa-comment-dots');
            const colorClass = isWeChat ? 'text-emerald-600' : (isTelegram ? 'text-sky-600' : 'text-slate-600');
            return `<span class="${colorClass} font-semibold text-[10px]" title="${s.type}"><i class="${icon} mr-0.5"></i> ${s.value}</span>`;
          }).join('') : '';

          return `
            <div class="py-1 border-t border-slate-200/60 first:border-0 first:pt-0">
              <div class="flex items-center gap-1.5">
                <i class="fa-solid fa-phone text-slate-400 mr-0.5"></i>
                <a href="tel:${p.number}" class="hover:underline text-slate-800 font-semibold">${p.number || '-'}</a>
              </div>
              ${socialsHtml ? `<div class="flex flex-wrap gap-2 text-xs pt-1 pl-4">${socialsHtml}</div>` : ''}
            </div>
          `;
        }).join('');
      } else {
        const wechatVal = c.socials?.wechat || '';
        const telegramVal = c.socials?.telegram || '';
        phonesHtml = `
          <div class="space-y-1">
            <div><i class="fa-solid fa-phone text-slate-400 mr-1.5"></i><a href="tel:${c.phone}" class="hover:underline">${c.phone}</a></div>
            ${(wechatVal || telegramVal) ? `
              <div class="flex gap-2 text-xs pt-1 border-t border-slate-200">
                ${wechatVal ? `<span class="text-emerald-600 font-semibold text-[10px]" title="WeChat"><i class="fa-brands fa-weixin mr-0.5"></i> ${wechatVal}</span>` : ''}
                ${telegramVal ? `<span class="text-sky-600 font-semibold text-[10px]" title="Telegram"><i class="fa-brands fa-telegram mr-0.5"></i> ${telegramVal}</span>` : ''}
              </div>
            ` : ''}
          </div>
        `;
      }

      const isPrimary = c.isPrimary || (idx === 0 && !data.contacts.some(item => item.isPrimary));

      return `
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900 text-xs">${c.fullName}</span>
              ${isPrimary ? `<span class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-300 font-bold inline-flex items-center gap-1 shadow-2xs"><i class="fa-solid fa-star text-amber-500 text-[9px]"></i> Головний менеджер</span>` : ''}
            </div>
            <span class="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200 font-medium">${c.role || c.position || 'Контактна особа'}</span>
          </div>
          <div class="text-[11px] text-slate-600 space-y-1 font-mono">
            ${c.email ? `<div><i class="fa-regular fa-envelope text-slate-400 mr-1.5"></i><a href="mailto:${c.email}" class="hover:underline">${c.email}</a></div>` : ''}
            ${phonesHtml}
          </div>
          ${(c.comment && c.comment.trim()) ? `
            <div class="pt-2 border-t border-slate-200/70 mt-1">
              <div class="bg-amber-50/70 border border-amber-200/70 rounded-lg px-2.5 py-1.5 flex items-start gap-2">
                <i class="fa-regular fa-comment-dots text-amber-600 text-[11px] mt-0.5 shrink-0" title="Коментар"></i>
                <div class="text-[11px] text-slate-700 leading-snug">
                  <span class="font-semibold text-slate-500 text-[9px] block uppercase tracking-wider mb-0.5">Коментар / Зона відповідальності:</span>
                  <span class="italic text-slate-800">${c.comment.trim()}</span>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  // Блок 3.1: Виведення основної контактної особи (з галочкою «Головний») у спойлер на головному екрані з кнопками швидкого копіювання
  const primaryContact = Array.isArray(data.contacts) && data.contacts.length > 0
    ? (data.contacts.find(c => c.isPrimary) || data.contacts[0])
    : null;
  const spoilerPrimaryContactElem = document.getElementById('wh-spoiler-primary-contact');
  if (spoilerPrimaryContactElem) {
    if (primaryContact) {
      let phone = '';
      let socialsList = [];
      if (Array.isArray(primaryContact.phones) && primaryContact.phones.length > 0) {
        phone = primaryContact.phones[0].number || '';
        if (Array.isArray(primaryContact.phones[0].socials)) {
          socialsList = primaryContact.phones[0].socials.map(s => `${s.type}: ${s.value}`);
        }
      } else if (primaryContact.phone) {
        phone = primaryContact.phone;
        if (primaryContact.socials?.wechat) socialsList.push(`WeChat: ${primaryContact.socials.wechat}`);
        if (primaryContact.socials?.telegram) socialsList.push(`Telegram: ${primaryContact.socials.telegram}`);
      }
      spoilerPrimaryContactElem.innerHTML = `
        <div class="bg-white border border-amber-200/80 rounded-lg p-2.5 space-y-1.5 shadow-2xs">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-slate-900 text-xs">${primaryContact.fullName}</span>
              <span class="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 font-bold inline-flex items-center gap-1">
                <i class="fa-solid fa-check text-amber-600 text-[8px]"></i> Головний
              </span>
            </div>
            <span class="text-[10px] text-slate-500 font-medium">${primaryContact.position || primaryContact.role || 'Менеджер складу'}</span>
          </div>
          <div class="space-y-1 font-mono text-[11px] text-slate-700 pt-1 border-t border-slate-100">
            ${phone ? `
              <div class="flex items-center justify-between gap-2">
                <span><i class="fa-solid fa-phone text-amber-600 mr-1.5 text-[10px]"></i>${phone}</span>
                <button type="button" onclick="DashboardModule.copyTextWithToast('${phone.replace(/'/g, "\\'")}', 'Телефон скопійовано!')"
                  class="text-[10px] text-slate-500 hover:text-amber-700 px-1.5 py-0.2 bg-slate-100 hover:bg-amber-50 rounded border border-slate-200 cursor-pointer" title="Скопіювати телефон">
                  <i class="fa-regular fa-copy"></i>
                </button>
              </div>
            ` : ''}
            ${primaryContact.email ? `
              <div class="flex items-center justify-between gap-2">
                <span class="truncate"><i class="fa-regular fa-envelope text-slate-400 mr-1.5 text-[10px]"></i>${primaryContact.email}</span>
                <button type="button" onclick="DashboardModule.copyTextWithToast('${primaryContact.email.replace(/'/g, "\\'")}', 'Email скопійовано!')"
                  class="text-[10px] text-slate-500 hover:text-amber-700 px-1.5 py-0.2 bg-slate-100 hover:bg-amber-50 rounded border border-slate-200 cursor-pointer" title="Скопіювати Email">
                  <i class="fa-regular fa-copy"></i>
                </button>
              </div>
            ` : ''}
            ${socialsList.length > 0 ? `<div class="text-[10px] text-emerald-700 font-semibold pt-0.5">${socialsList.join(' • ')}</div>` : ''}
          </div>
        </div>
      `;
    } else {
      spoilerPrimaryContactElem.innerHTML = `<div class="text-slate-400 italic text-xs">Основну контактну особу не обрано в налаштуваннях</div>`;
    }
  }

  // 8. Прайс-листи та Тарифи підрядника (Блок 2.2: Документи з терміном дії + Текстовий тариф)
  const tariffDocsContainer = document.getElementById('wh-display-tariff-documents');
  const pricingDocsCountElem = document.getElementById('wh-pricing-docs-count');
  const pricingTextCountElem = document.getElementById('wh-pricing-text-count');
  const tariffTextElem = document.getElementById('wh-display-tariff-text');
  const textValidityBadgeElem = document.getElementById('wh-display-text-validity-badge');

  const tariffDocs = Array.isArray(data.tariffDocuments) ? data.tariffDocuments : [];
  const hasText = !!(data.tariffText && data.tariffText.trim());

  if (pricingDocsCountElem) pricingDocsCountElem.innerText = tariffDocs.length;
  if (pricingTextCountElem) pricingTextCountElem.innerText = hasText ? '1' : '0';

  if (tariffDocsContainer) {
    const currentTariffType = data.tariffType || (tariffDocs.some(d => d.isActive) ? 'document' : (hasText ? 'text' : 'document'));
    const isDocActive = currentTariffType === 'document' && tariffDocs.length > 0;

    if (tariffDocs.length > 0) {
      const activeDocs = tariffDocs.filter(d => d.isActive !== false);
      const currentActive = isDocActive ? (activeDocs.length > 0 ? activeDocs[0] : tariffDocs[0]) : null;
      const remainingDocs = isDocActive ? tariffDocs.filter(d => d !== currentActive) : tariffDocs;

      let activeHtml = '';
      if (currentActive) {
        const isExcel = (currentActive.name || '').toLowerCase().endsWith('.xlsx') || (currentActive.name || '').toLowerCase().endsWith('.xls');
        const iconClass = isExcel ? 'fa-solid fa-file-excel text-emerald-600 bg-emerald-50 border-emerald-200' : 'fa-solid fa-file-pdf text-rose-600 bg-rose-50 border-rose-200';
        const validity = evaluateDashboardValidity(currentActive.validUntil);

        activeHtml = `
          <div class="bg-white border-2 border-emerald-400 rounded-xl p-4 shadow-2xs space-y-3">
            <div class="flex items-center justify-between pb-2.5 border-b border-slate-100 flex-wrap gap-2">
              <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1.5 shadow-2xs">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Активний діючий прайс-лист
              </span>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[11px] text-slate-500"><i class="fa-regular fa-calendar-check mr-1 text-slate-400"></i> Завантажено: ${currentActive.uploadedAt || '—'}</span>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border ${validity.classNames}">
                  <i class="${validity.icon}"></i> ${validity.text}
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-11 h-11 rounded-xl border flex items-center justify-center text-xl shrink-0 ${iconClass}">
                  <i class="${iconClass.split(' ').slice(0, 2).join(' ')}"></i>
                </div>
                <div class="min-w-0">
                  <h4 class="font-bold text-slate-900 text-xs truncate" title="${currentActive.name}">${currentActive.name}</h4>
                  <p class="text-[10px] text-slate-400 font-mono mt-0.5">${currentActive.size || ''}</p>
                  ${currentActive.comment ? `<p class="text-[11px] text-slate-600 italic mt-1 leading-snug">${currentActive.comment}</p>` : ''}
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button type="button" onclick="DashboardModule.previewTariffDocument('${(currentActive.name || '').replace(/'/g, "\\'")}')"
                  class="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
                  <i class="fa-solid fa-eye text-xs"></i>
                  <span>Preview</span>
                </button>
                <button type="button" onclick="DashboardModule.downloadTariffDocument('${(currentActive.name || '').replace(/'/g, "\\'")}')"
                  class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
                  <i class="fa-solid fa-download text-xs"></i>
                  <span>Завантажити</span>
                </button>
              </div>
            </div>
          </div>
        `;
      } else if (!isDocActive && hasText) {
        activeHtml = `
          <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <i class="fa-solid fa-circle-info text-amber-600 text-sm"></i>
            <span>Зараз діючим тарифом є <strong>текстовий коментар підрядника</strong> (перевірте вкладку «Текстовий тариф»). Усі завантажені нижче файли перебувають в архіві.</span>
          </div>
        `;
      }

      let archiveHtml = '';
      if (remainingDocs.length > 0) {
        archiveHtml = `
          <div class="space-y-2 pt-2">
            <h5 class="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <i class="fa-solid fa-box-archive text-slate-400"></i> Архівні / неактивні прайс-листи (${remainingDocs.length})
            </h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              ${remainingDocs.map(doc => {
                const isExcel = (doc.name || '').toLowerCase().endsWith('.xlsx') || (doc.name || '').toLowerCase().endsWith('.xls');
                const iconClass = isExcel ? 'fa-solid fa-file-excel text-slate-500 bg-slate-100 border-slate-200' : 'fa-solid fa-file-pdf text-slate-500 bg-slate-100 border-slate-200';
                const validity = evaluateDashboardValidity(doc.validUntil);
                return `
                  <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start justify-between gap-2.5 hover:border-slate-300 transition">
                    <div class="flex items-start gap-2.5 min-w-0">
                      <div class="w-9 h-9 rounded-lg border flex items-center justify-center text-sm shrink-0 ${iconClass}">
                        <i class="${iconClass.split(' ').slice(0, 2).join(' ')}"></i>
                      </div>
                      <div class="min-w-0">
                        <div class="font-bold text-slate-800 text-xs truncate" title="${doc.name}">${doc.name}</div>
                        <div class="text-[10px] text-slate-400 font-mono mt-0.5">${doc.size || '—'} • ${doc.uploadedAt || '—'}</div>
                        <div class="mt-1 flex items-center gap-1.5 flex-wrap">
                          <span class="px-1.5 py-0.2 rounded text-[9px] font-medium bg-slate-200/70 text-slate-600 border border-slate-300/60 inline-flex items-center gap-1">
                            <i class="fa-solid fa-box-archive text-[8px] text-slate-400"></i> Неактивний (архів)
                          </span>
                          <span class="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] border ${validity.classNames}">
                            <i class="${validity.icon}"></i> ${validity.text}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                      <button type="button" onclick="DashboardModule.previewTariffDocument('${(doc.name || '').replace(/'/g, "\\'")}')"
                        class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer">
                        <i class="fa-solid fa-eye text-[9px]"></i> Preview
                      </button>
                      <button type="button" onclick="DashboardModule.downloadTariffDocument('${(doc.name || '').replace(/'/g, "\\'")}')"
                        class="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer">
                        <i class="fa-solid fa-download text-[9px]"></i> Скачати
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      tariffDocsContainer.innerHTML = activeHtml + archiveHtml;
    } else {
      tariffDocsContainer.innerHTML = `
        <div class="p-6 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <i class="fa-solid fa-file-invoice-dollar text-2xl text-slate-300 mb-2 block"></i>
          Офіційні файли прайс-листа підрядника не завантажені (перевірте вкладку «Текстовий тариф / коментар»)
        </div>
      `;
    }

    if (tariffTextElem) {
      tariffTextElem.innerText = data.tariffText || 'Текстовий тариф не вказано.';
    }
    if (textValidityBadgeElem) {
      const activeDocName = tariffDocs.find(d => d.isActive !== false)?.name || 'завантажений файл';
      if (currentTariffType === 'text') {
        const v = data.tariffTextValidUntil ? evaluateDashboardValidity(data.tariffTextValidUntil) : null;
        textValidityBadgeElem.innerHTML = `
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1 shadow-2xs">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Активний діючий тариф (текстовий)
            </span>
            ${v ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border ${v.classNames}"><i class="${v.icon}"></i> ${v.text}</span>` : ''}
          </div>
        `;
      } else {
        textValidityBadgeElem.innerHTML = `
          <span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1">
            ⚪ Неактивний (діє завантажений файл: ${activeDocName})
          </span>
        `;
      }
    }

    // Вкладка за замовчуванням
    if (currentTariffType === 'text') {
      switchPricingTab('text');
    } else {
      switchPricingTab('docs');
    }
  }

  // 9. Інструкція для клієнта
  const instructionElem = document.getElementById('wh-display-instruction');
  if (instructionElem) instructionElem.value = data.clientInstruction || data.shippingInstructions || '';

  // 10. Особливі примітки
  const notesElem = document.getElementById('wh-display-special-notes');
  if (notesElem) notesElem.innerText = data.specialNotes;

  // 11. Блок 3.1: Індикатор закінчення дії тарифів у шапці складу (якщо до дати валідності < 1 місяця / <= 30 днів або термін вийшов)
  const expiryBannerElem = document.getElementById('wh-tariff-expiry-banner');
  if (expiryBannerElem) {
    const currentTariffType = data.tariffType || (tariffDocs.some(d => d.isActive) ? 'document' : (hasText ? 'text' : 'document'));
    let activeValidUntil = '';
    let activeSourceName = '';

    if (currentTariffType === 'text' && hasText) {
      activeValidUntil = data.tariffTextValidUntil || '';
      activeSourceName = 'Текстовий тариф підрядника';
    } else if (tariffDocs.length > 0) {
      const actDoc = tariffDocs.find(d => d.isActive !== false) || tariffDocs[0];
      activeValidUntil = actDoc.validUntil || '';
      activeSourceName = actDoc.name || 'Прайс-лист';
    }

    const v = evaluateDashboardValidity(activeValidUntil);
    if (v.status === 'expired') {
      expiryBannerElem.innerHTML = `
        <span
          class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-300 text-rose-800 text-[11px] font-bold select-none shadow-2xs"
          title="Термін дії активного тарифу («${activeSourceName}») вийшов ${v.formattedDate}.">
          <i class="fa-solid fa-circle-exclamation text-rose-600 text-[10px]"></i>
          <span>Тариф прострочено (${v.formattedDate})</span>
        </span>
      `;
      expiryBannerElem.classList.remove('hidden');
    } else if (v.status === 'expiring') {
      expiryBannerElem.innerHTML = `
        <span
          class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold select-none shadow-2xs"
          title="До закінчення дії тарифу («${activeSourceName}») залишилося ${v.diffDays} дн. (до ${v.formattedDate}).">
          <i class="fa-solid fa-triangle-exclamation text-amber-500 text-[10px]"></i>
          <span>Тариф до ${v.formattedDate} (${v.diffDays} дн.)</span>
        </span>
      `;
      expiryBannerElem.classList.remove('hidden');
    } else {
      expiryBannerElem.innerHTML = '';
      expiryBannerElem.classList.add('hidden');
    }
  }

  // 12. Блок 3.2: Рендеринг вхідних рейсів в дорозі
  renderIncomingVoyages();
}

/**
 * Перемикання вкладки блоку «Прайс-листи та Тарифи підрядника» (Блок 2.2)
 */
function switchPricingTab(tab = 'docs') {
  const docsPanel = document.getElementById('wh-pricing-docs-panel');
  const textPanel = document.getElementById('wh-pricing-text-panel');
  const buttons = document.querySelectorAll('.wh-pricing-tab');

  if (docsPanel && textPanel) {
    if (tab === 'text') {
      docsPanel.classList.add('hidden');
      textPanel.classList.remove('hidden');
    } else {
      textPanel.classList.add('hidden');
      docsPanel.classList.remove('hidden');
    }
  }

  buttons.forEach(btn => {
    const isMatch = btn.getAttribute('data-pricing-tab') === tab;
    if (isMatch) {
      btn.className = 'wh-pricing-tab px-3 py-1 rounded-lg text-xs font-bold transition bg-white text-emerald-700 shadow-2xs flex items-center gap-1.5 cursor-pointer';
    } else {
      btn.className = 'wh-pricing-tab px-3 py-1 rounded-lg text-xs font-semibold transition text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer';
    }
  });
}

/**
 * Копіювання тексту тарифів у буфер обміну (Блок 2.2)
 */
function copyTariffText() {
  const text = warehouseInfoData.tariffText || '';
  if (!text) {
    if (typeof showToast === 'function') showToast('Текст тарифу порожній');
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    if (typeof showToast === 'function') {
      showToast('Текст тарифів скопійовано в буфер обміну!');
    } else {
      alert('Текст тарифів скопійовано!');
    }
  }).catch(() => {
    if (typeof showToast === 'function') showToast('Не вдалося скопіювати текст');
  });
}

/**
 * Відкриття та закриття модального вікна «Детальна інформація та правила складу» (Кейс 2.2)
 */
function openWarehouseInfoModal() {
  const modal = document.getElementById('modal-warehouse-info');
  if (modal) modal.classList.remove('hidden');
}

function closeWarehouseInfoModal() {
  const modal = document.getElementById('modal-warehouse-info');
  if (modal) modal.classList.add('hidden');
}

function downloadTariffDocument(fileName = 'Tariff_Document.pdf') {
  const content = `ТАРИФНИЙ ДОКУМЕНТ СКЛАДУ: ${warehouseInfoData.name}\nФайл: ${fileName}\nПідрядник: ${warehouseInfoData.contractor?.name || ''}\nАдреса: ${warehouseInfoData.address?.fullAddress || ''}`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (typeof showToast === 'function') {
    showToast(`Документ «${fileName}» завантажено`);
  }
}

/**
 * Попередній перегляд документа тарифів (Preview) — Блок 2.2
 */
function previewTariffDocument(fileName = '') {
  const modal = document.getElementById('modal-doc-preview');
  if (!modal) return;

  const doc = (warehouseInfoData.tariffDocuments || []).find(d => d.name === fileName) || {
    name: fileName || 'Tariff_Document.pdf',
    size: '350 KB',
    uploadedAt: new Date().toLocaleDateString('uk-UA'),
    validUntil: '2026-12-31',
    isActive: true,
    comment: ''
  };

  const titleElem = document.getElementById('doc-preview-title');
  const sizeElem = document.getElementById('doc-preview-size');
  const statusBadge = document.getElementById('doc-preview-status-badge');
  const uploadDateElem = document.getElementById('doc-preview-upload-date');
  const validityWrap = document.getElementById('doc-preview-validity-wrap');
  const commentWrap = document.getElementById('doc-preview-comment-wrap');
  const iconElem = document.getElementById('doc-preview-icon');
  const bodyElem = document.getElementById('modal-doc-preview-body');
  const downloadBtn = document.getElementById('doc-preview-download-btn');

  const docName = doc.name || fileName || 'Прайс-лист.pdf';
  const isAct = doc.isActive && (warehouseInfoData.tariffType !== 'text');
  const contractorName = warehouseInfoData.contractor?.name || 'Підрядник складу';
  const warehouseName = warehouseInfoData.name || 'Склад';

  if (titleElem) titleElem.textContent = docName;
  if (sizeElem) sizeElem.textContent = doc.size || '';
  if (uploadDateElem) uploadDateElem.textContent = `Завантажено: ${doc.uploadedAt || '—'}`;
  if (validityWrap) {
    const v = evaluateDashboardValidity(doc.validUntil);
    validityWrap.innerHTML = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border ${v.classNames}"><i class="${v.icon}"></i> ${v.text}</span>`;
  }
  if (commentWrap) commentWrap.textContent = doc.comment ? `«${doc.comment}»` : '';

  if (statusBadge) {
    statusBadge.innerHTML = isAct
      ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1 shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Активний</span>`
      : `<span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200/70 text-slate-600 border border-slate-300/60 inline-flex items-center gap-1"><i class="fa-solid fa-box-archive text-[9px] text-slate-400"></i> Неактивний (архів)</span>`;
  }

  if (iconElem) {
    const isExcel = docName.toLowerCase().endsWith('.xlsx') || docName.toLowerCase().endsWith('.xls');
    iconElem.className = `w-10 h-10 rounded-xl border flex items-center justify-center text-lg shrink-0 ${isExcel ? 'fa-file-excel text-emerald-600 bg-emerald-50 border-emerald-200' : 'fa-file-pdf text-rose-600 bg-rose-50 border-rose-200'}`;
    iconElem.innerHTML = `<i class="fa-solid ${isExcel ? 'fa-file-excel' : 'fa-file-pdf'}"></i>`;
  }

  if (bodyElem) {
    const v = evaluateDashboardValidity(doc.validUntil);
    bodyElem.innerHTML = `
      <div class="bg-white rounded-xl border border-slate-300/80 p-6 shadow-sm space-y-5 text-slate-800 font-sans">
        <div class="flex items-start justify-between border-b-2 border-slate-800 pb-4 flex-wrap gap-3">
          <div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center">DF</div>
              <h2 class="font-extrabold text-slate-900 text-base tracking-tight uppercase">${contractorName}</h2>
            </div>
            <p class="text-[11px] text-slate-500 mt-1">Офіційний прайс-лист на послуги відповідального зберігання та складської логістики</p>
            <p class="text-[11px] font-semibold text-emerald-800 mt-0.5"><i class="fa-solid fa-warehouse mr-1 text-emerald-600"></i> ${warehouseName}</p>
          </div>
          <div class="text-right">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${isAct ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-300'}">
              <i class="fa-solid ${isAct ? 'fa-circle-check text-emerald-600' : 'fa-box-archive text-slate-500'}"></i>
              <span>${isAct ? 'ДІЮЧИЙ ПРАЙС-ЛИСТ' : 'АРХІВНА ВЕРСІЯ'}</span>
            </div>
            <div class="text-[10px] text-slate-400 font-mono mt-1.5">REF: TRF-${doc.id?.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase() || '2026-A'}</div>
            <div class="text-[10px] text-slate-500 font-medium">Дата фіксації: ${doc.uploadedAt || '—'}</div>
          </div>
        </div>

        <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-700">Термін дії документа:</span>
            <span class="inline-flex items-center gap-1 font-semibold ${v.classNames}">
              <i class="${v.icon}"></i> ${v.text}
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
                <td class="py-2 px-3 font-bold text-emerald-700 font-mono">$1.50</td>
                <td class="py-2 px-3 text-slate-500 text-[11px]">Перші 3 доби зберігання безкоштовно при консолідації</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="py-2 px-3 text-center text-slate-400 font-mono">2</td>
                <td class="py-2 px-3 font-semibold text-slate-900">Приймання та вивантаження (механізоване)</td>
                <td class="py-2 px-3 font-mono">палета (до 800 кг)</td>
                <td class="py-2 px-3 font-bold text-emerald-700 font-mono">$12.00</td>
                <td class="py-2 px-3 text-slate-500 text-[11px]">Включаючи звірку місць та вхідний візуальний огляд</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="py-2 px-3 text-center text-slate-400 font-mono">3</td>
                <td class="py-2 px-3 font-semibold text-slate-900">Відвантаження та завантаження на авто/контейнер</td>
                <td class="py-2 px-3 font-mono">палета</td>
                <td class="py-2 px-3 font-bold text-emerald-700 font-mono">$10.00</td>
                <td class="py-2 px-3 text-slate-500 text-[11px]">Фотофіксація пломби та кріплення у кузові</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="py-2 px-3 text-center text-slate-400 font-mono">4</td>
                <td class="py-2 px-3 font-semibold text-slate-900">Палетування та стретчування вантажу</td>
                <td class="py-2 px-3 font-mono">палета</td>
                <td class="py-2 px-3 font-bold text-emerald-700 font-mono">$12.00</td>
                <td class="py-2 px-3 text-slate-500 text-[11px]">Стретч-плівка (4 шари) + картонні кутники захисту</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="py-2 px-3 text-center text-slate-400 font-mono">5</td>
                <td class="py-2 px-3 font-semibold text-slate-900">Стікерування / маркування штрихкодом</td>
                <td class="py-2 px-3 font-mono">1 коробка / шт</td>
                <td class="py-2 px-3 font-bold text-emerald-700 font-mono">$0.15</td>
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
            <div class="px-3 py-1.5 rounded-lg border-2 border-dashed border-emerald-500/70 text-emerald-700 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 rotate-[-2deg]">
              <i class="fa-solid fa-stamp"></i> ВЕРИФІКОВАНО ERP DIFREIGHT
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (downloadBtn) {
    downloadBtn.onclick = () => {
      downloadTariffDocument(docName);
    };
  }

  modal.classList.remove('hidden');
}

function closeDocPreviewModal() {
  const modal = document.getElementById('modal-doc-preview');
  if (modal) modal.classList.add('hidden');
}

/**
 * Універсальна функція швидкого копіювання тексту з повідомленням (Блок 3.1)
 */
function copyTextWithToast(text, toastMessage = 'Скопійовано в буфер обміну!') {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    if (typeof showToast === 'function') {
      showToast(toastMessage);
    }
  }).catch(() => {});
}

/**
 * Швидке копіювання адреси складу (Блок 3.1)
 */
function copyWarehouseAddress() {
  const addr = warehouseInfoData.address?.fullAddress || document.getElementById('wh-display-address')?.innerText || '';
  copyTextWithToast(addr, 'Адресу складу скопійовано в буфер обміну!');
}

/**
 * Швидке копіювання контактів основної контактної особи (Блок 3.1)
 */
function copyPrimaryContactInfo() {
  const contacts = Array.isArray(warehouseInfoData.contacts) ? warehouseInfoData.contacts : [];
  const primary = contacts.find(c => c.isPrimary) || contacts[0];
  if (!primary) {
    if (typeof showToast === 'function') showToast('Основну контактну особу не вказано');
    return;
  }
  let phone = '';
  let socials = [];
  if (Array.isArray(primary.phones) && primary.phones.length > 0) {
    phone = primary.phones[0].number || '';
    if (Array.isArray(primary.phones[0].socials)) {
      socials = primary.phones[0].socials.map(s => `${s.type}: ${s.value}`);
    }
  } else if (primary.phone) {
    phone = primary.phone;
    if (primary.socials?.wechat) socials.push(`WeChat: ${primary.socials.wechat}`);
    if (primary.socials?.telegram) socials.push(`Telegram: ${primary.socials.telegram}`);
  }
  const summary = [
    `Головний менеджер складу (${warehouseInfoData.name}): ${primary.fullName}`,
    primary.position || primary.role ? `Посада: ${primary.position || primary.role}` : '',
    phone ? `Телефон: ${phone}` : '',
    primary.email ? `Email: ${primary.email}` : '',
    socials.length ? `Месенджери: ${socials.join(', ')}` : ''
  ].filter(Boolean).join('\n');

  copyTextWithToast(summary, `Контакти (${primary.fullName}) скопійовано!`);
}

// --- БЛОК 3.2: ВХІДНІ РЕЙСИ (РЕЙСИ В ДОРОЗІ) ТА ОБОВ'ЯЗКОВЕ МОДАЛЬНЕ ВІКНО ЗВІТУ ПРИЙМАННЯ ---
const incomingVoyagesData = [
  {
    id: 'IN-SV-2026-88',
    name: 'Гуанчжоу ➔ Фошань (Збірний шатл #88)',
    carrier: 'SF Express Freight (Авто 20 000 кг)',
    vehicleNumber: '粤A-88421',
    etaDate: '2026-11-05 14:30',
    status: 'В дорозі',
    expectedPlaces: 48,
    expectedWeight: 4850,
    expectedVolume: 26.4,
    shipments: [
      { id: 'DF-8801-CN', client: 'ТОВ ТехноІмпорт (DF-540)', places: 20, weight: 2100, volume: 11.2, cargoName: 'Серверні шафи та комплектуючі' },
      { id: 'DF-8802-CN', client: 'ФОП Коваленко (DF-119)', places: 16, weight: 1450, volume: 8.6, cargoName: 'Світлодіодні панелі (Крихке)' },
      { id: 'DF-8803-CN', client: 'AgroParts UA (DF-302)', places: 12, weight: 1300, volume: 6.6, cargoName: 'Запчастини до с/г техніки на палетах' }
    ]
  },
  {
    id: 'IN-SV-2026-91',
    name: 'Шеньчжень ➔ Фошань (Експрес консолідація #91)',
    carrier: 'Sinotrans Local Trucking',
    vehicleNumber: '粤B-30912',
    etaDate: '2026-11-06 10:00',
    status: 'В дорозі',
    expectedPlaces: 32,
    expectedWeight: 3200,
    expectedVolume: 18.5,
    shipments: [
      { id: 'DF-9101-CN', client: 'SolarEnergy Lviv (DF-771)', places: 18, weight: 2200, volume: 10.5, cargoName: 'Інвертори та BMS модулі (Batt)' },
      { id: 'DF-9102-CN', client: 'BeautyLine Kyiv (DF-410)', places: 14, weight: 1000, volume: 8.0, cargoName: 'Косметичні дисплеї та тара' }
    ]
  }
];

let currentAcceptVoyagePhotos = [];

function getActiveIncomingVoyages() {
  // Також враховуємо підрейси зі статусом "В дорозі" з планувальника, якщо користувач хоче прийняти їх
  const activeList = incomingVoyagesData.filter(v => v.status === 'В дорозі');
  return activeList;
}

function renderIncomingVoyages() {
  const container = document.getElementById('incoming-voyages-list-container');
  const countBadge = document.getElementById('incoming-voyages-count-badge');
  if (!container) return;

  const list = getActiveIncomingVoyages();
  if (countBadge) {
    countBadge.innerText = list.length === 1 ? '1 рейс у дорозі' : `${list.length} рейсів у дорозі`;
    countBadge.className = list.length > 0
      ? 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white shadow-2xs'
      : 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300';
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
          <span>Усі вхідні рейси успішно прийняті на склад за звітами приймання та зараховані на баланс.</span>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(v => `
    <div class="bg-slate-50 border border-slate-200/90 hover:border-indigo-300 rounded-xl p-3.5 flex flex-col justify-between gap-3 transition shadow-2xs">
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <span class="font-mono font-extrabold text-xs text-indigo-900 bg-indigo-100/80 border border-indigo-200 px-2 py-0.5 rounded-md">
            <i class="fa-solid fa-truck-fast text-indigo-600 mr-1 text-[10px]"></i>${v.id}
          </span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> ${v.status}
          </span>
        </div>
        <div>
          <div class="font-bold text-slate-900 text-xs">${v.name}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">${v.carrier} • Авто: <strong class="font-mono text-slate-700">${v.vehicleNumber}</strong></div>
        </div>
        <div class="grid grid-cols-3 gap-1.5 bg-white border border-slate-200/80 rounded-lg p-2 text-[11px] font-mono">
          <div>
            <span class="text-[9px] text-slate-400 uppercase block">Об'єм</span>
            <strong class="text-slate-900">${v.expectedVolume.toFixed(1)} м³</strong>
          </div>
          <div>
            <span class="text-[9px] text-slate-400 uppercase block">Вага</span>
            <strong class="text-slate-900">${Math.round(v.expectedWeight)} кг</strong>
          </div>
          <div>
            <span class="text-[9px] text-slate-400 uppercase block">Місць</span>
            <strong class="text-slate-900">${v.expectedPlaces} шт</strong>
          </div>
        </div>
        <div class="text-[10px] text-slate-500 flex items-center justify-between">
          <span><i class="fa-regular fa-clock mr-1 text-indigo-500"></i>ETA: <strong>${v.etaDate}</strong></span>
          <span>Перевезень: <strong>${v.shipments.length}</strong></span>
        </div>
      </div>

      <button type="button" onclick="DashboardModule.openAcceptVoyageModal('${v.id}')"
        class="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs">
        <i class="fa-solid fa-clipboard-check"></i>
        <span>Прийняти на склад (Звіт)</span>
      </button>
    </div>
  `).join('');
}

// ===== Форма отримання підрейсу на баланс складу =====
// 1) Інформація про підрейс (назва, дата отримання на складі)
// 2) Фактичні параметри після вивантаження (вводяться вручну) + позначення недостачі по перевезеннях → сповіщення менеджеру
// 3) Масове завантаження фото
// 4) Ступінь пошкодження коробок по кожному перевезенню (зелений / жовтий / червоний)

const ACCEPT_DAMAGE_LEVELS = {
  green: { label: 'Зелений', short: 'Цілі', dot: 'bg-emerald-500', on: 'bg-emerald-500 text-white border-emerald-600', off: 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50', desc: 'Коробки максимально мають вигляд, як при відправці з Китаю' },
  yellow: { label: 'Жовтий', short: 'Ремонт', dot: 'bg-amber-400', on: 'bg-amber-400 text-amber-950 border-amber-500', off: 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50', desc: 'Коробки мають пошкодження, їх реально підремонтувати' },
  red: { label: 'Червоний', short: 'Заміна', dot: 'bg-rose-500', on: 'bg-rose-500 text-white border-rose-600', off: 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50', desc: 'Коробки критично пошкоджені, мокрі, потребують повну заміну пакування' }
};
window.ACCEPT_DAMAGE_LEVELS = ACCEPT_DAMAGE_LEVELS;

const ACCEPT_FALLBACK_MANAGERS = ['Н. Ткаченко', 'А. Мороз', 'В. Лисенко', 'Д. Савчук'];
let currentAcceptVoyage = null;
let acceptShipmentState = {};

// Журнал сповіщень менеджерам (недостача при отриманні підрейсу)
window.managerNotifications = Array.isArray(window.managerNotifications) ? window.managerNotifications : [];

function resolveShipmentManager(t, idx = 0) {
  return t?.manager || t?.responsibleManager || t?.responsible_manager || ACCEPT_FALLBACK_MANAGERS[idx % ACCEPT_FALLBACK_MANAGERS.length];
}

function toLocalDateTimeText(d = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function openAcceptVoyageModal(voyageId, event = null) {
  if (event && typeof event.stopPropagation === 'function') event.stopPropagation();

  const svList = Array.isArray(window.svManagementSubvoyages) ? window.svManagementSubvoyages : [];
  const trList = Array.isArray(window.svManagementShipments) ? window.svManagementShipments : [];
  const svObj = svList.find(s => s.id === voyageId);
  let voyage = incomingVoyagesData.find(v => v.id === voyageId);

  if (svObj) {
    const assigned = trList.filter(t => t.subvoyageId === svObj.id);
    const expPlaces = assigned.reduce((sum, t) => sum + (Number(t.places ?? t.totalPlaces) || 0), 0) || svObj.maxPlaces || 30;
    const expWeight = assigned.reduce((sum, t) => sum + (Number(t.weight ?? t.totalWeight) || 0), 0) || 2800;
    const expVolume = assigned.reduce((sum, t) => sum + (Number(t.volume ?? t.totalVolume) || 0), 0) || 14.5;
    const carrierName = svObj.transportDetails?.shippingLine || svObj.transportDetails?.airline || svObj.transportDetails?.carrier || svObj.transport || 'Перевізник';
    const vehicleNum = svObj.transportDetails?.containerNumber || svObj.transportDetails?.awbNumber || svObj.transportDetails?.vehicleDetails || svObj.transportDetails?.bookingNumber || svObj.id;

    voyage = {
      id: svObj.id,
      name: svObj.name,
      carrier: carrierName,
      vehicleNumber: vehicleNum,
      etaDate: svObj.plannedArrival || '2026-11-05',
      status: svObj.status,
      expectedPlaces: expPlaces,
      expectedWeight: expWeight,
      expectedVolume: expVolume,
      isPlannerSubvoyage: true,
      shipments: assigned.length > 0
        ? assigned.map((t, idx) => ({
            id: t.dfShipment || t.id,
            rawId: t.id,
            client: t.client || 'Клієнт',
            manager: resolveShipmentManager(t, idx),
            places: Number(t.places ?? t.totalPlaces) || 10,
            weight: Number(t.weight ?? t.totalWeight) || 1000,
            volume: Number(t.volume ?? t.totalVolume) || 5.0,
            cargoName: t.cargoes?.[0]?.titleUa || t.cargoes?.[0]?.name || `${t.cargoType || 'Карго'} (${t.packagingType || 'Палети'})`
          }))
        : [
            { id: `DF-${svObj.id}-01`, rawId: `DF-${svObj.id}-01`, client: 'ТОВ ТехноІмпорт (Маніфест)', manager: ACCEPT_FALLBACK_MANAGERS[0], places: expPlaces, weight: expWeight, volume: expVolume, cargoName: 'Консолідований вантаж за маніфестом підрейсу' }
          ]
    };
  } else if (voyage) {
    voyage.shipments.forEach((sh, idx) => { sh.manager = resolveShipmentManager(sh, idx); });
  }

  if (!voyage) return;

  const modal = document.getElementById('modal-accept-voyage');
  if (!modal) return;

  currentAcceptVoyage = voyage;
  acceptShipmentState = {};
  voyage.shipments.forEach(sh => {
    acceptShipmentState[sh.id] = { shortage: false, shortagePlaces: 0, damage: null };
  });

  // 1. Інформація про підрейс
  document.getElementById('accept-voyage-target-id').value = voyage.id;
  document.getElementById('accept-voyage-id-badge').innerText = voyage.id;
  document.getElementById('accept-voyage-route-info').innerText = voyage.name;
  document.getElementById('accept-voyage-meta-info').innerText = `${voyage.carrier} • Борт / Контейнер: ${voyage.vehicleNumber} • ETA: ${voyage.etaDate} • Перевезень: ${voyage.shipments.length}`;
  const dateEl = document.getElementById('accept-voyage-receive-date');
  if (dateEl) dateEl.innerText = toLocalDateTimeText();

  // 2. Очікувані параметри (факт логіст вводить вручну — поля порожні)
  document.getElementById('accept-voyage-expected-places').innerText = voyage.expectedPlaces;
  document.getElementById('accept-voyage-expected-weight').innerText = Math.round(voyage.expectedWeight);
  document.getElementById('accept-voyage-expected-volume').innerText = Number(voyage.expectedVolume).toFixed(2);
  ['places', 'weight', 'volume'].forEach(k => {
    const el = document.getElementById(`accept-voyage-actual-${k}`);
    if (el) el.value = '';
  });

  // 3. Фото — порожньо, масове завантаження
  currentAcceptVoyagePhotos.forEach(p => { if (p.url) URL.revokeObjectURL(p.url); });
  currentAcceptVoyagePhotos = [];
  renderAcceptVoyagePhotos();

  const notesElem = document.getElementById('accept-voyage-notes');
  if (notesElem) notesElem.value = '';

  const errElem = document.getElementById('accept-voyage-validation-error');
  if (errElem) errElem.classList.add('hidden');

  renderAcceptShipmentsList();
  updateAcceptParamsDiff();
  modal.classList.remove('hidden');
}

function closeAcceptVoyageModal() {
  const modal = document.getElementById('modal-accept-voyage');
  if (modal) modal.classList.add('hidden');
}

// Сумісність зі старими викликами (режим «Все добре / Проблеми» замінено новою формою)
function toggleAcceptVoyageMode() { }

function getAcceptActualParams() {
  return {
    places: parseInt(document.getElementById('accept-voyage-actual-places')?.value, 10),
    weight: parseFloat(document.getElementById('accept-voyage-actual-weight')?.value),
    volume: parseFloat(document.getElementById('accept-voyage-actual-volume')?.value)
  };
}

function getAcceptMismatch() {
  const v = currentAcceptVoyage;
  if (!v) return { any: false };
  const a = getAcceptActualParams();
  const expPlaces = Number(v.expectedPlaces) || 0;
  const expWeight = Math.round(Number(v.expectedWeight) || 0);
  const expVolume = Number((Number(v.expectedVolume) || 0).toFixed(2));
  const placesDiff = isNaN(a.places) ? null : a.places - expPlaces;
  const weightDiff = isNaN(a.weight) ? null : Number((a.weight - expWeight).toFixed(1));
  const volumeDiff = isNaN(a.volume) ? null : Number((a.volume - expVolume).toFixed(2));
  return {
    placesDiff, weightDiff, volumeDiff,
    places: placesDiff !== null && placesDiff !== 0,
    weight: weightDiff !== null && weightDiff !== 0,
    volume: volumeDiff !== null && volumeDiff !== 0,
    get any() { return this.places || this.weight || this.volume; }
  };
}

function updateAcceptParamsDiff() {
  const m = getAcceptMismatch();
  const fmt = (diff, unit) => {
    if (diff === null) return '';
    if (diff === 0) return `<span class="text-emerald-600"><i class="fa-solid fa-check mr-0.5"></i>Збігається</span>`;
    const cls = diff < 0 ? 'text-rose-600' : 'text-amber-600';
    return `<span class="${cls}"><i class="fa-solid fa-not-equal mr-0.5"></i>${diff > 0 ? '+' : ''}${diff} ${unit}</span>`;
  };
  const setHtml = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  setHtml('accept-voyage-diff-places', fmt(m.placesDiff, 'шт'));
  setHtml('accept-voyage-diff-weight', fmt(m.weightDiff, 'кг'));
  setHtml('accept-voyage-diff-volume', fmt(m.volumeDiff, 'м³'));

  const banner = document.getElementById('accept-voyage-mismatch-banner');
  const bannerText = document.getElementById('accept-voyage-mismatch-text');
  if (banner) banner.classList.toggle('hidden', !m.any);
  if (bannerText && m.any) {
    bannerText.innerText = m.places && m.placesDiff < 0
      ? `Не вистачає ${Math.abs(m.placesDiff)} місць відносно очікуваних. Позначте у списку нижче, в яких перевезеннях недостача — відповідальні менеджери отримають сповіщення.`
      : 'Параметри не збігаються з очікуваними. Якщо в якомусь перевезенні не вистачає місць — позначте недостачу у списку нижче.';
  }
  renderAcceptShortageSummary();
}

function renderAcceptShipmentsList() {
  const tbody = document.getElementById('accept-voyage-shipments-checklist');
  if (!tbody || !currentAcceptVoyage) return;

  tbody.innerHTML = currentAcceptVoyage.shipments.map(sh => {
    const st = acceptShipmentState[sh.id] || {};
    const damageBtns = Object.entries(ACCEPT_DAMAGE_LEVELS).map(([key, lvl]) => `
      <button type="button" onclick="DashboardModule.setAcceptDamage('${sh.id}', '${key}')" title="${lvl.label}: ${lvl.desc}"
        class="px-1.5 py-1 rounded-md border text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition ${st.damage === key ? lvl.on : lvl.off}">
        <span class="w-2 h-2 rounded-full ${st.damage === key ? 'bg-white/80' : lvl.dot}"></span>${lvl.short}
      </button>
    `).join('');

    return `
      <tr class="${st.shortage ? 'bg-rose-50/60' : 'bg-white'} align-top">
        <td class="p-2">
          <div class="font-mono font-bold text-slate-900">${sh.id}</div>
          <div class="text-slate-600 font-semibold">${sh.client}</div>
          <div class="text-[10px] text-slate-400">${sh.cargoName}</div>
        </td>
        <td class="p-2 whitespace-nowrap text-slate-700"><i class="fa-regular fa-user text-slate-400 mr-1"></i>${sh.manager}</td>
        <td class="p-2 font-mono whitespace-nowrap text-slate-700">
          <div><strong>${sh.places}</strong> шт</div>
          <div class="text-[10px] text-slate-500">${Number(sh.volume).toFixed(2)} м³ · ${sh.weight} кг</div>
        </td>
        <td class="p-2 whitespace-nowrap">
          <label class="inline-flex items-center gap-1.5 cursor-pointer select-none">
            <input type="checkbox" ${st.shortage ? 'checked' : ''} onchange="DashboardModule.toggleAcceptShortage('${sh.id}', this.checked)"
              class="accent-rose-600 w-3.5 h-3.5 rounded cursor-pointer">
            <span class="font-bold ${st.shortage ? 'text-rose-700' : 'text-slate-600'}">Недостача</span>
          </label>
          ${st.shortage ? `
            <div class="mt-1 flex items-center gap-1">
              <span class="text-[10px] text-slate-500">не вистачає</span>
              <input type="number" min="1" max="${sh.places}" step="1" value="${st.shortagePlaces || ''}" placeholder="к-сть"
                oninput="DashboardModule.setAcceptShortagePlaces('${sh.id}', this.value)"
                class="w-14 bg-white border border-rose-300 rounded px-1.5 py-0.5 font-mono font-bold text-rose-800 text-[11px] focus:ring-2 focus:ring-rose-400 focus:outline-none">
              <span class="text-[10px] text-slate-500">шт</span>
            </div>
            <div class="text-[9px] text-amber-700 mt-0.5"><i class="fa-solid fa-bell mr-0.5"></i>Сповіщення: ${sh.manager}</div>
          ` : ''}
        </td>
        <td class="p-2">
          <div class="flex items-center gap-1 flex-wrap">${damageBtns}</div>
        </td>
      </tr>
    `;
  }).join('');

  renderAcceptShortageSummary();
}

function renderAcceptShortageSummary() {
  const el = document.getElementById('accept-voyage-shortage-summary');
  if (!el || !currentAcceptVoyage) return;
  const states = currentAcceptVoyage.shipments.map(sh => acceptShipmentState[sh.id] || {});
  const shortageCount = states.filter(s => s.shortage).length;
  const shortagePlaces = states.reduce((sum, s) => sum + (s.shortage ? (Number(s.shortagePlaces) || 0) : 0), 0);
  const counts = { green: 0, yellow: 0, red: 0 };
  states.forEach(s => { if (s.damage) counts[s.damage]++; });
  const unset = states.filter(s => !s.damage).length;
  const m = getAcceptMismatch();
  const expectedShortage = m.placesDiff !== null && m.placesDiff < 0 ? Math.abs(m.placesDiff) : 0;

  el.innerHTML = `
    <span><i class="fa-solid fa-box-open text-rose-500 mr-1"></i>Недостача: <strong class="${shortageCount ? 'text-rose-700' : ''}">${shortageCount}</strong> перевез. / <strong>${shortagePlaces}</strong> місць</span>
    ${expectedShortage && shortagePlaces !== expectedShortage ? `<span class="text-amber-700 font-bold"><i class="fa-solid fa-triangle-exclamation mr-0.5"></i>За параметрами рейсу не вистачає ${expectedShortage} шт</span>` : ''}
    <span class="ml-auto inline-flex items-center gap-2">
      <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>${counts.green}</span>
      <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-400"></span>${counts.yellow}</span>
      <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-500"></span>${counts.red}</span>
      ${unset ? `<span class="text-rose-600 font-bold">Не вказано стан: ${unset}</span>` : ''}
    </span>
  `;
}

function toggleAcceptShortage(shipmentId, checked) {
  const st = acceptShipmentState[shipmentId];
  if (!st) return;
  st.shortage = !!checked;
  if (!checked) st.shortagePlaces = 0;
  renderAcceptShipmentsList();
}

function setAcceptShortagePlaces(shipmentId, value) {
  const st = acceptShipmentState[shipmentId];
  if (!st) return;
  st.shortagePlaces = Math.max(0, parseInt(value, 10) || 0);
  renderAcceptShortageSummary();
}

function setAcceptDamage(shipmentId, level) {
  const st = acceptShipmentState[shipmentId];
  if (!st || !ACCEPT_DAMAGE_LEVELS[level]) return;
  st.damage = level;
  renderAcceptShipmentsList();
}

function setAllAcceptDamage(level) {
  if (!ACCEPT_DAMAGE_LEVELS[level]) return;
  Object.values(acceptShipmentState).forEach(st => { st.damage = level; });
  renderAcceptShipmentsList();
}

// --- Масове завантаження фото ---
function renderAcceptVoyagePhotos() {
  const listElem = document.getElementById('accept-voyage-photos-list');
  const countElem = document.getElementById('accept-voyage-photos-count');
  const clearBtn = document.getElementById('accept-voyage-photos-clear');
  const n = currentAcceptVoyagePhotos.length;
  if (countElem) {
    countElem.innerText = `Додано: ${n} фото`;
    countElem.className = n > 0
      ? 'text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded'
      : 'text-[10px] font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-bold';
  }
  if (clearBtn) clearBtn.classList.toggle('hidden', n === 0);
  if (!listElem) return;
  if (n === 0) {
    listElem.innerHTML = '';
    return;
  }
  listElem.innerHTML = currentAcceptVoyagePhotos.map((p, idx) => `
    <div class="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100" title="${p.name} (${p.size})">
      ${p.url
        ? `<img src="${p.url}" alt="${p.name}" class="w-full h-full object-cover">`
        : `<div class="w-full h-full flex items-center justify-center text-slate-400"><i class="fa-regular fa-image text-xl"></i></div>`}
      <button type="button" onclick="DashboardModule.removeAcceptPhoto(${idx})"
        class="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white text-xs leading-none flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition" title="Видалити фото">&times;</button>
    </div>
  `).join('');
}

function handleAcceptPhotoFiles(fileList) {
  const files = Array.from(fileList || []).filter(f => !f.type || f.type.startsWith('image/'));
  files.forEach(f => {
    const sizeKb = Math.max(1, Math.round((f.size || 0) / 1024));
    let url = '';
    try { url = URL.createObjectURL(f); } catch (e) { url = ''; }
    currentAcceptVoyagePhotos.push({
      name: f.name,
      size: sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`,
      url
    });
  });
  renderAcceptVoyagePhotos();
  if (files.length > 1 && typeof showToast === 'function') showToast(`Додано ${files.length} фото`);
}

function handleAcceptPhotoUpload(input) {
  handleAcceptPhotoFiles(input?.files);
  if (input) input.value = '';
}

function removeAcceptPhoto(idx) {
  const [removed] = currentAcceptVoyagePhotos.splice(idx, 1);
  if (removed?.url) URL.revokeObjectURL(removed.url);
  renderAcceptVoyagePhotos();
}

function clearAcceptPhotos() {
  currentAcceptVoyagePhotos.forEach(p => { if (p.url) URL.revokeObjectURL(p.url); });
  currentAcceptVoyagePhotos = [];
  renderAcceptVoyagePhotos();
}

// --- Сповіщення відповідальному менеджеру про недостачу ---
function notifyManagerAboutShortage({ manager, shipmentId, subvoyageId, subvoyageName, shortagePlaces, expectedPlaces, damageLevel, receiveDate, notes }) {
  const notification = {
    id: `NTF-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'shortage',
    recipient: manager,
    shipmentId,
    subvoyageId,
    title: `Недостача ${shortagePlaces || '?'} з ${expectedPlaces} місць у перевезенні ${shipmentId}`,
    message: `Підрейс ${subvoyageId}${subvoyageName ? ` (${subvoyageName})` : ''} отримано на складі ${receiveDate}. У перевезенні ${shipmentId} не вистачає ${shortagePlaces || 'невизначену кількість'} місць. Запустіть компенсацію / комунікацію з клієнтом.${damageLevel ? ` Стан коробок: ${ACCEPT_DAMAGE_LEVELS[damageLevel]?.label}.` : ''}${notes ? ` Примітка логіста: ${notes}` : ''}`,
    createdAt: new Date().toISOString(),
    read: false
  };
  window.managerNotifications.unshift(notification);
  return notification;
}

function submitAcceptVoyageReport() {
  const voyageId = document.getElementById('accept-voyage-target-id')?.value;
  const svList = Array.isArray(window.svManagementSubvoyages) ? window.svManagementSubvoyages : [];
  const svObj = svList.find(s => s.id === voyageId);
  const voyage = currentAcceptVoyage && currentAcceptVoyage.id === voyageId ? currentAcceptVoyage : incomingVoyagesData.find(v => v.id === voyageId);
  if (!svObj && !voyage) return;

  const receiveDate = (document.getElementById('accept-voyage-receive-date')?.innerText || '').trim() || toLocalDateTimeText();
  const { places: actualPlaces, weight: actualWeight, volume: actualVolume } = getAcceptActualParams();
  const notes = (document.getElementById('accept-voyage-notes')?.value || '').trim();

  const errBox = document.getElementById('accept-voyage-validation-error');
  const errText = document.getElementById('accept-voyage-validation-error-text');
  const showError = (msg) => {
    if (errText) errText.innerText = msg;
    if (errBox) {
      errBox.classList.remove('hidden');
      errBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!receiveDate) {
    showError('Вкажіть дату отримання підрейсу на складі.');
    return;
  }
  if (isNaN(actualPlaces) || actualPlaces < 0 || isNaN(actualWeight) || actualWeight <= 0 || isNaN(actualVolume) || actualVolume <= 0) {
    showError('Вкажіть фактичні параметри після вивантаження: кількість місць, об\'єм та вагу.');
    return;
  }

  const shipmentsReport = voyage.shipments.map(sh => {
    const st = acceptShipmentState[sh.id] || {};
    return {
      id: sh.id,
      rawId: sh.rawId || sh.id,
      manager: sh.manager,
      expectedPlaces: sh.places,
      shortage: !!st.shortage,
      shortagePlaces: st.shortage ? (Number(st.shortagePlaces) || 0) : 0,
      damageLevel: st.damage || null
    };
  });

  const mismatch = getAcceptMismatch();
  const shortageItems = shipmentsReport.filter(s => s.shortage);
  if (mismatch.places && mismatch.placesDiff < 0 && shortageItems.length === 0) {
    showError(`Кількість місць не збігається (не вистачає ${Math.abs(mismatch.placesDiff)} шт). Позначте у списку перевезення, в яких недостача.`);
    return;
  }
  const badShortage = shortageItems.find(s => s.shortagePlaces <= 0 || s.shortagePlaces > s.expectedPlaces);
  if (badShortage) {
    showError(`Вкажіть кількість місць, яких не вистачає, у перевезенні ${badShortage.id} (від 1 до ${badShortage.expectedPlaces}).`);
    return;
  }
  const noDamage = shipmentsReport.filter(s => !s.damageLevel);
  if (noDamage.length > 0) {
    showError(`Проставте ступінь пошкодження коробок для всіх перевезень (не вказано: ${noDamage.map(s => s.id).join(', ')}).`);
    return;
  }
  if (currentAcceptVoyagePhotos.length === 0) {
    showError('Додайте хоча б одне фото вивантаження.');
    return;
  }

  // Сповіщення менеджерам про недостачу (процес роботи з вантажем не зупиняється)
  const notifications = shortageItems.map(s => notifyManagerAboutShortage({
    manager: s.manager,
    shipmentId: s.id,
    subvoyageId: voyage.id,
    subvoyageName: voyage.name,
    shortagePlaces: s.shortagePlaces,
    expectedPlaces: s.expectedPlaces,
    damageLevel: s.damageLevel,
    receiveDate,
    notes
  }));

  const reportData = {
    receiveDate,
    actualPlaces,
    actualWeight,
    actualVolume,
    expectedPlaces: voyage.expectedPlaces,
    expectedWeight: voyage.expectedWeight,
    expectedVolume: voyage.expectedVolume,
    paramsMismatch: mismatch.any,
    shipmentsReport,
    notifications,
    notes,
    photos: currentAcceptVoyagePhotos.map(p => ({ name: p.name, size: p.size, url: p.url })),
    // Сумісність зі старим форматом звіту
    isAllGood: shortageItems.length === 0 && shipmentsReport.every(s => s.damageLevel === 'green'),
    selectedProblemShipments: shortageItems.map(s => s.id)
  };

  // Підрейс із Дошки Підрейсів — обробник планувальника
  if (svObj && typeof window.acceptSubvoyageToWarehouse === 'function') {
    window.acceptSubvoyageToWarehouse(voyageId, reportData);
    closeAcceptVoyageModal();
    renderIncomingVoyages();
    return;
  }

  // Автономний вхідний рейс (incomingVoyagesData)
  voyage.status = 'Прибув на склад отримання';
  voyage.acceptedAt = receiveDate;
  voyage.acceptanceReport = reportData;

  if (Array.isArray(window.svManagementShipments)) {
    voyage.shipments.forEach((sh, index) => {
      const rep = shipmentsReport.find(r => r.id === sh.id) || {};
      const exists = window.svManagementShipments.some(existing => existing.id === sh.id);
      if (!exists) {
        window.svManagementShipments.unshift({
          id: sh.id,
          dfShipment: sh.id,
          client: sh.client,
          manager: sh.manager,
          name: `${sh.client} — ${sh.cargoName}`,
          originWarehouse: 'Гуанчжоу (Транзит)',
          destinationHub: 'Китай ➔ Україна (Київ)',
          routeCountry: 'Україна',
          status: 'Прибув на склад отримання',
          readinessCategory: 'ready',
          cargoType: index % 2 === 0 ? 'Карго' : 'Фрахт',
          deliveryType: 'Море',
          packagingType: 'Палети',
          volume: sh.volume,
          weight: sh.weight,
          places: sh.places,
          totalVolume: sh.volume,
          totalWeight: sh.weight,
          totalPlaces: sh.places,
          readyDate: receiveDate.split(' ')[0],
          dateReady: receiveDate.split(' ')[0],
          subvoyageId: null,
          isLastMile: false,
          customsClearance: true,
          closeExporterDocs: true,
          isHazardous: false,
          hasBatteries: sh.cargoName.includes('Batt'),
          isFragile: sh.cargoName.includes('Крихке'),
          isOversized: false,
          logist: 'Коваленко О.',
          acceptance: {
            subvoyageId: voyage.id,
            receiveDate,
            damageLevel: rep.damageLevel,
            shortage: !!rep.shortage,
            shortagePlaces: rep.shortagePlaces || 0,
            receivedPlaces: sh.places - (rep.shortagePlaces || 0)
          },
          tasks: rep.shortage ? [{
            id: `TSK-SH-${Date.now()}-${index}`,
            title: `Недостача ${rep.shortagePlaces} з ${sh.places} місць при отриманні ${voyage.id} — запустити компенсацію`,
            assignee: sh.manager,
            dueDate: receiveDate.split(' ')[0],
            status: 'open',
            type: 'shortage'
          }] : [],
          cargoes: [
            {
              id: `${sh.id}/1`,
              name: sh.cargoName,
              status: 'На складі',
              volume: sh.volume,
              weight: sh.weight,
              places: sh.places,
              packaging: 'Палети'
            }
          ]
        });
      }
    });
  }

  closeAcceptVoyageModal();
  renderIncomingVoyages();

  if (typeof window.refreshSubvoyagesWorkspace === 'function') {
    window.refreshSubvoyagesWorkspace();
  }
  if (typeof updateDashboardStats === 'function') {
    updateDashboardStats(window.cargoesData || [], window.subvoyagesData || []);
  }

  if (typeof showToast === 'function') {
    const ntf = notifications.length ? ` Сповіщено менеджерів про недостачу: ${notifications.length}.` : '';
    showToast(`Рейс ${voyage.id} прийнято на баланс складу (${voyage.shipments.length} перевезень).${ntf}`);
  }
}

function copyClientInstruction() {
  const instructionElem = document.getElementById('wh-display-instruction');
  const text = instructionElem?.value || warehouseInfoData.clientInstruction || warehouseInfoData.shippingInstructions || '';
  if (!text) {
    if (typeof showToast === 'function') showToast('Текст інструкції порожній');
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    if (typeof showToast === 'function') {
      showToast('Інструкцію для клієнта скопійовано в буфер обміну!');
    } else {
      alert('Інструкцію скопійовано!');
    }
  }).catch(err => {
    console.error('Помилка копіювання:', err);
  });
}

/**
 * Завантаження інструкції файлом (.txt)
 */
function downloadClientInstruction() {
  const instructionElem = document.getElementById('wh-display-instruction');
  const content = instructionElem?.value || warehouseInfoData.clientInstruction || warehouseInfoData.shippingInstructions || '';
  if (!content) {
    if (typeof showToast === 'function') showToast('Текст інструкції порожній');
    return;
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Warehouse_Instruction_${warehouseInfoData.code || 'FOSHAN'}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (typeof showToast === 'function') {
    showToast('Файл інструкції для клієнта завантажено (.txt)');
  }
}

/**
 * Синхронізація даних складу з центральним файлом warehouses.json (якщо доступний)
 */
async function initWarehouseDataSync() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const whId = urlParams.get('id') || 'foshan';

    const res = await fetch('../data/warehouses.json').catch(() => fetch('data/warehouses.json')).catch(() => null);
    if (res && res.ok) {
      const warehouses = await res.json();
      const currentWh = warehouses.find(w => w.id === whId) || warehouses.find(w => w.name === warehouseInfoData.name) || warehouses[0];
      if (currentWh) {
        if (currentWh.name) warehouseInfoData.name = currentWh.name;
        if (currentWh.address) warehouseInfoData.address.fullAddress = currentWh.address;
        if (currentWh.contractor) warehouseInfoData.contractor.name = currentWh.contractor;
        if (Array.isArray(currentWh.services) && currentWh.services.length > 0) {
          warehouseInfoData.services = currentWh.services;
        }
        if (Array.isArray(currentWh.selectedSubServices)) {
          warehouseInfoData.selectedSubServices = currentWh.selectedSubServices;
        }
        if (currentWh.workRules) warehouseInfoData.rules = currentWh.workRules;
        if (currentWh.specialNotes) warehouseInfoData.specialNotes = currentWh.specialNotes;
        if (currentWh.shippingInstructions) {
          warehouseInfoData.shippingInstructions = currentWh.shippingInstructions;
          warehouseInfoData.clientInstruction = currentWh.shippingInstructions;
        }
        if (Array.isArray(currentWh.contacts) && currentWh.contacts.length > 0) {
          warehouseInfoData.contacts = currentWh.contacts;
        }
        if (Array.isArray(currentWh.tariffs) && currentWh.tariffs.length > 0) {
          warehouseInfoData.pricing = currentWh.tariffs.map(t => ({
            service: t.service,
            unitPrice: parseFloat(t.unitPrice) || 0,
            currency: t.currency || 'USD',
            standard: t.standard || 'per unit',
            remark: t.remark || '',
            dateFrom: t.dateFrom || '2026-01-01',
            dateTo: t.dateTo || '2026-12-31'
          }));
        }
        if (currentWh.tariffType) {
          warehouseInfoData.tariffType = currentWh.tariffType;
        } else if (Array.isArray(currentWh.tariffDocuments) && currentWh.tariffDocuments.some(d => d.isActive !== false)) {
          warehouseInfoData.tariffType = 'document';
        } else if (currentWh.tariffText) {
          warehouseInfoData.tariffType = 'text';
        }
        if (Array.isArray(currentWh.tariffDocuments)) {
          warehouseInfoData.tariffDocuments = currentWh.tariffDocuments;
        }
        if (currentWh.tariffText) {
          warehouseInfoData.tariffText = currentWh.tariffText;
          warehouseInfoData.tariffTextValidUntil = currentWh.tariffTextValidUntil || '';
        }
        renderWarehouseInfo(warehouseInfoData);
      }
    }
  } catch (err) {
    // Тихо використовуємо локальні дані warehouseInfoData
  }
}

// Запускаємо синхронізацію при завантаженні
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWarehouseDataSync);
} else {
  initWarehouseDataSync();
}

// Глобальний експорт
window.DashboardModule = {
  data: warehouseInfoData,
  updateStats: updateDashboardStats,
  renderWarehouseInfo: renderWarehouseInfo,
  renderWarehouseServices: renderWarehouseServices,
  initWarehouseDataSync: initWarehouseDataSync,
  copyInstruction: copyClientInstruction,
  downloadInstruction: downloadClientInstruction,
  copyWarehouseAddress: copyWarehouseAddress,
  copyPrimaryContactInfo: copyPrimaryContactInfo,
  copyTextWithToast: copyTextWithToast,
  renderIncomingVoyages: renderIncomingVoyages,
  openAcceptVoyageModal: openAcceptVoyageModal,
  closeAcceptVoyageModal: closeAcceptVoyageModal,
  toggleAcceptVoyageMode: toggleAcceptVoyageMode,
  handleAcceptPhotoUpload: handleAcceptPhotoUpload,
  handleAcceptPhotoFiles: handleAcceptPhotoFiles,
  removeAcceptPhoto: removeAcceptPhoto,
  clearAcceptPhotos: clearAcceptPhotos,
  updateAcceptParamsDiff: updateAcceptParamsDiff,
  toggleAcceptShortage: toggleAcceptShortage,
  setAcceptShortagePlaces: setAcceptShortagePlaces,
  setAcceptDamage: setAcceptDamage,
  setAllAcceptDamage: setAllAcceptDamage,
  submitAcceptVoyageReport: submitAcceptVoyageReport,
  openInfoModal: openWarehouseInfoModal,
  closeInfoModal: closeWarehouseInfoModal,
  editWarehouse: function () {
    // Дія редагування складу — фактично нічого не відкриваємо, щоб не дублювати логіку
  },
  switchPricingTab: switchPricingTab,
  downloadTariffDocument: downloadTariffDocument,
  previewTariffDocument: previewTariffDocument,
  closeDocPreviewModal: closeDocPreviewModal,
  copyTariffText: copyTariffText
};
