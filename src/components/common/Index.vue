<template>
  <v-app id="inspire" dark @click.native="detectActive">
    <v-navigation-drawer fixed app v-model="drawer" clipped>
      <v-list>
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

    <v-toolbar clipped-left flat app fixed color="grey darken-4">
      <v-btn icon @click="goBack">
        <v-icon class="hidden-md-and-down">arrow_back</v-icon>
      </v-btn>
      <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="ml-2" style="width:232px">SkyHawk</v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="搜索"
        class="hidden-sm-and-down"
      ></v-text-field>
      <v-spacer></v-spacer>
      <el-tooltip class="item" effect="light" content="通知" placement="bottom">
        <v-btn icon @click.stop="notificationCenter = !notificationCenter">
          <v-icon>mail_outline</v-icon>
        </v-btn>
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="设置" placement="bottom">
        <v-btn icon @click="settingCenter = !settingCenter">
          <v-icon>settings</v-icon>
        </v-btn>
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="帮助" placement="bottom">
        <v-btn icon @click.stop="userHelp = !userHelp">
          <v-icon>help_outline</v-icon>
        </v-btn>
      </el-tooltip>
      <v-btn icon @click.stop="userCenter = !userCenter">
        <v-avatar size="32px">
          <vue-initials-img :name="userInfo.username"/>
        </v-avatar>
      </v-btn>
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

    <v-navigation-drawer class="aero no-scrollbar" v-model="userHelp" temporary right fixed app>
      <user-help></user-help>
    </v-navigation-drawer>

    <v-navigation-drawer
      class="aero no-scrollbar"
      v-model="settingCenter"
      temporary
      right
      fixed
      app
    >
      <setting-center></setting-center>
    </v-navigation-drawer>

    <v-navigation-drawer
      class="aero no-scrollbar"
      v-model="notificationCenter"
      temporary
      right
      fixed
      app
    >
      <notification-center></notification-center>
    </v-navigation-drawer>

    <v-navigation-drawer class="aero no-scrollbar" v-model="userCenter" temporary right fixed app>
      <user-profile></user-profile>
    </v-navigation-drawer>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";

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
      mini: false,
      value2: false,
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
      feedBack: "",
      notificationCenter: false,
      settingCenter: false,
      alertListShow: [],
      userCenter: false,
      lTime: null, // 最后一次点击的时间
      ctTime: null, //当前时间
      tOut: 1000 * 60 * 60 //超时时间10min
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
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
    },
    detectActive() {
      if (moment().diff(this.lTime) > this.tOut) {
        console.log("timeout");
        this.lTime = moment();
      } else {
        this.lTime = moment();
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo", "alertList"])
  },
  mounted() {
    this.alertListShow = this.alertList.slice(0, 10);
    this.lTime = moment();
  }
};
</script>

<style scoped>
</style>
