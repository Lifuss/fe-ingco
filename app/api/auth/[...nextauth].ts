import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const options = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = {
          id: 1,
          name: 'J Smith',
          email: '',
        };
      },
    }),
  ],
};
