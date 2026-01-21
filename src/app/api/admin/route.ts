import { NextRequest, NextResponse } from 'next/server'
import { getAdminStats } from '@/services/admin'

export async function GET() {
  const stats = await getAdminStats()
  return NextResponse.json(stats)
}
