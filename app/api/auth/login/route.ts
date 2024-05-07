import { apiIngco } from '@/lib/utils';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const response = await apiIngco.post('/api/auth/login');
  return response.data;
}
