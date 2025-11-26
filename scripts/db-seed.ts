import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'

import migrations from '@/drizzle/migrations'
import { sampleFoods } from '@/src/database/sample-data'
import { foods } from '@/src/database/schema'

const OUTPUT_DIR = path.resolve('.local/sqlite')
const DB_PATH = path.join(OUTPUT_DIR, 'food-keep-watch.db')

const main = async () => {
	console.log('🌱 ローカル SQLite にサンプルデータを投入します...')
	mkdirSync(OUTPUT_DIR, { recursive: true })
	if (existsSync(DB_PATH)) {
		rmSync(DB_PATH)
	}

	const sqlite = new Database(DB_PATH)
	sqlite.exec('PRAGMA journal_mode = WAL;')

	const orderedMigrations = [...migrations.journal.entries]
		.sort((left, right) => left.idx - right.idx)
		.map(({ tag }) => {
			const key = `m${tag.slice(0, 4)}`
			const migration = migrations.migrations[key]

			if (!migration) {
				throw new Error(`Missing migration for tag ${tag}`)
			}

			return migration
		})

	orderedMigrations.forEach((sql) => {
		sqlite.exec(sql)
	})

	const db = drizzle(sqlite)
	db.delete(foods).run()
	db.insert(foods).values(sampleFoods).run()

	sqlite.close()
	console.log(`✅ シードが完了しました: ${DB_PATH}`)
}

main().catch((error) => {
	console.error('❌ シードに失敗しました', error)
	process.exit(1)
})
