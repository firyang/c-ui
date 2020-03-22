<template>
	<div class="v-time-line"
		ref="timeline">
		<v-icon icon="left"
			v-if="width>containerWidth"
			@click.prevent="move(1)"></v-icon>
		<canvas id="v-time-line-cvs1"
			:width="canvasWidth"
			:height="height"></canvas>
		<canvas id="v-time-line-cvs2"
			:width="canvasWidth"
			:height="height"
			@mousemove.prevent="handlemousemove($event)"
			@mouseleave.prevent="handleMouseleave($event)"
			@mousewheel.prevent="handleMousewheel($event)"
			@click.prevent="handleClick($event)"></canvas>
		<v-icon icon="right"
			v-if="width>containerWidth"
			@click.prevent="move(-1)"></v-icon>
	</div>
</template>

<script>
export default {
	name: 'v-time-line',
	props: {
		timeList: {
			type: Array,
			default: () => []
		},
		zoom: {
			type: Number,
			default: 6
		},
		backgroundColor: {
			type: String,
			default: '#252526'
		},
		scaleColor: {
			type: String,
			default: '#969696'
		},
		hoverColor: {
			type: String,
			default: '#9CDCFE'
		},
		areaColor: {
			type: String,
			default: '#4EC9B0' // 'rgba(78,201,176,.3)'
		},
		// 每一格的分钟数
		scaleValue: {
			type: Number,
			default: 20,
			validator(value) {
				if (60 % value !== 0 && value > 0 && value < 60) {
					console.warn(
						`scaleValue 必须是大于0, 小于60, 能被 60 整除的整数, 当前值：${value}`
					)
				}
				return true
			}
		},
		// 绘制时间文本间隔小时数
		spaceNum: {
			type: Number,
			default: 2,
			validator(value) {
				if (24 % value !== 0) {
					console.warn(
						`spaceNum 必须是大于0, 小于24, 能被 24 整除的整数, 当前值：${value}`
					)
				}
				return true
			}
		}
	},
	data() {
		return {
			cvs1: null,
			cvs2: null,
			ctx1: null,
			ctx2: null,
			width: 0,
			minWidth: 0,
			maxWidth: 0,
			canvasWidth: 0,
			containerWidth: 0,
			height: 60,
			scaleWidth: 0,
			beginX: 0,
			pixeTime: 0,
			step: 120,
			moveLength: 0,
			remainder: 24,
			timePos: []
		}
	},
	computed: {
		hours() {
			let arr = []
			for (let i = 0; i <= 24; i += this.spaceNum) {
				if (i !== 24) {
					arr.push(`00${i}`.slice(-2) + ':00')
				} else {
					arr.push('00:00')
				}
			}

			return arr
		},
		scaleNum() {
			return (60 / this.scaleValue) * 24
		},
		beginTime() {
			let date
			if (this.timeList.length) {
				let obj = this.timeList[0]
				let arr = Object.keys(obj).map(key => obj[key])
				date = new Date(arr[0])
			} else {
				date = new Date()
			}
			let year = date.getFullYear()
			let month = date.getMonth()
			let day = date.getDate()
			return new Date(`${year}/${month + 1}/${day} 12:00:00`).getTime()
		}
	},
	watch: {
		timeList(n, o) {
			if (n !== o) {
				this.init_()
				this.draw()
				this.setTime()
			}
		}
	},
	mounted() {
		this.init_()
		this.$nextTick(() => {
			this.draw()
			this.setTime()
		})
	},
	methods: {
		// 初始化固定参数
		init_() {
			this.cvs1 = document.getElementById('v-time-line-cvs1')
			this.cvs2 = document.getElementById('v-time-line-cvs2')
			this.ctx1 = this.cvs1.getContext('2d')
			this.ctx2 = this.cvs2.getContext('2d')
			this.containerWidth = this.$refs.timeline.clientWidth
			this.canvasWidth = this.zoom * this.containerWidth
			this.beginX = this.canvasWidth / 2

			let minWidth = this.containerWidth
			while (minWidth--) {
				if (minWidth % this.scaleNum === 24) {
					this.width = this.minWidth = minWidth
					break
				}
			}

			let maxWidth = this.canvasWidth
			while (maxWidth--) {
				if (maxWidth % this.scaleNum === 24) {
					this.maxWidth = maxWidth
					break
				}
			}

			this.init()
		},
		// 初始化变动参数，缩放、移动需重新计算
		init() {
			this.moveLength = (this.width - this.minWidth) / 2
			this.scaleWidth = this.width / this.scaleNum
			this.pixeTime = (this.scaleValue * 60 * 1000) / this.scaleWidth
		},
		draw() {
			let n = this.scaleNum / 2
			let i = Math.floor(this.hours.length / 2)
			let left = this.hours.slice(0, i)
			let right = this.hours.slice(i + 1)
			let num = this.scaleNum / (24 / this.spaceNum) // 绘制显示的时间文本的偏移量
			this.clearRect(this.ctx1)
			while (n > 0) {
				let x = this.beginX + n * this.scaleWidth
				this.drawLine(this.ctx1, x, 0, x, 10)
				// 绘制显示的时间文本
				if (n !== 0 && n % num === 0) {
					this.drawLine(this.ctx1, x, 10, x, 15)
					let text = right.pop()
					let textWidth = this.ctx1.measureText(text).width
					this.drawText(this.ctx1, text, x - textWidth / 2, 30)
				}
				x = this.beginX - n * this.scaleWidth
				this.drawLine(this.ctx1, x, 0, x, 10)
				// 绘制显示的时间文本
				if (n !== 0 && n % num === 0) {
					this.drawLine(this.ctx1, x, 10, x, 15)
					let text = left.shift()
					let textWidth = this.ctx1.measureText(text).width
					this.drawText(this.ctx1, text, x - textWidth / 2, 30)
				}
				n--
			}
			this.drawLine(this.ctx1, this.beginX, 0, this.beginX, 15)
			let text = this.hours[i]
			let textWidth = this.ctx1.measureText(text).width
			this.drawText(this.ctx1, text, this.beginX - textWidth / 2, 30)
		},
		drawLine(ctx, fromX, fromY, toX, toY, color = this.scaleColor) {
			ctx.save()
			ctx.strokeStyle = color
			ctx.beginPath()
			ctx.moveTo(fromX, fromY)
			ctx.lineTo(toX, toY)
			ctx.stroke()
			ctx.restore()
		},
		drawText(ctx, text, x, y, color = this.scaleColor) {
			ctx.save()
			ctx.fillStyle = color
			ctx.fillText(text, x, y)
			ctx.restore()
		},
		drawRect(ctx, x, y, w, h, color = this.areaColor) {
			ctx.save()
			ctx.fillStyle = color
			ctx.globalAlpha = 0.4
			ctx.rect(x, y, w, h)
			ctx.fill()
			ctx.restore()
		},
		setTime() {
			let timeList = this.timeList
			if (!timeList.length) return
			timeList.map((time, i) => {
				let arr = Object.keys(time).map(key => time[key])
				let min = arr[0] - arr[1] > 0 ? arr[1] : arr[0]
				let beginX =
					this.beginX + (min - this.beginTime) / this.pixeTime
				let width = Math.abs(arr[0] - arr[1]) / this.pixeTime

				this.drawRect(this.ctx1, beginX, 0, width, 15)

				if (!this.timePos.length) {
					this.timePos.push({ beginX, endX: beginX + width })
				} else {
					this.timePos.splice(i, 1, { beginX, endX: beginX + width })
				}
			})
		},
		move(n) {
			this.beginX += this.step * n
			let centerX = this.canvasWidth / 2

			if (
				this.beginX >= centerX + this.moveLength ||
				this.beginX <= centerX - this.moveLength
			) {
				this.beginX = centerX + this.moveLength * n
			}

			this.init()
			this.draw()
			this.setTime()
		},
		clearRect(ctx, x = 0, y = 0, w = this.canvasWidth, h = this.height) {
			ctx.clearRect(x, y, w, h)
		},
		/**
		 * 生成hover时，显示的时间文本
		 * time { Number } 时间戳
		 */
		getTimeText(time) {
			let date = new Date(time)
			let h = date.getHours()
			let m = date.getMinutes()
			let s = date.getSeconds()
			return `${(h + '').padStart(2, 0)}:${(m + '').padStart(2, 0)}:${(
				s + ''
			).padStart(2, 0)}`
		},
		handlemousemove(e) {
			let x = e.offsetX
			let flag = this.timePos.some(pos => {
				return x > pos.beginX && x < pos.endX
			})
			if (!flag || e.offsetY > 20) {
				this.clearRect(this.ctx2)
				this.cvs2.style.cursor = 'default'
				return
			}
			this.cvs2.style.cursor = 'pointer'
			this.clearRect(this.ctx2)
			let time = (x - this.beginX) * this.pixeTime + this.beginTime
			let text = this.getTimeText(time)
			let textWidth = this.ctx2.measureText(text).width
			this.drawLine(this.ctx2, x, 0, x, 30, this.hoverColor)
			this.drawText(
				this.ctx2,
				text,
				x - textWidth / 2,
				45,
				this.hoverColor
			)
		},
		handleMousewheel(e) {
			let delta = e.wheelDelta
			let width = this.width
			let step
			while ((width += delta > 0 ? 1 : -1)) {
				if (width % this.scaleNum === this.remainder) {
					step = this.width - width
					this.width = width
					break
				}
			}
			if (this.width <= this.minWidth) {
				this.width = this.minWidth
			}
			if (this.width >= this.maxWidth) {
				this.width = this.maxWidth
			}
			let centerX = this.canvasWidth / 2
			if (delta < 0) {
				if (
					this.beginX !== centerX &&
					Math.abs(this.beginX - centerX) > step / 2
				) {
					let n = this.beginX < centerX ? 1 : -1
					this.beginX += (step / 2) * n
				} else {
					this.beginX = centerX
				}
			}

			setTimeout(() => {
				this.init()
				this.draw()
				this.setTime()
			}, 200)
		},
		handleClick(e) {
			let x = e.offsetX
			let flag = this.timePos.some(pos => {
				return x > pos.beginX && x < pos.endX
			})
			if (!flag || e.offsetY > 20) return
			let time = (x - this.beginX) * this.pixeTime + this.beginTime
			this.$emit('click', Math.floor(time))
		},
		handleMouseleave() {
			this.clearRect(this.ctx2)
		}
	}
}
</script>

<style lang="scss">
.v-time-line {
	width: 100%;
	height: 60px;
	position: relative;
	overflow: hidden;
	background: #252526;
	.v-icon {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 9;
		cursor: pointer;
		svg {
			fill: #969696;
		}
		&:hover {
			svg {
				fill: #ffffff;
			}
		}
		&:first-child {
			left: 5px;
		}
		&:last-child {
			right: 5px;
		}
	}
}
#v-time-line-cvs1,
#v-time-line-cvs2 {
	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
}
</style>