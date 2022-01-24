<template>
  <div class="econtainer block">
    <div rows="30" class="ebackdrop">
      <highlighter
        :text="text"
        :terms="titles"
        @disable="removeTerm"
        @enable="enableTerm"
        :disabled-terms="disabledTerms"
      />
    </div>
    <textarea
      rows="30"
      v-html="text"
      class="etextarea"
      @input="handleInput"
      ref="input"
    >
        <!-- user input here -->
        </textarea
    >
  </div>
</template>

<script>
import Highlighter from "./Highlighter.vue";
import http from "../../http";
export default {
  components: { Highlighter },
  props: ["text"],
  data() {
    return {
      //text: "",
      highlightTerms: [],
      titles: { "": -1 },
      disabledTerms: new Set(),
    };
  },
  mounted() {
    this.getDefns();
    this.disabledTerms = new Set();
  },
  computed: {
    terms() {
      return this.highlightTerms.reduce((a, e) => a + "|" + e);
    },
  },
  methods: {
    removeTerm(term) {
      if (this.disabledTerms !== undefined) {
        this.disabledTerms.add(term);
      }
    },
    enableTerm(term) {
      this.disabledTerms.delete(term);
    },
    async getDefns() {
      this.titles = await http.get(this.API_URL + "/titles");

      this.highlightTerms = Object.keys(this.titles).map((e) =>
        e.toLocaleLowerCase()
      );
    },
    /*handleInput() {
      let highlightedText = this.applyHighlights(this.text);
      this.$refs.highlights.innerHTML = highlightedText;
    },*/
    stuffs() {
      console.log("STUFF");
    },
    handleScroll() {},
    applyHighlights(text) {
      let reg = new RegExp(this.terms, "ig");

      return text
        .replace(/\n$/g, "\n\n")
        .replace(reg, '<mark @click="stuffs">$&</mark>');
      //.replace(/[A-Z].*?\b/g, '<mark>$&</mark>');
    },
    handleInput(event) {
      this.$emit("update:text", event.target.value);
    },
  },
};
</script>

    <style>
.econtainer,
.ebackdrop,
.etextarea {
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  height: 840px;
}

.ehighlights,
.etextarea {
  padding: calc(0.75em - 1px);
  /*font: 20px/28px 'Open Sans', sans-serif;*/
  font: 18px/28px BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  /*letter-spacing: 1px;*/
}

.econtainer {
  display: block;
  margin: 0 auto;
  transform: translateZ(0);
  -webkit-text-size-adjust: none;
}

.ebackdrop {
  position: absolute;
  z-index: 4;
  border: 1px solid transparent;
  /*background-color: #fff;*/
  overflow: auto;
  pointer-events: none;
  transition: transform 1s;
}

.ehighlights {
  white-space: pre-wrap;
  word-wrap: break-word;
  color: transparent;
}

.etextarea {
  display: block;
  position: absolute;
  z-index: 1;
  margin: 0;
  /*border: 2px solid #74637f;
            border-radius: 0;
            color: #444;*/
  background-color: transparent;
  overflow: auto;
  resize: none;
  transition: transform 1s;

  background-color: #fff;
  border: 1px #dbdbdb solid;
  border-radius: 4px;
  color: #363636;
}

mark {
  border-radius: 3px;
  color: transparent;
  background-color: #8cabff48;
  z-index: 100;
  pointer-events: auto;
}

mark.inactive {
  background-color: #58585848;
}
</style>