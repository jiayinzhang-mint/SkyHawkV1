<template>
  <v-container>
    <v-card v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.3)">
      <v-toolbar flat color="transparent">
        <v-toolbar-title style="font-size:17px">{{alertInfo.title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <div v-if="alertInfo.state==1">
          <div v-if="alertInfo.auto==1">
            <div v-if="userInfo.role==1">
              <el-tooltip
                class="item"
                effect="light"
                content="请求食药监处理"
                placement="top"
                v-if="alertInfo.uncertain !=1"
              >
                <v-btn icon @click.stop="uncertainAlert">
                  <v-icon>flag</v-icon>
                </v-btn>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="light"
                content="标记误报"
                placement="top"
                v-if="alertInfo.uncertain !=1"
              >
                <v-btn icon @click.stop="errorAlert">
                  <v-icon>delete</v-icon>
                </v-btn>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="light"
                content="下发"
                placement="top"
                v-if="alertInfo.uncertain !=1"
              >
                <v-btn icon @click.stop="repostAlert">
                  <v-icon>redo</v-icon>
                </v-btn>
              </el-tooltip>

              <v-menu offset-y class="hidden-lg-and-up">
                <v-btn slot="activator" color="info" dark depressed>处理
                  <v-icon>keyboard_arrow_down</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile v-if="alertInfo.uncertain !=1" @click="uncertainAlert">
                    <v-list-tile-title>不确定</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile v-if="alertInfo.uncertain !=1" @click="errorAlert">
                    <v-list-tile-title>误报</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile v-if="alertInfo.uncertain !=1" @click="repostAlert">
                    <v-list-tile-title>下发</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>

        <div v-else-if="alertInfo.state==2">
          <v-btn depressed round v-if="userInfo.role==4" color="primary" @click="rectifyAlert">我已整改</v-btn>
        </div>
        <div v-else-if="alertInfo.state==3">
          <v-btn depressed round color="primary" v-if="userInfo.role==2" @click="finishAlert">完成</v-btn>
        </div>
        <div v-if="userInfo.role==0">
          <v-btn icon flat @click="deleteAlert">
            <v-icon>clear</v-icon>
          </v-btn>
        </div>
      </v-toolbar>
      <v-tabs v-model="tab" centered>
        <v-tabs-slider></v-tabs-slider>
        <v-tab key="1">基本信息</v-tab>
        <v-tab key="2">流转历史</v-tab>
      </v-tabs>
      <v-divider></v-divider>
      <v-tabs-items
        class="no-scrollbar"
        v-model="tab"
        style="height:calc(100vh - 210px);overflow :auto"
      >
        <v-tab-item key="1">
          <v-container v-if="alertInfo.title!='温度超上限'">
            <img
              :src="alertInfo.src"
              class="image elevation-12"
              style="max-width: 100%;max-height: 100%;border-radius:3px"
              v-viewer
            >
          </v-container>
          <v-list>
            <v-subheader>告警详情</v-subheader>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="primary">info</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{alertInfo.detail}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="primary">redo</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-if="alertInfo.state == 1">监管部门处理中</v-list-tile-title>
                <v-list-tile-title v-else-if="alertInfo.state == 2">企业整改中</v-list-tile-title>
                <v-list-tile-title v-else-if="alertInfo.state == 3">整改审核中</v-list-tile-title>
                <v-list-tile-title v-else-if="alertInfo.state == 4">已完成</v-list-tile-title>
                <v-list-tile-title v-else-if="alertInfo.state == 9">告警错误</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>

            <div v-if="alertInfo.title=='温度超上限'">
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon color="primary">whatshot</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title style="color:#ff5555">{{alertInfo.temperature}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider inset></v-divider>

              <v-list-tile>
                <v-list-tile-action>
                  <v-icon color="primary">bubble_chart</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title style="color:#ff5555">{{alertInfo.humidity}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-divider inset></v-divider>
            </div>

            <v-subheader>企业信息</v-subheader>
            <v-list-tile ripple @click="redirect">
              <v-list-tile-action>
                <v-icon color="primary">assignment_ind</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{company.brand}}</v-list-tile-title>
                <v-list-tile-sub-title>点击查看企业详细信息</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="primary">group</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{station.name}} - {{group.name}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
          </v-list>
        </v-tab-item>
        <v-tab-item key="2">
          <v-container>
            <v-layout row>
              <v-flex xs12 md10 offset-md2>
                <v-timeline align-top dense>
                  <v-timeline-item
                    color="pink"
                    fill-dot
                    small
                    v-if="alertInfo.state>=1&&alertInfo.state<=8"
                  >
                    <v-layout pt-3>
                      <v-flex xs5>
                        <strong>{{alertInfo.create_time | moment("YYYY-MM-DD HH:mm:ss")}}</strong>
                      </v-flex>
                      <v-flex>
                        <strong>触发告警</strong>
                        <div class="caption">交由 监管部门 处理</div>
                      </v-flex>
                    </v-layout>
                  </v-timeline-item>

                  <v-timeline-item color="pink" fill-dot small v-if="alertInfo.uncertain==1">
                    <v-layout wrap pt-3>
                      <v-flex xs5>
                        <strong>{{alertInfo.uncertain_time | moment("YYYY-MM-DD HH:mm:ss")}}</strong>
                      </v-flex>
                      <v-flex>
                        <strong>转发处理</strong>
                        <div class="caption mb-2">交由 食药监 处理</div>
                        <!-- <v-avatar>
                                                    <v-img src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown"></v-img>
                        </v-avatar>-->
                      </v-flex>
                    </v-layout>
                  </v-timeline-item>

                  <v-timeline-item
                    color="pink"
                    fill-dot
                    small
                    v-if="alertInfo.state>=2&&alertInfo.state<=8 && alertInfo.auto==1"
                  >
                    <v-layout wrap pt-3>
                      <v-flex xs5>
                        <strong>{{alertInfo.repost_time | moment("YYYY-MM-DD HH:mm:ss")}}</strong>
                      </v-flex>
                      <v-flex>
                        <strong>下发整改</strong>
                        <div class="caption mb-2">交由 {{station.name}}-{{group.name}} 处理</div>
                        <!-- <v-avatar>
                                                    <v-img src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown"></v-img>
                        </v-avatar>-->
                      </v-flex>
                    </v-layout>
                  </v-timeline-item>

                  <v-timeline-item
                    color="pink"
                    fill-dot
                    small
                    v-if="alertInfo.state>=3&&alertInfo.state<=8"
                  >
                    <v-layout pt-3>
                      <v-flex xs5>
                        <strong>{{alertInfo.rectify_time | moment("YYYY-MM-DD HH:mm:ss")}}</strong>
                      </v-flex>
                      <v-flex>
                        <strong>企业反馈</strong>
                        <div class="caption mb-2">交由 {{station.name}}-{{group.name}} 审核</div>
                      </v-flex>
                    </v-layout>
                  </v-timeline-item>

                  <v-timeline-item
                    color="pink"
                    fill-dot
                    small
                    v-if="alertInfo.state>=4&&alertInfo.state<=8"
                  >
                    <v-layout pt-3>
                      <v-flex xs5>
                        <strong>{{alertInfo.finish_time | moment("YYYY-MM-DD HH:mm:ss")}}</strong>
                      </v-flex>
                      <v-flex>
                        <strong>整改完成</strong>
                      </v-flex>
                    </v-layout>
                  </v-timeline-item>

                  <v-timeline-item color="pink" fill-dot small v-if="alertInfo.state==9">
                    <v-layout pt-3>
                      <v-flex xs5>
                        <strong>{{alertInfo.error_time | moment("YYYY-MM-DD HH:mm:ss")}}</strong>
                      </v-flex>
                      <v-flex>
                        <strong>告警错误</strong>
                      </v-flex>
                    </v-layout>
                  </v-timeline-item>
                </v-timeline>
              </v-flex>
            </v-layout>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  data: () => ({
    alertInfo: [],
    loading: true,
    tab: 0,
    company: [],
    station: [],
    group: []
  }),
  methods: {
    ...mapActions(["updateAlert"]),
    ...mapMutations(["markError", "markUncertain", "markRepost"]),
    getAlertInfo() {
      this.loading = true;
      this.$ajax
        .get("/alert/detail", {
          params: {
            token: this.userInfo.token,
            id: this.$route.params.id
          }
        })
        .then(data => {
          data = data.data;
          this.loading = false;
          this.alertInfo = data.alertInfo;
          this.company = this.companyList.find(element => {
            return element.id == this.alertInfo.company;
          });

          this.station = this.organizeList[1].children.find(element => {
            return element.id == this.company.station;
          });

          this.group = this.station.children.find(element => {
            return element.id == this.company.besupervised;
          });
        });
    },
    redirect() {
      this.$router.push({ path: "/company/" + this.company.id });
    },
    uncertainAlert() {
      this.$confirm("本条告警将交由食药监处理", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
        roundButton: true,
        center: true,
        showClose: false,
        closeOnClickModal: false
      })
        .then(() => {
          this.updateAlert({
            type: "uncertain",
            alert: this.$route.params.id
          }).then(() => {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.getAlertInfo();
            this.markUncertain({ alert: this.$route.params.id });
            this.$emit("updatealertlist");
          });
        })
        .catch(() => {});
    },
    errorAlert() {
      this.$confirm("本条告警将被记为误报", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        roundButton: true,
        center: true,
        showClose: false,
        closeOnClickModal: false
      })
        .then(() => {
          this.updateAlert({
            type: "error",
            alert: this.$route.params.id
          }).then(() => {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.getAlertInfo();
            this.markError({ alert: this.$route.params.id });
            this.$emit("updatealertlist");
          });
        })
        .catch(() => {});
    },
    repostAlert() {
      this.$confirm(
        "本条告警将交由 " + this.station.name + "-" + this.group.name + " 处理",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
          roundButton: true,
          center: true,
          showClose: false,
          closeOnClickModal: false
        }
      )
        .then(() => {
          this.updateAlert({
            type: "repost",
            alert: this.$route.params.id
          }).then(() => {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.getAlertInfo();
            this.markRepost({ alert: this.$route.params.id });
            this.$emit("updatealertlist");
          });
        })
        .catch(() => {});
    },
    rectifyAlert() {
      this.$confirm("确认整改完成?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        roundButton: true,
        center: true,
        showClose: false,
        closeOnClickModal: false
      })
        .then(() => {
          this.updateAlert({
            type: "rectify",
            alert: this.$route.params.id
          }).then(() => {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.getAlertInfo();
          });
        })
        .catch(() => {});
    },
    finishAlert() {
      this.$confirm("确认处理完毕?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        roundButton: true,
        center: true,
        showClose: false,
        closeOnClickModal: false
      })
        .then(() => {
          this.updateAlert({
            type: "finish",
            alert: this.$route.params.id
          }).then(() => {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.getAlertInfo();
          });
        })
        .catch(() => {});
    },
    deleteAlert() {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
        roundButton: true,
        center: true,
        showClose: false,
        closeOnClickModal: false
      })
        .then(() => {
          this.updateAlert({
            type: "delete",
            alert: this.$route.params.id
          }).then(() => {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.$emit("refreshalertlist");
            this.$router.push({ path: "/alert" });
          });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.getAlertInfo();
  },
  computed: {
    ...mapGetters(["userInfo", "companyList", "organizeList", "stationList"])
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.getAlertInfo();
    this.tab = 0;
  }
};
</script>

<style>
</style>
