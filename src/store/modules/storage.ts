import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { Permission } from '@/model'

export interface IUserState {
  name: string
  openid: string
  role: string
  token: string
  permissions: Array<Permiss>
}

export interface Permiss {
  action: string
  subject: string
  scope: string
  state: string
}

@Module({ dynamic: true, store, name: 'storage' })
class Storage extends VuexModule implements IUserState {
  public name = ''
  public openid = ''
  public role = ''
  public token = localStorage.getItem('token') || ''
  public permissions:Permiss[] = JSON.parse(localStorage.getItem('permissions') || '[]') || []

  @Mutation
  public SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  public SET_OPENID(openid: string) {
    this.openid = openid
  }

  @Mutation
  public SET_ROLE(role: string) {
    this.role = role
  }

  @Mutation
  public SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  public SET_PERMISSION(permisssions: Array<Permiss>) {
    this.permissions = permisssions
  }

  @Action
  public async GetUserInfo() {
    let user:any = localStorage.getItem('user')
    user = JSON.parse(user)
    this.SET_NAME(user.username)
    this.SET_OPENID(user.openid)
    this.SET_ROLE(user.role)
    if (this.token === '') {
      let token = localStorage.getItem('token') || ''
      this.SET_TOKEN(token)
    }
    if (!localStorage.getItem('permissions')) {
      await getPermission()
      this.SET_PERMISSION(JSON.parse(localStorage.getItem('permissions') || '[]') || [])
    }
  }
}

const getPermission = async() => {
  let permissions = (await (Permission.where({}).all())).data
  const list: string[] = []
  permissions.forEach((per) => {
    for (let i = 0; i < per.action.length; i++) {
      let item:string = per.subject + per.action[i]
      list.push(item)
    }
  })
  localStorage.setItem('permissions', JSON.stringify(permissions))
  localStorage.setItem('permission_name', JSON.stringify(list))
  return permissions
}

export const StorageModule = getModule(Storage)
