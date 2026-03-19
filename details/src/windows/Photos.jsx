import { WindowControls } from '#components';
import ContextMenu from '#components/ContextMenu';
import { gallery, photosLinks } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import { Mail, Search } from 'lucide-react';
import React, { useState } from 'react';
const Photos = ({ onMinimize, onClose }) => {

  const { openWindow, focusWindow } = useWindowStore();
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);

  const email = 'hi@shaarav.xyz';

  const buildImageInfo = (image) => {
    const dateStamp = new Date().toISOString();
    return {
      mode: "info",
      name: `Gallery Image ${image.id}`,
      icon: "/images/image.png",
      kind: "Image",
      previewType: "image",
      previewImage: image.img,
      metadata: {
        kind: "Image",
        size: image.size || "1.1 MB",
        where: "Gallery",
        created: dateStamp,
        modified: dateStamp,
        lastOpened: dateStamp,
        tags: ["Gallery"],
        dimensions: image.dimensions,
        locked: false,
      },
    };
  };

  const handleImageContextMenu = (e, image) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImageId(image.id);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        {
          label: "Open",
          onClick: () => {
            openWindow('imgfile', {
              id: image.id,
              name: "Gallery Image",
              icon: "/images/image.png",
              kind: "file",
              fileType: "img",
              imageUrl: image.img,
            });
          },
        },
        { type: "separator" },
        {
          label: "Get Info",
          shortcut: "⌘I",
          onClick: () => {
            openWindow('txtfile', buildImageInfo(image));
          },
        },
      ],
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div id='window-header' className='window-drag-handle'>
        <WindowControls target="photos" onMinimize={onMinimize} onClose={onClose} />
        <h2 className='flex-1 text-center font-bold'>Gallery</h2>
        <div className='flex justify-end items-center gap-3'>
          <a
            href={`mailto:${email}`}
            title={`Email: ${email}`}
            className='p-2 hover:bg-gray-200 rounded-md transition-colors'
          >
            <Mail size={18} />
          </a>
          <Search className='icon' />
        </div>
      </div>
      <div className='flex w-full flex-1 min-h-0'>
        <div className='sidebar'>
          <h2>
            Photos
          </h2>
          <ul>
            {photosLinks.map(({id, icon, title}) => (
              <li 
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  focusWindow('photos');
                }}
              >
                <img src={icon} alt={title} />
                <p>{title}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className='gallery'>
          <ul
            onClick={() => {
              setContextMenu(null);
              setSelectedImageId(null);
            }}
          >
            {gallery.map(({id, img}) => (
              <li 
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageId(id);
                  openWindow('imgfile', {
                    id,
                    name: "Gallery Image",
                    icon: "/images/image.png",
                    kind: "file",
                    fileType: "img",
                    imageUrl: img,
                  });
                }}
                onContextMenu={(e) => handleImageContextMenu(e, { id, img })}
                className={selectedImageId === id ? "gallery-selected" : ""}
              >
                <img
                  src={img}
                  alt={`Gallery image ${id}`}
                  loading='lazy'
                />
              </li>
            ))}
          </ul>
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
  )
}

const PhotosWindow = WindowWrapper( Photos, "photos")

export default PhotosWindow;
