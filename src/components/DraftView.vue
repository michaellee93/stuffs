<template>
  <div>
    <dependency-view v-if="!create" :document_id="this.document_id" />
    <fake-it :cancel="true" :save="true" :publish="true" />
  </div>
</template>

<script>
import http from "../http";
import DependencyView from "./editor/DependencyView.vue";
import FakeIt from "./FakeIt.vue";

export default {
  components: { DependencyView, FakeIt },
  props: {
    document_id: {},
    create: { default: false },
    preview: { default: false },
    publish: { default: false },
    save: { default: false },
    cancel: { default: false },
  },
  data: () => {
    return {
      whichEditor: true,
      currentInput: "",
      searchActive: false,

      blocktypes: [],
      loading: false,

      title: "",
      raw_content: "",
      shadow_raw_content: "",
      block_type: 0,

      timeout: null,
      results: [],
      titles: [],

      previewID: null,
      saveTimeout: null,
      previewDocument: {},

      linkTerms: {},
    };
  },
  watch: {
    currentInput(newValue) {
      if (newValue.slice(1, 3) == "[[") {
        this.searchActive = true;
        setTimeout(() => {
          this.$refs.query.focus();
        }, 200);
      } else {
        this.searchActive = false;
      }
    },

    raw_content() {
      //this.shadow_raw_content = this.addLink(this.raw_content)
      //this.currentInput = this.$refs.input.value.slice(this.$refs.input.selectionStart - 3, this.$refs.input.selectionStart)
      if (!this.create) {
        if (this.saveTimeout !== null) {
          clearTimeout(this.saveTimeout);
        }

        this.saveTimeout = setTimeout(async () => {
          await this.saveDocument();
        }, 1000);
      }
    },
  },
  async mounted() {
    this.linkTerms = await http.get(this.API_URL + "/titles");
    let data = await http.get(this.API_URL + `/doc/${this.document_id}/draft`);

    //this.shadow_raw_content = this.removeLink(data.raw_content);
    this.title = data.title;
    this.raw_content = this.removeLink(data.raw_content);
    this.block_type = data.block_type;

    this.previewDocument = data;
  },
  methods: {
    addLink(content) {
      let keys = Object.keys(this.linkTerms);
      if (keys.length > 0) {
        let collapsed = keys.reduce((a, e) => a + "|" + e);
        let regexp = new RegExp(collapsed, "gi");
        return content.replace(regexp, (match) => {
          return `[${match}](/#/docs/${this.linkTerms[match]})`;
        });
      }
    },
    removeLink(content) {
      let reg = /\[.+\]\(.+\)/gm;
      return content.replace(reg, (match) => {
        console.log("MATCH: ", match);
        return match.slice(match.indexOf("[") + 1, match.indexOf("]"));
      });
    },

    async getDefns() {
      //this.titles = await http.get(this.API_URL + "/titles");
      this.titles = { autistic: 69 };
    },
    async saveDocument() {
      let body = {
        title: this.title,
        raw_content: this.addLink(this.raw_content),
        block_type: this.block_type,
      };
      let data = await http.put(
        this.API_URL + `/doc/${this.document_id}/draft`,
        body
      );
      this.previewDocument = {};
      this.previewDocument = data;
      this.$emit("saved");
    },

    async createDocument() {
      try {
        let body = {
          title: this.title,
          raw_content: this.addLink(this.raw_content),
          block_type: this.block_type,
        };
        await http.post(this.API_URL + "/doc", body);
        this.$router.push("/drafts");
        //this.$emit('created')
      } catch (e) {
        console.log(e);
      }
    },

    async publishDocument() {
      let body = {
        title: this.title,
        raw_content: this.addLink(this.raw_content),
        block_type: this.block_type,
      };
      await http.put(this.API_URL + `/doc/${this.document_id}`, body);
      this.$router.push(`/docs`);
      this.$emit("published");
    },

    cancelEdit() {
      this.$router.go(-1);
    },

    insertItem(item) {
      if (this.currentInput === "[[[") {
        console.log(item);
        this.raw_content += `${item.id} ]]]`;
        this.$refs.input.focus();
      } else {
        this.raw_content += `${item.id} | ]]`;
        this.$refs.input.focus();
        this.$refs.input.selectionStart -= 2;
        this.$refs.input.selectionEnd -= 2;
      }
    },
    indent() {
      this.$refs.input.selectionStart;
    },
    formatter(kind) {
      let start = this.$refs.input.selectionStart;
      let end = this.$refs.input.selectionEnd;
      let fmt = this.fmt(kind);
      if (start !== this.$refs.input.value.length) {
        let left = this.$refs.input.value.substring(0, start);
        let right = this.$refs.input.value.substring(end);
        let selection =
          start !== end ? this.$refs.input.value.substring(start, end) : "";

        this.raw_content = left + fmt[0] + selection + fmt[1] + right;
      } else {
        this.raw_content += `${fmt[0]}${fmt[1]}`;
      }
      this.$refs.input.focus();
      setTimeout(() => {
        this.$refs.input.setSelectionRange(
          start + fmt[0].length,
          start + fmt[0].length
        );
      }, 100);
    },

    fmt(kind) {
      switch (kind) {
        case "bold":
          return ["**", "**"];
        case "italic":
          return ["*", "*"];
        case "heading":
          return ["\n### ", ""];
        case "ol":
          return ["\n1. ", ""];
        case "ul":
          return ["\n- ", ""];
        case "embed":
          return ["[[[", ""];
        case "table":
          return [
            "\n| Header1 | Header2 | Header3 |\n|-|-|-|\n|  |  |  |\n",
            "\n",
          ];
      }
    },
  },
  template: `
`,
  async created() {
    this.getDefns();
    fetch(this.API_URL + "/blocktype")
      .then((e) => e.json())
      .then((j) => {
        this.blocktypes = j;
      });
  },
};
</script>

<style>
</style>