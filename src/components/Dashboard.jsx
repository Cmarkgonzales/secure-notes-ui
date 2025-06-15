import React, { useEffect, useState } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../services/api';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', id: null });
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await getNotes();
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (form.id) {
        await updateNote(form.id, form);
      } else {
        await createNote(form);
      }
      setForm({ title: '', content: '', id: null });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (note) => {
    setForm(note);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      await deleteNote(id);
      fetchNotes();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Secure Notes</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded shadow">
          Logout
        </button>
      </nav>

      <div className="max-w-3xl mx-auto mt-8 p-4">
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">{form.id ? 'Edit Note' : 'Add New Note'}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-3 border rounded focus:outline-blue-500"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Content"
              className="w-full p-3 border rounded focus:outline-blue-500"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow">
              {form.id ? 'Update Note' : 'Add Note'}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading notes...</div>
        ) : (
          <div className="space-y-4">
            {notes?.length === 0 ? (
              <div className="text-center text-gray-500">No notes yet.</div>
            ) : (
              notes?.map((note) => (
                <div key={note.ID} className="bg-white p-4 rounded shadow flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                    <p className="text-gray-600 mt-2">{note.content}</p>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => handleEdit(note)} className="bg-yellow-400 text-white px-3 py-1 rounded shadow">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(note.ID)} className="bg-red-500 text-white px-3 py-1 rounded shadow">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
