// 백엔드(스프링부트) 호출 공통 함수
// 백엔드는 강의 방식대로 GET/POST + 폼 파라미터(request.getParameter)로 값을 받고,
// 등록/수정/삭제 결과는 MsgDTO { result, msg } 로 돌려준다.

export interface MsgDTO {
  result?: number; // 성공 : 1 / 실패 : 그 외 (0이면 JSON에서 생략됨)
  msg?: string; // 메시지
}

// 폼 전송 형식으로 변환 : 강의의 $("#f").serialize() 와 동일 (application/x-www-form-urlencoded)
export const form = (data: Record<string, unknown>) => {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    params.append(key, String(value));
  });
  return params;
};

// POST 호출 후 MsgDTO 결과 확인 (result가 1이 아니면 msg로 예외 발생)
export async function postForm(url: string, data: Record<string, unknown> = {}): Promise<MsgDTO> {
  const response = await fetch(url, { method: 'POST', body: form(data) });
  if (!response.ok) throw new Error(`요청 실패 (${response.status})`);
  const json = (await response.json()) as MsgDTO;
  if (json.result !== 1) throw new Error(json.msg || '요청이 실패했습니다.');
  return json;
}

// GET 호출 후 JSON 결과 반환
export async function getJson<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const query = params ? `?${form(params).toString()}` : '';
  const response = await fetch(url + query, { cache: 'no-store' });
  if (!response.ok) throw new Error(`요청 실패 (${response.status})`);
  return response.json() as Promise<T>;
}
