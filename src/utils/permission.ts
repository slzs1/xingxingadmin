import { Permission } from '@/model'

export const permission = async() => {
  let permissions = (await (Permission.where({}).all())).data
  permissions.forEach((permission:Permission) => {
    if (permission.hasError) {
      return null
    }
  })
  return permissions
}
