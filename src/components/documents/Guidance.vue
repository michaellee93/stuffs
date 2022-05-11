<template>
  <div class="content">
    <h4 class="title is-5">Guidance</h4>
    <h1 class="title">{{ document.content.Title }}</h1>
    <hr />
    <h2>At a Glance</h2>
    <new-editor
      style="padding-left: 20px"
      :editable="false"
      :content="document.content['At a Glance']"
    />
    <h2>Banking</h2>
    <new-editor
      style="padding-left: 20px"
      :editable="false"
      :content="document.content.Banking"
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