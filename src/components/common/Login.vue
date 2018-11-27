<template>
  <v-app id="inspire" dark class="background">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 style="max-width:500px">
            <v-scroll-y-transition>
              <v-card class="elevation-12" v-if="!loading">
                <v-container>
                  <v-card-text>
                    <p class="text-md-center headline mb-4">登录 SkyHawk</p>
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
                  <v-card-actions>
                    <v-btn dark class="primary" depressed @click="login" block round>登录</v-btn>
                  </v-card-actions>
                </v-container>
              </v-card>
            </v-scroll-y-transition>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer class="pa-4 trans">
      <div @click="jump" class="jump">
        <img width="20px" style="margin-left:-5px" src="/static/assets/INSDIM.svg">
      </div>
      <v-spacer></v-spacer>
      <div>Copyright &copy; {{ new Date().getFullYear() }} INSDIM Inc. 保留所有权利</div>
    </v-footer>
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
    user: {}
  }),
  methods: {
    ...mapMutations(["updateUserInfo"]),
    ...mapActions(["getCompanyList", "getOrganizeList", "getAlertList"]),
    jump() {
      window.open("https://inslens.com", "_blank");
    },
    detectDevice() {
      const isMobile = {
        Android: function () {
          return navigator.userAgent.match(/Android/i) ? true : false;
        },
        BlackBerry: function () {
          return navigator.userAgent.match(/BlackBerry/i)
            ? true
            : false;
        },
        iOS: function () {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i)
            ? true
            : false;
        },
        Windows: function () {
          return navigator.userAgent.match(/IEMobile/i)
            ? true
            : false;
        },
        any: function () {
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
        class LoginFail { }
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
    background-size: 100% 100% !important;
}
.trans {
    background-color: transparent !important;
    color: white !important;
}
.jump :hover {
    cursor: pointer;
}
</style>
