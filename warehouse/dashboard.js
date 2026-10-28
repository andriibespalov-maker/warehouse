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

  // 4. Послуги
  services: [
    "Зберігання",
    "Упаковка",
    "Маркування",
    "Палетування",
    "Перезважування та вимірювання",
    "Крос-докінг"
  ],

  // 5. Умови роботи / Правила прийому вантажу
  rules: "1. Вантаж приймається суворо за наявності маркування та супровідного інвойсу/ТТН.\n2. Приймання важковагових місць (> 2.0 т) вимагає попереднього узгодження за 24 години.\n3. Обов'язкова вхідна фотофіксація стану упаковки та перевірка на наявність пошкоджень.",

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

  // 7. Контактні особи
  contacts: [
    {
      fullName: "L. Wei",
      role: "Senior Warehouse Operator",
      email: "wei.fsh@difreight.com",
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
      phone: "+86 757 8820 1105",
      socials: {
        wechat: "chen_xiu_wh",
        whatsapp: "+8675788201105",
        telegram: "@chen_xiu_wh"
      }
    }
  ],

  // 8. Прайс (Тарифи)
  pricingValidity: {
    dateFrom: "2026-01-01",
    dateTo: "2026-12-31"
  },
  pricing: [
    {
      service: "Відповідальне зберігання",
      unitPrice: 0.85,
      currency: "USD",
      standard: "per CBM per day",
      remark: "Перші 7 днів безкоштовно при консолідації",
      dateFrom: "2026-01-01",
      dateTo: "2026-12-31"
    },
    {
      service: "Маркування стикерами DF",
      unitPrice: 0.20,
      currency: "USD",
      standard: "per order item",
      remark: "Включає друк та наклеювання етикетки",
      dateFrom: "2026-01-01",
      dateTo: "2026-12-31"
    },
    {
      service: "Упаковка в стрейч-плівку",
      unitPrice: 3.50,
      currency: "USD",
      standard: "per pallet",
      remark: "Зміцнення захисними кутиками",
      dateFrom: "2026-01-01",
      dateTo: "2026-12-31"
    },
    {
      service: "Дерев'яна обрешітка вантажу",
      unitPrice: 28.00,
      currency: "USD",
      standard: "per CBM",
      remark: "Для крихкого та негабаритного вантажу",
      dateFrom: "2026-01-01",
      dateTo: "2026-12-31"
    }
  ],

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
  specialNotes: "Склад обладнаний рампою для великогабаритного транспорту та вилковими навантажувачами до 5 тонн. У разі доставки небезпечних вантажів (напр. Lithium Batteries) обов'язково надавати MSDS та сертифікат UN38.3 до заїзду авто."
};

/**
 * Оновлення статистики Дашборду
 */
function updateDashboardStats(cargoes = [], subvoyages = []) {
  const totalCargoes = cargoes.length;
  const activeSubvoyages = subvoyages.length;

  // Розрахунок поточних дат
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const threeDaysLater = new Date(now);
  threeDaysLater.setDate(now.getDate() + 3);
  const threeDaysStr = threeDaysLater.toISOString().split('T')[0];

  // 1. Загальний обʼєм на складі, м3
  const totalVolume = cargoes.reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

  // 2. Розподілені по рейсам, чекають відвантаження, м3
  const allocatedVolume = cargoes
    .filter(c => (c.subvoyage || c.dfShipment) && c.statusCode !== 'issued' && c.statusCode !== 'returned_to_customer')
    .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

  // 3. В роботі, м3 (всі інші не розподілені по рейсам)
  const inWorkVolume = cargoes
    .filter(c => !c.subvoyage && !c.dfShipment && c.statusCode !== 'issued' && c.statusCode !== 'returned_to_customer')
    .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

  // 4. Кількість м3 отримано сьогодні
  const receivedTodayVolume = cargoes
    .filter(c => c.receiveDate && c.receiveDate.startsWith(todayStr))
    .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

  // 5. Кількість м3 відправлених сьогодні
  const shippedTodayVolume = cargoes
    .filter(c => c.shippedDate ? c.shippedDate.startsWith(todayStr) : (c.statusCode === 'in_transit' && c.shipmentDate === todayStr))
    .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

  // 6. Кількість м3, очікуваних до отримання (3 дні)
  const expectedArrival3DaysVolume = cargoes
    .filter(c => {
      const arrDate = c.expectedArrivalDate || c.arrivalDate;
      return arrDate && arrDate >= todayStr && arrDate <= threeDaysStr && c.statusCode === 'in_transit';
    })
    .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

  // 7. Кількість м3, очікуваних на відправку (3 дні)
  const expectedShipment3DaysVolume = cargoes
    .filter(c => {
      const shipDate = c.expectedShipmentDate || c.plannedShipmentDate;
      return shipDate && shipDate >= todayStr && shipDate <= threeDaysStr && c.statusCode !== 'in_transit';
    })
    .reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

  // Оновлення DOM елементів
  const totalCargoesElem = document.getElementById('stat-total-cargoes');
  const activeSubvoyagesElem = document.getElementById('stat-active-subvoyages');
  const totalVolumeElem = document.getElementById('stat-total-volume');
  const allocatedVolumeElem = document.getElementById('stat-allocated-volume');
  const inWorkVolumeElem = document.getElementById('stat-in-work-volume');
  const receivedTodayElem = document.getElementById('stat-received-today');
  const shippedTodayElem = document.getElementById('stat-shipped-today');
  const expectedArrival3DaysElem = document.getElementById('stat-expected-arrival-3days');
  const expectedShipment3DaysElem = document.getElementById('stat-expected-shipment-3days');

  if (totalCargoesElem) totalCargoesElem.innerText = totalCargoes;
  if (activeSubvoyagesElem) activeSubvoyagesElem.innerText = activeSubvoyages;

  //Ось тут можливо що не буде загальної обʼєму складу
  if (totalVolumeElem) {
    totalVolumeElem.innerHTML = `${totalVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">/ 400.0 m³</span>`;
  }
  if (allocatedVolumeElem) {
    allocatedVolumeElem.innerHTML = `${allocatedVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">m³</span>`;
  }
  if (inWorkVolumeElem) {
    inWorkVolumeElem.innerHTML = `${inWorkVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">m³</span>`;
  }
  if (receivedTodayElem) {
    receivedTodayElem.innerHTML = `${receivedTodayVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">m³</span>`;
  }
  if (shippedTodayElem) {
    shippedTodayElem.innerHTML = `${shippedTodayVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">m³</span>`;
  }
  if (expectedArrival3DaysElem) {
    expectedArrival3DaysElem.innerHTML = `${expectedArrival3DaysVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">m³</span>`;
  }
  if (expectedShipment3DaysElem) {
    expectedShipment3DaysElem.innerHTML = `${expectedShipment3DaysVolume.toFixed(1)} <span class="text-xs font-normal text-slate-500">m³</span>`;
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

  // 4. Послуги
  const servicesElem = document.getElementById('wh-display-services');
  if (servicesElem) {
    servicesElem.innerHTML = data.services.map(s => `
      <span class="bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1">
        <i class="fa-solid fa-check text-emerald-600 text-[10px]"></i> ${s}
      </span>
    `).join('');
  }

  // 5. Умови роботи / Правила прийому
  const rulesElem = document.getElementById('wh-display-rules');
  if (rulesElem) rulesElem.innerText = data.rules;

  // 6. Графік роботи
  const scheduleElem = document.getElementById('wh-display-schedule');
  if (scheduleElem) {
    scheduleElem.innerHTML = data.schedule.map(s => `
      <div class="flex justify-between items-center py-1 border-b border-slate-100 last:border-0 text-xs">
        <span class="font-medium text-slate-600">${s.day}</span>
        <span class="font-mono font-bold ${s.isDayOff ? 'text-rose-600' : 'text-slate-800'}">${s.hours}</span>
      </div>
    `).join('');
  }

  // 7. Контактні особи
  const contactsElem = document.getElementById('wh-display-contacts');
  if (contactsElem) {
    contactsElem.innerHTML = data.contacts.map(c => `
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-bold text-slate-900 text-xs">${c.fullName}</span>
          <span class="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200 font-medium">${c.role}</span>
        </div>
        <div class="text-[11px] text-slate-600 space-y-1 font-mono">
          <div><i class="fa-regular fa-envelope text-slate-400 mr-1.5"></i><a href="mailto:${c.email}" class="hover:underline">${c.email}</a></div>
          <div><i class="fa-solid fa-phone text-slate-400 mr-1.5"></i><a href="tel:${c.phone}" class="hover:underline">${c.phone}</a></div>
        </div>
        <div class="flex gap-2 text-xs pt-1 border-t border-slate-200">
          <span class="text-emerald-600 font-semibold text-[10px]" title="WeChat"><i class="fa-brands fa-weixin mr-0.5"></i> ${c.socials.wechat}</span>
          <span class="text-sky-600 font-semibold text-[10px]" title="Telegram"><i class="fa-brands fa-telegram mr-0.5"></i> ${c.socials.telegram}</span>
        </div>
      </div>
    `).join('');
  }

  // 8. Прайс
  const pricingElem = document.getElementById('wh-display-pricing-body');
  const pricingValidityElem = document.getElementById('wh-display-pricing-validity');
  if (pricingValidityElem && data.pricingValidity) {
    pricingValidityElem.innerText = `Дійсний з ${data.pricingValidity.dateFrom} до ${data.pricingValidity.dateTo}`;
  }

  if (pricingElem && Array.isArray(data.pricing)) {
    pricingElem.innerHTML = data.pricing.map(p => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs">
        <td class="p-2.5 font-bold text-slate-800">${p.service}</td>
        <td class="p-2.5 font-mono font-extrabold text-emerald-700">${p.unitPrice.toFixed(2)} ${p.currency}</td>
        <td class="p-2.5 text-slate-600 font-mono text-[11px]">${p.standard}</td>
        <td class="p-2.5 text-slate-500 italic text-[11px]">${p.remark}</td>
        <td class="p-2.5 font-mono text-[10px] text-slate-500">${p.dateFrom} — ${p.dateTo}</td>
      </tr>
    `).join('');
  }

  // 9. Інструкція для клієнта
  const instructionElem = document.getElementById('wh-display-instruction');
  if (instructionElem) instructionElem.value = data.clientInstruction;

  // 10. Особливі примітки
  const notesElem = document.getElementById('wh-display-special-notes');
  if (notesElem) notesElem.innerText = data.specialNotes;
}

/**
 * Копіювання інструкції для клієнта
 */
function copyClientInstruction() {
  const instructionElem = document.getElementById('wh-display-instruction');
  if (!instructionElem) return;

  navigator.clipboard.writeText(instructionElem.value).then(() => {
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
  if (!instructionElem) return;

  const blob = new Blob([instructionElem.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Warehouse_Instruction_${warehouseInfoData.code}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Глобальний експорт
window.DashboardModule = {
  data: warehouseInfoData,
  updateStats: updateDashboardStats,
  renderWarehouseInfo: renderWarehouseInfo,
  copyInstruction: copyClientInstruction,
  downloadInstruction: downloadClientInstruction
};
