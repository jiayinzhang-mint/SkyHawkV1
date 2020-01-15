<template>
  <div>
    <v-toolbar color="grey darken-3">
      <v-menu
        class="ml-3"
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="date"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template>
          <v-text-field
            hide-detail
            single-line
            label="日期"
            v-model="date"
            readonly
            slot="activator"
          ></v-text-field>
        </template>
        <v-date-picker locale="zh-cn" v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menu = false">取消</v-btn>
          <v-btn flat color="primary" @click="$refs.menu.save(date)"
            >确认</v-btn
          >
        </v-date-picker>
      </v-menu>
      <v-select
        dense
        single-line
        class="ml-4"
        v-if="userInfo.role <= 1"
        style="max-width:200px"
        v-model="stationID"
        hide-detail
        :items="stationListShow"
        item-text="name"
        item-value="id"
        label="辖区"
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn @click="getStatistic">查询</v-btn>
    </v-toolbar>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs2>
          <v-card>
            <v-card-title>告警数量</v-card-title>
            <v-card-text class="display-1 font-weight-black">{{
              statistic.count || 0
            }}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs2>
          <v-card>
            <v-card-title>下发率</v-card-title>
            <v-card-text class="display-1 font-weight-black"
              >{{ (statistic.countPush || 0).toFixed(2) }} %</v-card-text
            >
          </v-card>
        </v-flex>
        <v-flex xs2>
          <v-card>
            <v-card-title>错误率</v-card-title>
            <v-card-text class="display-1 font-weight-black"
              >{{ (statistic.countErr || 0).toFixed(2) }} %</v-card-text
            >
          </v-card>
        </v-flex>
        <v-flex xs2>
          <v-card>
            <v-card-title>整改率</v-card-title>
            <v-card-text class="display-1 font-weight-black"
              >{{ (statistic.countFix || 0).toFixed(2) }} %</v-card-text
            >
          </v-card>
        </v-flex>
        <v-flex xs2>
          <v-card>
            <v-card-title>完成率</v-card-title>
            <v-card-text class="display-1 font-weight-black"
              >{{ (statistic.countFinish || 0).toFixed(2) }} %</v-card-text
            >
          </v-card>
        </v-flex>
        <v-flex xs2>
          <v-card>
            <v-card-title>涉及企业</v-card-title>
            <v-card-text class="display-1 font-weight-black">{{
              statistic.companyNum
            }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-data-table
      :headers="headers"
      :items="statistic.alertList"
      no-data-text="暂无数据"
      rows-per-page-text="每页项数"
      :rows-per-page-items="rowsPerPage"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.title }}</td>
        <td class="text-xs-center">
          {{ props.item.create_time | moment("YYYY-MM-DD HH:mm:ss") }}
        </td>
        <td class="text-xs-center">
          <v-btn
            flat
            round
            color="primary"
            :to="`/company/${props.item.company}/info`"
          >
            {{ props.item.brand }}
          </v-btn>
        </td>
        <td class="text-xs-center" v-if="props.item.state == 1">
          监管部门处理中
        </td>
        <td class="text-xs-center" v-else-if="props.item.state == 2">
          企业整改中
        </td>
        <td class="text-xs-center" v-else-if="props.item.state == 3">
          整改审核中
        </td>
        <td class="text-xs-center" v-else-if="props.item.state == 4">已完成</td>
        <td class="text-xs-center" v-else-if="props.item.state == 9">
          告警错误
        </td>
        <td class="text-xs-center">
          <v-btn :to="`/alert/${props.item.id}`" flat round color="primary"
            >详情</v-btn
          >
        </td>
      </template>
      <template slot="pageText" slot-scope="props"
        >{{ props.pageStart }} - {{ props.pageStop }} 共
        {{ props.itemsLength }} 条记录</template
      >
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    rowsPerPage: [10, 25, { text: "全部", value: -1 }],
    headers: [
      {
        text: "标题",
        align: "center",
        sortable: false,
        value: "username"
      },
      {
        text: "触发时间",
        align: "center",
        sortable: false,
        value: "name"
      },
      {
        text: "企业",
        align: "center",
        sortable: false,
        value: "brand"
      },
      {
        text: "状态",
        value: "phone",
        align: "center",
        sortable: false
      },
      {
        text: "操作",
        align: "center",
        sortable: false
      }
    ],
    menu: false,
    stationID: null,
    statistic: {
      alertList: [],
      count: 0,
      countErr: 0,
      countPush: 0,
      countFix: 0,
      countFinish: 0,
      companyNum: 0
    }
  }),
  methods: {
    async getStatistic() {
      const rsp = await this.$ajax.get("/alert/day", {
        params: {
          date: this.date,
          token: this.userInfo.token,
          stationAlt: this.userInfo.station || this.stationID
        }
      });
      this.statistic = rsp.data;
      this.statistic.alertList.forEach(element => {
        element.brand = this.companyList.find(company => {
          return company.id === element.company;
        }).brand;
      });
    }
  },
  computed: {
    ...mapGetters(["companyList", "stationList", "userInfo"]),
    stationListShow() {
      if (this.userInfo.station) {
        return this.stationList;
      } else {
        return [...this.stationList, { name: "全部", id: null }];
      }
    }
  },
  mounted() {
    this.getStatistic();
    console.log(this.userInfo);
  }
};
</script>

<style>
</style>