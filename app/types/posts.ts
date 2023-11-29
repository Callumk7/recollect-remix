import { Post } from "db/schema/posts-notes";
import { UserWithProfile } from "./users";

interface PostWithAuthor extends Post {
	author: UserWithProfile;
}

interface PostBatchByDate<P> {
	date: Date;
	posts: P[]
}

export type { PostWithAuthor, PostBatchByDate };
