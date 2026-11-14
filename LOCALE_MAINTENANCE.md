# 中英文網站維護

2026-11-14：五個專案共 35 個英文頁，與 35 個中文頁一一對應。英文入口為各網站根路徑下的 /en/，頁面提供中英文切換，保留頁面、查詢參數與錨點。

## 更新流程

1. 修改根目錄中文 HTML 或原始內容資料。
2. 在 scripts/translations.en.json 補上新增中文文字的英文翻譯。
3. ETK、ETK copy、ETK copy2、photo 執行 node scripts/build-seo.cjs；ETK copy3 執行 node scripts/write-site-metadata.cjs。
4. 上述流程會呼叫 scripts/build-locales.cjs，重新產生 en/、英文腳本與相關資料；不要直接修改生成檔。缺少翻譯會使建置失敗。
5. 於 D:/CURSOR/github-publish-2026-11-14 執行 node check-locale-builds.cjs 與 node verify-locales.cjs，檢查建置一致性、語言、SEO、連結及互動。
6. 執行 node prepare.cjs，再執行 node prepare-sites.cjs，檢查各儲存庫差異後提交、推送。同步腳本不自動刪除舊檔，改名或刪除頁面時需確認工作副本沒有殘留。

## 索引與部署

ETK 主站及 PHOTO 使用各語言獨立 canonical、雙向 hreflang 和雙語 sitemap。ETK copy、copy2、copy3 的中文與英文頁均設 noindex, follow；noindex 不提供存取保護。

etk-websites 已確認為 PRIVATE，本次不變更可見性或啟用 Pages。GitHub 同步與網站公開上線是不同狀態。PHOTO 沿用既有部署流程，是否上線須另查部署結果。

## 本機驗證

70 個頁面、3,292 項檢查通過；35 個英文頁經 Chrome 載入無 JavaScript 執行錯誤。涵蓋產品篩選、相簿燈箱、語言切換參數與手機寬度溢出檢查。五個專案連續建置結果一致。

驗證不送出表單，不代表收件服務、Core Web Vitals 或搜尋引擎收錄已驗收。原始結果保存於 checks/locale-verification.json 與 checks/locale-build-verification.json。
