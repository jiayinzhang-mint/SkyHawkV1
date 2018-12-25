<template>
  <div>
    <v-toolbar flat color="transparent">
      <v-toolbar-title>
        <span class="hidden-sm-and-down">通知中心</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-divider></v-divider>
    <v-container style="height:calc(100vh - 64px);overflow :auto" class="no-scrollbar">
      <v-card flat class="aero-light mb-3">
        <v-card-title class="font-weight-black">告警</v-card-title>
        <v-divider></v-divider>
        <v-list dense style="max-height:400px" class="pt-0 pb-0 aero-lighter">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-title>今日共 次告警需要处理</v-list-tile-title>
            </v-list-tile>

            <v-list-tile v-for="(item,i) in stationList" :key="i" @click="selectStation(item.id)">
              <v-list-tile-title v-text="item.name"></v-list-tile-title>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-card>
      <v-divider></v-divider>

      <v-card flat class="aero-light mb-3">
        <v-card-title class="font-weight-black">告警</v-card-title>
        <v-divider></v-divider>
        <v-list dense style="max-height:400px" class="pt-0 pb-0 aero-lighter">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-title>今日共 次告警需要处理</v-list-tile-title>
            </v-list-tile>

            <v-list-tile v-for="(item,i) in stationList" :key="i" @click="selectStation(item.id)">
              <v-list-tile-title v-text="item.name"></v-list-tile-title>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stationList: [],
      stationList2: []
    };
  }
};
</script>

<style>
</style>
