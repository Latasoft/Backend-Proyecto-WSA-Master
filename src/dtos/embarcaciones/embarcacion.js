import { z } from "zod";

// DTO para la ubicación usando GeoJSON
const UbicacionDto = z.object({
  type: z
    .string()
    .default("Point")
    .refine((val) => val === "Point", {
      message: "El campo 'type' debe ser 'Point'",
    }),
  coordinates: z
    .array(z.number())
    .length(2, "Las coordenadas deben ser un arreglo de 2 números: [longitud, latitud]"),
  timestamp: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    },
    z.date().optional().default(new Date())
  ),
});

const clientesDto= z.object({
  cliente_id: z
    .string()
    .refine((id) => /^[0-9a-fA-F]{24}$/.test(id), {
      message: "trabajadorId debe ser un ObjectId válido",
    }),
})

// DTO para los trabajadores
const TrabajadorDto = z.object({
  trabajadorId: z
    .string()
    .refine((id) => /^[0-9a-fA-F]{24}$/.test(id), {
      message: "trabajadorId debe ser un ObjectId válido",
    }),
});


// DTO para cada acción dentro de un estado
const AccionDto = z.object({
  nombre: z.string(),
  fecha: z
    .preprocess(
      (arg) => {
        if (arg === undefined || arg === null || arg === "") return undefined;
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
        return arg;
      },
      z.date().optional()
    )
    .optional(),
  comentario:z.string().optional(),
  indicente:z.boolean().optional(),
});

// DTO para cada estado en la línea de tiempo  
const EstadoDto = z.object({
  nombre_estado: z.string().min(1),
  acciones: z.array(AccionDto).default([]), 
});

// DTO para cada servicio
const ServicioDto = z.object({
  nombre_servicio: z.string(),
  // Cada servicio contiene una lista de estados (con sus respectivas acciones)
  estados: z.array(EstadoDto).default([]),
});

// DTO para la Embarcación
const EmbarcacionDto = z.object({
  empresa_cliente_id: z.string().min(1, "El id de la empresa cliente es obligatorio"),
  nombre_empresa_cliente: z.string().min(1, "El nombre de la empresa cliente es obligatorio"),
  da_numero: z.string().nonempty("El número DA es obligatorio"),
  estado_actual: z.string().optional(),
  comentario_general: z.string().optional(),
  servicio: z.string().optional(),
  subservicio: z.string().optional(),
  servicio_relacionado: z.string().optional(),
  titulo_embarcacion: z.string().nonempty("El título de la embarcación es obligatorio"),
  destino_embarcacion: z.string().nonempty("El destino no puede estar vacío"),
  pais_embarcacion: z.string().min(1, "El país de la embarcación es obligatorio"),
  clientes: z.array(clientesDto).default([]),
  is_activated: z.boolean().default(true),
  trabajadores: z.array(TrabajadorDto).default([]),
  // Aquí se incluye la nueva estructura para servicios
  servicios: z.array(ServicioDto).default([]),
  fecha_arribo: z.preprocess(
    (arg) => {
      if (arg === null || arg === undefined) return undefined;
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    },
    z.date().optional()
  ),
  fecha_estimada_zarpe: z.preprocess(
  (arg) => {
    if (arg === null || arg === undefined) return undefined;
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return arg;
  },
  z.date().optional()
),

  fecha_zarpe: z.preprocess(
    (arg) => {
      if (arg === null || arg === undefined) return undefined;
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    },
    z.date().optional()
  ),
  

});

// Exporta los DTOs necesarios
export { EmbarcacionDto};
