<template>
  <v-data-table
    :headers="headers"
    :items="alertListShow"
    no-data-text="暂无数据"
    rows-per-page-text="每页项数"
    :rows-per-page-items="rowsPerPage"
  >
    <template slot="items" slot-scope="props">
      <td class="text-xs-center">{{ props.item.title }}</td>
      <td class="text-xs-center">{{ props.item.create_time | moment("YYYY-MM-DD HH:mm:ss") }}</td>
      <td class="text-xs-center" v-if="props.item.state == 1">监管部门处理中</td>
      <td class="text-xs-center" v-else-if="props.item.state == 2">企业整改中</td>
      <td class="text-xs-center" v-else-if="props.item.state == 3">整改审核中</td>
      <td class="text-xs-center" v-else-if="props.item.state == 4">已完成</td>
      <td class="text-xs-center" v-else-if="props.item.state == 9">告警错误</td>
      <td class="text-xs-center">
        <v-btn flat round color="primary" @click="showAlertDetail(props.item.id)">详情</v-btn>
      </td>
    </template>
    <template
      slot="pageText"
      slot-scope="props"
    >{{ props.pageStart }} - {{ props.pageStop }} 共 {{ props.itemsLength }} 条记录</template>
  </v-data-table>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    alertListShow: [],
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
    ]
  }),
  methods: {
    getAlertList() {
      this.alertListShow = [];
      this.alertList.forEach(element => {
        if (element.company == this.$route.params.id) {
          this.alertListShow.push(element);
        }
      });
    },
    showAlertDetail(id) {
      this.$router.push({ path: "/alert/" + id });
    }
  },
  computed: {
    ...mapGetters(["alertList"])
  },
  mounted() {
    this.getAlertList();
  }
};
</script>

<style>
</style>
