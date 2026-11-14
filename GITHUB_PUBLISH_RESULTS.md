# GitHub 發布與 SEO 驗證結果

日期：2026-11-14（台灣時間）。五個網站已推送並部署。最新線上驗證於 08:25 完成：272 項通過、0 項失敗，涵蓋 35 個內容頁。

| 專案 | 網站 | 原始碼儲存庫 |
| --- | --- | --- |
| ETK | https://yehtech.github.io/etk-websites/etk/ | https://github.com/Yehtech/etk （私人） |
| ETK copy | https://yehtech.github.io/etk-websites/etk-copy/ | https://github.com/Yehtech/etk-copy （私人） |
| ETK copy2 | https://yehtech.github.io/etk-websites/etk-copy2/ | https://github.com/Yehtech/etk-copy2 （私人） |
| ETK copy3 | https://yehtech.github.io/etk-websites/etk-copy3/ | https://github.com/Yehtech/etk-copy3 （私人） |
| PHOTO | https://yehtech.github.io/photo/ | https://github.com/Yehtech/photo （公開） |

ETK 四版的公開靜態部署儲存庫：https://github.com/Yehtech/etk-websites 。兩個 Pages 部署均回報 built；驗證的程式版本為 etk-websites ae937d7 與 photo 7f29a88，後續文件提交不改動網站內容。

## 修正與驗證

- 修正標題、描述、canonical、OG 分享資訊與結構化資料，產生 sitemap；PHOTO 作品頁具各自分享封面。
- PHOTO 頁面與 ETK 產品內容預先輸出 HTML，補上圖片尺寸；舊相簿網址保留前端轉址。
- copy3 首頁保留 ÉVÈRA 品牌，修正錯誤的 ETK 結構化資料，改用獨立編譯 CSS，避免修改其他內頁樣式。
- ETK copy 系列公開預覽設 noindex，主 ETK 與 PHOTO 可索引。
- 本機兩組驗證共 287 項通過。線上 272 項檢查包括 HTTP、canonical、H1、描述、OG、圖片 alt 屬性、JSON-LD 解析、連結資源、分享圖、sitemap、404 及敏感資料未公開。此數字是自動檢查項目數，不是 SEO 分數。
- 線上原始結果：公開部署儲存庫的 checks/online-checks.json。

## 網址與維護

已建立英文字母網址，使用免費 GitHub Pages 子路徑，不需購買網域；內容未翻譯為英文，也未建立空的 /en/ 頁面。部署方法與日後更新流程見 GITHUB_DEPLOYMENT.md；問題證據與修正見 SEO_AUDIT_LIVE.md。

實際 Git 工作副本位於 D:/CURSOR/github-publish-2026-11-14/ 下各同名儲存庫。D:/CURSOR/WEB/ 下是原始編輯專案，未自動加入 .git。修改原始專案並建置後，使用 prepare.cjs 同步至工作副本，再用 prepare-sites.cjs 產生公開 ETK 檔案；檢查 git diff 後分別 commit、push。prepare.cjs 會覆蓋工作副本中的對應檔案，因此不要在兩邊同時編輯。同步不會自動清除已刪除檔案，刪除或改名時須在工作副本與公開產物確認並移除對應舊檔。

## 未完成的外部事項

GitHub Pages 不執行 Node/Python 後端；預約與聯絡表單仍需串接收件服務。PHOTO 示範聯絡資訊與資歷宣稱需業主核實。未送出測試訂單。瀏覽器服務不可用，未完成視覺／行動裝置驗收、Core Web Vitals、Google Search Console 收錄或 Rich Results Test；上述自動檢查不代表這些項目已通過。