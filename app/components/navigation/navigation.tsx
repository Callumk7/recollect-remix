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
    name: "Dev Feed",
    to: "/all",
  },
];

interface NavigationProps {
  userData: UserWithProfileAndFriends;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export function Navigation({
  userData,
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
        <SlideOver trigger={<Button>Write a Post</Button>}>
          <CreatePostForm action="/posts" />
        </SlideOver>
        {links.map((link) => (
          <NavLink key={link.name} link={link} />
        ))}
      </div>
      <UserControls userData={userData} />
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
        location.pathname === link.to ? "decoration-ruby9 underline decoration-2" : ""
      }
    >
      {link.name}
    </Link>
  );
}

function CreateNewMenu() {
  return (
    <MenuTrigger>
      <Button aria-label="Menu">Create New..</Button>
      <Popover>
        <Menu>
          <MenuItem>Page..</MenuItem>
          <MenuItem>Post..</MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
