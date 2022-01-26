import {
    getMarksBetween,
    findChildrenInRange,
    combineTransactionSteps,
    getChangedRanges,
} from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'

function find(text, terms) {
    if (terms === null || terms === undefined) { return [] }
    let keys = Object.keys(terms);
    if (keys.length == 0) { return [] }

    let regex = new RegExp(keys.reduce((a, e) => a + '|' + e), 'gi');


    return Array.from(text.matchAll(regex)).map(e => {
        return {
            isLink: true,
            href: terms[e[0].toLowerCase()],//`http://localhost:8080/#/docs/${terms[e[0]]}`,
            start: e.index,
            end: e.index + e[0].length,
        }
    })
}

function test(text, terms) {
    if (terms === null || terms === undefined) { return false }
    let keys = Object.keys(terms);
    if (keys.length == 0) { return false }
    let regex = new RegExp(keys.reduce((a, e) => a + '|' + e), 'gi');
    let matches = Array.from(text.matchAll(regex))
    if (matches.length !== 1) {
        return false;
    }
    let match = matches[0];
    if (match[0].length !== text.length) {
        return false;
    }
    return true;

    //    return text.search(regex) > -1
}



// takes auto link options returns a plugin
export function autodef(options) {
    return new Plugin({
        key: new PluginKey('autolink'),
        appendTransaction: (transactions, oldState, newState) => {
            const docChanges = transactions.some(transaction => transaction.docChanged)
                && !oldState.doc.eq(newState.doc)
            const preventAutolink = transactions.some(transaction => transaction.getMeta('preventAutodef'))

            if (!docChanges || preventAutolink) {
                return
            }

            let terms = options.defs.getDefinitions();

            const { tr } = newState
            const transform = combineTransactionSteps(oldState.doc, transactions)
            const { mapping } = transform
            const changes = getChangedRanges(transform)

            changes.forEach(({ oldRange, newRange }) => {
                // at first we check if we have to remove links
                getMarksBetween(oldRange.from, oldRange.to, oldState.doc)
                    .filter(item => item.mark.type === options.type)
                    .forEach(oldMark => {
                        const newFrom = mapping.map(oldMark.from)
                        const newTo = mapping.map(oldMark.to)
                        const newMarks = getMarksBetween(newFrom, newTo, newState.doc)
                            .filter(item => item.mark.type === options.type)

                        if (!newMarks.length) {
                            return
                        }

                        const newMark = newMarks[0]
                        const oldLinkText = oldState.doc.textBetween(oldMark.from, oldMark.to, undefined, ' ')
                        const newLinkText = newState.doc.textBetween(newMark.from, newMark.to, undefined, ' ')
                        const wasLink = test(oldLinkText, terms)
                        const isLink = test(newLinkText, terms)
                        // remove only the link, if it was a link before too
                        // because we don’t want to remove links that were set manually
                        if (wasLink && !isLink) {
                            tr.removeMark(newMark.from, newMark.to, options.type)
                        }
                    })

                // now let’s see if we can add new links
                findChildrenInRange(newState.doc, newRange, node => node.isTextblock)
                    .forEach(textBlock => {
                        // we need to define a placeholder for leaf nodes
                        // so that the link position can be calculated correctly
                        const text = newState.doc.textBetween(
                            textBlock.pos,
                            textBlock.pos + textBlock.node.nodeSize,
                            undefined,
                            ' ',
                        )
                        //find(text, terms).forEach(e => console.log(e))

                        find(text, terms)
                            .filter(link => link.isLink)
                            // calculate link position
                            .map(link => ({
                                ...link,
                                from: textBlock.pos + link.start + 1,
                                to: textBlock.pos + link.end + 1,
                            }))
                            // check if link is within the changed range
                            .filter(link => {
                                const fromIsInRange = newRange.from >= link.from && newRange.from <= link.to
                                const toIsInRange = newRange.to >= link.from && newRange.to <= link.to

                                return fromIsInRange || toIsInRange
                            })
                            // add link mark
                            .forEach(link => {
                                console.log(link.from, link.to)
                                tr.addMark(link.from, link.to, options.type.create({
                                    href: link.href,
                                }))
                            })
                    })
            })

            if (!tr.steps.length) {
                return
            }

            return tr
        },
    })
}