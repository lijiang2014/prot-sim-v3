import { createI18n, useI18n } from 'vue-i18n'
import elementEnLocale from 'element-plus/lib/locale/lang/en'
import elementZhLocale from 'element-plus/lib/locale/lang/zh-CN'
import zhLocale from './zh'
import enLocale from './en'
import { utils } from '@/utils/utils'

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
}

export function getLanguage() {
  const chooseLanguage = utils.getCookie('language')
  if (chooseLanguage) return chooseLanguage
  if (window.localStorage.lang) return window.localStorage.lang

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

let i18n = createI18n({
  locale: getLanguage(),
  globalInjection: true,
  messages,
})


export function trans(instr: string, prefix: string): string {
  let i18 = useI18n()
  const inkey = prefix + instr
  if (i18.te(inkey)) {
    return i18.t(inkey)
  }
  return instr
}

export default i18n