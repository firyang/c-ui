<template>
	<div id="app">
		<div class="picker-container">
			<c-date-picker placeholder="选择日期"
				v-model="checkDate"></c-date-picker>
		</div>
		<div>{{checkDate}}</div>
		<div class="container">
			<c-popover trigger="hover"
				title="提示信息"
				content="这是一段提示信息，popover组件的提示信息"
				placement="top-right">
				<c-button slot="reference">hover 触发</c-button>
			</c-popover>
			<c-popover title="提示信息"
				content="这是一段提示信息，popover组件的提示信息">
				<c-button slot="reference">click 触发</c-button>
			</c-popover>
			<c-popover title="提示信息"
				content="这是一段提示信息，popover组件的提示信息"
				width="300px"
				:autofix="true">
				<c-button slot="reference">自适应位置</c-button>
			</c-popover>
			<c-popover title="提示信息"
				content="这是一段提示信息，popover组件的提示信息"
				placement="bottom-left"
				:scroll-hide="true">
				<c-button slot="reference">滚动页面自动隐藏</c-button>
			</c-popover>
			<c-popover title="提示信息"
				content="这是一段提示信息，popover组件的提示信息"
				placement="top-left"
				v-model="value3">
				<c-button slot="reference"
					@click="value3=!value3">手动触发</c-button>
			</c-popover>
		</div>
		<!-- upload -->
		<div v-if="false">
			<div class="time-line">
				<c-time-line :time-list="timeList"
					:scale-value="20"
					:space-num="4"
					@click="getValue"></c-time-line>
				<br>
				<button @click="changeTime">click</button>
			</div>
			<c-upload name="myUpload"
				accept="image/jpeg"
				action="http://localhost:3000/upload"
				:file-list="fileList"
				multiple>
				<c-button type="primary"
					size="small">点击上传</c-button>
				<p slot="tip">只能上传jpg/png文件，且不超过500kb</p>
			</c-upload>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			fileList: [{ name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg' }],
			timeList: [
				{ begin_time: 1584663810000, end_time: 1584679572000 },
				{ begin_time: 1584708272114, end_time: 1584719908754 },
				{ begin_time: 1584637782000, end_time: 1584647361600 }
			],
			checkDate: '',
			value1: false,
			value2: false,
			value3: false
		}
	},
	methods: {
		changeTime() {
			this.timeList = [{ begin_time: 1584663810000, end_time: 1584679572000 }]
			console.log(this.timeList)
		},
		getValue(value) {
			console.log(value)
		}
	}
}
</script>

<style lang="scss">
@import './styles/_var';
#app {
	padding: 20px;
	h3 {
		padding: 20px 0;
	}
}
.mgRight {
	margin-right: 20px;
}
.prefix-icon {
	display: inline-block;
	color: $placeholder-font;
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	cursor: pointer;
	:hover {
		color: $minor-font;
	}
}
.time-line {
	margin: 0 auto;
	width: 800px;
}
.picker-container {
	display: flex;
	justify-content: center;
	margin: 100px 0;
}
.container {
	display: flex;
	justify-content: space-around;
}
</style>
