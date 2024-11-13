import { Feedback } from "./PerformancedFeedback";

export interface Image {
  imageId: number;
  equipmentId: number;
  image: string;
  contentType: string;
  fileName: string;
}

export interface Equipments {
  id: number;
  name: string;
  type: string;
  brand: string;
  model: string;
  yearOfManufacture: string;
  specification: string;
  description: string;
  status: string;
  location: string;
  rentalPrice: number;
  images: Image;
  unit: string;
  performanceFeedbacks: Feedback[];
}
