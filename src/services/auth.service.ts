import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';

export type UserRole = 'admin' | 'student' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan?: 'free' | 'premium';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  private dataService = inject(DataService);
  private USER_KEY = 'examedge_user_session';

  // Hardcoded allowed admins
  private ALLOWED_ADMINS = [
    // First Admin (Me)
    { email: 'admin@examedge.pro', password: 'admin_password', name: 'System Owner' },
    // Second Admin (Friend)
    { email: 'Aniruddhasali@800.pro', password: 'Aniruddha', name: 'Partner Admin' }
      // Add more admins as needed
    
  ];

  constructor(private router: Router) {
    // Restore session
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem(this.USER_KEY);
      if (savedUser) {
        this.currentUser.set(JSON.parse(savedUser));
      }
    }
  }

  // Generic student login
  loginStudent(plan: 'free' | 'premium' = 'premium') {
    const user: User = {
      id: plan === 'free' ? 'student-free-01' : 'student-01',
      name: plan === 'free' ? 'Guest Student' : 'Alex Student',
      email: plan === 'free' ? 'guest@student.com' : 'alex@university.edu',
      role: 'student',
      plan: plan
    };
    this.dataService.logActivity(user.email, 'Sign In');
    this.currentUser.set(user);
    this.persistUser(user);
    this.router.navigate(['/student']);
  }

  // Specific admin login
  loginAdmin(email: string, password: string): boolean {
    const admin = this.ALLOWED_ADMINS.find(a => a.email.toLowerCase() === email.toLowerCase().trim() && a.password === password.trim());
    
    if (admin) {
      const user: User = {
        id: 'admin-' + admin.email,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      };
      this.dataService.logActivity(user.email, 'Sign In');
      this.currentUser.set(user);
      this.persistUser(user);
      this.router.navigate(['/admin']);
      return true;
    }
    return false;
  }

  upgradeToPremium() {
    this.currentUser.update(user => {
      if (!user) return null;
      const updated = { ...user, plan: 'premium' as const, name: user.name.includes('Guest') ? 'Alex Student (Pro)' : user.name + ' (Pro)' };
      this.persistUser(updated);
      return updated;
    });
  }

  logout() {
    const user = this.currentUser();
    if (user) {
      this.dataService.logActivity(user.email, 'Sign Out');
    }
    this.currentUser.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USER_KEY);
    }
    this.router.navigate(['/login']);
  }

  private persistUser(user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }
}