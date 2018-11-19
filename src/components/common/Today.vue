<template>
    <v-container fluid grid-list-xl>
        <v-layout row wrap>
            <v-flex xs12 md10 offset-md1>
                <v-layout row align-center>
                    <v-flex xs12 md10>
                        <h1>今日</h1>
                        <v-spacer></v-spacer>
                    </v-flex>
                </v-layout>
                <v-layout row align-center>

                    <v-flex xs6 md3>
                        <v-hover>
                            <v-card color="blue darken-3" slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                                <v-card-title primary-title>
                                    <div>
                                        <h4 class="body-2">告警数</h4>
                                        <h1 class="display-3 mb-0">120<span class="subheading"> 次</span></h1>
                                        <h4 class="body-1">较昨日 100次</h4>
                                    </div>
                                </v-card-title>
                            </v-card>
                        </v-hover>

                    </v-flex>
                    <v-flex xs6 md3>
                        <v-hover>
                            <v-card color="blue darken-2" slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                                <v-card-title primary-title>
                                    <div>
                                        <h4 class="body-2">涉及企业</h4>
                                        <h1 class="display-3 mb-0">120<span class="subheading"> 家</span></h1>
                                        <h4 class="body-1">较昨日 100家</h4>
                                    </div>
                                </v-card-title>
                            </v-card>
                        </v-hover>
                    </v-flex>
                    <v-flex xs6 md3>
                        <v-hover>
                            <v-card color="blue darken-1" slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                                <v-card-title primary-title>
                                    <div>
                                        <h4 class="body-2">待处理</h4>
                                        <h1 class="display-3 mb-0">120<span class="subheading"> 次</span></h1>
                                        <h4 class="body-1">较昨日 100次</h4>
                                    </div>
                                </v-card-title>
                            </v-card>
                        </v-hover>
                    </v-flex>
                    <v-flex xs6 md3>
                        <v-hover>
                            <v-card color="blue" slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                                <v-card-title primary-title>
                                    <div>
                                        <h4 class="body-2">处理率</h4>
                                        <h1 class="display-3 mb-0">80<span class="subheading"> %</span></h1>
                                        <h4 class="body-1">较昨日 50%</h4>
                                    </div>
                                </v-card-title>
                            </v-card>
                        </v-hover>
                    </v-flex>
                </v-layout>
                <v-layout row wrap class="mt-4">
                    <v-flex xs12 md10>
                        <h1>近期</h1>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>

                    <v-flex xs12>
                        <v-card flat>
                            <v-card-title primary-title>
                                <div>
                                    <h3 class="subheading font-weight-medium mb-0">告警频数</h3>
                                </div>
                            </v-card-title>

                            <v-container>
                                <alert-trend></alert-trend>
                            </v-container>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 md6>
                        <v-card flat>
                            <v-card-title primary-title>
                                <div>
                                    <h3 class="subheading font-weight-medium mb-0">类型分布</h3>
                                </div>
                            </v-card-title>

                            <v-container>
                                <alert-distribution></alert-distribution>
                            </v-container>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 md6>
                        <v-card flat>
                            <v-card-title primary-title>
                                <div>
                                    <h3 class="subheading font-weight-medium mb-0">高风险企业</h3>
                                </div>
                            </v-card-title>

                            <alert-rank style="height:430px;overflow :auto"></alert-rank>
                        </v-card>
                    </v-flex>

                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import AlertTrend from "@/components/chart/AlertTrend";
import AlertDistribution from "@/components/chart/AlertDistribution";
import AlertRank from "@/components/chart/AlertRank";

export default {
    components: { AlertTrend, AlertDistribution, AlertRank },
    data: () => ({}),
    watch: {},
    methods: {}
};
</script>

<style scoped>
.gradient {
    background: linear-gradient(rgb(76, 159, 236), rgb(31, 117, 197));
}
</style>
