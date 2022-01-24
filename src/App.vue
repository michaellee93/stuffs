<template>
  <div id="app" class="column is-12">
    <header class="columns">
      <div class="column is-10">
        <h1 class="title">Demo</h1>
      </div>
      <div class="column is-2">
        <div
          class="dropdown"
          v-if="loggedIn"
          @mouseover="showLogout = true"
          @mouseleave="showLogout = false"
          :class="{ 'is-active': showLogout }"
        >
          <div class="dropdown-trigger">
            <button
              class="button"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
            >
              <span>Hi User</span>
              <span class="icon is-small">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
              <a href="#" class="dropdown-item">Profile</a>
              <hr class="dropdown-divider" />
              <a @click="loggedIn = false" class="dropdown-item">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="tabs">
      <ul>
        <li
          @click="currentSection = index"
          :class="{ 'is-active': currentSection == index }"
          v-for="(item, index) in tabs"
          :key="index"
        >
          <router-link :to="item.path">{{ item.name }}</router-link>
        </li>
      </ul>
    </div>
    <router-view :logged="loggedIn"></router-view>
  </div>
</template>

<script>
//import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  data() {
    return {
      currentSection: -1,
      allTabs: [
        { path: "/definitions", name: "Definition" },
        { path: "/links", name: "Links" },
        { path: "/standards", name: "Standards" },
        { path: "/processes", name: "Processes" },
        { path: "/product", name: "Product" },
        { path: "/guidance", name: "Guidance" },
        { path: "/reporting", name: "Reporting" },
        { name: "Create", path: "/create" },
        { name: "Search", path: "/search" },
        { name: "Your drafts", path: "/drafts" },
      ],
      loggedIn: true,
      showLogout: false,
    };
  },
  computed: {
    tabs() {
      if (this.loggedIn) {
        return this.allTabs;
      } else {
        return this.allTabs.filter(
          (e) => e.name.toLowerCase().search(/your|create/) == -1
        );
      }
    },
  },
  components: {
    //HelloWorld,
  },
};
</script>

<style>
</style>
