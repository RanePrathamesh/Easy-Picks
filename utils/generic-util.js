
export const tosterProps = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
}



export function parseQueryString(queryString) {
  const query = {};
  for (const key in queryString) {
    if (queryString.hasOwnProperty(key)) {
      const value = queryString[key];
      const match = value.match(/(gte\d+(\.\d+)?|lte\d+(\.\d+)?|gt\d+(\.\d+)?|lt\d+(\.\d+)?)/g);
      if (match) {
        query[key] = {};
        match.forEach((condition) => {
          const operator = condition.match(/(gte|lte|gt|lt)/)[0];
          const num = parseFloat(condition.replace(operator, ''));
          query[key][`$${operator}`] = num;
        });
      }else{
        query[key]=value
      }
    }
  }
  return query;
}