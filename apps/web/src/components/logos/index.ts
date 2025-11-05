// Logos de restaurantes internacionales
export { McDonaldsLogo } from './McDonalds';
export { KFCLogo } from './KFC';
export { StarbucksLogo } from './Starbucks';
export { SubwayLogo } from './Subway';
export { PizzaHutLogo } from './PizzaHut';
export { DominosLogo } from './Dominos';

// Logos de restaurantes colombianos
export { ElCorralLogo } from './ElCorral';
export { FrisbyLogo } from './Frisby';
export { KokorikoLogo } from './Kokoriko';
export { PrestoLogo } from './Presto';
export { JuanValdezLogo } from './JuanValdez';
export { CrepesWafflesLogo } from './CrepesWaffles';

// Importaciones para el mapa
import { McDonaldsLogo } from './McDonalds';
import { KFCLogo } from './KFC';
import { StarbucksLogo } from './Starbucks';
import { SubwayLogo } from './Subway';
import { PizzaHutLogo } from './PizzaHut';
import { DominosLogo } from './Dominos';
import { ElCorralLogo } from './ElCorral';
import { FrisbyLogo } from './Frisby';
import { KokorikoLogo } from './Kokoriko';
import { PrestoLogo } from './Presto';
import { JuanValdezLogo } from './JuanValdez';
import { CrepesWafflesLogo } from './CrepesWaffles';

// Mapa de logos por nombre de restaurante
export const restaurantLogos = {
  "McDonald's": McDonaldsLogo,
  "KFC": KFCLogo,
  "Starbucks": StarbucksLogo,
  "Subway": SubwayLogo,
  "Pizza Hut": PizzaHutLogo,
  "Dominos": DominosLogo,
  "El Corral": ElCorralLogo,
  "Frisby": FrisbyLogo,
  "Kokoriko": KokorikoLogo,
  "Presto": PrestoLogo,
  "Juan Valdez Café": JuanValdezLogo,
  "Crepes & Waffles": CrepesWafflesLogo,
};

// Tipo para los props de los logos
export interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}