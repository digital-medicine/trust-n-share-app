import {createIntl, createIntlCache} from '@formatjs/intl';

const translations = {
  de: require('../translations/de.json'),
} as const;

type Translation = keyof typeof translations;

// const fallback = { languageTag: "de", isRTL: false };
// const { languageTag } = RNLocalize.findBestLanguageTag(Object.keys(translations)) ?? fallback;
export const languageTag = 'de';

const intl = createIntl(
  {
    defaultLocale: 'en',
    locale: languageTag,
    messages: translations[languageTag as Translation],
  },
  createIntlCache(),
);

type TranslationParams = Parameters<(typeof intl)['formatMessage']>[1];

export const translate = (key: string, params?: TranslationParams) =>
  intl
    .formatMessage({id: key, defaultMessage: translations['de'][key]}, params)
    .toString();
