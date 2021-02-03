<template>
  <q-page padding class="">
    <div class="row q-mb-lg">
      <!-- <q-input
                        v-model="user"
                        placeholder="Register New User"
                        class="col"
                        @keyup.enter="submit"
                      />
                      <q-btn color="primary" size="sm" label="Create" @click="createUser" /> -->
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
        (val) => (val !== null && val !== '') || 'Please enter your password',
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
        (val) => (val !== null && val !== '') || 'Please enter your password',
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
    </div>
    <div class="row">
      <q-table
        title="Users"
        dense
        :data="users"
        :columns="columns"
        :filter="filter"
        row-key="index"
        class="col"
        @row-click="onRowClick"
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
          <q-btn flat><q-icon color="primary" name="refresh" side @click="fetchUsers()" /></q-btn>
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
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      cpassword: "",
      passwordErrorMessage: "",
      users: [],
      filter: "",
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
    };
  },
  methods: {
    submit(){
      this.$refs.userRegistrationForm.submit();
    },
    onRowClick(evt, row) {
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
         this.cpassword = ""
          this.passwordErrorMessage = "Passwords don't match"
           this.$q.notify({
            type: "negative",
            message: "Passwords don't match",
          });
          // return reject("Passwords don't match");
          return resolve(false); // reject
        }
        this.working = true;
        this.showCustom();
        let [err, care] = await to(
          authHelpers.createUser(this.email, this.firstName, this.lastName)
        );
        this.working = false;
        if (err) {
          this.$q.notify({
            type: "negative",
            message: err.msg || err,
          });
          resolve(false);
        } else {
          this.users.push(care)
          // console.log(care);
        }
      });
    },

    async fetchUsers() {
      return new Promise(async (resolve, reject) => {
        this.working = true;
        this.showCustom();
        let [err, care] = await to(authHelpers.fetchUsers());
        this.working = false;
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
          this.confirm(`Are you sure you want to delete ${user}`, "Delete User")
        );
        if (err) {
          return resolve(false); // reject
        }
        this.working = true;
        this.showCustom();
        [err, care] = await to(authHelpers.deleteUser(user));
        this.working = false;
        if (err) {
          console.log(err);
          this.$q.notify({ type: "negative", message: err.msg || err });
          //   return reject(err);
          return resolve(false); // reject
        } else {
          this.users = care.users;
          resolve(care.users);
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
