export const formatDate = (date) => {
    // Get the month, day, and year
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
  
    const formattedDate = `${day}-${month}-${year}`;
  
    return formattedDate;
};
  
export function dateFormatter(dateString) {
    const inputDate = new Date(dateString);
  
    if (isNaN(inputDate)) {
      return "Invalid Date";
    }
  
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");
  
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}


export const PRIORITYBGSTYLES = {
    high: "bg-red-200",
    medium: "bg-yellow-200",
    low: "bg-blue-200"
}

export const PRIOTITYSTYELS = {
    high: "text-red-600",
    medium: "text-yellow-600",
    // low: "text-blue-600",
};

export const STATUSSTYLES = {
    inqueue: "bg-red-600",
    active: "bg-blue-600",
    completed: "bg-green-600",
}

export const BGS = [
    "bg-blue-600",
    "bg-yellow-600",
    "bg-red-600",
    "bg-green-600",
];

export const OUTLINE = [
    "outline-blue-600",
    "outline-yellow-600",
    "outline-red-600",
    "outline-green-600"
]