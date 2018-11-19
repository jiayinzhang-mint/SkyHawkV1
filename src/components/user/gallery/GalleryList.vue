<template>
    <v-layout row>
        <v-flex xs12 sm4>
            <v-toolbar color="grey darken-3" flat>
                <v-toolbar-title style="font-size:17px">定时抓拍</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-chip v-if="filted && userInfo.role<=1" close @input="reFill">{{selectedStation.name}}</v-chip>
                <v-toolbar-items>
                    <v-menu bottom left v-if="userInfo.role<=1">
                        <v-btn slot="activator" icon>
                            <v-icon>sort</v-icon>
                        </v-btn>
                        <v-list style="height:375px ;overflow :auto">
                            <v-list-tile v-for="(item, i) in stationList" :key="i" @click="filter(item.id)">
                                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>

                </v-toolbar-items>

            </v-toolbar>
            <v-divider></v-divider>
            <v-list style="height:calc(100vh - 129px);overflow :auto" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.3)">
                <v-scroll-x-transition group>
                    <template v-for="(item,index) in companyListShow">
                        <v-list-tile :key="index" avatar @click="showDetail(item.id)" ripple>
                            <v-list-tile-avatar>
                                <vue-initials-img :name="item.brand" />
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="item.brand"></v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-scroll-x-transition>
            </v-list>
        </v-flex>
        <v-flex sm8>
            <router-view v-if="this.$route.params.id"></router-view>
            <v-container v-else fluid fill-height>
                <v-layout align-center justify-center>
                    <div class="headline font-weight-light">请选择企业</div>
                </v-layout>
            </v-container>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
    data: () => ({
        loading: true,
        companyListShow: [],
        filted: false,
        selectedStation: []
    }),
    methods: {
        ...mapActions(["getCompanyList"]),
        showDetail(id) {
            this.$router.push({ path: "/gallery/" + id });
        },
        filter(id) {
            this.filted = true;
            this.selectedStation = this.stationList.find(element => {
                return element.id === id;
            });
            this.companyListShow = [];
            this.companyList.forEach(element => {
                if (element.station == id) {
                    this.companyListShow.push(element);
                }
            });
        },
        reFill() {
            this.companyListShow = this.companyList;
            this.filted = false;
        }
    },
    computed: {
        ...mapGetters(["companyList", "stationList", "userInfo"])
    },
    mounted() {
        this.loading = true;
        this.getCompanyList();
        this.companyListShow = this.companyList;
        if (this.userInfo.role > 1) {
            this.filter(this.userInfo.station);
        }
        this.loading = false;
    }
};
</script>

<style>
</style>
