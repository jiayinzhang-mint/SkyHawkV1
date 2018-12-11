<template>
    <v-list class="transparent" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.3)">
        <template v-for="(item,index) in month.companyRank">
            <v-list-tile :key="index" avatar @click="" ripple>
                <v-list-tile-avatar>
                    <vue-initials-img :name="item.brand" />
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title v-html="item.brand"></v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    本月共 {{item.count}} 次
                </v-list-tile-action>
            </v-list-tile>
        </template>
    </v-list>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            loading: true,
            month: {}
        };
    },
    methods: {
        showDetail(id) {
            this.$router.push({ path: "/company/" + id });
        }
    },
    mounted() {
        this.$ajax
            .get("/alert/statistic", {
                params: {
                    token: this.userInfo.token,
                    day: "today"
                }
            })
            .then(data => {
                this.month = data.data;
                // console.log(this.month.companyRank);
                this.loading = false;
            });
    },
    computed: {
        ...mapGetters(["companyList", "userInfo"])
    }
};
</script>

<style>
</style>
