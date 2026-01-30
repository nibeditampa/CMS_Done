// Only responsible for fetching joined profile data

const API_URL = window.ENV.API_BASE_URL + "/profiles"; // /api/profiles

export async function fetchAllProfiles() {
  const res = await fetch(API_URL);
  return res.ok ? await res.json() : [];
}
