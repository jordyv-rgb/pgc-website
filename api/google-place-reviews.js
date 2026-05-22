const DEFAULT_PLACE_ID = 'ChIJ6wq3LKzdYIgRQVXqE8ZoKxY';
const DEFAULT_GOOGLE_MAPS_URI = 'https://www.google.com/maps/place/Prominent+General+Contractors+LLC/@29.6890811,-95.6284628,17z/data=!3m1!4b1!4m6!3m5!1s0x8640ddac2c7b0aeb:0x162b68c613ea5541!8m2!3d29.6890811!4d-95.6284628!16s%2Fg%2F11wx8dqcbc';

function sendJson(res, statusCode, body, cacheControl = 'no-store') {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', cacheControl);
  res.end(JSON.stringify(body));
}

function normalizeReview(review) {
  const text = review?.text?.text || review?.originalText?.text || '';

  return {
    author: review?.authorAttribution?.displayName || '',
    rating: typeof review?.rating === 'number' ? review.rating : null,
    text,
    relativePublishTimeDescription: review?.relativePublishTimeDescription || '',
    googleMapsUri: review?.googleMapsUri || '',
    publishTime: review?.publishTime || ''
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const configuredPlaceId = process.env.GOOGLE_PLACE_ID || DEFAULT_PLACE_ID;
  const requestUrl = new URL(req.url || '/', 'http://localhost');
  const requestedPlaceId = req.query?.placeId || requestUrl.searchParams.get('placeId') || configuredPlaceId;

  if (requestedPlaceId !== configuredPlaceId) {
    return sendJson(res, 400, { error: 'Invalid placeId' });
  }

  if (!apiKey) {
    return sendJson(res, 500, {
      error: 'Missing GOOGLE_MAPS_API_KEY environment variable',
      placeId: configuredPlaceId,
      googleMapsUri: DEFAULT_GOOGLE_MAPS_URI
    });
  }

  const fields = [
    'id',
    'displayName',
    'rating',
    'userRatingCount',
    'googleMapsUri',
    'reviews'
  ].join(',');

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(configuredPlaceId)}`;

  try {
    const googleResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fields
      }
    });

    const data = await googleResponse.json();

    if (!googleResponse.ok) {
      return sendJson(res, googleResponse.status, {
        error: 'Google Places API request failed',
        details: data?.error?.message || data
      });
    }

    return sendJson(res, 200, {
      placeId: configuredPlaceId,
      name: data?.displayName?.text || 'Prominent General Contractors LLC',
      rating: typeof data?.rating === 'number' ? data.rating : null,
      userRatingCount: typeof data?.userRatingCount === 'number' ? data.userRatingCount : null,
      googleMapsUri: data?.googleMapsUri || DEFAULT_GOOGLE_MAPS_URI,
      reviews: Array.isArray(data?.reviews) ? data.reviews.map(normalizeReview).filter((review) => review.text) : []
    }, 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
  } catch (error) {
    return sendJson(res, 502, {
      error: 'Unable to reach Google Places API',
      details: error.message
    });
  }
};
