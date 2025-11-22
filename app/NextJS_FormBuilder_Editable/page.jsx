'use client';
import React, { useEffect, useState } from "react";
import { DEFAULT_THEME, SAMPLE_FORM, uid } from "../(utils)";
import FieldRenderer from "../Component/FieldRenderer";
import FieldEditor from "../Component/FieldEditor";




export default function Page() {
  const [mode, setMode] = useState('edit'); // for edit or preview
  const [form, setForm] = useState(() => {
    const cached = typeof window !== 'undefined' && localStorage.getItem('mini.form');
    return cached ? JSON.parse(cached) : SAMPLE_FORM;
  });

  console.log("log of form", form);

  const [theme, setTheme] = useState(() => {
    const cached = typeof window !== 'undefined' && localStorage.getItem('mini.theme');
    return cached ? JSON.parse(cached) : DEFAULT_THEME;
  });

  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('mini.form', JSON.stringify(form)); }, [form]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('mini.theme', JSON.stringify(theme)); }, [theme]);

  console.log("log of window", window);

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  console.log("log of errors and values", values);
  function addField(type = 'text') {
    const f = { id: uid(), type, label: 'New field', placeholder: '', required: false };
    setForm({ ...form, fields: [...form.fields, f] });
  }

  function updateField(id, patch) {
    setForm({ ...form, fields: form.fields.map(f => f.id === id ? { ...f, ...patch } : f) });
  }

  function removeField(id) {
    setForm({ ...form, fields: form.fields.filter(f => f.id !== id) });
  }
  // function removeField(id) {
  //   setForm({ ...form, fields: form.filter(f => f.id !== id) });
  // }

  function validate() {
    const e = {};
    form.fields.forEach(f => {
      console.log("log validate f::", f);

      if (f.required) {
        const v = values[f.id];
        if (f.type === 'checkbox') {
          if (!v) e[f.id] = 'This field is required';
        } else if (!v || String(v).trim() === '') {
          e[f.id] = 'This field is required';
        }
      }
      if (f.type === 'email' && values[f.id]) {
        const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values[f.id]);
        if (!ok) e[f.id] = 'Please enter a valid email';
      }
    });
    console.log("Log of e after llopp:", e);

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submitPreview(e) {
    e.preventDefault();
    if (validate()) {
      alert('Form submitted — data: ' + JSON.stringify(values, null, 2));
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Apply theme as inline style variables
  const themeStyle = {
    ...Object.fromEntries(Object.entries(theme).filter(([k]) => k.startsWith('--')).map(([k, v]) => [k, v])),
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    color: theme['--text'],
    background: theme['--bg'],
  };

  function exportJSON() {
    const data = JSON.stringify({ form, theme }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'form.json'; a.click(); URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        if (obj.form) setForm(obj.form);
        if (obj.theme) setTheme(obj.theme);
        alert('Imported');
      } catch (err) { alert('Invalid JSON'); }
    };
    reader.readAsText(file);
  }

  console.log("log of mode::", mode);

  return (
    <div className="min-h-screen p-6" style={themeStyle}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">

          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{form.title}</h1>
              <p className="text-sm opacity-80">{form.description}</p>
            </div>
            <div className="space-x-2">
              <button className={`px-3 py-1 rounded border ${mode === 'edit' ? 'bg-white' : 'bg-transparent'}`} onClick={() => setMode('edit')}>Edit</button>
              <button className={`px-3 py-1 rounded border ${mode === 'preview' ? 'bg-white' : 'bg-transparent'}`} onClick={() => { setMode('preview'); setValues({}); setErrors({}); }}>Preview</button>
            </div>
          </header>

          {mode === 'edit' ? (
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <input className="p-2 border rounded flex-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <input className="p-2 border rounded flex-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-3">
                  {form.fields.map(f => (
                    <FieldEditor key={f.id} field={f} onChange={(next) => updateField(f.id, next)} onRemove={removeField} />
                  ))}
                </div>

                <div className="p-4 border rounded bg-gray-50">
                  <h3 className="font-semibold mb-2">Add fields</h3>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-2 border rounded" onClick={() => addField('text')}>Text</button>
                    <button className="px-3 py-2 border rounded" onClick={() => addField('email')}>Email</button>
                    <button className="px-3 py-2 border rounded" onClick={() => addField('textarea')}>Textarea</button>
                    <button className="px-3 py-2 border rounded" onClick={() => addField('select')}>Select</button>
                    <button className="px-3 py-2 border rounded" onClick={() => addField('checkbox')}>Checkbox</button>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium">Form actions</h4>
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-2 border rounded" onClick={() => { setForm(SAMPLE_FORM); }}>Load Sample</button>
                      <button className="px-3 py-2 border rounded" onClick={exportJSON}>Export JSON</button>
                      <label className="px-3 py-2 border rounded cursor-pointer">
                        Import JSON
                        <input type="file" accept="application/json" className="hidden" onChange={(e) => importJSON(e.target.files[0])} />
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium">Preview</h4>
                    <div className="mt-2 p-3 bg-white border rounded">
                      {form.fields.map(f => (
                        <div key={f.id} className="mb-3">
                          <label className="block text-sm mb-1">{f.label}</label>
                          {f.type === 'textarea' ? <textarea className="p-2 border rounded w-full" placeholder={f.placeholder} /> : <input className="p-2 border rounded w-full" placeholder={f.placeholder} />}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          ) : (
            <form className="space-y-4 bg-white p-4 rounded border" onSubmit={submitPreview}>
              {form.fields.map(f => (
                <div key={f.id}>
                  <FieldRenderer
                    field={f}
                    value={values[f.id]}
                    onChange={(v) => setValues(prev => ({ ...prev, [f.id]: v }))}
                    error={errors[f.id]}
                  />
                </div>
              ))}

              <div className="flex gap-2">
                <button className="px-3 py-2 rounded" type="submit">Submit</button>
                <button className="px-3 py-2 rounded border" type="button" onClick={() => { setValues({}); setErrors({}); }}>Reset</button>
              </div>
            </form>
          )}

        </div>

        <aside className="space-y-4">
          <div className="p-4 border rounded bg-white">
            <h3 className="font-semibold mb-2">Theme</h3>
            <div className="grid gap-2">
              <label className="text-xs">Primary color</label>
              <input type="color" value={theme['--primary']} onChange={(e) => setTheme({ ...theme, '--primary': e.target.value })} />

              <label className="text-xs">Background</label>
              <input type="color" value={theme['--bg']} onChange={(e) => setTheme({ ...theme, '--bg': e.target.value })} />

              <label className="text-xs">Text color</label>
              <input type="color" value={theme['--text']} onChange={(e) => setTheme({ ...theme, '--text': e.target.value })} />

              <label className="text-xs">Font family (CSS)</label>
              <input className="p-2 border rounded" value={theme.fontFamily} onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })} />

              <label className="text-xs">Base font size</label>
              <input type="range" min="12" max="22" value={parseInt(theme.fontSize)} onChange={(e) => setTheme({ ...theme, fontSize: e.target.value + 'px' })} />

              <div className="mt-2 p-2 rounded" style={{ background: 'var(--bg)' }}>
                <div className="text-sm">Preview</div>
                <div className="mt-2 p-2 border rounded" style={{ background: 'white', color: 'var(--text)' }}>
                  <strong style={{ color: 'var(--primary)' }}>Primary</strong> • Body
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded bg-white">
            <h3 className="font-semibold mb-2">Persistence</h3>
            <div className="flex flex-col gap-2">
              <button className="px-3 py-2 border rounded" onClick={() => { localStorage.removeItem('mini.form'); localStorage.removeItem('mini.theme'); setForm(SAMPLE_FORM); setTheme(DEFAULT_THEME); alert('Reset local storage'); }}>Reset to defaults</button>
              <small className="text-xs opacity-70">Form & theme stored in localStorage for quick dev/demo.</small>
            </div>
          </div>

          <div className="p-4 border rounded bg-white">
            <h3 className="font-semibold mb-2">Export</h3>
            <div className="flex gap-2">
              <button className="px-3 py-2 border rounded" onClick={() => exportJSON()}>Download JSON</button>
            </div>
          </div>
        </aside>
      </div>

      {/* small css to leverage primary color */}
      <style jsx>{`
        :root{ --primary: ${theme['--primary']}; --bg: ${theme['--bg']}; --text: ${theme['--text']}; }
        button{ background: var(--primary); color: white; }
        input:focus, textarea:focus, select:focus{ outline: 2px solid var(--primary); }
      `}</style>
    </div>
  );
}
