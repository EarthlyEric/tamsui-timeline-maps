import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { useEffect, useMemo, useState } from 'react'
import { timeline } from './data/timeline'
import { colorMap, mapCenter, pointsOfInterest } from './data/points'

const wmtsBase =
  'https://gis.sinica.edu.tw/tamsui/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0'

function App() {
  const [activeId, setActiveId] = useState(timeline[0].id)
  const [overlayLoading, setOverlayLoading] = useState(true)
  const active = useMemo(() => timeline.find((item) => item.id === activeId), [activeId])
  const overlayLabel = active ? `${active.year} ${active.title}` : '歷史圖層'
  const overlayUrl = active
    ? `https://gis.sinica.edu.tw/tamsui/file-exists.php?img=${active.layerId}-png-{z}-{x}-{y}`
    : null

  useEffect(() => {
    setOverlayLoading(Boolean(overlayUrl))
  }, [overlayUrl])

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

  return (
    <div className="app-shell">
      <section className="map-panel map-panel-full animate-rise">
        <div className="map-shell">
          <span className="overlay-label">{overlayLabel}</span>
          {overlayLoading ? (
            <div className="overlay-loading">
              <span className="spinner" />
              <span>圖層載入中</span>
            </div>
          ) : null}
          <MapContainer
            center={mapCenter}
            zoom={14}
            minZoom={14}
            maxZoom={14}
            zoomControl={false}
            dragging={false}
            className="map-core"
          >
            <DisableZoom />
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {overlayUrl ? (
              <TileLayer
                key={active.layerId}
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
                radius={14}
                pathOptions={{
                  color: '#f5c2e7',
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

      <div className="overlay-stack">
        <header className="panel app-header">
          <div className="brand">
            <h1>淡水港</h1>
            <h1>發展時間軸地圖</h1>
            <p>圖資來源: 中央研究院歷史地圖 WMTS。</p>
          </div>
        </header>

        <section className="panel timeline-panel">
          <div className="timeline">
            {timeline.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`timeline-item ${item.id === activeId ? 'is-active' : ''}`}
                onClick={() => setActiveId(item.id)}
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
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
