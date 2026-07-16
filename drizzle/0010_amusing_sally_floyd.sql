CREATE TABLE `trip_group_members` (
	`group_id` text NOT NULL,
	`profile_email` text NOT NULL,
	`joined_at` integer NOT NULL,
	PRIMARY KEY(`group_id`, `profile_email`)
);
--> statement-breakpoint
CREATE TABLE `trip_group_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL,
	`profile_email` text NOT NULL,
	`author_name` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer NOT NULL
);
