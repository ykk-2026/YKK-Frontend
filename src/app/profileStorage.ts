export interface SavedJobSeekerProfile {
  name: string;
  birthDate: string;
  gender: string;
  email: string;
  phone: string;
  residenceRegion: string;
  desiredJob: string;
  desiredRegion: string;
  employmentType: string;
  careerType: string;
  careerYears: string;
  minSalary: string;
  workType: string;
  educationLevel: string;
  wheelchairRequired: boolean;
  accessibleRestroomRequired: boolean;
  disabledParkingRequired: boolean;
  assistiveDeviceRequired: boolean;
  restAreaRequired: boolean;
  elevatorRequired: boolean;
  contactTimeStart: string;
  contactTimeEnd: string;
  contactMethod: string;
  introduction: string;
  profilePublic: boolean;
  savedAt: string;
}

const profileStoragePrefix = 'jobBridgeJobSeekerProfile';

export const getJobSeekerProfileStorageKey = (userId: string) => `${profileStoragePrefix}:${userId}`;

export const loadJobSeekerProfile = (userId: string): Partial<SavedJobSeekerProfile> | null => {
  if (typeof window === 'undefined') return null;

  const savedProfile = localStorage.getItem(getJobSeekerProfileStorageKey(userId));
  if (!savedProfile) return null;

  try {
    return JSON.parse(savedProfile) as SavedJobSeekerProfile;
  } catch {
    localStorage.removeItem(getJobSeekerProfileStorageKey(userId));
    return null;
  }
};

export const saveJobSeekerProfile = (userId: string, profile: Omit<SavedJobSeekerProfile, 'savedAt'>) => {
  const nextProfile = {
    ...profile,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    getJobSeekerProfileStorageKey(userId),
    JSON.stringify(nextProfile),
  );

  window.dispatchEvent(new CustomEvent('jobBridgeProfileSaved', { detail: { userId, profile: nextProfile } }));
};
