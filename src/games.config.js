export default [
  {
    id: "70",
    name: "Half-Life",
    iconFile: "hl1.ico",
    background: "half-life-background.jpg",
    needSteam: true,
    info: {
      isStandalone: true,
      requiredGame: null,
      installPath: "",
      uninstallPaths: ["Half-Life"],
      totalSize: 429,
      archiveSize: 227,
      features: [
        "#UI_WON",
        "#UI_STEAM",
        "Edited DLL with HUD settings",
        "Bunnymod XT",
        "#UI_LIVESPLIT",
        "RInput",
      ],
      archives: [
        "http://api2.hlsr.tk/downloads/Half-Life.zip",
      ],
      sourceruns: "https://wiki.sourceruns.org/wiki/Category:Half-Life_1",
      leaderboard: "https://www.speedrun.com/hl1",
    },
  },
  {
    id: "50",
    name: "Half-Life: Opposing Force",
    iconFile: "of.ico",
    background: "opposing-force-background.jpg",
    needSteam: true,
    info: {
      isStandalone: false,
      requiredGame: "70",
      installPath: "Half-Life",
      uninstallPaths: ["Half-Life/gearbox", "Half-Life/gearbox_WON"],
      totalSize: 513,
      archiveSize: 269,
      features: [
        "#UI_WON",
        "#UI_STEAM",
        "Bunnymod XT",
        "#UI_LIVESPLIT",
        "RInput",
      ],
      archives: [
        "http://api2.hlsr.tk/downloads/Opposing-Force.zip",
      ],
      sourceruns: "https://wiki.sourceruns.org/wiki/Category:Opposing_Force",
      leaderboard: "https://www.speedrun.com/op4",
    },
  },
  {
    id: "130",
    name: "Half-Life: Blue Shift",
    iconFile: "bs.ico",
    background: "blue-shift-background.jpg",
    needSteam: true,
    info: {
      isStandalone: false,
      requiredGame: "70",
      installPath: "Half-Life",
      uninstallPaths: ["Half-Life/bshift"],
      totalSize: 285,
      archiveSize: 168,
      features: ["#UI_STEAM", "Bunnymod XT", "#UI_LIVESPLIT", "RInput"],
      archives: [
        "http://api2.hlsr.tk/downloads/Blue-Shift.zip",
      ],
      sourceruns: "https://wiki.sourceruns.org/wiki/Category:Blue_Shift",
      leaderboard: "https://www.speedrun.com/bshift",
    },
  },
  {
    id: "220",
    name: "Half-Life 2",
    iconFile: "hl2.ico",
    background: "half-life-2-background.jpg",
    needSteam: true,
    info: {
      isStandalone: true,
      requiredGame: null,
      installPath: "",
      uninstallPaths: ["Half-Life 2"],
      totalSize: 3464,
      archiveSize: 1950,
      features: [
        "Source Unpack (New Engine)",
        "Source Pause Tool",
        "LiveSplit with splits",
        "RInput",
      ],
      archives: [
        "https://github.com/InfiniteC0re/HLSR/releases/download/HL2/Half-Life.2.zip",
      ],
      sourceruns: "https://wiki.sourceruns.org/wiki/Category:Half-Life_2",
      leaderboard: "https://www.speedrun.com/hl2",
    },
  },
  {
    id: "218",
    name: "Half-Life 2: Ghosting",
    iconFile: "hl2.ico",
    background: "half-life-2-ghosting-background.jpg",
    needSteam: true,
    info: {
      isStandalone: true,
      requiredGame: null,
      installPath: "",
      uninstallPaths: ["Ghosting"],
      totalSize: 5543,
      archiveSize: 1573,
      features: [
        "Ghosting Mod",
        "Cutsceneless Mod",
        "Half-Life 1 Movement Mod",
        "#UI_LIVESPLIT",
        "RInput",
      ],
      archives: [
        "https://github.com/InfiniteC0re/HLSR/releases/download/Ghosting/Ghosting_noEmu.7z",
      ],
      sourceruns: "https://wiki.sourceruns.org/wiki/Ghosting_mod",
      leaderboard: "https://www.speedrun.com/hl2ce",
    },
  },
];
