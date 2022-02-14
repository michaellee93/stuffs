<template>
  <div>
    <input
      style="margin-bottom: 10px"
      v-on:
      enter="search"
      class="input"
      v-model.trim="query"
    />
    <list v-if="results.length > 0" @selected="goToItem" :items="results">
      <template v-slot:item="slotProps">
        <p @click="goToItem(slotProps.item)" class="is-size-6">
          {{ slotProps.item.content.title }}
        </p>
        <p class="is-size-7">
          {{ content_types[slotProps.item.content_type - 1] }}
        </p>
        <hr />
      </template>
    </list>
    <p class="block" v-else-if="query.length > 0 && !loading">No results</p>
  </div>
</template>

<script>
import List from "./List.vue";

export default {
  data: () => {
    return {
      query: "",
      results: [],
      loading: false,
      timeout: null,
      content_types: [
        "Definition",
        "Industry Credit Standard",
        "Process",
        "URL",
        "Product",
        "Guidance",
        "Credit Standard",
      ],
    };
  },
  methods: {
    async search() {
      this.loading = true;
      let res = await fetch(
        this.API_URL + "/search?q=" + encodeURI(this.query)
      );
      let data = await res.json();
      this.results = data;
      this.loading = false;
    },
    goToItem(item) {
      this.$router.push(`/docs/${item.id}`);
    },
  },
  watch: {
    query() {
      if (this.timeout == null) {
        this.search();
        this.timeout = setTimeout(() => {}, 200);
      } else {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.search, 200);
      }
    },
  },
  components: { List },
};
</script>

<style>
</style>