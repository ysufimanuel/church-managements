export type Role = 'user' | 'admin' | 'superadmin';

/** Hierarki RBAC (sama dengan base-code):
 *  user       -> view only
 *  admin      -> view + add + update, finance create (pending), TANPA delete
 *  superadmin -> full akses + approval finance + user management
 */
export function canView(_role?: Role) { return true; }
export function canAdd(role?: Role) { return role === 'admin' || role === 'superadmin'; }
export function canEdit(role?: Role) { return role === 'admin' || role === 'superadmin'; }
export function canDelete(role?: Role) { return role === 'superadmin'; }
export function canApprove(role?: Role) { return role === 'superadmin'; }
export function canManageUsers(role?: Role) { return role === 'superadmin'; }
export function canUseWebManager(role?: Role) { return role === 'admin' || role === 'superadmin'; }
export function isViewOnly(role?: Role) { return role === 'user'; }

export function roleLabel(role?: Role) {
  return role === 'superadmin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'User (View Only)';
}
