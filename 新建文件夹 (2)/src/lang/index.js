import Vue from 'vue'
import VueI18n from 'vue-i18n'
// import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import locale from 'element-ui/lib/locale'
import enLocale from './en'
import zhLocale from './zh'

Vue.use(VueI18n)
const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}
const i18n = new VueI18n({
  locale: window.localStorage.getItem('language') || 'zh', // set locale
  messages // set locale messages
})
locale.i18n((key, value) => i18n.t(key, value))
export default i18n
