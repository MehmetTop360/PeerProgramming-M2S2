import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { Insertable } from 'kysely'
import createApp from '@/app'
import { Users } from '@/database'

const db = await createTestDatabase()
const app = createApp(db)

afterEach(async () => {
  await db.deleteFrom('users').execute()
})

afterAll(async () => {
  await db.destroy()
})

const userFactory = (
  overrides: Partial<Insertable<Users>> = {}
): Insertable<Users> => ({
  name: 'example1',
  ...overrides,
})

describe('Users API', () => {
  describe('POST /users', () => {
    it('allows creating a new user', async () => {
      const newUser = userFactory()
      const { body } = await supertest(app)
        .post('/users')
        .send(newUser)
        .expect(201)

      expect(body).toEqual(expect.objectContaining(newUser))
    })
  })

  describe('DELETE /users/:id', () => {
    it('allows deleting a user', async () => {
      const newUser = userFactory()
      const createResponse = await supertest(app)
        .post('/users')
        .send(newUser)
        .expect(201)

      const createdUser = createResponse.body

      const deleteResponse = await supertest(app).delete(
        `/users/${createdUser.id}`
      )
      expect(deleteResponse.status).toBe(204)

      const getResponse = await supertest(app).get(`/users/${createdUser.id}`)
      expect(getResponse.status).toBe(404)
    })
  })

  describe('GET /users', () => {
    it('retrieves all users', async () => {
      const user1 = userFactory({ name: 'User1' })
      const user2 = userFactory({ name: 'User2' })
      await supertest(app).post('/users').send(user1).expect(201)
      await supertest(app).post('/users').send(user2).expect(201)

      const { body: users } = await supertest(app).get('/users').expect(200)

      expect(users).toEqual(
        expect.arrayContaining([
          expect.objectContaining(user1),
          expect.objectContaining(user2),
        ])
      )
    })

    it('retrieves a single user by id', async () => {
      const newUser = userFactory()
      const { body: createdUser } = await supertest(app)
        .post('/users')
        .send(newUser)
        .expect(201)

      const { body: fetchedUser } = await supertest(app)
        .get(`/users/${createdUser.id}`)
        .expect(200)

      expect(fetchedUser).toEqual(expect.objectContaining(newUser))
    })
  })
})