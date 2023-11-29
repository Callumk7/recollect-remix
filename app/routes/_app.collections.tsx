import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FormInput } from "@/components/ui/forms";
import { auth } from "@/services/auth/helper";
import { CollectionWithPosts } from "@/types/collections";
import { createCalendarDate } from "@/util/create-calendar-date";
import { uuidv4 } from "@/util/generate-uuid";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { Collection, CollectionInsert, collections } from "db/schema/collections";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";

const newCollectionSchema = z.object({
  title: z.string().optional(),
});

// Create a collection.
export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await auth(request);

  const result = await zx.parseFormSafe(request, newCollectionSchema);

  if (result.success) {
    const currentDate = createCalendarDate(new Date());

    const newCollectionInsert: CollectionInsert = {
      id: `col_${uuidv4()}`,
      ownerId: session.id,
      day: currentDate.day,
      month: currentDate.month,
      year: currentDate.year,
      entryDate: currentDate.toDate("gmt"),
    };

    const title = result.data.title;

    if (title) {
      newCollectionInsert.title = title;
    }

    const newCollection = await db
      .insert(collections)
      .values(newCollectionInsert)
      .returning();

    return json({ success: result.success, newCollection: newCollection });
  }

  console.log(result.error);
  return json({ success: result.success, error: result.error });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const allCollections = await db.query.collections.findMany({
    with: {
      posts: true
    }
  })


  return typedjson({ allCollections });
};

export default function CollectionsPage() {
  const { allCollections } = useTypedLoaderData<typeof loader>();
  return (
    <Container className="my-8 flex flex-col gap-y-6">
      <div>
        {allCollections.map((collection) => (
          <CollectionPreview key={collection.id} collection={collection} />
        ))}
      </div>
      <Form method="POST">
        <FormInput name="title" label="title" />
        <Button type="submit">New Collection</Button>
      </Form>
    </Container>
  );
}

interface CollectionPreviewProps {
  collection: CollectionWithPosts
}

function CollectionPreview({ collection }: CollectionPreviewProps) {
  return (
    <div>
      <p>{collection.title}</p>
      <div>
        {collection.posts.map(post => (
          <p key={post.id}>{post.title}</p>
        ))}
      </div>
    </div>
  );
}
