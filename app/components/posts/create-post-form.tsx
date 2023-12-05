import { Form } from "@remix-run/react";
import { CleanInput, CleanTextArea, FormInput } from "../ui/forms";
import { Button } from "../ui/button";

export function CreatePostForm() {
  return (
    <Form method="post" className="flex flex-col gap-y-2 rounded-md border bg-mauve2 p-3">
      <FormInput name="title" placeholder="Give it a title?" />
      <CleanTextArea name="body" placeholder="What do you want to share?" />
      <Button type="submit" className="w-fit">
        Send
      </Button>
    </Form>
  );
}
