export type UserRole = 'student' | 'educator' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: Date;
}

export interface Educator extends User {
  role: 'educator';
  specialty: string[];
  rating: number;
  totalStudents: number;
  totalClasses: number;
  verified: boolean;
}

export interface Student extends User {
  role: 'student';
  enrolledClasses: string[];
  completedClasses: string[];
  certificates: string[];
}

export type ClassType = 'live' | 'video';
export type ClassStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isVisible: boolean;
  order: number;
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  educatorId: string;
  educator: Educator;
  categoryId: string;
  category: Category;
  subcategory: string;
  tags: string[];
  type: ClassType;
  price: number;
  currency: string;
  scheduledAt: Date;
  duration: number; // in minutes
  status: ClassStatus;
  maxStudents?: number;
  enrolledStudents: number;
  thumbnail?: string;
  videoUrl?: string; // for video courses
  createdAt: Date;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  enrolledAt: Date;
  completed: boolean;
  completedAt?: Date;
  certificateId?: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  educatorId: string;
  educatorName: string;
  issuedAt: Date;
  certificateNumber: string;
}

export interface ChatMessage {
  id: string;
  classId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
  isQuestion: boolean;
}

export interface ClassroomState {
  isLive: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
  isScreenSharing: boolean;
  viewerCount: number;
  messages: ChatMessage[];
}

export interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayout: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  date: Date;
  status: 'completed' | 'pending' | 'refunded';
}

export interface AdminStats {
  totalUsers: number;
  totalEducators: number;
  totalStudents: number;
  totalClasses: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingApprovals: number;
}
