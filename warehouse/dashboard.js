/**
 * dashboard.js - Модуль управління дашбордом та інформацією про склад
 */

// Структура даних складу
const warehouseInfoData = {
  // 1. Назва Складу
  name: "New FOSHAN",
  code: "WH-FOSHAN-01",
  type: "Difreight", // 'Difreight' (Власний) або 'Партнерський'
  volumeLimit: 400.0,

  // 2. Повна Адреса (єдиний структурований формат у рядок: Індекс, Країна, Область/Регіон, Місто, Вулиця, Офіс/Корпус)
  address: {
    zipCode: "528200",
    country: "Китай",
    province: "провінція Гуандун",
    city: "м. Фошань",
    district: "р-н Наньхай",
    street: "No. 88 Logistics Avenue",
    addressLine2: "Gate 3",
    fullAddress: "528200, Китай, провінція Гуандун, м. Фошань (р-н Наньхай), No. 88 Logistics Avenue, Gate 3"
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

  // 7. Контактні особи (структура як при створенні складу: телефони з WhatsApp/Viber + окремо месенджери/соцмережі без телефону)
  contacts: [
    {
      fullName: "L. Wei",
      position: "Senior Warehouse Operator",
      role: "Senior Warehouse Operator",
      email: "wei.fsh@difreight.com",
      comment: "Відповідає за приймання негабаритних вантажів, вхідну фотофіксацію та перевірку пакування LCL.",
      isPrimary: true,
      phones: [
        {
          number: "+86 757 8820 1102",
          socials: [
            { type: "WhatsApp", value: "+86 757 8820 1102" }
          ]
        }
      ],
      standaloneSocials: [
        { type: "WeChat", value: "wxid_wei_foshan88" },
        { type: "Telegram", value: "@wei_foshan_logix" }
      ]
    },
    {
      fullName: "Chen Xiu",
      position: "Receiving & Inspection Supervisor",
      role: "Receiving & Inspection Supervisor",
      email: "chen.x@difreight.com",
      comment: "",
      isPrimary: false,
      phones: [
        {
          number: "+86 757 8820 1105",
          socials: [
            { type: "WhatsApp", value: "+86 757 8820 1105" }
          ]
        }
      ],
      standaloneSocials: [
        { type: "WeChat", value: "chen_xiu_wh" },
        { type: "Telegram", value: "@chen_xiu_wh" }
      ]
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

function formatStructuredAddressLine(addr = {}) {
  if (!addr) return '';
  const zip = (addr.postalCode || addr.zipCode || '').trim();
  const country = (addr.countryName || addr.country || '').trim();
  const region = (addr.region || addr.province || '').trim();
  const cityBase = (addr.city || '').trim();
  const district = (addr.district || '').trim();
  const city = cityBase && district && !cityBase.includes(district)
    ? `${cityBase} (${district})`
    : (cityBase || district);
  const street = (addr.street || '').trim();
  const line2 = (addr.addressLine2 || '').trim();

  const parts = [zip, country, region, city, street, line2].filter(Boolean);
  if (parts.length >= 2) return parts.join(', ');
  return (addr.fullAddress || addr.address || parts[0] || '').trim();
}

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
  let unlinkedOnWarehouseVolume = 0;
  let plannedPromisesVolume = 0;
  let unmarkedVolume = 0;

  // Вантажі з реєстру, які вже фізично на складі (і промарковані), але ще не прив'язані до обіцянок чи перевезень
  const unlinkedFromCargoes = (Array.isArray(cargoes) ? cargoes : [])
    .filter(c =>
      !c.dfPromise &&
      !c.dfShipment &&
      !c.subvoyage &&
      c.statusCode !== 'received_unmarked' &&
      c.statusCode !== 'in_transit' &&
      c.statusCode !== 'issued' &&
      c.statusCode !== 'returned_to_customer'
    )
    .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

  if (svShipments) {
    // 1. Завантажені на рейси (фактичний об'єм на складі, розподілений по підрейсах на формуванні/завантаженні, без планових обіцянок і без рейсів, які вже в дорозі/вивантажені)
    const activeWarehouseSvIds = new Set(
      svSubvoyages
        .filter(sv => sv.status !== 'В дорозі' && sv.status !== 'Вивантажений' && sv.status !== 'Прибув на склад отримання' && sv.status !== 'Завершений' && sv.status !== 'Вантаж видано отримувачам')
        .map(sv => sv.id)
    );

    const assignedOnWarehouse = svShipments.filter(s =>
      s.subvoyageId &&
      (activeWarehouseSvIds.size === 0 || activeWarehouseSvIds.has(s.subvoyageId)) &&
      s.status !== 'В дорозі' &&
      s.status !== 'Вивантажений' &&
      s.status !== 'Прибув на склад отримання'
    );

    allocatedVolume = assignedOnWarehouse
      .filter(s => s.readinessCategory !== 'planned')
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);

    const assignedPlannedVolume = assignedOnWarehouse
      .filter(s => s.readinessCategory === 'planned')
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);

    // Для нерозподілених позицій ділимо за категорією готовності (readinessCategory)
    const unassigned = svShipments.filter(s => !s.subvoyageId);
    readyVolume = unassigned
      .filter(s => (s.readinessCategory || 'ready') === 'ready' && !s.isUnlinkedToPromise)
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);
    notReadyVolume = unassigned
      .filter(s => s.readinessCategory === 'not_ready' && !s.isUnlinkedToPromise)
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);
    unmarkedVolume = unassigned
      .filter(s => s.readinessCategory === 'unmarked')
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);

    const unlinkedFromPlanner = unassigned
      .filter(s => s.isUnlinkedToPromise || s.readinessCategory === 'unlinked_on_warehouse')
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);
    unlinkedOnWarehouseVolume = unlinkedFromPlanner > 0 ? unlinkedFromPlanner : unlinkedFromCargoes;

    plannedPromisesVolume = unassigned
      .filter(s => s.readinessCategory === 'planned')
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0) + assignedPlannedVolume;
  } else {
    allocatedVolume = cargoes
      .filter(c => c.subvoyage && c.statusCode !== 'in_transit' && c.statusCode !== 'issued' && c.statusCode !== 'returned_to_customer')
      .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

    readyVolume = cargoes
      .filter(c => !c.subvoyage && (c.dfPromise || c.dfShipment) && (c.statusCode === 'ready_for_loading' || c.statusCode === 'storaging_in_warehouse'))
      .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

    notReadyVolume = cargoes
      .filter(c => !c.subvoyage && (c.dfPromise || c.dfShipment) && (c.statusCode === 'waiting_for_other_parts' || c.statusCode === 'awaiting_readiness' || c.statusCode === 'at_origin_warehouse' || c.statusCode === 'damaged_delayed'))
      .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

    unlinkedOnWarehouseVolume = unlinkedFromCargoes;

    plannedPromisesVolume = cargoes
      .filter(c => !c.subvoyage && (c.statusCode === 'promise' || c.statusCode === 'in_transit'))
      .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

    unmarkedVolume = cargoes
      .filter(c => !c.subvoyage && c.statusCode === 'received_unmarked')
      .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);
  }

  const inWorkVolume = readyVolume + notReadyVolume + unlinkedOnWarehouseVolume + unmarkedVolume;

  // Головне правило: Об'єм на складі ТОЧНО дорівнює сумі всіх фактичних категорій розподілу на складі (крім планових обіцянок)
  const totalVolume = Number((readyVolume + notReadyVolume + unlinkedOnWarehouseVolume + unmarkedVolume + allocatedVolume).toFixed(1));
  const isOwnWarehouse = warehouseInfoData.type === 'Difreight' || warehouseInfoData.type === 'Власний';
  const warehouseLimit = isOwnWarehouse && Number(warehouseInfoData.volumeLimit) > 0 ? Number(warehouseInfoData.volumeLimit) : null;

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

  const expectedSevenDaysLater = new Date(realTodayStr + 'T00:00:00');
  expectedSevenDaysLater.setDate(expectedSevenDaysLater.getDate() + 7);
  const expectedSevenDaysStr = expectedSevenDaysLater.toISOString().split('T')[0];

  // 4. Отримано сьогодні (об'єм м³ та кількість підрейсів)
  const receivedTodayCargoes = cargoes.filter(c =>
    (c.receiveDate && c.receiveDate.startsWith(todayStr)) ||
    (c.arrivalDate && c.arrivalDate.startsWith(todayStr))
  );
  let receivedTodayVolume = receivedTodayCargoes.reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);
  const receivedTodaySvSet = new Set(receivedTodayCargoes.map(c => c.subvoyage).filter(Boolean));
  let receivedTodaySvCount = receivedTodaySvSet.size || (receivedTodayCargoes.length > 0 ? 1 : 0);

  if (receivedTodayVolume === 0 && svShipments) {
    const arrivedSvIds = new Set(svSubvoyages.filter(s => s.status === 'Вивантажений' || s.status === 'Прибув на склад отримання').map(s => s.id));
    const arrivedShipments = svShipments.filter(s => (s.subvoyageId && arrivedSvIds.has(s.subvoyageId)) || s.acceptedToday);
    receivedTodayVolume = arrivedShipments.reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);
    receivedTodaySvCount = arrivedSvIds.size || (arrivedShipments.length > 0 ? 1 : 0);
  }

  // 5. Планова відправка (те, що планується виїхати зі складу, щоб бачити майбутнє вивільнення місця)
  const plannedDepartureSubvoyages = svSubvoyages.filter(s => s.status === 'Формування' || s.status === 'Завантажений');
  const plannedDepartureSvIds = new Set(plannedDepartureSubvoyages.map(s => s.id));
  let shippedTodayVolume = allocatedVolume;
  let shippedTodaySvCount = plannedDepartureSvIds.size;
  const shippedTodaySvSet = new Set(plannedDepartureSvIds);

  if (shippedTodayVolume === 0 && cargoes.length > 0) {
    const plannedCargoes = cargoes.filter(c => c.subvoyage && c.statusCode !== 'in_transit' && c.statusCode !== 'issued');
    shippedTodayVolume = plannedCargoes.reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);
    plannedCargoes.forEach(c => { if (c.subvoyage) shippedTodaySvSet.add(c.subvoyage); });
    shippedTodaySvCount = shippedTodaySvSet.size;
  }

  // 6. Очікуємо (7 днів) — об'єм м³ та кількість підрейсів в дорозі за плановою датою прибуття (незалежно від фактичної)
  const expectedArrivalCargoes = cargoes.filter(c => {
    const arrDate = (c.expectedArrivalDate || c.arrivalDate || '').slice(0, 10);
    return (arrDate && arrDate <= expectedSevenDaysStr && c.statusCode === 'in_transit') || c.statusCode === 'in_transit';
  });
  let expectedArrival3DaysVolume = expectedArrivalCargoes.reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);
  const inTransitWithin7Days = svSubvoyages.filter(s => {
    if (s.status !== 'В дорозі') return false;
    const planArr = (s.plannedArrival || '').slice(0, 10);
    return !planArr || planArr <= expectedSevenDaysStr;
  });
  const expectedArrivalSvSet = new Set([
    ...expectedArrivalCargoes.map(c => c.subvoyage).filter(Boolean),
    ...inTransitWithin7Days.map(s => s.id)
  ]);
  let expectedArrival3DaysSvCount = expectedArrivalSvSet.size;

  if (svShipments) {
    const inTransitSvIds = new Set(inTransitWithin7Days.map(s => s.id));
    const inTransitVol = svShipments
      .filter(s => s.subvoyageId && inTransitSvIds.has(s.subvoyageId))
      .reduce((sum, s) => sum + (parseFloat(s.totalVolume ?? s.volume) || 0), 0);
    expectedArrival3DaysVolume = inTransitVol + plannedPromisesVolume;
  }

  // 7. План виїзду (7 днів) — об'єм м³ та кількість підрейсів на формуванні/завантаженні
  let expectedShipment3DaysVolume = allocatedVolume;
  const expectedShipmentSvSet = new Set(plannedDepartureSvIds);
  const expectedShipment3DaysSvCount = expectedShipmentSvSet.size;

  // Вільне місце = Загальний об'єм складу - Фактична завантаженість (без урахування «Очікується», тільки для власного складу)
  const freeWarehouseVolume = warehouseLimit !== null
    ? Math.max(0, Number((warehouseLimit - totalVolume).toFixed(1)))
    : null;

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
  const summaryExpectedElem = document.getElementById('stat-summary-expected-volume');
  const summaryFreeElem = document.getElementById('stat-summary-free-volume');
  const summaryFreeWrap = document.getElementById('stat-summary-free-volume-wrap');
  const allocatedVolumeElem = document.getElementById('stat-allocated-volume');
  const readyVolumeElem = document.getElementById('stat-ready-volume');
  const notReadyVolumeElem = document.getElementById('stat-not-ready-volume');
  const unlinkedOnWarehouseElem = document.getElementById('stat-unlinked-on-warehouse-volume');
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
    totalVolumeElem.innerHTML = warehouseLimit !== null
      ? `${totalVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">/ ${warehouseLimit.toFixed(1)} м³</span>`
      : `${totalVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">м³</span>`;
  }
  if (summaryExpectedElem) {
    summaryExpectedElem.innerHTML = `${expectedArrival3DaysVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">м³</span>`;
  }
  if (summaryFreeWrap) {
    summaryFreeWrap.classList.toggle('hidden', freeWarehouseVolume === null);
  }
  if (summaryFreeElem && freeWarehouseVolume !== null) {
    summaryFreeElem.innerHTML = `${freeWarehouseVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">м³</span>`;
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
  if (unlinkedOnWarehouseElem) {
    unlinkedOnWarehouseElem.innerHTML = `${unlinkedOnWarehouseVolume.toFixed(1)} <span class="text-[11px] font-normal text-slate-500">м³</span>`;
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

    return `
      <div class="relative group/macro inline-flex">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-help ${meta.badgeClass} transition shadow-2xs hover:shadow-xs">
          <i class="fa-solid ${meta.icon} text-[11px] opacity-80"></i>
          <span>${catName}</span>
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

  // 2. Повна Адреса (у єдиному структурованому рядку: індекс, країна, область/регіон, місто, вулиця)
  const addressElem = document.getElementById('wh-display-address');
  const modalAddressElem = document.getElementById('wh-modal-display-address');
  const formattedAddressLine = formatStructuredAddressLine(data.address);
  if (data.address) data.address.fullAddress = formattedAddressLine;
  if (addressElem) addressElem.innerText = formattedAddressLine;
  if (modalAddressElem) modalAddressElem.innerText = formattedAddressLine;

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

  // 7. Контактні особи (структура як при створенні складу: телефони з WhatsApp/Viber + окремий блок соцмереж без телефону)
  const PHONE_MESSENGER_TYPES = new Set(['WhatsApp', 'Viber']);

  function normalizeContactChannels(c = {}) {
    const phones = [];
    const standalone = Array.isArray(c.standaloneSocials)
      ? c.standaloneSocials.filter(s => s && s.value).map(s => ({ type: s.type || 'Telegram', value: s.value }))
      : [];

    const pushStandaloneUnique = (type, value) => {
      if (!value) return;
      if (!standalone.some(s => (s.type || '').toLowerCase() === (type || '').toLowerCase() && s.value === value)) {
        standalone.push({ type, value });
      }
    };

    if (c.telegram) pushStandaloneUnique('Telegram', c.telegram);

    if (Array.isArray(c.phones) && c.phones.length > 0) {
      c.phones.forEach(p => {
        const rawSocials = Array.isArray(p.socials) ? p.socials : [];
        const phoneMessengers = [];
        rawSocials.forEach(s => {
          if (!s || !s.type) return;
          if (PHONE_MESSENGER_TYPES.has(s.type)) {
            if (!phoneMessengers.includes(s.type)) phoneMessengers.push(s.type);
          } else if (s.value) {
            pushStandaloneUnique(s.type, s.value);
          }
        });
        if (p.number || phoneMessengers.length > 0) {
          phones.push({ number: p.number || '', messengers: phoneMessengers });
        }
      });
    } else if (c.phone || c.socials) {
      const phoneMessengers = [];
      if (c.socials && typeof c.socials === 'object' && !Array.isArray(c.socials)) {
        if (c.socials.whatsapp) phoneMessengers.push('WhatsApp');
        if (c.socials.viber) phoneMessengers.push('Viber');
        if (c.socials.telegram) pushStandaloneUnique('Telegram', c.socials.telegram);
        if (c.socials.wechat) pushStandaloneUnique('WeChat', c.socials.wechat);
        if (c.socials.signal) pushStandaloneUnique('Signal', c.socials.signal);
        if (c.socials.linkedin) pushStandaloneUnique('LinkedIn', c.socials.linkedin);
      } else if (Array.isArray(c.socials)) {
        c.socials.forEach(s => {
          if (PHONE_MESSENGER_TYPES.has(s.type)) {
            if (!phoneMessengers.includes(s.type)) phoneMessengers.push(s.type);
          } else if (s.value) {
            pushStandaloneUnique(s.type, s.value);
          }
        });
      }
      if (c.phone || phoneMessengers.length > 0) {
        phones.push({ number: c.phone || '', messengers: phoneMessengers });
      }
    }

    return { phones, standalone };
  }

  function renderStandaloneSocialBadge(s) {
    const t = (s.type || '').toLowerCase();
    let icon = 'fa-solid fa-at';
    let cls = 'bg-slate-100 text-slate-700 border-slate-200';
    if (t === 'telegram') {
      icon = 'fa-brands fa-telegram text-sky-600';
      cls = 'bg-sky-50 text-sky-800 border-sky-200';
    } else if (t === 'wechat') {
      icon = 'fa-brands fa-weixin text-emerald-600';
      cls = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    } else if (t === 'signal') {
      icon = 'fa-solid fa-comment-dots text-blue-600';
      cls = 'bg-blue-50 text-blue-800 border-blue-200';
    } else if (t === 'linkedin') {
      icon = 'fa-brands fa-linkedin text-indigo-600';
      cls = 'bg-indigo-50 text-indigo-800 border-indigo-200';
    }
    const safeVal = String(s.value || '').replace(/'/g, "\\'");
    const safeType = String(s.type || '').replace(/'/g, "\\'");
    return `
      <button type="button" onclick="DashboardModule.copyTextWithToast('${safeVal}', '${safeType} скопійовано!')"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${cls} hover:brightness-95 transition cursor-pointer"
        title="${s.type}: ${s.value} (натисніть, щоб скопіювати)">
        <i class="${icon} text-[10px]"></i>
        <span>${s.type}:</span>
        <span class="font-mono">${s.value}</span>
      </button>
    `;
  }

  function renderPhoneMessengerTag(type) {
    if (type === 'WhatsApp') {
      return `<span class="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><i class="fa-brands fa-whatsapp text-emerald-600"></i> WhatsApp</span>`;
    }
    if (type === 'Viber') {
      return `<span class="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200"><i class="fa-brands fa-viber text-purple-600"></i> Viber</span>`;
    }
    return '';
  }

  const contactsElem = document.getElementById('wh-display-contacts');
  if (contactsElem) {
    contactsElem.innerHTML = data.contacts.map((c, idx) => {
      const { phones, standalone } = normalizeContactChannels(c);
      const isPrimary = c.isPrimary || (idx === 0 && !data.contacts.some(item => item.isPrimary));

      const phonesHtml = phones.length > 0
        ? phones.map(p => `
            <div class="flex flex-wrap items-center justify-between gap-1.5 py-1 border-t border-slate-200/60 first:border-0 first:pt-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <i class="fa-solid fa-phone text-slate-400 text-[10px]"></i>
                <a href="tel:${p.number}" class="hover:underline text-slate-800 font-semibold">${p.number || '-'}</a>
                ${p.messengers.map(renderPhoneMessengerTag).join('')}
              </div>
            </div>
          `).join('')
        : '';

      const standaloneHtml = standalone.length > 0
        ? `<div class="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-200/70">${standalone.map(renderStandaloneSocialBadge).join('')}</div>`
        : '';

      return `
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900 text-xs">${c.fullName || '—'}</span>
              ${isPrimary ? `<span class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-300 font-bold inline-flex items-center gap-1 shadow-2xs"><i class="fa-solid fa-star text-amber-500 text-[9px]"></i> Головний менеджер</span>` : ''}
            </div>
            <span class="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200 font-medium">${c.position || c.role || 'Контактна особа'}</span>
          </div>
          <div class="text-[11px] text-slate-600 space-y-1 font-mono">
            ${c.email ? `<div><i class="fa-regular fa-envelope text-slate-400 mr-1.5"></i><a href="mailto:${c.email}" class="hover:underline">${c.email}</a></div>` : ''}
            ${phonesHtml}
          </div>
          ${standaloneHtml}
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

  // Блок 3.1: Основна контактна особа у спойлері «Довідка та правила складу» (у структурі створення складу: Посада, Email, Телефони з WhatsApp/Viber, Месенджери без телефону, Коментар)
  const primaryContact = Array.isArray(data.contacts) && data.contacts.length > 0
    ? (data.contacts.find(c => c.isPrimary) || data.contacts[0])
    : null;
  const spoilerPrimaryContactElem = document.getElementById('wh-spoiler-primary-contact');
  if (spoilerPrimaryContactElem) {
    if (primaryContact) {
      const { phones, standalone } = normalizeContactChannels(primaryContact);
      const phonesRowsHtml = phones.map(p => {
        const safeNum = String(p.number || '').replace(/'/g, "\\'");
        return `
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span><i class="fa-solid fa-phone text-amber-600 mr-1 text-[10px]"></i>${p.number}</span>
              ${p.messengers.map(renderPhoneMessengerTag).join('')}
            </div>
            <button type="button" onclick="DashboardModule.copyTextWithToast('${safeNum}', 'Телефон скопійовано!')"
              class="text-[10px] text-slate-500 hover:text-amber-700 px-1.5 py-0.2 bg-slate-100 hover:bg-amber-50 rounded border border-slate-200 cursor-pointer shrink-0" title="Скопіювати телефон">
              <i class="fa-regular fa-copy"></i>
            </button>
          </div>
        `;
      }).join('');

      spoilerPrimaryContactElem.innerHTML = `
        <div class="bg-white border border-amber-200/80 rounded-lg p-3 space-y-2 shadow-2xs">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-bold text-slate-900 text-xs">${primaryContact.fullName || '—'}</span>
              <span class="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 font-bold inline-flex items-center gap-1">
                <i class="fa-solid fa-star text-amber-500 text-[8px]"></i> Головний менеджер
              </span>
            </div>
            <span class="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200 font-semibold">${primaryContact.position || primaryContact.role || 'Менеджер складу'}</span>
          </div>

          <div class="space-y-1.5 font-mono text-[11px] text-slate-700 pt-1.5 border-t border-slate-100">
            ${primaryContact.email ? `
              <div class="flex items-center justify-between gap-2">
                <span class="truncate"><i class="fa-regular fa-envelope text-slate-400 mr-1.5 text-[10px]"></i>${primaryContact.email}</span>
                <button type="button" onclick="DashboardModule.copyTextWithToast('${primaryContact.email.replace(/'/g, "\\'")}', 'Email скопійовано!')"
                  class="text-[10px] text-slate-500 hover:text-amber-700 px-1.5 py-0.2 bg-slate-100 hover:bg-amber-50 rounded border border-slate-200 cursor-pointer shrink-0" title="Скопіювати Email">
                  <i class="fa-regular fa-copy"></i>
                </button>
              </div>
            ` : ''}
            ${phonesRowsHtml}
          </div>

          ${standalone.length > 0 ? `
            <div class="pt-1.5 border-t border-slate-100 space-y-1">
              <span class="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Месенджери та соцмережі без телефону</span>
              <div class="flex flex-wrap gap-1.5">
                ${standalone.map(renderStandaloneSocialBadge).join('')}
              </div>
            </div>
          ` : ''}

          ${(primaryContact.comment && primaryContact.comment.trim()) ? `
            <div class="pt-1.5 border-t border-slate-100 text-[11px] text-slate-600 italic">
              <i class="fa-regular fa-comment-dots text-amber-600 mr-1"></i>${primaryContact.comment.trim()}
            </div>
          ` : ''}
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

  // 9. Інструкція для клієнта (текст + згорнутий прев'ю на 3 рядки з кнопкою «Ще / Згорнути»)
  const instructionText = data.clientInstruction || data.shippingInstructions || '';
  const instructionElem = document.getElementById('wh-display-instruction');
  if (instructionElem) instructionElem.value = instructionText;
  const instructionPreviewElem = document.getElementById('wh-display-instruction-preview');
  if (instructionPreviewElem) {
    instructionPreviewElem.innerText = instructionText || 'Інструкція відправки не заповнена.';
    instructionPreviewElem.classList.add('line-clamp-3');
  }
  const instrToggleBtn = document.getElementById('btn-toggle-instruction-preview');
  const instrToggleLabel = document.getElementById('btn-instruction-preview-label');
  const instrToggleIcon = document.getElementById('btn-instruction-preview-icon');
  if (instrToggleLabel) instrToggleLabel.textContent = 'Ще';
  if (instrToggleIcon) instrToggleIcon.classList.remove('rotate-180');
  if (instrToggleBtn) instrToggleBtn.classList.toggle('hidden', !instructionText);

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
 * Розгортання / згортання тексту інструкції у вікні «Детальна інформація та правила складу»
 */
function toggleInstructionPreview() {
  const previewElem = document.getElementById('wh-display-instruction-preview');
  const labelElem = document.getElementById('btn-instruction-preview-label');
  const iconElem = document.getElementById('btn-instruction-preview-icon');
  if (!previewElem) return;

  const isCollapsed = previewElem.classList.contains('line-clamp-3');
  if (isCollapsed) {
    previewElem.classList.remove('line-clamp-3');
    if (labelElem) labelElem.textContent = 'Згорнути';
    if (iconElem) iconElem.classList.add('rotate-180');
  } else {
    previewElem.classList.add('line-clamp-3');
    if (labelElem) labelElem.textContent = 'Ще';
    if (iconElem) iconElem.classList.remove('rotate-180');
  }
}

/**
 * Швидке копіювання адреси складу в один рядок у чіткому порядку полів (Індекс, Країна, Область/Регіон, Місто, Вулиця, Офіс/Корпус)
 */
function copyWarehouseAddress() {
  const addr = formatStructuredAddressLine(warehouseInfoData.address) || document.getElementById('wh-display-address')?.innerText || '';
  copyTextWithToast(addr, 'Адресу складу скопійовано!');
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
  const phoneLines = [];
  const standaloneLines = [];
  const phoneTypes = new Set(['WhatsApp', 'Viber']);

  if (Array.isArray(primary.phones) && primary.phones.length > 0) {
    primary.phones.forEach(p => {
      if (!p.number) return;
      const ms = (Array.isArray(p.socials) ? p.socials : []).filter(s => phoneTypes.has(s.type)).map(s => s.type);
      phoneLines.push(ms.length ? `${p.number} (${ms.join(', ')})` : p.number);
      (Array.isArray(p.socials) ? p.socials : []).filter(s => !phoneTypes.has(s.type) && s.value).forEach(s => {
        standaloneLines.push(`${s.type}: ${s.value}`);
      });
    });
  } else if (primary.phone) {
    const ms = [];
    if (primary.socials?.whatsapp) ms.push('WhatsApp');
    if (primary.socials?.viber) ms.push('Viber');
    phoneLines.push(ms.length ? `${primary.phone} (${ms.join(', ')})` : primary.phone);
    if (primary.socials?.wechat) standaloneLines.push(`WeChat: ${primary.socials.wechat}`);
    if (primary.socials?.telegram) standaloneLines.push(`Telegram: ${primary.socials.telegram}`);
  }
  if (Array.isArray(primary.standaloneSocials)) {
    primary.standaloneSocials.forEach(s => {
      if (s && s.value) standaloneLines.push(`${s.type}: ${s.value}`);
    });
  }

  const summary = [
    `Головний менеджер складу (${warehouseInfoData.name}): ${primary.fullName || '—'}`,
    primary.position || primary.role ? `Посада: ${primary.position || primary.role}` : '',
    primary.email ? `Email: ${primary.email}` : '',
    phoneLines.length ? `Телефон: ${phoneLines.join('; ')}` : '',
    standaloneLines.length ? `Месенджери та соцмережі: ${Array.from(new Set(standaloneLines)).join(', ')}` : '',
    primary.comment ? `Коментар: ${primary.comment}` : ''
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
    template: 'Автоперевезення TIR',
    customStatus: 'Розмитнений',
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
    template: 'Автоперевезення TIR',
    customStatus: 'Прямує на склад',
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

function isWithin14DaysPlannedArrival(plannedDateStr) {
  if (!plannedDateStr) return true;
  const planDay = String(plannedDateStr).slice(0, 10);
  const limit = new Date();
  limit.setDate(limit.getDate() + 14);
  const limitStr = limit.toISOString().split('T')[0];
  return planDay <= limitStr;
}

function getActiveIncomingVoyages() {
  // Показуємо усі підрейси на складі зі статусом «В дорозі» за 14 днів до планового прибуття (рахується від плану, незалежно від фактичної дати)
  const svList = Array.isArray(window.svManagementSubvoyages) ? window.svManagementSubvoyages : [];
  const trList = Array.isArray(window.svManagementShipments) ? window.svManagementShipments : [];

  const plannerInTransit = svList
    .filter(s => s.status === 'В дорозі' && isWithin14DaysPlannedArrival(s.plannedArrival))
    .map(svObj => {
      const assigned = trList.filter(t => t.subvoyageId === svObj.id);
      const expPlaces = assigned.reduce((sum, t) => sum + (Number(t.places ?? t.totalPlaces) || 0), 0) || svObj.maxPlaces || 0;
      const expWeight = assigned.reduce((sum, t) => sum + (Number(t.weight ?? t.totalWeight) || 0), 0) || 0;
      const expVolume = assigned.reduce((sum, t) => sum + (Number(t.volume ?? t.totalVolume) || 0), 0) || 0;
      return {
        id: svObj.id,
        name: svObj.name,
        carrier: svObj.transportDetails?.shippingLine || svObj.transportDetails?.airline || svObj.transportDetails?.carrier || svObj.transport || 'Перевізник',
        vehicleNumber: svObj.transportDetails?.containerNumber || svObj.transportDetails?.awbNumber || svObj.transportDetails?.vehicleDetails || svObj.id,
        etaDate: svObj.plannedArrival || '—',
        status: svObj.status,
        expectedPlaces: expPlaces,
        expectedWeight: expWeight,
        expectedVolume: expVolume,
        shipments: assigned
      };
    });

  const plannerIds = new Set(plannerInTransit.map(v => v.id));
  const standaloneInTransit = incomingVoyagesData
    .filter(v => v.status === 'В дорозі' && !plannerIds.has(v.id) && isWithin14DaysPlannedArrival(v.etaDate));

  return [...plannerInTransit, ...standaloneInTransit]
    .sort((a, b) => String(a.etaDate || '9999-12-31').localeCompare(String(b.etaDate || '9999-12-31')));
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
  green: { label: 'Гарний', short: 'Гарний', dot: 'bg-emerald-500', on: 'bg-emerald-500 text-white border-emerald-600', off: 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50', desc: 'Вантаж у гарному стані, без видимих пошкоджень' },
  yellow: { label: 'Поганий', short: 'Поганий', dot: 'bg-amber-400', on: 'bg-amber-400 text-amber-950 border-amber-500', off: 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50', desc: 'Вантаж або пакування мають пошкодження (стан «Поганий»)' },
  red: { label: 'Критичний', short: 'Критичний', dot: 'bg-rose-500', on: 'bg-rose-500 text-white border-rose-600', off: 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50', desc: 'Критичні пошкодження вантажу або пакування' }
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
      customStatus: svObj.customStatus || '',
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
            cargoName: t.cargoes?.[0]?.titleUa || t.cargoes?.[0]?.name || `${t.cargoType || 'Карго'} (${t.packagingType || 'Палети'})`,
            acceptance: t.acceptance
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
    const prevAcc = sh.acceptance || {};
    acceptShipmentState[sh.id] = {
      actualPlaces: prevAcc.receivedPlaces !== undefined ? Number(prevAcc.receivedPlaces) : Number(sh.places || 0),
      actualVolume: prevAcc.actualVolume !== undefined ? Number(prevAcc.actualVolume) : Number(Number(sh.volume || 0).toFixed(2)),
      actualWeight: prevAcc.actualWeight !== undefined ? Number(prevAcc.actualWeight) : Number(Number(sh.weight || 0).toFixed(1)),
      damage: prevAcc.damageLevel || null,
      damageComment: prevAcc.damageComment || '',
      damagePhotos: Array.isArray(prevAcc.damagePhotos) ? [...prevAcc.damagePhotos] : []
    };
  });

  // 1. Інформація про підрейс
  document.getElementById('accept-voyage-target-id').value = voyage.id;
  document.getElementById('accept-voyage-id-badge').innerText = voyage.id;
  document.getElementById('accept-voyage-route-info').innerText = voyage.name;
  document.getElementById('accept-voyage-meta-info').innerText = `${voyage.carrier} • Борт / Контейнер: ${voyage.vehicleNumber} • Планова дата прибуття (ETA): ${voyage.etaDate} • Перевезень: ${voyage.shipments.length}`;
  const customStBadge = document.getElementById('accept-voyage-custom-status-badge');
  if (customStBadge) {
    if (voyage.customStatus) {
      customStBadge.innerText = voyage.customStatus;
      customStBadge.classList.remove('hidden');
    } else {
      customStBadge.classList.add('hidden');
    }
  }
  const dateEl = document.getElementById('accept-voyage-receive-date');
  if (dateEl) dateEl.innerText = toLocalDateTimeText();

  // 2. Очікувані підсумкові параметри підрейсу (фактичні рахуються автоматично як сума по перевезеннях)
  const expPlacesSum = voyage.shipments.reduce((s, sh) => s + (Number(sh.places) || 0), 0);
  const expWeightSum = voyage.shipments.reduce((s, sh) => s + (Number(sh.weight) || 0), 0);
  const expVolumeSum = voyage.shipments.reduce((s, sh) => s + (Number(sh.volume) || 0), 0);
  voyage.expectedPlaces = expPlacesSum;
  voyage.expectedWeight = Number(expWeightSum.toFixed(1));
  voyage.expectedVolume = Number(expVolumeSum.toFixed(2));

  const expPlacesEl = document.getElementById('accept-voyage-expected-places');
  const expWeightEl = document.getElementById('accept-voyage-expected-weight');
  const expVolumeEl = document.getElementById('accept-voyage-expected-volume');
  if (expPlacesEl) expPlacesEl.innerText = voyage.expectedPlaces;
  if (expWeightEl) expWeightEl.innerText = Number(voyage.expectedWeight.toFixed(1));
  if (expVolumeEl) expVolumeEl.innerText = Number(voyage.expectedVolume).toFixed(2);

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

function getShipmentDiscrepancy(sh, st) {
  const expPlaces = Number(sh?.places) || 0;
  const expVolume = Number((Number(sh?.volume) || 0).toFixed(2));
  const expWeight = Number((Number(sh?.weight) || 0).toFixed(1));

  const actPlaces = st?.actualPlaces === '' || st?.actualPlaces === null || st?.actualPlaces === undefined ? NaN : Number(st.actualPlaces);
  const actVolume = st?.actualVolume === '' || st?.actualVolume === null || st?.actualVolume === undefined ? NaN : Number(st.actualVolume);
  const actWeight = st?.actualWeight === '' || st?.actualWeight === null || st?.actualWeight === undefined ? NaN : Number(st.actualWeight);

  const missingPlaces = isNaN(actPlaces) || actPlaces < 0;
  const missingVolume = isNaN(actVolume) || actVolume < 0;
  const missingWeight = isNaN(actWeight) || actWeight < 0;
  const hasMissing = missingPlaces || missingVolume || missingWeight;

  const placesDiff = missingPlaces ? null : actPlaces - expPlaces;
  const volumeDiff = missingVolume ? null : Number((actVolume - expVolume).toFixed(2));
  const weightDiff = missingWeight ? null : Number((actWeight - expWeight).toFixed(1));

  const hasPlacesDiff = placesDiff !== null && placesDiff !== 0;
  const hasVolumeDiff = volumeDiff !== null && Math.abs(volumeDiff) > 0.001;
  const hasWeightDiff = weightDiff !== null && Math.abs(weightDiff) > 0.05;
  const shortage = placesDiff !== null && placesDiff < 0;
  const shortagePlaces = shortage ? Math.abs(placesDiff) : 0;

  return {
    expPlaces, expVolume, expWeight,
    actPlaces, actVolume, actWeight,
    missingPlaces, missingVolume, missingWeight, hasMissing,
    placesDiff, volumeDiff, weightDiff,
    hasPlacesDiff, hasVolumeDiff, hasWeightDiff,
    shortage, shortagePlaces,
    hasAny: hasPlacesDiff || hasVolumeDiff || hasWeightDiff
  };
}

function getAcceptActualParams() {
  const v = currentAcceptVoyage;
  if (!v || !Array.isArray(v.shipments)) {
    return { places: 0, weight: 0, volume: 0, hasInvalid: false, missingPlacesCount: 0, missingVolumeCount: 0, missingWeightCount: 0, missingShipmentsCount: 0 };
  }
  let places = 0;
  let weight = 0;
  let volume = 0;
  let missingPlacesCount = 0;
  let missingVolumeCount = 0;
  let missingWeightCount = 0;
  let missingShipmentsCount = 0;

  v.shipments.forEach(sh => {
    const disc = getShipmentDiscrepancy(sh, acceptShipmentState[sh.id] || {});
    if (disc.missingPlaces) missingPlacesCount++;
    if (disc.missingVolume) missingVolumeCount++;
    if (disc.missingWeight) missingWeightCount++;
    if (disc.hasMissing) missingShipmentsCount++;

    if (!disc.missingPlaces) places += disc.actPlaces;
    if (!disc.missingVolume) volume += disc.actVolume;
    if (!disc.missingWeight) weight += disc.actWeight;
  });

  return {
    places,
    weight: Number(weight.toFixed(1)),
    volume: Number(volume.toFixed(2)),
    hasInvalid: missingShipmentsCount > 0,
    missingPlacesCount,
    missingVolumeCount,
    missingWeightCount,
    missingShipmentsCount
  };
}

function getAcceptMismatch() {
  const v = currentAcceptVoyage;
  if (!v) return { any: false, shipmentDiscrepancyCount: 0, missingShipmentsCount: 0 };
  const a = getAcceptActualParams();
  const expPlaces = Number(v.expectedPlaces) || 0;
  const expWeight = Number((Number(v.expectedWeight) || 0).toFixed(1));
  const expVolume = Number((Number(v.expectedVolume) || 0).toFixed(2));
  const placesDiff = a.places - expPlaces;
  const weightDiff = Number((a.weight - expWeight).toFixed(1));
  const volumeDiff = Number((a.volume - expVolume).toFixed(2));

  const shipmentDiscrepancies = v.shipments
    .map(sh => ({ sh, disc: getShipmentDiscrepancy(sh, acceptShipmentState[sh.id] || {}) }))
    .filter(x => x.disc.hasAny);

  return {
    placesDiff, weightDiff, volumeDiff,
    places: placesDiff !== 0,
    weight: Math.abs(weightDiff) > 0.05,
    volume: Math.abs(volumeDiff) > 0.001,
    shipmentDiscrepancyCount: shipmentDiscrepancies.length,
    missingShipmentsCount: a.missingShipmentsCount,
    get any() { return this.places || this.weight || this.volume || this.shipmentDiscrepancyCount > 0; }
  };
}

function formatShipmentDiscrepancyBadgesHtml(sh, disc) {
  const pills = [];
  if (disc.hasMissing) {
    const missingNames = [];
    if (disc.missingPlaces) missingNames.push('місця');
    if (disc.missingVolume) missingNames.push("об'єм");
    if (disc.missingWeight) missingNames.push('вагу');
    pills.push(`<span class="px-1.5 py-0.2 rounded border text-[9px] font-bold bg-rose-100 text-rose-800 border-rose-300 inline-flex items-center gap-1"><i class="fa-solid fa-circle-exclamation text-[8px]"></i>Вкажіть ${missingNames.join(', ')}</span>`);
  }
  if (disc.hasPlacesDiff) {
    const cls = disc.placesDiff < 0 ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-amber-100 text-amber-900 border-amber-300';
    const sign = disc.placesDiff > 0 ? '+' : '';
    const extra = disc.placesDiff < 0 ? ' (недостача)' : ' (надлишок)';
    pills.push(`<span class="px-1.5 py-0.2 rounded border text-[9px] font-bold ${cls}">Місця: ${sign}${disc.placesDiff} шт${extra}</span>`);
  }
  if (disc.hasVolumeDiff) {
    const cls = disc.volumeDiff < 0 ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-amber-100 text-amber-900 border-amber-300';
    const sign = disc.volumeDiff > 0 ? '+' : '';
    pills.push(`<span class="px-1.5 py-0.2 rounded border text-[9px] font-bold ${cls}">Об'єм: ${sign}${disc.volumeDiff.toFixed(2)} м³</span>`);
  }
  if (disc.hasWeightDiff) {
    const cls = disc.weightDiff < 0 ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-amber-100 text-amber-900 border-amber-300';
    const sign = disc.weightDiff > 0 ? '+' : '';
    pills.push(`<span class="px-1.5 py-0.2 rounded border text-[9px] font-bold ${cls}">Вага: ${sign}${disc.weightDiff} кг</span>`);
  }

  if (pills.length === 0) {
    return `<span class="text-[9px] font-semibold text-emerald-600 inline-flex items-center gap-0.5"><i class="fa-solid fa-check text-[8px]"></i> Збігається з планом</span>`;
  }

  return `<div class="flex flex-wrap items-center gap-1 mt-1">${pills.join('')}</div>`;
}

function getParamInputClass(diff, isMissing = false) {
  if (isMissing) {
    return 'bg-rose-50/80 border-rose-500 text-rose-900 focus:ring-rose-500';
  }
  if (diff === null || Math.abs(diff) < 0.001) {
    return 'bg-white border-slate-300 text-slate-900 focus:ring-indigo-500';
  }
  if (diff < 0) {
    return 'bg-rose-50/70 border-rose-400 text-rose-900 focus:ring-rose-400';
  }
  return 'bg-amber-50/70 border-amber-400 text-amber-900 focus:ring-amber-400';
}

function setAcceptShipmentParam(shipmentId, field, rawValue) {
  const st = acceptShipmentState[shipmentId];
  const sh = currentAcceptVoyage?.shipments?.find(s => s.id === shipmentId);
  if (!st || !sh) return;

  const trimmed = String(rawValue ?? '').trim();
  if (field === 'places') {
    st.actualPlaces = trimmed === '' ? '' : Math.max(0, parseInt(trimmed, 10));
  } else if (field === 'volume') {
    st.actualVolume = trimmed === '' ? '' : Math.max(0, parseFloat(trimmed));
  } else if (field === 'weight') {
    st.actualWeight = trimmed === '' ? '' : Math.max(0, parseFloat(trimmed));
  }

  const disc = getShipmentDiscrepancy(sh, st);
  const safeId = shipmentId.replace(/[^a-zA-Z0-9_-]/g, '_');

  const rowEl = document.getElementById(`accept-row-${safeId}`);
  if (rowEl) {
    rowEl.className = `${(disc.hasMissing || disc.shortage) ? 'bg-rose-50/60' : disc.hasAny ? 'bg-amber-50/50' : 'bg-white'} align-top transition-colors`;
  }
  const diffEl = document.getElementById(`accept-row-diff-${safeId}`);
  if (diffEl) {
    diffEl.innerHTML = formatShipmentDiscrepancyBadgesHtml(sh, disc);
  }

  const pInp = document.getElementById(`accept-inp-places-${safeId}`);
  const vInp = document.getElementById(`accept-inp-volume-${safeId}`);
  const wInp = document.getElementById(`accept-inp-weight-${safeId}`);
  const baseCls = 'w-16 border rounded px-1.5 py-0.5 font-mono font-bold text-[11px] focus:ring-2 focus:outline-none transition';
  if (pInp) pInp.className = `${baseCls} ${getParamInputClass(disc.placesDiff, disc.missingPlaces)}`;
  if (vInp) vInp.className = `${baseCls} ${getParamInputClass(disc.volumeDiff, disc.missingVolume)}`;
  if (wInp) wInp.className = `${baseCls} ${getParamInputClass(disc.weightDiff, disc.missingWeight)}`;

  updateAcceptParamsDiff();
}

function updateAcceptParamsDiff() {
  const a = getAcceptActualParams();
  const m = getAcceptMismatch();

  const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.innerText = txt; };
  setText('accept-voyage-actual-places-display', a.places);
  setText('accept-voyage-actual-volume-display', a.volume.toFixed(2));
  setText('accept-voyage-actual-weight-display', Number(a.weight.toFixed(1)));

  const fmt = (diff, unit, missingCount) => {
    if (missingCount > 0) {
      return `<span class="text-rose-600"><i class="fa-solid fa-circle-exclamation mr-0.5"></i>Не заповнено (${missingCount})</span>`;
    }
    if (diff === null) return '';
    if (Math.abs(diff) < 0.001) return `<span class="text-emerald-600"><i class="fa-solid fa-check mr-0.5"></i>Збігається</span>`;
    const cls = diff < 0 ? 'text-rose-600' : 'text-amber-600';
    return `<span class="${cls}"><i class="fa-solid fa-not-equal mr-0.5"></i>${diff > 0 ? '+' : ''}${diff} ${unit}</span>`;
  };
  const setHtml = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  setHtml('accept-voyage-diff-places', fmt(m.placesDiff, 'шт', a.missingPlacesCount));
  setHtml('accept-voyage-diff-weight', fmt(m.weightDiff, 'кг', a.missingWeightCount));
  setHtml('accept-voyage-diff-volume', fmt(m.volumeDiff, 'м³', a.missingVolumeCount));

  const banner = document.getElementById('accept-voyage-mismatch-banner');
  const bannerText = document.getElementById('accept-voyage-mismatch-text');
  const showBanner = a.hasInvalid;
  if (banner) {
    banner.classList.toggle('hidden', !showBanner);
    banner.className = `${showBanner ? '' : 'hidden '}p-3 rounded-xl border text-[11px] flex items-start gap-2 bg-rose-50 border-rose-300 text-rose-900`;
  }
  if (bannerText && showBanner) {
    const shWord = a.missingShipmentsCount === 1 ? 'перевезенні' : 'перевезеннях';
    bannerText.innerText = `Не заповнено фактичні параметри у ${a.missingShipmentsCount} ${shWord}. Введіть кількість місць, об'єм та вагу для кожного перевезення (якщо позиція не надійшла — вкажіть 0).`;
  }

  // Керування кнопками підтвердження у футері
  const btnStandard = document.getElementById('btn-accept-voyage-standard');
  const btnAdjusted = document.getElementById('btn-accept-voyage-adjusted');
  const footerHint = document.getElementById('accept-voyage-footer-hint');
  if (btnStandard) {
    btnStandard.classList.toggle('hidden', m.any || a.hasInvalid);
  }
  if (btnAdjusted) {
    btnAdjusted.classList.toggle('ring-2', m.any && !a.hasInvalid);
    btnAdjusted.classList.toggle('ring-amber-300', m.any && !a.hasInvalid);
  }
  if (footerHint) {
    footerHint.innerText = a.hasInvalid
      ? 'Заповніть усі обов\'язкові фактичні параметри по кожному перевезенню.'
      : m.any
        ? 'Виявлено розбіжності по перевезеннях — підрейс буде прийнято зі статусом «Прийнято з коригуванням / уточненням».'
        : 'Підрейс перейде у «Вивантажений», перевезення — в «Отримано на складі». За потреби можна обрати «Прийняти з коригуванням / уточненням».';
  }

  renderAcceptShortageSummary();
}

function renderAcceptShipmentsList() {
  const tbody = document.getElementById('accept-voyage-shipments-checklist');
  if (!tbody || !currentAcceptVoyage) return;

  tbody.innerHTML = currentAcceptVoyage.shipments.map(sh => {
    const st = acceptShipmentState[sh.id] || {};
    const disc = getShipmentDiscrepancy(sh, st);
    const safeId = sh.id.replace(/[^a-zA-Z0-9_-]/g, '_');

    const damageBtns = Object.entries(ACCEPT_DAMAGE_LEVELS).map(([key, lvl]) => `
      <button type="button" onclick="DashboardModule.setAcceptDamage('${sh.id}', '${key}')" title="${lvl.label}: ${lvl.desc}"
        class="px-1.5 py-1 rounded-md border text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition ${st.damage === key ? lvl.on : lvl.off}">
        <span class="w-2 h-2 rounded-full ${st.damage === key ? 'bg-white/80' : lvl.dot}"></span>${lvl.short}
      </button>
    `).join('');

    const isDamaged = st.damage === 'yellow' || st.damage === 'red';
    const damagePhotos = Array.isArray(st.damagePhotos) ? st.damagePhotos : [];
    const safeComment = String(st.damageComment || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const detailBorderCls = st.damage === 'red' ? 'bg-rose-50/70 border-rose-200' : 'bg-amber-50/70 border-amber-200';
    const detailBadgeText = st.damage === 'red' ? 'Стан «Критичний»' : 'Стан «Поганий»';
    const detailBadgeCls = st.damage === 'red' ? 'text-rose-800' : 'text-amber-900';

    const damageExtraHtml = isDamaged ? `
      <div class="mt-2 p-2 rounded-lg border ${detailBorderCls} space-y-1.5 min-w-[230px]"
           ondragover="event.preventDefault(); this.classList.add('ring-2','ring-indigo-400')"
           ondragleave="this.classList.remove('ring-2','ring-indigo-400')"
           ondrop="event.preventDefault(); this.classList.remove('ring-2','ring-indigo-400'); DashboardModule.handleShipmentDamagePhotoFiles('${sh.id}', event.dataTransfer.files)">
        <div class="flex items-center justify-between gap-1.5 flex-wrap">
          <span class="text-[10px] font-bold ${detailBadgeCls} flex items-center gap-1">
            <i class="fa-solid fa-triangle-exclamation text-[9px]"></i>
            <span>${detailBadgeText}: фото та коментар <span class="font-normal text-slate-500">(необов'язково)</span></span>
          </span>
          <label class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold cursor-pointer transition shadow-2xs" title="Перетягніть фото сюди або оберіть кілька файлів (необов'язково)">
            <input type="file" multiple accept="image/*" class="hidden" onchange="DashboardModule.handleShipmentDamagePhotoUpload('${sh.id}', this)">
            <i class="fa-solid fa-camera text-[9px]"></i>
            <span>+ Фото (${damagePhotos.length})</span>
          </label>
        </div>
        <div class="text-[9px] text-amber-800 flex items-center justify-between gap-2 flex-wrap">
          <span><i class="fa-solid fa-bell mr-0.5"></i>Менеджер <strong>${sh.manager}</strong> отримає сповіщення</span>
        </div>
        ${damagePhotos.length > 0 ? `
          <div class="flex items-center gap-1.5 flex-wrap pt-0.5">
            ${damagePhotos.map((p, idx) => `
              <div class="relative group w-10 h-10 rounded-md overflow-hidden border border-slate-300 bg-white shrink-0" title="${p.name} (${p.size})">
                ${p.url
                  ? `<img src="${p.url}" alt="${p.name}" class="w-full h-full object-cover">`
                  : `<div class="w-full h-full flex items-center justify-center text-slate-400"><i class="fa-regular fa-image text-xs"></i></div>`}
                <button type="button" onclick="DashboardModule.removeShipmentDamagePhoto('${sh.id}', ${idx})"
                  class="absolute top-0 right-0 w-4 h-4 bg-slate-900/75 hover:bg-rose-600 text-white text-[10px] leading-none flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition" title="Видалити фото">&times;</button>
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div>
          <input type="text" value="${safeComment}"
            placeholder="Коментар щодо пошкоджень вантажу (необов'язково)..."
            oninput="DashboardModule.setAcceptDamageComment('${sh.id}', this.value)"
            class="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
        </div>
      </div>
    ` : '';

    const baseCls = 'w-16 border rounded px-1.5 py-0.5 font-mono font-bold text-[11px] focus:ring-2 focus:outline-none transition';

    return `
      <tr id="accept-row-${safeId}" class="${(disc.hasMissing || disc.shortage) ? 'bg-rose-50/60' : disc.hasAny ? 'bg-amber-50/50' : 'bg-white'} align-top transition-colors">
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
        <td class="p-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            <label class="inline-flex flex-col">
              <span class="text-[9px] text-slate-400 font-semibold">Місць (шт)</span>
              <input id="accept-inp-places-${safeId}" type="number" min="0" step="1" value="${st.actualPlaces ?? ''}"
                oninput="DashboardModule.setAcceptShipmentParam('${sh.id}', 'places', this.value)"
                class="${baseCls} ${getParamInputClass(disc.placesDiff, disc.missingPlaces)}">
            </label>
            <label class="inline-flex flex-col">
              <span class="text-[9px] text-slate-400 font-semibold">Об'єм (м³)</span>
              <input id="accept-inp-volume-${safeId}" type="number" min="0" step="0.01" value="${st.actualVolume ?? ''}"
                oninput="DashboardModule.setAcceptShipmentParam('${sh.id}', 'volume', this.value)"
                class="${baseCls} ${getParamInputClass(disc.volumeDiff, disc.missingVolume)}">
            </label>
            <label class="inline-flex flex-col">
              <span class="text-[9px] text-slate-400 font-semibold">Вага (кг)</span>
              <input id="accept-inp-weight-${safeId}" type="number" min="0" step="0.1" value="${st.actualWeight ?? ''}"
                oninput="DashboardModule.setAcceptShipmentParam('${sh.id}', 'weight', this.value)"
                class="${baseCls} ${getParamInputClass(disc.weightDiff, disc.missingWeight)}">
            </label>
          </div>
          <div id="accept-row-diff-${safeId}">${formatShipmentDiscrepancyBadgesHtml(sh, disc)}</div>
        </td>
        <td class="p-2">
          <div class="flex items-center gap-1 flex-wrap">${damageBtns}</div>
          ${damageExtraHtml}
        </td>
      </tr>
    `;
  }).join('');

  renderAcceptShortageSummary();
}

function renderAcceptShortageSummary() {
  const el = document.getElementById('accept-voyage-shortage-summary');
  if (!el || !currentAcceptVoyage) return;
  const rows = currentAcceptVoyage.shipments.map(sh => {
    const st = acceptShipmentState[sh.id] || {};
    return { sh, st, disc: getShipmentDiscrepancy(sh, st) };
  });
  const missingCount = rows.filter(r => r.disc.hasMissing).length;
  const discCount = rows.filter(r => r.disc.hasAny).length;
  const shortagePlaces = rows.reduce((sum, r) => sum + r.disc.shortagePlaces, 0);
  const counts = { green: 0, yellow: 0, red: 0 };
  rows.forEach(r => { if (r.st.damage) counts[r.st.damage]++; });
  const unset = rows.filter(r => !r.st.damage).length;

  el.innerHTML = `
    <span><i class="fa-solid fa-scale-unbalanced text-amber-500 mr-1"></i>Розбіжності: <strong class="${discCount ? 'text-amber-700' : 'text-emerald-700'}">${discCount}</strong>${shortagePlaces ? ` · <strong class="text-rose-700">нестача ${shortagePlaces} місць</strong>` : ''}</span>
    ${missingCount ? `<span class="text-rose-600 font-bold"><i class="fa-solid fa-circle-exclamation mr-0.5"></i>Не заповнено параметри: ${missingCount}</span>` : ''}
    <span class="ml-auto inline-flex items-center gap-2">
      <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>${counts.green}</span>
      <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-400"></span>${counts.yellow}</span>
      <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-500"></span>${counts.red}</span>
      ${unset ? `<span class="text-rose-600 font-bold">Не вказано стан: ${unset}</span>` : ''}
    </span>
  `;
}

// Збережено як no-op для зворотної сумісності
function toggleAcceptShortage() { }
function setAcceptShortagePlaces() { }

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

function setAcceptDamageComment(shipmentId, value) {
  const st = acceptShipmentState[shipmentId];
  if (!st) return;
  st.damageComment = value || '';
}

function handleShipmentDamagePhotoFiles(shipmentId, fileList) {
  const st = acceptShipmentState[shipmentId];
  if (!st) return;
  if (!Array.isArray(st.damagePhotos)) st.damagePhotos = [];
  const files = Array.from(fileList || []).filter(f => !f.type || f.type.startsWith('image/'));
  files.forEach(f => {
    const sizeKb = Math.max(1, Math.round((f.size || 0) / 1024));
    let url = '';
    try { url = URL.createObjectURL(f); } catch (e) { url = ''; }
    st.damagePhotos.push({
      name: f.name,
      size: sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`,
      url
    });
  });
  renderAcceptShipmentsList();
  if (files.length > 0 && typeof showToast === 'function') {
    showToast(`Додано ${files.length} фото до перевезення ${shipmentId}`);
  }
}

function handleShipmentDamagePhotoUpload(shipmentId, input) {
  handleShipmentDamagePhotoFiles(shipmentId, input?.files);
  if (input) input.value = '';
}

function removeShipmentDamagePhoto(shipmentId, idx) {
  const st = acceptShipmentState[shipmentId];
  if (!st || !Array.isArray(st.damagePhotos)) return;
  const [removed] = st.damagePhotos.splice(idx, 1);
  if (removed?.url) URL.revokeObjectURL(removed.url);
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
      ? 'text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold'
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

// --- Сповіщення відповідальному менеджеру про недостачу та/або пошкодження вантажу («Поганий» / «Критичний») ---
function notifyManagerAboutAcceptanceIssue({ manager, shipmentId, subvoyageId, subvoyageName, shortage, shortagePlaces, expectedPlaces, damageLevel, damageComment, damagePhotosCount, receiveDate, notes }) {
  const isDamaged = damageLevel === 'yellow' || damageLevel === 'red';
  const dmgLabel = damageLevel ? (ACCEPT_DAMAGE_LEVELS[damageLevel]?.label || damageLevel) : '';
  const type = shortage && isDamaged ? 'shortage_and_damage' : (shortage ? 'shortage' : 'damage');

  const titleParts = [];
  if (shortage) titleParts.push(`Недостача ${shortagePlaces || '?'} з ${expectedPlaces} місць`);
  if (isDamaged) titleParts.push(`Стан вантажу «${dmgLabel}»`);

  const msgParts = [
    `Підрейс ${subvoyageId}${subvoyageName ? ` (${subvoyageName})` : ''} отримано на складі ${receiveDate}.`
  ];
  if (shortage) {
    msgParts.push(`У перевезенні ${shipmentId} не вистачає ${shortagePlaces || 'невизначену кількість'} з ${expectedPlaces} місць.`);
  }
  if (isDamaged) {
    msgParts.push(`Зафіксовано стан вантажу «${dmgLabel}» у перевезенні ${shipmentId}.`);
  }
  msgParts.push('Попередьте клієнта та за потреби запустіть компенсацію.');
  if (damageComment) msgParts.push(`Коментар логіста: ${damageComment}.`);
  if (damagePhotosCount) msgParts.push(`Додано фото пошкоджень: ${damagePhotosCount} шт.`);
  if (notes) msgParts.push(`Загальна примітка: ${notes}`);

  const notification = {
    id: `NTF-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    recipient: manager,
    shipmentId,
    subvoyageId,
    title: `${titleParts.join(' • ')} у перевезенні ${shipmentId}`,
    message: msgParts.join(' '),
    createdAt: new Date().toISOString(),
    read: false
  };
  window.managerNotifications.unshift(notification);
  return notification;
}

function notifyManagerAboutShortage(params) {
  return notifyManagerAboutAcceptanceIssue({ ...params, shortage: true });
}

function submitAcceptVoyageReport(mode = 'standard') {
  const voyageId = document.getElementById('accept-voyage-target-id')?.value;
  const svList = Array.isArray(window.svManagementSubvoyages) ? window.svManagementSubvoyages : [];
  const svObj = svList.find(s => s.id === voyageId);
  const voyage = currentAcceptVoyage && currentAcceptVoyage.id === voyageId ? currentAcceptVoyage : incomingVoyagesData.find(v => v.id === voyageId);
  if (!svObj && !voyage) return;

  // Фактична дата/час отримання = поточний момент кліку підтвердження
  const receiveDate = toLocalDateTimeText(new Date());
  const dateEl = document.getElementById('accept-voyage-receive-date');
  if (dateEl) dateEl.innerText = receiveDate;

  const { places: actualPlaces, weight: actualWeight, volume: actualVolume, hasInvalid } = getAcceptActualParams();
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

  if (hasInvalid) {
    const missingDetails = [];
    let firstMissingInputId = null;
    voyage.shipments.forEach(sh => {
      const disc = getShipmentDiscrepancy(sh, acceptShipmentState[sh.id] || {});
      if (disc.hasMissing) {
        const safeId = sh.id.replace(/[^a-zA-Z0-9_-]/g, '_');
        const fields = [];
        if (disc.missingPlaces) {
          fields.push('місця');
          if (!firstMissingInputId) firstMissingInputId = `accept-inp-places-${safeId}`;
        }
        if (disc.missingVolume) {
          fields.push("об'єм");
          if (!firstMissingInputId) firstMissingInputId = `accept-inp-volume-${safeId}`;
        }
        if (disc.missingWeight) {
          fields.push('вага');
          if (!firstMissingInputId) firstMissingInputId = `accept-inp-weight-${safeId}`;
        }
        missingDetails.push(`${sh.id} (${fields.join(', ')})`);
      }
    });
    showError(`Заповніть обов'язкові фактичні параметри: ${missingDetails.join('; ')}.`);
    if (firstMissingInputId) document.getElementById(firstMissingInputId)?.focus();
    return;
  }

  const shipmentsReport = voyage.shipments.map(sh => {
    const st = acceptShipmentState[sh.id] || {};
    const disc = getShipmentDiscrepancy(sh, st);
    const isDamaged = st.damage === 'yellow' || st.damage === 'red';
    return {
      id: sh.id,
      rawId: sh.rawId || sh.id,
      manager: sh.manager,
      expectedPlaces: disc.expPlaces,
      expectedVolume: disc.expVolume,
      expectedWeight: disc.expWeight,
      actualPlaces: disc.actPlaces,
      actualVolume: disc.actVolume,
      actualWeight: disc.actWeight,
      placesDiff: disc.placesDiff || 0,
      volumeDiff: disc.volumeDiff || 0,
      weightDiff: disc.weightDiff || 0,
      hasDiscrepancy: disc.hasAny,
      shortage: disc.shortage,
      shortagePlaces: disc.shortagePlaces,
      damageLevel: st.damage || null,
      damageComment: isDamaged ? (st.damageComment || '').trim() : '',
      damagePhotos: isDamaged && Array.isArray(st.damagePhotos)
        ? st.damagePhotos.map(p => ({ name: p.name, size: p.size, url: p.url }))
        : []
    };
  });

  const mismatch = getAcceptMismatch();
  const noDamage = shipmentsReport.filter(s => !s.damageLevel);
  if (noDamage.length > 0) {
    showError(`Проставте стан вантажу («Гарний» / «Поганий» / «Критичний») для всіх перевезень (не вказано: ${noDamage.map(s => s.id).join(', ')}).`);
    return;
  }
  if (currentAcceptVoyagePhotos.length === 0) {
    showError('Додайте хоча б одне фото вивантаження.');
    return;
  }

  const effectiveMode = (mode === 'adjusted' || mismatch.any) ? 'adjusted' : 'standard';
  const acceptanceStatusLabel = effectiveMode === 'adjusted'
    ? 'Прийнято з коригуванням / уточненням'
    : 'Отримано на складі';

  // Сповіщення менеджерам при розбіжностях параметрів або пошкодженні вантажу («Поганий» / «Критичний»)
  const issueItems = shipmentsReport.filter(s => s.hasDiscrepancy || s.damageLevel === 'yellow' || s.damageLevel === 'red');
  const notifications = issueItems.map(s => notifyManagerAboutAcceptanceIssue({
    manager: s.manager,
    shipmentId: s.id,
    subvoyageId: voyage.id,
    subvoyageName: voyage.name,
    shortage: s.shortage,
    shortagePlaces: s.shortagePlaces,
    expectedPlaces: s.expectedPlaces,
    damageLevel: s.damageLevel,
    damageComment: s.damageComment,
    damagePhotosCount: Array.isArray(s.damagePhotos) ? s.damagePhotos.length : 0,
    receiveDate,
    notes
  }));

  const reportData = {
    receiveDate,
    acceptanceMode: effectiveMode,
    acceptanceStatusLabel,
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
    isAllGood: issueItems.length === 0 && effectiveMode === 'standard',
    selectedProblemShipments: issueItems.map(s => s.id)
  };

  // Підрейс із Дошки Підрейсів — обробник планувальника
  if (svObj && typeof window.acceptSubvoyageToWarehouse === 'function') {
    window.acceptSubvoyageToWarehouse(voyageId, reportData);
    closeAcceptVoyageModal();
    renderIncomingVoyages();
    return;
  }

  // Автономний вхідний рейс (incomingVoyagesData)
  voyage.status = 'Вивантажений';
  voyage.customStatus = effectiveMode === 'adjusted' ? 'Прийнято з коригуванням / уточненням' : 'Вивантажено на складі';
  voyage.acceptanceMode = effectiveMode;
  voyage.actualArrival = receiveDate;
  voyage.acceptedAt = receiveDate;
  voyage.acceptanceReport = reportData;

  if (Array.isArray(window.svManagementShipments)) {
    voyage.shipments.forEach((sh, index) => {
      const rep = shipmentsReport.find(r => r.id === sh.id) || {};
      const isDamaged = rep.damageLevel === 'yellow' || rep.damageLevel === 'red';
      const hasIssue = rep.shortage || isDamaged;
      const dmgLabel = ACCEPT_DAMAGE_LEVELS[rep.damageLevel]?.label || '';
      const issueTitleParts = [];
      if (rep.shortage) issueTitleParts.push(`Недостача ${rep.shortagePlaces} з ${sh.places} місць`);
      if (isDamaged) issueTitleParts.push(`Стан вантажу «${dmgLabel}»`);

      const issueTask = hasIssue ? {
        id: `TSK-ACC-${Date.now()}-${index}`,
        title: `${issueTitleParts.join(' • ')} при отриманні ${voyage.id} — попередити клієнта`,
        assignee: sh.manager,
        dueDate: receiveDate.split(' ')[0],
        status: 'open',
        type: rep.shortage ? 'shortage' : 'damage'
      } : null;

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
          status: 'Отримано на складі',
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
            damageComment: rep.damageComment || '',
            damagePhotos: Array.isArray(rep.damagePhotos) ? rep.damagePhotos : [],
            shortage: !!rep.shortage,
            shortagePlaces: rep.shortagePlaces || 0,
            expectedPlaces: sh.places,
            receivedPlaces: sh.places - (rep.shortagePlaces || 0),
            managerNotified: hasIssue
          },
          tasks: issueTask ? [issueTask] : [],
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
      } else {
        const existing = window.svManagementShipments.find(e => e.id === sh.id);
        if (existing) {
          existing.status = 'Отримано на складі';
          existing.readinessCategory = 'ready';
          existing.acceptedToday = true;
          existing.acceptance = {
            subvoyageId: voyage.id,
            receiveDate,
            damageLevel: rep.damageLevel,
            damageComment: rep.damageComment || '',
            damagePhotos: Array.isArray(rep.damagePhotos) ? rep.damagePhotos : [],
            shortage: !!rep.shortage,
            shortagePlaces: rep.shortagePlaces || 0,
            expectedPlaces: sh.places,
            receivedPlaces: sh.places - (rep.shortagePlaces || 0),
            managerNotified: hasIssue
          };
          if (issueTask) {
            if (!Array.isArray(existing.tasks)) existing.tasks = [];
            existing.tasks.unshift(issueTask);
          }
        }
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
    const ntf = notifications.length ? ` Надіслано сповіщень менеджерам: ${notifications.length}.` : '';
    showToast(`Рейс ${voyage.id} переведено у стан «Вивантажений» (${voyage.shipments.length} перевезень — «Отримано на складі»).${ntf}`);
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
    showToast('Файл інструкції для клієнта завантажено');
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
        if (currentWh.type) warehouseInfoData.type = currentWh.type;
        if (currentWh.volume !== undefined) {
          warehouseInfoData.volumeLimit = currentWh.volume && Number(currentWh.volume) > 0 ? Number(currentWh.volume) : null;
        }
        if (currentWh.addressFields || currentWh.country || currentWh.city || currentWh.address) {
          const af = currentWh.addressFields || {};
          warehouseInfoData.address = {
            ...warehouseInfoData.address,
            zipCode: af.postalCode || currentWh.postalCode || warehouseInfoData.address.zipCode || '',
            country: af.countryName || currentWh.country || warehouseInfoData.address.country || '',
            province: af.region || currentWh.region || warehouseInfoData.address.province || '',
            city: af.city || currentWh.city || warehouseInfoData.address.city || '',
            district: af.city ? '' : warehouseInfoData.address.district,
            street: af.street || currentWh.street || warehouseInfoData.address.street || currentWh.address || '',
            addressLine2: af.addressLine2 || warehouseInfoData.address.addressLine2 || ''
          };
          warehouseInfoData.address.fullAddress = formatStructuredAddressLine(warehouseInfoData.address);
        }
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

window.openAcceptVoyageModal = openAcceptVoyageModal;
window.closeAcceptVoyageModal = closeAcceptVoyageModal;

// Глобальний експорт
window.DashboardModule = {
  data: warehouseInfoData,
  updateStats: updateDashboardStats,
  renderWarehouseInfo: renderWarehouseInfo,
  renderWarehouseServices: renderWarehouseServices,
  initWarehouseDataSync: initWarehouseDataSync,
  copyInstruction: copyClientInstruction,
  downloadInstruction: downloadClientInstruction,
  toggleInstructionPreview: toggleInstructionPreview,
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
  setAcceptShipmentParam: setAcceptShipmentParam,
  toggleAcceptShortage: toggleAcceptShortage,
  setAcceptShortagePlaces: setAcceptShortagePlaces,
  setAcceptDamage: setAcceptDamage,
  setAllAcceptDamage: setAllAcceptDamage,
  setAcceptDamageComment: setAcceptDamageComment,
  handleShipmentDamagePhotoFiles: handleShipmentDamagePhotoFiles,
  handleShipmentDamagePhotoUpload: handleShipmentDamagePhotoUpload,
  removeShipmentDamagePhoto: removeShipmentDamagePhoto,
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
