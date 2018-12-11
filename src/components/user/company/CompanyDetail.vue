<template>
  <v-container>
    <v-card>
      <v-layout row>
        <v-flex xs3 class="aero-light">
          <v-toolbar color="transparent" flat>
            <v-toolbar-title
              class="subheading font-weight-medium text-uppercase"
              style="margin-left:-7px"
            >{{currentCompany.brand}}</v-toolbar-title>
          </v-toolbar>
          <v-list class="transparent">
            <template v-for="(item, i) in menuCompany">
              <v-layout v-if="item.heading" :key="i" row align-center>
                <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
              </v-layout>
              <v-divider v-else-if="item.divider" :key="i" dark class="my-2"></v-divider>
              <v-list-tile
                v-else
                :key="i"
                :to="'/company/'+currentCompany.id + '/' +item.route"
                ripple
              >
                <v-list-tile-content>
                  <v-list-tile-title class="body-2">{{ item.text }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-flex>
        <v-flex xs9 style="height:calc(100vh - 97px);overflow :auto">
          <router-view></router-view>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    currentCompany: [],
    companyInfo: [],
    loading: true,
    tab: 0,
    companySupervisor: [],
    station: [],
    group: [],
    alertListShow: [],
    menuCompany: [
      { heading: "通用" },
      {
        text: "基本信息",
        route: "info"
      },
      {
        text: "监管人员",
        route: "supervisor"
      },
      {
        text: "告警历史",
        route: "alert"
      },

      {
        divider: true
      },
      { heading: "数据监测" },
      {
        text: "设备状态",
        route: "device"
      },
      {
        text: "定时抓拍",
        route: "gallery"
      },
      {
        text: "温湿度监测",
        route: "humiture"
      }
    ]
  }),
  methods: {
    getCurrentCompany() {
      this.currentCompany = this.companyList.find(element => {
        return element.id == this.$route.params.id;
      });
    }
  },
  mounted() {
    this.getCurrentCompany();
    this.$router.push({ path: "/company/" + this.$route.params.id + "/info" });
  },
  computed: {
    ...mapGetters(["userInfo", "companyList"])
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.getCurrentCompany();
  }
};
</script>

<style>
</style>
