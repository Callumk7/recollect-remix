import { relations } from "drizzle-orm";
import {
	boolean,
	date,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users-profiles";
import { collections } from "./collections";
import { groups } from "./groups";

export const posts = pgTable("posts", {
	id: text("id").primaryKey(),
	title: text("title"),
	// created and updated are dates when the post was created in the database
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	isUpdated: boolean("is_updated").default(false),

	// these times are what the user sets in the UI for journal entries
	day: integer("day").notNull(),
	month: integer("month").notNull(),
	year: integer("year").notNull(),
	entryDate: date("entry_date").notNull().defaultNow(),
	body: text("body").notNull(),
	pageId: text("page_id"),
	authorId: text("author_id").notNull(),
	isPrivate: boolean("is_private").notNull().default(true),
	likes: integer("likes").default(0),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id],
	}),
	collection: one(collections, {
		fields: [posts.pageId],
		references: [collections.id],
	}),
	savedBy: many(postsSavedByUsers),
	notes: many(notes),
}));

export const postsSavedByUsers = pgTable(
	"posts_saved_by_users",
	{
		userId: text("user_id").notNull(),
		postId: text("post_id").notNull(),
	},
	(t) => ({
		pk: primaryKey(t.userId, t.postId),
	}),
);

export const parentTypeEnum = pgEnum("parent_type", ["note", "page", "group", "post"]);

// Notes are to be thought of as the main currency of communication on the platform, akin to tweets.
// They are short form communication that be be cross posted and used as messages, comments and feeds.
export const notes = pgTable("notes", {
	id: text("id").primaryKey(),
	// parent logic. We have an enum value for the parent type. we then have four options for foreign
	// relations. This should simplify logic in the application layer.
	parentType: parentTypeEnum("parent_type"),
	parentNoteId: text("parent_note_id"),
	groupId: text("group_id"),
	pageId: text("page_id"),
	postId: text("post_id"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	isUpdated: boolean("is_updated").default(false),
	// these times are what the user sets in the UI for journal entries
	body: text("body").notNull(),
	authorId: text("author_id").notNull(),
	isPrivate: boolean("is_private").notNull().default(false),
	likes: integer("likes").default(0),
});

export const notesRelations = relations(notes, ({ one, many }) => ({
	author: one(users, {
		fields: [notes.authorId],
		references: [users.id],
		relationName: "author",
	}),
	group: one(groups, {
		fields: [notes.groupId],
		references: [groups.id],
	}),
	collection: one(collections, {
		fields: [notes.pageId],
		references: [collections.id],
	}),
	post: one(posts, {
		fields: [notes.postId],
		references: [posts.id],
	}),
	parentNote: one(notes, {
		fields: [notes.parentNoteId],
		references: [notes.id],
	}),
	childNotes: many(subNotes),
}));

export const subNotes = pgTable(
	"sub_notes",
	{
		parentId: text("parent_id").notNull(),
		childId: text("child_id").notNull(),
	},
	(t) => ({
		pk: primaryKey(t.parentId, t.childId),
	}),
);

export const subNotesRelations = relations(subNotes, ({ one }) => ({
	parent: one(notes, {
		fields: [subNotes.parentId],
		references: [notes.id],
		relationName: "parent_note",
	}),
	child: one(notes, {
		fields: [subNotes.childId],
		references: [notes.id],
		relationName: "child_note",
	}),
}));
