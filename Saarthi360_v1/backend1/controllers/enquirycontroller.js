// authController.js
import db from "../config/db.js";

// Utility function for formatting dates
const formatDateForDB = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
};

// Insert Enquiry
// export const addEnquiry = (req, res) => {
//     const sql = `INSERT INTO Enquiries (companyName, bdMemberName, teamLeaderName, franchiseeName, hrExecutiveName, 
//                   designation, gstNo, addressLine1, emailId, mobileNo, website, placementFees, positionname, salary, 
//                   creditPeriod, replacementPeriod, enquiryStatus, clientStatus, dateOfAllocation, dateOfReallocation, 
//                   newTeamLeader, nameOfFranchisee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    
//     const values = Object.values(req.body);
    
//     db.query(sql, values, (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json({ message: "Enquiry added successfully!", id: result.insertId });
//     });
// };

export const addEnquiry = (req, res) => {
    const sql = `INSERT INTO Enquiries (companyName, bdMemberName, teamLeaderName, franchiseeName, hrExecutiveName, 
                  designation, gstNo, addressLine1, emailId, mobileNo, website, placementFees, positionname, salary, 
                  creditPeriod, replacementPeriod, enquiryStatus, dateOfAllocation, dateOfReallocation, 
                  newTeamLeader, nameOfFranchisee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
        req.body.companyName,
        req.body.bdMemberName,
        req.body.teamLeaderName,
        req.body.franchiseeName,
        req.body.hrExecutiveName,
        req.body.designation,
        req.body.gstNo,
        req.body.addressLine1,
        req.body.emailId,
        req.body.mobileNo,
        req.body.website,
        req.body.placementFees,
        req.body.positionname,
        req.body.salary,
        req.body.creditPeriod,
        req.body.replacementPeriod,
        req.body.enquiryStatus,
        req.body.dateOfAllocation,
        req.body.dateOfReallocation,
        req.body.newTeamLeader,
        req.body.nameOfFranchisee  // 🛠 Ensure this value is included
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Enquiry added successfully!", id: result.insertId });
    });
};

// Insert Candidate Form 1
export const addCandidateForm1 = (req, res) => {
    const sql = `INSERT INTO CandidateForm1 (candidateName, mobileNumber, emailId, dateOfBirth, sourceOfCV, hireFor, salaryOffer, dateOfJoining, yearofexp) 
                 VALUES (?,?,?,?,?,?,?,?,?)`;
    
    const values = Object.values(req.body);
    
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Candidate Form 1 added successfully!", id: result.insertId });
    });
};

// Insert Candidate Form 2
export const addCandidateForm2 = (req, res) => {
    const sql = `INSERT INTO CandidateForm2 (enquiry_id, billNo, serviceCharge, billdate, reasonForCreditNote) VALUES (?,?,?,?,?)`;
    
    const values = Object.values(req.body);
    
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Candidate Form 2 added successfully!", id: result.insertId });
    });
};

// Insert Candidate Form 3
export const addCandidateForm3 = (req, res) => {
    const sql = `INSERT INTO CandidateForm3 (enquiry_id, candidateName, billDate, billNo, revisionDetails) VALUES (?,?,?,?,?)`;
    
    const values = Object.values(req.body);
    
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Candidate Form 3 added successfully!", id: result.insertId });
    });
};

// Insert Cancellation Data
export const addCancellationData = (req, res) => {
    const sql = `INSERT INTO CancellationData (emailAddress, nameOfFranchise, nameOfCompany, cancelChange, billNo, 
                  serviceChargeAmount, reasonOfCancel, candidateName, detailsChangesRequired, creditNoteDate, 
                  creditNoteNo, newBillNo, newBillDate, candidateForm2_id, candidateForm3_id) 
                  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    
    const values = Object.values(req.body);
    
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Cancellation data added successfully!", id: result.insertId });
    });
};