<template>
  <q-page class="flex flex-center bg-primary">
    <q-card dark bordered class="bg-secondary text-white my-card" v-if="!loggedIn">
      <q-card-section class="text-center">
        <div class="text-h6">Gospel Sounders Publications</div>
        <div class="text-subtitle2">User Management</div>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section>
        <q-tabs
          v-model="tab"
          inline-label
          class="bg-secondary text-white shadow-2"
        >
          <q-tab name="login" icon="login" label="Log in" />
          <q-tab name="register" icon="create" label="Register" />
        </q-tabs>
        <loginForm v-if="tab==='login'"/>
        <registrationForm v-if="tab==='register'"/>
        
      </q-card-section>
    </q-card>

    <!-- <img
          alt="Quasar logo"
          src="~assets/GOSPEL-SOUNDERS-03.svg"
        > -->
  </q-page>
</template>

<script>
import terms from "../components/terms.vue";
import loginForm from "../components/loginForm.vue";
import registrationForm from "../components/registrationForm.vue";
import { QSpinnerGears } from 'quasar'

const axios = require("axios");
const to = require("await-to-js").to;
const sysValues = require("../services/values.json");
const authHelpers = require("../services/authHelpers").default;

export default {
  name: "PageIndex",
  components: { terms , loginForm, registrationForm},
  async created(){
    authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
    this.working=true;
    this.showCustom();
    let [err, care] = await to (authHelpers.isLoggedIn());
    this.working = false
    if(care){
      window.location.assign("#/home")
    }else{
      this.loggedIn = false
    }
  },
  data() {
    return {
      tab: "login",
      name: null,
      age: null,
      loggedIn:true,
      accept: false,
      working:false
    };
  },
  methods: {
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
      }, 500);
    },
    main(){
      return this;
    },
    changeAccept(value) {
      this.accept = value;
    },
    onSubmit() {
      // alert('submitting....')
      // alert(this.accept);
      console.log(this.accept)
      if (this.accept !== true) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "You need to accept the license and terms first",
        });
      } else {
        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Submitted",
        });
      }
    },

    onReset() {
      this.name = null;
      this.age = null;
      this.accept = false;
    },
  },
};
</script>
