import type { ProductLine, ProductStatus, TestStatus } from "@/lib/catalog";

export type ProductFormValues = {
  id?: string;
  variantId?: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  line: ProductLine;
  productType: string | null;
  status: ProductStatus;
  testStatus: TestStatus;
  tags: string[];
  badges: string[];
  specs: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  price: number | null;
  compareAtPrice: number | null;
  sku: string | null;
  stock: number | null;
  costPrice: number | null;
  shippingEstimate: number | null;
  dropiProductId: string | null;
  dropiVariationId: string | null;
  supplierName: string | null;
};

export const EMPTY_PRODUCT: ProductFormValues = {
  title: "",
  slug: "",
  subtitle: null,
  description: null,
  line: "hogar",
  productType: null,
  status: "borrador",
  testStatus: "sin_testear",
  tags: [],
  badges: [],
  specs: [],
  seoTitle: null,
  seoDescription: null,
  price: null,
  compareAtPrice: null,
  sku: null,
  stock: null,
  costPrice: null,
  shippingEstimate: null,
  dropiProductId: null,
  dropiVariationId: null,
  supplierName: null,
};
