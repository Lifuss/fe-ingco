import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('Feed generation is disabled.', {
    status: 410,
  });
}
