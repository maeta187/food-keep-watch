import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './src/database/schema.ts',
	out: './drizzle',
	driver: 'expo',
	dialect: 'sqlite',
	strict: true,
	verbose: true
})
