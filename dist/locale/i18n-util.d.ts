import type { Translation, TranslationFunctions, Locales } from './i18n-types';
import type { LocaleDetector } from 'typesafe-i18n/detectors';
export declare const baseLocale: Locales;
export declare const locales: Locales[];
export declare const getTranslationForLocale: (locale: Locales) => Translation;
export declare const i18nObject: (locale: Locales) => TranslationFunctions;
export declare const i18n: () => import("typesafe-i18n").LocaleTranslationFunctions<Locales, TranslationFunctions>;
export declare const i18nString: (locale: Locales) => import("typesafe-i18n").TranslateByString;
export declare const detectLocale: (...detectors: LocaleDetector[]) => Locales;
