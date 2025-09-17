const express = require('express');
const { getAsset, recordFitment, recordInspection, getInspections } = require('../controllers/tmsController');

const router = express.Router();

/**
 * GET /tms/asset/:assetId
 * Retrieve asset information with fitted components
 */
router.get('/asset/:assetId', getAsset);

/**
 * POST /tms/asset/:assetId/fit
 * Record component fitment to asset
 * Expected payload: { rid, fitment_date, fitted_by, location: { zone, division, km_marker }, notes }
 */
router.post('/asset/:assetId/fit', recordFitment);

/**
 * POST /tms/asset/:assetId/inspection
 * Record inspection event for asset and its components
 * Expected payload: { inspection_id, inspector_id, date, component_reads: [{ rid, status, notes, confidence }], photos: [], gps: { lat, lon }, connectivity, synced }
 */
router.post('/asset/:assetId/inspection', recordInspection);

/**
 * GET /tms/inspections
 * Query inspections with optional filters
 * Query params: componentRid, limit, offset
 */
router.get('/inspections', getInspections);

module.exports = router;