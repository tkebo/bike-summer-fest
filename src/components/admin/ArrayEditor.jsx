import ContentField from "./ContentField";

const ArrayEditor = ({ label, items, onChange, itemShape }) => {
  const updatePrimitive = (index, value) => onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  const updateObject = (index, key, value) => onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));

  return (
    <div>
      <div className="mb-3 text-xs font-black uppercase text-cyan-200">{label}</div>
      <div className="grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            {itemShape ? (
              <div className="grid gap-3 md:grid-cols-2">
                {itemShape.map(({ key, label: fieldLabel, multiline }) => (
                  <ContentField
                    key={key}
                    label={fieldLabel}
                    value={Array.isArray(item[key]) ? item[key].join(", ") : item[key]}
                    multiline={multiline}
                    onChange={(value) => updateObject(index, key, Array.isArray(item[key]) ? value.split(",").map((entry) => entry.trim()).filter(Boolean) : value)}
                  />
                ))}
              </div>
            ) : (
              <ContentField label={`${label} ${index + 1}`} value={item} onChange={(value) => updatePrimitive(index, value)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrayEditor;
