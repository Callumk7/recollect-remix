import { db } from "db";
import { users } from "db/schema/users-profiles";
import { eq } from "drizzle-orm";

export const getUserWithProfileAndFriends = async (userId: string) => {
  try {
    const userData = await db.query.users.findFirst({
      where: eq(users.id, userId),
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

    if (!userData) {
      throw new Error("No user found");
    }

    return userData;

  } catch (err) {
    console.log("No user found");
    throw new Error("There is no user in the database that matches the session id")
  }
};

