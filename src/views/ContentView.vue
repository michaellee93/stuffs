<template>
  <div>
    <p style="padding-bottom: 8px">
      <strong>{{ capitalise(block_type) }}</strong>
    </p>
    <list
      :current_user="current_user"
      @selected="selectItem"
      :items="docs"
    ></list>
  </div>
</template>

<script>
import http from "../http";
import List from "@/components/List.vue";

export default {
  props: ["block_type", "current_user"],
  data() {
    return {
      docs: {},
      reload: false,
    };
  },
  methods: {
    async getDocs() {
      try {
        this.docs = await http.get(
          this.API_URL + "/docs?" + "block_type=" + encodeURI(this.block_type)
        );
      } catch {
        this.docs = [];
      }
    },
    selectItem(item) {
      this.$router.push(`/docs/${item.id}`);
    },
    capitalise(txt) {
      if (txt.length == 3) {
        return txt.toUpperCase();
      }
      return txt[0].toUpperCase() + txt.slice(1);
    },
  },
  watch: {
    $route: "getDocs",
  },
  created() {
    this.getDocs();
  },
  components: { List },
};
</script>

<style>
</style>