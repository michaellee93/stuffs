<template>
	<div style="margin-top:4em">
		<h1 class="title is-3">Dashboard</h1>
		<div class="columns block">
			<div class="column selby" @click="dueOnes=!dueOnes" :class="{sel:dueOnes}">
				<h1 class="title is-2">{{ content.filter(e=>e.color!=="transparent").length}}</h1>
				Due soon
			</div>
			<div class="column">
				<h1 class="title is-2">0</h1>
				Changes this month
			</div>
			<div class="column">

			</div>
			<div class="column">

			</div>
		</div>

		<div class="block">
			<table class="table is-fullwidth">
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
						<td>{{ c.content.Title }}</td>
						<td>{{ c.content_type }}</td>
						<td>{{ c.published_at.toLocaleDateString() }}</td>
						<td>{{ c.due.toLocaleDateString() }}</td>
					</tr>
				</tbody>

			</table>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			content: [],
			content_types: [],
			dueOnes: false,
		}
	},
	computed: {
		contents(){
			if (this.dueOnes){
				return this.content.filter(e=>e.color!=="transparent")
			}
			return this.content
		}
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

		}
	}
}
</script>


<style>
.sel { 
	border: 1px solid #d4d4d4;

	border-radius:6px;
}

.selby {
	cursor: pointer;
}

</style>
