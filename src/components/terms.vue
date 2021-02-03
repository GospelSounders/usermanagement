<template>
  <div>
    <q-toggle v-model="localAccept" color="secondary" @input="toggled" />I
    accept the
    <a
      @click="showTerms"
      clickable
      class="text-underline text-italic"
      style="text-decoration: underline; cursor: pointer"
      >terms and conditions</a
    >

    <q-dialog
    v-if="termsText !== ''"
      v-model="termsDialog"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card>
        <!-- <q-card-section>
          <div class="text-h6">Terms and conditions</div>
        </q-card-section> -->

        <q-card-section class="q-pt-none">
          <q-markdown v-if="termsText !== ''">
            {{ termsText }}
          </q-markdown>
        </q-card-section>

        <q-card-actions align="right">
          <!-- <q-btn flat label="Decline" color="primary" v-close-popup /> -->
          <!-- <q-btn flat label="Accept" color="primary" v-close-popup /> -->
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Ok" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
const axios = require("axios");
const to = require("await-to-js").to;
import { QSpinnerGears } from "quasar";

export default {
  name: "terms",
  props: {
    accept: Boolean,
    main: Function,
  },
  created() {
    // console.log(this.main())
    this.myParent = this.main();
    this.localAccept = this.accept;
    // let value = false;
    // setInterval(() => {
    //   this.localAccept = this.accept;
    //   value = !value;
    //   console.log(value);
    //   this.myParent.changeAccept(value);
    // }, 2000);
  },
  data() {
    return {
      localAccept: false,
      myParent: null,
      termsText: "",
      termsDialog: false,
    };
  },
  methods: {
    async showTerms() {
      this.termsDialog = true;
      this.working = true;
        this.showCustom();
      let [err, care] = await to(
        axios.get(
          "https://raw.githubusercontent.com/GospelSounders/usermanagement/master/terms.md"
        )
      );
      this.working = false;
      if (care) this.termsText = care.data;
    },
    toggled(value) {
      this.$nextTick(function () {
        // that.parentMounted = true
        this.myParent.changeAccept(value);
      });
      //    console.log({valued: this.myParent.accept})
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
