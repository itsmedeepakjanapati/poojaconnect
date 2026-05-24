// ═══════════════════════════════════════════════════════════════
// web/src/pages/TemplesPage.jsx
// Browse Hindu temples across New England + search rituals/events
// ═══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { TEMPLES, EVENT_TYPES } from '../../../shared/data/templesData';
import { STATES } from '../../../shared/types';

export default function TemplesPage() {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TEMPLES.filter(t => {
      if (stateFilter !== 'all' && t.state !== stateFilter) return false;

      // Event-type filter: temple must have at least one matching event
      if (eventTypeFilter !== 'all') {
        const hasType = (t.events || []).some(e => e.type === eventTypeFilter);
        if (!hasType) return false;
      }

      // Text search hits temple name/city/deity OR any event name/type
      if (q) {
        const inTemple =
          t.name.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          t.deity.toLowerCase().includes(q) ||
          (t.tradition || '').toLowerCase().includes(q);
        const inEvent = (t.events || []).some(e =>
          e.name.toLowerCase().includes(q) || e.type.toLowerCase().includes(q)
        );
        if (!inTemple && !inEvent) return false;
      }
      return true;
    });
  }, [search, stateFilter, eventTypeFilter]);

  // Count of total matching events (when filtering by ritual/event)
  const eventMatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q && eventTypeFilter === 'all') return null;
    let n = 0;
    filtered.forEach(t => {
      (t.events || []).forEach(e => {
        const matchesType = eventTypeFilter === 'all' || e.type === eventTypeFilter;
        const matchesText = !q || e.name.toLowerCase().includes(q) || e.type.toLowerCase().includes(q);
        if (matchesType && matchesText) n++;
      });
    });
    return n;
  }, [filtered, search, eventTypeFilter]);

  const groupedByState = useMemo(() => {
    const g = {};
    filtered.forEach(t => {
      g[t.state] = g[t.state] || [];
      g[t.state].push(t);
    });
    return g;
  }, [filtered]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold" style={{ color: '#E8712A' }}>🛕 Hindu Temples of New England</h1>
        <p className="text-gray-600 mt-1">
          Browse {TEMPLES.length} temples across MA, CT, NH, RI, VT & ME — and search for rituals, poojas, homams, and festivals happening at each.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 260px' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>Search temple or ritual</label>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="e.g. Rudrabhishekham, Diwali, Shirdi Sai, Boston..."
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none' }}
          />
        </div>
        <div style={{ flex: '0 1 180px' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>State</label>
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff', cursor: 'pointer' }}>
            <option value="all">All States</option>
            {STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div style={{ flex: '0 1 180px' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>Event type</label>
          <select value={eventTypeFilter} onChange={e => setEventTypeFilter(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff', cursor: 'pointer' }}>
            <option value="all">All Events</option>
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {(search || stateFilter !== 'all' || eventTypeFilter !== 'all') && (
          <button onClick={() => { setSearch(''); setStateFilter('all'); setEventTypeFilter('all'); }}
            style={{ padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 13, background: '#fff', cursor: 'pointer', color: '#6B7280' }}>
            Clear
          </button>
        )}
      </div>

      {/* Result summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing <strong>{filtered.length}</strong> temple{filtered.length !== 1 ? 's' : ''}
        {eventMatches !== null && <> · <strong>{eventMatches}</strong> matching ritual{eventMatches !== 1 ? 's' : ''}</>}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl p-10 text-center border border-gray-100">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-500">No temples match your search.</p>
        </div>
      )}

      {/* Grouped list */}
      {Object.entries(groupedByState).map(([stateName, temples]) => (
        <div key={stateName} className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
            <span style={{ width: 4, height: 18, background: '#E8712A', borderRadius: 2 }} />
            {stateName}
            <span className="text-xs text-gray-400 font-normal">({temples.length})</span>
          </h2>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {temples.map(t => {
              const q = search.trim().toLowerCase();
              const matchingEvents = q
                ? (t.events || []).filter(e => e.name.toLowerCase().includes(q) || e.type.toLowerCase().includes(q))
                : [];
              const isOpen = expanded === t.id;
              return (
                <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 leading-tight">{t.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{t.city}, {t.state}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
                        style={{ background: '#FFF3E0', color: '#E8712A', fontWeight: 600 }}>
                        {t.tradition}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      <span>🕉️ {t.deity}</span>
                      {t.phone && <span>📞 {t.phone}</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">📍 {t.address}</p>

                    {/* Highlight matching events when searching */}
                    {matchingEvents.length > 0 && (
                      <div className="mt-3 p-2 rounded-lg" style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}>
                        <div className="text-xs font-semibold text-amber-900 mb-1">Matching rituals:</div>
                        {matchingEvents.map((e, i) => (
                          <div key={i} className="text-xs text-amber-900">• <strong>{e.name}</strong> — {e.date} <span className="text-amber-700">({e.type})</span></div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setExpanded(isOpen ? null : t.id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                        style={{ cursor: 'pointer' }}>
                        {isOpen ? 'Hide' : 'View'} rituals ({(t.events || []).length})
                      </button>
                      {t.website && (
                        <a href={t.website} target="_blank" rel="noreferrer"
                          className="text-xs px-3 py-1.5 rounded-lg text-white no-underline"
                          style={{ background: '#E8712A' }}>
                          Website ↗
                        </a>
                      )}
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(t.address)}`}
                        target="_blank" rel="noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 no-underline text-gray-700">
                        Directions
                      </a>
                    </div>

                    {/* Expanded all-events list */}
                    {isOpen && (t.events || []).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs font-semibold text-gray-700 mb-2">All rituals & events:</div>
                        <ul className="space-y-1">
                          {t.events.map((e, i) => (
                            <li key={i} className="text-xs text-gray-700 flex justify-between gap-2">
                              <span>• <strong>{e.name}</strong>
                                <span className="text-gray-400"> · {e.type}</span>
                              </span>
                              <span className="text-gray-500 whitespace-nowrap">{e.date}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-6 text-xs text-gray-400 text-center">
        Don't see your temple? Contact admin to add it to the directory.
      </div>
    </div>
  );
}
