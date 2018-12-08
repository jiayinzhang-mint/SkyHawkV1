<template>
  <v-list class="transparent" two-line>
    <template v-for="(item,index) in alertListShow">
      <div :key="index">
        <v-list-tile ripple @click>
          <v-list-tile-content>
            <v-list-tile-title>
              <v-icon
                color="red"
                style="font-size:16px;margin-bottom:2px"
                v-if="item.state !=5 && item.state!=6  && item.state!=9 "
              >lens</v-icon>
              <span class="font-weight-bold">{{item.brand.brand}}</span>
            </v-list-tile-title>
            <v-list-tile-sub-title class="font-weight-medium body-2">{{item.title}}</v-list-tile-sub-title>
            <v-list-tile-sub-title>{{item.create_time | moment("YYYY-MM-DD HH:mm:ss")}}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-chip color="info" text-color="white" small v-if="item.auto==0">手动</v-chip>
            <v-chip color="green" text-color="white" small v-if="item.auto==1">自动</v-chip>
            <v-chip color="warning" text-color="white" small v-if="item.uncertain==1">不确定</v-chip>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider></v-divider>
      </div>
    </template>
  </v-list>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    loading: true,
    alertListShow: [],
    page: 1,
    filted: false,
    selectedStation: []
  }),
  methods: {
    ...mapActions(["getCompanyList", "getAlertList"]),
    refreshAlertList() {
      this.loading = true;
      // console.log(this.selectedStation);
      this.getAlertList({
        type: "force",
        page: 1,
        // stationAlt: this.selectedStation.id
      }).then(() => {
        this.alertListShow = this.alertList;
        if (this.userInfo.role > 1) {
          this.filter(this.selectedStation.id);
        }
        this.loading = false;
      });
    },
    showDetail(id) {
      this.$router.push({ path: "/alert/" + id });
    },
    filter(id) {
      this.filted = true;
      this.selectedStation = this.stationList.find(element => {
        return element.id === id;
      });
      // console.log(this.selectedStation.id);
      this.alertListShow = [];
      this.alertList.forEach(element => {
        if (element.brand.station == id) {
          this.alertListShow.push(element);
        }
      });
    },
    reFill() {
      this.alertListShow = this.alertList;
      this.filted = false;
    },
    init() {
      if (this.userInfo.role <= 1) {
        this.alertListShow = this.alertList;
      } else if (this.userInfo.role >= 1 && this.userInfo.role <= 3) {
        this.selectedStation = this.stationList.find(element => {
          return element.id === this.userInfo.station;
        });
        // console.log(this.selectedStation.id);
        this.getAlertList({
          type: "standard",
          page: 1,
          stationAlt: this.userInfo.station
        }).then(() => {
          this.alertListShow = this.alertList;
          // this.filter(this.userInfo.station);
          this.loading = false;
        });
      }
    }
  },
  computed: {
    ...mapGetters(["companyList", "alertList", "stationList", "userInfo"])
  },
  mounted() {
    this.init();
    setInterval(() => {
      this.refreshAlertList();
    //   console.log(this.alertListShow);
    }, 60000);
  }
};
</script>

<style>
</style>
