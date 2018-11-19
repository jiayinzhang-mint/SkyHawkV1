<template>
    <v-list class="transparent" id="expenselist">
        <transition name="el-zoom-in-top">
            <div v-show="show">
                <template v-for="(item, index) in items">
                    <v-list-tile :key="item.id" avatar ripple>
                        <v-list-tile-content>
                            <v-list-tile-title>{{item.brand}}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            {{item.station}}
                        </v-list-tile-action>
                        <v-list-tile-action style="width:150px">
                            {{item.type}}
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
                </template>
            </div>
        </transition>
    </v-list>

</template>

<script>
import { mapGetters } from "vuex";

export default {
    data: () => ({
        items: [],
        itemShow: [],
        tileCount: 0,
        pageCount: 0,
        currentPage: 1,
        show: true,
        companyListAlt: []
    }),
    computed: {
        ...mapGetters(["companyList", "stationList", "userInfo"])
    },
    methods: {
        refreshData() {
            setInterval(() => {
                // console.log(id);
                if (this.userInfo.role == 1) {
                    var id = Math.floor(
                        Math.random() * this.companyList.length
                    );
                    this.items.unshift({
                        brand: this.companyList[id].brand,
                        station: this.stationList.find(element => {
                            return element.id === this.companyList[id].station;
                        }).name,
                        type: "温度超上限"
                    });
                } else {
                    this.companyList.forEach(element => {
                        if (element.station == this.userInfo.station) {
                            this.companyListAlt.push(element);
                        }
                    });
                    var id = Math.floor(
                        Math.random() * this.companyList.length
                    );

                    this.items.unshift({
                        brand: this.companyListAlt[id].brand,
                        station: this.stationList.find(element => {
                            return element.id === this.userInfo.station;
                        }).name,
                        type: "温度超上限"
                    });
                }
            }, 5000);
        }
    },
    mounted() {
        this.refreshData();
    }
};
</script>
