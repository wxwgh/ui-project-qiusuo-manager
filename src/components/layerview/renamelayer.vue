<template>
	<el-input v-model="node_name" size="small" placeholder="节点名称" maxlength="10" show-word-limit class="interval_class"></el-input>
</template>

<script>
import $store from '@/store/index.js';
export default {
  name: 'renamelayer',
  data(){
    return {
		node_name:"",
	}
  },
  methods:{
	init_renamelayer(){
		this.node_name="";
	},
  },
}
</script>

<style lang="less">
	
</style>
