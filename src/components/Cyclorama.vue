<script setup lang="ts">
import * as THREE from 'three';
import {ref, onMounted, defineProps} from 'vue'
import Stage from "../sceneObjects/stage.ts";
import Sky from "../sceneObjects/sky.ts";
import Ground from "../sceneObjects/ground.ts";
import Person from "../sceneObjects/person.ts";
import Panorama from "../sceneObjects/panorama.ts";
import {ControlState} from "../utils/types.ts";

const props = defineProps<{
  camera: THREE.PerspectiveCamera,
  controlState: ControlState
}>()

const canvas = ref(null as null | HTMLDivElement)

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000)

const mode = 'blondon2' as 'treport' | 'trafalgar' | 'lausanne' | 'london' | 'horner' | 'barker' | 'edinburgh' | 'blondon' | 'alps' | 'constantinople' | 'constantinople-2' | 'waterloo' | 'montmartre' | 'cairo' | 'naples' | 'malta' | 'lisbon' | 'berlin' | 'badajoz' | 'paris' | 'elba' | 'vittoria' | 'new-york' | 'cornwallis' | 'blondon2';

const ft2m = (feet: number): number => {
  return 0.3048 * feet;
}

let panoramaUrls: string[];
let panoramaUrlHeights: number[];
let panoramaRadius: number;
let panoramaHeight: number;
let panoramaCeilingY: number;
let groundColor: THREE.Color = new THREE.Color(0x000000);
let groundYStart: number;
let groundYEnd: number;
let skyColor: THREE.Color;
let skyYStart: number;
let skyYEnd: number;
let panoramaY: number;
let stageRadius = ft2m(30/2);
let stageHeight = 0;
let umbrellaRadius = ft2m(50/2);
let ceilingHeight = 4;
let initialCameraYaw = 0;
// noinspection JSUnreachableSwitchBranches
switch (mode) {
  // https://www.rmg.co.uk/collections/objects/rmgc-object-128877 (duplicate of trafalgar)
  // https://collections.library.yale.edu/catalog?f%5Bcreator_ssim%5D%5B%5D=Burford,%20Robert,%201791-1861
  // https://www.loc.gov/pictures/search/?q=Panorama%2C%20Leicester%20Square
  // https://digital.bodleian.ox.ac.uk/objects/92d22d1e-8e83-4a81-b776-688d71c1cc1b/
  // https://digital.bodleian.ox.ac.uk/objects/fdbeed42-899d-491f-9246-4b95e04db5bb/
  // https://digital.bodleian.ox.ac.uk/objects/8ff0a731-6fad-4a6b-a327-2a4120ced41f/
  // https://digital.bodleian.ox.ac.uk/objects/22e9e513-e1c9-4c54-b39a-2c188f86fb0a/
  // https://digital.bodleian.ox.ac.uk/objects/f482232f-37e8-4fb6-9269-bb9ebb1e6570/
  // https://www.britishmuseum.org/collection/object/P_1982-U-3981
  case 'new-york': {
    // https://loc.gov/pictures/resource/pga.04569/
    break;
  }
  case 'cornwallis': {
    // https://digital.bodleian.ox.ac.uk/objects/28c26df5-1cb7-45c3-8beb-50306d4cf4a9/surfaces/28c26df5-1cb7-45c3-8beb-50306d4cf4a9/
    break;
  }
  case 'treport': {
    // Context: Royal visit to Louis-Philippe: arrival of Queen Victoria at Le Tréport, 2 September 1843
    // https://www.rct.uk/collection/919997/royal-visit-to-louis-philippe-arrival-of-queen-victoria-at-le-treport-2-september
    panoramaUrls = ['1982,U.3982-panorama.jpg'];
    skyColor = new THREE.Color(0xF3D3AC);
    groundColor = new THREE.Color(0xF3D3AC);
    const imageWidth = 9334;
    const imageHeight = 1249;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight + 0.05
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'trafalgar': {
    // https://wellcomecollection.org/works/vqj7wh9j
    panoramaUrls = ['40348i-panorama.jpg'];
    skyColor = new THREE.Color(0xCABAAB);
    groundColor = new THREE.Color(0x939E95);
    const imageWidth = 26112;
    const imageHeight = 2974;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.1;
    skyYStart = panoramaY + panoramaHeight - 4
    skyYEnd = panoramaY + panoramaHeight -3
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'lausanne': {
    panoramaUrls = ['2010,7081.7379-panorama.jpg'];
    skyColor = new THREE.Color(0xFFFBDA);
    groundColor = new THREE.Color(0xFFFBDA);
    const imageWidth = 7941;
    const imageHeight = 619;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.3;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight + 0.05
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'vittoria': {
    panoramaUrls = ['1886,0111.23.1-panorama.jpg'];
    skyColor = new THREE.Color(0xF1D4AC);
    groundColor = new THREE.Color(0xF1D4AC);
    const imageWidth = 27595;
    const imageHeight = 2488;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.3;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight + 0.05
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'elba': {
    panoramaUrls = ['1886,0111.23.2-panorama.jpg'];
    skyColor = new THREE.Color(0xF1D4AC);
    groundColor = new THREE.Color(0xF1D4AC);
    const imageWidth = 20797;
    const imageHeight = 1134;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.1;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight + 0.05
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'waterloo': {
    panoramaUrls = ['1886,0111.23.3-panorama.jpg'];
    skyColor = new THREE.Color(0xF6DAB1);
    groundColor = new THREE.Color(0xD1B594);
    const imageWidth = 22996;
    const imageHeight = 1526;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.2;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.2;
    break;
  }
  case 'paris': {
    panoramaUrls = ['1886,0111.23.4-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0xF1D4AC);
    const imageWidth = 22782;
    const imageHeight = 1812;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.35;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'badajoz': {
    panoramaUrls = ['1886,0111.23.5-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0x000000);
    const imageWidth = 22782;
    const imageHeight = 1812;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.35;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'berlin': {
    panoramaUrls = ['1886,0111.23.6-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0xF1D4AC);
    const imageWidth = 21312;
    const imageHeight = 1936;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.65;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'cairo': {
    panoramaUrls = ['1886,0111.23.9-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0x1E1F22);
    const imageWidth = 20671;
    const imageHeight = 1800;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.3;
    skyYStart = panoramaY + panoramaHeight - 0.5
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.2;
    break;
  }
  case 'lisbon': {
    panoramaUrls = ['1886,0111.23.10-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0xE9C9A1);
    const imageWidth = 22556;
    const imageHeight = 1158;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.01;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'malta': {
    panoramaUrls = ['1886,0111.23.11-panorama.jpg'];
    skyColor = new THREE.Color(0xF6DFB6);
    groundColor = new THREE.Color(0xE9C9A1);
    const imageWidth = 22946;
    const imageHeight = 1742;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.35;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'naples': {
    panoramaUrls = ['1886,0111.23.12-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0xE9C9A1);
    const imageWidth = 15909;
    const imageHeight = 1206;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.2;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'montmartre': {
    panoramaUrls = ['1886,0111.23.13-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0x1E1F22);
    const imageWidth = 24190;
    const imageHeight = 2224;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = panoramaY + panoramaHeight - 0.5
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.2;
    break;
  }
  case 'blondon2': {
    // https://collections.britishart.yale.edu/catalog/orbis:205530 <--- Incredible detail!
    panoramaUrls = [
      'yale-orbis-205530-stitch-00.jpg',
      'yale-orbis-205530-stitch-01.jpg',
      'yale-orbis-205530-stitch-02.jpg',
      'yale-orbis-205530-stitch-03.jpg',
      'yale-orbis-205530-stitch-04.jpg',
      'yale-orbis-205530-stitch-05.jpg',
      'yale-orbis-205530-stitch-06.jpg',
      'yale-orbis-205530-stitch-07.jpg',
      'yale-orbis-205530-stitch-08.jpg',
      'yale-orbis-205530-stitch-09.jpg',
      'yale-orbis-205530-stitch-10.jpg',
      'yale-orbis-205530-stitch-11.jpg',
      'yale-orbis-205530-stitch-12.jpg',
      'yale-orbis-205530-stitch-13.jpg',
      'yale-orbis-205530-stitch-14.jpg',
      'yale-orbis-205530-stitch-15.jpg',
      'yale-orbis-205530-stitch-16.jpg',
      'yale-orbis-205530-stitch-17.jpg',
    ];
    skyColor = new THREE.Color(0xC2C2BF);
    groundColor = new THREE.Color(0x1E1F22);
    const imageWidth = 34684;
    const imageHeight = 4559;
    panoramaUrlHeights = [2280, 2279];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.2;
    break;
  }
  case 'blondon': {
    panoramaUrls = ['blondon.jpg'];
    skyColor = new THREE.Color(0xC2C2BF);
    groundColor = new THREE.Color(0x1E1F22);
    const imageWidth = 6219;
    const imageHeight = 790;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.2;
    break;
  }
  case 'constantinople': {
    // Some historic facts about the aquatint: https://collections.vam.ac.uk/item/O516369/barker-panorama-of-constantinople-etching-and-aquatint-henry-aston-barker/
    // High-resolution of black and white: https://www.loc.gov/item/2013646602/
    // Low-resolution of color: http://george3.splrarebooks.com/collection/search/search&XID=90264f6ed84d2033753b92dc8b595dad16f52168&keywords=PANORAMA%20OF%20CONSTANTINOPLE/
    panoramaUrls = ['Constantinople.jpg'];
    skyColor = new THREE.Color(0xD8CFC8);
    groundColor = new THREE.Color(0x000000);
    const imageWidth = 1875;
    const imageHeight = 319;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 2;
    break;
  }
  case 'constantinople-2': {
    panoramaUrls = ['1982,U.350-panorama.jpg'];
    skyColor = new THREE.Color(0xFFFBC4);
    groundColor = new THREE.Color(0xFFFBC4);
    const imageWidth = 24165;
    const imageHeight = 2258;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.46;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.5;
    break;
  }
  case 'alps': {
    panoramaUrls = ['alps.jpg'];
    skyColor = new THREE.Color(0xD8CFC8);
    groundColor = new THREE.Color(0x000000);
    const imageWidth = 4096;
    const imageHeight = 1491;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(227 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 10;
    break;
  }
  case 'edinburgh': {
    // An Edinburgh panorama from 1806, which is NOT the same as the st giles panorama: https://collections.britishart.yale.edu/catalog/orbis:12828979
    // Paper origin: https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=8a237aad3850a686343bb997fa3c456059f914db
    // Claim that image is 2.5m and 0.3m, which matches the manuscript listing: https://web.archive.org/web/20110227204942/https://www.acmi.net.au/aic/PANORAMA.html/
    // Bridewell prison was built in 1791
    // David Allan supposedly created these two pieces, both dates unknown:
    // https://www.nationalgalleries.org/art-and-artists/29574
    // https://www.nationalgalleries.org/art-and-artists/29575
    // David Allan died in 6 August 1796.
    // Battle of Trafalgar took place: 21 October 1805
    // Robert Barker died: 8 April 1806
    // Nelson Monument construction started 1807, There certainly was no foundation at 1805 when this panorama was created: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=1160&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/39158
    // This recording from capital collections claims to be from 1820.
    // https://www.capitalcollections.org.uk/view-item?i=11046
    // Another entry from 1820, but there is no information on what the record actually contains
    // https://manuscripts.nls.uk/repositories/2/archival_objects/23346
    // The Tron kirk spire was burnt down in 1824, meaning this cannot be older than that.
    // Scott monument foundation stone was placed 1840, nearly completed 1844
    // George Heriot resevoir existed long past 1840s
    // Edinburgh castle royal palace spire < 1830?
    // absent: 1746: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=260&WINID=1707598629559&fullPage=1#4WuLCiXznKcAAAGNkD_v9w/1886
    // absent: 1753: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=348&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/10982
    // present: 1781: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=302&WINID=1707598629559&fullPage=1#4WuLCiXznKcAAAGNkD_v9w/522
    // present: 1800: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=203&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/40660
    // present: 1800: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=44&WINID=1707598629559&fullPage=1#4WuLCiXznKcAAAGNkD_v9w/529
    // present: 1803: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=24&WINID=1707598629559&fullPage=1#4WuLCiXznKcAAAGNkD_v9w/14917
    // present-ish?: 1804: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=1215&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/14891
    // present: 1816: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=478&WINID=1707598629559&fullPage=1#4WuLCiXznKcAAAGNkD_v9w/535
    // present: 1817: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=49&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/679
    // present: 1817: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=51&WINID=1707598629559&fullPage=1#4WuLCiXznKcAAAGNkD_v9w/772
    // present: 1817: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=1268&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/622
    // absent: 1817: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=47&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/677
    // absent: 1820: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=687&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/40376
    // absent: 1822: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=547&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/500
    // absent: 1822: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=340&WINID=1707598629559&fullPage=1#4WuLCiXznKcAAAGNkD_v9w/461
    // absent: 1822: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=998&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/21115
    // absent: 1824: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=1230&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/943
    // absent: 1825: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=83&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/1905
    // absent: 1827: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=292&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/14703
    // absent: 1829: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=361&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/2005
    // absent: 1830: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=17&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/6214
    // absent: 1851: https://www.capitalcollections.org.uk/view-item?key=SXsiUCI6eyJ2YWx1ZSI6IkVkaW5idXJnaCBjYXN0bGUiLCJvcGVyYXRvciI6MSwiZnV6enlQcmVmaXhMZW5ndGgiOjMsImZ1enp5TWluU2ltaWxhcml0eSI6MC43LCJtYXhTdWdnZXN0aW9ucyI6MywiYWx3YXlzU3VnZ2VzdCI6ZmFsc2UsImluZGV4IjoxfX0&pg=53&WINID=1707598629559#4WuLCiXznKcAAAGNkD_v9w/1387

    // http://www.edvec.ed.ac.uk/html/projects/panorama/lanorama.jpg
    // http://www.edvec.ed.ac.uk/html/projects/panorama/i2.html
    panoramaUrls = ['lanorama.jpg'];
    skyColor = new THREE.Color(0xD8CFC8);
    const imageWidth = 4000;
    const imageHeight = 544;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.45;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 1;
    break;
  }
  case 'horner': {
    panoramaUrls = [
      '1880,1113.1214.jpg',
    ];
    skyColor = new THREE.Color(0xFFFEDF);
    groundColor = new THREE.Color(0xFFFEDF);
    const imageWidth = 12786;
    const imageHeight = 1090;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(130 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.65;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd + 0.3;
    groundYStart = panoramaY;
    groundYEnd = panoramaY;
    break;
  }
  case 'london': {
    panoramaUrls = [
        'london-00.jpg',
        'london-01.jpg',
        'london-02.jpg',
        'london-03.jpg',
        'london-04.jpg',
    ];
    panoramaUrlHeights = [2904];
    skyColor = new THREE.Color(0xAACCED);
    groundColor = new THREE.Color(0x111121);
    panoramaRadius = ft2m(130 / 2);
    panoramaHeight = ft2m(130 / 2);
    panoramaY = -panoramaHeight * 0.7;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 2;
    break;
  }
  default: {
    // Biographic details about Barker: https://play.google.com/store/books/details?id=dI1CAAAAcAAJ&rdid=book-dI1CAAAAcAAJ&rdot=1
    panoramaUrls = [
        'barker-00.jpg',
        'barker-01.jpg',
        'barker-02.jpg',
        'barker-03.jpg',
        'barker-04.jpg',
    ];
    skyColor = new THREE.Color(0xDCD7B7);
    groundColor = new THREE.Color(0x212111);
    const imageWidth = 18237;
    const imageHeight = 2248;
    panoramaRadius = ft2m(84 / 2);
    panoramaUrlHeights = [imageHeight];
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.5;
    stageRadius = ft2m(27/2);
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 1;
    initialCameraYaw = Math.PI * 0.8;
    break;
  }
}

const railingHeight = 0.9;
const railingCount = Math.round(stageRadius * Math.PI * 8);
const railingRadius = 0.02;
const railingPostOffset = 0.1;
const railingOnStageRadius = stageRadius - railingPostOffset - railingRadius;

const averageHeight = 1.70; // Average height for UK in the 1800s.
const breathingRatePerMin = 15; // Usually between 12-18 breaths per minute.
const breathingBobHeight = 0.02;

const renderer = new THREE.WebGLRenderer({antialias: true});

let cameraFov = 50;
let cameraPosX = props.camera.position.x;
let cameraPosZ = props.camera.position.z;
let cameraSagittalVel = 0;
let cameraSagittalVelDecel = 0.7;
let cameraSagittalAcc = 0;
let cameraFrontalVel = 0;
let cameraFrontalVelDecel = 0.7;
let cameraFrontalAcc = 0;
let cameraYaw = initialCameraYaw;
let cameraYawVel = 0;
let cameraYawAcc = 0;
let cameraPitch = 0;
let cameraPitchVel = 0;
let cameraPitchAcc = 0;
let cameraRoll = 0;
let cameraRollVel = 0;
let cameraRollVelDecel = 0.8;
let cameraRollAcc = 0;
let cameraZoom = 1;
let cameraZoomMin = cameraZoom - 0.25;
let cameraZoomMax = cameraZoom + 1.75;
let cameraZoomVel = 0;
let cameraZoomVelDecel = 0.8;
let cameraZoomAcc = 0;
let cameraHeight = 0;
let cameraHeightAcc = 0;
let cameraHeightVel = 0;
let cameraHeightVelDecel = 0.8;
let cameraHeightMin = cameraHeight - 1.0;
let cameraHeightMax = cameraHeight + 1.0;

new Panorama(
    scene,
    panoramaUrls,
    panoramaUrlHeights,
    panoramaRadius,
    panoramaHeight,
    panoramaY
);

const stage = new Stage(
    stageRadius,
    stageHeight,
    umbrellaRadius,
    ceilingHeight,
    railingHeight,
    railingCount,
    railingRadius,
    railingOnStageRadius
);
stage.addToScene(scene)

const sky = new Sky(
    panoramaRadius,
    panoramaCeilingY,
    skyYStart,
    skyYEnd,
    skyColor,
);
sky.addToScene(scene)

const ground = new Ground(
    panoramaRadius,
    groundYStart,
    groundYEnd,
    groundColor,
);
ground.addToScene(scene)

const person1 = new Person(
    scene,
    'person-1.svg',
    1.76,
)
person1.setPosition(stageRadius - 0.7, stageHeight, 0)

const person2 = new Person(
    scene,
    'person-2.svg',
    1.85,
)
person2.setPosition(0, stageHeight, stageRadius - 1)

props.camera.position.y = stageHeight + 1;

function resizeRendererToDisplaySize(renderer: THREE.Renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width  = window.innerWidth  * pixelRatio | 0;
  const height = window.innerHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

let lastRenderTime = new Date();

function animate() {
  requestAnimationFrame( animate );

  // Update View
  cameraYawAcc = props.controlState.yawAcc;
  cameraYawVel *= props.controlState.yawVelDeceleration;
  cameraYawVel += cameraYawAcc;

  cameraPitchAcc = props.controlState.pitchAcc;
  cameraPitchVel *= props.controlState.pitchVelDeceleration;
  cameraPitchVel += cameraPitchAcc;

  cameraRollAcc = props.controlState.rollAcc;
  cameraRollVel *= cameraRollVelDecel;
  cameraRollVel += cameraRollAcc;

  cameraZoomAcc = props.controlState.zoomAcc;
  cameraZoomVel *= cameraZoomVelDecel;
  cameraZoomVel += cameraZoomAcc;

  cameraHeightAcc = props.controlState.heightAcc;
  cameraHeightVel *= cameraHeightVelDecel;
  cameraHeightVel += cameraHeightAcc;

  cameraRoll += cameraRollVel;
  cameraZoom += cameraZoomVel;
  cameraHeight += cameraHeightVel;

  if (props.controlState.yawVel !== null) {
    cameraYawVel = 0;
    cameraYaw += props.controlState.yawVel
  } else {
    cameraYaw += cameraYawVel;
  }

  if (props.controlState.pitchVel !== null) {
    cameraPitchVel = 0;
    cameraPitch += props.controlState.pitchVel
  } else {
    cameraPitch += cameraPitchVel;
  }

  if (!props.controlState.boundaryBreak) {
    cameraPitch = THREE.MathUtils.clamp(cameraPitch, -Math.PI / 2, Math.PI / 2);
    cameraRoll = THREE.MathUtils.clamp(cameraRoll, -Math.PI / 2, Math.PI / 2);
    cameraZoom = THREE.MathUtils.clamp(cameraZoom, cameraZoomMin, cameraZoomMax);
    cameraHeight = THREE.MathUtils.clamp(cameraHeight, cameraHeightMin, cameraHeightMax);
  }

  // Update movement
  cameraSagittalAcc = props.controlState.sagittalAcc;
  cameraSagittalVel *= cameraSagittalVelDecel;
  cameraSagittalVel += cameraSagittalAcc;

  cameraFrontalAcc = props.controlState.frontalAcc;
  cameraFrontalVel *= cameraFrontalVelDecel;
  cameraFrontalVel += cameraFrontalAcc;

  cameraPosX -= Math.sin(-cameraYaw) * cameraSagittalVel + Math.sin(-cameraYaw - Math.PI / 2) * cameraFrontalVel;
  cameraPosZ -= Math.cos(-cameraYaw) * cameraSagittalVel + Math.cos(-cameraYaw - Math.PI / 2) * cameraFrontalVel;

  // Prevent out of bounds by resetting position to railing radius
  if (!props.controlState.boundaryBreak) {
    const angleFromCenter = Math.atan2(cameraPosX, cameraPosZ)
    const maxDistAtRailingX = Math.abs(Math.sin(angleFromCenter) * railingOnStageRadius);
    const maxDistAtRailingZ = Math.abs(Math.cos(angleFromCenter) * railingOnStageRadius);
    cameraPosX = THREE.MathUtils.clamp(cameraPosX, -maxDistAtRailingX, maxDistAtRailingX)
    cameraPosZ = THREE.MathUtils.clamp(cameraPosZ, -maxDistAtRailingZ, maxDistAtRailingZ)
  }

  resizeRendererToDisplaySize(renderer);
  props.camera.setRotationFromEuler(new THREE.Euler(
      -cameraPitch,
      -cameraYaw,
      -cameraRoll,
      'YZX'
  ))
  props.camera.position.x = cameraPosX;
  props.camera.position.z = cameraPosZ;
  props.camera.position.y = stageHeight + averageHeight + cameraHeight + Math.sin(new Date().getTime() / (60 / breathingRatePerMin * 1000) * Math.PI) * breathingBobHeight / 2;
  props.camera.fov = cameraFov * (1 / cameraZoom);
  props.camera.updateProjectionMatrix();

  const person1Distance = Math.hypot(
    props.camera.position.x - person1.getPosition().x,
    props.camera.position.z - person1.getPosition().z,
  );
  const person1Theta = Math.atan2(
      props.camera.position.x - person1.getPosition().x,
      props.camera.position.z - person1.getPosition().z,
  );
  person1.setRotation(person1Theta);
  let newOpacity: number;
  if (person1Distance > stageRadius) {
    newOpacity = Math.min(1, person1.getOpacity() + (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
  } else {
    newOpacity = Math.max(0, person1.getOpacity() - (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
  }
  person1.setOpacity(newOpacity);

  const person2Distance = Math.hypot(
      props.camera.position.x - person2.getPosition().x,
      props.camera.position.z - person2.getPosition().z,
  );
  const person2Theta = Math.atan2(
      props.camera.position.x - person2.getPosition().x,
      props.camera.position.z - person2.getPosition().z,
  )
  person2.setRotation(person2Theta);
  if (person2Distance > stageRadius) {
    newOpacity = Math.min(1, person2.getOpacity() + (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
  } else {
    newOpacity = Math.max(0, person2.getOpacity() - (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
  }
  person2.setOpacity(newOpacity);

  renderer.render( scene, props.camera );
  lastRenderTime = new Date();
}
animate();

function updateSize() {
  if (canvas.value === null) {
    return;
  }
  const rect = canvas.value.parentElement?.getBoundingClientRect();
  const width = rect?.width ?? 1;
  const height = rect?.height ?? 1;
  // @ts-ignore
  props.camera.aspect = width / height;
  // @ts-ignore
  props.camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.render(scene, props.camera);
}

onMounted(() => {
  if (canvas.value === null) {
    return;
  }
  canvas.value.appendChild(renderer.domElement);
  updateSize();

  window.addEventListener('resize', () => {
    updateSize();
  });
  // When the element is hidden and displayed, we need to
  // make sure the canvas is correctly sized.
  const resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(updateSize);
  });
  if (canvas.value.parentElement !== null) {
    resizeObserver.observe(canvas.value.parentElement);
  }
})
</script>

<template>
  <div id="canvas" ref="canvas" class="absolute"></div>
</template>

<style scoped>
</style>
