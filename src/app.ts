import express from 'express'
import jsonErrorHandler from './middleware/jsonErrors'
import { type Database } from './database'
import movies from '@/modules/movies/controller'
import users from '@/modules/users/controller'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function createApp(db: Database) {
  const app = express()

  app.use(express.json())

  app.use('/movies', movies(db))
  app.use('/users', users(db))

  app.use(jsonErrorHandler)

  return app
}