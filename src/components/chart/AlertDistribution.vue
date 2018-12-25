<template>
  <ve-pie
    :settings="alertDisSettings"
    :colors="colors"
    :extend="extend"
    :data="alertDis"
    ref="alertDis"
  ></ve-pie>
</template>

<script>
import VePie from "v-charts/lib/pie.common";
import { mapGetters } from "vuex";

export default {
  components: { VePie },
  data() {
    this.colors = ["#3fb1e3", "#6be6c1", "#a0a7e6", "#c4ebad", "#96dee8"];
    this.extend = {
      legend: {
        textStyle: {
          color: "#fff"
        },
        selectedMode: false
      }
    };
    return {
      alertDis: {
        columns: ["type", "count"],
        rows: [
          { type: "鼠患", count: 0 },
          { type: "口罩未戴", count: 0 },
          { type: "温度超标", count: 0 },
          { type: "帽子未戴", count: 0 }
        ]
      },
      alertDisSettings: {
        labelMap: {
          type: "类型"
        }
      },
      today: {}
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    //调整图标宽度
    setTimeout(() => {
      this.$refs["alertDis"].echarts.resize();
    }, 500);
    this.$ajax
      .get("/dashboard/alertdistribution", {
        params: {
          token: this.userInfo.token,
          role: this.userInfo.role,
          station: this.userInfo.station
        }
      })
      .then(data => {
        data = data.data.alertDis;
        this.alertDis.rows[0].count = data.mouse;
        this.alertDis.rows[1].count = data.mask;
        this.alertDis.rows[2].count = data.humiture;
        this.alertDis.rows[3].count = data.hat;
      });
  }
};
</script>

<style>
</style>
