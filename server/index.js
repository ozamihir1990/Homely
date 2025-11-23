const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- In-Memory Database ---
let JOBS = [
  {
    id: '1',
    clientId: 'client-1',
    title: 'Deep Clean Kitchen',
    description: 'Need a full deep clean of a 200sqft kitchen, including oven and fridge.',
    serviceType: 'Cleaning',
    location: '123 Maple Ave, Springfield',
    date: '2023-11-15',
    budget: '$150',
    status: 'PENDING',
    createdAt: Date.now() - 100000,
  },
  {
    id: '2',
    clientId: 'client-2',
    title: 'Fix Leaky Faucet',
    description: 'Kitchen sink faucet is dripping constantly.',
    serviceType: 'Plumbing',
    location: '456 Oak Dr, Springfield',
    date: '2023-11-16',
    budget: '$80',
    status: 'ACCEPTED',
    createdAt: Date.now() - 200000,
  }
];

// --- Routes ---

// Get all jobs
app.get('/api/jobs', (req, res) => {
  res.json(JOBS);
});

// Create a new job
app.post('/api/jobs', (req, res) => {
  const job = req.body;
  if (!job.id || !job.title) {
    return res.status(400).json({ error: 'Invalid job data' });
  }
  JOBS.unshift(job);
  res.status(201).json(job);
});

// Update job status
app.patch('/api/jobs/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const jobIndex = JOBS.findIndex(j => j.id === id);
  if (jobIndex === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }

  JOBS[jobIndex].status = status;
  res.json(JOBS[jobIndex]);
});

// Mock Login (returns user profile based on role)
app.post('/api/auth/login', (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: 'Role required' });

  const user = {
    id: role === 'CLIENT' ? 'client-1' : 'worker-1',
    name: role === 'CLIENT' ? 'Alice Homeowner' : 'Bob Builder',
    role: role,
    avatar: `https://picsum.photos/seed/${role}/50/50`
  };
  
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});