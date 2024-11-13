import React, { useEffect, useState } from "react";
import { Feedback } from "../../../types/PerformancedFeedback";
import { Tooltip } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { formatDate } from "../../../utils";
import { useFeedbacks } from "../../../hooks/PerformancedFeedbackHooks/usePerformanceFeedback";

interface FeedbackTableProps {
  feedbacks: Feedback[];
  equipmentData: Map<number, string>;
  userData: Map<string, string>;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({
  feedbacks,
  equipmentData,
  userData,
  onEdit,
  onDelete,
}) => {
  const { currentPage } = useFeedbacks();
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipmentName, setEquipmentName] = useState(searchParams.get("equipmentName") || "");
  const [userName, setUserName] = useState(searchParams.get("userName") || "");
  const [feedbackDate, setFeedbackDate] = useState(searchParams.get("feedbackDate") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");
  const [comment, setComment] = useState(searchParams.get("comment") || "");
  const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      setSearchParams({
        page: currentPage.toString(),
        equipmentName,
        userName,
        feedbackDate,
        rating,
        comment,
      });
    }, 2000);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [equipmentName, userName, feedbackDate, rating, comment]);

  const clearSearch = () => {
    setEquipmentName("");
    setUserName("");
    setFeedbackDate("");
    setRating("");
    setComment("");
    setSearchParams({
      page: currentPage.toString(),
      equipmentName: "",
      userName: "",
      feedbackDate: "",
      rating: "",
      comment: "",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-yellow-300">
          <tr className="text-center">
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Equipment
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Feedback Date
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Comment
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Action
            </th>
          </tr>
          <tr>
            <td className="px-6 py-3">
              <input
                type="text"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                placeholder="Equipment..."
                className="px-4 py-2 border w-full rounded-md text-[12px]"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="User..."
                className="px-4 py-2 border w-full rounded-md text-[12px]"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="date"
                value={feedbackDate}
                onChange={(e) => setFeedbackDate(e.target.value)}
                placeholder="Feedback Date..."
                className="px-4 py-2 border w-full rounded-md text-[12px]"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="text"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Rating..."
                className="px-4 py-2 border w-full rounded-md text-[12px]"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comment..."
                className="px-4 py-2 border w-full rounded-md text-[12px]"
              />
            </td>
            <td className="flex justify-center mt-3">
              <button
                onClick={clearSearch}
                className="px-4 py-2 w-40 bg-red-500 text-white text-[12px] rounded-md hover:bg-red-600 transition-colors"
              >
                Clear
              </button>
            </td>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {equipmentData.get(feedback.equipmentId) || "Loading..."}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {userData.get(feedback.userId) || "Loading..."}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(feedback.feedbackDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {feedback.rating}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.comment}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2 justify-center">
                    <Tooltip title="Edit" arrow>
                      <button
                        className="p-2 py-1 bg-yellow-500 text-white rounded-md"
                        onClick={() => onEdit(feedback.id)}
                      >
                        <span className="material-icons">edit</span>
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <button
                        className="p-2 py-1 bg-red-500 text-white rounded-md"
                        onClick={() => onDelete(feedback.id)}
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No feedbacks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
