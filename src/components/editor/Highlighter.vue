<script>
export default {
  props: {
    text: {},
    terms: {},
    disabledTerms: {},
  },
  data() {
    return {};
  },
  computed: {
    termsRed() {
      let keys = Object.keys(this.terms);
      if (keys.length > 0) {
        return keys.reduce((a, e) => a + "|" + e);
      }
      return undefined;
    },
    splitUP() {
      return this.text.split(new RegExp("(" + this.termsRed + ")", "gi"));
    },
  },
  methods: {
    toggleDisabled(term) {
      if (this.isDisabled(term)) {
        this.$emit("enable", term);
      } else {
        this.$emit("disable", term);
      }
    },
    isDisabled(term) {
      return this.disabledTerms.has(term);
    },
  },
  render(createElement) {
    let children = [];
    if (this.splitUP !== undefined) {
      if (this.splitUP.length > 0) {
        children = this.splitUP.map((e) => {
          if (e in this.terms) {
            console.log(e);
            return createElement(
              "mark",
              {
                class: { inactive: this.isDisabled(e) },
                on: { click: () => this.toggleDisabled(e) },
              },
              e
            );
          } else {
            return e;
          }
        });
      }
    }

    return createElement(
      "div",
      {
        class: { ehighlights: true },
      },
      children
    );
  },
};
</script>

<style>
</style>