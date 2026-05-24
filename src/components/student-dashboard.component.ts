import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { DataService, ContentItem } from '../services/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <!-- Navbar -->
      <nav class="bg-white border-b border-slate-200 sticky top-0 z-40 flex-shrink-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <i class="fa-solid fa-graduation-cap"></i>
              </div>
              <span class="font-bold text-xl text-slate-900 tracking-tight">ExamEdge</span>
            </div>
            
            <div class="flex items-center gap-4">
              @if (authService.currentUser()?.plan === 'premium') {
                <div class="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-xs font-bold">
                  <i class="fa-solid fa-crown"></i> Premium Plan
                </div>
              } @else {
                 <button (click)="openPayment()" class="hidden md:flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white rounded-full text-xs font-bold shadow-md transition-all transform hover:scale-105">
                  <i class="fa-solid fa-bolt"></i> Upgrade to Pro
                </button>
              }
              <div class="flex items-center gap-3 pl-4 md:border-l border-slate-200">
                <span class="hidden md:block text-sm font-medium text-slate-700">{{ authService.currentUser()?.name }}</span>
                <button (click)="authService.logout()" class="text-slate-400 hover:text-red-500 transition-colors">
                  <i class="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content Scroll Area -->
      <main class="flex-grow overflow-y-auto pb-24 md:pb-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          
          <!-- Mobile Tabs -->
          <div class="md:hidden flex mb-6 bg-white rounded-xl shadow-sm border border-slate-100 p-1">
            <button (click)="mobileTab.set('study')" [class]="mobileTab() === 'study' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'" class="flex-1 py-2 rounded-lg text-sm font-medium transition-all">
              Study
            </button>
            <button (click)="mobileTab.set('scores')" [class]="mobileTab() === 'scores' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'" class="flex-1 py-2 rounded-lg text-sm font-medium transition-all">
              Scores
            </button>
            <button (click)="mobileTab.set('ask')" [class]="mobileTab() === 'ask' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'" class="flex-1 py-2 rounded-lg text-sm font-medium transition-all">
              Ask
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Left: Content Feed -->
            <div class="lg:col-span-2 space-y-6" [class.hidden]="mobileTab() !== 'study' && mobileTab() !== 'desktop'">
              
              <!-- Filters -->
              <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button (click)="filter.set('all')" [class]="filter() === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'" class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0">
                  All Materials
                </button>
                <button (click)="filter.set('note')" [class]="filter() === 'note' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'" class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0">
                  <i class="fa-solid fa-book mr-1"></i> Notes
                </button>
                <button (click)="filter.set('paper')" [class]="filter() === 'paper' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'" class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0">
                  <i class="fa-solid fa-file-pen mr-1"></i> Papers
                </button>
                <button (click)="filter.set('topic')" [class]="filter() === 'topic' ? 'bg-orange-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'" class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0">
                  <i class="fa-solid fa-star mr-1"></i> Important
                </button>
              </div>

              <!-- Items List -->
              <div class="space-y-4">
                @for (item of filteredContent(); track item.id) {
                  <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                    @if (item.isLocked && authService.currentUser()?.plan !== 'premium') {
                      <div class="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-4">
                        <i class="fa-solid fa-lock text-3xl text-slate-400 mb-2"></i>
                        <h3 class="font-bold text-slate-700">Premium Content</h3>
                        <p class="text-sm text-slate-500 mb-3">Upgrade to view and download this material.</p>
                        <button (click)="openPayment()" class="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30">Unlock Now</button>
                      </div>
                    }

                    <div class="flex justify-between items-start mb-2">
                      <div class="flex items-center gap-2">
                        <span [class]="getBadgeClass(item.type)">{{ item.type }}</span>
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ item.subject }}</span>
                      </div>
                      <span class="text-xs text-slate-400">{{ item.date }}</span>
                    </div>
                    
                    <h3 class="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{{ item.title }}</h3>
                    <p class="text-slate-600 text-sm mb-4 leading-relaxed protected-content line-clamp-2">{{ item.preview }}</p>
                    
                    <div class="flex items-center gap-4 pt-4 border-t border-slate-50 flex-wrap">
                      <button class="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        <i class="fa-regular fa-eye"></i> View
                      </button>
                      <button (click)="downloadFile(item)" class="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        <i class="fa-solid fa-download"></i> Download PDF
                      </button>
                      <div class="ml-auto">
                        <i class="fa-solid fa-shield-cat text-slate-200" title="Protected Content"></i>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Scores View (Mobile Tab & Desktop Sidebar) -->
            <div class="lg:col-span-1 space-y-6" [class.hidden]="mobileTab() !== 'scores' && mobileTab() !== 'desktop'">
               <!-- Scores List -->
               <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div class="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 class="font-bold text-slate-800 flex items-center gap-2">
                      <i class="fa-solid fa-trophy text-amber-500"></i> My Performance
                    </h3>
                  </div>
                  
                  <div class="max-h-[500px] overflow-y-auto p-2 space-y-2">
                    @for (result of dataService.results(); track result.id) {
                      <div class="bg-white p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between">
                         <div class="flex-1 min-w-0 mr-4">
                            <p class="text-sm font-bold text-slate-700 truncate">{{ result.examTitle }}</p>
                            <p class="text-xs text-slate-500">{{ result.subject }} • {{ result.date }}</p>
                         </div>
                         <div class="text-right">
                            <div class="text-lg font-bold" [class]="getScoreColor(result.score, result.total)">
                              {{ result.score }}/{{ result.total }}
                            </div>
                            <div class="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Score</div>
                         </div>
                      </div>
                    }
                  </div>
               </div>
            </div>

            <!-- Right: Helper & Queries (Ask Tab) -->
            <aside class="space-y-6 lg:block" [class.hidden]="mobileTab() !== 'ask' && mobileTab() !== 'desktop'">
               <!-- Promo Widget for Free Users -->
               @if (authService.currentUser()?.plan !== 'premium') {
                 <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 shadow-xl text-white relative overflow-hidden">
                   <div class="absolute -right-6 -top-6 w-24 h-24 bg-amber-500 rounded-full blur-2xl opacity-20"></div>
                   <h3 class="font-bold text-lg mb-2 flex items-center gap-2"><i class="fa-solid fa-crown text-amber-500"></i> Go Premium</h3>
                   <p class="text-slate-300 text-sm mb-4">Get unlimited access to solved papers, expert notes, and priority support.</p>
                   <button (click)="openPayment()" class="w-full bg-amber-500 text-slate-900 font-bold py-2 rounded-lg hover:bg-amber-400 transition-colors text-sm">
                     Upgrade Now - $9.99/mo
                   </button>
                 </div>
               }

              <!-- Ask Question Widget -->
              <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 sticky top-24">
                <h3 class="font-bold text-slate-800 mb-1">Ask an Expert</h3>
                <p class="text-xs text-slate-500 mb-4">Get answers directly from our top tutors.</p>
                
                <div class="space-y-3">
                  <textarea [(ngModel)]="questionText" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none resize-none h-32" placeholder="What's your doubt?"></textarea>
                  <button (click)="submitQuery()" [disabled]="!questionText" class="w-full bg-slate-900 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 text-sm">
                    Submit Query
                  </button>
                </div>

                <div class="mt-6 pt-6 border-t border-slate-100">
                   <h4 class="font-bold text-xs uppercase text-slate-400 mb-4">Your Recent Queries</h4>
                   <div class="space-y-4">
                     @for (q of myQueries(); track q.id) {
                       <div class="text-sm">
                         <p class="font-medium text-slate-700 mb-1">"{{ q.question }}"</p>
                         @if (q.answer) {
                           <div class="bg-green-50 text-green-800 p-2 rounded text-xs border border-green-100">
                             <i class="fa-solid fa-check-circle mr-1"></i> {{ q.answer }}
                           </div>
                         } @else {
                           <span class="text-xs text-orange-500 flex items-center gap-1">
                             <i class="fa-regular fa-clock"></i> Awaiting reply...
                           </span>
                         }
                       </div>
                     }
                   </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>

      <!-- Bottom Sheet Quick Notes (Up/Down Section) -->
      <div class="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center">
        <div class="w-full max-w-lg pointer-events-auto transition-transform duration-500 ease-in-out"
             [class.translate-y-full]="!isNoteOpen()" [class.translate-y-0]="isNoteOpen()">
           
           <!-- Toggle Tab -->
           <div class="flex justify-center -mt-10 mb-2">
             <button (click)="toggleNotes()" class="bg-slate-900 text-white shadow-lg rounded-full px-6 py-2 font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform">
               <i class="fa-solid fa-pencil"></i> Quick Notes
               <i class="fa-solid fa-chevron-up transition-transform duration-300" [class.rotate-180]="isNoteOpen()"></i>
             </button>
           </div>
           
           <div class="bg-white rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] border-t border-slate-200 h-80 flex flex-col">
              <div class="flex justify-between items-center p-4 border-b border-slate-100">
                 <h3 class="font-bold text-slate-800">My Scratchpad</h3>
                 <button (click)="toggleNotes()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
              </div>
              <textarea class="flex-grow p-4 resize-none outline-none text-slate-700 leading-relaxed bg-yellow-50/50" placeholder="Type your quick study notes here..."></textarea>
              <div class="p-3 bg-slate-50 flex justify-between items-center text-xs text-slate-500 border-t border-slate-200">
                 <span>Notes are saved locally</span>
                 <button class="text-blue-600 font-bold hover:underline">Save Note</button>
              </div>
           </div>
        </div>
      </div>

      <!-- Payment Modal -->
      @if (showPaymentModal()) {
        <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
              <div class="bg-slate-900 p-6 text-white text-center relative overflow-hidden">
                 <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                 <h2 class="text-2xl font-bold relative z-10">Upgrade to Pro</h2>
                 <p class="text-slate-300 text-sm relative z-10">Unlock all premium content instantly</p>
                 <button (click)="showPaymentModal.set(false)" class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                   <i class="fa-solid fa-xmark text-xl"></i>
                 </button>
              </div>
              
              <div class="p-6 space-y-4">
                 <div class="flex justify-between items-center bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <div>
                      <p class="font-bold text-amber-900">Annual Plan</p>
                      <p class="text-xs text-amber-700">$9.99 / month</p>
                    </div>
                    <i class="fa-solid fa-check-circle text-amber-600 text-xl"></i>
                 </div>

                 <div class="space-y-3">
                    <div>
                      <label class="block text-xs font-bold text-slate-600 mb-1">CARD NUMBER</label>
                      <div class="relative">
                         <i class="fa-regular fa-credit-card absolute left-3 top-3 text-slate-400"></i>
                         <input type="text" [(ngModel)]="cardNum" class="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none" placeholder="0000 0000 0000 0000">
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                       <div>
                          <label class="block text-xs font-bold text-slate-600 mb-1">EXPIRY</label>
                          <input type="text" [(ngModel)]="cardExp" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none" placeholder="MM/YY">
                       </div>
                       <div>
                          <label class="block text-xs font-bold text-slate-600 mb-1">CVC</label>
                          <input type="text" [(ngModel)]="cardCvc" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none" placeholder="123">
                       </div>
                    </div>
                 </div>

                 <button (click)="processPayment()" [disabled]="isProcessing() || !cardNum || !cardExp || !cardCvc" class="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 disabled:opacity-50">
                    @if (isProcessing()) {
                       <i class="fa-solid fa-circle-notch fa-spin"></i> Processing...
                    } @else {
                       Pay $119.88
                    }
                 </button>
                 
                 <p class="text-center text-[10px] text-slate-400">
                   By clicking pay, you agree to our Terms of Service. Secure Payment via Stripe Integration.
                 </p>
              </div>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .protected-content {
       -webkit-user-select: none;
       -moz-user-select: none;
       -ms-user-select: none;
       user-select: none;
    }
    .animate-fade-in {
       animation: fadeIn 0.2s ease-out;
    }
    .animate-slide-up {
       animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes fadeIn {
       from { opacity: 0; }
       to { opacity: 1; }
    }
    @keyframes slideUp {
       from { opacity: 0; transform: translateY(20px); scale: 0.95; }
       to { opacity: 1; transform: translateY(0); scale: 1; }
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
  `]
})
export class StudentDashboardComponent {
  authService = inject(AuthService);
  dataService = inject(DataService);
  
  filter = signal<'all' | 'note' | 'paper' | 'topic'>('all');
  mobileTab = signal<'study' | 'scores' | 'ask' | 'desktop'>('study');
  questionText = '';
  
  showPaymentModal = signal(false);
  isProcessing = signal(false);
  isNoteOpen = signal(false);

  // Fake form model
  cardNum = '';
  cardExp = '';
  cardCvc = '';

  constructor() {
    if (typeof window !== 'undefined') {
       window.addEventListener('resize', () => {
         if (window.innerWidth >= 1024) {
           this.mobileTab.set('desktop');
         } else if (this.mobileTab() === 'desktop') {
           this.mobileTab.set('study');
         }
       });
       if (window.innerWidth >= 1024) this.mobileTab.set('desktop');
    }
  }

  filteredContent = computed(() => {
    const f = this.filter();
    const all = this.dataService.content();
    if (f === 'all') return all;
    return all.filter(item => item.type === f);
  });

  myQueries = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];
    return this.dataService.queries().filter(q => q.studentName.includes(user.name) || q.studentName.includes('Alex'));
  });

  getBadgeClass(type: string) {
    switch (type) {
      case 'note': return 'text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-purple-100';
      case 'paper': return 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-100';
      case 'topic': return 'text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-orange-100';
      default: return 'text-gray-600 bg-gray-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-gray-100';
    }
  }

  getScoreColor(score: number, total: number) {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-red-600';
  }

  submitQuery() {
    if (!this.questionText.trim()) return;
    
    this.dataService.addQuery({
      id: Math.random().toString(36).substr(2, 9),
      studentName: this.authService.currentUser()?.name || 'Anonymous',
      question: this.questionText,
      answer: null,
      timestamp: new Date()
    });
    
    this.questionText = '';
  }

  openPayment() {
    this.showPaymentModal.set(true);
  }

  toggleNotes() {
    this.isNoteOpen.update(v => !v);
  }

  processPayment() {
    this.isProcessing.set(true);
    setTimeout(() => {
      // Record transaction
      const user = this.authService.currentUser();
      if (user) {
          this.dataService.recordTransaction(user.email, 119.88, 'Annual Premium');
      }

      this.authService.upgradeToPremium();
      this.isProcessing.set(false);
      this.showPaymentModal.set(false);
      alert('Payment Successful! Welcome to Pro.');
    }, 1500);
  }

  downloadFile(item: ContentItem) {
     if (item.isLocked && this.authService.currentUser()?.plan !== 'premium') {
       this.openPayment();
       return;
     }

     const element = document.createElement('a');
     const fileContent = `
       ${item.title}
       Subject: ${item.subject}
       Date: ${item.date}
       
       ----------------------------------------
       This is a placeholder content for the file: ${item.fileName || 'document.pdf'}
       
       Thank you for using ExamEdge Pro!
     `;
     
     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent));
     element.setAttribute('download', item.fileName || (item.title + '.txt'));
     element.style.display = 'none';
     document.body.appendChild(element);
     element.click();
     document.body.removeChild(element);
  }
}