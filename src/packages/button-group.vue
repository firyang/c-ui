<template>
	<div class="v-button-group">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'v-button-group'
}
</script>

<style lang="scss">
@import '../styles/_var';

.v-button-group {
	display: inline-flex;
	justify-content: center;
	.v-button {
		position: relative;
		border-radius: 0;
	}
	.v-button:first-child {
		border-top-left-radius: $border-radius;
		border-bottom-left-radius: $border-radius;
	}
	.v-button:last-child {
		border-top-right-radius: $border-radius;
		border-bottom-right-radius: $border-radius;
	}
	.v-button:not(:last-child)::after {
		content: '';
		display: block;
		width: 0;
		border-right: 1px solid $basic-white;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		z-index: 3;
	}
}
</style>