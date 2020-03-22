<template>
	<div class="v-footer"
		:style="{height}">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'v-footer',
	props: {
		height: {
			type: String,
			default: '60px'
		}
	}
}
</script>