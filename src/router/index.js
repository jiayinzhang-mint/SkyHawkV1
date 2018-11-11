import Vue from 'vue'
import VueRouter from 'vue-router'
if (process.env.NODE_ENV === 'development') {
    Vue.use(VueRouter)
}


export default new VueRouter({
    routes: [
        {
            path: '/',
            component: resolve => require(['@/components/common/Login'], resolve),
        },
        {
            path: '/index',
            component: resolve => require(['@/components/common/Index'], resolve),
            children: [
                {
                    path: '/company',
                    component: resolve => require(['@/components/user/company/CompanyList'], resolve),
                    children: [
                        {
                            path: '/company/:id',
                            component: resolve => require(['@/components/user/company/CompanyDetail'], resolve),

                        }
                    ]
                },
                {
                    path: '/gallery',
                    component: resolve => require(['@/components/user/gallery/GalleryList'], resolve),
                },
                {
                    path: '/organize',
                    component: resolve => require(['@/components/user/organize/OrganizeList'], resolve),
                    children: [
                        {
                            path: '/organize/:id',
                            component: resolve => require(['@/components/user/organize/OrganizeDetail'], resolve),

                        }
                    ]
                },
                {
                    path: '/alert',
                    component: resolve => require(['@/components/user/alert/AlertList'], resolve),
                    children: [
                        {
                            path: '/alert/:id',
                            component: resolve => require(['@/components/user/alert/AlertDetail'], resolve),

                        }
                    ]
                },
                {
                    path: '/map',
                    component: resolve => require(['@/components/user/map/MapView'], resolve),
                },

            ]
        },
        {
            path: '/manage',
            component: resolve => require(['@/components/common/Index'], resolve),
            children: [
                {
                    path: '/manage/company',
                    component: resolve => require(['@/components/manage/company/CompanyList'], resolve),
                    children: [
                        {
                            path: '/manage/company/:id',
                            component: resolve => require(['@/components/manage/company/CompanyDetail'], resolve),

                        }
                    ]
                },
                {
                    path: '/manage/organize',
                    component: resolve => require(['@/components/manage/organize/OrganizeList'], resolve),
                    children: [
                        {
                            path: '/manage/organize/:id',
                            component: resolve => require(['@/components/manage/organize/OrganizeDetail'], resolve),

                        }
                    ]
                },
            ]
        }

    ]
})
