<template>
    <q-page padding class="bg-secondary">
        <!-- <iframe src="https://raw.githubusercontent.com/GospelSounders/usermanagement/master/README.md"/> -->
    
        <Applications/>
    
        <q-markdown v-if="helpText !== ''">
            Home page... {{helpText}}
        </q-markdown>
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

import Applications from './applications.vue'
export default {
    name: "Help",
    components: { Applications, },
    computed: {
        cardContainerClass() {
            if (this.$q.screen.gt.xs) {
                return 'grid-masonry grid-masonry--' + (this.$q.screen.gt.sm ? '3' : '2')
            }

            return void 0
        },

        rowsPerPageOptions() {
            return [0]
            if (this.$q.screen.gt.xs) {
                return this.$q.screen.gt.sm ? [3, 6, 9] : [3, 6]
            }

            return [3]
        }
    },
    async created() {
        authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
        authHelpers.setSettings(sysValues);
        let [err, care] = await to(authHelpers.isLoggedIn());
        if (err) {
            window.location.assign("#/"); // not logged in
            return
        };
        [err, care] = await to(axios.get("https://raw.githubusercontent.com/GospelSounders/usermanagement/master/README.md"));
        if (care) {
            this.helpText = care.data
        }
        console.log(this.helpText)
    },
    data() {
        return {
            helpText: ''
        };
    },
    methods: {

    },
};
</script>
