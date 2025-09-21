import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validations.run(req)
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.mapped() })
    }
    return next()
  }
}
