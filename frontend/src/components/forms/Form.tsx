/**
 * @file Form.tsx
 * @description Generic form wrapper component integrated with react-hook-form and Zod.
 *
 * Provides a standardized way to build forms across the application. Handles
 * form state, validation resolution via Zod, and typed submission handlers.
 * Uses a render prop (`children`) to expose form methods to input components.
 */

import React from 'react';
import { useForm, UseFormReturn, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

export interface FormProps<TFormValues extends FieldValues> {
  schema: ZodSchema<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  className?: string;
}

export function Form<TFormValues extends FieldValues>({
  schema,
  onSubmit,
  children,
  className = '',
}: FormProps<TFormValues>) {
  const methods = useForm<TFormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={methods.handleSubmit((data) => onSubmit(data))} className={className}>
      {children(methods)}
    </form>
  );
}
