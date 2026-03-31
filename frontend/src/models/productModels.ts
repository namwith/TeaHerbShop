// src/models/productModels.ts
export interface Review {
  ReviewID: number;
  Rating: number;
  Comment: string;
  CreatedAt: string;
  Username: string;
  FullName: string | null;
}

export interface Product {
  category: string;
  ProductID: number;
  Name: string;
  Type: string;
  Price: string;
  ImageURL: string;
  Description: string;
  Stock: number;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  Status?: string;
}
