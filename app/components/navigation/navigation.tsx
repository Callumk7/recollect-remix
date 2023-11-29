import { Button, Link } from "@/components/ui/button";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useLocation } from "@remix-run/react";
import { Dispatch, SetStateAction } from "react";
import { UserControls } from "./user-controls";
import { Profile } from "db/schema/users-profiles";

const links = [
  {
    name: "Home",
    to: "/",
  },
  {
    name: "Journal",
    to: "/journal",
  },
  {
    name: "Feed",
    to: "/feed",
  },
  {
    name: "Friends",
    to: "/friends",
  },
  {
    name: "Collections",
    to: "/collections",
  },
  {
    name: "Dev Feed",
    to: "/all",
  },
];

interface NavigationProps {
  userProfile: Profile;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export function Navigation({
  userProfile,
  isSidebarOpen,
  setIsSidebarOpen,
}: NavigationProps) {
  return (
    <nav className="my-5 flex w-full justify-between px-8">
      <div className="flex gap-x-6">
        {!isSidebarOpen && (
          <Button onPress={() => setIsSidebarOpen(!isSidebarOpen)}>
            <ChevronRightIcon />
          </Button>
        )}
        {links.map((link) => (
          <NavLink key={link.name} link={link} />
        ))}
      </div>
      <UserControls userProfile={userProfile} />
    </nav>
  );
}

function NavLink({ link }: { link: { name: string; to: string } }) {
  const location = useLocation();
  return (
    <Link
      variant={"link"}
      to={link.to}
      className={
        location.pathname === link.to
          ? "underline decoration-ruby9 decoration-2"
          : ""
      }
    >
      {link.name}
    </Link>
  );
}
