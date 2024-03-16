import { Component } from "vue";
import { ft2m } from "./utils/units.ts";
import Treport from "./components/explanations/Treport.vue";
import CaltonHill from "./components/explanations/CaltonHill.vue";
import LondonBarker from "./components/explanations/LondonBarker.vue";
import LondonToday from "./components/explanations/LondonToday.vue";
import Elba from "./components/explanations/Elba.vue";

export interface CycloramaData {
  panoramaUrls: string[];
  panoramaUrlHeights: number[];
  panoramaHeight: number;
  panoramaRadius: number;
  panoramaY: number;
  stageRadius: number;
  stageHeight: number;
  umbrellaRadius: number;
  ceilingHeight: number;
  groundColor: number
  groundYStart: number;
  groundYEnd: number;
  skyColor: number;
  skyYStart: number;
  skyYEnd: number;
  initialCameraYaw: number;
}

export interface Scene extends CycloramaData {
  source?: string;
  selectionScreenHtml: string;
  selectionScreenGroup: 'barker' | 'hornor';
  thumbnail: string;
  infoComponent: Component|null;
}

function buildCycloramaData(options: {
  panoramaRadius: number,
  stageRadius: number,
  stageHeight: number,
  umbrellaRadius: number,
  ceilingHeight: number,
  panoramaUrls: string[],
  imageWidths: number[],
  imageHeights: number[],
  horizonRatio: number,
  groundColor: number,
  groundStartOffset: number,
  groundEndOffset: number,
  skyColor: number,
  skyStartOffset: number,
  skyEndOffset: number,
  initialCameraYaw: number,
}): CycloramaData {
  const panoramaImagesWidth = options.imageWidths.reduce((a,b) => a + b);
  const panoramaImagesHeight = options.imageHeights.reduce((a,b) => a + b);
  const panoramaHeight = options.panoramaRadius * 2 * Math.PI / panoramaImagesWidth * panoramaImagesHeight;
  const panoramaY = -panoramaHeight * options.horizonRatio + options.stageHeight;
  return {
    panoramaUrls: options.panoramaUrls,
    panoramaUrlHeights: options.imageHeights,
    panoramaRadius: options.panoramaRadius,
    panoramaHeight,
    panoramaY,
    stageRadius: options.stageRadius,
    stageHeight: options.stageHeight,
    umbrellaRadius: options.umbrellaRadius,
    ceilingHeight: options.ceilingHeight,
    groundColor: options.groundColor,
    groundYStart: panoramaY + options.groundStartOffset,
    groundYEnd: panoramaY + options.groundEndOffset,
    skyColor: options.skyColor,
    skyYStart: panoramaY + panoramaHeight + options.skyStartOffset,
    skyYEnd: panoramaY + panoramaHeight + options.skyEndOffset,
    initialCameraYaw: options.initialCameraYaw ?? 0
  }
}

function buildBarkerGrandCircleParams(
  panoramaUrls: string[],
  imageWidths: number[],
  imageHeights: number[],
  horizonRatio: number,
  groundColor: number,
  groundStartOffset: number,
  groundEndOffset: number,
  skyColor: number,
  skyStartOffset: number,
  skyEndOffset: number,
  initialCameraYaw: number = 0
): CycloramaData {
  return buildCycloramaData({
    panoramaRadius: ft2m(84 / 2),
    stageRadius: ft2m(30 / 2),
    stageHeight: ft2m(9),
    umbrellaRadius: ft2m(55 / 2),
    ceilingHeight: ft2m(16),
    panoramaUrls,
    imageWidths,
    imageHeights,
    horizonRatio,
    groundColor,
    groundStartOffset,
    groundEndOffset,
    skyColor,
    skyStartOffset,
    skyEndOffset,
    initialCameraYaw,
  });
}

function buildHornorParams(
  panoramaUrls: string[],
  imageWidths: number[],
  imageHeights: number[],
  horizonRatio: number,
  groundColor: number,
  groundStartOffset: number,
  groundEndOffset: number,
  skyColor: number,
  skyStartOffset: number,
  skyEndOffset: number,
  initialCameraYaw: number = 0
): CycloramaData {
  const panoramaRadius = ft2m(130 / 2)
  return buildCycloramaData({
    panoramaRadius,
    stageRadius: panoramaRadius * 0.3,
    stageHeight: panoramaRadius * 0.26 * 2,
    umbrellaRadius: panoramaRadius * 0.35,
    ceilingHeight: panoramaRadius * 0.07 * 2,
    panoramaUrls,
    imageWidths,
    imageHeights,
    horizonRatio,
    groundColor,
    groundStartOffset,
    groundEndOffset,
    skyColor,
    skyStartOffset,
    skyEndOffset,
    initialCameraYaw,
  });
}

function buildUrls(urlPattern: string, count: number, leadingZeros: number = 2): string[] {
  const urls: string[] = [];
  for (let i = 0; i < count; i++) {
    urls.push(urlPattern.replace('%d', i.toString().padStart(leadingZeros, "0")));
  }
  return urls;
}

export function getScenes(): Record<string, Scene> {
  return {
    caltonHill: {
      source: 'https://archives.collections.ed.ac.uk/repositories/2/digital_objects/100',
      selectionScreenHtml: `View of Edinburgh from Calton Hill<br><span class="text-xs">Exhibited in 1788, Watercolour from 1792</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/barker.jpg',
      infoComponent: CaltonHill,
      ...buildBarkerGrandCircleParams(
        buildUrls('barker-%d.jpg', 5),
        [18237],
        [2248],
        0.5,
        0x212111,
        0,
        0,
        0xDCD7B7,
      - 1,
        0,
        Math.PI - 0.5,
      ),
    },
    albionMills: {
      source: 'https://collections.britishart.yale.edu/catalog/orbis:205530',
      selectionScreenHtml: `London from the Roof of Albion Mills<br><span class="text-xs">Exhibited 1791-1794, Aquatints from 1792-1793</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/blondon.jpg',
      infoComponent: LondonBarker,
      ...buildBarkerGrandCircleParams(
        buildUrls('yale-orbis-205530-stitch-%d.jpg', 18),
        [34684],
        [2280, 2279],
        0.5,
        0x1E1F22,
        0,
        0.2,
        0xC2C2BF,
        - 3,
        0,
        2,
      ),
    },
    constantinople: {
      source: 'https://www.loc.gov/item/2013646602/',
      selectionScreenHtml: `View of Constantinople from the Tower&nbsp;of&nbsp;Galata<br><span class="text-xs">Exhibited 1800, Aquatints from 1813</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: 'constantinople-color-small.jpg',
      infoComponent: null,
      ...buildBarkerGrandCircleParams(
        buildUrls('constantinople-color-small-%d.jpg', 7),
        [25172],
        [3136],
        0.575,
        0x000000,
        0,
        0.25,
        0xF8EFE8,
        -2,
        0,
        Math.PI - 0.5,
      ),
    },
    flushing: {
      source: 'https://www.britishmuseum.org/collection/object/P_1886-0111-23-9',
      selectionScreenHtml: `The view of Flushing during the Siege<br><span class="text-xs">1810</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1886,0111.23.9-panorama.jpg',
      infoComponent: null,
      ...buildBarkerGrandCircleParams(
        buildUrls('1886,0111.23.9-panorama.jpg', 1),
        [20671],
        [1800],
        0.3,
        0x1E1F22,
        0,
        0.2,
        0xF2D8B5,
        -0.5,
        0,
        Math.PI / 2,
      ),
    },
    elba: {
      source: 'https://www.britishmuseum.org/collection/object/P_1886-0111-23-2',
      selectionScreenHtml: `Island of Elba, and Porto-Ferrajo<br><span class="text-xs">1815, Featuring Napoleon Bonaparte</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1886,0111.23.2-panorama.jpg',
      infoComponent: Elba,
      ...buildBarkerGrandCircleParams(
        buildUrls('1886,0111.23.2-panorama.jpg', 1),
        [20797],
        [1134],
        0.2,
        0xF1D4AC,
        0,
        0.1,
        0xF1D4AC,
        -0.25,
        0.05,
        -0.75
      ),
    },
    treport: {
      source: 'https://www.britishmuseum.org/collection/object/P_1982-U-3982',
      selectionScreenHtml: `View of Treport, the surrounding Country, and Chateau d'Eu<br><span class="text-xs">1843</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1982,U.3982-panorama.jpg',
      infoComponent: Treport,
      ...buildBarkerGrandCircleParams(
        buildUrls('1982,U.3982-panorama.jpg', 1),
        [9334],
        [1249],
        0.4,
        0xF3D3AC,
        0,
        0.1,
        0xF3D3AC,
        -0.25,
        0.05,
        Math.PI-1,
      ),
    },
    hornor: {
      source: 'https://www.britishmuseum.org/collection/object/P_1880-1113-1207-1-2',
      selectionScreenHtml: `The Panoramic View from the top of St. Paul's Cathedral<br><span class="text-xs">1829, Prints by Godefroy Engelmann I</span>`,
      selectionScreenGroup: 'hornor',
      thumbnail: '/public/1880,1113.1207.1-2.jpg',
      infoComponent: null,
      ...buildHornorParams(
        buildUrls('1880,1113.1207.1-2.jpg', 1),
        [22990],
        [2343],
        0.85,
        0xFAEACC,
        0,
        0.1,
        0xFDFDDA,
        - 1.5,
        0,
        Math.PI - 0.25,
      )
    },
    josiahHenshallIllustrative: {
      source: 'https://www.britishmuseum.org/collection/object/P_1880-1113-1213',
      selectionScreenHtml: `A Panoramic View of London and the Surrounding Country<br><span class="text-xs">1836, Prints by Josiah Henshall</span>`,
      selectionScreenGroup: 'hornor',
      thumbnail: '/public/1880,1113.1213.jpg',
      infoComponent: null,
      ...buildHornorParams(
        buildUrls('1880,1113.1213.jpg', 1),
        [12569],
        [1109],
        0.8,
        0x2D291E,
        0,
        0.4,
        0xFDFDDA,
        - 1.5,
        0,
        Math.PI + 0.5,
      )
    },
    josiahHenshallDescriptive: {
      source: 'https://www.britishmuseum.org/collection/object/P_1880-1113-1214',
      selectionScreenHtml: `A Key to the Panoramic View of London and the Surrounding Country<br><span class="text-xs">1836, Prints by Josiah Henshall</span>`,
      selectionScreenGroup: 'hornor',
      thumbnail: '/public/1880,1113.1214.jpg',
      infoComponent: null,
      ...buildHornorParams(
        buildUrls('1880,1113.1214.jpg', 1),
        [12786],
        [1090],
        0.8,
        0xFFFEDF,
        0,
        0,
        0xFFFEDF,
        - 0.25,
        0,
        Math.PI + 0.5,
      )
    },
    hornorModern: {
      source: '',
      selectionScreenHtml: `Panoramic view of London taken from the Golden Gallery of St Paulʼs Cathedral<br><span class="text-xs">2007, Photo by David Iliff</span>`,
      selectionScreenGroup: 'hornor',
      thumbnail: '/public/london.jpg',
      infoComponent: LondonToday,
      ...buildHornorParams(
        buildUrls('london-%d.jpg', 5),
        [17458],
        [2904],
        0.725,
        0x111121,
        0,
        2,
        0xAACCED,
        - 1,
        0,
      )
    }
  }
}

export function getScene(key: string): Scene|null {
  return getScenes()[key] ?? null;
}
