# API Documentation

## Overview

The Tesla Supercharger Finder API provides endpoints to retrieve Tesla Supercharger locations and nearby facilities. All endpoints are RESTful and return JSON responses.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Currently, all API endpoints are public and do not require authentication.

## Rate Limiting

- Default: 60 requests per minute per IP
- Configurable via `API_RATE_LIMIT` environment variable

## Endpoints

### 1. Health Check

Check the health status of the API.

#### Endpoint

```
GET /api/health
```

#### Request

No parameters required.

#### Response

```json
{
  "status": "healthy",
  "timestamp": "2025-01-10T12:00:00.000Z",
  "uptime": 123.456
}
```

#### Status Codes

- `200 OK` - Service is healthy
- `500 Internal Server Error` - Service is unhealthy

#### Example

```bash
curl http://localhost:3000/api/health
```

---

### 2. Tesla Superchargers

Get a list of Tesla Supercharger locations.

#### Endpoint

```
GET /api/tesla-superchargers
```

#### Request

No parameters required.

#### Response

```json
{
  "chargers": [
    {
      "id": "sc-tokyo-roppongi",
      "name": "Tokyo - Roppongi",
      "location": {
        "lat": 35.6627,
        "lng": 139.7318
      },
      "address": "6-10-1 Roppongi, Minato-ku",
      "city": "Tokyo",
      "state": "Tokyo",
      "country": "Japan",
      "stalls": 6,
      "amenities": [
        "restaurants",
        "shopping",
        "restrooms",
        "convenience_store"
      ],
      "status": "active"
    }
  ],
  "lastUpdated": "2025-01-10T12:00:00.000Z"
}
```

#### Response Fields

| Field                     | Type   | Description                                  |
| ------------------------- | ------ | -------------------------------------------- |
| `chargers`                | Array  | List of supercharger locations               |
| `chargers[].id`           | String | Unique identifier for the charger            |
| `chargers[].name`         | String | Display name of the location                 |
| `chargers[].location`     | Object | Geographic coordinates                       |
| `chargers[].location.lat` | Number | Latitude                                     |
| `chargers[].location.lng` | Number | Longitude                                    |
| `chargers[].address`      | String | Street address                               |
| `chargers[].city`         | String | City name                                    |
| `chargers[].state`        | String | State/Prefecture                             |
| `chargers[].country`      | String | Country name                                 |
| `chargers[].stalls`       | Number | Number of charging stalls                    |
| `chargers[].amenities`    | Array  | Available amenities                          |
| `chargers[].status`       | String | Current status (active/inactive/maintenance) |
| `lastUpdated`             | String | ISO 8601 timestamp of last data update       |

#### Status Codes

- `200 OK` - Success
- `500 Internal Server Error` - Server error

#### Example

```bash
curl http://localhost:3000/api/tesla-superchargers
```

---

### 3. Nearby Places

Find places near a specific location using Google Places API.

#### Endpoint

```
GET /api/places/nearby
```

#### Request Parameters

| Parameter | Type   | Required | Description             | Default |
| --------- | ------ | -------- | ----------------------- | ------- |
| `lat`     | Number | Yes      | Latitude coordinate     | -       |
| `lng`     | Number | Yes      | Longitude coordinate    | -       |
| `radius`  | Number | No       | Search radius in meters | 400     |
| `type`    | String | No       | Place type filter       | -       |
| `keyword` | String | No       | Search keyword          | -       |

#### Supported Place Types

- `restaurant`
- `cafe`
- `shopping_mall`
- `convenience_store`
- `gas_station`
- `parking`
- `lodging`
- `tourist_attraction`

#### Response

```json
{
  "results": [
    {
      "place_id": "ChIJXXXXXXXXXXXXXXXXXXXX",
      "name": "Restaurant Name",
      "vicinity": "123 Main Street, Tokyo",
      "geometry": {
        "location": {
          "lat": 35.6627,
          "lng": 139.7318
        }
      },
      "types": ["restaurant", "food", "establishment"],
      "rating": 4.5,
      "user_ratings_total": 150,
      "price_level": 2,
      "opening_hours": {
        "open_now": true
      }
    }
  ],
  "status": "OK"
}
```

#### Response Fields

| Field                              | Type    | Description                     |
| ---------------------------------- | ------- | ------------------------------- |
| `results`                          | Array   | List of nearby places           |
| `results[].place_id`               | String  | Unique place identifier         |
| `results[].name`                   | String  | Place name                      |
| `results[].vicinity`               | String  | Address or vicinity description |
| `results[].geometry.location`      | Object  | Geographic coordinates          |
| `results[].types`                  | Array   | Place categories                |
| `results[].rating`                 | Number  | Average rating (1-5)            |
| `results[].user_ratings_total`     | Number  | Total number of ratings         |
| `results[].price_level`            | Number  | Price level (0-4)               |
| `results[].opening_hours.open_now` | Boolean | Currently open status           |
| `status`                           | String  | API response status             |

#### Status Codes

- `200 OK` - Success
- `400 Bad Request` - Missing required parameters
- `500 Internal Server Error` - API key not configured or Google API error

#### Error Response

```json
{
  "error": "Missing required parameters: lat, lng"
}
```

#### Examples

```bash
# Basic search
curl "http://localhost:3000/api/places/nearby?lat=35.6627&lng=139.7318"

# Search with radius
curl "http://localhost:3000/api/places/nearby?lat=35.6627&lng=139.7318&radius=500"

# Search for specific type
curl "http://localhost:3000/api/places/nearby?lat=35.6627&lng=139.7318&type=restaurant"

# Search with keyword
curl "http://localhost:3000/api/places/nearby?lat=35.6627&lng=139.7318&keyword=sushi"
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message description"
}
```

### Common Error Codes

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| `400`       | Bad Request - Invalid parameters        |
| `404`       | Not Found - Endpoint not found          |
| `429`       | Too Many Requests - Rate limit exceeded |
| `500`       | Internal Server Error                   |
| `503`       | Service Unavailable                     |

---

## CORS

The API supports CORS for browser-based applications. Allowed origins are configured based on the environment:

- Development: `http://localhost:3000`
- Production: Configured via environment variables

---

## Caching

- **Tesla Superchargers**: Cached for 1 hour (3600 seconds)
- **Nearby Places**: Not cached to ensure real-time data
- **Health Check**: Not cached

Cache duration can be configured via the `CACHE_DURATION` environment variable.

---

## Future Enhancements

### Planned Endpoints

1. **Route Planning**

   ```
   POST /api/routes/plan
   ```

   Calculate optimal routes between locations with charging stops.

2. **User Favorites**

   ```
   GET /api/users/{userId}/favorites
   POST /api/users/{userId}/favorites
   DELETE /api/users/{userId}/favorites/{chargerId}
   ```

3. **Real-time Availability**

   ```
   GET /api/tesla-superchargers/{chargerId}/availability
   ```

   Get real-time stall availability (requires Tesla API integration).

4. **Charger Reviews**
   ```
   GET /api/tesla-superchargers/{chargerId}/reviews
   POST /api/tesla-superchargers/{chargerId}/reviews
   ```

### Authentication

Future versions will support:

- API key authentication
- OAuth 2.0 for user accounts
- JWT tokens for session management

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Fetch all superchargers
const response = await fetch('https://api.example.com/api/tesla-superchargers')
const data = await response.json()

// Search nearby places
const params = new URLSearchParams({
  lat: '35.6627',
  lng: '139.7318',
  radius: '500',
  type: 'restaurant',
})

const placesResponse = await fetch(
  `https://api.example.com/api/places/nearby?${params}`
)
const places = await placesResponse.json()
```

### Python

```python
import requests

# Fetch all superchargers
response = requests.get('https://api.example.com/api/tesla-superchargers')
data = response.json()

# Search nearby places
params = {
    'lat': 35.6627,
    'lng': 139.7318,
    'radius': 500,
    'type': 'restaurant'
}
response = requests.get('https://api.example.com/api/places/nearby', params=params)
places = response.json()
```

---

## Support

For API support, please:

1. Check the [GitHub Issues](https://github.com/wshino/tesla-sc/issues)
2. Review the [Contributing Guidelines](CONTRIBUTING.md)
3. Contact the development team

---

## Changelog

### Version 1.0.0 (Current)

- Initial API release
- Health check endpoint
- Tesla Supercharger locations (static data)
- Nearby places search via Google Places API
