<template>
    <v-app class="dashboard" dark>
        <v-container fluid grid-list-lg>
            <v-layout wrap>

                <v-flex xs6 d-flex>

                    <v-layout row wrap>
                        <v-flex d-flex xs12>

                            <p class="text-xs-center headline font-weight-black mt-2 mb-1" style="color:rgba(255,255,255,0.8);; font-size:18px"> SKYHAWK 告警预测平台</p>

                        </v-flex>
                        <v-flex d-flex xs12>

                            <v-card flat class="aero-lighter">
                                <alert-heat></alert-heat>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex xs6 d-flex>
                    <v-layout row wrap>
                        <v-flex d-flex xs12>
                            <v-card flat class="aero-lighter" height="47vh">
                                <p class="text-xs-center subheading font-weight-black mt-2 mb-1" style="color:rgba(255,255,255,0.8); font-size:18px"> 告警频次</p>
                                <alert-trend></alert-trend>
                            </v-card>
                        </v-flex>
                        <v-flex d-flex xs12>
                            <v-card flat class="aero-lighter" height="47vh">
                                <p class="text-xs-center subheading font-weight-black mt-2 mb-1" style="color:rgba(255,255,255,0.8); font-size:18px"> 告警预测</p>
                                <alert-perdict style="height:90%;overflow :auto"></alert-perdict>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>

            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
import AlertTrend from "@/components/chart/AlertTrend";
import AlertPerdict from "@/components/chart/AlertPerdict";
import AlertHeat from "@/components/chart/AlertHeat";

import CompanyDistribution from "@/components/chart/CompanyDistribution";
import AlertRank from "@/components/chart/AlertRank";
import NewAlert from "@/components/chart/NewAlert";
import AlertDistribution from "@/components/chart/AlertDistribution";

export default {
    components: {
        CompanyDistribution,
        AlertRank,
        NewAlert,
        AlertDistribution,
        AlertTrend,
        AlertPerdict,
        AlertHeat
    }
};
</script>

<style>
</style>
