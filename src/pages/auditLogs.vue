<template>
  <q-page padding class="flex flex-center">
      <q-card class="items-center text-center">
            <q-card-section>
                <q-spinner-gears color="cyan" size="2.5em" />
            </q-card-section>
            <q-card-section>
                Coming in Version 2
            </q-card-section>
        </q-card>
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
  name: "Help",
  components: {},
  async created() {
    authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
    authHelpers.setSettings(sysValues);
    let [err, care] = await to(authHelpers.isLoggedIn());
    if (err) {
      window.location.assign("#/"); // not logged in
      return
    }
  },
  data() {
    return {
    };
  },
  methods: {
    
  },
};
</script>
