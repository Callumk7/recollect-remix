import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FormInput } from "@/components/ui/forms";
import { auth } from "@/services/auth/helper";
import { uuidv4 } from "@/util/generate-uuid";
import { CalendarDate } from "@internationalized/date";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { posts } from "db/schema/posts-notes";

// Create new Post
export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await auth(request);

  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const body = formData.get("body")?.toString();

  const currentTimestamp = new Date();
  const currentDate = new CalendarDate(
    currentTimestamp.getFullYear(),
    currentTimestamp.getMonth(),
    currentTimestamp.getDate(),
  );

  const newPost = await db
    .insert(posts)
    .values({
      id: `post_${uuidv4()}`,
      title: title!,
      body: body!,
      authorId: session.id,
      day: currentDate.day,
      month: currentDate.month,
      year: currentDate.year,
      entryDate: currentDate.toString(),
    })
    .returning();

  return json({ newPost });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const allPosts = await db.select().from(posts);

  return json({ allPosts });
};

export default function AppIndex() {
  const { allPosts } = useLoaderData<typeof loader>();
  return (
    <Container className="flex flex-col gap-y-6">
      <div>
        {allPosts.map((post) => (
          <div key={post.id}>
            <p>{post.title}</p>
            <p>{post.body}</p>
          </div>
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
