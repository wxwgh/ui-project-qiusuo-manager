import Vue from 'vue'
import Vuex from 'vuex'
//图层配置页面 全局对象
import layerviewstore from './modules/layerviewstore';
//数据配置页面 全局对象
import dataviewstore from './modules/dataviewstore';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
	},
	mutations: {},
	actions: {},
	modules: {
		layerviewstore:layerviewstore,
		dataviewstore:dataviewstore,
	}
})
