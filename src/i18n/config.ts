export const locales = ['en', 'zh', 'tw'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '简体中文',
  tw: '繁體中文',
}

export async function getMessages(locale: Locale) {
  try {
    return await import(`./locales/${locale}.json`)
  } catch {
    return await import('./locales/en.json')
  }
}
