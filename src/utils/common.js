export const getLocalUserInfo = () => {
  const localUserInfo = localStorage.getItem('userInfo')
  if(localUserInfo){
    return JSON.parse(localUserInfo)
  }
  return null
}
