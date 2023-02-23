import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const cron = req.nextUrl.searchParams.get('cron')
  if (!cron) return new Response('No cron provided', { status: 400 })
  const response = {
    interval: cron
  }
  return new NextResponse(JSON.stringify(response), {
    status: 200,
  })
}