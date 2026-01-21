import { NextRequest, NextResponse } from 'next/server'
import { getTrades } from '@/services/dashboard'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '10')
  
  const trades = await getTrades(page, pageSize)
  return NextResponse.json(trades)
}
