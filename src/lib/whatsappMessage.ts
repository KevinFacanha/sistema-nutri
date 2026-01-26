export type WhatsAppCategory = 90 | 120 | 180 | 360;

const templates: Record<WhatsAppCategory, string> = {
  90: 'Olá, {NOME}! Tudo bem? 😊 Passando pra lembrar do seu acompanhamento nutricional. Já faz um tempinho desde a última consulta e queria ver como você está e se conseguimos agendar seu retorno.',
  120: 'Olá, {NOME}! Tudo bem? 😊 Vi aqui que já faz um tempo desde nossa última consulta. Quer que eu te ajude a marcar um retorno pra ajustarmos o plano e acompanhar seus resultados?',
  180: 'Olá, {NOME}! Tudo bem? 😊 Já faz alguns meses desde o seu último acompanhamento. Se você quiser, podemos agendar um retorno pra revisar metas, ajustar o plano e manter a evolução no ritmo certo.',
  360: 'Olá, {NOME}! Tudo bem? 😊 Faz bastante tempo desde sua última consulta. Se você quiser retomar, posso te ajudar a agendar um retorno pra reavaliarmos e montar um plano atualizado pra você.'
};

export const buildWhatsAppMessage = (patientName: string, category: number): string => {
  const template = templates[category as WhatsAppCategory] ?? templates[90];
  return template.replace('{NOME}', patientName);
};

export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for browsers without clipboard permissions.
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-1000px';
    textarea.style.left = '-1000px';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (error) {
    return false;
  }
};
