<template>
	<div>
		<div class="columns">
			<!--			<aside class="menu column is-2">
				<p class="menu-label">Fields</p>
				<ul class="menu-list">
					<li v-for="(field, i) in currentSchema.fields" :key="i">
						<a :href="`#${field.name}`">{{ field.name }}</a>
					</li>
				</ul>
			</aside>-->
			<section id="add" class="column is-10 content">
				<div class="block buttons">
					<button v-if="cancel" class="button" @click="cancelEdit">
						Cancel
					</button>
					<button v-if="save" class="button is-primary" @click="saveDocument">
						Save
					</button>
					<button v-if="publish" class="button is-success is-outlined" @click="publishDocument">
						Publish
					</button>
					<button v-if="create" class="button is-primary" @click="createDocument">
						Create
					</button>
				</div>
				<div v-show="saved" class="message" :class="{ 'is-success': saved, 'is-danger': !saved }">
					<div class="message-body">
						{{ this.saved ? "Saved successfully" : "Could not save" }}
					</div>
				</div>
				<div class="field">
					<label class="label">Content Type</label>
					<div class="select is-fullwidth">
						<select v-model="selectionIdx" id="type is-primary">
							<option :value="i" v-for="(bl, i) in selections" :key="i">
								{{ bl }}
							</option>
						</select>
					</div>
				</div>

				<!--				<div class="field">
					<label class="label">Approver</label>
					<div class="select is-fullwidth">
						<select v-model="owner" id="type is-primary">
							<option :value="i" v-for="(bl, i) in users" :key="i">
								{{ bl }}
							</option>
						</select>
					</div>
				</div>
-->
				<label class="checkbox">
					<input v-model="currentSchema.Tab" type="checkbox" />
					Tabs
				</label>

				<div class="tabs" v-if="currentSchema.Tab">
					<ul>
						<li @click="currTab = i" :class="{ 'is-active': i == currTab }" v-for="f, i in currentSchema.Data" :key="i">
							<a>{{ f.tabName
							}}</a>
						</li>
						<li><a @click="addTab">Add +</a></li>
					</ul>
				</div>

				<div class="field" v-if="selectionIdx == 3">
					<div class="field columns" :key="i" v-for="step, i in currentSchema.Data">
						<div class="column is-1">{{ step.id }}</div>
						<div class="column is-11">
							<label class="label">Author</label>
							<input v-model="step.author" class="input" id="title" />
							<new-editor :active="true" :content.sync="step.value" />
						</div>
					</div>
					<button @click="addStep" class="button">Add step</button>
				</div>

				<div class="field" v-else-if="selectionIdx == 2">
					<button v-show="currentSchema.Tab" class="button is-danger" @click="deleteTab">Delete tab</button>
					<div class="field">
						<label class="label">Tab name</label>
						<input v-model="currentTab.tabName" class="input" id="title" />
					</div>
					<div class="field" :key="i" v-for="(sec, i) in currentTab.value">
						<label class="label">Section Title</label>
						<input v-model="sec.title" class="input field" id="title" />
						<label class="label">Section Content</label>
						<new-editor :active="true" :content.sync="sec.content" />
					</div>
					<button @click="addSection" class="button">Add section</button>
				</div>

				<div class="field" v-else>
					<button v-show="currentSchema.Tab" class="button is-danger" @click="deleteTab">Delete tab</button>
					<div class="field">
						<label class="label">Tab name</label>
						<input v-model="currentTab.tabName" class="input" id="title" />
					</div>
					<div class="field">
						<new-editor :active="true" :content.sync="currentTab.value" />
					</div>
				</div>





				<!--					<label class="label">{{ field.name }}</label>

					<div v-if="field.type == 'block'">
						<new-editor :definitions="titles" :content.sync="forms[content_type][field.name]"
							:editor-text.sync="editorText" :active="i == currBlock" @activated="currBlock = i" />
					</div>

					<div v-else-if="field.type == 'blocks'">
						<div v-for="(block, j) in forms[content_type][field.name]" :key="j" :num="j">
							<new-editor :definitions="titles" :content.sync="forms[content_type][field.name][j]"
								:editor-text.sync="editorText" :active="j == currBlock"
								:show-delete="forms[content_type][field.name].length > 1" @activated="currBlock = j"
								@delete="deleteBlock(field.name, j)" />

							<button v-show="j == currBlock" @click="addBlock(field.name, j)"
								class="button is-fullwidth is-info add-block-button">
								Add Block
							</button>
						</div>
					</div>-->

			</section>
		</div>
		<button class="button is-success" @click="copy">Copy to clipboard</button>
		<section class="content">
			<pre ref="output">{{ currentSchema }}</pre>
		</section>
	</div>
</template>

<script>
//import http from "@/http.js";
import NewEditor from "@/components/editor/NewEditor.vue";
//import MultiSelect from "@/components/MultiSelect.vue";

export default {
	components: { NewEditor,/* MultiSelect*/ },
	props: {
		cancel: {},
		create: { default: false },
		save: {},
		publish: {},
		document_id: { default: 1 },
	},
	data() {
		return {
			test: "",
			currTab: 0,
			selections: ["Strategy, Resource, Product", "ICS", "Standard", "Process"],
			selectionIdx: 0,
			doc: {
				Tab: false,
				StandardContent: false,
				Data: [{
					id: "1",
					tabName: "",
					value: "",
				}]
			},
			document:
			{
				"_id": 1,
				Tabs: false,
				"version": 1,
				"owner_id": 0,
				"content_type": 1,
				"created_at": "2022-02-07T12:14:07.700969Z",
				"published_at": "2022-02-07T12:14:07.700969Z",
				"draft": true,
				"content": {
					"Definition": { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Approval from the wife required" }] }] },
					"Title": "Level 2"
				}
			},
			schemas: [{//Strategy, Resource, Product
				Tab: false,
				//				StandardContent: false,
				Data: [{
					id: "1",
					tabName: "",
					value: "",
				}]
			},
			{ // ICS
				Tab: false,
				//		StandardContent: false,
				Data: [{
					id: "1",
					tabName: "",
					value: "",
				}]
			},
			{ // Standard
				Tab: true,
				StandardContent: true,
				Data: [{
					id: "1",
					tabName: "Standards",
					value: [{
						contentId: "1",
						title: "",
						content: "",
					}],
				}]
			},
			{
				Tab: false,
				Data: [
					{
						id: "1",
						author: "",
						value: "",
					}
				]
			}
			],

			saved: null,
			editorText: "",
			titles: [],
			forms: [],
			currBlock: 0,
			currRes: "",
		};
	},
	methods: {
		addStep() {
			this.currentSchema.Data.push({
				id: `${this.currentSchema.Data.length+1}`,
				author: "",
				value: "",
			})
		},
		addTab() {
			var value = "";
			if (this.currentSchema.StandardContent) {
				value = [{
					id: `${Math.ceil(Math.random() * 10000)}`,
					title: "",
					content: "",
				}]
			}
			this.schemas[this.selectionIdx].Data.push({
				id: `${Math.ceil(Math.random() * 10000)}`,
				tabName: "",
				value: value,
			})
		},
		addSection() {
			if (this.currentSchema.StandardContent) {
				this.currentTab.value.push({
					id: `${Math.ceil(Math.random() * 10000)}`,
					title: "",
					content: "",
				})
			}
		},
		createRefs(schemas) {
			schemas.forEach((schema, i) => {
				if (!this.forms[i]) {
					this.$set(this.forms, i, {});
				}
				schema.fields.forEach((field) => {
					switch (field.type) {
						case "text":
						case "select":
						case "block":
							this.$set(this.forms[i], field.name, "");
							break;
						case "data":
						case "blocks":
							this.$set(this.forms[i], field.name, [""]);
							break;
						case "multiselect":
							this.$set(this.forms[i], field.name, []);
							break;
					}
				});
			});
		},
		copy() {
			navigator.clipboard.writeText(this.$refs.output.innerText)
		},
		deleteTab() {
			let del = this.currTab;
			
			if (this.currTab > 0) {
				this.currTab = 0;
				this.currentSchema.Data.splice(del);
			}
		}
	},
	computed: {
		currentSchema() {
			return this.schemas[this.selectionIdx]
		},
		currentTab() {
			if (this.currentSchema.Tab) {
				return this.currentSchema.Data[this.currTab]
			}
			return this.currentSchema.Data[0]
		}
	},
	watch: {
		currTab: function (v) {
			console.log(v)
		}
	}

};
</script>

<style>
</style>
