<template>
  <div class="content">
    <h4 class="title is-5">Product</h4>
    <h1 class="title">{{ document.content.Title }}</h1>
    <hr />
    <h2>Overview</h2>
    <new-editor
      style="padding-left: 20px"
      :editable="false"
      :content="document.content.Overview"
    />
    <h2>Pricing</h2>
    <new-editor
      style="padding-left: 20px"
      :editable="false"
      :content="document.content.Pricing"
    />
    <h2>Technical</h2>
    <new-editor
      style="padding-left: 20px"
      :editable="false"
      :content="document.content.Technical"
    />
    <h2 v-if="document.content.Processes">Processes</h2>
    <new-editor
      style="padding-left: 20px"
      :editable="false"
      :content="document.content.Processes"
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