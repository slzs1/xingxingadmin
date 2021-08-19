import { StorageModule } from '@/store/modules/storage'
const BASE_URL = 'http://xx.openxy.com/'

export const request = async(option:any) => {
  try {
    var data = {}
    if (option.method === 'POST') {
      let body = JSON.stringify(option.body)
      data = {
        method: 'POST',
        body: body,
        headers: {
          'content-type': 'application/json'
        }
      }
    } else {
      if (option.query !== undefined) {
        let subject = option.query.subject
        option.url = option.url + '.json?filter[role][eq]=' + StorageModule.role + '&filter[subject][eq]=' + subject
      } else {
        option.url = option.url + '.json?filter[role][eq]=' + StorageModule.role
      }
      data = {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': StorageModule.token
        }
      }
    }
    const res = await fetch(BASE_URL + option.url, data)
    if (res.ok) {
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
