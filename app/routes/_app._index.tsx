import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FormInput } from "@/components/ui/forms";
import { auth } from "@/services/auth/helper";
import { PostWithAuthor } from "@/types/posts";
import { uuidv4 } from "@/util/generate-uuid";
import { CalendarDate } from "@internationalized/date";
import {
  BookmarkIcon,
  ChatBubbleIcon,
  DiscIcon,
  HeartIcon,
  Share1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { db } from "db";
import { Collection, collections } from "db/schema/collections";
import { posts } from "db/schema/posts-notes";
import { Profile } from "db/schema/users-profiles";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";

const newPostSchema = z.object({
  title: z.string().optional(),
  body: z.string().min(1),
});

// Create new Post
export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await auth(request);

  if (request.method === "PATCH") {
    const formData = await request.formData();
    const collectionId = formData.get("collection")?.toString();
    const postId = formData.get("postId")?.toString();
    // update the post's collectionId, and parentType
    const updatedPost = await db
      .update(posts)
      .set({
        collectionId: collectionId!,
      })
      .where(eq(posts.id, postId!))
      .returning();

    return json({ success: true, updatedPost });
  }

  const result = await zx.parseFormSafe(request, newPostSchema);

  if (result.success) {
    const currentTimestamp = new Date();
    const currentDate = new CalendarDate(
      currentTimestamp.getFullYear(),
      currentTimestamp.getMonth() + 1,
      currentTimestamp.getDate(),
    );

    const newPost = await db
      .insert(posts)
      .values({
        id: `post_${uuidv4()}`,
        title: result.data.title,
        body: result.data.body,
        authorId: session.id,
        day: currentDate.day,
        month: currentDate.month,
        year: currentDate.year,
        entryDate: currentDate.toDate("gmt"),
      })
      .returning();

    return json({ success: result.success, newPost: newPost });
  }

  console.log(result.error);
  return json({ success: result.success, error: result.error });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const allPosts = await db.query.posts.findMany({
    with: {
      author: {
        with: {
          profile: true,
        },
      },
    },
  });

  const allCollections = await db.select().from(collections);

  return typedjson({ allPosts, allCollections, userId: session.id });
};

export default function AppIndex() {
  const { allPosts, allCollections, userId } = useTypedLoaderData<typeof loader>();
  return (
    <Container className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-2">
        {allPosts.map((post) => (
          <PostPreviewCard
            key={post.id}
            post={post}
            collections={allCollections}
            userId={userId}
          />
        ))}
      </div>
      <Form method="POST" className="my-8">
        <FormInput name="title" label="title" />
        <FormInput name="body" label="body" />
        <Button type="submit">Send</Button>
      </Form>
    </Container>
  );
}

interface PostPreviewCardProps {
  post: PostWithAuthor;
  collections: Collection[];
  userId: string;
}

function PostPreviewCard({ post, collections, userId }: PostPreviewCardProps) {
  const isOrphan = post.collectionId === null;
  const isAuthor = post.authorId === userId;
  return (
    <div className={`${isOrphan ? "bg-ruby1" : ""} rounded-md border border-mauve6`}>
      <div className="flex flex-col gap-y-1 p-3">
        <p className="text-sm text-mauve8">{post.entryDate.toDateString()}</p>
        <AuthorRow author={post.author.profile} userId={userId} />
        <p className="font-lg font-bold">{post.title}</p>
        <p>{post.body}</p>
      </div>
      <div className="border-t px-2 py-1">
        {isAuthor ? (
          <PostOwnerControls post={post} />
        ) : (
          <PostViewerControls post={post} />
        )}
      </div>
    </div>
  );
}

interface PostOwnerControlsProps {
  post: PostWithAuthor;
}

function PostOwnerControls({ post }: PostOwnerControlsProps) {
  return (
    <div className="flex gap-x-2">
      <Button variant={"ghost"} size={"largeIcon"}>
        <TrashIcon />
      </Button>
      <Button variant={"ghost"} size={"largeIcon"}>
        <ChatBubbleIcon />
      </Button>
      <Button variant={"ghost"} size={"largeIcon"}>
        <HeartIcon />
      </Button>
      <Button variant={"ghost"} size={"largeIcon"}>
        <BookmarkIcon />
      </Button>
      <Button variant={"ghost"} size={"largeIcon"}>
        <Share1Icon />
      </Button>
    </div>
  );
}

interface PostViewerControlsProps {
  post: PostWithAuthor;
}

function PostViewerControls({ post }: PostViewerControlsProps) {
  return (
    <div className="flex w-20 justify-between">
      <Button size={"icon"}>
        <DiscIcon />
      </Button>
    </div>
  );
}

interface UniversalPostControlsProps {
  post: PostWithAuthor;
  collections: Collection[];
}

function UniversalPostControls({ post, collections }: UniversalPostControlsProps) {
  return (
    <div>
      <Form method="PATCH">
        <select name="collection">
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.title}
            </option>
          ))}
        </select>
        <input type="hidden" name="postId" value={post.id} />
        <Button type="submit">Add to Collection</Button>
      </Form>
    </div>
  );
}

interface AuthorRowProps {
  author: Profile;
  userId: string;
}

function AuthorRow({ author, userId }: AuthorRowProps) {
  const isUser = userId === author.id;
  const fullName = `${author.firstName} ${author.lastName}`;
  return (
    <div className="flex items-center gap-x-3 py-3">
      <Avatar>
        <AvatarImage src={author.profilePictureUrl!} />
        <AvatarFallback>BT</AvatarFallback>
      </Avatar>
      <div className="flex gap-x-3 items-center">
        <Link to={`/wall/${author.id}`} className="font-bold text-ruby9 hover:underline">
          {fullName}
        </Link>
        <Link to={`/wall/${author.id}`} className="text-mauve10 text-sm">
          {`@${author.userName}`}
        </Link>
        {!isUser ? null : <Button size={"sm"}>Add as friend</Button>}
      </div>
    </div>
  );
}
