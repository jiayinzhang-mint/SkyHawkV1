<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer fixed app v-model="drawer">
      <v-list class="pt-3">
        <v-list-tile avatar class="pb-2">
          <v-list-tile-avatar>
            <v-avatar size="40px">
              <vue-initials-img :name="userInfo.username"/>
            </v-avatar>
          </v-list-tile-avatar>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title class="title" v-html="userInfo.username"></v-list-tile-title>
            <v-list-tile-sub-title v-html="userInfo.name"></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list v-if="userInfo.role==0">
          <template v-for="(item, i) in menuManage">
            <v-layout v-if="item.heading" :key="i" row align-center>
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-layout>
            <v-divider v-else-if="item.divider" :key="i" dark class="my-3"></v-divider>
            <v-list-tile v-else :key="i" :to="item.route" ripple>
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
        <v-list>
          <template v-for="(item, i) in menuCommon">
            <v-layout v-if="item.heading" :key="i" row align-center>
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-layout>
            <v-divider v-else-if="item.divider" :key="i" dark class="my-3"></v-divider>
            <v-list-tile v-else-if="userInfo.role<=item.role" :key="i" :to="item.route" ripple>
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
        <v-list>
          <template v-for="(item, i) in menuData">
            <v-layout v-if="item.heading" :key="i" row align-center>
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-layout>
            <v-divider v-else-if="item.divider" :key="i" dark class="my-3"></v-divider>
            <v-list-tile v-else-if="userInfo.role<=item.role" :key="i" :to="item.route" ripple>
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar flat app fixed style class="aero">
      <v-btn icon class="hidden-md-and-down" @click="goBack" v-if="drawer">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-side-icon class="hidden-lg-and-up" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class>
        <span class="hidden-sm-and-down">SkyHawk - 静安区</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <el-tooltip class="item" effect="light" content="设置" placement="bottom">
        <v-btn icon @click="settingDialog=true">
          <v-icon>settings</v-icon>
        </v-btn>
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="帮助" placement="bottom">
        <v-btn icon @click.stop="userHelp = !userHelp">
          <v-icon>help_outline</v-icon>
        </v-btn>
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="注销" placement="bottom">
        <v-btn icon @click="logOut">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </el-tooltip>
    </v-toolbar>

    <el-dialog
      title="用户设置"
      ref="userProfileForm"
      :close-on-click-modal="false"
      :visible.sync="settingDialog"
      width="400px"
      center
    >
      <span class="subheading font-weight-medium">修改密码</span>
      <v-divider class="mb-4 mt-2"></v-divider>
      <el-form
        :model="ruleForm2"
        status-icon
        :rules="rules2"
        ref="ruleForm2"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <v-btn round depressed flat @click="settingDialog = false">取 消</v-btn>
        <v-btn round depressed color="primary" @click="submitForm('ruleForm2')">确 定</v-btn>
      </div>
    </el-dialog>

    <v-navigation-drawer v-model="userHelp" temporary right fixed app>
      <v-toolbar flat color="transparent">
        <v-toolbar-title>
          <span class="hidden-sm-and-down">用户帮助</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="userHelp=!userHelp">
          <v-icon>clear</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <span class="subheading font-weight-medium">常见问题</span>
        <v-divider class="mb-4 mt-2"></v-divider>
        <span class="subheading font-weight-medium">仍有疑惑？</span>
        <v-divider class="mb-4 mt-2"></v-divider>
        <el-input
          type="textarea"
          v-model="feedBack"
          :autosize="{ minRows: 8, maxRows: 10}"
          placeholder="请提交反馈"
        ></el-input>
        <v-btn round depressed block class="mt-3">提交</v-btn>
      </v-container>
    </v-navigation-drawer>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
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
      userHelp: false,
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      drawer: true,
      menuManage: [
        { heading: "管理" },
        {
          icon: "business",
          text: "企业管理",
          route: "/manage/company"
        },
        {
          icon: "people",
          text: "组织管理",
          route: "/manage/organize"
        }
      ],
      menuCommon: [
        { heading: "通用" },
        {
          icon: "dashboard",
          text: "今日概览",
          role: 2,
          route: "/today"
        },
        {
          icon: "map",
          text: "地图视图",
          route: "/map",
          role: 3
        },
        {
          icon: "alarm",
          text: "告警流转",
          route: "/alert",
          role: 4
        },
        {
          icon: "people",
          text: "组织信息",
          route: "/organize",
          role: 2
        },
        {
          icon: "business",
          text: "企业信息",
          route: "/company",
          role: 3
        }
      ],
      menuData: [
        { heading: "数据可视化" },
        {
          icon: "data_usage",
          text: "告警统计",
          role: 2,
          route: "/dashboard/analysis"
        },
        {
          icon: "trending_up",
          text: "告警预测",
          role: 2,
          route: "/dashboard/perdict"
        }
      ],
      settingDialog: false,
      feedBack: ""
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
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
              }
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
