<template>
  <div class="block buttons">
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
    <button @click="clickButton('heading')" class="button">
      <i class="fas fa-heading" />
    </button>
    <button @click="clickButton('ul')" class="button">
      <i class="fas fa-list-ul" />
    </button>
    <button @click="clickButton('ol')" class="button">
      <i class="fas fa-list-ol" />
    </button>
    <button @click="clickButton('undo')" class="button">
      <i class="fas fa-undo" />
    </button>
    <button @click="clickButton('redo')" class="button">
      <i class="fas fa-redo" />
    </button>
    <div
      @click="toggleLink"
      class="button"
      :class="{ 'is-active': linkActive }"
    >
      <i class="fas fa-link" />
    </div>
    <search-box :active="linking" @selected="outputLink" @close="toggleLink" />
    <button @click="clickButton('embed')" class="button">
      <i class="fas fa-cube" />
    </button>
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

.table-list > li:hover {
  background-color: #eee;
}

.table-list :not(:last-child) {
  border-bottom: 1px solid #ccc;
}
</style>