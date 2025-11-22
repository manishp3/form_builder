
export const DEFAULT_THEME = {
  "--primary": "#06b6d4",
  "--bg": "#ffffff",
  "--text": "#0f172a",
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontSize: "16px",
};

export const SAMPLE_FORM = {
  title: "Contact Us",
  description: "A small demo form",
  fields: [
    { id: 1, type: "text", label: "Full name", placeholder: "Your name", required: true },
    { id: 2, type: "email", label: "Email", placeholder: "email@domain.com", required: true },
    { id: 3, type: "textarea", label: "Message", placeholder: "How can we help?", required: false },
  ],
};

export function uid() {
  return Math.floor(Math.random() * Date.now());
}