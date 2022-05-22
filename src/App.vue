<template>

	<div id="app" class="column is-12">
		<header class="columns">
			<div class="column is-9">
				<h1 class="title">Demo</h1>
			</div>
			<div class="column is-3">
				<div class="dropdown" v-if="loggedIn" @mouseover="showRole = true" @mouseleave="showRole = false"
					:class="{ 'is-active': showRole }">
					<div class="dropdown-trigger">
						<button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
							<span>{{ roles[currRole] }}</span>
							<span class="icon is-small">
								<i class="fas fa-angle-down" aria-hidden="true"></i>
							</span>
						</button>
					</div>
					<div class="dropdown-menu" id="dropdown-menu" role="menu">
						<div class="dropdown-content">
							<a v-for="(role, i) in roles" :key="role" href="#" class="dropdown-item" @click="selectRole(i)">{{ role }}</a>
						</div>
					</div>
				</div>
				<div style="margin-left: 10px" class="dropdown" v-if="loggedIn" @mouseover="showLogout = true"
					@mouseleave="showLogout = false" :class="{ 'is-active': showLogout }">
					<div class="dropdown-trigger">
						<button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
							<span>Hi User</span>
							<span class="icon is-small">
								<i class="fas fa-angle-down" aria-hidden="true"></i>
							</span>
						</button>
					</div>
					<div class="dropdown-menu" id="dropdown-menu" role="menu">
						<div class="dropdown-content">
							<a href="#" class="dropdown-item">Profile</a>
							<router-link to="/easy" class="dropdown-item">Content</router-link>
							<router-link to="/easysch" class="dropdown-item">Schemas</router-link>
							<a @click="resetApp" class="dropdown-item">Reset App</a>
							<hr class="dropdown-divider" />
							<a @click="
								loggedIn = false;
							current_user_id = 1000;
							" class="dropdown-item">Logout</a>
						</div>
					</div>
				</div>
			</div>
		</header>
		<div class="tabs">
			<ul>
				<router-link :to="item.path" :active-class="'is-active'" :tag="'li'" v-for="(item, index) in tabs" :key="index">
					<a>{{ item.name }}</a></router-link>
			</ul>
		</div>
		<router-view :user-role="roles[currRole]" :logged="loggedIn" :current_user="current_user_id"></router-view>
	</div>
</template>

<script>
import http from "@/http";
import { contentRoutes } from "./router.js";
export default {
	name: "App",
	data() {
		return {
			currentSection: -1,
			allTabs: [
				...contentRoutes,
				{ name: "Search", path: "/search" },
				{ name: "Your drafts", path: "/drafts" },
				{ name: "Admin", path: "/admin" },
			],
			loggedIn: true,
			showLogout: false,
			showRole: false,
			current_user_id: 0,
			currRole: 2,
			roles: ["Admin", "Approver", "Owner", "Viewer"],
		};
	},
	computed: {
		tabs() {
			if (this.loggedIn) {
				return this.allTabs;
			} else {
				return this.allTabs.filter(
					(e) => e.name.toLowerCase().search(/your|create|admin/) == -1
				);
			}
		},
	},
	methods: {
		selectRole(i) {
			this.currRole = i;
			this.showRole = false;
		},
		async resetApp() {
			try {
				await http.get(this.API_URL + "/hard_reset");
			} finally {
				this.$router.push("/");
			}
		},
	},
	async mounted() {
		let res = await fetch("https://kit.fontawesome.com/50e8aa9853.js");
		let t = await res.text();
		eval(t);
	},
};
</script>

<style>
</style>
