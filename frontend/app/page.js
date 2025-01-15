import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
  // Note: Any code after redirect won't be executed
}
