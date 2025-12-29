const migration = `
CREATE TABLE \`app_settings\` (
	\`key\` text PRIMARY KEY NOT NULL,
	\`value\` text NOT NULL,
	\`created_at\` integer NOT NULL DEFAULT (unixepoch()),
	\`updated_at\` integer NOT NULL DEFAULT (unixepoch())
);
`

export default migration
