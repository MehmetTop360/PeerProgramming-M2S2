import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import buildRepository from './repository'
import * as schema from '@/modules/movies/schema'
import { jsonRoute } from '@/utils/middleware'
import type { Database } from '@/database'
import NotFound from '@/utils/errors/NotFound'

export default (db: Database) => {
  const router = Router()
  const movies = buildRepository(db)

  router
    .route('/')
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)
        return movies.create(body)
      }, StatusCodes.CREATED)
    )
    .get(jsonRoute(async () => movies.findAll()))

  router
    .route('/:id')
    .get(
      jsonRoute(async (req, res) => {
        const movieId = parseInt(req.params.id, 10)
        const movie = await movies.findById(movieId)
        if (!movie) {
          throw new NotFound('Movie not found.')
        }
        return res.json(movie)
      })
    )
    .delete(
      jsonRoute(async (req) => {
        const movieId = parseInt(req.params.id, 10)
        return movies.remove(movieId)
      }, StatusCodes.NO_CONTENT)
    )

  return router
}
