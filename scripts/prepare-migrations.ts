import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const DRIZZLE_DIR = path.resolve('drizzle')

const wrapAsTsModule = (sql: string): string =>
	`const migration = \`
${sql.trim()}
\`

export default migration
`

const convertSqlMigrations = () => {
	const entries = readdirSync(DRIZZLE_DIR, { withFileTypes: true })
	const sqlFiles = entries
		.filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
		.map((entry) => entry.name)

	sqlFiles.forEach((fileName) => {
		const sqlPath = path.join(DRIZZLE_DIR, fileName)
		const tsPath = path.join(DRIZZLE_DIR, fileName.replace(/\.sql$/, '.ts'))

		const sqlContent = readFileSync(sqlPath, 'utf8')
		writeFileSync(tsPath, wrapAsTsModule(sqlContent))
		rmSync(sqlPath)
	})
}

const updateMigrationsIndex = () => {
	const migrationsJsPath = path.join(DRIZZLE_DIR, 'migrations.js')
	const content = readFileSync(migrationsJsPath, 'utf8')
	const replaced = content.replace(/\\.sql(['"])/g, '$1')
	writeFileSync(migrationsJsPath, replaced)
}

convertSqlMigrations()
updateMigrationsIndex()
