<template>
    <v-app id="inspire">
        <v-navigation-drawer fixed app v-model="drawer">
            <v-list class="pt-3">
                <v-list-tile avatar class="pb-2">
                    <v-list-tile-avatar>
                        <v-avatar size="40px">
                            <vue-initials-img :name="userInfo.username" />
                        </v-avatar>
                    </v-list-tile-avatar>

                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title class="title" v-html="userInfo.username"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="userInfo.name"></v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list>
                    <template v-for="(item, i) in menuCommon">
                        <v-layout v-if="item.heading" :key="i" row align-center>
                            <v-subheader v-if="item.heading">
                                {{ item.heading }}
                            </v-subheader>
                        </v-layout>
                        <v-divider v-else-if="item.divider" :key="i" dark class="my-3"></v-divider>
                        <v-list-tile v-else :key="i" :to="item.route" ripple>
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ item.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar color="primary" dark app fixed flat>
            <v-btn icon class="hidden-md-and-down" @click="goBack" v-if="drawer">
                <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-side-icon class="hidden-lg-and-up" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title style="width: 500px" class="">
                <span class="hidden-sm-and-down">SkyHawk - 静安区</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>settings</v-icon>
            </v-btn>

            <v-btn icon>
                <v-icon>help_outline</v-icon>
            </v-btn>

            <v-btn icon>
                <v-icon>exit_to_app</v-icon>
            </v-btn>
        </v-toolbar>

        <v-content>

            <router-view></router-view>

        </v-content>

    </v-app>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
    data: () => ({
        drawer: true,
        menuCommon: [
            { heading: "通用" },
            {
                icon: "map",
                text: "地图视图",
                route: "/dashboard/manage/funddata"
            },
            {
                icon: "alarm",
                text: "告警流转",
                route: "/dashboard/manage/location"
            },
            {
                icon: "camera",
                text: "定时抓拍",
                route: "/gallery"
            },
            {
                icon: "business",
                text: "企业列表",
                route: "/company"
            },
            {
                icon: "people",
                text: "组织信息",
                route: "/dashboard/manage/department"
            }
        ]
    }),
    methods: {
        goBack() {
            this.$router.go(-1);
        }
    },
    computed: {
        ...mapGetters(["userInfo"])
    },
    mounted() {}
};
</script>

<style>
</style>
