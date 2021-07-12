import { StringSchema, StringSchemaConstructor } from 'yup';

declare module 'yup' {
  interface StringSchema {
    checkEmailIsAvailable(domain: string, message: string, initialEmail?: string): StringSchema;
  }
}

export const string: StringSchemaConstructor;
