<template>
	<div :class="inputClass">
		<input v-if="type!=='textarea'"
			v-model="model"
			:type="elType"
			:placeholder="placeholder"
			:disabled="disabled"
			@blur="$emit('blur',$event)"
			@focus="$emit('focus',$event)"
			ref="input">
		<textarea v-else
			:type="type"
			v-model="model"
			:placeholder="placeholder"
			:disabled="disabled"
			:rows="rows"
			:cols="cols"
			@blur="$emit('blur',$event)"
			@focus="$emit('focus',$event)"></textarea>
		<v-icon icon="close-circle"
			v-if="showClear"
			@focus.prevent
			@click="handleClear"
			@mousedown.native.prevent
			class="v-input-clear" /> <!-- @mousedown.native.prevent  不会失去焦点 -->
		<v-icon icon="eye"
			v-if="elType!=='textarea'&&showPassword&&model"
			@click="handleShowPassword"
			@mousedown.native.prevent
			class="v-input-eye" />
		<v-icon v-if="elType!=='textarea'&&prefixIcon"
			:icon="prefixIcon"
			class="v-prefix-icon"
			@click="$emit('iconclick',$event)" />
		<v-icon v-if="elType!=='textarea' && suffixIcon"
			:icon="suffixIcon"
			class="v-suffix-icon"
			@click="$emit('iconclick',$event)" />
		<span class="v-prefix-slot"
			v-if="elType!=='textarea'&&$slots&&$slots.prefix">
			<slot name="prefix"></slot>
		</span>
		<span class="v-suffix-slot"
			v-if="elType!=='textarea'&&$slots&&$slots.suffix">
			<slot name="suffix"></slot>
		</span>
	</div>
</template>

<script>
export default {
	name: 'v-input',
	props: {
		type: {
			type: String,
			default: 'text'
		},
		value: [String, Number],
		placeholder: String,
		clearable: Boolean,
		showPassword: Boolean,
		disabled: Boolean,
		prefixIcon: String,
		suffixIcon: String,
		rows: { type: Number, default: 3 },
		cols: { type: Number, default: 50 },
		size: String
	},
	data() {
		return {
			isShow: false,
			elType: ''
		}
	},
	computed: {
		inputClass() {
			let classes = []
			this.type === 'textarea'
				? classes.push('v-textarea')
				: classes.push('v-input')
			this.disabled && classes.push('v-input-disabled')
			;(this.prefixIcon || (this.$slots && this.$slots.prefix)) &&
				classes.push('v-input-prefix-icon')
			;(this.suffixIcon || (this.$slots && this.$slots.suffix)) &&
				classes.push('v-input-suffix-icon')
			this.size &&
				this.type !== 'textarea' &&
				classes.push(`v-input-${this.size}`)
			return classes
		},
		model: {
			get() {
				return this.value
			},
			set(value) {
				this.$emit('input', value)
				this.$emit('change', value)
			}
		},
		showClear() {
			return this.showPassword ? false : this.clearable && this.model
		}
	},
	mounted() {
		this.elType = this.type
	},
	methods: {
		handleClear() {
			this.model = ''
			this.$emit('clear')
		},
		handleShowPassword() {
			this.elType = this.isShow ? 'password' : 'text'
			this.isShow = !this.isShow
		}
	}
}
</script>

<style lang="scss">
@import '../styles/_var';
.v-input {
	display: inline-flex;
	align-items: center;
	vertical-align: middle;
	position: relative;
	input {
		width: 180px;
		height: 42px;
		border-width: 1px;
		border-style: solid;
		border-color: $level1-border;
		border-radius: $border-radius;
		outline: none;
		padding: 0 15px;
		cursor: pointer;
		&:hover {
			border-color: $placeholder-font;
		}
		&:focus {
			border-color: $primary;
		}
	}
	&-prefix-icon {
		input {
			padding-left: 35px;
		}
		.v-prefix-slot {
			position: absolute;
			left: 12px;
		}
	}
	&-suffix-icon {
		input {
			padding-right: 35px;
		}
		.v-suffix-slot {
			position: absolute;
			right: 12px;
		}
	}
	.v-icon {
		color: $placeholder-font;
		cursor: pointer;
		:hover {
			color: $minor-font;
		}
	}
	.v-icon.v-prefix-icon {
		position: absolute;
		left: 12px;
	}
	.v-icon.v-suffix-icon,
	.v-icon.v-input-clear,
	.v-icon.v-input-eye {
		position: absolute;
		right: 12px;
	}
	&-medium {
		input {
			height: 36px;
		}
	}
	&-small {
		input {
			height: 32px;
		}
	}
	&-mini {
		input {
			height: 28px;
		}
	}
}
.v-textarea {
	display: inline-flex;
	vertical-align: middle;
	position: relative;
	textarea {
		line-height: 1.5;
		border-width: 1px;
		border-style: solid;
		border-color: $level1-border;
		border-radius: $border-radius;
		outline: none;
		padding: 5px 15px;
		&:hover {
			border-color: $placeholder-font;
		}
		&:focus {
			border-color: $primary;
		}
	}
}
.v-input-disabled {
	input,
	textarea {
		cursor: not-allowed;
		background-color: $level4-border;
	}
}
</style>