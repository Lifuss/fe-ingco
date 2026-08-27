import { z } from 'zod';

const nameRegex = /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ'`]+$/;

export const basePasswordSchema = z
  .string()
  .min(8, 'Пароль повинен містити від 8 до 20 символів')
  .max(20, 'Пароль повинен містити від 8 до 20 символів')
  .regex(/[A-Z]/, 'Пароль повинен містити хоча б одну велику літеру (A-Z)')
  .regex(/[a-z]/, 'Пароль повинен містити хоча б одну малу літеру (a-z)')
  .regex(/[0-9\W_]/, 'Пароль повинен містити хоча б одну цифру або спецсимвол');
const baseEmailSchema = z.string().email('Некоректний формат email');
const basePhoneSchema = z
  .string()
  .regex(
    /^\+?[1-9]\d{1,14}$/,
    'Номер телефону повинен бути валідним міжнародним номером, починатися з + та містити до 15 цифр',
  );
const baseNameSchema = z
  .string()
  .min(2, 'Поле повинно містити принаймні 2 символи')
  .max(60, 'Поле не повинно перевищувати 60 символів');

// -----SCHEMAS------
export const registerPartnerSchema = z.object({
  lastName: baseNameSchema.regex(nameRegex, 'Прізвище може містити тільки літери'),
  firstName: baseNameSchema.regex(nameRegex, 'Ім’я може містити тільки літери'),
  surName: baseNameSchema.regex(nameRegex, 'По батькові може містити тільки літери'),
  phone: basePhoneSchema,
  edrpou: z.string().regex(/^\d{8}$/, 'Код ЄДРПОУ повинен містити 8 цифр'),
  email: baseEmailSchema,
  about: z.string().default('').optional(),
});

export const registerClientSchema = z
  .object({
    lastName: baseNameSchema.regex(nameRegex, 'Прізвище може містити тільки літери'),
    firstName: baseNameSchema.regex(nameRegex, 'Ім’я може містити тільки літери'),
    surName: baseNameSchema.regex(nameRegex, 'По батькові може містити тільки літери'),
    phone: basePhoneSchema,
    email: baseEmailSchema,
    password: basePasswordSchema,
    checkPassword: z.string(),
  })
  .refine((data) => data.password === data.checkPassword, {
    message: 'Паролі повинні збігатися',
    path: ['checkPassword'],
  });
