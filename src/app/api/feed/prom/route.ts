import { proxyFeed } from '../feedProxy';

export async function GET() {
  return proxyFeed('/api/feeds/prom/xml', 'xml');
}
