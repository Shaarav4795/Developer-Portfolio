/**
 * Projects Configuration
 * 
 * Easy-to-edit format for managing portfolio projects.
 * Each project includes metadata, description, and associated files/links.
 * 
 * HOW TO ADD A PROJECT:
 * 1. Add a new object to the PROJECTS array below
 * 2. Fill in name, description, and files
 * 3. The system automatically generates the rest
 * 
 * HOW TO DELETE A PROJECT:
 * Just remove the entire project object from the array.
 * 
 * HOW TO MODIFY FILES:
 * Edit the files array for that project.
 */

export const PROJECTS = [
  {
    name: "LearnHub",
    description: "AI-assisted iOS study app - scan problems, generate flashcards & quizzes, track progress.",
    fullDescription: [
      "LearnHub is an AI-assisted iOS study application that revolutionises how students learn and prepare for exams.",
      "Instead of manually creating flashcards and quizzes, LearnHub lets you scan problems with your phone camera and instantly generates interactive study materials powered by AI.",
      "Think of it like having a personal tutor that understands your learning style — capture images of problems, problems get converted, and the app automatically generates customized flashcards, quizzes, and tracks your progress over time.",
      "Built with Swift and SwiftUI, it delivers a native iOS experience with OCR capabilities, AI problem-solving, gamification features, and comprehensive progress tracking — all while being 100% free to use.",
    ],
    icon: "/images/folder.png",
    position: "top-10 left-0",
    windowPosition: "top-[10vh] left-15",
    files: [
      {
        name: "Overview",
        type: "txt",
        description: [
          "LearnHub is an AI-assisted iOS study application that revolutionises how students learn and prepare for exams.",
          "Instead of manually creating flashcards and quizzes, LearnHub lets you scan problems with your phone camera and instantly generates interactive study materials powered by AI.",
          "Think of it like having a personal tutor that understands your learning style — capture images of problems, problems get converted, and the app automatically generates customized flashcards, quizzes, and tracks your progress over time.",
          "Built with Swift and SwiftUI, it delivers a native iOS experience with OCR capabilities, AI problem-solving, gamification features, and comprehensive progress tracking — all while being 100% free to use.",
        ],
      },
      {
        name: "Website",
        type: "url",
        href: "https://learnhub.shaarav.xyz",
      },
      {
        name: "LearnHub Screenshot",
        type: "img",
        imageUrl: "/images/learnhub.png",
      },
      {
        name: "Repo",
        type: "github",
        href: "https://github.com/Shaarav4795/LearnHub",
      },
    ],
  },

  {
    name: "ClippedAI",
    description: "Open-source alternative to OpusClip - AI-powered YouTube Shorts generator. 100% free.",
    fullDescription: [
      "ClippedAI is an open-source alternative to OpusClip, designed to automatically generate YouTube Shorts from long-form videos using advanced AI.",
      "Instead of manually cutting and editing videos for social media, ClippedAI analyzes your content, identifies the most engaging moments, and processes them into ready-to-upload Shorts with minimal effort.",
      "Think of it as a smart video editor that understands what makes content shareable — it finds the hooks, applies effects, adds captions, and exports polished short-form videos in minutes rather than hours.",
      "Built with Python and machine learning models, it's 100% free, unlimited in usage, and fully open-source so you can customize it for your needs. Perfect for content creators, educators, and anyone looking to repurpose video content across platforms.",
    ],
    icon: "/images/folder.png",
    position: "top-10 left-50",
    windowPosition: "top-[25vh] left-30",
    files: [
      {
        name: "Overview",
        type: "txt",
        description: [
          "ClippedAI is an open-source alternative to OpusClip, designed to automatically generate YouTube Shorts from long-form videos using advanced AI.",
          "Instead of manually cutting and editing videos for social media, ClippedAI analyzes your content, identifies the most engaging moments, and processes them into ready-to-upload Shorts with minimal effort.",
          "Think of it as a smart video editor that understands what makes content shareable — it finds the hooks, applies effects, adds captions, and exports polished short-form videos in minutes rather than hours.",
          "Built with Python and machine learning models, it's 100% free, unlimited in usage, and fully open-source so you can customize it for your needs. Perfect for content creators, educators, and anyone looking to repurpose video content across platforms.",
        ],
      },
      {
        name: "Website",
        type: "url",
        href: "https://clippedai.shaarav.xyz/",
      },
      {
        name: "ClippedAI Screenshot",
        type: "img",
        imageUrl: "/images/clippedai.png",
      },
      {
        name: "Repo",
        type: "github",
        href: "https://github.com/Shaarav4795/ClippedAI",
      },
    ],
  },

  {
    name: "Pi Security Camera",
    description: "A robust security camera designed to run on a Raspberry Pi with Discord integration.",
    fullDescription: [
      "Pi Security Camera is a robust security solution designed specifically for Raspberry Pi, transforming a single-board computer into a powerful surveillance device.",
      "Instead of expensive commercial security systems, this project lets you build a DIY camera that continuously monitors your space, captures high-quality photos and videos, and instantly notifies you via Discord webhooks.",
      "Think of it as a smart security setup that runs on a $35 Raspberry Pi — it records footage locally, detects motion events, and pushes alerts with snapshots directly to your Discord server so you're always aware of what's happening.",
      "Built with Python, it includes modular code for easy customization, efficient resource usage optimized for Pi hardware, and flexible webhook integration for alerts. Perfect for home automation enthusiasts, developers, and anyone wanting budget-friendly surveillance.",
    ],
    icon: "/images/folder.png",
    position: "top-45 left-20",
    windowPosition: "top-[40vh] left-15",
    files: [
      {
        name: "Overview",
        type: "txt",
        description: [
          "Pi Security Camera is a robust security solution designed specifically for Raspberry Pi, transforming a single-board computer into a powerful surveillance device.",
          "Instead of expensive commercial security systems, this project lets you build a DIY camera that continuously monitors your space, captures high-quality photos and videos, and instantly notifies you via Discord webhooks.",
          "Think of it as a smart security setup that runs on a $35 Raspberry Pi — it records footage locally, detects motion events, and pushes alerts with snapshots directly to your Discord server so you're always aware of what's happening.",
          "Built with Python, it includes modular code for easy customization, efficient resource usage optimized for Pi hardware, and flexible webhook integration for alerts. Perfect for home automation enthusiasts, developers, and anyone wanting budget-friendly surveillance.",
        ],
      },
      {
        name: "Repo",
        type: "github",
        href: "https://github.com/Shaarav4795/Pi-Security-Camera",
      },
    ],
  },

  {
    name: "Baulko Bell Times",
    description: "Bell times website for Baulkham Hills High School with pomodoro timer, exam tracker, notes, and more.",
    fullDescription: [
      "Baulko Bell Times is a specialized web application designed for Baulkham Hills High School students to manage their school day efficiently.",
      "It provides real-time bell schedules, a built-in Pomodoro timer for focused study sessions, an exam marks tracker to monitor academic progress, quick links to school resources, a digital notepad for quick notes, and a daily motivational quote.",
      "Think of it as a personal school assistant — check when your next period starts, study with the timer, track your exam performance, access your favorite links, and stay motivated throughout the day.",
      "Built with React and Vite, it features a clean interface, customizable timetable uploads via iCal/ICS files, local data storage, and a smooth user experience across all devices. It's designed specifically for students to boost productivity and organization.",
    ],
    icon: "/images/folder.png",
    position: "top-45 right-80",
    windowPosition: "top-[55vh] left-30",
    files: [
      {
        name: "Overview",
        type: "txt",
        description: [
          "Baulko Bell Times is a specialized web application designed for Baulkham Hills High School students to manage their school day efficiently.",
          "It provides real-time bell schedules, a built-in Pomodoro timer for focused study sessions, an exam marks tracker to monitor academic progress, quick links to school resources, a digital notepad for quick notes, and a daily motivational quote.",
          "Think of it as a personal school assistant — check when your next period starts, study with the timer, track your exam performance, access your favorite links, and stay motivated throughout the day.",
          "Built with React and Vite, it features a clean interface, customizable timetable uploads via iCal/ICS files, local data storage, and a smooth user experience across all devices. It's designed specifically for students to boost productivity and organization.",
        ],
      },
      {
        name: "Website",
        type: "url",
        href: "https://baulkobelltimes.github.io/",
      },
      {
        name: "Baulko Bell Times Screenshot",
        type: "img",
        imageUrl: "/images/baulkobelltimes.png",
      },
      {
        name: "Repo",
        type: "github",
        href: "https://github.com/baulkobelltimes/baulkobelltimes.github.io",
      },
    ],
  },
];
