'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, Phone, User } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { FormField } from '@/components/common/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerAction } from '@/lib/auth/actions';
import { registerSchema, type RegisterInput } from '@/schemas/auth';

function RegisterForm() {
  const t = useTranslations('auth');
  const tv = useTranslations('validation');
  const locale = useLocale();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', locale },
  });

  const onSubmit = handleSubmit(async (values) => {
    await registerAction(values);
  });

  const iconCls =
    'pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground';

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormField
        label={t('name')}
        htmlFor="name"
        error={errors.name?.message ? tv(errors.name.message) : undefined}
      >
        <div className="relative">
          <User className={iconCls} />
          <Input
            id="name"
            autoComplete="name"
            className="ps-10"
            {...register('name')}
          />
        </div>
      </FormField>

      <FormField
        label={t('email')}
        htmlFor="email"
        error={errors.email?.message ? tv(errors.email.message) : undefined}
      >
        <div className="relative">
          <Mail className={iconCls} />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="ps-10"
            {...register('email')}
          />
        </div>
      </FormField>

      <FormField
        label={t('phone')}
        htmlFor="phone"
        error={errors.phone?.message ? tv(errors.phone.message) : undefined}
      >
        <div className="relative">
          <Phone className={iconCls} />
          <Input
            id="phone"
            type="tel"
            placeholder="+970 5x xxx xxxx"
            className="ps-10"
            {...register('phone')}
          />
        </div>
      </FormField>

      <FormField
        label={t('password')}
        htmlFor="password"
        error={
          errors.password?.message ? tv(errors.password.message) : undefined
        }
      >
        <div className="relative">
          <Lock className={iconCls} />
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            className="ps-10"
            {...register('password')}
          />
        </div>
      </FormField>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {t('register')}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        {t('termsNote')}
      </p>
    </form>
  );
}

export { RegisterForm };
