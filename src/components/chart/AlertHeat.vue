<template>
  <div class="row">
    <div
      class="mapview"
      id="markermap"
      style="height:calc(96vh - 60px);overflow :auto"
      v-loading="loadingMap"
      element-loading-background="rgba(0, 0, 0, 0)"
    ></div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data: () => ({
    bound: "",
    map: null,
    polygon: null,
    companyListShow: [],
    markers: [],
    polygon: [],
    highlight: "请选择辖区",
    select: "",
    boundaryList: [],
    center: "",
    zoom: "",
    highlightCompany: "请选择企业",
    selectCompany: "",
    companyListShow: [],
    loadingInfo: false,
    loadingMap: false,
    companyInfo: [],
    station: [],
    heatMapData: [],
    heatMap: null
  }),
  methods: {
    ...mapActions(["getCompanyList", "getOrganizeList"]),
    getBound() {
      this.companyListShow = [];
      this.$ajax
        .get("/organize/bound", {
          params: {
            token: this.userInfo.token,
            id: this.userInfo.station
          }
        })
        .then(data => {
          // console.log(data.data.bound.bound);

          this.map = new AMap.Map("markermap", {
            resizeEnable: true,
            zoom: 40,
            center: [121.476657, 31.252857],
            mapStyle: "amap://styles/393a749e1b6c87ab7352ecede1ba25a7"
          });

          var map = this.map;

          const that = this;

          this.map.plugin(["AMap.Heatmap"], function() {
            //初始化heatmap对象
            that.heatMap = new AMap.Heatmap(map, {
              radius: 20, //给定半径
              opacity: [0, 0.61]
            });
          });

          this.polygon = new AMap.Polygon({
            map: this.map,
            path: data.data[0].bound,
            strokeColor: "#000000",
            strokeOpacity: 0.3,
            strokeWeight: 3,
            fillColor: "#fff",
            fillOpacity: 0.2,
            bubble: true
          });
          this.polygon.setMap(this.map);
          this.map.setFitView();
        })
        .then(data => {
          //console.log(this.companyList);
          const map = this.map;
          const that = this;
          this.heatMap.setDataSet({
            data: this.heatMapData,
            max: 100
          });
        //   console.log(this.heatMapData);
        })
        .then(() => {});
    }
  },
  computed: {
    ...mapGetters(["userInfo", "companyList", "stationList"])
  },
  mounted() {
    this.companyList.forEach(element => {
      if (this.userInfo.role == 1) {
        this.heatMapData.push({
          lng: element.location.split(",")[0],
          lat: element.location.split(",")[1],
          count: 1000
        });
      } else {
        if (element.station == this.userInfo.station) {
          this.heatMapData.push({
            lng: element.location.split(",")[0],
            lat: element.location.split(",")[1],
            count: 1000
          });
        }
      }
    });
    this.getBound();
    this.station = this.stationList.find(element => {
      return element.id === this.userInfo.station;
    });
  }
};
</script>

<style>
</style>
