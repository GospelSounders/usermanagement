<template>
    <q-layout view="hHh Lpr lFf">
        <q-header elevated>
            <q-toolbar color="red">
                <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
                <q-toolbar-title> GS Publications </q-toolbar-title>
                <div>Access Control</div>
            </q-toolbar>
        </q-header>
    
        <q-drawer v-model="leftDrawerOpen" overlay bordered :breakpoint="500" persist content-class="bg-primary text-white">
            <q-list>
                <!-- <q-expansion-item group="somegroup" icon="people" label="Users">
                    <q-card class="bg-primary">
                        <q-card-section>
                            <q-list>
                                <q-item tag="a" class="bg-primary">
                                    <q-item-section avatar>
                                        <q-icon name="list" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label> List</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item tag="a">
                                    <q-item-section avatar>
                                        <q-icon name="person_add" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label> Add</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item tag="a">
                                    <q-item-section avatar>
                                        <q-icon name="person_remove" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label> Remove</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item> -->
                <q-item tag="a" href="#/home">
                    <q-item-section avatar>
                        <q-icon name="home" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Home</q-item-label>
                        <!-- <q-item-label caption>
                                        caption
                                    </q-item-label> -->
                    </q-item-section>
                </q-item>
                <q-expansion-item group="somegroup" icon="people" label="Users" clickable tag="a" href="#/users">
                    <q-card class="bg-primary">
                        <q-card-section>
                            <q-list>
                                <q-item tag="a" href="#/users">
                                    <q-item-section avatar>
                                        <q-icon name="security" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label> Users</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>
    
                <q-separator />
    
                <!-- <q-expansion-item group="somegroup" icon="group_work" label="Projects">
                    <q-card class="bg-primary">
                        <q-card-section>
                            <q-list>
                                <q-item tag="a" class="bg-primary">
                                    <q-item-section avatar>
                                        <q-icon name="list" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label> List</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item tag="a">
                                    <q-item-section avatar>
                                        <q-icon name="add_circle" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label> Add</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item tag="a">
                                    <q-item-section avatar>
                                        <q-icon name="remove_circle" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label> Remove</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item> -->
    
                 <q-expansion-item group="somegroup" icon="group_work" label="Projects" clickable tag="a" href="#/projects">
                    <q-card class="bg-primary">
                        <q-card-section>
                            <q-list>
                                <q-item tag="a" href="#/projects">
                                    <q-item-section avatar>
                                        <q-icon name="group_work" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label> Projects</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>
                <q-expansion-item group="somegroup" icon="apps" label="Applications" clickable tag="a" href="#/applications">
                    <q-card class="bg-primary">
                        <q-card-section>
                            <q-list>
                                <q-item tag="a" href="#/applications">
                                    <q-item-section avatar>
                                        <q-icon name="apps" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label> Applications</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>
    

                <q-separator />
    
                <q-expansion-item group="somegroup" icon="security" label="Roles" clickable tag="a" href="#/roles">
                    <q-card class="bg-primary">
                        <q-card-section>
                            <q-list>
                                <q-item tag="a" href="#/roles">
                                    <q-item-section avatar>
                                        <q-icon name="security" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label> Roles</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>
    
                <q-separator />
                <q-item tag="a" href="#/notifications">
                    <q-item-section avatar>
                        <q-icon name="notifications_none" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Notifications</q-item-label>
                        <!-- <q-item-label caption>
                                        caption
                                    </q-item-label> -->
                    </q-item-section>
                </q-item>
    
                <!-- <q-expansion-item group="somegroup" icon="person" label="Profile">
                    <q-card class="bg-primary">
                        <q-card-section>
                            <q-list>
                                <q-item tag="a" class="bg-primary">
                                    <q-item-section avatar>
                                        <q-icon name="list" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label> Change Username</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item tag="a">
                                    <q-item-section avatar>
                                        <q-icon name="add_circle" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label> Change Password</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item tag="a">
                                    <q-item-section avatar>
                                        <q-icon name="remove_circle" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label> Delete Account</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item> -->
                <q-item tag="a" href="#/profile">
                    <q-item-section avatar>
                        <q-icon name="person" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Profile</q-item-label>
                        <!-- <q-item-label caption>
                                        caption
                                    </q-item-label> -->
                    </q-item-section>
                </q-item>
    
                <q-item tag="a" href="#/auditLogs">
                    <q-item-section avatar>
                        <q-icon name="history" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label> Audit Logs</q-item-label>
                        <!-- <q-item-label caption>
                                        caption
                                    </q-item-label> -->
                    </q-item-section>
                </q-item>
                <q-item clickable @click="logout">
                    <q-item-section avatar>
                        <q-icon name="logout" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label> Log out</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item clickable tag="a" href="#/help" >
                    <q-item-section avatar>
                        <q-icon name="help" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label> Help</q-item-label>
                    </q-item-section>
                </q-item>
    
                <!-- <q-item-label header class="text-grey-8" color="secondary">
                                Essential Links
                            </q-item-label> -->
                <!-- <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" /> -->
            </q-list>
        </q-drawer>
    
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [{
        title: 'Docs',
        caption: 'quasar.dev',
        icon: 'school',
        link: 'https://quasar.dev'
    },
    {
        title: 'Github',
        caption: 'github.com/quasarframework',
        icon: 'code',
        link: 'https://github.com/quasarframework'
    },
    {
        title: 'Discord Chat Channel',
        caption: 'chat.quasar.dev',
        icon: 'chat',
        link: 'https://chat.quasar.dev'
    },
    {
        title: 'Forum',
        caption: 'forum.quasar.dev',
        icon: 'record_voice_over',
        link: 'https://forum.quasar.dev'
    },
    {
        title: 'Twitter',
        caption: '@quasarframework',
        icon: 'rss_feed',
        link: 'https://twitter.quasar.dev'
    },
    {
        title: 'Facebook',
        caption: '@QuasarFramework',
        icon: 'public',
        link: 'https://facebook.quasar.dev'
    },
    {
        title: 'Quasar Awesome',
        caption: 'Community Quasar projects',
        icon: 'favorite',
        link: 'https://awesome.quasar.dev'
    }
];

const axios = require("axios");
const to = require("await-to-js").to;
const sysValues = require("../services/values.json");
const authHelpers = require("../services/authHelpers").default;
import { QSpinnerGears } from 'quasar'

export default {
    name: 'MainLayout',
    components: { EssentialLink },
    data() {
        return {
            leftDrawerOpen: false,
            essentialLinks: linksData
        }
    },
    async created() {
        authHelpers.setSettings({ TBURL: sysValues["TB_URL"] });
        let [err, care] = await to(authHelpers.isLoggedIn());
        if (err) {
            window.location.assign("#/")
        }
    },
    methods: {
        logout() {
            authHelpers.logout()
            window.location.assign("#/");
        }
    }
}
</script>
