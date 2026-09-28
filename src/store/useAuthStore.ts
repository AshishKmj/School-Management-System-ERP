import { create } from 'zustand';
import { User, Role, PermissionKey } from '../types';
import { INITIAL_USERS, ROLE_PERMISSIONS } from '../services/mockData';
import { addActivityLog, fetchPermissions } from '../services/storage';

interface AuthState {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  permissions: Record<Role, PermissionKey[]>;
  login: (username: string, pass: string, session: string) => Promise<{ success: boolean; error?: string }>;
  switchRole: (role: Role) => void;
  logout: () => void;
  can: (permission: PermissionKey) => boolean;
  loadPermissions: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Check if session stored in localStorage
  const savedUser = localStorage.getItem('dc_current_user');
  const initialUser: User = savedUser ? JSON.parse(savedUser) : INITIAL_USERS[0]; // default to Super Admin for instant preview

  return {
    user: initialUser,
    role: initialUser.role,
    isAuthenticated: true,
    permissions: ROLE_PERMISSIONS,

    loadPermissions: async () => {
      const p = await fetchPermissions();
      set({ permissions: p });
    },

    login: async (username, pass, session) => {
      const uLower = username.toLowerCase().trim();
      
      // Match demo accounts
      let matchedUser: User | undefined;
      if (uLower === 'admin' || uLower === 'principal@ashoka.edu' || uLower === '9876543210') {
        matchedUser = INITIAL_USERS[0]; // Super Admin
      } else if (uLower === 'principal' || uLower === '9876543211') {
        matchedUser = INITIAL_USERS[1]; // Admin
      } else if (uLower === 'accountant' || uLower === '9876543212') {
        matchedUser = INITIAL_USERS[2]; // Accountant
      } else if (uLower === 'teacher' || uLower === '9876543213') {
        matchedUser = INITIAL_USERS[3]; // Teacher
      } else if (uLower === 'receptionist' || uLower === '9876543214') {
        matchedUser = INITIAL_USERS[4]; // Receptionist
      }

      if (!matchedUser) {
        // Fallback for custom entry - grant access as Admin
        matchedUser = {
          id: `usr_${Date.now()}`,
          schoolId: 'sch_dpa_01',
          name: username.includes('@') ? username.split('@')[0] : username,
          email: username.includes('@') ? username : `${username}@dataclick.edu.in`,
          phone: '9876543210',
          role: 'admin',
          designation: 'School Administrator',
          createdAt: new Date().toISOString(),
        };
      }

      localStorage.setItem('dc_current_user', JSON.stringify(matchedUser));
      set({
        user: matchedUser,
        role: matchedUser.role,
        isAuthenticated: true,
      });

      addActivityLog(
        matchedUser.id,
        matchedUser.name,
        matchedUser.role,
        'USER_LOGIN',
        'AUTH',
        `Logged into Academic Session ${session}.`
      );

      return { success: true };
    },

    switchRole: (newRole: Role) => {
      const currentUser = get().user;
      if (!currentUser) return;
      const updatedUser: User = {
        ...currentUser,
        role: newRole,
        designation:
          newRole === 'super_admin'
            ? 'Super Administrator'
            : newRole === 'admin'
            ? 'School Principal'
            : newRole === 'accountant'
            ? 'Senior Fee Bursar'
            : newRole === 'teacher'
            ? 'Senior Faculty'
            : 'Front Desk Counselor',
      };
      localStorage.setItem('dc_current_user', JSON.stringify(updatedUser));
      set({ user: updatedUser, role: newRole });

      addActivityLog(
        updatedUser.id,
        updatedUser.name,
        newRole,
        'ROLE_SWITCHED',
        'AUTH',
        `Active testing role switched to ${newRole}.`
      );
    },

    logout: () => {
      const u = get().user;
      if (u) {
        addActivityLog(u.id, u.name, u.role, 'USER_LOGOUT', 'AUTH', 'User signed out safely.');
      }
      localStorage.removeItem('dc_current_user');
      set({
        user: null,
        isAuthenticated: false,
      });
    },

    can: (permission: PermissionKey) => {
      const { role, permissions } = get();
      if (role === 'super_admin') return true;
      const rolePerms = permissions[role] || [];
      return rolePerms.includes(permission);
    },
  };
});
