import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const foods = sqliteTable('foods', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	expirationType: text('expiration_type').notNull(),
	expirationDate: text('expiration_date').notNull(),
	storageLocation: text('storage_location'),
	categories: text('categories').notNull().default('[]'),
	notificationDateTime: text('notification_date_time'),
	notificationId: text('notification_id'),
	createdAt: integer('created_at')
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer('updated_at')
		.notNull()
		.default(sql`(unixepoch())`)
})

export type Food = typeof foods.$inferSelect
export type NewFood = typeof foods.$inferInsert

export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	visible: integer('visible', { mode: 'boolean' }).notNull().default(true),
	createdAt: integer('created_at')
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer('updated_at')
		.notNull()
		.default(sql`(unixepoch())`)
})

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
