<template>
  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md text-white">
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
    <div>
      <q-btn label="Submit" type="submit" color="primary" />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script>
const axios = require("axios");
const to = require("await-to-js").to;
const sysValues = require("../services/values.json");
const authHelpers = require("../services/authHelpers").default;
console.log('+++++++++++++++++++++++++')
console.log(authHelpers)
import { QSpinnerGears } from 'quasar'
export default {
  name: "loginForm",
  props: {},
  async created() {
    authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
    let [err, care] = await to (authHelpers.isLoggedIn());
    if(care){
      window.location.assign("#/home")
    }
  },
  data() {
    return {
      loggedin: false,
      working:false,
      email: "",
      password: "",
      passwordErrorMessage: "",
    };
  },
  methods: {
    isValidEmail() {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(this.email) || "Invalid email";
    },
    showCustom(title="") {
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
        if(this.working === false){
          clearInterval(interval);
           dialog.hide()
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
    async onSubmit() {
      authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
      const TBURL = sysValues["TB_URL"];
      let params = {
        username: this.email,
        password: this.password,
      };
      this.working = true
      this.showCustom();
      let [err, care] = await to(authHelpers.login(params));
      this.working = false;
      if (err) {

        this.loggedin = false;
        this.$q.notify({ type: "negative", message: "failed to log in" });
        this.password = "";
        this.passwordErrorMessage = "wrong email/password";
        return;
      }
      authHelpers.setToken(care);
      // resolve(this.setToken(care.data));
      // redirect to logged in page...
      this.$q.notify({ type: "positive", message: "log in successful" });
      window.location.assign("#/home")

      // console.log(sysValues)
      // // console.log(this.accept)
      // return
      // if (this.accept !== true) {
      //   this.$q.notify({
      //     color: "red-5",
      //     textColor: "white",
      //     icon: "warning",
      //     message: "You need to accept the license and terms first",
      //   });
      // } else {
      //   this.$q.notify({
      //     color: "green-4",
      //     textColor: "white",
      //     icon: "cloud_done",
      //     message: "Submitted",
      //   });
      // }
    },

    onReset() {
      this.email = null;
      this.password = null;
    },
  },
};
</script>
