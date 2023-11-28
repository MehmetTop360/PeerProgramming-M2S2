import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import buildRepository from './repository'
import * as schema from './schema'
import { jsonRoute } from '@/utils/middleware'
import type { Database } from '@/database'
import NotFound from '@/utils/errors/NotFound'

export default (db: Database) => {
  const router = Router()
  const users = buildRepository(db)

  router
    .route('/')
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)
        return users.create(body)
      }, StatusCodes.CREATED)
    )
    .get(jsonRoute(async () => users.findAll()))

  router
    .route('/:id')
    .get(
      jsonRoute(async (req, res) => {
        const userId = parseInt(req.params.id, 10)

        const user = await users.findById(userId)
        if (!user) {
          throw new NotFound('User not found.')
        }

        return res.json(user)
      })
    )

    .delete(
      jsonRoute(async (req) => {
        const userId = parseInt(req.params.id, 10)
        return users.remove(userId)
      }, StatusCodes.NO_CONTENT)
    )

  return router
}