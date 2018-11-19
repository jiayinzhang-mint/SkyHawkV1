<template>
    <v-list class="transparent">
        <template v-for="(item,index) in companyListShow">
            <v-list-tile :key="index" avatar @click="" ripple>
                <v-list-tile-avatar>
                    <vue-initials-img :name="item.brand" />
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title v-html="item.brand"></v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    本月共 {{item.freq}} 次
                </v-list-tile-action>
            </v-list-tile>
        </template>
    </v-list>
</template>

<script>
export default {
    data() {
        return {
            companyListShow: [
                {
                    brand: "biu"
                },
                {
                    brand: "biu"
                },
                {
                    brand: "biu"
                },
                {
                    brand: "biu"
                },
                {
                    brand: "biu"
                },
                {
                    brand: "biu"
                },
                {
                    brand: "biu"
                },
                {
                    brand: "biu"
                }
            ]
        };
    },
    methods: {
        showDetail(id) {
            this.$router.push({ path: "/company/" + id });
        }
    }
};
</script>

<style>
</style>
