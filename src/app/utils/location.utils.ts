export function formatLocation(
  street: string,
  city: string,
  country: string,
): string {
  return `${street ? street + ', ' : ''}${city}, ${country}`;
}

export function getGoogleMapsUrl(
  street: string,
  city: string,
  country: string,
): string {
  let address = `${street ? street + ', ' : ''}${city}, ${country}`;
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

export function getGoogleMapsEmbedUrl(
  street: string,
  city: string,
  country: string,
): string {
  // Format the address using the provided parameters for embedding.
  let address = `${street ? street + ', ' : ''}${city}, ${country}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}
