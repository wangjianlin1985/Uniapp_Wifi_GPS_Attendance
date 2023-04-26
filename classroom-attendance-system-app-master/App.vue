<script>
	export default {
		onLaunch: function() {
			this.$store.dispatch('user/autoLogin',this.$HOST)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uview-ui/index.scss';
</style>

<style>
	page{
		background-color: #f7f7fa;
	}
	view,text{
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}
	.text-no-wrap{
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.flex-center{
		justify-content: center;
		align-items: center;
	}
</style>
