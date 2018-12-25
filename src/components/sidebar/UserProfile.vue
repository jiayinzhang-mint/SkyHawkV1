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
      <v-btn block flat round @click="settingDialog=true" class="mb-0">修改密码</v-btn>
      <v-btn block light round @click="logOut" class="mb-0">注销</v-btn>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
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
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  }
};
</script>

<style>
</style>
