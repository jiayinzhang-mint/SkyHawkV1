<template>
  <v-layout row>
    <v-flex xs12>
      <v-toolbar flat color="white">
        <v-toolbar-title style="font-size:17px">企业列表</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-chip v-if="filted && userInfo.role<=1" close @input="reFill">{{selectedStation.name}}</v-chip>
        <v-menu bottom left v-if="userInfo.role<=1">
          <v-btn slot="activator" icon>
            <v-icon>sort</v-icon>
          </v-btn>
          <v-list style="height:375px ;overflow :auto">
            <v-list-tile v-for="(item, i) in stationList" :key="i" @click="filter(item.id)">
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list style="height:calc(100vh - 110px);overflow :auto" v-loading="loading">
        <v-scroll-x-transition group>
          <template v-for="(item,index) in companyListShow">
            <v-list-tile :key="index" avatar @click="showDetail(item.id)" ripple>
              <v-list-tile-avatar>
                <vue-initials-img :name="item.brand"/>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.brand"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-scroll-x-transition>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data: () => ({
    loading: true,
    companyListShow: [],
    filted: false,
    selectedStation: []
  }),
  methods: {
    ...mapActions(["getCompanyList"]),
    showDetail(id) {
      this.$router.push({ path: "/mobile/company/" + id });
    },
    filter(id) {
      this.filted = true;
      this.selectedStation = this.stationList.find(element => {
        return element.id === id;
      });
      this.companyListShow = [];
      this.companyList.forEach(element => {
        if (element.station == id) {
          this.companyListShow.push(element);
        }
      });
    },
    reFill() {
      this.companyListShow = this.companyList;
      this.filted = false;
    }
  },
  computed: {
    ...mapGetters(["companyList", "stationList", "userInfo"])
  },
  mounted() {
    this.$emit("updatetab", "company");
    this.loading = true;
    this.getCompanyList({ type: "standard" });
    this.companyListShow = this.companyList;
    if (this.userInfo.role > 1) {
      this.filter(this.userInfo.station);
    }
    this.loading = false;
  }
};
</script>

<style>
</style>
