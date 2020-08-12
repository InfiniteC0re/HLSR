<template>
	<div class="steam-friend" :key="friend.SteamID">   
        <div class="steam-friend-avatar" :style="{background: `url(${friend.avatar})`}"></div>
        <div class="steam-friend-info">
        	<div class="steam-friend-name">{{friend.nickname}}</div>
            <div :class="['steam-friend-status', friend.color]">{{friend.text}}</div>
        </div>
        <div class="steam-friend-right" v-on:click="require('electron').shell.openExternal(`steam://friends/message/${friend.SteamID}`)">
        	<i class="fas fa-envelope"></i>
        	<md-tooltip>{{localization.get('#UI_SEND_MESSAGE')}}</md-tooltip>
    	</div>
    </div>
</template>

<script type="text/javascript">
    import localization from "@/utils/Language.js"

    const local = new localization();

	export default{
		name: "steam-friend",
		props: ['friend'],
        data: () => ({
            localization: local
        })
	}
</script>

<style scoped>
	.steam-friend{
        display: flex;
        align-items: center;
        height: 57px;
        padding: 0 16px;
    }

    .steam-friend:hover{
        background: rgba(0,0,0,.1);
    }

    .steam-friend-avatar{
        width: 44px;
        height: 44px;
        background: rgba(255,255,255,.2);
        background-position: center !important;
        background-size: cover !important;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(0,0,0,.3);
    }

    .steam-friend-info{
        color: rgb(240,240,240) !important;
        margin-left: 8px;
    }

    .steam-green{
        color: #28d04c;
    }

    .steam-yellow{
        color: #d0cb28;
    }

    .steam-blue{
        color: #28d0c0;
    }

    .steam-white {
        color: rgb(150,150,150);
    }

    .steam-friend-right{
        margin-left: auto;
        font-size: 20px;
        color: white;
        opacity: 0.2;
        cursor: pointer;
        transition: all 50ms ease-in-out;
    }

    .steam-friend-right:hover{
        opacity: 0.3;
    }
</style>