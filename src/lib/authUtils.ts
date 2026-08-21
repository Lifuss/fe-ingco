/**
 * Safely parse persisted auth token from localStorage (Client-only)
 */
export function getPersistedToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const savedUserString = localStorage.getItem('persist:auth');
    if (!savedUserString) return null;
    const savedUser = JSON.parse(savedUserString);
    if (!savedUser?.token) return null;
    try {
      return JSON.parse(savedUser.token);
    } catch {
      return savedUser.token; // Fallback if token is already a plain string
    }
  } catch (e) {
    console.error('Error parsing auth from localStorage:', e);
    return null;
  }
}
