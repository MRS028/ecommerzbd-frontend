export function getUserDisplayName(user: any): string {
  if (!user) return '—';
  if (typeof user === 'string') return user;
  if (user.firstName || user.lastName) {
    return [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  }
  if (user.name) return user.name;
  if (user.email) return user.email;
  return '—';
}

export function getUserEmail(user: any): string {
  if (!user) return '—';
  if (typeof user === 'string') return '—';
  return user.email ?? '—';
}

export function getUserRole(user: any): string {
  if (!user) return '—';
  return user.role ?? '—';
}