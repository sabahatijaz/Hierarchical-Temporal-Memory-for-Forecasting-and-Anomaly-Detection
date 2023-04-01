import { CATEGORIES_REMOVE } from "store/action/actionList";
import { CATEGORIES } from "store/action/actionList";

const initialSate = {
  categories: [],
};

export const categoryReducer = (state = initialSate, { type, payload }) => {
  switch (type) {
    case CATEGORIES:
      let category = payload;
      let itemExists = state.categories.find((c) => c.name === category.name);
      if (itemExists) {
        return {
          ...state,
          categories: state.categories.map((c) =>
            c.name === category.name ? category : c
          ),
        };
      } else {
        return { ...state, categories: [...state.categories, category] };
      }

    case CATEGORIES_REMOVE:
      return {
        ...state,
        categories: state.categories.filter((c) => c.name !== payload.name),
      };

    default:
      return state;
  }
};
