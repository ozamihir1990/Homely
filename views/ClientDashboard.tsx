import React, { useState, useEffect } from 'react';
import { Job, JobStatus, ServiceType, Role } from '../types';
import { ApiService } from '../services/storage';
import { GeminiService } from '../services/gemini';
import { Button } from '../components/Button';
import { JobCard } from '../components/JobCard';

export const ClientDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.CLEANING);
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [date, setDate] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const loadJobs = async () => {
    try {
      const allJobs = await ApiService.getJobs();
      // Filter to show only this client's jobs (mocked as client-1 for now)
      setJobs(allJobs.filter(j => j.clientId === 'client-1'));
    } catch (error) {
      console.error("Failed to load jobs", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnhanceWithAI = async () => {
    if (!description) return;
    setIsEnhancing(true);
    const result = await GeminiService.enhanceDescription(description, serviceType);
    setTitle(result.title);
    setDescription(result.description);
    if (!budget) setBudget(result.estimatedPrice);
    setIsEnhancing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newJob: Job = {
      id: Date.now().toString(),
      clientId: 'client-1',
      title: title || `${serviceType} Request`,
      description,
      serviceType,
      location,
      date,
      budget,
      status: JobStatus.PENDING,
      createdAt: Date.now(),
      aiEstimatedQuote: isEnhancing ? "Enhanced by Gemini" : undefined
    };

    await ApiService.addJob(newJob);
    setIsSubmitting(false);
    setIsModalOpen(false);
    loadJobs();
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setServiceType(ServiceType.CLEANING);
    setLocation('');
    setBudget('');
    setDate('');
  };

  const handleCancelJob = async (id: string) => {
      // Optimistic update could go here
      await ApiService.updateJobStatus(id, JobStatus.DECLINED); 
      loadJobs();
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
            <p className="text-gray-500">Manage your household service bookings.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0 shadow-lg shadow-indigo-200">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          New Request
        </Button>
      </div>

      {isLoading && jobs.length === 0 ? (
         <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
         </div>
      ) : (
        <div className="grid gap-6">
          {jobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No active requests</h3>
              <p className="text-gray-500 mt-1">Get started by creating a new service request.</p>
            </div>
          ) : (
            jobs.map(job => (
              <JobCard key={job.id} job={job} userRole={Role.CLIENT} onCancel={handleCancelJob} />
            ))
          )}
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Request Service</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <select 
                    value={serviceType} 
                    onChange={(e) => setServiceType(e.target.value as ServiceType)}
                    className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Object.values(ServiceType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border-gray-300 border p-2 h-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe what needs to be done..."
                    required
                  />
                  <button 
                    type="button" 
                    onClick={handleEnhanceWithAI}
                    disabled={!description || isEnhancing}
                    className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
                  >
                    {isEnhancing ? (
                      <span className="animate-pulse">✨ AI is thinking...</span>
                    ) : (
                      <>✨ Enhance with AI & Get Price Estimate</>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border-gray-300 border p-2"
                    placeholder="Brief title (Auto-filled by AI)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-lg border-gray-300 border p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                    <input 
                      type="text" 
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full rounded-lg border-gray-300 border p-2"
                      placeholder="$0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-lg border-gray-300 border p-2"
                    placeholder="123 Main St"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>Post Request</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};