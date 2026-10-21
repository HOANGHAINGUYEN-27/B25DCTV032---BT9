export default function StudentTable({ students, onEdit, onDelete }) {
  if (!students.length) return <p className="card">Không có sinh viên nào.</p>;

  return (
    <table className="card">
      <thead>
        <tr>
          <th>#</th>
          <th>Họ tên</th>
          <th>Lớp</th>
          <th>GPA</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s, i) => (
          <tr key={s.id}>
            <td>{i + 1}</td>
            <td>{s.name}</td>
            <td>{s.className}</td>
            <td>{s.gpa}</td>
            <td className="actions">
              <button onClick={() => onEdit(s)}>Sửa</button>
              <button className="danger" onClick={() => onDelete(s)}>Xóa</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
