export interface RentalHistory {
  id: number;
  equipmentId: number;
  renterId: string;
  invoice: string;
  rentalStartDate: string;
  rentalEndDate: string;
  rentalCost: number;
  location: string;
}
