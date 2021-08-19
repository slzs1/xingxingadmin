import { User } from '@/model'

export const currentUser = async() => {
  let user = (await (User.where({ id: localStorage.getItem('id') }).all())).data[0]
  if (user.hasError) {
    return null
  } else {
    return user
  }
}
