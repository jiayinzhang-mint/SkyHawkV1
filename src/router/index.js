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
            component: resolve => require(['@/components/user/Index'], resolve),
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
                    children: [
                        {
                            path: '/gallery/:id',
                            component: resolve => require(['@/components/user/gallery/GalleryDetail'], resolve),

                        }
                    ]
                }

            ]
        }
    ]
})
