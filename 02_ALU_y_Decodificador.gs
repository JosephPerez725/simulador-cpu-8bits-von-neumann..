/**
 * MÓDULO 2: UNIDAD ARITMÉTICO-LÓGICA (ALU), BANDERAS (ZF, CF, SF) Y DECODIFICADOR ISA
 */

function actualizarBanderasALU(sheet, state, rawResult) {
  const res8 = ((rawResult % 256) + 256) % 256;
  state.ZF = (res8 === 0) ? 1 : 0;
  state.CF = (rawResult > 255 || rawResult < 0) ? 1 : 0;
  state.SF = ((res8 & 0x80) !== 0) ? 1 : 0;

  sheet.getRange(22, 2, 3, 2).setValues([
    [state.ZF, state.ZF ? 'ACTIVA (Resultado == 0)' : 'INACTIVA (Resultado != 0)'],
    [state.CF, state.CF ? 'ACTIVA (Desborde / Préstamo)' : 'INACTIVA (Rango OK)'],
    [state.SF, state.SF ? 'ACTIVA (Negativo / Bit 7 = 1)' : 'INACTIVA (Positivo / Bit 7 = 0)']
  ]);

  sheet.getRange(22, 2, 1, 2).setBackground(state.ZF ? '#fde047' : '#fef2f2');
  sheet.getRange(23, 2, 1, 2).setBackground(state.CF ? '#fde047' : '#fef2f2');
  sheet.getRange(24, 2, 1, 2).setBackground(state.SF ? '#fde047' : '#fef2f2');
}

function decodificarInstruccion(irTexto) {
  const limpio = String(irTexto || 'NOP').trim();
  if (!limpio || limpio === '0') return { opcode: 'NOP', arg1: '', arg2: '' };
  const espacioIdx = limpio.indexOf(' ');
  if (espacioIdx === -1) return { opcode: limpio.toUpperCase(), arg1: '', arg2: '' };
  const opcode = limpio.substring(0, espacioIdx).trim().toUpperCase();
  const resto = limpio.substring(espacioIdx + 1).trim();
  const partes = resto.split(',');
  return {
    opcode: opcode,
    arg1: partes[0] ? partes[0].trim() : '',
    arg2: partes[1] ? partes[1].trim() : ''
  };
}
