CREATE TABLE `foods` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`expiration_type` text NOT NULL,
	`expiration_date` text NOT NULL,
	`storage_location` text,
	`categories` text DEFAULT '[]' NOT NULL,
	`notification_date_time` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
