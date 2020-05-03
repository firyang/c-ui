<template>
	<div class="c-picker-panel"
		:class="poperClass">
		<div class="c-picker-panel-header">
			<div class="left-arrows"
				:class="{'is-disable-year':disableDecreaseYear,'is-disable-month':disableDecreaseMonth}">
				<c-icon icon="left-arrows"
					@click.stop.prevent="!disableDecreaseYear && changeYear(-1)"></c-icon>
				<c-icon v-if="showDay"
					icon="left"
					@click.stop.prevent="!disableDecreaseMonth && changeMonth(-1)"></c-icon>
			</div>
			<div v-if="currentDateTemp">
				<span v-if="!showYear"
					@click.stop.prevent="displayYear(currentDateTemp.y)">{{currentDateTemp.y}} 年</span>
				<span v-if="showYear">{{yearArr[0].y}} 年 - {{yearArr[9].y}} 年</span>
				<span v-if="showDay"
					@click.stop.prevent="displayMonth(currentDateTemp.m)"> {{currentDateTemp.m+1}} 月</span>
			</div>
			<div class="right-arrows"
				:class="{'is-disable-year':disableIncreaseYear,'is-disable-month':disableIncreaseMonth}">
				<c-icon v-if="showDay"
					icon="right"
					@click.stop.prevent="!disableIncreaseMonth && changeMonth(1)"></c-icon>
				<c-icon icon="right-arrows"
					@click.stop.prevent="!disableIncreaseYear && changeYear(1)"></c-icon>
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
					<div v-for="item in dateArr"
						:key="item.date"
						:class="{'current-month':item.m===currentDateTemp.m, 
                                'today': item.isToday,
                                'current-day':item.y===currentDate.y&&item.m===currentDate.m&&item.d===currentDate.d&&item.m===currentDateTemp.m,
                                'is-includes':item.isIncludes,
                                'is-end-date':isEnd,
                                'is-start-date':isStart,
                                }">
						<span @click.stop.prevent="pickDate(item)">{{item.d}}</span></div>
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
</template>

<script>
export default {
	name: 'c-picker-panel',
	props: {
		value: [String, Date],
		originValue: [Array, String],
		pickType: String,
		type: { type: String, default: 'date' },
		unlink: Boolean
	},
	data() {
		return {
			showDay: true,
			showYear: false,
			showMonth: false,
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
			yearArr: [],
			disableIncreaseYear: false,
			disableDecreaseYear: false,
			disableIncreaseMonth: false,
			disableDecreaseMonth: false
		}
	},
	computed: {
		isRange() {
			return /range$/.test(this.type)
		},
		isStart() {
			return this.pickType === 'start'
		},
		isEnd() {
			return this.pickType === 'end'
		},
		siblingVm() {
			const pickType = this.pickType == 'start' ? 'end' : 'start'
			return this.$parent.$children.find(vm => vm.pickType === pickType)
		}
	},
	mounted() {
		this.ganeratorDates()
		if (this.isRange) {
			if (this.isStart) {
				this.disableIncreaseYear = true
				const startValue = this.originValue[0]
			}
			if (this.isEnd) {
				this.disableDecreaseYear = true
				const endValue = this.originValue[1]
			}
		}
	},
	destroyed() {
		console.log('destroyed')
	},
	methods: {
		ganeratorDates(currentDate) {
			const _value = currentDate
			const arr = []
			currentDate = currentDate ? currentDate : this.value ? new Date(this.value) : new Date()
			const y = currentDate.getFullYear()
			const m = currentDate.getMonth()
			const d = this.value ? currentDate.getDate() : ''
			const firstDay = new Date(y, m)
			const week = firstDay.getDay()
			const startDay = firstDay - (week === 0 ? 7 : week) * 24 * 60 * 60 * 1000
			let startDate, endDate
			if (this.isRange) {
				startDate = this.originValue[0]
				endDate = this.originValue[1]
			}

			for (let i = 0; i < 42; i++) {
				const date = new Date(startDay + i * 24 * 60 * 60 * 1000)
				const isIncludes = this.isRange ? date >= startDate && date <= endDate : false
				arr.push({
					date: date.getTime(),
					y: date.getFullYear(),
					m: date.getMonth(),
					d: date.getDate(),
					isToday: this.isToday(date, m),
					isIncludes
				})
			}

			if (!_value) {
				this.currentDate = { y, m, d }
			}

			this.currentDateTemp = { y, m, d }

			this.dateArr = arr
		},
		isToday(date, m) {
			const today = new Date()
			return (
				date.getFullYear() === today.getFullYear() &&
				date.getMonth() === today.getMonth() &&
				date.getMonth() === m &&
				date.getDate() === today.getDate()
			)
		},
		changeYear(num) {
			const { y, m, d } = this.currentDateTemp
			const arr = d ? [y + num, m, d] : [y + num, m]
			if (this.showDay) {
				this.ganeratorDates(new Date(...arr))
			}
			if (this.showMonth) {
				this.currentDateTemp.y = y + num
				this.ganeratorMonths()
			}
			if (this.showYear) {
				this.currentDateTemp.y += 10 * num
				this.ganeratorYears(num)
			}
			this.isRange && this.handleArrowStatus('y')
		},
		changeMonth(num) {
			const { y, m, d } = this.currentDateTemp
			const arr = d ? [y, m + num, d] : [y, m + num]
			this.ganeratorDates(new Date(...arr))
			this.isRange && this.handleArrowStatus('m')
		},
		pickDate(item) {
			const { date, y, m, d } = item
			this.currentYear = y
			this.currentMonth = m
			this.currentDay = d
			this.$emit('change', date)
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
		},
		handleArrowStatus(key) {
			const { y, m } = this.currentDateTemp
			const siblingVm = this.siblingVm
			const { y: siblingY, m: siblingM } = siblingVm.currentDateTemp
			const date = new Date(y, m)
			const siblingDate = new Date(siblingY, siblingM)
			if (this.isStart) {
				this.disableIncreaseYear = siblingVm.disableDecreaseYear = y >= siblingY
				this.disableIncreaseMonth = siblingVm.disableDecreaseMonth = date >= siblingDate
			}
			if (this.isEnd) {
				this.disableDecreaseYear = siblingVm.disableIncreaseYear = y <= siblingY
				this.disableDecreaseMonth = siblingVm.disableIncreaseMonth = date <= siblingDate
			}
		}
	}
}
</script>

<style lang="scss">
@import '../../styles/_var';
/* date panel */
.c-picker-panel {
	width: 274px;
	line-height: 30px;
	color: $primary-font;
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
		.left-arrows {
			&.is-disable-year {
				.c-icon:first-child svg {
					fill: $placeholder-font;
					cursor: not-allowed;
				}
			}
			&.is-disable-month {
				.c-icon:last-child svg {
					fill: $placeholder-font;
					cursor: not-allowed;
				}
			}
			&.is-hidden {
				visibility: hidden;
			}
		}
		.right-arrows {
			&.is-disable-year {
				.c-icon:last-child svg {
					fill: $placeholder-font;
					cursor: not-allowed;
				}
			}
			&.is-disable-month {
				.c-icon:first-child svg {
					fill: $placeholder-font;
					cursor: not-allowed;
				}
			}
			&.is-hidden {
				visibility: hidden;
			}
		}
	}
	&-body {
		margin: 10px 0 0 0;
	}
	&-week {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid $level2-border;
		span {
			width: calc(14.2857% - 10px);
			line-height: 28px;
			font-size: 12px;
			text-align: center;
			margin: 5px;
			cursor: default;
		}
	}
	&-day {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		div {
			width: calc(14.2857%);
			font-size: 12px;
			text-align: center;
			line-height: 1;
			margin: 5px 0;
			span {
				color: $placeholder-font;
				width: 28px;
				height: 28px;
				line-height: 28px;
				display: inline-block;
				cursor: pointer;
			}
		}
		div.current-month {
			span {
				color: $primary-font;
			}
			span:hover {
				color: $primary;
			}
		}
		div.today {
			span {
				color: $primary;
			}
		}
		div.current-day {
			span {
				color: $basic-white;
				background: $primary;
				border-radius: 50%;
			}
			span:hover {
				color: $basic-white;
			}
		}
		div.is-includes.current-month {
			background-color: $primary-plain;
		}
		div.is-includes.current-day.is-end-date {
			background: transparent;
			position: relative;
			&::before {
				content: '';
				display: block;
				width: 20px;
				height: 100%;
				background: $primary-plain;
				position: absolute;
				left: 0;
				top: 0;
				z-index: -1;
			}
		}
		div.is-includes.current-day.is-start-date {
			background: transparent;
			position: relative;
			&::before {
				content: '';
				display: block;
				width: 20px;
				height: 100%;
				background: $primary-plain;
				position: absolute;
				right: 0;
				top: 0;
				z-index: -1;
			}
		}
	}
	&-month,
	&-year {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-top: 15px;
		padding-top: 10px;
		border-top: 1px solid $level2-border;
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