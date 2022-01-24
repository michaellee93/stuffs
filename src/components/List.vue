<template>
  <ul>
    <li
      style="cursor: pointer"
      class="block"
      v-for="(item, i) in items"
      :key="i"
    >
      <slot name="item" v-bind:item="item">
        <div class="columns">
          <div @click="selectItem(item)" class="column is-9">
            <p class="is-size-5">{{ item.content.title }}</p>
            <p class="is-size-7">{{ preview(item) }}</p>
          </div>
          <div class="column is-2">
            <button class="button" @click="createDraft(item)">Edit</button>
          </div>
        </div>
      </slot>
    </li>
  </ul>
</template>

<script>
import http from "../http";
export default {
  props: {
    items: {
      default: [],
      required: true,
    },
  },
  methods: {
    selectItem(item) {
      this.$emit("selected", item);
    },
    preview(item) {
      let created = new Date(item.created_at);
      let published = new Date(item.published_at);
      if (created.getFullYear() > 1) {
        return (
          "Created: " + created.toLocaleString().slice(0, 10)
        );
      } else if (published.getFullYear() > 1) {
                return (
          "Published: " + published.toLocaleString().slice(0, 10)
        );
      }
    },

    async createDraft(item) {
      try {
        await http.post(`/doc/${item.id}`);
      } catch (e) {
        console.log(e);
      }
      this.$router.push(`/drafts/${item.id}`);
    },
  },
};
</script>

<style>
</style>