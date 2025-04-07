import React, { useEffect, useState } from "react";
import "./expenses.css";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ category: "", amount: "", date: "", description: "" });

  // Fetch expenses from backend
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = () => {
    fetch("http://localhost:8080/api/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.error("Error fetching expenses:", err));
  };

  // Add new expense
  const addExpense = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense),
    })
      .then(() => {
        setNewExpense({ category: "", amount: "", date: "", description: "" });
        fetchExpenses(); // Refresh list
      })
      .catch((err) => console.error("Error adding expense:", err));
  };

  // Delete an expense
  const deleteExpense = (id) => {
    fetch(`http://localhost:8080/api/expenses/${id}`, { method: "DELETE" })

      .then(() => fetchExpenses()) // Refresh list
      .catch((err) => console.error("Error deleting expense:", err));
  };

  return (
    <div className="expenses-container">
      <h2>Expenses</h2>

      {/* Add Expense Form */}
      <form onSubmit={addExpense}>
        <input
          type="text"
          placeholder="Category"
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          required
        />
        <input
          type="date"
          value={newExpense.date}
          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
        />
        <button type="submit">Add Expense</button>
      </form>

      {/* Expense Table */}
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.category}</td>
                <td>{expense.amount}</td>
                <td>{expense.date}</td>
                <td>{expense.description}</td>
                <td>
                  <button onClick={() => deleteExpense(expense.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No expenses found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Expenses;
