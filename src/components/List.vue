<template>
  <ul>
    <li
      style="cursor: pointer"
      class="block"
      v-for="(item, i) in items"
      :key="i"
    >
      <slot name="item" v-bind:item="item">
        <div v-if="loading">
          <div class="skele"></div>
          <div class="skele"></div>
          <div class="skele"></div>
        </div>
        <div v-else class="columns">
          <div @click="selectItem(item)" class="column is-9">
            <p class="is-size-5">
              {{ item.content.Title || item.content.URL || "New #" + item.id }}
            </p>
            <p class="is-size-7">{{ preview(item) }}</p>
          </div>
          <div class="column is-2">
            <button
              v-show="current_user == item.owner_id"
              class="button"
              @click="createDraft(item)"
            >
              Edit
            </button>
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
    current_user: {},
    loading: {
      default: false,
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
        return "Created: " + created.toLocaleString().slice(0, 10);
      } else if (published.getFullYear() > 1) {
        return "Published: " + published.toLocaleString().slice(0, 10);
      }
    },

    async createDraft(item) {
      try {
        await http.post(this.API_URL + `/doc/${item.id}`);
        this.$router.push(`/drafts/${item.id}`);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style>
.skele {
  height: 3rem;
  width: 70%;
  animation: wobble 2s infinite;
  border-radius: 4px;
}

.skele:not(:last-child) {
  margin-bottom: 1rem;
}

@keyframes wobble {
  0% {
    background: #eee;
  }
  50% {
    background: #ddd;
  }
  100% {
    background: #eee;
  }
}
</style>