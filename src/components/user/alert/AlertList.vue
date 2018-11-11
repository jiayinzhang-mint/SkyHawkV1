<template>
    <v-layout row>
        <v-flex xs12 sm4 style="background:white">
            <v-toolbar flat color="white">
                <v-toolbar-title style="font-size:17px">告警流转</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items v-if="userInfo.role <=1">

                    <v-menu bottom left>
                        <v-btn slot="activator" flat>
                            {{selectedStation.name}} <v-icon>keyboard_arrow_down</v-icon>
                        </v-btn>
                        <v-list style="height:375px ;overflow :auto">
                            <v-list-tile v-for="(item, i) in stationList" :key="i" @click="filter(item.id)">
                                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>

                </v-toolbar-items>

                <v-btn icon @click="refreshAlertList">
                    <v-icon>refresh</v-icon>
                </v-btn>

            </v-toolbar>
            <v-divider></v-divider>
            <v-scroll-x-transition>
                <v-list style="height:calc(100vh - 129px);overflow :auto" v-loading="loading" two-line>
                    <template v-for="(item,index) in alertListShow">
                        <v-list-tile :key="index" avatar @click="showDetail(item.id)" ripple>
                            <v-list-tile-avatar size="40px">
                                <vue-initials-img :name="item.title" />
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    <v-icon color="red" style="font-size:16px;margin-bottom:2px" v-if="item.state !=5 && item.state!=6">lens</v-icon> {{item.title}}
                                </v-list-tile-title>
                                <v-list-tile-sub-title>{{item.brand.brand}}</v-list-tile-sub-title>
                                <v-list-tile-sub-title>{{item.create_time | moment("YYYY-MM-DD HH:mm:ss")}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-chip color="info" text-color="white" small v-if="item.auto==0">手动</v-chip>
                                <v-chip color="green" text-color="white" small v-if="item.auto==1">自动</v-chip>
                                <v-chip color="warning" text-color="white" small v-if="item.uncertain==1">不确定</v-chip>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider :key="item.create_time"></v-divider>
                    </template>

                </v-list>
            </v-scroll-x-transition>
        </v-flex>
        <v-flex sm8>
            <router-view @updatealertlist='refreshAlertList' v-if="this.$route.params.id"></router-view>
            <v-container v-else fluid fill-height>
                <v-layout align-center justify-center>
                    <div class="headline font-weight-light">请选择告警</div>
                </v-layout>
            </v-container>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
    data: () => ({
        loading: true,
        alertListShow: [],
        page: 1,
        filted: false,
        selectedStation: []
    }),
    methods: {
        ...mapActions(["getCompanyList", "getAlertList"]),
        refreshAlertList() {
            this.loading = true;
            // console.log(this.selectedStation);
            this.getAlertList({
                type: "force",
                page: 1,
                stationAlt: this.selectedStation
            }).then(() => {
                this.alertListShow = this.alertList;
                if (this.userInfo.role <= 1) {
                    this.filter(this.selectedStation.id);
                }
                this.loading = false;
            });
        },
        showDetail(id) {
            this.$router.push({ path: "/alert/" + id });
        },
        filter(id) {
            this.filted = true;
            this.selectedStation = this.stationList.find(element => {
                return element.id === id;
            });
            // console.log(this.selectedStation.id);
            this.alertListShow = [];
            this.alertList.forEach(element => {
                if (element.brand.station == id) {
                    this.alertListShow.push(element);
                }
            });
        },
        reFill() {
            this.alertListShow = this.alertList;
            this.filted = false;
        }
    },
    computed: {
        ...mapGetters(["companyList", "alertList", "stationList", "userInfo"])
    },
    mounted() {
        if (this.userInfo.role <= 1) {
            this.selectedStation = this.stationList.find(element => {
                return element.id === 10;
            });
            this.getAlertList({
                type: "standard",
                page: 1,
                // stationAlt: this.selectedStation
            }).then(() => {
                this.alertListShow = this.alertList;
                this.filter(10);
                this.loading = false;
            });
        } else if (this.userInfo.role >= 1 && this.userInfo.role <= 3) {
            this.selectedStation = this.stationList.find(element => {
                return element.id === this.userInfo.station;
            });
            // console.log(this.selectedStation.id);
            this.getAlertList({
                type: "standard",
                page: 1,
                stationAlt: this.selectedStation
            }).then(() => {
                this.alertListShow = this.alertList;
                // this.filter(this.userInfo.station);
                this.loading = false;
            });
        } else {
            this.getAlertList({
                type: "standard",
                page: 1,
            }).then(() => {
                this.alertListShow = this.alertList;
                // this.filter(this.userInfo.station);
                this.loading = false;
            });
        }
    }
};
</script>

<style>
</style>
