import { proxyFeed } from '../../feedProxy';

export async function GET() {
  return proxyFeed('/api/feeds/monomarket/prices', 'json');
}
