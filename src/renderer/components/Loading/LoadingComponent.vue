<template>
	<div>
		<img src="~@/assets/icons/loading.svg" style="width:120px; height:120px;">
		<p>{{ message }}</p>
	</div>
</template>

<script>
export default {
  props: ['message']
}
</script>