<template>
  <v-container
    fluid
    grid-list-lg
    style="height:calc(100vh - 64px);overflow :auto"
    class="no-scrollbar"
  >
    <v-layout row wrap>
      <v-flex xs12>
        <v-layout row align-center>
          <v-flex xs12 md10>
            <h1>今日</h1>
            <v-spacer></v-spacer>
          </v-flex>
        </v-layout>
        <v-layout row align-center>
          <v-flex xs6 md3>
            <v-hover>
              <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                <v-card-title primary-title>
                  <div>
                    <h4 class="body-2 font-weight-black">告警数</h4>
                    <h1 class="display-3 font-weight-light mb-0">
                      {{today.alertCount}}
                      <span class="subheading font-weight-regular">次</span>
                    </h1>
                    <h4 class="body-1">较昨日 {{yesterday.alertCount}}次</h4>
                  </div>
                </v-card-title>
              </v-card>
            </v-hover>
          </v-flex>
          <v-flex xs6 md3>
            <v-hover>
              <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                <v-card-title primary-title>
                  <div>
                    <h4 class="body-2 font-weight-black">涉及企业</h4>
                    <h1 class="display-3 mb-0 font-weight-light">
                      {{today.companyCount}}
                      <span class="subheading font-weight-regular">家</span>
                    </h1>
                    <h4 class="body-1">较昨日 {{yesterday.companyCount}}家</h4>
                  </div>
                </v-card-title>
              </v-card>
            </v-hover>
          </v-flex>
          <v-flex xs6 md3>
            <v-hover>
              <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                <v-card-title primary-title>
                  <div>
                    <h4 class="body-2 font-weight-black">待处理</h4>
                    <h1 class="display-3 mb-0 font-weight-light">
                      {{today.alertUnprocessed}}
                      <span class="subheading font-weight-regular">次</span>
                    </h1>

                    <h4 class="body-1">较昨日 {{yesterday.alertUnprocessed}}次</h4>
                  </div>
                </v-card-title>
              </v-card>
            </v-hover>
          </v-flex>
          <v-flex xs6 md3>
            <v-hover>
              <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                <v-card-title primary-title>
                  <div>
                    <h4 class="body-2 font-weight-black">处理率</h4>
                    <h1 class="display-3 mb-0 font-weight-light">
                      {{today.finishRate}}
                      <span class="subheading font-weight-regular">%</span>
                    </h1>
                    <h4 class="body-1">较昨日 {{yesterday.finishRate}}%</h4>
                  </div>
                </v-card-title>
              </v-card>
            </v-hover>
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
              <alert-trend></alert-trend>
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
import AlertRank from "@/components/chart/AlertCompanyRank";
import { mapGetters } from "vuex";

export default {
  components: { AlertTrend, AlertDistribution, AlertRank },
  data: () => ({
    today: {},
    yesterday: {},
    month: {}
  }),
  watch: {},
  methods: {
    getStatistic() {
      this.$ajax
        .get("/alert/statistic", {
          params: {
            token: this.userInfo.token,
            day: "today"
          }
        })
        .then(data => {
          // this.today = data.data;
          // this.today.stateRate9 = (this.today.stateRate9 * 100).toFixed(2);
        });
      this.$ajax
        .get("/alert/statistic", {
          params: {
            token: this.userInfo.token,
            day: "yesterday"
          }
        })
        .then(data => {
          // this.yesterday = data.data;
          // this.yesterday.stateRate9 = (this.yesterday.stateRate9 * 100).toFixed(
          //   2
          // );
        });
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    this.getStatistic();
    this.$ajax
      .get("/dashboard/alertstatistic", {
        params: {
          token: this.userInfo.token
        }
      })
      .then(data => {
        data = data.data;
        this.today = data.statistic[0];
        this.yesterday = data.statistic[1];
        // console.log(data);
      });
  }
};
</script>

<style scoped>
.gradient {
  background: linear-gradient(rgb(76, 159, 236), rgb(31, 117, 197));
}
</style>
