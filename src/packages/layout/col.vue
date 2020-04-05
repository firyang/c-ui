<template>
	<div class="c-col"
		:class="colClass"
		:style="colStyle">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'c-col',
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
			classes.push(`c-col-${this.span}`)
			if (this.offset) {
				classes.push(`c-col-offset-${this.offset}`)
			}
			if (this.push) {
				classes.push(`c-col-push-${this.push}`)
			}
			if (this.pull) {
				classes.push(`c-col-pull-${this.pull}`)
			}
			;['xs', 'sm', 'md', 'lg', 'xl'].forEach(prop => {
				if (this[prop]) {
					if (typeof this[prop] === 'number') {
						classes.push(`c-col-${prop}-${this[prop]}`)
					} else {
						const { span, offset } = this[prop]
						classes.push(`c-col-${prop}-${span}`)
						classes.push(`c-col-${prop}-offset${offset}`)
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
.c-col {
	position: relative;
}
@import '@/styles/_var.scss';

@for $i from 1 through 24 {
	.c-col-#{$i} {
		width: $i/24 * 100%;
	}
	.c-col-offset-#{$i} {
		margin-left: $i/24 * 100% +'px';
	}
	.c-col-push-#{$i} {
		left: $i/24 * 100%;
		z-index: 1;
	}
	.c-col-pull-#{$i} {
		right: $i/24 * 100%;
	}
}

$props: ('xs', 'sm', 'md', 'lg', 'xl');

@for $i from 1 through length($props) {
	$prop: nth($props, $i);
	@include res($prop) {
		@for $i from 1 through 24 {
			.c-col-#{$prop}-#{$i} {
				width: $i/24 * 100%;
			}
			.c-col-#{$prop}-offset-#{$i} {
				margin-left: $i/24 * 100%;
			}
		}
	}
}
</style>