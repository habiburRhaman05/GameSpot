"use client";

import { SignUpForm } from "./signup-form";
import { AuthSplitLayout } from "../shared/auth-split-layout";

export function SignUpPage() {
  return (
    <AuthSplitLayout>
      <SignUpForm />
    </AuthSplitLayout>
  );
}

export default SignUpPage;
