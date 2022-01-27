<template>
  <div>
    <h4 class="title is-5">Credit Standard</h4>
    <h1 class="title">{{ document.content.title }}</h1>
    <hr />
    <div class="block content">
      <h3>Standards</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="i" v-for="(stand, i) in document.content.Standards">
            <td>{{ alphatise(i + offsets[0]) }}</td>
            <td style="min-width: 500px">
              <new-editor :editable="false" :content="stand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="block content">
      <h3>Pathways</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="i" v-for="(stand, i) in document.content.Pathways">
            <td>{{ alphatise(i + offsets[1]) }}</td>
            <td style="min-width: 500px">
              <new-editor :editable="false" :content="stand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="block content">
      <h3>Restrictions</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="i" v-for="(stand, i) in document.content.Restrictions">
            <td>{{ alphatise(i + offsets[2]) }}</td>
            <td style="min-width: 500px">
              <new-editor :editable="false" :content="stand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--<div class="block content">
      <h2>Rules</h2>
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
      </table>
    </div>

    <div class="block content">
      <h2>Pathways</h2>
      <new-editor
        v-for="(out, i) in document.content.Pathways"
        :key="i"
        :editable="false"
        :content="out"
      />
    </div>
    <div class="block content">
      <h2>Restrictions</h2>
      <new-editor
        v-for="(out, i) in document.content.Restrictions"
        :key="i"
        :editable="false"
        :content="out"
      />
    </div>-->
  </div>
</template>

<script>
import http from "@/http";
import NewEditor from "../editor/NewEditor.vue";
export default {
  props: { document: { type: Object, required: true } },
  components: { NewEditor },
  data() {
    return { offsets: [0, 26 * 26, 2 * 26 * 26], rules: [] };
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
  async created() {
    this.rules = await http.get(
      this.API_URL + "/doc/" + this.document.id + "/rules"
    );
  },
};
</script>

<style>
</style>


