// Validación de cédula ecuatoriana
export const validarCedulaEcuatoriana = (cedula) => {
  if (cedula.length !== 10 || isNaN(cedula)) return false;
  const digitos = cedula.split("").map(Number);
  const provincia = parseInt(cedula.substring(0, 2));
  if (provincia < 1 || provincia > 24) return false;

  const verificador = digitos.pop();
  const suma = digitos.reduce((acc, dig, idx) => {
    let valor = dig;
    if (idx % 2 === 0) {
      valor *= 2;
      if (valor > 9) valor -= 9;
    }
    return acc + valor;
  }, 0);

  const decenaSuperior = Math.ceil(suma / 10) * 10;
  return verificador === decenaSuperior - suma;
};

// Validación de teléfono (Ecuador)
export const validarTelefono = (telefono) => {
  const regex = /^(09)\d{8}$/; // 09XXXXXXXX o 02XXXXXXXX
  return regex.test(telefono);
};

// Validación de email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
