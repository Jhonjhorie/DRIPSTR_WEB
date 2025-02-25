import { useMemo } from "react";

const useFormattedDeadline = (deadline) => {
  return useMemo(() => {
    if (!deadline) return { formattedDate: "No deadline", isNear: false };

    const deadlineDate = new Date(deadline);
    const today = new Date();
    const differenceInDays = Math.ceil(
      (deadlineDate - today) / (1000 * 60 * 60 * 24)
    );

    // Format date: "March, 10 2020"
    const formattedDate = deadlineDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).replace(/(\d+),/, "$1"); 

    return {
      formattedDate,
      isNear: differenceInDays <= 3, 
    };
  }, [deadline]);
};

export default useFormattedDeadline;
