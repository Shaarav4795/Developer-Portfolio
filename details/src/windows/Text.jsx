import React, { useMemo } from 'react'
import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'

const formatDate = (value) => {
  if (!value) return "Today";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const fileTypeLabel = (fileType, kind) => {
  if (!fileType) return kind === "folder" ? "Folder" : "Item";
  const map = {
    txt: "Plain text document",
    img: "Image",
    url: "Link",
    fig: "Repository link",
    pdf: "PDF document",
  };
  return map[fileType] || fileType;
};

const buildMetadata = (data) => {
  const baseKind = data.kind || fileTypeLabel(data.fileType, data.kind);
  const wherePath = data.metadata?.where || data.locationPath || "Portfolio";
  const size = data.metadata?.size || data.size;
  const tags = data.metadata?.tags || data.tags || ["Portfolio"];

  return {
    kind: data.metadata?.kind || baseKind,
    size: size || "Not available",
    where: wherePath,
    created: formatDate(data.metadata?.created || data.created),
    modified: formatDate(data.metadata?.modified || data.modified),
    lastOpened: formatDate(data.metadata?.lastOpened || data.lastOpened),
    version: data.metadata?.version || data.version,
    dimensions: data.metadata?.dimensions || data.dimensions,
    notes: data.metadata?.notes || data.notes,
    tags,
    locked: !!data.metadata?.locked,
    stationery: !!data.metadata?.stationery,
    hideExtension: !!data.metadata?.hideExtension,
    icon: data.metadata?.icon || data.icon || data.previewIcon,
    previewType: data.previewType,
    previewText: data.previewText,
    previewList: data.previewList,
    previewIcon: data.previewIcon,
    previewImage: data.previewImage || data.image || data.imageUrl,
    preview: data.preview || data.image || data.imageUrl || data.icon,
  };
};

const Text = ({ onMinimize, onClose, windowKey = "txtfile" }) => {
  const { windows } = useWindowStore();
  const data = windows[windowKey]?.data;
  const isMaximized = !!windows[windowKey]?.isMaximized;
  const isInfoMode = Boolean(data?.mode === "info" || data?.metadata);
  const meta = useMemo(() => (data ? buildMetadata(data) : null), [data]);

  if (!data) return null;

  if (isInfoMode && meta) {
    const generalFields = [
      { label: "Kind", value: meta.kind },
      { label: "Size", value: meta.size },
      { label: "Where", value: meta.where },
      { label: "Created", value: meta.created },
      { label: "Modified", value: meta.modified },
      { label: "Last opened", value: meta.lastOpened },
    ].filter((row) => row.value);

    const extraFields = [
      { label: "Version", value: meta.version },
      { label: "Dimensions", value: meta.dimensions },
      { label: "Notes", value: meta.notes },
    ].filter((row) => row.value);

    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
        <div id="window-header" className="window-drag-handle info-header flex items-center gap-3">
          <WindowControls target={windowKey} onMinimize={onMinimize} onClose={onClose} />
          <div className="flex flex-col flex-1 text-center leading-tight">
            <span className="text-xs text-gray-500">Get Info</span>
            <h2 className="text-sm font-semibold text-gray-700">{data.name}</h2>
          </div>
          <div className="info-chip">Info</div>
        </div>

        <div className="info-body">
          <div className="info-main">
            <div className="info-hero">
              <div className="info-icon">
                {(() => {
                  const isFolder = meta.kind?.toLowerCase().includes("folder");
                  const heroIcon = isFolder
                    ? "/images/folder.png"
                    : meta.icon || meta.previewIcon || meta.previewImage || meta.preview;
                  return heroIcon ? (
                    <img src={heroIcon} alt={data.name} loading="lazy" />
                  ) : (
                    <span className="text-gray-400 text-lg">?</span>
                  );
                })()}
              </div>
              <div className="space-y-1">
                <p className="info-title">{data.name}</p>
                <p className="info-subtitle">{meta.kind}</p>
                <p className="info-path">{meta.where}</p>
                <div className="info-tags">
                  {meta.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="info-section">
              <div className="info-section-header">
                <p>General</p>
              </div>
              <dl className="info-grid">
                {generalFields.map((row) => (
                  <div key={row.label} className="info-row">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="info-switches">
                <label className="info-switch">
                  <span>Locked</span>
                  <span className={`switch ${meta.locked ? "on" : "off"}`}></span>
                </label>
                <label className="info-switch">
                  <span>Stationery pad</span>
                  <span className={`switch ${meta.stationery ? "on" : "off"}`}></span>
                </label>
                <label className="info-switch">
                  <span>Hide extension</span>
                  <span className={`switch ${meta.hideExtension ? "on" : "off"}`}></span>
                </label>
              </div>
            </div>

            {extraFields.length ? (
              <div className="info-section">
                <div className="info-section-header">
                  <p>More Info</p>
                </div>
                <dl className="info-grid">
                  {extraFields.map((row) => (
                    <div key={row.label} className="info-row">
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>

          <div className="info-aside">
            <div className="preview-card">
              <div className="card-header">
                <p>Preview</p>
                <span className="pill">Quick Look</span>
              </div>
              <div className="preview-frame">
                {meta.previewType === "text" && meta.previewText ? (
                  <pre className="preview-text">{meta.previewText}</pre>
                ) : meta.previewType === "folder-list" && meta.previewList?.length ? (
                  <ul className="preview-list">
                    {meta.previewList.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                ) : meta.previewType === "icon" && meta.previewIcon ? (
                  <div className="preview-icon">
                    <img src={meta.previewIcon} alt="Preview icon" loading="lazy" />
                  </div>
                ) : meta.previewImage || meta.preview ? (
                  <img src={meta.previewImage || meta.preview} alt={`${data.name} preview`} loading="lazy" />
                ) : (
                  <div className="preview-placeholder">No preview</div>
                )}
              </div>
            </div>

            <div className="action-card">
              <div className="card-header">
                <p>Sharing</p>
                <span className="pill">Read and Write</span>
              </div>
              <ul className="action-list">
                <li>iCloud: Sync enabled</li>
                <li>Desktop: Shown on home</li>
                <li>Backup: Time Machine</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { name, image, subtitle, description } = data;
  const isAboutMe = name === "AboutMe.txt";
  const isTechStack = name === "TechStack.txt";
  const subtitleClassName = isTechStack
    ? "text-2xl font-bold"
    : isAboutMe
      ? "text-xl font-semibold"
      : "text-lg font-semibold";

  return (
    <div className="flex flex-col h-full">
      <div id='window-header' className="window-drag-handle">
        <WindowControls target={windowKey} onMinimize={onMinimize} onClose={onClose} />
        <h2>
          {name}
        </h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-6 bg-white">
        {image ? (
          <div className="w-full">
            <img
              src={image}
              alt={name}
              loading='lazy'
              className={
                isMaximized
                  ? "w-full h-auto max-h-[45vh] object-contain rounded-xl mx-auto"
                  : "w-full h-auto object-contain rounded"
              }
            />
          </div>
        ) : null}

        {subtitle ? <h3 className={subtitleClassName}>{subtitle}</h3> : null}

        {Array.isArray(description) && description.length > 0 ? (
          <div className="space-y-3 leading-relaxed text-base text-gray-800">
            {description.map((para, idx) => {
              if (para === "") {
                return <div key={idx} className="h-2" />;
              }
              if (isTechStack && typeof para === "string" && para.trim().endsWith(":")) {
                return (
                  <p key={idx} className="font-semibold text-gray-900">
                    {para}
                  </p>
                );
              }
              return <p key={idx}>{para}</p>;
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}

const TextWindow = WindowWrapper(Text, 'txtfile')

export default TextWindow
