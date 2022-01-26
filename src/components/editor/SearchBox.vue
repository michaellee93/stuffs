<template>
  <div class="modal" :class="{ 'is-active': active }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content">
      <div class="search-box">
        <div class="columns block">
          <div class="column is-10">
            <input
              style="margin-bottom: 10px"
              v-on:
              enter="search"
              class="input"
              v-model.trim="query"
            />
          </div>
          <div class="column is-2">
            <button
              class="button"
              :class="{ 'is-success': validLink }"
              @click="outputQuery"
            >
              Add
            </button>
          </div>
        </div>
        <list
          style="list-style: none"
          v-if="results.length > 0"
          @selected="selectItem"
          :items="results"
        />

        <p class="block" v-else-if="query.length > 0 && !loading">No results</p>
      </div>
    </div>
    <button @click="closeModal" class="modal-close is-large"></button>
  </div>
</template>

<script>
import List from "../List.vue";

export default {
  props: {
    active: { default: false },
  },
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
    outputQuery() {
      if (this.validLink) {
        this.$emit("selected", this.query);
        this.closeModal();
      }
    },
    closeModal() {
      this.$emit("close");
    },
    async search() {
      if (!this.validLink) {
        this.loading = true;
        let res = await fetch(
          this.API_URL + "/search?q=" + encodeURI(this.query)
        );
        let data = await res.json();
        this.results = data;
        this.loading = false;
      }
    },
    selectItem(item) {
      this.$emit("selected", this.APP_DOMAIN + "/#/docs/" + item.id);
      this.closeModal();
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
  computed: {
    validLink() {
      return this.query.slice(0, 8).toLowerCase() == "https://";
    },
  },
  components: { List },
};
</script>

<style>
.search-box {
  padding: 2em;
  height: 300px;
  background-color: white;
  border-radius: 7px;
}
</style>