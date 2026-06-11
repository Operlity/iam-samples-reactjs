import React, { useEffect, useMemo, useState } from 'react';
import { contactDb } from '../services/contactDb';

const emptyForm = { name: '', email: '', phone: '' };

function ContactManagement() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone && c.phone.includes(searchQuery))
    );
  }, [contacts, searchQuery]);

  const loadContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const items = await contactDb.getAllContacts();
      setContacts(items);
    } catch (e) {
      setError('Failed to load contacts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Auto-clear success messages after 4 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }

    if (!validateEmail(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSuccess('');

    try {
      if (isEditing) {
        await contactDb.updateContact(editingId, form);
        setSuccess('Contact updated successfully!');
      } else {
        await contactDb.addContact(form);
        setSuccess('Contact added successfully!');
      }

      resetForm();
      await loadContacts();
    } catch (e) {
      setError(`Failed to ${isEditing ? 'update' : 'add'} contact.`);
    }
  };

  const onEdit = (contact) => {
    setForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
    });
    setEditingId(contact.id);
    setError('');
    setSuccess('');
  };

  const onDelete = async (id) => {
    setError('');
    setSuccess('');
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }
    try {
      await contactDb.deleteContact(id);
      setSuccess('Contact deleted successfully!');
      await loadContacts();
    } catch (e) {
      setError('Failed to delete contact.');
    }
  };

  return (
    <section className="contact-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 700 }}>
          <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>👥</span>Contact Management
        </h2>
        <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>
          {contacts.length} {contacts.length === 1 ? 'Contact' : 'Contacts'} total
        </span>
      </div>

      {error && (
        <div className="alert-message alert-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {success && (
        <div className="alert-message alert-success">
          <span>✅</span> {success}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={onSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name-input">Full Name</label>
          <input
            id="name-input"
            name="name"
            placeholder="e.g. John Doe"
            value={form.name}
            onChange={onChange}
            className="contact-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email-input">Email Address</label>
          <input
            id="email-input"
            name="email"
            placeholder="e.g. john@example.com"
            value={form.email}
            onChange={onChange}
            className="contact-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone-input">Phone Number</label>
          <input
            id="phone-input"
            name="phone"
            placeholder="e.g. +1 (555) 019-2834"
            value={form.phone}
            onChange={onChange}
            className="contact-input"
          />
        </div>
        <div className="form-group">
          <div className="form-actions">
            <button type="submit" className="contact-btn btn-primary">
              {isEditing ? '💾 Update' : '➕ Add'}
            </button>
            {isEditing && (
              <button type="button" className="contact-btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Search and Table Container */}
      <div className="table-container">
        {contacts.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Search contacts by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="contact-input"
              style={{ maxWidth: '400px', padding: '0.6rem 1rem' }}
            />
          </div>
        )}

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'rotate 20s linear infinite', marginBottom: '1rem' }}></div>
            <p>Loading contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>{searchQuery ? 'No matching contacts found' : 'Your Contact Book is Empty'}</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9rem' }}>
              {searchQuery ? 'Try adjusting your search terms.' : 'Create your very first contact by filling in the form above.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="contact-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th style={{ width: '180px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td style={{ fontWeight: 600 }}>{contact.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{contact.email}</td>
                    <td>{contact.phone || <span style={{ opacity: 0.3 }}>—</span>}</td>
                    <td>
                      <div className="contact-row-actions">
                        <button className="contact-btn btn-secondary btn-sm" onClick={() => onEdit(contact)}>
                          ✏️ Edit
                        </button>
                        <button className="contact-btn btn-danger btn-sm" onClick={() => onDelete(contact.id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default ContactManagement;
