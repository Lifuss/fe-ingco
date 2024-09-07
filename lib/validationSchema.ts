import { z } from 'zod';

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
  phone: z.string().regex(/^\d{10}$/, 'Номер телефону повинен містити 10 цифр'),
  edrpou: z.string().regex(/^\d{8}$/, 'Код ЄДРПОУ повинен містити 8 цифр'),
  email: z.string().email('Некоректний формат email'),
  about: z.string().optional().default(''),
});
