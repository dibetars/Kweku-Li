CREATE TABLE `submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`company` text,
	`service` text,
	`timeline` text,
	`budget` text,
	`location` text,
	`message` text NOT NULL,
	`ip` text,
	`user_agent` text,
	`status` text DEFAULT 'new' NOT NULL,
	`email_status` text,
	`email_sent_at` text,
	`created_at` text NOT NULL
);
