import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { notes } from "./posts-notes";
import { users } from "./users-profiles";

export const groups = pgTable("groups", {
	id: text("id").primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	name: text("name").notNull(),
	description: text("description"),
});
export const groupsRelations = relations(groups, ({ many }) => ({
	members: many(usersToGroups),
	notes: many(notes),
}));

export const usersToGroups = pgTable(
	"users_to_groups",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		groupId: text("group_id")
			.notNull()
			.references(() => groups.id),
	},
	(t) => ({
		pk: primaryKey(t.userId, t.groupId),
	}),
);
