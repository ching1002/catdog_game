# 貓狗大戰美術素材紀錄

## 使用流程

- 使用 `generate2dsprite` 規劃 sprite atlas。
- 使用 `imagegen` 產生乾淨手繪 HD 風格素材。
- 使用本地 PIL 腳本將 #FF00FF chroma-key 背景轉透明。
- 將 4x4 atlas 切成獨立 PNG，供 `game.js` 直接載入。
- 使用 `generate2dmap` 規劃橫向卷軸背景。

## 美術方向

- clean HD hand-painted 2D mobile game art
- 可愛、明亮、清楚的輪廓
- 非 pixel art
- 背景淡化，避免干擾角色與彈幕
- 角色與敵人使用較明確的描邊與暖色陰影

## 已建立素材

- `assets/raw/cat-dog-atlas-raw.png`
- `assets/backgrounds/pet-neighborhood.png`
- `assets/sprites/cat-hero.png`
- `assets/sprites/dog-small.png`
- `assets/sprites/dog-fast.png`
- `assets/sprites/dog-big.png`
- `assets/sprites/dog-disc.png`
- `assets/sprites/dog-bone.png`
- `assets/sprites/boss-shiba.png`
- `assets/sprites/boss-doghouse.png`
- `assets/sprites/projectile-yarn.png`
- `assets/sprites/projectile-bone.png`
- `assets/sprites/projectile-disc.png`
- `assets/sprites/pickup-heal.png`
- `assets/sprites/pickup-shield.png`
- `assets/sprites/pickup-rapid.png`
- `assets/sprites/pickup-score.png`
- `assets/sprites/fx-explosion.png`

## Atlas Prompt

Create a polished clean HD hand-painted 2D game asset atlas for a cute side-scrolling game called Cat Dog Battle. A brave orange cat hero fights a dog army. The atlas must contain 16 separate centered assets arranged in a precise 4 x 4 grid: cute orange cat hero facing right, small brown dog enemy facing left, fast tan dog enemy facing left, large bulldog enemy facing left, dog with frisbee facing left, dog with bone launcher facing left, huge Shiba boss facing left with red scarf, dog house fortress boss, glowing golden yarn projectile orb, white bone enemy projectile, teal frisbee projectile, green fish can heal pickup, blue cardboard shield pickup, pink catnip rapid fire pickup, golden yarn score pickup, orange paw-shaped explosion burst. Clean HD 2D game sprites, hand-painted cartoon, professional mobile game quality, crisp readable silhouettes, subtle outline, soft cel shading, no pixel art. Perfectly flat solid #FF00FF chroma-key background only. No text, labels, watermarks, cell borders, UI, cropped assets, or assets touching cell edges.

## Background Prompt

Create a polished clean HD hand-painted 2D side-scrolling background for a cute game called Cat Dog Battle. The scene is a whimsical pet neighborhood battlefield with rooftop park platforms, a pet shop street, soft distant dog houses, cat towers, toy balls, paw-print signs, and greenery. It must be readable behind gameplay and not too busy. Clean HD 2D mobile game background, hand-painted cartoon, professional casual game quality, soft cel shading, no pixel art. Wide horizontal side-scroller scene, camera-friendly, clear horizon, lower ground band suitable for a scrolling game. Bright afternoon, playful, warm, cute but action-game readable. No text, labels, watermarks, UI, heavy contrast, foreground objects blocking gameplay, characters, or projectiles.

## 後續動畫建議

- 貓咪：idle 4 frames、attack 4 frames、hurt 2 frames、death 4 frames。
- 狗狗：walk/run 4 frames、hurt 2 frames。
- Boss：idle 4 frames、charge warning 3 frames、dash 3 frames、death 6 frames。
- 特效：光球 loop 4 frames、爆炸 6 frames、護盾 loop 4 frames。

## 已建立逐格動畫

逐格動畫位於 `assets/animations/`，並由 `assets/animations/manifest.json` 紀錄。

- `cat-idle`: 4 frames
- `cat-attack`: 4 frames
- `cat-hurt`: 2 frames
- `dog-small-run`: 4 frames
- `dog-fast-run`: 4 frames
- `dog-big-run`: 4 frames
- `dog-disc-run`: 4 frames
- `dog-bone-run`: 4 frames
- `boss-idle`: 4 frames
- `boss-charge`: 3 frames
- `boss-dash`: 3 frames
- `boss-death`: 6 frames
- `projectile-yarn-loop`: 4 frames
- `projectile-bone-loop`: 4 frames
- `projectile-disc-loop`: 4 frames
- `fx-explosion-loop`: 6 frames

第一輪動畫使用現有靜態 PNG 做逐格衍生，優點是角色外觀一致、可快速接入遊戲。後續若要再升級，可使用 `generate2dsprite` 針對單一角色重新生成更細緻的原生動畫 sheet。

## 原生手繪動畫 Sheet

第二輪已新增 `assets/animations-native/`，包含新生成的原生手繪 sheet，並切成遊戲可載入的逐格 PNG。

- 貓咪：`cat-native-idle`、`cat-native-attack`、`cat-native-hurt`、`cat-native-ready`
- 柴犬 Boss：`boss-shiba-native-idle`、`boss-shiba-native-roar`、`boss-shiba-native-shoot`、`boss-shiba-native-dash`、`boss-shiba-native-death`
- 狗屋 Boss：`boss-doghouse-native-idle`、`boss-doghouse-native-roar`、`boss-doghouse-native-shoot`、`boss-doghouse-native-dash`、`boss-doghouse-native-death`
- 機甲狗 Boss：`boss-mecha-native-idle`、`boss-mecha-native-roar`、`boss-mecha-native-shoot`、`boss-mecha-native-dash`、`boss-mecha-native-death`

遊戲現在依 Boss variant 播放不同動畫：

- Wave 5: `shiba`
- Wave 10: `doghouse`
- Wave 15: `mecha`
- 後續每 15 wave 循環

## 入口畫面與前導影片

已新增進入遊戲前流程：

1. 顯示精美標題畫面。
2. 玩家按下「進入遊戲」。
3. 播放 `assets/video/intro.mp4` 前導影片。
4. 玩家可按 `SKIP` 略過。
5. 影片結束或略過後進入正式遊戲。

入口美術：

- `assets/ui/title-background.png`
- `assets/ui/enter-button.png`
- `assets/raw/enter-button-raw.png`

影片：

- `assets/video/intro.mp4`
