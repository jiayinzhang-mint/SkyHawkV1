<template>
    <div>
        <v-card v-loading="loading">
            <v-toolbar flat color="white">
                <v-btn icon @click="goBack">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
                <v-toolbar-title style="font-size:17px; margin-left:5px">{{companyInfo.brand}}</v-toolbar-title>
            </v-toolbar>
            <v-tabs v-model="tab" color="white" centered>
                <v-tabs-slider></v-tabs-slider>
                <v-tab key="1">
                    基本信息
                </v-tab>
                <v-tab key="2">
                    监管人员
                </v-tab>
                <v-tab key="3">
                    告警历史
                </v-tab>
            </v-tabs>
            <v-divider></v-divider>

            <v-tabs-items v-model="tab" style="height:calc(100vh - 160px);overflow :auto">
                <v-tab-item key="1">

                    <div id="markermap" style="width: 100%;height: 400px;z-index:1!important;"></div>

                    <v-list>
                        <v-subheader>企业信息</v-subheader>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon color="primary">assignment_ind</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{companyInfo.name}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-divider inset></v-divider>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon color="primary">location_on</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{companyInfo.address}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-divider inset></v-divider>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon color="primary">person</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{companyInfo.legalperson}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-divider inset></v-divider>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon color="primary">group</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{station.name}} - {{group.name}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-divider inset></v-divider>

                        <v-subheader>营业执照</v-subheader>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon color="primary">assignment</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{companyInfo.license}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-subheader>执照到期时间</v-subheader>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon color="primary">av_timer</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{companyInfo.validity}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-tab-item>
                <v-tab-item key="2">
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex v-for="(item,i) in companySupervisor" :key="i" xs6 md4>
                                <v-card>
                                    <v-img class="elevation-4 mb-1" style="border-radius:3px" contain :src="item.avatar" lazy-src="/static/assets/lazy.jpg">
                                        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                                            <v-progress-linear indeterminate color="primary" :width="1"></v-progress-linear>
                                        </v-layout>
                                    </v-img>
                                    <v-card-actions>
                                        <h4>{{item.name}}</h4>
                                        <v-spacer></v-spacer>
                                        <h4>{{item.index}}</h4>
                                    </v-card-actions>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-tab-item>
                <v-tab-item key="3">
                    <v-data-table :headers="headers" :items="alertListShow" hide-actions no-data-text="暂无数据">
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-center">{{ props.item.title }}</td>
                            <td class="text-xs-center">{{ props.item.create_time | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        </template>
                    </v-data-table>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data: () => ({
        companyInfo: [],
        loading: true,
        tab: 0,
        companySupervisor: [],
        station: [],
        group: [],
        alertListShow: [],
        headers: [
            {
                text: "标题",
                align: "center",
                sortable: false,
                value: "username"
            },
            {
                text: "时间",
                align: "center",
                sortable: false,
                value: "name"
            }
        ]
    }),
    methods: {
        goBack() {
            this.$router.push({ path: "/mobile/company" });
        },
        getCompanyInfo() {
            this.loading = true;
            this.$ajax
                .get("/company/detail", {
                    params: {
                        token: this.userInfo.token,
                        id: this.$route.params.id
                    }
                })
                .then(data => {
                    this.companyInfo = data.data.companyDetail;
                    // console.log(this.companyInfo);
                    this.loading = false;
                    const map = new AMap.Map("markermap", {
                        resizeEnable: true,
                        zoom: 40,
                        center: [121.476657, 31.252857],
                        mapStyle:
                            "amap://styles/4c8496281f84dd2bdcf87b425e77844a"
                    });
                    const marker = new AMap.CircleMarker({
                        map: map,
                        center: this.companyInfo.location.split(","),
                        radius: 8,
                        strokeColor: "white",
                        strokeWeight: 2,
                        strokeOpacity: 0.8,
                        fillColor: "#1E88E5",
                        fillOpacity: 0.8,
                        zIndex: 10,
                        cursor: "pointer",
                        clickable: true
                    });
                    marker.setMap(map);
                    map.setFitView();
                    this.station = this.organizeList[1].children.find(
                        element => {
                            return element.id === this.companyInfo.station;
                        }
                    );
                    this.group = this.station.children.find(element => {
                        return (element.id = this.companyInfo.besupervised);
                    });
                });
        },
        getSupervisor() {
            this.$ajax
                .get("/company/supervise", {
                    params: {
                        token: this.userInfo.token,
                        id: this.$route.params.id
                    }
                })
                .then(data => {
                    data = data.data;
                    // console.log(data);
                    this.companySupervisor = data.companySupervisor;
                });
        },
        getAlertList() {
            this.alertListShow = [];
            this.alertList.forEach(element => {
                if (element.company == this.$route.params.id) {
                    this.alertListShow.push(element);
                }
            });
        }
    },
    mounted() {
        this.$emit("updatetab", "company");
        this.getCompanyInfo();
        this.getSupervisor();
        this.getAlertList();
    },
    computed: {
        ...mapGetters(["userInfo", "organizeList", "stationList", "alertList"])
    },
    beforeRouteUpdate(to, from, next) {
        next();
        this.getCompanyInfo();
        this.getSupervisor();
        this.getAlertList();
        this.tab = 0;
    }
};
</script>

<style>
</style>
