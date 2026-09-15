export type Page =
  | 'main'
  | 'login'
  | 'register'
  | 'user-dashboard'
  | 'jobs'
  | 'job-detail'
  | 'saved'
  | 'applications'
  | 'ai-recommend'
  | 'company-info'
  | 'community'
  | 'guide'
  | 'support'
  | 'corporate';

export type UserRole = 'personal' | 'corporate' | 'admin';
export type MemberRole = 'JOB_SEEKER' | 'COMPANY' | 'ADMIN';
export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type CompanyVerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type JobApplicationStatus =
  | 'APPLIED'
  | 'REVIEWING'
  | 'DOCUMENT_PASSED'
  | 'INTERVIEW'
  | 'FINAL_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELED';

export interface CurrentUser {
  role: UserRole;
  name: string;
  id: string;
  disability?: string;
  avatar?: string;
  loginId?: string;
  email?: string;
  phone?: string;
  currentRegion?: string;
  birthDate?: string;
  gender?: string;
  preferredRole?: string;
  remotePreferred?: boolean;
  flexiblePreferred?: boolean;
  wheelchairRequired?: boolean;
  accessibleRestroomRequired?: boolean;
  disabledParkingRequired?: boolean;
  assistiveDeviceRequired?: boolean;
  memberRole?: MemberRole;
  status?: MemberStatus;
  companyProfile?: CompanyProfileData;
}

export interface RegisterFormData {
  loginId: string;
  password: string;
  birthDate: string;
  name: string;
  email: string;
  phone: string;
  currentRegion?: string;
  gender: string;
  preferredRole: string;
}

export interface CorporateRegisterFormData {
  loginId: string;
  password: string;
  managerName: string;
  memberName?: string;
  birthDate?: string;
  gender?: '' | 'MALE' | 'FEMALE' | 'OTHER';
  email: string;
  phone: string;
  companyName: string;
  businessNumber: string;
  representativeName: string;
  industry?: string;
  companyAddress: string;
  companyDetailAddress?: string;
  companyPhone?: string;
  websiteUrl?: string;
  companyDescription?: string;
  employeeCount?: string;
  establishedDate?: string;
  verificationStatus?: CompanyVerificationStatus;
}

export interface CompanyProfileData {
  companyName: string;
  businessNumber: string;
  representativeName: string;
  industry?: string;
  companyAddress: string;
  companyDetailAddress?: string;
  companyPhone?: string;
  websiteUrl?: string;
  logoUrl?: string;
  companyDescription?: string;
  employeeCount?: number;
  establishedDate?: string;
  verificationStatus: CompanyVerificationStatus;
}

export interface Job {
  id: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  title: string;
  location: string;
  salary: string;
  workType: string;
  isRemote: boolean;
  category: string;
  requirements: string[];
  deadline: string;
  posted: string;
  aiScore: number;
  aiReasons: string[];
  description: string;
  benefits: string[];
  companyDesc: string;
  headcount: number;
  accessibility: {
    elevator: boolean;
    parking: boolean;
    wheelchair: boolean;
    restroom: boolean;
    guideDog: boolean;
    hearingLoop: boolean;
  };
  scores: {
    skill: number;
    workCondition: number;
    accessibility: number;
    location: number;
  };
}

export interface NotificationItem {
  id: string;
  text: string;
  time: string;
  isNew: boolean;
  type: 'deadline' | 'apply' | 'ai' | 'status';
}

export interface ApplicationTimelineStep {
  step: string;
  date: string;
  done: boolean;
}

export interface ApplicationFormData {
  name: string;
  phone: string;
  email: string;
  employmentType: string;
  privacyAgreed: boolean;
  applicationStatus?: JobApplicationStatus;
  coverLetter?: string;
  interviewAt?: string;
  managerMemo?: string;
  rejectionReason?: string;
  resultAt?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  job: Job;
  status: string;
  statusColor: string;
  appliedAt: string;
  updatedAt: string;
  timeline: ApplicationTimelineStep[];
}

