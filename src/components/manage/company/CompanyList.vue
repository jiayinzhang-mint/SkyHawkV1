<template>
    <v-layout row>
        <v-flex xs12 sm4>
            <v-toolbar flat color="white">
                <v-toolbar-title style="font-size:17px">企业列表</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-scroll-x-transition>
                    <v-chip v-if="filted" close @input="reFill">{{selectedStation.name}}</v-chip>
                </v-scroll-x-transition>
                <v-menu bottom left >
                    <v-btn slot="activator" icon>
                        <v-icon>sort</v-icon>
                    </v-btn>
                    <v-list style="height:375px ;overflow :auto">
                        <v-list-tile v-for="(item, i) in stationList" :key="i" @click="filter(item.id)">
                            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>

                <v-btn icon @click="newCompanyDialog=true">
                    <v-icon>add</v-icon>
                </v-btn>

            </v-toolbar>
            <v-divider></v-divider>
            <v-list style="height:calc(100vh - 129px);overflow :auto" v-loading="loading">
                <v-scroll-x-transition group>
                    <template v-for="(item,index) in companyListShow">

                        <v-list-tile :key="index" avatar @click="showDetail(item.id)" ripple>
                            <v-list-tile-avatar>
                                <vue-initials-img :name="item.brand" />
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="item.brand"></v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn icon @click="deleteCompany(item.id)">
                                    <v-icon>clear</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>

                    </template>
                </v-scroll-x-transition>
            </v-list>
            <el-dialog center title="新建企业" :visible.sync="newCompanyDialog" width="400px">
                <el-form label-position="left" ref="companyForm" :model="newCompanyForm" label-width="90px">
                    <el-form-item label="店名">
                        <el-input v-model="newCompanyForm.brand"></el-input>
                    </el-form-item>
                    <el-form-item label="所属组织">
                        <el-cascader style="width:100%" expand-trigger="hover" :options="organizeList" v-model="selectedOrganize" :props="defaultProps">
                        </el-cascader>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <v-btn round depressed color="primary" @click="newCompany">创建</v-btn>
                    <v-btn round flat @click="newCompanyDialog=false">取消</v-btn>
                </span>
            </el-dialog>
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
import { mapGetters, mapActions } from "vuex";
export default {
    data: () => ({
        loading: true,
        newCompanyForm: {},
        newCompanyDialog: false,
        selectedOrganize: [],
        defaultProps: {
            children: "children",
            label: "name",
            value: "id"
        },
        filted: false,
        companyListShow: []
    }),
    methods: {
        ...mapActions(["getCompanyList"]),
        showDetail(id) {
            this.$router.push({ path: "/manage/company/" + id });
        },
        newCompany() {
            if (this.newCompanyForm.brand && this.selectedOrganize[2]) {
                this.newCompanyDialog = false;
                this.$ajax
                    .post("/company/list", {
                        token: this.userInfo.token,
                        brand: this.newCompanyForm.brand,
                        station: this.selectedOrganize[1],
                        besupervised: this.selectedOrganize[2]
                    })
                    .then(data => {
                        data = data.data;
                        if (data.msg == "success") {
                            this.$message({
                                message: "操作成功",
                                type: "success"
                            });
                            this.getCompanyList("force");
                            this.newCompanyForm = {};
                        }
                    });
            }
        },
        deleteCompany(id) {
            this.$confirm("此操作不可还原, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$ajax
                        .delete("/company/list", {
                            params: {
                                token: this.userInfo.token,
                                id: id
                            }
                        })
                        .then(data => {
                            data = data.data;
                            if (data.msg == "success") {
                                this.$message({
                                    message: "操作成功",
                                    type: "success"
                                });
                                this.getCompanyList("force");
                                this.$router.push("/manage/company");
                            }
                        });
                })
                .catch(() => {});
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
        ...mapGetters([
            "companyList",
            "userInfo",
            "organizeList",
            "stationList"
        ])
    },
    mounted() {
        this.loading = true;
        this.getCompanyList();
        this.companyListShow = this.companyList;
        this.loading = false;
    }
};
</script>

<style>
</style>
