<template>
  <q-toggle
    v-model="localAccept"
    color="secondary"
    label="I accept the license and terms"
    @input="toggled"
  />
</template>

<script>
export default {
  name: "terms",
  props: {
    accept: Boolean,
    main: Function,
  },
  created() {
    // console.log(this.main())
    this.myParent = this.main();
    this.localAccept = this.accept
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
    };
  },
  methods: {
    toggled(value) {
      this.$nextTick( function(){
            // that.parentMounted = true
            this.myParent.changeAccept(value);
        })
    //    console.log({valued: this.myParent.accept})
    },
  },
};
</script>
