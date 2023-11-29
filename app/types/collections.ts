import { Collection } from "db/schema/collections";
import { Post } from "db/schema/posts-notes";

interface CollectionWithPosts extends Collection {
	posts: Post[];
}

export type { CollectionWithPosts };
