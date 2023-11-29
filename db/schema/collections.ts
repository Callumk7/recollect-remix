import { relations } from "drizzle-orm";
import { boolean, date, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users-profiles";
import { notes, posts } from "./posts-notes";

export const collections = pgTable("collections", {
	id: text("id").primaryKey(),
	title: text("title").notNull().default("Page Title"),
	ownerId: text("owner_id").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	isUpdated: boolean("is_updated").default(false),

	// these times are what the user sets in the UI for journal entries
	day: integer("day").notNull(),
	month: integer("month").notNull(),
	year: integer("year").notNull(),
	entryDate: date("entry_date").notNull().defaultNow(),
});

export const collectionsRelations = relations(collections, ({ one, many }) => ({
	owner: one(users, {
		fields: [collections.ownerId],
		references: [users.id],
	}),
	posts: many(posts),
	notes: many(notes),
}));

type Collection = typeof collections.$inferSelect;
export type { Collection };
