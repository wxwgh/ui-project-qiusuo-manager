//引入自定义通用方法脚本
import myCommon from '../../assets/plugins/common.js';
const map_store = {

	state: {
		// 地图模块 全局map,底图layer,底图地址
		map:"",
		layer:"",
		url:"GaoDe.Normal.road"
	},
	actions: {},
	mutations: {
		set_map: (state, data) => {
			state.map = data;
		},
		set_layer: (state,data) => {
			state.layer = data;
		},
	},
	getters: {
		map: (state) => {
			return state.map;
		},
		map_url: (state) => {
			return state.url;
		},
	}
}
export default map_store
