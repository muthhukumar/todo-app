import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

import { decodeToken, generateToken } from '../../../utils/main'

const maxAge = process.env.MAX_AGE ? Number(process.env.MAX_AGE) : 60 * 60 * 24 * 7 // One week

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  // pages: {
  //   signIn: '/auth/signin',
  // },

  session: {
    maxAge,
    strategy: 'jwt',
  },

  callbacks: {
    async session({ session, token }) {
      session.id = token.sub
      session.token = generateToken(token, process.env.JWT_SECRET)
      session.userId = String(token.sub)
      session.user.email = token.email

      console.log('session', session)
      return Promise.resolve(session)
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name
        token.sub = String(user.id)
        token.id = String(user.id)
        token.accessToken = user.access_token
      }
      return Promise.resolve(token)
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    async encode({ secret, token, maxAge }) {
      console.log('In the otken', { secret, token, maxAge })
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
        state: token.state,
      }
      const encodedToken = generateToken(jwtPayload, secret, maxAge)
      return Promise.resolve(encodedToken)
    },
    async decode({ secret, token }) {
      return Promise.resolve(decodeToken(token, secret))
    },
  },
})
