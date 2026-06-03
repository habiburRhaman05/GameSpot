import { createAuthClient } from "better-auth/react";
import { env } from "@/config/env";

export const authClient = createAuthClient({
  baseURL: `http://localhost:5000/api/auth`,
});
