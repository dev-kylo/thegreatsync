import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to the first client for now
  redirect('/client1')
}
