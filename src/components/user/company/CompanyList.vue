<template>
    <v-layout row>
        <v-flex xs12 sm4>
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title style="font-size:17px">企业列表</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon>sort</v-icon>
                    </v-btn>

                </v-toolbar>
                <v-divider></v-divider>
                <v-list style="height:calc(100vh - 129px);overflow :auto">
                    <template v-for="(item,index) in companyList">
                        <v-list-tile :key="index" avatar @click="showDetail(item.id)" ripple>
                            <v-list-tile-avatar>
                                <vue-initials-img :name="item.brand" />
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="item.brand"></v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-card>
        </v-flex>
        <v-flex sm8>
            <router-view v-if="this.$route.params.id"></router-view>
            <v-card style="height:calc(100vh - 64px);overflow :auto" v-else>
                <v-container fluid fill-height>
                    <v-layout align-center justify-center>
                        <div class="headline font-weight-light">请选择企业</div>
                    </v-layout>
                </v-container>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
    data: () => ({}),
    methods: {
        ...mapMutations(["getCompanyList"]),
        showDetail(id) {
            this.$router.push({ path: "/company/" + id });
        }
    },
    computed: {
        ...mapGetters(["companyList", "userInfo"])
    },
    mounted() {
        this.getCompanyList();
    }
};
</script>

<style>
</style>
