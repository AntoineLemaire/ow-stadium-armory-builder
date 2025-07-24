export interface Build {
  id: string;
  season: number;
  heroId: number;
  buildId: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  submitted: boolean;
}
