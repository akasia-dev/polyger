import type { Locales } from './i18n-types'
import osLocale from 'os-locale'
import { i18nObject } from './i18n-util'

export const getLocaleCode = async (defaultLocaleCode: Locales) => {
  let localeCode = defaultLocaleCode
  try {
    return (await osLocale()).replace(/-\S+/g, '') as Locales
  } catch (e) {}

  return localeCode as Locales
}

export const getLocale = async (
  localeCode?: Locales,
  options = {
    defaultLocaleCode: 'en' as Locales
  }
) => {
  if (!localeCode) localeCode = await getLocaleCode(options.defaultLocaleCode)
  return i18nObject(localeCode)
}

export default getLocale
