<template>
  <q-page padding class="">
    <q-dialog
      v-model="createApplicationDialog"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card class="bg-secondary text-white">
        <q-card-section class="text-center text-h3">
          <div class="text-subtitle2">Create New Application</div>
        </q-card-section>
        <q-separator dark />
        <q-card-section>
          <q-form
            @submit="createApplication"
            @reset="onReset"
            class="col q-gutter-md text-white"
            ref="newApplicationForm"
          >
            <q-input
              filled
              v-model="application"
              :disable="dialogFor==='edit'"
              type="text"
              label="Application Name"
              hint="Application Name"
              @input="repoNameFromApplication"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please enter application name',
              ]"
              @keyup.enter="submit"
            />
            <q-input
              v-model="application"
              disable
              filled
              autogrow
              type="text"
              label="Description"
              hint="Description"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Please enter a description of the application',
              ]"
              @keyup.enter="submit"
            />
            <q-input
              filled
              v-model="icon"
              type="text"
              label="Icon"
              hint="Material Icon"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please enter application icon name',
              ]"
              @keyup.enter="submit"
            >
            <template v-slot:prepend>
              <q-icon :name="icon"/>
            </template>
            <template v-slot:after>
              <!-- <q-btn round color="primary"><q-icon name="help"/></q-btn> -->
              <q-btn round color="primary" @click="openLink(settings.MATERIALICONS,'_blank');"><q-icon name="help"/>
              <q-tooltip>
          Get icon name from list of icons
        </q-tooltip>
              </q-btn>
              <!-- <a :href="settings.MATERIALICONS">?</a> -->
            </template>

            
            
            </q-input>
            <q-input
              filled
              v-model="link"
              type="text"
              label="Application Url"
              hint="Application Url"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please enter application url',
              ]"
              @keyup.enter="submit"
            />
            <div class="col">
              <q-btn :label="dialogFor==='create'?'Create':'Edit'" type="submit" color="primary" />
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

    
  <q-table
      grid
      :card-container-class="cardContainerClass"
      :data="applications"
      :columns="columns"
      title="Applications"
      row-key="name"
      :filter="filter"
      hide-bottom
      :rows-per-page-options="rowsPerPageOptions"
    >
    <template v-slot:top-right>
       
            <q-btn flat>
              <q-icon
                color="primary"
                name="refresh"
                side
                @click="fetchApplications()"
            /></q-btn>
            <q-btn flat>
              <q-icon
                color="primary"
                name="add_circle"
                side
                @click="createApplicationDialog = true;dialogFor = 'create'"
            /></q-btn>
         <q-space />
        <q-input dense debounce="300" v-model="filter" placeholder="Search">
          <q-icon slot="append" name="search" />
        </q-input>
      </template>
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card class="bg-white">
            <q-card-section class="text-left text-h6">
             <div> <span><strong>{{ props.row.name }}</strong></span>  <span class="float-right"> 
               <q-btn disable
            @click="createApplicationDialog = true;dialogFor = 'edit';selectRow(props.row)"
          >
            <q-icon name="edit" color="green" />
          </q-btn>
          <q-btn
            @click="deleteApplication(props.row.name)"
          >
            <q-icon name="delete" color="red" />
          </q-btn>
               </span> </div> 
            </q-card-section>
            <q-card-section class="flex flex-center">
              <q-card
                v-ripple
                class="bg-primary cursor-pointer q-hoverable"
                style="width: 80vw"
                @click="selectApplication(props.row.link)"
              >
                <q-card-section class="text-center">
                  <q-icon
                    :name="props.row.icon"
                    style="font-size: 6em"
                    color="white"
                  />
                </q-card-section>
                <q-card-section class="flex flex-center text-white">
                  <div>{{ props.row.description}}</div>
                </q-card-section>
              </q-card>
            </q-card-section>
          </q-card>
        </div>
      </template></q-table>
      
    <div class="row">
      <!-- <q-list bordered highlight class="col">
        <q-item-label header>
          <div class="row">
            Applications
            <q-space />
            <q-btn flat>
              <q-icon
                color="primary"
                name="refresh"
                side
                @click="fetchApplications()"
            /></q-btn>
            <q-btn flat>
              <q-icon
                color="primary"
                name="add_circle"
                side
                @click="createApplicationDialog = true"
            /></q-btn>
          </div>
        </q-item-label>
        <q-item v-for="(application, index) in applications" v-bind:key="index">
          <q-item-section avatar>
            <q-icon color="primary" name="security" />
          </q-item-section>
          <q-item-section>{{ application }}</q-item-section>
          <q-item-section
            side
            clickable
            @click="deleteApplication(application)"
          >
            <q-icon name="delete" color="red" />
          </q-item-section>
        </q-item>
      </q-list> -->
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
  name: "Applications",
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
    [err, care] = await to(this.fetchApplications());
  },
  beforeDestroy() {
    events.removeListener("error", this.loadList);
  },
  data() {
    return {
      settings,
      filter:"",
      application: "",
      description: "",
      link: "",
      icon: "apps",
      applications: [],
      columns: [
        { name: "name", label: "Name", field: "name" },
        { name: "description", label: "Description", field: "description" },
        { name: "icon", label: "Icon", field: "icon" },
      ],
      createApplicationDialog: false,
      dialogFor:"create",
      applications: [],
      allApplications: [],
      application: "",
    };
  },
  methods: {
    selectRow(row){
      this.application = row.name
      this.link = row.link
      this.icon = row.icon
      this.description = row.description
    },
    openLink(url, blank){
      authHelpers.openLink(url, blank=false)
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.applications = this.allApplications;

          // with Quasar v1.7.4+
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.applications = this.allApplications.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    onReset() {
      this.application = "";
      this.description = "";
      this.link = "";
      this.icon = "apps";
    },
    submit() {
      this.$refs.newApplicationForm.submit();
    },
    alert(msg) {
      alert(msg);
    },
    async createApplication() {
      return new Promise(async (resolve, reject) => {
        if (this.application === "") {
          this.$q.notify({
            type: "negative",
            message: "Application cannot be blank",
          });
          return reject("application cannot be blank");
        }
        this.working = true;
        this.showCustom("creating application");
        let action = this.dialogFor==='create'?'create':'edit';
        let [err, care] = await to(
          authHelpers.createApplication({application:this.application, description: this.application, icon:this.icon, link:this.link}, action)
        );
        this.working = false;
        if (err) {
          this.$q.notify({
            type: "negative",
            message: err.msg || err,
          });
          return resolve(false);
        } else {
          this.applications = care.applications;
          this.onReset();
          this.createApplicationDialog = false
          this.$nextTick(()=>{this.createApplicationDialog = true})
          // 
          // this.application = "";
        }
      });
    },
    async fetchApplications() {
      return new Promise(async (resolve, reject) => {
        this.working = true;
        this.showCustom("fetching applications");
        let [err, care] = await to(authHelpers.fetchApplications());
        this.working = false;
        if (err) {
          this.$q.notify({ type: "negative", message: err });
          //   return reject(err);
          resolve(false); // reject
        } else {
          this.applications = care.applications;
          resolve(care.applications);
        }
      });
    },
    async deleteApplication(application) {
      return new Promise(async (resolve, reject) => {
        let [err, care] = await to(
          this.confirm(
            `Are you sure you want to delete ${application}`,
            "Delete Application"
          )
        );
        if (err) {
          return resolve(false); // reject
        }
        this.working = true;
        this.showCustom("deleting application");
        [err, care] = await to(authHelpers.deleteApplication(application));
        this.working = false;
        if (err) {
          this.$q.notify({ type: "negative", message: err.msg || err });
          //   return reject(err);
          return resolve(false); // reject
        } else {
          this.applications = care.applications;
          resolve(care.applications);
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
          })
          .onOk(() => {
            return resolve(true);
          })
          .onCancel(() => {
            return reject(true);
          })
          .onDismiss(() => {
            return reject(true);
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
        tmp.push(item);
        // tmp.push({
        //   name: item.name || "anon",
        //   icon: item.icon || "help",
        //   link: item.link || "https://www.gospelsounders.org",
        //   description: item.description || "No description give",
        // });
      }
      // this.list = [...tmp];
      this.allApplications = [...tmp];
      this.applications = [...this.allApplications];
      // this.applications = list;
    },
    repoNameFromApplication(value) {
      this.repoNameFromApplication(value);
    },
    repoNameFromApplication(value) {
      this.repo = `${(this.application || "")
        .toLowerCase()
        .replace(".", "-")
        .replace(" ", "-")}.${(this.application || "")
        .toLowerCase()
        .replace(".", "-")
        .replace(" ", "-")}.gsp`;
    },
    selectApplication(url) {
      window.location.assign(url);
    },
  },
  computed: {
    cardContainerClass () {
      if (this.$q.screen.gt.xs) {
        return 'grid-masonry grid-masonry--' + (this.$q.screen.gt.sm ? '3' : '2')
      }

      return void 0
    },

    rowsPerPageOptions () {
      return [0]
      if (this.$q.screen.gt.xs) {
        return this.$q.screen.gt.sm ? [ 3, 6, 9 ] : [ 3, 6 ]
      }

      return [ 3 ]
    }
  },
};
</script>
