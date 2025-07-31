import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, '../.env') });

import EstructuraServicio from './model/estructura-servicio.js';

const MONGO_URI = process.env.MONGO_URI;
console.log('✅ MONGO_URI:', MONGO_URI);


const estructuraInicial = [
  {
    principal: 'Crew Services',
    subtitulo: 'Specialized in Owners Matters',
    subservicios: [
      {
        nombre: 'Crew change',
        servicios: [
          { nombre: 'Ok to board' },
          { nombre: 'Flight Schedule not confirmed' },
          { nombre: 'Crew details and/or documents not recived' },
          { nombre: 'M&G airport SCL international arrival' },
          { nombre: 'M&G airport SCL international departure' },
          { nombre: 'M&G airport SCL domestic departure' },
          { nombre: 'M&G airport SCL domestic arrival' },
          { nombre: 'Lost Luggage' },
          { nombre: 'Delays Flight' },
          { nombre: 'Not Arrival on informed flight' },
          { nombre: 'Immigration Issues' },
          { nombre: 'Luggage countrol Issues' },
          { nombre: 'Fligth Cancelled' },
          { nombre: 'Fligth Not Confirmed' },
          { nombre: 'Transport local services' },
          { nombre: 'Transport airport / port embarking' },
          { nombre: 'Transport port / airport' },
          { nombre: 'Transport airport / hotel' },
          { nombre: 'Transport hotel / airport' },
          { nombre: 'Transport hotel / port embarking' },
          { nombre: 'Transport port / hotel' },
          { nombre: 'Transport medical center / Port' },
          { nombre: 'Transport Port / Medical center' },
          { nombre: 'Transport airport SCL / hotel SCL' },
          { nombre: 'Transport hotel SCL / airport SCL' },
          { nombre: 'Delays due to crew no disembarking on time.' },
          { nombre: 'Delays due to crew no check out on time.' },
          { nombre: 'Hotel Check in' },
          { nombre: 'Hotel Check out' },
          { nombre: 'Embarking by launch' },
          { nombre: 'Embarking Alongside' },
          { nombre: 'Port entry not allowed.' },
          { nombre: 'Shore pass lost.' },
          { nombre: 'Sick' },
          { nombre: 'Disembarking by launch' },
          { nombre: 'Disembarking Alongside' },
          { nombre: 'Wheather conditions' },
          { nombre: 'Port Authorization' },
          { nombre: 'No Shore Pass' },
          { nombre: 'Shore pass Lost' },
          { nombre: 'Agriculture  Luggage checking' },
          { nombre: 'Service completed' }
        ]
      },
      {
        nombre: 'Medical assistance',
        servicios: [
          { nombre: 'Documents received' },
          { nombre: 'Medical attendance coordination' },
          { nombre: 'Diagnostic (Email)' },
          { nombre: 'Medicines' },
          { nombre: 'Hospitalization' },
          { nombre: 'Exams' },
          { nombre: 'Deceased' },
          { nombre: 'Not fit to work' },
          { nombre: 'Not fit to Fly' },
          { nombre: 'Transport to medical center' },
          { nombre: 'Transport medical center / to vessel' },
          { nombre: 'Transport medical center to hotel' },
          { nombre: 'Transport hotel / to vessel' },
          { nombre: 'Transport hotel / airport' },
          { nombre: 'M&G airport SCL international departure' },
          { nombre: 'M&G airport SCL domestic departure' },
          { nombre: 'M&G airport SCL domestic arrival' },
          { nombre: 'Hotel Check in' },
          { nombre: 'Hotel Check out' },
          { nombre: 'Embarking by launch' },
          { nombre: 'Embarking Alongside' },
          { nombre: 'Disembarking by launch' },
          { nombre: 'Disembarking Alongside' },
          { nombre: 'Service completed' }
        ]
      }
    ]
  },
  {
    principal: 'Maritime Support',
    subtitulo: 'Owners Representation',
    subservicios: [
      { nombre: 'Hub Agent.', servicios: [] },
      { nombre: 'Cash to master.', servicios: [] },
      { nombre: 'Protective Agent.', servicios: [] },
      { nombre: 'Technician Assistant', servicios: [] },
      { nombre: 'Superintendent Assistant', servicios: [] }
    ]
  },
  {
    principal: 'Maritime Solutions',
    subtitulo: 'Ships Supply & Delivery at Port',
    subservicios: [
      { nombre: 'Provisions and bonds on board', servicios: [] },
      { nombre: 'Technical assistance and products.', servicios: [] },
      { nombre: 'Workshop coordination.', servicios: [] },
      { nombre: 'Diving service coordination.', servicios: [] },
      { nombre: 'Marine surveyor arrangement.', servicios: [] },
      { nombre: 'Sample shipping.', servicios: [] },
      { nombre: 'Inspections coordinations', servicios: [] },
      { nombre: 'Drydock Coordinations', servicios: [] }
    ]
  },
  {
    principal: 'Last Mile',
    subtitulo: 'Cargo Logistic Services',
    subservicios: [
      { nombre: 'Spare parts / stores on board delivery.', servicios: [] },
      { nombre: 'Cargo handling.', servicios: [] },
      { nombre: 'Courier delivery & mailing out', servicios: [] },
      { nombre: 'Fordwarding Coordination', servicios: [] },
      { nombre: 'Landing and Return Spare Parts.', servicios: [] }
    ]
  },
  {
    principal: 'Antarctic Services',
    subtitulo: 'Full Assistant to Antarctic Expeditions',
    subservicios: [
      { nombre: 'Technical and Specialized Supplies Coordination.', servicios: [] },
      { nombre: 'Logistic at Ushuaia and Punta Arenas.', servicios: [] },
      { nombre: 'Customs process Transit', servicios: [] },
      { nombre: 'Representations. Tax Recovery Process (Chile)', servicios: [] }
    ]
  },
  {
    principal: 'Full Agent',
    subtitulo: 'Owners or Charterers Nomination',
    subservicios: [
      { nombre: 'Full port agent.', servicios: [] },
      { nombre: 'Bunkering call.', servicios: [] },
      { nombre: 'Logistic call.', servicios: [] },
      { nombre: 'Panama channel transit.', servicios: [] },
      { nombre: 'Magellan strait pilotage.', servicios: [] },
      { nombre: 'Drydocking call.', servicios: [] },
      { nombre: 'Lay Up.', servicios: [] }
    ]
  }
];

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await EstructuraServicio.deleteMany(); // Limpia colección antes de insertar
    await EstructuraServicio.insertMany(estructuraInicial);
    console.log('✅ Estructura inicial insertada correctamente');
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

run();
