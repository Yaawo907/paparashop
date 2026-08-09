import { queryOptions } from "@tanstack/react-query";
import {
  getCategories,
  getContent,
  getProducts,
  getPromotions,
  getTestimonials,
} from "@/lib/cms.functions";

export const categoriesQuery = queryOptions({
  queryKey: ["cms", "categories"],
  queryFn: () => getCategories(),
});

export const productsQuery = queryOptions({
  queryKey: ["cms", "products"],
  queryFn: () => getProducts(),
});

export const promotionsQuery = queryOptions({
  queryKey: ["cms", "promotions"],
  queryFn: () => getPromotions(),
});

export const testimonialsQuery = queryOptions({
  queryKey: ["cms", "testimonials"],
  queryFn: () => getTestimonials(),
});

export const contentQuery = queryOptions({
  queryKey: ["cms", "content"],
  queryFn: () => getContent(),
});
