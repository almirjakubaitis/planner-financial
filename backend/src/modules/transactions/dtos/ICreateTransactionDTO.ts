export default interface ICreateTransactionDTO {
  provider_id: string;
  date: Date;
  copies: number;
  type: 'income' | 'outcome';
  value: number;
  category_id: string;
  title: string;
  description?: string;
}
