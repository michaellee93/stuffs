<template>
  <div class="column" :class="{ columns: top }">
    <div class="column is-10">
      <h1 class="title">{{ document.content.title }}</h1>
      <new-editor :editable="false" :content="document.content.Definition" />
    </div>
    <reco-view v-if="top" :document_id="document_id" />
  </div>
</template>

<script>
import http from "../http";
import NewEditor from "./editor/NewEditor.vue";
import RecoView from "./RecoView.vue";

export default {
  name: "DocumentView",
  props: {
    document_id: {},
    pre: {},
    top: {
      default: false,
    },
    logged: {
      default: false,
    },
    owner: {},
    depth: {
      default: 0,
    },
    version: {
      default: false,
    },
  },
  data() {
    return {
      editors: [],
      document: {
        title: "",
      },
      renderTag: 0,
      loading: false,
    };
  },
  watch: {
    pre() {
      this.document.content = [];
      setTimeout(() => {
        this.document = this.pre;
        this.loading = false;
      }, 20);
    },
  },

  methods: {
    async createDraft() {
      try {
        await http.post(this.API_URL + `/doc/${this.document_id}`, {});
        this.$router.push(`/drafts/${this.document_id}`);
      } catch {
        console.log("couldn't create drafts");
      }
    },
    goToHistory() {
      this.$router.push(`/docs/${this.document_id}/versions`);
    },
  },

  async mounted() {
    this.document = this.pre;
    if (this.document_id) {
      this.document = await http.get(this.API_URL + `/doc/${this.document_id}`);
    }
  },
  components: { RecoView, NewEditor },
};
</script>

<style>
</style>