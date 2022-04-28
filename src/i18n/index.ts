import {createI18n, useI18n } from 'vue-i18n'
import elementEnLocale from 'element-plus/lib/locale/lang/en'
import elementZhLocale from 'element-plus/lib/locale/lang/zh-CN'
// import elementEsLocal from 'element-plus/lib/locale/lang/es'
// import elementJaLocal from 'element-plus/lib/locale/lang/ja'
import zhLocale from './zh'
import enLocale from './en'
import {utils} from '@/utils/utils'

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
  // es: {
  //   ...esLocale,
  //   ...elementEsLocale
  // },
  // ja: {
  //   ...jaLocale,
  //   ...elementJaLocale
  // }
}

export function getLanguage() {
  const chooseLanguage = utils.getCookie('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}

let i18n=createI18n({
    locale: getLanguage(),
    // fallbackLocal: 'en',
    messages,
})


export function trans(instr: string, prefix: string) :string{
  let i18=useI18n()
  const inkey = prefix + instr
  if (i18.te(inkey)) {
    return i18.t(inkey)
  }
  return instr
}

export default i18n