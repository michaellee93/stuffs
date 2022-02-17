<template>
  <div>
    <h2 class="is-size-3" style="padding-bottom: 8px">
      Version history for: <strong>{{ Title }}</strong>
    </h2>
    <p class="is-size-6 block">{{ docs.length }} versions</p>
    <div class="block">
      <label class="label">Since</label>
      <date-picker @submit="changeDate" />
    </div>
    <list v-if="docs.length > 0" @selected="selectItem" :items="docs">
      <template v-slot:item="slotProps">
        <div @click="selectItem(slotProps.item)">
          <p class="is-size-5">{{ slotProps.item.content.Title || "" }}</p>
          <!--<p class="is-size-6">Published at: {{ slotProps.item.published_at }}</p>-->
          <p class="is-size-7">
            <em
              >Published at
              {{ parseDate(slotProps.item.published_at) || "" }} by User
              Name</em
            >
          </p>
        </div>
      </template>
    </list>
    <p v-else>
      There have been no edits since
      <strong>{{ day + "/" + month + "/" + year }}</strong>
    </p>
  </div>
</template>

<script>
import http from "../http";
import DatePicker from "./DatePicker.vue";
import List from "./List.vue";

export default {
  components: { List, DatePicker },
  props: ["document_id"],
  data() {
    return {
      docs: {},
      reload: false,
      flag: 0,
      title: "",
      day: 0,
      month: 0,
      year: 0,
    };
  },
  methods: {
    async getDocs() {
      try {
        this.docs = await http.get(
          this.API_URL + `/doc/${this.document_id}/versions`
        );
        if (this.docs.length > 0 && this.Title == "") {
          this.title = this.docs[0].Title;
        }
      } catch {
        this.docs = [];
      }
    },
    selectItem(item) {
      console.log(item);
      this.$router.push(`/docs/${item.id}/versions/${item.version}`);
    },
    capitalise(txt) {
      return txt[0].toUpperCase() + txt.slice(1);
    },
    parseDate(datetime) {
      let date = new Date(datetime);
      return date.toLocaleDateString();
    },
    async changeDate({ day, month, year }) {
      //this.$router.push({ path: '/docs/' + this.document_id + '/versions', query: { day: day, month: month, year: year } });
      this.docs = await http.get(
        this.API_URL +
          `/doc/${this.document_id}/versions?day=${day}&month=${month}&year=${year}`
      );
      this.day = day;
      this.month = month;
      this.year = year;
    },
  },
  watch: {
    $route: "getDocs",
  },
  created() {
    this.getDocs();
  },
};
</script>

<style>
</style>