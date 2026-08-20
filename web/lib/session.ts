import { cookies } from 'next/headers';
import { getIronSession, type IronSession } from 'iron-session';

export type Role = 'admin' | 'editor';

export interface SessionUser {
  id: number;
  username: string;
  role: Role;
}

export interface SessionData {
  user?: SessionUser;
}

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET must be set to a random string of at least 32 characters.'
    );
  }
  return secret;
}

export function sessionOptions() {
  return {
    password: sessionSecret(),
    cookieName: 'kweku_li_session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 4, // 4 hours, matches previous cookie-session maxAge
    },
  };
}

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions());
}

export async function requireUser(): Promise<SessionUser> {
  const session = await getSession();
  if (!session.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
}

export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  return user;
}
