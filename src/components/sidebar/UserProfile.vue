<template>
  <div>
    <v-toolbar flat color="transparent">
      <v-toolbar-title>
        <span class="hidden-sm-and-down">我的账户</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-divider></v-divider>
    <v-container style="height:calc(100vh - 64px);overflow :auto" class="no-scrollbar">
      <v-layout class="mb-4">
        <v-flex xs6>
          <v-avatar size="84px">
            <vue-initials-img :name="userInfo.username"/>
          </v-avatar>
        </v-flex>
        <v-flex xs6>
          <h1 class="headline text-xs-right">{{userInfo.name}}</h1>
          <h2 class="subheading text-xs-right">{{userInfo.username}}</h2>
          <h2 class="subheading text-xs-right">{{userInfo.station}}</h2>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-btn block flat round @click="settingDialog=!settingDialog" class="mb-0">修改密码</v-btn>
      <v-scroll-y-transition>
        <div id="changePwd" v-if="settingDialog">
          <v-divider class="mt-3 mb-2"></v-divider>
          <el-form
            :model="ruleForm2"
            status-icon
            :rules="rules2"
            ref="ruleForm2"
            label-width="100px"
            class="demo-ruleForm"
            label-position="top"
          >
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <v-btn block color="primary" round @click="submitForm('ruleForm2')">确认</v-btn>
          <v-divider class="mb-3 mt-3"></v-divider>
        </div>
      </v-scroll-y-transition>
      <v-btn block light round @click="logOut">注销</v-btn>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      ruleForm2: {
        pass: "",
        checkPass: ""
      },
      rules2: {
        pass: [
          {
            validator: validatePass,
            trigger: "blur"
          },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]){8,}/,
            trigger: "blur",
            message: "至少包含大小写字母、数字，长度至少8位"
          }
        ],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      settingDialog: false
    };
  },
  methods: {
    logOut() {
      this.$confirm("确认注销吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        roundButton: true,
        center: true,
        showClose: false,
        closeOnClickModal: false
      })
        .then(() => {
          this.$router.push({ path: "/" });
        })
        .catch(() => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("确认修改吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            roundButton: true,
            center: true,
            showClose: false,
            closeOnClickModal: false
          }).then(() => {
            this.$ajax
              .post("/user/info", {
                token: this.userInfo.token,
                id: this.userInfo.id,
                password: this.ruleForm2.pass,
                changepasswd: true
              })
              .then(data => {
                data = data.data;
                if (data.msg == "success") {
                  this.settingDialog = false;
                  this.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  this.$router.push({ path: "/" });
                }
              });
          });
        }
      });
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  }
};
</script>

<style>
</style>
