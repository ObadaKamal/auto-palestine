'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { FormField } from '@/components/common/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction } from '@/lib/auth/actions';
import { cn } from '@/lib/utils';
import { loginSchema, type LoginInput } from '@/schemas/auth';

const selectClass = cn(
  'h-10 w-full rounded-[var(--radius)] border border-input bg-muted px-3 text-body-md text-foreground',
  'focus-visible:border-ring focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none',
);
const socialBtn =
  'flex flex-1 items-center justify-center gap-2 rounded-[var(--radius)] border border-input py-2.5 text-label-md font-medium text-foreground transition-colors hover:bg-accent';

function LoginForm() {
  const t = useTranslations('auth');
  const tv = useTranslations('validation');
  const locale = useLocale();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', role: 'owner', locale },
  });

  const onSubmit = handleSubmit(async (values) => {
    await loginAction(values);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormField
        label={t('email')}
        htmlFor="email"
        error={errors.email?.message ? tv(errors.email.message) : undefined}
      >
        <div className="relative">
          <Mail className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="ps-10"
            {...register('email')}
          />
        </div>
      </FormField>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t('password')}</Label>
          <span className="text-label-md text-primary">
            {t('forgotPassword')}
          </span>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            className="ps-10"
            {...register('password')}
          />
        </div>
        {errors.password?.message ? (
          <p className="text-label-md text-destructive">
            {tv(errors.password.message)}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="role">{t('role')}</Label>
        <select id="role" className={selectClass} {...register('role')}>
          <option value="owner">{t('roleOwner')}</option>
          <option value="admin">{t('roleAdmin')}</option>
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {t('login')}
        <ArrowLeft className="rtl:rotate-180" />
      </Button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-label-md text-muted-foreground">
          {t('orContinue')}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="flex gap-4">
        <button type="button" className={socialBtn} aria-label="Google">
          <svg className="size-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
            />
          </svg>
          Google
        </button>
        <button type="button" className={socialBtn} aria-label="Apple">
          <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.8 1.95.12 3.25 1.03 4.14 2.34-3.32 1.83-2.73 6.06.54 7.21-.77 1.8-1.84 3.65-3.26 3.42zM13.25 5.55c.69-1.54-.53-3.13-1.89-3.55-.83 1.62.67 3.31 1.89 3.55z" />
          </svg>
          Apple
        </button>
      </div>

      <p className="rounded-md bg-muted p-3 text-label-md text-muted-foreground">
        {t('demoNote')}
      </p>
    </form>
  );
}

export { LoginForm };
