const migration = `
CREATE TABLE \`categories\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`name\` text NOT NULL,
	\`visible\` integer DEFAULT true NOT NULL,
	\`created_at\` integer DEFAULT (unixepoch()) NOT NULL,
	\`updated_at\` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX \`categories_name_unique\` ON \`categories\` (\`name\`);
--> statement-breakpoint
INSERT INTO \`categories\` (\`name\`) VALUES
('乳製品'),
('野菜'),
('肉'),
('飲料'),
('冷凍食品');
`

export default migration
