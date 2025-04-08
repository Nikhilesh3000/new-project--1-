import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/authRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import legalRoutes from './routes/legalRoutes.js';
import salaryDeductionRoutes from './salaryDeduction.js'; // adjust if it's in another folder
import db from './config/db.js';
import client_dataRoutes from "./routes/client_dataRoutes.js"
import franchiseeRoutes from "./routes/franchiseeRoutes.js";
import employeesRoutes from "./routes/employeesRoutes.js";
import expenditureRoutes from "./routes/expenditureRoutes.js"
import { uploadsPath } from "./middleware/upload.js"
import jobInvoiceRoutes from "./routes/jobInvoiceRoutes.js";
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cors = require('cors');



const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(uploadsPath))

app.use('/api', authRoutes);
app.put('/api/admin/approve-user3', (req, res) => {
  const { userId, status } = req.body;

  if (!userId || !status) {
    return res.status(400).json({ message: "Missing userId or status" });
  }

  const query = `UPDATE users3 SET  approval_status = ? WHERE id = ?`;

  db.query(query, [status, userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: `User ${status} successfully` });
  });
});

// User login endpoint (with approval check)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users3 WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];

    // Check if the user is approved
    if (user.status !== 'approved') {
      return res.status(403).json({ error: 'User is not approved' });
    }

    // You can add password checking and JWT generation here

    res.status(200).json({ message: 'Login successful' });
  });
});


// fetching data form register db
app.get("/api/users3", (req, res) => {
  // Query the 'users3' table
  db.query("SELECT * FROM users3", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Send the fetched data to the frontend
    res.json(results);
  });
});



//fetching data from departments and designation

app.get("/api/departments", (req, res) => {
  db.query('SELECT * FROM departments ORDER BY departmentName', (err, departments) => {
    if (err) {
      console.error("Error fetching departments:", err)
      return res.status(500).json({ error: "Failed to fetch departments" })
    }

    // Use a counter to track when all designations are fetched
    let completed = 0
    
    // If no departments, return empty array
    if (departments.length === 0) {
      return res.json([])
    }

    // Get designations for each department
    departments.forEach((department, index) => {
      db.query(
        'SELECT * FROM designations WHERE departmentId = ? ORDER BY designationName',
        [department.id],
        (err, designations) => {
          if (err) {
            console.error("Error fetching designations:", err)
            return res.status(500).json({ error: "Failed to fetch designations" })
          }
          
          departments[index].designations = designations
          completed++
          
          // When all departments have their designations, send the response
          if (completed === departments.length) {
            res.json(departments)
          }
        }
      )
    })
  })
})



// Create a new department with designations
app.post("/api/departments", (req, res) => {
  const { departmentName, designations } = req.body

  if (!departmentName || !Array.isArray(designations)) {
    return res.status(400).json({ error: "Department name and designations array are required" })
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection:", err)
      return res.status(500).json({ error: "Failed to create department" })
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release()
        console.error("Error beginning transaction:", err)
        return res.status(500).json({ error: "Failed to create department" })
      }

      // Insert department
      connection.query(
        'INSERT INTO departments (departmentName) VALUES (?)',
        [departmentName],
        (err, result) => {
          if (err) {
            return connection.rollback(() => {
              connection.release()
              console.error("Error creating department:", err)
              res.status(500).json({ error: "Failed to create department" })
            })
          }

          const departmentId = result.insertId
          let designationsCompleted = 0
          let designationsToProcess = designations.filter(d => d.trim() !== "").length

          // If no designations, commit and return
          if (designationsToProcess === 0) {
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release()
                  console.error("Error committing transaction:", err)
                  res.status(500).json({ error: "Failed to create department" })
                })
              }

              // Get the newly created department
              connection.query(
                'SELECT * FROM departments WHERE id = ?',
                [departmentId],
                (err, newDepartment) => {
                  if (err) {
                    connection.release()
                    console.error("Error fetching new department:", err)
                    return res.status(500).json({ error: "Department created but failed to fetch details" })
                  }

                  newDepartment[0].designations = []
                  connection.release()
                  res.status(201).json(newDepartment[0])
                }
              )
            })
            return
          }



          // Insert designations
          designations.forEach(designation => {
            if (designation.trim()) {
              connection.query(
                'INSERT INTO designations (designationName, departmentId) VALUES (?, ?)',
                [designation, departmentId],
                (err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release()
                      console.error("Error creating designation:", err)
                      res.status(500).json({ error: "Failed to create department" })
                    })
                  }

                  designationsCompleted++
                  
                  // When all designations are inserted, commit and return
                  if (designationsCompleted === designationsToProcess) {
                    connection.commit((err) => {
                      if (err) {
                        return connection.rollback(() => {
                          connection.release()
                          console.error("Error committing transaction:", err)
                          res.status(500).json({ error: "Failed to create department" })
                        })
                      }

                      // Get the newly created department with designations
                      connection.query(
                        'SELECT * FROM departments WHERE id = ?',
                        [departmentId],
                        (err, newDepartment) => {
                          if (err) {
                            connection.release()
                            console.error("Error fetching new department:", err)
                            return res.status(500).json({ error: "Department created but failed to fetch details" })
                          }

                          connection.query(
                            'SELECT * FROM designations WHERE departmentId = ?',
                            [departmentId],
                            (err, departmentDesignations) => {
                              connection.release()
                              
                              if (err) {
                                console.error("Error fetching designations:", err)
                                return res.status(500).json({ error: "Department created but failed to fetch designations" })
                              }

                              newDepartment[0].designations = departmentDesignations
                              res.status(201).json(newDepartment[0])
                            }
                          )
                        }
                      )
                    })
                  }
                }
              )
            }
          })
        }
      )
    })
  })
})

// Update a department
app.put("/api/departments/:id", (req, res) => {
  const { id } = req.params
  const { departmentName } = req.body

  if (!departmentName) {
    return res.status(400).json({ error: "Department name is required" })
  }

  db.query(
    'UPDATE departments SET departmentName = ? WHERE id = ?',
    [departmentName, id],
    (err, result) => {
      if (err) {
        console.error("Error updating department:", err)
        return res.status(500).json({ error: "Failed to update department" })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Department not found" })
      }

      res.json({ message: "Department updated successfully" })
    }
  )
})

// Delete a department and its designations
app.delete("/api/departments/:id", (req, res) => {
  const { id } = req.params

  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection:", err)
      return res.status(500).json({ error: "Failed to delete department" })
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release()
        console.error("Error beginning transaction:", err)
        return res.status(500).json({ error: "Failed to delete department" })
      }

      // First delete all designations for this department
      connection.query(
        'DELETE FROM designations WHERE departmentId = ?',
        [id],
        (err) => {
          if (err) {
            return connection.rollback(() => {
              connection.release()
              console.error("Error deleting designations:", err)
              res.status(500).json({ error: "Failed to delete department" })
            })
          }

          // Then delete the department
          connection.query(
            'DELETE FROM departments WHERE id = ?',
            [id],
            (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release()
                  console.error("Error deleting department:", err)
                  res.status(500).json({ error: "Failed to delete department" })
                })
              }

              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release()
                    console.error("Error committing transaction:", err)
                    res.status(500).json({ error: "Failed to delete department" })
                  })
                }

                connection.release()

                if (result.affectedRows === 0) {
                  return res.status(404).json({ error: "Department not found" })
                }

                res.json({ message: "Department and its designations deleted successfully" })
              })
            }
          )
        }
      )
    })
  })
})

// Add a designation to a department
app.post("/api/departments/:departmentId/designations", (req, res) => {
  const { departmentId } = req.params
  const { designationName } = req.body

  if (!designationName) {
    return res.status(400).json({ error: "Designation name is required" })
  }

  // Check if department exists
  db.query(
    'SELECT id FROM departments WHERE id = ?',
    [departmentId],
    (err, department) => {
      if (err) {
        console.error("Error checking department:", err)
        return res.status(500).json({ error: "Failed to add designation" })
      }

      if (department.length === 0) {
        return res.status(404).json({ error: "Department not found" })
      }

      // Insert designation
      db.query(
        'INSERT INTO designations (designationName, departmentId) VALUES (?, ?)',
        [designationName, departmentId],
        (err, result) => {
          if (err) {
            console.error("Error adding designation:", err)
            return res.status(500).json({ error: "Failed to add designation" })
          }

          // Return the newly created designation
          db.query(
            'SELECT * FROM designations WHERE id = ?',
            [result.insertId],
            (err, newDesignation) => {
              if (err) {
                console.error("Error fetching new designation:", err)
                return res.status(500).json({ error: "Designation created but failed to fetch details" })
              }

              res.status(201).json(newDesignation[0])
            }
          )
        }
      )
    }
  )
})

// Update a designation
app.put("api/designations/:id", (req, res) => {
  const { id } = req.params
  const { designationName } = req.body

  if (!designationName) {
    return res.status(400).json({ error: "Designation name is required" })
  }

  db.query(
    'UPDATE designations SET designationName = ? WHERE id = ?',
    [designationName, id],
    (err, result) => {
      if (err) {
        console.error("Error updating designation:", err)
        return res.status(500).json({ error: "Failed to update designation" })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Designation not found" })
      }

      res.json({ message: "Designation updated successfully" })
    }
  )
})

// Delete a designation
app.delete("/api/designations/:id", (req, res) => {
  const { id } = req.params

  db.query(
    'DELETE FROM designations WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting designation:", err)
        return res.status(500).json({ error: "Failed to delete designation" })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Designation not found" })
      }

      res.json({ message: "Designation deleted successfully" })
    }
  )
})

// Search departments and designations
app.get("/api/search", (req, res) => {
  const { query } = req.query

  if (!query) {
    return res.status(400).json({ error: "Search query is required" })
  }

  const searchQuery = `%${query}%`

  // Search departments
  db.query(
    'SELECT * FROM departments WHERE departmentName LIKE ?',
    [searchQuery],
    (err, departments) => {
      if (err) {
        console.error("Error searching departments:", err)
        return res.status(500).json({ error: "Failed to perform search" })
      }

      // Search designations
      db.query(
        'SELECT * FROM designations WHERE designationName LIKE ?',
        [searchQuery],
        (err, designations) => {
          if (err) {
            console.error("Error searching designations:", err)
            return res.status(500).json({ error: "Failed to perform search" })
          }

          // Get unique department IDs from designations
          const departmentIds = [...new Set(designations.map(d => d.departmentId))]

          // If no matching departments or designations, return empty array
          if (departments.length === 0 && departmentIds.length === 0) {
            return res.json([])
          }

          // Get departments that have matching designations
          if (departmentIds.length > 0) {
            db.query(
              'SELECT * FROM departments WHERE id IN (?)',
              [departmentIds],
              (err, departmentsWithMatchingDesignations) => {
                if (err) {
                  console.error("Error fetching departments with matching designations:", err)
                  return res.status(500).json({ error: "Failed to perform search" })
                }

                // Combine results and remove duplicates
                const allDepartments = [...departments, ...departmentsWithMatchingDesignations]
                const uniqueDepartmentIds = [...new Set(allDepartments.map(d => d.id))]
                const uniqueDepartments = uniqueDepartmentIds.map(id => 
                  allDepartments.find(d => d.id === id)
                )

                // Get designations for each department
                let completed = 0
                
                uniqueDepartments.forEach((department, index) => {
                  db.query(
                    'SELECT * FROM designations WHERE departmentId = ?',
                    [department.id],
                    (err, deptDesignations) => {
                      if (err) {
                        console.error("Error fetching designations:", err)
                        return res.status(500).json({ error: "Failed to perform search" })
                      }
                      
                      uniqueDepartments[index].designations = deptDesignations
                      completed++
                      
                      // When all departments have their designations, send the response
                      if (completed === uniqueDepartments.length) {
                        res.json(uniqueDepartments)
                      }
                    }
                  )
                })
              }
            )
          } else {
            // No matching designations, just return departments with their designations
            let completed = 0
            
            departments.forEach((department, index) => {
              db.query(
                'SELECT * FROM designations WHERE departmentId = ?',
                [department.id],
                (err, deptDesignations) => {
                  if (err) {
                    console.error("Error fetching designations:", err)
                    return res.status(500).json({ error: "Failed to perform search" })
                  }
                  
                  departments[index].designations = deptDesignations
                  completed++
                  
                  // When all departments have their designations, send the response
                  if (completed === departments.length) {
                    res.json(departments)
                  }
                }
              )
            })
          }
        }
      )
    }
  )
})

// ✅ Fetch All Tables
app.get("/api/tables", (req, res) => {
  const query = "SHOW TABLES"
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Tables Fetch Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json(results)
  })
})

// ✅ Income Tax Slabs
app.get("/api/income-tax-slabs", (req, res) => {
  const query = "SELECT * FROM income_tax_slabs ORDER BY from_amount"
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Fetch Income Tax Slabs Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json(results)
  })
})

app.post("/api/income-tax-slabs", (req, res) => {
  const { from_amount, to_amount, tax_rate } = req.body
  const query = "INSERT INTO income_tax_slabs (from_amount, to_amount, tax_rate) VALUES (?, ?, ?)"
  db.query(query, [from_amount, to_amount, tax_rate], (err, result) => {
    if (err) {
      console.error("❌ Insert Income Tax Slab Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json({ id: result.insertId, from_amount, to_amount, tax_rate })
  })
})

app.put("/api/income-tax-slabs/:id", (req, res) => {
  const { id } = req.params
  const { from_amount, to_amount, tax_rate } = req.body
  const query = "UPDATE income_tax_slabs SET from_amount = ?, to_amount = ?, tax_rate = ? WHERE id = ?"
  db.query(query, [from_amount, to_amount, tax_rate, id], (err) => {
    if (err) {
      console.error("❌ Update Income Tax Slab Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json({ message: "Updated successfully" })
  })
})

app.delete("/api/income-tax-slabs/:id", (req, res) => {
  const { id } = req.params
  const query = "DELETE FROM income_tax_slabs WHERE id = ?"
  db.query(query, [id], (err) => {
    if (err) {
      console.error("❌ Delete Income Tax Slab Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json({ message: "Deleted successfully" })
  })
})

// ✅ Client Terms
app.get("/api/client-terms", (req, res) => {
  const query = "SELECT * FROM client_terms"
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Fetch Client Terms Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json(results)
  })
})

// ✅ Expenses
app.get("/api/expenses", (req, res) => {
  const query = "SELECT * FROM expenses"
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Fetch Expenses Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json(results)
  })
})

// ✅ Franchisee Terms
app.get("/api/franchisee-terms", (req, res) => {
  const query = "SELECT * FROM franchisee_terms"
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Fetch Franchisee Terms Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json(results)
  })
})

// ✅ GST Rates
app.get("/api/gst-rates", (req, res) => {
  const query = "SELECT * FROM gst_rates"
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Fetch GST Rates Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json(results)
  })
})

// ✅ Salary Data
app.get("/api/salary-data", (req, res) => {
  const query = "SELECT * FROM salary_data"
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Fetch Salary Data Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json(results)
  })
})

// Add new salary data
app.post("/api/salary-data", (req, res) => {
  const { head_component, eligibility, limit, period, remarks } = req.body
  const query = "INSERT INTO salary_data (head_component, eligibility, limit, period, remarks) VALUES (?, ?, ?, ?, ?)"
  db.query(query, [head_component, eligibility, limit, period, remarks], (err, result) => {
    if (err) {
      console.error("❌ Insert Salary Data Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json({ id: result.insertId, head_component, eligibility, limit, period, remarks })
  })
})

// Update salary data
app.put("/api/salary-data/:id", (req, res) => {
  const { id } = req.params
  const { head_component, eligibility, limit, period, remarks } = req.body
  const query =
    "UPDATE salary_data SET head_component = ?, eligibility = ?, limit = ?, period = ?, remarks = ? WHERE id = ?"
  db.query(query, [head_component, eligibility, limit, period, remarks, id], (err) => {
    if (err) {
      console.error("❌ Update Salary Data Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json({ message: "Updated successfully" })
  })
})

// Delete salary data
app.delete("/api/salary-data/:id", (req, res) => {
  const { id } = req.params
  const query = "DELETE FROM salary_data WHERE id = ?"
  db.query(query, [id], (err) => {
    if (err) {
      console.error("❌ Delete Salary Data Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json({ message: "Deleted successfully" })
  })
})

// ✅ Salary Deductions (From salaryDeduction.js)
app.use("/api/salary-deduction", salaryDeductionRoutes)

// ✅ TDS Rates
app.get("/api/tds-rates", (req, res) => {
  const query = "SELECT * FROM tds_rates"
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Fetch TDS Rates Error:", err)
      return res.status(500).json({ error: "Database Error" })
    }
    res.json(results)
  })
})

// enquiry form 

// Enhanced GET all enquiries with pagination
app.get('/api/Enquiries', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  db.query(
    "SELECT * FROM Enquiries LIMIT ? OFFSET ?",
    [parseInt(limit), parseInt(offset)],
    (err, results) => {
      if (err) {
        console.error("Database error:", {
          message: err.message,
          sql: err.sql
        });
        return res.status(500).json({ 
          error: "Failed to fetch enquiries",
          details: err.sqlMessage 
        }
      );
      }

      db.query("SELECT COUNT(*) as total FROM Enquiries", (countErr, countResult) => {
        if (countErr) {
          console.error("Count query error:", countErr);
          return res.json(results);
        }

        res.json({
          data: results,
          pagination: {
            total: countResult[0].total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(countResult[0].total / limit)
          }
        });
      });
    }
  );
});

// GET single enquiry by ID with enhanced error handling
app.get('/api/Enquiries/:id', (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  db.query("SELECT * FROM Enquiries WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Database error:", {
        message: err.message,
        sql: err.sql
      });
      return res.status(500).json({ 
        error: "Failed to fetch enquiry",
        details: err.sqlMessage 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Enquiry not found" });
    }

    res.json(results[0]);
  });
});

// Enhanced POST new enquiry with validation
app.post('/api/Enquiries', (req, res) => {
  const enquiryData = req.body;

  // Required field validation
  const requiredFields = ['companyName', 'emailId', 'mobileNo'];
  const missingFields = requiredFields.filter(field => !enquiryData[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missingFields
    });
  }

  // Date formatting
  const formattedData = {
    ...enquiryData,
    dateOfAllocation: enquiryData.dateOfAllocation || null,
    dateOfReallocation: enquiryData.dateOfReallocation || null,
    // createdAt: new Date(),
    // updatedAt: new Date()
  };

  db.query("INSERT INTO Enquiries SET ?", formattedData, (err, result) => {
    if (err) {
      console.error("Database error:", {
        code: err.code,
        errno: err.errno,
        sqlMessage: err.sqlMessage,
        sql: err.sql
      });
      return res.status(500).json({ 
        error: "Failed to create enquiry",
        details: err.sqlMessage,
        code: err.code
      });
    }

    res.status(201).json({
      id: result.insertId,
      ...formattedData
    });
  });
});

// Enhanced PUT update enquiry
app.put("/api/Enquiries/:id", (req, res) => {
  const id = req.params.id;
  const enquiryData = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  // Don't allow updating these fields
  delete enquiryData.id;
  // delete enquiryData.createdAt;

  // enquiryData.updatedAt = new Date();

  db.query(
    "UPDATE Enquiries SET ? WHERE id = ?",
    [enquiryData, id],
    (err, result) => {
      if (err) {
        console.error("Database error:", {
          code: err.code,
          sqlMessage: err.sqlMessage
        });
        return res.status(500).json({ 
          error: "Failed to update enquiry",
          details: err.sqlMessage 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Enquiry not found" });
      }

      db.query("SELECT * FROM Enquiries WHERE id = ?", [id], (fetchErr, rows) => {
        if (fetchErr) {
          console.error("Fetch error:", fetchErr);
          return res.json({ id, ...enquiryData });
        }
        res.json(rows[0]);
      });
    }
  );
});

// Enhanced DELETE enquiry
app.delete("/api/Enquiries/:id", (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  db.query("DELETE FROM Enquiries WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Database error:", {
        code: err.code,
        sqlMessage: err.sqlMessage
      });
      return res.status(500).json({ 
        error: "Failed to delete enquiry",
        details: err.sqlMessage 
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Enquiry not found" });
    }

    res.json({ 
      message: "Enquiry deleted successfully",
      id: parseInt(id)
    });
  });
});

// Enhanced candidate form endpoints with transaction support
const handleCandidateForm = (tableName) => async (req, res) => {
  const formData = req.body;
  const requiredFields = ['enquiry_id'];
  
  const missingFields = requiredFields.filter(field => !formData[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missingFields
    });
  }

  // Start transaction
  db.getConnection((connErr, connection) => {
    if (connErr) {
      console.error("Connection error:", connErr);
      return res.status(500).json({ error: "Database connection failed" });
    }

    connection.beginTransaction(async (txErr) => {
      if (txErr) {
        connection.release();
        console.error("Transaction error:", txErr);
        return res.status(500).json({ error: "Transaction failed to start" });
      }

      try {
        // Verify enquiry exists
        const [enquiry] = await new Promise((resolve) => {
          connection.query(
            "SELECT id FROM Enquiries WHERE id = ?",
            [formData.enquiry_id],
            (err, results) => resolve([err, results])
          );
        });

        if (enquiry) {
          connection.release();
          return res.status(404).json({ error: "Enquiry not found" });
        }

        // Insert form data
        const [insertErr, result] = await new Promise((resolve) => {
          connection.query(
            `INSERT INTO ${tableName} SET ?`,
            formData,
            (err, results) => resolve([err, results])
          );
        });

        if (insertErr) {
          await new Promise((resolve) => {
            connection.rollback(() => {
              connection.release();
              resolve();
            });
          });
          console.error("Insert error:", insertErr);
          return res.status(500).json({ 
            error: `Failed to create ${tableName}`,
            details: insertErr.sqlMessage 
          });
        }

        await new Promise((resolve) => {
          connection.commit((commitErr) => {
            if (commitErr) {
              connection.rollback(() => {
                connection.release();
                console.error("Commit error:", commitErr);
                resolve([commitErr]);
              });
            } else {
              connection.release();
              resolve([null]);
            }
          });
        });

        res.status(201).json({
          id: result.insertId,
          ...formData
        });
      } catch (error) {
        await new Promise((resolve) => {
          connection.rollback(() => {
            connection.release();
            resolve();
          });
        });
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  });
};

app.post('/api/CandidateForm', handleCandidateForm('CandidateForm'));
app.post('/api/CandidateForm2', handleCandidateForm('CandidateForm2'));
app.post('/api/CandidateForm3', handleCandidateForm('CandidateForm3'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", {
    message: err.message,
    stack: err.stack
  });
  res.status(500).json({ error: "Internal server error" });
});
// / Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// File upload endpoint
app.post(
  '/upload',
  upload.fields([
    { name: 'gstCertificate', maxCount: 1 },
    { name: 'contractEmail', maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const files = req.files;
      const fileData = {};

      if (files.gstCertificate) {
        fileData.gstCertificateFile = files.gstCertificate[0].filename;
      }

      if (files.contractEmail) {
        fileData.contractEmailFile = files.contractEmail[0].filename;
      }

      res.status(200).json({
        message: 'Files uploaded successfully',
        files: fileData,
      });
    } catch (error) {
      console.error('Upload Error:', error);
      res.status(500).json({ error: 'File upload failed', details: error.message });
    }
  }
);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Register routes
app.use('/vendor', vendorRoutes);
app.use('/legals_info', legalRoutes);
app.use('/salary-deductions', salaryDeductionRoutes);
app.use("/api/clients_info", client_dataRoutes)
app.use("/franchisee", franchiseeRoutes);
app.use("/employees", employeesRoutes); 
app.use("/api/expenditures", expenditureRoutes)
app.use("/api/jobinvoice", jobInvoiceRoutes);
app.use('/api/vendors', vendorRoutes);







const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
// Start Server
// app.listen(5173, () => {
//   console.log("🚀 Server running on http://localhost:5173");

// });
