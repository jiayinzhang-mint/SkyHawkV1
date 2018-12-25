<template>
  <div>
    <v-toolbar flat color="transparent">
      <v-toolbar-title>
        <span class="hidden-sm-and-down">用户帮助</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-divider></v-divider>
    <v-container style="height:calc(100vh - 64px);overflow :auto" class="no-scrollbar">
      <span class="subheading font-weight-medium">常见问题</span>
      <v-divider class="mb-4 mt-2"></v-divider>
      <span class="subheading font-weight-medium">仍有疑惑？</span>
      <v-divider class="mb-4 mt-2"></v-divider>
      <el-input
        type="textarea"
        v-model="feedBack"
        :autosize="{ minRows: 8, maxRows: 10}"
        placeholder="请提交反馈"
      ></el-input>
      <v-btn round depressed light block class="mt-3">提交</v-btn>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedBack: ""
    };
  }
};
</script>

<style>
</style>
