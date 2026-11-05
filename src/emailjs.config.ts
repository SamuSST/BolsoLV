// Credenciales de EmailJS (son públicas; NUNCA pongas aquí la Private Key).
export const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_ucgxbhi",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_fnnyqgl",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "uBnsbJKyuFnPp_vX_",
}
