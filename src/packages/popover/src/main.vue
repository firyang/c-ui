<template>
	<div class="c-popover-wrapper">
		<transition name="popover-slide-fade">
			<div v-if="visible"
				class="c-popover"
				:style="popStyle"
				ref="popover"
				@click.stop>
				<h4 v-if="title"
					v-text="title"></h4>
				<slot>{{content}}</slot>
				<span v-if="showArrow"
					:class="`c-arrow c-arrow-${position}`"
					:style="arrowStyle"></span>
			</div>
		</transition>
		<slot name="reference"></slot>
	</div>
</template>

<script>
const on = (element, event, handler) => {
	element.addEventListener(event, handler, false)
}

const off = (element, event, handler) => {
	element.removeEventListener(event, handler, false)
}

const isScrollElement = el => {
	const isSetOverflowX = ['auto', 'scroll'].includes(getComputedStyle(el)['overflow-x'])
	const isSetOverflowY = ['auto', 'scroll'].includes(getComputedStyle(el)['overflow-y'])
	return isSetOverflowX || isSetOverflowY
}

const getScrollElement = el => {
	let parent = el
	while (parent !== document) {
		if (isScrollElement(parent)) {
			return parent
		} else {
			parent = parent.parentNode
		}
	}
}

const getElementRect = el => {
	return {
		x: el.offsetLeft,
		y: el.offsetTop,
		w: el.offsetWidth,
		h: el.offsetHeight
	}
}

export default {
	name: 'c-popover',
	props: {
		value: { type: Boolean, default: undefined },
		title: String,
		content: String,
		width: [String, Number],
		placement: { type: String, default: 'top' },
		trigger: { type: String, default: 'click' },
		showArrow: { type: Boolean, default: true },
		scrollHide: { type: Boolean, default: false },
		autofix: { type: Boolean, default: false }
	},
	data() {
		return {
			visible: false,
			position: '',
			arrowStyle: [],
			popStyle: {},
			popover: null,
			rootElmRect: '',
			popRect: '',
			refRect: ''
		}
	},
	watch: {
		visible(value) {
			if (value && !this.isManual) {
				this.displayPop()
				this.$emit('show', value)
			} else {
				this.$emit('hide', value)
			}
		},
		value: {
			immediate: true,
			handler(value) {
				this.visible = value
				if (value) {
					this.displayPop()
				}
			}
		}
	},
	computed: {
		isManual() {
			return this.value !== undefined
		}
	},
	methods: {
		init() {
			const reference = this.$slots.reference
			if (reference) {
				this.reference = reference[0].elm
			}

			if (this.trigger === 'click') {
				on(this.reference, 'click', this.toggle)
				!this.isManual && on(document, 'click', this.handleDocumentClick)
			} else if (this.trigger === 'hover') {
				on(this.$el, 'mouseenter', this.handleMouseenter)
				on(this.$el, 'mouseleave', this.handleMouseleave)
			}

			this.popStyle = { width: this.width }
			this.position = this.placement

			if (getComputedStyle(document.body).position !== 'relative') {
				document.body.style.position = 'relative'
			}

			const root = getScrollElement(this.reference) || document.documentElement
			const scrollTop = root.scrollTop
			const scrollLeft = root.scrollLeft
			const { w, h } = getElementRect(root)
			this.rootElmRect = { w, h, scrollTop, scrollLeft, elm: root }
			this.refRect = getElementRect(this.reference)
			this.vw = window.innerWidth
			this.vh = window.innerHeight
			if (w > this.vw || h > this.vh) {
				this.isScroll = true
				on(document, 'scroll', this.handleScroll)
			}
		},
		displayPop() {
			this.$nextTick(() => {
				this.popover = this.$refs.popover
				document.body.appendChild(this.popover)
				if (this.trigger === 'hover') {
					on(this.popover, 'mouseenter', this.handleMouseenter)
					on(this.popover, 'mouseleave', this.handleMouseleave)
				}
				this.positionPop()
			})
		},
		toggle() {
			if (!this.isManual) {
				this.visible = !this.visible
			}
		},
		handleDocumentClick(e) {
			if (!this.$el.contains(e.target)) {
				this.visible = false
			}
		},
		handleMouseenter() {
			if (!this.isManual) {
				clearTimeout(this.timer)
				this.visible = true
			}
		},
		handleMouseleave() {
			if (!this.isManual) {
				this.timer = setTimeout(() => {
					this.visible = false
				}, 200)
			}
		},
		handleScroll(e) {
			this.scrollHide && (this.visible = false)

			const rootScrollObj = {
				scrollTop: this.rootElmRect.elm.scrollTop,
				scrollLeft: this.rootElmRect.elm.scrollLeft
			}

			this.rootElmRect = { ...this.rootElmRect, ...rootScrollObj }

			if (this.visible && this.autofix && !this.scrollHide && !this.isManual) {
				const pos = this.validPos(this.pos, this.position)
				this.updatePopStyle(pos)
			}
		},
		positionPop() {
			setTimeout(() => {
				let pos
				if (!this.pos) {
					pos = this.pos = this.calcPos()
					this._pos = pos
				} else {
					pos = this.pos
				}

				if (this.autofix && !this.scrollHide) {
					pos = this.validPos(pos, this.position)
				}

				this.pos = pos

				this.updatePopStyle(pos)
			}, 50)
		},
		calcPos(placement = this.placement) {
			let popRect = this.popRect
			if (!popRect) {
				popRect = this.popRect = getElementRect(this.popover)
			}

			const { w: popW, h: popH } = popRect
			const { x, y, w, h } = this.refRect
			let top, left
			switch (placement) {
				case 'bottom':
					left = x - (popW - w) / 2
					top = y + h + 12
					break
				case 'bottom-right':
					left = x
					top = y + h + 12
					break
				case 'bottom-left':
					left = x - (popW - w)
					top = y + h + 12
					break
				case 'top':
					left = x - (popW - w) / 2
					top = y - popH - 12
					break
				case 'top-right':
					left = x
					top = y - popH - 12
					break
				case 'top-left':
					left = x - (popW - w)
					top = y - popH - 12
					break
				case 'left':
					top = y - (popH - h) / 2
					left = x - popW - 12
					break
				case 'left-top':
					top = y - (popH - h)
					left = x - popW - 12
					break
				case 'left-bottom':
					top = y
					left = x - popW - 12
					break
				case 'right':
					top = y - (popH - h) / 2
					left = x + w + 12
					break
				case 'right-top':
					top = y - (popH - h)
					left = x + w + 12
					break
				case 'right-bottom':
					top = y
					left = x + w + 12
					break
			}

			return { left, top }
		},
		validPos(pos, placement) {
			const oldPlacement = this.placement
			const { isOver, position } = this.checkLimit(oldPlacement, this._pos)
			if (!isOver) {
				this.position = oldPlacement
				pos = this._pos
			} else {
				this.position = position
				pos = this.pos = this.calcPos(this.position)
			}

			return pos
		},
		checkLimit(placement, pos) {
			const vw = this.vw
			const vh = this.vh
			const { scrollTop, scrollLeft } = this.rootElmRect
			const { w, h } = this.popRect
			const { top, left } = pos
			const limitOptions = {
				top: { isOver: top - scrollTop < 0, key: 'bottom' },
				bottom: { isOver: top + h - scrollTop > vh, key: 'top' },
				left: { isOver: left - scrollLeft < 0, key: 'right' },
				right: { isOver: left + w - scrollLeft > vw, key: 'left' }
			}

			let position,
				isOver = false
			let [key1, key2] = placement.split('-')

			if (limitOptions[key1].isOver) {
				key1 = limitOptions[key1].key
				isOver = true
			}
			if (key2 && limitOptions[key2].isOver) {
				key2 = limitOptions[key2].key
				isOver = true
			}

			position = key2 ? [key1, key2].join('-') : key1
			return { isOver, position }
		},
		updatePopStyle(pos) {
			const { left, top } = pos
			const styles = { top: `${top}px`, left: `${left}px` }
			this.popStyle = { ...this.popStyle, ...styles }
		}
	},
	mounted() {
		this.init()
	},
	destroyed() {
		off(this.reference, 'click', this.toggle)
		!this.isManual && off(document, 'click', this.handleDocumentClick)
		this.trigger === 'hover' && off(this.$el, 'mouseenter', this.handleMouseenter)
		this.trigger === 'hover' && off(this.$el, 'mouseleave', this.handleMouseleave)
		this.popover && off(this.popover, 'mouseenter', this.handleMouseenter)
		this.popover && off(this.popover, 'mouseleave', this.handleMouseleave)
		this.isScroll && off(document, 'scroll', this.handleScroll)
	}
}
</script>

<style lang="scss">
@import '../../../styles/_var';
.c-popover-wrapper {
	display: inline-block;
}
.c-popover {
	line-height: 1.5;
	width: 260px;
	padding: 15px;
	border: 1px solid $level1-border;
	border-radius: $border-radius;
	box-shadow: 1px 0 12px 0 $level4-border, 0 1px 12px 0 $level4-border;
	background: $basic-white;
	position: absolute;
	top: -1000px;
	z-index: 9;
	h4 {
		margin-bottom: 5px;
	}
}
.c-arrow {
	display: block;
	width: 14px;
	height: 14px;
	position: absolute;
	&::before,
	&::after {
		content: '';
		display: block;
		width: 0;
		height: 0;
		border: 7px solid $level1-border;
		border-left-color: transparent;
		border-right-color: transparent;
		border-top-color: transparent;
		position: absolute;
	}
	&::after {
		border-bottom-color: $basic-white;
		top: -1px;
	}
}
.c-arrow-top {
	left: 50%;
	margin-left: -7px;
	bottom: -14px;
	&::before,
	&::after {
		transform: rotate(180deg);
	}
}
.c-arrow-top-left {
	right: 26px;
	bottom: -14px;
	&::before,
	&::after {
		transform: rotate(180deg);
	}
}
.c-arrow-top-right {
	left: 26px;
	bottom: -14px;
	&::before,
	&::after {
		transform: rotate(180deg);
	}
}
.c-arrow-bottom {
	left: 50%;
	margin-left: -7px;
	top: -14px;
	&::after {
		top: 1px;
	}
}
.c-arrow-bottom-left {
	right: 26px;
	top: -14px;
	&::after {
		top: 1px;
	}
}
.c-arrow-bottom-right {
	left: 26px;
	top: -14px;
	&::after {
		top: 1px;
	}
}
.c-arrow-right {
	top: 50%;
	margin-top: -7px;
	left: -14px;
	&::before,
	&::after {
		transform: rotate(-90deg);
	}
	&::after {
		top: 0;
		left: 1px;
	}
}
.c-arrow-right-top {
	bottom: 15px;
	left: -14px;
	&::before,
	&::after {
		transform: rotate(-90deg);
	}
	&::after {
		top: 0;
		left: 1px;
	}
}
.c-arrow-right-bottom {
	top: 15px;
	left: -14px;
	&::before,
	&::after {
		transform: rotate(-90deg);
	}
	&::after {
		top: 0;
		left: 1px;
	}
}
.c-arrow-left {
	top: 50%;
	margin-top: -7px;
	right: -14px;
	&::before,
	&::after {
		transform: rotate(90deg);
	}
	&::after {
		top: 0;
		left: -1px;
	}
}
.c-arrow-left-top {
	bottom: 15px;
	right: -14px;
	&::before,
	&::after {
		transform: rotate(90deg);
	}
	&::after {
		top: 0;
		left: -1px;
	}
}
.c-arrow-left-bottom {
	top: 15px;
	right: -14px;
	&::before,
	&::after {
		transform: rotate(90deg);
	}
	&::after {
		top: 0;
		left: -1px;
	}
}
/* transition */
.popover-slide-fade-enter-active {
	height: auto;
	transition: height 0.3s;
}
.popover-slide-fade-leave-active {
	height: auto;
	transition: height 0.1s;
}
.popover-slide-fade-enter,
.popover-slide-fade-leave-to {
	height: 0;
	opacity: 0;
}
</style>