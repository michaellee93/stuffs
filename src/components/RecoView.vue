<template>
  <div class="column is-2">
    <nav class="panel">
      <p class="panel-heading">Recommended</p>
      <a
        @click="handleSelect(r.id)"
        v-for="(r, i) in recommended"
        :key="i"
        class="panel-block is-active"
      >
        <span class="panel-icon">
          <i class="fas fa-book" aria-hidden="true"></i>
        </span>
        {{ r.title }}
      </a>
    </nav>
  </div>
</template>

<script>
import http from "../http";
export default {
  props: ["document_id"],
  data() {
    return {
      active: false,
      recommended: [],
      hide: false,
    };
  },
  methods: {
    handleClick() {
      this.active = true;
    },
    async getDependencies() {
      this.recommended = await http.get(
        this.API_URL + `/recommended/${this.document_id}`
      );
    },
    handleSelect(id) {
      this.$router.push(`/docs/${id}`);
    },
  },
  mounted() {
    this.getDependencies();
  },
};
</script>

<style>
</style>