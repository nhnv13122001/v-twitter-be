import crypto from 'crypto'

export const sha256 = (content: string) => {
  return crypto.createHash('sha256').update(content).digest('hex')
}

export const hassPassword = (password: string) => {
  return sha256(password + process.env.PASSWORD_SECRET)
}
