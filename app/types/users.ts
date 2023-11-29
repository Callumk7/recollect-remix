import { Profile, User } from "db/schema/users-profiles";

interface UserWithProfile extends User {
	profile: Profile;
}
interface UserWithProfileAndFriends extends UserWithProfile {
	friends: UserWithProfile[];
}

export type { UserWithProfile, UserWithProfileAndFriends };
