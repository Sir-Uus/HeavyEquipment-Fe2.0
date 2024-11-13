import { useState, useEffect } from "react";
import axios from "../../../api/axios";

const fetchSparePartImage = async (sparePartId: number) => {
  const response = await axios.get(`/SparePart/image/${sparePartId}`);
  return response.data[0]?.image || null;
};

export const useSparePartImages = (cartItems: any[]) => {
  const [sparePartImages, setSparePartImages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchImages = async () => {
      const images: { [key: number]: string } = {};
      await Promise.all(
        cartItems.map(async (item) => {
          const imageUrl = await fetchSparePartImage(item.id);
          images[item.id] = imageUrl;
        })
      );
      setSparePartImages(images);
    };

    if (cartItems.length > 0) {
      fetchImages();
    }
  }, [cartItems]);

  return sparePartImages;
};
