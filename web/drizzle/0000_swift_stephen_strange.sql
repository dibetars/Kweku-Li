CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`action` text NOT NULL,
	`key` text,
	`before` text,
	`after` text,
	`created_at` text NOT NULL,
	`ip` text
);
--> statement-breakpoint
CREATE TABLE `content` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_by` integer,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);