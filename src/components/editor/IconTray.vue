<template>
  <div class="block buttons">
    <button @click="clickButton('undo')" class="button">
      <i class="fas fa-undo" />
    </button>
    <button @click="clickButton('redo')" class="button">
      <i class="fas fa-redo" />
    </button>
    <button
      @click="clickButton('bold')"
      :class="{ 'is-active': boldActive }"
      class="button"
    >
      <i class="fas fa-bold" />
    </button>
    <button
      @click="clickButton('italic')"
      :class="{ 'is-active': italicActive }"
      class="button"
    >
      <i class="fas fa-italic" />
    </button>
    <button @click="clickButton('paragraph')" class="button">
      <i class="fas fa-paragraph" />
    </button>
    <div
      @mouseenter="showHeader = true"
      @mouseleave="showHeader = false"
      class="button"
    >
      <i class="fas fa-heading" />
      <ul class="table-list" v-show="showHeader">
        <li @click="clickButton('heading', { level: 2 })">
          <h2 style="margin: 0">Header</h2>
        </li>
        <li @click="clickButton('heading', { level: 3 })">
          <h3 style="margin: 0">Header</h3>
        </li>
        <li @click="clickButton('heading', { level: 4 })">
          <h4 style="margin: 0">Header</h4>
        </li>
        <li @click="clickButton('heading', { level: 5 })">
          <h5 style="margin: 0">Header</h5>
        </li>
        <li @click="clickButton('heading', { level: 6 })">
          <h6 style="margin: 0">Header</h6>
        </li>
      </ul>
    </div>
    <button @click="clickButton('ul')" class="button">
      <i class="fas fa-list-ul" />
    </button>
    <button @click="clickButton('ol')" class="button">
      <i class="fas fa-list-ol" />
    </button>
    <div
      @click="toggleLink"
      class="button"
      :class="{ 'is-active': linkActive }"
    >
      <i class="fas fa-link" />
    </div>
    <search-box :active="linking" @selected="outputLink" @close="toggleLink" />
    <!--<button @click="clickButton('embed')" class="button">
      <i class="fas fa-cube" />
    </button>-->
    <div
      @mouseenter="showTable = true"
      @mouseleave="showTable = false"
      class="button"
    >
      <i class="fas fa-table" />
      <ul class="table-list" v-show="showTable">
        <li @click="clickButton('table', { action: 'create' })">
          Create table
        </li>
        <li @click="clickButton('table', { action: 'delete' })">
          Delete table
        </li>
        <li @click="clickButton('table', { action: 'addColumn' })">
          Insert Column Before
        </li>
        <li @click="clickButton('table', { action: 'addRow' })">
          Insert Row Before
        </li>
        <li @click="clickButton('table', { action: 'deleteColumn' })">
          Delete Column
        </li>
        <li @click="clickButton('table', { action: 'deleteRow' })">
          Delete Row
        </li>
        <li @click="clickButton('table', { action: 'toggleHeader' })">
          Toggle Header
        </li>
      </ul>
    </div>
    <button @click="clickButton('cond')" class="button">
      <i class="fas fa-code-branch" />
    </button>
  </div>
</template>

<script>
import SearchBox from "./SearchBox.vue";
export default {
  components: { SearchBox },
  data() {
    return {
      showTable: false,
      linking: false,
      showHeader: false,
    };
  },
  props: {
    linkActive: {},
    boldActive: {},
    italicActive: {},
  },
  methods: {
    toggleLink() {
      if (this.linkActive) {
        this.clickButton("link");
      } else {
        this.linking = !this.linking;
      }
    },
    outputLink(arg) {
      this.clickButton("link", { href: arg });
    },
    clickButton(kind, args) {
      this.$emit("format", kind, args);
    },
  },

  async mounted() {},
};
</script>

<style>
ul.table-list {
  position: absolute;
  top: 40px;
  left: 0;
  background-color: white;
  z-index: 100;
  box-sizing: border-box;
  list-style: none;
  text-align: left;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin: 0;
}

.table-list > li {
  padding: 3px 10px;
  margin: 0;
}

.table-list li + li {
  margin-top: 0;
}

.table-list > li:hover {
  background-color: #eee;
}

.table-list :not(:last-child) {
  border-bottom: 1px solid #ccc;
}
</style>