"""Genera 3.2 Casos de Prueba EJEMPLO llenado con datos actualizados de BrainSort"""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
import os

wb = Workbook()
hf = Font(name='Calibri', bold=True, color='FFFFFF', size=11)
hfill = PatternFill(start_color='1F3A5F', end_color='1F3A5F', fill_type='solid')
crit = PatternFill(start_color='FFD7D7', end_color='FFD7D7', fill_type='solid')
alta = PatternFill(start_color='FFF3CD', end_color='FFF3CD', fill_type='solid')
med = PatternFill(start_color='D4EDDA', end_color='D4EDDA', fill_type='solid')
bdr = Border(left=Side(style='thin'),right=Side(style='thin'),top=Side(style='thin'),bottom=Side(style='thin'))
wrap = Alignment(wrap_text=True, vertical='top')

def do_hdr(ws, row=1):
    for c in ws[row]:
        c.font=hf; c.fill=hfill; c.border=bdr
        c.alignment=Alignment(horizontal='center',vertical='center',wrap_text=True)

def do_row(ws, row, sev=None):
    for c in ws[row]:
        c.border=bdr; c.alignment=wrap
        if sev=='Critica': c.fill=crit
        elif sev=='Alta': c.fill=alta
        elif sev=='Media': c.fill=med

# HOJA 1: CASOS
ws = wb.active; ws.title = 'Casos de Prueba'
ws.append(['ID','Modulo','Nombre','HU/CO','Precondiciones','Datos de Entrada','Pasos','Resultado Esperado','Severidad','Estado'])
do_hdr(ws)

cases = [
['CP-API-01','API Backend','Obtener biblioteca de algoritmos','CO1',
 '1. Servidor Backend en ejecución',
 'GET /api/biblioteca',
 '1. Realizar petición HTTP GET a /api/biblioteca\n2. Verificar código de respuesta HTTP',
 'HTTP 200 OK. JSON incluye categorías y arreglo de algoritmos (Bubble Sort, etc.).','Critica','Pendiente'],

['CP-API-02','API Backend','Timeout en motor backend','HU-06',
 '1. Motores importados desde src/simulations/engines/',
 'Input: Array grande inversamente ordenado',
 '1. Llamar execute() del engine\n2. Provocar más de 10,000 iteraciones en el while/for loop',
 'Lanza excepcion "Timeout: Maximum iteration limit reached in engine".','Critica','Pendiente'],

['CP-INT-01','Integracion','SimulationScreen consume API','CO3',
 '1. Backend en ejecución\n2. App iniciada',
 'Navegar a pantalla de simulación de Bubble Sort',
 '1. Verificar hook useAlgorithm(algoritmoId)\n2. Revisar llamadas de red en DevTools',
 'App hace petición al backend. Muestra el nombre "Bubble Sort" devuelto por API. headerRow es visible.','Critica','Pendiente'],

['CP-SIM-01','Simulacion','BarChart colores con highlightIndices','HU-04',
 '1. Simulacion corriendo con datos del backend',
 'Paso con highlightIndices: { swap: [0,1] }',
 '1. Verificar renderizado en BarChart.tsx\n2. Analizar props pasadas al componente',
 'Barras en índices 0 y 1 toman color Rojo (SimulationColors.intercambio). Compatibilidad legacy mantenida.','Critica','Pendiente'],

['CP-NAV-01','Navegacion','Boton Practicar hacia Ejercicios','HU-01',
 '1. Pantalla de simulacion cargada',
 'Tap en botón "Practicar"',
 '1. Observar botón "Practicar"\n2. Hacer tap\n3. Verificar pantalla de destino',
 'Navega a ExerciseScreen pasando el algoritmoId actual. No recarga la página en versión web.','Media','Pendiente'],

['CP-SIM-02','Simulacion','Play inicia animacion','HU-04',
 '1. SimulationScreen cargada con [5,2,8,1]\n2. isPlaying=false',
 'Tap en boton Play',
 '1. Presionar boton Play\n2. Observar animacion\n3. Verificar cambio de icono',
 'Barras se animan. isPlaying=true. Icono cambia a "pause".','Critica','Pendiente'],

['CP-SIM-03','Simulacion','Pausa detiene animacion','HU-04',
 '1. Simulacion en ejecucion (isPlaying=true)',
 'Tap en boton Pausa',
 '1. Con animacion corriendo, presionar Pausa',
 'Animacion congelada en paso actual. isPlaying=false.','Critica','Pendiente'],

['CP-SIM-04','Simulacion','Velocidad ajustable 0.25x a 2.0x','HU-04',
 '1. SpeedSlider.tsx visible',
 'Mover slider',
 '1. Mover slider y verificar setSpeed()\n2. Play',
 'Velocidad cambia según valor [0.25x - 2.0x].','Alta','Pendiente'],

['CP-DAT-01','Datos','Datos predeterminados y reseteo','HU-03',
 '1. Algoritmo seleccionado',
 'Cambio de algoritmoId',
 '1. Observar trigger de useEffect en SimulationScreen\n2. Cambiar de algoritmo',
 'resetSimulation() ejecuta, setHasStarted(false), variables de error se limpian.','Alta','Pendiente']
]

for i,c in enumerate(cases):
    ws.append(c); do_row(ws, i+2, c[8])

widths = [12,14,38,10,45,30,60,50,12,12]
for i,w in enumerate(widths): ws.column_dimensions[chr(65+i)].width = w
ws.auto_filter.ref = ws.dimensions; ws.freeze_panes = 'A2'

out = os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','ejemplos','3.2-Casos-de-Prueba-EJEMPLO-v2.xlsx')
wb.save(out)
print('OK Casos: '+out)
