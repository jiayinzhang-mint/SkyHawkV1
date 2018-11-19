<template>
    <v-layout row>
        <v-flex xs12 sm4>
            <v-toolbar flat color="grey darken-3">
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

            <v-list style="height:calc(100vh - 129px);overflow :auto" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.3)" two-line>
                <v-scroll-x-transition group>
                    <template v-for="(item,index) in alertListShow">
                        <div :key="index">
                            <v-list-tile avatar @click="showDetail(item.id)" ripple>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        <v-icon color="red" style="font-size:16px;margin-bottom:2px" v-if="item.state !=5 && item.state!=6  && item.state!=9 ">lens</v-icon> <span class="font-weight-bold">{{item.brand.brand}}</span>
                                    </v-list-tile-title>
                                    <v-list-tile-sub-title class="font-weight-medium body-2">{{item.title}}</v-list-tile-sub-title>
                                    <v-list-tile-sub-title>{{item.create_time | moment("YYYY-MM-DD HH:mm:ss")}}</v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-chip color="info" text-color="white" small v-if="item.auto==0">手动</v-chip>
                                    <v-chip color="green" text-color="white" small v-if="item.auto==1">自动</v-chip>
                                    <v-chip color="warning" text-color="white" small v-if="item.uncertain==1">不确定</v-chip>
                                </v-list-tile-action>
                            </v-list-tile>
                            <v-divider></v-divider>
                        </div>
                    </template>

                </v-scroll-x-transition>
                <v-list-tile>
                    <v-layout justify-center>
                        <v-btn block class="text-xs-center" depressed round :loading="loadAlert" :disabled="loadAlert" dark @click="getMoreAlert">
                            加载更多
                        </v-btn>
                    </v-layout>

                </v-list-tile>
            </v-list>

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
        selectedStation: [],
        loadAlert: false
    }),
    methods: {
        ...mapActions(["getCompanyList", "getAlertList", "restoreAlertPage"]),
        refreshAlertList() {
            this.loading = true;
            // console.log(this.selectedStation);
            this.restoreAlertPage().then(() => {
                this.getAlertList({
                    type: "force",
                    page: 1,
                    stationAlt: this.selectedStation.id
                }).then(() => {
                    this.alertListShow = this.alertList;
                    if (this.userInfo.role <= 1) {
                        this.filter(this.selectedStation.id);
                    }
                    this.loading = false;
                });
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
            // console.log(this.alertListShow);
        },
        reFill() {
            this.alertListShow = this.alertList;
            this.filted = false;
        },
        getMoreAlert() {
            this.loadAlert = true;
            this.getAlertList({
                type: "loadMore",
                page: this.alertPage + 1
            }).then(() => {
                if (this.userInfo.role <= 1) {
                    this.selectedStation = this.stationList.find(element => {
                        return element.id === 10;
                    });
                } else if (this.userInfo.role >= 1 && this.userInfo.role <= 3) {
                    this.selectedStation = this.stationList.find(element => {
                        return element.id === this.userInfo.station;
                    });
                }
                this.filter(this.selectedStation.id);
                this.loadAlert = false;
            });
        }
    },
    computed: {
        ...mapGetters([
            "companyList",
            "alertList",
            "stationList",
            "userInfo",
            "alertPage"
        ])
    },
    mounted() {
        if (this.userInfo.role <= 1) {
            this.selectedStation = this.stationList.find(element => {
                return element.id === 10;
            });
            this.getAlertList({
                type: "standard",
                page: 1
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
                stationAlt: this.userInfo.station
            }).then(() => {
                this.alertListShow = this.alertList;
                // this.filter(this.userInfo.station);
                this.loading = false;
            });
        } else {
            this.getAlertList({
                type: "standard",
                page: 1
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
