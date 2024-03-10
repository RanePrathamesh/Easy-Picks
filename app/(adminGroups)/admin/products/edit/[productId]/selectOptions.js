import React from 'react';
import Select from 'react-select';

function selectCategory({product, category,setProduct}) {
  const categoryOptions = category.map((category) => ({
    value: category.id,
    label: category.name,
  }));
  const handleChange = (selectedOption) => {
    setProduct({
      ...product,
      category: {
        _id: selectedOption.value,
      },
    });
  };

  return (
    <Select
      id="category"
      className="bg-gray-50  font-medium border-gray-300 text-black-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      options={categoryOptions}
      value={categoryOptions.find((option) => option.value === product?.category?._id)}
      onChange={handleChange}
      isSearchable
    />
  );
}

export default selectCategory;
