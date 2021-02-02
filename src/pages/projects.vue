<template>
  <q-page padding class="">
    <div class="row q-mb-lg">
      <q-input
        v-model="project"
        placeholder="Create New Project"
        class="col"
        @keyup.enter="createProject"
      />
      <q-btn color="primary" size="sm" label="Create" @click="createProject" />
    </div>
    <div class="row">
      <q-list bordered highlight class="col">
        <q-item-label header>
          <div class="row">
            Projects
            <q-space />
            <q-icon color="primary" name="refresh" side @click="fetchProjects()" />
          </div>
        </q-item-label>
        <q-item v-for="(project, index) in projects" v-bind:key="index">
          <q-item-section avatar>
            <q-icon color="primary" name="security" />
          </q-item-section>
          <q-item-section>{{ project }}</q-item-section>
          <q-item-section side clickable @click="deleteProject(project)">
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
  name: "Projects",
  components: {},
  async created() {
    authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
    authHelpers.setSettings(sysValues);
    let [err, care] = await to(authHelpers.isLoggedIn());
    if (err) {
      window.location.assign("#/"); // not logged in
      return
    }
    [err, care] = await to(this.fetchProjects());
  },
  data() {
    return {
      project: "",
      projects: [],
    };
  },
  methods: {
    alert(msg) {
      alert(msg);
    },
    async createProject() {
      return new Promise(async (resolve, reject) => {
        if (this.project === "") {
          this.$q.notify({
            type: "negative",
            message: "Project cannot be blank",
          });
          return reject("project cannot be blank");
        }
        this.working = true;
        this.showCustom();
        let [err, care] = await to(authHelpers.createProject(this.project));
        this.working = false;
        if (err) {
          this.$q.notify({
            type: "negative",
            message: err.msg || err,
          });
          resolve(false);
        } else {
          console.log(care);
          this.projects = care.projects;
          this.project = "";
        }
      });
    },
    async fetchProjects() {
      return new Promise(async (resolve, reject) => {
        this.working = true;
        this.showCustom();
        let [err, care] = await to(authHelpers.fetchProjects());
        this.working = false;
        if (err) {
          this.$q.notify({ type: "negative", message: err });
          //   return reject(err);
          resolve(false); // reject
        } else {
          this.projects = care.projects;
          resolve(care.projects);
        }
      });
    },
    async deleteProject(project) {
      return new Promise(async (resolve, reject) => {
        let [err, care] = await to(
          this.confirm(`Are you sure you want to delete ${project}`, "Delete Project")
        );
        if (err) {
          return resolve(false); // reject
        }
        this.working = true;
        this.showCustom();
        [err, care] = await to(authHelpers.deleteProject(project));
        this.working = false;
        if (err) {
          console.log(err);
          this.$q.notify({ type: "negative", message: err.msg || err });
          //   return reject(err);
          return resolve(false); // reject
        } else {
          this.projects = care.projects;
          resolve(care.projects);
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
