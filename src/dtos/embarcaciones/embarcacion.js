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

// DTO para la Embarcación
const EmbarcacionDto = z.object({
  titulo_embarcacion: z.string().nonempty("El título de la embarcación es obligatorio"),
  destino_embarcacion:z.string().nonempty('el destino no puede estar vacio'),
  cliente_id: z
    .string()
    .refine((id) => /^[0-9a-fA-F]{24}$/.test(id), {
      message: "cliente_id debe ser un ObjectId válido",
    }),
  is_activated: z.boolean().default(true),
  trabajadores: z.array(TrabajadorDto).default([]),
  permisos_embarcacion: z.array(PermisoDto).default([]),
  
});



const updateEmbarcacionAdminDto= z.object({
  titulo_embarcacion: z.string().nonempty("El título de la embarcación es obligatorio"),
  cliente_id: z
    .string()
    .refine((id) => /^[0-9a-fA-F]{24}$/.test(id), {
      message: "cliente_id debe ser un ObjectId válido",
    }),
  is_activated: z.boolean().default(true),
  trabajadores: z.array(TrabajadorDto).default([]),
  permisos_embarcacion: z.array(PermisoDto).default([]),
  ubicacion_embarcacion: z.array(UbicacionDto).default([]),

})

const updateEmbarcacionTrabajadorDto= z.object({
  is_activated: z.boolean().default(true),
  permisos_embarcacion: z.array(PermisoDto).default([]),
  ubicacion_embarcacion: z.array(UbicacionDto).default([]),

})
export { EmbarcacionDto,updateEmbarcacionAdminDto,updateEmbarcacionTrabajadorDto};
