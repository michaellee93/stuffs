<template>
  <div>
    <h4 class="title is-5">{{ content_types[document.content_type - 1] }}</h4>
    <h1 class="title">{{ document.content.Title }}</h1>
    <hr />

    <div class="content block" v-for="(field, i) in fields" :key="i">
      <div v-if="field.type === 'text'">
        <p>{{ document.content[field.name] }}</p>
      </div>

      <div v-else-if="field.type === 'block'">
        <h3>{{ field.name }}</h3>
        <new-editor
          style="padding-left: 20px"
          :editable="false"
          :content="document.content[field.name]"
        />
      </div>

      <div v-else-if="field.type === 'blocks'">
        <div v-if="field.name === 'Steps'">
          <div
            class="columns step"
            v-for="(step, j) in document.content[field.name]"
            :key="j"
          >
            <p :id="'step-' + j + 1" class="column is-1">
              <em>Step {{ j + 1 }}</em>
            </p>
            <new-editor
              class="column is-11"
              :editable="false"
              :content="step"
            />
          </div>
        </div>
        <div v-else>
          <h3>{{ field.name }}</h3>
          <div v-for="(block, j) in document.content[field.name]" :key="j">
            <new-editor
              style="padding-left: 20px"
              :editable="false"
              :content="document.content[field.name]"
            />
          </div>
        </div>
      </div>

      <div v-else-if="field.type === 'data'">
        <h3>{{ field.name }}</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr :key="j" v-for="(stand, j) in document.content[field.name]">
              <td>{{ alphatise(j + 26 ** i) }}</td>
              <td style="min-width: 500px">
                <new-editor :editable="false" :content="stand" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import NewEditor from "@/components/editor/NewEditor.vue";
export default {
  components: { NewEditor },
  props: { document: { type: Object, required: true } },
  data() {
    return {
      schemas: [],
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
  },
  computed: {
    fields() {
      return this.schemas[this.document.content_type - 1].fields.filter(
        (e) => e.name !== "Title"
      );
    },
    content_types() {
      return this.schemas.length > 0 ? this.schemas.map((e) => e.name) : null;
    },
  },
  created() {
    this.schemas = window.schemas;
  },
};
</script>

<style>
</style>