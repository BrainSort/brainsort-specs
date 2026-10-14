import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsEnum,
  IsOptional,
  IsArray,
  IsString,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TipoOperacion,
  SimulationMarker,
  SimulationTreeNode,
  SimulationStepContext,
} from '../engines/engine.interface';

export const TIPOS_OPERACION: TipoOperacion[] = [
  'idle',
  'comparacion',
  'intercambio',
  'insercion',
  'final',
  'descarte',
  'encontrado',
  'no_encontrado',
  'visita',
  'encolar',
  'desencolar',
  'apilar',
  'desapilar',
];

export class RangoBusquedaDto {
  @ApiProperty({ description: 'Índice límite inferior actual', example: 0 })
  @IsInt()
  bajo: number;

  @ApiProperty({ description: 'Índice punto medio actual', example: 3 })
  @IsInt()
  medio: number;

  @ApiProperty({ description: 'Índice límite superior actual', example: 7 })
  @IsInt()
  alto: number;
}

export class PasoBaseDto {
  @ApiProperty({ description: 'Número del paso en la simulación (base 1)', example: 1 })
  @IsInt()
  @Min(1)
  numeroPaso: number;

  @ApiProperty({
    description: 'Tipo de operación realizada',
    enum: TIPOS_OPERACION,
    example: 'comparacion',
  })
  @IsEnum(TIPOS_OPERACION)
  tipoOperacion: TipoOperacion;

  @ApiProperty({
    description: 'Línea de pseudocódigo correspondiente (base 1)',
    example: 2,
  })
  @IsInt()
  @Min(1)
  lineaPseudocodigo: number;

  @ApiProperty({
    required: false,
    description: 'Marcadores visuales enriquecidos para la interfaz',
  })
  @IsOptional()
  marcadores?: SimulationMarker[];

  @ApiProperty({
    required: false,
    description: 'Contexto de ejecución del paso',
  })
  @IsOptional()
  contexto?: SimulationStepContext;
}

export class PasoArrayDto extends PasoBaseDto {
  @ApiProperty({
    required: false,
    description: 'Discriminador de estructura',
    enum: ['array'],
    default: 'array',
    example: 'array',
  })
  @IsOptional()
  @IsEnum(['array'])
  tipoEstructura?: 'array';

  @ApiProperty({
    type: [Number],
    description: 'Índices del array siendo modificados o comparados',
    example: [0, 1],
  })
  @IsArray()
  indicesActivos: number[];

  @ApiProperty({
    type: [Number],
    description: 'Estado del array de números en este paso',
    example: [2, 5, 8, 1],
  })
  @IsArray()
  estadoArray: number[];

  @ApiProperty({
    required: false,
    type: () => RangoBusquedaDto,
    description: 'Rango de búsqueda binaria [bajo, medio, alto]',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RangoBusquedaDto)
  rango?: RangoBusquedaDto;

  @ApiProperty({
    required: false,
    description: 'Nodos explícitos para visualizaciones de estructuras de árbol',
  })
  @IsOptional()
  nodosArbol?: SimulationTreeNode[];
}

export class PasoGrafoDto extends PasoBaseDto {
  @ApiProperty({
    description: 'Discriminador de estructura',
    enum: ['grafo'],
    example: 'grafo',
  })
  @IsEnum(['grafo'])
  tipoEstructura: 'grafo';

  @ApiProperty({
    description: 'ID o etiqueta del nodo activo en este paso',
    nullable: true,
    example: 'A',
  })
  @IsOptional()
  nodoActual: string | null;

  @ApiProperty({
    type: [String],
    description: 'Lista ordenada cronológicamente de nodos visitados',
    example: ['A', 'B', 'C'],
  })
  @IsArray()
  @IsString({ each: true })
  visitados: string[];

  @ApiProperty({
    type: [String],
    description: 'Estado de la frontera (Cola para BFS, Pila para DFS)',
    example: ['D', 'E'],
  })
  @IsArray()
  @IsString({ each: true })
  frontera: string[];

  @ApiProperty({
    required: false,
    type: [String],
    description: 'Arista explorada en este paso [nodoOrigen, nodoDestino]',
    example: ['A', 'B'],
  })
  @IsOptional()
  aristaActiva?: [string, string];
}

export class SimulationStepDto {
  @ApiProperty({ description: 'Número del paso en la simulación (base 1)', example: 1 })
  @IsInt()
  @Min(1)
  numeroPaso: number;

  @ApiProperty({
    description: 'Tipo de operación realizada',
    enum: TIPOS_OPERACION,
    example: 'comparacion',
  })
  @IsEnum(TIPOS_OPERACION)
  tipoOperacion: TipoOperacion;

  @ApiProperty({
    description: 'Línea de pseudocódigo correspondiente (base 1)',
    example: 2,
  })
  @IsInt()
  @Min(1)
  lineaPseudocodigo: number;

  @ApiProperty({
    required: false,
    enum: ['array', 'grafo'],
    description: 'Discriminador de estructura: array o grafo',
    default: 'array',
    example: 'array',
  })
  @IsOptional()
  @IsEnum(['array', 'grafo'])
  tipoEstructura?: 'array' | 'grafo';

  @ApiProperty({
    required: false,
    type: [Number],
    description: 'Índices del array siendo modificados o comparados (tipo array)',
    example: [0, 1],
  })
  @IsOptional()
  @IsArray()
  indicesActivos?: number[];

  @ApiProperty({
    required: false,
    type: [Number],
    description: 'Estado del array en este paso (tipo array)',
    example: [2, 5, 8, 1],
  })
  @IsOptional()
  @IsArray()
  estadoArray?: number[];

  @ApiProperty({
    required: false,
    type: () => RangoBusquedaDto,
    description: 'Rango de búsqueda binaria [bajo, medio, alto]',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RangoBusquedaDto)
  rango?: RangoBusquedaDto;

  @ApiProperty({
    required: false,
    description: 'ID o etiqueta del nodo activo (tipo grafo)',
    nullable: true,
    example: 'A',
  })
  @IsOptional()
  nodoActual?: string | null;

  @ApiProperty({
    required: false,
    type: [String],
    description: 'Lista ordenada de nodos visitados (tipo grafo)',
    example: ['A', 'B', 'C'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  visitados?: string[];

  @ApiProperty({
    required: false,
    type: [String],
    description: 'Frontera de exploración: cola en BFS o pila en DFS (tipo grafo)',
    example: ['D', 'E'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  frontera?: string[];

  @ApiProperty({
    required: false,
    type: [String],
    description: 'Arista explorada en este paso [origen, destino] (tipo grafo)',
    example: ['A', 'B'],
  })
  @IsOptional()
  aristaActiva?: [string, string];

  @ApiProperty({
    required: false,
    description: 'Marcadores visuales enriquecidos desde la configuración del algoritmo',
  })
  @IsOptional()
  marcadores?: SimulationMarker[];

  @ApiProperty({
    required: false,
    description: 'Nodos explícitos para visualizaciones de árbol',
  })
  @IsOptional()
  nodosArbol?: SimulationTreeNode[];

  @ApiProperty({
    required: false,
    description: 'Contexto de ejecución',
  })
  @IsOptional()
  contexto?: SimulationStepContext;
}
