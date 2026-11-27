// Tiny in-memory stand-in for the MongoDB driver, covering only what the API uses.
const get = (o, k) => k.split('.').reduce((a, p) => (a == null ? a : a[p]), o);
const cmp = (a, b) => (a instanceof Date || b instanceof Date) ? new Date(a) - new Date(b) : (a > b ? 1 : a < b ? -1 : 0);
function match(doc, q) {
  return Object.entries(q).every(([k, v]) => {
    const x = get(doc, k);
    if (v && typeof v === 'object' && !(v instanceof Date) && !Array.isArray(v)) {
      return Object.entries(v).every(([op, val]) => {
        if (op === '$ne') return x !== val;
        if (op === '$regex') return typeof x === 'string' && new RegExp(val).test(x);
        if (op === '$in') return val.includes(x);
        if (op === '$gte') return x != null && cmp(x, val) >= 0;
        if (op === '$lt') return x != null && cmp(x, val) < 0;
        if (op === '$gt') return x != null && cmp(x, val) > 0;
        if (op === '$lte') return x != null && cmp(x, val) <= 0;
        throw new Error('op ' + op);
      });
    }
    return x === v;
  });
}
const clone = d => structuredClone(d);
class Cursor {
  constructor(rows) { this.rows = rows; }
  sort(s) { const [[k, dir]] = Object.entries(s); this.rows.sort((a, b) => cmp(get(a, k), get(b, k)) * dir); return this; }
  limit(n) { this.rows = this.rows.slice(0, n); return this; }
  async toArray() { return this.rows.map(clone); }
}
class Col {
  constructor() { this.docs = new Map(); }
  async findOne(q) { for (const d of this.docs.values()) if (match(d, q)) return clone(d); return null; }
  find(q = {}) { return new Cursor([...this.docs.values()].filter(d => match(d, q))); }
  async insertOne(d) { if (this.docs.has(d._id)) throw new Error('dup key'); this.docs.set(d._id, clone(d)); return { insertedId: d._id }; }
  async countDocuments(q = {}) { return [...this.docs.values()].filter(d => match(d, q)).length; }
  async deleteOne(q) { for (const [k, d] of this.docs) if (match(d, q)) { this.docs.delete(k); return { deletedCount: 1 }; } return { deletedCount: 0 }; }
  async updateMany(q, u) { let n = 0; for (const d of this.docs.values()) if (match(d, q)) { Object.assign(d, clone(u.$set || {})); n++; } return { matchedCount: n, modifiedCount: n }; }
  async updateOne(q, u, opt = {}) {
    for (const [k, d] of this.docs) if (match(d, q)) {
      Object.assign(d, clone(u.$set || {}));
      for (const [f, n] of Object.entries(u.$inc || {})) d[f] = (d[f] || 0) + n;
      return { matchedCount: 1, modifiedCount: 1 };
    }
    if (opt.upsert) {
      const base = {};
      for (const [f, v] of Object.entries(q)) if (typeof v !== 'object' || v === null) base[f] = v;
      const d = { ...base, ...clone(u.$setOnInsert || {}), ...clone(u.$set || {}) };
      this.docs.set(d._id, d);
      return { matchedCount: 0, modifiedCount: 0, upsertedCount: 1 };
    }
    return { matchedCount: 0, modifiedCount: 0 };
  }
}
export function memDb() { const cols = {}; return { collection: n => (cols[n] ||= new Col()), _cols: cols }; }
