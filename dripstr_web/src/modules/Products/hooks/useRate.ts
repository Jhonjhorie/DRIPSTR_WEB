export const averageRate = (reviews) => {
    if (reviews.length === 0) return 0;
  
    const totalRate = reviews.reduce((sum, review) => sum + review.rate, 0);
    const averageRate = totalRate / reviews.length;
  
    return averageRate.toFixed(1); 
  };
  
 