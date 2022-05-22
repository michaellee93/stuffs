<template>
	<div class="content">
	<new-editor :definitions="[]" :content.sync="content" :editor-text.sync="editorText" :active="true" />
	<pre>{{content}}</pre>
		</div>
</template>

<script>
import NewEditor from "@/components/editor/NewEditor.vue";
export default {
	components: { NewEditor },
	data() {
		return {
			content: '',
			editorText: ''
		}
	}
}

</script>
	
