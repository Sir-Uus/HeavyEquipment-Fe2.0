export interface Payment {
  id: number;
  rentalRequestId: number;
  transactionId: number;  
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: string;
}
