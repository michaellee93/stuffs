//import { datePick, versionView, recView, dependencyView, newDocView, linkAdder, newEditor, block, searchView, listView, contentView, iconTray } from './components/components'
import FakeIt from './components/FakeIt.vue'
import contentView from '@/views/ContentView.vue'
import searchView from './components/SearchView.vue'
import draftsView from './components/DraftsView.vue'
import documentView from './components/DocumentView.vue'
import versionView from './components/VersionView.vue'
//import editor from './components/Editor.vue'
import createContent from './components/CreateContent.vue'
import DraftView from './components/DraftView.vue'



const routes = [
    { path: '/search', component: searchView },
    { path: '/create', component: createContent },
    { path: '/definitions', component: contentView, props: () => ({ block_type: 'definition' }) },
    { path: '/links', component: contentView, props: () => ({ block_type: 'url' }) },
    //    //  { path: '/links', component: linkContent, props: route => ({ block_type: 'url' }) },
    { path: '/standards', component: contentView, props: () => ({ block_type: 'standard' }) },
    { path: '/processes', component: contentView, props: () => ({ block_type: 'process' }) },
    { path: '/product', component: contentView, props: () => ({ block_type: 'product' }) },
    { path: '/guidance', component: contentView, props: () => ({ block_type: 'guidance' }) },
    { path: '/reporting', component: contentView, props: () => ({ block_type: 'reporting' }) },

    //    { path: '/testedit', component: testEdit },
    { path: '/fake', component: FakeIt },


    { path: '/docs/:document_id', component: documentView, props: route => ({ document_id: route.params.document_id, top: true, version: true }) },
    { path: '/docs/:document_id/versions', component: versionView, props: route => ({ document_id: route.params.document_id, top: true }) },
    //    { path: '/docs/:document_id/versions/:version_id', component: newDocView, props: route => ({ document_id: route.params.document_id, version_id: route.params.version_id, top: true }) },
    { path: '/drafts', component: draftsView },
    // { path: '/drafts/:document_id', component: editor, props: route => ({ document_id: route.params.document_id, cancel: true, save: true, publish: true }) },
    { path: '/drafts/:document_id', component: DraftView, props: route => ({ document_id: route.params.document_id, cancel: true, save: true, publish: true }) },
];

export default routes 