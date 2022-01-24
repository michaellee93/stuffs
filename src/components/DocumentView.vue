<template>
  <div class="column" :class="{ columns: top }">
    <div
      style="position: relative; padding-top: 0.75em"
      class="block"
      :class="{ column: top }"
    >
      <button v-if="logged" @click="createDraft" class="button block">
        Edit
      </button>
      <button v-if="version && logged" class="button" @click="goToHistory">
        View History
      </button>
      <h1 class="title">{{ document.title }}</h1>
      <block
        v-for="(c, i) in document.content"
        :block="c"
        :key="i"
        :depth="depth + 1"
      />
    </div>
    <reco-view v-if="top" :document_id="document_id" />
  </div>
</template>

<script>
import http from "../http";
import { marked } from "marked";
import Block from "./Block.vue";
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
      document: {
        title: "",
      },
      renderTag: 0,
      loading: false,
    };
  },
  watch: {
    pre() {
      console.log(this.tender);
      this.document.content = [];
      setTimeout(() => {
        this.document = this.pre;
        this.loading = false;
      }, 20);
    },
  },

  /*beforeRouteEnter() {
        http.get(`/doc/${this.document_id}`).then(data => {
            this.document = data;
        });
 
    },*/

  methods: {
    parseMarkdown(text) {
      return marked.parse(text);
    },
    show(content) {
      switch (content.content_type) {
        case "text":
          return this.parseMarkdown(content.text);
        case "embed":
          return "";
        case "link":
          return content.text;
      }
    },
    async createDraft() {
      await http.post(this.API_URL + `/doc/${this.document_id}`, {});
      this.$router.push(`/drafts/${this.document_id}`);
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
  components: { Block, RecoView },
};
</script>

<style>
</style>