<template>
  <div>
    <p class="is-size-3 block">Drafts</p>
    <button @click="createNew" class="block button is-success is-rounded">
      <span class="icon"><i class="fa fa-plus" /></span>
      <span>Create</span>
    </button>
    <div v-for="(v, k, i) in drafts" :key="i">
      <p style="padding-bottom: 8px">
        <strong>{{ k[0].toUpperCase() + k.slice(1) }}</strong>
      </p>
      <list @selected="selectDraft" :items="v" />

      <hr />
    </div>
  </div>
</template>

<script>
import http from "../http";
import List from "./List.vue";

export default {
  props: ["current_user"],
  data() {
    return {
      drafts: {},
    };
  },
  methods: {
    async getDrafts() {
      this.drafts = await http.get(this.API_URL + "/drafts");
    },
    selectDraft(item) {
      this.$router.push(`/drafts/${item.id}`);
    },
    async createNew() {
      let data = { owner_id: this.current_user };
      let created = await http.post(this.API_URL + "/doc", data);
      this.selectDraft(created);
    },
  },
  async mounted() {
    this.getDrafts();
  },
  components: { List },
};
</script>

<style>
</style>