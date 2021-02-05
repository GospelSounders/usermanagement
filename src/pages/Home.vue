<template>
  <q-page padding class="bg-secondary">
    <!-- <iframe src="https://raw.githubusercontent.com/GospelSounders/usermanagement/master/README.md"/> -->

<q-table
      grid
      :card-container-class="cardContainerClass"
      :data="data"
      :columns="columns"
      row-key="name"
      hide-header
      hide-bottom
    >

      <template v-slot:item="props" >
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card class="bg-white">
            <q-card-section class="text-left text-h6">
              <strong>{{ props.row.name }}</strong>
            </q-card-section>
            <q-card-section class="flex flex-center">

              <q-card class="bg-primary" style="width:80vw">
            <q-card-section class="text-center">
              <q-icon name="help" style="font-size: 6em;" color="white"/>
            </q-card-section>
            <q-card-section class="flex flex-center">
              <div>{{ props.row.calories }} g</div>
            </q-card-section>
          </q-card>


            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>

    <q-markdown v-if="helpText !== ''">
      Home page...
{{helpText}}
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



const deserts = [
  'Frozen Yogurt',
  'Ice cream sandwich',
  'Eclair',
  'Cupcake',
  'Gingerbread',
  'Jelly bean',
  'Lollipop',
  'Honeycomb',
  'Donut',
  'KitKat'
]
const data = []

deserts.forEach(name => {
  for (let i = 0; i < 24; i++) {
    data.push({ name: name + ' (' + i + ')', calories: 20 + Math.ceil(50 * Math.random()) })
  }
})

data.sort(() => (-1 + Math.floor(3 * Math.random())))



export default {
  name: "Help",
  components: {},
  computed: {
    cardContainerClass () {
      if (this.$q.screen.gt.xs) {
        return 'grid-masonry grid-masonry--' + (this.$q.screen.gt.sm ? '3' : '2')
      }

      return void 0
    },

    rowsPerPageOptions () {
      if (this.$q.screen.gt.xs) {
        return this.$q.screen.gt.sm ? [ 3, 6, 9 ] : [ 3, 6 ]
      }

      return [ 3 ]
    }
  },
  async created() {
    authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
    authHelpers.setSettings(sysValues);
    let [err, care] = await to(authHelpers.isLoggedIn());
    if (err) {
      window.location.assign("#/"); // not logged in
      return
    }
    ;[err, care] = await to(axios.get("https://raw.githubusercontent.com/GospelSounders/usermanagement/master/README.md"));
    if(care){
        this.helpText = care.data
    }
    console.log(this.helpText)
  },
  data() {
    return {
        helpText: '',
        columns: [
        { name: 'name', label: 'Name', field: 'name' },
        { name: 'calories', label: 'Calories (g)', field: 'calories' }
      ],
      data
    };
  },
  methods: {
    
  },
};
</script>
