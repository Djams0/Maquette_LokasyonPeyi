import {vehicleMedia} from './vehicle-media.js';
import {localDate} from './search-state.js';

// Presentation fixture only: neither an API declaration nor evidence of physical condition.
const views = [
  ['arriere','Vue arrière de trois quarts de la citadine verte.',768,512],
  ['profil','Vue de profil de la citadine verte.',768,512],
  ['habitacle','Poste de conduite de la citadine verte.',768,512],
  ['banquette','Banquette arrière de la citadine verte.',768,512],
];
export function vehiclePresentation(vehicle) {
  const cover=vehicleMedia(vehicle);
  if(vehicle.id!=='v1')return {gallery:[cover],condition:null,illustration:null};
  return {
    gallery:[cover,...views.map(([view,alt,width,height])=>({photo:true,src:'/assets/vehicles/citadine-verte-'+view+'-768.webp',alt:alt+' Photo de démonstration.',width,height,fallback:cover.fallback}))],
    condition:{fixtureId:'v1',version:'déclaration visuelle fictive 1',date:'6 juin 2027 · date fictive',zone:'Pare-chocs arrière droit',title:'Rayure superficielle',description:'Exemple déclaratif : petite marque sur la peinture. Cet exemple ne certifie pas l’état physique ou la sécurité du véhicule.',src:'/assets/vehicles/citadine-verte-rayure-836.webp',width:836,height:471},
    illustration:{src:'/assets/vehicles/citadine-verte-illustration-836.webp',width:836,height:470,alt:'Représentation illustrative fixe d’une citadine verte. Ce rendu ne montre pas son état.'},
  };
}
// Same day rounding as the existing request quote; this is explicitly an estimate, not a quote.
export function vehicleEstimate(price,start,end) {
  const from=localDate(start),until=localDate(end);
  if(typeof price!=='number'||!Number.isFinite(price)||price<=0||!from||!until)return null;
  const days=Math.ceil((Date.parse(until+':00-04:00')-Date.parse(from+':00-04:00'))/86400000),total=price*days;
  return days>0&&Number.isFinite(total)?{days,daily:price,total}:null;
}
