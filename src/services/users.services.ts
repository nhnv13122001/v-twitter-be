import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import { hassPassword } from '~/utils/crypto'
import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { IRegisterReqBody } from '~/models/requests/User.requests'

class UsersService {
  private signAccessToken = (user_id: string) => {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) as number
      }
    })
  }
  private signRefreshToken = (user_id: string) => {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) as number
      }
    })
  }
  async register(payload: IRegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        password: hassPassword(payload.password),
        date_of_birth: new Date(payload.date_of_birth)
      })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return {
      access_token,
      refresh_token
    }
  }
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({
      email
    })
    return Boolean(user)
  }
}

const usersService = new UsersService()
export default usersService
