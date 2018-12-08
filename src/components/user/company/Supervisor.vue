<template>
  <v-container grid-list-lg>
    <v-layout wrap>
      <v-flex v-for="(item,i) in companySupervisor" :key="i" xs4 md3>
        <v-card>
          <v-img
            class="elevation-4 mb-1"
            style="border-radius:3px"
            contain
            :src="item.avatar"
            lazy-src="/static/assets/lazy.jpg"
          >
            <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
              <v-progress-linear indeterminate color="primary" :width="1"></v-progress-linear>
            </v-layout>
          </v-img>
          <v-card-actions>
            <h4 class="subheading font-weight-bold">{{item.name}}</h4>
            <v-spacer></v-spacer>
            <h4 class="subheading font-weight-bold">{{item.index}}</h4>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    companySupervisor: []
  }),
  methods: {
    getSupervisor() {
      this.$ajax
        .get("/company/supervise", {
          params: {
            token: this.userInfo.token,
            id: this.$route.params.id
          }
        })
        .then(data => {
          data = data.data;
          // console.log(data);
          this.companySupervisor = data.companySupervisor;
        });
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    this.getSupervisor();
  }
};
</script>

<style>
</style>
