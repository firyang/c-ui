<template>
	<button class="v-button"
		:class="btnClass"
		:disabled="disabled"
		:type="nativeType"
		:autofocus="autofocus"
		@click="$emit('click',$event)"
		@focus="$emit('focus',$event)"
		@blur="$emit('blur',$event)">
		<v-icon :icon="icon"
			v-if="icon && !isRight"></v-icon>
		<v-icon icon="loading"
			v-if="loading"
			class="v-icon-loading"></v-icon>
		<span v-if="hasSlot">
			<slot></slot>
		</span>
		<v-icon :icon="icon"
			v-if="icon && isRight"></v-icon>
	</button>
</template>

<script>
export default {
	name: 'v-button',
	props: {
		size: String,
		type: String,
		plain: Boolean,
		round: Boolean,
		circle: Boolean,
		icon: String,
		iconPosition: String,
		disabled: Boolean,
		loading: Boolean,
		autofocus: Boolean,
		nativeType: String
	},
	computed: {
		btnClass() {
			let classes = []
			this.size && classes.push(`v-button-${this.size}`)
			this.type && classes.push(`v-button-${this.type}`)
			this.plain && classes.push(`is-plain`)
			this.round && classes.push(`is-round`)
			this.circle && classes.push(`is-circle`)
			this.disabled && classes.push(`is-disabled`)
			this.loading && classes.push(`is-loading`)
			return classes
		},
		hasSlot() {
			return this.$slots && this.$slots.default
		},
		isRight() {
			return this.iconPosition === 'right'
		}
	}
}
</script>

<style lang="scss">
@import '@/styles/_var.scss';
$height: 42px;
$color: #606266;
$border-color: #dcdfe6;
$background: #ecf5ff;
$active-color: #3a8ee6;

$disabled-color: #c0c4cc;
$disabled-border-color: #ebeef5;

$plain-map: (
	primary: $primary-plain,
	success: $success-plain,
	info: $info-plain,
	warning: $warning-plain,
	danger: $danger-plain
);

$disabled-map: (
	primary: $primary-disabled,
	success: $success-disabled,
	info: $info-disabled,
	warning: $warning-disabled,
	danger: $danger-disabled
);

.v-button {
	height: 42px;
	line-height: 42px;
	padding: 0 20px;
	color: $color;
	background: $basic-white;
	border: 1px solid $border-color;
	border-radius: $border-radius;
	font-size: 14px;
	font-weight: 500;
	text-align: center;
	white-space: nowrap;
	outline: none;
	appearance: none;
	user-select: none;
	transition: 0.1s;
	cursor: pointer;
	&:hover,
	&:focus {
		color: $active-color;
		border-color: $border-color;
		background-color: $background;
	}
	&:active {
		color: $active-color;
		border: 1px solid $active-color;
		background-color: $background;
		outline: none;
	}
	&.is-round {
		border-radius: 20px;
	}
	&.is-circle {
		border-radius: 50%;
		padding: 0 12px;
	}
	&.is-disabled,
	&.is-loading {
		cursor: not-allowed;
		color: #c0c4cc;
		border-color: #ebeef5;
		&:hover,
		&:active,
		&:focus {
			color: $disabled-color;
			background: $basic-white;
			border-color: $disabled-border-color;
		}
	}
	&.is-loading {
		cursor: default;
	}

	.v-icon + span {
		margin-left: 5px;
	}
	span + .v-icon {
		margin-left: 5px;
	}

	&-medium {
		padding: 0 20px;
		height: 36px;
		line-height: 36px;
	}
	&-small {
		padding: 0 15px;
		height: 32px;
		line-height: 32px;
		font-size: 12px;
	}
	&-mini {
		padding: 0 12px;
		height: 28px;
		line-height: 28px;
		font-size: 12px;
	}

	&-text,
	&-text:hover,
	&-text:focus,
	&-text:active,
	&-text.is-disabled,
	&-text.is-disabled:hover,
	&-text.is-disabled:focus,
	&-text.is-disabled:active {
		padding-left: 0;
		padding-right: 0;
		border-color: transparent;
		background: transparent;
	}

	@each $type, $color in (primary: $primary, success: $success, info: $info, warning: $warning, danger: $danger) {
		&-#{$type} {
			background: #{$color};
			border: 1px solid #{$color};
			color: $basic-white;
			fill: $basic-white;
			&.is-disabled,
			&.is-disabled:hover,
			&.is-disabled:focus,
			&.is-disabled:active,
			&.is-loading,
			&.is-loading:hover,
			&.is-loading:focus,
			&.is-loading:active {
				color: $basic-white;
				background: #{inspect(map-get($disabled-map, $type))};
				border-color: #{inspect(map-get($disabled-map, $type))};
			}
		}
		&-#{$type}.is-plain {
			color: $color;
			border-color: $color;
			background: #{inspect(map-get($plain-map, $type))};
			&.is-disabled,
			&.is-disabled:hover,
			&.is-disabled:focus,
			&.is-disabled:active,
			&.is-loading,
			&.is-loading:hover,
			&.is-loading:focus,
			&.is-loading:active {
				color: #{inspect(map-get($disabled-map, $type))};
				background: #{inspect(map-get($plain-map, $type))};
				border-color: #{inspect(map-get($disabled-map, $type))};
			}
		}
	}

	@each $type,
		$color
			in (
				primary: $primary-hover,
				success: $success-hover,
				info: $info-hover,
				warning: $warning-hover,
				danger: $danger-hover
			)
	{
		&-#{$type}:hover,
		&-#{$type}:focus {
			background: #{$color};
			border: 1px solid #{$color};
			color: $basic-white;
			fill: $basic-white;
		}
	}
	@each $type,
		$color
			in (
				primary: $primary-active,
				success: $success-active,
				info: $info-active,
				warning: $warning-active,
				danger: $danger-active
			)
	{
		&-#{$type}:active {
			background: #{$color};
			border: 1px solid #{$color};
			color: $basic-white;
			fill: $basic-white;
		}
	}
}
</style>