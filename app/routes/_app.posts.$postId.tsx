import { auth } from "@/services/auth/helper";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { db } from "db";
import { Post, posts } from "db/schema/posts-notes";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const postId = params.postId;

  const getFullPost = await db.query.posts.findFirst({
    where: eq(posts.id, postId!),
  });

  return typedjson({ getFullPost });
};

export default function PostPage() {
  const { getFullPost } = useTypedLoaderData<typeof loader>();
  return <PostView post={getFullPost!} />;
}

interface PostViewProps {
  post: Post;
}
function PostView({ post }: PostViewProps) {
  return (
    <div>
      {post.title && <h1 className="text-4xl font-black text-ruby9">{post.title}</h1>}
      <div className="prose">{post.body}</div>
    </div>
  );
}
