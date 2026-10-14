import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsArray,
  IsNumber,
  IsEnum,
  IsInt,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GrafoDataDto {
  @ApiProperty({
    type: [String],
    description: 'Lista de identificadores de los nodos del grafo',
    example: ['A', 'B', 'C', 'D'],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2, { message: 'El grafo debe tener al menos 2 nodos' })
  @ArrayMaxSize(20, { message: 'El grafo debe tener como máximo 20 nodos' })
  nodos: string[];

  @ApiProperty({
    type: [[String]],
    description: 'Lista de aristas representadas como pares [origen, destino]',
    example: [
      ['A', 'B'],
      ['B', 'C'],
      ['C', 'D'],
    ],
  })
  @IsArray()
  aristas: [string, string][];

  @ApiProperty({
    description: 'Indica si el grafo es dirigido',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  dirigido: boolean;
}

export class ConjuntoDeDatosDto {
  @ApiProperty({
    enum: ['Predeterminado', 'Personalizado'],
    description: 'Tipo de origen de los datos',
    example: 'Predeterminado',
  })
  @IsEnum(['Predeterminado', 'Personalizado'])
  tipoOrigen: 'Predeterminado' | 'Personalizado';

  @ApiProperty({
    required: false,
    type: [Number],
    description: 'Valores del array de datos (para ordenamiento y búsqueda)',
    example: [5, 2, 8, 1, 9],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  valores?: number[];

  @ApiProperty({
    required: false,
    description: 'Tamaño del array (para ordenamiento y búsqueda)',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(50)
  tamano?: number;

  @ApiProperty({
    required: false,
    description: 'Valor objetivo para algoritmos de búsqueda (Lineal / Binaria)',
    example: 8,
  })
  @IsOptional()
  @IsInt()
  objetivo?: number;

  @ApiProperty({
    required: false,
    type: () => GrafoDataDto,
    description: 'Estructura del grafo (para algoritmos BFS y DFS)',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => GrafoDataDto)
  grafo?: GrafoDataDto;

  @ApiProperty({
    required: false,
    description: 'Nodo inicial del recorrido para algoritmos de grafo',
    example: 'A',
  })
  @IsOptional()
  @IsString()
  nodoInicio?: string;
}

export class CreateSimulationDto {
  @ApiProperty({
    description: 'ID del algoritmo a simular',
    example: 'uuid-del-algoritmo',
  })
  @IsUUID()
  algoritmoId: string;

  @ApiProperty({
    type: ConjuntoDeDatosDto,
    description: 'Conjunto de datos para la simulación',
  })
  @ValidateNested()
  @Type(() => ConjuntoDeDatosDto)
  conjuntoDeDatos: ConjuntoDeDatosDto;
}
