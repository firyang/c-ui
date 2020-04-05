<template>
	<section class="c-container"
		:class="{'is-vertical':isVertical}">
		<slot></slot>
	</section>
</template>

<script>
export default {
	name: 'c-container',
	data() {
		return {
			isVertical: true
		}
	},
	props: {
		direction: {
			type: String,
			validator: val => {
				if (!['vertical', 'horizontal'].includes(val)) {
					console.error(`direction属性必须为：vertical | horizontal`)
				}
				return true
			}
		}
	},
	mounted() {
		if (this.direction) {
			this.isVertical = this.direction === 'vertical'
		} else {
			this.isVertical = this.$children.some(child => {
				return ['c-header', 'c-footer'].includes(child.$options.name)
			})
		}
	}
}
</script>

<style lang="scss">
.c-container {
	display: flex;
	flex-direction: row;
	flex: 1;
	&.is-vertical {
		flex-direction: column;
	}
}
</style>