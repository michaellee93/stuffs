<template>
  <div class="block content">
    <icon-tray @click="active = true" v-show="active" @format="bold" />
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import IconTray from "./IconTray.vue";
//import { marked } from "marked";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import { autodef } from "./autolinks/helpers/autolink";

class DefSet {
  constructor(rootDomain, definitions = {}) {
    this.rootDomain = rootDomain;
    this.definitions = new Proxy(definitions, {
      get: (obj, prop) => {
        return `${rootDomain}/${obj[prop]}`;
      },
    });
    //this.definitions = definitions;
  }

  addDefinition(term, id) {
    this.definitions[term] = id;
  }

  setDefinitions(definitions) {
    this.definitions = definitions;
  }

  getDefinitions() {
    return this.definitions;
  }
}

const AutoDefLink = Link.extend({
  addProseMirrorPlugins() {
    let plugins = this.parent?.();
    if (this.options.autodef) {
      plugins.push(
        autodef({
          type: this.type,
          defs: this.options.defs,
        })
      );
    }
    return plugins;
  },
});

export default {
  components: {
    EditorContent,
    IconTray,
  },
  props: ["content", "definitions", "active"],
  data() {
    return {
      editor: null,
      autoInserting: false,
      defSet: null,
    };
  },

  watch: {
    content: "setEditorContent",
    definitions: "overwriteDefinitions",
  },

  methods: {
    overwriteDefinitions() {
      this.defSet.setDefinitions(this.definitions);
    },
    setEditorContent() {
      this.editor.commands.setContent(this.content);
    },

    bold(kind, attrs) {
      switch (kind) {
        case "bold":
          this.editor.chain().toggleBold().focus().run();
          break;
        case "italic":
          this.editor.chain().focus().toggleItalic().run();
          break;
        case "heading":
          this.editor
            .chain()
            .focus()
            .toggleHeading({ level: attrs.level })
            .run();
          break;
        case "link":
          this.editor
            .chain()
            .focus()
            .toggleLink({ href: "https://www.incel.com" })
            .run();
          break;
        case "ol":
          this.editor.chain().focus().toggleOrderedList().run();
          break;
        case "ul":
          this.editor.chain().focus().toggleBulletList().run();
          break;
        case "table":
          this.editor
            .chain()
            .focus()
            .insertTable({
              rows: 3,
              cols: 3,
              withHeaderRow: true,
            })
            .run();
          break;
        case "undo":
          this.editor.chain().focus().undo().run();
          break;
      }
    },
  },

  mounted() {
    this.defSet = new DefSet("http://localhost:8080/#/docs", this.definitions);
    let that = this;

    //setTerms(this.definitions);
    this.editor = new Editor({
      content: this.content,
      extensions: [
        StarterKit,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        AutoDefLink.configure({
          autodef: true,
          defs: that.defSet,
        }),
      ],
      onUpdate({ editor }) {
        const json = editor.getJSON();
        that.$emit("update:content", json);
      },
      onFocus() {
        that.$emit("activated");
      },
    });
    window.editor = this.editor;
  },

  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style>
.ProseMirror {
  min-height: 100px;
  border: 1px #dbdbdb solid;
  border-radius: 4px;
  color: #363636;
  padding: calc(0.75em - 1px);
}
</style>