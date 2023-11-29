import { uuidv4 } from "@/util/generate-uuid";
import { DB } from "db";
import { PostInsert, posts } from "db/schema/posts-notes";

/**
 * Unsorted posts are created without a collection.
 * The entry date can be adjusted for organisationsal purposes.
 * */
const createUnsortedPost = async (db: DB, authorId: string, postData: PostInsert) => {
	const newPost = await db
		.insert(posts)
		.values({
			id: `post_${uuidv4()}`,
			title: postData.title,
			body: postData.body,
			authorId: authorId,
			day: postData.day,
			month: postData.month,
			year: postData.year,
			entryDate: postData.entryDate,
		})
		.returning();

	return newPost;
};

export { createUnsortedPost };
