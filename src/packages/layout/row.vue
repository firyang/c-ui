<template>
	<div class="c-row"
		:style="rowStyle">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'c-row',
	componentName: 'c-row',
	props: {
		gutter: {
			type: Number,
			default: 0
		},
		justify: {
			type: String,
			default: 'start',
			validator(type) {
				if (
					type &&
					![
						'start',
						'end',
						'center',
						'space-around',
						'space-between'
					].includes(type)
				) {
					console.error(
						`justify 属性必须为：${[
							'start',
							'end',
							'center',
							'space-around',
							'space-between'
						].join('、')}`
					)
				}
				return true
			}
		},
		align: {
			type: String,
			default: 'top',
			validator: val => {
				if (!['top', 'middle', 'bottom'].includes(val)) {
					console.error(`align 属性必须为：top、middle、bottom`)
				}
				return true
			}
		}
	},
	computed: {
		rowStyle() {
			let style = {}
			if (this.gutter) {
				style = {
					...style,
					marginLeft: -this.gutter / 2 + 'px',
					marginRight: -this.gutter / 2 + 'px'
				}
			}
			if (this.justify) {
				let key = [
					'start',
					'end',
					'center',
					'space-around',
					'space-between'
				].includes(this.justify)
					? 'flex-' + this.justify
					: this.justify
				style = {
					...style,
					justifyContent: key
				}
			}
			if (this.align) {
				let key =
					this.align === 'middle'
						? 'center'
						: this.align === 'bottom'
						? 'flex-end'
						: undefined
				style = {
					...style,
					alignItems: key
				}
			}
			return style
		}
	},
	mounted() {
		this.$children.forEach(child => {
			child.gutter = this.gutter
		})
	}
}
</script>

<style lang="scss">
.c-row {
	display: flex;
	overflow: hidden;
	flex-wrap: wrap;
}
</style>