<template>
	<div style="margin-top:4em">
		<h1 class="subtitle">{{ userRole }}</h1>
		<h1 class="title is-3">Dashboard </h1>
		<div class="columns block">
			<div v-if="userRole === 'Owner'" class="column selby" @click="select('due')" :class="{ sel: dueOnes }">
				<h1 class="title is-2">{{ content.filter(e => e.color !== "transparent").length }}</h1>
				Due soon
			</div>
			<div v-if="userRole === 'Approver'" class="column">
				<h1 class="title is-2">{{ approvals.length }}</h1>
				Require approval
			</div>
			<div class="column">
				<h1 class="title is-2">0</h1>
				Changes this month
			</div>
			<div v-if="userRole === 'Owner'" class="column selby" @click="select('app')" :class="{ sel: recentlyApproved }">
				<h1 class="title is-2">{{ approved.filter(e => e).length }}</h1>
				Publish requests approved
			</div>
			<div v-else class="column">

			</div>
			<div class="column">

			</div>
		</div>

		<div class="block">
			<table v-if="userRole === 'Owner' && !recentlyApproved" class="table is-fullwidth">
				<thead>
					<th></th>
					<th>Title</th>
					<th>Category</th>
					<th>Last Reviewed</th>
					<th>Due for Review</th>
				</thead>
				<tbody>
					<tr :key="i" v-for="(c, i) in contents">
						<td><span class="icon"><i class="fas fa-exclamation" :style='{ color: c.color }'></i></span></td>
						<td><router-link :to="'/docs/'+ c._id" >{{ c.content.Title }}</router-link></td>
						<td>{{ c.content_type }}</td>
						<td>{{ c.published_at.toLocaleDateString() }}</td>
						<td>{{ c.due.toLocaleDateString() }}</td>
					</tr>
				</tbody>
			</table>

			<table v-else-if="userRole === 'Owner' && recentlyApproved" class="table is-fullwidth">
				<thead>
					<tr>
						<th>Published At</th>
						<th>Name</th>
						<th>Content Type</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(app, i) in approvals.filter((_, i)=>(approved[i]))" :key="i" 
						:class="{ polrow: app.content_type == 'Policy' }">
						<td>
							{{ app.published_at.toLocaleDateString() }}
						</td>

						<td>
							<a>{{ app.content }}</a>
						</td>
						<td>
							{{ app.content_type }}
						</td>
						<td>
							<button @click="download(app.content)" class="button is-info" :class="{
								hide: app.content_type !== 'Policy',
							}">
								<span class="icon is-small"><i class="fas fa-download"></i></span>
								<span>Download Policy Template</span>
							</button>
						</td>
					</tr>
				</tbody>
			</table>

			<table v-else-if="userRole === 'Approver'" class="table is-fullwidth">
				<thead>
					<tr>
						<th></th>
						<th>Content</th>
						<th>Content Type</th>
						<th>Submitted By</th>
					</tr>
				</thead>
				<tbody>
					<!--<tr v-for="(app, i) in approvals" :key="i" :class="{ approved: approved[i] }">-->
					<tr v-for="(app, i) in approvals" :key="i">
						<td>
							<i v-if="approved[i]" class="fas fa-check" style="color: darkgreen"></i>
							<input v-else type="checkbox" class="checkbox" v-model="selections[i]" />
						</td>
						<td>
							<a>{{ app.content }}</a>
						</td>
						<td>
							{{ app.content_type }}
						</td>
						<td>
							{{ app.requester }}
						</td>
					</tr>
				</tbody>
				<button @click="mag" class="button" :class="{ 'is-success': hasSelection }">
					Approve
				</button>

			</table>



			<!--				<thead>
					<th></th>
					<th>Title</th>
					<th>Category</th>
					<th>Last Reviewed</th>
					<th>Due for Review</th>
				</thead>
				<tbody>
					<tr :key="i" v-for="(c, i) in contents">
						<td><span class="icon"><i class="fas fa-exclamation" :style='{ color: c.color }'></i></span></td>
						<td>{{ c.content.Title }}</td>
						<td>{{ c.content_type }}</td>
						<td>{{ c.published_at.toLocaleDateString() }}</td>
						<td>{{ c.due.toLocaleDateString() }}</td>
					</tr>
				</tbody>
			</table>-->
		</div>
	</div>
</template>
<script>
export default {
	props: ['userRole'],
	data() {
		return {
			content: [],
			content_types: [],
			dueOnes: false,
			recentlyApproved: false,
			approvals: [
				{
					content: "Example Title",
					content_type: "Policy",
					requester: "User Name",
					published_at: new Date(),
				},
				{
					content: "Oven",
					content_type: "Definition",
					requester: "Alan Citizen",
					published_at: new Date(),
				},
			],
			approved: [false, false],
			selections: [false, false],
		}
	},
	computed: {
		contents() {
			if (this.dueOnes) {
				return this.content.filter(e => e.color !== "transparent")
			}
			return this.content
		},
		hasSelection() {
			for (var i = 0; i < this.selections.length; i++) {
				if (this.selections[i]) {
					return true;
				}
			}
			return false;
		},
	},
	created() {
		this.content = window.baselineContent
		this.content_types = window.schemas

		for (let index = 0; index < this.content.length; index++) {
			const element = this.content[index];
			element.published_at = new Date(element.published_at)
			const offset = Math.floor(Math.random() * 60) - 360;
			const anch = element.published_at.getDate();
			element.published_at.setDate(anch + offset)

			element.due = new Date();
			element.due.setDate(element.published_at.getDate() + 365)

			element.color = "transparent"
			if (offset + 365 < 30) {
				element.color = "#c40000"
			}

			element.content_type = this.content_types[element.content_type - 1].name

			this.approvals[0].content = window.baselineContent[window.baselineContent.length - 1].content.Title
		}
	},
	methods: {
		async download(name) {
			let tm = new Date().getTime();
			var textToSave = "heheh";
			var hiddenElement = document.createElement("a");
			hiddenElement.href = "data:attachment/text," + encodeURI(textToSave);
			hiddenElement.target = "_blank";
			hiddenElement.download = `${name}_${tm}.pdf`;
			hiddenElement.click();
		},
		mag() {
			for (var i = 0; i < this.selections.length; i++) {
				if (this.selections[i]) {
					this.$set(this.approved, i, true);
				}
			}
		},
		select(kind) {
			switch (kind) {
				case 'due':
					this.dueOnes = !this.dueOnes;
					this.recentlyApproved = false;
					break;
				case 'app':
					this.recentlyApproved = !this.recentlyApproved;
					this.dueOnes = false;
			}
		}
	},
}
</script>


<style>
.sel {
	border: 1px solid #d4d4d4;

	border-radius: 6px;
}

.selby {
	cursor: pointer;
}
</style>
