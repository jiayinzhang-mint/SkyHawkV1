<template>
  <div>
    <v-card flat v-if="humitureShow.length > 1">
      <v-container>
        <ve-line :data="chartData" :grid="grid" :settings="settings" :extend="extend"></ve-line>
      </v-container>
    </v-card>
    <v-tabs v-model="tab" centered icons-and-text>
      <v-tabs-slider></v-tabs-slider>
      <v-tab key="1" @click="alterChart('temperature')">温度
        <v-icon>whatshot</v-icon>
      </v-tab>
      <v-tab key="2" @click="alterChart('humidity')">湿度
        <v-icon>bubble_chart</v-icon>
      </v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-items v-model="tab">
      <v-tab-item key="1">
        <v-toolbar dense class="transparent">
          <v-toolbar-title style="margin-left:-7px">近期监测数据</v-toolbar-title>
          <v-spacer></v-spacer>监控点
          <v-toolbar-items class="ml-2">
            <v-menu open-on-hover bottom offset-y>
              <v-btn slot="activator" flat>
                {{indexList[selectedIndex]}}
                <v-icon>expand_more</v-icon>
              </v-btn>
              <v-list dense>
                <v-list-tile v-for="(item, index) in indexList" :key="index" @click="filter(index)">
                  <v-list-tile-title>{{ item }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-toolbar-items>
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="humitureShow"
          hide-actions
          no-data-text="暂无数据"
          v-loading="loading"
          element-loading-background="rgba(0, 0, 0, 0.3)"
          style="height:calc(100vh - 660px);overflow :auto"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-center">{{ props.item.index }}</td>
            <td class="text-xs-center">{{ props.item.temperature }} °C</td>
            <td class="text-xs-center">{{ props.item.time}}</td>
          </template>
        </v-data-table>
      </v-tab-item>
      <v-tab-item key="2">
        <v-toolbar dense class="transparent">
          <v-toolbar-title style="margin-left:-7px">近期监测数据</v-toolbar-title>
          <v-spacer></v-spacer>监控点
          <v-toolbar-items class="ml-2">
            <v-menu open-on-hover bottom offset-y>
              <v-btn slot="activator" flat>
                {{indexList[selectedIndex]}}
                <v-icon>expand_more</v-icon>
              </v-btn>
              <v-list dense>
                <v-list-tile v-for="(item, index) in indexList" :key="index" @click="filter(index)">
                  <v-list-tile-title>{{ item }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-toolbar-items>
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="humitureShow"
          hide-actions
          no-data-text="暂无数据"
          v-loading="loading"
          element-loading-background="rgba(0, 0, 0, 0.3)"
          style="height:calc(100vh - 660px);overflow :auto"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-center">{{ props.item.index }}</td>
            <td class="text-xs-center">{{ props.item.humidity }} %</td>
            <td class="text-xs-center">{{ props.item.time}}</td>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import VeLine from "v-charts/lib/line.common";
import { mapGetters } from "vuex";
export default {
  components: { VeLine },
  data() {
    return {
      tab: 0,
      humiture: [],
      humitureShow: [],
      humitureClassified: [],
      indexList: [],
      selectedIndex: null,
      loading: true,
      headers: [
        {
          text: "监控点",
          align: "center",
          sortable: false
        },
        {
          text: "温度",
          align: "center",
          sortable: false
        },
        {
          text: "时间",
          align: "center",
          sortable: false
        }
      ],
      extend: {
        legend: {
          textStyle: {
            color: "#fff"
          },
          selectedMode: false
        },
        textStyle: {
          color: "#fff"
        },
        xAxis: {
          axisLabel: {
            color: "#fff"
          },
          type: "time",
          splitLine: {
            lineStyle: {
              opacity: 0.2
            }
          }
        },
        yAxis: {
          axisLabel: {
            color: "#fff"
          },
          splitLine: {
            lineStyle: {
              opacity: 0.2
            }
          },
          // max: 40,
          min: value => {
            return value.min - 2;
          },
          max: value => {
            return value.max + 2;
          }
        }
      },
      settings: {
        labelMap: {
          temperature: "温度",
          humidity: "湿度"
        },
        area: true,
        itemStyle: {
          color: "rgb(76, 159, 236)"
        },
        lineStyle: {
          color: "rgb(76, 159, 236)"
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(18, 164, 240, 0.8)" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(18, 164, 240, 0.1)" // bottom 处的颜色
              }
            ],
            globalCoord: false // 缺省为 false
          }
        },
        symbol: "none"
      },
      grid: {
        top: 50,
        bottom: 15,
        left: 10,
        right: 20
      },
      chartData: {
        columns: ["time", "temperature"],
        rows: []
      }
    };
  },
  methods: {
    getHumiture() {
      this.$ajax
        .get("/monitor/humiture", {
          params: {
            token: this.userInfo.token,
            company: this.$route.params.id
          }
        })
        .then(data => {
          data = data.data;
          this.humiture = data.humiture;
          const humiture = arr => {
            let newArr = [{ index: arr[0].index, data: [] }];
            this.indexList = [arr[0].index];
            for (let i = 1; i < arr.length; i++) {
              if (arr[i].index != arr[i - 1].index || i == 0) {
                newArr.push({ index: arr[i].index, data: [] });
                this.indexList.push(arr[i].index);
              } else {
                for (let j = 0; j < newArr.length; j++) {
                  if (newArr[j].index == arr[i].index) {
                    newArr[j].data.push(arr[i]);
                  }
                }
              }
            }
            return newArr;
          };
          if (data.humiture.length > 1) {
            this.humitureClassified = humiture(data.humiture);
          }
          this.loading = false;
          this.filter(0);
        });
    },
    filter(id) {
      this.selectedIndex = id;
      this.humitureShow = this.humitureClassified[id].data;
      this.chartData.rows = this.humitureShow;
    },
    alterChart(type) {
      this.chartData.columns = ["time", type];
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    this.getHumiture();
    const moment = require("moment");
    // console.log(moment.now());
  }
};
</script>


<style scoped>
::-webkit-scrollbar {
  width: 0px;
}
</style>