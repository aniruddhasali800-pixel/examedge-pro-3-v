import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      
      <!-- Background Abstract Shapes -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-2000"></div>

      <div class="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md w-full z-10 text-white transition-all duration-300">
        <div class="text-center mb-8">
          <div class="inline-block p-3 rounded-full bg-blue-600 mb-4 shadow-lg shadow-blue-500/50">
            <i class="fa-solid fa-graduation-cap text-3xl"></i>
          </div>
          <h1 class="text-3xl font-bold tracking-tight mb-2">ExamEdge Pro</h1>
          <p class="text-slate-300">Premium Exam Preparation Platform</p>
        </div>

        <div class="space-y-4">
          @if (!showAdminForm()) {
            <!-- Student Options -->
            <button (click)="loginStudent('premium')" class="w-full group relative flex items-center justify-center gap-3 bg-white text-slate-900 py-3 px-4 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <i class="fa-solid fa-crown text-amber-500 group-hover:scale-110 transition-transform"></i>
              Premium Student Login
            </button>
            
            <button (click)="loginStudent('free')" class="w-full group relative flex items-center justify-center gap-3 bg-slate-800 border border-slate-700 text-slate-300 py-3 px-4 rounded-xl font-medium hover:bg-slate-700 hover:text-white transition-all duration-300">
              <i class="fa-regular fa-user"></i>
              Free Student Login
            </button>
            
            <div class="relative flex py-2 items-center">
              <div class="flex-grow border-t border-slate-600"></div>
              <span class="flex-shrink-0 mx-4 text-slate-500 text-sm">Restricted Access</span>
              <div class="flex-grow border-t border-slate-600"></div>
            </div>

            <button (click)="showAdminForm.set(true)" class="w-full group flex items-center justify-center gap-3 bg-slate-900 border border-slate-700 text-slate-400 py-3 px-4 rounded-xl font-medium hover:bg-slate-800 hover:text-white transition-all duration-300">
              <i class="fa-solid fa-shield-halved text-purple-500"></i>
              Admin Portal
            </button>
          } @else {
            <!-- Admin Login Form -->
            <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700 animate-fade-in">
              <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                <i class="fa-solid fa-lock text-purple-500"></i> Admin Access
              </h3>
              
              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1 uppercase">Email</label>
                  <input [(ngModel)]="adminEmail" type="email" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:border-purple-500 outline-none transition-colors" placeholder="admin@examedge.pro">
                </div>
                
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1 uppercase">Password</label>
                  <input [(ngModel)]="adminPassword" type="password" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:border-purple-500 outline-none transition-colors" placeholder="••••••••">
                </div>

                @if (errorMsg()) {
                  <div class="text-red-400 text-xs flex items-center gap-1 animate-pulse">
                    <i class="fa-solid fa-circle-exclamation"></i> {{ errorMsg() }}
                  </div>
                }

                <button (click)="attemptAdminLogin()" class="w-full bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30 mt-2">
                  Verify & Login
                </button>
              </div>

              <button (click)="resetForm()" class="w-full text-slate-500 text-sm mt-4 hover:text-slate-300 transition-colors">
                <i class="fa-solid fa-arrow-left mr-1"></i> Back to Student Login
              </button>
            </div>
            
             <div class="text-center text-[10px] text-slate-500 mt-2">
               * Restricted to authorized personnel only.
             </div>
          }
        </div>
        
        <p class="text-center text-xs text-slate-500 mt-8">
          &copy; 2024 ExamEdge Pro. All rights reserved.<br>
          Secure 256-bit encrypted connection.
        </p>
      </div>
    </div>
  `,
  styles: [`
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LoginComponent {
  authService = inject(AuthService);
  
  showAdminForm = signal(false);
  adminEmail = signal('');
  adminPassword = signal('');
  errorMsg = signal('');

  loginStudent(plan: 'free' | 'premium') {
    this.authService.loginStudent(plan);
  }

  attemptAdminLogin() {
    this.errorMsg.set('');
    
    if (!this.adminEmail() || !this.adminPassword()) {
      this.errorMsg.set('Please enter both email and password.');
      return;
    }

    const success = this.authService.loginAdmin(this.adminEmail(), this.adminPassword());
    
    if (!success) {
      this.errorMsg.set('Invalid credentials. Access denied.');
      // Shake effect could be added here
    }
  }

  resetForm() {
    this.showAdminForm.set(false);
    this.adminEmail.set('');
    this.adminPassword.set('');
    this.errorMsg.set('');
  }
}