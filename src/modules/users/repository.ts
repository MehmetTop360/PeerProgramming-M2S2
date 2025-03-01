import type { Insertable, Selectable } from 'kysely'
import type { Database, Users } from '@/database'
import { keys } from './schema'

const TABLE = 'users'
type Row = Users
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowSelect = Selectable<Row>

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute()
  },

  findById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst()
  },

  create(record: RowInsert): Promise<RowSelect | undefined> {
    return db.insertInto(TABLE).values(record).returningAll().executeTakeFirst()
  },

  remove(id: number) {
    return db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  },
})