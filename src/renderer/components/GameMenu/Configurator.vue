<template>
	<div id="wrap">
		<div class="title">
			{{localization.get('#UI_CONFIGURATOR')}}
		</div>
		<div class="section" style="margin-top: 16px">{{localization.get('#UI_GAME_VERSION')}}</div>
		<div class="container">
			<md-radio v-model="version" @change="saveChoice" value="Steam">Steam</md-radio>
			<md-radio v-model="version" @change="saveChoice" :disabled="id == '130'" value="WON">WON</md-radio>
		</div>
		<div class="container">
			<md-switch v-model="edited_dll" @change="saveChoice" class="md-primary" :disabled="id != '70' || version == 'Steam'">{{localization.get('#UI_EDITED_DLL')}}</md-switch>
		</div>
		<div class="section">{{localization.get('#UI_EXTERNAL_TOOLS')}}</div>
		<div class="container">
			<md-checkbox v-model="bxt" @change="saveChoice" class="md-primary">Bunnymod XT</md-checkbox>
		</div>
		<div class="container">
			<md-checkbox v-model="livesplit" @change="saveChoice" class="md-primary">LiveSplit</md-checkbox>
		</div>
		<div class="container">
			<md-checkbox v-model="rinput" @change="saveChoice" class="md-primary">RInput</md-checkbox>
		</div>
		<div class="container" style="width: 100%; position: absolute; bottom: 0">
			<md-field>
				<label>{{localization.get('#UI_START_ARGS')}}</label>
				<md-input @change="saveChoice" v-model="args"></md-input>
			</md-field>
		</div>
	</div>
</template>

<script type="text/javascript">
	import Store from '../../utils/Store.js'
	import StoreDefaults from '../../utils/StoreDefaults.js'

	const store = new Store({
		configName: 'library',
		defaults: StoreDefaults.library
	});

	export default {
		name: "gamemenu-configurator",
		components: {},
		data() {
			return{
				bxt: false,
				livesplit: false,
				rinput: false,
				edited_dll: false,
				version: "Steam",
				args: "",
				localization: this.$parent.localization
			}
		},
		props: {
			id: {
				type: String,
				default: "no id specified"
			}
		},
		mounted() {
			let config = store.get('config')[this.id];
			this.bxt = config.bxt;
			this.livesplit = config.livesplit;
			this.rinput = config.rinput;
			if(config.steam) this.version = "Steam";
			else if(this.id != "130") 
				this.version = "WON";
			if(!config.steam && config.edited_dll && this.id == "70")
				this.edited_dll = true;
			this.args = config.args; 
		},
		methods: {
			saveChoice() {
				if(this.version == "Steam") this.edited_dll = false;
				let config = store.get('config');
				config[this.id].bxt = this.bxt;
				config[this.id].livesplit = this.livesplit;
				config[this.id].rinput = this.rinput;
				if(this.version == "Steam")
					config[this.id].steam = true;
				else
					config[this.id].steam = false;
				config[this.id].edited_dll = this.edited_dll;
				config[this.id].args = this.args;
				store.set('config', config);
			}
		}
	}
</script>

<style scoped>
	.title {
	    color: #00abff !important;
	    font-size: 20px !important;
	    font-weight: bold !important;
	    margin-left: 16px !important;
	}
	.section{
		margin-left: 16px;
		opacity: 0.2;
	}
	.container{
		margin-bottom: 0px;
		padding: 0 16px;
	}
	div#wrap {
		color: white;
	}
</style>