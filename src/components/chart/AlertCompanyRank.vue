<template>
  <v-list class="transparent" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.3)">
    <template v-for="(item,index) in companyList">
      <div :key="index">
        <v-list-tile avatar @click="showDetail(item.id)" ripple>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.brand"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action v-html="item.station.name"></v-list-tile-action>
        </v-list-tile>
        <v-divider></v-divider>
      </div>
    </template>
  </v-list>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: true,
      companyList: []
    };
  },
  methods: {
    showDetail(id) {
      this.$router.push({ path: "/company/" + id });
    }
  },
  mounted() {
    this.$ajax
      .get("/dashboard/alertrank", {
        params: {
          token: this.userInfo.token,
          role: this.userInfo.role,
          station: this.userInfo.station,
          company: true
        }
      })
      .then(data => {
        this.companyList = data.data.companyList;
        this.companyList.forEach(i => {
          i.station = this.stationList.find(j => {
            return j.id == i.station;
          });
        });
        this.loading = false;
      });
  },
  computed: {
    ...mapGetters(["userInfo", "stationList"])
  }
};
</script>

<style>
</style>
