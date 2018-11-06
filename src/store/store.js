import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import vuexAlong from 'vuex-along'

if (process.env.NODE_ENV === 'development') {
    Vue.use(Vuex)
}
vuexAlong.onlySession(true)

export default new Vuex.Store({
    state: {
        userInfo: {
            username: "",
            role: "",
            name: "",
            token: "",
            device: ""
        },
        companyList: []
    },
    getters: {
        userInfo: state => {
            return state.userInfo
        },
        companyList: state => {
            return state.companyList
        }
    },
    mutations: {
        updateUserInfo: (state, userInfo) => {
            state.userInfo = userInfo
        },
        getCompanyList: (state) => {
            if (state.companyList.length <= 1) {
                axios
                    .get("/company/list", {
                        params: {
                            token: state.userInfo.token
                        }
                    })
                    .then(data => {
                        state.companyList = data.data.companyList
                    });

            }

        }
    },
    actions: {},
    plugins: [vuexAlong]
})
