<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>

/**
 * change theme colours
 * reference: https://quasar.dev/style/color-palette
 * Colour Schemes: https://docs.google.com/document/d/1fvmKyY1yueev2ilCXUX5GTq9b11ChthRWBJlU_fxSAc/edit
 */
document.body.style.setProperty('--q-color-primary', '#4D321E')
document.body.style.setProperty('--q-color-secondary', '#A87A4E')
// import { colors } from 'quasar'

// colors.getBrand('primary') // '#33F'
// alert(colors.getBrand('primary'))
export default {
  name: 'App'
}
</script>
