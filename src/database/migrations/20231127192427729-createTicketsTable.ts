import { Kysely, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('tickets')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('screening_id', 'integer', (c) =>
      c.references('screenings.id').notNull()
    )
    .addColumn('user_id', 'integer', (c) => c.notNull())
    .addColumn('booking_time', 'datetime', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('tickets').execute()
}
