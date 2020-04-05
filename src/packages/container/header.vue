<template>
	<div class="c-header"
		:style="{height}">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'c-header',
	props: {
		height: {
			type: String,
			default: '60px'
		}
	}
}
</script>