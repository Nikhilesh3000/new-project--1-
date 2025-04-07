const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }
  return response.json();
}

// Fetch all employees
export const fetchEmployees = async () => {
  try {
    const response = await fetch(`${API_URL}/employees`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch employees");
    }
    
    const data = await response.json();
    
    // Return the data directly since our backend now returns the array directly
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// Fetch a single employee by ID
export const fetchEmployeeById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`);
    const data = await handleResponse(response);
    return data.data || data;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error;
  }
};

// Create a new employee
export const createEmployee = async (employeeData) => {
  try {
    console.log("Sending employee data to server:", employeeData);

    const response = await fetch(`${API_URL}/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    const data = await handleResponse(response);
    return data.employee || data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Update an existing employee
export const updateEmployee = async (id, employeeData) => {
  try {
    console.log("Updating employee data:", employeeData);

    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    const data = await handleResponse(response);
    return data.employee || data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Delete an employee
export const deleteEmployee = async (id) => {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "DELETE",
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Fetch employee performance
export const fetchEmployeePerformance = async (id) => {
  try {
    const response = await fetch(`${API_URL}/employees/${id}/performance`);
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Add performance record
export const addPerformanceRecord = async (id, performanceData) => {
  try {
    const response = await fetch(`${API_URL}/employees/${id}/performance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(performanceData),
    });

    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Search employees
export const searchEmployees = async (query) => {
  try {
    const response = await fetch(`${API_URL}/employees/search/${query}`);
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Filter employees by department
export const filterEmployeesByDepartment = async (department) => {
  try {
    const response = await fetch(`${API_URL}/employees/filter/department/${department}`);
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};