<template>
  <div>
    <div class="columns">
      <aside class="menu column is-2">
        <p class="menu-label">Fields</p>
        <ul class="menu-list">
          <li v-for="(_, k, i) in schemas[content_type]" :key="i">
            <a :href="`#${k}`">{{ k }}</a>
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
          <label class="label">Owner</label>
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
          :id="k"
          :key="i"
          v-for="(v, k, i) in schemas[content_type]"
        >
          <label class="label">{{ k }}</label>

          <div v-if="v.type == 'drop'" class="select">
            <select v-model="drops[content_type][k]">
              <option :key="possible" v-for="possible in v.values">
                {{ possible }}
              </option>
            </select>
          </div>

          <input
            v-else-if="v.type === 'input'"
            v-model="title"
            class="input"
            id="title"
          />

          <div v-else-if="v.type === 'tag'">
            <input class="input block" />
            <div class="field is-grouped is-grouped-multiline">
              <div v-for="(v, i) in tags" :key="i" class="control">
                <div class="tags has-addons">
                  <span class="tag is-info">{{ v }}</span>
                  <a @click="removeTag(i)" class="tag is-delete" />
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="v.type === 'metric'">
            <new-editor :content="metrichtml" />
          </div>

          <div v-else-if="v.type == 'block'">
            <new-editor
              :definitions="titles"
              :content.sync="blocks[content_type][k]"
              :editor-text.sync="editorText"
              :active="i == currBlock"
              @activated="currBlock = i"
            />
          </div>

          <div v-else-if="v.type == 'blocks'">
            <div
              v-for="(block, i) in blocks[content_type][k]"
              :key="i"
              :num="i"
            >
              <new-editor
                :definitions="titles"
                :content.sync="blocks[content_type][k][i]"
                :editor-text.sync="editorText"
                :active="i == currBlock"
                :show-delete="blocks[content_type][k].length > 1"
                @activated="currBlock = i"
                @delete="deleteBlock(k, i)"
              />

              <button
                v-show="i == currBlock"
                @click="addBlock(k, i)"
                class="button is-fullwidth is-info add-block-button"
              >
                Add Block
              </button>
            </div>
          </div>

          <!--<div v-else-if="v.type == 'resource'">
            <table class="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr :key="i" v-for="(rule, i) in rules">
                  <td>{{ alphatise(rule.code) }}</td>
                  <td>{{ rule.description }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    <button
                      @click="addRule"
                      class="button is-rounded"
                      :class="{ 'is-success': desc.length > 4 }"
                    >
                      Add Rule
                    </button>
                  </td>
                  <td><input v-model.trim="desc" class="input" /></td>
                </tr>
              </tfoot>
            </table>
          </div>-->
          <div v-else-if="v.type == 'resource'">
            <table class="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th style="min-width: 995px">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr :key="i" v-for="(block, i) in blocks[content_type][k]">
                  <td>{{ alphatise(i + offset[k]) }}</td>
                  <td>
                    <new-editor
                      :num="i"
                      :document_id="document_id"
                      :definitions="titles"
                      :content.sync="blocks[content_type][k][i]"
                      :editor-text.sync="editorText"
                      :active="i == currBlock && k == currRes"
                      @activated="
                        currBlock = i;
                        currRes = k;
                      "
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              @click="addBlock(k)"
              class="button is-fullwidth is-info add-block-button"
            >
              Add Block
            </button>
          </div>

          <div v-else>{{ v }}, {{ k }}, {{ i }}</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import http from "@/http.js";
import NewEditor from "./editor/NewEditor.vue";
export default {
  name: "FakeIt",
  props: {
    cancel: {},
    create: { default: false },
    save: {},
    publish: {},
    document_id: {},
  },
  components: { NewEditor },
  data() {
    return {
      offset: { Standards: 0, Pathways: 26 * 26, Restrictions: 2 * 26 * 26 },
      saved: null,
      document: {},
      desc: "",
      owner: -1,
      users: [
        "User Name",
        "Aldous Huxley",
        "George Orwell",
        "Ernest Hemingway",
        "Virginia Wolff",
      ],
      titles: {},
      metrichtml: ``,
      currBlock: 0,
      tags: [
        "11330: Dried buttermilk manufacturing",
        "11500: Oil and Fat Manufacturing",
      ],
      rules: [],
      title: "",
      currRes: "Standards",
      blocks: [
        {
          Definition: ``,
        },
        { Metrics: `` },
        { Steps: [""] },
        { Overview: "", Pricing: "", Technical: "", Processes: "" },
        { "At a Glance": "", Banking: "" },
        {},
        { Standards: [""], Pathways: [""], Restrictions: [""] },
      ],
      editorText: "",
      content_type: 0,
      content_types: [
        "Definition",
        "Industry Credit Standard",
        "Process",
        "URL",
        "Product",
        "Guidance",
        "Credit Standard",
      ],
      drops: [
        {},
        { Security: null, Industry: null, "Client Type": null },
        { Category: null },
        {},
        { "Product Family": null },
        { Industry: null },
        {},
      ],
      schemas: [
        // Definition
        {
          Title: { type: "input" },
          Definition: { type: "block" },
        },
        //ICS
        {
          //ics
          Title: { type: "input" },
          Industry: {
            type: "drop",
            values: [
              "Manufacturing",
              "Retail",
              "Wholesale",
              "Agriculture",
              "Construction",
            ],
          },
          "Client Type": {
            type: "drop",
            values: ["Business Banking", "Institutional"],
          },
          Anzics: {
            type: "tag",
          },
          Security: {
            type: "drop",
            values: ["Unsecured", "Secured", "N/A"],
          },
          Metrics: { type: "block" },
          //          Metrics: { type: "metric" },
        },

        // Process
        {
          Title: { type: "input" },
          Category: { type: "drop", values: ["Origination", "Maintenance"] },
          Steps: { type: "blocks" },
        },
        //URL
        { URL: { type: "input" } },
        //Product
        {
          Title: { type: "input" },
          "Product Family": {
            type: "drop",
            values: ["Cash Management", "Commercial Lending"],
          },
          Overview: { type: "block" },
          Pricing: { type: "block" },
          Technical: { type: "block" },
          Processes: { type: "block" },
        },
        //Guidance
        {
          Title: { type: "input" },
          Industry: {
            type: "drop",
            values: ["Manufacturing", "Retail"],
          },
          "At a Glance": { type: "block" },
          Banking: { type: "block" },
        },

        // Credit standards
        {
          Title: { type: "input" },
          Standards: { type: "resource" },
          Pathways: { type: "resource" },
          Restrictions: { type: "resource" },
          //Pathways: { type: "blocks" },
          //Restrictions: { type: "blocks" },
        },
      ],
    };
  },
  methods: {
    alphatise(number) {
      let one = Math.floor(number / (26 * 26));
      number = number - one * 26 * 26;
      let two = Math.floor(number / 26);
      let three = number - two * 26;

      return String.fromCharCode(65 + one, 46, 65 + two, 46, 65 + three);
    },
    async addRule() {
      let rule = await http.post(
        this.API_URL +
          "/doc/" +
          this.document_id +
          "/rules?name=" +
          encodeURI(this.desc)
      );
      this.rules.push(rule);
      this.desc = "";
    },
    grabContent() {
      let data = {};
      let content = {};
      let schema = this.schemas[this.content_type];
      Object.keys(schema).forEach((e) => {
        switch (schema[e].type) {
          case "drop":
            content[e] = this.drops[this.content_type][e];
            break;
          case "blocks":
            content[e] = this.blocks[this.content_type][e];
            break;
          case "block":
            content[e] = this.blocks[this.content_type][e];
            break;
          case "resource":
            content[e] = this.blocks[this.content_type][e];
            break;
        }
      });
      content["title"] = this.title;
      data["content"] = content;
      data["content_type"] = this.content_type + 1;
      data["owner_id"] = this.owner;
      return data;
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
      data.search = data.content.title + "\n\n" + this.editorText;
      console.log(data);
      await http.put(this.API_URL + "/doc/" + this.document_id, data);
      this.$emit("published");
    },
    cancelEdit() {
      this.$router.go(-1);
    },
    addBlock(key, index) {
      console.log(key, index);
      let current = this.blocks[this.content_type][key];
      let next = current.slice(0, index + 1);
      next.push("", ...current.slice(index + 1));
      this.blocks[this.content_type][key] = next;
    },
    deleteBlock(key, index) {
      let current = this.blocks[this.content_type][key];
      current.splice(index, 1);
    },
    removeTag(i) {
      this.tags.splice(i, 1);
    },
  },
  async created() {
    this.titles = await http.get(this.API_URL + "/titles");
    if (this.create) {
      return;
    }
    let document = await http.get(
      this.API_URL + "/doc/" + this.document_id + "/draft"
    );
    this.document = document;
    this.content_type = this.document.content_type - 1;

    let schema = this.schemas[this.content_type];
    Object.keys(schema).forEach((e) => {
      switch (schema[e].type) {
        case "drop":
          this.drops[this.content_type][e] = document.content[e];
          break;
        case "blocks":
          this.blocks[this.content_type][e] = document.content[e];
          break;
        case "block":
          this.blocks[this.content_type][e] = document.content[e];
          break;
        case "resource":
          this.blocks[this.content_type][e] = document.content[e];
          break;
      }
    });
    this.title = this.document.content.title;
    this.owner = this.document.owner_id;
  },
};
</script>

<style>
.add-block-button {
  margin-bottom: 1rem;
  margin-top: -0.4rem;
}
</style>