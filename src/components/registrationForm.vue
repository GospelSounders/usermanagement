<template>
  <q-form
    @submit="createUser"
    @reset="onReset"
    class="q-gutter-md text-white"
    ref="userRegistrationForm"
  >
    <q-input
      filled
      v-model="firstName"
      type="text"
      label="first name"
      hint="first name"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please enter your name']"
      @keyup.enter="submit"
    />
    <q-input
      filled
      v-model="lastName"
      type="text"
      label="last name"
      hint="last name"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please enter your name']"
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
        (val) => (val && val.length > 0) || 'Please enter your email address',
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
    <!-- <q-toggle v-model="accept" label="I accept the license and terms" /> -->
    <terms :accept="accept" :main="main" />

    <div>
      <q-btn label="Submit" type="submit" color="primary" />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script>
import terms from "../components/terms.vue";
const axios = require("axios");
const to = require("await-to-js").to;
const sysValues = require("../services/values.json");
const authHelpers = require("../services/authHelpers").default;
import { QSpinnerGears } from "quasar";
export default {
  name: "registrationForm",
  components: { terms },
  props: {},
  async created() {
    authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
    authHelpers.setSettings(sysValues);
    let [err, care] = await to(authHelpers.isLoggedIn());
    if (care) {
      window.location.assign("#/home");
    }
  },
  data() {
    return {
      accept: false,
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      cpassword: "",
      passwordErrorMessage: "",
      users: [],

      //   loggedin: false,
      //   working:false,
      //   email: "",
      //   password: "",
      //   passwordErrorMessage: "",
    };
  },
  methods: {
    changeAccept(value) {
      this.accept = value;
    },
    submit() {
      this.$refs.userRegistrationForm.submit();
    },
    main() {
      return this;
    },
    isValidEmail() {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(this.email) || "Invalid email";
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

      // we simulate some progress here...
      // let percentage = 0;
      const interval = setInterval(() => {
        if (this.working === false) {
          clearInterval(interval);
          dialog.hide();
          //close dialog
        }
        //   percentage = Math.min(100, percentage + Math.floor(Math.random() * 22));

        //   // we update the dialog
        //   dialog.update({
        //     message: `${percentage}%`,
        //   });

        //   // if we are done...
        //   if (percentage === 100) {
        //     clearInterval(interval);

        //     dialog.update({
        //       title: "Done!",
        //       message: `Upload completed successfully`,
        //       progress: false,
        //       ok: true,
        //     });
        //   }
      }, 500);
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
        if (this.accept !== true) {
          this.$q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "You need to accept the license and terms first",
          });
          return resolve(false); // reject
        }
        if (this.password !== this.cpassword) {
          this.cpassword = "";
          this.passwordErrorMessage = "Passwords don't match";
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
          authHelpers.createUser({
            user: this.email,
            firstName:this.firstName,
            lastName:this.lastName,
            password:this.password
          }, true)
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
            message: "Registration successful",
          });
          // console.log(care);
        }
      });
    },

    onReset() {
      this.email = null;
      this.firstName = null;
      this.lastName = null;
      this.password = null;
      this.cpassword = null;
      this.accept = false;
    },
  },
};
</script>
