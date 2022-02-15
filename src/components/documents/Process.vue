<template>
  <div class="content">
    <h1 class="title">{{ document.content.Title }}</h1>
    <div
      class="columns step"
      v-for="(step, i) in document.content.Steps"
      :key="i"
    >
      <p :id="'step-' + i + 1" class="column is-1">
        <em>Step {{ i + 1 }}</em>
      </p>
      <new-editor class="column is-11" :editable="false" :content="step" />
    </div>
  </div>
</template>

<script>
import NewEditor from "../editor/NewEditor.vue";
export default {
  components: { NewEditor },
  props: { document: { type: Object, required: true } },
};
</script>

<style>
.step > p {
  border-right: 1px dotted #dfdfdf;
}
</style>