import { locations } from "#constants"
import useLocationStore from "#store/location";
import useWindowStore from "#store/window";
import useIconPositionStore from "#store/iconPositions";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useState, useRef, useEffect } from "react";
import ContextMenu from "./ContextMenu";

const projects = locations.work?.children ?? [];

const buildProjectInfo = (project) => {
  const dateStamp = new Date().toISOString();
  const previewImage = project.children?.find((child) => child.fileType === 'img')?.imageUrl;
  const childNames = project.children?.map((child) => child.name) || [];

  return {
    mode: "info",
    name: project.name,
    icon: "/images/folder.png",
    kind: "Folder",
    previewIcon: "/images/folder.png",
    previewType: "folder-list",
    previewList: childNames,
    metadata: {
      kind: "Folder",
      size: `${project.children?.length || 0} items`,
      where: `Portfolio > Projects > ${project.name}`,
      created: dateStamp,
      modified: dateStamp,
      lastOpened: dateStamp,
      tags: ["Portfolio", "Projects"],
      dimensions: project.children?.length ? `${project.children.length} items inside` : "Empty folder",
      locked: false,
    },
  };
};

const Home = () => {

  const { setActiveLocation } = useLocationStore();
  const { openWindow } = useWindowStore();
  const { desktopPositions, setDesktopPosition, getDesktopPosition } = useIconPositionStore();
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const folderRefs = useRef({});

  const handleOpenProjectFinder = (project) => {
    setActiveLocation(project);
    openWindow("finder");
  };

  // Apply saved positions on mount
  useEffect(() => {
    projects.forEach((project) => {
      const savedPos = getDesktopPosition(project.id);
      const el = folderRefs.current[project.id];
      if (savedPos && el) {
        gsap.set(el, { x: savedPos.x, y: savedPos.y });
      }
    });
  }, []);

  useGSAP(() => {
    const navbarHeight = 50;
    
    projects.forEach((project) => {
      const el = folderRefs.current[project.id];
      if (!el) return;

      Draggable.create(el, {
        bounds: {
          top: navbarHeight - el.getBoundingClientRect().top + el.offsetTop,
          left: -el.offsetLeft + 20,
          right: window.innerWidth - el.offsetLeft - el.offsetWidth - 20,
          bottom: window.innerHeight - el.offsetTop - el.offsetHeight - 100,
        },
        allowContextMenu: true,
        onPress: function(e) {
          if (e.button !== 0) {
            this.endDrag();
            return;
          }
        },
        onDragEnd: function() {
          setDesktopPosition(project.id, this.x, this.y);
        }
      });
    });
  }, []);

  const handleContextMenu = (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProjectId(project.id);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        {
          label: "Open",
          onClick: () => {
            handleOpenProjectFinder(project);
            setContextMenu(null);
          },
        },
        {
          label: "Quick Look",
          onClick: () => {
            handleOpenProjectFinder(project);
            setContextMenu(null);
          },
          shortcut: "Space",
        },
        { type: "separator" },
        {
          label: "Get Info",
          onClick: () => {
            openWindow("txtfile", buildProjectInfo(project));
            setContextMenu(null);
          },
          shortcut: "⌘I",
        },
      ],
    });
  };

  return (
    <section id="home">
      <ul
        onClick={() => {
          setContextMenu(null);
          setSelectedProjectId(null);
        }}
      >
        {projects.map((project) => (
          <li 
            key={project.id} 
            ref={(el) => (folderRefs.current[project.id] = el)}
            className={`group folder ${selectedProjectId === project.id ? "folder-selected" : ""}`}
            style={{ position: 'absolute', top: '10vh', left: `${(project.id - 1) * 120 + 20}px` }}
            onClick={(e) => {
              if (e.button !== 0) return;
              e.stopPropagation();
              setSelectedProjectId(project.id);
            }}
            onDoubleClick={(e) => {
              if (e.button !== 0) return;
              e.stopPropagation();
              handleOpenProjectFinder(project);
            }}
            onContextMenu={(e) => handleContextMenu(e, project)}
          >
            <img 
              src="/images/folder.png"
              alt={project.name}
              loading='lazy'
            />
            <p>{project.name}</p>
          </li>
        ))}
      </ul>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </section>
  )
}

export default Home
