// This page is reserved for future odds converter feature
// Currently redirects to home page
import { redirect } from 'next/navigation';
import { defaultLocale, localizePath } from '../i18n';

export default function OddsConverterPage() {
  redirect(localizePath('/', defaultLocale));
}
