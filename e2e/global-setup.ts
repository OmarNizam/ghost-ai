import { clerkSetup } from "@clerk/testing/playwright";

// Signed-in tests need a Clerk testing token. Fetch one only when a test user is configured,
// so the signed-out tests run without calling the Clerk Backend API.
export default async function globalSetup() {
  if (process.env.E2E_CLERK_USER_EMAIL) {
    await clerkSetup();
  }
}
