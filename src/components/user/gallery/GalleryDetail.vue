<template>
    <v-container>
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title style="font-size:17px">{{companyInfo.brand}}</v-toolbar-title>
            </v-toolbar>
            <v-list>
                <v-subheader>企业信息</v-subheader>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon color="primary">assignment_ind</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{companyInfo.name}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider inset></v-divider>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon color="primary">location_on</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{companyInfo.address}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider inset></v-divider>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon color="primary">person</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{companyInfo.legalperson}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider inset></v-divider>
                <v-subheader>营业执照</v-subheader>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon color="primary">assignment</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{companyInfo.license}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-subheader>执照到期时间</v-subheader>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon color="primary">av_timer</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{companyInfo.validity}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

            </v-list>

        </v-card>
    </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data: () => ({
        companyInfo: []
    }),
    methods: {
        getCompanyInfo() {
            this.$ajax
                .get("/company/detail", {
                    params: {
                        token: this.userInfo.token,
                        id: this.$route.params.id
                    }
                })
                .then(data => {
                    this.companyInfo = data.data.companyDetail;
                    // console.log(this.companyInfo);
                });
        }
    },
    mounted() {
        this.getCompanyInfo();
    },
    computed: {
        ...mapGetters(["userInfo"])
    },
    beforeRouteUpdate(to, from, next) {
        next();
        this.getCompanyInfo();
    }
};
</script>

<style>
</style>
