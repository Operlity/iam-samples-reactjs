import initSqlJs from 'sql.js';

const DB_STORAGE_KEY = 'contact-management.sqlite';
let sqlPromise;

const getSql = () => {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({
      locateFile: (file) => `https://unpkg.com/sql.js@1.14.1/dist/sql-wasm.wasm`,
    });
  }
  return sqlPromise;
};

const uint8ArrayToBase64 = (uint8Array) => {
  let binary = '';
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
};

const base64ToUint8Array = (base64String) => {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const loadDatabase = async () => {
  let SQL;
  try {
    SQL = await getSql();
  } catch (e) {
    console.error('SQL.js initialization error:', e);
    throw new Error('Database compiler failed to load (sql-wasm.wasm missing or invalid). Please restart the server or clear cache.');
  }

  const persisted = localStorage.getItem(DB_STORAGE_KEY);
  let db;

  if (persisted) {
    try {
      const bytes = base64ToUint8Array(persisted);
      db = new SQL.Database(bytes);
    } catch (e) {
      console.error('Failed to load persisted database, creating a new one:', e);
      localStorage.removeItem(DB_STORAGE_KEY);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
};

const persistDatabase = (db) => {
  try {
    const binaryArray = db.export();
    const base64 = uint8ArrayToBase64(binaryArray);
    localStorage.setItem(DB_STORAGE_KEY, base64);
  } catch (e) {
    console.error('Failed to persist database:', e);
  }
};

const toContact = (row) => ({
  id: row[0],
  name: row[1],
  email: row[2],
  phone: row[3] || '',
  createdAt: row[4],
  updatedAt: row[5],
});

const getAllContacts = async () => {
  const db = await loadDatabase();
  const result = db.exec(`
    SELECT id, name, email, phone, created_at, updated_at
    FROM contacts
    ORDER BY id DESC;
  `);

  db.close();
  return result[0]?.values?.map(toContact) || [];
};

const addContact = async (payload) => {
  const db = await loadDatabase();
  const now = new Date().toISOString();

  const statement = db.prepare(`
    INSERT INTO contacts (name, email, phone, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?);
  `);

  statement.bind([payload.name.trim(), payload.email.trim(), payload.phone.trim(), now, now]);
  statement.step();
  statement.free();

  const idResult = db.exec('SELECT last_insert_rowid() AS id;');
  const id = idResult[0]?.values?.[0]?.[0];

  persistDatabase(db);
  db.close();

  return {
    id,
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    createdAt: now,
    updatedAt: now,
  };
};

const updateContact = async (id, payload) => {
  const db = await loadDatabase();
  const now = new Date().toISOString();

  const statement = db.prepare(`
    UPDATE contacts
    SET name = ?, email = ?, phone = ?, updated_at = ?
    WHERE id = ?;
  `);

  statement.bind([payload.name.trim(), payload.email.trim(), payload.phone.trim(), now, id]);
  statement.step();
  statement.free();

  persistDatabase(db);
  db.close();

  return {
    id,
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    updatedAt: now,
  };
};

const deleteContact = async (id) => {
  const db = await loadDatabase();

  const statement = db.prepare('DELETE FROM contacts WHERE id = ?;');
  statement.bind([id]);
  statement.step();
  statement.free();

  persistDatabase(db);
  db.close();
};

export const contactDb = {
  getAllContacts,
  addContact,
  updateContact,
  deleteContact,
};
