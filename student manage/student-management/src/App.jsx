import { useState, useMemo, useCallback } from "react";
import useFetch from "./hooks/useFetch";
import { useTheme } from "./context/ThemeContext";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import "./App.css";

const API_URL = "https://6ad8e131f89c5702ed9a3b2c.mockapi.io/students";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { data: students, setData, loading, error } = useFetch(API_URL);
  const [keyword, setKeyword] = useState("");
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    return k ? students.filter((s) => s.name.toLowerCase().includes(k)) : students;
  }, [students, keyword]);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        if (editing) {
          const res = await fetch(`${API_URL}/${editing.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const updated = await res.json();
          setData((list) => list.map((s) => (s.id === updated.id ? updated : s)));
          setEditing(null);
        } else {
          const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const created = await res.json();
          setData((list) => [...list, created]);
        }
      } catch {
        alert("Có lỗi xảy ra, vui lòng thử lại");
      }
    },
    [editing, setData]
  );

  const handleDelete = useCallback(
    async (student) => {
      if (!window.confirm(`Bạn có chắc muốn xóa sinh viên "${student.name}"?`)) return;
      try {
        await fetch(`${API_URL}/${student.id}`, { method: "DELETE" });
        setData((list) => list.filter((s) => s.id !== student.id));
        if (editing?.id === student.id) setEditing(null);
      } catch {
        alert("Xóa thất bại, vui lòng thử lại");
      }
    },
    [editing, setData]
  );

  return (
    <div className="container">
      <header>
        <h1>Quản lý sinh viên</h1>
        <button onClick={toggleTheme}>{theme === "light" ? "🌙 Tối" : "☀️ Sáng"}</button>
      </header>

      <StudentForm editing={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />

      <input
        className="search"
        placeholder="Tìm kiếm theo tên..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error">Lỗi: {error}</p>}
      {!loading && !error && (
        <StudentTable students={filtered} onEdit={setEditing} onDelete={handleDelete} />
      )}
    </div>
  );
}
