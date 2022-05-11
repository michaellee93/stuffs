<template>
  <div>
    <h1 class="title">{{ document.content.Title }}</h1>
    <new-editor :editable="false" :content="document.content.Definition" />
  </div>
</template>

<script>
import NewEditor from "../editor/NewEditor.vue";
export default {
  props: { document: { type: Object, required: true } },
  components: { NewEditor },
};
</script>

<style>
</style>