export interface RentalRequest {
  id: number;
  userId: string;
  equipmentId: number;
  invoice: string;
  starDate: string;
  endDate: string;
  status: string;
}
