<template>
	<div class="c-footer"
		:style="{height}">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'c-footer',
	props: {
		height: {
			type: String,
			default: '60px'
		}
	}
}
</script>