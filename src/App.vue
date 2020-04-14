<template>
	<div id="app">
		<div style="height:550px;">top</div>
		<div class="picker-container">
			<c-date-picker placeholder="选择日期"
				v-model="checkDate"></c-date-picker>
		</div>
		<div style="margin: 50px;display:flex;justify-content:center;">
			<c-popover trigger="click"
				title="提示信息"
				content="这是一段提示信息，popover提示信息"
				placement="left-bottom"
				v-model="value">
				<c-button slot="reference">click me</c-button>
			</c-popover>
		</div>
		<div style="height:800px;">bottom</div>
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
			checkDate: '2020-3-5',
			value: false
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
	justify-content: flex-end;
}
</style>
