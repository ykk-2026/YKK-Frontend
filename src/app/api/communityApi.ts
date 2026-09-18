import { getJson, postForm } from './http';

export interface ApiCommunityPost {
  id: number;
  memberId: number;
  category: 'TIP' | 'QUESTION' | 'INFO' | 'FREE';
  title: string;
  author: string;
  content: string;
  replies: number;
  views: number;
  viewCount: number;
  likeCount: number;
  status: 'ACTIVE' | 'DELETED' | 'HIDDEN';
  createdAt: string;
  updatedAt: string;
  comments: ApiCommunityComment[];
  reports: ApiCommunityReport[];
}

export interface ApiCommunityComment {
  id: number;
  postId: number;
  memberId: number;
  author: string;
  content: string;
  status: 'ACTIVE' | 'DELETED';
  createdAt: string;
  updatedAt: string;
}

export interface ApiCommunityReport {
  id: number;
  postId: number;
  reporterMemberId: number;
  reason: 'SPAM' | 'ABUSE' | 'FALSE_INFO' | 'ADVERTISEMENT' | 'ETC';
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
}

// 백엔드는 GET/POST + 폼 파라미터로 호출하고, 등록/삭제/신고 결과는 MsgDTO { result, msg } 로 응답한다
// 화면에서 등록된 게시글/댓글/신고 객체를 사용하므로, 등록 후 목록을 다시 조회해서 돌려준다
export const getCommunityPosts = () => getJson<ApiCommunityPost[]>('/api/community/getPostList');

const findPost = async (id: string | number) => {
  const post = (await getCommunityPosts()).find(item => String(item.id) === String(id));
  if (!post) throw new Error('게시글을 찾을 수 없습니다.');
  return post;
};

export async function createCommunityPost(value: Pick<ApiCommunityPost, 'category' | 'title' | 'content'>) {
  await postForm('/api/community/insertPostInfo', value);
  // 목록은 최신순(created_at DESC, id DESC)이므로 첫 번째가 방금 등록한 글
  const [latest] = await getCommunityPosts();
  if (!latest) throw new Error('등록된 게시글을 불러오지 못했습니다.');
  return latest;
}

// 상세보기 조회 : 백엔드에서 조회수를 증가시킨 뒤 게시글을 돌려준다
export const incrementCommunityPostViews = (id: string) =>
  getJson<ApiCommunityPost>('/api/community/getPostInfo', { postId: id });

export async function deleteCommunityPost(id: string) {
  await postForm('/api/community/deletePostInfo', { postId: id });
}

export async function createCommunityComment(postId: string, content: string) {
  await postForm('/api/community/insertCommentInfo', { postId, content });
  const post = await findPost(postId);
  const saved = post.comments[post.comments.length - 1]; // 댓글은 등록순이므로 마지막이 방금 단 댓글
  if (!saved) throw new Error('등록된 댓글을 불러오지 못했습니다.');
  return saved;
}

export async function deleteCommunityComment(_postId: string, commentId: string) {
  await postForm('/api/community/deleteCommentInfo', { commentId });
}

export async function reportCommunityPost(postId: string) {
  await postForm('/api/community/insertReportInfo', { postId });
  const post = await findPost(postId);
  const saved = post.reports[post.reports.length - 1]; // 로그인 사용자의 신고 내역 중 마지막
  if (!saved) throw new Error('신고 내역을 불러오지 못했습니다.');
  return saved;
}
