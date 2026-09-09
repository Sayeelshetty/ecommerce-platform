const FALLBACK_IMAGE = "/assets/products/apple_earphone_image.png";

export function getProductImage(product) {
  const source = product?.image_url || product?.image;
  if (!source || source.includes("example.com")) return FALLBACK_IMAGE;
  if (source.startsWith("/") || source.startsWith("http")) return source;
  return `/assets/products/${source.split("/").pop()}`;
}

export function handleProductImageError(event) {
  if (event.currentTarget.src.endsWith(FALLBACK_IMAGE)) return;
  event.currentTarget.src = FALLBACK_IMAGE;
}
