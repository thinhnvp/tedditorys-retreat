// Unambiguous alphabet: no 0/O, 1/I/L, to keep codes easy to read back over email/phone.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateReferenceCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}
