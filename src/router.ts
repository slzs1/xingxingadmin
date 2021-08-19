import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import { Icon } from 'element-ui'

Vue.use(Router)

/*
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    hidden: true                 if true, this route will not show in the sidebar (default is false)
  }
*/

export const constantRoutes: RouteConfig[] = [
  // mode: 'history',  // Enable this if you need.
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/dev',
    component: Layout,
    meta: {
      title: '开发页',
      hidden: process.env.NODE_ENV === 'production'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/dev/index.vue'),
        meta: {
          title: '开发页',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue'),
    meta: { hidden: true }
  }
]

export const asyncRoutes: RouteConfig[] = [
  {
    path: '/product',
    component: Layout,
    redirect: '/product/index',
    meta: {
      title: '商品管理',
      icon: 'example'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/product/index.vue'),
        meta: {
          title: '商品列表',
          icon: 'form',
          alwaysShow: true, // will always show the root menu
          permission: 'Productindex'
        }
      },
      {
        path: 'import',
        component: () => import('@/views/product/upload-excel.vue'),
        meta: {
          title: '商品导入',
          icon: 'form',
          permission: 'Productnew'
        }
      },
      {
        path: 'category',
        component: () => import('@/views/productCat/index.vue'),
        meta: {
          title: '商品分类',
          icon: 'form',
          permission: 'ProductCatindex'
        }
      },
      {
        path: 'edit',
        name: 'editProduct',
        component: () => import('@/views/product/edit.vue'),
        meta: {
          title: '修改商品',
          icon: 'form',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/scene',
    component: Layout,
    redirect: '/scene/index',
    meta: {
      title: '场景管理',
      icon: 'example'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/scene/index.vue'),
        meta: {
          title: '场景列表',
          icon: 'form',
          permission: 'Sceneindex'
        }
      },
      {
        path: 'new',
        name: 'newScene',
        component: () => import('@/views/scene/new.vue'),
        meta: {
          title: '添加场景',
          icon: 'form',
          permission: 'Scenenew'
        }
      },
      {
        path: 'edit',
        name: 'editScene',
        component: () => import('@/views/scene/edit.vue'),
        meta: {
          title: '修改场景',
          icon: 'form',
          hidden: true
        }
      },
      {
        path: 'category',
        component: () => import('@/views/sceneCat/index.vue'),
        meta: {
          title: '场景分类',
          icon: 'form',
          permission: 'SceneCatindex'
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    meta: {
      title: '订单管理',
      icon: 'example'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/order/index.vue'),
        meta: {
          title: '订单列表',
          icon: 'form',
          permission: 'Orderindex'
        }
      },
      {
        path: 'editAddress',
        name: 'editAddress',
        component: () => import('@/views/order/editAddress.vue'),
        meta: {
          title: '修改收货地址',
          icon: 'form',
          hidden: true
        }
      },
      {
        path: 'invoice',
        component: () => import('@/views/order/invoice.vue'),
        meta: {
          title: '发票列表',
          icon: 'form',
          permission: 'Invoiceindex'
        }
      },
      {
        path: 'logistic',
        component: () => import('@/views/order/logistic.vue'),
        meta: {
          title: '物流列表',
          icon: 'form',
          permission: 'Logisticindex'
        }
      },
      {
        path: 'editLogistic',
        name: 'editLogistic',
        component: () => import('@/views/order/editLogistic.vue'),
        meta: {
          title: '填写物流表单',
          icon: 'form',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/service',
    component: Layout,
    redirect: '/service/index',
    meta: {
      title: '工单管理',
      icon: 'example'
    },
    children: [
      {
        path: 'ticket',
        component: () => import('@/views/service/ticket.vue'),
        meta: {
          title: '订单工单',
          icon: 'form',
          permission: 'Serviceindex'
        }
      },
      {
        path: 'index',
        component: () => import('@/views/service/index.vue'),
        meta: {
          title: '维修工单',
          icon: 'form',
          permission: 'Ticketindex'
        }
      }
    ]
  },
  {
    path: '/comment',
    component: Layout,
    redirect: 'comment/index',
    meta: {
      title: '评论管理',
      icon: 'example'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/comment/index.vue'),
        meta: {
          title: '评论列表',
          icon: 'form',
          permission: 'Commentindex'
        }
      },
      {
        path: 'statis',
        component: () => import('@/views/comment/statis.vue'),
        meta: {
          title: '评论统计',
          icon: 'form',
          permission: 'Commentindex'
        }
      },
      {
        path: 'new',
        component: () => import('@/views/comment/new.vue'),
        meta: {
          title: '添加好评',
          icon: 'form',
          permission: 'Commentnew'
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    meta: {
      title: '用户管理',
      icon: 'example',
      permission: 'Userindex'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '用户列表',
          icon: 'form'
        }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/index',
    meta: {
      title: '案例管理',
      icon: 'example'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/example/index.vue'),
        meta: {
          title: '案例列表',
          icon: 'form',
          permission: 'Exampleindex'
        }
      },
      {
        path: 'new',
        name: 'newExample',
        component: () => import('@/views/example/new.vue'),
        meta: {
          title: '添加案例',
          icon: 'form',
          permission: 'Examplenew'
        }
      },
      {
        path: 'edit',
        name: 'editExample',
        component: () => import('@/views/example/edit.vue'),
        meta: {
          title: '修改案例',
          icon: 'form',
          hidden: true
        }
      },
      {
        path: 'category',
        component: () => import('@/views/exampleCat/index.vue'),
        meta: {
          title: '案例分类',
          icon: 'form',
          permission: 'ExampleCatindex'
        }
      }
    ]
  },
  {
    path: '/post',
    component: Layout,
    redirect: '/post/index',
    meta: {
      title: '海报管理',
      icon: 'example'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/post/index.vue'),
        meta: {
          title: '海报列表',
          icon: 'form',
          permission: 'Postindex'
        }
      },
      {
        path: 'new',
        name: 'newPost',
        component: () => import('@/views/post/new.vue'),
        meta: {
          title: '添加海报',
          icon: 'form',
          permission: 'Postnew'
        }
      },
      {
        path: 'edit',
        name: 'editPost',
        component: () => import('@/views/post/edit.vue'),
        meta: {
          title: '修改海报',
          icon: 'form',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/banner',
    component: Layout,
    redirect: '/banner/index',
    meta: {
      title: '广告管理',
      icon: 'example'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/banner/index.vue'),
        meta: {
          title: '广告列表',
          icon: 'form',
          permission: 'Bannerindex'
        }
      },
      {
        path: 'new',
        name: 'newBanner',
        component: () => import('@/views/banner/new.vue'),
        meta: {
          title: '添加广告',
          icon: 'form',
          permission: 'Bannernew'
        }
      },
      {
        path: 'edit',
        name: 'editBanner',
        component: () => import('@/views/banner/edit.vue'),
        meta: {
          title: '修改广告',
          icon: 'form',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    meta: {
      title: '商务合作',
      icon: 'form'
    },
    children: [
      {
        path: 'index',
        name: 'customer',
        component: () => import('@/views/customer/index.vue'),
        meta: {
          title: '商务合作',
          icon: 'form'
        }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    meta: {
      title: '站点配置',
      icon: 'form',
      permission: 'Settingindex',
      hidden: process.env.NODE_ENV === 'production'
    },
    children: [
      {
        path: 'index',
        name: 'setting',
        component: () => import('@/views/setting/index.vue'),
        meta: {
          title: '站点配置',
          icon: 'form'
        }
      }
    ]
  },
  {
    path: '/limit',
    component: Layout,
    meta: {
      title: '权限管理',
      icon: 'example',
      hidden: process.env.NODE_ENV === 'production'
    },
    children: [
      {
        path: 'index',
        name: 'limit',
        component: () => import('@/views/limit/index.vue'),
        meta: {
          title: '权限管理',
          icon: 'form'
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const createRouter = () => new Router({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
