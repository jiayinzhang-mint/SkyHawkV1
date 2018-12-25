<template>
  <div>
    <v-toolbar flat color="transparent">
      <v-toolbar-title>
        <span class="hidden-sm-and-down">SkyHawk 设置</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-divider></v-divider>
    <v-container
      style="height:calc(100vh - 64px);overflow :auto;padding-top:0 !important"
      class="no-scrollbar"
    >
      <v-list class="aero-x">
        <template v-for="(item,i) in userSetting">
          <div :key="i">
            <v-layout v-if="item.heading" :key="i" row align-center>
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-layout>
            <v-list-tile v-else>
              <v-list-tile-title>{{item.title}}</v-list-tile-title>
              <v-list-tile-action>
                <el-switch v-model="item.value" active-color="#13ce66" inactive-color="#000000"></el-switch>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
          </div>
        </template>
      </v-list>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "settingCenter",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["userSetting"])
  }
};
</script>

<style>
</style>
