<template>
  <div>
    <div class="field is-grouped is-grouped-multiline">
      <div v-for="(v, j) in selected" :key="j" class="control">
        <div class="tags has-addons">
          <span class="tag is-info">{{ v }}</span>
          <a @click="removeTerm(j)" class="tag is-delete" />
        </div>
      </div>
    </div>
    <div style="position: relative">
      <input class="input" v-model="searchTerm" />

      <div
        v-show="results.length > 0"
        style="
          position: absolute;
          top: 40px;
          background: white;
          z-index: 10;
          width: 100%;
        "
      >
        <ul class="multiselect-list">
          <li
            class="multiselect-list-item"
            @click="addTerm(val)"
            v-for="(val, i) in results"
            :key="i"
          >
            {{ val }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      type: Array,
    },
    values: {
      default: () => [],
    },
  },
  methods: {
    addTerm(value) {
      if (!this.selectionSet.has(value)) {
        this.selectionSet.add(value);
        this.$emit("update:selected", this.selected.concat(value));
      }
    },
    removeTerm(index) {
      this.selectionSet.delete(this.selected[index]);
      this.$emit(
        "update:selected",
        this.selected.filter((_, i) => i !== index)
      );
    },
  },
  data() {
    return {
      selectionSet: null,
      searchTerm: "",
    };
  },
  created() {
    this.selectionSet = new Set(this.selected);
  },
  computed: {
    results() {
      return this.values
        .filter((e) => e.match(this.searchTerm) === null)
        .slice(0, 5);
    },
  },
};
</script>

<style>
ul.multiselect-list {
  list-style: none;
  border: 1px solid #aaa;
  margin: 0;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

li.multiselect-list-item {
  padding: 12px 8px;
  margin: 0;
}
.multiselect-list li + li {
  margin-top: 0;
}
.multiselect-list-item:hover {
  background: #eee;
}

.multiselect-list-item:not(:last-child) {
  border-bottom: 1px dotted #bbb;
}
</style>