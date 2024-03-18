import { Component } from "vue";
import { ft2m } from "./utils/units.ts";
import Treport from "./components/explanations/Treport.vue";
import CaltonHill from "./components/explanations/CaltonHill.vue";
import LondonBarker from "./components/explanations/LondonBarker.vue";
import LondonToday from "./components/explanations/LondonToday.vue";
import Elba from "./components/explanations/Elba.vue";
import EdinburghStGiles from "./components/explanations/EdinburghStGiles.vue";
import Windsor from "./components/explanations/Windsor.vue";
import Constantinople from "./components/explanations/Constantinople.vue";
import Copenhagen from "./components/explanations/Copenhagen.vue";
import Edinburgh from "./components/explanations/Edinburgh.vue";
import Naples from "./components/explanations/Naples.vue";
import Trafalgar from "./components/explanations/Trafalgar.vue";
import Flushing from "./components/explanations/Flushing.vue";
import Malta from "./components/explanations/Malta.vue";
import Lisbon from "./components/explanations/Lisbon.vue";
import Badajoz from "./components/explanations/Badajoz.vue";
import Algiers from "./components/explanations/Algiers.vue";
import Lausanne from "./components/explanations/Lausanne.vue";
import Waterloo from "./components/explanations/Waterloo.vue";
import Paris from "./components/explanations/Paris.vue";
import ParisStrand from "./components/explanations/ParisStrand.vue";
import Montmartre from "./components/explanations/Montmartre.vue";
import Berlin from "./components/explanations/Berlin.vue";
import Vittoria from "./components/explanations/Vittoria.vue";
import Pandemonium from "./components/explanations/Pandemonium.vue";

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
  selectionScreenGroup: 'barker' | 'hornor' | 'other';
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
  panoramaHeightScale: number,
}): CycloramaData {
  const panoramaImagesWidth = options.imageWidths.reduce((a,b) => a + b);
  const panoramaImagesHeight = options.imageHeights.reduce((a,b) => a + b);
  const panoramaHeight = options.panoramaRadius * 2 * Math.PI / panoramaImagesWidth * panoramaImagesHeight * options.panoramaHeightScale;
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
  initialCameraYaw: number = 0,
  panoramaHeightScale: number = 1
): CycloramaData {
  return buildCycloramaData({
    panoramaRadius: ft2m(84 / 2),
    stageRadius: ft2m(30 / 2),
    stageHeight: ft2m(9),
    umbrellaRadius: ft2m(55 / 2), // Unknown, this is just a guess
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
    panoramaHeightScale
  });
}

function buildBarkerUpperCircleParams(
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
  initialCameraYaw: number = 0,
  panoramaHeightScale: number = 1
): CycloramaData {
  return buildCycloramaData({
    // Dimensions inferred from this illustration.
    // https://commons.wikimedia.org/wiki/File:Mitchell_LeicesterSquareRotunda_05-11-20.jpg
    panoramaRadius: ft2m(50 / 2),
    stageRadius: ft2m(16 / 2),
    stageHeight: ft2m(16 * 130/330),
    umbrellaRadius: ft2m(16 * 1.5), // Unknown, this is just a guess
    ceilingHeight: ft2m(16 * 230/330),
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
    panoramaHeightScale
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
    panoramaHeightScale: 1
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
      selectionScreenHtml: `View of Edinburgh from Calton Hill<br><span class="text-xs">Exhibited 1788-1789, Watercolour from 1792</span>`,
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
    windsor: {
      source: 'https://digital.bodleian.ox.ac.uk/objects/22e9e513-e1c9-4c54-b39a-2c188f86fb0a/',
      selectionScreenHtml: `View of Windsor<br><span class="text-xs">1798</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/bodleian-windsor-panorama.jpg',
      infoComponent: Windsor,
      ...buildBarkerGrandCircleParams(
        buildUrls('bodleian-windsor-panorama.jpg', 1),
        [33891],
        [3630],
        0.75,
        0xECE5D2,
        0,
        0.1,
        0xFCF5E2,
        -1,
        0,
        Math.PI,
      ),
    },
    constantinople: {
      source: 'https://www.loc.gov/item/2013646602/',
      selectionScreenHtml: `View of Constantinople from the Tower&nbsp;of&nbsp;Galata<br><span class="text-xs">Exhibited 1800, Aquatints from 1813</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: 'constantinople-color-small.jpg',
      infoComponent: Constantinople,
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
    copenhagen: {
      source: 'http://www5.kb.dk/images/billed/2010/okt/billeder/object383074/en',
      selectionScreenHtml: `Lord Nelson's Attack of Copenhagen (in&nbsp;1801)<br><span class="text-xs">1802</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: 'DH020270_5446x6525-panorama.jpg',
      infoComponent: Copenhagen,
      ...buildBarkerGrandCircleParams(
        buildUrls('DH020270_5446x6525-panorama.jpg', 1),
        [33212],
        [2740],
        0.3,
        0xBFAF8F,
        0,
        0.25,
        0xBFAF8F,
        -0.5,
        0,
        Math.PI - 1,
        1.33
      ),
    },
    paris: {
      source: 'https://collection.sl.nsw.gov.au/record/74VvxyKvekLX/ewB2eAJArgko',
      selectionScreenHtml: `View of Paris taken between the Pont Neuf and the Louvre<br><span class="text-xs">1803</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: 'SLNSW_FL16254799-panorama.jpg',
      infoComponent: Paris,
      ...buildBarkerGrandCircleParams(
        buildUrls('SLNSW_FL16254799-panorama.jpg', 1),
        [33212],
        [2740],
        0.6,
        0xC9C3AD,
        0,
        0.25,
        0xC9C3AD,
        -0.5,
        0,
        Math.PI - 1,
        1.33
      ),
    },
    edinburgh: {
      source: 'https://collections.britishart.yale.edu/catalog/orbis:12828979',
      selectionScreenHtml: `Edinburgh and the surrounding country<br><span class="text-xs">1805</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/yale-orbis-12828979-panorama.jpg',
      infoComponent: Edinburgh,
      ...buildBarkerUpperCircleParams(
        buildUrls('yale-orbis-12828979-panorama.jpg', 1),
        [13535],
        [1000],
        0.35,
        0xE8DBBE,
        0,
        0.2,
        0xE8DBBE,
        - 0.5,
        0,
        0,
        1.33
      ),
    },
    trafalgar: {
      source: 'https://wellcomecollection.org/works/vqj7wh9j',
      selectionScreenHtml: `Battle of Trafalgar<br><span class="text-xs">1805</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/40348i-panorama.jpg',
      infoComponent: Trafalgar,
      ...buildBarkerGrandCircleParams(
        buildUrls('40348i-panorama.jpg', 1),
        [26112],
        [2974],
        0.125,
        0x939E95,
        0,
        0.2,
        0xCABAAB,
        -0.5,
        0,
        Math.PI / 2,
        1.33
      ),
    },
    naples: {
      source: 'https://www.britishmuseum.org/collection/object/P_1886-0111-23-12',
      selectionScreenHtml: `View of the Bay of Naples<br><span class="text-xs">1805</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1886,0111.23.12-panorama.jpg',
      infoComponent: Naples,
      ...buildBarkerGrandCircleParams(
        buildUrls('1886,0111.23.12-panorama.jpg', 1),
        [15909],
        [1206],
        0.25,
        0xE9C9A1,
        0,
        0.1,
        0xF2D8B5,
        -0.25,
        0,
        Math.PI / 2,
        1.33
      ),
    },
    flushing: {
      source: 'https://www.britishmuseum.org/collection/object/P_1886-0111-23-9',
      selectionScreenHtml: `The view of Flushing during the Siege (in&nbsp;1809)<br><span class="text-xs">1810</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1886,0111.23.9-panorama.jpg',
      infoComponent: Flushing,
      ...buildBarkerUpperCircleParams(
        buildUrls('1886,0111.23.9-panorama.jpg', 1),
        [20671],
        [1800],
        0.25,
        0x1E1F22,
        0,
        0.2,
        0xF2D8B5,
        -0.5,
        0,
        Math.PI / 2,
        1.33
      ),
    },
    malta: {
      source: 'https://www.britishmuseum.org/collection/object/P_1886-0111-23-11',
      selectionScreenHtml: `Grand view of La Valetta, Malta<br><span class="text-xs">1810</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1886,0111.23.11-panorama.jpg',
      infoComponent: Malta,
      ...buildBarkerGrandCircleParams(
        buildUrls('1886,0111.23.11-panorama.jpg', 1),
        [22946],
        [1742],
        0.5,
        0xE9C9A1,
        0,
        0.1,
        0xF6DFB6,
        -0.25,
        0,
        Math.PI / 2,
        1.33
      ),
    },
    lisbon: {
      source: 'https://www.britishmuseum.org/collection/object/P_1886-0111-23-10',
      selectionScreenHtml: `View of Lisbon<br><span class="text-xs">1811</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1886,0111.23.10-panorama.jpg',
      infoComponent: Lisbon,
      ...buildBarkerGrandCircleParams(
        buildUrls('1886,0111.23.10-panorama.jpg', 1),
        [22556],
        [1158],
        0.25,
        0xE9C9A1,
        0,
        0.1,
        0xF2D8B5,
        -0.25,
        0,
        Math.PI / 2,
        1.33
      ),
    },
    badajoz: {
      source: 'https://www.britishmuseum.org/collection/object/P_1886-0111-23-5',
      selectionScreenHtml: `Siege of Badajoz in 1812<br><span class="text-xs">1812</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1886,0111.23.5-panorama.jpg',
      infoComponent: Badajoz,
      ...buildBarkerGrandCircleParams(
        buildUrls('1886,0111.23.5-panorama.jpg', 1),
        [22782],
        [1812],
        0.45,
        0x000000,
        0,
        0.1,
        0xF2D8B5,
        -0.25,
        0,
        Math.PI * 3/2,
        1.33
      ),
    },
    vittoria: {
      source: 'https://www.britishmuseum.org/collection/object/P_1886-0111-23-1',
      selectionScreenHtml: `Plains of Vittoria (in 1813)<br><span class="text-xs">1814, Featuring Duke of Wellington (Arthur&nbsp;Wellesley) and Joseph&nbsp;Bonaparte</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1886,0111.23.1-panorama.jpg',
      infoComponent: Vittoria,
      ...buildBarkerGrandCircleParams(
        buildUrls('1886,0111.23.1-panorama.jpg', 1),
        [26112],
        [2974],
        0.35,
        0xF1D4AC,
        0,
        0.1,
        0xF1D4AC,
        -0.25,
        0.05,
        Math.PI / 2,
        1.33
      ),
    },
    berlin: {
      source: 'https://www.britishmuseum.org/collection/object/P_1886-0111-23-6',
      selectionScreenHtml: `View of Berlin<br><span class="text-xs">1814</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1886,0111.23.6-panorama.jpg',
      infoComponent: Berlin,
      ...buildBarkerGrandCircleParams(
        buildUrls('1886,0111.23.6-panorama.jpg', 1),
        [21312],
        [1936],
        0.7,
        0xF1D4AC,
        0,
        0.1,
        0xF2D8B5,
        -0.25,
        0,
        Math.PI * 3/2,
        1.33
      ),
    },
    montmartre: {
      source: 'https://www.britishmuseum.org/collection/object/P_1886-0111-23-13',
      selectionScreenHtml: `View of Paris, taken from Montmartre<br><span class="text-xs">1814</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1886,0111.23.13-panorama.jpg',
      infoComponent: Montmartre,
      ...buildBarkerGrandCircleParams(
        buildUrls('1886,0111.23.13-panorama.jpg', 1),
        [24190],
        [2224],
        0.4,
        0x1E1F22,
        0,
        0.2,
        0xF2D8B5,
        -0.5,
        0,
        Math.PI * 3/2,
        1.33
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
        0.3,
        0xF1D4AC,
        0,
        0.1,
        0xF1D4AC,
        -0.25,
        0.05,
        -0.75,
        1.33
      ),
    },
    parisStrand: {
      source: 'https://www.britishmuseum.org/collection/object/P_1886-0111-23-4',
      selectionScreenHtml: `View of the city of Paris<br><span class="text-xs">1815</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1886,0111.23.4-panorama.jpg',
      infoComponent: ParisStrand,
      ...buildBarkerGrandCircleParams(
        buildUrls('1886,0111.23.4-panorama.jpg', 1),
        [22996],
        [1526],
        0.5,
        0xF1D4AC,
        0,
        0.1,
        0xF2D8B5,
        -0.25,
        0,
        Math.PI / 2,
        1.33
      ),
    },
    waterloo: {
      source: 'https://www.britishmuseum.org/collection/object/P_1886-0111-23-3',
      selectionScreenHtml: `Battle of Waterloo (in 1815)<br><span class="text-xs">1816, Featuring Marquess of Wellington (Arthur&nbsp;Wellesley) and Napoleon&nbsp;Bonaparte</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '/public/1886,0111.23.3-panorama.jpg',
      infoComponent: Waterloo,
      ...buildBarkerGrandCircleParams(
        buildUrls('1886,0111.23.3-panorama.jpg', 1),
        [22996],
        [1526],
        0.4,
        0xD1B594,
        0,
        0.2,
        0xF6DAB1,
        -1,
        0,
        Math.PI / 12,
        1.33
      ),
    },
    algiers: {
      source: 'https://collection.sl.nsw.gov.au/digital/oBvwa7raadWGQ',
      selectionScreenHtml: `Lord Exmouth's Attack upon Algiers (In&nbsp;1816)<br><span class="text-xs">1818</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: 'SLNSW_FL16254393-panorama.jpg',
      infoComponent: Algiers,
      ...buildBarkerGrandCircleParams(
        buildUrls('SLNSW_FL16254393-panorama.jpg', 1),
        [15323],
        [1886],
        0.3,
        0xE3DECD,
        0,
        0.1,
        0xE3DECD,
        -0.25,
        0.05,
        Math.PI,
      ),
    },
    lausanne: {
      source: 'https://www.britishmuseum.org/collection/object/P_2010-7081-7379',
      selectionScreenHtml: `View of Lausanne and Lake Geneva<br><span class="text-xs">1819</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: '2010,7081.7379-panorama.jpg',
      infoComponent: Lausanne,
      ...buildBarkerUpperCircleParams(
        buildUrls('2010,7081.7379-panorama.jpg', 1),
        [7941],
        [619],
        0.3,
        0xFFFBDA,
        0,
        0.1,
        0xFFFBDA,
        -0.25,
        0.05,
        1,
      ),
    },
    pandemonium: {
      source: 'https://collection.sl.nsw.gov.au/record/74VvxyKvekLX/V53ApJayLQxVl',
      selectionScreenHtml: `An attempt to illustrate Milton's Pandemonium<br><span class="text-xs">1829</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: 'SLNSW_FL16254563-panorama.jpg',
      infoComponent: Pandemonium,
      ...buildBarkerGrandCircleParams(
        buildUrls('SLNSW_FL16254563-panorama.jpg', 1),
        [33212],
        [2740],
        0.3,
        0xE8E3D0,
        0,
        0.25,
        0xE8E3D0,
        -0.1,
        0,
        Math.PI - 1,
      ),
    },
    treport: {
      source: 'https://www.britishmuseum.org/collection/object/P_1982-U-3982',
      selectionScreenHtml: `View of Treport, the surrounding Country, and Chateau d'Eu<br><span class="text-xs">1843, Featuring Queen Victoria</span>`,
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
      ),
    },
    edinburghCityArtCentre: {
      source: 'City Art Center',
      selectionScreenHtml: `???`,
      selectionScreenGroup: 'other',
      thumbnail: '/public/edinburgh-2.png',
      infoComponent: EdinburghStGiles,
      ...buildBarkerGrandCircleParams(
        buildUrls('edinburgh-2.png-%d.jpg', 4),
        [4049 * 4],
        [2136],
        0.45,
        0x000000,
        0,
        0,
        0x8A918F,
        -3,
        -0.25,
        Math.PI / 5
      ),
    }
  }
}

export function getScene(key: string): Scene|null {
  return getScenes()[key] ?? null;
}
