<template>
    <ve-line :settings="alertTrendSettings" :extend="extend" :data="alertTrend" ref="alertTrend"></ve-line>
</template>

<script>
import VeLine from "v-charts/lib/line.common";

export default {
    components: { VeLine },
    data() {
        this.extend = {
            legend: {
                textStyle: {
                    color: "#fff"
                }
            },
            textStyle: {
                color: "#fff"
            },
            xAxis: {
                axisLabel: {
                    color: "#fff"
                }
            },
            yAxis: {
                axisLabel: {
                    color: "#fff"
                }
            }
        };
        return {
            alertTrendSettings: {
                yAxisName: ["次数"],
                xAxis: {
                    axisLabel: {
                        color: "red"
                    }
                },

                labelMap: {
                    freq: "次数"
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
                columns: ["date", "freq"],
                rows: [
                    { date: "01-01", freq: 123 },
                    { date: "01-02", freq: 122 },
                    { date: "01-03", freq: 212 },
                    { date: "01-04", freq: 412 },
                    { date: "01-05", freq: 312 },
                    { date: "01-06", freq: 712 }
                ]
            }
        };
    },
    mounted() {
        //调整图标宽度
        setTimeout(() => {
            this.$refs["alertTrend"].echarts.resize();
        }, 500);
    }
};
</script>

<style>
</style>
