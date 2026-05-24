import { Injectable, signal, effect } from '@angular/core';

export interface ContentItem {
  id: string;
  title: string;
  type: 'note' | 'paper' | 'topic';
  subject: string;
  isLocked: boolean;
  date: string;
  preview: string;
  fileName?: string;
}

export interface Query {
  id: string;
  studentName: string;
  question: string;
  answer: string | null;
  timestamp: Date;
}

export interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalSales: number;
  monthlyEarnings: number[];
}

export interface ExamResult {
  id: string;
  examTitle: string;
  score: number;
  total: number;
  date: string;
  subject: string;
}

export interface ActivityLog {
  id: string;
  userEmail: string;
  action: 'Sign In' | 'Sign Out' | 'Purchase' | 'Upload';
  timestamp: string;
  ip: string;
}

export interface Transaction {
  id: string;
  userEmail: string;
  amount: number;
  status: 'Success' | 'Failed' | 'Pending';
  date: string;
  plan: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  plan: 'Free' | 'Premium';
  joinDate: string;
  lastLogin: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private STORAGE_KEY = 'examedge_data_v2';

  // Real-world Content Data
  content = signal<ContentItem[]>([
    { id: 'c1', title: 'Advanced Calculus: Limits & Continuity', type: 'note', subject: 'Mathematics', isLocked: false, date: '2024-03-15', preview: 'Comprehensive notes covering epsilon-delta definitions, continuity on intervals, and intermediate value theorem applications.', fileName: 'calc_limits_v2.pdf' },
    { id: 'c2', title: 'JEE Main 2024 - Physics Full Solution', type: 'paper', subject: 'Physics', isLocked: true, date: '2024-03-10', preview: 'Complete step-by-step solutions for the April session. Includes free body diagrams and formula derivations.', fileName: 'jee_phys_2024.pdf' },
    { id: 'c3', title: 'Organic Chemistry: Named Reactions Cheat Sheet', type: 'topic', subject: 'Chemistry', isLocked: true, date: '2024-03-08', preview: 'A quick revision guide for 50+ essential named reactions including Cannizzaro, Aldol, and Wurtz reactions.', fileName: 'org_chem_cheat.pdf' },
    { id: 'c4', title: 'Modern History: World War II Timeline', type: 'note', subject: 'History', isLocked: false, date: '2024-02-28', preview: 'Detailed timeline of events from 1939 to 1945, focusing on key battles and political shifts.', fileName: 'ww2_timeline.pdf' },
    { id: 'c5', title: 'Biology: Cell Division (Mitosis & Meiosis)', type: 'note', subject: 'Biology', isLocked: false, date: '2024-02-25', preview: 'Visual notes explaining the phases of cell division with high-quality diagrams.', fileName: 'bio_cell_div.pdf' },
    { id: 'c6', title: 'Computer Science: Data Structures - Trees', type: 'topic', subject: 'Computer Science', isLocked: true, date: '2024-02-20', preview: 'Binary Trees, AVL Trees, and Red-Black Trees explained with code snippets in C++ and Python.', fileName: 'cs_trees.pdf' },
    { id: 'c7', title: 'English Literature: Shakespearean Sonnets Analysis', type: 'note', subject: 'English', isLocked: true, date: '2024-02-15', preview: 'In-depth critical analysis of Sonnet 18 and 130, focusing on themes and literary devices.', fileName: 'shakes_sonnets.pdf' },
    { id: 'c8', title: 'NEET 2023 - Biology Question Paper', type: 'paper', subject: 'Biology', isLocked: true, date: '2024-02-10', preview: 'Original question paper from last year for practice.', fileName: 'neet_bio_23.pdf' },
    { id: 'c9', title: 'Macroeconomics: GDP & National Income', type: 'note', subject: 'Economics', isLocked: true, date: '2024-02-05', preview: 'Concepts of GDP, GNP, NNP, and methods of calculating national income.', fileName: 'macro_gdp.pdf' },
    { id: 'c10', title: 'Physics: Thermodynamics Laws', type: 'topic', subject: 'Physics', isLocked: false, date: '2024-01-30', preview: 'Zero, First, Second, and Third laws of thermodynamics explained with real-life examples.', fileName: 'phys_thermo.pdf' },
    { id: 'c11', title: 'Linear Algebra: Eigenvalues', type: 'note', subject: 'Mathematics', isLocked: true, date: '2024-01-25', preview: 'Understanding eigenvectors and eigenvalues in matrix theory.', fileName: 'lin_alg_eigen.pdf' },
    { id: 'c12', title: 'Chemistry: Periodic Table Trends', type: 'topic', subject: 'Chemistry', isLocked: false, date: '2024-01-20', preview: 'Electronegativity, Ionization Energy, and Atomic Radius trends across periods and groups.', fileName: 'chem_periodic.pdf' },
    { id: 'c13', title: 'Law: Constitution of India - Preamble', type: 'note', subject: 'Political Science', isLocked: true, date: '2024-01-15', preview: 'Detailed breakdown of the Preamble and its significance in Indian Law.', fileName: 'pol_sci_const.pdf' },
    { id: 'c14', title: 'Psychology: Freud\'s Psychoanalytic Theory', type: 'note', subject: 'Psychology', isLocked: true, date: '2024-01-10', preview: 'Id, Ego, and Superego concepts explained.', fileName: 'psych_freud.pdf' },
    { id: 'c15', title: 'SAT Practice Test #5 - Math Section', type: 'paper', subject: 'Mathematics', isLocked: true, date: '2024-01-05', preview: 'Official practice questions for SAT preparation.', fileName: 'sat_math_5.pdf' },
    { id: 'c16', title: 'Quantum Physics: Introduction to Wave Mechanics', type: 'note', subject: 'Physics', isLocked: false, date: '2024-03-20', preview: 'Foundational concepts of wave-particle duality, Schrodinger equation, and probability density functions.', fileName: 'quantum_wave_mech.pdf' }
  ]);

  // Real-world Queries
  queries = signal<Query[]>([
    { id: 'q0', studentName: 'Aniruddha', question: 'Will the NEET 2025 syllabus include changes in the biology section?', answer: null, timestamp: new Date() },
    { id: 'q1', studentName: 'Sarah Jenkins', question: 'Does the Advanced Calculus note cover partial differentiation?', answer: null, timestamp: new Date() },
    { id: 'q2', studentName: 'Rahul Verma', question: 'I found a typo in the Physics solution, question 4. Should be 9.8 m/s^2.', answer: 'Thanks Rahul! We have verified and updated the document.', timestamp: new Date(Date.now() - 3600000 * 2) },
    { id: 'q3', studentName: 'Emily Chen', question: 'Are these notes suitable for IB HL Math?', answer: 'Yes, Emily. The calculus and algebra sections strictly follow the IB HL syllabus.', timestamp: new Date(Date.now() - 3600000 * 24) },
    { id: 'q4', studentName: 'Michael Rossi', question: 'My payment went through but I still see the lock icon.', answer: 'Please try refreshing your browser. If the issue persists, contact support@examedge.pro with your transaction ID.', timestamp: new Date(Date.now() - 3600000 * 48) },
    { id: 'q5', studentName: 'Priya Patel', question: 'Can you upload more on Organic Chemistry mechanisms?', answer: 'We have a new upload scheduled for next Monday covering SN1 and SN2 reactions.', timestamp: new Date(Date.now() - 3600000 * 72) }
  ]);

  // Real-world Results (For Student Dashboard Mock)
  results = signal<ExamResult[]>([
    { id: 'r1', examTitle: 'Full Mock Test: Physics', score: 88, total: 100, date: '2024-03-12', subject: 'Physics' },
    { id: 'r2', examTitle: 'Math: Calculus Quiz 3', score: 45, total: 50, date: '2024-03-05', subject: 'Mathematics' },
    { id: 'r3', examTitle: 'Chemistry: Organic I', score: 62, total: 75, date: '2024-02-28', subject: 'Chemistry' },
    { id: 'r4', examTitle: 'History: World Wars', score: 95, total: 100, date: '2024-02-20', subject: 'History' },
    { id: 'r5', examTitle: 'Biology: Genetics Unit Test', score: 38, total: 50, date: '2024-02-15', subject: 'Biology' },
    { id: 'r6', examTitle: 'Physics: Kinematics', score: 28, total: 30, date: '2024-02-10', subject: 'Physics' },
    { id: 'r7', examTitle: 'English: Essay Writing', score: 82, total: 100, date: '2024-02-01', subject: 'English' },
    { id: 'r8', examTitle: 'CS: Python Basics', score: 50, total: 50, date: '2024-01-25', subject: 'Computer Science' },
    { id: 'r9', examTitle: 'Math: Trigonometry', score: 70, total: 100, date: '2024-01-15', subject: 'Mathematics' },
    { id: 'r10', examTitle: 'Economics: Micro Basics', score: 40, total: 50, date: '2024-01-10', subject: 'Economics' }
  ]);

  // Real-world Analytics
  analytics = signal<Analytics>({
    totalUsers: 2453,
    activeUsers: 892,
    totalSales: 84350,
    monthlyEarnings: [4200, 5100, 4800, 6200, 5900, 7800] // Last 6 months trend
  });

  // Real-world Activity Logs
  activityLogs = signal<ActivityLog[]>([
    { id: 'l1', userEmail: 'alex@university.edu', action: 'Sign In', timestamp: new Date().toISOString(), ip: '192.168.1.105' },
    { id: 'l2', userEmail: 'sarah.j@gmail.com', action: 'Purchase', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), ip: '104.22.58.12' },
    { id: 'l3', userEmail: 'mike.rossi@outlook.com', action: 'Sign Out', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), ip: '172.16.0.23' },
    { id: 'l4', userEmail: 'admin@examedge.pro', action: 'Upload', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), ip: '10.0.0.1' },
    { id: 'l5', userEmail: 'emily.c@school.edu', action: 'Sign In', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), ip: '192.168.1.44' },
    { id: 'l6', userEmail: 'rahul.v@tech.in', action: 'Sign In', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), ip: '14.139.45.2' },
    { id: 'l7', userEmail: 'guest_88@student.com', action: 'Sign In', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), ip: '45.32.11.9' },
    { id: 'l8', userEmail: 'admin@examedge.pro', action: 'Sign In', timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), ip: '10.0.0.1' }
  ]);

  // Real-world Transactions
  transactions = signal<Transaction[]>([
    { id: 'tx_101', userEmail: 'sarah.j@gmail.com', amount: 119.88, status: 'Success', date: '2024-03-15', plan: 'Annual Premium' },
    { id: 'tx_102', userEmail: 'mike.rossi@outlook.com', amount: 9.99, status: 'Failed', date: '2024-03-14', plan: 'Monthly Premium' },
    { id: 'tx_103', userEmail: 'priya.p@college.edu', amount: 119.88, status: 'Success', date: '2024-03-14', plan: 'Annual Premium' },
    { id: 'tx_104', userEmail: 'david.kim@korea.kr', amount: 119.88, status: 'Success', date: '2024-03-13', plan: 'Annual Premium' },
    { id: 'tx_105', userEmail: 'juan.garcia@mx.com', amount: 9.99, status: 'Success', date: '2024-03-13', plan: 'Monthly Premium' },
    { id: 'tx_106', userEmail: 'chen.wei@cn.net', amount: 119.88, status: 'Pending', date: '2024-03-12', plan: 'Annual Premium' },
    { id: 'tx_107', userEmail: 'alex@university.edu', amount: 9.99, status: 'Success', date: '2024-03-10', plan: 'Monthly Premium' }
  ]);

  // Real-world Students (User Data)
  students = signal<StudentProfile[]>([
    { id: 'u1', name: 'Alex Student', email: 'alex@university.edu', status: 'Active', plan: 'Premium', joinDate: '2023-09-01', lastLogin: '2 mins ago', country: 'USA' },
    { id: 'u2', name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', status: 'Active', plan: 'Premium', joinDate: '2023-10-15', lastLogin: '5 mins ago', country: 'UK' },
    { id: 'u3', name: 'Rahul Verma', email: 'rahul.v@tech.in', status: 'Active', plan: 'Free', joinDate: '2023-11-20', lastLogin: '2 hours ago', country: 'India' },
    { id: 'u4', name: 'Emily Chen', email: 'emily.c@school.edu', status: 'Inactive', plan: 'Free', joinDate: '2023-12-05', lastLogin: '3 days ago', country: 'Canada' },
    { id: 'u5', name: 'Mike Rossi', email: 'mike.rossi@outlook.com', status: 'Active', plan: 'Premium', joinDate: '2024-01-10', lastLogin: '15 mins ago', country: 'Italy' },
    { id: 'u6', name: 'Priya Patel', email: 'priya.p@college.edu', status: 'Active', plan: 'Premium', joinDate: '2024-01-25', lastLogin: '1 day ago', country: 'India' },
    { id: 'u7', name: 'David Kim', email: 'david.kim@korea.kr', status: 'Active', plan: 'Premium', joinDate: '2024-02-14', lastLogin: '4 hours ago', country: 'South Korea' },
    { id: 'u8', name: 'Juan Garcia', email: 'juan.garcia@mx.com', status: 'Active', plan: 'Free', joinDate: '2024-02-28', lastLogin: '5 hours ago', country: 'Mexico' },
    { id: 'u9', name: 'Chen Wei', email: 'chen.wei@cn.net', status: 'Inactive', plan: 'Free', joinDate: '2024-03-01', lastLogin: '1 week ago', country: 'China' },
    { id: 'u11', name: 'Fatima Al-Sayed', email: 'fatima.a@uae.ae', status: 'Active', plan: 'Free', joinDate: '2024-03-08', lastLogin: '30 mins ago', country: 'UAE' },
    { id: 'u12', name: 'Lucas Silva', email: 'lucas.s@br.com', status: 'Active', plan: 'Free', joinDate: '2024-03-10', lastLogin: '6 hours ago', country: 'Brazil' },
    { id: 'u14', name: 'Olga Ivanova', email: 'olga.i@ru.ru', status: 'Inactive', plan: 'Free', joinDate: '2024-03-12', lastLogin: '2 days ago', country: 'Russia' },
    { id: 'u15', name: 'John Doe', email: 'john.d@us.com', status: 'Active', plan: 'Free', joinDate: '2024-03-14', lastLogin: 'Just now', country: 'USA' }
  ]);

  constructor() {
    this.loadFromStorage();
  }

  // Persistence Logic
  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.content) this.content.set(parsed.content);
          if (parsed.queries) this.queries.set(parsed.queries);
          if (parsed.results) this.results.set(parsed.results);
          if (parsed.activityLogs) this.activityLogs.set(parsed.activityLogs);
          if (parsed.transactions) this.transactions.set(parsed.transactions);
          if (parsed.students) this.students.set(parsed.students);
          // Analytics we usually keep mock or re-calc, but let's keep mock for now
        } catch (e) {
          console.error('Failed to load local storage data', e);
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      const payload = {
        content: this.content(),
        queries: this.queries(),
        results: this.results(),
        activityLogs: this.activityLogs(),
        transactions: this.transactions(),
        students: this.students()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
    }
  }

  // Methods
  addContent(item: ContentItem) {
    this.content.update(items => [item, ...items]);
    this.saveToStorage();
  }

  addQuery(query: Query) {
    this.queries.update(qs => [query, ...qs]);
    this.saveToStorage();
  }

  answerQuery(id: string, answer: string) {
    this.queries.update(qs => qs.map(q => q.id === id ? { ...q, answer } : q));
    this.saveToStorage();
  }

  deleteContent(id: string) {
    this.content.update(items => items.filter(i => i.id !== id));
    this.saveToStorage();
  }

  toggleLock(id: string) {
    this.content.update(items => items.map(i => i.id === id ? { ...i, isLocked: !i.isLocked } : i));
    this.saveToStorage();
  }

  logActivity(email: string, action: 'Sign In' | 'Sign Out' | 'Purchase' | 'Upload') {
    const log: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      userEmail: email,
      action: action,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1' // Mock IP
    };
    this.activityLogs.update(logs => [log, ...logs]);
    this.saveToStorage();
  }

  recordTransaction(email: string, amount: number, plan: string) {
    const tx: Transaction = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      userEmail: email,
      amount: amount,
      status: 'Success',
      date: new Date().toISOString().split('T')[0],
      plan: plan
    };
    this.transactions.update(txs => [tx, ...txs]);
    this.analytics.update(a => ({
      ...a,
      totalSales: a.totalSales + amount
    }));
    this.logActivity(email, 'Purchase');

    // Update student plan if exists
    this.students.update(students => students.map(s => s.email === email ? { ...s, plan: 'Premium' } : s));

    this.saveToStorage();
  }
}