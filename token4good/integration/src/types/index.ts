export interface Student {
  id: string;
  walletAddress?: string;
  email: string;
  name: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredLanguage: string;
  learningGoals: string[];
  enrolledCourses: string[];
  certificates: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  ticker: string;
  price: number;
  currency: 'T4G' | 'sats';
  maxStudents: number;
  duration: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  instructors: Instructor[];
  tokenContractId?: string;
  certificateCollectionId?: string;
  lightningChannels: string[];
  enrolledStudents: string[];
  status: 'draft' | 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  nodeId: string;
  rewardPercentage: number;
  specialties: string[];
  biography: string;
}

export interface RgbAsset {
  id: string;
  contractId: string;
  name: string;
  ticker: string;
  totalSupply: number;
  decimals: number;
  assetType: 'fungible' | 'nft' | 'certificate';
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface LightningPayment {
  id: string;
  amount: number;
  currency: 'sats' | 'T4G';
  paymentHash: string;
  preimage?: string;
  invoice: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface HybridPayment {
  id: string;
  rgbPayment: {
    contractId: string;
    amount: number;
  };
  lightningPayment: {
    amountSats: number;
  };
  totalAmount: number;
  invoice: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: Date;
}

export interface Certificate {
  id: string;
  studentId: string;
  courseId: string;
  nftTokenId: string;
  certificateType: 'completion' | 'achievement' | 'specialization';
  grade?: string;
  completionDate: Date;
  validUntil: Date;
  metadata: {
    courseName: string;
    studentName: string;
    instructorName: string;
    skills: string[];
    verificationHash: string;
  };
  createdAt: Date;
}

export interface LearningPath {
  id: string;
  studentId: string;
  name: string;
  description: string;
  courses: string[];
  estimatedDuration: string;
  totalCost: number;
  currency: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: {
    completedCourses: string[];
    currentCourse?: string;
    overallProgress: number;
  };
  aiRecommendations: {
    optimizationScore: number;
    suggestedNextSteps: string[];
    personalizedTips: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AITutorSession {
  id: string;
  studentId: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  budgetSats: number;
  consumedSats: number;
  sessionStatus: 'active' | 'paused' | 'completed';
  paymentStream: {
    ratePerQuestion: number;
    ratePerExplanation: number;
    totalInteractions: number;
  };
  context: {
    learningHistory: string[];
    currentLevel: string;
    preferredStyle: string;
  };
  accessUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentStream {
  id: string;
  payer: string;
  recipient: string;
  ratePerSecond: number;
  maxDuration: number;
  currentDuration: number;
  totalPaid: number;
  status: 'active' | 'paused' | 'completed' | 'expired';
  autoClose: boolean;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StudentProfile {
  id: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredFormat: 'video' | 'text' | 'interactive' | 'mixed';
  budget: number;
  tier: 'basic' | 'premium' | 'enterprise';
  learningHistory: string[];
  completedCourses: string[];
  preferences: {
    pacePreference: 'slow' | 'medium' | 'fast';
    interactionStyle: 'guided' | 'self-directed' | 'collaborative';
    feedbackFrequency: 'immediate' | 'periodic' | 'final';
  };
}

export interface LearningGoal {
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  priority: 'high' | 'medium' | 'low';
  timeframe?: string;
}

export interface ContentAccessPricing {
  pricePerSecond: number;
  pricePerPage: number;
  pricePerQuizAttempt: number;
  bufferAmount: number;
}

export interface VideoSession {
  id: string;
  videoId: string;
  studentId: string;
  paymentStreamId: string;
  startTime: Date;
  endTime?: Date;
  totalCost: number;
  status: 'active' | 'paused' | 'completed';
}