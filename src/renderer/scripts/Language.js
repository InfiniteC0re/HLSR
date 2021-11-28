import Store from "@/scripts/Store.js";
import StoreDefaults from "@/scripts/StoreDefaults.js";

const store = new Store({
  configName: "settings",
  defaults: StoreDefaults.settings,
});

class Localisation {
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
        "#UI_IN_LAUNCHER": "Playing %0%",
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
        "#UI_EXTERNAL_TOOLS": "Advanced Settings",
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
        "#UI_SNOW_THEME": "Snow Theme",
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
        "#UI_SCRIPT_SETTINGS":
          "Settings of the <b style='color:#00abff;'>%0%</b> script",
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
        "#UI_GRADIENT_THEME": "Gradient",
        "#UI_GOLDSRC": "GoldSrc Engine Games",
        "#UI_GAME_ALLCORES": "Use all of CPU cores",
        "#UI_GAME_PRIORITY": "Process Priority",
        "#UI_GAME_PRIORITY_NORMAL": "Normal",
        "#UI_GAME_PRIORITY_ABOVENORMAL": "Above normal",
        "#UI_GAME_PRIORITY_HIGH": "High",
        "#UI_GAME_PRIORITY_REALTIME": "Real Time",
        "#UI_GAME_PRIORITY_1C": "1 Core",
        "#UI_GAME_PRIORITY_2C": "2 Cores",
        "#UI_GAME_PRIORITY_3C": "3 Cores",
        "#UI_GAME_PRIORITY_4C": "4 Cores",
        "#UI_SOUNDCLOUD_SETTINGS": "SoundCloud Settings",
        "#UI_SOUNDCLOUD_SETTINGS_DESC":
          "Here you can paste an URL to any public SoundCloud track or playlist to load it in HLSR",
        "#UI_SOUNDCLOUD_PLAYLIST": "SoundCloud Link",
        "#UI_CUSTOMIZATION_BUTTON_SAVE": "Save",
        "#UI_CUSTOMIZATION_BUTTON_RESET": "Reset",
        "#UI_CUSTOMIZATION_MENU_BACKGROUNDS": "Menu Backgrounds",
        "#UI_CUSTOMIZATION_SKYBOXES": "Skyboxes",
        "#UI_CUSTOMIZATION_SCOPE_SETTINGS": "Crosshairs",
        "#UI_CUSTOMIZATION_HUD_SETTINGS": "HUD",
        "#UI_CUSTOMIZATION_LQ": "Standard Version",
        "#UI_CUSTOMIZATION_HD": "HD Version",
        "#UI_NO_TRACKS": "Updating songs",
        "#UI_CUSTOMIZATION_HUGE": "Bigger Version",
        "#UI_CUSTOMIZATION_SPRITES": "Item Sprites",
        "#UI_CUSTOMIZATION_Q3": "Q3 Styled",
        "#UI_NOTIFICATION_SAVED": "Saved!",
        "#UI_NOTIFICATION_INSTALLED": "Installed!",
        "#UI_NOTIFICATION_DONE": "Done!",
        "#UI_NOTIFICATION_REMOVED": "Removed!",
        "#UI_CANCEL": "Cancel",
        "#UI_NO_PARTICLES": "Disable particles",
        "#UI_ABOUT_PROGRAM": "About program",
        "#UI_DISCORD": "Discord",
        "#UI_IN_GAME": "In game",
        "#UI_STARTED": "Started",
        "#UI_SPENT_TIME": "%0% h.",
        "#UI_NO_TAG": "No tag",
        "#RPC_MLP": "Preparing for friendship",
        "#RPC_PLAYING": "Playing in %0%",
        "#RPC_DETAILS": "Preparing for speedrun",
        "#RPC_NOSTEAM": "Not connected",
        "#RPC_MUSIC": "Listening to music",
        "#RPC_WEBSITE": "Website",
        "#RPC_GET_FRIENDS": "Get some friends",
        "#MLP_URL": "https://www.youtube.com/user/mlpequestriagirls",
        "#UI_HL1MOVEMENT": "HL1 Movement Mod",
        "#UI_COMPACT_MODE": "Compact Mode",
        "#RESTART_APP": "Restart HLSR to apply settings!",
        "#UI_WELCOME_BACK": "Welcome Back!",
        "#UI_WELCOME_HLSR": "Welcome to HLSR!",
        "#NEW_UPDATE_INSTALLED": "New update successfully installed!",
        "#FOLDER_NOT_EMPTY": "The choosen folder isn't empty!",
        "#SELECT_LIBRARY_FOLDER": "Select games library folder",
        "#INSTALLATION_CANCELED": "The installation has been canceled",
        "#INSTALLATION_CYRILLIC": "Cyrillic symbols in the path are disallowed!",
        "#PATH_NOT_EXISTS": "Selected path does not exists!",
        "#ERROR_NO_WRITE_PERMISSIONS": "HLSR has no permissons to write in the choosen folder!",
        "#UI_SPACE_REQUIRED_AFTER": "Space required after install: ",
        "#UI_SPACE_REQUIRED_TO": "Space required to install the game: ",
        "#UI_FREE_SPACE": "Free space: ",
        "#UI_INSTALLING_GAME": "Installing game — ",
        "#UI_HLSR_LIB_WILL_BE_PLACED": "HLSR Library will be placed in:",
        "#UI_DOWNLOADABLE_CONTENT": "Downloadable content:",
        "#UI_LIVESPLIT": "LiveSplit with splits",
        "#UNABLE_TO_DOWNLOAD": "Unable to install %0% due to network error!",
        "#UI_STEAM_RECONNECT": "Reconnect to Steam",
        "#UI_MAKE_SHORTCUT": "Make a shortcut",
        "#CANT_START_GAME_NOSTEAM": "HLSR can't start a game without Steam connection",
        "#WAITING_FOR_STEAM": "Waiting for Steam connection to launch game...",
        "#REMOVE_GAMES_TO_CHANGE": "You can change the path only when no games are installed",
        "#SHORTCUT_LAUNCH": "Launch",
        "#UI_FOUND_CYRILLIC": "Found cyrillic symbols in game path. Work is not guaranteed",
        "#UI_FOUND_CYRILLIC_HINT": "Recommended to reinstall the game on another path",
        "#UI_ACRYLLIC_THEME": "Acryllic Background",
        "#UI_BLOBS_THEME": "Animated Background",
        "#UI_NO_LICENSE": "You don't have a license in Steam",
        "#UI_NO_STEAM": "Probably you haven't started Steam",
        "#UI_CHANGELOG_CONTENT": `<h4>Update from 06/14/2021 [v. 0.2.2]</h4>
<ul>
  <li>Added Half-Life 2 license checking Steam</li>
  <li>Fixed a bug when free disk space wasn't calculated on some PCs</li>
  <li>Fixed a bug with settings button of Quick Launch widget</li>
  <li>Data in the Script Editor are saved in memory when you go outside of the editor</li>
  <li>Added no game license warning</li>
  <li>New animated HLSR UI theme (works with GLSL so probably won't work everywhere)</li>
  <li>Steamworks module was replaced with HLSR Native</li>
  <li>Improved games license validation in Steam</li>
  <li>Steam friends will now be displayed regardless of the presence of an HL1 license</li>
  <li>HLSR is no more showing in Steam as Half-Life 1</li>
  <h3 style="margin:6px 0;">Developer Mode</h3>
  <li>Better files structure</li>
  <li>Removed HLSRC file extension support</li>
  <li>Added full HLSD file extension support</li>
  <li>HLSD files viewer</li>
  <li>HLSD file can store any media (audio, images, videos) and scripts in HLSC data type</li>
</ul><br/>
<h4>Update from 05/12/2021 [v. 0.2.1]</h4>
<ul>
  <li>Now HLSR can display more than just one notification</li>
  <li>Notifications can be closed with click now</li>
  <li>Wave effect isn't shows up on disabled buttons no more</li>
  <li>New game installer design</li>
  <li>Now you can change install directory of games (can be choosen only when no games are installed)</li>
  <li>HLSR won't allow you to install game when there's no free space on drive</li>
  <li>Game download won't stuck anymore</li>
  <li>HLSR always gonna be started as admin to make it working fine with files</li>
  <li>Compact mode is enabled by default now</li>
  <li>Now you can make shortcuts of games on your desktop</li>
  <li>Fixed bug when game screen didn't show up without Internet connection</li>
  <li>Update indicator is moved from Sidebar to window frame</li>
  <li>Added warning about cyrillic symbols in the game path</li>
  <li>Notification that says HLSR is not connected to Steam is hidden in compact mode and everywhere but not on home screen</li>
  <li>Now Steam connection indicator in compact mode is a button that can reconnect HLSR to Steam</li>
</ul><br/>
<h4>Update from 05/04/2021 [v. 0.2.0]</h4>
<ul>
  <li>New launcher loading screen</li>
  <li>Welcome message on loading screen</li>
  <li>You can't start HLSR twice at the time anymore</li>
  <li>Changelog will be automatically opened when new launcher updated will be installed</li>
  <li>Customization screen is more informative now</li>
  <li>Fixed Half-Life 2: Ghosting installation</li>
  <li>Updated "About program" section to has relevant info</li>
  <li>Fixed bug when Config Editor was bigger than launcher window</li>
  <li>Fixed Config Editors autocomplete and highlighting</li>
  <li>Fixed bug when Ghosting wasn't shown in Quick Launch</li>
</ul><br/>
<h4>Update from 05/03/2021 [v. 0.1.9]</h4>
<ul>
  <li>Compact UI Mode</li>
  <li>Compact UI mode are forced to be enabled on low resolution screens</li>
  <li>Half-Life 2: Ghosting Mod (HL1 Movement, Cutsceneless Mod)</li>
  <li>Little home screen UI updates</li>
  <li>SoundCloud Widget UI update</li>
  <li>Buttons click effect</li>
  <li>Game managment code optimization</li>
  <li>Now game screen in library is covering a window frame too</li>
  <li>Fixed images appearance in customization menu</li>
  <li>Fixed localisation bugs</li>
  <li>New notifications type</li>
  <li>Removed snow theme</li>
</ul><br/>
<h4>Update from 01/14/2021 [v. 0.1.8]</h4>
<ul>
  <li>Now you can see how much hours you spent in game</li>
  <li>Discord RPC status is changing when you start game</li>
  <li>Since this moment your Steam friends which using HLSR can see what game you're playing right now</li>
  <li>You can't start game twice per time anymore</li>
  <li>Offline Steam friends are hidden now</li>
  <li>Discord RPC buttons support</li>
</ul><br/>
<h4>Update from 01/13/2021 [v. 0.1.7]</h4>
<ul>
  <li>Quick Launch with process priority settings fix</li>
  <li>Now you can see what of your friends are using HLSR too</li>
  <li>Visual bug with black shadow on game screen was fixed</li>
  <li>Only one instance of launcher can be started at time</li>
  <li>Window size is restoring even after changing resolution to very low and back now</li>
  <li>Fixed bug when closing launcher while updating was the reason of error</li>
  <li>RInput and BunnymodXT start fixes</li>
  <li>Basic HLSRC support and icon</li>
  <li>Better Perfomance - changes in Steam friends getting algorithm</li>
  <li>Two versions of Snow theme (depending on your system time)</li>
  <li>Added default artwork for SoundCloud tracks without cover</li>
  <li>Secret MLP Mode with 2 new random themes and Discord RPC</li>
  <h4 style="margin:6px 0;">Developer Mode</h4>
  <li>Added toggle developer tools button</li>
  <li>Added HLSRC check button</li>
</ul><br/>
<h4>Update from 01/02/2021 [v. 0.1.5; v. 0.1.6]</h4>
<ul>
  <li>Half-Life 2 download fix</li>
  <li>Better rewind for SoundCloud tracks</li>
  <li>Now you can set your own track or playlist for SoundCloud Widget</li>
  <li>Half-Life removing bug fix</li>
  <li>Half-Life 2 installation fix</li>
</ul><br/>
<h4>Update from 12/31/2020 [v. 0.1.4]</h4>
<ul>
  <li>The open beta begins</li>
	<li>Half-Life 2</li>
	<li>Customization tab</li>
	<li>Ability to specify process priority and num of cores to use in game</li>
  <li>Snow particles (can be disabled in settings)</li>
	<li>Ability to reset scripts DB (needed when new update with new scripts comes out)</li>
	<li>Now you can open up game folder right in HLSR menu</li>
  <li>New UI themes</li>
	<li>No more Freelancer Theme (it's still presents, so who knows...)</li>
	<li>Updated SteamWorks module with some perfomance increase</li>
	<li>Fixed bug when save button in config editor wasn't working</li>
	<li>Some UI changes</li>
	<li>About program section</li>
  <li>SoundCloud improvements</li>
  <li>Mini notifications about program status</li>
</ul><br/>
<h4>Update from 08/15/2020 [v. 0.1.3]</h4>
<ul>
  <li>The closed beta begins</li>
	<li>Steam Intergrations works much faster now because of using native module</li>
	<li>More info about your Steam friends</li>
	<li>Script database refresh button in constructor</li>
	<li>Optimization adjustments</li>
	<li>Ability to rewind music in SoundCloud widget</li>
	<li>Fixed display of some components in the absence of the Internet</li>
	<li>The appearance of the changelog</li>
</ul>
`,
        "#UI_ABOUT_TITLE": `<span style="color:#00abff;font-weight:bold;font-size:18px">HLSR [v. ${
          require("../../../package.json").version
        }]</span>`,
        "#UI_ABOUT_CONTENT": `Developers: <span style="color:#ff492c">InfiniteC0re#7307</span>, <span style="color:#ffd45b">alsbykov#8131</span><br/>
Scripts: <span style="color:#97d4ff">N4Rk0t1k#0302</span>, <span style="color:#c3a4ff">Parklez</span><br/>
Help with UI design: <span style="color:#ac6cff">Дизайнер [bmd.GG]#9384</span><br/>
Project support: <span style="color:#b7ffaa">ALLAN#0012</span><br/><br/>
Used in launcher:
<ul>
  <li>GoldSrc Package 2.3</li>
  <li>Bunnymod XT</li>
  <li>LiveSplit</li>
  <li>Source Unpack</li>
  <li>Source Pause Tool</li>
  <li>Ghosting Mod</li>
  <li>Cutsceneless Mod</li>
  <li>HL1 Movement Mod</li>
  <li>SmartSteamEmu (to make Source SDK Base 2007 work properly)</li>
</ul>
`,
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
        "#UI_IN_LAUNCHER": "В %0%",
        "#UI_IN_HL": "Играет в Half-Life",
        "#UI_ONLINE": "В сети",
        "#UI_OFFLINE": "Не в сети",
        "#UI_PLAY": "Играть",
        "#UI_INSTALL": "Установить",
        "#UI_OVERVIEW": "Новости игры",
        "#UI_CONFIGURATOR": "Параметры",
        "#UI_WIKI": "SourceRuns Вики",
        "#UI_GAME_VERSION": "Выбор версии",
        "#UI_EDITED_DLL": "Изменённый WON DLL (НЕ для спидранов)",
        "#UI_EXTERNAL_TOOLS": "Дополнительные настройки",
        "#UI_START_ARGS": "Параметры запуска",
        "#UI_INTERFACE_SETTINGS": "Настройки интерфейса",
        "#UI_INTERFACE_LANGUAGE": "Язык интерфейса",
        "#UI_INTERFACE_THEME": "Оформление",
        "#UI_MISC_SETTINGS": "Прочие настройки",
        "#UI_DISCORD_RPC_SETTINGS": "Discord RPC статус",
        "#UI_EXPERIMENTAL_MODE_SETTINGS": "Экспериментальный режим",
        "#UI_ENGLISH": "Английский",
        "#UI_RUSSIAN": "Русский",
        "#UI_BLUE_THEME": "Синие цвета",
        "#UI_RED_THEME": "Красные цвета",
        "#UI_SNOW_THEME": "Снежная тема",
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
        "#UI_GRADIENT_THEME": "Градиент",
        "#UI_GOLDSRC": "Игры движка GoldSrc",
        "#UI_GAME_ALLCORES": "Использовать все ядра CPU",
        "#UI_GAME_PRIORITY": "Приоритет процесса",
        "#UI_GAME_PRIORITY_NORMAL": "Нормальный",
        "#UI_GAME_PRIORITY_ABOVENORMAL": "Выше среднего",
        "#UI_GAME_PRIORITY_HIGH": "Высокий",
        "#UI_GAME_PRIORITY_REALTIME": "Реального времени",
        "#UI_GAME_PRIORITY_1C": "1 ядро",
        "#UI_GAME_PRIORITY_2C": "2 ядра",
        "#UI_GAME_PRIORITY_3C": "3 ядра",
        "#UI_GAME_PRIORITY_4C": "4 ядра",
        "#UI_SOUNDCLOUD_SETTINGS": "Настройки SoundCloud",
        "#UI_SOUNDCLOUD_SETTINGS_DESC":
          "Здесь вы можете указать ссылку на трек или плейлист SoundCloud, чтобы сделать его основным в HLSR (только открытые треки или плейлисты)",
        "#UI_SOUNDCLOUD_PLAYLIST": "Ссылка на SoundCloud",
        "#UI_CUSTOMIZATION_BUTTON_SAVE": "Сохранить",
        "#UI_CUSTOMIZATION_BUTTON_RESET": "Сбросить",
        "#UI_CUSTOMIZATION_MENU_BACKGROUNDS": "Фоны меню",
        "#UI_CUSTOMIZATION_SKYBOXES": "Скайбоксы",
        "#UI_CUSTOMIZATION_SCOPE_SETTINGS": "Прицелы",
        "#UI_CUSTOMIZATION_HUD_SETTINGS": "HUD",
        "#UI_CUSTOMIZATION_LQ": "Стандартная версия",
        "#UI_CUSTOMIZATION_HD": "HD вариант",
        "#UI_NO_TRACKS": "Обновление треков",
        "#UI_NO_TAG": "Нет тега",
        "#UI_CUSTOMIZATION_HUGE": "Увеличенная версия",
        "#UI_CUSTOMIZATION_SPRITES": "Спрайты",
        "#UI_CUSTOMIZATION_Q3": "Q3 версия",
        "#UI_NOTIFICATION_SAVED": "Сохранено!",
        "#UI_NOTIFICATION_INSTALLED": "Установлено!",
        "#UI_NOTIFICATION_DONE": "Готово!",
        "#UI_NOTIFICATION_REMOVED": "Удалено!",
        "#UI_NO_PARTICLES": "Отключить частицы",
        "#UI_CANCEL": "Отменить",
        "#UI_ABOUT_PROGRAM": "О программе",
        "#UI_IN_GAME": "В игре",
        "#UI_STARTED": "Запущено",
        "#UI_SPENT_TIME": "%0% ч.",
        "#RPC_MLP": "Готовится к дружбе",
        "#RPC_PLAYING": "Играет в %0%",
        "#RPC_DETAILS": "Подготавливается к спидрану",
        "#RPC_NOSTEAM": "Не подключён",
        "#RPC_MUSIC": "Прослушивает треки",
        "#RPC_WEBSITE": "Вебсайт",
        "#RPC_GET_FRIENDS": "Завести друзей",
        "#MLP_URL": "https://www.youtube.com/channel/UCWaCaCyWgPk6uwKh66fl_0A",
        "#UI_HL1MOVEMENT": "Мод на движения из HL1",
        "#UI_COMPACT_MODE": "Компактный режим",
        "#UI_WELCOME_BACK": "Добро пожаловать назад!",
        "#UI_WELCOME_HLSR": "Добро пожаловать в HLSR!",
        "#RESTART_APP": "Перезапустите HLSR, чтобы применить настроки!",
        "#NEW_UPDATE_INSTALLED": "Новое обновление успешно установлено!",
        "#FOLDER_NOT_EMPTY": "Выбранная папка не пуста!",
        "#SELECT_LIBRARY_FOLDER": "Выберите папку для хранения игр",
        "#INSTALLATION_CANCELED": "Установка была отменена",
        "#INSTALLATION_CYRILLIC": "Символы кириллицы в пути запрещены!",
        "#PATH_NOT_EXISTS": "Выбранный путь недоступен!",
        "#ERROR_NO_WRITE_PERMISSIONS": "У HLSR нет прав на запись в выбранной папке!",
        "#UI_SPACE_REQUIRED_AFTER": "Требуемое место после установки: ",
        "#UI_SPACE_REQUIRED_TO": "Требуемое место для установки: ",
        "#UI_FREE_SPACE": "Свободно на диске: ",
        "#UI_INSTALLING_GAME": "Установка игры — ",
        "#UI_HLSR_LIB_WILL_BE_PLACED": "Библиотека HLSR будет находиться тут:",
        "#UI_DOWNLOADABLE_CONTENT": "В загруженном пакете будет:",
        "#UI_LIVESPLIT": "LiveSplit со сплитами",
        "#UNABLE_TO_DOWNLOAD": "Не удалось установить %0% из-за сетевой ошибки!",
        "#UI_STEAM_RECONNECT": "Переподключиться к Steam",
        "#UI_MAKE_SHORTCUT": "Создать ярлык",
        "#CANT_START_GAME_NOSTEAM": "HLSR не может запустить игру без связи со Steam",
        "#WAITING_FOR_STEAM": "Ожидание подключения Steam для запуска игры...",
        "#REMOVE_GAMES_TO_CHANGE": "Путь можно изменить только когда в лаунчере не установлена ни одна игра",
        "#SHORTCUT_LAUNCH": "Запустить",
        "#UI_FOUND_CYRILLIC": "По пути к игре найдена кириллица. Работа не гарантируется",
        "#UI_FOUND_CYRILLIC_HINT": "Рекоммендуется переустановить игру по другому пути",
        "#UI_ACRYLLIC_THEME": "Акрилловый фон",
        "#UI_BLOBS_THEME": "Анимированный фон",
        "#UI_NO_LICENSE": "У вас нет лицензии в Steam",
        "#UI_NO_STEAM": "Скорее всего, вы не запустили Steam",
        "#UI_CHANGELOG_CONTENT": `<h4>Обновление от 14.06.2021 [v. 0.2.2]</h4>
<ul>
  <li>Добавлена проверка наличия Half-Life 2 в Steam</li>
  <li>Исправлен баг с проверкой свободного места на некоторых ОС</li>
  <li>Исправлен баг с кнопкой параметров быстрого старта, когда при отсутствии игры кнопка работала</li>
  <li>Данные в редакторе скриптов теперь сохраняются при переходах</li>
  <li>Добавлены предупреждения о том, что в Steam нет лицензии игры</li>
  <li>Новая тема лаунчера, работающая на GLSL шейдерах (может работать не везде)</li>
  <li>Модуль Steamworks заменён на HLSR Native</li>
  <li>Улучшена проверка лицензий игр в Steam</li>
  <li>Друзья Steam теперь будут отображены вне зависимости от наличия лицензии какой-либо игры</li>
  <li>Теперь HLSR не отображается в Steam как Half-Life 1</li>
  <h3 style="margin:6px 0;">Режим разработчика</h3>
  <li>Разбиение кода по файлам</li>
  <li>Удалена поддержка расширения HLSRC</li>
  <li>Добавлена поддержка расширения HLSD</li>
  <li>Просмотрщик HLSD файлов</li>
  <li>HLSD файл может хранить в себе медиа файлы (аудио, изображения, видео), а также скрипты в виде HLSC данных</li>
</ul><br/>
<h4>Обновление от 12.05.2021 [v. 0.2.1]</h4>
<ul>
  <li>Теперь на экране может быть отображено более одного оповещения</li>
  <li>Оповещение может быть закрыто кликом</li>
  <li>Эффект волны больше не появляется при нажатии на нерабочую кнопку</li>
  <li>Новое оформление установщика игр</li>
  <li>Выбор пути установки игр (доступен только когда нет установленных игр)</li>
  <li>Теперь HLSR проверяет наличие свободного места на диске перед установкой игр</li>
  <li>Загрузка игры больше не должна застревать на одном месте при ошибке сети</li>
  <li>HLSR всегда будет запускаться от админа для корректной работы с файлами</li>
  <li>Компактный режим теперь по стандарту включён</li>
  <li>Добавлена возможность создавать ярлыки к играм на рабочем столе</li>
  <li>Исправлен баг, когда страница игры не открывалась без подключения к сети</li>
  <li>Индикатор обновления перемещён в область рамки окна</li>
  <li>Добавлено предупреждение о символах кириллицы в пути к игре</li>
  <li>Оповещение о невозможности подключения к Steam теперь скрыто в компактном режиме, а также вне домашней вкладки обычного режим</li>
  <li>Индикатор подключения к Steam в компактном режиме теперь служит кнопкой для переподключения</li>
</ul><br/>
<h4>Обновление от 04.05.2021 [v. 0.2.0]</h4>
<ul>
  <li>Новый загрузочный экран</li>
  <li>Приветственное сообщение на главном экране</li>
  <li>Отныне невозможно запустить два экземпляра программы одновременно</li>
  <li>После установки нового обновления ченжлог будет открываться сам</li>
  <li>Экран кастомизаций теперь более информативный</li>
  <li>Пофикшена установка Half-Life 2: Ghosting</li>
  <li>Открываемая папка игры Ghosting мода теперь зависит от того, включён ли HL1 Movement</li>
  <li>Обновлён раздел "О программе"</li>
  <li>Фикс бага редактора конфигов, когда он выплывал за экран</li>
  <li>Исправлена работа подсказок и подсвечивания текста в редакторе кода</li>
  <li>Исправлено отображение Ghosting мода в панеле быстрого запуска</li>
</ul><br/>
<h4>Обновление от 03.05.2021 [v. 0.1.9]</h4>
<ul>
  <li>Компактный режим</li>
  <li>Компактный режим невозможно отключить на экранах с низким разрешением</li>
  <li>Half-Life 2: Ghosting Mod (HL1 Movement, Cutsceneless Mod)</li>
  <li>Небольшое обновление интерфейса главного экрана</li>
  <li>Обновление интерфейса виджета SoundCloud</li>
  <li>Добавлены эффекты нажатия на кнопки</li>
  <li>Оптимизация кода управления играми</li>
  <li>Страница игры в лаунчере теперь покрывает и рамку</li>
  <li>фикс бага с отображением настроек кастомизации</li>
  <li>Фикс багов локализации</li>
  <li>Новый тип оповещений</li>
  <li>Удалена снежная тема</li>
</ul><br/>
<h4>Обновление от 14.01.2021 [v. 0.1.8]</h4>
<ul>
  <li>Теперь ты можешь увидеть сколько часов провёл в одной из игр</li>
  <li>Discord RPC статус изменяется при входе в игру</li>
  <li>Друзья в стиме, использующие HLSR, могут видеть игру, в которой ты</li>
  <li>Теперь нельзя запустить игру дважды за раз</li>
  <li>Оффлайн друзья Steam отныне скрыты</li>
  <li>Поддержка кнопок Discord RPC</li>
</ul><br/>
<h4>Обновление от 13.01.2021 [v. 0.1.7]</h4>
<ul>
  <li>Фикс кнопки быстрого запуска с настройкой приоритета процесса</li>
  <li>Теперь ты можешь увидеть, если твой друг из Steam использует HLSR</li>
  <li>Исправлен визуальный баг с чёрной тенью у экрана игры</li>
  <li>Только один экземпляр лаунчера может быть запущен в одно время</li>
  <li>Размер окна теперь восстанавливается после смены разрешения на очень низкое и обратно</li>
  <li>Фикс запуска RInput и BunnymodXT</li>
  <li>Исправлен баг, когда при закрытии лаунчера во время обновления появлялась ошибка</li>
  <li>Базовая поддержка HLSRC</li>
  <li>Улучшение производительности - изменения в алгоритме получения списка друзей Steam</li>
  <li>Две версии снежной темы (в зависимости от системного времени)</li>
  <li>Добавлены обложки по умолчанию для SoundCloud треков без них</li>
  <h3 style="margin:6px 0;">Режим разработчика</h3>
  <li>Кнопка переключения инструментов разработчика</li>
  <li>Кнопка проверки загруженного HLSRC</li>
</ul><br/>
<h4>Обновление от 02.01.2021 [v. 0.1.5; v. 0.1.6]</h4>
<ul>
  <li>Фикс загрузки Half-Life 2</li>
  <li>Улучшенная перемотка треков SoundCloud</li>
  <li>Возможность установить свой трек или плейлист в SoundCloud виджет</li>
  <li>Фикс бага с удалением Half-Life</li>
  <li>Фикс бага с установкой Half-Life 2 (была невозможна без установленной HL1)</li>
</ul><br/>
<h4>Обновление от 31.12.2020 [v. 0.1.4]</h4>
<ul>
  <li>Начало открытой беты</li>
  <li>Half-Life 2</li>
  <li>Вкладка кастомизаций</li>
  <li>Возможность указать количество ядер для процесса и его приоритет</li>
  <li>Снегопад (можно отключить в настройках)</li>
  <li>Возможность сбросить базу данных скриптов (нужно при выходе обновления с новыми скриптами)</li>
  <li>Теперь можно открыть папку игры прямо из лаунчера</li>
  <li>Новые темы оформления</li>
  <li>Теперь без темы Фрилансера (она все ещё есть, кто знает...)</li>
  <li>Обновление SteamWorks модуля (прирост в производительности)</li>
  <li>Фикс кнопки сохранения скрипта в редакторе конфига</li>
  <li>Обновления UI интерфейса</li>
  <li>Секция "О программе"</li>
  <li>Улучшения SoundCloud</li>
  <li>Мини оповещения о работе программы</li>
</ul><br/>
<h4>Обновление от 15.08.2020 [v. 0.1.3]</h4>
<ul>
	<li>Steam интеграции теперь работают в разы быстрее за счёт использования нативного модуля</li>
	<li>Более подробная информация о друзьях в стиме</li>
	<li>Кнопка обновления базы данных скриптов в конструкторе</li>
	<li>Обновления кода, связанные с оптимизацией работы программы</li>
	<li>Возможность перемотки музыки в SoundCloud виджете</li>
	<li>Фикс отображения некоторых компонентов при отсутствии Интернета</li>
	<li>Появление ченджлога</li>
</ul>
`,
        "#UI_ABOUT_TITLE": `<span style="color:#00abff;font-weight:bold;font-size:18px">HLSR [v. ${
          require("../../../package.json").version
        }]</span>`,
        "#UI_ABOUT_CONTENT": `Разработчики: <span style="color:#ff492c">InfiniteC0re#7307</span>, <span style="color:#ffd45b">alsbykov#8131</span><br/>
Скрипты: <span style="color:#97d4ff">N4Rk0t1k#0302</span>, <span style="color:#c3a4ff">Parklez</span><br/>
Помощь в UI дизайне: <span style="color:#ac6cff">Дизайнер [bmd.GG]#9384</span><br/>
Поддержка проекта: <span style="color:#b7ffaa">ALLAN#0012</span><br/><br/>
В лаунчере использовано:
<ul>
  <li>GoldSrc Package 2.3</li>
  <li>Bunnymod XT</li>
  <li>LiveSplit</li>
  <li>Source Unpack</li>
  <li>Source Pause Tool</li>
  <li>Ghosting Mod</li>
  <li>Cutsceneless Mod</li>
  <li>HL1 Movement Mod</li>
  <li>SmartSteamEmu (для работы Source SDK Base 2007)</li>
  <li>RInput</li>
</ul>
`,
      },
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
    if (this.localData[lang] && this.localData[lang][key])
      return this._parse(this.localData[lang][key], vars);
    if (this.localData["english"] && this.localData["english"][key])
      return this._parse(this.localData["english"][key], vars);
    return key;
  }
}

export default Localisation;