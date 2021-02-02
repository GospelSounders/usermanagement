<template>
    <q-page class="flex flex-center bg-primary">
        Add Roles
    </q-page>
</template>

<script>
// import terms from "../components/terms.vue";
// import loginForm from "../components/loginForm.vue";


const axios = require("axios");
const to = require("await-to-js").to;
const sysValues = require("../services/values.json");
const authHelpers = require("../services/authHelpers").default;
import { QSpinnerGears } from 'quasar'

export default {
    name: "addRoles",
    components: {},
    async created() {
        authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
        authHelpers.setSettings(sysValues);
        let [err, care] = await to(authHelpers.isLoggedIn());
        if (err) {
            window.location.assign("#/") // not logged in
        }
        await this.test();
    },
    data() {
        return {
            
        };
    },
    methods: {
        async test(){
            // await to(authHelpers.sendSaveTeletry({"type":"roles", "action":"create", "role":"editor"})) 
        }
    },
};
</script>
