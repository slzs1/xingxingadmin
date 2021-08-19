import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { request } from '@/utils/request'
import { StorageModule } from './storage'
import { RouterModule } from './router'

@Module({ dynamic: true, store, name: 'session' })
class Session extends VuexModule {
  @Action({ rawError: true })
  public async Login(loginForm:object) {
    var res = await request({
      url: '/auth/web',
      method: 'POST',
      body: loginForm
    })
    if (res && res.jwt) {
      localStorage.setItem('token', 'Bearer ' + res.jwt)
      localStorage.setItem('user', JSON.stringify(res) || '')
      StorageModule.SET_TOKEN('Bearer ' + res.jwt)
      return true
    } else {
      return false
    }
  }

  @Action({ rawError: true })
  public async LogOut() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('permissions')
    StorageModule.SET_ROLE('')
    StorageModule.SET_TOKEN('')
    StorageModule.SET_PERMISSION([])
    localStorage.removeItem('permission_name')
    RouterModule.SET_PERMISSIONS([])
  }
}

export const SessionModule = getModule(Session)
