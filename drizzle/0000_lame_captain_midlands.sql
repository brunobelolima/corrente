CREATE TABLE `profile_photos` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_email` text NOT NULL,
	`object_key` text NOT NULL,
	`position` integer NOT NULL,
	`content_type` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`profile_email`) REFERENCES `profiles`(`email`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`email` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`birth_date` text NOT NULL,
	`city` text NOT NULL,
	`level` text NOT NULL,
	`bio` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
