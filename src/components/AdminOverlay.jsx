import { memo } from "react";
import { useCMS } from "../hooks/useCMS";

const AdminOverlay = () => {
  const { ev } = useCMS();
  return (
<style>{`
          :root {
            --accent-cyan: ${ev("accentCyanColor")};
            --accent-orange: ${ev("accentOrangeColor")};
            --lang-active: ${ev("langActiveColor")};
            --lang-inactive: ${ev("langInactiveColor")};
            --countdown-label: ${ev("countdownLabelColor")};
            --global-font-scale: ${ev("globalFontScale")};
          }
          main {
            font-size: calc(100% * var(--global-font-scale));
            background-color: ${ev("pageBgColor")};
          }
          .global-box {
            ${ev("boxWidth") !== 0 ? `width: ${ev("boxWidth")}px !important;` : ""}
            ${ev("boxHeight") !== 0 ? `height: ${ev("boxHeight")}px !important;` : ""}
            padding: ${ev("boxPadding")}px !important;
            margin: ${ev("boxMargin")}px !important;
            border-radius: ${ev("boxBorderRadius")}px !important;
            background-color: rgba(255,255,255,${ev("boxBgOpacity") / 100}) !important;
            backdrop-filter: blur(${ev("boxBlur")}px) !important;
            box-shadow: 0 0 ${ev("boxGlow") * 2}px rgba(0,217,255,${ev("boxGlow") / 100}) !important;
            font-size: ${ev("boxFontSize")}px !important;
          }
          
          section, footer {
            padding-left: ${ev("sectionPaddingX")}px !important;
            padding-right: ${ev("sectionPaddingX")}px !important;
            padding-top: ${ev("sectionPaddingY")}px !important;
            padding-bottom: ${ev("sectionPaddingY")}px !important;
          }
          
          .accent-cyan { color: var(--accent-cyan) !important; }
          .bg-accent-cyan { background-color: var(--accent-cyan) !important; }
          .text-accent-orange { color: var(--accent-orange) !important; }
          .bg-accent-orange { background-color: var(--accent-orange) !important; }
          .lang-btn-active { color: var(--lang-active) !important; }
          .lang-btn-inactive { color: var(--lang-inactive) !important; }
          .countdown-label { color: var(--countdown-label) !important; }

          .max-w-7xl, .max-w-5xl {
            max-width: ${ev("sectionMaxWidth") === 0 ? 'none' : ev("sectionMaxWidth") + 'px'} !important;
          }
          
          .custom-nav-link {
            color: rgba(255,255,255,0.9);
            transition: all 0.3s;
          }
          .custom-nav-link:hover {
            color: ${ev("navHoverColor")} !important;
          }
          .custom-nav-link.active {
            color: ${ev("navActiveColor")} !important;
          }
          
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .admin-frame {
            outline: 1px solid rgba(103,232,249,.34);
            outline-offset: 6px;
            cursor: grab;
            transition: outline-color .22s ease, box-shadow .22s ease, transform .16s ease;
          }
          .admin-frame:hover {
            outline-color: rgba(103,232,249,.9);
            box-shadow: 0 0 38px rgba(0,217,255,.18);
          }
          .admin-frame:active {
            cursor: grabbing;
          }
          [data-admin-frame] {
            will-change: transform, width, height;
          }
        `}</style>
  );
};

export default memo(AdminOverlay);
