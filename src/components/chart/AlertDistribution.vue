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
        }
      }
    };
    return {
      alertDis: {
        columns: ["type", "count"],
        rows: [
          { type: "鼠患", count: 1393 },
          { type: "口罩", count: 3530 },
          { type: "过热", count: 2923 }
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
      .get("/alert/statistic", {
        params: {
          token: this.userInfo.token,
          day: "today"
        }
      })
      .then(data => {
        this.today = data.data;
        this.alertDis.rows[0].count = this.today.mouse + 1;
        this.alertDis.rows[1].count = this.today.mask + 1;
        this.alertDis.rows[2].count = this.today.humiture + 1;
      });
  }
};
</script>

<style>
</style>
