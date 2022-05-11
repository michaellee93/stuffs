<template>
  <div>
    <article class="message">
      <div class="message-body">
        <h1 class="title is-4">Version #{{ this.document.version }}</h1>
        <p>
          Published at {{ parseDate(this.document.published_at) }} by
          <i>{{ "User Name" }}</i>
        </p>
      </div>
    </article>
    <div class="column columns">
      <div class="column is-10">
        <!-- document view for each type -->
        <dyndoc :document="document" />
        <!-- <process v-if="document.content_type == 3" :document="document" />
        <definition
          v-else-if="document.content_type == 1"
          :document="document"
        />
        <credit-standard
          v-else-if="document.content_type == 7"
          :document="document"
        />-->
      </div>
      <reco-view :document_id="document_id" />
    </div>
  </div>
</template>

<script>
import http from "../http";
import RecoView from "@/components/RecoView.vue";
// import Process from "@/components/documents/Process.vue";
// import Definition from "../components/documents/Definition.vue";
// import CreditStandard from "../components/documents/CreditStandard.vue";
import Dyndoc from "../components/documents/Document.vue";
export default {
  name: "DocumentView",
  props: {
    document_id: {},
    version_id: {},
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
    parseDate(datetime) {
      let date = new Date(datetime);
      return date.toLocaleDateString();
    },
  },

  async mounted() {
    if (this.document_id) {
      let data = await http.get(
        this.API_URL + `/doc/${this.document_id}/versions/${this.version_id}`
      );
      this.$set(this, "document", data);
      if (data.content_type == 4) {
        this.$router.push(data.url);
      }
    }
  },
  components: { RecoView, /*Process, Definition, CreditStandard,*/ Dyndoc },
};
</script>

<style>
</style>