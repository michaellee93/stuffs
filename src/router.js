//import FakeIt from './components/FakeIt.vue'
import contentView from '@/views/ContentView.vue'
import searchView from './views/SearchView.vue'
import draftsView from './components/DraftsView.vue'
import documentView from './views/DocumentView.vue'
import historyView from './components/HistoryView.vue'
//import createContent from './components/CreateContent.vue'
import DraftView from './components/DraftView.vue'
import VersionView from './views/VersionView.vue'
import AdminView from './views/AdminView.vue'
import SchemaView from './views/SchemaView.vue'
import EditView from './views/EditView.vue'

const routes = [
    // Other
    { path: '/search', component: searchView },
    //    { path: '/create', component: createContent },

    // Content
    { path: '/definitions', component: contentView, props: () => ({ block_type: 'definition' }) },
    { path: '/links', component: contentView, props: () => ({ block_type: 'url' }) },
    { path: '/standards', component: contentView, props: () => ({ block_type: 'standard' }) },
    { path: '/processes', component: contentView, props: () => ({ block_type: 'process' }) },
    { path: '/product', component: contentView, props: () => ({ block_type: 'product' }) },
    { path: '/guidance', component: contentView, props: () => ({ block_type: 'guidance' }) },
    { path: '/reporting', component: contentView, props: () => ({ block_type: 'reporting' }) },
    { path: '/ics', component: contentView, props: () => ({ block_type: 'ics' }) },

    // Documents
    { path: '/docs/:document_id', component: documentView, props: route => ({ document_id: route.params.document_id }) },
    { path: '/docs/:document_id/versions', component: historyView, props: route => ({ document_id: route.params.document_id }) },
    { path: '/docs/:document_id/versions/:version_id', component: VersionView, props: route => ({ document_id: route.params.document_id, version_id: route.params.version_id }) },

    // Drafts
    { path: '/drafts', component: draftsView },
    { path: '/drafts/:document_id', component: DraftView, props: route => ({ document_id: route.params.document_id, cancel: true, save: true, publish: true }) },

    { path: '/schemas', component: SchemaView },
    { path: '/editing', component: EditView },

    { path: '/admin', component: AdminView }
];

export default routes 