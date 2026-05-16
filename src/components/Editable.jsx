import { useRef, useState } from "react";
import { useCMS } from "../hooks/useCMS";
import { getNestedValue } from "../utils/cmsHelpers";

const Editable = ({
  path,
  langContext,
  className = "",
  multiline = false,
  as: Tag = "span",
  fallback,
  children,
  ...props
}) => {
  const { cmsData, updateContent, adminMode } = useCMS();
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState("");
  const originalValue = useRef("");

  const actualPath = langContext ? `${langContext}.${path}` : path;
  const val = getNestedValue(cmsData, actualPath) ?? fallback ?? children;

  if (!adminMode) {
    return (
      <Tag className={className} {...props}>
        {val}
      </Tag>
    );
  }

  return (
    <Tag
      className={`relative group ${className} outline outline-1 outline-dashed outline-transparent hover:outline-cyan-400 hover:bg-cyan-400/10 cursor-pointer transition-all duration-200`}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
        e.preventDefault();
        e.stopPropagation();
        originalValue.current = val;
        setEditVal(val);
        setIsEditing(true);
      }}
      {...props}
    >
      {val}
      <div className="absolute -top-4 -right-4 z-40 rounded-full border border-cyan-200/40 bg-cyan-300 px-2 py-1 text-xs text-black opacity-0 shadow-[0_0_24px_rgba(0,217,255,.45)] transition duration-200 group-hover:opacity-100 pointer-events-none">
        ✏
      </div>

      {isEditing && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-default"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(false);
          }}
        >
          <div
            className="bg-gray-900 p-6 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,217,255,0.3)] border border-cyan-400/30 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-cyan-400 font-black mb-4">Edit Content</h3>
            <p className="text-white/50 text-xs mb-4 break-all">Path: {actualPath}</p>
            {multiline ? (
              <textarea
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-400 min-h-[150px] resize-y"
                value={editVal}
                onChange={(e) => {
                  setEditVal(e.target.value);
                  updateContent(actualPath, e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    updateContent(actualPath, originalValue.current);
                    setEditVal(originalValue.current);
                    setIsEditing(false);
                  }
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") setIsEditing(false);
                }}
                autoFocus
              />
            ) : (
              <input
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-400"
                value={editVal}
                onChange={(e) => {
                  setEditVal(e.target.value);
                  updateContent(actualPath, e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditing(false);
                  if (e.key === "Escape") {
                    updateContent(actualPath, originalValue.current);
                    setEditVal(originalValue.current);
                    setIsEditing(false);
                  }
                }}
                autoFocus
              />
            )}
            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 bg-cyan-400 text-black font-black py-3 rounded-xl hover:bg-cyan-300 transition"
                onClick={() => {
                  updateContent(actualPath, editVal);
                  setIsEditing(false);
                }}
              >
                Save
              </button>
              <button
                className="flex-1 bg-white/10 text-white font-black py-3 rounded-xl hover:bg-white/20 transition"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Tag>
  );
};

export default Editable;
