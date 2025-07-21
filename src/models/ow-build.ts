export interface OWBuild {
  uid: string;
  title: string;
  description: string;
  heroId: number;
  buildId: string;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  createdBy: string;
  associatedVersion: string;
}
