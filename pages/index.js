import { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setMessage("Please fill in all fields");
      return;
    }
    setMessage("Sending...");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Sending the form data to the API
      });
      const result = await response.json();
      if (result.message === "Success") {
        setMessage("Registration successful!");
      } else {
        setMessage("Failed to register");
      }
    } catch (error) {
      setMessage("Error sending data");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input"
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            onChange={handleChange}
            value={formData.email}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="input"
            onChange={handleChange}
            value={formData.phone}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 mt-4 rounded-lg"
          >
            Register
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
