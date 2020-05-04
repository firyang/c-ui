<template>
	<div class="c-date-picker">
		<date-range-picker v-if="isRange"
			v-model="model"
			:type="type"
			:format="format"
			:value-format="valueFormat"
			:start-placeholder="startPlaceholder"
			:end-placeholder="endPlaceholder"
			:unlink-panels="unlinkPanels"></date-range-picker>
		<c-popover v-else
			placement="bottom-right"
			:autofix="true"
			width="auto"
			ref="date-picker-popover">
			<c-input type="text"
				:placeholder="placeholder"
				:clearable="true"
				v-model="tempModel"
				slot="reference"
				@clear="clear">
				<c-icon icon="rili"
					slot="prefix"></c-icon>
			</c-input>
			<date-picker-panel v-model="model"
				:type="type"
				@change="change"></date-picker-panel>
		</c-popover>
	</div>
</template>

<script>
import DatePickerPanel from './date-picker-panel'
import DateRangePicker from './date-range-picker'

const defaultFormat = {
	year: 'yyyy',
	month: 'yyyy-MM',
	date: 'yyyy-MM-dd'
}

export default {
	name: 'c-date-picker',
	components: {
		DatePickerPanel,
		DateRangePicker
	},
	props: {
		value: [String, Array, Date],
		type: { type: String, default: 'date' },
		format: String,
		valueFormat: String,
		placeholder: String,
		startPlaceholder: { type: String, default: '开始日期' },
		endPlaceholder: { type: String, default: '结束日期' },
		unlinkPanels: { type: Boolean, default: false }
	},
	data() {
		return {
			tempModel: ''
		}
	},
	computed: {
		isRange() {
			return /range$/.test(this.type)
		},
		model: {
			get() {
				return this.value
			},
			set(value) {
				if (!this.isRange) {
					this.$refs['date-picker-popover'].visible = false
				}
				this.$emit('input', value)
			}
		}
	},
	mounted() {
		if (this.model) {
			this.tempModel = this.formatDate(this.model, this.format)
		}
	},
	methods: {
		change(timestamp) {
			const date = new Date(timestamp)
			this.model = date
			this.tempModel = this.formatDate(date, this.format)
		},
		formatDate(date, format) {
			if (typeof date === 'string') {
				date = new Date(date)
			}
			const y = date.getFullYear()
			const m = date.getMonth() + 1
			const d = date.getDate()
			let str
			if (this.type.includes('date')) {
				str = `${y}-${('0' + m).slice(-2)}-${('0' + d).slice(-2)}`
			}
			if (this.type.includes('month')) {
				str = `${y}-${('0' + m).slice(-2)}`
			}
			if (this.type.includes('year')) {
				str = `${y}`
			}
			return str
		},
		clear() {
			this.model = ''
		}
	}
}
</script>

<style lang="scss">
.c-date-picker {
	height: 40px;
	.c-input,
	.c-input input {
		width: inherit;
	}
}
</style>