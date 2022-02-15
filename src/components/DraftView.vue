<template>
  <div>
    <dependency-view :document_id="this.document_id" />

    <edit-view
      :document_id="this.document_id"
      :cancel="true"
      :save="true"
      :publish="true"
      @published="goBack"
    />
  </div>
</template>

<script>
import http from "../http";
import DependencyView from "./editor/DependencyView.vue";
import EditView from "@/views/EditView";

export default {
  components: { DependencyView, EditView },
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
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
</style>