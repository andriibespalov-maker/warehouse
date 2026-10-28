/**
 * Модуль керування розширеними фільтрами вантажів
 */
class CargoFilterManager {
  constructor(options = {}) {
    this.onFilterChange = options.onFilterChange || null;
    this.openModal = options.openModal || null;
    this.closeModal = options.closeModal || null;

    // Мапінг системних статусів для людиночитаймого відображення в чипах
    this.statusLabelsMap = {
      'at_origin_warehouse': 'На складі відправки',
      'in_transit': 'В дорозі',
      'storaging_in_warehouse': 'Зберігання на складі'
    };

    this.filterTemplates = [
      {
        id: 'tpl-china-air',
        name: 'Авіа з Китаю',
        filters: {
          status: ['at_origin_warehouse'],
          statusOp: 'equals',
          shipment: ['Авіа'],
          voyage: ['Рейс #101']
        }
      }
    ];

    this.activeTemplateId = null;

    this.availableFilterFields = [
      {id: 'arrivalDate', label: 'Дата прибуття', icon: 'fa-calendar-days'},
      {id: 'status', label: 'Статус', icon: 'fa-list-check'},
      {id: 'manager', label: 'Менеджер', icon: 'fa-user-gear'},
      {id: 'shipment', label: 'Перевезення', icon: 'fa-truck-ramp-box'},
      {id: 'client', label: 'Клієнти', icon: 'fa-user'},
      {id: 'voyage', label: 'Умова / Рейси', icon: 'fa-plane'},
      {id: 'logist', label: 'Відповідальний логіст', icon: 'fa-user-tie'},
      {id: 'emptyShipment', label: 'Пустий DF номер перевезення', icon: 'fa-square-check'},
      {id: 'emptyPromise', label: 'Пустий DF номер обіцянки', icon: 'fa-square-check'},
      {id: 'dfShipmentNo', label: 'DF номер транспортування', icon: 'fa-hashtag'},
      {id: 'dfPromiseNo', label: 'DF номер обіцянки', icon: 'fa-hashtag'},
      {id: 'trackNo', label: 'Трек номер', icon: 'fa-barcode'},
    ];

    this.fieldHTMLMap = {
      arrivalDate: `
        <div class="filter-row bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs" data-field="arrivalDate">
          <span class="w-44 text-xs font-bold text-slate-700 shrink-0">Дата прибуття:</span>
          <div class="relative flex-1">
            <input type="date" id="filter-arrivalDate" class="filter-input w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition">
            <button type="button" class="clear-single-val-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs hidden cursor-pointer" title="Очистити поле">&times;</button>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-regular fa-trash-can text-sm"></i></button>
        </div>`,

      status: `
        <div class="filter-row bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs" data-field="status">
          <span class="w-44 text-xs font-bold text-slate-700 shrink-0">Статус:</span>
          <select id="operator-status" class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer shrink-0">
            <option value="equals">Дорівнює</option>
            <option value="not_equals">Не дорівнює</option>
          </select>
          <div class="relative flex-1">
            <button type="button" class="multiselect-toggle-btn w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-left flex justify-between items-center transition focus:outline-none focus:border-indigo-500 cursor-pointer" data-field="status">
              <span id="multiselect-btn-text-status" class="text-indigo-600 font-semibold truncate">+ Додати</span>
              <i class="fa-solid fa-chevron-down text-slate-400 text-[10px]"></i>
            </button>
            <button type="button" class="clear-single-val-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs hidden cursor-pointer" title="Очистити поле">&times;</button>
            <div id="multiselect-menu-status" class="multiselect-menu hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 space-y-1">
              <div class="relative mb-1.5">
                <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                <input type="text" placeholder="Пошук у списку..." class="multiselect-search-input w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition">
              </div>
              <div class="multiselect-options-list space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="at_origin_warehouse" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="status"> На складі відправки
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="in_transit" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="status"> В дорозі
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="storaging_in_warehouse" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="status"> Зберігання на складі
                </label>
              </div>
            </div>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-regular fa-trash-can text-sm"></i></button>
        </div>`,

      manager: `
        <div class="filter-row bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs" data-field="manager">
          <span class="w-44 text-xs font-bold text-slate-700 shrink-0">Менеджер:</span>
          <div class="relative flex-1">
            <button type="button" class="multiselect-toggle-btn w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-left flex justify-between items-center transition focus:outline-none focus:border-indigo-500 cursor-pointer" data-field="manager">
              <span id="multiselect-btn-text-manager" class="text-indigo-600 font-semibold truncate">+ Додати</span>
              <i class="fa-solid fa-chevron-down text-slate-400 text-[10px]"></i>
            </button>
            <button type="button" class="clear-single-val-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs hidden cursor-pointer" title="Очистити поле">&times;</button>
            <div id="multiselect-menu-manager" class="multiselect-menu hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 space-y-1">
              <div class="relative mb-1.5">
                <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                <input type="text" placeholder="Пошук менеджера..." class="multiselect-search-input w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition">
              </div>
              <div class="multiselect-options-list space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="О. Ковальчук" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="manager"> О. Ковальчук
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="М. Гриценко" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="manager"> М. Гриценко
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="К. Бондаренко" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="manager"> К. Бондаренко
                </label>
              </div>
            </div>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-regular fa-trash-can text-sm"></i></button>
        </div>`,

      shipment: `
        <div class="filter-row bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs" data-field="shipment">
          <span class="w-44 text-xs font-bold text-slate-700 shrink-0">Перевезення:</span>
          <div class="relative flex-1">
            <button type="button" class="multiselect-toggle-btn w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-left flex justify-between items-center transition focus:outline-none focus:border-indigo-500 cursor-pointer" data-field="shipment">
              <span id="multiselect-btn-text-shipment" class="text-indigo-600 font-semibold truncate">+ Додати</span>
              <i class="fa-solid fa-chevron-down text-slate-400 text-[10px]"></i>
            </button>
            <button type="button" class="clear-single-val-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs hidden cursor-pointer" title="Очистити поле">&times;</button>
            <div id="multiselect-menu-shipment" class="multiselect-menu hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 space-y-1">
              <div class="relative mb-1.5">
                <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                <input type="text" placeholder="Пошук виду транспорту..." class="multiselect-search-input w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition">
              </div>
              <div class="multiselect-options-list space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="Авіа" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="shipment"> Авіа
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="Море" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="shipment"> Море
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="Залізниця" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="shipment"> Залізниця
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="Авто" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="shipment"> Авто
                </label>
              </div>
            </div>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-regular fa-trash-can text-sm"></i></button>
        </div>`,

      client: `
        <div class="filter-row bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs" data-field="client">
          <span class="w-44 text-xs font-bold text-slate-700 shrink-0">Клієнти:</span>
          <select id="operator-client" class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer shrink-0">
            <option value="equals">Дорівнює</option>
            <option value="not_equals">Не дорівнює</option>
          </select>
          <div class="relative flex-1">
            <button type="button" class="multiselect-toggle-btn w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-left flex justify-between items-center transition focus:outline-none focus:border-indigo-500 cursor-pointer" data-field="client">
              <span id="multiselect-btn-text-client" class="text-indigo-600 font-semibold truncate">+ Додати</span>
              <i class="fa-solid fa-chevron-down text-slate-400 text-[10px]"></i>
            </button>
            <button type="button" class="clear-single-val-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs hidden cursor-pointer" title="Очистити поле">&times;</button>
            <div id="multiselect-menu-client" class="multiselect-menu hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 space-y-1">
              <div class="relative mb-1.5">
                <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                <input type="text" placeholder="Пошук клієнта..." class="multiselect-search-input w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition">
              </div>
              <div class="multiselect-options-list space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="ТОВ Логістик" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="client"> ТОВ Логістик
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="ФОП Іванов" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="client"> ФОП Іванов
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="ТОВ Трейд" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="client"> ТОВ Трейд
                </label>
              </div>
            </div>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-regular fa-trash-can text-sm"></i></button>
        </div>`,

      voyage: `
        <div class="filter-row bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs" data-field="voyage">
          <span class="w-44 text-xs font-bold text-slate-700 shrink-0">Умова / Рейси:</span>
          <select id="operator-voyage" class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer shrink-0">
            <option value="equals">Дорівнює</option>
            <option value="not_equals">Не дорівнює</option>
          </select>
          <div class="relative flex-1">
            <button type="button" class="multiselect-toggle-btn w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-left flex justify-between items-center transition focus:outline-none focus:border-indigo-500 cursor-pointer" data-field="voyage">
              <span id="multiselect-btn-text-voyage" class="text-indigo-600 font-semibold truncate">+ Додати</span>
              <i class="fa-solid fa-chevron-down text-slate-400 text-[10px]"></i>
            </button>
            <button type="button" class="clear-single-val-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs hidden cursor-pointer" title="Очистити поле">&times;</button>
            <div id="multiselect-menu-voyage" class="multiselect-menu hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 space-y-1">
              <div class="relative mb-1.5">
                <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                <input type="text" placeholder="Пошук рейсу..." class="multiselect-search-input w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition">
              </div>
              <div class="multiselect-options-list space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="Рейс #101" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="voyage"> Рейс #101
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="Рейс #102" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="voyage"> Рейс #102
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="Рейс #201" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="voyage"> Рейс #201
                </label>
              </div>
            </div>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-regular fa-trash-can text-sm"></i></button>
        </div>`,

      logist: `
        <div class="filter-row bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs" data-field="logist">
          <span class="w-44 text-xs font-bold text-slate-700 shrink-0">Відповідальний логіст:</span>
          <div class="relative flex-1">
            <button type="button" class="multiselect-toggle-btn w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-left flex justify-between items-center transition focus:outline-none focus:border-indigo-500 cursor-pointer" data-field="logist">
              <span id="multiselect-btn-text-logist" class="text-indigo-600 font-semibold truncate">+ Додати</span>
              <i class="fa-solid fa-chevron-down text-slate-400 text-[10px]"></i>
            </button>
            <button type="button" class="clear-single-val-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs hidden cursor-pointer" title="Очистити поле">&times;</button>
            <div id="multiselect-menu-logist" class="multiselect-menu hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 space-y-1">
              <div class="relative mb-1.5">
                <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                <input type="text" placeholder="Пошук логіста..." class="multiselect-search-input w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition">
              </div>
              <div class="multiselect-options-list space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="І. Сидоренко" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="logist"> І. Сидоренко
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="В. Василенко" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="logist"> В. Василенко
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" value="М. Коваленко" class="multiselect-cb rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" data-field="logist"> М. Коваленко
                </label>
              </div>
            </div>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-regular fa-trash-can text-sm"></i></button>
        </div>`,

      emptyShipment: `
        <div class="filter-row bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs" data-field="emptyShipment">
          <span class="w-44 text-xs font-bold text-slate-700 shrink-0">DF перевезення:</span>
          <div class="relative flex-1 flex items-center justify-between pr-2">
            <label class="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition text-xs font-semibold text-slate-700">
              <input type="checkbox" id="filter-emptyShipment" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer">
              <span>Пустий DF номер перевезення</span>
            </label>
            <button type="button" class="clear-single-val-btn text-slate-400 hover:text-slate-600 text-sm hidden cursor-pointer" title="Очистити поле">&times;</button>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-regular fa-trash-can text-sm"></i></button>
        </div>`,

      emptyPromise: `
        <div class="filter-row bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs" data-field="emptyPromise">
          <span class="w-44 text-xs font-bold text-slate-700 shrink-0">DF обіцянки:</span>
          <div class="relative flex-1 flex items-center justify-between pr-2">
            <label class="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition text-xs font-semibold text-slate-700">
              <input type="checkbox" id="filter-emptyPromise" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer">
              <span>Пустий DF номер обіцянки</span>
            </label>
            <button type="button" class="clear-single-val-btn text-slate-400 hover:text-slate-600 text-sm hidden cursor-pointer" title="Очистити поле">&times;</button>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-regular fa-trash-can text-sm"></i></button>
        </div>`,

      dfShipmentNo: `
        <div class="filter-row bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs" data-field="dfShipmentNo">
          <span class="w-44 text-xs font-bold text-slate-700 shrink-0">DF номер транспортування:</span>
          <div class="relative flex-1">
            <input type="text" id="filter-dfShipmentNo" placeholder="Введіть номер..." class="filter-input w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition">
            <button type="button" class="clear-single-val-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs hidden cursor-pointer" title="Очистити поле">&times;</button>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-regular fa-trash-can text-sm"></i></button>
        </div>`,

      dfPromiseNo: `
        <div class="filter-row bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs" data-field="dfPromiseNo">
          <span class="w-44 text-xs font-bold text-slate-700 shrink-0">DF номер обіцянки:</span>
          <div class="relative flex-1">
            <input type="text" id="filter-dfPromiseNo" placeholder="Введіть номер..." class="filter-input w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition">
            <button type="button" class="clear-single-val-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs hidden cursor-pointer" title="Очистити поле">&times;</button>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-regular fa-trash-can text-sm"></i></button>
        </div>`,

      trackNo: `
        <div class="filter-row bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs" data-field="trackNo">
          <span class="w-44 text-xs font-bold text-slate-700 shrink-0">Трек номер:</span>
          <div class="relative flex-1">
            <input type="text" id="filter-trackNo" placeholder="Введіть трек..." class="filter-input w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition">
            <button type="button" class="clear-single-val-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs hidden cursor-pointer" title="Очистити поле">&times;</button>
          </div>
          <button type="button" class="remove-filter-row-btn p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Видалити поле"><i class="fa-regular fa-trash-can text-sm"></i></button>
        </div>`
    };
  }

  init() {
    this.resetModalFilters();
    this.bindEvents();
    this.renderTemplatesList();
  }

  toggleModal(open) {
    const modal = document.getElementById('modal-advanced-filter');
    if (!modal) return;
    if (open) modal.classList.remove('hidden');
    else modal.classList.add('hidden');
  }

  getSelectedMultiselectValues(fieldId) {
    const checkboxes = document.querySelectorAll(`.multiselect-cb[data-field="${fieldId}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
  }

  setMultiselectValues(fieldId, values = []) {
    const checkboxes = document.querySelectorAll(`.multiselect-cb[data-field="${fieldId}"]`);
    checkboxes.forEach(cb => {
      cb.checked = values.includes(cb.value);
    });
    this.updateMultiselectButtonText(fieldId);
  }

  updateMultiselectButtonText(fieldId) {
    const btnText = document.getElementById(`multiselect-btn-text-${fieldId}`);
    const row = btnText?.closest('.filter-row');
    const clearBtn = row?.querySelector('.clear-single-val-btn');

    if (!btnText) return;

    const selected = this.getSelectedMultiselectValues(fieldId);
    if (selected.length === 0) {
      btnText.textContent = '+ Додати';
      btnText.classList.add('text-indigo-600', 'font-semibold');
      btnText.classList.remove('text-slate-800');
      clearBtn?.classList.add('hidden');
    } else {
      btnText.textContent = `Обрано (${selected.length})`;
      btnText.classList.remove('text-indigo-600');
      btnText.classList.add('text-slate-800', 'font-semibold');
      clearBtn?.classList.remove('hidden');
    }
  }

  checkRowClearVisibility(row) {
    if (!row) return;
    const clearBtn = row.querySelector('.clear-single-val-btn');
    if (!clearBtn) return;

    const input = row.querySelector('.filter-input');
    const checkbox = row.querySelector('input[type="checkbox"]:not(.multiselect-cb)');
    const fieldId = row.getAttribute('data-field');

    if (input) {
      if (input.value && input.value.trim() !== '') clearBtn.classList.remove('hidden');
      else clearBtn.classList.add('hidden');
    } else if (checkbox) {
      if (checkbox.checked) clearBtn.classList.remove('hidden');
      else clearBtn.classList.add('hidden');
    } else if (fieldId) {
      const selected = this.getSelectedMultiselectValues(fieldId);
      if (selected.length > 0) clearBtn.classList.remove('hidden');
      else clearBtn.classList.add('hidden');
    }
  }

  getCurrentFilters() {
    const quickSearch = document.getElementById('search-input')?.value.trim() || '';

    return {
      search: quickSearch,
      arrivalDate: document.getElementById('filter-arrivalDate')?.value || '',
      status: this.getSelectedMultiselectValues('status'),
      statusOp: document.getElementById('operator-status')?.value || 'equals',
      manager: this.getSelectedMultiselectValues('manager'),
      shipment: this.getSelectedMultiselectValues('shipment'),
      client: this.getSelectedMultiselectValues('client'),
      clientOp: document.getElementById('operator-client')?.value || 'equals',
      voyage: this.getSelectedMultiselectValues('voyage'),
      voyageOp: document.getElementById('operator-voyage')?.value || 'equals',
      logist: this.getSelectedMultiselectValues('logist'),
      dfShipmentNo: document.getElementById('filter-dfShipmentNo')?.value.trim() || '',
      dfPromiseNo: document.getElementById('filter-dfPromiseNo')?.value.trim() || '',
      trackNo: document.getElementById('filter-trackNo')?.value.trim() || '',
      emptyShipment: document.getElementById('filter-emptyShipment')?.checked || false,
      deliveryMethod: this.getSelectedMultiselectValues('deliveryMethod'),
      emptyPromise: document.getElementById('filter-emptyPromise')?.checked || false
    };
  }

  matches(cargo) {
    const filters = this.getCurrentFilters();

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const mId = (cargo.id || '').toLowerCase().includes(q);
      const mTrack = (cargo.trackNumber || '').toLowerCase().includes(q);
      const mTm = (cargo.trademark || '').toLowerCase().includes(q);
      if (!mId && !mTrack && !mTm) return false;
    }

    if (filters.arrivalDate && cargo.arrivalDate !== filters.arrivalDate) return false;
    if (filters.trackNo && !(cargo.trackNumber || '').toLowerCase().includes(filters.trackNo.toLowerCase())) return false;
    if (filters.dfShipmentNo && !(cargo.dfShipment || '').toLowerCase().includes(filters.dfShipmentNo.toLowerCase())) return false;
    if (filters.dfPromiseNo && !(cargo.dfPromise || '').toLowerCase().includes(filters.dfPromiseNo.toLowerCase())) return false;

    if (filters.manager.length > 0 && !filters.manager.includes(cargo.manager)) return false;
    if (filters.logist.length > 0 && !filters.logist.includes(cargo.logist)) return false;
    if (filters.shipment.length > 0 && !filters.shipment.includes(cargo.shipment)) return false;

    if (filters.client.length > 0) {
      const matched = filters.client.some(c => (cargo.client || '').toLowerCase().includes(c.toLowerCase()));
      if (filters.clientOp === 'equals' ? !matched : matched) return false;
    }

    if (filters.voyage.length > 0) {
      const matched = filters.voyage.some(v => (cargo.voyage || '').toLowerCase().includes(v.toLowerCase()));
      if (filters.voyageOp === 'equals' ? !matched : matched) return false;
    }

    if (filters.emptyShipment && cargo.dfShipment && cargo.dfShipment.trim() !== '') return false;
    if (filters.emptyPromise && cargo.dfPromise && cargo.dfPromise.trim() !== '') return false;

    if (filters.deliveryMethod && filters.deliveryMethod.length > 0) {
      const cargoDelivery = cargo.direction || cargo.deliveryMethod || cargo.shippingMethod || '';
      if (!filters.deliveryMethod.some(m => cargoDelivery.toLowerCase().includes(m.toLowerCase()))) return false;
    }

    if (filters.status.length > 0) {
      const ok = filters.statusOp === 'equals' ? filters.status.includes(cargo.statusCode) : !filters.status.includes(cargo.statusCode);
      if (!ok) return false;
    }

    return true;
  }

  updateActiveFiltersBar() {
    const activeFiltersBar = document.getElementById('active-filters-bar');
    const activeChipsContainer = document.getElementById('active-chips-container');
    const filterBadge = document.getElementById('filter-badge');
    const activeTplBadge = document.getElementById('active-template-badge');
    const activeTplNameText = document.getElementById('active-template-name-text');

    if (!activeFiltersBar || !activeChipsContainer) return;

    const currentFilters = this.getCurrentFilters();

    const isAnyActive = currentFilters.search ||
      currentFilters.arrivalDate ||
      currentFilters.client.length > 0 ||
      currentFilters.manager.length > 0 ||
      currentFilters.logist.length > 0 ||
      currentFilters.shipment.length > 0 ||
      currentFilters.voyage.length > 0 ||
      currentFilters.trackNo || currentFilters.dfShipmentNo || currentFilters.dfPromiseNo ||
      currentFilters.emptyShipment || currentFilters.emptyPromise ||
      currentFilters.status.length > 0 ||
      this.activeTemplateId !== null;

    if (isAnyActive) filterBadge?.classList.remove('hidden');
    else filterBadge?.classList.add('hidden');

    if (this.activeTemplateId) {
      const activeTpl = this.filterTemplates.find(t => t.id === this.activeTemplateId);
      if (activeTpl && activeTplBadge && activeTplNameText) {
        activeTplNameText.textContent = activeTpl.name;
        activeTplBadge.classList.remove('hidden');
        activeTplBadge.classList.add('flex');
      }
    } else if (activeTplBadge) {
      activeTplBadge.classList.add('hidden');
      activeTplBadge.classList.remove('flex');
    }

    const activeEntries = [];
    if (currentFilters.search) activeEntries.push(['search', 'Пошук', currentFilters.search]);
    if (currentFilters.arrivalDate) activeEntries.push(['arrivalDate', 'Дата прибуття', currentFilters.arrivalDate]);

    // Перетворено статус через людиночитаймий мапінг
    if (currentFilters.status.length > 0) {
      const opText = currentFilters.statusOp === 'not_equals' ? '≠' : '=';
      const localizedStatuses = currentFilters.status.map(s => this.statusLabelsMap[s] || s).join(', ');
      activeEntries.push(['status', `Статус (${opText})`, localizedStatuses]);
    }
    if (currentFilters.manager.length > 0) activeEntries.push(['manager', 'Менеджер', currentFilters.manager.join(', ')]);
    if (currentFilters.shipment.length > 0) activeEntries.push(['shipment', 'Перевезення', currentFilters.shipment.join(', ')]);
    if (currentFilters.client.length > 0) {
      const opText = currentFilters.clientOp === 'not_equals' ? '≠' : '=';
      activeEntries.push(['client', `Клієнти (${opText})`, currentFilters.client.join(', ')]);
    }
    if (currentFilters.voyage.length > 0) {
      const opText = currentFilters.voyageOp === 'not_equals' ? '≠' : '=';
      activeEntries.push(['voyage', `Умова / Рейси (${opText})`, currentFilters.voyage.join(', ')]);
    }
    if (currentFilters.logist.length > 0) activeEntries.push(['logist', 'Логіст', currentFilters.logist.join(', ')]);
    if (currentFilters.dfShipmentNo) activeEntries.push(['dfShipmentNo', 'DF транспортування', currentFilters.dfShipmentNo]);
    if (currentFilters.dfPromiseNo) activeEntries.push(['dfPromiseNo', 'DF обіцянки', currentFilters.dfPromiseNo]);
    if (currentFilters.trackNo) activeEntries.push(['trackNo', 'Трек', currentFilters.trackNo]);
    if (currentFilters.emptyShipment) activeEntries.push(['emptyShipment', 'DF перевезення', 'Пустий']);
    if (currentFilters.emptyPromise) activeEntries.push(['emptyPromise', 'DF обіцянки', 'Пустий']);

    if (activeEntries.length === 0 && !this.activeTemplateId) {
      activeFiltersBar.classList.add('hidden');
      return;
    }

    activeFiltersBar.classList.remove('hidden');
    activeChipsContainer.innerHTML = activeEntries.map(([field, label, val]) => `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200/80 font-medium text-xs">
        <span class="text-slate-400 font-normal">${label}:</span> ${val}
        <button type="button" class="remove-filter-chip-btn text-slate-400 hover:text-rose-600 transition cursor-pointer ml-0.5" data-field="${field}">&times;</button>
      </span>
    `).join('');
  }

  renderTemplatesList() {
    const savedTemplatesList = document.getElementById('saved-templates-list');
    if (!savedTemplatesList) return;

    if (this.filterTemplates.length === 0) {
      savedTemplatesList.innerHTML = `<div class="text-center py-4 text-slate-400 text-xs">Немає збережених шаблонів</div>`;
      return;
    }

    savedTemplatesList.innerHTML = this.filterTemplates.map(tpl => {
      const isActive = tpl.id === this.activeTemplateId;
      const activeClasses = isActive
        ? 'border-indigo-500 bg-indigo-50/60 text-indigo-700 font-bold shadow-2xs'
        : 'border-slate-200/80 bg-white hover:border-indigo-200 text-slate-800';

      return `
        <div class="group flex items-center justify-between p-3 rounded-2xl border ${activeClasses} transition text-xs shadow-2xs">
          <div class="flex-1 min-w-0 cursor-pointer apply-template-btn" data-tpl-id="${tpl.id}">
            <div class="flex items-center gap-2.5">
              <i class="fa-solid fa-bookmark ${isActive ? 'text-indigo-600' : 'text-slate-300'}"></i>
              <p class="truncate font-medium">${tpl.name}</p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button type="button" class="edit-template-btn p-1 text-slate-300 hover:text-indigo-600 transition cursor-pointer" data-tpl-id="${tpl.id}" title="Перейменувати">
              <i class="fa-regular fa-pen-to-square text-xs"></i>
            </button>
            <button type="button" class="delete-template-btn p-1 text-slate-300 hover:text-rose-600 transition cursor-pointer" data-tpl-id="${tpl.id}" title="Видалити">
              <i class="fa-regular fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>`;
    }).join('');
  }

  clearInputValues() {
    document.querySelectorAll('.filter-input').forEach(input => input.value = '');
    document.querySelectorAll('.clear-single-val-btn').forEach(btn => btn.classList.add('hidden'));
    document.querySelectorAll('.filter-row select').forEach(sel => sel.selectedIndex = 0);
    document.querySelectorAll('.filter-row input[type="checkbox"]').forEach(cb => cb.checked = false);

    ['status', 'manager', 'shipment', 'client', 'voyage', 'logist', 'deliveryMethod'].forEach(fieldId => {
      this.setMultiselectValues(fieldId, []);
    });
  }

  resetModalFilters() {
    this.activeTemplateId = null;
    const filterFieldsContainer = document.getElementById('filter-fields-container');
    if (filterFieldsContainer) {
      filterFieldsContainer.innerHTML = this.availableFilterFields
        .map(f => this.fieldHTMLMap[f.id])
        .filter(Boolean)
        .join('');
    }
    this.clearInputValues();
    this.renderTemplatesList();
    this.triggerChange();
  }

  applyTemplate(tplId) {
    const tpl = this.filterTemplates.find(t => t.id === tplId);
    if (!tpl) return;

    this.activeTemplateId = tplId;
    this.clearInputValues();

    const f = tpl.filters || {};

    if (f.arrivalDate && document.getElementById('filter-arrivalDate')) {
      document.getElementById('filter-arrivalDate').value = f.arrivalDate;
    }
    if (f.dfShipmentNo && document.getElementById('filter-dfShipmentNo')) {
      document.getElementById('filter-dfShipmentNo').value = f.dfShipmentNo;
    }
    if (f.dfPromiseNo && document.getElementById('filter-dfPromiseNo')) {
      document.getElementById('filter-dfPromiseNo').value = f.dfPromiseNo;
    }
    if (f.trackNo && document.getElementById('filter-trackNo')) {
      document.getElementById('filter-trackNo').value = f.trackNo;
    }

    if (f.emptyShipment && document.getElementById('filter-emptyShipment')) {
      document.getElementById('filter-emptyShipment').checked = f.emptyShipment;
    }
    if (f.emptyPromise && document.getElementById('filter-emptyPromise')) {
      document.getElementById('filter-emptyPromise').checked = f.emptyPromise;
    }

    if (f.statusOp && document.getElementById('operator-status')) {
      document.getElementById('operator-status').value = f.statusOp;
    }
    if (f.clientOp && document.getElementById('operator-client')) {
      document.getElementById('operator-client').value = f.clientOp;
    }
    if (f.voyageOp && document.getElementById('operator-voyage')) {
      document.getElementById('operator-voyage').value = f.voyageOp;
    }

    this.setMultiselectValues('status', f.status || []);
    this.setMultiselectValues('manager', f.manager || []);
    this.setMultiselectValues('shipment', f.shipment || []);
    this.setMultiselectValues('client', f.client || []);
    this.setMultiselectValues('voyage', f.voyage || []);
    this.setMultiselectValues('logist', f.logist || []);

    document.querySelectorAll('.filter-row').forEach(row => this.checkRowClearVisibility(row));

    this.renderTemplatesList();
    this.triggerChange();
  }

  deleteTemplate(tplId) {
    this.filterTemplates = this.filterTemplates.filter(t => t.id !== tplId);
    if (this.activeTemplateId === tplId) {
      this.activeTemplateId = null;
    }
    this.renderTemplatesList();
    this.triggerChange();
  }

  triggerChange() {
    this.updateActiveFiltersBar();
    if (typeof this.onFilterChange === 'function') {
      this.onFilterChange();
    }
  }

  bindEvents() {
    // 1. Глобальне закриття вікон по хрестику або кліку поза вікном
    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('.close-modal, .close-modal-field, .close-modal-tpl, .close-modal-edit-tpl, [data-close-modal]');
      if (closeBtn) {
        const modal = closeBtn.closest('.fixed');
        if (modal) modal.classList.add('hidden');
        return;
      }

      if (e.target.classList.contains('fixed') && e.target.id && e.target.id.startsWith('modal-')) {
        e.target.classList.add('hidden');
      }
    });

    document.getElementById('btn-open-advanced-filter')?.addEventListener('click', () => this.toggleModal(true));

    // 2. Клік по панелі активних чипів
    document.getElementById('active-filters-bar')?.addEventListener('click', (e) => {
      const chipBtn = e.target.closest('.remove-filter-chip-btn');
      if (chipBtn) {
        const field = chipBtn.getAttribute('data-field');
        if (['status', 'manager', 'shipment', 'client', 'voyage', 'logist', 'deliveryMethod'].includes(field)) {
          this.setMultiselectValues(field, []);
        } else if (['emptyShipment', 'emptyPromise'].includes(field)) {
          const cb = document.getElementById(`filter-${field}`);
          if (cb) cb.checked = false;
        } else if (field === 'search') {
          const searchIn = document.getElementById('search-input');
          if (searchIn) searchIn.value = '';
        } else {
          const input = document.getElementById(`filter-${field}`);
          if (input) input.value = '';
        }

        const row = document.querySelector(`.filter-row[data-field="${field}"]`);
        if (row) this.checkRowClearVisibility(row);

        this.triggerChange();
      }

      if (e.target.closest('#clear-all-active-chips')) {
        this.resetModalFilters();
      }
    });

    // 3. Динамічний пошук по тексту всередині мультиселекту & оновлення хрестиків для текстових інпутів
    document.addEventListener('input', (e) => {
      // Якщо вводимо текст у пошук всередині відкритих мультиселектів
      const searchInput = e.target.closest('.multiselect-search-input');
      if (searchInput) {
        const query = searchInput.value.toLowerCase().trim();
        const menu = searchInput.closest('.multiselect-menu');
        if (!menu) return;

        const labels = menu.querySelectorAll('.multiselect-options-list label');
        labels.forEach(label => {
          const text = label.textContent.toLowerCase();
          if (text.includes(query)) {
            label.classList.remove('hidden');
          } else {
            label.classList.add('hidden');
          }
        });
        return;
      }

      // Якщо вводимо значення в звичайні інпути фільтра
      const row = e.target.closest('.filter-row');
      if (row) this.checkRowClearVisibility(row);
    });

    document.addEventListener('change', (e) => {
      const row = e.target.closest('.filter-row');
      if (row) this.checkRowClearVisibility(row);
    });

    // 4. Єдиний обробник кліків для кнопок очищення полів, відкриття/закриття мультиселектів та вибору чекбоксів
    document.addEventListener('click', (e) => {
      // Очищення окремого поля через хрестик (&times;)
      const clearSingleBtn = e.target.closest('.clear-single-val-btn');
      if (clearSingleBtn) {
        e.stopPropagation();
        const row = clearSingleBtn.closest('.filter-row');
        if (!row) return;

        const fieldId = row.getAttribute('data-field');
        const input = row.querySelector('.filter-input');
        const checkbox = row.querySelector('input[type="checkbox"]:not(.multiselect-cb)');

        if (input) input.value = '';
        if (checkbox) checkbox.checked = false;

        if (['status', 'manager', 'shipment', 'client', 'voyage', 'logist'].includes(fieldId)) {
          this.setMultiselectValues(fieldId, []);
        }

        clearSingleBtn.classList.add('hidden');
        this.triggerChange();
        return;
      }

      // Натискання на кнопку "+ Додати" (Toggle Multiselect)
      const toggleBtn = e.target.closest('.multiselect-toggle-btn');
      if (toggleBtn) {
        e.stopPropagation();
        const fieldId = toggleBtn.getAttribute('data-field');
        const menu = document.getElementById(`multiselect-menu-${fieldId}`);

        document.querySelectorAll('.multiselect-menu').forEach(m => {
          if (m !== menu) m.classList.add('hidden');
        });

        if (menu) {
          const isHidden = menu.classList.contains('hidden');
          menu.classList.toggle('hidden');

          if (isHidden) {
            const searchInput = menu.querySelector('.multiselect-search-input');
            if (searchInput) {
              searchInput.value = '';
              menu.querySelectorAll('.multiselect-options-list label').forEach(lbl => lbl.classList.remove('hidden'));
              setTimeout(() => searchInput.focus(), 50);
            }
          }
        }
        return;
      }

      // Клік всередині самого відкритого меню мультиселекту
      if (e.target.closest('.multiselect-menu')) {
        e.stopPropagation();
        const cb = e.target.closest('.multiselect-cb');
        if (cb) {
          const fieldId = cb.getAttribute('data-field');
          this.updateMultiselectButtonText(fieldId);
          const row = cb.closest('.filter-row');
          this.checkRowClearVisibility(row);
        }
        return;
      }

      // Клік поза мультиселектом закриває всі відкриті меню
      document.querySelectorAll('.multiselect-menu').forEach(m => m.classList.add('hidden'));
    });

    // 5. Створення шаблону
    document.getElementById('btn-open-save-template')?.addEventListener('click', () => {
      const currentFilters = this.getCurrentFilters();
      const activeEntries = [];

      if (currentFilters.arrivalDate) activeEntries.push(['Дата прибуття', currentFilters.arrivalDate]);
      if (currentFilters.status.length) activeEntries.push([`Статус (${currentFilters.statusOp === 'equals' ? '=' : '!='})`, currentFilters.status.map(s => this.statusLabelsMap[s] || s).join(', ')]);
      if (currentFilters.manager.length) activeEntries.push(['Менеджер', currentFilters.manager.join(', ')]);
      if (currentFilters.shipment.length) activeEntries.push(['Перевезення', currentFilters.shipment.join(', ')]);
      if (currentFilters.client.length) activeEntries.push([`Клієнти (${currentFilters.clientOp === 'equals' ? '=' : '!='})`, currentFilters.client.join(', ')]);
      if (currentFilters.voyage.length) activeEntries.push([`Умова / Рейси (${currentFilters.voyageOp === 'equals' ? '=' : '!='})`, currentFilters.voyage.join(', ')]);
      if (currentFilters.logist.length) activeEntries.push(['Логіст', currentFilters.logist.join(', ')]);
      if (currentFilters.dfShipmentNo) activeEntries.push(['DF транспортування', currentFilters.dfShipmentNo]);
      if (currentFilters.dfPromiseNo) activeEntries.push(['DF обіцянки', currentFilters.dfPromiseNo]);
      if (currentFilters.trackNo) activeEntries.push(['Трек', currentFilters.trackNo]);
      if (currentFilters.emptyShipment) activeEntries.push(['DF перевезення', 'Пустий']);
      if (currentFilters.emptyPromise) activeEntries.push(['DF обіцянки', 'Пустий']);

      if (activeEntries.length === 0) {
        alert('Заповніть хоча б одне поле фільтрації, щоб зберегти шаблон!');
        return;
      }

      const preview = document.getElementById('template-conditions-preview');
      if (preview) {
        preview.innerHTML = activeEntries.map(([label, val]) => `
          <div class="flex justify-between items-center bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 text-xs">
            <span class="text-slate-400 font-medium">${label}:</span>
            <span class="font-semibold text-slate-800">${val}</span>
          </div>
        `).join('');
      }

      const nameInput = document.getElementById('input-template-name');
      if (nameInput) nameInput.value = '';
      if (typeof this.openModal === 'function') this.openModal('modal-save-template');
    });

    // 6. Збереження шаблону
    document.getElementById('form-save-template')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('input-template-name');
      const name = nameInput?.value.trim();
      if (!name) return;

      const newTemplate = {
        id: `tpl-${Date.now()}`,
        name: name,
        filters: this.getCurrentFilters()
      };

      this.filterTemplates.push(newTemplate);
      this.activeTemplateId = newTemplate.id;
      this.renderTemplatesList();
      if (typeof this.closeModal === 'function') this.closeModal('modal-save-template');
      this.triggerChange();
    });

    // 7. Списки шаблонів (Застосування, Перейменування, Видалення)
    document.getElementById('saved-templates-list')?.addEventListener('click', (e) => {
      const applyBtn = e.target.closest('.apply-template-btn');
      const deleteBtn = e.target.closest('.delete-template-btn');
      const editBtn = e.target.closest('.edit-template-btn');

      if (applyBtn) {
        const tplId = applyBtn.getAttribute('data-tpl-id');
        this.applyTemplate(tplId);
        return;
      }

      if (deleteBtn) {
        e.stopPropagation();
        const tplId = deleteBtn.getAttribute('data-tpl-id');
        this.deleteTemplate(tplId);
        return;
      }

      if (editBtn) {
        e.stopPropagation();
        const tplId = editBtn.getAttribute('data-tpl-id');
        const tpl = this.filterTemplates.find(t => t.id === tplId);
        if (!tpl) return;

        const editIdInput = document.getElementById('edit-template-id');
        const editNameInput = document.getElementById('input-edit-template-name');
        if (editIdInput) editIdInput.value = tpl.id;
        if (editNameInput) editNameInput.value = tpl.name;

        if (typeof this.openModal === 'function') this.openModal('modal-edit-template');
      }
    });

    // 8. Перейменування шаблону
    document.getElementById('form-edit-template')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-template-id')?.value;
      const newName = document.getElementById('input-edit-template-name')?.value.trim();

      const tpl = this.filterTemplates.find(t => t.id === id);
      if (tpl && newName) {
        tpl.name = newName;
        this.renderTemplatesList();
        this.updateActiveFiltersBar();
        if (typeof this.closeModal === 'function') this.closeModal('modal-edit-template');
      }
    });

    // 9. Додавання нового поля фільтрації
    document.getElementById('add-filter-btn')?.addEventListener('click', () => {
      const currentActiveFields = Array.from(document.querySelectorAll('.filter-row')).map(row => row.getAttribute('data-field'));
      const missingFields = this.availableFilterFields.filter(f => !currentActiveFields.includes(f.id));

      if (missingFields.length === 0) {
        alert('Усі доступні поля фільтрації вже додані!');
        return;
      }

      const missingFieldsList = document.getElementById('missing-fields-list');
      if (missingFieldsList) {
        missingFieldsList.innerHTML = missingFields.map(f => `
          <button type="button" class="select-field-to-add-btn w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 text-xs font-semibold transition cursor-pointer group" data-field-id="${f.id}">
            <div class="flex items-center gap-2">
              <i class="fa-solid ${f.icon} text-slate-400 group-hover:text-indigo-600 transition"></i>
              <span>${f.label}</span>
            </div>
            <i class="fa-solid fa-plus text-slate-300 group-hover:text-indigo-600 text-xs transition"></i>
          </button>
        `).join('');
      }

      if (typeof this.openModal === 'function') this.openModal('modal-add-filter-field');
    });

    document.getElementById('missing-fields-list')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.select-field-to-add-btn');
      if (!btn) return;

      const fieldId = btn.getAttribute('data-field-id');
      const container = document.getElementById('filter-fields-container');
      if (fieldId && this.fieldHTMLMap[fieldId]) {
        container?.insertAdjacentHTML('beforeend', this.fieldHTMLMap[fieldId]);
        btn.remove();
      }
    });

    // 10. Видалення рядка фільтра
    document.addEventListener('click', (e) => {
      const removeRowBtn = e.target.closest('.remove-filter-row-btn');
      if (removeRowBtn) {
        const row = removeRowBtn.closest('.filter-row');
        if (row) {
          row.remove();
          this.triggerChange();
        }
      }
    });

    // 11. Нижні кнопки модального вікна
    document.getElementById('clear-filter-fields-btn')?.addEventListener('click', () => {
      this.clearInputValues();
      this.activeTemplateId = null;
      this.renderTemplatesList();
      this.triggerChange();
    });

    document.getElementById('close-filter-btn')?.addEventListener('click', () => {
      this.resetModalFilters();
    });

    document.getElementById('apply-modal-filters')?.addEventListener('click', () => {
      this.triggerChange();
      this.toggleModal(false);
    });
  }
}
