import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import Component from './Conditional.vue'

const Conditional = Node.create({
    name: 'conditional',

    group: 'block',

    //content: 'inline*',
    content: 'branch+',

    addCommands() {
        return {
            insertConditional: () => ({ commands }) => {
                commands.insertContent({
                    type: this.name, content: [
                        { type: 'branch', text: 'hola' }
                    ]
                })
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



const Branch = Node.create({
    name: 'branch',

    content: 'inline*',

    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    parseHTML() {
        return [
            { tag: 'branch' }
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['branch', mergeAttributes(HTMLAttributes), 0]
    },
});


export { Branch, Conditional }