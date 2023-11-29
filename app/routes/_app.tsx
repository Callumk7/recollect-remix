import { Navigation } from "@/components/navigation/navigation";
import { auth } from "@/services/auth/helper";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { db } from "db";
import { users } from "db/schema/users-profiles";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { useState } from "react";
import { Container } from "@/components/ui/container";

export const meta: MetaFunction = () => {
  return [
    { title: "ReCollect" },
    { name: "description", content: "Curate with purpose" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const userData = await db.query.users.findFirst({
    where: eq(users.id, session.id),
    with: {
      profile: true,
      friends: {
        with: {
          friend: {
            with: {
              profile: true,
            },
          },
        },
      },
    },
  });

  return typedjson({ userData });
};

export default function AppLayout() {
  const { userData } = useTypedLoaderData<typeof loader>();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  return (
    <Container>
      <Navigation
        userProfile={userData!.profile}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Outlet />
    </Container>
  );
}
