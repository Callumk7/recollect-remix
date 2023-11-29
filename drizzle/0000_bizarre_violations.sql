DO $$ BEGIN
 CREATE TYPE "parent_type" AS ENUM('note', 'page', 'group', 'post');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collections" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text DEFAULT 'Page Title' NOT NULL,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_updated" boolean DEFAULT false,
	"day" integer NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"entry_date" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_groups" (
	"user_id" text NOT NULL,
	"group_id" text NOT NULL,
	CONSTRAINT users_to_groups_user_id_group_id PRIMARY KEY("user_id","group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notes" (
	"id" text PRIMARY KEY NOT NULL,
	"parent_type" "parent_type",
	"parent_note_id" text,
	"group_id" text,
	"page_id" text,
	"post_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_updated" boolean DEFAULT false,
	"body" text NOT NULL,
	"author_id" text NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL,
	"likes" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_updated" boolean DEFAULT false,
	"day" integer NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"entry_date" date DEFAULT now() NOT NULL,
	"body" text NOT NULL,
	"page_id" text,
	"author_id" text NOT NULL,
	"is_private" boolean DEFAULT true NOT NULL,
	"likes" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts_saved_by_users" (
	"user_id" text NOT NULL,
	"post_id" text NOT NULL,
	CONSTRAINT posts_saved_by_users_user_id_post_id PRIMARY KEY("user_id","post_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sub_notes" (
	"parent_id" text NOT NULL,
	"child_id" text NOT NULL,
	CONSTRAINT sub_notes_parent_id_child_id PRIMARY KEY("parent_id","child_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"user_name" text NOT NULL,
	"profile_picture_url" text,
	"bio" text,
	"date_of_birth" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_friends" (
	"user_id" text NOT NULL,
	"friend_id" text NOT NULL,
	CONSTRAINT user_friends_user_id_friend_id PRIMARY KEY("user_id","friend_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
