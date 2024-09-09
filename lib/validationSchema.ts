import { z } from 'zod';

const phoneSchema = z
  .string()
  .regex(
    /^\+?[1-9]\d{1,14}$/,
    'Номер телефону повинен бути валідним міжнародним номером, починатися з + та містити до 15 цифр',
  );

export const registerSchema = z.object({
  lastName: z
    .string()
    .min(2, 'Прізвище повинно містити хоча б 2 символи')
    .regex(
      /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/,
      'Прізвище може містити тільки літери',
    ),
  firstName: z
    .string()
    .min(2, 'Ім’я повинно містити хоча б 2 символи')
    .regex(/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/, 'Ім’я може містити тільки літери'),
  surName: z
    .string()
    .min(2, 'По батькові повинно містити хоча б 2 символи')
    .regex(
      /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/,
      'По батькові може містити тільки літери',
    ),
  phone: phoneSchema,
  edrpou: z.string().regex(/^\d{8}$/, 'Код ЄДРПОУ повинен містити 8 цифр'),
  email: z.string().email('Некоректний формат email'),
  about: z.string().optional().default(''),
});
