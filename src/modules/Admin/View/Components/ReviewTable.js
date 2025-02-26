import React from "react";
import image from "../../../../assets/logoBlack.png";

const ReviewTable = () => {
  return (
    <div className="h-full overflow-x-auto">
      <table className="min-w-full border-collapse mt-6">
        <thead>
          <tr className="text-white border-b-4 border-violet-600">
            <th className="px-4 py-2 text-sm font-medium">CUSTOMER</th>
            <th className="px-4 py-2 text-sm font-medium">PRODUCT DETAILS</th>
            <th className="px-4 py-2 text-sm font-medium">DATE</th>
            <th className="px-4 py-2 text-sm font-medium">REVIEW</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              customerName: "Josephine Sunflower",
              title: "Title",
              productDetails: "Harajuku Korean asdasdasda",
              productID: "ID: 000000",
              starCount: "STAR COUNT",
              date: "10/10/2024",
              review:
                "Shopping made easy! Slick design, fast checkout, and everything just where it should be. This site makes spending money way too fun!",
            },
            {
              customerName: "Josephine Sunflower",
              title: "Title",
              productDetails: "Row 2, Col 2",
              date: "Row 2, Col 3",
              review: "Row 2, Col 4",
            },
            {
              customerName: "Josephine Sunflower",
              title: "Title",
              productDetails: "Row 3, Col 2",
              date: "Row 3, Col 3",
              review: "Row 3, Col 4",
            },
          ].map((row, index) => (
            <tr key={index} className="h-48 border-b-2 border-violet-600">
              <td className="px-4 py-2 text-sm text-white w-4/12">
                <div className="flex items-center">
                  <img
                    src={image}
                    className="w-20 h-20 object-cover rounded-2xl"
                    alt="logo"
                  />
                  <div className="ml-10">
                    <p className="font-bold text-lg">{row.customerName}</p>
                    <p>{row.title}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 text-center text-sm text-white w-2/12">
                <p>{row.productDetails}</p>
                <br />
                {row.productID && <p>{row.productID}</p>}
                {row.starCount && <p>{row.starCount}</p>}
              </td>
              <td className="px-4 py-2 text-center text-sm text-white w-2/12">
                <p>{row.date}</p>
              </td>
              <td className="px-4 py-2 text-sm text-white">
                <p>{row.review}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewTable;
