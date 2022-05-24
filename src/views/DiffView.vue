<template>
	<div v-html="diff">
		
	</div>
</template>

<script>
export default {
	data(){
		return {
			diff:'',
		}
	},
	created() {
		this.diff = window.diffHTML
	},
}
</script>

<style>
.diff-deleted {
	color:#ff5d5d;
	text-decoration: line-through;
	padding-right: 2px;
	padding-left: 2px;
}

.diff-added {
	color: #058b00;
}

.diff-added::before {
	content:'+';
	font-weight: bold;
	padding-right: 2px;
	padding-left: 2px;
}
</style>
