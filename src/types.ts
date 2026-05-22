export type Page = "auth" | "dashboard" | "roadmap" | "profile" | "admin";
export type UserRole = "guest" | "user" | "admin";

export interface AppUser {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  username?: string;
  bio?: string;
  location?: string;
  github?: string;
  xp?: number;
  level?: number;
}
