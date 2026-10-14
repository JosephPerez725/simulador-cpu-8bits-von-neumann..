; =====================================================================
; BANCO DE PROGRAMAS DEMOSTRATIVOS - ARQUITECTURA VON NEUMANN (8 BITS)
; =====================================================================

; --- PROGRAMA 1: Multiplicación por Sumas Sucesivas (6 x 3 = 18) ---
00h: MOV AX, 0          ; Inicializa acumulador AX = 0
01h: LOAD BX, [81h]     ; Carga contador BX = 3 desde RAM[81h]
02h: ADD AX, [80h]      ; Bucle: AX = AX + RAM[80h] (6)
03h: STORE [82h], AX    ; Almacena suma parcial en RAM[82h]
04h: DEC BX             ; BX = BX - 1 (Actualiza ZF)
05h: JNZ 02h            ; Si ZF == 0, salta a 02h
06h: OUT [FEh], AX      ; Envía resultado (18) al Puerto de Salida FEh
07h: CMP AX, 20         ; 18 - 20 = -2 -> Activa SF=1 (Negativo) y CF=1
08h: JZ 0Ah             ; Salto condicional si ZF == 1
09h: HLT                ; Detiene el reloj del CPU

; --- PROGRAMA 2: Serie de Fibonacci hasta Desbordamiento (CF = 1) ---
00h: MOV AX, 1
01h: MOV BX, 1
02h: STORE [80h], AX
03h: ADD AX, BX
04h: JC 08h             ; Salta si hay acarreo de 8 bits (> 255)
05h: STORE [81h], AX
06h: ADD BX, AX
07h: JMP 02h            ; Salto incondicional al bucle
08h: OUT [FEh], BX
09h: HLT
