<template>
  <div>
    <div class="columns">
      <aside class="menu column is-2">
        <p class="menu-label">Fields</p>
        <ul class="menu-list">
          <li v-for="(field, i) in currentSchema.fields" :key="i">
            <a :href="`#${field.name}`">{{ field.name }}</a>
          </li>
        </ul>
      </aside>
      <section id="add" class="column is-10 content">
        <div class="block buttons">
          <button v-if="cancel" class="button" @click="cancelEdit">
            Cancel
          </button>
          <button v-if="save" class="button is-primary" @click="saveDocument">
            Save
          </button>
          <button
            v-if="publish"
            class="button is-success is-outlined"
            @click="publishDocument"
          >
            Publish
          </button>
          <button
            v-if="create"
            class="button is-primary"
            @click="createDocument"
          >
            Create
          </button>
        </div>
        <div
          v-show="saved"
          class="message"
          :class="{ 'is-success': saved, 'is-danger': !saved }"
        >
          <div class="message-body">
            {{ this.saved ? "Saved successfully" : "Could not save" }}
          </div>
        </div>
        <div class="field">
          <label class="label">Content Type</label>
          <div class="select is-fullwidth">
            <select
              :disabled="document.version > 1"
              v-model="content_type"
              id="type is-primary"
            >
              <option :value="i" v-for="(bl, i) in content_types" :key="i">
                {{ bl }}
              </option>
            </select>
          </div>
        </div>

        <div class="field">
          <label class="label">Approver</label>
          <div class="select is-fullwidth">
            <select v-model="owner" id="type is-primary">
              <option :value="i" v-for="(bl, i) in users" :key="i">
                {{ bl }}
              </option>
            </select>
          </div>
        </div>

        <div
          class="field"
          :id="field.name"
          :key="i"
          v-for="(field, i) in currentSchema.fields"
        >
          <label class="label">{{ field.name }}</label>

          <input
            v-if="field.type === 'text'"
            v-model="forms[content_type][field.name]"
            class="input"
            id="title"
          />

          <div v-else-if="field.type == 'block'">
            <new-editor
              :definitions="titles"
              :content.sync="forms[content_type][field.name]"
              :editor-text.sync="editorText"
              :active="i == currBlock"
              @activated="currBlock = i"
            />
          </div>

          <div v-else-if="field.type == 'select'" class="select">
            <select v-model="forms[content_type][field.name]">
              <option :key="possible" v-for="possible in field.values">
                {{ possible }}
              </option>
            </select>
          </div>

          <div v-else-if="field.type == 'blocks'">
            <div
              v-for="(block, j) in forms[content_type][field.name]"
              :key="j"
              :num="j"
            >
              <new-editor
                :definitions="titles"
                :content.sync="forms[content_type][field.name][j]"
                :editor-text.sync="editorText"
                :active="j == currBlock"
                :show-delete="forms[content_type][field.name].length > 1"
                @activated="currBlock = j"
                @delete="deleteBlock(field.name, j)"
              />

              <button
                v-show="j == currBlock"
                @click="addBlock(field.name, j)"
                class="button is-fullwidth is-info add-block-button"
              >
                Add Block
              </button>
            </div>
          </div>

          <div v-else-if="field.type === 'multiselect'">
            <multi-select
              :selected.sync="forms[content_type][field.name]"
              :values="field.values"
            />
          </div>

          <div v-else-if="field.type == 'data'">
            <table class="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th style="min-width: 995px">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  :key="j"
                  v-for="(block, j) in forms[content_type][field.name]"
                >
                  <td>{{ alphatise(j + 26 ** (i - 1)) }}</td>
                  <td>
                    <new-editor
                      :num="i"
                      :document_id="document_id"
                      :definitions="titles"
                      :content.sync="forms[content_type][field.name][j]"
                      :editor-text.sync="editorText"
                      :active="j == currBlock && field.name == currRes"
                      @activated="
                        currBlock = j;
                        currField = field.name;
                      "
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              @click="addBlock(field.name)"
              class="button is-fullwidth is-info add-block-button"
            >
              Add {{ field.name }}
            </button>
          </div>

          <div v-else>{{ field }}, {{ i }}</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import http from "@/http.js";
import NewEditor from "@/components/editor/NewEditor.vue";
import MultiSelect from "@/components/MultiSelect.vue";

export default {
  components: { NewEditor, MultiSelect },
  props: {
    cancel: {},
    create: { default: false },
    save: {},
    publish: {},
    document_id: { default: 1 },
  },
  data() {
    return {
      document: {},
      schemas: [],
      content_type: 0,
      owner: -1,
      users: [
        "User Name",
        "Aldous Huxley",
        "George Orwell",
        "Ernest Hemingway",
        "Virginia Wolff",
      ],
      saved: null,
      editorText: "",
      titles: [],
      forms: [],
      currBlock: 0,
      currRes: "",
    };
  },
  computed: {
    currentSchema() {
      return this.schemas.length > 0 ? this.schemas[this.content_type] : null;
    },
    content_types() {
      return this.schemas.length > 0 ? this.schemas.map((e) => e.name) : null;
    },
  },
  methods: {
    createRefs(schemas) {
      schemas.forEach((schema, i) => {
        if (!this.forms[i]) {
          this.$set(this.forms, i, {});
        }
        schema.fields.forEach((field) => {
          switch (field.type) {
            case "text":
            case "select":
            case "block":
              this.$set(this.forms[i], field.name, "");
              break;
            case "data":
            case "blocks":
              this.$set(this.forms[i], field.name, [""]);
              break;
            case "multiselect":
              this.$set(this.forms[i], field.name, []);
              break;
          }
        });
      });
    },
    setForm(document) {
      Object.keys(document.content).forEach((key) => {
        this.$set(this.forms[this.content_type], key, document.content[key]);
        // this.forms[this.content_type][key] = document.content[key];
      });
    },
    alphatise(number) {
      let one = Math.floor(number / (26 * 26));
      number = number - one * 26 * 26;
      let two = Math.floor(number / 26);
      let three = number - two * 26;

      return String.fromCharCode(65 + one, 46, 65 + two, 46, 65 + three);
    },
    addBlock(key, index) {
      if (index === undefined) {
        this.forms[this.content_type][key].push("");
        return;
      }
      let current = this.forms[this.content_type][key];
      let next = current.slice(0, index + 1);
      next.push("", ...current.slice(index + 1));
      this.forms[this.content_type][key] = next;
      this.currBlock = index + 1;
    },
    deleteBlock(key, index) {
      this.forms[this.content_type][key].splice(index, 1);
    },
    grabContent() {
      return {
        id: this.document_id,
        version: this.document.version,
        content_type: this.content_type + 1,
        owner_id: this.owner,
        content: this.forms[this.content_type],
      };
    },
    async saveDocument() {
      try {
        let data = this.grabContent();
        await http.put(
          this.API_URL + "/doc/" + this.document_id + "/draft",
          data
        );
        this.saved = true;
        this.$emit("saved");
      } catch {
        this.saved = false;
      }
    },
    async createDocument() {
      let data = this.grabContent();
      await http.post(this.API_URL + "/doc", data);
      this.$emit("created");
    },
    async publishDocument() {
      let data = this.grabContent();
      data.search = data.content.Title + "\n\n" + this.editorText;
      await http.put(this.API_URL + "/doc/" + this.document_id, data);
      this.$emit("published");
    },
    cancelEdit() {
      this.$router.go(-1);
    },
  },
  async created() {
    this.schemas = window.schemas;

    this.titles = await http.get(this.API_URL + "/titles");
    if (this.create) {
      return;
    }
    let document = await http.get(
      this.API_URL + "/doc/" + this.document_id + "/draft"
    );
    this.document = document;
    this.content_type = this.document.content_type - 1;

    this.createRefs(this.schemas);
    this.setForm(this.document);

    this.owner = this.document.owner_id;
  },
};
</script>

<style>
</style>
