<template>
  <v-app id="inspire" dark class="no-scrollbar">
    <v-content>
      <v-container fluid fill-height style="padding:0 !important">
        <v-scroll-y-transition>
          <v-layout justify-center align-center>
            <v-flex
              class="hidden-md-and-down background"
              style="background-color:#000; height:100%"
              md8
            >
              <v-layout align-center column justify-center fill-height>
                <h1 class="display-3 font-weight-thin mb-2">
                  SkyHawk
                  <span class="subheading font-weight-black">天鹰系统</span>
                </h1>
                <div align-center>
                  <v-divider></v-divider>
                  <v-btn flat round>用户手册</v-btn>
                  <v-btn flat round>反馈问题</v-btn>
                </div>
              </v-layout>
              <v-footer class="pa-4 trans">
                <div @click="jump" class="jump">
                  <img width="20px" style="margin-left:-5px" src="/static/assets/INSDIM.svg">
                </div>
                <v-spacer></v-spacer>
                <div>Copyright &copy; {{ new Date().getFullYear() }} INSDIM Inc. 保留所有权利</div>
              </v-footer>
            </v-flex>
            <v-flex xs12 md4 d-flex>
              <v-container style="padding-right:100px !important">
                <v-card-text>
                  <p class="text-md-left headline font-weight-bold mb-4 pt-3">登录 SkyHawk</p>
                  <v-text-field
                    v-model="username"
                    prepend-icon="person"
                    name="login"
                    label="用户名"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="密码"
                    type="password"
                    @keyup.enter="login"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions class="pb-5">
                  <v-btn outline light color="primary" depressed @click="login" round>登录</v-btn>
                </v-card-actions>
              </v-container>
            </v-flex>
          </v-layout>
        </v-scroll-y-transition>
      </v-container>
    </v-content>

    <v-dialog v-model="loading" hide-overlay persistent width="300">
      <v-card>
        <v-card-text>正在加载数据
          <v-progress-linear indeterminate color="primary" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import vuexAlong from "vuex-along";
export default {
  data: () => ({
    username: "",
    password: "",
    loading: false,
    user: {},
    items: [
      {
        src: "/static/assets/Back.jpg"
      }
    ]
  }),
  methods: {
    ...mapMutations(["updateUserInfo"]),
    ...mapActions(["getCompanyList", "getOrganizeList", "getAlertList"]),
    jump() {
      window.open("https://inslens.com", "_blank");
    },
    detectDevice() {
      const isMobile = {
        Android: function() {
          return navigator.userAgent.match(/Android/i) ? true : false;
        },
        BlackBerry: function() {
          return navigator.userAgent.match(/BlackBerry/i) ? true : false;
        },
        iOS: function() {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
        },
        Windows: function() {
          return navigator.userAgent.match(/IEMobile/i) ? true : false;
        },
        any: function() {
          return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Windows()
          );
        }
      };
      if (isMobile.any()) {
        const device = "mobile";
        return device;
      } else {
        const device = "desktop";
        return device;
      }
    },
    login() {
      if (this.username && this.password) {
        this.loading = true;
        this.loadingBox = true;
        class LoginFail {}
        this.$ajax
          .post("/user/login", {
            username: this.username,
            password: this.password
          })
          .then(data => {
            data = data.data;
            // console.log(data);
            if (data.msg == "wrongpasswd") {
              this.$message.error("用户名或密码错误");
              this.loading = false;
              throw new LoginFail();
            } else if (data.msg == "nouser") {
              this.$message.error("用户名或密码错误");
              this.loading = false;
              throw new LoginFail();
            } else if (data.msg == "close") {
              this.$message.error("账号已被锁定，请联系管理员");
              this.loading = false;
              throw new LoginFail();
            } else {
              this.user.username = data.username;
              this.user.id = data.id;
              this.user.name = data.name;
              this.user.role = data.role;
              this.user.company = data.company;
              this.user.organize = data.organize;
              this.user.station = data.station;
              this.user.index = data.index;
              this.user.device = this.detectDevice();
              this.user.token = data.token;
              this.updateUserInfo(this.user);
            }
          })
          .then(data => {
            this.getCompanyList()
              .then(() => {
                this.getOrganizeList({ type: "force" });
                console.log(
                  "-----------------------Welcome---------------------\n",
                  "                      01 0101\n",
                  "                      10 101\n",
                  "                010101010101010101\n",
                  "             101010101010101010101010\n",
                  "            010101010101010101010101010\n",
                  "          10 1010101010101010101010101010\n",
                  "          0101010101  6      01 6     01\n",
                  "         10101010101         10       101\n",
                  "         0101010101010    0101010   1010 10\n",
                  "        101010       010101        0101    1\n",
                  "         01010       0101010101010101010   0\n",
                  "         101010     010101010     101010 0\n",
                  "           010101010101010101010101010101\n",
                  "              10101010101010101010101\n",
                  "             0101010101010101010101010\n",
                  "            10101010101010101010101010\n",
                  "           010101010101010101010101010\n",
                  "          10101010101010101010101010101\n",
                  "---------------------SandHawk----------------------\n",
                  "--------------------INSDIM INC.--------------------\n"
                );
              })
              .then(() => {
                if (this.user.device == "desktop") {
                  this.$router.push({ path: "/map" });
                } else {
                  this.$router.push({
                    path: "/mobile/alert"
                  });
                }
              });
          })
          .catch(LoginFail, () => {
            this.username = "";
            this.password = "";
          });
      }
    }
  },
  mounted() {
    vuexAlong.clean();
  }
};
</script>

<style>
.background {
  background-image: url("/static/assets/Back.jpg") !important;
  background-size: auto 100% !important;
}
.trans {
  background-color: transparent !important;
  color: white !important;
}
.jump :hover {
  cursor: pointer;
}
</style>
