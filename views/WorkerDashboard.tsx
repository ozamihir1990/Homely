import React, { useState, useEffect } from 'react';
import { Job, JobStatus, Role } from '../types';
import { ApiService } from '../services/storage';
import { JobCard } from '../components/JobCard';

export const WorkerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'available' | 'my-jobs'>('available');

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadJobs = async () => {
    try {
      const data = await ApiService.getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Failed to load jobs", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    // Optimistic UI update could happen here, but for safety we await
    await ApiService.updateJobStatus(id, JobStatus.ACCEPTED);
    loadJobs();
  };

  const handleDecline = async (id: string) => {
    await ApiService.updateJobStatus(id, JobStatus.DECLINED);
    loadJobs();
  };

  const availableJobs = jobs.filter(j => j.status === JobStatus.PENDING);
  const myJobs = jobs.filter(j => j.status === JobStatus.ACCEPTED || j.status === JobStatus.COMPLETED);

  const displayJobs = filter === 'available' ? availableJobs : myJobs;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
        <p className="text-gray-500">Find your next gig or manage current jobs.</p>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setFilter('available')}
          className={`pb-3 px-1 font-medium text-sm transition-colors relative ${
            filter === 'available' 
              ? 'text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          New Opportunities ({availableJobs.length})
          {filter === 'available' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setFilter('my-jobs')}
          className={`pb-3 px-1 font-medium text-sm transition-colors relative ${
            filter === 'my-jobs' 
              ? 'text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Jobs ({myJobs.length})
          {filter === 'my-jobs' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
        </button>
      </div>

      {isLoading && jobs.length === 0 ? (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {displayJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs found in this category.</p>
            </div>
          ) : (
            displayJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                userRole={Role.WORKER}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};