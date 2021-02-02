<template>
  <q-page class="flex flex-center bg-primary">
    <q-card dark bordered class="bg-secondary text-white my-card">
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
        <q-form
          v-if="tab === 'register'"
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md text-white"
        >
          <q-input
            filled
            v-model="name"
            label="Your name *"
            hint="Name and surname"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            filled
            type="number"
            v-model="age"
            label="Your age *"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Please type your age',
              (val) => (val > 0 && val < 100) || 'Please type a real age',
            ]"
          />

          <!-- <q-toggle v-model="accept" label="I accept the license and terms" /> -->
          <terms :accept="accept" :main="main"/>

          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
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

export default {
  name: "PageIndex",
  components: { terms , loginForm},
  data() {
    return {
      tab: "login",
      name: null,
      age: null,

      accept: false,
    };
  },
  methods: {
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
