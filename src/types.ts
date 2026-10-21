export type StockStatus =
  | 'in-stock'
  | 'low-stock'
  | 'out-of-stock';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: StockStatus;
  category?: string;
  readonly sku: string;
}


export interface ApiUser {
  id: number;
  name: string;
  email: string;
}


export type UserDirectoryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; users: ApiUser[] }
  | { status: 'error'; message: string };

export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

