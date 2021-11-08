<template>
	<div id="app" v-loading.fullscreen.lock="get_loading" element-loading-text="同步中" 
	element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)">
		<!-- 左侧导航-->
		<mymenu></mymenu>
		<!-- 右侧内容主体-->
		<mymain></mymain>
	</div>
</template>
<script>
	import mymenu from '@/components/mymenu.vue';
	import mymain from '@/components/mymain.vue';
	export default {
		components: {
			mymenu,
			mymain,
		},
		data() {
			return {
			};
		},
		provide(){
			return {
				reload:this.reload
			}
		},
		mounted: function() {
			//更新左侧图层树配置
			this.init_layers_tree();
		},
		computed:{
			get_loading:function(){
				return this.$store.getters.get_loading;
			}
		},
		methods: {
			init_layers_tree(){
				//触发异步函数 初始化图层树配置
				this.$store.dispatch("init_layers_tree");
			}
		}
	};
</script>
<style lang="less">
	//引入全局样式
	@import "./assets/less/style.less";
	
	/* 初始化环境 */
	html,
	body {
		height: 100%;
		width: 100%;
		overflow: hidden;
		-webkit-user-select: none;
		font-size: 16px;
		color: #2c3e50;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-family:'PingFang';
		white-space:nowrap;
	}
	@font-face{font-family:'PingFang';src:url('./assets/fonts/PingFang.ttf') format('truetype');font-weight:normal;font-style:normal;}
	@font-face{font-family:'DS-Digital';src:url('./assets/fonts/DS-DIGIB.ttf') format('truetype');font-weight:normal;font-style:normal;}
	body {
		margin: 0;
		padding: 0;
		background: #fff;
	}

	body img {
		border: none;
		margin: 0;
		padding: 0;
	}

	div,
	h1,
	h2,
	h3,
	h4,
	p,
	form,
	label,
	input,
	textarea,
	img,
	span {
		margin: 0;
		padding: 0;
		word-break: break-all;
		word-wrap: break-word;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style-type: none;
		word-break: break-all;
		word-wrap: break-word;
	}

	dl,
	dt,
	dd {
		margin: 0;
		padding: 0;
		border: 0;
	}

	a {
		color: #5f6477;
		text-decoration: none;
	}

	a:hover {
		color: #5f6477;
		text-decoration: none;
	}

	:focus {
		outline: 0;
	}

	input,
	select {
		font-family: "微软雅黑";
	}

	/* 设置滚动条的样式 */
	::-webkit-scrollbar {
		width: 5px;
		height: 5px;
	}

	/* 滚动槽 */
	::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
		border-radius: 10px;
		background-color: #ddd;

	}

	/* 滚动条滑块 */
	::-webkit-scrollbar-thumb {
		border-radius: 10px;
		height: 5px;
		background: #777;
	}
	#app {
		height: 100%;
		width: 100%;
		position:relative;
		@display_row_start();
	}
	.el-loading-spinner i{
		color:#fff !important;
	}
	.el-loading-text{
		color:#fff !important;
	}
</style>
