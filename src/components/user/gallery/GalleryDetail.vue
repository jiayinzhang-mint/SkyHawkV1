<template>
    <v-container>
        <v-card v-loading="loading">
            <v-toolbar flat color="white">
                <v-toolbar-title style="font-size:17px">{{companyInfo.brand}}</v-toolbar-title>
            </v-toolbar>
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
            },
            {
                text: "状态",
                value: "phone",
                align: "center",
                sortable: false
            }
        ],
        galleryList: [],
        companyInfo: []
    }),
    methods: {
        getGalleryList() {
            this.$ajax
                .get("/gallery/list", {
                    params: {
                        token: this.userInfo.token,
                        company: this.$route.params.id
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
