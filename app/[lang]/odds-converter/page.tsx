import { notFound, redirect } from 'next/navigation';
import { defaultLocale, isLocale, localizePath } from '../../i18n';

export default async function OddsConverterPage(props: PageProps<'/[lang]/odds-converter'>) {
  const { lang } = await props.params;

  if (!isLocale(lang)) {
    notFound();
  }

  if (lang === defaultLocale) {
    redirect('/');
  }

  redirect(localizePath('/', lang));
}
