import { CATEGORIES, CATEGORIES_REMOVE, CATEGORY } from "./actionList";

export const addCategory = (categoryName, categoryValue) => ({
  type: CATEGORIES,
  payload: {
    name: categoryName,
    value: categoryValue,
  },
});

export const addCategoryValue = (categoryName, categoryValue) => ({
  type: CATEGORY,
  payload: {
    name: categoryName,
    value: categoryValue,
  },
});

export const removeCategoryValue = (categoryName, categoryValue) => ({
  type: CATEGORIES_REMOVE,
  payload: {
    name: categoryName,
    value: categoryValue,
  },
});
