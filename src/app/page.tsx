
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/cash-register/open');
  return null; // Or a loading spinner, but redirect is usually sufficient
}
