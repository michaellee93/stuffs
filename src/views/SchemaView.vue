<template>
  <div>
    <h1 class="title is-2">Edit schema</h1>
    <div class="block">
      <div class="select">
        <select v-model="selected">
          <option v-for="(t, i) in terms" :value="i" :key="i">{{ t }}</option>
        </select>
      </div>
      <button
        style="margin-left: 5px"
        class="button is-info"
        @click="activateModal(1)"
      >
        <span class="icon">
          <i class="fa fa-plus" />
        </span>
        <span> New Schema </span>
      </button>
    </div>

    <section class="block">
      <div
        :class="{ 'over-field': i == overField && field.name !== 'Title' }"
        class="field schema-field"
        style="display: flex; align-items: center; justify-content: center"
        :draggable="field.name !== 'Title'"
        @dragenter.prevent
        @dragover.prevent="setOver(i)"
        @dragend="clearOver"
        @dragstart="startDrag($event, i)"
        @drop="onDrop($event, i)"
        v-for="(field, i) in selectedSchema.fields"
        :key="i"
      >
        <div class="icon" :class="{ invis: field.name === 'Title' }">
          <i class="fas fa-grip-vertical"></i>
        </div>
        <div class="columns" style="flex-grow: 1">
          <div class="column is-4">
            <label class="label">Field name</label>
            <input
              class="input"
              :disabled="!unlocked[selected][i]"
              v-model="field.name"
            />
          </div>
          <div class="column is-2">
            <label class="label">Field type</label>
            <div class="select">
              <select :disabled="!unlocked[selected][i]" v-model="field.type">
                <option v-for="(ty, j) in fieldTypes" :key="j">{{ ty }}</option>
              </select>
            </div>
          </div>
          <div class="column is-2">
            <label class="label">Required</label>
            <input
              type="checkbox"
              :disabled="!unlocked[selected][i]"
              class="checkbox"
              v-model="field.required"
            />
          </div>
          <div class="column is-2">
            <label class="label">Hidden</label>
            <input
              type="checkbox"
              :disabled="!unlocked[selected][i]"
              class="checkbox"
              v-model="field.hidden"
            />
          </div>
          <div
            class="column is-2"
            v-show="field.type === 'select' || field.type === 'multiselect'"
          >
            <label class="label">Values</label>
            <button
              class="button is-info"
              @click="selectValues(field)"
              :disabled="!unlocked[selected][i]"
            >
              Change values
            </button>
          </div>
        </div>

        <div
          @click="unlockField(i)"
          style="margin-right: 15px"
          :class="{ invis: field.name === 'Title' }"
        >
          <i v-show="!unlocked[selected][i]" class="fas fa-lock" />
          <i v-show="unlocked[selected][i]" class="fas fa-unlock" />
        </div>
      </div>
    </section>

    <div v-show="saved" class="message is-success">
      <div class="message-body">Schema saved.</div>
    </div>

    <div class="buttons">
      <button class="button" @click="addField">Add Field</button>
      <button class="button is-success" @click="saveSchema">
        <span class="icon"><i class="fa fa-save"></i></span>
        <span> Save schema</span>
      </button>
    </div>

    <div class="modal" :class="{ 'is-active': showModal[0] }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Value</p>
          <button
            class="delete"
            aria-label="close"
            @click="closeModal(0)"
          ></button>
        </header>
        <section class="modal-card-body">
          <table class="table">
            <tr v-for="(value, i) in selectedValues" :key="i">
              <td><input v-model="valueCheckboxes[i]" type="checkbox" /></td>
              <td>{{ value }}</td>
            </tr>
            <tfoot>
              <tr>
                <td>
                  <button
                    class="button"
                    :class="{ 'is-success': validValue }"
                    @click="addValue"
                  >
                    Add
                  </button>
                </td>
                <td><input class="input" v-model="newValue" /></td>
              </tr>
            </tfoot>
          </table>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="saveValues">
            Save changes
          </button>
          <button
            class="button is-danger"
            v-show="valueIsSelected"
            @click="deleteValues"
          >
            Delete Values
          </button>
          <button class="button" @click="closeModal(0)">Cancel</button>
        </footer>
      </div>
    </div>

    <div class="modal" :class="{ 'is-active': showModal[1] }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Schema</p>
          <button
            class="delete"
            aria-label="close"
            @click="closeModal(1)"
          ></button>
        </header>
        <section class="modal-card-body">
          <label class="label">Name</label>
          <input type="text" v-model="schemaName" class="input" />
          <label for="" class="label">Has title?</label>
          <input type="checkbox" name="" id="" v-model="schemaHasTitle" />
        </section>
        <footer class="modal-card-foot">
          <button
            class="button"
            :class="{ 'is-success': validSchemaName }"
            @click="createSchema"
          >
            Create
          </button>
          <button class="button" @click="closeModal(1)">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // modal variables
      showModal: [false, false],
      selectedField: null,
      selectedValues: null,
      newValue: "",
      valueCheckboxes: [],

      // create schema stuff
      schemaName: "",
      schemaHasTitle: true,

      // field variables
      selected: 0,
      schems: null,
      fieldTypes: ["text", "block", "blocks", "select", "multiselect", "data"],
      unlocked: [],
      saved: null,
      overField: null,
    };
  },
  methods: {
    setOver(idx) {
      this.overField = idx;
    },
    clearOver() {
      this.overField = -1;
    },
    createSchema() {
      let fields = this.schemaHasTitle
        ? [{ name: "Title", type: "text", required: true }]
        : [];
      this.closeModal(1);
      //      let idx = this.schems.length - 1;
      this.schems.push({
        name: this.schemaName,
        fields,
      });
      // window.schemas.push({
      //   name: this.schemaName,
      //   fields,
      // });

      this.unlocked.push([false]);

      //      this.schems = window.schemas;
      this.schemaName = "";
      this.selected = this.schems.length - 1;
    },
    activateModal(idx) {
      this.$set(this.showModal, idx, true);
    },
    selectValues(field) {
      this.$set(this.showModal, 0, true);
      //      this.showModal[0] = true;
      this.selectedField = field;
      this.selectedValues = Array.from(field.values || []);
      this.valueCheckboxes = this.selectedValues.map(() => false);
    },
    addValue() {
      if (this.validValue) {
        this.$set(
          this.selectedValues,
          this.selectedValues.length,
          this.newValue
        );
        this.$set(this.valueCheckboxes, this.valueCheckboxes.length, false);
        this.newValue = "";
      }
    },
    deleteValues() {
      this.selectedValues = this.selectedValues.filter((e, i) => {
        if (this.valueCheckboxes[i]) {
          return false;
        }
        return true;
      });
      this.valueCheckboxes = this.selectedValues.map(() => false);
    },
    saveValues() {
      this.$set(this.showModal, 0, false);
      this.selectedField.values = this.selectedValues;
      this.selectedField = null;
    },
    closeModal(idx) {
      this.$set(this.showModal, idx, false);
      this.selectedValues = null;
      this.newValue = "";
    },
    saveSchema() {
      this.saved = null;
      window.schemas[this.selected] = this.schems[this.selected];
      console.log("TODO: mutate all contents on server");
      this.saved = true;
    },
    unlockField(idx) {
      this.$set(this.unlocked[this.selected], idx, true);
    },
    onDrop(event, targetIndex) {
      let fields = this.schems[this.selected].fields;
      if (fields[targetIndex].name === "Title") return;
      let currentIndex = event.dataTransfer.getData("selectedIndex");
      if (currentIndex === targetIndex) return;

      let field = fields.splice(currentIndex, 1)[0];
      console.log("moving to ", targetIndex, currentIndex);
      if (targetIndex - currentIndex > 0) {
        targetIndex--;
      }

      let front = fields.slice(0, targetIndex);
      let back = fields.slice(targetIndex);
      front.push(field, ...back);
      this.schems[this.selected].fields = front;

      let unlocks = this.unlocked[this.selected];
      let unlocked = unlocks.splice(currentIndex, 1)[0];
      let unlfr = unlocks.slice(0, targetIndex);
      let unlbk = unlocks.slice(targetIndex);
      unlfr.push(unlocked, ...unlbk);
      this.unlocked[this.selected] = unlfr;
    },
    startDrag(event, idx) {
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("selectedIndex", idx);
    },
    addField() {
      this.schems[this.selected].fields.push({
        name: "New Field",
        type: "text",
        required: false,
      });

      this.$set(
        this.unlocked[this.selected],
        this.unlocked[this.selected].length,
        true
      );
      //      this.unlocked[this.selected].push(true);
    },
  },
  computed: {
    validValue() {
      return this.newValue.length >= 3;
    },
    validSchemaName() {
      return this.schemaName.length > 3;
    },
    terms() {
      return this.schems.map((e) => e.name);
    },
    selectedSchema() {
      return this.schems[this.selected];
    },
    valueIsSelected() {
      return this.valueCheckboxes.reduce((a, e) => {
        if (e) {
          return e;
        }
        return a;
      }, false);
    },
  },
  created() {
    this.schems = window.schemas;
    this.schems.forEach((schema, i) => {
      this.$set(this.unlocked, i, []);
      schema.fields.forEach((field, j) => {
        this.$set(this.unlocked[i], j, false);
      });
    });
  },
};
</script>

<style>
.schema-field {
  border: 2px solid #dfdfdf;
  border-radius: 5px;
  padding: 8px;
}

.schema-field.over-field {
  margin-top: 2rem;
  background-color: #eee;
}

.invis {
  color: transparent;
}
</style>
