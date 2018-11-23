<template>
    <v-container>
        <v-card>
            <v-toolbar flat color="transparent">
                <v-toolbar-title style="font-size:17px">{{companyInfo.brand}}</v-toolbar-title>
            </v-toolbar>
            <v-container fluid grid-list-lg>
                <v-data-iterator style="padding:10px; height:calc(100vh - 160px);overflow :auto" :items="galleryList" :rows-per-page-items="rowsPerPageItems" :pagination.sync="pagination" content-tag="v-layout" row wrap no-data-text="暂无数据">

                    <v-flex slot="item" slot-scope="props" xs12 sm6 md6>
                        <v-card class="elevation-5" color="">
                            <v-img contain :src="props.item.src" lazy-src="/static/assets/lazy.jpg">
                                <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                                    <v-progress-linear indeterminate color="primary" :width="1"></v-progress-linear>
                                </v-layout>
                            </v-img>

                            <div class="hidden viewer-box" v-viewer="{url: 'data-large', navbar: false, movable: false}" style="display:none">
                                <img :data-large="props.item.src">
                            </div>

                            <v-card-actions ref="picture2">
                                <span>{{props.item.time | moment("YYYY-MM-DD HH:mm:ss")}}</span>
                                <v-spacer></v-spacer>
                                <v-btn flat icon slot="activator" class="mr-2" @click="show">
                                    <v-icon>fullscreen</v-icon>
                                </v-btn>

                                <v-btn flat icon slot="activator" @click="alertDialog=true;alertForm.src=props.item.src">
                                    <v-icon>add_alert</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                    <template v-if="galleryList" slot="pageText" slot-scope="props">
                        {{ props.pageStart }} - {{ props.pageStop }} 共 {{ props.itemsLength }} 项
                    </template>
                </v-data-iterator>
            </v-container>

        </v-card>

        <el-dialog title="新建告警" center :visible.sync="alertDialog" width="400px">
            <v-img class="mb-5 elevation-12" style="border-radius:3px" contain :src="alertForm.src" lazy-src="/static/assets/lazy.jpg">
                <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                    <v-progress-linear indeterminate color="grey darken-1" :width="1"></v-progress-linear>
                </v-layout>
            </v-img>
            <el-form label-position="left" :rules="rules" ref="alertForm" :model="alertForm" label-width="90px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="alertForm.title"></el-input>
                </el-form-item>
                <el-form-item label="详情" prop="detail">
                    <el-input v-model="alertForm.detail"></el-input>
                </el-form-item>
                <el-form-item label="处理方">
                    {{station.name}} - {{group.name}}
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <v-btn round flat @click="alertDialog=false">取消</v-btn>
                <v-btn round depressed color="primary" @click="submitAlert('alertForm')">创建</v-btn>

            </span>
        </el-dialog>
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
        page: 1,
        alertForm: {},
        rules: {
            title: [{ required: true, message: "请输入标题", trigger: "blur" }],
            detail: [{ required: true, message: "请输入详情", trigger: "blur" }]
        },
        alertDialog: false
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
                    this.station = this.organizeList[1].children.find(
                        element => {
                            return element.id === this.companyInfo.station;
                        }
                    );
                    // console.log(this.station);
                    this.group = this.station.children.find(element => {
                        return (element.id = this.companyInfo.besupervised);
                    });
                });
        },
        show(e) {
            let event = e || window.event;
            this.$nextTick(() => {
                let target = event.currentTarget || event.target.parentElement,
                    parent =
                        target.parentElement.parentElement.parentElement
                            .parentElement.parentElement;
                //console.log(parent);
                // console.log(parent.querySelector(".viewer-box"));
                let viewer = parent.querySelector(".viewer-box").$viewer;
                viewer.show();
            });
        },
        submitAlert(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    this.alertDialog = false;
                    this.$ajax
                        .post("/alert/list", {
                            token: this.userInfo.token,
                            title: this.alertForm.title,
                            detail: this.alertForm.detail,
                            company: this.companyInfo.id,
                            station: this.station.id,
                            src: this.alertForm.src
                        })
                        .then(data => {
                            data = data.data;
                            if ((data.msg = "success")) {
                                this.$message({
                                    message: "操作成功",
                                    type: "success"
                                });
                            }
                        });
                }
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
