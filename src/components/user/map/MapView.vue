<template>
  <div class="row">
    <div
      class="mapview"
      id="markermap"
      style="height:calc(100vh - 64px);overflow :auto"
      v-loading="loadingMap"
      element-loading-background="rgba(0, 0, 0, 0)"
    >
      <v-card
        v-if="userInfo.role==1"
        class="d-inline-block elevation-12 ml-5 mt-5 aero"
        width="300px"
        style="z-index:1"
      >
        <v-toolbar flat class="aero">
          <v-btn icon @click="initTool" v-if="select">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title
            v-html="highlight"
            v-if="!select"
            class="subheading"
            style="margin-left:-8px"
          >请选择辖区</v-toolbar-title>
          <v-toolbar-title v-html="select" class="subheading" v-else></v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-navigation-drawer floating permanent stateless value="true" v-if="!select">
          <v-list dense style="max-height:400px" class="pt-0 pb-0">
            <v-list-group>
              <v-list-tile slot="activator">
                <v-list-tile-title>查看全部</v-list-tile-title>
              </v-list-tile>

              <v-list-tile v-for="(item,i) in stationList" :key="i" @click="selectStation(item.id)">
                <v-list-tile-title v-text="item.name"></v-list-tile-title>
              </v-list-tile>
            </v-list-group>
          </v-list>
        </v-navigation-drawer>
      </v-card>
      <v-card
        v-else
        class="d-inline-block elevation-12 ml-5 mt-5 aero"
        width="300px"
        style="z-index:1"
      >
        <v-toolbar flat>
          <v-toolbar-title class="subheading" style="margin-left:-8px">请选择企业</v-toolbar-title>
        </v-toolbar>
      </v-card>
      <v-card
        class="elevation-12 ml-5 mt-2 aero"
        width="300px"
        style="z-index:1"
        v-if="select && !selectCompany"
      >
        <v-toolbar flat class="aero">
          <v-toolbar-title
            style="margin-left:-8px"
            class="subheading"
            v-html="highlightCompany"
          >请选择企业</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-navigation-drawer floating permanent stateless value="true" v-if="!selectCompany">
          <v-list style="max-height:400px" class="pt-0 pb-0">
            <v-list-group>
              <v-list-tile slot="activator">
                <v-list-tile-title>查看全部</v-list-tile-title>
              </v-list-tile>

              <v-list-tile
                v-for="(item,i) in companyListShow"
                :key="i"
                ripple
                @click="glanceCompany(item.id);selectCompany = item.brand"
              >
                <v-list-tile-avatar size="32px">
                  <vue-initials-img :name="item.brand"/>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.brand"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
          </v-list>
        </v-navigation-drawer>
      </v-card>
      <v-scroll-y-transition>
        <v-card
          class="elevation-12 ml-5 mt-2 aero"
          width="300px"
          style="z-index:1"
          v-if="selectCompany"
          v-loading="loadingInfo"
          element-loading-background="rgba(0, 0, 0, 0.3)"
        >
          <v-toolbar class="aero" flat>
            <v-toolbar-title style="margin-left:-8px" class="subheading" v-html="selectCompany"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="backTool">
              <v-icon>clear</v-icon>
            </v-btn>
          </v-toolbar>
          <v-list>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="primary">assignment_ind</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{companyInfo.name}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="primary">location_on</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{companyInfo.address}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="info">person</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title class="subheading" v-html="companyInfo.legalperson"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-btn block color="primary" dark @click="redirect(companyInfo.id)">详细信息</v-btn>
        </v-card>
      </v-scroll-y-transition>
    </div>
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
    station: []
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
          // console.log(this.companyList);
          this.companyList.forEach(element => {
            if (
              element.station == this.userInfo.station ||
              this.userInfo.role == 1
            ) {
              var marker = new AMap.CircleMarker({
                map: this.map,
                center: element.location.split(","),
                radius: 8,
                strokeColor: "white",
                strokeWeight: 2,
                strokeOpacity: 0.5,
                fillColor: "#1E88E5",
                fillOpacity: 0.5,
                zIndex: 10,
                cursor: "pointer",
                clickable: true
              });
              const that = this;
              marker.on("mouseover", function() {
                marker.setOptions({ fillColor: "white" });
              });
              marker.on("mouseout", function() {
                marker.setOptions({ fillColor: "#1E88E5" });
              });
              marker.on("click", function() {
                that.selectCompany = element.brand;
                marker.setOptions({ fillColor: "white" });
                // that.selectCompany = element.brand;
                that.map.setCenter(element.location.split(","));
                that.glanceCompany(element.id);
                // console.log(element.id);
              });
            }
          });
        });
    },
    getBoundDis() {
      this.loadingMap = true;
      this.$ajax
        .get("/organize/bound", {
          params: {
            token: this.userInfo.token,
            all: true
          }
        })
        .then(data => {
          this.loadingMap = false;
          this.map = new AMap.Map("markermap", {
            resizeEnable: true,
            zoom: 40,
            center: [121.476657, 31.252857],
            mapStyle: "amap://styles/393a749e1b6c87ab7352ecede1ba25a7"
          });
          const that = this;
          // console.log(data.data);
          data = data.data;
          this.boundaryList = data;
          data.forEach(element => {
            that.polygon[element.id] = new AMap.Polygon({
              map: that.map,
              path: element.bound,
              strokeColor: "#000000",
              strokeOpacity: 0.2,
              strokeWeight: 3,
              fillColor: "#fff",
              fillOpacity: 0.2,
              bubble: true
            });
            that.polygon[element.id].on("click", function() {
              that.selectStation(element.id);
              that.polygon[element.id].setOptions({
                fillOpacity: 0.5
              });
            });
            that.polygon[element.id].on("mouseover", function() {
              that.polygon[element.id].setOptions({
                fillOpacity: 0.5
              });
              if (that.select == "") {
                that.highlight = element.name;
              }
            });
            that.polygon[element.id].on("mouseout", function() {
              that.polygon[element.id].setOptions({
                fillColor: "#fff",
                fillOpacity: 0.2
              });
              if (that.select == "") {
                that.highlight = "请选择辖区";
              }
            });
            that.polygon[element.id].setMap(that.map);
            var text = new AMap.Text({
              map: that.map,
              text: element.name,
              textAlign: "center", // 'left' 'right', 'center',
              verticalAlign: "middle", //middle 、bottom
              position: element.center,
              clickable: false,
              style: {
                color: "white",
                "background-color": "transparent",
                border: "0px",
                "font-size": "11px"
              },
              bubble: true
            });
            this.map.setFitView();
            this.center = this.map.getCenter();
            this.zoom = this.map.getZoom();
          });
        });
    },
    clearMarkers() {
      this.markers.forEach(element => {
        element.setMap(null);
      });
    },
    initTool() {
      this.select = "";
      this.highlight = "请选择辖区";
      this.highlightCompany = "请选择企业";
      this.selectCompany = "";
      this.map.setCenter(this.center);
      this.map.setZoom(this.zoom);
      this.map.setFitView();
      this.clearMarkers();
    },
    backTool() {
      this.selectCompany = "";
      this.highlightCompany = "请选择企业";
    },
    selectStation(id) {
      this.clearMarkers();
      // console.log(id);
      const station = this.boundaryList.find(element => {
        return element.id === id;
      });
      this.select = station.name;
      this.stationId = id;
      this.map.setCenter(station.center);
      this.map.setFitView([this.polygon[id]]);
      this.companyList.forEach(element => {
        if (element.station == id) {
          this.companyListShow.push(element);
          const marker = new AMap.CircleMarker({
            map: this.map,
            center: element.location.split(","),
            radius: 8,
            strokeColor: "white",
            strokeWeight: 2,
            strokeOpacity: 0.5,
            fillColor: "#1E88E5",
            fillOpacity: 0.5,
            zIndex: 10,
            cursor: "pointer",
            clickable: true
          });
          this.markers.push(marker);
          const that = this;
          marker.on("mouseover", function() {
            if (that.selectCompany == "") {
              that.highlightCompany = element.brand;
            }
            marker.setOptions({ fillColor: "white" });
          });
          marker.on("mouseout", function() {
            if (that.selectCompany == "") {
              that.highlightCompany = "请选择企业";
            }
            marker.setOptions({ fillColor: "#1E88E5" });
          });
          marker.on("click", function() {
            that.selectCompany = element.brand;
            marker.setOptions({ fillColor: "white" });
            // that.selectCompany = element.brand;
            that.map.setCenter(element.location.split(","));
            that.glanceCompany(element.id);
            // console.log(element.id);
          });
        }
      });
    },
    glanceCompany(id) {
      this.loadingInfo = true;
      this.$ajax
        .get("/company/detail", {
          params: {
            token: this.userInfo.token,
            id: id
          }
        })
        .then(data => {
          this.companyInfo = data.data.companyDetail;
          this.loadingInfo = false;
        });
    },
    redirect(id) {
      this.$router.push({ path: "/company/" + id });
    }
  },
  computed: {
    ...mapGetters(["userInfo", "companyList", "stationList"])
  },
  mounted() {
    if (this.userInfo.role > 1) {
      this.getBound();
      this.station = this.stationList.find(element => {
        return element.id === this.userInfo.station;
      });
    } else {
      this.getBoundDis();
    }
  }
};
</script>

<style>
</style>
