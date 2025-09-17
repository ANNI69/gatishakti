# UDM-TMS Mock Server

A ready-to-run Express.js + MongoDB mock server that returns realistic JSON responses for prototyping QR scanning applications. This server simulates both UDM (Unified Data Management) and TMS (Track Management System) functionality for railway component management.

## 🚀 Features

- **UDM Endpoints**: Component lookup, goods receipt processing, batch management
- **TMS Endpoints**: Asset management, component fitment tracking, inspection records
- **Realistic Data**: Pre-seeded with sample vendors, batches, components, marks, and inspections
- **No Authentication**: Simple API for rapid prototyping
- **CORS Enabled**: Ready for frontend integration

## 📋 Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **MongoDB**: Local instance or connection string to MongoDB Atlas/Cloud

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd UDM-TMS-Servers
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your MongoDB connection:

```bash
cp .env.example .env
```

Edit `.env` file:
```bash
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/udm_tms_db

# Server Port
PORT=4000

# Environment
NODE_ENV=development
```

### 3. Seed Database

```bash
npm run seed
```

### 4. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:4000`

## 📡 API Endpoints

### Health Check
- `GET /` - Server information and endpoint listing
- `GET /health` - Health status check

### UDM Endpoints

#### Get Component Details
```http
GET /udm/component/:rid
```
Returns detailed component information including vendor, batch, marking, procurement, warranty, and inspection history.

**Example:**
```bash
curl http://localhost:4000/udm/component/RID2025-00001234
```

**Sample Response:**
```json
{
  "rid": "RID2025-00001234",
  "component_type": "Elastic Rail Clip",
  "material": "Spring Steel",
  "vendor": {
    "vendor_id": "VEND-0098",
    "name": "ABC Forgings Pvt Ltd",
    "contact": "+91-98765XXXXX",
    "udm_vendor_code": "UDM-V-0098"
  },
  "batch": {
    "batch_id": "B-2309",
    "lot_no": "L-2309-01",
    "po_number": "PO-IR-2024-789",
    "quantity_in_batch": 10000,
    "mfg_date": "2025-08-15T00:00:00.000Z",
    "expiry_or_warranty_years": 2
  },
  "marking": {
    "engraver_model": "HanFiber-50W",
    "mark_timestamp": "2025-09-14T11:23:45.000Z",
    "qr_image_url": "https://cdn.example.com/marks/RID2025-00001234_after.jpg",
    "mark_status": "OK",
    "mark_params": {
      "power_pct": 65,
      "speed_mm_s": 1000,
      "depth_mm": 0.15
    }
  },
  "procurement": {
    "grn_number": "GRN-55877",
    "grn_date": "2025-08-20T00:00:00.000Z",
    "invoice_number": "INV-99881",
    "received_by_depot": "DEPOT-MUM-01"
  },
  "warranty": {
    "warranty_start": "2025-08-15T00:00:00.000Z",
    "warranty_end": "2027-08-15T00:00:00.000Z",
    "warranty_terms": "Manufacturing defects only"
  },
  "inspection_history": [
    {
      "inspection_id": "INS-2025-0914-01",
      "inspector_id": "ENG-431",
      "date": "2025-09-14T14:22:00.000Z",
      "status": "OK",
      "notes": "No visible wear or damage",
      "confidence": 0.95
    }
  ],
  "udm_links": {
    "udm_record_url": "https://ireps.gov.in/udm/records/RID2025-00001234",
    "tms_asset_link": "https://tms.ir/asset/ASSET-44523"
  }
}
```

#### Process Goods Receipt
```http
POST /udm/receipt
```
Process goods receipt note (GRN) and update component procurement information.

**Example:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "grn_number": "GRN-55877",
    "po_number": "PO-IR-2024-789",
    "vendor_id": "VEND-0098",
    "batch_id": "B-2309",
    "items": [
      {
        "rid": "RID2025-00001234",
        "component_type": "Elastic Rail Clip",
        "quantity": 1000,
        "uom": "Nos",
        "received_date": "2025-08-20",
        "received_by": "DEPOT-MUM-01"
      }
    ]
  }' \
  http://localhost:4000/udm/receipt
```

**Sample Response:**
```json
{
  "status": "success",
  "grn_id": "GRN-55877",
  "created_at": "2025-08-20T07:34:11.123Z",
  "processed_items": 1
}
```

#### Get Batch Information
```http
GET /udm/batch/:batchId
```
Returns batch summary including defect statistics.

**Example:**
```bash
curl http://localhost:4000/udm/batch/B-2309
```

### TMS Endpoints

#### Get Asset Information
```http
GET /tms/asset/:assetId
```
Returns asset information with fitted components.

**Example:**
```bash
curl http://localhost:4000/tms/asset/ASSET-44523
```

#### Record Component Fitment
```http
POST /tms/asset/:assetId/fit
```
Record component fitment to an asset.

**Example:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "rid": "RID2025-00001234",
    "fitment_date": "2025-09-11T10:04:00Z",
    "fitted_by": "ENG-431",
    "location": {
      "zone": "WR",
      "division": "Mumbai",
      "km_marker": "KM-123.45"
    },
    "notes": "Clips fitted on sleeper SLP-9802"
  }' \
  http://localhost:4000/tms/asset/ASSET-44523/fit
```

**Sample Response:**
```json
{
  "status": "ok",
  "fitment_record_id": "FIT-1726584244123",
  "asset_id": "ASSET-44523",
  "created_at": "2025-09-11T10:04:04.123Z"
}
```

#### Record Inspection
```http
POST /tms/asset/:assetId/inspection
```
Record inspection event for asset components.

**Example:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "inspection_id": "INS-2025-0914-01",
    "inspector_id": "ENG-431",
    "date": "2025-09-14T14:22:00Z",
    "component_reads": [
      {
        "rid": "RID2025-00001234",
        "status": "OK",
        "notes": "No visible wear",
        "confidence": 0.98
      }
    ],
    "photos": [
      "https://cdn.example.com/inspections/photo1.jpg"
    ],
    "gps": {
      "lat": 19.076,
      "lon": 72.8777
    },
    "connectivity": "offline",
    "synced": false
  }' \
  http://localhost:4000/tms/asset/ASSET-44523/inspection
```

#### Query Inspections
```http
GET /tms/inspections?componentRid=RID2025-00001234&limit=10&offset=0
```
Query inspections with optional filters.

**Example:**
```bash
curl "http://localhost:4000/tms/inspections?componentRid=RID2025-00001234"
```

### Utility Endpoints

#### Seed Database
```http
POST /seed/run
```
Re-seed the database with sample data (idempotent).

**Example:**
```bash
curl -X POST http://localhost:4000/seed/run
```

## 📊 Sample Data

The seed script creates:
- **2 Vendors**: VEND-0098, VEND-0102
- **2 Batches**: B-2309, B-2310
- **8 Components**: RID2025-00001234 to RID2025-00001241
- **8 Marks**: One for each component
- **8 Inspections**: One for each component

### Sample Component RIDs
- `RID2025-00001234` - Elastic Rail Clip (Spring Steel)
- `RID2025-00001235` - Rail Joint (Carbon Steel)
- `RID2025-00001236` - Sleeper Bolt (Alloy Steel)
- `RID2025-00001237` - Track Plate (Stainless Steel)
- `RID2025-00001238` - Elastic Rail Clip (Spring Steel)
- `RID2025-00001239` - Rail Joint (Carbon Steel)
- `RID2025-00001240` - Sleeper Bolt (Alloy Steel)
- `RID2025-00001241` - Track Plate (Stainless Steel)

## 🏗️ Project Structure

```
UDM-TMS-Servers/
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore patterns
├── README.md                # This file
└── src/
    ├── server.js            # Server entry point
    ├── app.js               # Express app configuration
    ├── config/
    │   └── db.js            # Database connection
    ├── models/              # Mongoose schemas
    │   ├── Vendor.js
    │   ├── Batch.js
    │   ├── Component.js
    │   ├── Mark.js
    │   └── Inspection.js
    ├── routes/              # Route definitions
    │   ├── udm.js
    │   └── tms.js
    ├── controllers/         # Business logic
    │   ├── udmController.js
    │   └── tmsController.js
    └── seed/                # Database seeding
        └── seed.js
```

## 🔧 Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Seed database with sample data

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/udm_tms_db` |
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment mode | `development` |

### Database Schema

The application uses MongoDB with Mongoose ODM. Key collections:
- **vendors** - Component suppliers
- **batches** - Manufacturing batches
- **components** - Individual railway components with RID
- **marks** - QR code marking information
- **inspections** - Field inspection records

## 🧪 Testing the API

### Using curl

Test component lookup:
```bash
curl -s http://localhost:4000/udm/component/RID2025-00001234 | jq
```

Test batch information:
```bash
curl -s http://localhost:4000/udm/batch/B-2309 | jq
```

Test asset information:
```bash
curl -s http://localhost:4000/tms/asset/ASSET-44523 | jq
```

### Using Postman or Insomnia

Import the following base URL: `http://localhost:4000`

Create requests for each endpoint using the examples provided above.

## 🚦 Error Handling

The API returns standard HTTP status codes:
- **200** - Success
- **400** - Bad Request (missing required fields)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error

Error responses follow this format:
```json
{
  "status": "error",
  "message": "Descriptive error message"
}
```

## 🔒 Security Note

This is a mock server for development and prototyping. It has:
- No authentication or authorization
- No rate limiting
- No input sanitization beyond basic validation
- CORS enabled for all origins

**Do not use in production without proper security measures.**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running on your system
- Check the `MONGO_URI` in your `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the `PORT` in your `.env` file
- Kill the process using the port: `npx kill-port 4000`

### Seed Script Fails
- Ensure MongoDB is running and accessible
- Check database permissions
- Review the console output for specific errors

### Module Not Found Errors
- Run `npm install` to ensure all dependencies are installed
- Check that you're in the correct directory

## 📞 Support

For issues and questions:
1. Check this README
2. Review the console logs for error messages
3. Verify your environment configuration
4. Create an issue in the repository

---

**Happy coding! 🚀**