import Category from "@/models/category";
import Product from "@/models/product";
import { connectToDB } from "@/utils/db";

// DB Methods

// GET
connectToDB();

export const getAllCategories = async (limit) => {
  try {
    if (limit) {
      const categories = await Category.find({}).limit(limit);
      return {
        allCategories: JSON.parse(JSON.stringify(categories)),
      };
    }
    const categories = await Category.find({});
    return {
      allCategories: JSON.parse(JSON.stringify(categories)),
    };
  } catch (error) {
    return {
      allCategories: [],
      error,
    };
  }
};



//--------------------------------------------------------------------------------------------
export const getSubCategories = async (categoryName) => {
  try {
    if (categoryName) {
      let categoryDocs = await Category.find({ categoryName: categoryName });

      if (categoryDocs.length > 0) {
        const categories = await Category.find({ parentCategory: categoryDocs[0]._id });
        console.log('Categories from server - ', categories);

        return {
          subCategories: JSON.parse(JSON.stringify(categories)),
        };
      }

      return {
        message: 'No Sub-Categories Found',
      };
    }

    return {
      message: 'No Sub-Categories Found',
    };
  } catch (error) {
    return {
      subCategories: [],
      error,
    };
  }
};

//---------------------------------------------------------------------------------------------

export const getCategoryDetail = async (slug) => {
  try {
    if(slug) {
      const categoryDoc = await Category.findOne({slug }); 
      if (!categoryDoc) {
        return {
          message: 'No Category Found.',
        };
      }
      return categoryDoc
    }
  } catch (error) {
    console.log(error,'in general.js');
  }
}

export const getProducts = async (slug, filter) => {
  try {
    if (slug) {
      // const decodedCategoryName = decodeURIComponent(categoryName);
      const categoryDoc = await Category.findOne({slug });
      if (!categoryDoc) {
        return {
          allProducts: [],
        };
      }
      
      let isFiltered = false;

       if (filter === "priceToPay") {
        const products = await Product.find({ category: categoryDoc._id })
          .sort({ priceToPay: 1 }).limit(10);
        return {
          allProducts: JSON.parse(JSON.stringify(products)),
          
        };
      } 
       if (filter === "discount") {
        const products = await Product.find({ category: categoryDoc._id })
          .sort({ savingsPercentage: -1 }).limit(10);
          isFiltered = true
        return {
          allProducts: JSON.parse(JSON.stringify(products)),
          
        };
      }
      
      if (filter === "toprelevant") {
        const products = await Product.find({
          category: categoryDoc._id,
        }).sort({personalizedRating:-1}).limit(10);
        return {
          allProducts: JSON.parse(JSON.stringify(products)),
          
        };
      }
    } else {
      const products = await Product.find({}).limit(10);
      return {
        allProducts: JSON.parse(JSON.stringify(products)),
      };
    }
  } catch (error) {
    return {
      allProducts: [],
    };
  }
};

// -------------------------------------------------------------------------------------

export const getSearchResult = async (searchValue) => {
  try {
    if (searchValue) {
      const categoryDocs = await Category.find({
        categoryName: { $regex: searchValue, $options: "i" },
      });

      const productDocs = await Product.find({
        title: { $regex: searchValue, $options: "i" },
      });

      return {
        categories: JSON.parse(JSON.stringify(categoryDocs)),
        products: JSON.parse(JSON.stringify(productDocs)),
      };
    } else {
      return {
        categories: [],
        products: [],
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      categories: [],
      products: [],
    };
  }
};

// POST

export const addNewCategory = async (
  categoryName,
  categoryType,
  subCategoryOf
) => {
  try {
    if (!categoryName || !categoryType) {
      throw new Error("Category name and type are required.");
    }

    const newCategory = new Category({
      categoryName,
      categoryType,
      categoryLink: `https://www.amazon.in/s?k=${categoryName}`,
    });

    if (subCategoryOf) {
      const parentCategory = await Category.findOne({
        categoryName: subCategoryOf,
      });
      if (parentCategory) {
        newCategory.parentCategory = parentCategory._id;
      }
    }
    const savedCategory = await newCategory.save();

    return savedCategory;
  } catch (error) {
    throw new Error(`Error adding category: ${error.message}`);
  }
};

export const getCategoryNameById = async (id) => {
  try {
    if(id) {
      const name = await Category.findById(id).select('categoryName');
      return {
        category: JSON.parse(JSON.stringify(name)),
      };
    }
  } catch (error) {
    return {
      message: 'category not found',
      error,
    };
  }
}
