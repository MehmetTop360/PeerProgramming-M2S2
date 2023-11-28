import { z } from 'zod'
import type { Movies } from '@/database'

type Record = Movies

const schema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string(),
  year: z.number().int(),
})

const insertable = schema.omit({ id: true })
const partial = insertable.partial()

export const parseId = (id: unknown) => z.number().int().positive().parse(id)
export const parse = (record: unknown) => schema.parse(record)
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const parsePartial = (record: unknown) => partial.parse(record)

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
