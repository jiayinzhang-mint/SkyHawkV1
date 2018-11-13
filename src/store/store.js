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
        companyList: [],
        organizeList: [],
        stationList: [],
        alertList: []
    },
    getters: {
        userInfo: state => {
            return state.userInfo
        },
        companyList: state => {
            return state.companyList
        },
        organizeList: state => {
            return state.organizeList
        },
        stationList: state => {
            return state.stationList
        },
        alertList: state => {
            return state.alertList
        }
    },
    mutations: {
        updateUserInfo: (state, userInfo) => {
            state.userInfo = userInfo
        },
        getCompanyList: (state, companyList) => {
            state.companyList = companyList
        },
        getOrganizeList: (state, organize) => {
            state.organizeList = organize.organizeList
            state.stationList = organize.stationList
        },
        getAlertList: (state, alertList) => {
            state.alertList = alertList
        }
    },
    actions: {
        getCompanyList(context) {
            return new Promise((resolve, reject) => {
                if (context.getters.companyList.length <= 1) {
                    axios
                        .get("/company/list", {
                            params: {
                                token: context.getters.userInfo.token
                            }
                        })
                        .then(data => {
                            context.commit("getCompanyList",
                                data.data.companyList
                            );
                            resolve()
                        });
                } else {
                    resolve()
                }

            })
        },
        getAlertList(context, params) {
            return new Promise((resolve, reject) => {
                if (context.getters.alertList.length <= 1 || params.type == "force") {
                    if (context.getters.userInfo.role <= 1) {
                        console.log(params.page)
                        axios.get("/alert/list", {
                            params: {
                                token: context.getters.userInfo.token,
                                page: params.page,
                                role: context.getters.userInfo.role
                            }
                        }).then(data => {
                            const alertList = data.data.alertList
                            const companyList = context.getters.companyList
                            alertList.forEach(element => {
                                element.brand = companyList.find(company => {
                                    return company.id === element.company
                                })
                            });
                            context.commit("getAlertList", alertList)
                            resolve()
                        })
                    } else if (context.getters.userInfo.role >= 1 && context.getters.userInfo.role <= 3) {
                        axios.get("/alert/list", {
                            params: {
                                token: context.getters.userInfo.token,
                                station: context.getters.userInfo.station,
                                stationAlt: params.stationAlt.id,
                                page: params.page,
                                role: context.getters.userInfo.role
                            }
                        }).then(data => {
                            const alertList = data.data.alertList
                            const companyList = context.getters.companyList
                            alertList.forEach(element => {
                                element.brand = companyList.find(company => {
                                    return company.id === element.company
                                })
                            });
                            context.commit("getAlertList", alertList)
                            resolve()
                        })
                    } else {
                        axios.get("/alert/list", {
                            params: {
                                token: context.getters.userInfo.token,
                                company: context.getters.userInfo.company,
                                page: params.page,
                                role: context.getters.userInfo.role
                            }
                        }).then(data => {
                            const alertList = data.data.alertList
                            const companyList = context.getters.companyList
                            alertList.forEach(element => {
                                element.brand = companyList.find(company => {
                                    return company.id === element.company
                                })
                            });
                            context.commit("getAlertList", alertList)
                            resolve()
                        })
                    }
                } else {
                    resolve()
                }
            })

        },
        getOrganizeList(context, params) {
            return new Promise((resolve, reject) => {
                if (context.getters.organizeList.length <= 1 || params.type == "force") {
                    axios
                        .get("/organize/list", {
                            params: {
                                token: context.getters.userInfo.token,
                                all: true
                            }
                        })
                        .then(data => {
                            const organizeList = data.data.organizeTree;
                            const stationList = []
                            organizeList[1].children.forEach(element => {
                                const temp = {}
                                temp.id = element.id
                                temp.name = element.name
                                stationList.push(temp)
                            });
                            const organize = {
                                "organizeList": organizeList,
                                "stationList": stationList
                            }
                            context.commit("getOrganizeList", organize)
                            resolve()
                        });
                } else (
                    resolve()
                )
            })

        },
        updateAlert(context, params) {
            return new Promise((resolve, reject) => {
                axios.post("/alert/detail", {
                    token: context.getters.userInfo.token,
                    type: params.type,
                    id: context.getters.userInfo.id,
                    alert: params.alert,
                }).then(data => {
                    resolve()
                })
            })
        }
    },
    plugins: [vuexAlong]
})
