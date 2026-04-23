// ═══════════════════════════════════════════════════════════════════════════
// ROUNIK — Google Apps Script
// Paste this ENTIRE code into your Google Sheet's Apps Script editor
// Extensions → Apps Script → replace all code → Save → Deploy
// ═══════════════════════════════════════════════════════════════════════════

const SHEET_NAME = "Products"; // Name of your sheet tab

// ── Column order in your Google Sheet ──────────────────────────────────────
// Make sure your Sheet has EXACTLY these column headers in Row 1:
// id | name | category | material | price | sale_price | description |
// care_instructions | sizes | colors | tags | image1 | image2 | image3 |
// badge | in_stock

const COLUMNS = [
  "id","name","category","material","price","sale_price",
  "description","care_instructions","sizes","colors","tags",
  "image1","image2","image3","badge","in_stock"
];

// ── Handle GET requests (read all products) ────────────────────────────────
function doGet(e) {
  try {
    const action = e.parameter.action || 'getAll';
    if (action === 'getAll') {
      const products = getAllProducts();
      return jsonResponse({ success: true, products });
    }
    return jsonResponse({ success: false, error: 'Unknown action' });
  } catch(err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// ── Handle POST requests (save / update / delete) ─────────────────────────
function doPost(e) {
  try {
    const body    = JSON.parse(e.postData.contents);
    const action  = body.action;
    const product = body.product;

    if (action === 'save')   return jsonResponse(saveProduct(product));
    if (action === 'update') return jsonResponse(updateProduct(product));
    if (action === 'delete') return jsonResponse(deleteProduct(product.id));

    return jsonResponse({ success: false, error: 'Unknown action' });
  } catch(err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// ── Get all products from Sheet ────────────────────────────────────────────
function getAllProducts() {
  const sheet = getSheet();
  const rows  = sheet.getDataRange().getValues();
  if (rows.length <= 1) return []; // only header row

  const headers = rows[0].map(h => h.toString().toLowerCase().trim());
  const products = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[1]) continue; // skip empty rows (no name)

    const obj = {};
    headers.forEach((h, idx) => { obj[h] = row[idx] ? row[idx].toString().trim() : ''; });

    const images = [];
    ['image1','image2','image3'].forEach(k => { if(obj[k]) images.push(obj[k]); });

    products.push({
      id:             obj.id || '',
      name:           obj.name,
      category:       obj.category,
      material:       obj.material,
      price:          parseFloat(obj.price) || 0,
      discountedPrice:obj.sale_price ? parseFloat(obj.sale_price) || null : null,
      description:    obj.description,
      care:           obj.care_instructions,
      sizes:          obj.sizes ? obj.sizes.split(',').map(s=>s.trim()).filter(Boolean) : [],
      colors:         obj.colors ? obj.colors.split(',').map(c=>c.trim()).filter(Boolean) : [],
      tags:           obj.tags ? obj.tags.split(',').map(t=>t.trim()).filter(Boolean) : [],
      images:         images,
      badge:          obj.badge || null,
      inStock:        obj.in_stock !== 'false' && obj.in_stock !== '0' && obj.in_stock.toLowerCase() !== 'no',
    });
  }
  return products;
}

// ── Save new product ───────────────────────────────────────────────────────
function saveProduct(product) {
  const sheet = getSheet();
  ensureHeaders(sheet);

  const row = productToRow(product);
  sheet.appendRow(row);
  return { success: true, message: 'Product added' };
}

// ── Update existing product ────────────────────────────────────────────────
function updateProduct(product) {
  const sheet = getSheet();
  const rows  = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === product.id.toString()) {
      const row = productToRow(product);
      row.forEach((val, col) => {
        sheet.getRange(i + 1, col + 1).setValue(val);
      });
      return { success: true, message: 'Product updated' };
    }
  }
  // If not found, add as new
  return saveProduct(product);
}

// ── Delete product by id ───────────────────────────────────────────────────
function deleteProduct(id) {
  const sheet = getSheet();
  const rows  = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === id.toString()) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Product deleted' };
    }
  }
  return { success: false, error: 'Product not found' };
}

// ── Convert product object → sheet row array ───────────────────────────────
function productToRow(p) {
  const images = p.images || [];
  return [
    p.id || 'P' + Date.now(),
    p.name || '',
    p.category || '',
    p.material || '',
    p.price || 0,
    p.discountedPrice || '',
    p.description || '',
    p.care || '',
    (p.sizes  || []).join(', '),
    (p.colors || []).join(', '),
    (p.tags   || []).join(', '),
    images[0] || '',
    images[1] || '',
    images[2] || '',
    p.badge || '',
    p.inStock !== false ? 'true' : 'false',
  ];
}

// ── Helper: get or create sheet ────────────────────────────────────────────
function getSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    ensureHeaders(sheet);
  }
  return sheet;
}

// ── Helper: write header row if missing ───────────────────────────────────
function ensureHeaders(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, COLUMNS.length).getValues()[0];
  if (!firstRow[0]) {
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

// ── Helper: return JSON response with CORS headers ─────────────────────────
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
