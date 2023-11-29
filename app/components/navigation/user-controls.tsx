import { Button, Link, NavLink } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "db/schema/users-profiles";

interface UserControlsProps {
  userProfile: Profile;
}
export function UserControls({ userProfile }: UserControlsProps) {
  if (!userProfile) {
    return (
      <form>
        <Link to={"/sign-in"}>Sign In</Link>
      </form>
    );
  } else {
    return (
      <div className="flex items-center gap-x-4">
        <Avatar>
          <AvatarImage src={userProfile.profilePictureUrl!} />
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
        <NavLink variant={"link"} to={`/profile`}>
          {userProfile.userName}
        </NavLink>
        <form action="/sign-out" method="POST">
          <Button variant={"secondary"} type="submit">
            Sign Out
          </Button>
        </form>
      </div>
    );
  }
}
