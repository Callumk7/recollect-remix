import { Post } from "db/schema/posts-notes";
import { UserWithProfile } from "./users";

interface PostWithAuthor extends Post {
	author: UserWithProfile;
}

export type { PostWithAuthor };
