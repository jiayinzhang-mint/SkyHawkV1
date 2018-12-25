import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import vuexAlong from 'vuex-along'

if (process.env.NODE_ENV === 'development') {
    Vue.use(Vuex)
}
// vuexAlong.onlySession(true)
vuexAlong.watchSession(['userInfo', 'companyList', 'organizeList', 'stationList', 'alertList', 'alertPage', 'statistic'])
vuexAlong.watch(['userSetting'])

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
        alertList: [],
        alertPage: 1,
        statistic: [
            
        ],
        userSetting: [
            { heading: "告警" },
            {
                title: "通知推送",
                label: "notification",
                value: true
            },
            {
                title: "推送频率",
                label: "alertFreq",
                value: true
            }
        ]
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
        },
        alertPage: state => {
            return state.alertPage
        },
        notificationList: state => {
            return state.notificationList
        },
        userSetting: state => {
            return state.userSetting
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
        },
        restoreAlertPage: (state) => {
            state.alertPage = 1
        },
        getMoreAlert: (state, alertList) => {
            state.alertPage = state.alertPage + 1
            alertList.forEach(element => {
                state.alertList.push(element)
            });
        },
        markError: (state, params) => {
            state.alertList.forEach(element => {
                if (element.id == params.alert) {
                    element.state = 9
                }
            });
        },
        markUncertain: (state, params) => {
            state.alertList.forEach(element => {
                if (element.id == params.alert) {
                    element.uncertain = 1
                }
            });
        },
        markRepost: (state, params) => {
            state.alertList.forEach(element => {
                if (element.id == params.alert) {
                    element.state += 1
                }
            });
        },

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
                if (context.getters.alertList.length <= 1 || params.type == "force" || params.type == "loadMore") {
                    if (context.getters.userInfo.role <= 1) {
                        // console.log(params.page)
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
                            if (params.type == "loadMore") {
                                context.commit("getMoreAlert", alertList)
                            } else {
                                context.commit("getAlertList", alertList)
                            }
                            resolve()
                        })
                    } else if (context.getters.userInfo.role >= 1 && context.getters.userInfo.role <= 3) {
                        axios.get("/alert/list", {
                            params: {
                                token: context.getters.userInfo.token,
                                station: context.getters.userInfo.station,
                                stationAlt: params.stationAlt,
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
                            if (params.type == "loadMore") {
                                context.commit("getMoreAlert", alertList)
                            } else {
                                context.commit("getAlertList", alertList)
                            }
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
                            if (params.type == "loadMore") {
                                context.commit("getMoreAlert", alertList)
                            } else {
                                context.commit("getAlertList", alertList)
                            }
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
        },
        getWechatUserInfo(context, params) {
            return new Promise((resolve, reject) => {
                axios.post("/user/wechatlogin", {
                    token: params.token,
                }).then(data => {
                    data = data.data
                    const user = {}
                    user.username = data.username;
                    user.id = data.id;
                    user.name = data.name;
                    user.role = data.role;
                    user.company = data.company;
                    user.organize = data.organize;
                    user.station = data.station;
                    user.index = data.index;
                    user.token = data.token;
                    context.commit("updateUserInfo", user)
                    resolve()
                })
            })
        },
        restoreAlertPage(context) {
            return new Promise((resolve, reject) => {
                context.commit("restoreAlertPage")
                resolve()
            })
        }
    },
    plugins: [vuexAlong]
})
