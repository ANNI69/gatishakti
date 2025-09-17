const express = require('express');
const { getComponent, processReceipt, getBatch } = require('../controllers/udmController');

const router = express.Router();

/**
 * GET /udm/component/:rid
 * Retrieve component details by RID
 */
router.get('/component/:rid', getComponent);

/**
 * POST /udm/receipt
 * Process goods receipt note (GRN)
 * Expected payload: { grn_number, po_number, vendor_id, batch_id, items: [{ rid, component_type, quantity, uom, received_date, received_by }] }
 */
router.post('/receipt', processReceipt);

/**
 * GET /udm/batch/:batchId
 * Retrieve batch summary including defect statistics
 */
router.get('/batch/:batchId', getBatch);

module.exports = router;