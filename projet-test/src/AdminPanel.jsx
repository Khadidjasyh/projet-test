import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');

  // Charger tous les utilisateurs
  const fetchUsers = async () => {
    const res = await fetch('/api/auth/admin/users');
    const data = await res.json();
    setUsers(data);
  };

  // Charger tous les signalements
  const fetchReports = async () => {
    const res = await fetch('/api/auth/admin/reports');
    const data = await res.json();
    setReports(data);
  };

  useEffect(() => {
    fetchUsers();
    fetchReports();
  }, []);

  // Edition utilisateur
  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditForm({ ...user });
  };
  const handleEditChange = (e) => {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleEditSave = async () => {
    const res = await fetch(`/api/auth/admin/user/${editUserId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setMessage('Utilisateur modifié !');
      setEditUserId(null);
      fetchUsers();
    } else {
      setMessage('Erreur lors de la modification');
    }
  };

  // Traitement signalement
  const handleReportDone = async (id) => {
    const res = await fetch(`/api/auth/admin/report/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'traite' }),
    });
    if (res.ok) {
      setMessage('Signalement traité !');
      fetchReports();
    } else {
      setMessage('Erreur lors du traitement');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h2>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <table className="min-w-full bg-white border mb-8">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 border">Nom</th>
            <th className="px-2 py-2 border">Prénom</th>
            <th className="px-2 py-2 border">Username</th>
            <th className="px-2 py-2 border">Email</th>
            <th className="px-2 py-2 border">Téléphone</th>
            <th className="px-2 py-2 border">Rôle</th>
            <th className="px-2 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              {editUserId === user.id ? (
                <>
                  <td className="border"><input name="name" value={editForm.name} onChange={handleEditChange} className="w-full" /></td>
                  <td className="border"><input name="prenom" value={editForm.prenom} onChange={handleEditChange} className="w-full" /></td>
                  <td className="border"><input name="username" value={editForm.username} onChange={handleEditChange} className="w-full" /></td>
                  <td className="border"><input name="email" value={editForm.email} onChange={handleEditChange} className="w-full" /></td>
                  <td className="border"><input name="telephone" value={editForm.telephone} onChange={handleEditChange} className="w-full" /></td>
                  <td className="border">
                    <select name="role" value={editForm.role} onChange={handleEditChange} className="w-full">
                      <option value="admin">admin</option>
                      <option value="user">user</option>
                    </select>
                  </td>
                  <td className="border">
                    <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={handleEditSave}>Enregistrer</button>
                    <button className="ml-2 px-2 py-1 bg-gray-400 text-white rounded" onClick={() => setEditUserId(null)}>Annuler</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border">{user.name}</td>
                  <td className="border">{user.prenom}</td>
                  <td className="border">{user.username}</td>
                  <td className="border">{user.email}</td>
                  <td className="border">{user.telephone}</td>
                  <td className="border">{user.role}</td>
                  <td className="border">
                    <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => handleEdit(user)}>Modifier</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl font-bold mb-4">Signalements utilisateurs</h2>
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 border">Utilisateur</th>
            <th className="px-2 py-2 border">Message</th>
            <th className="px-2 py-2 border">Statut</th>
            <th className="px-2 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id} className="hover:bg-gray-50">
              <td className="border">{report.User ? `${report.User.name} ${report.User.prenom}` : report.userId}</td>
              <td className="border">{report.message}</td>
              <td className="border">{report.status}</td>
              <td className="border">
                {report.status !== 'traite' && (
                  <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={() => handleReportDone(report.id)}>Traiter</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel; 