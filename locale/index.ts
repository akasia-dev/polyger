import type { Locales } from './i18n-types'
import systemLocale from 'system-locale'
import { i18nObject } from './i18n-util'

export const getLocaleCode = async (defaultLocaleCode: Locales) => {
  let localeCode = defaultLocaleCode
  try {
    return (await systemLocale()).replace(/_\S+/g, '') as Locales
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
