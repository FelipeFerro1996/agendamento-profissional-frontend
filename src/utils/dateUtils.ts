/**
 * Formata uma data e hora com base em uma string de formato.
 * Garante o fuso horário local do usuário.
 * 
 * Tokens disponíveis:
 * - YYYY (Ano com 4 dígitos)
 * - MM   (Mês com 2 dígitos)
 * - DD   (Dia com 2 dígitos)
 * - HH   (Hora com 2 dígitos, formato 24h)
 * - mm   (Minutos com 2 dígitos)
 * - ss   (Segundos com 2 dígitos)
 * 
 * @example formatarData(new Date(), 'YYYY-MM-DD HH:mm:ss') -> "2026-08-04 11:06:00"
 */
export function formatarData(data: Date, formato: string): string {
  // Extração de componentes de data (Fuso Horário Local)
  const ano = data.getFullYear().toString();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  // Extração de componentes de hora (Fuso Horário Local)
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  const segundo = String(data.getSeconds()).padStart(2, '0');

  // Substitui todos os tokens informados no formato
  return formato
    .replace('YYYY', ano)
    .replace('MM', mes)
    .replace('DD', dia)
    .replace('HH', hora)
    .replace('mm', minuto)
    .replace('ss', segundo);
}