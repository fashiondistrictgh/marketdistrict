import type { UserRole } from "../constants/user-roles";

export interface UserProfile {
  id: string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  accessToken: string;
}
