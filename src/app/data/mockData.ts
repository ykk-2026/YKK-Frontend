import type { Application, CurrentUser, Job, NotificationItem } from '@/app/types';

export const mockJobs: Job[] = [
  {
    id: '1',
    company: 'Samsung SDS',
    companyInitials: 'S',
    companyColor: '#1B6EF3',
    title: 'Java Backend Developer',
    location: 'Seoul, Songpa-gu',
    salary: '40M ~ 60M KRW',
    workType: 'Remote available',
    isRemote: true,
    category: 'IT',
    requirements: ['Java', 'Spring Boot', 'SQL', 'AWS', 'Git'],
    deadline: '2026-08-31',
    posted: '2026-07-15',
    aiScore: 98,
    aiReasons: [
      'Java skills closely match the job requirements.',
      'Remote work improves working-condition fit.',
      'Office accessibility conditions are strong.',
      'The location matches the preferred Seoul area.',
    ],
    description:
      'Samsung SDS is hiring Java backend developers for cloud-based enterprise solutions. The workplace supports accessible facilities and flexible collaboration.',
    benefits: ['Insurance', '15 days PTO', 'Welfare points', 'Lunch support', 'Remote work', 'Flexible hours', 'Health checkup', 'Family event support'],
    companyDesc:
      'Samsung SDS provides IT services across cloud, AI, logistics IT, and enterprise digital transformation.',
    headcount: 3,
    accessibility: { elevator: true, parking: true, wheelchair: true, restroom: true, guideDog: false, hearingLoop: false },
    scores: { skill: 98, workCondition: 96, accessibility: 95, location: 100 },
  },
  {
    id: '2',
    company: 'Kakao',
    companyInitials: 'K',
    companyColor: '#F59E0B',
    title: 'Frontend Developer (React)',
    location: 'Gyeonggi, Seongnam',
    salary: '45M ~ 70M KRW',
    workType: 'Hybrid',
    isRemote: true,
    category: 'IT',
    requirements: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git'],
    deadline: '2026-09-15',
    posted: '2026-07-18',
    aiScore: 91,
    aiReasons: [
      'React and TypeScript skills match the role.',
      'Hybrid work allows flexible scheduling.',
      'The office provides broad accessibility support.',
      'The commute condition is reasonable.',
    ],
    description:
      'Kakao is hiring frontend developers to improve user experiences across multiple services.',
    benefits: ['Stock options', 'Club support', 'Remote work', 'Learning budget', 'Latest devices', 'Flexible hours', 'Medical support'],
    companyDesc:
      'Kakao operates major mobile and platform services including messaging, maps, commerce, and content.',
    headcount: 2,
    accessibility: { elevator: true, parking: true, wheelchair: true, restroom: true, guideDog: true, hearingLoop: true },
    scores: { skill: 88, workCondition: 95, accessibility: 98, location: 85 },
  },
  {
    id: '3',
    company: 'LG CNS',
    companyInitials: 'L',
    companyColor: '#8B5CF6',
    title: 'Data Analyst',
    location: 'Seoul, Gangseo-gu',
    salary: '35M ~ 55M KRW',
    workType: 'Office based',
    isRemote: false,
    category: 'IT',
    requirements: ['Python', 'SQL', 'R', 'Tableau', 'Statistics'],
    deadline: '2026-08-20',
    posted: '2026-07-20',
    aiScore: 85,
    aiReasons: [
      'SQL and Python skills partially match.',
      'The office has accessible facilities.',
      'The Seoul work location matches the preference.',
    ],
    description:
      'LG CNS is hiring a data analyst to work on big-data analysis and AI solution projects.',
    benefits: ['Insurance', '20 days PTO', 'Medical support', 'Family allowance', 'Housing support', 'Education support'],
    companyDesc:
      'LG CNS provides IT services and digital transformation solutions for enterprise clients.',
    headcount: 1,
    accessibility: { elevator: true, parking: true, wheelchair: true, restroom: true, guideDog: false, hearingLoop: false },
    scores: { skill: 78, workCondition: 80, accessibility: 90, location: 95 },
  },
  {
    id: '4',
    company: 'SK C&C',
    companyInitials: 'SK',
    companyColor: '#EF4444',
    title: 'UI/UX Designer',
    location: 'Seoul, Jung-gu',
    salary: '32M ~ 48M KRW',
    workType: 'Flexible hours',
    isRemote: false,
    category: 'Design',
    requirements: ['Figma', 'Adobe XD', 'Sketch', 'UI design', 'User research'],
    deadline: '2026-08-25',
    posted: '2026-07-22',
    aiScore: 79,
    aiReasons: [
      'Design tool experience is required.',
      'Flexible hours can support adjusted schedules.',
      'The central Seoul location has good access.',
    ],
    description:
      'SK C&C is hiring a UI/UX designer to build user-centered digital experiences.',
    benefits: ['Insurance', '15 days PTO', 'Learning budget', 'Design tools', 'Flexible hours'],
    companyDesc:
      'SK C&C supports digital innovation as an IT service company in the SK group.',
    headcount: 2,
    accessibility: { elevator: true, parking: false, wheelchair: true, restroom: true, guideDog: false, hearingLoop: false },
    scores: { skill: 72, workCondition: 85, accessibility: 80, location: 90 },
  },
  {
    id: '5',
    company: 'Naver',
    companyInitials: 'N',
    companyColor: '#10B981',
    title: 'Service Planner',
    location: 'Gyeonggi, Seongnam',
    salary: '40M ~ 65M KRW',
    workType: 'Remote available',
    isRemote: true,
    category: 'Planning',
    requirements: ['Service planning', 'Presentation', 'Data analysis', 'Communication', 'Project management'],
    deadline: '2026-09-01',
    posted: '2026-07-19',
    aiScore: 83,
    aiReasons: [
      'Service planning experience partially matches.',
      'Remote work is available.',
      'The company supports accessible workplaces.',
    ],
    description:
      'Naver is hiring a service planner for products used by millions of users.',
    benefits: ['Stock options', 'Remote work', 'Learning support', 'Health checkup', 'Cafeteria', 'Shuttle bus'],
    companyDesc:
      'Naver operates search, commerce, content, and platform services.',
    headcount: 1,
    accessibility: { elevator: true, parking: true, wheelchair: true, restroom: true, guideDog: true, hearingLoop: true },
    scores: { skill: 80, workCondition: 90, accessibility: 95, location: 82 },
  },
  {
    id: '6',
    company: 'Hyundai IT&E',
    companyInitials: 'H',
    companyColor: '#0EA5E9',
    title: 'System Operations Engineer',
    location: 'Seoul, Yeongdeungpo-gu',
    salary: '30M ~ 42M KRW',
    workType: 'No shift work',
    isRemote: false,
    category: 'IT',
    requirements: ['Linux', 'Shell Script', 'Monitoring', 'ITSM', 'IT infrastructure'],
    deadline: '2026-08-15',
    posted: '2026-07-10',
    aiScore: 76,
    aiReasons: [
      'IT infrastructure operations skills partially match.',
      'No shift work supports a stable schedule.',
      'Basic accessible facilities are available.',
    ],
    description:
      'Hyundai IT&E is hiring an engineer to operate stable IT systems.',
    benefits: ['Insurance', '15 days PTO', 'Meal support', 'Commuter bus', 'Family event support'],
    companyDesc:
      'Hyundai IT&E provides IT services for Hyundai Department Store Group.',
    headcount: 3,
    accessibility: { elevator: true, parking: true, wheelchair: false, restroom: true, guideDog: false, hearingLoop: false },
    scores: { skill: 70, workCondition: 75, accessibility: 78, location: 85 },
  },
];

export const mockUser: CurrentUser = {
  role: 'personal',
  name: 'Minjun Kim',
  id: 'minjun_kim',
  disability: 'Physical disability',
  avatar: 'KM',
};

export const mockCorporateUser: CurrentUser = {
  role: 'corporate',
  name: 'Samsung SDS Recruiter',
  id: 'samsung_sds_hr',
};

export const mockAdminUser: CurrentUser = {
  role: 'admin',
  name: 'Admin',
  id: 'admin',
};

export const categories = [
  { id: 'IT', label: 'IT / Development', icon: 'Code', count: 342 },
  { id: 'Office', label: 'Office / Management', icon: 'Office', count: 218 },
  { id: 'Design', label: 'Design', icon: 'Design', count: 95 },
  { id: 'Service', label: 'Service / Support', icon: 'Service', count: 173 },
  { id: 'Production', label: 'Production / Technical', icon: 'Factory', count: 127 },
];

export const notifications: NotificationItem[] = [
  { id: '1', text: 'Samsung SDS Java Backend Developer closes in 3 days.', time: 'Just now', isNew: true, type: 'deadline' },
  { id: '2', text: 'Your Kakao frontend developer application was submitted.', time: '2 hours ago', isNew: true, type: 'apply' },
  { id: '3', text: 'AI found 5 new matched job posts.', time: '1 day ago', isNew: false, type: 'ai' },
  { id: '4', text: 'LG CNS is reviewing your documents.', time: '2 days ago', isNew: false, type: 'status' },
];

export const applications: Application[] = [
  {
    id: '1',
    job: mockJobs[1],
    status: 'Document review',
    statusColor: '#F59E0B',
    appliedAt: '2026-07-20',
    updatedAt: '2026-07-22',
    timeline: [
      { step: 'Application submitted', date: '2026-07-20', done: true },
      { step: 'Document review', date: '2026-07-22', done: true },
      { step: 'Interview offer', date: '', done: false },
      { step: 'Final result', date: '', done: false },
    ],
  },
  {
    id: '2',
    job: mockJobs[2],
    status: 'Interview offer',
    statusColor: '#8B5CF6',
    appliedAt: '2026-07-15',
    updatedAt: '2026-07-25',
    timeline: [
      { step: 'Application submitted', date: '2026-07-15', done: true },
      { step: 'Document review', date: '2026-07-18', done: true },
      { step: 'Interview offer', date: '2026-07-25', done: true },
      { step: 'Final result', date: '', done: false },
    ],
  },
  {
    id: '3',
    job: mockJobs[3],
    status: 'Submitted',
    statusColor: '#1B6EF3',
    appliedAt: '2026-07-28',
    updatedAt: '2026-07-28',
    timeline: [
      { step: 'Application submitted', date: '2026-07-28', done: true },
      { step: 'Document review', date: '', done: false },
      { step: 'Interview offer', date: '', done: false },
      { step: 'Final result', date: '', done: false },
    ],
  },
];

export const adminStats = {
  totalUsers: 12847,
  totalCompanies: 1523,
  totalJobs: 4218,
  totalApplications: 38492,
  newUsersThisMonth: 423,
  newJobsThisMonth: 312,
  monthlyData: [
    { month: 'Jan', users: 8200, jobs: 2800, apps: 24000 },
    { month: 'Feb', users: 8900, jobs: 3100, apps: 27000 },
    { month: 'Mar', users: 9500, jobs: 3400, apps: 29500 },
    { month: 'Apr', users: 10200, jobs: 3600, apps: 31000 },
    { month: 'May', users: 11100, jobs: 3900, apps: 34000 },
    { month: 'Jun', users: 11800, jobs: 4000, apps: 36000 },
    { month: 'Jul', users: 12847, jobs: 4218, apps: 38492 },
  ],
  disabilityTypes: [
    { name: 'Physical', value: 38, color: '#1B6EF3' },
    { name: 'Visual', value: 12, color: '#10B981' },
    { name: 'Hearing', value: 15, color: '#F59E0B' },
    { name: 'Brain lesion', value: 8, color: '#8B5CF6' },
    { name: 'Intellectual', value: 10, color: '#EF4444' },
    { name: 'Other', value: 17, color: '#64748B' },
  ],
};
