"use client"

import { useState } from "react"
import "./Sidebar.css"
import { MdCategory, MdOutlineRealEstateAgent, MdOutlineWarningAmber } from "react-icons/md"
import { BiHomeAlt } from "react-icons/bi"
import { FaRegFileAlt, FaRegCalendarAlt } from "react-icons/fa"
import { AiOutlinePlus } from "react-icons/ai"
import { FiSettings } from "react-icons/fi"
import { FaChevronDown, FaChevronUp, FaSignOutAlt, FaBars } from "react-icons/fa"

function SideBar({ onSelectPage }) {
  // Added onSelectPage for navigation
  const [openMenus, setOpenMenus] = useState({})
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // State for services dropdown
  const [sidebar, setSidebar] = useState(false)

  const showSidebar = () => setSidebar(!sidebar)

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }))
  }

  return (
    <div className="sidebar-container">
      <div className={`sidebar ${sidebar ? "sidebar-active" : "sidebar-inactive"}`}>
        <div className="sidebar-header">
          <button className="hamburger-toggle" onClick={showSidebar}>
            <FaBars />
          </button>
        </div>
        <ul className="menu">
          {/* Master Data with Dropdown */}
          <SideBarItem
            icon={<MdCategory />}
            title="Master Data"
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            name="masterData"
            submenu={[
              { name: "Taxation", action: () => onSelectPage("taxation") }, // Navigate on click
              { name: "Salary Data", action: () => onSelectPage("salarydata") },
              { name: "Salary Deduction", action: () => onSelectPage("salarydeduction") },
              { name: "Franchisee Terms", action: () => onSelectPage("franchiseeterms") },
              { name: "Client Terms", action: () => onSelectPage("clientterms") },
              { name: "Expenses", action: () => onSelectPage("expensesdata") },
              { name: "Other Data", action: () => onSelectPage("otherdata") },
            ]}
          />

          <SideBarItem
            icon={<BiHomeAlt />}
            title="In House Data"
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            name="inHouseData"
            submenu={[
              { name: "Employee Data", action: () => onSelectPage("EmployeeData") }, // Navigate on click
              { name: "Franchisee Data", action: () => onSelectPage("FranchiseForm") },
              { name: "Client Data", action: () => onSelectPage("clientform") },
              { name: "Legal Data", action: () => onSelectPage("legalform") },
              { name: "Enquiry Data", action: () => onSelectPage("enquirydata") },
              { name: "Vendor Data", action: () => onSelectPage("vendordata") },
            ]}
          />
          <SideBarItem
            icon={<MdOutlineRealEstateAgent />}
            title="Transaction Data"
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            name="transactionData"
            submenu={[
              { name: "Invoice", action: () => onSelectPage("invoicedata") }, // Navigate on click
              { name: "Credit Note/Cancellation", action: () => onSelectPage("cancellation") },
              { name: "Franchisee Payment", action: () => onSelectPage("franchisepayment") },
              { name: "Expenditure", action: () => onSelectPage("expenditure") },
              { name: "Payroll ", action: () => onSelectPage("SalaryPayment") },
              { name: "Pay Slip ", action: () => onSelectPage("PaySlip") },
              { name: "Pay Sheet ", action: () => onSelectPage("PaySheet") },
              { name: "Statutory Compliance", action: () => onSelectPage("StatutoryCompliance") },
              { name: "Tax Continuation", action: () => onSelectPage("TaxContinuation") },
              { name: "Attendance Reports", action: () => onSelectPage("AttendanceReports") },
            ]}
          />
          <SideBarItem
            icon={<FaRegFileAlt />}
            title="Reports"
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            name="reports"
          />
          <SideBarItem
            icon={<FaRegCalendarAlt />}
            title="MIS Reports"
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            name="misReports"
          />
          <SideBarItem
            icon={<AiOutlinePlus />}
            title="Add on Feature"
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            name="addonFeature"
            submenu={[
              { name: "Campus Recruitment", action: () => onSelectPage("campusrecruitment") }, // Navigate on click
            ]}
          />

          <SideBarItem
            icon={<FiSettings />}
            title="Admin Page"
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            name="admin_page"
            submenu={[{ name: "Approval", action: () => onSelectPage("admin_page") }]}
          />

          <SideBarItem
            icon={<MdOutlineWarningAmber />}
            title="Due"
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            name="due"
          />

          {/* Logout Button Section */}
          <div className="logout-container">
            <button className="logout-btn">
              <FaSignOutAlt /> Log Out
            </button>
          </div>
        </ul>
      </div>

      {/* Hamburger toggle outside sidebar for when sidebar is closed */}
      {!sidebar && (
        <button className="hamburger-toggle-fixed" onClick={showSidebar}>
          <FaBars />
        </button>
      )}
    </div>
  )
}

function SideBarItem({ icon, title, openMenus, toggleMenu, name, submenu }) {
  const isOpen = openMenus[name]

  return (
    <li className="menu-item">
      <div className="menu-header" onClick={() => toggleMenu(name)}>
        {icon} <span>{title}</span>
        {isOpen ? <FaChevronUp className="arrow" /> : <FaChevronDown className="arrow" />}
      </div>
      {isOpen && submenu && (
        <ul className="submenu">
          {submenu.map((item, index) => (
            <li key={index} className="submenu-item" onClick={item.action ? item.action : undefined}>
              <span className="submenu-arrow">⮞</span> {item.name}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default SideBar

