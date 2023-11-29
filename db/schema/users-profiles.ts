import { relations, sql } from "drizzle-orm";
import { date, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { notes, posts, postsSavedByUsers } from "./posts-notes";
import { usersToGroups } from "./groups";

export const users = pgTable("users", {
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	id: text("id").primaryKey(),
	email: text("email").notNull(),
	password: text("password").notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
	profile: one(profiles, {
		fields: [users.id],
		references: [profiles.userId],
	}),
	notes: many(notes, {
		relationName: "author",
	}),
	wallPosts: many(notes, {
		relationName: "recipient",
	}),
	posts: many(posts),
	savedPosts: many(postsSavedByUsers),
	friends: many(userFriends, {
		relationName: "friends",
	}),
	friendsOf: many(userFriends, {
		relationName: "friends_of",
	}),
	groups: many(usersToGroups),
}));

export const userFriends = pgTable(
	"user_friends",
	{
		userId: text("user_id").notNull(),
		friendId: text("friend_id").notNull(),
	},
	(t) => ({
		pk: primaryKey(t.userId, t.friendId),
	}),
);

export const userFriendsRelations = relations(userFriends, ({ one }) => ({
	user: one(users, {
		fields: [userFriends.userId],
		references: [users.id],
		relationName: "friends",
	}),
	friend: one(users, {
		fields: [userFriends.friendId],
		references: [users.id],
		relationName: "friends_of",
	}),
}));

export const profiles = pgTable("profiles", {
	id: text("id").primaryKey(),
	userId: text("user_id"),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	userName: text("user_name").notNull(),
	profilePictureUrl: text("profile_picture_url"),
	bio: text("bio"),
	dateOfBirth: date("date_of_birth").notNull().default("1970-01-01"),
});

export const profilesRelations = relations(profiles, ({ one }) => ({
	user: one(users, {
		fields: [profiles.userId],
		references: [users.id],
	}),
}));

// Type Exports
type User = typeof users.$inferSelect;
type Profile = typeof profiles.$inferSelect;

export type { User, Profile };
