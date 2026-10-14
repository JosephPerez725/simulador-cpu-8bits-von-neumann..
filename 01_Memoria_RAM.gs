/**
 * MÓDULO 1: ARQUITECTURA DE MEMORIA PRINCIPAL (256 BYTES: 00h a FFh)
 * Implementa las primitivas Read(address) y Write(address, value) y el mapeo 16x16.
 */

function Read(address) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const addr = address & 0xFF;
  const hexAddr = toHex8(addr);

  actualizarRegistroUI(sheet, 7, addr, hexAddr, toBin8(addr)); // MAR
  sheet.getRange(11, 2, 1, 3).setValues([[hexAddr, 'MAR -> RAM', 'ACTIVO (READ)']]).setBackground('#fef08a');
  sheet.getRange(13, 2, 1, 3).setValues([['MEM_READ', 'LECTURA RAM', 'ACTIVO']]).setBackground('#fef08a');

  const ramRow = 4 + addr;
  const contenido = String(sheet.getRange(ramRow, 26).getValue()).trim();
  const byteVal = codificarCeldaAByte(contenido);

  actualizarRegistroUI(sheet, 8, contenido, toHex8(byteVal), toBin8(byteVal)); // MDR
  sheet.getRange(12, 2, 1, 3).setValues([[contenido, 'RAM -> MDR', 'DATO EN BUS']]).setBackground('#fef08a');
  resaltarDireccionRAM(sheet, addr, '#facc15');
  return contenido;
}

function Write(address, value) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const addr = address & 0xFF;
  const val8 = ((Number(value) % 256) + 256) % 256;
  const hexAddr = toHex8(addr);
  const hexVal = toHex8(val8);
  const binVal = toBin8(val8);

  actualizarRegistroUI(sheet, 7, addr, hexAddr, toBin8(addr)); // MAR
  actualizarRegistroUI(sheet, 8, val8, hexVal, binVal);        // MDR
  sheet.getRange(11, 2, 1, 3).setValues([[hexAddr, 'MAR -> RAM', 'ACTIVO (WRITE)']]).setBackground('#fed7aa');
  sheet.getRange(12, 2, 1, 3).setValues([[val8 + ' (' + hexVal + ')', 'MDR -> RAM', 'ESCRIBIENDO']]).setBackground('#fed7aa');
  sheet.getRange(13, 2, 1, 3).setValues([['MEM_WRITE', 'ESCRITURA RAM', 'ACTIVO']]).setBackground('#fed7aa');

  const ramRow = 4 + addr;
  sheet.getRange(ramRow, 26, 1, 3).setValues([[String(val8), hexVal, binVal]]);

  const mRow = 4 + Math.floor(addr / 16);
  const mCol = 7 + (addr % 16);
  sheet.getRange(mRow, mCol).setValue(hexVal);

  if (addr === 0xFE || addr === 0xFF) {
    const outVal = sheet.getRange(4 + 0xFE, 26).getValue();
    const inVal = sheet.getRange(4 + 0xFF, 26).getValue();
    sheet.getRange(14, 2, 1, 3).setValues([['OUT[FEh]: ' + outVal, 'IN[FFh]: ' + inVal, 'I/O ACTUALIZADO']]).setBackground('#fdba74');
  }
  resaltarDireccionRAM(sheet, addr, '#fb923c');
}
