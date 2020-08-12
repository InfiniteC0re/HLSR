<template>
    <div id="wrap">
        <div id="form">
            <div class="title">{{localization.get('#UI_HOME')}}</div>
            <div id="grid">
                <div class="box quick-play">
                    <div class="mini-title">{{localization.get('#UI_QUICK_START')}}</div>
                    <div id="quick-play-list">
                        <div class="quick-play-game" @click.self="lastLaunchedGameStart">
                            <span class="quick-play-game-name">{{lastLaunchedGame}}</span>
                            <md-button :disabled="lastLaunchedGameButton" @click.stop="openPrefs" class="md-icon-button" style="margin-left: auto">
                                <md-icon class="fas fa-cog"></md-icon>
                            </md-button>
                        </div>
                    </div>
                </div>
                <div class="box box1">
                    <div class="mini-title">{{localization.get('#UI_STEAM_FRIENDS')}}</div>
                    <div class="center" v-if="this.steam_friends.length < this.steam_friend_count">
                        <md-empty-state
                          class="md-accent"
                          md-rounded
                          :md-description="localization.get('#UI_NO_FRIENDS')"
                          :md-size="200">
                        </md-empty-state>
                    </div>
                    <div id="friends_list" v-if="steam_friends.length >= steam_friend_count">
                        <SteamFriend v-for="friend in friends" :key="friend._id" :friend="friend"/>
                    </div>
                </div>
                <div class="box box3">
                    <div class="mini-title">{{localization.get('#UI_SOUNDCLOUD')}}</div>
                    <div class="player-info" v-if="song">
                        <div class="artwork" :style="soundcloudArtwork" :class="{'pause': playing}" @click="widget.toggle()"></div>
                        <div style="padding:8px;padding-bottom:0;display: flex;flex-direction: column;width:100%">
                            <div class="player-song">
                                <div class="song-name">{{song ? song.title : ""}}</div>
                                <div class="song-genre">{{song && song.genre ? song.genre : "No genre"}}</div>
                            </div>
                            <div style="margin-top: auto;">
                                <div class="time">
                                    <div>{{songPos}}</div>
                                    <div style="margin-left: auto">{{song ? toHHMMSS(song.duration / 1000) : "00:00"}}</div>
                                </div>
                                <div class="progress">
                                    <div class="bar" :style="bar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="player-songs" v-if="song">
                        <div class="player-songs-song" v-for="(val, index) in songsList" :key="val._id" v-if="val.title" @click="widget.skip(index)">
                            <div class="song-artwork" :style="{backgroundImage:`url(${val.artwork_url})`}"></div>
                            <div class="song-title">{{val.title}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Store from "../utils/Store.js";
    import SteamFriend from "./Home/SteamFriend"
    import StoreDefaults from "../utils/StoreDefaults.js";
    import HLSRConsole from "hlsr-console";

    const Console = new HLSRConsole();

    const store = new Store({
        configName: "library",
        defaults: StoreDefaults.library,
    });

    export default {
        name: "home-page",
        components: {SteamFriend},
        data() {
            return {
                iframeLoaded: false,
                steam_friends: [],
                friends: [],
                steam_friend_count: 666,
                steam_friends_counted: 0,
                localization: this.$parent.localization,
                interval: null,
                song: null,
                songPosRaw0: 0,
                songPosRaw1: 0,
                songPos: "00:00",
                widget: null,
                playing: false,
                songs: [],
                hlsrconsole: Console,
                posUpdater: null
            }
        },
        computed: {
            soundcloudArtwork() {
                return {
                    background: this.song && this.song.artwork_url ? `url(${this.song.artwork_url}` : `rgba(0, 0, 0, .4)`
                };
            },
            bar() {
                return {
                    width: `${this.song ? (this.songPosRaw1 * 100 / this.song.duration) : "0"}%`
                }
            },
            songsList() {
                return this.$parent.songs
            },
            lastLaunchedGame() {
                let id = store.get("lastLaunched");
                if(!this.checkInstalled(id)) return this.localization.get("#UI_RECENTGAME_NOGAME");

                switch(id) {
                    case "70": return "Half-Life"; break;
                    case "50": return "Half-Life: Opposing Force"; break;
                    case "130": return "Half-Life: Blue Shift"; break;
                    default: return this.localization.get("#UI_RECENTGAME_NOGAME"); break;
                }
            },
            lastLaunchedGameButton() {
                let id = store.get("lastLaunched");

                if(!this.checkInstalled(id)) return true;
                
                if(id.length > 0) return false
                else return true
            }
        },
        methods: {
            checkInstalled(appid) {
                let installed = store.get("installed");
                return Object.keys(installed).indexOf(appid) >= 0;
            },
            openPrefs() {
                let gameID = store.get("lastLaunched");
                this.$parent.$refs.navbar.goTo('game', {id: gameID, section: 1});
            },
            lastLaunchedGameStart() {
                let gameID = store.get("lastLaunched");
                let config = store.get("config");
                if (this.checkInstalled(gameID)) {
                    this.hlsrconsole.execute([
                    require("path").join(
                        require("electron").remote.app.getPath("userData"),
                        "library"
                    ),
                    gameID,
                    config[gameID].edited_dll ? "-dll" : "",
                    config[gameID].bxt ? "-bxt" : "",
                    config[gameID].rinput ? "-ri" : "",
                    config[gameID].livesplit ? "-livesplit" : "",
                    config[gameID].steam ? "-steam" : "",
                    config[gameID].args,
                    ]);
                }
            },
            checkState(friend) {
                if(friend.gameID == "70" && friend.RPC == "HLSR") return 0;
                if(friend.gameID == "70") return 1;
                if(friend.state > 0) return 2;
                return 3;
            },
            updateFriends() {
                this.steam_friends_counted++;
                if(this.steam_friends_counted != this.steam_friend_count) return;
                this.steam_friends.forEach(e => {
                    switch(this.checkState(e)) {
                        case 0:
                            e.text = this.localization.get('#UI_IN_LAUNCHER');
                            e.color = "steam-yellow";
                            e.prior = 3;   
                            break;
                        case 1:
                            e.text = this.localization.get('#UI_IN_HL');
                            e.color = "steam-blue";
                            e.prior = 2;
                            break;
                        case 2:
                            e.text = this.localization.get('#UI_ONLINE');
                            e.color = "steam-green";
                            e.prior = 1;
                            break;
                        case 3:
                            e.text = this.localization.get('#UI_OFFLINE');
                            e.color = "steam-white";
                            e.prior = 0;
                            break;
                    };
                    this.steam_friends.sort((a, b) => {
                        if (a.prior > b.prior)
                            return -1;
                        if (a.prior < b.prior)
                            return 1;
                        return 0;
                    });
                    this.friends = this.steam_friends.filter(x => {
                        return x.prior != 0
                    });
                });
            },
            setRPC(id) {
                this.steam_friends[id].RPC = "HLSR";
                this.updateFriends();
            },
            setHL(id) {
                this.steam_friends[id].gameID = "70";
                this.updateFriends();
            },
            toHHMMSS: (secs) => {
                var sec_num = parseInt(secs, 10)
                var hours   = Math.floor(sec_num / 3600)
                var minutes = Math.floor(sec_num / 60) % 60
                var seconds = sec_num % 60

                return [hours,minutes,seconds]
                    .map(v => v < 10 ? "0" + v : v)
                    .filter((v,i) => v !== "00" || i > 0)
                    .join(":")
            },
            initPlayer() {
                let ctx = this;
                var widget = SC.Widget(document.querySelector("#sc"));
                widget.bind(SC.Widget.Events.PLAY_PROGRESS, (e) => {
                    this.songPosRaw0 = e.currentPosition;
                });
                widget.bind(SC.Widget.Events.PLAY, (e) => {
                    this.playing = true;
                    this.posUpdater = setInterval(function(){
                        ctx.songPosRaw1 = ctx.songPosRaw0;
                        ctx.songPos = ctx.toHHMMSS(ctx.songPosRaw1 / 1000);
                    }, 1000);

                    widget.getCurrentSound(song => {
                        ctx.song = song;
                    });
                });
                widget.bind(SC.Widget.Events.PAUSE, (e) => {
                    this.playing = false;
                    widget.getCurrentSound(song => {
                        ctx.song = song;
                    });
                });

                widget.getCurrentSound(song => {
                    ctx.song = song;
                    console.log(this.song)
                });

                this.widget = widget;
            }
        },
        mounted() {
            var ctx = this;
            var sw = this.$parent.$sw;

            ctx.songs = this.$parent.songs;

            sw.addCallback("FriendCount", (e) => {
                this.steam_friend_count = e.count;
            });

            sw.addCallback("FriendGameInfo", (e) => {
                var exists = false;
                this.steam_friends.map(x => {
                    if(x.SteamID == e.SteamID) {
                        x.nickname = e.nickname;
                        x.gameID = e.gameID;
                        x.state = e.state;
                        exists = true;
                    }
                });

                if(exists) this.updateFriends();

                if(!exists) {
                    fetch(`https://steamcommunity.com/profiles/${e.SteamID}/?xml=1`)
                    .then(response => response.text())
                    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                    .then(data => {
                        e.avatar = data.querySelector("avatarFull").innerHTML.match(/<!\[CDATA\[([^\s]*)]]>/)[1];

                        this.steam_friends.push(e);
                        this.updateFriends();
                    });
                };
            });

            sw.command('GetFriendCount');
            if(this.$parent.steam)
                    sw.command('GetFriends');
            this.interval = setInterval(() => {
                if(this.$parent.steam && document.hasFocus()) {
                    this.steam_friends_counted = 0;
                    sw.command('GetFriends');
                }
            }, 5000);

            // SoundCloud

            SC.Widget(document.querySelector("#sc")).bind(SC.Widget.Events.READY, this.initPlayer);
        },
        beforeDestroy() {
            var sw = this.$parent.$sw;
            sw.removeCallback("FriendCount");
            sw.removeCallback("FriendGameInfo");

            clearInterval(this.interval);
            clearInterval(this.songsUpdater);

            this.widget.unbind(SC.Widget.Events.PLAY_PROGRESS);
            this.widget.unbind(SC.Widget.Events.PLAY);
            this.widget.unbind(SC.Widget.Events.PAUSE);
            this.widget.unbind(SC.Widget.Events.READY);
        }
    }
</script>

<style scoped>
    #grid{
        width: 100%;
        height: 100%;
        margin-top: 24px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(4, 1fr);
        grid-gap: 24px;
        min-height: 0;
    }

    .box{
        overflow: hidden;
        border-radius: 2px;
        background: rgba(0,0,0,.16);
        display: flex;
        flex-direction: column;
    }

    .quick-play{
        padding: 16px 0;
        grid-column: 1;
        grid-row: 1;
    }

    #quick-play-list{
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-items: center;
        margin-top: 16px;
        padding: 0 16px;
    }

    .quick-play-game{
        width: 100%;
        height: 47px;
        background-color: rgba(255,255,255,.06);
        transition: background-color 50ms ease-in-out;
        border-radius: 2px;
        overflow: hidden;
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .quick-play-game:hover{
        background-color: rgba(255,255,255,.12);
    }

    .box1{
        grid-row-start: 2;
        grid-row-end: 5;
        padding: 16px 0;
    }

    .box2{
        grid-row-start: 1;
        grid-row-end: 3;
        padding: 16px 0;
    }

    .box3{
        grid-column: 2;
        grid-row-start: 1;
        grid-row-end: 5;
        padding: 16px 0;
    }

    .mini-title{
        color: #fff !important;
        font-size: 20px;
        font-weight: bold;
        opacity: 0.2;
        margin: 0 16px;
    }

    #friends_list{
        height: 100%;
        margin-top: 16px;
        overflow: auto;
    }

    iframe{
        height: 100%;
    }

    .center{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: rgba(255,255,255,.4);
    }
    .quick-play-game-name{
        font-size: 18px;
        color: rgba(255,255,255,.7);
        margin-left: 16px;
    }
    .player-info{
        display: flex;
        padding: 16px;
    }
    .artwork{
        min-width: 96px;
        min-height: 96px;
        position: relative;
    }

    .artwork::after {
        font-family: "Font Awesome 5 Pro";
        font-weight: 900;
        font-size: 48px;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(0px);
        transition: color .2s, background .2s;
        color: transparent;
        cursor: pointer;
    }

    .artwork:hover::after{
        background: rgba(0,0,0,.4);
        color: rgba(255,255,255,.6);
    }

    .artwork:hover::after{
        content: "";
    }

    .artwork.pause:hover::after{
        content: "";
    }

    .player-song{
        margin-top: -8px;
        color: rgba(255,255,255,.4);
    }

    .progress{
        width: 100%;
        height: 4px;
        background: rgba(255,255,255,.1);
    }

    .progress .bar{
        height: 100%;
        width: 0;
        background: rgba(255,255,255,.2);
    }
    .time{
        color: rgba(255,255,255,.2);
        display: flex;
        margin-top: auto;
    }
    .song-genre{
        font-size: 13px;
        color: rgba(255,255,255,.2);
    }
    .player-songs{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: auto;
    }
    .player-songs-song{
        width: 100%;
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 4px 16px;
    }
    .player-songs-song:hover{
        background: rgba(255,255,255,.1);
    }
    .song-artwork{
        min-height: 32px;
        min-width: 32px;
        background-color: rgba(0,0,0,.4);
        background-position: center !important;
        background-size: cover !important;
    }
    .song-title {
        white-space: nowrap;
        color: rgba(255,255,255,.3);
        text-overflow: ellipsis;
        overflow: hidden;
        margin-left: 8px;
        align-items: center;
    }
    .song-name{
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
</style>