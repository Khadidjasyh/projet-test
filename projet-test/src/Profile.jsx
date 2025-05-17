import React, { useState } from 'react';

const Profile = () => {
  // Récupération de l'utilisateur depuis le localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [form, setForm] = useState({
    username: user.username || '',
    telephone: user.telephone || '',
    name: user.name || '',
    prenom: user.prenom || '',
    email: user.email || '',
    role: user.role || '',
  });
  const [editMode, setEditMode] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [reportMsg, setReportMsg] = useState('');
  const [message, setMessage] = useState('');

  const isAdmin = user.role === 'admin';

  // Mise à jour du profil
  const handleSave = async () => {
    try {
      const url = isAdmin
        ? `/api/auth/admin/user/${user.id}`
        : '/api/auth/profile';
      const method = 'PATCH';
      const body = isAdmin
        ? { ...form }
        : { id: user.id, username: form.username, telephone: form.telephone, role: user.role };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      const updated = await res.json();
      localStorage.setItem('user', JSON.stringify(updated));
      setMessage('Profil mis à jour !');
      setEditMode(false);
    } catch (err) {
      setMessage('Erreur : ' + err.message);
    }
  };

  // Signalement d'erreur
  const handleReport = async () => {
    try {
      const res = await fetch('/api/auth/profile/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, message: reportMsg }),
      });
      if (!res.ok) throw new Error('Erreur lors du signalement');
      setMessage('Signalement envoyé !');
      setReportMode(false);
      setReportMsg('');
    } catch (err) {
      setMessage('Erreur : ' + err.message);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Profil</h2>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <div className="mb-4">
        <label className="block font-semibold">Nom :</label>
        <input
          className="w-full border rounded p-2"
          value={form.name}
          disabled={!isAdmin || !editMode}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Prénom :</label>
        <input
          className="w-full border rounded p-2"
          value={form.prenom}
          disabled={!isAdmin || !editMode}
          onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Username :</label>
        <input
          className="w-full border rounded p-2"
          value={form.username}
          disabled={!editMode}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Téléphone :</label>
        <input
          className="w-full border rounded p-2"
          value={form.telephone}
          disabled={!editMode}
          onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Email :</label>
        <input
          className="w-full border rounded p-2"
          value={form.email}
          disabled={!isAdmin || !editMode}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Rôle :</label>
        {isAdmin && editMode ? (
          <select
            className="w-full border rounded p-2"
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
          >
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
        ) : (
          <input
            className="w-full border rounded p-2"
            value={form.role}
            disabled
          />
        )}
      </div>
      <div className="flex gap-2">
        {!editMode ? (
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setEditMode(true)}>
            Modifier
          </button>
        ) : (
          <>
            <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSave}>
              Enregistrer
            </button>
            <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setEditMode(false)}>
              Annuler
            </button>
          </>
        )}
        {!isAdmin && (
          <button className="px-4 py-2 bg-yellow-500 text-white rounded" onClick={() => setReportMode(r => !r)}>
            Signaler une erreur
          </button>
        )}
      </div>
      {reportMode && (
        <div className="mt-4">
          <textarea
            className="w-full border rounded p-2"
            placeholder="Décris l'erreur à signaler..."
            value={reportMsg}
            onChange={e => setReportMsg(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button className="px-4 py-2 bg-yellow-600 text-white rounded" onClick={handleReport}>
              Envoyer le signalement
            </button>
            <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => { setReportMode(false); setReportMsg(''); }}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 