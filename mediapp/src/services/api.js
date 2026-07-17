import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// ─── Mocked data for demo (used when backend is unavailable) ───────────────

export const mockDashboardData = {
  heartRate: 72,
  bp: { systolic: 118, diastolic: 76 },
  weight: 74.2,
  sleep: 7.5,
  weeklyData: [
    { day: 'Mon', heartRate: 70, sleep: 7.2, steps: 8200 },
    { day: 'Tue', heartRate: 75, sleep: 6.8, steps: 9100 },
    { day: 'Wed', heartRate: 68, sleep: 8.1, steps: 7600 },
    { day: 'Thu', heartRate: 72, sleep: 7.5, steps: 10200 },
    { day: 'Fri', heartRate: 80, sleep: 6.5, steps: 11300 },
    { day: 'Sat', heartRate: 65, sleep: 8.8, steps: 6400 },
    { day: 'Sun', heartRate: 69, sleep: 9.0, steps: 7800 },
  ]
}

export const mockRecords = [
  { id: '1', title: 'Annual Physical Checkup', type: 'Checkup', date: '2025-06-10', doctor: 'Dr. Priya Sharma', notes: 'All vitals normal. Blood pressure slightly elevated.' },
  { id: '2', title: 'Complete Blood Count (CBC)', type: 'Lab Test', date: '2025-06-05', doctor: 'Dr. Arjun Mehta', notes: 'Hemoglobin: 14.2 g/dL, WBC: 6800 cells/μL' },
  { id: '3', title: 'Metformin 500mg', type: 'Prescription', date: '2025-05-28', doctor: 'Dr. Priya Sharma', notes: 'Take twice daily with meals. 30-day supply.' },
  { id: '4', title: 'COVID-19 Booster', type: 'Vaccination', date: '2025-04-15', doctor: 'Dr. Faisal Khan', notes: 'Moderna bivalent booster. No adverse reactions.' },
  { id: '5', title: 'Appendectomy Follow-up', type: 'Surgery', date: '2025-03-20', doctor: 'Dr. Rahul Gupta', notes: 'Wound healing well. Resume normal activity.' },
]

export const mockTrackerHistory = [
  { id: '1', date: '2025-06-20', heartRate: 72, bpSystolic: 118, bpDiastolic: 76, weight: 74.2, sleep: 7.5, steps: 9200 },
  { id: '2', date: '2025-06-19', heartRate: 75, bpSystolic: 120, bpDiastolic: 78, weight: 74.5, sleep: 6.8, steps: 8100 },
  { id: '3', date: '2025-06-18', heartRate: 68, bpSystolic: 115, bpDiastolic: 74, weight: 74.3, sleep: 8.2, steps: 10300 },
  { id: '4', date: '2025-06-17', heartRate: 80, bpSystolic: 125, bpDiastolic: 82, weight: 74.7, sleep: 6.5, steps: 7400 },
  { id: '5', date: '2025-06-16', heartRate: 69, bpSystolic: 117, bpDiastolic: 75, weight: 74.0, sleep: 8.8, steps: 11200 },
  { id: '6', date: '2025-06-15', heartRate: 71, bpSystolic: 119, bpDiastolic: 77, weight: 74.1, sleep: 7.9, steps: 9800 },
  { id: '7', date: '2025-06-14', heartRate: 74, bpSystolic: 122, bpDiastolic: 80, weight: 74.4, sleep: 7.2, steps: 8600 },
]

export const mockProfile = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  dob: '1992-08-15',
  gender: 'Male',
  bloodType: 'O+',
  height: 178,
  allergies: ['Penicillin', 'Pollen'],
  conditions: ['Mild Hypertension'],
  emergencyName: 'Sarah Johnson',
  emergencyPhone: '+1 (555) 987-6543'
}
