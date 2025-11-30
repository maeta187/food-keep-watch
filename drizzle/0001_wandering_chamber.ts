const migration = `
CREATE TABLE \`categories\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`name\` text NOT NULL,
	\`visible\` integer DEFAULT 1 NOT NULL,
	\`created_at\` integer DEFAULT (unixepoch()) NOT NULL,
	\`updated_at\` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX \`categories_name_unique\` ON \`categories\` (\`name\`);
--> statement-breakpoint
INSERT INTO \`categories\` (\`name\`, \`visible\`) VALUES
('乳製品', 1),
('野菜', 1),
('肉', 1),
('飲料', 1),
('冷凍食品', 1);
`

export default migration
