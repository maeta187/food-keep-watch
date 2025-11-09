import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

import { sampleFoods } from '@/src/database/sample-data'
import { foods } from '@/src/database/schema'

const OUTPUT_DIR = path.resolve('.local/sqlite')
const DB_PATH = path.join(OUTPUT_DIR, 'food-keep-watch.db')

const main = async () => {
	console.log('🌱 ローカル SQLite にサンプルデータを投入します...')
	mkdirSync(OUTPUT_DIR, { recursive: true })

	const sqlite = new Database(DB_PATH)
	sqlite.exec('PRAGMA journal_mode = WAL;')

	const db = drizzle(sqlite)
	migrate(db, { migrationsFolder: path.resolve('drizzle') })
	db.delete(foods).run()
	db.insert(foods).values(sampleFoods).run()

	sqlite.close()
	console.log(`✅ シードが完了しました: ${DB_PATH}`)
}

main().catch((error) => {
	console.error('❌ シードに失敗しました', error)
	process.exit(1)
})
