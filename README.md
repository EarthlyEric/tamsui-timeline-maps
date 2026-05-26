# 淡水港發展時間軸地圖

疊加中央研究院淡水百年歷史地圖 WMTS，透過時間軸切換不同年代圖層。

## 開發

```bash
npm install
npm run dev
```

## 主要設定

- 歷史 WMTS 來源：`https://gis.sinica.edu.tw/tamsui/wmts`
- 現代底圖：OpenStreetMap
- 地圖中心：淡水港

## 新增/調整時間點

編輯 `src/data/timeline.js`：

- `year` 顯示年份
- `title` 顯示標題
- `summary` 說明文字
- `layerId` 對應 WMTS 圖層代碼

## 調整標記點

編輯 `src/data/points.js`：

- `mapCenter` 地圖中心
- `pointsOfInterest` 標記點陣列
- `colorMap` 點色對應

## WMTS 圖層

- `Tamsui_1888`
- `Tamsui_1893`
- `Tamsui_1895`
- `Tamsui_3K_1910`
- `Tamsui_1913`
- `tamsui_2.5K_1939`
