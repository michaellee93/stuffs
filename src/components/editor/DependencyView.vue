<template>
  <div class="block">
    <article
      v-show="this.dependencies.length > 0 && !hide"
      class="message is-danger"
    >
      <div class="message-header">
        <p>Warning</p>
        <button
          class="delete"
          @click="hide = true"
          aria-label="delete"
        ></button>
      </div>
      <div class="message-body">
        There {{ dependencies.length === 1 ? "is" : "are" }}
        {{ dependencies.length }}
        {{ dependencies.length === 1 ? "reference" : "references" }} to this
        content from other content. Please consider the impact your change will
        have.
      </div>
    </article>
    <button @click="handleClick" class="button is-danger">
      Show References
    </button>

    <div class="modal" :class="{ 'is-active': active }">
      <div class="modal-background" @click="active = false"></div>
      <div class="modal-content">
        <div class="card block" style="padding: 20px">
          <p class="title">
            {{
              dependencies.length > 0
                ? "This content is referenced by"
                : "This content has no references"
            }}
          </p>
          <div v-for="(d, i) in dependencies" :key="i" class="block">
            <p class="subtitle">
              <a @click="handleSelect(d.id)">{{ d.content.Title }}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/http";
export default {
  props: ["document_id"],
  data() {
    return {
      active: false,
      dependencies: [],
      hide: false,
    };
  },
  methods: {
    handleClick() {
      this.active = true;
    },
    async getDependencies() {
      this.dependencies = await http.get(
        this.API_URL + `/links/${this.document_id}`
      );
    },
    handleSelect(id) {
      this.$router.push(`/docs/${id}`);
    },
  },
  async created() {
    this.getDependencies();
  },
};
</script>

<style>
</style>