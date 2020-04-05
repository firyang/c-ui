<template>
	<i class="c-icon"
		@click="$emit('click',$event)">
		<svg class="icon"
			aria-hidden="true">
			<use :xlink:href="`#${icon}`"></use>
		</svg>
	</i>
</template>

<script>
import '../styles/icon'
export default {
	name: 'c-icon',
	props: {
		icon: String
	}
}
</script>