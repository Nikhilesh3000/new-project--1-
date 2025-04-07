import React, { useState } from 'react';
import './Dashboard.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CalendarPanel from '../components/CalendarPanel';
import MainContent from '../components/MainContent';
import Taxation from '../components/Taxation/Taxation';
import SalaryTable from "../components/SalaryData/salaryTable";
import SalaryDeduction from '../components/SalaryDeduction/salarydeduction';
import FranchiseeTerms from '../components/FranchiseeTerms/franchiseeterms';
import ClientTerms from "../components/ClientTerms/clientterms";
import ExpensesData from "../components/Expenses/expensesdata";
import VendorData from "../components/vendordata/vendordata";
import Enquiryform from "../components/enquirydata/enquiryform";
// import CampusRecruitment from "../components/CampusRecruitment/CampusRecruitment";
import EmployeeData from "../components/employee/employeedata";
import InvoiceData from '../components/invoice/invoicedata';
import CancellationSheet from '../components/cancellation/cancellation';
import LegalForm from '../components/legalform/legalform';
import ClientDataManagement from '../components/clientform/clientform';
import FranchiseDashboard from '../components/franchiseeform/FranchiseForm';
import FranchisePayment from '../components/franchisepayment/franchisepayment';
import ExpenditureTable from '../components/expenditure/expenditure';
import SalaryPayment from '../components/payroll/PayrollProcessing/SalaryPayment';
import PaySlip from '../components/payroll/Reports/PaySlip';
import PaySheet from '../components/payroll/Reports/PaySheet';
import StatutoryCompliance from '../components/payroll/Reports/StatutoryCompliance';
import TaxContinuation from '../components/payroll/Reports/TaxContinuation';
import AttendanceReports from '../components/payroll/Reports/AttendanceReports';
import OtherData from "../components/other_data/otherdata";
import AdminPage from '../components/AdminPage/admin_page';



function Dashboard() {
    const [selectedPage, setSelectedPage] = useState('home');
    
const [sidebar, setSidebar] = useState(false); // initially hidden

const showSidebar = () => setSidebar(!sidebar)

    return (
        <div className="dashboard-container">
            <Header />
            <div className="dashboard-layout">
                <Sidebar onSelectPage={setSelectedPage} />

                <div className="dashboard-content">
                    {selectedPage === 'home' && <MainContent />}
                    {selectedPage === 'taxation' && <Taxation />}
                    {selectedPage === 'salarydata' && <SalaryTable />}
                    {selectedPage === 'salarydeduction' && <SalaryDeduction />}
                    {selectedPage === 'franchiseeterms' && <FranchiseeTerms />}
                    {selectedPage === 'clientterms' && <ClientTerms />}
                    {selectedPage === 'expensesdata' && <ExpensesData />}
                    {/* {selectedPage === 'campusrecruitment' && <CampusRecruitment />} */}
                    {selectedPage === 'vendordata' && <VendorData />}
                    {selectedPage === 'enquirydata' && <Enquiryform />}
                    {selectedPage === 'EmployeeData' && <EmployeeData />}
                    {selectedPage === 'invoicedata' && <InvoiceData />}
                    {selectedPage === 'cancellation' && <CancellationSheet/>}
                    {selectedPage === 'client' && <ClientDataManagement/>}
                    
                    {selectedPage === 'FranchiseForm' && <FranchiseDashboard/>}
                    {selectedPage === 'franchisepayment' && <FranchisePayment/>}
                    {selectedPage === 'expenditure' && <ExpenditureTable/>}
                    {selectedPage === 'SalaryPayment' && <SalaryPayment/>}
                    {selectedPage === 'PaySheet' && <PaySheet/>}
                    {selectedPage === 'PaySlip' && <PaySlip/>}
                    {selectedPage === 'StatutoryCompliance' && <StatutoryCompliance/>}
                    {selectedPage === 'TaxContinuation' && <TaxContinuation/>}
                    {selectedPage === 'AttendanceReports' && <AttendanceReports/>}
                    {selectedPage === 'clientform' && <ClientDataManagement/>}
                    {selectedPage === 'legalform' && <LegalForm/>}
                    {selectedPage === 'otherdata' && <OtherData />}
                    {selectedPage === 'admin_page' && <AdminPage />}
                </div>

                <div className="calendar-panel-container">
                    <CalendarPanel />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
