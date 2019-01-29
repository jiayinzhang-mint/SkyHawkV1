<template>
  <v-layout row>
    <v-flex xs12 sm4>
      <v-toolbar flat color="grey darken-3">
        <v-toolbar-title style="font-size:17px">组织信息</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="getOrganizeList('force')">
          <v-icon>refresh</v-icon>
        </v-btn>

        <v-btn
          icon
          @click="newOrganizeDialog=true"
          v-if="selectedOrganize.level!=3 && selectedOrganize.level!=0"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card style="height:calc(100vh - 129px);overflow :auto" flat>
        <v-container
          fluid
          v-loading="loading"
          element-loading-background="rgba(0, 0, 0, 0.3)"
          class="block"
        >
          <el-tree
            :data="organizeList"
            :props="defaultProps"
            @node-click="showDetail"
            default-expand-all
          >
            <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span>
                                <v-btn flat small round color="primary" @click="deleteOrganize(node)">
                                    删除
                                </v-btn>
                            </span>
            </span>-->
          </el-tree>
        </v-container>
      </v-card>
      <el-dialog center title="新建组织" :visible.sync="newOrganizeDialog" width="400px">
        <el-form
          label-position="left"
          ref="organizeForm"
          :model="newOrganizeForm"
          label-width="90px"
        >
          <el-form-item label="名称">
            <el-input v-model="newOrganizeForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <v-btn round depressed color="primary" @click="newOrganize">创建</v-btn>
          <v-btn round flat @click="newOrganizeDialog=false">取消</v-btn>
        </span>
      </el-dialog>
    </v-flex>
    <v-flex sm8>
      <router-view v-if="this.$route.params.id"></router-view>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <div class="headline font-weight-light">请选择组织</div>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    organizeTree: [],
    defaultProps: {
      children: "children",
      label: "name"
    },
    loading: true,
    newOrganizeForm: {},
    selectedOrganize: {
      level: 0
    },
    newOrganizeDialog: false
  }),
  methods: {
    ...mapActions(["getOrganizeList"]),
    showDetail(item) {
      this.selectedOrganize = item;
      this.$router.push({ path: "/manage/organize/" + item.id });
    },
    newOrganize() {
      const level = this.selectedOrganize.level + 1;
      this.newOrganizeDialog = false;
      this.$ajax
        .post("/organize/list", {
          new: true,
          token: this.userInfo.token,
          name: this.newOrganizeForm.name,
          level: level,
          parent: this.selectedOrganize.id
        })
        .then(data => {
          // console.log(data.data);
          this.getOrganizeList({ type: "force" });
        });
    },
    deleteOrganize(node) {
      this.$confirm("此操作不可还原, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$ajax
          .delete("/organize/list", {
            params: {
              token: this.userInfo.token,
              id: node.data.id
            }
          })
          .then(data => {
            data = data.data;
            if (data.msg == "success") {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.getOrganizeList({ type: "force" });
              this.$router.push("/manage/organize");
            }
          });
      });
    }
  },
  computed: {
    ...mapGetters(["organizeList", "userInfo"])
  },
  mounted() {
    this.getOrganizeList({ type: "standard" });
    this.loading = false;
  }
};
</script>

