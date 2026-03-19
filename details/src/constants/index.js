import { buildWorkLocation } from './projectHelpers';

const navLinks = [
  {
    id: 1,
    name: "About",
    type: "finder",
    action: "about",
  },
  {
    id: 2,
    name: "Projects",
    type: "finder",
    action: "work",
  },
  {
    id: 3,
    name: "Contact",
    type: "contact",
  },
];

const navIcons = [
  /* {
    id: 1,
    img: "/icons/wifi.svg",
  }, */
  {
    id: 4,
    img: "/icons/user.svg",
    type: "finder",
    action: "about",
  },
  /* {
    id: 5,
    img: "/icons/mode.svg",
  }, */

];

const dockApps = [
  {
    id: "finder",
    name: "Portfolio", // was "Finder"
    icon: "finder.png",
    canOpen: true,
  },
  {
    id: "photos",
    name: "Gallery", // was "Photos"
    icon: "photos.png",
    canOpen: true,
  },
  {
    id: "contact",
    name: "Contact", // or "Get in touch"
    icon: "contact.png",
    canOpen: true,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "terminal.png",
    canOpen: true,
  },
  {
    id: "trash", // unique id to avoid duplicate keys in Dock
    name: "Trash",
    icon: "trash.png",
    canOpen: true,
    action: "trash",
  },
];

const techStack = [
  {
    category: "Frontend",
    items: ["React.js", "JavaScript", "HTML5", "Vite"],
  },
  {
    category: "Styling",
    items: ["Tailwind CSS", "GSAP", "CSS3"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Python","REST APIs"],
  },
  {
    category: "Database",
    items: ["SQL"],
  },
  {
    category: "Dev Tools",
    items: ["Git", "GitHub","Axios", "Jest", "Figma"],
  }
];

const socials = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#333333",
    link: "https://github.com/Shaarav4795",
  },
  {
    id: 2,
    text: "Discord",
    icon: "/icons/discord.svg",
    bg: "#5865F2",
    link: "https://discordapp.com/users/1255093948368687225",
  },
  {
    id: 3,
    text: "Xbox",
    icon: "/icons/xbox.svg",
    bg: "#107C10",
    link: "https://www.xbox.com/en-AU/play/user/Shaarav4795",
  },
  {
    id: 4,
    text: "Email",
    icon: "/icons/email.svg",
    bg: "#EA4335",
    link: "mailto:hi@shaarav.xyz",
  },
];

const photosLinks = [
  {
    id: 1,
    icon: "/icons/gicon1.svg",
    title: "Library",
  },
];

const gallery = [
  {
    id: 1,
    img: "/images/wallpaper1.jpg",
  },
  {
    id: 2,
    img: "/images/wallpaper2.jpg",
  },
  {
    id: 3,
    img: "/images/wallpaper3.jpg",
  },
  {
    id: 4,
    img: "/images/wallpaper4.jpg",
  },
  {
    id: 5,
    img: "/images/wallpaper5.jpg",
  },
  {
    id: 6,
    img: "/images/wallpaper6.jpg",
  },
  {
    id: 7,
    img: "/images/wallpaper.png",
  },
  {
    id: 8,
    img: "/images/wallpaper7.jpg",
  },
  {
    id: 9,
    img: "/images/wallpaper8.jpg",
  },
  {
    id: 10,
    img: "/images/wallpaper9.jpg",
  },
];

export {
  navLinks,
  navIcons,
  dockApps,
  techStack,
  socials,
  photosLinks,
  gallery,
};

const WORK_LOCATION = buildWorkLocation();

const ABOUT_LOCATION = {
  id: 2,
  type: "about",
  name: "About me",
  icon: "/icons/info.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-10 left-5",
      imageUrl: "/images/shaarav.jpeg",
    },
    {
      id: 2,
      name: "AboutMe.txt",
      icon: "/images/txt.png",
      kind: "file",
      fileType: "txt",
      position: "top-18 left-50",
      subtitle: "Meet the Developer Behind the Code",
      image: "/images/shaarav.jpeg",
      description: [
        "I’m Shaarav, a young developer based in Australia, focused on building useful and practical solutions for problems faced by many. I work mainly with Python, but have developed skills in Swift, SwiftUI, HTML, CSS, Javascript, and React.",
        "I care about performance, ease-of-use, and visual polish, whether it's reducing load times, solving UX problems, or animating interactions. If something feels slow or clunky, I fix it. Simple.",
        "Outside coding, I also have a passion for video editing. It sharpens my eye for pacing, composition, and visual flow skills, which helps me build an eye for detail that is useful in many scenarios, including programming.",
      ],
    },
    {
      id: 3,
      name: "TechStack.txt",
      icon: "/images/txt.png",
      kind: "file",
      fileType: "txt",
      position: "top-10 left-95",
      subtitle: "Tech Stack",
      description: [
        "Frontend:",
        "HTML, CSS, React, and SwiftUI",
        "",
        "Tools & Build Systems:",
        "Git, GitHub, npm, Figma, Canva, VS Code",
        "UI & Workflow:",
        "Responsive Design, Animations, Micro-interactions, Performance Optimisation",
        "",
        "APIs & Data:",
        "REST APIs, JSON handling",
        "",
        "Other:",
        "Python, Machine Learning, Video Editing",
      ],
    },
  ],
};


const TRASH_LOCATION = {
  id: 4,
  type: "trash",
  name: "Trash",
  icon: "/icons/trash.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Trash1.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-10 left-10",
      imageUrl: "/images/trash-1.png",
    },
  ],
};

export const locations = {
  work: WORK_LOCATION,
  about: ABOUT_LOCATION,
  trash: TRASH_LOCATION,
};

const INITIAL_Z_INDEX = 1000;

const WINDOW_CONFIG = {
  finder: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null, savedPosition: null },
  contact: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null, savedPosition: null },
  photos: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null, savedPosition: null },
  terminal: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null, savedPosition: null },
  txtfile: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null, savedPosition: null },
  imgfile: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null, savedPosition: null },
  trash: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null, savedPosition: null },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };
