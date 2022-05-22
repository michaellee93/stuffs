<template>
	<div class="content">

	<pre>{{content}}</pre>
		</div>
</template>

<script>
export default {
	data() {
		return {
			content: '',
			editorText: ''
		}
	}, 
	created() {
this.content = window.schemas		
	},
}

</script>
	
