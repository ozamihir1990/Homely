export enum Role {
  NONE = 'NONE',
  CLIENT = 'CLIENT',
  WORKER = 'WORKER'
}

export enum JobStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  COMPLETED = 'COMPLETED'
}

export enum ServiceType {
  CLEANING = 'Cleaning',
  COOKING = 'Cooking',
  GARDENING = 'Gardening',
  PLUMBING = 'Plumbing',
  ELECTRICIAN = 'Electrician',
  OTHER = 'Other'
}

export interface Job {
  id: string;
  clientId: string; // Simulated user ID
  title: string;
  description: string;
  serviceType: ServiceType;
  location: string;
  date: string;
  budget: string;
  status: JobStatus;
  createdAt: number;
  aiEstimatedQuote?: string; // AI enriched data
}

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}