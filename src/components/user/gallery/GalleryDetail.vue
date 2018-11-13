<template>
    <v-container>
        <v-card>
            <v-toolbar flat color="white">
                <v-toolbar-title style="font-size:17px">{{companyInfo.brand}}</v-toolbar-title>
            </v-toolbar>

            <v-data-iterator  :items="galleryList" :rows-per-page-items="rowsPerPageItems" :pagination.sync="pagination" content-tag="v-layout" row wrap no-data-text="暂无数据">

                <v-flex slot="item" slot-scope="props" xs12 sm6 md6 style="padding:10px; height:calc(100vh - 210px);overflow :auto">
                    <v-card>
                        <v-img contain :src="props.item.src" lazy-src="/static/assets/lazy.jpg">
                            <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                                <v-progress-linear indeterminate color="grey darken-1" :width="1"></v-progress-linear>
                            </v-layout>
                        </v-img>

                        <div class="hidden viewer-box" v-viewer="{url: 'data-large', navbar: false, movable: false}" style="display:none">
                            <img :data-large="props.item.src" alt="">
                        </div>

                        <v-card-actions ref="picture2">
                            <span>{{props.item.time | moment("YYYY-MM-DD HH:mm:ss")}}</span>
                            <v-spacer></v-spacer>
                            <v-btn flat icon slot="activator" class="mr-2" @click="show">
                                <v-icon>fullscreen</v-icon>
                            </v-btn>

                            <v-btn flat icon slot="activator" @click="">
                                <v-icon>add_alert</v-icon>
                            </v-btn>

                        </v-card-actions>
                    </v-card>
                </v-flex>
                <template slot="pageText" slot-scope="props">
                    {{ props.pageStart }} - {{ props.pageStop }} 共 {{ props.itemsLength }} 项
                </template>
            </v-data-iterator>

        </v-card>
    </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data: () => ({
        companyInfo: [],
        loading: true,
        companySupervisor: [],
        station: [],
        group: [],
        rowsPerPageItems: [4],
        pagination: {
            rowsPerPage: 4
        },
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
            },
            {
                text: "状态",
                value: "phone",
                align: "center",
                sortable: false
            }
        ],
        galleryList: [],
        page: 1
    }),
    methods: {
        getGalleryList() {
            this.$ajax
                .get("/gallery/list", {
                    params: {
                        token: this.userInfo.token,
                        company: this.$route.params.id,
                        page: this.page
                    }
                })
                .then(data => {
                    data = data.data;
                    this.galleryList = data.galleryList;
                    this.loading = false;
                });
        },
        getCompanyInfo() {
            this.$ajax
                .get("/company/detail", {
                    params: {
                        token: this.userInfo.token,
                        id: this.$route.params.id
                    }
                })
                .then(data => {
                    this.companyInfo = data.data.companyDetail;
                    this.loading = false;
                });
        },
        show(e) {
            let event = e || window.event;
            this.$nextTick(() => {
                let target = event.currentTarget || event.target.parentElement,
                    parent =
                        target.parentElement.parentElement.parentElement
                            .parentElement.parentElement;
                console.log(parent);
                // console.log(parent.querySelector(".viewer-box"));
                let viewer = parent.querySelector(".viewer-box").$viewer;
                viewer.show();
            });
        }
    },
    mounted() {
        this.getGalleryList();
        this.getCompanyInfo();
    },
    computed: {
        ...mapGetters([
            "userInfo",
            "organizeList",
            "stationList",
            "companyList"
        ])
    },
    beforeRouteUpdate(to, from, next) {
        next();
        this.getGalleryList();
        this.getCompanyInfo();
    }
};
</script>

<style>
</style>
