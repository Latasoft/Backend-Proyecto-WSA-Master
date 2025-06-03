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
  fecha: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    },
    z.date()
  ),
  comentario:z.string().optional(),
  indicente:z.boolean().optional(),
});

// DTO para cada estado en la línea de tiempo  
const EstadoDto = z.object({
  // Si los estados son fijos, se puede usar un enum para validarlos:
  nombre_estado: z.enum([
    "Provisions and Bonds",
    "Technical Assitance and Products",
    "WorkShop Coordination",
    "Diving Service Coordination",
    "Marine Surveyor Arrangement",
    "Last Mile",
    "Sample shipping",
    "Cargo Shipping",
    "Landing and Return By Courier",
    "Airfreight Coordination",
    "Seafreight Coordination",
    "Courier on Board Clearance",
    "Landing and Return Spare Parts",
    "Port Technical Services",
    "Custom Process",
    "Representation",
    "Local Subpplier And Provisions to Expeditions",
    "Hub Agent",
    "Part Asistence",
    "Account Supervision",
    "Tax Recovery (Chile)",
    "Full Port Agent",
    "Protective Agency",
    "Bunkering Call",
    "Logistic Call",
    "Panama Channel Transit",
    "Magellan Strait Pilotage",
    "Crew Change",
    "Medical Assistance",
    "Visa Authorization on Arraival",
    "Hotel Service",
    "Transportation",
    "Cash to Master",
    "Ok to Board Issuance",
    "Working Permit" // Agregado si lo necesitas
  ]),
  
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
  
  da_numero: z.string().nonempty("El número DA es obligatorio"),
  estado_actual: z.string().optional(),
  comentario_general: z.string().optional(),
  servicio: z.string().optional(),
  subservicio: z.string().optional(),
  servicio_relacionado: z.string().optional(),
  titulo_embarcacion: z.string().nonempty("El título de la embarcación es obligatorio"),
  destino_embarcacion: z.string().nonempty("El destino no puede estar vacío"),
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
