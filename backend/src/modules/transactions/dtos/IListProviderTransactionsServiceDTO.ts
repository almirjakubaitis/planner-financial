export interface ICategoryDTO {
  id: string;
  title: string;
}

export interface IProviderDTO {
  provider: string;
}

export interface ITransactionDTO {
  provider_id: string;
  date: Date;
  copies: number;
  type: 'income' | 'outcome';
  value: number;
  category_id: string;
  category: ICategoryDTO;
  title: string;
  description?: string;
}
