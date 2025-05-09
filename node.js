function validarCartao(numeroCartao, dataExpiracao, cvv) {
  const bandeiras = [
    { nome: 'Visa', prefixos: ['4'] },
    { nome: 'Mastercard', prefixos: ['51', '52', '53', '54', '55'] },
    { nome: 'Diners Club', prefixos: ['36', '38'] },
    { nome: 'Discover', prefixos: ['6011', '65'] },
    { nome: 'JCB', prefixos: ['35'] },
    { nome: 'American Express', prefixos: ['34', '37'] }
  ];

  const numeroLimpo = numeroCartao.replace(/\s+/g, '');
  if (!/^\d+$/.test(numeroLimpo)) {
    return { valido: false, mensagem: 'Número do cartão inválido.' };
  }

  let bandeira = null;
  for (const b of bandeiras) {
    if (b.prefixos.some(p => numeroLimpo.startsWith(p))) {
      bandeira = b.nome;
      break;
    }
  }

  if (!bandeira) {
    return { valido: false, mensagem: 'Bandeira do cartão não reconhecida.' };
  }

  let soma = 0;
  let alternar = false;
  for (let i = numeroLimpo.length - 1; i >= 0; i--) {
    let digito = parseInt(numeroLimpo[i]);
    if (alternar) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    soma += digito;
    alternar = !alternar;
  }

  if (soma % 10 !== 0) {
    return { valido: false, mensagem: 'Número do cartão inválido (Luhn).' };
  }

  if (!/^\d{2}\/\d{2}$/.test(dataExpiracao)) {
    return { valido: false, mensagem: 'Formato de data inválido. Use MM/AA.' };
  }

  const [mes, ano] = dataExpiracao.split('/').map(Number);
  const anoCompleto = 2000 + ano;
  const dataExp = new Date(anoCompleto, mes - 1, 1);
  const hoje = new Date();
  hoje.setDate(1);

  if (mes < 1 || mes > 12 || dataExp < hoje) {
    return { valido: false, mensagem: 'Data de expiração inválida.' };
  }

  if (!/^\d{3,4}$/.test(cvv)) {
    return { valido: false, mensagem: 'CVV inválido.' };
  }

  return { valido: true, mensagem: 'Cartão válido.', bandeira };
}

function validar() {
  const numero = document.getElementById('numero').value;
  const data = document.getElementById('data').value;
  const cvv = document.getElementById('cvv').value;
  const resultado = validarCartao(numero, data, cvv);
  const div = document.getElementById('resultado');
  div.style.color = resultado.valido ? 'green' : 'red';
  div.textContent = resultado.mensagem + (resultado.bandeira ? ` | Bandeira: ${resultado.bandeira}` : '');
}
