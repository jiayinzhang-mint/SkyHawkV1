<template>
    <ve-pie :settings="alertDisSettings" :colors="colors" :extend="extend" :data="alertDis" ref="alertDis"></ve-pie>

</template>

<script>
import VePie from "v-charts/lib/pie.common";

export default {
    components: { VePie },
    data() {
        this.colors = [
            "#3fb1e3",
            "#6be6c1",
            "#a0a7e6",
            "#c4ebad",
            "#96dee8"
        ];
        this.extend = {
            legend: {
                textStyle: {
                    color: "#fff"
                }
            }
        };
        return {
            alertDis: {
                columns: ["type", "访问用户"],
                rows: [
                    { type: "鼠患", 访问用户: 1393 },
                    { type: "口罩", 访问用户: 3530 },
                    { type: "过热", 访问用户: 2923 }
                ]
            },
            alertDisSettings: {
                labelMap: {
                    type: "类型"
                },
            },
           
        };
    },
    mounted() {
        //调整图标宽度
        setTimeout(() => {
            this.$refs["alertDis"].echarts.resize();
        }, 500);
    }
};
</script>

<style>
</style>
