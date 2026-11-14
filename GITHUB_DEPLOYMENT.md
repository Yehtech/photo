# GitHub 與網站網址說明

## 網址

- ETK：https://yehtech.github.io/etk-websites/etk/
- ETK copy：https://yehtech.github.io/etk-websites/etk-copy/
- ETK copy2：https://yehtech.github.io/etk-websites/etk-copy2/
- ETK copy3：https://yehtech.github.io/etk-websites/etk-copy3/
- PHOTO：https://yehtech.github.io/photo/

這些是以英文字母組成的公開網站網址，內容仍維持原本語言，不是另外翻譯成英文的網站。無需購買網域。未來可另外綁定自有網域；如果要讓英文內容獨立被搜尋，才需要建立 /en/ 等語言頁面與 hreflang。

## 儲存方式

ETK 完整原始專案分別保存於私人儲存庫 Yehtech/etk、etk-copy、etk-copy2、etk-copy3。公開儲存庫 Yehtech/etk-websites 僅放網站所需的 HTML、assets 與 sitemap，不包含設計原稿、Word、壓縮檔、本機設定或套件目錄。copy 版本加上 noindex，避免相近內容一起被索引；ETK 主版本使用自己的 canonical。

photo 沿用原本公開的 Yehtech/photo 儲存庫與既有 Git 歷史。預約資料 data/、.env、密鑰與 node_modules 未上傳。

## 建立流程

1. 比對 GitHub 既有儲存庫，photo 先 clone，保留歷史後覆蓋本機最新版。
2. 排除密鑰、本機設定、套件及預約資料，掃描待上傳文字檔的常見憑證格式。
3. 在 seo.config.json 填入上方正式網站網址，執行 node scripts/build-seo.cjs。ETK copy3 此次只執行 node scripts/write-site-metadata.cjs；它不在原先四站 SEO 稽核範圍。
4. 產生 canonical、OG 絕對網址、sitemap。將 ETK 網站檔案整理至 etk-websites 的對應子目錄。
5. 建立本機 Git commit，推送 GitHub。photo 更新既有 main，ETK 新倉庫以 main 保存。
6. GitHub Pages 由 main 分支的根目錄發布。頁面相對連結讓網站能在專案子目錄中正常運作。
7. 檢查遠端 commit、Pages 建置狀態，以及線上首頁、內頁、樣式、腳本與圖片回應。

## 之後如何更新

先修改本機專案，再執行各自建置腳本。ETK 的私人原始碼與公開網站檔案是兩個儲存庫，更新原始碼後還要重新整理網站檔案並推送 etk-websites；目前沒有跨儲存庫自動發布。photo 直接更新自己的 main，原有縮圖 workflow 也已加入 SEO 靜態建置。

GitHub Pages 是靜態託管，不執行 Node.js 或 Python。photo 的作品展示可運作，但接單 API、後台資料管理與伺服器端 301 不會因 Pages 自動啟用。舊作品網址使用前端轉址；若要正式收單，需另接後端或表單服務，並先填妥真實 Email、電話與社群資料。

ETK 與 photo 的既有表單不因這次發布就代表已串好收件服務。請以實際收件驗證為準；本次檢查不送出表單，也不建立測試訂單。

本文件先記錄設定與操作流程；實際發布結果以 GITHUB_PUBLISH_RESULTS.md 為準。
實際 Git 工作副本在 D:/CURSOR/github-publish-2026-11-14/；WEB 下仍為原始編輯目錄。同步腳本與刪除檔案注意事項見 GITHUB_PUBLISH_RESULTS.md。copy3 首頁樣式使用 npm run build:luxury-css。
