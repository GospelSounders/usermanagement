<template>
  <q-page padding class="">
    <q-dialog
      v-model="createUserDialog"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card class="bg-secondary text-white">
        <q-card-section class="text-center text-h3">
          <div class="text-subtitle2">Create New User</div>
        </q-card-section>
        <q-separator dark />
        <q-card-section>
          <q-form
            @submit="createUser"
            @reset="onReset"
            class="col q-gutter-md text-white"
            ref="userRegistrationForm"
          >
            <q-input
              filled
              v-model="firstName"
              type="text"
              label="first name"
              hint="first name"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please enter your name',
              ]"
              @keyup.enter="submit"
            />
            <q-input
              filled
              v-model="lastName"
              type="text"
              label="last name"
              hint="last name"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please enter your name',
              ]"
              @keyup.enter="submit"
            />
            <q-input
              filled
              v-model="email"
              type="email"
              label="email"
              hint="email"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please enter your email address',
                (val) => this.isValidEmail() || 'Invalid email address',
              ]"
              @keyup.enter="submit"
            />
            <q-input
              filled
              type="password"
              v-model="password"
              label="Password"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter your password',
              ]"
              :error-message="passwordErrorMessage"
            />
            <q-input
              filled
              type="password"
              v-model="cpassword"
              label="Password"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter your password',
              ]"
              :error-message="passwordErrorMessage"
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
      <q-table
        title="Users"
        dense
        :data="users"
        :columns="columns"
        :filter="filter"
        row-key="index"
        class="col"
        @row-click="selectUser"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <q-icon slot="append" name="search" />
          </q-input>
          <q-btn flat
            ><q-icon color="primary" name="refresh" side @click="fetchUsers()"
          /></q-btn>
          <q-btn flat
            ><q-icon
              color="primary"
              name="add_circle"
              side
              @click="createUserDialog = true"
          /></q-btn>
        </template>
        <!-- <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="firstName" :props="props">
              {{ props.row.firstName }}
              <q-popup-edit v-model="props.row.firstName">
                <q-input v-model="props.row.id" dense autofocus counter />
              </q-popup-edit>
            </q-td>
            <q-td key="lastName" :props="props">{{ props.row.lastName }}</q-td>
            <q-td key="email" :props="props">{{ props.row.email }}</q-td>
          </q-tr>
        </template> -->
      </q-table>
      <!-- <q-list bordered highlight class="col">
                <q-item-label header>
                    <div class="row">
                        Users
                        <q-space />
                        <q-icon color="primary" name="refresh" side @click="fetchUsers()" />
                    </div>
                </q-item-label>
                <q-item v-for="(user, index) in users" v-bind:key="index">
                    <q-item-section avatar>
                        <q-icon color="primary" name="security" />
                    </q-item-section>
                    <q-item-section>{{ user }}</q-item-section>
                    <q-item-section side clickable @click="deleteUser(user)">
                        <q-icon name="delete" color="red" />
                    </q-item-section>
                </q-item>
            </q-list> -->
    </div>

    <q-dialog
      v-model="selectedUser"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">
            {{ selectedFirstName }} {{ selectedLastName }}
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none text-center">
          {{ selectedEmail }}
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-btn label="delete" @click="deleteUser"
            ><q-icon name="delete" color="red"
          /></q-btn>
          <q-btn label="roles" @click="fetchUserRoles"
            ><q-icon name="security" color="primary"
          /></q-btn>
          <q-btn label="projects" @click="fetctUserProjects"
            ><q-icon name="group_work" color="secondary"
          /></q-btn>
          <q-btn label="Edit" @click="showChangeUserNamesDialog"
            ><q-icon name="group_work" color="secondary"
          /></q-btn>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Ok" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="userRolesDialog"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card style="width: 300px">
        <q-card-section>
          <q-table
            title="User Roles"
            dense
            :data="userRoles"
            :columns="userRolesColumns"
            :filter="userRolesFilter"
            row-key="index"
            class="col"
            flat
          >
            <template v-slot:top-right>
              <q-input
                borderless
                dense
                debounce="300"
                v-model="userRolesFilter"
                placeholder="Search"
              >
                <q-icon slot="append" name="search" />
              </q-input>
              <q-btn flat
                ><q-icon
                  color="primary"
                  name="refresh"
                  side
                  @click="fetchUserRoles()"
              /></q-btn>
              <q-btn flat
                ><q-icon
                  color="primary"
                  name="add_circle"
                  side
                  @click="addUserRole"
              /></q-btn>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  dense
                  round
                  flat
                  color="red"
                  @click="deleteUserRole(props.row)"
                  icon="delete"
                ></q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="addRoleDialog"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card style="width: 300px">
        <q-card-section>
          <q-form
            @submit="submitAddUserRole"
            @reset="onResetAddUserRole"
            class="col q-gutter-md text-white"
            ref="newProjectForm"
          >
            <q-select
              clearable
              use-input
              @filter="filterFn"
              filled
              v-model="role"
              :options="roles"
              label="Role"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please select role',
              ]"
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

    <q-dialog
      v-model="changeUserNamesDialog"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card class="items-center text-center bg-white">
        <q-card-section>
          <div class="row">
            <div class="items-left text-left">
              <div class="text-h4">Change Names</div>
              <div>{{ email }}</div>
            </div>
            <q-space />
          </div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="changeuserNames"
            @reset="onResetChangeUserNames"
            ref="changeUserNameForm"
            class="q-gutter-md text-white"
          >
            <q-input
              filled
              v-model="firstName"
              type="text"
              label="First Name"
              hint="First Name"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please enter the first name',
              ]"
              @keyup.enter="submitChangeUserName"
            />
            <q-input
              filled
              v-model="lastName"
              type="text"
              label="Last Name"
              hint="Last Name"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please enter the last name',
              ]"
              @keyup.enter="submitChangeUserName"
            />
            <div class="row">
              <q-space />
              <div class="items-left text-left">
                <q-btn
                  label="Reset"
                  type="reset"
                  color="primary"
                  flat
                  class="q-ml-sm"
                />
                <q-btn
                  label="Save"
                  type="submit"
                  color="green"
                  :disable="userEditted"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
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
const dialogs = require("../services/showDialog").default;

export default {
  name: "Users",
  components: {},
  async created() {
    authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
    authHelpers.setSettings(sysValues);
    let [err, care] = await to(authHelpers.isLoggedIn());
    if (err) {
      window.location.assign("#/"); // not logged in
      return;
    }
    [err, care] = await to(this.fetchUsers());
  },
  data() {
    return {
      changeUserNamesDialog: false,
      email: "",
      firstName: "",
      lastName: "",
      firstNameOriginal: "",
      lastNameOriginal: "",
      password: "",
      cpassword: "",
      passwordErrorMessage: "",
      users: [],
      userRoles: [],
      roles: [],
      roles: [],
      rolesObj: {},
      allRoles: [],
      role: "",
      filter: "",
      userRolesFilter: "",
      selectedUser: false,
      userRolesDialog: false,
      createUserDialog: false,
      addRoleDialog: false,
      userRolesColumns: [
        {
          name: "name",
          required: true,
          label: "Role",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val || ""}`,
          sortable: true,
        },
        { name: "actions", label: "Actions", field: "", align: "center" },
      ],
      columns: [
        {
          name: "firstName",
          required: true,
          label: "First Name",
          align: "left",
          field: (row) => row.firstName,
          format: (val) => `${val || ""}`,
          sortable: true,
        },
        {
          name: "lastName",
          required: true,
          label: "Last Name",
          align: "left",
          field: (row) => row.lastName,
          format: (val) => `${val || ""}`,
          sortable: true,
        },
        {
          name: "email",
          required: true,
          label: "Email",
          align: "left",
          field: (row) => row.email,
          format: (val) => `${val || ""}`,
          sortable: true,
        },
        // { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
        // { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        // { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        // { name: 'protein', label: 'Protein (g)', field: 'protein' },
        // { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      selectedEmail: "",
      selectedId: "",
      selectedFirstName: "",
      selectedLastName: "",
    };
  },
  computed: {
    userEditted() {
      return (
        this.firstName === this.firstNameOriginal &&
        this.lastName === this.lastNameOriginal
      );
    },
  },
  methods: {
    onResetChangeUserNames() {
      this.firstName = this.firstNameOriginal;
      this.lastName = this.lastNameOriginal;
    },
    async showChangeUserNamesDialog() {
      return new Promise(async (resolve, reject) => {
        let dialodId = dialogs.showDialog(this, "Loading User Data", "");
        let [err, care] = await to(
          authHelpers.readSingleUserData(this.selectedId)
        );
        dialogs.emit(dialodId);
        if (err) {
          this.$q.notify({
            type: "negative",
            message: err.msg || err,
          });

          return resolve(false);
        }
        console.log(care)
        this.setUserData(care);
        this.changeUserNamesDialog = true;
      });
    },
    setUserData(care) {
      this.userData = care;
      this.email = care.email;
      this.firstName = care.firstName;
      this.lastName = care.lastName;
      this.firstNameOriginal = care.firstName;
      this.lastNameOriginal = care.lastName;
      this.loaded = true;
      this.lastLogin = new Date(care.additionalInfo.lastLoginTs);
    },
    notUserEditted() {
      return (
        this.firstName === this.firstNameOriginal &&
        this.lastName === this.lastNameOriginal
      );
    },
    async changeuserNames() {
      return new Promise(async (resolve, reject) => {
        if (this.notUserEditted()) {
          return resolve(false); // reject
        }
        let data = this.userData;
        data.firstName = this.firstName;
        data.lastName = this.lastName;
        let dialodId = dialogs.showDialog(this, "Changing User Name", "");
        let [err, care] = await to(authHelpers.saveUserData(data));
        dialogs.emit(dialodId);
        if (err) {
          this.$q.notify({
            type: "negative",
            message: err.msg || err,
          });
          return resolve(false);
        }
        this.setUserData(care);
         resolve(care);
        await to(this.fetchUsers())
        this.changeUserNamesDialog = false;
      });
    },
    submitChangeUserName() {
      this.$refs.changeUserNameForm.submit();
    },
    async deleteUserRole(role) {
      let [err, care] = await to(
        this.confirm(
          `Are you sure you want to remove ${role.name} from ${this.selectedFirstName} ${this.selectedLastName}`,
          "Remove Role"
        )
      );
      if (err) {
        return resolve(false); // reject
      }
      this.working = true;
      this.showCustom();
      [err, care] = await to(
        authHelpers.removeUserRole(this.selectedId, role.id)
      );
      this.working = false;
      if (err) {
        this.$q.notify({
          type: "negative",
          message: err.msg || err,
        });
        resolve(false);
      } else {
        // console.log(care)
        this.addRoleDialog = false;
        this.role = "";
        this.userRoles = care.roles;
      }
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          let existingRoles = this.userRoles.map((item) => item.name);
          this.roles = this.allRoles.filter(
            (item) => !existingRoles.includes(item)
          );
          // this.roles = this.allRoles;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.roles = this.allRoles.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    submit() {
      this.$refs.userRegistrationForm.submit();
    },
    selectUser(evt, row) {
      this.selectedUser = true;
      this.selectedEmail = row.email;
      this.selectedId = typeof row.id === "object" ? row.id.id : row.id;
      this.selectedFirstName = row.firstName;
      this.selectedLastName = row.lastName;
      console.log("clicked on", row);
    },
    isValidEmail() {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(this.email) || "Invalid email";
    },
    onReset() {
      this.email = null;
      this.firstName = null;
      this.lastName = null;
      this.password = null;
      this.cpassword = null;
    },
    onResetAddUserRole() {
      this.role = "";
    },
    async submitAddUserRole() {
      let roleId;
      for (let i in this.rolesObj) {
        if (this.rolesObj[i].name === this.role) {
          roleId = this.rolesObj[i].id;
        }
      }
      this.working = true;
      this.showCustom();
      let [err, care] = await to(
        authHelpers.addUserRole(this.selectedId, roleId)
      );
      this.working = false;
      if (err) {
        this.$q.notify({
          type: "negative",
          message: err.msg || err,
        });
        resolve(false);
      } else {
        // console.log(care)
        this.showCustom();
        [err, care] = await to(authHelpers.fetchUserRoles(this.selectedId));
        this.working = false;
        if (err) {
          console.log(err);
          this.$q.notify({ type: "negative", message: err.msg || err });
          //   return reject(err);
          return resolve(false); // reject
        } else {
          this.addRoleDialog = false;
          this.role = "";
          this.userRoles = care.roles;
        }
      }
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
    alert(msg) {
      alert(msg);
    },
    async createUser() {
      return new Promise(async (resolve, reject) => {
        // if (this.email === "") {
        //   this.$q.notify({
        //     type: "negative",
        //     message: "Email cannot be blank",
        //   });
        //   return reject("email cannot be blank");
        // }
        if (this.password !== this.cpassword) {
          this.cpassword = "";
          this.passwordErrorMessage = "Passwords don't match";
          this.$q.notify({
            type: "negative",
            message: "Passwords don't match",
          });
          return resolve(false); // reject
        }
        this.working = true;
        this.showCustom();
        let [err, care] = await to(
          authHelpers.createUser({
            user: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password,
          })
        );
        this.working = false;
        if (err) {
          this.$q.notify({
            type: "negative",
            message: err.msg || err,
          });
          resolve(false);
        } else {
          this.users.push(care);
          this.$q.notify({
            type: "positive",
            message: "User has been created",
          });
          this.createUserDialog = false;
          this.onReset();
          this.$nextTick(() => {
            this.createUserDialog = true;
          });
          // console.log(care);
        }
      });
    },

    async fetchUsers() {
      return new Promise(async (resolve, reject) => {
        // this.working = true;
        // this.showCustom();

        let dialodId = dialogs.showDialog(this, "Fetching Users", "");
        let [err, care] = await to(authHelpers.fetchUsers());
        dialogs.emit(dialodId);
        
        // this.working = false;
        if (err) {
          this.$q.notify({ type: "negative", message: err });
          //   return reject(err);
          resolve(false); // reject
        } else {
          this.users = care.users;
          resolve(care.users);
        }
      });
    },
    async deleteUser(user) {
      return new Promise(async (resolve, reject) => {
        let [err, care] = await to(
          this.confirm(
            `Are you sure you want to delete ${this.selectedEmail}`,
            "Delete User"
          )
        );
        if (err) {
          return resolve(false); // reject
        }
        this.working = true;
        this.showCustom();
        [err, care] = await to(authHelpers.deleteUser(this.selectedId));
        this.working = false;
        if (err) {
          console.log(err);
          this.$q.notify({ type: "negative", message: err.msg || err });
          //   return reject(err);
          return resolve(false); // reject
        } else {
          this.users = care.users;
          this.selectedUser = false;
          this.$q.notify({
            type: "positive",
            message: `${this.selectedEmail} deleted.`,
          });
          resolve(care.users);
        }
      });
    },
    async addUserRole() {
      if (this.allRoles.length === 0) {
        this.working = true;
        this.showCustom();
        let [err, care] = await to(authHelpers.fetchRoles());
        this.working = false;
        if (err) {
          console.log(err);
          this.$q.notify({ type: "negative", message: err.msg || err });
          //   return reject(err);
          return resolve(false); // reject
        } else {
          this.rolesObj = care.roles;
          let tmp = [];
          for (let i in this.rolesObj) {
            tmp.push(this.rolesObj[i].name);
          }
          this.allRoles = tmp;
          let existingRoles = this.userRoles.map((item) => item.name);
          this.roles = this.allRoles.filter(
            (item) => !existingRoles.includes(item)
          );
          console.log("required filter...");
          console.log(this.userRoles);
          console.log(existingRoles);
          // console.log(existingRoles)
        }
        this.addRoleDialog = true;
      } else {
        this.addRoleDialog = true;
        let [err, care] = await to(authHelpers.fetchRoles());
        this.working = false;
        if (err) {
          return resolve(false); // reject
        } else {
          this.rolesObj = care.roles;
          let tmp = [];
          for (let i in this.rolesObj) {
            tmp.push(this.rolesObj[i].name);
          }
          this.allRoles = tmp;
          // this.roles = this.allRoles;
          let existingRoles = this.userRoles.map((item) => item.name);
          this.roles = this.allRoles.filter(
            (item) => !existingRoles.includes(item)
          );
          console.log(this.allRoles)
          console.log(existingRoles)
          console.log(this.roles)
        }
      }
      // this.working = true;
      // this.showCustom();
      // let [err, care] = await to(authHelpers.fetchUserRoles(this.selectedId));
      // this.working = false;
      // if (err) {
      //   console.log(err);
      //   this.$q.notify({ type: "negative", message: err.msg || err });
      //   //   return reject(err);
      //   return resolve(false); // reject
      // } else {
      //   // console.log(care)
      //   this.userRoles = care.roles;
      //   this.userRolesDialog = true;
      //   // this.selectedUser = false;
      //   // this.$q.notify({ type: "positive", message: `${this.selectedEmail} deleted.` });
      //   // resolve(care.users);
      // }
    },
    async fetchUserRoles() {
      this.working = true;
      this.showCustom();
      let [err, care] = await to(authHelpers.fetchUserRoles(this.selectedId));
      this.working = false;
      if (err) {
        console.log(err);
        this.$q.notify({ type: "negative", message: err.msg || err });
        return resolve(false); // reject
      } else {
        this.userRoles = care.roles;
        this.userRolesDialog = true;
      }
    },
    async fetctUserProjects() {
      this.working = true;
      this.showCustom();
      let [err, care] = await to(authHelpers.fetctUserProjects(this.selectedId));
      this.working = false;
      if (err) {
        console.log(err);
        this.$q.notify({ type: "negative", message: err.msg || err });
        return resolve(false); // reject
      } else {
        console.log(care)
        this.userProjects = care.projects;
        this.userProjectsDialog = true;
      }
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
