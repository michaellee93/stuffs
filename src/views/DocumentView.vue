<template>
  <div>
    <div class="buttons">
      <button
        @click="createDraft"
        v-show="document.owner_id == current_user"
        class="button"
      >
        Edit
      </button>
      <button @click="goToHistory" class="button">View History</button>
    </div>
    <div class="column columns">
      <div class="column is-10">
        <!-- document view for each type -->
        <dyndoc v-if="true" :document="document" />
        <definition
          v-else-if="document.content_type == 1"
          :document="document"
        />
        <i-c-s v-else-if="document.content_type == 2" :document="document" />
        <process v-else-if="document.content_type == 3" :document="document" />

        <credit-standard
          v-else-if="document.content_type == 7"
          :document="document"
        />

        <product v-else-if="document.content_type == 5" :document="document" />
        <guidance v-else-if="document.content_type == 6" :document="document" />
      </div>
      <reco-view :document_id="document_id" />
    </div>
  </div>
</template>

<script>
import http from "../http";
import RecoView from "@/components/RecoView.vue";
import Process from "@/components/documents/Process.vue";
import Definition from "../components/documents/Definition.vue";
import CreditStandard from "../components/documents/CreditStandard.vue";
import Guidance from "../components/documents/Guidance.vue";
import Product from "../components/documents/Product.vue";
import ICS from "../components/documents/ICS.vue";
import Dyndoc from "../components/documents/Document.vue";

export default {
  name: "DocumentView",
  props: {
    document_id: {},
    logged: {
      default: false,
    },
    current_user: {},
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
        content_type: -1,
      },
      renderTag: 0,
      loading: false,
    };
  },

  methods: {
    async createDraft() {
      try {
        await http.post(this.API_URL + `/doc/${this.document_id}`, {});
        this.$router.push(`/drafts/${this.document_id}`);
      } catch (e) {
        console.log("couldn't create drafts", e);
      }
    },
    goToHistory() {
      this.$router.push(`/docs/${this.document_id}/versions`);
    },
  },

  async mounted() {
    if (this.document_id) {
      let data = await http.get(this.API_URL + `/doc/${this.document_id}`);
      this.$set(this, "document", data);
      if (data.content_type == 4) {
        this.$router.push(data.url);
      }
    }
  },
  components: {
    RecoView,
    Process,
    Definition,
    CreditStandard,
    Guidance,
    Product,
    ICS,
    Dyndoc,
  },
};
</script>
   

<style>
</style>