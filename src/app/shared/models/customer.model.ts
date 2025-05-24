export interface Customer {
  customer_id: number;
  name: string;
  email: string;
  password?: string;
  phone: string;
  address?: string;
  city?: string;
}