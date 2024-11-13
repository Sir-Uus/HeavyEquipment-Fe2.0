import { Feedback } from "../types/PerformancedFeedback";
import { SparePartFeedback } from "../types/SparePartFeedback";

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setValue: any) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString().split(",")[1];
      const img = {
        contenType: file.type,
        fileName: file.name,
        image: `data:${file.type};base64,${base64String}`,
      };
      setValue("images", img);
    };
    reader.readAsDataURL(file);
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDate2 = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getAverageRating = (feedbacks: Feedback[] = []) => {
  if (!feedbacks || feedbacks.length === 0) return 0;
  const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
  return (totalRating / feedbacks.length).toFixed(1);
};

export const getAverageRatingSparepart = (feedbacks: SparePartFeedback[] = []) => {
  if (!feedbacks || feedbacks.length === 0) return 0;
  const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
  return (totalRating / feedbacks.length).toFixed(1);
};

export const generateInvoice = () => {
  const prefix = "RQHV";
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return prefix + randomPart;
};

export const calculateDays = (starDate: string, endDate: string) => {
  const start = new Date(starDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};
