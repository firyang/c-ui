<template>
	<label class="v-radio"
		:class="redioClass"
		@click.prevent="handleClick">
		<span class="v-radio-input">
			<span class="v-radio-inner"></span>
			<input type="radio"
				v-model="model"
				:disabled="disabled"
				:name="name"
				hidden />
		</span>
		<span class="v-radio-label"
			v-if="hasLabel">
			<slot></slot>
		</span>
	</label>
</template>

<script>
export default {
	name: 'v-radio',
	props: {
		value: [String, Number, Boolean],
		val: [String, Number, Boolean],
		disabled: Boolean,
		name: String
	},
	computed: {
		isGroup() {
			let parent = this.$parent
			while (parent) {
				if (parent.$options.name !== 'v-radio-group') {
					parent = parent.$parent
				} else {
					this._radioGroup = parent
					return true
				}
			}
		},
		model: {
			get() {
				return this.isGroup ? this._radioGroup.value : this.value
			},
			set(value) {
				this.$emit('change', value)
			}
		},
		isDisabled() {
			return this.isGroup && this._radioGroup.disabled ? this._radioGroup.disabled : this.disabled
		},
		redioClass() {
			let classes = []
			if (this.model === this.val) classes.push('is-checked')
			this.isDisabled && classes.push('is-disabled')
			return classes
		},
		hasLabel() {
			return this.$slots && this.$slots.default
		}
	},
	methods: {
		handleClick() {
			if (!this.isDisabled) {
				this.$emit('input', this.val)
				this.$emit('change', this.val)
				this.isGroup && this._radioGroup.$emit('handleChange', this.val)
			}
		}
	},
	mounted() {}
}
</script>

<style lang="scss">
@import '../styles/_var';

.v-radio {
	cursor: pointer;
	margin-right: 30px;
	display: inline-flex;
	vertical-align: middle;
	&-input + span {
		margin-left: 5px;
	}
	&-inner {
		display: block;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: $basic-white;
		border: 1px solid $placeholder-font;
	}
	&-label {
		line-height: 16px;
	}
}
.is-checked {
	.v-radio-inner {
		background: $primary;
		border-color: $primary;
		position: relative;
		&::after {
			content: '';
			display: block;
			width: 6px;
			height: 6px;
			background: $basic-white;
			border-radius: 50%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
}
.is-disabled {
	color: $level1-border;
	cursor: not-allowed;
	.v-radio-inner {
		border-color: $level2-border;
	}
	&.is-checked {
		.v-radio-inner {
			background-color: $level1-border;
			border-color: $level1-border;
		}
	}
}
</style>
