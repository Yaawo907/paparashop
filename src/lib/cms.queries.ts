import { queryOptions } from "@tanstack/react-query";
import {
  getCategories,
  getContent,
  getHeroSlides,
  getProducts,
  getPromotions,
  getTestimonials,
  getTrustedClients,
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

export const heroSlidesQuery = queryOptions({
  queryKey: ["cms", "hero_slides"],
  queryFn: () => getHeroSlides(),
});

export const trustedClientsQuery = queryOptions({
  queryKey: ["cms", "trusted_clients"],
  queryFn: () => getTrustedClients(),
});
