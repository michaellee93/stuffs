
searchView = {
    data: () => {
        return {
            query: "",
            results: [],
            loading: false,
            timeout: null,
        }
    },
    methods: {
        async search() {
            this.loading = true
            let res = await fetch('/search?q=' + encodeURI(this.query))
            let data = await res.json();
            this.results = data;
            this.loading = false;
        },
        goToItem(item) {
            this.$router.push(`/docs/${item.id}`);
            //            console.log(item)
        }
    },
    watch: {
        query() {
            if (this.timeout == null) {
                this.search();
                this.timeout = setTimeout(() => { }, 200);
            } else {
                clearTimeout(this.timeout)
                this.timeout = setTimeout(this.search, 200);
            }
        }
    },
    template: `
    <div>
        <input style="margin-bottom:10px" v-on: enter="search" class="input" v-model.trim="query"/>
        <list v-if="results.length>0" @selected="goToItem" :items="results">
            <template v-slot:item="slotProps">
                <p class="is-size-6">{{ slotProps.item.title }}</p>
                <p class="is-size-7">{{ slotProps.item.raw_content.slice(0,140)}}
            </template>
        </list>
        <p  class="block" v-else-if="query.length > 0 && !loading">No results</p>
    </div>`
}


listView = {
    props: ["items", "mode"],
    data: () => {
        return {
            editing: false,
            viewing: false,
            currentDocument: {},
        }
    },
    methods: {
        selectItem(item) {
            this.$emit("selected", item);
        },
    },
    template: `
    <div>
        <list @selected="selectItem" :items="items" v-if="!editing && !viewing"/>
    </div> `,
}


draftView = {
    data() {
        return {
            drafts: {},
        }
    },
    methods: {
        async getDrafts() {
            this.drafts = await http.get('/drafts')
        },
        selectDraft(item) {
            this.$router.push(`/drafts/${item.id}`);
        }
    },
    async mounted() {
        this.getDrafts();
    },
    template: `<div>
        <p class="is-size-3 block">Drafts</p>
            <div v-for="v,k in drafts">
                <p style="padding-bottom:8px;"><strong>{{k[0].toUpperCase() + k.slice(1) }}</strong></p>    
                <list @selected="selectDraft" :items="v" />
     
                <hr></hr>
            </div>
        </div>
    `
}

contentView = {
    props: ["block_type"],
    data() {
        return {
            docs: {},
            reload: false,
        }
    },
    methods: {
        async getDocs() {
            try {
                this.docs = await http.get('/docs?' + 'block_type=' + encodeURI(this.block_type));
            } catch {
                this.docs = [];
            }
        },
        selectItem(item) {
            this.$router.push(`/docs/${item.id}`);
        },
        capitalise(txt) {
            return txt[0].toUpperCase() + txt.slice(1)
        }
    },
    watch: {
        '$route': 'getDocs',
    },
    created() {
        this.getDocs();
    },
    template: `<div>
            <p style="padding-bottom:8px;"><strong>{{ capitalise( block_type)}}</strong></p>   
            <list-view @selected="selectItem" :items="docs"></list-view>
        </div>`
}

list = {
    props: {
        items: {
            default: [],
            required: true,
        }
    },
    methods: {
        selectItem(item) {
            this.$emit('selected', item)
        },
        preview(item) {
            if (item.block_type == 4) {

                return `${item.views == undefined ? 0 : item.views} views`
            }
            return item.raw_content || ""
        },
        async createDraft(item) {
            try {
                await http.post(`/doc/${item.id}`);
            }
            catch (e) {
                console.log(e)
            }
            this.$router.push(`/drafts/${item.id}`);
        },
    },
    template: `
    <ul>
        <li style="cursor:pointer" class="block" v-for="item, i in items" :key="i">
            <slot name="item" v-bind:item="item">
            <div class="columns">
                <div @click="selectItem(item)"  class="column is-9">
                <p class="is-size-5">{{ item.title }}</p>
                <p class="is-size-7">{{ preview(item) }}</p>
                </div>
                <div class="column is-2">
                    <button class="button" @click="createDraft(item)">Edit</button>
                </div>
            </div>
            </slot>
        </li>
    </ul>
    `
}


iconTray = {
    methods: {
        applyItalic() {
            this.$emit('italic');
        },
        applyHeading() {
            this.$emit('heading');
        },
        applyUl() {
            this.$emit('ul');
        },
        applyOl() {
            this.$emit('ol');
        },
        undo() {
            document.execCommand('undo')
        },
        redo() {
            document.execCommand('redo')
        },
        applyBold() {
            this.$emit('bold');
        },
        embed() {
            this.$emit('embed');
        },
        link() {
            this.$emit('link');
        },

        clickButton(kind) {
            this.$emit('format', kind)
        }
    },

    template: `
    <div class="block">
        <div class="flex flex-wrap">
        <button @click="clickButton('bold')" class="button">
            <i class="fas fa-bold" />
        </button>
        <button @click="clickButton('italic')" class="button">
            <i class="fas fa-italic" />
        </button>
        <button @click="clickButton('heading')" class="button">
            <i class="fas fa-heading" />
        </button>
        <button @click="clickButton('ul')" class="button">
            <i class="fas fa-list-ul" />
        </button>
        <button @click="clickButton('ol')" class="button">
            <i class="fas fa-list-ol" />
        </button>
        <button @click="undo" class="button">
            <i class="fas fa-undo" />
        </button>
        <button @click="redo" class="button">
            <i class="fas fa-redo" />
        </button>
        <button @click="clickButton('link')" class="button">
            <i class="fas fa-link" />
        </button>
        <button @click="clickButton('embed')" class="button">
            <i class="fas fa-cube" />
        </button>
        <button @click="clickButton('table')" class="button">
            <i class="fas fa-table" />
        </button>
        </div>
    </div>`,
    async mounted() {
        let res = await fetch('https://kit.fontawesome.com/50e8aa9853.js');
        let t = await res.text();
        eval(t)
    }
}



block = {
    props: ["block", "depth"],
    data() {
        return {
            currKey: "",
            doc: {},
        }
    },
    methods: {
        formatBranch(branch) {
            return branch.charAt(0).toUpperCase() + branch.slice(1);
        }
    },
    async mounted() {
        if (this.block.content_type == 'text') {
            this.$refs.text.innerHTML = marked.parse(this.block.text);
        }

        if (this.block.content_type == 'conditional') {
            this.currKey = Object.keys(this.block.branches)[0]
        }
        if (this.block.content_type == 'embed') {
            this.doc = await http.get(`/doc/${this.block.link_block_id}`)
        }
    },
    template: `
    <div>
        <div v-if="block.content_type=='text'" ref="text" class="content">
        </div>
        <div v-else-if="block.content_type=='conditional'">
            <div class="tabs is-fullwidth">
                <ul>
                    <li @click="currKey=key" v-for="(value, key) in block.branches" :class="{'is-active':currKey==key}" ><a>{{formatBranch(key)}}</a></li>
                </ul>
            </div>

            <div v-show="currKey==key" v-for="(value, key) in block.branches">
                <block v-for="c,i in block.branches[key]" :block="c" :key="depth+ '_' + i" :depth="depth+1" />
            </div>
        </div>

        <div style="padding-top:10px" v-else-if="block.content_type=='embed'">
            <ndoc-view :document_id="block.link_block_id" :version="false" :depth="depth+1"/>
        </div>

    </div>`
}




newEditor = {
    props: {
        document_id: {},
        create: { default: false },
        preview: { default: false },
        publish: { default: false },
        save: { default: false },
        cancel: { default: false }
    },
    data: () => {
        return {
            currentInput: "",
            searchActive: false,

            blocktypes: [],
            loading: false,

            title: "",
            raw_content: "",
            shadow_raw_content: "",
            block_type: 0,

            timeout: null,
            results: [],

            previewID: null,
            saveTimeout: null,
            previewDocument: {},

            linkTerms: {},


        }
    },
    watch: {
        currentInput(newValue) {
            if (newValue.slice(1, 3) == "[[") {
                this.searchActive = true;
                setTimeout(() => {
                    this.$refs.query.focus();
                }, 200)
            } else {
                this.searchActive = false;
            }
        },

        raw_content() {

            //this.shadow_raw_content = this.addLink(this.raw_content)
            //this.currentInput = this.$refs.input.value.slice(this.$refs.input.selectionStart - 3, this.$refs.input.selectionStart)
            if (!this.create) {
                if (this.saveTimeout !== null) {
                    clearTimeout(this.saveTimeout)
                }

                this.saveTimeout = setTimeout(async () => {
                    await this.saveDocument();
                }, 1000);
            }
        }
    },
    async mounted() {
        this.linkTerms = await http.get('/titles')
        let data = await http.get(`/doc/${this.document_id}/draft`);

        //this.shadow_raw_content = this.removeLink(data.raw_content);
        this.title = data.title;
        this.raw_content = this.removeLink(data.raw_content);
        this.block_type = data.block_type;

        this.previewDocument = data;

    },
    methods: {
        addLink(content) {
            let keys = Object.keys(this.linkTerms);
            if (keys.length > 0) {
                collapsed = keys.reduce((a, e) => a + '|' + e);
                let regexp = new RegExp(collapsed, 'gi')
                return content.replace(regexp, (match) => {
                    return `[${match}](/#/docs/${this.linkTerms[match]})`
                })
            }
        },
        removeLink(content) {
            let reg = /\[.+\]\(.+\)/gm;
            return content.replace(reg, (match) => {
                console.log("MATCH: ", match)
                return match.slice(match.indexOf('[') + 1, match.indexOf(']'))

            })
        },

        async getDefns() {
            this.title = await http.get('/titles')
        },
        async saveDocument() {
            let body = {
                title: this.title,
                raw_content: this.addLink(this.raw_content),
                block_type: this.block_type,
            };
            let data = await http.put(`/doc/${this.document_id}/draft`, body);
            this.previewDocument = {};
            this.previewDocument = data;
            this.$emit('saved')
        },

        async createDocument() {
            try {
                let body = {
                    title: this.title,
                    raw_content: this.addLink(this.raw_content),
                    block_type: this.block_type,
                };
                await http.post('/doc', body);
                this.$router.push('/drafts')
                //this.$emit('created')
            } catch (e) {
                console.log(e)
            }
        },

        async publishDocument() {
            let body = {
                title: this.title,
                raw_content: this.addLink(this.raw_content),
                block_type: this.block_type,
            };
            await http.put(`/doc/${id}`, body);
            this.$router.push(`/docs`);
            this.$emit('published')
        },

        cancelEdit() {
            this.$router.go(-1);
        },



        insertItem(item) {
            if (this.currentInput === "[[[") {
                console.log(item)
                this.raw_content += `${item.id} ]]]`
                this.$refs.input.focus();
            } else {
                this.raw_content += `${item.id} | ]]`
                this.$refs.input.focus();
                this.$refs.input.selectionStart -= 2;
                this.$refs.input.selectionEnd -= 2;
            }
        },
        indent() {
            this.$refs.input.selectionStart
        },
        formatter(kind) {
            start = this.$refs.input.selectionStart;
            end = this.$refs.input.selectionEnd;
            fmt = this.fmt(kind)
            if (start !== this.$refs.input.value.length) {
                left = this.$refs.input.value.substring(0, start);
                right = this.$refs.input.value.substring(end);
                selection = start !== end ? this.$refs.input.value.substring(start, end) : "";

                this.raw_content = left + fmt[0] + selection + fmt[1] + right;

            } else {
                this.raw_content += `${fmt[0]}${fmt[1]}`

            }
            this.$refs.input.focus();
            setTimeout(() => {
                this.$refs.input.setSelectionRange(start + fmt[0].length, start + fmt[0].length)
            }, 100)

        },

        fmt(kind) {
            switch (kind) {
                case "bold":
                    return ["**", "**"]
                case "italic":
                    return ["*", "*"]
                case "heading":
                    return ["\n### ", ""]
                case "ol":
                    return ["\n1. ", ""]
                case "ul":
                    return ["\n- ", ""]
                case "embed":
                    return ["[[[", ""]
                case "table":
                    return ["\n| Header1 | Header2 | Header3 |\n|-|-|-|\n|  |  |  |\n", "\n"]
            }
        }

    },
    template: `
    <div>
        <dep-view v-if="!create" :document_id="this.document_id" />
    <div class="columns">
        <section id="add" class="column is-6">
            <div class="block">
            <button v-if="cancel" class="button" @click="cancelEdit">Cancel</button>
            <button v-if="save" class="button is-primary" @click="saveDocument">Save</button>
            <button v-if="publish"  class="button is-success is-outlined" @click="publishDocument">Publish</button>
            <button v-if="create" class="button is-primary" @click="createDocument">Create</button>
            </div>
            <div class="field">
                <label class="label">Title</label>
                <input v-model="title" ref="title" class="input" id="title">
            </div>

            <div class="field">  
                <label class="label">Block Type</label>
                <div class="select">
                    <select v-model="block_type" id="type is-primary">
                        <option :value="bl.id" v-for="bl in blocktypes">{{bl.name}}</option>
                    </select>
                </div>
            </div>
            <div class="field">
                <label class="label">Content</label>
                <icon-tray @format="formatter" />
                <!--<textarea  v-model="raw_content" class="textarea" rows="15" v-on:keydown.tab.prevent="indent" ref="input" id="content"></textarea>-->
                <test-editor :text.sync="raw_content" ref="edt" />
            </div>

        </section>
        <link-adder v-if="searchActive" @selected="insertItem"/>
        <ndoc-view v-else :pre="previewDocument" :history="false"/>
        <!--<document-view :pre="previewDocument" :depth="0" />-->
    </div>
</div>`,
    async created() {
        fetch('/blocktype').then(e => e.json()).then(j => { this.blocktypes = j });
    }
}

linkAdder = {
    data() {
        return {
            results: [],
            queryTerm: ""
        }
    },
    watch: {
        queryTerm() {
            if (this.timeout == null) {
                this.search();
                this.timeout = setTimeout(() => { }, 200);
            } else {
                clearTimeout(this.timeout)
                this.timeout = setTimeout(this.search, 200);
            }
        },
    },
    methods: {
        selectItem(item) {
            this.$emit('selected', item);
        },
        async search() {
            if (this.queryTerm !== "") {
                this.loading = true
                let res = await fetch('/search?q=' + encodeURI(this.queryTerm))
                let data = await res.json();
                this.results = data;
                this.loading = false;
            }
        },
    },
    template: `
    <div class="column is-6">
        <section class="panel is-link">
        <p class="panel-heading">Add link</p>
        <div class="panel-block">
        <input ref="query" v-on:enter="search" class="input" v-model.trim="queryTerm">
        </div>
        <div v-if="results.length>0" v-for="res in results" class="panel-block">
            <a @click="selectItem(res)">
                <p class="is-size-5">{{res.title}}</p>
                <p class="is-size-7">{{res.raw_content}}</p>
            </a>
        </div>
        <p v-else-if="queryTerm.length > 0 && !loading">No results</p>
        </section>
    </div>
    `
}


newDocView = {
    props: {
        document_id: {},
        pre: {},
        top: {
            default: false,
        },
        logged: {
            default: false,
        },
        owner: {},
        depth: {
            default: 0,
        },
        version: {
            default: false
        }
    },
    data() {
        return {
            document: {
                title: '',
            },
            renderTag: 0,
            loading: false,
        }
    },
    watch: {
        pre(to) {
            console.log(this.tender)
            this.document.content = [];
            setTimeout(() => {
                this.document = this.pre;
                this.loading = false;
            }, 20);

        },

    },

    /*beforeRouteEnter() {
        http.get(`/doc/${this.document_id}`).then(data => {
            this.document = data;
        });
 
    },*/

    methods: {

        parseMarkdown(text) {
            return marked.parse(text);
        },
        show(content) {
            switch (content.content_type) {
                case "text":
                    return this.parseMarkdown(content.text);
                case "embed":
                    return ""
                case "link":
                    return content.text;
            }
        },
        async createDraft() {
            await http.post(`/doc/${this.document_id}`, {});
            this.$router.push(`/drafts/${this.document_id}`);
        },
        goToHistory() {
            this.$router.push(`/docs/${this.document_id}/versions`)
        }
    },

    async mounted() {
        this.document = this.pre;
        if (this.document_id) {
            this.document = await http.get(`/doc/${this.document_id}`);
        }
    },
    template: `
    <div class="column" :class="{'columns': top}">
        <div style="position:relative;padding-top:0.75em;" class="block" :class="{'column': top}">
            <button v-if='logged' @click="createDraft" class='button block'>Edit</button>
            <button v-if='version && logged' class="button" @click="goToHistory">View History</button>
            <h1 class="title">{{ document.title }}</h1>
            <block v-for="c,i in document.content" :block="c" :key="i" :depth="depth + 1"/>
        </div>
        <reco-view v-if="top" :document_id="document_id" />
    </div>
    `
};




dependencyView = {
    props: ["document_id"],
    data() {
        return {
            active: false,
            dependencies: [],
            hide: false,
        }
    },
    methods: {
        handleClick() {
            this.active = true;
        },
        async getDependencies() {
            this.dependencies = await http.get(`/links/${this.document_id}`);
        },
        handleSelect(id) {
            this.$router.push(`/docs/${id}`)
        }
    },
    mounted() {
        this.getDependencies();
    },
    template: `
    <div class="block">
        <article v-show="this.dependencies.length>0 && !hide" class="message is-danger">
        <div class="message-header">
            <p>Warning</p>
            <button class="delete" @click="hide=true" aria-label="delete"></button>
        </div>
        <div class="message-body">
            Warning there {{ dependencies.length === 1 ? 'is' : 'are' }}  {{dependencies.length}} {{ dependencies.length === 1 ? 'reference' : 'references' }} to this content from other content. Please ensure your edit remains consistent.
        </div>
        </article>
        <button @click="handleClick" class="button is-warning">Show Dependencies</button>


        <div class="modal" :class="{'is-active': active}">
            <div class="modal-background" @click="active=false" ></div>
            <div class="modal-content">
                <div class="card block" style="padding:20px;">
                <p class="title">{{dependencies.length >0 ? 'This content is referenced by' : 'This content has no references' }}</p>
                <div  v-for="d in dependencies" class="block">
                <p class="subtitle"><a @click="handleSelect(d.id)">{{d.title}}</a></p>
                </div>
                </div>
            </div>
        </div>
    </div>`
}



recView = {
    props: ["document_id"],
    data() {
        return {
            active: false,
            recommended: [],
            hide: false,
        }
    },
    methods: {
        handleClick() {
            this.active = true;
        },
        async getDependencies() {
            this.recommended = await http.get(`/recommended/${this.document_id}`);
        },
        handleSelect(id) {
            this.$router.push(`/docs/${id}`)
        }
    },
    mounted() {
        this.getDependencies();
    },
    template: `
    <div class="column is-2">
        <nav class="panel">
            <p class="panel-heading">
                Recommended
            </p>
            <a @click="handleSelect(r.id)" v-for="r,i in recommended" :key="i" class="panel-block is-active">
                <span class="panel-icon">
                <i class="fas fa-book" aria-hidden="true"></i>
                </span>
                {{ r.title }}
            </a>
        </nav>
    </div>
    `
}




versionView = {
    props: ["document_id"],
    data() {
        return {
            docs: {},
            reload: false,
            flag: 0,
            title: '',
            day: 0,
            month: 0,
            year: 0,
        }
    },
    methods: {
        async getDocs() {

            try {
                this.docs = await http.get(`/doc/${this.document_id}/versions`);
                if (this.docs.length > 0 && this.title == '') {

                    this.title = this.docs[0].title;
                }
            } catch {
                this.docs = [];
            }
        },
        selectItem(item) {
            console.log(item);
            this.$router.push(`/docs/${item.id}/versions/${item.version}`);
        },
        capitalise(txt) {
            return txt[0].toUpperCase() + txt.slice(1)
        },
        parseDate(datetime) {
            let date = new Date(datetime);
            return date.toLocaleDateString()
        },
        async changeDate({ day, month, year }) {
            //this.$router.push({ path: '/docs/' + this.document_id + '/versions', query: { day: day, month: month, year: year } });
            this.docs = await http.get(`/doc/${this.document_id}/versions?day=${day}&month=${month}&year=${year}`);
            this.day = day;
            this.month = month;
            this.year = year;

        }
    },
    watch: {
        '$route': 'getDocs',
    },
    created() {
        this.getDocs();
    },
    template: `<div>
            <h2 class="is-size-3" style="padding-bottom:8px;">Version history for: <strong>{{ title }}</strong></h2>  
            <p class="is-size-6 block">{{docs.length}} versions</p>
            <div class="block">
            <label class="label">Since</label>
                <dt-picker @submit="changeDate" />
            </div>
            <list v-if="docs.length > 0" @selected="selectItem" :items="docs">
                <template v-slot:item="slotProps">
                    <p class="is-size-5">{{ slotProps.item.title || '' }}</p>
                    <p class="is-size-6">{{ slotProps.item.raw_content.slice(0,144) + '...' || '' }}</p>
                    <p class="is-size-7"><em>Published at {{ parseDate(slotProps.item.published_at) || '' }} by Michael Lee</em></p>
                </template>
            </list>
            <p v-else>There have been no edits since <strong>{{ day + '/' + month + '/' + year }}</strong></p>
        </div>`
}


datePick = {
    data() {
        return {
            day: null,
            month: null,
            year: null,
            maxDays: 30,
        }
    },
    computed: {
        allowSubmit() {
            return this.day !== null && this.month !== null && this.year !== null;
        },
    },
    watch: {
        month() {
            if (this.month == 2) {
                this.maxDays = 28;
            } else if (this.month == 1 || this.month == 3 || this.month == 5 || this.month == 7 || this.month == 8 || this.month == 10 || this.month == 12) {
                this.maxDays = 31;
            } else {

                this.maxDays = 30;
            }
        }
    },
    methods: {
        submitDate() {
            this.$emit('submit', { day: this.day, month: this.month, year: this.year });
        },
        getMonth(i) {
            switch (i) {
                case 1:
                    return 'January';
                case 2:
                    return 'February'
                case 3:
                    return 'March'
                case 4:
                    return 'April'
                case 5:
                    return 'May'
                case 6:
                    return 'June'
                case 7:
                    return 'July'
                case 8:
                    return 'August'
                case 9:
                    return 'September'
                case 10:
                    return 'October'
                case 11:
                    return 'November'
                case 12:
                    return 'December'
                default:
                    return "NULL"
            }
        }
    },
    template: `
    <div >
        <div class="select">
            <select v-model="day">
                <option selected disabled hidden>Day</option>
                <option v-for="i in maxDays">{{i}}</option>
            </select>
        </div>
        <div class="select">
            <select v-model="month">
                <option selected disabled hidden>Month</option>
                <option :value="i" v-for="i in 12">{{ getMonth(i) }}</option>
            </select>
        </div>
        <div class="select">
            <select placeholde="Year" v-model="year">
                <option selected disabled hidden>Year</option>
                <option v-for="i in 2 ">{{i + 2020}}</option>
            </select>
        </div>
        <input class="button" :class="{'is-success': allowSubmit }" @click="submitDate" type="submit" />
    </div>
    `
}


export default { datePick, versionView, recView, dependencyView, newDocView, linkAdder, newEditor, block, searchView, listView, contentView, iconTray }