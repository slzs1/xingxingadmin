import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'

const hasPermission = (permissions: string[], route: RouteConfig) => {
  if (route.meta && route.meta.permission) {
    if (permissions.includes(route.meta.permission)) { return true } else return false
  } else {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteConfig[], permissions: string[]) => {
  const res: RouteConfig[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(permissions, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, permissions)
      }
      res.push(r)
    }
  })
  return res
}

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
  permissions: string[]
}

@Module({ dynamic: true, store, name: 'router' })
class Router extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []
  public permissions: string[] = JSON.parse(localStorage.getItem('permission_name') || '[]') || []

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes
  }

  @Mutation
  public SET_PERMISSIONS(permissions: string[]) {
    this.permissions = permissions
  }

  @Action
  public async GenerateRoutes() {
    let accessedRoutes
    if (this.permissions.length === 0) {
      this.SET_PERMISSIONS(JSON.parse(localStorage.getItem('permission_name') || '[]') || [])
    }
    accessedRoutes = filterAsyncRoutes(asyncRoutes, this.permissions)
    this.SET_ROUTES(accessedRoutes)
  }
}

export const RouterModule = getModule(Router)
