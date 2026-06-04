export interface User {
  userId: string;
  displayName?: string;
  email?: string;
  createdAt?: string; // ISO string
  preferredName?: string;
  isEmailVerified?: boolean;
}
