<template>
  <q-page padding class="">
    <div class="row q-mb-lg">
      <q-input
        v-model="role"
        placeholder="Register New User"
        class="col"
        @keyup.enter="createUser"
      />
      <q-btn color="primary" size="sm" label="Create" @click="createUser" />
    </div>
    <div class="row">
      <q-list bordered highlight class="col">
        <q-item-label header>
          <div class="row">
            Users
            <q-space />
            <q-icon color="primary" name="refresh" side @click="fetchRoles()" />
          </div>
        </q-item-label>
        <q-item v-for="(role, index) in roles" v-bind:key="index">
          <q-item-section avatar>
            <q-icon color="primary" name="security" />
          </q-item-section>
          <q-item-section>{{ role }}</q-item-section>
          <q-item-section side clickable @click="deleteRole(role)">
            <q-icon name="delete" color="red" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
// import terms from "../components/terms.vue";
// import loginForm from "../components/loginForm.vue";

const axios = require("axios");
const to = require("await-to-js").to;
const sysValues = require("../services/values.json");
const authHelpers = require("../services/authHelpers").default;
import { QSpinnerGears } from "quasar";

export default {
  name: "Roles",
  components: {},
  async created() {
    authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
    authHelpers.setSettings(sysValues);
    let [err, care] = await to(authHelpers.isLoggedIn());
    if (err) {
      window.location.assign("#/"); // not logged in
      return
    }
    // [err, care] = await to(this.fetchRoles());
  },
  data() {
    return {
      role: "",
      roles: [],
    };
  },
  methods: {
    alert(msg) {
      alert(msg);
    },
    async createUser() {
      return new Promise(async (resolve, reject) => {
        if (this.role === "") {
          this.$q.notify({
            type: "negative",
            message: "Role cannot be blank",
          });
          return reject("role cannot be blank");
        }
        this.working = true;
        this.showCustom();
        let [err, care] = await to(authHelpers.createUser(this.role));
        this.working = false;
        if (err) {
          this.$q.notify({
            type: "negative",
            message: err.msg || err,
          });
          resolve(false);
        } else {
          console.log(care);
          this.roles = care.roles;
          this.role = "";
        }
      });
    },
    async fetchRoles() {
      return new Promise(async (resolve, reject) => {
        this.working = true;
        this.showCustom();
        let [err, care] = await to(authHelpers.fetchRoles());
        this.working = false;
        if (err) {
          this.$q.notify({ type: "negative", message: err });
          //   return reject(err);
          resolve(false); // reject
        } else {
          this.roles = care.roles;
          resolve(care.roles);
        }
      });
    },
    async deleteRole(role) {
      return new Promise(async (resolve, reject) => {
        let [err, care] = await to(
          this.confirm(`Are you sure you want to delete ${role}`, "Delete Role")
        );
        if (err) {
          return resolve(false); // reject
        }
        this.working = true;
        this.showCustom();
        [err, care] = await to(authHelpers.deleteRole(role));
        this.working = false;
        if (err) {
          console.log(err);
          this.$q.notify({ type: "negative", message: err.msg || err });
          //   return reject(err);
          return resolve(false); // reject
        } else {
          this.roles = care.roles;
          resolve(care.roles);
        }
      });
    },
    async confirm(message, title = "Confirm") {
      return new Promise((resolve, reject) => {
        this.$q
          .dialog({
            title,
            message,
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            return resolve(true);
            // console.log('>>>> OK')
          })
          .onOk(() => {
            return resolve(true);
            // console.log('>>>> second OK catcher')
          })
          .onCancel(() => {
            return reject(true);
            // console.log('>>>> Cancel')
          })
          .onDismiss(() => {
            return reject(true);
            // console.log('I am triggered on both OK and Cancel')
          });
      });
    },
    showCustom(title = "") {
      const dialog = this.$q.dialog({
        title,
        message: "",
        progress: {
          spinner: QSpinnerGears,
          color: "primary",
        },
        persistent: true, // we want the user to not be able to close it
        ok: false, // we want the user to not be able to close it
      });

      const interval = setInterval(() => {
        if (this.working === false) {
          clearInterval(interval);
          dialog.hide();
        }
      }, 500);
    },
  },
};
</script>
