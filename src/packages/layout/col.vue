<template>
	<div class="v-col"
		:class="colClass"
		:style="colStyle">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'v-col',
	data() {
		return {
			gutter: 0
		}
	},
	props: {
		span: {
			type: Number,
			default: 24
		},
		offset: {
			type: Number,
			default: 0
		},
		push: {
			type: Number,
			default: 0
		},
		pull: {
			type: Number,
			default: 0
		},
		xs: {
			type: [Number, Object]
		},
		sm: {
			type: [Number, Object]
		},
		md: {
			type: [Number, Object]
		},
		lg: {
			type: [Number, Object]
		},
		xl: {
			type: [Number, Object]
		}
	},
	computed: {
		colClass() {
			let classes = []
			classes.push(`v-col-${this.span}`)
			if (this.offset) {
				classes.push(`v-col-offset-${this.offset}`)
			}
			if (this.push) {
				classes.push(`v-col-push-${this.push}`)
			}
			if (this.pull) {
				classes.push(`v-col-pull-${this.pull}`)
			}
			;['xs', 'sm', 'md', 'lg', 'xl'].forEach(prop => {
				if (this[prop]) {
					if (typeof this[prop] === 'number') {
						classes.push(`v-col-${prop}-${this[prop]}`)
					} else {
						const { span, offset } = this[prop]
						classes.push(`v-col-${prop}-${span}`)
						classes.push(`v-col-${prop}-offset${offset}`)
					}
				}
			})
			return classes
		},
		colStyle() {
			let style = {}
			if (this.gutter) {
				style = {
					...style,
					paddingLeft: this.gutter / 2 + 'px',
					paddingRight: this.gutter / 2 + 'px'
				}
			}
			return style
		}
	}
}
</script>

<style lang="scss">
.v-col {
	position: relative;
}
@import '@/styles/_var.scss';

@for $i from 1 through 24 {
	.v-col-#{$i} {
		width: $i/24 * 100%;
	}
	.v-col-offset-#{$i} {
		margin-left: $i/24 * 100% +'px';
	}
	.v-col-push-#{$i} {
		left: $i/24 * 100%;
		z-index: 1;
	}
	.v-col-pull-#{$i} {
		right: $i/24 * 100%;
	}
}

$props: ('xs', 'sm', 'md', 'lg', 'xl');

@for $i from 1 through length($props) {
	$prop: nth($props, $i);
	@include res($prop) {
		@for $i from 1 through 24 {
			.v-col-#{$prop}-#{$i} {
				width: $i/24 * 100%;
			}
			.v-col-#{$prop}-offset-#{$i} {
				margin-left: $i/24 * 100%;
			}
		}
	}
}
</style>