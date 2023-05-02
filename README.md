# CinePOS_BackEnd 版控&上版注意事項

—————————— 分支介紹 ——————————

1. main：部署上正式機用。 ps.除了負責人，其他人請勿併入<br>
2. develop：部署上測試機用。<br>
3. 後端共用分支：解衝突/測試用。併入 develop 上測試機前，請先併入後端共用分支解衝突、測試<br>
4. 自己的開發分支：各自開發用。請一律從「後端共用分支」切分支出來，分支命名請以「feature/」開頭<br><br><br>

—————————— 佈版：上測試機 ——————————<br>
step 1. 【自己的開發分支】在自己的開發分支，pull 最新版的後端共用分支。<br>
step 2. 【自己的開發分支 → 後端共用分支】 切到後端共用分支，將自己的開發分支 merge 進來<br>
step 3. 【後端共用分支】測試程式是否正常運行<br>
step 4. 【後端共用分支 → develop】先 pull 最新版 develop 下來，再將後端共用分支 merge 進來後<br>
step 5. 【develop】刪掉整包 dist 檔，在終端機編譯 ts 檔(指令請打「tsc」)，完成後推送至遠端（此時會自動跑 CICD）<br>
step 6. 靜待 3-5 分鐘即完成部署，可打 API 檢查=>https://api-t.cine-pos.com/<br>

—————————— 佈版：上正式機 ——————————<br>
※ 限負責人上版<br>
step 1. 【master】先 pull 最新版 master 下來，再將 develop merge 進來後編譯，推送至遠端（此時會自動跑 CICD）<br>
step 2. 靜待 3-5 分鐘即完成部署，可打 API 檢查=>https://api.cine-pos.com/<br><br><br>

※ 目前預計每週日固定更新一次測試機、正式機
