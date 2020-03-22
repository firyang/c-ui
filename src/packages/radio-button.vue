<template>
	<label class="v-radio-button"
		:class="radioClass"
		@click.prevent="handleClick">
		<input type="radio"
			v-model="model"
			:disabled="disabled"
			:name="name"
			hidden />
		<span class="v-radio-button-label">
			<slot v-if=" hasLabel"></slot>
			<span v-else>{{val}}</span>
		</span>
	</label>
</template>

<script>
export default {
	name: 'v-radio-button',
	props: {
		val: [String, Number],
		disabled: Boolean,
		name: String
	},
	data() {
		return {
			size: ''
		}
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
				return this.isGroup ? this._radioGroup.value : this.val
			},
			set(value) {
				this.$emit('change', value)
			}
		},
		isDisabled() {
			return this._radioGroup && this._radioGroup.disabled
				? this._radioGroup.disabled
				: this.disabled
		},
		radioClass() {
			let classes = []
			if (this.model === this.val) classes.push('is-checked')
			this.isDisabled && classes.push('is-disabled')
			this.size && classes.push(`v-radio-button-${this.size}`)
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
				this.isGroup && this._radioGroup.$emit('handleChange', this.val)
			}
		}
	},
	mounted() {}
}
</script>

<style lang="scss">
@import '../styles/_var';

.v-radio-button {
	cursor: pointer;
	display: inline-flex;
	vertical-align: middle;
	height: 42px;
	padding: 12px 20px;
	border-top: 1px solid $level1-border;
	border-bottom: 1px solid $level1-border;
	&:first-child {
		border-left: 1px solid $level1-border;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
	}
	&:nth-last-child(1),
	&:nth-last-child(2) {
		border-right: 1px solid $level1-border;
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
	}
	&:not(:first-child) {
		border-left: 1px solid $level1-border;
	}
	&:hover {
		color: $primary;
	}
	&.is-checked {
		background: $primary;
		border-color: $primary;
		color: $basic-white;
		&.is-disabled {
			background: $primary-plain;
			&:hover {
				color: $basic-white;
			}
		}
	}
	&.is-disabled {
		cursor: not-allowed;
		border-color: #eee;
		&:hover {
			color: $level1-border;
		}
	}
	&-label {
		display: inline-flex;
		align-items: center;
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
		span {
			font-size: 12px;
		}
	}
	&-mini {
		padding: 0 12px;
		height: 28px;
		line-height: 28px;
		span {
			font-size: 12px;
		}
	}
}
</style>
