import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type {
  CmsCategory,
  CmsContent,
  CmsProduct,
  CmsPromotion,
  CmsTestimonial,
} from "@/lib/cms-types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export async function fetchCategories(): Promise<CmsCategory[]> {
  const supabase = publicClient();
  const [cats, brands] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("position"),
    supabase.from("brands").select("*").eq("is_active", true).order("position"),
  ]);
  if (cats.error) throw cats.error;
  if (brands.error) throw brands.error;
  return (cats.data ?? []).map((c) => ({
    ...c,
    brands: (brands.data ?? [])
      .filter((b) => b.category_id === c.id)
      .map((b) => ({
        ...b,
        highlights: b.highlights ?? [],
        models: Array.isArray(b.models) ? (b.models as { name: string; url?: string }[]) : [],
      })),
  })) as CmsCategory[];
}

export async function fetchProducts(): Promise<CmsProduct[]> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("position");
  if (error) throw error;
  return (data ?? []) as CmsProduct[];
}

export async function fetchPromotions(): Promise<CmsPromotion[]> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .order("position");
  if (error) throw error;
  return (data ?? []) as CmsPromotion[];
}

export async function fetchTestimonials(): Promise<CmsTestimonial[]> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CmsTestimonial[];
}

export async function fetchContent(): Promise<CmsContent> {
  const supabase = publicClient();
  const { data, error } = await supabase.from("site_content").select("key,value");
  if (error) throw error;
  const out: CmsContent = {};
  for (const row of data ?? []) {
    out[row.key] = (row.value ?? {}) as Record<string, string>;
  }
  return out;
}
