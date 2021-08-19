Storage.prototype.setExpire = (key:string, value:string, expire:any) => {
  let obj = {
    data: value,
    time: Date.now(),
    expire: expire
  }
  localStorage.setItem(key, JSON.stringify(obj))
}

Storage.prototype.isExpire = (key:any) => {
  let val:any = localStorage.getItem(key)
  console.log(val)
  if (!val) {
    return val
  }
  val = JSON.parse(val)
  if (Date.now() - val.time > val.expire * 1000 * 60 * 60) {
    console.log('token expire')
    localStorage.removeItem(key)
    return null
  }
  return val.data
}
