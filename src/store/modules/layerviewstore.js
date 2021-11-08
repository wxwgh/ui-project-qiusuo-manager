//引入自定义通用方法脚本
import myCommon from '../../assets/plugins/common.js';
//引入axios
import axios from 'axios';
let host = "localhost:15000";
const layerview_store = {
	state: {
		config_url:"http://"+host+"/layertree_service/get_layertree_config",
		delete_url:"http://"+host+"/layertree_service/delete_layer_tree",
		add_url:"http://"+host+"/layertree_service/add_layer_tree",
		rename_url:"http://"+host+"/layertree_service/rename_layer_tree",
		update_url:"http://"+host+"/layertree_service/update_layer_tree",
		layers_tree_config:[],
		layer_index:0,
		loading:false
	},
	actions: {
		//初始化图层树配置
		init_layers_tree:function(context){
			axios({
			    method: 'get',
			    url: context.getters.get_layerview_url
			}).then(function (result) {
				context.commit("init_layers_tree",result.data);
			}).catch(function(error){
				console.log(error);
			})
		},
		
	},
	mutations: {
		set_loading(state,flag){
			state.loading=flag;
		},
		//初始化图层树配置
		init_layers_tree:function(state,value){
			state.layers_tree_config=value;
		},
		delete_layers_tree_config(state,post){
			var temp_datas = state.layers_tree_config[0].children;
			if(post.parent_node_type=="根节点"){
				for(let i=0;i<temp_datas.length;i++){
					if(temp_datas[i].id==post.id){
						temp_datas.splice(i,1);
					}
				}
			}else if(post.parent_node_type=="一级目录"){
				for(let i=0;i<temp_datas.length;i++){
					for(let j=0;j<temp_datas[i].children.length;j++){
						if(temp_datas[i].children[j].id==post.id){
							temp_datas[i].children.splice(j,1);
						}
					}
				}
			}else if(post.parent_node_type=="二级目录"){
				for(let i=0;i<temp_datas.length;i++){
					for(let j=0;j<temp_datas[i].children.length;j++){
						for(let x=0;x<temp_datas[i].children[j].children.length;x++){
							if(temp_datas[i].children[j].children[x].id==post.id){
								temp_datas[i].children[j].children.splice(x,1);
							}
						}
						
					}
				}
			}
		},
		add_layers_tree_config(state,post){
			var temp_datas = state.layers_tree_config[0].children;
			if(post.parent_node_type=="根节点"){
				temp_datas.push(post);
			}else if(post.parent_node_type=="一级目录"){
				for(let i=0;i<temp_datas.length;i++){
					if(temp_datas[i].id==post.parent_id){
						temp_datas[i].children.push(post);
					}
				}
			}else if(post.parent_node_type=="二级目录"){
				for(let i=0;i<temp_datas.length;i++){
					for(let j=0;j<temp_datas[i].children.length;j++){
						if(temp_datas[i].children[j].id==post.parent_id){
							temp_datas[i].children[j].children.push(post);
						}
					}
				}
			}
		}
	},
	getters:{
		get_layerview_tree_config: (state) => {
			return state.layers_tree_config;
		},
		get_layerview_url:function(state){
			return state.config_url;
		},
		get_delete_tree_url:function(state){
			return state.delete_url;
		},
		get_add_tree_url:function(state){
			return state.add_url;
		},
		get_rename_tree_url:function(state){
			return state.rename_url;
		},
		get_update_tree_url:function(state){
			return state.update_url;
		},
		get_loading:function(state){
			return state.loading;
		},
	}
}
export default layerview_store
