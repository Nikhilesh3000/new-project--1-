// import { useState, useEffect } from "react"
// import { FiSearch, FiDownload, FiEdit, FiTrash2 } from "react-icons/fi"
// import { AiOutlinePlus } from "react-icons/ai"
// import ClientForm from "./clientform"
// import axios from "axios"

// // API base URL - adjust this to match your backend URL
// const API_URL = "http://localhost:5000"

// const Client= () => {
//   const [clients, setClients] = useState([])
//   const [showForm, setShowForm] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [editingClient, setEditingClient] = useState(null)
//   const [selectedMonth, setSelectedMonth] = useState("")
//   const [selectedYear, setSelectedYear] = useState("")
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Financial Years
//   const financialYears = ["FY 2022-23", "FY 2023-24", "FY 2024-25"]

//   // Months
//   const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ]

//   // Fetch clients from the backend
//   const fetchClients = async () => {
//     try {
//       setLoading(true)
//       const response = await axios.get(`${API_URL}/clients`)
      
//       // Process the data to include additionalPeople
//       const clientsWithDetails = await Promise.all(
//         response.data.map(async (client) => {
//           try {
//             const detailResponse = await axios.get(`${API_URL}/clients/${client.id}`)
//             return detailResponse.data
//           } catch (err) {
//             console.error(`Error fetching details for client ${client.id}:`, err)
//             return { ...client, additionalPeople: [] }
//           }
//         })
//       )
      
//       setClients(clientsWithDetails)
//       setError(null)
//     } catch (err) {
//       console.error("Error fetching clients:", err)
//       setError("Failed to load clients. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Load clients on component mount
//   useEffect(() => {
//     fetchClients()
//   }, [])

//   // Function to handle saving client data
//   const handleSaveClient = (clientData) => {
//     if (editingClient !== null) {
//       // Update existing client in state
//       const updatedClients = clients.map((client) => 
//         client.id === editingClient.id ? clientData : client
//       )
//       setClients(updatedClients)
//       setEditingClient(null)
//     } else {
//       // Add new client to state
//       setClients([...clients, clientData])
//     }
//     setShowForm(false)
    
//     // Refresh the client list from the server
//     fetchClients()
//   }

//   // Function to handle editing a client
//   const handleEditClient = (client) => {
//     setEditingClient(client)
//     setShowForm(true)
//   }

//   // Function to handle deleting a client
//   const handleDeleteClient = async (clientId) => {
//     if (window.confirm("Are you sure you want to delete this client?")) {
//       try {
//         await axios.delete(`${API_URL}/clients/${clientId}`)
//         // Update state after successful deletion
//         const updatedClients = clients.filter((client) => client.id !== clientId)
//         setClients(updatedClients)
//       } catch (err) {
//         console.error("Error deleting client:", err)
//         alert("Failed to delete client. Please try again.")
//       }
//     }
//   }

//   // Function to download client data as CSV
//   const downloadCSV = () => {
//     if (clients.length === 0) {
//       alert("No data to download")
//       return
//     }

//     // Get all possible headers from all clients
//     const allHeaders = new Set()
//     clients.forEach((client) => {
//       Object.keys(client).forEach((key) => {
//         if (key !== "additionalPeople") {
//           allHeaders.add(key)
//         } else {
//           // Add headers for additionalPeople fields
//           client.additionalPeople.forEach((person, index) => {
//             Object.keys(person).forEach((personKey) => {
//               allHeaders.add(`additionalPerson_${index + 1}_${personKey}`)
//             })
//           })
//         }
//       })
//     })

//     const headers = Array.from(allHeaders)

//     // Create CSV content
//     let csvContent = headers.join(",") + "\n"

//     clients.forEach((client) => {
//       const row = headers
//         .map((header) => {
//           if (header.startsWith("additionalPerson_")) {
//             // Extract additionalPeople data
//             const [_, index, key] = header.split("_")
//             const personIndex = Number.parseInt(index) - 1
//             return client.additionalPeople &&
//               client.additionalPeople[personIndex] &&
//               client.additionalPeople[personIndex][key]
//               ? `"${client.additionalPeople[personIndex][key]}"`
//               : '""'
//           } else {
//             return client[header] ? `"${client[header]}"` : '""'
//           }
//         })
//         .join(",")
//       csvContent += row + "\n"
//     })

//     // Create and download the file
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
//     const url = URL.createObjectURL(blob)
//     const link = document.createElement("a")
//     link.setAttribute("href", url)
//     link.setAttribute("download", "client_data.csv")
//     link.style.visibility = "hidden"
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   // Filter clients based on search term and date filters
//   const filteredClients = clients.filter((client) => {
//     const searchTermLower = searchTerm.toLowerCase()
//     const matchesSearch =
//       (client.companyName && client.companyName.toLowerCase().includes(searchTermLower)) ||
//       (client.hrExecutiveName && client.hrExecutiveName.toLowerCase().includes(searchTermLower)) ||
//       (client.address && client.address.toLowerCase().includes(searchTermLower)) ||
//       (client.designation && client.designation.toLowerCase().includes(searchTermLower)) ||
//       (client.bdMembersName && client.bdMembersName.toLowerCase().includes(searchTermLower))

//     // If no month or year filter is applied, just use search filter
//     if (!selectedMonth && !selectedYear) return matchesSearch

//     // For demonstration purposes, we'll filter by acquisition date
//     let matchesFilters = true

//     if (selectedMonth && client.dateClientAcquired) {
//       // Extract month from date (assuming format like "dd/mm/yyyy")
//       const [day, month, year] = client.dateClientAcquired.split('/').map(Number)
//       const date = new Date(year, month - 1, day)
//       const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date)
//       matchesFilters = matchesFilters && monthName === selectedMonth
//     }

//     if (selectedYear && client.dateClientAcquired) {
//       // Extract year from date and match with financial year
//       const [day, month, year] = client.dateClientAcquired.split('/').map(Number)
      
//       // Simple matching - you might need more complex logic for financial years
//       matchesFilters = matchesFilters && selectedYear.includes(year.toString())
//     }

//     return matchesSearch && matchesFilters
//   })

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-purple-800">Client Data</h1>
//             <p className="text-gray-500 text-sm">All the company clients are listed here</p>
//           </div>
//           <button
//             className="bg-purple-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg flex items-center gap-2 shadow-md hover:bg-purple-800 w-full md:w-auto justify-center"
//             onClick={() => {
//               setEditingClient(null)
//               setShowForm(true)
//             }}
//           >
//             <AiOutlinePlus /> Add Client
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
//           <div className="relative w-full md:w-1/2">
//             <input
//               type="text"
//               placeholder="Search"
//               className="w-full px-4 py-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//           </div>

//           <div className="flex flex-wrap gap-4">
//             {/* Financial Year Dropdown */}
//             <select
//               className="px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(e.target.value)}
//             >
//               <option value="">Select Year</option>
//               {financialYears.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>

//             {/* Month Dropdown */}
//             <select
//               className="px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(e.target.value)}
//             >
//               <option value="">Select Month</option>
//               {months.map((month) => (
//                 <option key={month} value={month}>
//                   {month}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Loading and Error States */}
//         {loading && <div className="text-center py-4">Loading clients...</div>}
//         {error && <div className="text-center text-red-500 py-4">{error}</div>}

//         {/* Client List or Add Client Section */}
//         {!loading && !error && clients.length === 0 && !showForm ? (
//           <div
//             className="border-dashed border-2 border-gray-300 rounded-lg w-full md:w-3/4 lg:w-1/2 min-h-[30vh] flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:border-purple-500 hover:text-purple-500 mx-auto mt-6"
//             onClick={() => {
//               setEditingClient(null)
//               setShowForm(true)
//             }}
//           >
//             <AiOutlinePlus size={28} />
//             <p className="text-lg">Click here to add Client Data</p>
//           </div>
//         ) : !showForm ? (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-4 flex justify-between items-center">
//               <h2 className="text-xl font-semibold text-gray-800">Client Data</h2>
//               {clients.length > 0 && (
//                 <button className="text-gray-600 hover:text-purple-700" onClick={downloadCSV} title="Download as CSV">
//                   <FiDownload size={20} />
//                 </button>
//               )}
//             </div>

//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     {/* Basic Company Details */}
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Company Name
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       BD Members
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Address
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       HR Executive Name
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Designation
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Phone Number
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Email ID
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       State
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       City
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Pin Code
//                     </th>

//                     {/* Business Information */}
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Industry
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Sub-Industry
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Website
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Placement Fees
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Credit Period
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Replacement Period
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Company Status
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       GST Number
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       No. of Employees
//                     </th>

//                     {/* Franchise & Team Details */}
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Team Leader
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Franchisee Name
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Date of Client Allocation
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Date Client Acquired
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Reallocation Status
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Date Client Reallocation
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       New Franchisee
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       New Team Leader
//                     </th>

//                     {/* Additional People in Company */}
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Additional Person Designation
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Additional Person Email
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Additional Person Phone
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Additional Person Landline
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Additional Person City
//                     </th>

//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredClients.map((client) => (
//                     <tr key={client.id} className="hover:bg-gray-50">
//                       {/* Basic Company Details */}
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.companyName || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.bdMembersName || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.address || "xxx"}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.hrExecutiveName || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.designation || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.phoneNumber || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.email || "xxx"}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.state || "xxx"}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.city || "xxx"}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.pinCode || "xxx"}</td>

//                       {/* Business Information */}
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.industry || "xxx"}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.subIndustry || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.website || "xxx"}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.placementFees || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.creditPeriod || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.replacementPeriod || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.companyStatus || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.gstNumber || "xxx"}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.numEmployees || "xxx"}
//                       </td>

//                       {/* Franchise & Team Details */}
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.teamLeader || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.franchiseeName || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.dateClientAllocation || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.dateClientAcquired || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.reallocationStatus || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.dateClientReallocation || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.newFranchisee || "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.newTeamLeader || "xxx"}
//                       </td>

//                       {/* Additional People in Company */}
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.additionalPeople && client.additionalPeople[0]
//                           ? client.additionalPeople[0].designation || "xxx"
//                           : "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.additionalPeople && client.additionalPeople[0]
//                           ? client.additionalPeople[0].email || "xxx"
//                           : "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.additionalPeople && client.additionalPeople[0]
//                           ? client.additionalPeople[0].phone || "xxx"
//                           : "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.additionalPeople && client.additionalPeople[0]
//                           ? client.additionalPeople[0].landline || "xxx"
//                           : "xxx"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {client.additionalPeople && client.additionalPeople[0]
//                           ? client.additionalPeople[0].city || "xxx"
//                           : "xxx"}
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <div className="flex space-x-3">
//                           <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditClient(client)}>
//                             <FiEdit size={18} />
//                           </button>
//                           <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteClient(client.id)}>
//                             <FiTrash2 size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Add Client Data button at the bottom of the table */}
//             <div
//               className="border-dashed border-2 border-gray-300 rounded-lg p-4 m-4 flex items-center justify-center cursor-pointer text-gray-500 hover:border-purple-500 hover:text-purple-500"
//               onClick={() => {
//                 setEditingClient(null)
//                 setShowForm(true)
//               }}
//             >
//               <AiOutlinePlus className="mr-2" />
//               <span>Click here to add Client Data</span>
//             </div>
//           </div>
//         ) : null}

//         {/* Form Modal */}
//         {showForm && (
//           <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
//               <ClientForm
//                 onClose={() => {
//                   setShowForm(false)
//                   setEditingClient(null)
//                 }}
//                 initialData={editingClient}
//                 onSave={handleSaveClient}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Client