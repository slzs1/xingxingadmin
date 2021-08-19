import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Route } from 'vue-router'
import { StorageModule } from '@/store/modules/storage'
import { RouterModule } from '@/store/modules/router'
import '@/utils/storage'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()

  if (to.path === '/login') {
    // If is logged in, redirect to the home page
    next()
    NProgress.done()
  } else {
    if (StorageModule.token) {
      // Check whether the user has obtained his permission roles
      if (StorageModule.role === '') {
        await StorageModule.GetUserInfo()
        // Generate accessible routes map based on role
        await RouterModule.GenerateRoutes()
        // Dynamically add accessible routes
        router.addRoutes(RouterModule.dynamicRoutes)
        next({ ...to, replace: true })
      } else {
        next()
      }
    } else {
      next({ path: '/login' })
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done()

  // set page title
  document.title = to.meta.title
})
