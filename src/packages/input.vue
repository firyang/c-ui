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
		<c-icon icon="close-circle"
			v-if="showClear"
			@focus.prevent
			@click="handleClear"
			@mousedown.native.prevent
			class="c-input-clear" /> <!-- @mousedown.native.prevent  不会失去焦点 -->
		<c-icon icon="eye"
			v-if="elType!=='textarea'&&showPassword&&model"
			@click="handleShowPassword"
			@mousedown.native.prevent
			class="c-input-eye" />
		<c-icon v-if="elType!=='textarea'&&prefixIcon"
			:icon="prefixIcon"
			class="c-prefix-icon"
			@click="$emit('iconclick',$event)" />
		<c-icon v-if="elType!=='textarea' && suffixIcon"
			:icon="suffixIcon"
			class="c-suffix-icon"
			@click="$emit('iconclick',$event)" />
		<span class="c-prefix-slot"
			v-if="elType!=='textarea'&&$slots&&$slots.prefix">
			<slot name="prefix"></slot>
		</span>
		<span class="c-suffix-slot"
			v-if="elType!=='textarea'&&$slots&&$slots.suffix">
			<slot name="suffix"></slot>
		</span>
	</div>
</template>

<script>
export default {
	name: 'c-input',
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
				? classes.push('c-textarea')
				: classes.push('cv-input')
			this.disabled && classes.push('c-input-disabled')
			;(this.prefixIcon || (this.$slots && this.$slots.prefix)) &&
				classes.push('c-input-prefix-icon')
			;(this.suffixIcon || (this.$slots && this.$slots.suffix)) &&
				classes.push('c-input-suffix-icon')
			this.size &&
				this.type !== 'textarea' &&
				classes.push(`c-input-${this.size}`)
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
.c-input {
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
		.c-prefix-slot {
			position: absolute;
			left: 12px;
		}
	}
	&-suffix-icon {
		input {
			padding-right: 35px;
		}
		.c-suffix-slot {
			position: absolute;
			right: 12px;
		}
	}
	.c-icon {
		color: $placeholder-font;
		cursor: pointer;
		:hover {
			color: $minor-font;
		}
	}
	.c-icon.c-prefix-icon {
		position: absolute;
		left: 12px;
	}
	.c-icon.c-suffix-icon,
	.c-icon.c-input-clear,
	.c-icon.c-input-eye {
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
.c-textarea {
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
.c-input-disabled {
	input,
	textarea {
		cursor: not-allowed;
		background-color: $level4-border;
	}
}
</style>