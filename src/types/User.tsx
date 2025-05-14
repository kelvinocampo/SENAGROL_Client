export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Comprador' | 'Vendedor';
  hasTransportForm: boolean;
  sellerRequest: boolean;
  isActive: boolean;
}
