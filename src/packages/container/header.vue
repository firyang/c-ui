<template>
	<div class="v-header"
		:style="{height}">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'v-header',
	props: {
		height: {
			type: String,
			default: '60px'
		}
	}
}
</script>