<template>
  <v-app id="inspire" dark @click.native="detectActive">
    <v-navigation-drawer fixed app v-model="drawer" clipped>
      <v-list>
        <v-list v-if="userInfo.role == 0">
          <template v-for="(item, i) in menuManage">
            <v-layout v-if="item.heading" :key="i" row align-center>
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-layout>
            <v-divider
              v-else-if="item.divider"
              :key="i"
              dark
              class="my-3"
            ></v-divider>
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
            <v-divider
              v-else-if="item.divider"
              :key="i"
              dark
              class="my-3"
            ></v-divider>
            <v-list-tile
              v-else-if="userInfo.role <= item.role"
              :key="i"
              :to="item.route"
              ripple
            >
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
            <v-divider
              v-else-if="item.divider"
              :key="i"
              dark
              class="my-3"
            ></v-divider>
            <v-list-tile
              v-else-if="userInfo.role <= item.role"
              :key="i"
              :to="item.route"
              ripple
            >
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
      <v-btn icon @click="goBack" class="hidden-md-and-down">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-side-icon
        class="hidden-lg-and-up"
        style="margin-left:-10px"
        @click.stop="drawer = !drawer"
      ></v-toolbar-side-icon>
      <v-toolbar-title class="ml-2" style="width:232px"
        >SkyHawk</v-toolbar-title
      >

      <v-spacer></v-spacer>

      <v-btn icon @click.stop="userCenter = !userCenter">
        <v-avatar size="32px">
          <vue-initials-img :name="userInfo.username" />
        </v-avatar>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer
      class="aero no-scrollbar"
      v-model="userHelp"
      temporary
      right
      fixed
      app
    >
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

    <v-navigation-drawer
      class="aero no-scrollbar"
      v-model="userCenter"
      temporary
      right
      fixed
      app
    >
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
    return {
      mini: false,
      value2: false,
      userHelp: false,
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
          icon: "today",
          text: "每日统计",
          role: 2,
          route: "/calendar"
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
      feedBack: "",
      notificationCenter: false,
      settingCenter: false,
      alertListShow: [],
      userCenter: false,
      lTime: null, // 最后一次点击的时间
      ctTime: null, //当前时间
      tOut: 1000 * 10
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
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
    this.detectActive();
  }
};
</script>

<style scoped>
</style>
