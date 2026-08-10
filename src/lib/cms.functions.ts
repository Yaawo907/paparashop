import { createServerFn } from "@tanstack/react-start";
import {
  fetchCategories,
  fetchContent,
  fetchHeroSlides,
  fetchProducts,
  fetchPromotions,
  fetchTestimonials,
  fetchTrustedClients,
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

export const getHeroSlides = createServerFn({ method: "GET" }).handler(async () =>
  fetchHeroSlides(),
);

export const getTrustedClients = createServerFn({ method: "GET" }).handler(async () =>
  fetchTrustedClients(),
);
