import {createI18n} from 'vue-i18n'
import {zh} from './zh'
import {en} from './en'
let initLang=''
if(window.localStorage.lang=='en'){
    initLang='en'
}else if(window.localStorage.lang='zh'){
    initLang='zh'
}
let i18n=createI18n({
    locale:initLang||'zh',
    fallbackLocal: 'en',
    messages:{
        'en':en,
        'zh':zh
    }
})
export default i18n