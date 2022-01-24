<template>
  <div>
    <dependency-view v-if="!create" :document_id="this.document_id" />
    <fake-it :cancel="true" :save="true" :publish="true" />
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
  methods: {
    async saveDocument() {
      let body = {
        title: this.title,
        raw_content: this.addLink(this.raw_content),
        block_type: this.block_type,
      };
      let data = await http.put(
        this.API_URL + `/doc/${this.document_id}/draft`,
        body
      );
      this.previewDocument = {};
      this.previewDocument = data;
      this.$emit("saved");
    },

    async createDocument() {
      try {
        let body = {
          title: this.title,
          raw_content: this.addLink(this.raw_content),
          block_type: this.block_type,
        };
        await http.post(this.API_URL + "/doc", body);
        this.$router.push("/drafts");
        //this.$emit('created')
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style>
</style>