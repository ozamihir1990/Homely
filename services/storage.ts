import { Job, JobStatus, Role, UserProfile } from '../types';

const JOBS_KEY = 'homely_jobs';
const USER_KEY = 'homely_current_user';
const API_URL = 'http://localhost:3000/api';

// TOGGLE THIS TO SWITCH BETWEEN MOCK AND REAL BACKEND
// Since we can't run the Node server in this browser preview, we default to true.
const USE_MOCK_BACKEND = true;

// Mock initial data for the "database"
const MOCK_INITIAL_JOBS: Job[] = [
  {
    id: '1',
    clientId: 'client-1',
    title: 'Deep Clean Kitchen',
    description: 'Need a full deep clean of a 200sqft kitchen, including oven and fridge.',
    serviceType: 'Cleaning' as any,
    location: '123 Maple Ave, Springfield',
    date: '2023-11-15',
    budget: '$150',
    status: JobStatus.PENDING,
    createdAt: Date.now() - 100000,
  },
  {
    id: '2',
    clientId: 'client-2',
    title: 'Fix Leaky Faucet',
    description: 'Kitchen sink faucet is dripping constantly.',
    serviceType: 'Plumbing' as any,
    location: '456 Oak Dr, Springfield',
    date: '2023-11-16',
    budget: '$80',
    status: JobStatus.ACCEPTED,
    createdAt: Date.now() - 200000,
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ApiService = {
  getJobs: async (): Promise<Job[]> => {
    if (USE_MOCK_BACKEND) {
      await delay(400); // Simulate network latency
      const data = localStorage.getItem(JOBS_KEY);
      if (!data) {
        localStorage.setItem(JOBS_KEY, JSON.stringify(MOCK_INITIAL_JOBS));
        return MOCK_INITIAL_JOBS;
      }
      return JSON.parse(data);
    } else {
      const res = await fetch(`${API_URL}/jobs`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      return res.json();
    }
  },

  addJob: async (job: Job): Promise<Job> => {
    if (USE_MOCK_BACKEND) {
      await delay(400);
      const jobs = await ApiService.getJobs();
      const newJobs = [job, ...jobs];
      localStorage.setItem(JOBS_KEY, JSON.stringify(newJobs));
      return job;
    } else {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      return res.json();
    }
  },

  updateJobStatus: async (id: string, status: JobStatus): Promise<Job> => {
    if (USE_MOCK_BACKEND) {
      await delay(300);
      const jobs = await ApiService.getJobs();
      let updatedJob: Job | undefined;
      const newJobs = jobs.map(job => {
        if (job.id === id) {
          updatedJob = { ...job, status };
          return updatedJob;
        }
        return job;
      });
      localStorage.setItem(JOBS_KEY, JSON.stringify(newJobs));
      if (!updatedJob) throw new Error('Job not found');
      return updatedJob;
    } else {
      const res = await fetch(`${API_URL}/jobs/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return res.json();
    }
  },

  login: async (role: Role): Promise<UserProfile> => {
    if (USE_MOCK_BACKEND) {
      await delay(500);
      const user: UserProfile = {
        id: role === Role.CLIENT ? 'client-1' : 'worker-1',
        name: role === Role.CLIENT ? 'Alice Homeowner' : 'Bob Builder',
        role: role,
        avatar: `https://picsum.photos/seed/${role}/50/50`
      };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } else {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const user = await res.json();
      localStorage.setItem(USER_KEY, JSON.stringify(user)); // Keep session locally
      return user;
    }
  },

  getUser: async (): Promise<UserProfile | null> => {
    // For simple auth, we still rely on local token/user data
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  logout: async () => {
    localStorage.removeItem(USER_KEY);
  }
};