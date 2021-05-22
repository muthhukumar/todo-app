import jwt from 'jsonwebtoken'

/**
 * @function
 * @exports generateToken
 * @param {object} payload
 * @param {(Buffer | string)} secret
 * @returns {string} token
 */
export function generateToken(payload: object = {}, secret: string | Buffer) {
  let jwtSecret = secret
  if (!secret) {
    jwtSecret = process.env.JWT_SECRET as string
  }
  return jwt.sign(payload, jwtSecret, { algorithm: 'HS256' })
}

/**
 * @function
 * @exports decodeToken
 * @param {string} token
 * @param {Buffer | string} secret
 * @returns {object} payload
 */
export function decodeToken(token: string, secret: string | Buffer) {
  let jwtSecret = secret
  if (!secret) {
    jwtSecret = process.env.JWT_SECRET as string
  }
  return jwt.verify(token, jwtSecret, { algorithms: ['HS256'] })
}

export const wait: (fn: Function) => number = (fn) => setTimeout(fn, 500)
