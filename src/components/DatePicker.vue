<template>
  <div>
    <div class="select">
      <select v-model="day">
        <option selected disabled hidden>Day</option>
        <option :key="i" v-for="i in maxDays">{{ i }}</option>
      </select>
    </div>
    <div class="select">
      <select v-model="month">
        <option selected disabled hidden>Month</option>
        <option :key="i" :value="i" v-for="i in 12">{{ getMonth(i) }}</option>
      </select>
    </div>
    <div class="select">
      <select placeholde="Year" v-model="year">
        <option selected disabled hidden>Year</option>
        <option :key="i" v-for="i in 2">{{ i + 2020 }}</option>
      </select>
    </div>
    <input
      class="button"
      :class="{ 'is-success': allowSubmit }"
      @click="submitDate"
      type="submit"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      day: null,
      month: null,
      year: null,
      maxDays: 30,
    };
  },
  computed: {
    allowSubmit() {
      return this.day !== null && this.month !== null && this.year !== null;
    },
  },
  watch: {
    month() {
      if (this.month == 2) {
        this.maxDays = 28;
      } else if (
        this.month == 1 ||
        this.month == 3 ||
        this.month == 5 ||
        this.month == 7 ||
        this.month == 8 ||
        this.month == 10 ||
        this.month == 12
      ) {
        this.maxDays = 31;
      } else {
        this.maxDays = 30;
      }
    },
  },
  methods: {
    submitDate() {
      this.$emit("submit", {
        day: this.day,
        month: this.month,
        year: this.year,
      });
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
</style>