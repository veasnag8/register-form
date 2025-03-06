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
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.message === "Success") {
        setMessage("Registration successful!");
      } else {
        setMessage("Registration successful!");
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
            className="input-field"
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-field"
            onChange={handleChange}
            value={formData.email}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="input-field"
            onChange={handleChange}
            value={formData.phone}
          />
          <button
            type="submit"
            className="submit-button"
          >
            Register
          </button>
        </form>
        {message && <p className={`message ${message.includes("Error") ? "error" : "success"}`}>{message}</p>}
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
          transition: border-color 0.3s;
        }

        .input-field:focus {
          border-color: #007bff; /* Blue color */
          outline: none;
        }

        .submit-button {
          width: 100%;
          background-color: #007bff; /* Blue color */
          color: white;
          padding: 12px;
          margin-top: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .submit-button:hover {
          background-color: #0056b3; /* Darker blue */
        }

        .message {
          margin-top: 10px;
          text-align: center;
        }

        .success {
          color: green;
        }

        .error {
          color: red;
        }
      `}</style>
    </div>
  );
}
