import React from 'react';
import { Job, JobStatus, Role } from '../types';
import { Button } from './Button';

interface JobCardProps {
  job: Job;
  userRole: Role;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, userRole, onAccept, onDecline, onCancel }) => {
  const statusColors = {
    [JobStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [JobStatus.ACCEPTED]: 'bg-green-100 text-green-800 border-green-200',
    [JobStatus.DECLINED]: 'bg-red-100 text-red-800 border-red-200',
    [JobStatus.COMPLETED]: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${statusColors[job.status]}`}>
            {job.status}
          </span>
          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {job.location}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-indigo-600">{job.budget}</p>
          <p className="text-xs text-gray-400">{job.date}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-gray-700 text-sm leading-relaxed">{job.description}</p>
        {job.aiEstimatedQuote && (
          <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-indigo-500 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z"/><path d="M12 6a1 1 0 00-1 1v5.59l-3.3-3.3a1 1 0 00-1.4 1.42l5 5a1 1 0 001.4 0l5-5a1 1 0 00-1.4-1.42L13 12.59V7a1 1 0 00-1-1z"/></svg>
            AI Note: {job.aiEstimatedQuote}
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-end mt-4">
        {userRole === Role.WORKER && job.status === JobStatus.PENDING && (
          <>
            <Button variant="outline" onClick={() => onDecline?.(job.id)}>Decline</Button>
            <Button variant="secondary" onClick={() => onAccept?.(job.id)}>Accept Job</Button>
          </>
        )}
        
        {userRole === Role.CLIENT && job.status === JobStatus.PENDING && (
          <Button variant="danger" onClick={() => onCancel?.(job.id)}>Cancel Request</Button>
        )}

        {job.status === JobStatus.ACCEPTED && (
            <div className="flex items-center text-sm text-green-600 font-medium">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Scheduled
            </div>
        )}
      </div>
    </div>
  );
};