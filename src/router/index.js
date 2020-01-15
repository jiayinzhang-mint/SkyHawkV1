import Vue from "vue";
import VueRouter from "vue-router";
if (process.env.NODE_ENV === "development") {
  Vue.use(VueRouter);
}

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "login",
      component: resolve => require(["@/components/common/Login"], resolve)
    },
    {
      path: "/index",
      meta: { auth: true },
      component: resolve => require(["@/components/common/Index"], resolve),
      children: [
        {
          path: "/company",
          component: resolve =>
            require(["@/components/user/company/CompanyList"], resolve),
          children: [
            {
              path: "/company/:id",
              component: resolve =>
                require(["@/components/user/company/CompanyDetail"], resolve),
              children: [
                {
                  path: "/company/:id/info",
                  component: resolve =>
                    require(["@/components/user/company/Info"], resolve)
                },
                {
                  path: "/company/:id/supervisor",
                  component: resolve =>
                    require(["@/components/user/company/Supervisor"], resolve)
                },
                {
                  path: "/company/:id/alert",
                  component: resolve =>
                    require(["@/components/user/company/Alert"], resolve)
                },
                {
                  path: "/company/:id/gallery",
                  component: resolve =>
                    require(["@/components/user/company/Gallery"], resolve)
                },
                {
                  path: "/company/:id/humiture",
                  component: resolve =>
                    require(["@/components/user/company/Humiture"], resolve)
                },
                {
                  path: "/company/:id/device",
                  component: resolve =>
                    require(["@/components/user/company/Device"], resolve)
                }
              ]
            }
          ]
        },
        {
          path: "/gallery/:id",
          component: resolve =>
            require(["@/components/user/gallery/GalleryDetail"], resolve)
        },
        {
          path: "/organize",
          component: resolve =>
            require(["@/components/user/organize/OrganizeList"], resolve),
          children: [
            {
              path: "/organize/:id",
              component: resolve =>
                require(["@/components/user/organize/OrganizeDetail"], resolve)
            }
          ]
        },
        {
          path: "/alert",
          component: resolve =>
            require(["@/components/user/alert/AlertList"], resolve),
          children: [
            {
              path: "/alert/:id",
              component: resolve =>
                require(["@/components/user/alert/AlertDetail"], resolve)
            }
          ]
        },
        {
          path: "/calendar",
          component: resolve =>
            require(["@/components/calendar/Calendar"], resolve)
        },
        {
          path: "/map",
          component: resolve =>
            require(["@/components/user/map/MapView"], resolve)
        },
        {
          path: "/today",
          component: resolve => require(["@/components/common/Today"], resolve)
        }
      ]
    },
    {
      path: "/manage",
      component: resolve => require(["@/components/common/Index"], resolve),
      children: [
        {
          path: "/manage/company",
          component: resolve =>
            require(["@/components/manage/company/CompanyList"], resolve),
          children: [
            {
              path: "/manage/company/:id",
              component: resolve =>
                require(["@/components/manage/company/CompanyDetail"], resolve)
            }
          ]
        },
        {
          path: "/manage/organize",
          component: resolve =>
            require(["@/components/manage/organize/OrganizeList"], resolve),
          children: [
            {
              path: "/manage/organize/:id",
              component: resolve =>
                require([
                  "@/components/manage/organize/OrganizeDetail"
                ], resolve)
            }
          ]
        }
      ]
    },
    {
      path: "/mobile/index",
      component: resolve =>
        require(["@/components/common/IndexMobile"], resolve),
      children: [
        {
          path: "/mobile/map",
          component: resolve =>
            require(["@/components/mobile/map/MapView"], resolve)
        },
        {
          path: "/mobile/company",
          component: resolve =>
            require(["@/components/mobile/company/CompanyList"], resolve)
        },
        {
          path: "/mobile/company/:id",
          component: resolve =>
            require(["@/components/mobile/company/CompanyDetail"], resolve)
        },
        {
          path: "/mobile/alert",
          component: resolve =>
            require(["@/components/mobile/alert/AlertList"], resolve)
        },
        {
          path: "/mobile/alert/:id",
          component: resolve =>
            require(["@/components/mobile/alert/AlertDetail"], resolve)
        },
        {
          path: "/mobile/profile",
          component: resolve =>
            require(["@/components/mobile/user/Profile"], resolve)
        }
      ]
    },
    {
      path: "/wechat/bind",
      component: resolve =>
        require(["@/components/mobile/wechat/Bind"], resolve)
    },
    {
      path: "/wechat/login",
      component: resolve =>
        require(["@/components/mobile/wechat/Login"], resolve)
    },
    {
      path: "/dashboard/analysis",
      component: resolve =>
        require(["@/components/dashboard/Analysis"], resolve)
    },
    {
      path: "/dashboard/perdict",
      component: resolve => require(["@/components/dashboard/Perdict"], resolve)
    }
  ]
});

export default router;
