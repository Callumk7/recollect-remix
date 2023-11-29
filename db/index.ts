import { singleton } from "@/util/singleton.server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as usersSchema from "./schema/users-profiles";
import * as postsSchema from "./schema/posts-notes";
import * as groupsSchema from "./schema/groups";
import * as collectionsSchema from "./schema/collections";

const pg = postgres(process.env.DATABASE_URL!);

export const db = singleton("drizzle", () =>
	drizzle(pg, {
		schema: { ...usersSchema, ...postsSchema, ...groupsSchema, ...collectionsSchema },
	}),
);
