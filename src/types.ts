export interface Project {
  id: string;
  name: string;
  type: string;
  date: string;
  amount: number;
  notes: string;
  paid: boolean;
  createdAt: string;
}

export type FilterType = 'all' | 'unpaid' | 'paid';
