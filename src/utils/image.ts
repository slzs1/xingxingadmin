import Cos from 'cos-js-sdk-v5'
import { message } from './confirm'

const base64ToFile = (urlData: string, fileName: string) => {
  let arr = urlData.split(',')
  let mime:string | null = arr[0].match(/:(.*?);/)![1]
  let bytes = atob(arr[1]) // 解码base64
  let n = bytes.length
  let ia = new Uint8Array(n)
  while (n--) {
    ia[n] = bytes.charCodeAt(n)
  }
  return new (window as any).File([ia], fileName, { type: mime })
}

// 腾讯云存储上传文件
const cos = new Cos({
  SecretId: 'AKID2yVkjaEMJ0b25XqZ3HlynLbbOuhEcyrT',
  SecretKey: '1mHVUCLMzNUKl2SbLpBk3wZpojES9Zrj'
})

export const uploadImg = (imgDataUrl:any) => {
  return new Promise((resolve, reject) => {
    // base64格式转成file
    let filename = Date.now() + '.jpg'
    let file = base64ToFile(imgDataUrl, filename)
    cos.putObject(
      {
        Bucket: 'xingx-1301593316' /* 必须 */,
        Region: 'ap-shanghai' /* 必须 */,
        Key: 'images/' + filename /* 必须 */,
        StorageClass: 'STANDARD',
        Body: file // 上传文件对象
      },
      function(err: any, data: any) {
        if (err) {
          message('图片上传失败！', 'error')
          reject(err)
        } else {
          // filelist的特定格式
          let image = {
            name: filename,
            url: 'https://' + data.Location
          }
          message('图片上传成功！', 'success')
          resolve(image)
        }
      })
  })
}
