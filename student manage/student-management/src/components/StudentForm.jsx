import { useState, useEffect } from "react";

const empty = { name: "", className: "", gpa: "" };

export default function StudentForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(editing ? { name: editing.name, className: editing.className, gpa: String(editing.gpa) } : empty);
    setErrors({});
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Vui lòng nhập họ tên";
    if (!form.className.trim()) err.className = "Vui lòng nhập lớp";
    const gpa = Number(form.gpa);
    if (form.gpa === "" || Number.isNaN(gpa)) err.gpa = "GPA phải là số";
    else if (gpa < 0 || gpa > 4) err.gpa = "GPA phải từ 0 đến 4";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    onSubmit({
      name: form.name.trim(),
      className: form.className.trim(),
      gpa: Number(form.gpa),
    });
    setForm(empty);
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>{editing ? "Sửa sinh viên" : "Thêm sinh viên"}</h2>
      <div className="field">
        <input name="name" placeholder="Họ tên" value={form.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      <div className="field">
        <input name="className" placeholder="Lớp" value={form.className} onChange={handleChange} />
        {errors.className && <span className="error">{errors.className}</span>}
      </div>
      <div className="field">
        <input name="gpa" placeholder="GPA (0 - 4)" value={form.gpa} onChange={handleChange} />
        {errors.gpa && <span className="error">{errors.gpa}</span>}
      </div>
      <div className="actions">
        <button type="submit">{editing ? "Cập nhật" : "Thêm"}</button>
        {editing && (
          <button type="button" className="secondary" onClick={onCancel}>
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}
