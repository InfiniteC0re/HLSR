import Store from '../utils/Store.js'
import StoreDefaults from '../utils/StoreDefaults.js'

const store = new Store({
    configName: 'settings',
    defaults: StoreDefaults.settings
});

class localization {
    constructor() {
        this.lang = store.get("config").language;
        this.localData = {
            english: {
                "#UI_HOME": "Home",
                "#UI_LIBRARY": "Library",
                "#UI_CUSTOMIZATION": "Customization",
                "#UI_SETTINGS": "Settings",
                "#UI_MENU_BACKGROUNDS": "Menu Backgrounds",
                "#UI_CROSSHAIR_SETTINGS": "Crosshair Settings",
                "#UI_HUD_SETTINGS": "HUD Settings",
                "#UI_SKYBOXES": "Skyboxes",
                "#UI_MODELS": "Models",
                "#UI_QUICK_START": "Quick Start",
                "#UI_STEAM_FRIENDS": "Steam Friends",
                "#UI_SEND_MESSAGE": "Send Message",
                "#UI_NO_FRIENDS": "No online Steam friends detected",
                "#UI_IN_LAUNCHER": "Playing HLSR",
                "#UI_IN_HL": "Playing Half-Life",
                "#UI_ONLINE": "Online",
                "#UI_OFFLINE": "Offline",
                "#UI_PLAY": "Play",
                "#UI_INSTALL": "Install",
                "#UI_OVERVIEW": "Game News",
                "#UI_CONFIGURATOR": "Configurator",
                "#UI_WIKI": "SourceRuns Wiki",
                "#UI_GAME_VERSION": "Version Selection",
                "#UI_EDITED_DLL": "Edited WON DLL (NOT for speedruns)",
                "#UI_EXTERNAL_TOOLS": "External Tools Settings",
                "#UI_START_ARGS": "Start Arguments",
                "#UI_INTERFACE_SETTINGS": "Interface Settings",
                "#UI_INTERFACE_LANGUAGE": "Interface Language",
                "#UI_INTERFACE_THEME": "Interface Theme",
                "#UI_MISC_SETTINGS": "Misc Settings",
                "#UI_DISCORD_RPC_SETTINGS": "Discord RPC Status",
                "#UI_EXPERIMENTAL_MODE_SETTINGS": "Experimental Mode",
                "#UI_ENGLISH": "English",
                "#UI_RUSSIAN": "Russian",
                "#UI_BLUE_THEME": "Blue Colors",
                "#UI_RED_THEME": "Red Colors",
                "#UI_LANCER_THEME": "Freelancer Theme",
                "#UI_STEAM_ERROR": "Unable to connect to Steam Network",
                "#UI_GAME_INSTALL": "Game Installation",
                "#UI_INSTALLATION": "%0% Installation",
                "#UI_SPACE_REQUIRED": "Space required: ",
                "#UI_NEXT": "Next",
                "#UI_INSTALL_SETTINGS": "Confirmation",
                "#UI_INSTALL_STATUS": "Status",
                "#UI_INSTALL_FINISH": "Finish",
                "#UI_PROGRESS": "Progress: ",
                "#UI_DOWNLOADING": "Downloading...",
                "#UI_EXTRACTING": "Extracting...",
                "#UI_NOTIFICATION_INSTALLED": "Game %0% has been installed!",
                "#UI_WON": "WON Version",
                "#UI_STEAM": "Steam Version",
                "#UI_RETRY": "Retry",
                "#UI_DONE": "Done",
                "#UI_CONFIGS": "Configurations",
                "#UI_CONFIGS_CONSTRUCTOR": "Constructor",
                "#UI_CONFIGS_ADVANCED": "Editor",
                "#UI_RPC_DETAILS": "Preparing for speedrun",
                "#UI_RPC_NOSTEAM": "Not connected",
                "#UI_RPC_MUSIC": "Listening to some music",
                "#UI_SCRIPT_SETTINGS": "Settings of the <b style='color:#00abff;'>%0%</b> script",
                "#UI_SCRIPT_SCRIPTLESS": "Scriptless Category",
                "#UI_SCRIPT_SCRIPTED": "Scripted Category",
                "#UI_SCRIPT_BINDS": "Binds",
                "#UI_SCRIPT_GENERATE": "Install",
                "#UI_SCRIPT_SAVE": "Save to File",
                "#UI_SCRIPT_KEY": "Key",
                "#UI_SCRIPT_COMMAND": "Command",
                "#UI_UNINSTALL": "Uninstall",
                "#UI_EDITOR_OPEN": "Open File",
                "#UI_EDITOR_SAVE": "Save File",
                "#UI_EDITOR_HINTS": "Display Hints",
                "#UI_SOUNDCLOUD": "SoundCloud Widget",
                "#UI_UPDATE_DOWNLOADING": "Downloading an update...",
                "#UI_UPDATE_READY": "Restart to update",
                "#UI_RECENTGAME_NOGAME": "No game",
                "#UI_IN_OTHER_GAME": "Playing other game",
                "#UI_NO_INTERNET": "No Internet connnection",
                "#UI_SCRIPT_UPDATE": "Update scripts DB",
                "#UI_CHANGELOG": "Changelog",
                "#UI_GAME_FOLDER": "Open Game Folder",
                "#UI_GRADIENT_THEME": "Default",
                "#UI_CHANGELOG_CONTENT": `<h4>Update from 08/15/2020 [0.1.3]</h4>
<ul>
	<li>Steam Intergrations works much faster now because of using native module</li>
	<li>More info about your Steam friends</li>
	<li>Script database refresh button in constructor</li>
	<li>Optimization adjustments</li>
	<li>Ability to rewind music in SoundCloud widget</li>
	<li>Fixed display of some components in the absence of the Internet</li>
	<li>The appearance of the changelog</li>
</ul>
`
            },
            russian: {
                "#UI_HOME": "Главная",
                "#UI_LIBRARY": "Библиотека",
                "#UI_CUSTOMIZATION": "Кастомизация",
                "#UI_SETTINGS": "Настройки",
                "#UI_MENU_BACKGROUNDS": "Фоны меню",
                "#UI_CROSSHAIR_SETTINGS": "Настройки прицела",
                "#UI_HUD_SETTINGS": "Настройки HUD'a",
                "#UI_SKYBOXES": "Скайбоксы",
                "#UI_MODELS": "Модели",
                "#UI_QUICK_START": "Быстрый запуск",
                "#UI_STEAM_FRIENDS": "Друзья в стиме",
                "#UI_SEND_MESSAGE": "Отправить сообщение",
                "#UI_NO_FRIENDS": "Не найдено онлайн друзей в стиме",
                "#UI_IN_LAUNCHER": "Играет через HLSR",
                "#UI_IN_HL": "Играет в Half-Life",
                "#UI_ONLINE": "В сети",
                "#UI_OFFLINE": "Не в сети",
                "#UI_PLAY": "Играть",
                "#UI_INSTALL": "Установить",
                "#UI_OVERVIEW": "Новости игры",
                "#UI_CONFIGURATOR": "Настройки",
                "#UI_WIKI": "SourceRuns Вики",
                "#UI_GAME_VERSION": "Выбор версии",
                "#UI_EDITED_DLL": "Изменённый WON DLL (НЕ для спидранов)",
                "#UI_EXTERNAL_TOOLS": "Настройки внешних инструментов",
                "#UI_START_ARGS": "Параметры запуска",
                "#UI_INTERFACE_SETTINGS": "Настройки интерфейса",
                "#UI_INTERFACE_LANGUAGE": "Язык интерфейса",
                "#UI_INTERFACE_THEME": "Оформление",
                "#UI_MISC_SETTINGS": "Прочие настройки",
                "#UI_DISCORD_RPC_SETTINGS": "Discord RPC статус",
                "#UI_EXPERIMENTAL_MODE_SETTINGS": "Экспериментальный режим",
                "#UI_ENGLISH": "Английский",
                "#UI_RUSSIAN": "Русский",
                "#UI_BLUE_THEME": "Синий тон",
                "#UI_RED_THEME": "Красный тон",
                "#UI_LANCER_THEME": "Тема Фрилансера",
                "#UI_STEAM_ERROR": "Невозможно подключиться к сети Steam",
                "#UI_GAME_INSTALL": "Установка игры",
                "#UI_INSTALLATION": "Установка %0%",
                "#UI_SPACE_REQUIRED": "Места необходимо: ",
                "#UI_NEXT": "Дальше",
                "#UI_INSTALL_SETTINGS": "Подтверждение",
                "#UI_INSTALL_STATUS": "Статус",
                "#UI_INSTALL_FINISH": "Завершение",
                "#UI_PROGRESS": "Прогресс: ",
                "#UI_DOWNLOADING": "Скачивание...",
                "#UI_EXTRACTING": "Распаковка...",
                "#UI_NOTIFICATION_INSTALLED": "Игра %0% была установлена!",
                "#UI_WON": "WON издание",
                "#UI_STEAM": "Steam издание",
                "#UI_RETRY": "Переподключиться",
                "#UI_DONE": "Готово",
                "#UI_CONFIGS": "Конфигурации",
                "#UI_CONFIGS_CONSTRUCTOR": "Конструктор",
                "#UI_CONFIGS_ADVANCED": "Редактор",
                "#UI_RPC_DETAILS": "Подготавливается к спидрану",
                "#UI_RPC_NOSTEAM": "Не подключён",
                "#UI_RPC_MUSIC": "Прослушивает треки",
                "#UI_SCRIPT_SETTINGS": "Настройки скрипта %0%",
                "#UI_SCRIPT_SCRIPTLESS": "Scriptless категория",
                "#UI_SCRIPT_SCRIPTED": "Scripted категория",
                "#UI_SCRIPT_BINDS": "Бинды",
                "#UI_SCRIPT_GENERATE": "Установить",
                "#UI_SCRIPT_SAVE": "Сохранить в файл",
                "#UI_SCRIPT_KEY": "Кнопка",
                "#UI_SCRIPT_COMMAND": "Команда",
                "#UI_UNINSTALL": "Удалить",
                "#UI_EDITOR_OPEN": "Открыть файл",
                "#UI_EDITOR_SAVE": "Сохранить файл",
                "#UI_EDITOR_HINTS": "Показать подсказки",
                "#UI_SOUNDCLOUD": "SoundCloud Виджет",
                "#UI_UPDATE_DOWNLOADING": "Загрузка обновления...",
                "#UI_UPDATE_READY": "Требуется перезапуск",
                "#UI_RECENTGAME_NOGAME": "Нет игры",
                "#UI_IN_OTHER_GAME": "В другой игре",
                "#UI_NO_INTERNET": "Нет подключения к Интернету",
                "#UI_SCRIPT_UPDATE": "Обновить базу скриптов",
                "#UI_CHANGELOG": "Что нового?",
                "#UI_GAME_FOLDER": "Открыть папку с игрой",
                "#UI_GRADIENT_THEME": "Стандартная",
                "#UI_CHANGELOG_CONTENT": `<h4>Обновление от 15.08.2020 [0.1.3]</h4>
<ul>
	<li>Steam интеграции теперь работают в разы быстрее за счёт использования нативного модуля</li>
	<li>Более подробная информация о друзьях в стиме</li>
	<li>Кнопка обновления базы данных скриптов в конструкторе</li>
	<li>Обновления кода, связанные с оптимизацией работы программы</li>
	<li>Возможность перемотки музыки в SoundCloud виджете</li>
	<li>Фикс отображения некоторых компонентов при отсутствии Интернета</li>
	<li>Появление ченджлога</li>
</ul>
`
            }
        };
    }

    update() {
        this.lang = store.get("config").language;
    }

    _parse(str, vars) {
        for (let i = 0; i < vars.length; i++) {
            let val = vars[i];
            return str.replace(`%${i}%`, val);
        }
        return str;
    }

    get(key, ...vars) {
        let lang = this.lang;
        if (lang == 0) lang = "english";
        if (lang == 1) lang = "russian";
        if (this.localData[lang] && this.localData[lang][key]) return this._parse(this.localData[lang][key], vars);
        if (this.localData['english'] && this.localData['english'][key]) return this._parse(this.localData['english'][key], vars);
        return key;
    }
};

export default localization;