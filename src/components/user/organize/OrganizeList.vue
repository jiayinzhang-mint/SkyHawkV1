<template>
    <v-layout row>
        <v-flex xs12 sm4>
            <v-toolbar flat color="white">
                <v-toolbar-title style="font-size:17px">组织信息</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card style="height:calc(100vh - 129px);overflow :auto" flat>

                <v-container fluid v-loading="loading">
                    <el-tree :data="organizeList" :props="defaultProps" @node-click="showDetail"></el-tree>

                </v-container>

            </v-card>

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
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
    data: () => ({
        organizeTree: [],
        defaultProps: {
            children: "children",
            label: "name"
        },
        loading: true
    }),
    methods: {
        ...mapActions(["getOrganizeList"]),
        showDetail(item) {
            this.$router.push({ path: "/organize/" + item.id });
        }
    },
    computed: {
        ...mapGetters(["organizeList"])
    },
    mounted() {
        this.getOrganizeList("standard");
        this.loading = false;
    }
};
</script>

<style>
</style>
