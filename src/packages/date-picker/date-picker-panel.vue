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
			<div v-if="tempDate">
				<span v-if="!showYear"
					@click.stop.prevent="!isRange && displayYear(tempDate.y)">{{tempDate.y}} 年</span>
				<span v-if="showYear">{{yearArr[0].y}} 年 - {{yearArr[9].y}} 年</span>
				<span v-if="showDay"
					@click.stop.prevent="!isRange && displayMonth(tempDate.m)"> {{tempDate.m+1}} 月</span>
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
						:class="{'current-month':item.m===tempDate.m, 
                                'today': item.isToday,
                                'is-picked':item.isPicked&&item.m===tempDate.m,
                                'is-within':item.isWithin,
                                'is-picked-end':item.isPickedEnd&&item.isPicked,
                                'is-picked-start':item.isPickedStart&&item.isPicked,
                                }"
						@mouseenter="firstPicked && hoverDay(item)"
						@mouseleave="firstPicked && leaveDay(item)">
						<span @click.stop.prevent="pickDate(item)">{{item.d}}</span></div>
				</div>
			</div>
			<div class="c-picker-panel-year"
				v-if="showYear">
				<span v-for="item in yearArr"
					:key="item.y">
					<em :class="{'is-current':item.isCurrent, 'is-picked':item.isPicked}"
						@click.stop.prevent="pickYear(item)">{{item.y}}</em></span>
			</div>
			<div class="c-picker-panel-month"
				v-if="showMonth">
				<span v-for="item in monthArr"
					:key="item.m"
					:class="{'is-within':item.isWithin,
                            'is-picked-start':item.isPickedStart,
                            'is-picked-end':item.isPickedEnd}"
					@mouseenter="firstPicked && hoverMonth(item)"
					@mouseleave="firstPicked && leaveMonth(item)">
					<em :class="{'is-current':item.isCurrent, 'is-picked':item.isPicked}"
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
		rangePicked: [Array, String],
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
			monthArr: [],
			yearArr: [],
			tempDate: null,
			disableIncreaseYear: false,
			disableDecreaseYear: false,
			disableIncreaseMonth: false,
			disableDecreaseMonth: false,
			firstPicked: null
		}
	},
	computed: {
		isRange() {
			return /range$/.test(this.type)
		},
		isSameMonth() {
			let flag = false
			if (this.isRange && this.rangePicked) {
				const [start, end] = this.rangePicked
				flag = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
			}
			return flag
		},
		isSameYear() {
			let flag = false
			if (this.isRange && this.rangePicked) {
				const [start, end] = this.rangePicked
				flag = start.getFullYear() === end.getFullYear()
			}
			return flag
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
		if (/year/.test(this.type)) {
			this.displayYear()
		}
		if (/month/.test(this.type)) {
			this.displayMonth()
			if (this.isRange) {
				if (this.rangePicked) {
					if (this.isSameYear) {
						this.isEnd && this.changeYear(1)
						this.disableIncreaseYear = this.isStart
						this.disableDecreaseYear = this.isEnd
					}
				} else {
					this.isEnd && this.changeYear(1)
					this.disableIncreaseYear = this.isStart
					this.disableDecreaseYear = this.isEnd
				}
			}
		}
		if (/date/.test(this.type)) {
			this.ganeratorDates()
			if (this.isRange) {
				if (this.rangePicked) {
					if (this.isSameMonth) {
						this.isEnd && this.changeMonth(1)
						this.disableIncreaseYear = this.isStart
						this.disableDecreaseYear = this.isEnd
					}
				} else {
					this.isEnd && this.changeMonth(1)
					this.disableIncreaseYear = this.isStart
					this.disableDecreaseYear = this.isEnd
				}
			}
		}
	},
	destroyed() {
		console.log('destroyed')
	},
	methods: {
		ganeratorDates(tempDate) {
			const arr = []
			tempDate = tempDate ? tempDate : this.value ? this.value : new Date()
			const y = tempDate.getFullYear()
			const m = tempDate.getMonth()
			const d = this.value ? tempDate.getDate() : ''
			const firstDay = new Date(y, m)
			const week = firstDay.getDay()
			const startDay = firstDay - (week === 0 ? 7 : week) * 24 * 60 * 60 * 1000

			let start, end
			if (this.isRange) {
				start = this.rangePicked[0]
				end = this.rangePicked[1]
			}

			for (let i = 0; i < 42; i++) {
				const date = new Date(startDay + i * 24 * 60 * 60 * 1000)
				const isWithin = this.isRange ? date >= start && date <= end : false
				const { isPicked, isPickedStart, isPickedEnd } = this.isPicked(date)
				arr.push({
					timestamp: date.getTime(),
					y: date.getFullYear(),
					m: date.getMonth(),
					d: date.getDate(),
					isToday: this.isToday(date, m),
					isPicked,
					isPickedStart,
					isPickedEnd,
					isWithin
				})
			}

			this.tempDate = { y, m, d }

			this.dateArr = arr
		},
		isPicked(date) {
			const obj = { isPicked: false, isPickedStart: false, isPickedEnd: false }
			let pickedDate = this.value ? this.value : null
			if (!pickedDate) {
				return obj
			}

			if (this.isSameMonth) {
				this.rangePicked.map((picked, i) => {
					if (picked.getTime() === date.getTime()) {
						obj.isPicked = true
						obj.isPickedStart = i === 0
						obj.isPickedEnd = i === 1
					}
				})
			} else {
				obj.isPicked = date.getTime() === pickedDate.getTime()
				obj.isPickedStart = this.isStart
				obj.isPickedEnd = this.isEnd
			}
			return obj
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
			const { y, m, d } = this.tempDate
			const arr = d ? [y + num, m, d] : [y + num, m]
			if (this.showDay) {
				this.ganeratorDates(new Date(...arr))
			}
			if (this.showMonth) {
				this.ganeratorMonths(new Date(...arr))
			}
			if (this.showYear) {
				this.ganeratorYears(new Date(y + 10 * num, m))
			}
			this.isRange && this.handleArrowStatus('y')
		},
		changeMonth(num) {
			const { y, m, d } = this.tempDate
			const arr = d ? [y, m + num, d] : [y, m + num]
			this.ganeratorDates(new Date(...arr))
			this.isRange && this.handleArrowStatus('m')
		},
		displayYear(y) {
			this.showDay = false
			this.showMonth = false
			this.showYear = true
			this.ganeratorYears()
		},
		ganeratorYears(tempDate) {
			const today = new Date()
			tempDate = tempDate ? tempDate : this.value ? this.value : today
			const arr = []
			const y = tempDate.getFullYear()
			const m = tempDate.getMonth()
			const start = y - (y % 10)
			let i = 0
			while (i < 10) {
				const y = start + i
				arr.push({
					y,
					m,
					timestamp: new Date(y, m).getTime(),
					isPicked: this.value ? this.value.getFullYear() === y : false,
					isCurrent: y === today.getFullYear()
				})
				i++
			}
			this.yearArr = arr
			this.tempDate = { y, m }
		},
		displayMonth() {
			this.showDay = false
			this.showMonth = true
			this.ganeratorMonths()
		},
		ganeratorMonths(tempDate) {
			const today = new Date()
			tempDate = tempDate ? tempDate : this.value ? this.value : today
			const y = tempDate.getFullYear()
			const m = tempDate.getMonth()

			let start, end
			if (this.isRange && this.rangePicked) {
				start = this.rangePicked[0]
				end = this.rangePicked[1]
			}
			this.monthArr = this.months.map((item, i) => {
				const date = new Date(y, i)
				const isWithin = this.isRange ? date >= start && date <= end : false
				const isPickedStart = start ? y === start.getFullYear() && i === start.getMonth() : false
				const isPickedEnd = end ? y === end.getFullYear() && i === end.getMonth() : false
				return {
					timestamp: date.getTime(),
					m: i,
					text: item,
					isPicked: this.value ? i === m && this.value.getFullYear() === y : false,
					isCurrent: i === today.getMonth() && y === today.getFullYear(),
					isWithin,
					isPickedStart,
					isPickedEnd
				}
			})

			this.tempDate = { y, m }
		},
		hoverDay(dateObj) {
			const start = this.firstPicked.timestamp
			const end = dateObj.timestamp
			this.dateArr.forEach(item => {
				const timestamp = item.timestamp
				if (timestamp >= start && timestamp <= end) {
					this.firstPicked.isPickedStart = dateObj.isPickedEnd = dateObj.isPicked = item.isWithin = true
					this.firstPicked.isPickedEnd = false
				}
				if (timestamp >= end && timestamp <= start) {
					this.firstPicked.isPickedEnd = dateObj.isPickedStart = dateObj.isPicked = item.isWithin = true
					this.firstPicked.isPickedStart = false
				}
			})
			if (this.isEnd) {
				this.siblingVm.dateArr.forEach(item => {
					const timestamp = item.timestamp
					if (timestamp >= start && timestamp <= end) {
						item.isWithin = true
					}
				})
			}
			if (this.isStart) {
				this.siblingVm.dateArr.forEach(item => {
					const timestamp = item.timestamp
					if (timestamp <= start && timestamp >= end) {
						item.isWithin = true
					}
				})
			}
		},
		leaveDay(dateObj) {
			this.dateArr.forEach(item => {
				item.isWithin = false
			})
			if (this.firstPicked !== dateObj) {
				dateObj.isPicked = false
			}
		},
		hoverMonth(dateObj) {
			const start = this.firstPicked.timestamp
			const end = dateObj.timestamp
			this.monthArr.forEach(item => {
				const timestamp = item.timestamp
				if (timestamp >= start && timestamp <= end) {
					this.firstPicked.isPickedStart = dateObj.isPickedEnd = dateObj.isPicked = item.isWithin = true
					this.firstPicked.isPickedEnd = false
				}
				if (timestamp >= end && timestamp <= start) {
					this.firstPicked.isPickedEnd = dateObj.isPickedStart = dateObj.isPicked = item.isWithin = true
					this.firstPicked.isPickedStart = false
				}
			})
			if (this.isEnd) {
				this.siblingVm.monthArr.forEach(item => {
					const timestamp = item.timestamp
					if (timestamp >= start && timestamp <= end) {
						item.isWithin = true
					}
				})
			}
			if (this.isStart) {
				this.siblingVm.monthArr.forEach(item => {
					const timestamp = item.timestamp
					if (timestamp <= start && timestamp >= end) {
						item.isWithin = true
					}
				})
			}
		},
		leaveMonth(dateObj) {
			this.monthArr.forEach(item => {
				item.isWithin = false
			})
			if (this.firstPicked !== dateObj) {
				dateObj.isPicked = false
				dateObj.isPickedEnd = false
				dateObj.isPickedStart = false
			}
		},
		pickDate(item) {
			const { timestamp, y, m, d } = item
			this.currentYear = y
			this.currentMonth = m
			this.currentDay = d
			this.$emit('change', timestamp)
			if (this.isRange) {
				;[...this.dateArr, ...this.siblingVm.dateArr].forEach(temp => {
					temp.isWithin = temp.isPickedStart = temp.isPickedEnd = temp.isPicked = false
				})
				item.isPicked = true
				this.firstPicked = this.siblingVm.firstPicked = item
			}
		},
		pickMonth(item) {
			if (/date/.test(this.type)) {
				if (!item.isPicked) {
					const m = item.m
					const y = this.tempDate.y
					this.ganeratorDates(new Date(y, m))
				}

				this.showMonth = false
				this.showDay = true
			} else {
				this.$emit('change', item.timestamp)
				if (this.isRange) {
					;[...this.monthArr, ...this.siblingVm.monthArr].forEach(temp => {
						temp.isWithin = temp.isPickedStart = temp.isPickedEnd = temp.isPicked = false
					})
					item.isPicked = true
					this.firstPicked = this.siblingVm.firstPicked = item
				}
			}
		},
		pickYear(item) {
			if (/year/.test(this.type)) {
				this.$emit('change', item.timestamp)
			} else {
				if (!item.isPicked) {
					this.ganeratorMonths(new Date(item.y, item.m))
				}

				this.showYear = false
				this.showMonth = true
			}
		},
		handleArrowStatus() {
			const siblingVm = this.siblingVm
			const { y: siblingY, m: siblingM } = siblingVm.tempDate
			const { y, m } = this.tempDate
			if (this.type === 'monthrange') {
				if (this.isStart) {
					this.disableIncreaseYear = siblingVm.disableDecreaseYear = y >= siblingY - 1
				}
				if (this.isEnd) {
					this.disableDecreaseYear = siblingVm.disableIncreaseYear = y <= siblingY + 1
				}
			} else {
				if (this.isStart) {
					this.disableIncreaseYear = siblingVm.disableDecreaseYear = y >= siblingY
					this.disableIncreaseMonth = siblingVm.disableDecreaseMonth = y === siblingY && m >= siblingM - 1
				}
				if (this.isEnd) {
					this.disableDecreaseYear = siblingVm.disableIncreaseYear = y <= siblingY
					this.disableDecreaseMonth = siblingVm.disableIncreaseMonth = y === siblingY && m <= siblingM + 1
				}
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
			text-align: center;
			line-height: 1;
			margin: 5px 0;
			span {
				color: $placeholder-font;
				font-size: 12px;
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
		div.is-picked {
			span {
				color: $basic-white;
				background: $primary;
				border-radius: 50%;
			}
			span:hover {
				color: $basic-white;
			}
		}
		div.is-within.current-month {
			background-color: $primary-plain;
		}
		div.is-within.is-picked.is-picked-end {
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
		div.is-within.is-picked.is-picked-start {
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
			line-height: 3;
			font-size: 12px;
			text-align: center;
			margin: 16px 0;
			em {
				font-style: normal;
				cursor: pointer;
				&:hover,
				&.is-current,
				&.is-picked {
					color: $primary;
				}
				&.is-current {
					font-weight: 600;
				}
			}
		}
		span.is-within {
			background-color: $primary-plain;
		}
		span.is-within.is-picked-start {
			border-bottom-left-radius: 12px;
			border-top-left-radius: 12px;
		}
		span.is-within.is-picked-end {
			border-bottom-right-radius: 12px;
			border-top-right-radius: 12px;
		}
	}
	&-year {
		justify-content: flex-start;
	}
}
</style>