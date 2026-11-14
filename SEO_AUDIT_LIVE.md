# 上線後 SEO 稽核與修正

日期：2026-11-14。範圍：ETK、ETK copy、ETK copy2、ETK copy3 與 PHOTO 的 GitHub Pages 網址。

## 檢查方式

依 seo-audit 的抓取／索引、技術基礎、頁面主題及內容順序，檢查實際 HTTP 回應與部署內容，並回查原始碼。

第一次上線 HTTP 檢查共 219 項通過，涵蓋 35 個內容頁、連結資源、JSON-LD、sitemap、缺頁 404，以及 photo 預約資料與 .env 未公開。通過 HTTP 不代表內容語意已正確，因此又針對品牌、描述、分享圖及載入方式進行本輪修正。

瀏覽器存取服務不可用；未宣稱完成手機視覺驗收、Google 收錄檢查或 Core Web Vitals 測量。最終發布／檢查紀錄見 GITHUB_PUBLISH_RESULTS.md。

## 發現與處理

| 優先級 | 發現與證據 | 影響 | 修正 |
| --- | --- | --- | --- |
| P1 | copy3/index.html 是 ÉVÈRA ATELIER 設計稿，但共用產生器輸出 ETK Organization | 結構化資料與可見品牌不一致 | 在 seo.config.json 加入首頁專屬 organizationName，保留其他 ETK 內頁原品牌；沒有把精品稿強行改成 ETK |
| P2 | copy3 首頁在 head 載入 cdn.tailwindcss.com 並於瀏覽器產生 CSS | 增加外部與執行時依賴 | 把原本 theme 原樣移入 tailwind.luxury.config.js，用已安裝的 Tailwind 編譯本機 CSS，移除 CDN 與 inline 設定 |
| P2 | copy3 缺少 OG 標題／描述等分享設定，首頁分享圖卻是 ETK 圖 | 分享主題不符 | 產生器從頁面標題／描述補齊 OG，首頁改用實際精品主視覺；補 ÉVÈRA 圖示 |
| P2 | PHOTO 各作品共用全站風景分享圖 | 婚禮、人像、商業作品的預覽圖不符內容 | 從 content/albums.json 讀取每組作品 cover，產生作品專屬絕對網址 og:image |
| P2 | PHOTO 首頁 H1 只有 Light, Moments & Stories | 主標題未直接表達服務類型 | 改為「人像・婚禮・商業攝影」，保留原有副標語與服務內容 |
| P2 | 多個 ETK 版本內容接近 | 若全部索引，會產生重複版本選擇問題 | 公開 copy、copy2、copy3 保持 noindex, follow；主 ETK 與 PHOTO 可索引，且各有 canonical／sitemap |

所有能由現有內容確定的項目已修改並重新建置；沒有補造獎項、真實電話、地址或英文翻譯。

## 仍需業主資料或外部服務

- PHOTO 的 hello@example.com、示範電話、社群平台首頁以及資歷宣稱，仍需業主提供或核實；不能由 SEO 工具猜出真實值。
- GitHub Pages 不執行 Node/Python 接單 API，表單／後台必須另外接服務後才能正式收單。此次沒有送出表單或測試訂單。
- copy3 首頁與其餘內頁是不同品牌設計，現以 noindex 預覽保留。若未來要作正式品牌網站，需先決定品牌、刪除不屬於該品牌的內頁並重新規劃導覽，不能只用 SEO metadata 掩蓋差異。
- 英文字母網址已建立；英文內容版本尚未建立，仍未使用不存在的 /en/ 或 hreflang。
- GitHub Pages 專案下的 robots.txt 不等於主機根目錄 /robots.txt。copy 預覽的索引控制依靠頁面 noindex；sitemap 可直接提交至對應 Search Console URL-prefix property。
- Google Search Console、Rich Results Test、真實瀏覽器與行動裝置效能，尚未完成外部驗證。

## 維護

- ETK、copy、copy2、PHOTO：修改內容後執行 `node scripts/build-seo.cjs`。
- copy3：首頁樣式修改執行 `npm run build:luxury-css`（其他內頁保留 `npm run build:css`），metadata 修改執行 `node scripts/write-site-metadata.cjs`。
- 各站 `seo.config.json` 的 `pages` 可對特定檔案設定 organizationName、shareImage；PHOTO 的作品封面自動取自 JSON。
- 完整原始專案和 ETK 公開靜態網站是不同儲存庫，需同步更新兩者；操作流程見 GITHUB_DEPLOYMENT.md。

## 最終線上複查

2026-11-14 08:25（台灣時間）：272 項通過、0 項失敗，涵蓋 35 個內容頁。詳見 GITHUB_PUBLISH_RESULTS.md 與公開儲存庫 checks/online-checks.json。
