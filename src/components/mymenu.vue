<template>
	<el-menu default-active="/layerview" class="mymenu" router>
		<el-submenu index="1">
			<template slot="title">
				<i class="el-icon-setting"></i>
				<span slot="title">服务配置</span>
			</template>
			<el-menu-item-group>
			    <el-menu-item index="/layerview">
					<i class="el-icon-location"></i>
					<span slot="title">图层配置</span>
				</el-menu-item>
			    <el-menu-item index="/dataview">
					<i class="el-icon-s-marketing"></i>
					<span slot="title">数据配置</span>
				</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
		<el-submenu index="2">
			<template slot="title">
				<i class="el-icon-user-solid"></i>
				<span slot="title">用户配置(测试节点)</span>
			</template>
			<el-menu-item-group>
			    <el-menu-item index="2-1">
					<i class="el-icon-location"></i>
					<span slot="title">图层配置(测试节点)</span>
				</el-menu-item>
			    <el-menu-item index="2-2">
					<i class="el-icon-s-marketing"></i>
					<span slot="title">数据配置(测试节点)</span>
				</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
	</el-menu>
</template>

<script>
	export default {
		name: 'mymenu',
		data() {
			return {
			}
		},
		methods: {
			downLoadClick(post) {
			},
		},
	}
</script>

<style lang="less">
	.mymenu{
		width:300px;
		height:100%;
	}
	.el-menu-item-group__title{
		padding:0px !important;
	}
</style>
