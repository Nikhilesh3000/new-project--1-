// ✅ Use ES module import
import db from '../config/db.js'; // Make sure db.js uses `export default db;`

// ✅ Get all vendors
export const getVendors = (req, res) => {
  db.query('SELECT * FROM vendor', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// ✅ Add new vendor
export const addVendor = (req, res) => {
  const vendor = req.body;
  db.query('INSERT INTO vendor SET ?', vendor, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, ...vendor });
  });
};

// ✅ Update vendor by name
export const updateVendor = (req, res) => {
  const { id } = req.params;
  const vendor = req.body;
  db.query('UPDATE vendor SET ? WHERE vendorName = ?', [vendor, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Vendor updated');
  });
};

// ✅ Delete vendor by name
export const deleteVendor = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM vendor WHERE vendorName = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Vendor deleted');
  });
};
export const getAllVendors = (req, res) => {
  db.query("SELECT id, vendorName, gstRate, tdsRate FROM vendor", (error, results) => {
    if (error) return res.status(500).json({ error: "Failed to fetch vendors" })
    res.json(results)
  })
}

export const getExpenseHeads = (req, res) => {
  db.query("SELECT DISTINCT expensesHead FROM vendor WHERE expensesHead IS NOT NULL", (error, results) => {
    if (error) return res.status(500).json({ error: "Failed to fetch expense heads" })
    res.json(results)
  })
}

export const getVendorDetails = (req, res) => {
  db.query("SELECT * FROM vendor", (error, results) => {
    if (error) return res.status(500).json({ error: "Failed to fetch vendor details" })
    res.json(results)
  })
}

export const getVendorById = (req, res) => {
  const { id } = req.params
  db.query("SELECT * FROM vendor WHERE id = ?", [id], (error, results) => {
    if (error) return res.status(500).json({ error: "Failed to fetch vendor details" })
    if (results.length === 0) return res.status(404).json({ error: "Vendor not found" })
    res.json(results[0])
  })
}

export const calculateAmounts = (req, res) => {
  const { vendorId, amount } = req.body
  if (!vendorId || !amount) return res.status(400).json({ error: "Vendor ID and amount are required" })

  db.query("SELECT gstRate, tdsRate FROM vendor WHERE id = ?", [vendorId], (error, results) => {
    if (error) return res.status(500).json({ error: "Failed to calculate amounts" })
    if (results.length === 0) return res.status(404).json({ error: "Vendor not found" })

    const { gstRate, tdsRate } = results[0]
    const gstAmount = (amount * gstRate) / 100
    const tdsAmount = (amount * tdsRate) / 100
    const netAmount = amount + gstAmount - tdsAmount

    res.json({ amount, gst: gstAmount, tds: tdsAmount, net: netAmount })
  })
}