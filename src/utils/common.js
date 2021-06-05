export const getLocalUserInfo = () => {
  const localUserInfo = localStorage.getItem('userInfo')
  if(localUserInfo){
    return JSON.parse(localUserInfo)
  }
  return null
}

export const formatFileName = (fileName) => {
  console.log(fileName)
  const temp = fileName.split('.')
  const exetName = temp[temp.length-1]
  return exetName
}
