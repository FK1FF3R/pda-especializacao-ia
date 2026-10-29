// Gerado por IA. Colado sem ler. (LAB 3 — a tarefa real é aqui)
//
// Valida um CPF brasileiro (com ou sem máscara).
// Retorna true se o CPF for válido, false caso contrário.

export function validaCpf(cpf) {
  if (typeof cpf !== 'string') return false;

  // Só aceita dígitos e a máscara oficial; letras ou outros caracteres invalidam.
  if (!/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(cpf)) return false;

  const digitos = cpf.replace(/\D/g, '');
  if (digitos.length !== 11) return false;

  // Sequências como 111.111.111-11 passam no cálculo, mas não são CPFs válidos.
  if (/^(\d)\1{10}$/.test(digitos)) return false;

  const nums = digitos.split('').map((d) => parseInt(d));

  const calcDigito = (base) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += base[i] * (base.length + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const dv1 = calcDigito(nums.slice(0, 9));
  const dv2 = calcDigito(nums.slice(0, 10));

  return dv1 === nums[9] && dv2 === nums[10];
}
