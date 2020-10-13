export default {
	library: {
		installed: {},
		lastLaunched: "",
		config: {
			"70": {
				steam: false,
				edited_dll: false,
				bxt: true,
				rinput: true,
				livesplit: false,
				args: ""
			},
			"50": {
				steam: false,
				bxt: true,
				rinput: true,
				livesplit: false,
				args: ""
			},
			"130": {
				steam: true,
				bxt: true,
				rinput: true,
				livesplit: false,
				args: ""
			}
		}
	},
	settings: {
		config: {
			language: 0,
			theme: 0,
			rpc: true,
			experimental: false
		}
	},
	scripts: {
		data: {
			games: {
				hl: {
					db: "goldsrc",
					store: {

					}
				},
				hlof: {
					db: "goldsrc",
					store: {

					}
				},
				hlbs: {
					db: "goldsrc",
					store: {

					}
				},
			},
			db: {
				goldsrc: {
					scripted: [
						{
							name: "Auto Bhop",
							selected: true,
							commands: [
								"bxt_autojump 1",
								"echo 1"
							]
						},
						{
							name: "Lambda Complex Boost",
							video: "labo.mp4",
							selected: true,
							aliases: [
								{
									name: "labo",
									command: "+jump; +duck; fps_max 30; cl_pitchup -90; cl_pitchdown 90; weapon_crowbar; w 1; weapon_handgrenade; +attack; w 20; -attack; w 10; -jump; cl_pitchup -70; cl_pitchdown 70; weapon_9mmAR; +attack2; w 20; -attack2; -duck; cl_pitchup 89.999; cl_pitchdown 89.999; fps_max 100"
								}
							],
							binds: [
								{
									key: "v",
									command: "labo"
								}
							],
							author: "LN4Rk0t1k#1766"
						},
						{
							name: "Gauss Boost 180°",
							selected: true,
							aliases: [
								{
									name: "_taubo",
									command: ""
								},
								{
									name: "_taubofunc",
									command: "cl_pitchup 180;cl_pitchdown -180;-attack2;wait;cl_pitchup 89;cl_pitchdown 89;force_centerview"
								},
								{
									name: "+tau",
									command: "+attack2;alias _taubo _taubofunc"
								},
								{
									name: "-tau",
									command: "_taubo;alias _taubo"
								}
							],
							binds: [
								{
									"key": "tab",
									"command": "+tau"
								}
							],
							author: "Parklez"
						},
						{
							name: "Water Boosting",
							video: "wabo.mp4",
							selected: true,
							aliases: [
								{
									name: "wabo1",
									command: "+duck; w; -duck; w"
								},
								{
									name: "wabo5",
									command: "wabo1; wabo1; wabo1; wabo1; wabo1"
								},
								{
									name: "wabo2000",
									command: "wabo5; wabo5; wabo5"
								},
								{
									name: "wabo35",
									command: "wabo1; wabo1; wabo1; wabo1; wabo1"
								},
								{
									name: "wabo50",
									command: "wabo2000; wabo2000"
								},
								{
									name: "wabo100",
									command: "wabo50; wabo50"
								},
								{
									name: "onwabo",
									command: "wabo2000; +jump; w10; -forward; bind space offwabo"
								},
								{
									name: "offwabo",
									command: "-jump; -duck; bind space +jump"
								}
							],
							binds: [
								{
									"key": "l",
									"command": "onwabo"
								}
							],
							author: "LN4Rk0t1k#1766"
						},
						{
							name: "Nihilanth Boost",
							video: "nihilanthboost.mp4",
							selected: true,
							aliases: [
								{
									name: "nihboost",
									command: "fps_max 30; +use; weapon_handgrenade; w 27; -forward; cl_pitchdown 90; cl_pitchup -90; w 5; weapon_9mmAR; +attack2; -use; +jump; +duck; w 5; -jump; cl_pitchup -45; cl_pitchdown 45; w 11; -attack2; -duck; cl_pitchup 89.999; cl_pitchdown 89.999; weapon_egon; weapon_9mmAR; fps_max 100"
								}
							],
							binds: [
								{
									"key": "n",
									"command": "nihboost"
								}
							],
							author: "LN4Rk0t1k#1766"
						},
						{
							name: "On A Rail Object Boosting",
							video: "obbo.mp4",
							selected: true,
							aliases: [
								{
									name: "foobbo",
									command: "+use;w 7;+attack2;-use;+jump;w 1;-attack2;-jump"
								}
							],
							binds: [
								{
									"key": "g",
									"command": "foobbo"
								}
							],
							author: "LN4Rk0t1k#1766"
						},
						{
							name: "Surface Tension Trigger Delay",
							video: "sttd.mp4",
							selected: true,
							aliases: [
								{
									name: "sttd",
									command: "sttd1"
								},
								{
									name: "sttd1",
									command: "fps_max 30; w 30; alias sttd sttd2; alias msttd +forward"
								},
								{
									name: "sttd2",
									command: "w 10; alias sttd sttd3; alias msttd +moveleft"
								},
								{
									name: "sttd3",
									command: "w 33; cl_pitchup 180; cl_pitchdown -179; w 5; cl_pitchup 0; cl_pitchdown 90; w 1; cl_pitchup 90; w 78; -moveleft; w 11; -forward; fps_max 100; +use; w 2; -use; weapon_crowbar; alias sttd sttd1"
								}
							],
							binds: [
								{
									"key": "7",
									"command": "sttd"
								},
								{
									"key": "6",
									"command": "msttd"
								}
							],
							author: "LN4Rk0t1k#1766"
						},
						{
							name: "Test Chamber Skip",
							video: "testchamber.mp4",
							selected: true,
							aliases: [
								{
									name: "cart",
									command: "preboost1"
								},
								{
									name: "pausespam",
									command: "w 1; unpause; w 1; setpause"
								},
								{
									name: "longpausespam",
									command: "pausespam; pausespam; pausespam; pausespam; pausespam; pausespam; pausespam"
								},
								{
									name: "preboost1",
									command: "fps_max 18; w 33; alias cart preboost2; alias mcart +right"
								},
								{
									name: "preboost2",
									command: "fps_max 18.244; w 5; fps_max 18; w 1; -right; alias cart preboost3; alias mcart +moveright"
								},
								{
									name: "preboost3",
									command: "+use; w 2; -use; w 12; -moveright; alias cart preboost4; alias mcart +left"
								},
								{
									name: "preboost4",
									command: "w 5; +use; w 1; -left; -use; fps_max 99; w 2; alias cart cartboost; alias mcart +moveright"
								},
								{
									name: "cartboost",
									command: "w 33; +use; w 3; speak weapons/explode5; setpause; longpausespam; unpause; -use; w 13; fps_max 30; w 9; alias cart cartfly; alias mcart +right"
								},
								{
									name: "cartfly",
									command: "w 5; -moveright; -right; alias cart cartlanding1; alias mcart +moveleft"
								},
								{
									name: "cartlanding1",
									command: "alias mcart +left; alias cart cartlanding2"
								},
								{
									name: "cartlanding2",
									command: "fps_max 28.7; w 16; -moveleft; w 32; -left; w 12; +bxt_tas_jumpbug; fps_max 10; w 4; -bxt_tas_jumpbug; fps_max 100; alias cart cartwindow; alias mcart +forward"
								},
								{
									name: "cartwindow",
									command: "w 30; -forward; alias cart preboost1"
								},
								{
									name: "tcreset",
									command: "fps_max 100; -forward; -moveright; -moveleft; -right; -left; exec hlsr.cfg"
								}
							],
							binds: [
								{
									"key": "0",
									"command": "cart"
								},
								{
									"key": "9",
									"command": "mcart"
								},
								{
									"key": "8",
									"command": "tcreset"
								}
							],
							author: "LN4Rk0t1k#1766"
						}
					],
					scriptless: [
						{
							name: "Basic Binds",
							selected: true,
							aliases: [
								{
									name: "start_run",
									command: "sv_cheats 0; exec autoexec.cfg; exec hlsr.cfg; bxt_hud_timer 1; map c1a0; bxt_timer_reset; bxt_timer_start; bxt_autorecord myrun"
								},
								{
									name: "show_crosshair",
									command: "load crosshair"
								},
								{
									name: "save_load",
									command: "save save_load; load save_load"
								}
							],
							binds: [
								{
									"key": "p",
									"command": "start_run"
								},
								{
									"key": "[",
									"command": "show_crosshair"
								},
								{
									"key": "v",
									"command": "save_load"
								},
								{
									"key": "f1",
									"command": "gl_texturemode GL_NEAREST_MIPMAP_NEAREST"
								},
								{
									"key": "f2",
									"command": "gl_texturemode GL_LINEAR_MIPMAP_LINEAR"
								},
								{
									"key": "mouse4",
									"command": "save quick"
								},
								{
									"key": "mouse5",
									"command": "load quick"
								}
							]
						},
						{
							name: "FPS Control",
							selected: true,
							binds: [
								{
									"key": "z",
									"command": "fps_max 20"
								},
								{
									"key": "x",
									"command": "fps_max 100"
								},
								{
									"key": "c",
									"command": "fps_max 8"
								},
								{
									"key": "capslock",
									"command": "fps_max 4"
								}
							]
						}
					]
				}
			}
		}
	}
};