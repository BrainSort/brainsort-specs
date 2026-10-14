export interface GrafoData {
  nodos: string[];
  aristas: [string, string][];
  dirigido: boolean;
}

export interface SimulationInput {
  tipoOrigen: 'Predeterminado' | 'Personalizado';
  data?: number[];
  valores?: number[];
  tamano?: number;
  objetivo?: number;
  grafo?: GrafoData;
  nodoInicio?: string;
}

export interface AlgorithmDefinition {
  meta: {
    nombre: string;
    descripcion: string;
    complejidadTiempo: string;
    complejidadEspacio: string;
    categoria: string;
    tipoEstructura?: 'array' | 'grafo';
    requiereOrdenado?: boolean;
  };
  execute(input: any): SimulationStep[];
}

// Tipo para el pseudocódigo almacenado en la base de datos
export type PseudocodeDB = PseudocodeLine[];

export interface PseudocodeLine {
  line: number; // Índice base 1
  text: string; // Texto de la línea de pseudocódigo
  indent: number; // Nivel de indentación espacial
}

export type TipoOperacion =
  | 'idle'
  | 'comparacion'
  | 'intercambio'
  | 'insercion'
  | 'final'
  | 'descarte'
  | 'encontrado'
  | 'no_encontrado'
  | 'visita'
  | 'encolar'
  | 'desencolar'
  | 'apilar'
  | 'desapilar';

export interface SimulationMarker {
  index: number;
  label: string;
  role: string;
  color: string;
}

export interface SimulationStepContext {
  waitingIndices?: number[];
}

export interface SimulationTreeNode {
  index: number;
  value: number | null;
  level: number;
  position: number;
  label?: string;
}

export interface PasoBase {
  numeroPaso: number;
  tipoOperacion: TipoOperacion;
  lineaPseudocodigo: number; // Índice base 1 correspondiente a PseudocodeLine
  contexto?: SimulationStepContext;
  marcadores?: SimulationMarker[];
}

export interface PasoArray extends PasoBase {
  tipoEstructura?: 'array';
  indicesActivos: number[]; // Índices en el arreglo que están siendo modificados o comparados
  estadoArray: number[]; // Clon del estado del arreglo en este paso
  rango?: { bajo: number; medio: number; alto: number }; // Búsqueda binaria
  nodosArbol?: SimulationTreeNode[];
}

export interface PasoGrafo extends PasoBase {
  tipoEstructura: 'grafo';
  nodoActual: string | null;
  visitados: string[]; // Nodos visitados en orden cronológico
  frontera: string[]; // Cola (BFS) o Pila (DFS)
  aristaActiva?: [string, string];
}

export type SimulationStep = PasoArray | PasoGrafo;
