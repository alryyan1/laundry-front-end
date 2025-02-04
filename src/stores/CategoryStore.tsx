import axiosClient from "@/helpers/axios-client";
import { Category } from "@/Types/types";
import { create } from "zustand";

export interface CategoryStoreProps {
    categories: Category[];
    selectedCategory: Category | null;
    fetchCategories: () => void;
    add: (name:string,img:string) => void;
    delete: () => void;
  
}
export  const useCategoryStore = create<CategoryStoreProps>((set) => {
    return {
      categories: [],
      selectedCategory: null,
      fetchCategories: async () => {
        axiosClient.get<Category[]>(`categories`).then(({ data }) => {
          set({
            categories: data,
          });
        });
      },
      add: (name) => {
        axiosClient
        .post("categories", {
          name: name,
        })
        .then(({ data }) => {
          set((state) => ({
            categories: [...state.categories, data],
          }));
        });
      },
      delete: () => {},
    };
  });


