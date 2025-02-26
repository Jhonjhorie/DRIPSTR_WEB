export const MallItems = [
    {
        label: "All",
        color: "bg-secondary-color",
        activeColor: "text-secondary-color",
        filter:"",
    },
    {
      label: "Drip Mall",
      color: "bg-primary-color",
      activeColor: "text-secondary-color",
        filter:"item.str === true",
    },
    {
      label: "Just for You",
      color: "bg-yellow-700",
      activeColor: "text-secondary-color",
         filter:"user.rectag.some(tag => item.rectag.includes(tag))",
    },
    {
      label: "On Sales/ Vouchers",
      color: "bg-blue-700",
      activeColor: "text-brown-color",
         filter:"item.vouchers !== null || item.discount !== 0",
    },
    {
      label: "Followed Store",
      color: "bg-blue-700",
      activeColor: "text-secondary-color",
         filter:"user.followedStore === true",
    },
    {
      label: "Popular/ Trend",
      color: "bg-red-700",
      activeColor: "text-secondary-color",
         filter:"item.sold > 100",
    },
    {
      label: "Most Reviews",
      color: "bg-green-700",
      activeColor: "text-secondary-color",
         filter:"item.reviews.length > 10",
    },

  ];
