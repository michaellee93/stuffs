<template>
	<div>
		<h1 class="title is-4">Admin</h1>
		<div class="columns">
			<aside class="menu column is-2">
				<p class="menu-label">Menu</p>
				<ul class="menu-list">
					<li>
						<a v-for="(m, i) in menus[userRole]" :key="i">{{ m }}</a>
					</li>
				</ul>
			</aside>

			<div v-if="userRole === 'Admin'" class="column is-8">
				<h2 class="title is-2">Admin</h2>
				<div class="block">
					<h1 class="title is-6">Schemas</h1>
					<router-link to="/schemas">
						<button class="button is-light">Edit Schemas</button>
					</router-link>
				</div>
				<div class="block">
					<h1 class="title is-6">Reporting</h1>
					<router-link to="/reports"><button class="button is-light">Reporting</button></router-link>
				</div>
				<div class="block">
					<h1 class="title is-6">Your Approvals</h1>
					<table class="table is-fullwidth">
						<thead>
							<tr>
								<th></th>
								<th>Content</th>
								<th>Content Type</th>
								<th>Requester</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(app, i) in approvals" :key="i" :class="{ approved: approved[i] }">
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
					</table>
					<button @click="mag" class="button" :class="{ 'is-success': hasSelection }">
						Approve
					</button>
				</div>

				<div class="block">
					<h1 class="title is-6">User roles</h1>
					<table class="table is-fullwidth">
						<thead>
							<tr>
								<th>User</th>
								<th>Role</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(user, i) in users" :key="i">
								<td>{{ user.name }}</td>
								<td>{{ user.role }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div v-if="userRole === 'Approver'" class="column is-8">
				<h2 class="title is-2">Approver</h2>

				<div class="block">
					<h1 class="title is-6">Your Approvals</h1>
					<table class="table is-fullwidth">
						<thead>
							<tr>
								<th></th>
								<th>Content</th>
								<th>Content Type</th>
								<th>Submitted By</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(app, i) in approvals" :key="i" :class="{ approved: approved[i] }">
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
					</table>
					<button @click="mag" class="button" :class="{ 'is-success': hasSelection }">
						Approve
					</button>
				</div>
			</div>

			<div v-else-if="userRole === 'Owner'">
				<h2 class="title is-2">Owner</h2>
				<div class="block">
					<h1 class="title is-6">Publish Requests</h1>
					<table class="table is-fullwidth">
						<thead>
							<tr>
								<th>Published At</th>
								<th>Name</th>
								<th>Content Type</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(app, i) in publishs" :key="i" @mouseover="showButton(i)" @mouseleave="hideButton(i)"
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
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ["userRole"],
	data() {
		return {
			hover: null,
			selections: [false, false],
			approved: [false, false],
			approvals: [
				{
					content: "Example Title",
					content_type: "Policy",
					requester: "User Name",
				},
				{
					content: "Oven",
					content_type: "Definition",
					requester: "Alan Citizen",
				},
			],
			users: [
				{ name: "Bob Smith", role: "Editor" },
				{ name: "Jane Doe", role: "Editor" },
				{ name: "John Doe", role: "Owner" },
				{ name: "Jane Doe", role: "Editor" },
				{ name: "User Name", role: "System Administrator" },
			],
			publishs: [
				{
					published_at: new Date(),
					content: "Microwave Oven",
					content_type: "Policy",
				},
				{
					published_at: new Date("04/15/2022"),
					content: "Baking a Cake",
					content_type: "Credit Standard",
				},
				{
					published_at: new Date("04/01/2022"),
					content: "Picnic",
					content_type: "Guidance",
				},
				{
					published_at: new Date("03/02/2022"),
					content: "Other Policy",
					content_type: "Policy",
				},
			],
			menus: {
				Owner: ["Publish Requests"],
				Approver: ["Your approvals"],
				Admin: [
					"Schemas",
					"Reporting",
					"Your approvals",
					"User roles",
				],

			}
		};
	},
	computed: {
		hasSelection() {
			for (var i = 0; i < this.selections.length; i++) {
				if (this.selections[i]) {
					return true;
				}
			}

			return false;
		},
	},
	methods: {
		mag() {
			for (var i = 0; i < this.selections.length; i++) {
				if (this.selections[i]) {
					this.$set(this.approved, i, true);
				}
			}
		},
		showButton(idx) {
			this.hover = idx;
		},
		hideButton() {
			this.hover = null;
		},
		async download(name) {
			let tm = new Date().getTime();
			var textToSave = "heheh";
			var hiddenElement = document.createElement("a");
			hiddenElement.href = "data:attachment/text," + encodeURI(textToSave);
			hiddenElement.target = "_blank";
			hiddenElement.download = `${name}_${tm}.pdf`;
			hiddenElement.click();
		},
	},
	created() {
		this.approvals[0].content = window.baselineContent[window.baselineContent.length-1].content.Title	
		this.publishs[0].content = window.baselineContent[window.baselineContent.length-1].content.Title	
	},
};
</script>

<style>
.hide {
	visibility: hidden;
}

.polrow {
	background-color: #efefef;
}

.approved {
	background-color: #00ed4117;
}
</style>
