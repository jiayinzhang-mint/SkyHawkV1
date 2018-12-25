<template>
  <ve-line
    :settings="alertTrendSettings"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.3)"
    :extend="extend"
    :data="alertTrend"
    ref="alertTrend"
  ></ve-line>
</template>

<script>
import VeLine from "v-charts/lib/line.common";
import { mapGetters } from "vuex";

export default {
  components: { VeLine },
  data() {
    this.extend = {
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
          color: "rgba(255,255,255,0.8)"
        },
        splitLine: {
          lineStyle: {
            opacity: 0.2
          }
        }
      },
      yAxis: {
        axisLabel: {
          color: "rgba(255,255,255,0.8)"
        },
        splitLine: {
          lineStyle: {
            opacity: 0.2
          }
        }
      }
    };
    return {
      alertTrendSettings: {
        yAxisName: ["次数"],

        labelMap: {
          count: "次数"
        },
        legendName: {
          访问用户: "访问用户 total: 10000"
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
                color: "rgba(18, 164, 240, 0.1)" // 100% 处的颜色
              }
            ],
            globalCoord: false // 缺省为 false
          }
        }
      },
      alertTrend: {
        columns: ["date", "count"],
        rows: []
      },
      loading: true
    };
  },
  mounted() {
    //调整图标宽度
    setTimeout(() => {
      this.$refs["alertTrend"].echarts.resize();
    }, 500);
    this.$ajax
      .get("/alert/statistic", {
        params: {
          token: this.userInfo.token,
          day: "today"
        }
      })
      .then(data => {
        data = data.data;
        this.alertTrend.rows = data.week;
        // console.log(data.week);
        this.loading = false;
      });
  },
  computed: {
    ...mapGetters(["userInfo"])
  }
};
</script>

<style>
</style>
