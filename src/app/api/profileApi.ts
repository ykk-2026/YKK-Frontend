import { getJson, postForm } from './http';

export interface ApiJobSeekerProfile {
  memberId: number;
  name: string;
  birthDate: string;
  gender: string;
  email: string;
  phone: string;
  profileId?: number | null;
  profileImageUrl?: string | null;
  residenceRegion?: string | null;
  desiredJob?: string | null;
  desiredRegion?: string | null;
  employmentType?: string | null;
  careerType?: string | null;
  careerYears?: number | null;
  minSalary?: number | null;
  workType?: string | null;
  wheelchairRequired?: boolean | null;
  accessibleRestroomRequired?: boolean | null;
  disabledParkingRequired?: boolean | null;
  assistiveDeviceRequired?: boolean | null;
  restAreaRequired?: boolean | null;
  elevatorRequired?: boolean | null;
  contactTimeStart?: string | null;
  contactTimeEnd?: string | null;
  contactMethod?: string | null;
  introduction?: string | null;
  profilePublic?: boolean | null;
}

// 백엔드는 GET/POST + 폼 파라미터로 호출하고, 저장 결과는 MsgDTO { result, msg } 로 응답한다
// 날짜/시간은 "1999-01-02", "09:00" 문자열로 보내고, 한글 라벨(남성, 정규직, 신입 등)은 백엔드에서 코드값으로 변환한다
export const getProfile = (memberId: string | number) =>
  getJson<ApiJobSeekerProfile>('/api/profiles/getProfileInfo', { memberId });

export const saveProfile = (memberId: string | number, profile: ApiJobSeekerProfile) =>
  postForm('/api/profiles/saveProfileInfo', { ...profile, memberId });
