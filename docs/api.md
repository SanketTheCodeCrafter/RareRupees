# API Documentation

## Base URL
`http://localhost:5000/api` (Development)
`https://api.rarerupees.com/api` (Production - Example)

## Authentication
Protected routes require a valid JSON Web Token (JWT) in the `Authorization` header.
**Header Format:** `Authorization: Bearer <token>`

---

## Auth Endpoints

### Admin Login
Authenticate as an administrator to receive an access token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `username` | string | Yes | Admin username |
| `password` | string | Yes | Admin password |

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## Coin Endpoints

### Get All Coins
Retrieve a list of all coins in the catalog, sorted by newest first.

- **URL**: `/coins`
- **Method**: `GET`
- **Auth Required**: No

#### Success Response (200 OK)
```json
[
  {
    "_id": "65f2a...",
    "denomination": "₹5",
    "year": 2004,
    "mint": "Hyderabad",
    "condition": 9,
    "frontImage": "https://res.cloudinary.com/...",
    "rearImage": "https://res.cloudinary.com/...",
    "isSpecial": false,
    "createdAt": "2024-03-14T10:00:00.000Z"
  },
  ...
]
```

### Get Coin by ID
Retrieve details for a specific coin.

- **URL**: `/coins/:id`
- **Method**: `GET`
- **Auth Required**: No

#### Success Response (200 OK)
```json
{
  "_id": "65f2a...",
  "denomination": "₹10",
  "year": 2010,
  ...
}
```

#### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Coin not found"
}
```

### Create Coin
Add a new coin to the catalog. Requires multipart/form-data for image uploads.

- **URL**: `/coins`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)
- **Content-Type**: `multipart/form-data`

#### Request Body (Form Data)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `frontImage` | File | Yes | Image of the coin's front (Max 5MB) |
| `rearImage` | File | Yes | Image of the coin's rear (Max 5MB) |
| `denomination` | string | Yes | e.g., "₹5", "₹10" |
| `year` | number | Yes | Year of minting |
| `mint` | string | Yes | e.g., "Mumbai", "Kolkata" |
| `condition` | number | Yes | Rating from 1-10 |
| `mark` | string | Yes | Mint mark description |
| `isSpecial` | boolean | No | Default: `false` |

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Coin created successfully",
  "data": {
    "_id": "65f2b...",
    "denomination": "₹5",
    ...
  }
}
```

### Update Coin
Update an existing coin's details or images.

- **URL**: `/coins/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin)
- **Content-Type**: `multipart/form-data`

#### Request Body (Form Data)
Any field from the Create Coin endpoint can be updated. Images are optional; if provided, they replace the existing ones.

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Coin updated successfully",
  "data": { ... }
}
```

### Delete Coin
Remove a coin from the catalog.

- **URL**: `/coins/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin)

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Coin deleted successfully"
}
```

## Status Codes
| Code | Description |
| :--- | :--- |
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad Request (Missing fields, invalid data) |
| `401` | Unauthorized (Missing or invalid token) |
| `403` | Forbidden (Valid token but insufficient permissions) |
| `404` | Resource Not Found |
| `500` | Internal Server Error |
