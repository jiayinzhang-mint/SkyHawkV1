<template>
  <v-app class="dashboard" dark>
    <v-container fluid grid-list-lg>
      <v-layout wrap>
        <v-flex xs3 d-flex>
          <v-layout row wrap>
            <v-flex d-flex xs6>
              <v-card flat class="aero-lighter">
                <v-card-title primary-title>
                  <div>
                    <h4 class="body-2">告警数</h4>
                    <h1 class="display-2 mb-0">
                      {{today.alertCount}}
                      <span class="subheading">次</span>
                    </h1>
                    <h4 class="body-1">较昨日 {{yesterday.alertCount}}次</h4>
                  </div>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex d-flex xs6>
              <v-card flat class="aero-lighter">
                <v-card-title primary-title>
                  <div>
                    <h4 class="body-2">涉及企业</h4>
                    <h1 class="display-2 mb-0">
                      {{today.companyCount}}
                      <span class="subheading">家</span>
                    </h1>
                    <h4 class="body-1">较昨日 {{yesterday.companyCount}}家</h4>
                  </div>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex d-flex xs6>
              <v-card flat class="aero-lighter">
                <v-card-title primary-title>
                  <div>
                    <h4 class="body-2">待处理</h4>
                    <h1 class="display-2 mb-0">
                      {{today.alertUnprocessed}}
                      <span class="subheading">次</span>
                    </h1>
                    <h4 class="body-1">较昨日 {{yesterday.alertUnprocessed}}次</h4>
                  </div>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex d-flex xs6>
              <v-card flat class="aero-lighter">
                <v-card-title primary-title>
                  <div>
                    <h4 class="body-2">完成率</h4>
                    <h1 class="display-2 mb-0">
                      {{today.finishRate}}
                      <span class="subheading">%</span>
                    </h1>
                    <h4 class="body-1">较昨日 {{yesterday.finishRate}}%</h4>
                  </div>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex d-flex xs6>
              <v-card flat class="aero-lighter">
                <v-card-title primary-title>
                  <div>
                    <h4 class="body-2">误报率</h4>
                    <h1 class="display-2 mb-0">
                      {{today.errorRate}}
                      <span class="subheading">%</span>
                    </h1>
                    <h4 class="body-1">较昨日 {{yesterday.errorRate}}%</h4>
                  </div>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex d-flex xs6>
              <v-card flat class="aero-lighter">
                <v-card-title primary-title>
                  <div>
                    <h4 class="body-2">转交率</h4>
                    <h1 class="display-2 mb-0">
                      {{today.transRate}}
                      <span class="subheading">%</span>
                    </h1>
                    <h4 class="body-1">较昨日 {{yesterday.transRate}}%</h4>
                  </div>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex d-flex xs12>
              <v-card flat class="aero-lighter">
                <p
                  class="text-xs-center subheading font-weight-black mt-2 mb-1"
                  style="color:rgba(255,255,255,0.8); font-size:18px"
                >本月告警分布</p>

                <v-container>
                  <alert-distribution style="height:300px"></alert-distribution>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs6 d-flex>
          <v-layout row wrap>
            <v-flex d-flex xs12>
              <p
                class="text-xs-center headline font-weight-black mt-2 mb-1"
                style="color:rgba(255,255,255,0.8);; font-size:18px"
              >SKYHAWK 告警统计平台</p>
            </v-flex>
            <v-flex d-flex xs12>
              <v-card flat class="aero-lighter">
                <company-distribution></company-distribution>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs3 d-flex>
          <v-layout row wrap>
            <v-flex d-flex xs12>
              <v-card flat class="aero-lighter" height="47vh">
                <p
                  class="text-xs-center subheading font-weight-black mt-2 mb-1"
                  style="color:rgba(255,255,255,0.8); font-size:18px"
                >高风险企业</p>
                <alert-rank style="height:90%;overflow :auto"></alert-rank>
              </v-card>
            </v-flex>
            <v-flex d-flex xs12>
              <v-card flat class="aero-lighter" height="47vh">
                <p
                  class="text-xs-center subheading font-weight-black mt-2 mb-1"
                  style="color:rgba(255,255,255,0.8); font-size:18px"
                >最新告警</p>
                <new-alert style="height:90%;overflow :auto"></new-alert>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import CompanyDistribution from "@/components/chart/CompanyDistribution";
import AlertRank from "@/components/chart/AlertCompanyRank";
import NewAlert from "@/components/chart/NewAlert";
import AlertDistribution from "@/components/chart/AlertDistribution";
import { mapGetters } from "vuex";
export default {
  components: { CompanyDistribution, AlertRank, NewAlert, AlertDistribution },
  data: () => ({
    today: {},
    yesterday: {},
    month: {}
  }),

  methods: {
    getStatistic() {
      this.$ajax
        .get("/dashboard/alertstatistic", {
          params: {
            token: this.userInfo.token
          }
        })
        .then(data => {
          data = data.data.statistic;
          console.log(data);
          this.today = data[0];
          this.yesterday = data[1];
        });
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    this.getStatistic();
  }
};
</script>

<style>
</style>
