<template>
	<div class="c-date-picker">
		<c-popover placement="bottom-right"
			:autofix="true"
			width="auto"
			@show="show"
			@hide="hide"
			ref="date-picker-popover">
			<c-input type="text"
				:placeholder="placeholder"
				:clearable="true"
				v-model="model"
				slot="reference">
				<c-icon icon="rili"
					slot="prefix"></c-icon>
			</c-input>
			<div class="c-picker-panel"
				:class="poperClass">
				<div class="c-picker-panel-header">
					<div>
						<c-icon icon="left-arrows"
							@click.stop.prevent="changeYear(-1)"></c-icon>
						<c-icon v-if="showDay"
							icon="left"
							@click.stop.prevent="changeMonth(-1)"></c-icon>
					</div>
					<div v-if="showPopover">
						<span v-if="!showYear"
							@click.stop.prevent="displayYear(currentDateTemp.y)">{{currentDateTemp.y}} 年</span>
						<span v-if="showYear">{{yearArr[0].y}} 年 - {{yearArr[9].y}} 年</span>
						<span v-if="showDay"
							@click.stop.prevent="displayMonth(currentDateTemp.m)"> {{currentDateTemp.m+1}} 月</span>
					</div>
					<div>
						<c-icon v-if="showDay"
							icon="right"
							@click.stop.prevent="changeMonth(1)"></c-icon>
						<c-icon icon="right-arrows"
							@click.stop.prevent="changeYear(1)"></c-icon>
					</div>
				</div>
				<div class="c-picker-panel-body">
					<div class="c-picker-panel-date"
						v-if="showDay">
						<div class="c-picker-panel-week">
							<span v-for="week in weeks"
								:key="week">{{week}}</span>
						</div>
						<div class="c-picker-panel-day">
							<span v-for="item in dateArr"
								:key="item.date"
								:class="{'current-month':item.m===currentDateTemp.m, 
                                'today': item.isToday,
                                'current-day':item.y===currentDate.y&&item.m===currentDate.m&&item.d===currentDate.d&&item.m===currentDateTemp.m}"
								@click.stop.prevent="pickDate(item)">{{item.d}}</span>
						</div>
					</div>
					<div class="c-picker-panel-year"
						v-if="showYear">
						<span v-for="item in yearArr"
							:key="item.y">
							<em :class="{'is-current':item.isCurrent, 'is-selected':item.isSelected}"
								@click.stop.prevent="pickYear(item)">{{item.y}}</em></span>
					</div>
					<div class="c-picker-panel-month"
						v-if="showMonth">
						<span v-for="item in monthArr"
							:key="item.m">
							<em :class="{'is-current':item.isCurrent, 'is-selected':item.isSelected}"
								@click.stop.prevent="pickMonth(item)">{{item.text}}</em></span>
					</div>
				</div>
			</div>
		</c-popover>
	</div>
</template>

<script>
export default {
	name: 'c-date-picker',
	props: {
		value: String,
		type: String,
		format: String,
		placeholder: String
	},
	data() {
		return {
			showPopover: false,
			showDay: true,
			showYear: false,
			showMonth: false,
			panelWidth: 289,
			panelHeight: 329,
			poperClass: '',
			weeks: ['日', '一', '二', '三', '四', '五', '六'],
			months: [
				'一月',
				'二月',
				'三月',
				'四月',
				'五月',
				'六月',
				'七月',
				'八月',
				'九月',
				'十月',
				'十一月',
				'十二月'
			],
			dateArr: [],
			currentDate: null,
			currentDateTemp: null,
			monthArr: [],
			yearArr: []
		}
	},
	computed: {
		model: {
			get() {
				return this.value
			},
			set(value) {
				this.$emit('input', value)
			}
		}
	},
	mounted() {
		this.$refs['date-picker-popover'].visible
	},
	methods: {
		show() {
			this.ganeratorDates()
			this.showPopover = true
		},
		hide() {
			this.showDay = true
			this.showMonth = false
			this.showYear = false
		},
		ganeratorDates(currentDate) {
			const _value = currentDate
			const arr = []
			currentDate = currentDate ? currentDate : this.model ? new Date(this.model) : new Date()
			const y = currentDate.getFullYear()
			const m = currentDate.getMonth()
			const d = this.model ? currentDate.getDate() : ''
			const firstDay = new Date(y, m)
			const week = firstDay.getDay()
			const startDay = firstDay - (week === 0 ? 7 : week) * 24 * 60 * 60 * 1000
			for (let i = 0; i < 42; i++) {
				const date = new Date(startDay + i * 24 * 60 * 60 * 1000)
				arr.push({
					date: date.getTime(),
					y: date.getFullYear(),
					m: date.getMonth(),
					d: date.getDate(),
					isToday: this.isToday(date)
				})
			}

			if (!_value) {
				this.currentDate = { y, m, d }
			}
			this.currentDateTemp = { y, m, d }

			this.dateArr = arr
		},
		isToday(date) {
			const today = new Date()
			return (
				date.getFullYear() === today.getFullYear() &&
				date.getMonth() === today.getMonth() &&
				date.getDate() === today.getDate()
			)
		},
		changeYear(num) {
			const { y, m, d } = this.currentDateTemp
			if (this.showDay) {
				this.ganeratorDates(new Date(y + num, m, d))
			}
			if (this.showMonth) {
				this.currentDateTemp.y = y + num
				this.ganeratorMonths()
			}
			if (this.showYear) {
				this.currentDateTemp.y += 10 * num
				this.ganeratorYears(num)
			}
		},
		changeMonth(num) {
			const { y, m, d } = this.currentDateTemp
			this.ganeratorDates(new Date(y, m + num, d))
		},
		pickDate(item) {
			const { date, y, m, d } = item
			this.currentYear = y
			this.currentMonth = m
			this.currentDay = d
			this.model = y + '-' + (m + 1) + '-' + d
			this.$refs['date-picker-popover'].visible = false
			this.showPopover = false
		},
		displayYear(y) {
			this.showDay = false
			this.showMonth = false
			this.showYear = true
			this.ganeratorYears()
		},
		ganeratorYears() {
			const arr = []
			const today = new Date()
			const temp_y = this.currentDateTemp.y
			const start = temp_y - (temp_y % 10)
			let i = 0
			while (i < 10) {
				const y = start + i
				arr.push({
					y,
					isSelected: y === this.currentDate.y,
					isCurrent: y === today.getFullYear()
				})
				i++
			}
			this.yearArr = arr
		},
		displayMonth() {
			this.showDay = false
			this.showMonth = true
			this.ganeratorMonths()
		},
		ganeratorMonths() {
			const today = new Date()
			const { y, m } = this.currentDate
			const temp_y = this.currentDateTemp.y
			this.monthArr = this.months.map((item, i) => {
				return {
					m: i,
					text: item,
					isSelected: m === i && temp_y === y,
					isCurrent: i === today.getMonth() && temp_y === today.getFullYear()
				}
			})
		},
		pickMonth(item) {
			if (!item.isSelected) {
				const m = item.m
				const y = this.currentDateTemp.y
				this.ganeratorDates(new Date(y, m))
			}

			this.showMonth = false
			this.showDay = true
		},
		pickYear(item) {
			if (!item.isSelected) {
				this.currentDateTemp.y = item.y
				this.ganeratorMonths()
			}

			this.showYear = false
			this.showMonth = true
		}
	}
}
</script>

<style lang="scss">
@import '../../styles/_var';
.c-date-picker {
	width: 220px;
	height: 40px;
	.c-input,
	.c-input input {
		width: inherit;
	}
}
/* date panel */
.c-picker-panel {
	width: 274px;
	line-height: 30px;
	color: $minor-font;
	&-header {
		margin: 5px 0 10px;
		display: flex;
		justify-content: space-between;
		.c-icon:hover svg,
		span:hover {
			cursor: pointer;
			color: $primary;
			fill: $primary;
		}
		.c-icon svg {
			width: 12px;
		}
		.c-icon:first-child {
			margin-right: 5px;
		}
		.c-icon:last-child {
			margin-left: 5px;
		}
		div:nth-child(2) {
			position: relative;
			top: 2px;
		}
	}
	&-body {
		margin: 10px 0 0 0;
		span {
			width: calc(14.2857% - 10px);
			line-height: 28px;
			font-size: 12px;
			text-align: center;
			margin: 5px;
		}
	}
	&-week {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid $level1-border;
		span {
			cursor: default;
		}
	}
	&-day {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		span {
			color: $level1-border;
		}
		span:hover {
			cursor: pointer;
		}
		span.current-month {
			color: $minor-font;
		}
		span.current-month:hover {
			color: $primary;
		}
		span.today {
			color: $primary;
		}
		span.current-day {
			color: $basic-white;
			background: $primary;
			border-radius: 50%;
		}
		span.current-day:hover {
			color: $basic-white;
		}
	}
	&-month,
	&-year {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding-top: 10px;
		border-top: 1px solid $level1-border;
		span {
			width: 25%;
			margin: 0;
			line-height: 5.5;
			em {
				font-style: normal;
				cursor: pointer;
				&:hover,
				&.is-current,
				&.is-selected {
					color: $primary;
				}
				&.is-current {
					font-weight: 600;
				}
			}
		}
	}
	&-year {
		justify-content: flex-start;
	}
}
</style>