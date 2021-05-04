export default [
  {
    id: "70",
    name: "Half-Life",
    info: {
      isStandalone: true,
      requiredGame: null,
      installPath: "",
      removePaths: ["Half-Life"],
      url: "https://hlsr.pro/downloadable/Half-Life.zip",
      sourceruns: "https://wiki.sourceruns.org/wiki/Category:Half-Life_1",
    },
  },
  {
    id: "50",
    name: "Half-Life: Opposing Force",
    info: {
      isStandalone: false,
      requiredGame: "70",
      installPath: "Half-Life",
      removePaths: ["Half-Life/gearbox", "Half-Life/gearbox_WON"],
      url: "https://hlsr.pro/downloadable/Opposing-Force.zip",
      sourceruns: "https://wiki.sourceruns.org/wiki/Category:Opposing_Force",
    },
  },
  {
    id: "130",
    name: "Half-Life: Blue Shift",
    info: {
      isStandalone: false,
      requiredGame: "70",
      installPath: "Half-Life",
      removePaths: ["Half-Life/bshift"],
      url: "https://hlsr.pro/downloadable/Blue-Shift.zip",
      sourceruns: "https://wiki.sourceruns.org/wiki/Category:Blue_Shift",
    },
  },
  {
    id: "220",
    name: "Half-Life 2",
    info: {
      isStandalone: true,
      requiredGame: null,
      installPath: "",
      removePaths: ["Half-Life 2"],
      url:
        "https://github.com/InfiniteC0re/HLSR/releases/download/HL2/Half-Life.2.zip",
      sourceruns: "https://wiki.sourceruns.org/wiki/Category:Half-Life_2",
    },
  },
  {
    id: "218",
    name: "Half-Life 2: Ghosting",
    info: {
      isStandalone: true,
      requiredGame: null,
      installPath: "",
      removePaths: ["Ghosting"],
      url:
        "http://194.87.95.20/games/Ghosting.zip",
      sourceruns: "https://wiki.sourceruns.org/wiki/Ghosting_mod",
    },
  },
];
