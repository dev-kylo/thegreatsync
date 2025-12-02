import { readFile } from 'fs/promises'
import path from 'path'
import { AuditDashboard } from '@/components/AuditDashboard'
import type { AuditData } from '@/lib/types'

// Disable static generation for this page since it uses client-side theme
export const dynamic = 'force-dynamic'

export default async function Client1Page() {
  // Read the audit data from the JSON file
  const filePath = path.join(process.cwd(), 'app/client1/audit.json')
  const fileContents = await readFile(filePath, 'utf-8')
  const data = JSON.parse(fileContents) as AuditData

  return <AuditDashboard data={data} />
}
