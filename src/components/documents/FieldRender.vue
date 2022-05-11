<template>
  <div>
    <div v-if="field.type === 'text'">
      <p class="title is-6">{{ document.content[field.name] }}</p>
    </div>

    <div v-else-if="field.type === 'select'">
      <p class="is-6">
        <b>{{ field.name }}:</b> {{ document.content[field.name] }}
      </p>
    </div>

    <div v-else-if="field.type === 'multiselect'">
      <h3 class="title is-6">{{ field.name }}</h3>
      <p class="is-7 is-italic" v-show="versions">
        Published at {{ fromDay + "/" + fromMonth + "/" + fromYear }}
      </p>
      <div class="tags are-medium" v-show="versions">
        <span
          :key="j"
          v-for="(tag, j) in document.content[field.name]"
          class="tag"
          >{{ tag }}</span
        >
      </div>
      <p class="is-7 is-italic" v-show="versions">
        <b>Current: </b>Published at {{ toDay + "/" + toMonth + "/" + toYear }}
      </p>
      <div class="tags are-medium">
        <span
          :key="j"
          v-for="(tag, j) in document.content[field.name]"
          class="tag"
          >{{ tag }}</span
        >
      </div>
    </div>
    <div v-else-if="field.type === 'block'">
      <h3 class="title is-6">{{ field.name }}</h3>
      <p class="is-7 is-italic" v-show="versions">
        Published at {{ fromDay + "/" + fromMonth + "/" + fromYear }}
      </p>
      <new-editor
        v-show="versions"
        style="padding-left: 20px"
        :editable="false"
        :content="document.content[field.name]"
      />
      <hr v-show="versions" />
      <p class="is-7 is-italic" v-show="versions">
        <b>Current: </b>Published at {{ toDay + "/" + toMonth + "/" + toYear }}
      </p>
      <new-editor
        style="padding-left: 20px"
        :editable="false"
        :content="document.content[field.name]"
      />
    </div>

    <div v-else-if="field.type === 'blocks'">
      <div v-if="field.name === 'Steps'">
        <p class="is-7 is-italic" v-show="versions">
          Published at {{ fromDay + "/" + fromMonth + "/" + fromYear }}
        </p>
        <div
          v-show="versions"
          class="columns step"
          v-for="(step, j) in document.content[field.name]"
          :key="j"
        >
          <p :id="'step-' + j + 1" class="column is-1">
            <em>Step {{ j + 1 }}</em>
          </p>
          <new-editor class="column is-11" :editable="false" :content="step" />
        </div>

        <p class="is-7 is-italic" v-show="true">
          <b>Current: </b>Published at
          {{ toDay + "/" + toMonth + "/" + toYear }}
        </p>
        <div
          class="columns step"
          v-for="(step, j) in document.content[field.name]"
          :key="j"
        >
          <p :id="'step-' + j + 1" class="column is-1">
            <em>Step {{ j + 1 }}</em>
          </p>
          <new-editor class="column is-11" :editable="false" :content="step" />
        </div>
      </div>

      <div v-else>
        <h3 class="title is-6">{{ field.name }}</h3>
        <p class="is-7 is-italic" v-show="versions">
          Published at {{ fromDay + "/" + fromMonth + "/" + fromYear }}
        </p>
        <div
          v-show="versions"
          class="block"
          v-for="(block, j) in document.content[field.name]"
          :key="j"
        >
          <new-editor
            style="padding-left: 20px"
            :editable="false"
            :content="block"
          />
        </div>

        <p class="is-7 is-italic" v-show="true">
          <b>Current: </b>Published at
          {{ toDay + "/" + toMonth + "/" + toYear }}
        </p>
        <div
          class="block"
          v-for="(block, k) in document.content[field.name]"
          :key="k"
        >
          <new-editor
            style="padding-left: 20px"
            :editable="false"
            :content="block"
          />
        </div>
      </div>
    </div>

    <div v-else-if="field.type === 'data'">
      <h3 class="title is-6">{{ field.name }}</h3>
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
</template>

<script>
import NewEditor from "@/components/editor/NewEditor.vue";
export default {
  components: { NewEditor },
  props: [
    "field",
    "document",
    "i",
    "toDay",
    "toMonth",
    "toYear",
    "fromDay",
    "fromMonth",
    "fromYear",

    "versions",
  ],
  methods: {
    alphatise(number) {
      let one = Math.floor(number / (26 * 26));
      number = number - one * 26 * 26;
      let two = Math.floor(number / 26);
      let three = number - two * 26;

      return String.fromCharCode(65 + one, 46, 65 + two, 46, 65 + three);
    },
  },
};
</script>

<style>
</style>