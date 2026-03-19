import { WindowControls } from "#components";
import ContextMenu from "#components/ContextMenu";
import { locations } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";
import useLocationStore from "#store/location";
import useWindowStore from "#store/window";
import useIconPositionStore from "#store/iconPositions";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, ChevronRight as PathSeparator } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

const Finder = ({ onMinimize, onClose }) => {

  const { openWindow, focusWindow } = useWindowStore();
  const { activeLocation, setActiveLocation, goBack, goForward, canGoBack, canGoForward } = useLocationStore();
  const { finderPositions, setFinderPosition, getFinderPosition } = useIconPositionStore();
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [quickLookItem, setQuickLookItem] = useState(null);
  const itemRefs = useRef({});
  const contentRef = useRef(null);

  const describeKind = (item) => {
    if (item.kind === 'folder') return 'Folder';
    if (item.fileType === 'img') return 'Image';
    if (item.fileType === 'txt') return 'Plain text document';
    if (item.fileType === 'pdf') return 'PDF document';
    if (item.fileType === 'url') return 'Link';
    if (item.fileType === 'fig') return 'Repository link';
    return item.kind || 'Item';
  };

  const estimateSize = (item) => {
    if (item.size) return item.size;
    if (item.kind === 'folder') return `${item.children?.length || 0} items`;
    if (item.fileType === 'img') return item.imageSize || '660 KB';
    if (item.fileType === 'txt') return '4 KB';
    return '1 item';
  };

  const buildWhere = (item) => {
    if (item.href) {
      try {
        const url = new URL(item.href);
        return `Web > ${url.hostname}`;
      } catch (err) {
        console.error('Invalid URL for info panel', err);
        return 'Web link';
      }
    }
    const base = activeLocation?.name || "Projects";
    return `Portfolio > ${base}`;
  };

  const buildInfoPayload = (item) => {
    const dateStamp = new Date().toISOString();
    const kind = describeKind(item);
    const basePayload = {
      mode: "info",
      name: item.name,
      icon: item.kind === 'folder' ? "/images/folder.png" : item.icon,
      kind,
      previewType: undefined,
      previewList: undefined,
      previewText: undefined,
      previewIcon: undefined,
      previewImage: undefined,
      metadata: {
        kind,
        size: estimateSize(item),
        where: buildWhere(item),
        created: item.created || dateStamp,
        modified: item.modified || dateStamp,
        lastOpened: dateStamp,
        tags: item.tags || ["Portfolio"],
        dimensions: item.dimensions,
        version: item.version,
        locked: false,
      },
    };

    if (item.kind === 'folder') {
      basePayload.previewType = "folder-list";
      basePayload.previewList = item.children?.map((child) => child.name) || [];
      basePayload.previewIcon = "/images/folder.png";
    } else if (item.fileType === 'txt') {
      basePayload.previewType = "text";
      const text = Array.isArray(item.description) ? item.description.join("\n\n") : item.description || "";
      basePayload.previewText = text || "(No text)";
      basePayload.previewIcon = "/icons/file.svg";
    } else if (item.fileType === 'img') {
      basePayload.previewType = "image";
      basePayload.previewImage = item.imageUrl || item.icon;
    } else if (item.fileType === 'url') {
      basePayload.previewType = "icon";
      basePayload.previewIcon = "/images/safari.png";
    } else if (item.fileType === 'fig') {
      basePayload.previewType = "icon";
      basePayload.previewIcon = "/images/githubfile.png";
    }

    return basePayload;
  };

  const openItem = (item) => {
    if(item.fileType === 'txt') return openWindow('txtfile', item);
    if(item.fileType === 'img') return openWindow('imgfile', item);
    if(item.kind === 'folder') return setActiveLocation(item);
    if(['fig', 'url'].includes(item.fileType) && item.href) return window.open(item.href, 'blank');

    openWindow(`${item.fileType} ${item.kind}`, item)
  };

  const openQuickLook = (item) => {
    setQuickLookItem(item || null);
  };

  const toggleQuickLook = (item) => {
    if (!item) return;
    setQuickLookItem((current) => (current?.id === item.id ? null : item));
  };

  const closeQuickLook = () => setQuickLookItem(null);

  useEffect(() => {
    const handler = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return;

      const selectedItem = activeLocation?.children?.find((child) => child.id === selectedItemId);
      if (!selectedItem) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleQuickLook(selectedItem);
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        openWindow("txtfile", buildInfoPayload(selectedItem));
      }

      if (e.key === 'Escape') {
        closeQuickLook();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeLocation?.id, selectedItemId, openWindow]);

  useEffect(() => {
    setQuickLookItem(null);
  }, [activeLocation?.id]);

  // Build breadcrumb path
  const buildBreadcrumb = () => {
    const path = [{ id: 'root', name: "Shaarav's Portfolio", location: null }];

    if (!activeLocation) return path;

    const isWorkRoot = activeLocation.id === locations.work.id || activeLocation.type === locations.work.type;
    const isWorkChild = locations.work.children?.some(p => p.id === activeLocation.id);

    if (isWorkRoot) {
      path.push({ id: 'projects', name: 'Projects', location: locations.work });
    } else if (isWorkChild) {
      path.push({ id: 'projects', name: 'Projects', location: locations.work });
      path.push({ id: activeLocation.id, name: activeLocation.name, location: activeLocation });
    } else {
      path.push({ id: activeLocation.id, name: activeLocation.name, location: activeLocation });
    }

    return path;
  };

  const breadcrumb = buildBreadcrumb();

  // Apply saved positions and create draggables
  useEffect(() => {
    if (!activeLocation?.children) return;

    // Apply saved positions
    activeLocation.children.forEach((item) => {
      const savedPos = getFinderPosition(activeLocation.id, item.id);
      const el = itemRefs.current[item.id];
      if (savedPos && el) {
        gsap.set(el, { x: savedPos.x, y: savedPos.y });
      } else if (el) {
        // Reset position if no saved position
        gsap.set(el, { x: 0, y: 0 });
      }
    });
  }, [activeLocation?.id]);

  useGSAP(() => {
    if (!activeLocation?.children || !contentRef.current) return;

    // Kill existing draggables
    activeLocation.children.forEach((item) => {
      const el = itemRefs.current[item.id];
      if (el) {
        Draggable.get(el)?.kill();
      }
    });

    // Create new draggables
    activeLocation.children.forEach((item) => {
      const el = itemRefs.current[item.id];
      if (!el) return;

      Draggable.create(el, {
        bounds: contentRef.current,
        allowContextMenu: true,
        onPress: function(e) {
          if (e.button !== 0) {
            this.endDrag();
            return;
          }
        },
        onDragEnd: function() {
          setFinderPosition(activeLocation.id, item.id, this.x, this.y);
        }
      });
    });
  }, [activeLocation?.id, activeLocation?.children?.length]);

  const handleItemContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItemId(item.id);
    
    const menuItems = [
      {
        label: "Open",
        onClick: () => {
          openItem(item);
          setContextMenu(null);
        },
      },
      {
        label: "Quick Look",
        onClick: () => {
          openQuickLook(item);
          setContextMenu(null);
        },
        shortcut: "Space",
      },
      { type: "separator" },
      {
        label: "Get Info",
        onClick: () => {
          openWindow("txtfile", buildInfoPayload(item));
          setContextMenu(null);
        },
        shortcut: "⌘I",
      },
    ];

    if (item.href) {
      menuItems.push({
        label: "Open in Browser",
        onClick: () => {
          window.open(item.href, '_blank');
          setContextMenu(null);
        },
      });
    }

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: menuItems,
    });
  };

  const renderList = (name, items) => (
    <div>
      <h3>{name}</h3>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className={clsx(
              item.id === activeLocation.id ? "active" : "not-active"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setActiveLocation(item);
              focusWindow('finder');
            }}
          >
            <img src={item.icon} className="w-4" alt={item.name} loading='lazy' />
            <p className="text-sm font-medium truncate">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header with navigation */}
      <div id="window-header" className="window-drag-handle flex items-center gap-2">
        <WindowControls target="finder" onMinimize={onMinimize} onClose={onClose} />
        
        {/* Back/Forward buttons */}
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={(e) => { e.stopPropagation(); goBack(); }}
            disabled={!canGoBack()}
            className={clsx(
              "p-1 rounded transition-colors",
              canGoBack() 
                ? "hover:bg-gray-200 text-gray-700" 
                : "text-gray-300 cursor-not-allowed"
            )}
            title="Go Back"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goForward(); }}
            disabled={!canGoForward()}
            className={clsx(
              "p-1 rounded transition-colors",
              canGoForward() 
                ? "hover:bg-gray-200 text-gray-700" 
                : "text-gray-300 cursor-not-allowed"
            )}
            title="Go Forward"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <h2 className="font-bold flex-1 text-center">
          {activeLocation?.name || "Shaarav's Portfolio"}
        </h2>
      </div>

      {/* Main content */}
      <div className="flex bg-white flex-1 min-h-0">
        <div className="sidebar">
          {renderList("Favorites", Object.values(locations))}
        </div>
        <div className="flex flex-col flex-1 relative">
          <ul 
            ref={contentRef}
            className="content flex-1 relative"
            onClick={() => {
              setContextMenu(null);
              setSelectedItemId(null);
              setQuickLookItem(null);
            }}
          >
            {activeLocation?.children?.map((item) => (
              <li
                key={item.id}
                ref={(el) => (itemRefs.current[item.id] = el)}
                className={clsx(
                  "absolute flex items-center flex-col gap-3 cursor-pointer",
                  item.position,
                  selectedItemId === item.id && "item-selected"
                )}
                onClick={(e) => {
                  if (e.button !== 0) return;
                  e.stopPropagation();
                  setSelectedItemId(item.id);
                }}
                onDoubleClick={(e) => {
                  if (e.button !== 0) return;
                  e.stopPropagation();
                  setQuickLookItem(null);
                  openItem(item);
                }}
                onContextMenu={(e) => handleItemContextMenu(e, item)}
              >
                <img src={item.icon} alt={item.name} loading='lazy' className="size-16 object-contain" />
                <p className="text-sm text-center font-medium w-28 whitespace-normal break-words leading-tight">{item.name}</p>
              </li>
            ))}
          </ul>

          {quickLookItem && (
            <div className="quicklook-overlay" onClick={closeQuickLook}>
              <div className="quicklook-panel" onClick={(e) => e.stopPropagation()}>
                <div className="quicklook-header">
                  <span className="quicklook-title">Quick Look</span>
                  <button className="quicklook-close" onClick={closeQuickLook} aria-label="Close Quick Look">
                    ×
                  </button>
                </div>
                <div className="quicklook-body">
                  <h3 className="quicklook-name">{quickLookItem.name}</h3>
                  {quickLookItem.fileType === 'img' && quickLookItem.imageUrl ? (
                    <img src={quickLookItem.imageUrl} alt={quickLookItem.name} loading="lazy" />
                  ) : quickLookItem.fileType === 'txt' ? (
                    <pre>
                      {Array.isArray(quickLookItem.description)
                        ? quickLookItem.description.join("\n\n")
                        : quickLookItem.description || "(No preview)"}
                    </pre>
                  ) : quickLookItem.kind === 'folder' ? (
                    <ul>
                      {(quickLookItem.children || []).map((child) => (
                        <li key={child.id}>{child.name}</li>
                      ))}
                    </ul>
                  ) : quickLookItem.href ? (
                    <a href={quickLookItem.href} target="_blank" rel="noopener noreferrer">
                      {quickLookItem.href}
                    </a>
                  ) : (
                    <p>No preview available.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Path bar */}
          <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <PathSeparator size={12} className="text-gray-400" />}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.location) {
                      setActiveLocation(item.location);
                    }
                  }}
                  className={clsx(
                    "hover:text-blue-600 hover:underline transition-colors",
                    index === breadcrumb.length - 1 ? "font-medium text-gray-800" : ""
                  )}
                >
                  {item.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;
