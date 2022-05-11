<template>
  <div class="block">
    <icon-tray
      @click="active = true"
      v-show="active"
      @format="bold"
      :link-active="linkActive"
      :bold-active="boldActive"
      :italic-active="italicActive"
      :show-delete="showDelete"
      @delete="deleteBlock"
    />
    <editor-content :class="{ 'editor-content': editable }" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import IconTray from "./IconTray.vue";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import { autodef } from "./autolink";
import { Conditional, Branch } from "./nodes/Extension.js";

class DefSet {
  constructor(rootDomain, definitions = {}, currentID) {
    this.rootDomain = rootDomain;
    if (currentID) {
      this.currentID = currentID;
    }

    let proxied = new Proxy(definitions, {
      get: (obj, prop) => {
        if (obj[prop] !== this.currentID) {
          return `${rootDomain}/${obj[prop]}`;
        }
      },
    });

    this.definitions = {};
    Object.keys(proxied).forEach((e) => {
      this.definitions[e] = proxied[e];
    });
  }

  addDefinition(term, id) {
    this.definitions[term] = id;
  }

  setDefinitions(definitions) {
    let proxied = new Proxy(definitions, {
      get: (obj, prop) => {
        if (obj[prop] !== this.currentID) {
          return `${this.rootDomain}/${obj[prop]}`;
        }
      },
    });

    this.definitions = {};
    Object.keys(proxied).forEach((e) => {
      this.definitions[e] = proxied[e];
    });
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
  props: {
    content: {},
    definitions: {},
    active: {},
    editable: {
      type: Boolean,
      default: true,
    },
    editorText: {},
    document_id: {},
    showDelete: {},
  },
  data() {
    return {
      update: false,
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
    tableHandler({ action }) {
      console.log(action);
      switch (action) {
        case "create":
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
        case "delete":
          this.editor.chain().focus().deleteTable().run();
          break;
        case "addRow":
          this.editor.chain().focus().addRowBefore().run();
          break;
        case "addColumn":
          this.editor.chain().focus().addColumnBefore().run();
          break;
        case "deleteColumn":
          this.editor.chain().focus().deleteColumn().run();
          break;
        case "deleteRow":
          this.editor.chain().focus().deleteRow().run();
          break;
        case "toggleHeader":
          this.editor.chain().focus().toggleHeaderRow().run();
          break;
      }
    },
    overwriteDefinitions() {
      this.defSet.setDefinitions(this.definitions);
    },
    setEditorContent() {
      if (!this.update) {
        this.editor.commands.setContent(this.content);
        this.update = false;
      }
      this.$emit("update:editorText", this.editor.getText());
    },
    handleLink(args) {
      if (args) {
        this.editor.chain().focus().toggleLink({ href: args.href }).run();
      } else {
        this.editor.chain().focus().toggleLink().run();
      }
    },
    bold(kind, args) {
      switch (kind) {
        case "bold":
          this.editor.chain().focus().toggleBold().run();
          break;
        case "paragraph":
          this.editor.chain().focus().setParagraph().run();
          break;
        case "italic":
          this.editor.chain().focus().toggleItalic().run();
          break;
        case "heading":
          this.editor
            .chain()
            .focus()
            .toggleHeading({ level: args.level })
            .run();
          break;
        case "link":
          this.handleLink(args);
          //          this.editor.chain().focus().toggleLink({ href }).run();
          break;
        case "ol":
          this.editor.chain().focus().toggleOrderedList().run();
          break;
        case "ul":
          this.editor.chain().focus().toggleBulletList().run();
          break;
        case "table":
          this.tableHandler(args);
          break;
        case "undo":
          this.editor.chain().focus().undo().run();
          break;
        case "redo":
          this.editor.chain().focus().redo().run();
          break;
        case "cond":
          this.editor.chain().focus().insertConditional().run();
          break;
      }
    },
    deleteBlock() {
      this.$emit("delete");
    },
  },

  computed: {
    linkActive() {
      if (this.editor) {
        return this.editor.isActive("link");
      }
      return false;
    },
    boldActive() {
      if (this.editor) {
        return this.editor.isActive("bold");
      }
      return false;
    },
    italicActive() {
      if (this.editor) {
        return this.editor.isActive("italic");
      }
      return false;
    },
  },

  mounted() {
    this.defSet = new DefSet(
      this.APP_DOMAIN + "/#/docs",
      this.definitions,
      this.document_id
    );
    let that = this;

    //setTerms(this.definitions);
    this.editor = new Editor({
      content: this.content,
      editable: this.editable,
      extensions: [
        StarterKit,
        Table.configure({
          resizable: true,
          HTMLAttributes: {
            class: "table is-bordered",
          },
        }),
        TableRow,
        TableHeader,
        TableCell,
        AutoDefLink.configure({
          autodef: true,
          defs: that.defSet,
        }),
        Branch,
        Conditional,
      ],
      onUpdate({ editor }) {
        const json = editor.getJSON();
        that.update = true;
        that.$emit("update:content", json);
        that.$emit("update:editorText", editor.getText());
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
.editor-content > .ProseMirror {
  min-height: 100px;
  border: 1px #dbdbdb solid;
  border-radius: 4px;
  color: #363636;
  padding: calc(0.75em - 1px);
}

.selectedCell {
  background-color: rgba(214, 214, 214, 0.26);
}
</style>