'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { FormField } from '@/components/common/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StateView } from '@/components/ui/state-view';
import { Textarea } from '@/components/ui/textarea';
import { contactSchema, type ContactInput } from '@/schemas/contact';

function ContactForm() {
  const t = useTranslations('contact');
  const tv = useTranslations('validation');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
  });

  if (isSubmitSuccessful) {
    return (
      <StateView
        icon={<CheckCircle2 className="text-success" />}
        title={t('sentTitle')}
        description={t('sentDesc')}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormField
        label={t('name')}
        htmlFor="name"
        error={errors.name?.message ? tv(errors.name.message) : undefined}
      >
        <Input id="name" {...register('name')} />
      </FormField>
      <FormField
        label={t('email')}
        htmlFor="email"
        error={errors.email?.message ? tv(errors.email.message) : undefined}
      >
        <Input id="email" type="email" {...register('email')} />
      </FormField>
      <FormField
        label={t('message')}
        htmlFor="message"
        error={errors.message?.message ? tv(errors.message.message) : undefined}
      >
        <Textarea id="message" rows={5} {...register('message')} />
      </FormField>
      <Button type="submit" disabled={isSubmitting} className="self-start">
        {t('send')}
      </Button>
    </form>
  );
}

export { ContactForm };
