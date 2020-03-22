<template>
	<div class="v-upload">
		<template>
			<div @click="handleClick"
				class="v-upload-trigger">
				<slot></slot>
			</div>
			<input type="file"
				:name="name"
				:multiple="multiple"
				:accept="accept"
				:disabled="disabled"
				@change="handleChange"
				hidden
				ref="file">
		</template>
		<slot name="tip"></slot>
		<ul class="v-upload-filelist"
			v-if="showFileList">
			<li v-for="file of files"
				:key="file.uid">
				<span class="v-upload-filelist-filename">
					<v-icon icon="picture"></v-icon>{{file.name}}
				</span>
				<v-icon :icon="file.status==='ready'?'loading':file.status==='loading'?'loading':file.status==='fail'?'minus-circle':'check-circle'"
					:class="{fail:file.status==='fail',success: file.status==='success',loading:
                        ['ready','loading'].includes(file.status), 'v-icon-loading':['ready','loading'].includes(file.status)}"
					class="v-upload-filelist-status"></v-icon>
				<v-icon icon="close"
					class="v-upload-filelist-close"
					@click="deleteFile(file.uid)"></v-icon>
			</li>
		</ul>
	</div>
</template>

<script>
import ajax from './ajax'
export default {
	name: 'v-upload',
	props: {
		name: String,
		multiple: {
			type: Boolean,
			default: true
		},
		accept: String,
		disabled: {
			type: Boolean,
			default: false
		},
		action: String,
		showFileList: {
			type: Boolean,
			default: true
		},
		drag: {
			type: Boolean,
			default: false
		},
		fileList: {
			type: Array,
			default: () => []
		},
		limit: Number,
		httpRequest: {
			type: Function,
			default: ajax
		},
		onExceed: Function,
		onChange: Function,
		onSuccess: Function,
		onError: Function,
		onProgress: Function,
		beforeUpload: Function
	},
	data() {
		return {
			temIndex: 1,
			files: [],
			reqs: {},
			showClose: false
		}
	},
	watch: {
		fileList: {
			immediate: true,
			handler(list) {
				list.map(file => {
					file.uid = Math.random() + this.temIndex++
					file.status = 'success'
					this.files.push(file)
				})
			}
		}
	},
	methods: {
		post(rawFile) {
			const uid = rawFile.uid
			const options = {
				file: rawFile,
				filename: this.name,
				action: this.action,
				onProgress: e => {
					this.handleProgress(e, rawFile)
				},
				onSuccess: res => {
					this.handleSuccess(res, rawFile)
				},
				onError: err => {
					this.handleError(err, rawFile)
				}
			}
			const req = this.httpRequest(options)
			this.reqs[uid] = req
			if (req && req.then) {
				req.then(options.onSuccess, options.onError)
			}
		},
		handleProgress(e, rawFile) {
			const file = this.getFile(rawFile)
			file.status = 'uploading'
			file.statusIcon = 'loading'
			file.percentage = e.percent || 0
			this.onProgress && this.onProgress(e, rawFile)
			this.onChange && this.onChange(file)
		},
		handleSuccess(res, rawFile) {
			const file = this.getFile(rawFile)
			file.status = 'success'
			file.statusIcon = 'check-circle'
			this.onSuccess && this.onSuccess(res, rawFile)
			this.onChange && this.onChange(file)
		},
		handleError(err, rawFile) {
			const file = this.getFile(rawFile)
			file.status = 'fail'
			file.statusIcon = 'close-circle'
			this.onError && this.onError(res, rawFile)
			this.onChange && this.onChange(file)
		},
		getFile(rawFile) {
			return this.files.find(file => file.uid === rawFile.uid)
		},
		upload(rawFile) {
			if (!this.beforeUpload) {
				return this.post(rawFile)
			}
			const flag = this.beforeUpload() // 触发beforeUpload钩子
			if (flag) {
				return this.post(rawFile)
			}
		},
		handleFile(rawFile) {
			rawFile.uid = Math.random() + this.temIndex++
			const file = {
				uid: rawFile.uid,
				name: rawFile.name,
				size: rawFile.size,
				raw: rawFile,
				status: 'ready'
			}
			this.files.push(file) // 用于file-list显示
			this.onChange && this.onChange() // 触发onChange钩子
		},
		processFiles(files) {
			;[...files].forEach(rawFile => {
				this.handleFile(rawFile)
				this.upload(rawFile)
			})
		},
		handleChange(e) {
			const files = e.target.files
			// 校验上传文件数量
			if (
				this.limit &&
				this.fileList.length + files.length > this.limit
			) {
				return this.onExceed && this.onExceed(files)
			}

			this.processFiles(files)
		},
		handleClick() {
			this.$refs.file.value = ''
			this.$refs.file.click()
		},
		deleteFile(uid) {
			this.files = this.files.filter(file => file.uid !== uid)
		}
	}
}
</script>

<style lang="scss">
@import '../../styles/_var';
.v-upload {
	&-trigger {
		margin-bottom: 10px;
	}
	&-filelist {
		max-width: 360px;
		padding: 5px 0;
		li {
			display: flex;
			justify-content: space-between;
			padding: 6px;
			cursor: pointer;
			transition: background-color 0.5s ease;
			.v-icon.loading svg {
				fill: $primary;
			}
			.v-icon.fail svg {
				fill: $danger;
			}
			.v-icon.success svg {
				fill: $success;
			}
			.v-upload-filelist-close {
				display: none;
			}
			&:hover {
				background-color: $level4-border;
				.v-upload-filelist-close {
					display: block;
				}
				.v-upload-filelist-status {
					display: none;
				}
			}
		}
		&-filename .v-icon {
			margin-right: 5px;
		}
	}
}
</style>