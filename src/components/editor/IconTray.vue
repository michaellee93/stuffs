<template>
  <div class="block buttons">
    <button @click="clickButton('bold')" class="button">
      <i class="fas fa-bold" />
    </button>
    <button @click="clickButton('italic')" class="button">
      <i class="fas fa-italic" />
    </button>
    <button @click="clickButton('heading')" class="button">
      <i class="fas fa-heading" />
    </button>
    <button @click="clickButton('ul')" class="button">
      <i class="fas fa-list-ul" />
    </button>
    <button @click="clickButton('ol')" class="button">
      <i class="fas fa-list-ol" />
    </button>
    <button @click="undo" class="button">
      <i class="fas fa-undo" />
    </button>
    <button @click="redo" class="button">
      <i class="fas fa-redo" />
    </button>
    <button @click="clickButton('link')" class="button">
      <i class="fas fa-link" />
    </button>
    <button @click="clickButton('embed')" class="button">
      <i class="fas fa-cube" />
    </button>
    <button @click="clickButton('table')" class="button">
      <i class="fas fa-table" />
    </button>
    <button @click="clickButton('if')" class="button">
      <i class="fas fa-code-branch" />
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    applyItalic() {
      this.$emit("italic");
    },
    applyHeading() {
      this.$emit("heading", { level: 2 });
    },
    applyUl() {
      this.$emit("ul");
    },
    applyOl() {
      this.$emit("ol");
    },
    undo() {
      this.$emit("undo");
    },
    redo() {
      this.$emit("redo");
    },
    applyBold() {
      this.$emit("bold");
    },
    embed() {
      this.$emit("embed");
    },
    link() {
      this.$emit("link");
    },

    clickButton(kind) {
      let attrs = {};
      if (kind == "heading") {
        attrs.level = 2;
      }
      this.$emit("format", kind, attrs);
    },
  },

  async mounted() {
    let res = await fetch("https://kit.fontawesome.com/50e8aa9853.js");
    let t = await res.text();
    eval(t);
  },
};
</script>

<style>
</style>