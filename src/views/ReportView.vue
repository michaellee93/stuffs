<template>
  <div>
    <h1 class="title is-icon">
      <span class="icon-text" @click="expanded = !expanded">
        <span class="icon">
          <i v-show="!expanded" class="fa fa-angle-right" />
          <i v-show="expanded" class="fa fa-angle-down" />
        </span>
        <span>Report</span>
      </span>
    </h1>
    <div v-show="expanded" class="block">
      <div class="block">
        <div class="field column is-2">
          <label class="label">Content Type</label>
          <div class="select field">
            <select v-model="selected">
              <option v-for="(schema, i) in schemas" :value="i" :key="schema">
                {{ schema }}
              </option>
            </select>
          </div>
        </div>

        <div class="field column is-4">
          <label class="label">Fields</label>
          <div class="field">
            <label class="checkbox">
              <input v-model="allFields" type="checkbox" />
              All Fields
            </label>
          </div>
          <div class="select is-multiple is-fullwidth">
            <select
              v-model="selectedFields"
              multiple
              size="5"
              :disabled="allFields"
            >
              <option :key="i" v-for="(field, i) in fields" :value="field">
                {{ field.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div v-show="schemaSelects.length > 0" class="field">
        <label class="checkbox">
          <input v-model="showSelects" type="checkbox" />
          Filter based on content values
        </label>
      </div>

      <div v-show="showSelects" class="columns block">
        <div
          v-for="s in schemaSelects"
          :key="s.name"
          class="column is-one-quarter"
        >
          <label for="" class="label">{{ s.name }}</label>
          <label class="checkbox field">
            <input v-model="selectModelAll[selected][s.name]" type="checkbox" />
            All
          </label>
          <div class="select is-multiple is-fullwidth">
            <select
              :disabled="selectModelAll[selected][s.name]"
              multiple
              v-model="selectModels[selected][s.name]"
              class="select is-multiple"
            >
              <option v-for="a in s.values" :key="a">{{ a }}</option>
            </select>
          </div>
        </div>
      </div>

      <label class="checkbox field">
        <input v-model="versionHistory" type="checkbox" />
        Include version history
      </label>

      <div v-show="versionHistory" class="columns">
        <div class="column is-4">
          <label class="label">From:</label>
          <div class="select">
            <select v-model="fromDay">
              <option selected disabled hidden>Day</option>
              <option :key="i" v-for="i in maxDays">{{ i }}</option>
            </select>
          </div>
          <div class="select">
            <select v-model="fromMonth">
              <option selected disabled hidden>Month</option>
              <option :key="i" :value="i" v-for="i in 12">
                {{ getMonth(i) }}
              </option>
            </select>
          </div>
          <div class="select">
            <select placeholde="Year" v-model="fromYear">
              <option selected disabled hidden>Year</option>
              <option :key="i" v-for="i in 2">{{ i + 2020 }}</option>
            </select>
          </div>
        </div>
        <div class="column is-4">
          <label class="label">To:</label>
          <div class="select">
            <select v-model="toDay">
              <option selected disabled hidden>Day</option>
              <option :key="i" v-for="i in maxDays">{{ i }}</option>
            </select>
          </div>
          <div class="select">
            <select v-model="toMonth">
              <option selected disabled hidden>Month</option>
              <option :key="i" :value="i" v-for="i in 12">
                {{ getMonth(i) }}
              </option>
            </select>
          </div>
          <div class="select">
            <select placeholde="Year" v-model="toYear">
              <option selected disabled hidden>Year</option>
              <option :key="i" v-for="i in 2">{{ i + 2020 }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="column is-1">
        <button
          @click="getResults"
          :disabled="selectedFields.length === 0 && !allFields"
          class="is-fullwidth button is-success"
        >
          Run
        </button>
      </div>
    </div>

    <hr />

    <div class="results">
      <h1 class="title is-4">Results</h1>

      <div v-for="result in results" :key="result._id" class="result">
        <h4 class="title is-5">{{ result.content.Title }}</h4>
        <div
          v-for="(field, i) in askedForFields"
          :key="field"
          style="padding-left: 1rem; padding-bottom: 1rem"
        >
          <field-render
            :document="result"
            :field="field"
            :i="i"
            :from-day="fromDay"
            :from-month="fromMonth"
            :from-year="fromYear"
            :to-day="toDay"
            :to-month="toMonth"
            :to-year="toYear"
            :versions="versionHistory"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FieldRender from "../components/documents/FieldRender.vue";
export default {
  components: { FieldRender },
  data() {
    return {
      selected: 0,
      allSchemas: [],
      selectedFields: [],
      allFields: false,
      content: [],
      results: [],
      expanded: true,
      showSelects: false,

      versionHistory: false,

      selectModels: [],
      selectModelAll: [],

      toDay: 30,
      fromDay: 1,
      toMonth: 1,
      fromMonth: 1,
      toYear: 2022,
      fromYear: 2022,
    };
  },
  computed: {
    maxDays() {
      if (this.month == 2) {
        return 28;
      } else if (
        this.month == 1 ||
        this.month == 3 ||
        this.month == 5 ||
        this.month == 7 ||
        this.month == 8 ||
        this.month == 10 ||
        this.month == 12
      ) {
        return 31;
      } else {
        return 30;
      }
    },
    schemaSelects() {
      return this.allSchemas[this.selected].fields.filter(
        (e) => e.type == "select" || e.type == "multiselect"
      );
    },
    schemas() {
      return this.allSchemas.map((e) => e.name);
    },
    fields() {
      return this.allSchemas[this.selected].fields.filter(
        (e) => e.name !== "Title"
      );
    },
    askedForFields() {
      if (this.allFields) {
        return this.fields;
      } else {
        return this.selectedFields;
      }
    },
  },
  created() {
    this.allSchemas = window.schemas;
    this.content = window.baselineContent;

    this.allSchemas.forEach((e, i) => {
      e.fields.forEach((field) => {
        if (field.type === "select" || field.type === "multiselect") {
          if (this.selectModels[i] === undefined) {
            this.$set(this.selectModels, i, {});
            this.$set(this.selectModelAll, i, {});
          }
          this.$set(this.selectModels[i], field.name, [field.values[0]]);
          this.$set(this.selectModelAll[i], field.name, true);
        }
      });
    });
  },
  methods: {
    getResults() {
      let cont = this.content.filter(
        (e) => e.content_type == this.selected + 1
      );

      this.results = cont;
      this.expanded = false;
    },

    getMonth(i) {
      switch (i) {
        case 1:
          return "January";
        case 2:
          return "February";
        case 3:
          return "March";
        case 4:
          return "April";
        case 5:
          return "May";
        case 6:
          return "June";
        case 7:
          return "July";
        case 8:
          return "August";
        case 9:
          return "September";
        case 10:
          return "October";
        case 11:
          return "November";
        case 12:
          return "December";
        default:
          return "NULL";
      }
    },
  },
};
</script>

<style>
.result:not(:last-child) {
  border-bottom: 1px #eee solid;
  padding-bottom: 1rem;
}

.result {
  margin-top: 2rem;
  margin: 0.5rem;
}
</style>