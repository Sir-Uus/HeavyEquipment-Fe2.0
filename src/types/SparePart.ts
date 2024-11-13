import { Equipments } from "./EquipmentTypes";
import { SparePartFeedback } from "./SparePartFeedback";

export interface SparePart {
  id: number;
  equipmentId: number;
  partName: string;
  partNumber: string;
  manufacturer: string;
  availabilityStatus: string;
  price: number;
  stock: number;
  sparePartImage: Image;
  equipment: Equipments;
  sparePartFeedbacks: SparePartFeedback[];
}

export interface Image {
  imageId: number;
  sparePartId: number;
  image: string;
  contentType: string;
  fileName: string;
}
