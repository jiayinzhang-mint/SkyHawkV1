<template>
  <v-app id="inspire" class="background">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 style="max-width:500px">
            <v-scroll-y-transition>
              <v-card class="elevation-12" v-if="!loading">
                <v-container>
                  <v-card-text>
                    <p class="headline mb-4" style="text-align:center">绑定 SkyHawk</p>
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
                    <v-btn dark class="primary" @click="bind" block round>绑定</v-btn>
                  </v-card-actions>
                </v-container>
              </v-card>
            </v-scroll-y-transition>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer class="pa-4 trans">
      <div class="jump">
        <img width="20px" style="margin-left:-5px" src="/static/assets/INSDIM.svg">
      </div>
      <v-spacer></v-spacer>
      <div>Copyright &copy; {{ new Date().getFullYear() }} INSDIM Inc. 保留所有权利</div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    username: "",
    password: "",
    loading: false
  }),
  methods: {
    bind() {
      this.$ajax
        .post("/user/bind", {
          username: this.username,
          wechat: this.$route.query.wechat,
          password: this.password
        })
        .then(data => {
          data = data.data;
          if (data.msg == "success") {
            this.$message({
              message: "操作成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "操作失败",
              type: "error"
            });
          }
        });
    },
    init() {
      this.$ajax
        .get("/user/bind", {
          params: { wechat: this.$route.query.wechat }
        })
        .then(data => {
          //console.log(data.data);
          data = data.data;
          this.username = data.username;
        });
    }
  },
  mounted() {
    this.init();
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
