<template>
  <q-page padding class="">
    <q-dialog
      v-model="createProjectDialog"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card class="bg-secondary text-white">
        <q-card-section class="text-center text-h3">
          <div class="text-subtitle2">Create New Project</div>
        </q-card-section>
        <q-separator dark />
        <q-card-section>
          <q-form
            @submit="createProject"
            @reset="onReset"
            class="col q-gutter-md text-white"
            ref="newProjectForm"
          >
            <q-input
              filled
              v-model="project"
              type="text"
              label="Project Name"
              hint="Project Name"
              @input="repoNameFromProject"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please enter project name',
              ]"
              @keyup.enter="submit"
            />
            <q-select @input="repoNameFromApplication" clearable use-input @filter="filterFn" filled v-model="application" :options="applications" label="Application" 
            lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please select application',
              ]"
            />
            <q-input
            disable
              filled
              v-model="repo"
              type="text"
              label="Repo"
              hint="Repo"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please project name',
              ]"
              @keyup.enter="submit"
            />
            <div class="col">
          <q-btn label="Create" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="row">
      <q-list bordered highlight class="col">
        <q-item-label header>
          <div class="row">
            Projects
            <q-space />
            <q-btn flat>
              <q-icon
                color="primary"
                name="refresh"
                side
                @click="fetchProjects()"
            /></q-btn>
            <q-btn flat>
              <q-icon
                color="primary"
                name="add_circle"
                side
                @click="createProjectDialog = true"
            /></q-btn>
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
const settings = sysValues;
const authHelpers = require("../services/authHelpers").default;
import { QSpinnerGears } from "quasar";
const { Octokit } = require("@octokit/rest");

const _events = require("../services/EventEmitter").default;
const events = new _events();

export default {
  name: "Projects",
  components: {},
  async created() {
    events.on("error", this.loadList);
    // await loadList();
    events.emit("error");
    authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
    authHelpers.setSettings(sysValues);
    let [err, care] = await to(authHelpers.isLoggedIn());
    if (err) {
      window.location.assign("#/"); // not logged in
      return;
    }
    [err, care] = await to(this.fetchProjects());
  },
  beforeDestroy() {
    events.removeListener("error", this.loadList);
  },
  data() {
    return {
      project: "",
      repo: "",
      projects: [],
      createProjectDialog: false,
      applications: [],
      allApplications: [],
      application: ''
    };
  },
  methods: {
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.applications = this.allApplications

          // with Quasar v1.7.4+
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.applications = this.allApplications.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    onReset() {
      this.application = '';
      this.project = '';
    },
    submit() {
      this.$refs.newProjectForm.submit();
    },
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
        this.showCustom('creating project');
        let [err, care] = await to(authHelpers.createProject(this.project, this.application, this.repo));
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
        this.showCustom('fetching projects');
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
          this.confirm(
            `Are you sure you want to delete ${project}`,
            "Delete Project"
          )
        );
        if (err) {
          return resolve(false); // reject
        }
        this.working = true;
        this.showCustom('deleting project');
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
    showCustom(title = "", message = "", counter = 0) {
      const dialog = this.$q.dialog({
        title,
        message,
        progress: {
          spinner: QSpinnerGears,
          color: "primary",
        },
        persistent: true, // we want the user to not be able to close it
        ok: false, // we want the user to not be able to close it
      });
      let secsElapsed = counter;
      dialog.update({
        message: `${secsElapsed} secs`,
      });
      let interval, updateSecs;
      const closeDialog = () => {
        clearInterval(interval);
        clearInterval(updateSecs);
        dialog.hide();
      };
      updateSecs = setInterval(() => {
        if (counter > 0) {
          secsElapsed--;
          if (secsElapsed === 0) {
            closeDialog();
          }
        } else {
          secsElapsed++;
        }
        dialog.update({
          message: `${secsElapsed} secs`,
        });
      }, 1000);
      interval = setInterval(() => {
        if (this.working === false) {
          closeDialog();
        }
      }, 500);
    },
    async loadList() {
      return new Promise(async (resolve, reject) => {
        this.working = true;
        this.showCustom("Loading");
        let proxyUrl = settings.CORS_PROXY;
        let url = settings.LISTURL;
        const octokit = new Octokit({});
        let urlParts = settings.LISTURL.split("/").reverse();
        let path = urlParts[0];
        let repo = urlParts[2];
        let owner = urlParts[3];
        let [err, care] = await to(
          octokit.request(`GET /repos/${owner}/${repo}/contents/${path}`, {
            owner,
            repo,
            path,
          })
        );
        this.working = false;
        if (err) {
          this.working = true;
          this.showCustom("Error. Going to refresh.", "", 5);
          setTimeout(() => {
            this.working = false;
            events.emit("error");
          }, 5000);
        } else {
          this.listLoaded(JSON.parse(atob(care.data.content)));
        }
      });
    },
    listLoaded(list) {
      let tmp = [];
      for (let i in list) {
        let item = list[i];
        tmp.push(i);
        // tmp.push({
        //   name: item.name || "anon",
        //   icon: item.icon || "help",
        //   link: item.link || "https://www.gospelsounders.org",
        //   description: item.description || "No description give",
        // });
      }
      // this.list = [...tmp];
      this.allApplications = [...tmp]
      this.applications = [... this.allApplications]
    },
    repoNameFromProject(value){
      this.repoNameFromApplication(value)
    },
    repoNameFromApplication(value){
      this.repo = `${(this.project||'').toLowerCase().replace('.','-').replace(' ', '-')}.${(this.application||'').toLowerCase().replace('.','-').replace(' ', '-')}.gsp`
    }
  },
};
</script>
