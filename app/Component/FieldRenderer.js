
const FieldRenderer = ({ field, value, onChange, error }) => {
    const base = "w-full p-2 border rounded";
    switch (field.type) {
        case "textarea":
            return (
                <div>
                    <label className="block text-sm mb-1">{field.label}{field.required && ' *'}</label>
                    <textarea placeholder={field.placeholder} className={base} value={value || ""} onChange={(e) => onChange(e.target.value)} />
                    {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
                </div>
            );
        case "select":
            return (
                <div>
                    <label className="block text-sm mb-1">{field.label}{field.required && ' *'}</label>
                    <select className={base} value={value || ""} onChange={(e) => onChange(e.target.value)}>
                        <option value="">Select</option>
                        {(field.options || "").split(',').map((o, i) => (<option key={i} value={o.trim()}>{o.trim()}</option>))}
                    </select>
                    {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
                </div>
            );
        case "checkbox":
            return (
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {field.label}
                </label>
            );
        default:
            return (
                <div>
                    <label className="block text-sm mb-1">{field.label}{field.required && ' *'}</label>
                    <input className={base} placeholder={field.placeholder} value={value || ""} onChange={(e) => onChange(e.target.value)} />
                    {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
                </div>
            );
    }
}

export default FieldRenderer