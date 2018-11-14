<template>
    <v-layout row wrap>
        <v-scroll-x-transition>

            <v-flex xs12>
                <v-card color="flat">
                    <v-container fluid grid-list-lg>
                        <v-layout row>
                            <v-flex xs8>
                                <div>
                                    <div class="headline">{{userInfo.name}}</div>
                                    <div>{{userInfo.username}}</div>
                                    <div>{{userInfo.phone}}</div>
                                </div>
                            </v-flex>
                            <v-flex xs4>
                                <v-avatar size="100px">
                                    <vue-initials-img :name="userInfo.username" />
                                </v-avatar>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-btn depressed block color="primary" dark @click="logOut">注销</v-btn>
                </v-card>

            </v-flex>
        </v-scroll-x-transition>
    </v-layout>

</template>

<script>
import { mapGetters } from "vuex";
export default {
    data: () => ({}),
    methods: {
        logOut() {
            this.$router.push({ path: "/" });
        }
    },
    computed: {
        ...mapGetters(["userInfo"])
    },
    mounted() {
        this.$emit("updatetab", "user");
    }
};
</script>

<style>
</style>
