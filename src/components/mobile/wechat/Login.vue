<template>
  <v-app id="inspire" class="background">
    <v-content>
      <v-dialog v-model="loading" hide-overlay persistent width="300">
        <v-card color="white">
          <v-card-text>正在加载数据
            <v-progress-linear indeterminate color="primary" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-content>
    <v-footer class="pa-4 trans">
      <div class="jump">
        <img width="20px" style="margin-left:-5px" src="/static/assets/INSDIM.svg">
      </div>
      <v-spacer></v-spacer>
      <div>Copyright &copy; {{ new Date().getFullYear() }} INSDIM Inc. 保留所有权利</div>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      token: this.$route.query.token,
      role: this.$route.query.role,
      url: this.$route.query.url,
      loading: true
    };
  },
  methods: {
    ...mapActions(["getWechatUserInfo", "getCompanyList", "getOrganizeList"])
  },
  mounted() {
    this.getWechatUserInfo({ token: this.token }).then(() => {
      this.getCompanyList()
        .then(() => {
          this.getOrganizeList({ type: "force" });
          console.log(
            "-----------------------Welcome---------------------\n",
            "                      01 0101\n",
            "                      10 101\n",
            "                010101010101010101\n",
            "             101010101010101010101010\n",
            "            010101010101010101010101010\n",
            "          10 1010101010101010101010101010\n",
            "          0101010101  6      01 6     01\n",
            "         10101010101         10       101\n",
            "         0101010101010    0101010   1010 10\n",
            "        101010       010101        0101    1\n",
            "         01010       0101010101010101010   0\n",
            "         101010     010101010     101010 0\n",
            "           010101010101010101010101010101\n",
            "              10101010101010101010101\n",
            "             0101010101010101010101010\n",
            "            10101010101010101010101010\n",
            "           010101010101010101010101010\n",
            "          10101010101010101010101010101\n",
            "---------------------SandHawk----------------------\n",
            "--------------------INSDIM INC.--------------------\n"
          );
        })
        .then(() => {
          if (this.$route.query.url) {
            this.$router.push(this.url);
          } else {
            this.$router.push({ path: "/mobile/alert" });
          }
        });
    });
  }
};
</script>

<style>
.background {
  background-image: url("/static/assets/Back.jpg") !important;
  background-size: 100% 100% !important;
}
.trans {
  background-color: transparent !important;
  color: white !important;
}
.jump :hover {
  cursor: pointer;
}
</style>
