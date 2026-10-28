export const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#FF4560',
  '#6A4FC5',
  '#F935A9',
  '#85D92B',
  '#FF5733',
  '#33FFCE',
  '#FFD700',
  '#00FF7F',
];

// CMS Category IDs (Fallback Dynamic Values)
export const CATEGORY_IDS = {
  BATTERY_TOOL: '11', // Акумуляторний інструмент (Система 12V / 20V P20S)
  HAND_TOOL: '37', // Ручний інструмент
  POWER_TOOL: '25', // Мережевий електроінструмент
  MEASURE_TOOL: '21', // Вимірювальна техніка
  P20S_LINE: '11', // Акумуляторна лінійка P20S
  PROMO: '52', // Акція
};

export const CATEGORY_SLUGS = {
  BATTERY_TOOL: 'akumulyatorniy-instrument',
  HAND_TOOL: 'ruchniy-instrument',
  POWER_TOOL: 'merezheviy-elektroinstrument',
  MEASURE_TOOL: 'vimiryuvalna-tehnika',
  PROMO: 'akciya',
};

// Social Media Channels
export const SOCIAL_LINKS = {
  FACEBOOK:
    process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/people/INGCO/61556075234289/',
  VIBER:
    process.env.NEXT_PUBLIC_VIBER_URL ||
    'https://invite.viber.com/?g=KiAyrPV8FlMrhU2pjsAWT-r7V3jGwmv6',
  TELEGRAM: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/+IePpWvT99J02NTJi',
  TIKTOK: process.env.NEXT_PUBLIC_TIKTOK_URL || '',
};

// Corporate Contacts
export const CONTACTS = {
  PHONES: [
    { href: 'tel:+380988392107', label: '+380 98-83-92-107' },
    { href: 'tel:+380964123628', label: '+380 96-41-23-628' },
  ],
  WORKING_HOURS: ['Пн - Пт : 09:00 - 18:00', 'Сб - Нд : 09:00 - 15:00'],
  SCHEMA_OPENING_HOURS: 'Mo-Fr 09:00-18:00, Sa-Su 09:00-15:00',
  WEEKDAY_OPENS: '09:00',
  WEEKDAY_CLOSES: '18:00',
  SHIPPING_CUTOFF_TIME: '15:00',
  EMAIL: 'service@ingcoua.com.ua',
};
