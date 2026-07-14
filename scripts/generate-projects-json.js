import fs from 'fs';
import path from 'path';

const praiseImg = '/images/praise.png';

const projectsData = {
  'indo-korean': {
    id: 'indo-korean',
    title: 'Indo Korean',
    category: 'Cultural',
    year: '2026',
    story: 'Exploring the rich cultural intersections between India and Korea, this documentary weaves together personal narratives, culinary traditions, and visual artistry into a seamless, cinematic journey.',
    deliverables: ['Documentary Film', 'Photography', 'Brand Strategy'],
    heroVideo: '/videos/indo korean.mp4',
    heroImage: '/images/indo korean/013.webp',
    gallery: Array.from({ length: 17 }, (_, i) => ({
      type: 'image',
      url: `/images/indo korean/${String(i + 1).padStart(3, '0')}.webp`,
      orientation: 'landscape'
    })),
    btsImage: praiseImg,
    credits: {
      director: 'Praise',
      cinematographer: 'Praise',
      client: 'Cultural Exchange Board'
    }
  },
  'real-estate': {
    id: 'real-estate',
    title: 'Real Estate',
    category: 'Commercial',
    year: '2026',
    story: 'A premium showcase of modern architectural marvels. We focused on capturing the scale, light, and luxury of these properties using sweeping drone shots and intimate interior details.',
    deliverables: ['Commercial Film', 'Aerial Photography', 'Social Media Reels'],
    heroVideo: '/videos/Real Estate Video 720P.mp4',
    heroImage: 'https://picsum.photos/seed/rehero/2000/1000',
    gallery: [
      { type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', orientation: 'landscape' },
      { type: 'image', url: 'https://picsum.photos/seed/re1/1000/1200', orientation: 'portrait' },
      { type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', orientation: 'portrait' },
      { type: 'image', url: 'https://picsum.photos/seed/re3/1200/800', orientation: 'landscape' },
      { type: 'image', url: 'https://picsum.photos/seed/re5/1200/800', orientation: 'landscape' }
    ],
    btsImage: praiseImg,
    credits: {
      director: 'Praise',
      cinematographer: 'Praise',
      client: 'Luxury Estates LLC'
    }
  },
  'young-indians': {
    id: 'young-indians',
    title: 'Young Indians',
    category: 'Documentary',
    year: '2026',
    story: 'A gritty, authentic look into the lives of the next generation. We followed subjects across the country to capture their drive, their challenges, and their unbroken spirit.',
    deliverables: ['Documentary Series', 'Portrait Photography', 'Campaign Strategy'],
    heroImage: 'https://picsum.photos/seed/yihero/2000/1000',
    heroVideo: '/videos/IYD.mp4',
    gallery: Array.from({ length: 62 }, (_, i) => ({
      type: 'image',
      url: `/images/young-indians/${String(i + 1).padStart(3, '0')}.webp`,
      orientation: 'landscape'
    })),
    btsImage: praiseImg,
    credits: {
      director: 'Praise',
      cinematographer: 'Praise',
      client: 'YI Foundation'
    }
  },
  'naveen-sharlien': {
    id: 'naveen-sharlien',
    title: 'Naveen Sharlien Wedding',
    category: 'Wedding',
    year: '2026',
    story: 'A beautiful celebration of love. We captured the intimate moments, the grand celebrations, and the raw emotions of Naveen and Sharlien’s special day, creating a cinematic wedding film that they will cherish forever.',
    deliverables: ['Wedding Film', 'Candid Photography', 'Teaser Reel'],
    heroImage: '/images/naveen sharlien/001.png',
    heroVideo: '/videos/NAVEEN SHARLIEN PHOTOSLIDESHOW.mp4',
    gallery: [
      { type: 'video', url: '/videos/SHARLIEN NAVEEN HALDI.mp4', orientation: 'portrait' },
      ...Array.from({ length: 86 }, (_, i) => ({
        type: 'image',
        url: `/images/naveen sharlien/Haldi_Ceremony/${String(i + 1).padStart(3, '0')}.jpg`,
        orientation: 'landscape'
      })),
      { type: 'video', url: '/videos/NAVEEN SHARLIEN PHOTOSLIDESHOW.mp4', orientation: 'portrait' },
      ...Array.from({ length: 76 }, (_, i) => ({
        type: 'image',
        url: `/images/naveen sharlien/Church/${String(i + 1).padStart(3, '0')}.jpg`,
        orientation: 'landscape'
      })),
      { type: 'video', url: '/videos/BIKE VINTAGE.mp4', orientation: 'landscape' }
    ],
    btsImage: praiseImg,
    credits: {
      director: 'Praise',
      cinematographer: 'Praise',
      client: 'Naveen & Sharlien'
    }
  },
  'srusti-pratik-haldi': {
    id: 'srusti-pratik-haldi',
    title: 'Srusti Pratik Haldi',
    category: 'Wedding',
    year: '2026',
    story: 'A vibrant explosion of color, tradition, and pure joy. We documented the beautiful Haldi ceremony of Srusti and Pratik, focusing on the intimate rituals and the beautiful chaos of family celebrations.',
    deliverables: ['Event Highlights', 'Candid Photography', 'Reels'],
    heroImage: '/images/srusti pratik/003.webp',
    heroVideo: '',
    gallery: [
      '001.webp', '002.webp', '003.webp', '004.webp', '005.webp', '006.webp', '007.webp', '008.webp', '009(1).webp', '009.webp', '010.webp', '011.webp', '013.webp', '014.webp', '015.webp', '016.webp', '017.webp', '018.webp', '019.webp', '020.webp', '021.webp', '022.webp', '023.webp', '024.webp', '025.webp', '026.webp', '027.webp', '028.webp', '029.webp', '030.webp', '031.webp', '032.webp', '033.webp', '034.webp', '035.webp', '036.webp', '037.webp', '038.webp', '039.webp', '040.webp', '041.webp', '042.webp', '043.webp', '044.webp', '045.webp', '046.webp', '047.webp', '048.webp', '049.webp', '050.webp', '051.webp', '052.webp', '053.webp', '054.webp', '055.webp', '056.webp', '057.webp', '058.webp', '059.webp', '060.webp', '061.webp', '062.webp', '063.webp', '064.webp', '065.webp', '066.webp'
    ].map(filename => ({
      type: 'image',
      url: `/images/srusti pratik/${filename}`,
      orientation: 'landscape'
    })),
    btsImage: praiseImg,
    credits: {
      director: 'Praise',
      cinematographer: 'Praise',
      client: 'Srusti & Pratik'
    }
  },
  'medtouirn': {
    id: 'medtouirn',
    title: 'Medtouirn',
    category: 'Medical',
    year: '2026',
    story: 'A compelling showcase of medical innovation and healthcare excellence.',
    deliverables: ['Documentary Film', 'Photography', 'Brand Strategy'],
    heroImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop',
    heroVideo: '/videos/medtouirn/004.mp4',
    gallery: [
      { type: 'video', url: '/videos/medtouirn/001.mp4', orientation: 'landscape' },
      { type: 'video', url: '/videos/medtouirn/002.mp4', orientation: 'landscape' },
      { type: 'video', url: '/videos/medtouirn/003.mp4', orientation: 'landscape' },
      { type: 'video', url: '/videos/medtouirn/004.mp4', orientation: 'landscape' }
    ],
    btsImage: praiseImg,
    credits: {
      director: 'Praise',
      cinematographer: 'Praise',
      client: 'Medtouirn'
    }
  }
};

const apiDir = path.join(process.cwd(), 'public', 'api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

fs.writeFileSync(
  path.join(apiDir, 'projects.json'),
  JSON.stringify({ projects: Object.values(projectsData) }, null, 2)
);

console.log('Successfully generated public/api/projects.json');
