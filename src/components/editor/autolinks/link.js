import { Mark, markPasteRule, mergeAttributes } from '@tiptap/core'
import { find } from 'linkifyjs'
import { autolink } from './helpers/autolink'
import http from '@/http'

let terms = {
    'eye check': 0,
}

window.terms = terms;

http.get('http://localhost:5000/titles').then(j => {
    terms = j
    console.log(terms)
})

function setTerms(newTerms) {
    terms = newTerms;
}


const AutoLink = Mark.create({
    name: 'autolink',

    priority: 1000,

    keepOnSplit: false,

    inclusive() {
        return this.options.autolink
    },

    addOptions() {
        return {
            openOnClick: true,
            linkOnPaste: true,
            autolink: true,
            HTMLAttributes: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow',
            },
        }
    },

    addAttributes() {
        return {
            href: {
                default: null,
            },
            target: {
                default: this.options.HTMLAttributes.target,
            },
        }
    },

    parseHTML() {
        return [
            { tag: 'a[href]' },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'a',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
            0,
        ]
    },

    addCommands() {
        return {
            setLink: attributes => ({ chain }) => {
                return chain()
                    .setMark(this.name, attributes)
                    .setMeta('preventAutolink', true)
                    .run()
            },

            toggleLink: attributes => ({ chain }) => {
                return chain()
                    .toggleMark(this.name, attributes, { extendEmptyMarkRange: true })
                    .setMeta('preventAutolink', true)
                    .run()
            },

            unsetLink: () => ({ chain }) => {
                return chain()
                    .unsetMark(this.name, { extendEmptyMarkRange: true })
                    .setMeta('preventAutolink', true)
                    .run()
            },
        }
    },

    addPasteRules() {
        return [
            markPasteRule({
                find: text => find(text)
                    .filter(link => link.isLink)
                    .map(link => ({
                        text: link.value,
                        index: link.start,
                        data: link,
                    })),
                type: this.type,
                getAttributes: match => ({
                    href: match.data?.href,
                }),
            }),
        ]
    },

    addProseMirrorPlugins() {
        const plugins = []

        if (this.options.autolink) {
            console.log("HERE: ", this.type)
            plugins.push(autolink({
                type: this.type,
                terms: terms,
            }))
        }

        return plugins
    },
})

export { AutoLink, setTerms }