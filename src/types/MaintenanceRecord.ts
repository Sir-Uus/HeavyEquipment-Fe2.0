export interface MaintenaceRecord {
  id: number;
  equipmentId: number;
  maintenanceDate: string;
  servicedPerformed: string;
  servicedProvider: string;
  cost: number;
  nextMaintenanceDue: string;
}
