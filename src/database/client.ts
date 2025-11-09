import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite'
import { migrate } from 'drizzle-orm/expo-sqlite/migrator'
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite'

import migrations from '@/drizzle/migrations'
import * as schema from '@/src/database/schema'

const DB_NAME = 'food-keep-watch.db'

let sqliteInstance: SQLiteDatabase | null = null
let drizzleDb: ExpoSQLiteDatabase<typeof schema> | null = null
let isMigrated = false

const runMigrations = async (
	db: ExpoSQLiteDatabase<typeof schema>
): Promise<void> => {
	if (isMigrated) {
		return
	}

	await migrate(db, migrations)
	isMigrated = true
}

const createSQLiteInstance = async (): Promise<SQLiteDatabase> => {
	if (sqliteInstance) {
		return sqliteInstance
	}

	sqliteInstance = await openDatabaseAsync(DB_NAME)
	await sqliteInstance.execAsync('PRAGMA journal_mode = WAL;')

	return sqliteInstance
}

const createDrizzleDb = async (): Promise<
	ExpoSQLiteDatabase<typeof schema>
> => {
	if (drizzleDb) {
		return drizzleDb
	}

	const sqliteDb = await createSQLiteInstance()
	drizzleDb = drizzle(sqliteDb, { schema })
	await runMigrations(drizzleDb)

	return drizzleDb
}

export const getDb = async (): Promise<ExpoSQLiteDatabase<typeof schema>> =>
	await createDrizzleDb()

export type Database = Awaited<ReturnType<typeof getDb>>
