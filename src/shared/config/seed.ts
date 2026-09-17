import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ClientModel } from '../../modules/clients/client.model';
import { LogModel } from '../../modules/logs/logModel';


// Charger les variables d'environnement
dotenv.config();

const clients = [
  {
    name: 'Mariam dion',
    phone: '773612264',
    email: 'mariam.dion@example.com',
    address: 'Cite gadaye',
    isActive: true,
  },
  {
    name: 'Bassirou Diaw',
    phone: '786333750',
    email: 'thatsbass@example.com',
    address: 'Pikine',
    isActive: false,
  },
  {
    name: 'Cheikh Diop',
    phone: '779123456',
    email: 'cheikh.diop@example.com',
    address: 'Parcelle u26',
    isActive: false, 
  },
  {
    name: 'Fatou Mbengue',
    phone: '771302004',
    email: 'fatou.mbengue@example.com',
    address: 'Dakar',
    isActive: true,
  },
];

const seedDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("Erreur: La variable d'environnement MONGO_URI n'est pas définie. Veuillez la configurer dans votre fichier .env.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connecté à la base de données MongoDB.');

    console.log('Nettoyage des collections Client et Log...');
    await ClientModel.deleteMany({});
    await LogModel.deleteMany({});
    console.log('Anciennes données supprimées.');

    console.log('Insertion des données de test pour les clients...');
    await ClientModel.insertMany(clients);
    console.log('La base de données a été initialisée avec succès !');

  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données:", error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de la base de données MongoDB.');
  }
};
seedDatabase();
