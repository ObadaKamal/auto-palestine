import { Globe, Mail, MapPin, Phone, Share2 } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ContactForm } from '@/components/content/contact-form';
import { PageContainer } from '@/components/layout/page-container';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('title') };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  const info = [
    { icon: <MapPin />, label: t('addressLabel'), value: t('addressValue') },
    { icon: <Phone />, label: t('phoneLabel'), value: t('phoneValue') },
    { icon: <Mail />, label: t('emailLabel'), value: t('emailValue') },
  ];

  return (
    <PageContainer className="py-16">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-headline-lg text-foreground md:text-headline-xl">
          {t('title')}
        </h1>
        <p className="mt-2 text-body-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card shadow-modal md:grid-cols-12">
        {/* Details panel (navy) */}
        <div className="relative flex flex-col justify-between gap-10 bg-secondary p-10 text-white md:col-span-5">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at top left, #ffffff 10%, transparent 70%)',
            }}
          />
          <div className="relative">
            <h2 className="mb-6 text-headline-md">{t('infoTitle')}</h2>
            <p className="mb-10 text-body-md leading-relaxed text-white/80">
              {t('infoDesc')}
            </p>
            <div className="flex flex-col gap-6">
              {info.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="mt-1 text-primary [&_svg]:size-5">
                    {item.icon}
                  </span>
                  <div>
                    <h4 className="mb-1 text-label-md font-bold">
                      {item.label}
                    </h4>
                    <p className="text-body-md text-white/80" dir="ltr">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex gap-4 border-t border-white/10 pt-8">
            <span className="flex size-10 items-center justify-center rounded-full bg-white/10">
              <Globe className="size-5" />
            </span>
            <span className="flex size-10 items-center justify-center rounded-full bg-white/10">
              <Share2 className="size-5" />
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="p-10 md:col-span-7">
          <h3 className="mb-2 text-headline-md text-foreground">
            {t('sendTitle')}
          </h3>
          <p className="mb-8 text-body-md text-muted-foreground">
            {t('sendDesc')}
          </p>
          <ContactForm />
        </div>
      </div>
    </PageContainer>
  );
}
