import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { Insertable } from 'kysely'
import createApp from '@/app'
import { Movies } from '@/database'

const db = await createTestDatabase()
const app = createApp(db)

afterEach(async () => {
  await db.deleteFrom('movies').execute()
})

afterAll(async () => {
  await db.destroy()
})

const movieFactory = (
  overrides: Partial<Insertable<Movies>> = {}
): Insertable<Movies> => ({
  title: 'Example Movie',
  year: 2021,
  ...overrides,
})

describe('Movies API', () => {
  it('allows creating a new movie', async () => {
    const newMovie = movieFactory()
    const { body } = await supertest(app)
      .post('/movies')
      .send(newMovie)
      .expect(201)

    expect(body).toEqual(expect.objectContaining(newMovie))
  })

  it('allows deleting a movie', async () => {
    const newMovie = movieFactory()
    const createResponse = await supertest(app)
      .post('/movies')
      .send(newMovie)
      .expect(201)

    const createdMovie = createResponse.body
    await supertest(app).delete(`/movies/${createdMovie.id}`).expect(204)

    await supertest(app).get(`/movies/${createdMovie.id}`).expect(404)
  })

  it('retrieves all movies', async () => {
    const movie1 = movieFactory({ title: 'Movie1', year: 2001 })
    const movie2 = movieFactory({ title: 'Movie2', year: 2002 })
    await supertest(app).post('/movies').send(movie1).expect(201)
    await supertest(app).post('/movies').send(movie2).expect(201)

    const { body: movies } = await supertest(app).get('/movies').expect(200)
    expect(movies).toEqual(
      expect.arrayContaining([
        expect.objectContaining(movie1),
        expect.objectContaining(movie2),
      ])
    )
  })

  it('retrieves a single movie by id', async () => {
    const newMovie = movieFactory()
    const { body: createdMovie } = await supertest(app)
      .post('/movies')
      .send(newMovie)
      .expect(201)

    const { body: fetchedMovie } = await supertest(app)
      .get(`/movies/${createdMovie.id}`)
      .expect(200)

    expect(fetchedMovie).toEqual(expect.objectContaining(newMovie))
  })
})
