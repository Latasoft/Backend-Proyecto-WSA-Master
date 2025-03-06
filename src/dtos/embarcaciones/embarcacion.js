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

// DTO para permisos
const PermisoDto = z.object({
  nombre_permiso: z.string(),
});

// DTO para cada acción dentro de un estado
const AccionDto = z.object({
  nombre: z.string(),
  fecha: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    },
    z.date()
  ),
});

// DTO para cada estado en la línea de tiempo  
const EstadoDto = z.object({
  // Si los estados son fijos, se puede usar un enum para validarlos:
  nombre_estado: z.enum([ "puerto", "hotel", "aeropuerto"]),
  // Un estado puede tener múltiples acciones
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
  titulo_embarcacion: z.string().nonempty("El título de la embarcación es obligatorio"),
  destino_embarcacion: z.string().nonempty("El destino no puede estar vacío"),
  clientes: z.array(clientesDto).default([]),
  is_activated: z.boolean().default(true),
  trabajadores: z.array(TrabajadorDto).default([]),
  permisos_embarcacion: z.array(PermisoDto).default([]),
  // Aquí se incluye la nueva estructura para servicios
  servicios: z.array(ServicioDto).default([]),
});

// Exporta los DTOs necesarios
export { EmbarcacionDto};
