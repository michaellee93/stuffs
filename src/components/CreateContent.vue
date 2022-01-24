<template>
  <fake-it :cancel="true" :create="true" @created="toContent" />
</template>

<script>
import FakeIt from "./FakeIt.vue";
export default {
  methods: {
    toContent() {
      this.$router.push("/drafts");
    },
  },
  components: { FakeIt },
};
</script>

<style>
</style>