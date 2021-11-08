<template>
	<div class="mymain">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'mymain',
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

	.mymain{
		flex:1;
		height:100%;
	}
</style>
