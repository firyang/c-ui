<template>
	<c-popover placement="bottom-right"
		:autofix="true"
		width="auto"
		@show="show"
		@hide="hide"
		ref="date-picker-popover">
		<div slot="reference"
			class="date-range-input">
			<c-icon icon="rili"></c-icon>
			<input type="text"
				:placeholder="startPlaceholder"
				v-model="start" />
			<span>至</span>
			<input type="text"
				:placeholder="endPlaceholder"
				v-model="end" />
			<c-icon icon="close-circle"
				@click.stop.prevent="clear"></c-icon>
		</div>
		<div class="c-picker-popper">
			<c-picker-panel v-model="startValue"
				:range-picked="model"
				:type="type"
				:unlink-panels="unlinkPanels"
				pick-type="start"
				@change="startChange"></c-picker-panel>
			<c-picker-panel v-model="endValue"
				:range-picked="model"
				:type="type"
				:unlink-panels="unlinkPanels"
				pick-type="end"
				@change="endChange"></c-picker-panel>
		</div>
	</c-popover>
</template>

<script>
import DatePickerPanel from './date-picker-panel'

const defaultFormat = {
	month: 'yyyy-MM',
	date: 'yyyy-MM-dd'
}
const tempDate = []

export default {
	components: {
		'c-picker-panel': DatePickerPanel
	},
	props: {
		value: [String, Array],
		type: String,
		format: String,
		valueFormat: String,
		startPlaceholder: { type: String, default: '开始日期' },
		endPlaceholder: { type: String, default: '结束日期' },
		unlinkPanels: { type: Boolean, default: false }
	},
	data() {
		return {
			start: '',
			end: '',
			startValue: '',
			endValue: '',
			pickCount: 0
		}
	},
	computed: {
		model: {
			get() {
				return this.value
			},
			set(value) {
				this.$refs['date-picker-popover'].visible = false
				this.$emit('input', value)
			}
		}
	},
	mounted() {
		if (this.model) {
			const [start, end] = this.model.map(date => {
				return this.formatDate(date, this.format)
			})
			this.start = start
			this.end = end
			this.startValue = new Date(start)
			this.endValue = new Date(end)
		}
	},
	methods: {
		show() {},
		hide() {
			this.pickCount = 0
			tempDate.length = 0
		},
		clear() {
			this.start = this.end = this.startValue = this.endValue = this.model = ''
		},
		startChange(value) {
			this.pickCount += 1
			tempDate.push(new Date(value))
			if (this.pickCount === 2) {
				this.updateValue()
			}
		},
		endChange(value) {
			this.pickCount += 1
			tempDate.push(new Date(value))
			if (this.pickCount === 2) {
				this.updateValue()
			}
		},
		updateValue() {
			const dates = [...tempDate]
			const [start, end] = tempDate.map(date => {
				return { date, text: this.formatDate(date, this.format) }
			})
			if (start.date - end.date > 0) {
				this.start = end.text
				this.end = start.text
				this.startValue = end.date
				this.endValue = start.date
			} else {
				this.start = start.text
				this.end = end.text
				this.startValue = start.date
				this.endValue = end.date
			}
			this.model = dates.sort((a, b) => a - b)
		},
		formatDate(date, format) {
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
			return str
		}
	}
}
</script>

<style lang="scss">
@import '../../styles/_var';
.c-picker-popper {
	display: flex;
	.c-picker-panel:first-child + div {
		margin-left: 40px;
		position: relative;
		&::before {
			content: '';
			height: calc(100% + 30px);
			width: 1px;
			background: $level1-border;
			position: absolute;
			top: -15px;
			left: -20px;
		}
	}
}
.date-range-input {
	display: flex;
	align-items: center;
	height: 40px;
	border-width: 1px;
	border-style: solid;
	border-color: #dcdfe6;
	border-radius: 4px;
	padding: 0 10px;
	cursor: pointer;
	&:hover {
		border-color: #c0c4cc;
	}
	input {
		width: 126px;
		height: 38px;
		border: none;
		outline: none;
		padding: 0 10px;
		text-align: center;
		cursor: pointer;
	}
	.c-icon svg {
		fill: $placeholder-font;
	}
}
</style>