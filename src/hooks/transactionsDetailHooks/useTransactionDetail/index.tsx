import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";

const fetchTransactionDetail = async (transactionId: string) => {
  const response = await axios.get(`/Transaction/${transactionId}`);
  const transaction = response.data;  

  const userIds = new Set<string>();
  const equipmentIds = new Set<number>();
  const sparePartsIds = new Set<number>();

  if (transaction.userId) {
    userIds.add(transaction.userId);
  }

  const transactionDetails = transaction.transactionDetails || []; 

    transactionDetails.forEach((detail: any) => {
        if (detail.equipmentId) {
            equipmentIds.add(detail.equipmentId);
        }
        if (detail.sparePartId) {
            sparePartsIds.add(detail.sparePartId);
        }
    });

  const equipmentPromises = Array.from(equipmentIds).map((id) => axios.get(`/Equipment/${id}`));
  const equipmentResponses = await Promise.all(equipmentPromises);
  const equipmentMap = new Map<number, string>();
  equipmentResponses.forEach((response) => {
    const equipment = response.data;
    equipmentMap.set(equipment.id, equipment.name);
  });

  const userPromises = Array.from(userIds).map((id) => axios.get(`/Account/${id}`));
  const userResponses = await Promise.all(userPromises);
  const userMap = new Map<string, string>();
  userResponses.forEach((response) => {
    const user = response.data;
    userMap.set(user.id, user.displayName);
  });

  const sparePartPromises = Array.from(sparePartsIds).map((id) => axios.get(`/SparePart/${id}`));
  const sparePartResponses = await Promise.all(sparePartPromises);
  const sparePartMap = new Map<number, string>();
  sparePartResponses.forEach((response) => {
    const sparePart = response.data;
    sparePartMap.set(sparePart.id, sparePart.partName);
  });

  return { transaction, userMap, equipmentMap, sparePartMap };
};

export const useTransactionDetail = (transactionId: string) => {
  return useQuery({
    queryKey: ["transactionDetail", transactionId],
    queryFn: () => fetchTransactionDetail(transactionId),
    enabled: !!transactionId,
  });
};
