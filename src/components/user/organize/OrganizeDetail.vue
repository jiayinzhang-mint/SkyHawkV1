<template>
    <v-container style="height:calc(100vh - 129px);overflow :auto">
        <v-card v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.3)">
            <v-toolbar flat color="transparent">
                <v-toolbar-title style="font-size:17px">{{organizeInfo.name}}</v-toolbar-title>
            </v-toolbar>
            <v-data-table :headers="headers" :items="userList" hide-actions no-data-text="暂无数据">
                <template slot="items" slot-scope="props">
                    <td class="text-xs-center">{{ props.item.name }}</td>
                    <td class="text-xs-center">{{ props.item.index }}</td>
                    <td class="text-xs-center">{{ props.item.phone }}</td>
                    <td class="text-xs-center">
                        <v-btn color="primary" round flat @click="showDetail(props.item)">详情</v-btn>
                    </td>

                </template>
            </v-data-table>
            <el-dialog :title="currentUser.name" :visible.sync="userInfoDialog" width="400px">
                <v-img class="mb-5 elevation-12" style="border-radius:3px" contain :src="currentUser.avatar" lazy-src="/static/assets/lazy.jpg">
                    <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                        <v-progress-linear indeterminate color="grey darken-1" :width="1"></v-progress-linear>
                    </v-layout>
                </v-img>
                <v-list two-line>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon color="primary">contacts</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{currentUser.index}}</v-list-tile-title>
                            <v-list-tile-sub-title>工号</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </el-dialog>

        </v-card>
    </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data: () => ({
        organizeInfo: [],
        userList: [],
        currentUser: [],
        loading: true,
        userInfoDialog: false,
        headers: [
            {
                text: "姓名",
                align: "center",
                sortable: false,
                value: "name"
            },
            {
                text: "工号",
                value: "index",
                align: "center",
                sortable: false
            },
            {
                text: "移动电话",
                value: "phone",
                align: "center",
                sortable: false
            },
            {
                text: "操作",
                align: "center",
                sortable: false
            }
        ]
    }),
    methods: {
        getOrganizeInfo() {
            this.loading = true;
            this.$ajax
                .get("/organize/detail", {
                    params: {
                        token: this.userInfo.token,
                        id: this.$route.params.id
                    }
                })
                .then(data => {
                    data = data.data;
                    this.organizeInfo = data.organizeInfo;
                    this.userList = data.userList;
                    this.loading = false;
                    // console.log(this.userList);
                });
        },
        showDetail(item) {
            this.userInfoDialog = true;
            this.currentUser = item;
        }
    },
    mounted() {
        this.getOrganizeInfo();
    },
    computed: {
        ...mapGetters(["userInfo"])
    },
    beforeRouteUpdate(to, from, next) {
        next();
        this.getOrganizeInfo();
    }
};
</script>

