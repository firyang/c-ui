<template>
	<section class="v-container"
		:class="{'is-vertical':isVertical}">
		<slot></slot>
	</section>
</template>

<script>
export default {
	name: 'v-container',
	data() {
		return { isVertical: true }
	},
	props: {
		direction: {
			type: String,
			default: null,
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
				return ['v-header', 'v-footer'].includes(child.$options.name)
			})
		}
	}
}
</script>

<style lang="scss">
.v-container {
	display: flex;
	flex-direction: row;
	flex: 1;
	&.is-vertical {
		flex-direction: column;
	}
}
</style>