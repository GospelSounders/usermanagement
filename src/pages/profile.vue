<template>
  <q-page padding class="flex flex-center">
    <q-card v-if="loaded" class="items-center text-center bg-white">
      <q-card-section>
        <div class="row">
          <div class="items-left text-left">
            <div class="text-h4">Profile</div>
            <div>{{ email }}</div>
          </div>
          <q-space />
          <div class="items-left text-left text-weight-thin">
            <div>Last Login</div>
            <div>{{ lastLogin }}</div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-form
          @submit="changeuserNames"
          @reset="onReset"
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
                (val && val.length > 0) || 'Please enter your first name',
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
              (val) => (val && val.length > 0) || 'Please enter your last name',
            ]"
            @keyup.enter="submitChangeUserName"
          />
          <!-- <div>
                                                <q-btn label="Submit" type="submit" color="primary" />
                                                <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                                            </div> -->
          <div class="row">
            <div class="items-left text-left">
              <q-btn
                label="Change Password"
                color="primary"
                @click="changePasswordDialog = true"
              />
            </div>
          </div>
          <div class="row">
            <div class="items-left text-left">
              <q-btn
                label="Delete Account"
                color="red"
                @click="deleteAccount"
              />
            </div>
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

    <q-dialog
      v-model="changePasswordDialog"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card>
        <q-card-section class="bg-secondary text-white text-h5 text-center">
          Change Password
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="changePassword"
            @reset="onResetChangePassword"
            ref="changePasswordForm"
            class="q-gutter-md text-white"
          >
            <q-input
              filled
              v-model="currentPassword"
              type="password"
              label="Current Password"
              hint="Current Password"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Please enter your current pasword',
              ]"
              @keyup.enter="submitChangePassword"
            />
            <q-input
              filled
              v-model="newPassword"
              type="password"
              label="New Password"
              hint="New Password"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please enter your new pasword',
              ]"
              @keyup.enter="submitChangePassword"
            />
            <q-input
              filled
              v-model="newPasswordAgain"
              type="password"
              label="Confirm New Password"
              hint="Confirm New Password"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please confirm your new pasword',
              ]"
              @keyup.enter="submitChangePassword"
              :error-message="confirmPasswordError"
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
                <q-btn label="Change Password" type="submit" color="green" />
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
const dialogs = require("../services/showDialog").default;
import { QSpinnerGears } from "quasar";

export default {
  name: "Profile",
  components: {},
  async created() {
    let dialodId = dialogs.showDialog(this, "Checking Auth", "");
    authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
    authHelpers.setSettings(sysValues);
    let [err, care] = await to(authHelpers.isLoggedIn());
    dialogs.emit(dialodId);
    if (err) {
      window.location.assign("#/"); // not logged in
      return;
    }
    this.profilePath = sysValues["TB_URL"].replace("/api", "") + "/profile";
    dialodId = dialogs.showDialog(this, "Checking Auth", "");
    [err, care] = await to(authHelpers.readUserData());
    dialogs.emit(dialodId);
    if (err) {
      window.location.assign("#/"); // not logged in
      return;
    }
    // console.log(care);
    this.setUserData(care);

    // dialogs.showDialog(this, "Checking Auth", "")
  },
  data() {
    return {
      profilePath: "",
      userData: {},
      email: "",
      firstName: "",
      lastName: "",
      firstNameOriginal: "",
      lastNameOriginal: "",
      currentPassword: "",
      newPassword: "",
      newPasswordAgain: "",
      loaded: false,
      changePasswordDialog: false,
      lastLogin: "",
      confirmPasswordError: "",
    };
  },
  methods: {
    onReset() {
      this.firstName = this.firstNameOriginal;
      this.lastName = this.lastNameOriginal;
    },
    onResetChangePassword() {
      this.currentPassword = "";
      this.newPassword = "";
      this.newPasswordAgain = "";
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
    async changeuserNames() {
      return new Promise(async (resolve, reject) => {
        if (this.notUserEditted()) {
          return resolve(false); // reject
        }
        let data = this.userData;
        data.firstName = this.firstName;
        data.lastName = this.lastName;
        let dialodId = dialogs.showDialog(this, "Checking Auth", "");
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
      });
    },
    async changePassword() {
      return new Promise(async (resolve, reject) => {
        if (this.newPassword !== this.newPasswordAgain) {
          this.newPasswordAgain = "";
          this.confirmPasswordError = `Passwords don't match`;
          return resolve(false); // reject
        }
        let data = {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
        };
        let dialodId = dialogs.showDialog(this, "Changing Password", "");
        let [err, care] = await to(authHelpers.changePassword(data));
        dialogs.emit(dialodId);
        if (err) {
          this.$q.notify({
            type: "negative",
            message: err.msg || err.response.data.message || err.message || err,
          });
          return resolve(false);
        }
        this.$q.notify({
          type: "positive",
          message: "Password changed.",
        });
        this.changePasswordDialog = false;
        resolve(care);
      });
    },
    async deleteAccount() {
      return new Promise(async (resolve, reject) => {
        let [err, care] = await to(
          dialogs.confirm(
            this,
            `Are you sure you want to delete your account`,
            "Delete Account"
          )
        );
        if (err) {
          return resolve(false); // reject
        }
        console.log(this.userData);
        console.log("prceed to delete");
        let dialodId = dialogs.showDialog(this, "Checking Auth", "");
        [err, care] = await to(authHelpers.deleteUser(this.userData.id.id, true));
        dialogs.emit(dialodId)
        if (err) {
          this.$q.notify({
            type: "negative",
            message: err.msg || err,
          });
          return resolve(false);
        }
        this.$q.notify({
            type: "positive",
            message: "Your account has been deleted",
          });
      });
    },
    submitChangeUserName() {
      this.$refs.changeUserNameForm.submit();
    },
    submitChangePassword() {
      this.$refs.changePasswordForm.submit();
    },
    notUserEditted() {
      return (
        this.firstName === this.firstNameOriginal &&
        this.lastName === this.lastNameOriginal
      );
    },
  },
  computed: {
    userEditted() {
      return (
        this.firstName === this.firstNameOriginal &&
        this.lastName === this.lastNameOriginal
      );
    },
  },
};
</script>
