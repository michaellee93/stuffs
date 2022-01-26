<template>
  <node-view-wrapper class="vue-component">
    <ul class="block" style="padding-top: 15px">
      <li v-for="(_, i) in content" :key="i" @click="currentTab = i">One</li>
    </ul>
    <span class="label" contenteditable="false">Vue Component</span>
    <node-view-content class="contentx" />
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from "@tiptap/vue-2";

export default {
  components: {
    NodeViewWrapper,
    NodeViewContent,
  },
  data() {
    return {
      currentTab: 0,
      content: ["", "", ""],
    };
  },
  props: nodeViewProps,
};
</script>

<style scoped>
.vue-component {
  background: #faf594;
  border: 3px solid #0d0d0d;
  border-radius: 0.5rem;
  margin: 1rem 0;
  position: relative;
}

.label {
  margin-left: 1rem;
  background-color: #0d0d0d;
  font-size: 0.6rem;
  letter-spacing: 1px;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  position: absolute;
  top: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 0.5rem 0.5rem;
}

.contentx {
  margin: 1rem 1rem 1rem;
  padding: 0.5rem;
  border: 2px dashed #0d0d0d20;
  border-radius: 0.5rem;
}
</style>