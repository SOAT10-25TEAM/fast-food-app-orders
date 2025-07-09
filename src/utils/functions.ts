function generateCode() {
  const randomChars = Array.from({ length: 2 }, () =>
    String.fromCharCode(Math.floor(Math.random() * 26) + 65)
  ).join("");

  const timestamp = Date.now().toString().slice(-4);
  return randomChars + timestamp;
}

export { generateCode };
