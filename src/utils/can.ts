export const can = (action: string, object: any) => {
  if (action === 'show') { return true }
  var subject:Array<string> = object.Actions
  return subject.includes(action)
}
