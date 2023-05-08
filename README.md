# CinePOS_BackEnd 版控&上版注意事項

—————————— 分支介紹 ——————————

1. main：部署上正式機用。 ps.除了負責人，其他人請勿併入、發 PR<br>
2. develop：部署上測試機用。<br>
3. 後端共用分支：解衝突/測試用。發 PR 到 develop 前，請先併入後端共用分支解衝突、測試<br>
4. 自己的分支：各自開發用
   - 請一律從「develop」切分支出來，分支命名請以「feature/」開頭
   - 請按照功能來切分支<br><br><br>

—————————— 佈版：上測試機 ——————————<br>
※ 測試機：https://api-t.cine-pos.com/<br>
step 1. 【自己分支】在自己的分支，pull 最新版的 master、develop、後端共用分支。<br>
step 2. 【自己分支 → 後端共用分支】 切到後端共用分支，將自己的分支 merge 進來後推到遠端。<br>
step 3. 【後端共用分支】

- 刪掉整包 dist 檔，在終端機編譯 ts 檔(指令請打「tsc」)<br>
- 在本機打「npm start」測試程式是否正常運行<br>

step 4. 【後端共用分支 → develop】發 PR 到 develop（可以自己按核可）=>https://github.com/chiawen81/CinePOS_BackEnd/pulls<br>
step 5. 【develop】發完 PR 後，會自動跑 CICD 部署，靜待 3-5 分鐘即完成<br><br>

—————————— 佈版：上正式機 ——————————<br>
※ 限負責人上版<br>
step 1. 從 develop 發 PR 到 main 後，自己按核可（此時會自動跑 CICD）<br>
step 2. 靜待 3-5 分鐘即完成部署，可打 API 檢查=>https://api.cine-pos.com/<br><br><br>

※ 目前預計每週日固定更新一次測試機、正式機
