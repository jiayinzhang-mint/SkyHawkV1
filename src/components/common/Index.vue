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
                <v-list v-if="userInfo.role==0">
                    <template v-for="(item, i) in menuManage">
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

        <v-toolbar color="white" app fixed>
            <v-btn icon class="hidden-md-and-down" @click="goBack" v-if="drawer">
                <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-side-icon class="hidden-lg-and-up" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title class="">
                <span class="hidden-sm-and-down">SkyHawk - 静安区</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <el-tooltip class="item" effect="dark" content="设置" placement="bottom">
                <v-btn icon>
                    <v-icon>settings</v-icon>
                </v-btn>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="帮助" placement="bottom">
                <v-btn icon>
                    <v-icon>help_outline</v-icon>
                </v-btn>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="注销" placement="bottom">
                <v-btn icon @click="logOut">
                    <v-icon>exit_to_app</v-icon>
                </v-btn>
            </el-tooltip>
        </v-toolbar>

        <v-content>

            <router-view></router-view>

        </v-content>

    </v-app>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
    data: () => ({
        drawer: true,
        menuManage: [
            { heading: "管理" },
            {
                icon: "business",
                text: "企业管理",
                route: "/manage/company"
            },
            {
                icon: "people",
                text: "组织管理",
                route: "/manage/organize"
            }
        ],
        menuCommon: [
            { heading: "通用" },
            {
                icon: "map",
                text: "地图视图",
                route: "/map"
            },
            {
                icon: "alarm",
                text: "告警流转",
                route: "/alert"
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
                route: "/organize"
            }
        ]
    }),
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        logOut() {
            this.$confirm("确认注销吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$router.push({ path: "/" });
                })
                .catch(() => {});
        }
    },
    computed: {
        ...mapGetters(["userInfo"])
    }
};
</script>

<style>
</style>
