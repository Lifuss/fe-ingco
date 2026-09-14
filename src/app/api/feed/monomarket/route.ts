import { proxyFeed } from '../feedProxy';

export async function GET() {
  return proxyFeed('/api/feeds/monomarket/xml', 'xml');
}
