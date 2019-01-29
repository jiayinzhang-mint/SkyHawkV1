<template>
  <v-layout row>
    <v-flex sm3>
      <v-toolbar color="grey darken-3" flat>
        <v-scroll-x-transition>
          <v-toolbar-title style="font-size:17px" v-if="!filted || userInfo.role>1 ">企业列表</v-toolbar-title>
        </v-scroll-x-transition>
        <v-spacer></v-spacer>
        <v-scroll-x-transition>
          <v-chip v-if="filted && userInfo.role<=1" close @input="reFill">{{selectedStation.name}}</v-chip>
        </v-scroll-x-transition>
        <v-toolbar-items>
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
        </v-toolbar-items>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list
        style="height:calc(100vh - 129px);overflow :auto"
        v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
      >
        <el-scrollbar style="height:100%">
          <v-scroll-x-transition group>
            <template v-for="(item,index) in companyListShow">
              <div :key="index">
                <v-list-tile
                  :to=" '/company/' +item.id+'/info'"
                  ripple
                  active-class="grey darken-2"
                >
                  <v-list-tile-content>
                    <v-list-tile-title
                      class="text-uppercase"
                      style="color:white"
                      v-html="item.brand"
                    ></v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>
              </div>
            </template>
          </v-scroll-x-transition>
        </el-scrollbar>
      </v-list>
    </v-flex>
    <v-flex sm9>
      <v-scroll-y-transition>
        <router-view v-if="this.$route.params.id"></router-view>
      </v-scroll-y-transition>
      <v-container v-if="!this.$route.params.id" fluid fill-height>
        <v-layout align-center justify-center>
          <div class="headline font-weight-light">请选择企业</div>
        </v-layout>
      </v-container>
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
