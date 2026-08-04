export default function xss(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<script>/gi, '');
}
