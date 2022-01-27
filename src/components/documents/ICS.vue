<template>
  <div class="content">
    <h4 class="title is-5">Product</h4>
    <h1 class="title">{{ document.content.title }}</h1>
    <hr />
    <p><b>Industry: </b>{{ document.content.Industry }}</p>
    <p><b>Client Type: </b>{{ document.content["Client Type"] }}</p>
    <p><b>Security: </b>{{ document.content.Security }}</p>
    <h2>Metrics</h2>
    <new-editor
      style="padding-left: 20px"
      :editable="false"
      :content="document.content.Metrics"
    />
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