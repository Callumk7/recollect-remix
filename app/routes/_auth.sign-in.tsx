import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FormInput } from "@/components/ui/forms";
import { authenticator } from "@/services/auth/auth.server";
import { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/sign-in",
  });
};

export default function SignInPage() {
  return (
    <Container className="mt-10">
      <form className="w-4/5 mx-auto flex flex-col gap-y-2" method="POST">
        <FormInput name="email" type="text" label="Email" />
        <FormInput name="password" type="password" label="Password"/>
        <Button type="submit">Sign In</Button>
      </form>
    </Container>
  );
}
