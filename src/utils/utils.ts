export const utils = {
  /*
  * @name: 设置cookie 值
  * @param: cname string cookie名称 
  * @param: cvalue any cookie值
   */ 
  setCookie(cname:string, cvalue:any, exdays = 720){
    let d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    const expires = "expires=" + d.toUTCString()
    document.cookie = cname + "=" + cvalue + "; " + expires
  },
  /*
  * @name: 获取cookie 值
  * @param: cname string cookie名称 
   */ 
  getCookie(cname:string){
    const name = cname + "="
    const ca = document.cookie.split(';')
    for (let i = 0 ; i < ca.length; i++) {
      let c = ca[i].trim()
      if(c.startsWith(name)) {
        return c.substring(name.length, c.length)
      }
    }
    return ""
  },
  clearCookie(cname:string, domain= '', pathurl = ''){
    let d = new Date()
    d.setTime(-1)
    const expires = "expires=" + d.toUTCString()
    let delstr = cname + "=''; " + expires
    if (domain) {
      delstr += `; domain=${domain}`
    }
    if (pathurl) {
      delstr += `; path=${pathurl}`
    }
    document.cookie = delstr
  },
  checkStarlightLog():string {
    const token = this.getCookie("Bihu-Token")
    if (token) {
      window.sessionStorage.setItem('bihu-token', token)
    }
    return token
  }
}