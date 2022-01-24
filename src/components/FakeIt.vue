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
      <section id="add" class="column is-10">
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

        <div class="field">
          <label class="label">Content Type</label>
          <div class="select is-fullwidth">
            <select v-model="content_type" id="type is-primary">
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
            <select>
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
              :active="i == currBlock"
              @activated="currBlock = i"
            />
          </div>

          <div v-else-if="v.type == 'blocks'">
            <new-editor
              v-for="(block, i) in blocks[content_type][k]"
              :key="i"
              :num="i"
              :definitions="titles"
              :content.sync="blocks[content_type][k][i]"
              :active="i == currBlock"
              @activated="currBlock = i"
            />

            <button @click="addBlock(k)" class="button is-fullwidth is-info">
              Add Block
            </button>
          </div>

          <div v-else-if="v.type == 'resource'">
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
              </tbody>
            </table>
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
  props: ["cancel", "create", "save", "publish", "document_id"],
  components: { NewEditor },
  data() {
    return {
      desc: "",
      owner: null,
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
      rules: [
        { code: 0, description: "Rule 1" },
        { code: 1, description: "Rule 2" },
        { code: 5, description: "Rule 3" },
      ],
      title: "",
      blocks: [
        {
          Definition: ``,
        },
        { Metrics: `` },
        { Steps: [""] },
        { Overview: "", Pricing: "", Technical: "", Processes: "" },
        { "At a Glance": "", Banking: "" },
        {},
        { Rules: [""], Outcomes: [""], Delegations: [""] },
      ],
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
          Rules: { type: "resource" },
          Outcomes: { type: "blocks" },
          Delegations: { type: "blocks" },
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
    addRule() {
      let max = 0;
      this.rules.forEach((e) => {
        if (e.code > max) {
          max = e.code;
        }
      });
      this.rules.push({
        code: max + 1,
        description: this.desc,
      });
      this.desc = "";
    },
    grabContent() {
      let data = {};
      let content = {};
      Object.keys(this.schemas[this.content_type]).forEach((e) => {
        content[e] = this.blocks[this.content_type][e];
      });
      content["title"] = this.title;
      data["content"] = content;
      data["content_type"] = this.content_type + 1;
      data["owner_id"] = this.owner_id;
      return data;
    },
    saveDocument() {},
    async createDocument() {
      let data = this.grabContent();
      await http.post(this.API_URL + "/doc", data);
      this.$emit("created");
    },
    async publishDocument() {
      let data = this.grabContent();
      await http.put(this.API_URL + "/doc", data);
      this.$emit("created");
    },
    cancelEdit() {
      this.$router.go(-1);
    },
    addBlock(key) {
      console.log(this.blocks[this.content_type][key]);
      this.blocks[this.content_type][key].push("");
    },
    removeTag(i) {
      this.tags.splice(i, 1);
    },
    addLong() {
      this.longBlocks.push("");
    },
  },
  created() {
    fetch(this.API_URL + "/titles")
      .then((r) => r.json())
      .then((j) => (this.titles = j));
  },
};
</script>

<style>
</style>