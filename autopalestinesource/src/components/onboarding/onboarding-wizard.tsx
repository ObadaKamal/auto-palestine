'use client';

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  MapPin,
  Plus,
  Store,
  Trash2,
  Wrench,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StateView } from '@/components/ui/state-view';
import { Stepper } from '@/components/ui/stepper';
import { Textarea } from '@/components/ui/textarea';
import { Link } from '@/i18n/navigation';
import { publishBusiness } from '@/lib/actions';
import { cn } from '@/lib/utils';

type Option = { value: string; label: string };

const selectClass = cn(
  'h-10 w-full rounded-[var(--radius)] border border-input bg-muted px-3 text-body-md text-foreground',
  'focus-visible:border-ring focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none',
);

function StepHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <h2 className="mb-8 flex items-center gap-2 border-b border-border pb-4 text-headline-md text-foreground [&_svg]:size-6 [&_svg]:text-primary">
      {icon}
      {title}
    </h2>
  );
}

function OnboardingWizard({
  cityOptions,
  categoryOptions,
}: {
  cityOptions: Option[];
  categoryOptions: Option[];
}) {
  const t = useTranslations('onboarding');
  const [step, setStep] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [services, setServices] = React.useState<string[]>(['']);

  const [form, setForm] = React.useState({
    name: '',
    categoryId: categoryOptions[0]?.value ?? '',
    description: '',
    cityId: cityOptions[0]?.value ?? '',
    address: '',
    phone: '',
  });
  const update = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const steps = [
    { id: 'basics', label: t('stepBasics') },
    { id: 'location', label: t('stepLocation') },
    { id: 'services', label: t('stepServices') },
    { id: 'review', label: t('stepReview') },
  ];

  function publish() {
    startTransition(async () => {
      await publishBusiness(form);
      setDone(true);
    });
  }

  if (done) {
    return (
      <Card>
        <CardContent className="py-6">
          <StateView
            icon={<CheckCircle2 className="text-success" />}
            title={t('publishedTitle')}
            description={t('publishedDesc')}
            action={
              <Button asChild>
                <Link href="/dashboard">{t('goToDashboard')}</Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <Stepper steps={steps} current={step} />

      <Card>
        <CardContent className="p-6 md:p-10">
          {step === 0 ? (
            <>
              <StepHeading icon={<Store />} title={t('basicsTitle')} />
              <div className="flex flex-col gap-6">
                <div className="space-y-1.5">
                  <Label htmlFor="name">{t('businessName')}</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => update('name')(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="category">{t('category')}</Label>
                    <select
                      id="category"
                      className={selectClass}
                      value={form.categoryId}
                      onChange={(e) => update('categoryId')(e.target.value)}
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      dir="ltr"
                      placeholder="+970 5x xxx xxxx"
                      value={form.phone}
                      onChange={(e) => update('phone')(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">{t('description')}</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={form.description}
                    onChange={(e) => update('description')(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <StepHeading icon={<MapPin />} title={t('locationTitle')} />
              <div className="flex flex-col gap-6">
                <div
                  className="flex h-56 items-center justify-center rounded-lg border border-border"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 40% 40%, rgba(255,101,0,0.18), transparent 45%), linear-gradient(180deg,#eceef1,#e0e3e6)',
                  }}
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <MapPin className="size-6" />
                  </span>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">{t('city')}</Label>
                  <select
                    id="city"
                    className={selectClass}
                    value={form.cityId}
                    onChange={(e) => update('cityId')(e.target.value)}
                  >
                    {cityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address">{t('address')}</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => update('address')(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <StepHeading icon={<Wrench />} title={t('servicesTitle')} />
              <div className="flex flex-col gap-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={service}
                      onChange={(event) =>
                        setServices((prev) =>
                          prev.map((item, i) =>
                            i === index ? event.target.value : item,
                          ),
                        )
                      }
                    />
                    {services.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={t('back')}
                        onClick={() =>
                          setServices((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <Trash2 />
                      </Button>
                    ) : null}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={() => setServices((prev) => [...prev, ''])}
                >
                  <Plus />
                  {t('addService')}
                </Button>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <StepHeading icon={<ClipboardCheck />} title={t('reviewTitle')} />
              <dl className="flex flex-col divide-y divide-border">
                {[
                  { label: t('businessName'), value: form.name },
                  {
                    label: t('category'),
                    value:
                      categoryOptions.find((c) => c.value === form.categoryId)
                        ?.label ?? '',
                  },
                  {
                    label: t('city'),
                    value:
                      cityOptions.find((c) => c.value === form.cityId)?.label ??
                      '',
                  },
                  { label: t('address'), value: form.address },
                  { label: t('phone'), value: form.phone },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between gap-4 py-3"
                  >
                    <dt className="text-body-md text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="text-body-md text-foreground">
                      {row.value || '—'}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 rounded-md bg-muted p-3 text-body-md text-muted-foreground">
                {t('reviewNote')}
              </p>
            </>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((prev) => Math.max(0, prev - 1))}
        >
          <ArrowRight className="rtl:rotate-180" />
          {t('back')}
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" onClick={() => setStep((prev) => prev + 1)}>
            {t('next')}
            <ArrowLeft className="rtl:rotate-180" />
          </Button>
        ) : (
          <Button type="button" onClick={publish} disabled={pending}>
            {t('publish')}
            <CheckCircle2 />
          </Button>
        )}
      </div>

      <p className="text-center text-label-md text-muted-foreground">
        {t('demoNote')}
      </p>
    </div>
  );
}

export { OnboardingWizard };
