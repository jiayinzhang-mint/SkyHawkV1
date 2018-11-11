<template>
    <v-container style="height:calc(100vh - 129px);overflow :auto">
        <v-card v-loading="loading">
            <v-toolbar flat color="white">
                <v-toolbar-title style="font-size:17px">{{organizeInfo.name}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn round depressed color="primary" @click="newUserDialog=true">新建</v-btn>
            </v-toolbar>
            <v-data-table :headers="headers" :items="userList" hide-actions no-data-text="暂无数据">
                <template slot="items" slot-scope="props">
                    <td class="text-xs-center">{{ props.item.username }}</td>
                    <td class="text-xs-center">{{ props.item.name }}</td>
                    <td class="text-xs-center">{{ props.item.index }}</td>
                    <td class="text-xs-center">{{ props.item.phone }}</td>
                    <td class="text-xs-center">
                        <v-btn color="primary" round flat @click="userInfoDialog = true;userForm=props.item">编辑</v-btn>
                        <v-btn color="error" round flat @click="deleteUser(props.item.id)">删除</v-btn>

                    </td>

                </template>
            </v-data-table>
            <el-dialog title="编辑用户" center :visible.sync="userInfoDialog" width="400px">
                <el-form :rules="rules" label-position="left" ref="userForm2" :model="userForm" label-width="110px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="userForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="工号" prop="index">
                        <el-input v-model="userForm.index"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="userForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="移动电话">
                        <el-input v-model="userForm.phone"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <v-btn round depressed color="primary" @click="editUser('userForm2')">保存</v-btn>
                    <v-btn round flat @click="userInfoDialog=false">取消</v-btn>
                </span>
            </el-dialog>
            <el-dialog center title="新建用户" :visible.sync="newUserDialog" width="400px">
                <el-form label-position="left" :rules="rules" ref="userForm" :model="userForm" label-width="90px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="userForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="工号" prop="index">
                        <el-input v-model="userForm.index"></el-input>
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
        userForm: {},
        loading: true,
        userInfoDialog: false,
        newUserDialog: false,
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
        ],
        rules: {
            username: [
                { required: true, message: "请输入用户名", trigger: "blur" }
            ],
            name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
            index: [{ required: true, message: "请输入工号", trigger: "blur" }]
        }
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
        newUser(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    const user = this.userForm;
                    this.newUserDialog = false;
                    this.$ajax
                        .post("/user/list", {
                            new: "true",
                            role: this.organizeInfo.level,
                            token: this.userInfo.token,
                            id: user.id,
                            username: user.username,
                            name: user.name,
                            phone: user.phone,
                            index: user.index,
                            organize: this.$route.params.id
                        })
                        .then(data => {
                            data = data.data;
                            if (data.msg == "success") {
                                this.$message({
                                    message: "操作成功",
                                    type: "success"
                                });
                                this.getOrganizeInfo();
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
                            if ((data.msg = "success")) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.getOrganizeInfo();
                            }
                        });
                })
                .catch(() => {});
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

<style>
</style>
