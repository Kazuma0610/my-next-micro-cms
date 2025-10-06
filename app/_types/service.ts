export interface Service {
  id: string;
  title: string;
  description: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
  };
  features?: string[];
  category?: string;
  link?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  contents: Service[];
  totalCount: number;
  offset: number;
  limit: number;
}
