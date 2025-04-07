import db from "../config/db.js";

export const uploadDocument = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const itemId = req.body.itemId;
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  if (!itemId) return res.json({
    fileUrl, fileName: req.file.originalname,
    message: "File uploaded successfully, will be associated with item when saved",
  });

  db.query(
    "UPDATE expenditure SET supportingDocument = ?, supportingDocumentName = ? WHERE id = ?",
    [fileUrl, req.file.originalname, itemId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Failed to update document" });

      const message = results.affectedRows === 0
        ? "File uploaded successfully, will be associated with item when saved"
        : "File uploaded and associated with item successfully";

      res.json({ fileUrl, fileName: req.file.originalname, message });
    }
  );
};
 