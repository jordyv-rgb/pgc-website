# Google Reviews Proxy Setup

This website includes a same-origin Google Reviews proxy for Prominent General Contractors LLC.

## Files

- `Flooring_Division/index.html` calls:
  - `/api/google-place-reviews?placeId=ChIJ6wq3LKzdYIgRQVXqE8ZoKxY`
- `api/google-place-reviews.js` calls Google Places API server-side.

## Verified Google listing

- Business: Prominent General Contractors LLC
- Website: `prominentgcllc.com`
- Phone: `(713) 823-6513`
- Place ID: `ChIJ6wq3LKzdYIgRQVXqE8ZoKxY`
- Google profile URL: `https://www.google.com/maps/place/Prominent+General+Contractors+LLC/@29.6890811,-95.6284628,17z/data=!3m1!4b1!4m6!3m5!1s0x8640ddac2c7b0aeb:0x162b68c613ea5541!8m2!3d29.6890811!4d-95.6284628!16s%2Fg%2F11wx8dqcbc`

## Environment variables

Set these on the hosting platform that runs the serverless function:

```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_PLACE_ID=ChIJ6wq3LKzdYIgRQVXqE8ZoKxY
```

## Google Cloud setup

1. Create or open a Google Cloud project.
2. Enable the Places API.
3. Create an API key.
4. Restrict the key:
   - API restrictions: Places API only.
   - Application restrictions: use the hosting platform’s recommended server-side restriction if available.
5. Add the key as the `GOOGLE_MAPS_API_KEY` environment variable in your host.

## Security notes

Do not paste the real API key into `index.html`. The frontend calls the same-origin `/api/google-place-reviews` endpoint, and the serverless function reads the key from the server environment.

The endpoint only allows the verified PGC Place ID, so it cannot be used as an open Google Places proxy for other businesses.

## Fallback behavior

If the API key or serverless route is unavailable, the homepage keeps showing the manually verified Google Maps fallback:

- 5.0 rating
- 12 Google reviews
- Button linking to the real Google profile

It does not invent review names, text, or ratings.
