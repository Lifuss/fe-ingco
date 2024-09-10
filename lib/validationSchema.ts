import { z } from 'zod';

const nameRegex = /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ'`]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z\d\S]).*$/;

const basePasswordSchema = z
  .string()
  .min(8, 'Пароль повинен містити принаймні 8 символів')
  .max(20, 'Пароль не повинен перевищувати 20 символів')
  .regex(
    passwordRegex,
    'Пароль повинен мати хоча б одну велику літеру і хоча б одну маленьку літеру, цифру чи інший ненульовий символ ',
  );
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
  lastName: baseNameSchema.regex(
    nameRegex,
    'Прізвище може містити тільки літери',
  ),
  firstName: baseNameSchema.regex(nameRegex, 'Ім’я може містити тільки літери'),
  surName: baseNameSchema.regex(
    nameRegex,
    'По батькові може містити тільки літери',
  ),
  phone: basePhoneSchema,
  edrpou: z.string().regex(/^\d{8}$/, 'Код ЄДРПОУ повинен містити 8 цифр'),
  email: baseEmailSchema,
  about: z.string().optional().default(''),
});

export const registerClientSchema = z
  .object({
    lastName: baseNameSchema.regex(
      nameRegex,
      'Прізвище може містити тільки літери',
    ),
    firstName: baseNameSchema.regex(
      nameRegex,
      'Ім’я може містити тільки літери',
    ),
    surName: baseNameSchema.regex(
      nameRegex,
      'По батькові може містити тільки літери',
    ),
    phone: basePhoneSchema,
    email: baseEmailSchema,
    password: basePasswordSchema,
    checkPassword: z.string(),
  })
  .refine((data) => data.password === data.checkPassword, {
    message: 'Паролі повинні збігатися',
    path: ['checkPassword'],
  });
