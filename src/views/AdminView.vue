<template>
  <div>
    <h1 class="title is-4">Admin</h1>
    <div class="columns">
      <aside class="menu column is-2">
        <p class="menu-label">Menu</p>
        <ul class="menu-list">
          <li>
            <a>Your approvals</a>
            <a>User roles</a>
          </li>
        </ul>
      </aside>
      <div class="column is-8">
        <div class="block">
          <h1 class="title is-6">Your Approvals</h1>
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th></th>
                <th>Content</th>
                <th>Requester</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(app, i) in approvals" :key="i">
                <td>
                  <input
                    type="checkbox"
                    class="checkbox"
                    v-model="selections[i]"
                  />
                </td>
                <td>
                  <a>{{ app.content }}</a>
                </td>
                <td>
                  {{ app.requester }}
                </td>
              </tr>
            </tbody>
          </table>
          <button class="button" :class="{ 'is-success': hasSelection }">
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selections: [false, false],
      approvals: [
        { content: "Microwave Oven", requester: "Bob Smith" },
        { content: "Oven", requester: "Alan Citizen" },
      ],
      users: [
        { name: "Bob Smith", role: "Editor" },
        { name: "Jane Doe", role: "Editor" },
        { name: "John Doe", role: "Owner" },
        { name: "Jane Doe", role: "Editor" },
        { name: "User Name", role: "System Administrator" },
      ],
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
};
</script>

<style>
</style>