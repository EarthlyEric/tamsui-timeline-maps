import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { useEffect, useMemo, useRef, useState } from 'react'
import { timeline, timelineStory } from './data/timeline'
import { colorMap, mapCenter, pointsOfInterest } from './data/points'

function App() {
  const [activeId, setActiveId] = useState(timeline[0].id)
  const [storyActiveId, setStoryActiveId] = useState(timelineStory[0].id)
  const [mode, setMode] = useState('normal')
  const [overlayLoading, setOverlayLoading] = useState(true)
  const normalTimelineRef = useRef(null)
  const normalItemRefs = useRef([])
  const storyTimelineRef = useRef(null)
  const storyItemRefs = useRef([])
  const active = useMemo(() => timeline.find((item) => item.id === activeId), [activeId])
  const storyActive = useMemo(
    () => timelineStory.find((item) => item.id === storyActiveId),
    [storyActiveId],
  )
  const overlayLabel =
    mode === 'story'
      ? storyActive
        ? `${storyActive.year} ${storyActive.title}`
        : 'Timeline Story'
      : active
        ? `${active.year} ${active.title}`
        : '歷史圖層'
  const overlayLayerId = mode === 'story' ? storyActive?.layerId : active?.layerId
  const overlayUrl = overlayLayerId
    ? `https://gis.sinica.edu.tw/tamsui/file-exists.php?img=${overlayLayerId}-png-{z}-{x}-{y}`
    : null
  const mapTarget = mode === 'story' ? storyActive?.center : mapCenter
  const hasOverlayLayer = Boolean(overlayLayerId)

  useEffect(() => {
    setOverlayLoading(Boolean(overlayUrl))
  }, [overlayUrl])

  useEffect(() => {
    const updateTimelineLine = (container, items) => {
      if (!container || items.length === 0) {
        return
      }

      const containerRect = container.getBoundingClientRect()
      const firstRect = items[0].getBoundingClientRect()
      const lastRect = items[items.length - 1].getBoundingClientRect()
      const topOffset = firstRect.top - containerRect.top + firstRect.height / 2
      const bottomOffset =
        containerRect.height - (lastRect.top - containerRect.top + lastRect.height / 2)

      container.style.setProperty('--timeline-line-top', `${topOffset}px`)
      container.style.setProperty('--timeline-line-bottom', `${bottomOffset}px`)
    }

    const updateAll = () => {
      updateTimelineLine(
        normalTimelineRef.current,
        normalItemRefs.current.filter(Boolean),
      )
      updateTimelineLine(
        storyTimelineRef.current,
        storyItemRefs.current.filter(Boolean),
      )
    }

    updateAll()
    window.addEventListener('resize', updateAll)

    return () => {
      window.removeEventListener('resize', updateAll)
    }
  }, [activeId, storyActiveId])

  function DisableZoom() {
    const map = useMap()

    useEffect(() => {
      map.scrollWheelZoom.disable()
      map.doubleClickZoom.disable()
      map.touchZoom.disable()
      map.boxZoom.disable()
      map.keyboard.disable()
      map.dragging.disable()
      map.zoomControl?.remove()
    }, [map])

    return null
  }

  function MapFocus({ center }) {
    const map = useMap()

    useEffect(() => {
      if (!center) {
        return
      }

      map.flyTo(center, 14, {
        duration: 1.2,
      })
    }, [center, map])

    return null
  }

  return (
    <div className="app-shell">
      <section className="map-panel map-panel-full animate-rise">
        <div className="map-shell">
          <span className="overlay-label">{overlayLabel}</span>
          {hasOverlayLayer && overlayLoading ? (
            <div className="overlay-loading">
              <span className="spinner" />
              <span>圖層載入中</span>
            </div>
          ) : null}
          <MapContainer
            center={mapTarget || mapCenter}
            zoom={14}
            minZoom={14}
            maxZoom={14}
            zoomControl={false}
            dragging={false}
            className="map-core"
          >
            <DisableZoom />
            <MapFocus center={mapTarget} />
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {overlayUrl ? (
              <TileLayer
                key={overlayLayerId}
                url={overlayUrl}
                opacity={0.72}
                attribution="中央研究院歷史地圖 WMTS"
                crossOrigin
                eventHandlers={{
                  loading: () => setOverlayLoading(true),
                  load: () => setOverlayLoading(false),
                  tileloadstart: () => setOverlayLoading(true),
                  tileerror: () => setOverlayLoading(false),
                }}
              />
            ) : null}
            {pointsOfInterest.map((poi) => (
              <CircleMarker
                key={poi.id}
                center={poi.position}
                radius={10}
                pathOptions={{
                  color: '#11111b',
                  weight: 3,
                  fillColor: colorMap[poi.color],
                  fillOpacity: 0.98,
                }}
                className={`poi-dot ${poi.color}`}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                  {poi.name}
                </Tooltip>
                <Popup>
                  <strong>{poi.name}</strong>
                  <br />
                  {poi.description}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </section>

      <div className={`overlay-stack ${mode === 'story' ? 'is-story' : ''}`}>
        <header className="panel app-header">
          <div className="brand">
            <h1>淡水港</h1>
            <h1>發展時間軸地圖</h1>
            <p>圖資來源: 中央研究院歷史地圖 WMTS。</p>
          </div>
        </header>

        <section className="panel mode-panel">
          <div className="mode-card">
            <button
              type="button"
              className={`mode-chip ${mode === 'normal' ? 'is-active' : ''}`}
              onClick={() => setMode('normal')}
            >
              Normal
            </button>
            <button
              type="button"
              className={`mode-chip ${mode === 'story' ? 'is-active' : ''}`}
              onClick={() => setMode('story')}
            >
              Timeline Story
            </button>
          </div>
        </section>

        {mode === 'normal' ? (
          <section className="panel timeline-panel">
            <div className="timeline" ref={normalTimelineRef}>
              {timeline.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`timeline-item ${item.id === activeId ? 'is-active' : ''}`}
                  onClick={() => setActiveId(item.id)}
                  ref={(node) => {
                    normalItemRefs.current[index] = node
                  }}
                >
                  <span className="year">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </button>
              ))}
            </div>
            {active ? (
              <div className="detail">
                <h2>{active.title}</h2>
                <p>{active.summary}</p>
                <div className="meta">圖層代碼：{active.layerId}</div>
              </div>
            ) : null}
          </section>
        ) : (
          <section className="panel timeline-panel story-panel">
            <div className="timeline" ref={storyTimelineRef}>
              {timelineStory.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`timeline-item ${item.id === storyActiveId ? 'is-active' : ''}`}
                  onClick={() => setStoryActiveId(item.id)}
                  ref={(node) => {
                    storyItemRefs.current[index] = node
                  }}
                >
                  <h3>{item.year}</h3>
                </button>
              ))}
            </div>
          </section>
        )}

        {mode === 'normal' ? (
          <section className="panel legend-panel">
            <div className="legend">
              <span>
                <span className="dot metro" />淡水捷運站
              </span>
              <span>
                <span className="dot university" />淡江大學
              </span>
              <span>
                <span className="dot harbor" />淡水港
              </span>
              <span>
                <span className="dot keelung" />基隆港
              </span>
            </div>
          </section>
        ) : (
          <section className="panel story-info">
            {storyActive?.image ? (
              <div className="story-image">
                <img src={storyActive.image} alt={storyActive.title} />
              </div>
            ) : (
              <div className="story-image is-placeholder">圖片預留</div>
            )}
            <div className="story-body">
              <span className="story-point">{storyActive?.point}</span>
              <h2>{storyActive?.title}</h2>
              <p>{storyActive?.content}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default App
