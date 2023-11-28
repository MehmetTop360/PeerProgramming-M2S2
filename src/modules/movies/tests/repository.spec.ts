import createTestDatabase from '@tests/utils/createTestDatabase'
import buildRepository from '@/modules/movies/repository'

const db = await createTestDatabase()

afterAll(async () => {
  await db.destroy()
})

describe('Movies Repository', async () => {
  it('should find all movies', async () => {
    const repository = buildRepository(db)
    const movies = await repository.findAll()
    expect(movies).toBeInstanceOf(Array)
  })

  it('should create a movie', async () => {
    const repository = buildRepository(db)
    const movie = await repository.create({ title: 'Test Movie', year: 2021 })
    expect(movie).toEqual(
      expect.objectContaining({ title: 'Test Movie', year: 2021 })
    )
  })

  it('should find a movie by id', async () => {
    const repository = buildRepository(db)
    const newMovie = await repository.create({
      title: 'Find Movie',
      year: 2021,
    })

    const foundMovie = await repository.findById(newMovie!.id)
    expect(foundMovie).toEqual(
      expect.objectContaining({ title: 'Find Movie', year: 2021 })
    )
  })

  it('should remove a movie', async () => {
    const repository = buildRepository(db)
    const newMovie = await repository.create({
      title: 'Delete Movie',
      year: 2021,
    })

    await repository.remove(newMovie!.id)
    const deletedMovie = await repository.findById(newMovie!.id)
    expect(deletedMovie).toBeUndefined()
  })
})
