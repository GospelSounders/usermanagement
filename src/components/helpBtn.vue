<template>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn round color="primary" icon="help" @click="showHelp"/>
    </q-page-sticky>
</template>

<script>
export default {
    name: 'helpBtn',
    methods: {
        showHelp: function() {
            this.$q.notify({message: 'still developing'})
        },
    }
}
</script>
