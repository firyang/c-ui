<template>
	<div class="c-date-picker"
		@click="handleClick"
		v-click-outside="onClickOutside"
		ref="c-date-picker">
		<c-input type="text"
			:placeholder="placeholder"
			:clearable="true"
			v-model="model">
			<c-icon icon="rili"
				slot="prefix"></c-icon>
		</c-input>
		<transition name="slide-fade">
			<div class="c-picker-poper c-picker-panel"
				:class="poperClass"
				v-if="showPoper">
				<div class="c-picker-panel-header">
					<div>
						<c-icon icon="left-arrows"
							@click.stop.prevent="changeYear(-1)"></c-icon>
						<c-icon icon="left"
							@click.stop.prevent="changeMonth(-1)"></c-icon>
					</div>
					<div>
						<span>{{currentDateTemp.y}} 年</span>
						<span> {{currentDateTemp.m+1}} 月</span>
					</div>
					<div>
						<c-icon icon="right"
							@click.stop.prevent="changeMonth(1)"></c-icon>
						<c-icon icon="right-arrows"
							@click.stop.prevent="changeYear(1)"></c-icon>
					</div>
				</div>
				<div class="c-picker-panel-body">
					<div class="c-picker-panel-date">
						<div class="c-picker-panel-week">
							<span v-for="week in weeks"
								:key="week">{{week}}</span>
						</div>
						<div class="c-picker-panel-day">
							<span v-for="item in dateArr"
								:key="item.date"
								:class="{'current-month':item.m===currentDateTemp.m, 'current-day':item.d===currentDate.d&&item.m===currentDate.m&&item.y===currentDate.y}"
								@click.stop.prevent="pickDate(item)">{{item.d}}</span>
						</div>
					</div>
					<div class="c-picker-panel-year"
						v-if="showYear"></div>
					<div class="c-picker-panel-month"
						v-if="showMonth"></div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import vClickOutside from 'v-click-outside'

let scroller = null

export default {
	name: 'c-date-picker',
	directives: {
		clickOutside: vClickOutside.directive
	},
	props: {
		value: String,
		type: String,
		format: String,
		placeholder: String
	},
	data() {
		return {
			showPoper: false,
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
			currentDateTemp: null
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
	methods: {
		handleClick() {
			console.log('click')
			if (this.showPoper) return
			this.ganeratorDates()
			scroller = this.getScrollElement(this.$el)
			this.positionPanel()
			this.showPoper = true
			if (scroller === document.documentElement) {
				document.addEventListener('scroll', this.positionPanel)
			} else {
				scroller.addEventListener('scroll', this.positionPanel)
			}
		},
		onClickOutside() {
			// console.log('click outside')
			if (!this.showPoper) return
			this.showPoper = false
			if (scroller === document.documentElement) {
				document.removeEventListener('scroll', this.positionPanel)
			} else {
				scroller.removeEventListener('scroll', this.positionPanel)
			}
			scroller = null
		},
		positionPanel() {
			const el = this.$el
			const offsetTop =
				scroller === document
					? el.offsetTop
					: el.offsetTop - scroller.offsetTop
			const offsetLeft =
				scroller === document
					? el.offsetLeft
					: el.offsetLeft - scroller.offsetLeft
			const scrollTop = scroller.scrollTop
			const scrollLeft = scroller.scrollLeft
			const windowHeight =
				scroller === document
					? window.innerHeight
					: scroller.clientHeight
			const windowWidth =
				scroller === document ? window.innerWidth : scroller.clientWidth
			const usableWidth = windowWidth - offsetLeft + scrollLeft
			const usableHeight = windowHeight - offsetTop - 50 + scrollTop // 50 为poper定位的top值

			if (usableHeight > this.panelHeight) {
				if (usableWidth > this.panelWidth) {
					this.poperClass = ['c-picker-poper-bottom-left']
				} else {
					this.poperClass = ['c-picker-poper-bottom-right']
				}
			} else {
				if (usableWidth > this.panelWidth) {
					this.poperClass = ['c-picker-poper-top-left']
				} else {
					this.poperClass = ['c-picker-poper-top-right']
				}
			}
		},
		getScrollElement(el) {
			let parent = el
			while (parent !== document) {
				if (this.isScrollElement(parent)) {
					return parent
				} else {
					parent = parent.parentNode
				}
			}
			return document.documentElement
		},
		isScrollElement(el) {
			return (
				el.scrollWidth > el.clientWidth ||
				el.scrollHeight > el.clientHeight
			)
		},
		ganeratorDates(currentDate) {
			const _value = currentDate
			const arr = []
			currentDate = currentDate
				? currentDate
				: this.model
				? new Date(this.model)
				: new Date()
			const y = currentDate.getFullYear()
			const m = currentDate.getMonth()
			const d = this.model ? currentDate.getDate() : ''
			const firstDay = new Date(y, m)
			const week = firstDay.getDay()
			const startDay =
				firstDay - (week === 0 ? 7 : week) * 24 * 60 * 60 * 1000
			for (let i = 0; i < 42; i++) {
				const date = new Date(startDay + i * 24 * 60 * 60 * 1000)
				arr.push({
					date: date.getTime(),
					y: date.getFullYear(),
					m: date.getMonth(),
					d: date.getDate()
				})
			}

			if (!_value) {
				this.currentDate = { y, m, d }
			}
			this.currentDateTemp = { y, m, d }

			this.dateArr = arr
		},
		changeYear(num) {
			const { y, m, d } = this.currentDateTemp
			this.ganeratorDates(new Date(y + num, m, d))
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
			this.onClickOutside()
		}
	}
}
</script>

<style lang="scss">
@import '../../styles/_var';
.c-date-picker {
	width: 220px;
	height: 40px;
	overflow: visible;
	position: relative;
	.c-input,
	.c-input input {
		width: inherit;
	}
	.c-picker-poper {
		width: 298px;
		height: 329px;
		border: 1px solid $level1-border;
		border-radius: $border-radius;
		box-shadow: 1px 0 12px 0 $level4-border, 0 1px 12px 0 $level4-border;
		background: $basic-white;
		position: absolute;
	}
	/* poper position */
	.c-picker-poper-top-left {
		bottom: 50px;
		left: 0;
	}
	.c-picker-poper-bottom-left {
		top: 50px;
		left: 0;
	}
	.c-picker-poper-top-right {
		bottom: 50px;
		right: 0;
	}
	.c-picker-poper-bottom-right {
		top: 50px;
		right: 0;
	}
	.c-picker-poper-top-left::before,
	.c-picker-poper-bottom-left::before,
	.c-picker-poper-top-right::before,
	.c-picker-poper-bottom-right::before {
		content: '';
		display: block;
		width: 8px;
		height: 8px;
		background: $basic-white;
		border: 1px solid $level1-border;
		box-shadow: 0 0 3px 0 $level4-border;
		position: absolute;
		transform: rotateZ(45deg);
	}
	.c-picker-poper-top-left::before {
		left: 30px;
		bottom: -5px;
	}
	.c-picker-poper-bottom-left::before {
		left: 30px;
		top: -5px;
	}
	.c-picker-poper-top-right::before {
		left: 108px;
		bottom: -5px;
	}
	.c-picker-poper-bottom-right::before {
		left: 108px;
		top: -5px;
	}
	.c-picker-poper-top-left::after,
	.c-picker-poper-bottom-left::after,
	.c-picker-poper-top-right::after,
	.c-picker-poper-bottom-right::after {
		content: '';
		display: block;
		width: 20px;
		height: 10px;
		background: $basic-white;
		position: absolute;
	}
	.c-picker-poper-top-left::after {
		left: 25px;
		bottom: 0px;
	}
	.c-picker-poper-bottom-left::after {
		left: 25px;
		top: 0px;
	}
	.c-picker-poper-top-right::after {
		left: 103px;
		bottom: 0px;
	}
	.c-picker-poper-bottom-right::after {
		left: 103px;
		top: 0px;
	}
	/* transition */
	.slide-fade-enter-active {
		height: 329px;
		transition: all 0.3s;
	}
	.slide-fade-leave-active {
		height: 329px;
		transition: height 0.1s;
	}
	.slide-fade-enter,
	.slide-fade-leave-to {
		height: 0;
		opacity: 0;
	}
	/* date panel */
	.c-picker-panel {
		line-height: 30px;
		color: $minor-font;
		&-header {
			margin: 12px;
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
			margin: 12px;
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
			span.current-day {
				color: $basic-white;
				background: $primary;
				border-radius: 50%;
			}
			span.current-day:hover {
				color: $basic-white;
			}
		}
	}
}
</style>