<template>
  <div>
    <div v-if="block.content_type == 'text'" ref="text" class="content"></div>
    <div v-else-if="block.content_type == 'conditional'">
      <div class="tabs is-fullwidth">
        <ul>
          <li
            @click="currKey = key"
            :key="key"
            v-for="(value, key) in block.branches"
            :class="{ 'is-active': currKey == key }"
          >
            <a>{{ formatBranch(key) }}</a>
          </li>
        </ul>
      </div>

      <div
        v-show="currKey == key"
        :key="key"
        v-for="(value, key) in block.branches"
      >
        <block
          v-for="(c, i) in block.branches[key]"
          :block="c"
          :key="depth + '_' + i"
          :depth="depth + 1"
        />
      </div>
    </div>

    <div style="padding-top: 10px" v-else-if="block.content_type == 'embed'">
      <document-view
        :document_id="block.link_block_id"
        :version="false"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<script>
import DocumentView from "./DocumentView.vue";
import { marked } from "marked";
import http from "../http";
export default {
  name: "block",
  props: ["block", "depth"],
  data() {
    return {
      currKey: "",
      doc: {},
    };
  },
  methods: {
    formatBranch(branch) {
      return branch.charAt(0).toUpperCase() + branch.slice(1);
    },
  },
  async mounted() {
    if (this.block.content_type == "text") {
      this.$refs.text.innerHTML = marked.parse(this.block.text);
    }

    if (this.block.content_type == "conditional") {
      this.currKey = Object.keys(this.block.branches)[0];
    }
    if (this.block.content_type == "embed") {
      this.doc = await http.get(
        this.API_URL + `/doc/${this.block.link_block_id}`
      );
    }
  },
  components: { DocumentView },
};
</script>

<style>
</style>