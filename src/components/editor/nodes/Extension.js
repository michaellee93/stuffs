import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import Component from './Conditional.vue'


export default Node.create({
    name: 'conditional',

    group: 'block',

    content: 'inline*',

    //    atom: true,

    addCommands() {
        return {
            insertConditional: () => ({ commands }) => {
                commands.insertContent({ type: this.name })
            }
        }
    },

    /* addAttributes() {
         return {
             count: {
                 default: 0,
             },
         }
     },*/

    parseHTML() {
        return [
            {
                tag: 'conditional',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['conditional', mergeAttributes(HTMLAttributes), 0]
    },

    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
})