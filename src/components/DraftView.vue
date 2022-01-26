<template>
  <div>
    <dependency-view :document_id="this.document_id" />
    <fake-it
      :document_id="this.document_id"
      :cancel="true"
      :save="true"
      :publish="true"
    />
  </div>
</template>

<script>
import http from "../http";
import DependencyView from "./editor/DependencyView.vue";
import FakeIt from "./FakeIt.vue";

export default {
  components: { DependencyView, FakeIt },
  props: {
    document_id: {},
  },
  data: () => {
    return {};
  },

  async mounted() {
    this.linkTerms = await http.get(this.API_URL + "/titles");
    let data = await http.get(this.API_URL + `/doc/${this.document_id}/draft`);
    this.previewDocument = data;
  },
  methods: {},
};
</script>

<style>
</style>