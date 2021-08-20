import type { Locales } from './i18n-types';
export declare const getLocaleCode: (defaultLocaleCode: Locales) => Promise<Locales>;
export declare const getLocale: (localeCode?: Locales | undefined, options?: {
    defaultLocaleCode: Locales;
}) => Promise<import("./i18n-types").TranslationFunctions>;
export default getLocale;
