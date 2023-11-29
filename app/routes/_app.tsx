import { Navigation } from "@/components/navigation/navigation";
import { auth } from "@/services/auth/helper";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { getUserWithProfileAndFriends } from "@/controllers/users/get-users";
import { db } from "db";
import { eq } from "drizzle-orm";
import { Post, posts } from "db/schema/posts-notes";
import { reduceToPostBatchArray } from "@/controllers/posts/batch-by-date";
import { PostBatchByDate } from "@/types/posts";
import { Separator } from "react-aria-components";

export const meta: MetaFunction = () => {
  return [
    { title: "ReCollect" },
    { name: "description", content: "Curate with purpose" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const userWithFriends = await getUserWithProfileAndFriends(session.id);

  // I want to get all of a user's posts (notes to follow), and sort them by date.
  const allPostsFromUser = await db.query.posts.findMany({
    where: eq(posts.authorId, session.id),
  });

  const postsOrganisedByDate = reduceToPostBatchArray(allPostsFromUser);

  return typedjson({ userWithFriends, postsOrganisedByDate });
};

export default function AppLayout() {
  const { userWithFriends, postsOrganisedByDate } = useTypedLoaderData<typeof loader>();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  return (
    <div className="flex">
      <Sidebar postsOrganisedByDate={postsOrganisedByDate} />
      <div className="h-screen w-64" />
      <Container>
        <div>
          <Navigation
            userProfile={userWithFriends.profile}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Outlet />
        </div>
      </Container>
    </div>
  );
}

interface SidebarProps {
  postsOrganisedByDate: PostBatchByDate<Post>[];
}
function Sidebar({ postsOrganisedByDate }: SidebarProps) {
  return (
    <div className="fixed h-screen w-64 bg-mauve12 px-2 py-5">
      <div>
        {postsOrganisedByDate.map((batch) => (
          <div key={batch.date.getDate()} className="text-mauve1 flex flex-col gap-y-1">
            <div className="flex justify-between font-bold">
              {batch.date.toDateString()}
              <div className="text-ruby7">{batch.posts.length}</div>
            </div>
            {batch.posts.map(post => (
              <SideBarPostPreview key={post.id} post={post} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface SideBarPostPreviewProps {
  post: Post;
}
function SideBarPostPreview({post}: SideBarPostPreviewProps) {
  return (
    <div>
      <h1 className="font-bold text-inherit">{post.title}</h1>
      <p className="text-mauve4 text-sm font-light">{post.body.slice(0, 100)}</p>
      <Separator />
    </div>
  )
}
