<template>
	<div class="addlayer_parent">
		<div class="choose_radio_parent interval_class">
			<el-radio v-model="choose_radio" label="目录" @change="choose_radio_change(choose_radio)">目录</el-radio>
			<el-radio v-model="choose_radio" label="节点" @change="choose_radio_change(choose_radio)">节点</el-radio>
		</div>
		<el-input v-model="node_name" size="small" placeholder="节点名称" maxlength="10" show-word-limit class="interval_class"></el-input>
		<el-input v-model="layer_url" size="small" :disabled="layer_url_show_flag" placeholder="服务地址" class="interval_class"></el-input>
		<div class="layer_type_radio_parent interval_class" v-if="!layer_url_show_flag">
			<el-radio v-model="layer_type_radio" label="supermap-rest" @change="radio_change()">supermap-rest</el-radio>
			<!-- <el-radio v-model="layer_type_radio" label="wms" @change="radio_change()">wms</el-radio> -->
			<!-- <el-radio v-model="layer_type_radio" label="wmts" @change="radio_change()">wmts</el-radio> -->
		</div>
	</div>
</template>

<script>
import $store from '@/store/index.js';
export default {
  name: 'addlayer',
  data(){
    return {
		node_name:"",
		layer_url:"",
		choose_radio:"目录",
		layer_type_radio:"supermap-rest",
		layer_url_show_flag:true,
	}
  },
  methods:{
	//目录 节点单选框事件
	choose_radio_change(value){
		if(value==="目录"){
			this.layer_url_show_flag=true;
			this.layer_url="";
		}else if(value=="节点"){
			this.layer_url_show_flag=false;
		}
	},
	init_addlayer(){
		this.node_name="";
		this.layer_url="";
		this.choose_radio="目录";
		this.layer_type_radio="supermap-rest";
		this.layer_url_show_flag=true;
	},
  },
}
</script>

<style lang="less">
	//引入全局样式
	@import "../../assets/less/style.less";
	
	.addlayer_parent{
		@display_column_start();
	}
	.interval_class{
		margin-top: 10px;
	}
</style>
