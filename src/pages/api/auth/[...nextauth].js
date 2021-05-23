import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { decodeToken, generateToken } from '../../../utils/main'

export default NextAuth({
  providers: [
    Providers.Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  pages: {
    signIn: '/auth/signin',
  },

  session: {
    jwt: true,
  },

  callbacks: {
    async session(session, token) {
      session.id = token.sub
      session.token = generateToken(token, process.env.JWT_SECRET)
      session.userId = String(token.sub)
      session.user.email = token.email
      return Promise.resolve(session)
    },
    async jwt(token, user) {
      const userSignedIn = Boolean(user)
      if (userSignedIn) {
        token.name = user.name
        token.sub = String(user.id)
        token.id = String(user.id)
      }
      return Promise.resolve(token)
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    async encode({ secret, token, maxAge }) {
      const jwtPayload = {
        'sub': String(token.sub),
        'name': String(token.name),
        'iat': Date.now() / 1000, // Issued at
        'email': token.email,
        'expiresAt': Math.floor(Date.now()) + 24 * 60 * 60,
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['user'],
          'x-hasura-default-role': 'user',
          'x-hasura-user-id': String(token.sub),
          'x-hasura-role': 'user',
        },
      }
      const encodedToken = generateToken(jwtPayload, secret)
      return Promise.resolve(encodedToken)
    },
    async decode({ secret, token }) {
      return Promise.resolve(decodeToken(token, secret))
    },
  },

  database: process.env.DATABASE_URL,
})
