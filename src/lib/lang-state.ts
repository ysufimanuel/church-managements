// Active UI language kept outside React so plain helpers (date/number formatting) can follow it.
export type UiLang = 'id' | 'en';
let current: UiLang = 'en';
export const getCurrentLang = (): UiLang => current;
export const setCurrentLang = (l: UiLang) => { current = l; };
export const localeOf = (l: UiLang = current) => (l === 'id' ? 'id-ID' : 'en-US');
