/**
 * Project Management Utilities
 * 
 * Converts clean project data into the nested structure used by the app.
 * This abstraction makes it easy to edit projects without worrying about
 * the internal data structure.
 */

import { PROJECTS } from './projects';

/**
 * FILE TYPE MAPPINGS
 * Maps file types to their icons and configurations
 */
const FILE_TYPE_CONFIG = {
  txt: {
    icon: '/images/txt.png',
    fileType: 'txt',
  },
  url: {
    icon: '/images/safari.png',
    fileType: 'url',
  },
  img: {
    icon: '/images/image.png',
    fileType: 'img',
  },
  github: {
    icon: '/images/githubfile.png',
    fileType: 'fig',
  },
};

const FILE_POSITIONS = {
  txt: 'top-5 right-10',
  url: 'top-20 left-20',
  img: 'top-52 left-80',
  github: 'top-60 right-70',
};

/**
 * Converts a single file object to internal format
 * @param {Object} file - File config from PROJECTS
 * @returns {Object} - File in internal format
 */
function convertFile(file, fileIndex = 0) {
  const config = FILE_TYPE_CONFIG[file.type] || {};
  const position = FILE_POSITIONS[file.type] || 'top-5 left-5';
  
  const converted = {
    id: fileIndex + 1,
    name: `${file.name}.${getFileExtension(file.type)}`,
    icon: config.icon,
    kind: 'file',
    fileType: config.fileType,
    position,
  };

  if (file.type === 'txt') {
    converted.description = file.description;
  } else if (file.type === 'url' || file.type === 'github') {
    converted.href = file.href;
  } else if (file.type === 'img') {
    converted.imageUrl = file.imageUrl;
  }

  return converted;
}

/**
 * Gets file extension for a given type
 */
function getFileExtension(type) {
  const extensions = {
    txt: 'txt',
    url: 'com',
    img: 'png',
    github: 'github',
  };
  return extensions[type] || 'file';
}

/**
 * Converts a project to internal format
 * @param {Object} project - Project from PROJECTS array
 * @param {number} id - Project id
 * @returns {Object} - Project in internal format
 */
function convertProject(project, id) {
  return {
    id,
    name: project.name,
    icon: project.icon,
    kind: 'folder',
    position: project.position,
    windowPosition: project.windowPosition,
    children: project.files.map(convertFile),
  };
}

/**
 * Builds the WORK_LOCATION from PROJECTS
 * This is the main function to use when updating projects
 * @returns {Object} - WORK_LOCATION structure
 */
export function buildWorkLocation() {
  return {
    id: 1,
    type: 'work',
    name: 'Projects',
    icon: '/icons/work.svg',
    kind: 'folder',
    children: PROJECTS.map((project, index) => convertProject(project, index + 5)), // IDs start at 5
  };
}

/**
 * Utility: Find a project by name
 * @param {string} name - Project name
 * @returns {Object|null} - Project or null
 */
export function findProject(name) {
  return PROJECTS.find(p => p.name === name) || null;
}

/**
 * Utility: Find a file in a project
 * @param {string} projectName - Project name
 * @param {string} fileName - File name (without extension)
 * @returns {Object|null} - File or null
 */
export function findFile(projectName, fileName) {
  const project = findProject(projectName);
  if (!project) return null;
  return project.files.find(f => f.name === fileName) || null;
}

/**
 * Utility: Count projects
 * @returns {number} - Number of projects
 */
export function getProjectCount() {
  return PROJECTS.length;
}

/**
 * Utility: Get list of all project names
 * @returns {Array<string>} - Array of project names
 */
export function getProjectNames() {
  return PROJECTS.map(p => p.name);
}

/**
 * Utility: Get a file type's icon
 * @param {string} type - File type (txt, url, img, github)
 * @returns {string} - Icon path
 */
export function getFileIcon(type) {
  return FILE_TYPE_CONFIG[type]?.icon || '/images/file.png';
}
