import { MessageBox, Message } from 'element-ui'

//
//   封装 element-ui 弹框
//   @param text
//   @param type
//   @returns {Promise}
//
export async function confirm(
  text :string = '确定执行此操作吗？',
  type :'warning' | 'success' | 'info' | 'error' | undefined = 'warning',
  callback: ((action:'confirm' | 'cancel' | 'close') => void) | undefined,
  distinguishCancelAndClose: boolean = false,
  title:string = '提示') {
  return MessageBox.confirm(text, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: type,
    callback: callback,
    distinguishCancelAndClose: distinguishCancelAndClose,
    closeOnPressEscape: false
  })
}

//
//  @author 封装 element-ui 消息提示
//  @param text
//  @param type
//  @returns {Promise}
//
export function message(text:string = '操作成功', type :'warning' | 'success' | 'info' | 'error' | undefined = 'success') {
  return Message({
    showClose: true,
    message: text,
    type: type
  })
}
