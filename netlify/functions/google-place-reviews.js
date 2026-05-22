// Netlify Function — Google Places API proxy for PGC reviews
// Env vars required: GOOGLE_MAPS_API_KEY, GOOGLE_PLACE_ID (optional, defaults below)

const DEFAULT_PLACE_ID    = 'ChIJ6wq3LKzdYIgRQVXqE8ZoKxY';
const DEFAULT_MAPS_URI    = 'https://www.google.com/maps/place/Prominent+General+Contractors+LLC/@29.6890811,-95.6284628,17z/data=!3m1!4b1!4m6!3m5!1s0x8640ddac2c7b0aeb:0x162b68c613ea5541!8m2!3d29.6890811!4d-95.6284628!16s%2Fg%2F11wx8dqcbc';
const CORS_ORIGIN         = process.env.SITE_URL || 'https://prominentgcllc.com';

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      ...extraHeaders
    },
    body: JSON.stringify(body)
  };
}

function normalizeReview(review) {
  return {
    author: review?.authorAttribution?.displayName || '',
    rating: typeof review?.rating === 'number' ? review.rating : null,
    text: review?.text?.text || review?.originalText?.text || '',
    relativePublishTimeDescription: review?.relativePublishTimeDescription || '',
    googleMapsUri: review?.googleMapsUri || '',
    publishTime: review?.publishTime || ''
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': CORS_ORIGIN, 'Access-Control-Allow-Methods': 'GET', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  const apiKey            = process.env.GOOGLE_MAPS_API_KEY;
  const configuredPlaceId = process.env.GOOGLE_PLACE_ID || DEFAULT_PLACE_ID;
  const requestedPlaceId  = event.queryStringParameters?.placeId || configuredPlaceId;

  if (requestedPlaceId !== configuredPlaceId) {
    return json(400, { error: 'Invalid placeId' });
  }

  if (!apiKey) {
    return json(500, { error: 'Missing GOOGLE_MAPS_API_KEY', placeId: configuredPlaceId, googleMapsUri: DEFAULT_MAPS_URI });
  }

  const fields = 'id,displayName,rating,userRatingCount,googleMapsUri,reviews';
  const url    = `https://places.googleapis.com/v1/places/${encodeURIComponent(configuredPlaceId)}`;

  try {
    const googleRes = await fetch(url, {
      method: 'GET',
      headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': fields }
    });

    const data = await googleRes.json();

    if (!googleRes.ok) {
      return json(googleRes.status, { error: 'Google Places API error', details: data?.error?.message || data });
    }

    return json(200, {
      placeId:         configuredPlaceId,
      name:            data?.displayName?.text || 'Prominent General Contractors LLC',
      rating:          typeof data?.rating === 'number' ? data.rating : null,
      userRatingCount: typeof data?.userRatingCount === 'number' ? data.userRatingCount : null,
      googleMapsUri:   data?.googleMapsUri || DEFAULT_MAPS_URI,
      reviews:         Array.isArray(data?.reviews) ? data.reviews.map(normalizeReview).filter(r => r.text) : []
    }, { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' });

  } catch (err) {
    return json(502, { error: 'Unable to reach Google Places API', details: err.message });
  }
};
