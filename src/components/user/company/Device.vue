<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="nvrList"
      hide-actions
      no-data-text="暂无数据"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.3)"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.index }}</td>
        <td class="text-xs-center" v-if="props.item.status == 1">
          <v-chip small text-color="white" color="green">在线</v-chip>
        </td>
        <td class="text-xs-center" v-else>
          <v-chip small text-color="white" color="red darken-3">离线</v-chip>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    loading: true,
    nvrList: [],
    headers: [
      {
        text: "名称",
        align: "center",
        sortable: false
      },
      {
        text: "编号",
        align: "center",
        sortable: false
      },
      {
        text: "状态",
        align: "center",
        sortable: false
      }
    ]
  }),
  methods: {
    getNVRList() {
      this.$ajax
        .get("/monitor/nvr", {
          params: {
            token: this.userInfo.token,
            company: this.$route.params.id
          }
        })
        .then(data => {
          data = data.data;
          this.nvrList = data.nvrList;
          this.loading = false;
        });
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    this.getNVRList();
  }
};
</script>

<style>
</style>
