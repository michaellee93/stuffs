//import FakeIt from './components/FakeIt.vue'
import ContentView from '@/views/ContentView.vue'
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
import ReportView from './views/ReportView.vue'
import EasyView from './views/EasyView.vue'
import EasySchemaView from './views/EasySchemaView.vue'

export var contentRoutes = window.schemas.map((e, i) => {
    let urlName = e.name.toLowerCase().replaceAll(' ', '_')
    return {
        path: "/" + urlName,
        name: e.nickname || e.name,
        component: ContentView,
        props: () => ({ content_type: i, title: e.name, block_type: urlName }),
    }
});

import Dashboard from '@/views/Dashboard.vue'

export const routes = [
    { path: '/', component: Dashboard },
    // Other
    { path: '/search', component: searchView },
    //    { path: '/create', component: createContent },
    ...contentRoutes,

    // Report
    { path: '/reports', component: ReportView },

    // Documents
    { path: '/docs/:document_id', component: documentView, props: route => ({ document_id: route.params.document_id }) },
    { path: '/docs/:document_id/versions', component: historyView, props: route => ({ document_id: route.params.document_id }) },
    { path: '/docs/:document_id/versions/:version_id', component: VersionView, props: route => ({ document_id: route.params.document_id, version_id: route.params.version_id }) },

    // Drafts
    { path: '/drafts', component: draftsView },
    { path: '/drafts/:document_id', component: DraftView, props: route => ({ document_id: route.params.document_id, cancel: true, save: true, publish: true }) },

    { path: '/schemas', component: SchemaView },
    { path: '/editing', component: EditView },

    { path: '/admin', component: AdminView },

	{path:'/easy', component:EasyView},
	{path:'/easysch', component:EasySchemaView}
];


