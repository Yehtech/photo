# 四站 SEO 稽核與修正紀錄

更新：2026-11-13，第二輪修正後狀態。第一輪報告已封存。

## 結論

已修改 ETK、ETK copy、ETK copy2、photo。原本 26 個 HTML，新增 photo 六個作品獨立頁後共 **32 個 HTML**：29 個預期公開索引頁及 3 個 noindex 頁。

**130 項基礎驗證 + 157 項第二輪驗證，共 287 項通過。** 本次未部署、未提交 Git，也沒有送出或刪除預約。

瀏覽器工具回報 `The browser access host is unavailable`，因此未完成真實瀏覽器視覺、手機版、Rich Results Test 或 Core Web Vitals 實測；HTTP 與渲染函式測試不等於完成這些驗收。

| 專案 | HTML 數 | 已完成 |
| --- | ---: | --- |
| ETK | 7 | 六頁標題與分享摘要、五款產品規格預渲染、設計比較頁 noindex、SEO 建置 |
| ETK copy | 6 | 六頁標題與分享摘要、產品規格預渲染、shader 按需載入 |
| ETK copy2 | 6 | 移除展示版／英文檔名標題、產品規格預渲染、shader 按需載入 |
| photo | 13 | 主要頁面預渲染、六個作品獨立頁、描述與分享資訊、圖片尺寸與圖示、301／404、後台 noindex |

## 已修正問題

### P1：ETK copy2 標題偏離業務主題

影響：中至高，搜尋結果難辨認業務內容。

原首頁含「WebGPU Shaders 旗艦互動展示版」，內頁使用 about、products 等檔名。三版 ETK 現在均使用描述業務的獨立標題，例如「5GHz／5.8GHz 無線音頻晶片與模組｜唯峰科技 EVERESTEK」。共更新 18 個主要頁面，原有產品描述及規格保留。

證據：三版的 index.html、products.html、technology.html、applications.html、about.html、contact.html。

### P1：作品無效網址與 soft 404

影響：中至高，無內容作品網址原本仍可能回傳 200。

- 作品連結已改為 album-<slug>.html，六個作品各有可直接讀取的 HTML。
- photo/server.js：有效 /album.html?id=... 與 /album?id=... 以 301 導向新頁；無效／缺少 id 回 404 及 X-Robots-Tag: noindex；JSON 資料讀取失敗回 503。
- 靜態主機：舊頁由 app.js 轉往新頁；無效作品設定 noindex。舊 album.html 本身也設 noindex，未啟用 JS 時可返回作品集。
- 靜態主機不執行 server.js；若要真正的伺服器端 301／404，仍需配置正式主機路由。
- 相簿從 JSON 刪除後，建置只清除 generated-albums.json 清單內且具有生成標記的舊頁，不刪除其他手動檔案。

證據：photo/server.js、assets/js/app.js、album.html、scripts/build-seo.cjs、scripts/generated-albums.json。

### P2：內容依賴 JavaScript

影響：中，增加渲染依賴，不代表 Google 一定不能收錄。

- photo 首頁、作品列表、關於、服務原本 main 空白，現在初始 HTML 有標題、文字、圖片及連結。
- 六個作品頁有各自的故事、地點與圖片，並保留分類、輪播、燈箱互動。
- JSON 載入失敗時，不再抹掉已預渲染的主要內容。
- contact.html 原本有表單與 H1，繼續保留；聯絡側欄及分類選項仍由 JS 填入。
- ETK 三版 products.html 已包含五款產品完整規格。建置直接執行既有 main.js 的 renderFullProducts()，維持同一份產品資料與渲染邏輯。

證據：四站 scripts/build-seo.cjs、photo 的 album-*.html、三版 ETK 的 SEO_PRODUCTS_START／SEO_PRODUCTS_END 區段。

### P2：photo 描述與標題

影響：中，原始描述空白、執行後多頁共用全站摘要。

現在主要頁面與作品頁有獨立靜態標題及描述；app.js 保留每頁設定，作品內容會同步更新 OG。建置從 content/*.json 更新作品資料，避免只改前端而讓初始 HTML 過時。

### P2：非公開用途頁面

- ETK/logo_compare.html：noindex, follow。
- photo/admin.html：noindex, nofollow，公開頁尾後台連結已移除，後台仍可直接開啟。
- photo/album.html：舊作品殼頁 noindex, follow，新作品頁可索引。
- robots 不封鎖這三頁，讓爬蟲能讀取 noindex。noindex 不是登入或權限保護，本次未改後台授權機制。

### P2：效能與圖片載入

影響：潛在中，實際效能仍待測量。

- photo 圖片從原圖／縮圖讀取尺寸，為靜態與執行後圖片加上 width／height，減少載入時版面位移；保留縮圖與全尺寸燈箱。
- 首屏主要圖採 eager，其餘圖片採 lazy；ETK 產品清單也加入 lazy loading／async decoding。
- photo 原本七頁引用卻不存在的 assets/favicon.svg 已補齊。
- 兩個 copy 版本的 2,594,689 bytes shaders.bundle.js 改為 dynamic import：檢查 navigator.gpu，等主要頁面 load 後於 idle 時段載入，保留原 fallback 路徑。
- 約 2.93 MB 的 tailwind.min.css 未被 HTML 引用，實際使用 tailwind.css 約 26–31 KB，因此未誤列為實際載入負擔。
- 未宣稱 LCP、INP、CLS 已達標，shader 視覺與 GPU 運作仍待瀏覽器驗證。

### P3：分享與結構化資料

29 個預期公開索引頁有基本 title、description、OG 與 Organization JSON-LD。Organization 僅使用現有品牌名稱，沒有新增虛構地址、評分或資歷。JSON 語法與標記數量已驗證，重建不會重複插入；尚未執行 Rich Results Test，亦不保證特殊搜尋外觀。

### P2：canonical、sitemap 與 robots 的產生機制

四站已加入 seo.config.json、scripts/write-site-metadata.cjs 與 robots.txt。

- siteUrl 空白，未猜測正式網域。
- 填入真實 HTTPS 正式網址並重建，即產生公開頁 self-canonical、og:url、分享圖絕對網址、sitemap.xml 與 robots Sitemap 宣告。
- 支援部署子目錄與 SEO_SITE_URL 環境變數。
- 後台、設計比較頁、舊相簿殼頁不列入 sitemap。
- 產生器已在隔離目錄使用保留的 .invalid 網域驗證，測試網址沒有寫入四個網站。

## 尚待外部資料或正式部署驗證

| 優先級 | 項目 | 狀態 |
| --- | --- | --- |
| P1 | photo 真實聯絡方式 | site.json 仍有 hello@example.com、示範電話與社群首頁；未取得真實值，未擅自替換 |
| P1（條件式） | ETK 多版本同時公開 | 尚不清楚正式與預覽版本，未任意對整站加 noindex；本機副本本身不是 SEO 重複內容 |
| P2 | 正式網域 | 產生器完成，需在各站 seo.config.json 填入 siteUrl 才能輸出正確 canonical/sitemap |
| P2 | 英文獨立網址 | 使用者確認目前沒有；保留按鈕與 localStorage 語言切換，未虛構 hreflang |
| P2 | 主機 HTTP/HTTPS、轉址、壓縮、快取 | 本機 Node 測試完成，正式主機設定尚待驗證 |
| P2 | 視覺、手機版、Core Web Vitals | 瀏覽器存取主機不可用，未宣稱完成 |
| P3 | 資歷與案例證據 | photo 年資、場次、獎項及 ETK 技術宣稱待業主核實，未認定為已外部驗證 |
| P3 | Search Console | 尚未取得正式站與權限，未提交 sitemap 或宣稱收錄、排名改善 |

## 驗證

基礎套件 130 項：32 個 HTML 標題、編碼、站內標題唯一性、29 頁描述與 OG、3 頁 noindex、直接引用的本機資源、metadata 函式及本機 HTTP 路由。

第二輪 157 項：四站重建一致性、Organization JSON、無猜測 canonical、五款產品預渲染、產品分類與英文文字、photo 初始內容與圖片尺寸、作品分類與燈箱事件綁定、六組舊 URL 301 與新 URL 200、隔離的網址產生器、shader 動態載入程式碼。

渲染函式測試使用 Node 模擬 DOM，不等於真實瀏覽器點擊。JavaScript 與建置腳本另以 node --check 檢查語法。未送出任何預約。

## 維護方式與檔案

在每個專案目錄執行：

```powershell
node scripts/build-seo.cjs
```

使用 Node.js 22 或更新版本，不需新增 npm 套件。詳細操作見各站 SEO_BUILD.md。photo 的 GitHub Actions 縮圖 workflow 已加入 JSON／SEO 設定觸發及靜態建置；僅修改檔案，尚未執行遠端 workflow 或發布。

- 第一輪備份：D:/CURSOR/seo-audit-2026-11-13/before-fixes/
- 第二輪備份：D:/CURSOR/seo-audit-2026-11-13/before-second-pass/
- 第一輪報告封存：同目錄 SEO_AUDIT-first-pass.md
- 驗證輸出：同目錄 verification.json、verification-second-pass.json
- 重跑：node D:/CURSOR/seo-audit-2026-11-13/verify.cjs
- 重跑：node D:/CURSOR/seo-audit-2026-11-13/verify-second-pass.cjs
- apply-fixes.cjs 與 second-pass.cjs 是一次性修改紀錄，勿重跑；平常使用各站建置腳本。
- D:/CURSOR 不是 Git repository，本次未提交或部署。

## 參考依據

- [Google：JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)：渲染依賴與 metadata。
- [Google：搜尋結果標題](https://developers.google.com/search/docs/appearance/title-link)：明確描述頁面主題。
- [Google：多語網站](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)：不同語言使用獨立網址。
- [Google：Canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)：一致的網址整合訊號。
- [Google：HTTP 狀態碼](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes)：錯誤頁成功回應可能形成 soft 404。