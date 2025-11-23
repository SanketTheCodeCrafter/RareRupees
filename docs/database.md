# Database Schema

RareRupees uses **MongoDB** as its primary data store, utilizing **Mongoose** for schema definition and validation.

## Coin Model
Collection: `coins`

Represents a single unique coin entry in the catalog.

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Auto | Unique identifier |
| `frontImage` | String | Yes | - | Cloudinary URL for front view |
| `rearImage` | String | Yes | - | Cloudinary URL for rear view |
| `denomination` | String | Yes | - | Face value (e.g., "₹5") |
| `year` | Number | Yes | - | Year of minting |
| `mint` | String | Yes | - | Mint location (e.g., "Mumbai") |
| `condition` | Number | Yes | - | Condition rating (1-10) |
| `mark` | String | Yes | - | Mint mark identifier |
| `isSpecial` | Boolean | No | `false` | Flag for commemorative/special coins |
| `createdAt` | Date | No | Auto | Timestamp of creation |
| `updatedAt` | Date | No | Auto | Timestamp of last update |

### Indexes
- `_id`: Primary Key (Default)
- No explicit secondary indexes defined yet (consider indexing `year` or `denomination` for performance if dataset grows).

### Example Document
```json
{
  "_id": "65f2a9b1e4b0a1b2c3d4e5f6",
  "frontImage": "https://res.cloudinary.com/rarerupees/image/upload/v1710400000/front_xyz.jpg",
  "rearImage": "https://res.cloudinary.com/rarerupees/image/upload/v1710400000/rear_xyz.jpg",
  "denomination": "₹5",
  "year": 2004,
  "mint": "Hyderabad",
  "condition": 9,
  "mark": "Star",
  "isSpecial": false,
  "createdAt": "2024-03-14T10:00:00.000Z",
  "updatedAt": "2024-03-14T10:00:00.000Z",
  "__v": 0
}
```

## Validation Rules
- **Required Fields**: All core fields (`frontImage`, `rearImage`, `denomination`, `year`, `mint`, `condition`, `mark`) are mandatory.
- **Types**: Strict type checking is enforced by Mongoose (e.g., `year` must be a number).
- **Timestamps**: Automatically managed by Mongoose (`timestamps: true`).

## Relationships
- The current architecture is **single-collection** focused.
- There is no separate `User` collection for admins; admin authentication is handled via environment variables and stateless JWTs.
