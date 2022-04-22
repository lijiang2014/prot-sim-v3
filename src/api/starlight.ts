
export const BaseURL = `${import.meta.env.VITE_APP_BASE_STARLIGHT}`

export const RedirectLoginURL = (baseURL = BaseURL, tokenType = 'longTerm', cookieExp = 2, href = '') => {
  if (!href){
    href = window.location.href
  }
  // const myURL = "http://bio.nscc-gz.cn:3000/login"
  const encodeURL = encodeURIComponent(href)
  return `${baseURL}/#/login?token_type=${tokenType}&cookie_exp=${cookieExp}&redirect_url=${encodeURL}`
}
