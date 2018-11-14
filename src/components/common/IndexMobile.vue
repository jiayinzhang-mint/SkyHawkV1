<template>
    <v-app id="inspire">
        <v-content>
            <router-view @updatetab="updateTab()"></router-view>
        </v-content>
        <v-card>
            <v-bottom-nav fixed app :active.sync="bottomNav" :value="true" color="flat">
                <v-btn flat color="info" value="map" to="/mobile/map">
                    <span>地图</span>
                    <v-icon>map</v-icon>
                </v-btn>

                <v-btn flat color="info" value="company" to="/mobile/company">
                    <span>企业</span>
                    <v-icon>work</v-icon>
                </v-btn>

                <v-btn flat color="info" value="alert" to="/mobile/alert">
                    <span>告警</span>
                    <v-icon>assignment_late</v-icon>
                </v-btn>

                <v-btn flat color="info" value="user" to="/mobile/profile">
                    <span>用户</span>
                    <v-icon>person</v-icon>
                </v-btn>
            </v-bottom-nav>

        </v-card>

    </v-app>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data: () => ({
        bottomNav: "map"
    }),
    methods: {
        updateTab(tab) {
            this.bottomNav = tab;
        }
    },
    computed: {
        ...mapGetters(["userInfo"]),
        currentTab: function() {
            return this.bottomNav;
        }
    },
    mounted() {}
};
</script>

<style>
</style>
