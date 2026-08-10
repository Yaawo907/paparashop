export type CmsModel = { name: string; url?: string };

export type CmsBrand = {
  id: string;
  category_id: string;
  name: string;
  image_url: string | null;
  url: string | null;
  highlights: string[];
  models: CmsModel[];
  position: number;
  is_active: boolean;
};

export type CmsCategory = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  image_url: string | null;
  position: number;
  is_active: boolean;
  brands: CmsBrand[];
};

export type CmsProduct = {
  id: string;
  name: string;
  subtitle: string;
  note: string;
  image_url: string | null;
  url: string | null;
  price: number | null;
  currency: string | null;
  stock: number | null;
  sku: string | null;
  group_key: string;
  position: number;
  is_active: boolean;
};

export type CmsPromotion = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  url: string | null;
  position: number;
  is_active: boolean;
};

export type CmsTestimonial = {
  id: string;
  name: string;
  location: string;
  role: string;
  rating: number;
  content: string;
  is_approved: boolean;
  created_at: string;
};

export type CmsContent = Record<string, Record<string, string>>;
