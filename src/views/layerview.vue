<template>
	<div class="layerview">
		<div>
			<el-tree :data="get_configs" node-key="id" :props="default_props" draggable :default-expanded-keys="['node_root']"
			@node-drag-start="handle_start" @node-drag-end="handle_end" @node-drop="handle_drop" 
			:allow-drop="allow_drop" :allow-drag="allow_drag">
				<span class="custom-tree-node" slot-scope="{node,data}" >
					<template v-if="data.node_type==='根节点'">
						<span>{{node.label}}</span>
						<span>
							<el-button size="mini" type="text" icon="el-icon-copy-document" @click.stop="update_click()"></el-button>
							<el-button size="mini" type="text" icon="el-icon-plus" @click.stop="add_click(data)"></el-button>
						</span>
					</template>
					<template v-else-if="data.node_type==='一级目录'||data.node_type==='二级目录'">
						<span>{{node.label}}</span>
						<span>
							<el-button size="mini" type="text" icon="el-icon-edit" @click.stop="rename_click(data)"></el-button>
							<el-button size="mini" type="text" icon="el-icon-plus" @click.stop="add_click(data)"></el-button>
							<el-button size="mini" type="text" icon="el-icon-minus" @click.stop="delete_click(data)"></el-button>
						</span>
					</template>
					<template v-else-if="data.node_type==='叶子节点'" >
						<span>{{node.label}}</span>
						<span>
							<el-button size="mini" type="text" icon="el-icon-edit" @click.stop="rename_click(data)"></el-button>
							<el-button size="mini" type="text" icon="el-icon-minus" @click.stop="delete_click(data)"></el-button>
						</span>
					</template>
				</span>
			</el-tree>
		</div>
	</div>
</template>

<script>
	import addlayer from '@/components/layerview/addlayer.vue';
	import renamelayer from '@/components/layerview/renamelayer.vue';
	export default {
		name: 'layerview',
		data() {
			return {
				default_props:{
					children: 'children',
				    label: 'node_name'
				},
				start_node:"",
				end_node:"",
				message:""
			}
		},
		components:{
			addlayer,
			renamelayer,
		},
		//计算属性
		computed: {
			get_configs: function(){
				return this.$store.getters.get_layerview_tree_config;
			},
		},
		methods: {
			//添加节点
			add_click(post){
				var $this = this;
				//弹出对话框
				$this.$confirm(<addlayer ref='addlayer'/>, '添加节点', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal:false,
					beforeClose:function(action, instance, done){
						if(action==="close"){
							$this.$refs.addlayer.init_addlayer();
							done();
						}else if(action==="cancel"){
							$this.$refs.addlayer.init_addlayer();
							done();
						}else if(action==="confirm"){
							var taskRegex = /.*[^\s]/;
							if(!taskRegex.test($this.$refs.addlayer.node_name)){
								$this.myCommon.get_message("图层名称不能为空");
								return false;
							}
							if($this.$refs.addlayer.choose_radio=="节点"){
								if(!taskRegex.test($this.$refs.addlayer.layer_url)){
									$this.myCommon.get_message("图层地址不能为空");
									return false;
								}
							}
							//判断节点类型
							if(post.node_type=="根节点"){
								if($this.$refs.addlayer.choose_radio=="节点"){
									$this.myCommon.get_message("根节点下,不能提交节点表单");
									return false;
								}else{
									done();
								}
							}else if(post.node_type=="一级目录"){
								done();
							}else if(post.node_type=="二级目录"){
								if($this.$refs.addlayer.choose_radio=="目录"){
									$this.myCommon.get_message("二级目录下,不能提交目录表单");
									return false;
								}else{
									done();
								}
							}
						}
					}
				}).then(() => {
					let layer_config = $this.$store.getters.get_layerview_tree_config;
					let temp_datas = layer_config[0].children;
					let send_data={
						id:$this.myCommon.UUID(),
						node_name:$this.$refs.addlayer.node_name,
						parent_id:post.id,
						url_type:"",
						url:"",
						node_type:"",
						parent_node_type:post.node_type,
						is_leaf:false,
						layer_name:"",
						tile_matrix:"",
						order_code:"",
						opacity:100,
						opacity_flag:true,
						icon_size:10,
						icon_color:"#5193e8",
						icon_class:"supermapol-icons supermapol-icons-Oval",
						icon_image:"./supermap/purple.png",
						icon_radio:"矢量",
						children:[]
					}
					if(post.node_type=="根节点"){
						//只允许添加目录 构建数据模型
						send_data.node_type="一级目录";
						//获取排序码
						let sub_code="";
						if(temp_datas.length>0){
							sub_code = temp_datas[temp_datas.length-1].order_code;
						}else{
							sub_code = layer_config[0].order_code;
						}
						send_data.order_code = (((parseInt(sub_code.substring(0,4))+1)/10000).toString().split(".")[1])+sub_code.substring(4,12);
						
					}else if(post.node_type=="一级目录"){
						//允许添加目录和叶子节点
						if($this.$refs.addlayer.choose_radio=="目录"){
							send_data.node_type="二级目录";
							//获取排序码
							let sub_code="";
							for(let i=0;i<temp_datas.length;i++){
								if(temp_datas[i].id==post.id){
									if(temp_datas[i].children.length>0){
										
										sub_code = temp_datas[i].children[temp_datas[i].children.length-1].order_code;
									}else{
										sub_code = temp_datas[i].order_code;
									}
								}
							}
							send_data.order_code = sub_code.substring(0,4)+(((parseInt(sub_code.substring(4,8))+1)/10000).toString().split(".")[1])+"0000";
							
						}else if($this.$refs.addlayer.choose_radio=="节点"){
							send_data.node_type="叶子节点";
							send_data.is_leaf=true;
							send_data.url_type=$this.$refs.addlayer.layer_type_radio;
							send_data.url=$this.$refs.addlayer.layer_url;
							//获取排序码
							let sub_code="";
							for(let i=0;i<temp_datas.length;i++){
								if(temp_datas[i].id==post.id){
									if(temp_datas[i].children.length>0){
										sub_code = temp_datas[i].children[temp_datas[i].children.length-1].order_code;
									}else{
										sub_code = temp_datas[i].order_code;
									}
								}
							}
							send_data.order_code = sub_code.substring(0,4)+(((parseInt(sub_code.substring(4,8))+1)/10000).toString().split(".")[1])+"0000";
							
						}
					}else if(post.node_type=="二级目录"){
						//只允许添加叶子节点
						send_data.node_type="叶子节点";
						send_data.is_leaf=true;
						send_data.url_type=$this.$refs.addlayer.layer_type_radio;
						send_data.url=$this.$refs.addlayer.layer_url;
						//获取排序码
						let sub_code="";
						for(let i=0;i<temp_datas.length;i++){
							for(let j=0;j<temp_datas[i].children.length;j++){
								
								if(temp_datas[i].children[j].id==post.id){
									if(temp_datas[i].children[j].children.length>0){
										sub_code = temp_datas[i].children[j].children[temp_datas[i].children[j].children.length-1].order_code;
									}else{
										sub_code = temp_datas[i].children[j].order_code;
									}
								}
							}
						}
						send_data.order_code = sub_code.substring(0,8)+(((parseInt(sub_code.substring(8,12))+1)/10000).toString().split(".")[1]);
						
					}
					//插入节点
					$this.axios({
						method: 'post',
						url: $this.$store.getters.get_add_tree_url,
						data:send_data,
						headers:{'Content-Type': 'application/json; charset=utf-8'}
					}).then(function (result) {
						if(result.data.code==200){
							$this.myCommon.get_message(result.data.message);
							//添加至 当前图层树缓存配置
							$this.$store.commit("add_layers_tree_config",send_data);
							
						}else if(result.data.code==400){
							$this.myCommon.get_message(result.data.message);
						}
						
					}).catch(function(error){
						console.log(error);
					})
					//初始化添加表单
					$this.$refs.addlayer.init_addlayer();
				}).catch((e) => {
					console.log(e);
				});
				
			},
			//删除节点
			delete_click(post){
				var $this = this;
				this.$confirm('节点删除后不可恢复, 是否继续?', '删除节点', {
				    confirmButtonText: '确定',
				    cancelButtonText: '取消',
					closeOnClickModal:false,
				    type: 'warning'
				}).then(() => {
					//获取需要删除的节点id数组
					let ids=[];
					let layer_config = $this.$store.getters.get_layerview_tree_config;
					let temp_datas = layer_config[0].children;
					get_id([post]);
					function get_id(datas){
						for(let i=0;i<datas.length;i++){
							ids.push(datas[i].id)
							if(datas[i].children.length>0){
								get_id(datas[i].children)
							}
						}
					}
					$this.axios({
					    method: 'post',
					    url: $this.$store.getters.get_delete_tree_url,
						data:ids,
						headers:{'Content-Type': 'application/json; charset=utf-8'}
					}).then(function (result) {
						if(result.data.code==200){
							$this.myCommon.get_message(result.data.message);
							//删除当前图层树缓存配置
							$this.$store.commit("delete_layers_tree_config",post);
							
						}else if(result.data.code==400){
							$this.myCommon.get_message(result.data.message);
						}
					}).catch(function(error){
						console.log(error);
					})
				}).catch(() => {
					
				});
			},
			//重命名节点
			rename_click(post){
				var $this =this;
				//弹出对话框
				$this.$confirm(<renamelayer ref='renamelayer'/>, '重命名节点', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal:false,
					beforeClose:function(action, instance, done){
						if(action==="close"){
							$this.$refs.renamelayer.init_renamelayer();
							done();
						}else if(action==="cancel"){
							$this.$refs.renamelayer.init_renamelayer();
							done();
						}else if(action==="confirm"){
							var taskRegex = /.*[^\s]/;
							if(!taskRegex.test($this.$refs.renamelayer.node_name)){
								$this.myCommon.get_message("图层名称不能为空");
								return false;
							}else{
								done();
							}
						}
					}
				}).then(() => {
					let send_data={
						id:post.id,
						node_name:$this.$refs.renamelayer.node_name
					}
					$this.axios({
					    method: 'post',
					    url: $this.$store.getters.get_rename_tree_url,
						data:send_data,
						headers:{'Content-Type': 'application/json; charset=utf-8'}
					}).then(function (result) {
						if(result.data.code==200){
							$this.myCommon.get_message(result.data.message);
							post.node_name=send_data.node_name;
							
						}else if(result.data.code==400){
							$this.myCommon.get_message(result.data.message);
						}
					}).catch(function(error){
						console.log(error);
					})
					$this.$refs.renamelayer.init_renamelayer();
				}).catch((e) => {
					console.log(e);
				});
			},
			//拖拽开始 进入的函数
			handle_start(node,ev){
				this.start_node=node;
				/*
					1.拖拽开始 确定拖拽节点
					2.拖拽结束后,判断节点类型,如果为叶子节点,可以移动到一级目录和二级目录下,不能移动到根节点下(即跟一级目录平级)
					如果是一级目录和二级目录,可以移动到根节点和一级目录下,不能移动到二级目录下
					3.更新全树排序字段,parent_id 
				*/
			},
			//拖拽成功 进入的函数
			handle_drop(node,target_node,position,ev){
				// console.log("拖拽成功:"+target_node.data.node_type)
				// console.log(this.$store.getters.get_layerview_tree_config)
			},
			//拖拽结束 不管成功 失败 都会进入的函数
			handle_end(node,target_node,position,ev){
				var message = this.message;
				this.myCommon.get_message(message);
			},
			//拖拽时 判定目标节点 能否被放置
			allow_drop(node,target_node,position){
				//判断节点类型
				if(target_node.data.node_type=="根节点"){
					this.message="无法移出根节点";
					return false;
				}else if(node.data.node_type=="一级目录"){
					if(target_node.data.node_type=="二级目录"||target_node.data.node_type=="叶子节点"){
						this.message="一级目录无法降级";
						return false;
					}else if(target_node.data.node_type=="一级目录"&&position=="inner"){
						this.message="一级目录无法降级";
						return false;
					}else{
						this.message="一级目录平移成功";
						return true;
					}
				}else if(node.data.node_type=="二级目录"){
					if(target_node.data.node_type=="二级目录"&&position=="inner"){
						this.message="二级目录无法降级";
						return false;
					}else if(target_node.data.node_type=="叶子节点"){
						this.message="二级目录无法降级";
						return false
					}else{
						this.message="二级目录平移成功";
						return true;
					}
				}else if(node.data.node_type=="叶子节点"){
					if(target_node.data.node_type=="一级目录"){
						this.message="叶子节点无法升级为目录";
						return false;
					}else if(target_node.data.node_type=="叶子节点"&&position=="inner"){
						this.message="叶子节点无法降级";
						return false;
					}else{
						this.message="叶子节点平移成功";
						return true;
					}
				}else{
					return true;
				}
			},
			//判断节点 能否被拖拽
			allow_drag(node){
				if(node.data.node_type=="根节点"){
					this.myCommon.get_message("根节点无法拖拽");
					return false;
				}else{
					return true;
				}
			},
			//同步数据库
			update_click(){
				var $this =this;
				$this.$store.commit("set_loading",true);
				//修改node_type order_code parent_id parent_node_type
				let layer_config = $this.$store.getters.get_layerview_tree_config[0];
				resort(layer_config);
				function resort(configs){
					if(configs.children.length>0){
						for(let i=0;i<configs.children.length;i++){
							configs.children[i].parent_id = configs.id;
							configs.children[i].parent_node_type = configs.node_type;
							if(configs.node_type=="根节点"){
								configs.children[i].node_type="一级目录";
								configs.children[i].order_code=((parseInt(i+1)/10000).toString().split(".")[1])+"00000000";
							}else if(configs.node_type=="一级目录"){
								if(configs.children[i].is_leaf){
									configs.children[i].node_type="叶子节点";
								}else{
									configs.children[i].node_type="二级目录";
								}
								configs.children[i].order_code=configs.order_code.substring(0,4)+(((i+1)/10000).toString().split(".")[1])+"0000";
							}else if(configs.node_type=="二级目录"){
								configs.children[i].node_type="叶子节点";
								configs.children[i].order_code=configs.order_code.substring(0,8)+(((i+1)/10000).toString().split(".")[1]);
							}
							if(configs.children[i].children.length>0){
								resort(configs.children[i]);
							}
						}
					}
				}
				$this.axios({
				    method: 'post',
				    url: $this.$store.getters.get_update_tree_url,
					data:layer_config,
					headers:{'Content-Type': 'application/json; charset=utf-8'}
				}).then(function (result) {
					if(result.data.code==200){
						$this.myCommon.get_message(result.data.message);
						$this.$store.commit("set_loading",false);
					}else if(result.data.code==400){
						$this.myCommon.get_message(result.data.message);
					}
				}).catch(function(error){
					console.log(error);
				})
				console.log(layer_config);
			}
		},
	}
</script>

<style lang="less">
	//引入全局样式
	@import "../assets/less/style.less";
	
	.layerview{
		width:100%;
		height:100%;
		&>div{
			width:350px;
			height: 100%;
			overflow-y:auto;
			overflow-x: hidden;
			border-right:@common_border;
		}
	}
	// 图层树样式
	.el-tree-node__content{
		height: 45px!important;
		border-bottom: 1px solid #ccc;
	}
	.custom-tree-node{
		flex: 1;
		font-size: 15px;
		padding-right: 3%;
		@display_row_between();
	}
</style>
