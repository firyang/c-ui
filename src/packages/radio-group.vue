<template>
	<div class="c-radio-group">
		<slot></slot>
		<input type="text"
			hidden
			v-model="value"
			:disabled="disabled">
	</div>
</template>

<script>
export default {
	name: 'c-radio-group',
	props: {
		value: [String, Number, Boolean],
		size: String,
		disabled: Boolean
	},
	created() {
		this.$on('handleChange', value => {
			this.$emit('input', value)
			this.$emit('change', value)
		})
	},
	mounted() {
		let children = this.$children
		if (this.size && children.length) {
			children.forEach(child => {
				child.size = this.size
			})
		}
	}
}
</script>

<style lang="scss">
.c-radio-group {
	display: inline-flex;
	vertical-align: middle;
}
</style>
