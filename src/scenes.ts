import { Component } from "vue";
import Treport from "./components/explanations/Treport.vue";
import CaltonHill from "./components/explanations/CaltonHill.vue";
import LondonBarker from "./components/explanations/LondonBarker.vue";
import LondonToday from "./components/explanations/LondonToday.vue";

type SceneKey =
  | 'caltonHill'
  | 'albionMills'
  | 'treport'
  | 'hornor'
  | 'josiahHenshallIllustrative'
  | 'josiahHenshallDescriptive'
  | 'hornorModern';

export interface Scene {
  source?: string;
  selectionScreenHtml: string;
  selectionScreenGroup: 'barker' | 'hornor';
  thumbnail: string;
  infoComponent: Component;
}

export function getScenes(): Record<SceneKey, Scene> {
  return {
    caltonHill: {
      source: 'https://archives.collections.ed.ac.uk/repositories/2/digital_objects/100',
      selectionScreenHtml: `View of Edinburgh from Calton Hill<br><span class="text-xs">Exhibited in 1788, Watercolour from 1792</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/barker.jpg',
      infoComponent: CaltonHill
    },
    albionMills: {
      source: 'https://collections.britishart.yale.edu/catalog/orbis:205530',
      selectionScreenHtml: `London from the Roof of Albion Mills<br><span class="text-xs">Exhibited 1791-1794, Aquatints from 1792-1793</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/blondon.jpg',
      infoComponent: LondonBarker
    },
    treport: {
      source: 'https://www.britishmuseum.org/collection/object/P_1982-U-3982',
      selectionScreenHtml: `View of Treport, the surrounding Country, and Chateau d'Eu<br><span class="text-xs">18??</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1982,U.3982-panorama.jpg',
      infoComponent: Treport
    },
    hornor: {
      source: 'https://www.britishmuseum.org/collection/object/P_1880-1113-1207-1-2',
      selectionScreenHtml: `The Panoramic View from the top of St. Paul's Cathedral<br><span class="text-xs">1829, Prints by Godefroy Engelmann I</span>`,
      selectionScreenGroup: 'hornor',
      thumbnail: '/public/1880,1113.1207.1-2.jpg',
      infoComponent: LondonToday
    },
    josiahHenshallIllustrative: {
      source: 'https://www.britishmuseum.org/collection/object/P_1880-1113-1213',
      selectionScreenHtml: `A Panoramic View of London and the Surrounding Country<br><span class="text-xs">1836, Prints by Josiah Henshall</span>`,
      selectionScreenGroup: 'hornor',
      thumbnail: '/public/1880,1113.1213.jpg',
      infoComponent: LondonToday
    },
    josiahHenshallDescriptive: {
      source: 'https://www.britishmuseum.org/collection/object/P_1880-1113-1214',
      selectionScreenHtml: `A Key to the Panoramic View of London and the Surrounding Country<br><span class="text-xs">1836, Prints by Josiah Henshall</span>`,
      selectionScreenGroup: 'hornor',
      thumbnail: '/public/1880,1113.1214.jpg',
      infoComponent: LondonToday
    },
    hornorModern: {
      source: '',
      selectionScreenHtml: `Panoramic view of London taken from the Golden Gallery of St Paulʼs Cathedral<br><span class="text-xs">2007, Photo by David Iliff</span>`,
      selectionScreenGroup: 'hornor',
      thumbnail: '/public/london.jpg',
      infoComponent: LondonToday
    }
  }
}

export function getScene(key: string): Scene|null {
  return getScenes()[key as SceneKey] ?? null;
}
