import { createCookieSessionStorage } from "react-router";

const USER_SESSION_KEY = "adminId";
const SESSION_SECRET = process.env.SESSION_SECRET || "fallback_super_secret_key_change_me_in_production";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__havilah_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
    // Set maxAge to 30 days
    maxAge: 60 * 60 * 24 * 30,
  },
});

export async function getSession(request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function requireAdminId(request, redirectTo = "/admin/login") {
  const session = await getSession(request);
  const adminId = session.get(USER_SESSION_KEY);
  
  if (!adminId) {
    throw new Response("Unauthorized", {
      status: 302,
      headers: {
        Location: redirectTo,
      },
    });
  }
  return adminId;
}

export async function getAdminId(request) {
  const session = await getSession(request);
  return session.get(USER_SESSION_KEY);
}

export async function createUserSession({ request, adminId, remember, redirectTo }) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, adminId);
  
  return new Response("Session Created", {
    status: 302,
    headers: {
      Location: redirectTo,
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 30 // 30 days
          : undefined, // Session ends when browser closes
      }),
    },
  });
}

export async function logout(request) {
  const session = await getSession(request);
  return new Response("Logged out", {
    status: 302,
    headers: {
      Location: "/admin/login",
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
