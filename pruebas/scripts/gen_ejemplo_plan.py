"""Genera Plan de Pruebas llenado con datos actualizados de BrainSort (Incluye API Integración)"""
from docx import Document
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
import os

doc = Document()
style = doc.styles['Normal']
style.font.name = 'Calibri'; style.font.size = Pt(11)
for i in range(1,4):
    doc.styles[f'Heading {i}'].font.color.rgb = RGBColor(0x1F,0x3A,0x5F)

def tbl(doc, hdrs, rows):
    t = doc.add_table(rows=1+len(rows), cols=len(hdrs))
    t.style = 'Light Grid Accent 1'; t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i,h in enumerate(hdrs):
        c = t.rows[0].cells[i]; c.text = h
        for p in c.paragraphs:
            for r in p.runs: r.bold = True; r.font.size = Pt(10)
    for ri,row in enumerate(rows):
        for ci,v in enumerate(row):
            cell = t.rows[ri+1].cells[ci]; cell.text = str(v)
            for p in cell.paragraphs:
                for r in p.runs: r.font.size = Pt(10)
    doc.add_paragraph()

# PORTADA
for _ in range(6): doc.add_paragraph()
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('PLAN DE PRUEBAS DE SOFTWARE'); r.bold = True; r.font.size = Pt(26); r.font.color.rgb = RGBColor(0x1F,0x3A,0x5F)
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('BrainSort - Sprint 4: Integración API y Simulación Avanzada'); r.bold = True; r.font.size = Pt(18); r.font.color.rgb = RGBColor(0x2E,0x74,0xB5)
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('Aplicacion educativa para visualizacion de algoritmos de ordenamiento'); r.font.size = Pt(12)
for _ in range(3): doc.add_paragraph()
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.add_run('Version 2.0  |  Mayo 2026').font.size = Pt(12)
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('Basado en IEEE 829-2008 y especificaciones brainsort-specs'); r.font.size = Pt(10); r.italic = True
doc.add_page_break()

# 1. INTRODUCCION
doc.add_heading('1. Introduccion', level=1)
doc.add_heading('1.1 Proposito', level=2)
doc.add_paragraph('Este documento define la estrategia de pruebas para la Integración del API y el módulo de Simulación Visual de BrainSort. Cubre la conexión cliente-servidor (CO1, CO3) y los motores de ordenamiento migrados al backend.')
doc.add_heading('1.2 Alcance', level=2)
doc.add_paragraph('Frontend (brainsort-app): SimulationScreen.tsx actualizado, BarChart.tsx (soporte highlightIndices), navegación a ExerciseScreen.', style='List Bullet')
doc.add_paragraph('Backend (brainsort-api): AlgorithmsModule, GET /api/biblioteca, motores en src/simulations/engines/ (bubble-sort.engine.ts, etc.)', style='List Bullet')
doc.add_paragraph('NO se probara: Autenticacion JWT, gamificacion (puntajes/niveles), offline (Service Workers).', style='List Bullet')

doc.add_heading('1.3 Referencias', level=2)
tbl(doc, ['Documento','Version','Fecha'], [
    ['library-simulation.spec.md','1.2','10/04/2026'],
    ['library-simulation.plan.md','1.1','12/04/2026'],
    ['constitution.md','1.0','15/02/2026'],
])

# 2. ELEMENTOS A PROBAR
doc.add_heading('2. Elementos a Probar', level=1)
tbl(doc, ['ID','Modulo','Componente/Archivo','Prioridad'], [
    ['EP-01','API','GET /api/biblioteca (AlgorithmsModule)','Critica'],
    ['EP-02','API','Motores Backend (Bubble, Selection, Insertion)','Critica'],
    ['EP-03','Integración','useAlgorithm fetch en SimulationScreen','Critica'],
    ['EP-04','Simulacion','BarChart.tsx (Parseo de highlightIndices)','Critica'],
    ['EP-05','Controles','ControlBar y SpeedSlider en Frontend','Alta'],
    ['EP-06','Navegación','Botón Practicar hacia ExerciseScreen','Media'],
])

# 3. EXCLUSIONES
doc.add_heading('3. Elementos Excluidos', level=1)
for e in ['Autenticacion (AuthContext y JWT guard) - Sprint 5',
          'Gamificacion (cálculo de XP e insignias)',
          'Funcionalidad offline local - Sprint 6']:
    doc.add_paragraph(e, style='List Bullet')

# 4. ENFOQUE
doc.add_heading('4. Enfoque de Pruebas', level=1)
tbl(doc, ['Nivel','Que se prueba','Herramienta','Responsable'], [
    ['Unitarias API','engines (timeout 10k iteraciones, pasos)','Jest (Backend)','Carlos Mendoza'],
    ['Integracion API','Endpoints /api/biblioteca','Supertest','Ana Rodriguez'],
    ['Sistema (E2E)','Flujo completo App -> API -> UI','Manual en Expo Go','Luis Perez'],
])

# 5. CRITERIOS
doc.add_heading('5. Criterios de Aceptacion', level=1)
tbl(doc, ['Criterio','Metrica','Umbral'], [
    ['Cobertura Backend','Jest --coverage en src/simulations/','>=85% lineas'],
    ['Casos Integración','Pruebas API-Frontend','100% PASADOS'],
    ['Rendimiento API','Tiempo de respuesta GET /biblioteca','< 200ms'],
])

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'ejemplos', '3.1-Plan-de-Pruebas-EJEMPLO-v2.docx')
os.makedirs(os.path.dirname(out), exist_ok=True)
doc.save(out)
print('OK Plan: ' + out)
