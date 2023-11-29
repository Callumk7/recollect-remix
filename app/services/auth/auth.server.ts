import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "./session.server";
import invariant from "tiny-invariant";
import { eq } from "drizzle-orm";
import { db } from "db";
import { users } from "db/schema/users-profiles";

export interface UserData {
	id: string;
	email: string;
}

export const authenticator = new Authenticator<UserData>(sessionStorage);

authenticator.use(
	new FormStrategy(async ({ form }) => {
		const email = form.get("email");
		const password = form.get("password");

		invariant(typeof email === "string", "email must be a string");
		invariant(email.length > 0, "email must not be empty");

		invariant(typeof password === "string", "password must be a string");
		invariant(password.length > 0, "password must not be empty");

		const user = await login(email, password);
		return user;
	}),
	"user-pass",
);

const login = async (email: string, password: string) => {
	console.log(`${email} and ${password}`);
	const foundUser = await db.query.users.findFirst({
		where: eq(users.email, email),
	});

	console.log("no we are here");
	console.log(`found user ${foundUser?.email}`);

	invariant(foundUser, "No user found");
	console.log(foundUser.email);
	return foundUser;
};
