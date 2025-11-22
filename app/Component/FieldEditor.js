
const FieldEditor=({ field, onChange, onRemove })=> {
  return (
    <div className="p-3 border rounded bg-white">
      <div className="flex justify-between items-center mb-2">
        <strong className="text-sm">{field.label || '<untitled field>'}</strong>
        <div className="space-x-2">
          <button
            className="px-2 py-1 text-xs border rounded"
            onClick={() => onRemove(field.id)}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-xs">Label</label>
        <input className="p-2 border rounded" value={field.label} onChange={(e)=>onChange({...field, label: e.target.value})} />

        <label className="text-xs">Type</label>
        <select className="p-2 border rounded" value={field.type} onChange={(e)=>onChange({...field, type: e.target.value})}>
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="number">Number</option>
          <option value="textarea">Textarea</option>
          <option value="select">Select</option>
          <option value="checkbox">Checkbox</option>
        </select>

        <label className="text-xs">Placeholder</label>
        <input className="p-2 border rounded" value={field.placeholder||""} onChange={(e)=>onChange({...field, placeholder: e.target.value})} />

        {field.type === 'select' && (
          <>
            <label className="text-xs">Options (comma separated)</label>
            <input className="p-2 border rounded" value={field.options||""} onChange={(e)=>onChange({...field, options: e.target.value})} />
          </>
        )}

        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={field.required||false} onChange={(e)=>onChange({...field, required: e.target.checked})} /> Required
        </label>
      </div>
    </div>
  );
}

export default FieldEditor;