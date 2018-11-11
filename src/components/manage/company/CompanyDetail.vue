<template>
    <v-container style="height:calc(100vh - 64px);overflow :auto">

        <v-card v-loading="loading">

            <v-tabs v-model="tab" color="white" centered>
                <v-tabs-slider></v-tabs-slider>

                <v-tab key="1">
                    信息
                </v-tab>
                <v-tab key="2">
                    用户
                </v-tab>
                <v-tab key="3">
                    监管人
                </v-tab>
                <v-tab key="4">
                    监控点
                </v-tab>
            </v-tabs>
            <v-divider></v-divider>

            <v-tabs-items v-model="tab">
                <v-tab-item key="1">

                    <v-toolbar flat color="white">
                        <v-toolbar-title style="font-size:17px">企业信息</v-toolbar-title>

                        <v-spacer></v-spacer>
                        <v-btn depressed class="primary" round @click="editCompany">
                            保存
                        </v-btn>
                    </v-toolbar>
                    <v-container>
                        <el-form label-position="left" ref="companyForm" :model="companyForm" label-width="150px">
                            <el-form-item label="店招">
                                <el-input v-model="companyForm.brand"></el-input>
                            </el-form-item>
                            <el-form-item label="企业">
                                <el-input v-model="companyForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="地址">
                                <el-input v-model="companyForm.address"></el-input>
                            </el-form-item>
                            <el-form-item label="法人">
                                <el-input v-model="companyForm.legal_person"></el-input>
                            </el-form-item>
                            <el-form-item label="营业执照">
                                <el-input v-model="companyForm.license"></el-input>
                            </el-form-item>
                            <el-form-item label="所属组织">
                                <el-cascader style="width:100%" expand-trigger="hover" :options="organizeList" v-model="selectedOrganize" :props="defaultProps">
                                </el-cascader>
                            </el-form-item>
                            <el-form-item label="营业执照有效至">
                                <el-date-picker type="date" placeholder="选择日期" v-model="companyForm.license_validity" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-form>
                    </v-container>
                    <v-divider class="mb-2"></v-divider>

                </v-tab-item>
                <v-tab-item key="2">

                    <v-toolbar flat color="white">
                        <v-toolbar-title style="font-size:17px">企业用户</v-toolbar-title>

                        <v-spacer></v-spacer>
                        <v-btn depressed class="primary" round @click="newUserDialog=true">
                            新建
                        </v-btn>
                    </v-toolbar>
                    <v-data-table :headers="headers" :items="companyUser" hide-actions no-data-text="暂无数据">
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-center">{{ props.item.username }}</td>
                            <td class="text-xs-center">{{ props.item.name }}</td>
                            <td class="text-xs-center">{{ props.item.phone }}</td>
                            <td class="text-xs-center">
                                <v-btn color="primary" round flat @click="userInfoDialog=true;userForm=props.item">编辑</v-btn>
                                <v-btn color="error" round flat @click="deleteUser(props.item.id)">删除</v-btn>
                            </td>
                        </template>
                    </v-data-table>

                </v-tab-item>
                <v-tab-item key="3">
                    <v-toolbar flat color="white">
                        <v-toolbar-title style="font-size:17px">监管人员</v-toolbar-title>

                        <v-spacer></v-spacer>
                        <v-btn depressed class="primary" round @click="newSupervisorDialog=true">
                            新建
                        </v-btn>
                    </v-toolbar>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex v-for="(item,i) in companySupervisor" :key="i" xs6 md3>
                                <v-card>
                                    <v-img height="120px">
                                        <v-container fill-height fluid pa-2>
                                            <v-layout fill-height>
                                                <v-flex xs12 align-end flexbox>
                                                    <span class="headline white--text" v-text="item.name"></span>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-img>

                                    <v-card-actions>
                                        <h4>{{item.name}}</h4>
                                        <v-spacer></v-spacer>
                                        <v-btn icon @click="deleteSupervisor(item.id)">
                                            <v-icon>clear</v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-tab-item>
                <v-tab-item key="4">
                    <v-toolbar flat color="white">
                        <v-toolbar-title style="font-size:17px">监控点</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn depressed class="primary" round @click="newMonitorDialog=true">
                            新建
                        </v-btn>
                    </v-toolbar>
                    <v-data-table :headers="headersMonitor" :items="monitorList" hide-actions no-data-text="暂无数据">
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-center">{{ props.item.name }}</td>
                            <td class="text-xs-center">{{ props.item.index }}</td>
                            <td class="text-xs-center">{{ props.item.ip }}</td>
                            <td class="text-xs-center">{{ props.item.channel }}</td>
                            <td class="text-xs-center">{{ props.item.port }}</td>
                            <td class="text-xs-center">
                                <v-btn color="primary" round flat @click="editMonitorDialog=true;monitorForm=props.item">编辑</v-btn>
                                <v-btn color="error" round flat @click="deleteMonitor(props.item.id)">删除</v-btn>
                            </td>
                        </template>
                    </v-data-table>
                </v-tab-item>

            </v-tabs-items>
        </v-card>
        <el-dialog title="编辑用户" center :visible.sync="userInfoDialog" width="400px">
            <el-form label-position="left" :rules="rules" ref="userForm" :model="userForm" label-width="90px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="userForm.name"></el-input>
                </el-form-item>
                <el-form-item label="移动电话">
                    <el-input v-model="userForm.phone"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <v-btn round depressed color="primary" @click="editUser('userForm')">保存</v-btn>
                <v-btn round flat @click="userInfoDialog=false">取消</v-btn>
            </span>
        </el-dialog>
        <el-dialog center title="新建用户" :visible.sync="newUserDialog" width="400px">
            <el-form label-position="left" :rules="rules" ref="userForm" :model="userForm" label-width="90px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="userForm.name"></el-input>
                </el-form-item>
                <el-form-item label="移动电话">
                    <el-input v-model="userForm.phone"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <v-btn round depressed color="primary" @click="newUser('userForm')">保存</v-btn>
                <v-btn round flat @click="newUserDialog=false">取消</v-btn>
            </span>
        </el-dialog>
        <el-dialog center title="新建监管人员" :visible.sync="newSupervisorDialog" width="400px">
            <el-form label-position="left" :rules="superRules" ref="supervisorForm" :model="supervisorForm" label-width="90px">
                <el-form-item label="监管人员" prop="supervisor">
                    <el-select v-model="supervisorForm.supervisor" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <v-btn round depressed color="primary" @click="newSupervisor('supervisorForm')">保存</v-btn>
                <v-btn round flat @click="newSupervisorDialog=false">取消</v-btn>
            </span>
        </el-dialog>
        <el-dialog center title="新建监控点" :visible.sync="newMonitorDialog" width="400px">
            <el-form label-position="left" :rules="monitorRules" ref="monitorForm" :model="monitorForm" label-width="90px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="monitorForm.name"></el-input>
                </el-form-item>
                <el-form-item label="编号" prop="index">
                    <el-input v-model="monitorForm.index"></el-input>
                </el-form-item>
                <el-form-item label="IP地址" prop="ip">
                    <el-input v-model="monitorForm.ip"></el-input>
                </el-form-item>
                <el-form-item label="通道" prop="channel">
                    <el-input v-model="monitorForm.channel"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="port">
                    <el-input v-model="monitorForm.port"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <v-btn round depressed color="primary" @click="newMonitor('monitorForm')">保存</v-btn>
                <v-btn round flat @click="newMonitorDialog=false">取消</v-btn>
            </span>
        </el-dialog>
        <el-dialog center title="编辑监控点" :visible.sync="editMonitorDialog" width="400px">
            <el-form label-position="left" :rules="monitorRules" ref="monitorForm" :model="monitorForm" label-width="90px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="monitorForm.name"></el-input>
                </el-form-item>
                <el-form-item label="编号" prop="index">
                    <el-input v-model="monitorForm.index"></el-input>
                </el-form-item>
                <el-form-item label="IP地址" prop="ip">
                    <el-input v-model="monitorForm.ip"></el-input>
                </el-form-item>
                <el-form-item label="通道" prop="channel">
                    <el-input v-model="monitorForm.channel"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="port">
                    <el-input v-model="monitorForm.port"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <v-btn round depressed color="primary" @click="editMonitor('monitorForm')">保存</v-btn>
                <v-btn round flat @click="editMonitorDialog=false">取消</v-btn>
            </span>
        </el-dialog>
    </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
    data: () => ({
        companyInfo: [],
        companyUser: [],
        companySupervisor: [],
        loading: true,
        companyForm: {},
        supervisorForm: {},
        monitorForm: {},
        userForm: {},
        defaultProps: {
            children: "children",
            label: "name",
            value: "id"
        },
        headers: [
            {
                text: "用户名",
                align: "center",
                sortable: false,
                value: "username"
            },
            {
                text: "姓名",
                align: "center",
                sortable: false,
                value: "name"
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
        ],
        headersMonitor: [
            {
                text: "名称",
                align: "center",
                sortable: false
            },
            {
                text: "编号",
                align: "center",
                sortable: false
            },
            {
                text: "IP地址",
                align: "center",
                sortable: false
            },
            {
                text: "通道",
                align: "center",
                sortable: false
            },
            {
                text: "端口",
                align: "center",
                sortable: false
            },
            {
                text: "操作",
                align: "center",
                sortable: false
            }
        ],
        userInfoDialog: false,
        newUserDialog: false,
        newSupervisorDialog: false,
        newMonitorDialog: false,
        editMonitorDialog: false,
        selectedOrganize: [],
        rules: {
            username: [
                { required: true, message: "请输入用户名", trigger: "blur" }
            ],
            name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
        },
        superRules: {
            supervisor: [
                { required: true, message: "请选择监管人员", trigger: "blur" }
            ]
        },
        monitorRules: {
            name: [{ required: true, message: "请输入名称", trigger: "blur" }],
            index: [{ required: true, message: "请输入名称", trigger: "blur" }],
            ip: [{ required: true, message: "请输入名称", trigger: "blur" }],
            channel: [
                { required: true, message: "请输入名称", trigger: "blur" }
            ],
            port: [{ required: true, message: "请输入名称", trigger: "blur" }]
        },
        tab: null,
        userList: [],
        monitorList: []
    }),
    methods: {
        ...mapActions(["getOrganizeList", "getCompanyList"]),
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
                    data = data.data;
                    this.companyInfo = data.companyDetail;
                    this.companyForm = this.companyInfo;
                    this.selectedOrganize = [
                        this.companyInfo.bureau,
                        this.companyInfo.station,
                        this.companyInfo.besupervised
                    ];
                    this.loading = false;
                })
                .then(() => {
                    this.getSupervisor();
                })
                .then(() => {
                    this.getGroupMember();
                })
                .then(() => {
                    this.getMonitor();
                });
        },
        getCompanyUser() {
            this.$ajax
                .get("/user/list", {
                    params: {
                        token: this.userInfo.token,
                        company: this.$route.params.id
                    }
                })
                .then(data => {
                    data = data.data;
                    this.companyUser = data.companyUser;
                });
        },
        getMonitor() {
            this.$ajax
                .get("/monitor/list", {
                    params: {
                        token: this.userInfo.token,
                        company: this.$route.params.id
                    }
                })
                .then(data => {
                    data = data.data;
                    this.monitorList = data.monitorList;
                });
        },
        editCompany() {
            // console.log(this.companyForm);
            this.$ajax
                .post("/company/detail", {
                    token: this.userInfo.token,
                    id: this.$route.params.id,
                    brand: this.companyForm.brand,
                    name: this.companyForm.name,
                    address: this.companyForm.address,
                    legal_person: this.companyForm.legal_person,
                    license: this.companyForm.license,
                    license_validity: this.companyForm.license_validity,
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
                        this.getCompanyList({ type: "force" });
                        this.getCompanyUser();
                        this.userForm = {};
                    }
                });
        },
        newUser(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    const user = this.userForm;
                    this.newUserDialog = false;
                    this.$ajax
                        .post("/user/list", {
                            new: "true",
                            role: 4,
                            token: this.userInfo.token,
                            id: user.id,
                            username: user.username,
                            name: user.name,
                            phone: user.phone,
                            index: user.index,
                            company: this.$route.params.id
                        })
                        .then(data => {
                            data = data.data;
                            if (data.msg == "success") {
                                this.$message({
                                    message: "操作成功",
                                    type: "success"
                                });
                                this.getCompanyUser();
                                this.userForm = {};
                            }
                        });
                }
            });
        },
        newSupervisor(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    this.$ajax
                        .post("/company/supervise", {
                            token: this.userInfo.token,
                            company: this.$route.params.id,
                            supervisor: this.supervisorForm.supervisor
                        })
                        .then(data => {
                            this.newSupervisorDialog = false;
                            data = data.data;
                            if (data.msg == "success") {
                                this.$message({
                                    message: "操作成功",
                                    type: "success"
                                });
                                this.getSupervisor();
                                this.supervisorForm = {};
                            }
                        });
                }
            });
        },
        editUser(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    const user = this.userForm;
                    this.userInfoDialog = false;
                    this.$ajax
                        .post("/user/info", {
                            edit: "true",
                            token: this.userInfo.token,
                            id: user.id,
                            username: user.username,
                            name: user.name,
                            phone: user.phone,
                            index: user.index
                        })
                        .then(data => {
                            data = data.data;
                            if (data.msg == "success") {
                                this.$message({
                                    message: "操作成功",
                                    type: "success"
                                });
                                this.userForm = {};
                            }
                        });
                }
            });
        },
        deleteUser(id) {
            this.$confirm("此操作不可还原, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$ajax
                        .delete("/user/list", {
                            params: {
                                token: this.userInfo.token,
                                id: id
                            }
                        })
                        .then(data => {
                            data = data.data;
                            if (data.msg == "success") {
                                this.$message({
                                    type: "success",
                                    message: "删除成功"
                                });
                                this.getCompanyUser();
                            }
                        });
                })
                .catch(() => {});
        },
        getGroupMember() {
            this.$ajax
                .get("/organize/detail", {
                    params: {
                        token: this.userInfo.token,
                        id: this.companyInfo.besupervised
                    }
                })
                .then(data => {
                    data = data.data;
                    this.userList = data.userList;
                    this.loading = false;
                    // console.log(this.userList);
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
        deleteSupervisor(supervisor) {
            this.$confirm("此操作不可还原, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$ajax
                        .delete("/company/supervise", {
                            params: {
                                token: this.userInfo.token,
                                supervisor: supervisor,
                                company: this.$route.params.id
                            }
                        })
                        .then(data => {
                            data = data.data;
                            if (data.msg == "success") {
                                this.$message({
                                    type: "success",
                                    message: "删除成功"
                                });
                                this.getSupervisor();
                            }
                        });
                })
                .catch(() => {});
        },
        newMonitor(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    this.newMonitorDialog = false;
                    this.$ajax
                        .post("/monitor/list", {
                            token: this.userInfo.token,
                            name: this.monitorForm.name,
                            index: this.monitorForm.index,
                            ip: this.monitorForm.ip,
                            channel: this.monitorForm.channel,
                            port: this.monitorForm.port,
                            company: this.$route.params.id,
                            new: true
                        })
                        .then(data => {
                            data = data.data;
                            this.monitorForm = {};
                            if (data.msg == "success") {
                                this.$message({
                                    type: "success",
                                    message: "操作成功"
                                });
                                this.getMonitor();
                            }
                        });
                }
            });
        },
        editMonitor(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    this.editMonitorDialog = false;
                    this.$ajax
                        .post("/monitor/list", {
                            token: this.userInfo.token,
                            id: this.monitorForm.id,
                            name: this.monitorForm.name,
                            index: this.monitorForm.index,
                            ip: this.monitorForm.ip,
                            channel: this.monitorForm.channel,
                            port: this.monitorForm.port,
                            company: this.$route.params.id
                        })
                        .then(data => {
                            data = data.data;
                            this.monitorForm = {};
                            if (data.msg == "success") {
                                this.$message({
                                    type: "success",
                                    message: "操作成功"
                                });
                                this.getMonitor();
                            }
                        });
                }
            });
        },
        deleteMonitor(monitor) {
            this.$confirm("此操作不可还原, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$ajax
                        .delete("/monitor/list", {
                            params: {
                                token: this.userInfo.token,
                                id: monitor
                            }
                        })
                        .then(data => {
                            data = data.data;
                            if (data.msg == "success") {
                                this.$message({
                                    type: "success",
                                    message: "删除成功"
                                });
                                this.getMonitor();
                            }
                        });
                })
                .catch(() => {});
        }
    },
    mounted() {
        this.getCompanyInfo();
        this.getCompanyUser();
        this.getOrganizeList("force");
    },
    computed: {
        ...mapGetters(["userInfo", "organizeList"])
    },
    beforeRouteUpdate(to, from, next) {
        next();
        this.getCompanyInfo();
        this.getCompanyUser();
    }
};
</script>

<style>
</style>
