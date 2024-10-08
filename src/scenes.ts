import { ft2m } from "./utils/units.ts";

import { defineAsyncComponent } from 'vue'

const Coblentz = defineAsyncComponent(() => import('./components/explanations/Coblentz.vue'));
const Treport = defineAsyncComponent(() => import('./components/explanations/Treport.vue'));
const CaltonHill = defineAsyncComponent(() => import('./components/explanations/CaltonHill.vue'));
const LondonBarker = defineAsyncComponent(() => import('./components/explanations/LondonBarker.vue'));
const LondonToday = defineAsyncComponent(() => import('./components/explanations/LondonToday.vue'));
const Elba = defineAsyncComponent(() => import('./components/explanations/Elba.vue'));
const EdinburghStGiles = defineAsyncComponent(() => import('./components/explanations/EdinburghStGiles.vue'));
const Windsor = defineAsyncComponent(() => import('./components/explanations/Windsor.vue'));
const Constantinople = defineAsyncComponent(() => import('./components/explanations/Constantinople.vue'));
const Copenhagen = defineAsyncComponent(() => import('./components/explanations/Copenhagen.vue'));
const Edinburgh = defineAsyncComponent(() => import('./components/explanations/Edinburgh.vue'));
const Naples = defineAsyncComponent(() => import('./components/explanations/Naples.vue'));
const Trafalgar = defineAsyncComponent(() => import('./components/explanations/Trafalgar.vue'));
const Flushing = defineAsyncComponent(() => import('./components/explanations/Flushing.vue'));
const Malta = defineAsyncComponent(() => import('./components/explanations/Malta.vue'));
const Lisbon = defineAsyncComponent(() => import('./components/explanations/Lisbon.vue'));
const Badajoz = defineAsyncComponent(() => import('./components/explanations/Badajoz.vue'));
const Algiers = defineAsyncComponent(() => import('./components/explanations/Algiers.vue'));
const Lausanne = defineAsyncComponent(() => import('./components/explanations/Lausanne.vue'));
const CaltonHill1825 = defineAsyncComponent(() => import('./components/explanations/CaltonHill1825.vue'));
const Waterloo = defineAsyncComponent(() => import('./components/explanations/Waterloo.vue'));
const Paris = defineAsyncComponent(() => import('./components/explanations/Paris.vue'));
const ParisStrand = defineAsyncComponent(() => import('./components/explanations/ParisStrand.vue'));
const Montmartre = defineAsyncComponent(() => import('./components/explanations/Montmartre.vue'));
const Berlin = defineAsyncComponent(() => import('./components/explanations/Berlin.vue'));
const Vittoria = defineAsyncComponent(() => import('./components/explanations/Vittoria.vue'));
const Pandemonium = defineAsyncComponent(() => import('./components/explanations/Pandemonium.vue'));
const Hornor = defineAsyncComponent(() => import('./components/explanations/Hornor.vue'));
const JosiahHenshallIllustrative = defineAsyncComponent(() => import('./components/explanations/JosiahHenshallIllustrative.vue'));
const JosiahHenshallDescriptive = defineAsyncComponent(() => import('./components/explanations/JosiahHenshallDescriptive.vue'));

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
  infoComponent: ReturnType<typeof defineAsyncComponent> | null;
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

function buildBarkerArchersHallParams(
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
    // Dimensions inferred from pages 28 and 29 from "The First Panoramas:
    // Visions of British Imperialism" by Denise Blake Oleksijczuk.
    // "With a view of twenty-three feet in diameter, it seems likely that so
    // few people could be accommodated at once because they were confined to
    // a smaller platform inside the painting."
    panoramaRadius: ft2m(23 / 2),
    // "A raised platform big enough for seven people would have left
    // approximately ten feet between the spectators and the painting's
    // curved surface, which would have accorded with Barker's patent
    // specifications."
    // The railing is accounted for
    stageRadius: ft2m(23 / 2 - 10 + 0.17),
    stageHeight: 0.1, // Unknown, this is just a guess
    umbrellaRadius: ft2m(23 / 2), // Unknown, this is just a guess
    ceilingHeight: 2.5, // Unknown, this is just a guess
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

export function getScenes(highQuality: boolean = false): Record<string, Scene> {
  return {
    caltonHill: {
      source: 'https://archives.collections.ed.ac.uk/repositories/2/digital_objects/100',
      selectionScreenHtml: `View of Edinburgh from Calton Hill<br><span class="text-xs">Exhibited 1788-1789, Watercolour from 1792</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/ado-2016-0006-thumb.jpg',
      infoComponent: CaltonHill,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/ado-2016-0006-%d.jpg', 5),
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
    caltonHillArchersHall: {
      source: 'https://archives.collections.ed.ac.uk/repositories/2/digital_objects/100',
      selectionScreenHtml: `View of Edinburgh from Calton Hill<br><span class="text-xs">Exhibited 1788-1789, Watercolour from 1792</span>`,
      selectionScreenGroup: 'other',
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/ado-2016-0006-thumb.jpg',
      infoComponent: null,
      ...buildBarkerArchersHallParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/ado-2016-0006-%d.jpg', 5),
        [18237],
        [2248],
        0,
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/yale-orbis-205530-stitch-thumb.jpg',
      infoComponent: LondonBarker,
      ...buildBarkerGrandCircleParams(
        highQuality ?
          buildUrls('https://assets.leifgehrmann.com/external/cyclorama/yale-orbis-205530-stitch-%d.jpg', 18) :
          buildUrls('https://assets.leifgehrmann.com/external/cyclorama/yale-orbis-205530-stitch-small-%d.jpg', 4),
        highQuality ? [34684] : [15216],
        highQuality ? [2280, 2279] : [2000],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/bodleian-windsor-panorama-thumb.jpg',
      infoComponent: Windsor,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/bodleian-windsor-panorama-%d.jpg', 5),
        [3825*5],
        [2048],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/constantinople-color-thumb.jpg',
      infoComponent: Constantinople,
      ...buildBarkerGrandCircleParams(
        highQuality ?
          buildUrls('https://assets.leifgehrmann.com/external/cyclorama/constantinople-color-%d.jpg', 26) :
          buildUrls('https://assets.leifgehrmann.com/external/cyclorama/constantinople-color-small-%d.jpg', 7),
        highQuality ? [50345] : [25172],
        highQuality ? [3136, 3136] : [3136],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/DH020270_5446x6525-panorama-thumb.jpg',
      infoComponent: Copenhagen,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/DH020270_5446x6525-panorama-%d.jpg', 7),
        [3547 * 7],
        [2048],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/SLNSW_FL16254799-panorama-thumb.jpg',
      infoComponent: Paris,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/SLNSW_FL16254799-panorama-%d.jpg', 3),
        [3571 * 3],
        [1000],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/yale-orbis-12828979-panorama-thumb.jpg',
      infoComponent: Edinburgh,
      ...buildBarkerUpperCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/yale-orbis-12828979-panorama-%d.jpg', 4),
        [3384 * 4],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/40348i-panorama-thumb.jpg',
      infoComponent: Trafalgar,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/40348i-panorama-%d.jpg', 5),
        [3597 * 5],
        [2048],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.12-panorama-thumb.jpg',
      infoComponent: Naples,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.12-panorama-%d.jpg', 4),
        [3978 * 4],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.9-panorama-thumb.jpg',
      infoComponent: Flushing,
      ...buildBarkerUpperCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.9-panorama-%d.jpg', 6),
        [3446 * 6],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.11-panorama-thumb.jpg',
      infoComponent: Malta,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.11-panorama-%d.jpg', 4),
        [3294 * 4],
        [1000],
        0.5,
        0xCEBD9B,
        0,
        0.1,
        0xDBCBA9,
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.10-panorama-thumb.jpg',
      infoComponent: Lisbon,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.10-panorama-%d.jpg', 5),
        [3896 * 5],
        [1000],
        0.25,
        0xEED4B1,
        0,
        0.1,
        0xEED4B2,
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.5-panorama-thumb.jpg',
      infoComponent: Badajoz,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.5-panorama-%d.jpg', 4),
        [3144 * 4],
        [1000],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.1-panorama-thumb.jpg',
      infoComponent: Vittoria,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.1-panorama-%d.jpg', 3),
        [3698 * 3],
        [1000],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.6-panorama-thumb.jpg',
      infoComponent: Berlin,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.6-panorama-%d.jpg', 3),
        [3670 * 3],
        [1000],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.13-panorama-thumb.jpg',
      infoComponent: Montmartre,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.13-panorama-%d.jpg', 3),
        [3626 * 3],
        [1000],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.2-panorama-thumb.jpg',
      infoComponent: Elba,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.2-panorama-%d.jpg', 5),
        [3669 * 5],
        [1000],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.4-panorama-thumb.jpg',
      infoComponent: ParisStrand,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.4-panorama-%d.jpg', 4),
        [3713 * 4],
        [1000],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.3-panorama-thumb.jpg',
      infoComponent: Waterloo,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1886,0111.23.3-panorama-%d.jpg', 4),
        [3768 * 4],
        [1000],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/SLNSW_FL16254393-panorama-thumb.jpg',
      infoComponent: Algiers,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/SLNSW_FL16254393-panorama-%d.jpg', 4),
        [3831 * 4],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/2010,7081.7379-panorama-thumb.jpg',
      infoComponent: Lausanne,
      ...buildBarkerUpperCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/2010,7081.7379-panorama-%d.jpg', 2),
        [3971 * 2],
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
    caltonHill1825: {
      source: 'https://collection.sl.nsw.gov.au/record/74VvxyKvekLX/mjAeJqbdNN7pB',
      selectionScreenHtml: `View of the City of Edinburgh<br><span class="text-xs">1825</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/SLNSW_FL16254467-panorama-thumb.jpg',
      infoComponent: CaltonHill1825,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/SLNSW_FL16254467-panorama-%d.jpg', 4),
        [3480 * 4],
        [1952],
        0.4,
        0xE9E0D6,
        0,
        0.1,
        0xE9E0D6,
        -0.5,
        -0.10,
        3 * Math.PI / 4,
      ),
    },
    pandemonium: {
      source: 'https://collection.sl.nsw.gov.au/record/74VvxyKvekLX/V53ApJayLQxVl',
      selectionScreenHtml: `An attempt to illustrate Milton's Pandemonium<br><span class="text-xs">1829, Featuring Satan</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/SLNSW_FL16254563-panorama-thumb.jpg',
      infoComponent: Pandemonium,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/SLNSW_FL16254563-panorama-%d.jpg', 4),
        [3566 * 4],
        [1760],
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
    coblentz: {
      source: 'https://archive.org/details/descriptionofvie00burf_14/mode/2up',
      selectionScreenHtml: `View of Coblentz, Ehrenbreitstein, and the Rhine<br><span class="text-xs">1843</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/coblentz-thumb.jpg',
      infoComponent: Coblentz,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/coblentz-%d.jpg', 3),
        [3383 * 3],
        [1267],
        0.31,
        0xE9D1AD,
        0,
        0.1,
        0xE9D1AD,
        -0.25,
        0.05,
        -1,
      ),
    },
    treport: {
      source: 'https://www.britishmuseum.org/collection/object/P_1982-U-3982',
      selectionScreenHtml: `View of Treport, the surrounding Country, and Chateau d'Eu<br><span class="text-xs">1843, Featuring Queen Victoria</span>`,
      selectionScreenGroup: 'barker',
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1982,U.3982-panorama-thumb.jpg',
      infoComponent: Treport,
      ...buildBarkerGrandCircleParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1982,U.3982-panorama-%d.jpg', 3),
        [3112 * 3],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1880,1113.1207.1-2-thumb.jpg',
      infoComponent: Hornor,
      ...buildHornorParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1880,1113.1207.1-2-%d.jpg', 7),
        [3999 * 7],
        [2343],
        0.85,
        0xFAEACC,
        0,
        0.1,
        0xF5E5C6,
        - 0.2,
        0,
        Math.PI - 0.25,
      )
    },
    josiahHenshallIllustrative: {
      source: 'https://www.britishmuseum.org/collection/object/P_1880-1113-1213',
      selectionScreenHtml: `A Panoramic View of London and the Surrounding Country<br><span class="text-xs">1836, Prints by Josiah Henshall</span>`,
      selectionScreenGroup: 'hornor',
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1880,1113.1213-thumb.jpg',
      infoComponent: JosiahHenshallIllustrative,
      ...buildHornorParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1880,1113.1213-%d.jpg', 4),
        [3143 * 4],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/1880,1113.1214-thumb.jpg',
      infoComponent: JosiahHenshallDescriptive,
      ...buildHornorParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/1880,1113.1214-%d.jpg', 4),
        [3197 * 4],
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
      thumbnail: 'https://assets.leifgehrmann.com/external/cyclorama/london-thumb.jpg',
      infoComponent: LondonToday,
      ...buildHornorParams(
        buildUrls('https://assets.leifgehrmann.com/external/cyclorama/london-%d.jpg', 5),
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

export function getScene(key: string, highQuality: boolean = false): Scene|null {
  return getScenes(highQuality)[key] ?? null;
}
