import { createServerFn } from "@tanstack/react-start";
import {
  fetchCategories,
  fetchContent,
  fetchProducts,
  fetchPromotions,
  fetchTestimonials,
} from "@/lib/cms.server";

export const getCategories = createServerFn({ method: "GET" }).handler(async () =>
  fetchCategories(),
);

export const getProducts = createServerFn({ method: "GET" }).handler(async () => fetchProducts());

export const getPromotions = createServerFn({ method: "GET" }).handler(async () =>
  fetchPromotions(),
);

export const getTestimonials = createServerFn({ method: "GET" }).handler(async () =>
  fetchTestimonials(),
);

export const getContent = createServerFn({ method: "GET" }).handler(async () => fetchContent());
