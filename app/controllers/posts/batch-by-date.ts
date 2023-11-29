import { PostBatchByDate } from "@/types/posts";
import { Post } from "db/schema/posts-notes";

export function reduceToPostBatchArray<P extends Post>(posts: P[]): PostBatchByDate<P>[] {
	const postBatchArray = posts.reduce((acc: PostBatchByDate<P>[], post) => {
		const date = post.entryDate;

		let postBatch = acc.find(
			(batch) =>
				batch.date.toISOString().split("T")[0] ===
				date.toISOString().split("T")[0],
		);

		if (!postBatch) {
			postBatch = {
				date: new Date(date),
				posts: [],
			};
			acc.push(postBatch);
		}

		postBatch.posts.push(post);

		return acc;
	}, []);

	postBatchArray.sort((a, b) => a.date.getDate() - b.date.getDate());
	return postBatchArray;
}
