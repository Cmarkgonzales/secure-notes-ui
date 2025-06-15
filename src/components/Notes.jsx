import React, { useEffect, useState } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../services/notes';
import { clearToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.data);
    } catch {
      alert("Failed to load notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateNote(editing, form);
      } else {
        await createNote(form);
      }
      setForm({ title: '', content: '' });
      setEditing(null);
      fetchNotes();
    } catch {
      alert("Operation failed");
    }
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditing(note.ID);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await deleteNote(id);
      fetchNotes();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Secure Notes</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <div className="flex space-x-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              {editing ? 'Update' : 'Add'} Note
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => { setEditing(null); setForm({ title: '', content: '' }) }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 space-y-4">
          {notes.map((note) => (
            <div key={note.ID} className="border p-4 rounded bg-gray-50">
              <h3 className="font-semibold text-lg">{note.title}</h3>
              <p>{note.content}</p>
              <div className="mt-2 flex space-x-2">
                <button onClick={() => handleEdit(note)} className="bg-yellow-400 text-white px-3 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(note.ID)} className="bg-red-400 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Notes;
