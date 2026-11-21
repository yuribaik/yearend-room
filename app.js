// 연말 친구 모임방 — standalone build (Preact + htm, Firebase realtime)
import { h, render, Component as PreactComponent } from 'https://esm.sh/preact@10.24.3';
import htm from 'https://esm.sh/htm@3.1.1';
const html = htm.bind(h);


var WORLD_W = 3600, VIEW_W = (typeof window !== 'undefined' && window.STAGE_W) || 1280, START_X = 1560;
var INVITE_URL = (typeof location !== 'undefined') ? location.origin + location.pathname : '';
var SEATS = [{ x: 470, type: 'pond' }, { x: 1020, type: 'bench' }, { x: 1640, type: 'bench' }, { x: 1950, type: 'pond' }, { x: 2750, type: 'pond' }, { x: 3330, type: 'bench' }];
var SEED_REPLIES = {};
var FB_VERSION = '10.12.2';
// "Jingle Bells" chorus (James Lord Pierpont, 1857 - public domain), eighth-note grid, -1 = hold
var MELODY = [
  76, -1, 76, -1, 76, -1, -1, -1, 76, -1, 76, -1, 76, -1, -1, -1,
  76, -1, 79, -1, 72, -1, -1, 74, 76, -1, -1, -1, -1, -1, -1, -1,
  77, -1, 77, -1, 77, -1, -1, 77, 77, -1, 76, -1, 76, -1, 76, 76,
  76, -1, 74, -1, 74, -1, 76, -1, 74, -1, -1, -1, 79, -1, -1, -1,
  76, -1, 76, -1, 76, -1, -1, -1, 76, -1, 76, -1, 76, -1, -1, -1,
  76, -1, 79, -1, 72, -1, -1, 74, 76, -1, -1, -1, -1, -1, -1, -1,
  77, -1, 77, -1, 77, -1, 77, -1, 77, -1, 76, -1, 76, -1, 76, 76,
  79, -1, 79, -1, 77, -1, 74, -1, 72, -1, -1, -1, -1, -1, -1, -1
];
var CHORDS = [[48, 64, 67], [48, 64, 67], [48, 64, 67], [48, 64, 67], [53, 65, 69], [48, 64, 67], [50, 66, 69], [43, 62, 67],
  [48, 64, 67], [48, 64, 67], [48, 64, 67], [48, 64, 67], [53, 65, 69], [48, 64, 67], [43, 65, 71], [48, 64, 67]];
var OPTS = {
  species: [['human', '사람'], ['bear', '곰'], ['cat', '고양이'], ['bunny', '토끼'], ['dog', '강아지'], ['fox', '여우'], ['panda', '판다'], ['penguin', '펭귄'], ['frog', '개구리'], ['alien', '외계인'], ['robot', '로봇']],
  fur: [['#A0683E', '갈색'], ['#E8C9A0', '크림'], ['#F4F1EA', '하양'], ['#9A9AA8', '회색'], ['#F29A3A', '주황'], ['#2E2A33', '검정'], ['#F7A8C0', '분홍'], ['#7CC46A', '초록'], ['#A98BE0', '보라'], ['#8FCBE8', '하늘']],
  hair: [['short', '짧은머리'], ['bob', '단발'], ['long', '긴머리'], ['sidepart', '가르마'], ['spiky', '뾰족머리'], ['curly', '곱슬'], ['afro', '아프로'], ['ponytail', '포니테일'], ['twinbuns', '양쪽 똥머리'], ['pigtails', '양갈래'], ['buzz', '까까머리'], ['mohawk', '모히칸'], ['topbun', '정수리 똥머리'], ['hime', '공주 머리'], ['wavy', '웨이브'], ['sideponytail', '옆으로 묶기'], ['none', '머리 없음']],
  hairColor: [['#1F1C1E', '검정'], ['#4A3428', '진갈색'], ['#7A4A2A', '갈색'], ['#B5652F', '주황빛'], ['#D9B26A', '금발'], ['#C9C9D6', '은발'], ['#E07AA8', '분홍'], ['#5B7FD6', '파랑'], ['#3F8F5A', '초록'], ['#8E5BC9', '보라']],
  skin: [['#FBE3CF', '아주 밝은 톤'], ['#F8DCC2', '밝은 톤'], ['#F6D3B5', '복숭아 톤'], ['#E9B98F', '중간 톤'], ['#C98D62', '구릿빛'], ['#8D5A3A', '짙은 톤']],
  eyes: [['dot', '기본'], ['big', '반짝 눈'], ['sparkle', '별빛 눈'], ['heart', '하트 눈'], ['wink', '윙크'], ['happy', '웃는 눈'], ['sleepy', '졸린 눈'], ['glasses', '안경'], ['shades', '선글라스']],
  mouth: [['none', '없음'], ['smile', '미소'], ['open', '활짝'], ['cat', '고양이 입'], ['tongue', '메롱'], ['o', '놀란 입'], ['grin', '이 보이게']],
  cheeks: [['soft', '살짝'], ['big', '발그레'], ['swirl', '홍조'], ['freckles', '주근깨'], ['none', '없음']],
  beard: [['none', '없음'], ['mustache', '콧수염'], ['beard', '턱수염']],
  top: [['tee', '티셔츠'], ['stripe', '줄무늬'], ['jacket', '재킷'], ['collar', '셔츠'], ['hoodie', '후드티'], ['sweater', '니트'], ['xmas', '크리스마스 니트'], ['puffer', '패딩'], ['cardigan', '가디건'], ['overalls', '멜빵'], ['dress', '원피스']],
  topColor: [['#F4A3BE', '분홍'], ['#E5574A', '빨강'], ['#F29A3A', '주황'], ['#F4D35E', '노랑'], ['#7FBF78', '초록'], ['#6FA3DB', '하늘'], ['#2E4A7A', '남색'], ['#B48ED9', '보라'], ['#EDEDF2', '하양'], ['#2E2A33', '검정']],
  bottom: [['pants', '긴바지'], ['shorts', '반바지'], ['skirt', '치마']],
  bottomColor: [['#3D4A6B', '남색'], ['#2E2A33', '검정'], ['#5B4A3A', '갈색'], ['#5A6B8C', '청바지'], ['#7A3B2E', '버건디'], ['#C9C2B0', '베이지']],
  shoes: [['#3A2E2E', '검정'], ['#7A4A2E', '갈색'], ['#E9E9EE', '하양'], ['#C93C3C', '빨강']],
  acc: [['none', '없음'], ['beanie', '털모자'], ['santa', '산타 모자'], ['cap', '야구 모자'], ['headband', '머리띠'], ['bow', '리본'], ['headphones', '헤드폰'], ['earmuffs', '귀마개'], ['scarf', '목도리'], ['flower', '꽃 핀'], ['starclip', '별 핀'], ['ribbonhb', '리본 머리띠'], ['antlers', '루돌프 뿔'], ['catears', '고양이 귀'], ['bunnyears', '토끼 귀'], ['crown', '왕관'], ['halo', '천사 링']],
  hold: [['none', '없음'], ['cocoa', '코코아'], ['gift', '선물 상자'], ['balloon', '풍선'], ['candycane', '지팡이 사탕'], ['sparkler', '불꽃'], ['wand', '별 지팡이']],
  pet: [['none', '없음'], ['cat', '고양이'], ['dog', '강아지'], ['bunny', '토끼'], ['chick', '병아리']],
  petColor: [['#F4F1EA', '하양'], ['#2E2A33', '검정'], ['#F29A3A', '치즈'], ['#9A9AA8', '회색'], ['#8A5A3A', '갈색']],
  accColor: [['#C93C3C', '빨강'], ['#4F86C9', '파랑'], ['#3F8F5A', '초록'], ['#F4D35E', '노랑'], ['#F4A3BE', '분홍'], ['#EDEDF2', '하양'], ['#2E2A33', '검정']]
};
var TABS = [
  { id: 'species', label: '캐릭터', chips: [['species', '종류']], swatches: [['fur', '털·피부 색']] },
  { id: 'hair', label: '머리', chips: [['hair', '머리 모양']], swatches: [['hairColor', '머리 색']] },
  { id: 'face', label: '얼굴', chips: [['eyes', '눈'], ['mouth', '입'], ['cheeks', '볼'], ['beard', '수염']], swatches: [['skin', '피부']] },
  { id: 'clothes', label: '옷', chips: [['top', '상의'], ['bottom', '하의']], swatches: [['topColor', '상의 색'], ['bottomColor', '하의 색'], ['shoes', '신발']] },
  { id: 'acc', label: '소품', chips: [['acc', '소품']], swatches: [['accColor', '소품 색']] },
  { id: 'extra', label: '아이템·펫', chips: [['hold', '손에 들기'], ['pet', '펫']], swatches: [['petColor', '펫 색']] }
];
var DEFAULT_CFG = { hair: 'short', hairColor: '#4A3428', skin: '#F6D3B5', eyes: 'dot', mouth: 'none', beard: 'none', top: 'tee', topColor: '#F4A3BE', bottom: 'pants', bottomColor: '#3D4A6B', shoes: '#3A2E2E', acc: 'none', accColor: '#C93C3C', cheeks: 'soft', hold: 'none', pet: 'none', petColor: '#F4F1EA', species: 'human', fur: '#A0683E' };
var SPECIES_DEFAULT_FUR = { bear: '#A0683E', cat: '#F29A3A', bunny: '#F4F1EA', dog: '#E8C9A0', fox: '#F29A3A', frog: '#7CC46A', alien: '#7CC46A' };
var CH_W = 26, CH_H = 31, CH_OX = 1, CH_OY = 3;
function charShade(hex, amt) {
  var n = parseInt(hex.slice(1), 16);
  var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  function f(v) { return Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt))); }
  return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
}
function charGrid(cfg, pose) {
  var g = [];
  for (var y = 0; y < CH_H; y++) { g.push([]); for (var x = 0; x < CH_W; x++) g[y].push('.'); }
  function set(x, y, c) { var gx = x + CH_OX, gy = y + CH_OY; if (gx >= 0 && gx < CH_W && gy >= 0 && gy < CH_H) g[gy][gx] = c; }
  function get(x, y) { var gx = x + CH_OX, gy = y + CH_OY; return (gx >= 0 && gx < CH_W && gy >= 0 && gy < CH_H) ? g[gy][gx] : '.'; }
  function rect(x0, y0, x1, y1, c) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) set(x, y, c); }
  function pts(list, c) { list.forEach(function (p) { set(p[0], p[1], c); }); }
  function ell(cx, cy, rx, ry, c) { for (var y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (var x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) if (Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2) <= 1) set(x, y, c); }
  var sitting = pose === 'sit';
  var side = pose !== 'front' && !sitting;
  var fs = side ? 1 : 0;
  var hs = cfg.hair;

  // ---------- back layer
  if (hs === 'long') { rect(2, 8, 21, 23, 'h'); rect(3, 24, 20, 24, 'h'); }
  if (hs === 'afro') ell(11.5, 6.5, 12.2, 9.2, 'h');
  if (hs === 'ponytail') { rect(20, 4, 22, 13, 'h'); rect(21, 14, 22, 16, 'h'); }
  if (hs === 'pigtails') { rect(-1, 8, 2, 21, 'h'); rect(21, 8, 24, 21, 'h'); set(-1, 21, '.'); set(24, 21, '.'); }
  if (hs === 'twinbuns') { ell(3, 1.5, 3, 3, 'h'); ell(20, 1.5, 3, 3, 'h'); }
  if (hs === 'topbun') ell(11.5, -1, 3.2, 2.6, 'h');
  if (hs === 'hime') { rect(2, 8, 21, 22, 'h'); }
  if (hs === 'wavy') { rect(2, 8, 21, 21, 'h'); for (var wy = 9; wy <= 21; wy += 3) { set(1, wy, 'h'); set(22, wy + 1, 'h'); } rect(3, 22, 7, 22, 'h'); rect(10, 22, 13, 22, 'h'); rect(16, 22, 20, 22, 'h'); }
  if (hs === 'sideponytail') { rect(-1, 5, 1, 15, 'h'); rect(0, 16, 2, 17, 'h'); }
  if (cfg.top === 'hoodie') rect(7, 15, 16, 17, 'c');

  // ---------- body
  var bottom = cfg.top === 'dress' ? 'skirt' : cfg.bottom;
  var bc = cfg.top === 'dress' ? 'c' : 'p';
  rect(11, 16, 12, 16, 'S');                       // neck
  rect(7, 17, 16, 17, 'c');                        // shoulders
  rect(9, 18, 14, 22, 'c');                        // torso
  rect(6, 18, 7, 19, 'c'); rect(16, 18, 17, 19, 'c');   // sleeves
  rect(6, 20, 7, 21, 's'); rect(16, 20, 17, 21, 's');   // forearms
  rect(6, 22, 7, 22, 'S'); rect(16, 22, 17, 22, 'S');   // hands
  rect(8, 18, 8, 22, 'o'); rect(15, 18, 15, 22, 'o');   // arm separation lines
  if (side && pose !== 'pass') {
    var swing = pose === 'c1' ? 16 : 6;
    rect(swing, 21, swing + 1, 22, '.'); rect(swing, 20, swing + 1, 20, 'S');
  }
  var tp = cfg.top;
  rect(14, 18, 14, 22, 'C'); rect(9, 22, 14, 22, 'C');
  if (tp === 'stripe') { rect(9, 19, 14, 19, 'w'); rect(9, 21, 14, 21, 'w'); rect(6, 19, 7, 19, 'w'); rect(16, 19, 17, 19, 'w'); }
  if (tp === 'jacket') { rect(11, 17, 12, 22, 'w'); pts([[10, 17], [13, 17], [10, 18], [13, 18]], 'C'); }
  if (tp === 'collar') { pts([[10, 17], [13, 17], [10, 18], [13, 18]], 'w'); pts([[11, 19], [11, 21]], 'C'); }
  if (tp === 'hoodie') { rect(10, 21, 13, 21, 'C'); pts([[10, 17], [10, 18], [13, 17], [13, 18]], 'w'); }
  if (tp === 'tee') { pts([[11, 17], [12, 17]], 'S'); }
  if (tp === 'sweater') { for (var kx = 9; kx <= 14; kx += 2) set(kx, 20, 'C'); rect(6, 21, 7, 21, 'c'); rect(16, 21, 17, 21, 'c'); }
  if (tp === 'overalls') { rect(9, 20, 14, 22, 'p'); set(10, 18, 'p'); set(10, 19, 'p'); set(13, 18, 'p'); set(13, 19, 'p'); pts([[10, 20], [13, 20]], 'w'); }
  if (tp === 'dress') { rect(10, 20, 13, 20, 'C'); rect(9, 22, 14, 22, 'c'); }
  if (tp === 'puffer') { rect(10, 16, 13, 16, 'c'); rect(9, 19, 14, 19, 'C'); rect(9, 21, 14, 21, 'C'); rect(6, 19, 7, 19, 'C'); rect(16, 19, 17, 19, 'C'); rect(6, 20, 7, 21, 'c'); rect(16, 20, 17, 21, 'c'); rect(11, 17, 11, 22, 'C'); }
  if (tp === 'xmas') { pts([[9, 18], [11, 18], [13, 18]], 'w'); pts([[10, 20], [11, 19], [11, 20], [12, 20], [11, 21]], 'G'); set(11, 19, 'y'); pts([[9, 22], [11, 22], [13, 22]], 'w'); }
  if (tp === 'cardigan') { rect(11, 17, 12, 22, 'w'); rect(10, 17, 10, 22, 'C'); rect(13, 17, 13, 22, 'C'); pts([[10, 19], [10, 21]], 'w'); rect(6, 21, 7, 21, 'c'); rect(16, 21, 17, 21, 'c'); }

  function legs(l0, ly1, r0, ry1, lsy, rsy) {
    if (bottom === 'skirt') {
      rect(8, 23, 15, 23, bc); rect(7, 24, 16, 24, bc); rect(9, 24, 14, 24, bc === 'c' ? 'C' : 'P');
      rect(l0, 25, l0 + 1, ly1, 's'); rect(r0, 25, r0 + 1, ry1, 's');
    } else {
      rect(9, 23, 14, 23, bc);
      if (bottom === 'shorts') { rect(l0, 24, l0 + 1, 24, bc); rect(r0, 24, r0 + 1, 24, bc); rect(l0, 25, l0 + 1, ly1, 's'); rect(r0, 25, r0 + 1, ry1, 's'); }
      else { rect(l0, 24, l0 + 1, ly1, bc); rect(r0, 24, r0 + 1, ry1, bc); set(l0 + 1, 24, 'P'); set(r0 + 1, 24, 'P'); }
      rect(11, 23, 12, 23, 'P');
    }
    rect(l0 - 1, lsy, l0 + 1, lsy, 'f'); rect(r0, rsy, r0 + 2, rsy, 'f');
  }
  if (sitting) {
    // thighs come toward the viewer, shins hang down, hands rest on the lap
    if (bottom === 'skirt') { rect(7, 23, 16, 24, bc); rect(9, 25, 10, 26, 's'); rect(13, 25, 14, 26, 's'); }
    else {
      rect(8, 23, 15, 24, bc); rect(8, 24, 15, 24, 'P'); rect(11, 23, 12, 24, 'P');
      var shin = bottom === 'shorts' ? 's' : bc;
      rect(9, 25, 10, 26, shin); rect(13, 25, 14, 26, shin);
    }
    rect(8, 27, 10, 27, 'f'); rect(13, 27, 15, 27, 'f');
    rect(6, 22, 7, 22, '.'); rect(16, 22, 17, 22, '.'); rect(7, 22, 8, 22, 'S'); rect(15, 22, 16, 22, 'S');
  }
  else if (!side || pose === 'pass') legs(9, 25, 13, 25, 26, 26);
  else if (pose === 'c1') legs(8, 25, 14, 24, 26, 25);
  else legs(10, 24, 13, 25, 25, 26);

  // ---------- head (big & wide)
  var rows = { 2: [7, 16], 3: [5, 18], 15: [6, 17], 14: [5, 18] };
  for (var hy = 2; hy <= 15; hy++) { var r = rows[hy] || [4, 19]; rect(r[0], hy, r[1], hy, 's'); }
  rect(6, 15, 17, 15, 'S');
  var sp = cfg.species || 'human';
  function muzzle() { rect(9, 12, 14, 14, 'U'); set(9, 14, 's'); set(14, 14, 's'); rect(11, 12, 12, 12, 'e'); }
  if (sp === 'bear' || sp === 'dog') muzzle();
  if (sp === 'fox') { rect(6, 12, 17, 15, 'w'); rect(7, 11, 8, 11, 'w'); rect(15, 11, 16, 11, 'w'); rect(11, 12, 12, 12, 'e'); }
  if (sp === 'cat' || sp === 'bunny') { rect(11, 12, 12, 12, 'q'); }
  if (sp === 'cat') { pts([[4, 12], [5, 12], [4, 14], [5, 13], [18, 12], [19, 12], [18, 13], [19, 14]], 'V'); }
  if (sp === 'penguin') { rect(6, 7, 17, 15, 'w'); rect(5, 9, 18, 13, 'w'); rect(11, 12, 12, 13, 'O'); }
  if (sp === 'panda') { [8, 15].forEach(function (x) { rect(x - 1, 9, x + 1, 12, 'E'); }); rect(11, 12, 12, 12, 'e'); }
  if (sp === 'robot') { rect(5, 8, 18, 12, 'E'); }
  if (sp === 'frog') { rect(8, 13, 15, 13, 'V'); }

  // ---------- face
  var EY = (sp === 'frog' || sp === 'alien' || sp === 'robot') ? 'own' : cfg.eyes;
  var e1 = 8 + fs, e2 = 15 + fs;
  var ey = 10;
  if (EY === 'dot') pts([[e1, ey], [e1, ey + 1], [e2, ey], [e2, ey + 1]], 'e');
  if (EY === 'big') { rect(e1, ey - 1, e1 + 1, ey + 1, 'e'); rect(e2 - 1, ey - 1, e2, ey + 1, 'e'); set(e1, ey - 1, 'w'); set(e2 - 1, ey - 1, 'w'); }
  if (EY === 'happy') pts([[e1 - 1, ey + 1], [e1, ey], [e1 + 1, ey + 1], [e2 - 1, ey + 1], [e2, ey], [e2 + 1, ey + 1]], 'e');
  if (EY === 'sleepy') pts([[e1 - 1, ey + 1], [e1, ey + 1], [e1 + 1, ey + 1], [e2 - 1, ey + 1], [e2, ey + 1], [e2 + 1, ey + 1]], 'e');
  if (EY === 'glasses' || EY === 'shades') {
    [e1 - 2, e2 - 2].forEach(function (lx) {
      rect(lx, ey - 1, lx + 4, ey + 2, 'e');
      if (EY === 'glasses') { rect(lx + 1, ey, lx + 3, ey + 1, 'w'); set(lx + 2, ey, 'e'); set(lx + 2, ey + 1, 'e'); }
      else { set(lx + 1, ey, 'w'); }
    });
    rect(e1 + 3, ey, e2 - 3, ey, 'e');
  }
  if (EY === 'wink') pts([[e1 - 1, ey + 1], [e1, ey], [e1 + 1, ey + 1], [e2, ey], [e2, ey + 1]], 'e');
  if (EY === 'heart') [e1, e2].forEach(function (x) { pts([[x - 1, ey - 1], [x + 1, ey - 1], [x - 1, ey], [x, ey], [x + 1, ey], [x, ey + 1]], 'r'); });
  if (EY === 'sparkle') [e1, e2].forEach(function (x) { rect(x, ey - 1, x + 1, ey + 1, 'e'); set(x, ey - 1, 'w'); set(x + 1, ey + 1, 'Y'); });
  var ck = cfg.cheeks || 'soft';
  if (EY !== 'shades' && EY !== 'glasses') {
    if (ck === 'soft') { rect(e1 - 2, ey + 2, e1 - 1, ey + 2, 'b'); rect(e2 + 1, ey + 2, e2 + 2, ey + 2, 'b'); }
    if (ck === 'big') { rect(e1 - 2, ey + 2, e1, ey + 3, 'b'); rect(e2, ey + 2, e2 + 2, ey + 3, 'b'); }
    if (ck === 'freckles') pts([[e1 - 2, ey + 2], [e1, ey + 2], [e1 - 1, ey + 3], [e2, ey + 2], [e2 + 2, ey + 2], [e2 + 1, ey + 3]], 'S');
    if (ck === 'swirl') { pts([[e1 - 2, ey + 2], [e1 - 1, ey + 2], [e1 - 2, ey + 3]], 'b'); pts([[e2 + 1, ey + 2], [e2 + 2, ey + 2], [e2 + 2, ey + 3]], 'b'); }
  }
  var mx = 11 + fs;
  if (sp === 'panda') { set(e1, ey, 'w'); set(e2, ey, 'w'); }
  if (cfg.mouth === 'smile') { rect(mx, 13, mx + 1, 13, 'm'); }
  if (cfg.mouth === 'open') { rect(mx, 12, mx + 1, 13, 'm'); set(mx, 13, 'M'); }
  if (cfg.mouth === 'cat') pts([[mx - 1, 12], [mx, 13], [mx + 1, 13], [mx + 2, 12]], 'm');
  if (cfg.mouth === 'tongue') { rect(mx, 12, mx + 1, 12, 'm'); set(mx + 1, 13, 'q'); }
  if (cfg.mouth === 'o') { rect(mx, 12, mx + 1, 13, 'M'); }
  if (cfg.mouth === 'grin') { rect(mx - 1, 12, mx + 2, 12, 'm'); rect(mx, 13, mx + 1, 13, 'm'); set(mx, 12, 'w'); set(mx + 1, 12, 'w'); }
  if (cfg.beard === 'mustache') rect(mx - 2, 12, mx + 3, 12, 'd');
  if (cfg.beard === 'beard') { rect(5, 13, 18, 15, 'h'); rect(6, 15, 17, 16, 'h'); pts([[4, 11], [4, 12], [19, 11], [19, 12]], 'h'); rect(mx - 2, 12, mx + 3, 12, 'd'); rect(mx, 13, mx + 1, 13, 'm'); }

  // ---------- front hair
  function cap() { rect(7, 1, 16, 1, 'h'); rect(5, 2, 18, 2, 'h'); rect(3, 3, 20, 7, 'h'); }
  function tips(xs, y) { xs.forEach(function (x) { set(x, y || 8, 'h'); }); }
  function strands(xs) { xs.forEach(function (x) { set(x, 7, 'd'); set(x, 6, 'd'); }); }
  if (hs === 'short') { cap(); rect(3, 8, 4, 11, 'h'); rect(19, 8, 20, 11, 'h'); tips([7, 8, 12, 16]); strands([9, 14]); }
  if (hs === 'bob' || hs === 'long' || hs === 'pigtails') { cap(); rect(2, 4, 2, 15, 'h'); rect(21, 4, 21, 15, 'h'); rect(3, 8, 5, 15, 'h'); rect(18, 8, 20, 15, 'h'); tips([6, 9, 10, 14, 17]); strands([8, 12, 15]); set(2, 15, '.'); set(21, 15, '.'); }
  if (hs === 'sidepart') { cap(); rect(3, 8, 4, 12, 'h'); rect(19, 8, 20, 10, 'h'); rect(5, 8, 13, 8, 'h'); rect(5, 9, 9, 9, 'h'); set(5, 10, 'h'); rect(14, 2, 14, 5, 'd'); strands([16]); }
  if (hs === 'spiky') { cap(); pts([[5, 0], [6, -1], [9, 0], [10, -1], [13, 0], [14, -1], [17, 0], [18, -1], [2, 4], [1, 5], [21, 4], [22, 5], [2, 6], [21, 6]], 'h'); rect(3, 8, 4, 10, 'h'); rect(19, 8, 20, 10, 'h'); tips([5, 6, 9, 10, 13, 14, 17, 18]); set(6, 9, 'h'); set(13, 9, 'h'); strands([8, 12, 16]); }
  if (hs === 'curly') { cap(); pts([[4, 2], [19, 2], [2, 4], [21, 4], [2, 6], [21, 6], [2, 8], [21, 8], [6, 0], [10, 0], [14, 0], [18, 1]], 'h'); rect(3, 8, 4, 11, 'h'); rect(19, 8, 20, 11, 'h'); tips([5, 7, 9, 11, 13, 15, 17, 19]); for (var cx = 5; cx <= 18; cx += 3) set(cx, 5, 'd'); }
  if (hs === 'afro') { rect(4, 3, 19, 6, 'h'); rect(3, 7, 5, 12, 'h'); rect(18, 7, 20, 12, 'h'); tips([7, 11, 15], 7); for (var ax = 3; ax <= 20; ax += 4) { set(ax, 1, 'd'); set(ax + 2, 4, 'd'); } }
  if (hs === 'ponytail') { cap(); rect(3, 8, 4, 11, 'h'); rect(19, 8, 20, 11, 'h'); tips([8, 12, 15]); strands([10, 14]); rect(20, 3, 21, 4, 'k'); }
  if (hs === 'twinbuns') { cap(); rect(3, 8, 4, 11, 'h'); rect(19, 8, 20, 11, 'h'); tips([7, 11, 16]); strands([9, 14]); }
  if (hs === 'topbun') { cap(); rect(3, 8, 4, 11, 'h'); rect(19, 8, 20, 11, 'h'); tips([7, 11, 16]); strands([9, 14]); rect(10, 1, 13, 1, 'k'); }
  if (hs === 'pigtails') { rect(-1, 8, 2, 8, 'k'); rect(21, 8, 24, 8, 'k'); }
  if (hs === 'hime') { cap(); rect(2, 4, 2, 17, 'h'); rect(21, 4, 21, 17, 'h'); rect(3, 8, 20, 8, 'h'); rect(3, 9, 5, 17, 'h'); rect(18, 9, 20, 17, 'h'); strands([7, 11, 16]); }
  if (hs === 'wavy') { cap(); rect(2, 4, 2, 14, 'h'); rect(21, 4, 21, 14, 'h'); rect(3, 8, 5, 14, 'h'); rect(18, 8, 20, 14, 'h'); tips([7, 8, 12, 15, 16]); strands([10, 13]); pts([[1, 10], [22, 12]], 'h'); }
  if (hs === 'sideponytail') { cap(); rect(3, 8, 4, 11, 'h'); rect(19, 8, 20, 11, 'h'); tips([8, 12, 16]); strands([10, 14]); rect(1, 4, 2, 5, 'k'); }
  if (hs === 'buzz') { rect(7, 2, 16, 2, 'h'); rect(5, 3, 18, 5, 'h'); rect(4, 6, 19, 6, 'h'); pts([[4, 7], [19, 7], [4, 8], [19, 8]], 'h'); for (var bx = 5; bx <= 18; bx += 2) set(bx, 4, 'd'); }
  if (hs === 'mohawk') { rect(9, -2, 14, 5, 'h'); rect(4, 4, 19, 6, 'd'); rect(10, -2, 10, 4, 'H'); }

  // ---------- species ears / antennae / special eyes
  if (sp === 'cat' || sp === 'fox') {
    pts([[5, -1], [5, 0], [6, 0], [4, 1], [5, 1], [6, 1], [7, 1], [18, -1], [17, 0], [18, 0], [16, 1], [17, 1], [18, 1], [19, 1]], 's');
    set(5, 0, sp === 'fox' ? 'V' : 'q'); set(18, 0, sp === 'fox' ? 'V' : 'q');
  }
  if (sp === 'bear') { ell(5, 1, 2.2, 2.2, 's'); ell(18, 1, 2.2, 2.2, 's'); set(5, 1, 'U'); set(18, 1, 'U'); }
  if (sp === 'panda') { ell(5, 1, 2.2, 2.2, 'E'); ell(18, 1, 2.2, 2.2, 'E'); }
  if (sp === 'bunny') { rect(7, -2, 9, 2, 's'); rect(14, -2, 16, 2, 's'); rect(8, -1, 8, 1, 'q'); rect(15, -1, 15, 1, 'q'); }
  if (sp === 'dog') { rect(2, 3, 4, 10, 'V'); rect(19, 3, 21, 10, 'V'); set(2, 10, '.'); set(21, 10, '.'); }
  if (sp === 'alien') {
    rect(7, -2, 7, 1, 'V'); rect(16, -2, 16, 1, 'V'); rect(6, -3, 7, -3, 'y'); rect(16, -3, 17, -3, 'y');
    [e1, e2].forEach(function (x, i) { rect(x - 1, 9, x + 1, 12, 'e'); set(i ? x + 1 : x - 1, 9, '.'); set(i ? x + 1 : x - 1, 9, 's'); set(x, 10, 'w'); });
  }
  if (sp === 'frog') { [7, 16].forEach(function (x) { ell(x, 2, 2.4, 2.2, 's'); rect(x - 1, 1, x + 1, 3, 'w'); set(x, 2, 'e'); set(x, 3, 'e'); }); }
  if (sp === 'robot') { rect(11, -2, 12, 1, 'g'); rect(11, -3, 12, -3, 'r'); [e1, e2].forEach(function (x) { rect(x - 1, 9, x, 10, 'y'); }); rect(10, 12, 13, 12, 'y'); rect(3, 8, 3, 11, 'g'); rect(20, 8, 20, 11, 'g'); }
  if (sp === 'penguin') { /* black head drawn via fur color */ }

  // ---------- accessories
  var acc = cfg.acc;
  if (acc === 'beanie') { rect(11, -3, 12, -2, 'w'); rect(8, -1, 15, -1, 't'); rect(6, 0, 17, 0, 't'); rect(4, 1, 19, 3, 't'); for (var rx = 5; rx <= 18; rx += 2) set(rx, 2, 'K'); rect(3, 4, 20, 5, 'T'); }
  if (acc === 'santa') { rect(8, -1, 16, -1, 't'); rect(6, 0, 18, 0, 't'); rect(4, 1, 19, 3, 't'); rect(17, -2, 20, -1, 't'); rect(20, -1, 21, 0, 't'); rect(21, 0, 23, 2, 'w'); rect(3, 4, 20, 5, 'w'); }
  if (acc === 'cap') { rect(7, 0, 16, 0, 't'); rect(5, 1, 18, 4, 't'); rect(3, 5, 21, 5, 'T'); rect(11, 1, 12, 2, 'T'); }
  if (acc === 'headband') { rect(3, 4, 20, 4, 't'); }
  if (acc === 'bow') { rect(15, -2, 21, 1, 't'); rect(17, -2, 18, 1, 'K'); set(15, -2, '.'); set(21, -2, '.'); set(15, 1, '.'); set(21, 1, '.'); }
  if (acc === 'headphones') { rect(6, -1, 17, -1, 't'); rect(4, 0, 5, 0, 't'); rect(18, 0, 19, 0, 't'); rect(3, 1, 3, 7, 't'); rect(20, 1, 20, 7, 't'); rect(0, 8, 2, 12, 't'); rect(21, 8, 23, 12, 't'); }
  if (acc === 'earmuffs') { rect(6, 0, 17, 0, 't'); rect(3, 1, 4, 2, 't'); rect(19, 1, 20, 2, 't'); rect(0, 7, 3, 11, 'T'); rect(20, 7, 23, 11, 'T'); }
  if (acc === 'scarf') { rect(8, 16, 15, 17, 't'); rect(10, 18, 11, 20, 't'); set(10, 20, 'K'); set(11, 20, 'K'); }
  if (acc === 'antlers') { pts([[4, -3], [5, -2], [5, -1], [5, 0], [3, -2], [6, -3], [19, -3], [18, -2], [18, -1], [18, 0], [20, -2], [17, -3]], 'a'); }
  if (acc === 'flower') { pts([[17, 3], [19, 3], [18, 2], [18, 4]], 't'); set(18, 3, 'w'); }
  if (acc === 'catears') { rect(4, 0, 7, 1, 'h'); rect(4, -2, 5, -1, 'h'); set(6, -1, 'h'); set(5, 0, 'q'); rect(16, 0, 19, 1, 'h'); rect(18, -2, 19, -1, 'h'); set(17, -1, 'h'); set(18, 0, 'q'); }
  if (acc === 'bunnyears') { rect(7, -3, 9, 1, 'w'); rect(14, -3, 16, 1, 'w'); rect(8, -2, 8, 0, 'q'); rect(15, -2, 15, 0, 'q'); set(7, -3, '.'); set(16, -3, '.'); }
  if (acc === 'crown') { rect(7, 0, 16, 1, 'y'); pts([[7, -1], [9, -2], [11, -1], [12, -1], [14, -2], [16, -1], [9, -1], [14, -1]], 'y'); set(11, 0, 'r'); set(12, 0, 'r'); pts([[8, 1], [15, 1]], 'Y'); }
  if (acc === 'halo') { rect(8, -3, 15, -3, 'y'); rect(8, -2, 15, -2, 'Y'); pts([[7, -2], [16, -2]], 'y'); }
  if (acc === 'starclip') { pts([[17, 2], [16, 3], [17, 3], [18, 3], [17, 4], [16, 5], [18, 5]], 'y'); }
  if (acc === 'ribbonhb') { rect(3, 4, 20, 4, 't'); rect(15, 1, 19, 3, 't'); rect(17, 1, 17, 3, 'K'); }

  // ---------- held item (right hand) and pet
  var hold = cfg.hold || 'none';
  if (hold === 'cocoa') { rect(17, 19, 19, 22, 'w'); set(20, 20, 'w'); set(20, 21, 'w'); rect(17, 19, 19, 19, 'n'); pts([[17, 17], [18, 16], [19, 17]], 'g'); }
  if (hold === 'gift') { rect(17, 18, 20, 21, 'r'); rect(18, 18, 18, 21, 'y'); rect(17, 19, 20, 19, 'y'); pts([[17, 17], [19, 17]], 'y'); }
  if (hold === 'balloon') { rect(18, 11, 18, 21, 'g'); ell(18.5, 8, 2.6, 3.2, 't'); set(17, 6, 'w'); set(17, 7, 'w'); }
  if (hold === 'candycane') { for (var cy = 16; cy <= 22; cy++) set(18, cy, cy % 2 ? 'r' : 'w'); pts([[19, 15], [20, 15], [21, 16], [21, 17]], 'r'); set(20, 15, 'w'); }
  if (hold === 'sparkler') { rect(18, 17, 18, 22, 'g'); pts([[18, 14], [17, 15], [18, 15], [19, 15], [18, 16], [16, 13], [20, 13], [16, 17], [20, 17]], 'y'); set(18, 15, 'Y'); }
  if (hold === 'wand') { rect(18, 17, 18, 22, 'n'); pts([[18, 13], [17, 14], [18, 14], [19, 14], [18, 15], [16, 14], [20, 14], [17, 16], [19, 16]], 'y'); set(18, 14, 'Y'); }
  var pet = cfg.pet || 'none';
  var PX = 19, PY = 22;
  var petMaps = {
    cat: ['x...x', 'xxxxx', 'xexex', 'xxqxx', 'xx.xx'],
    dog: ['.xxx.', 'zxxxz', 'zexez', 'xxexx', 'xx.xx'],
    chick: ['..y..', '.yyy.', 'yeyey', 'yyOyy', '.O.O.'],
    bunny: ['x.x..', 'x.x..', 'xxxx.', 'xexex', 'xqxxx']
  };
  if (petMaps[pet]) petMaps[pet].forEach(function (row, ry) { for (var rx = 0; rx < row.length; rx++) if (row[rx] !== '.') set(PX + rx, PY + ry, row[rx]); });

  // ---------- shading passes
  // shadow under the bangs and down the cheeks next to the hair
  for (var fy = 7; fy <= 14; fy++) for (var fx = 3; fx <= 20; fx++) {
    if (get(fx, fy) !== 's') continue;
    var up = get(fx, fy - 1), lf = get(fx - 1, fy), rt = get(fx + 1, fy);
    if (up === 'h' || up === 'd' || up === 'H' || lf === 'h' || rt === 'h') set(fx, fy, 'S');
  }
  // hair: darker underside of the bangs, dotted highlight arc
  for (var hx = 0; hx < 24; hx++) for (var hy2 = -2; hy2 <= 16; hy2++) {
    if (get(hx, hy2) === 'h' && get(hx, hy2 + 1) !== 'h' && get(hx, hy2 + 1) !== 'd' && get(hx, hy2 + 1) !== 'H' && hy2 >= 5) set(hx, hy2, 'd');
  }
  [[6, 5], [8, 4], [9, 4], [11, 5], [14, 4], [15, 4], [17, 5], [12, 3]].forEach(function (pt) { if (get(pt[0], pt[1]) === 'h') set(pt[0], pt[1], 'H'); });

  // ---------- outline
  var out = g.map(function (r) { return r.slice(); });
  for (var y2 = 0; y2 < CH_H; y2++) for (var x2 = 0; x2 < CH_W; x2++) {
    if (g[y2][x2] !== '.') continue;
    var nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (d) { var yy = y2 + d[1], xx = x2 + d[0]; return yy >= 0 && yy < CH_H && xx >= 0 && xx < CH_W && g[yy][xx] !== '.' && g[yy][xx] !== 'o'; });
    if (nb) out[y2][x2] = 'o';
  }
  return out;
}
var SPECIES_FUR = { panda: '#F4F1EA', penguin: '#2E3140', robot: '#B8BEC9' };
function CH_FUR(cfg) { var sp = cfg.species || 'human'; if (sp === 'human') return cfg.skin; return SPECIES_FUR[sp] || cfg.fur || '#A0683E'; }
function pixShadow(map, pal, u) {
  var out = [];
  for (var y = 0; y < map.length; y++) for (var x = 0; x < map[y].length; x++) if (pal[map[y][x]]) out.push((x * u) + 'px ' + (y * u) + 'px 0 0.4px ' + pal[map[y][x]]);
  return out.join(', ');
}
function charPalette(cfg) {
  return {
    o: '#1B1719', e: '#1B1719', w: '#FFFFFF', m: '#B5475A', M: '#7A2A3A', b: '#F59C94',
    s: CH_FUR(cfg), S: charShade(CH_FUR(cfg), -0.13), U: charShade(CH_FUR(cfg), 0.55), V: charShade(CH_FUR(cfg), -0.35), E: '#2B2628',
    h: cfg.hairColor, H: charShade(cfg.hairColor, 0.5), d: charShade(cfg.hairColor, -0.3),
    c: cfg.topColor, C: charShade(cfg.topColor, -0.2),
    p: cfg.bottomColor, P: charShade(cfg.bottomColor, -0.28), f: cfg.shoes || '#3A2E2E',
    t: cfg.accColor, T: charShade(cfg.accColor, 0.35), K: charShade(cfg.accColor, -0.25), k: cfg.accColor,
    a: '#8A5A3A', y: '#FFD54A', Y: '#FFF4B8', r: '#E0446A', q: '#F7A8C0', n: '#7A4A2E', g: '#9A9AA8', O: '#F29A3A', G: '#3F8F5A',
    x: cfg.petColor || '#F4F1EA', z: charShade(cfg.petColor || '#F4F1EA', -0.3)
  };
}
function charShadow(grid, pal, p) {
  // each pixel overlaps its neighbours slightly so no hairline gaps show at any zoom
  var spread = p >= 5 ? 0.6 : 0.4;
  var out = [];
  for (var y = 0; y < grid.length; y++) for (var x = 0; x < grid[y].length; x++) {
    var c = grid[y][x];
    if (c !== '.' && pal[c]) out.push((x * p) + 'px ' + (y * p) + 'px 0 ' + spread + 'px ' + pal[c]);
  }
  return out.join(', ');
}
function buildCharacter(cfg, p) {
  var pal = charPalette(cfg);
  return {
    front: charShadow(charGrid(cfg, 'front'), pal, p),
    sit: charShadow(charGrid(cfg, 'sit'), pal, p),
    s1: charShadow(charGrid(cfg, 'c1'), pal, p),
    s2: charShadow(charGrid(cfg, 'pass'), pal, p),
    s3: charShadow(charGrid(cfg, 'c2'), pal, p)
  };
}

class App extends PreactComponent {
  componentDidMount() {
    var self = this;
    this.keys = this.keys || {};
    this.els = this.els || {};
    this.pos = { x: START_X, y: 0, vy: 0, facing: 1, held: false };
    this.last = null;
    if (this.rootEl) {
      this.rootEl.setAttribute('tabindex', '0');
    }
    var step = function (t) { self.tick(t); self.raf = requestAnimationFrame(step); };
    this.raf = requestAnimationFrame(step);
    this.clock = setInterval(function () { self.setState({ now: Date.now() }); }, 1000);
    var touch = false;
    try { touch = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || ('ontouchstart' in window); } catch (err) {}
    this.setState({ isTouch: touch, now: Date.now() });
    this.pos.x = START_X + Math.round((Math.random() - 0.5) * 600);
    this.onStage = function () { VIEW_W = window.STAGE_W || 1280; self.setState({ viewW: VIEW_W, viewH: window.STAGE_H || 800, portrait: !!window.STAGE_PORTRAIT }); };
    window.addEventListener('stageresize', this.onStage);
    this.onStage();
    try {
      var saved = JSON.parse(window.localStorage.getItem('yr_me') || 'null');
      if (saved && saved.nick) {
        if (typeof saved.x === 'number') this.pos.x = saved.x;
        this.pendingPublish = true;
        this.setState({ nick: saved.nick, line: saved.line || '', cfg: Object.assign({}, DEFAULT_CFG, saved.cfg || {}), screen: 'room', started: true, returning: true, px: Math.round(this.pos.x) });
        this.showToast('다시 왔구나! 저장된 캐릭터로 입장했어요');
      }
    } catch (err) {}
    this.initNet();
  }
  componentWillUnmount() {
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.onStage) window.removeEventListener('stageresize', this.onStage);
    if (this.clock) clearInterval(this.clock);
    if (this.musicTimer) clearInterval(this.musicTimer);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    if (this.ac) { try { this.ac.close(); } catch (err) {} }
    if (this.fb && this.myUid) { try { this.fb.D.update(this.fb.D.ref(this.fb.db, 'players/' + this.myUid), { online: false, moving: false }); } catch (err) {} }
  }
  // ---------- sound (WebAudio, synthesized)
  audioInit() {
    if (!this.ac) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ac = new AC();
      this.master = this.ac.createGain(); this.master.gain.value = 0.55; this.master.connect(this.ac.destination);
    }
    if (this.ac.state === 'suspended') this.ac.resume();
    return true;
  }
  tone(freq, when, dur, type, vol, slideTo) {
    var ac = this.ac; if (!ac) return;
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(freq, when);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, when + dur);
    g.gain.setValueAtTime(vol || 0.05, when); g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(g); g.connect(this.master); o.start(when); o.stop(when + dur + 0.02);
  }
  noise(when, dur, vol, cutoff) {
    var ac = this.ac; if (!ac) return;
    var len = Math.max(1, Math.floor(ac.sampleRate * dur)), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    src.buffer = buf; f.type = 'lowpass'; f.frequency.value = cutoff || 1500; g.gain.value = vol || 0.05;
    src.connect(f); f.connect(g); g.connect(this.master); src.start(when);
  }
  sfx(name) {
    if (!this.state || this.state.soundOff || !this.ac) return;
    var t = this.ac.currentTime;
    if (name === 'jump') this.tone(420, t, 0.16, 'square', 0.05, 880);
    if (name === 'step') this.noise(t, 0.06, 0.05, 900);
    if (name === 'snow') this.noise(t, 0.35, 0.05, 2400);
    if (name === 'sit') { this.tone(392, t, 0.1, 'triangle', 0.08); this.tone(523, t + 0.09, 0.14, 'triangle', 0.08); }
    if (name === 'stand') { this.tone(523, t, 0.08, 'triangle', 0.07); this.tone(392, t + 0.07, 0.1, 'triangle', 0.07); }
    if (name === 'shutter') { this.noise(t, 0.12, 0.18, 4000); this.tone(1400, t, 0.05, 'square', 0.04); }
    if (name === 'open') this.tone(660, t, 0.08, 'square', 0.04, 880);
    if (name === 'post') { this.tone(880, t, 0.08, 'triangle', 0.08); this.tone(1175, t + 0.08, 0.16, 'triangle', 0.08); }
  }
  midi(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  bells(when, vol) {
    var ac = this.ac; if (!ac) return;
    var len = Math.floor(ac.sampleRate * 0.09), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    var src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    src.buffer = buf; f.type = 'highpass'; f.frequency.value = 6500; g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(this.master); src.start(when);
  }
  musicStart() {
    var self = this;
    if (!this.audioInit() || this.musicTimer) return;
    this.mStep = 0; this.mNext = this.ac.currentTime + 0.1;
    var eighth = 60 / 120 / 2;
    this.musicTimer = setInterval(function () {
      if (!self.ac) return;
      while (self.mNext < self.ac.currentTime + 0.25) {
        var i = self.mStep % MELODY.length, n = MELODY[i], t = self.mNext;
        var bar = Math.floor(i / 8), inBar = i % 8, ch = CHORDS[bar % CHORDS.length];
        if (n > 0) {
          var len = 1; while (MELODY[(i + len) % MELODY.length] === -1 && len < 8) len++;
          var dur = len * eighth;
          self.tone(self.midi(n), t, dur * 0.92, 'square', 0.022);              // 8-bit lead
          self.tone(self.midi(n), t, dur * 0.92, 'triangle', 0.05);             // soft body
          self.tone(self.midi(n + 12), t, 0.25, 'sine', 0.018);                 // bell sparkle
        }
        if (inBar === 0) self.tone(self.midi(ch[0]), t, eighth * 1.8, 'triangle', 0.07);
        if (inBar === 4) self.tone(self.midi(ch[0] + 7), t, eighth * 1.8, 'triangle', 0.06);
        if (inBar === 2 || inBar === 6) { self.tone(self.midi(ch[1]), t, eighth * 0.8, 'square', 0.012); self.tone(self.midi(ch[2]), t, eighth * 0.8, 'square', 0.012); }
        self.bells(t, inBar % 2 === 0 ? 0.045 : 0.025);                         // sleigh bells
        self.mNext += eighth; self.mStep++;
      }
    }, 50);
  }
  musicStop() { if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; } }
  showToast(text) {
    var self = this;
    this.setState({ toast: text });
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(function () { self.setState({ toast: '' }); }, 2600);
  }
  modalOpen() { var st = this.state || {}; return st.thread != null || !!st.photo || !!st.inviteOpen || !!st.chatOpen; }
  toggleSit() {
    var p = this.pos; if (!p) return;
    if (this.sitting != null) { this.sitting = null; this.sfx('stand'); this.setState({ sitting: null }); return; }
    var me = p.x + 85, best = -1;
    SEATS.forEach(function (seat, i) { if (Math.abs(seat.x - me) < 70) best = i; });
    if (best < 0 || p.y > 0) return;
    this.sitting = best; p.x = SEATS[best].x - 85; this.keys = {};
    this.sfx('sit'); this.setState({ sitting: best, px: Math.round(p.x) });
  }
  openThread(key) { this.keys = {}; this.sfx('open'); this.setState({ thread: key, replyDraft: '' }); }
  photoDate() { var d = new Date((this.state && this.state.now) || Date.now()); return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0'); }
  savePhoto() {
    var self = this, st = this.state || {}, S = this.statics();
    var cfg = Object.assign({}, DEFAULT_CFG, st.cfg || {});
    var px = this.pos ? this.pos.x : START_X, py = this.pos ? this.pos.y : 0, cam = this.camFor(px);
    var canvas = document.createElement('canvas'); canvas.width = 1280; canvas.height = 800;
    var ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false;
    function drawChar(c, left, top, pose) {
      var g = charGrid(c, pose || 'front'), pal = charPalette(c);
      for (var y = 0; y < g.length; y++) for (var x = 0; x < g[y].length; x++) { var k = g[y][x]; if (pal[k]) { ctx.fillStyle = pal[k]; ctx.fillRect(left + x * 5, top + y * 5, 5, 5); } }
    }
    function bubble(text, cx, bottom) {
      ctx.font = '15px Jua, sans-serif';
      var w = Math.min(200, ctx.measureText(text).width + 28), h = 32, x = Math.round(cx - w / 2), y = bottom - h;
      ctx.fillStyle = '#1B1719'; ctx.fillRect(x + 3, y, w - 6, h); ctx.fillRect(x, y + 3, w, h - 6);
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x + 6, y + 3, w - 12, h - 6); ctx.fillRect(x + 3, y + 6, w - 6, h - 12);
      ctx.fillStyle = '#1B1719'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, cx, y + h / 2 + 1, w - 16);
    }
    function nameTag(text, cx, y) {
      ctx.font = '16px Jua, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.lineWidth = 4; ctx.strokeStyle = '#1B1719'; ctx.strokeText(text, cx, y); ctx.fillStyle = '#FFFFFF'; ctx.fillText(text, cx, y);
    }
    function finish() {
      var people = self.roster().filter(function (o) { return o.online; }).map(function (o) { return { x: o.x || 0, y: (o.y || 0) - (o.sitting ? (o.sitType === 'bench' ? 4 : 16) : 0), pose: o.sitting ? 'sit' : 'front', cfg: Object.assign({}, DEFAULT_CFG, o.cfg), name: o.name, line: o.line }; });
      people.push({ x: px, y: py - (self.sitting != null ? (SEATS[self.sitting].type === 'bench' ? 4 : 16) : 0), pose: self.sitting != null ? 'sit' : 'front', cfg: cfg, name: (st.nick || '나').trim() || '나', line: (st.line || '반가워!').trim() || '반가워!' });
      people.forEach(function (pp) {
        var left = Math.round(pp.x - cam + 20), top = Math.round(547 - pp.y);
        if (left < -150 || left > 1300) return;
        drawChar(pp.cfg, left, top, pp.pose);
        nameTag(pp.name, left + 65, top - 4);
        bubble(pp.line, left + 65, top - 30);
      });
      ctx.fillStyle = '#FFF8EA'; ctx.fillRect(0, 0, 1280, 22); ctx.fillRect(0, 0, 22, 800); ctx.fillRect(1258, 0, 22, 800); ctx.fillRect(0, 704, 1280, 96);
      ctx.strokeStyle = '#0E2238'; ctx.lineWidth = 4; ctx.strokeRect(24, 24, 1232, 678);
      ctx.fillStyle = '#0E2238'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.font = '26px Jua, sans-serif'; ctx.fillText('2026 연말 단체사진', 48, 748);
      ctx.font = '15px Jua, sans-serif'; ctx.fillStyle = '#6B5A3A'; ctx.fillText(self.photoDate() + ' · 우리들의 연말 모임방', 48, 776);
      var url = '';
      try { url = canvas.toDataURL('image/png'); } catch (err) { self.showToast('사진을 만들지 못했어요. 화면을 캡처해 주세요'); return; }
      try { var a = document.createElement('a'); a.href = url; a.download = '2026-연말-단체사진.png'; document.body.appendChild(a); a.click(); a.remove(); } catch (err) {}
      self.setState({ photoUrl: url });
    }
    if (!this.bgImg) { this.bgImg = new Image(); this.bgImg.src = 'assets/winter-world.webp'; }
    var img = this.bgImg;
    var draw = function () { var r = img.naturalWidth / 3600; ctx.drawImage(img, cam * r, 0, 1280 * r, img.naturalHeight, 0, -2, 1280, 802); finish(); };
    if (img.complete && img.naturalWidth) draw(); else { img.onload = draw; img.onerror = function () { finish(); }; }
  }

  camFor(x) { return Math.max(0, Math.min(WORLD_W - VIEW_W, x + 85 - VIEW_W / 2)); }
  tick(t) {
    if (this.last === null) { this.last = t; return; }
    var dt = Math.min(0.033, (t - this.last) / 1000);
    this.last = t;
    var k = (this.state && this.state.screen === 'room' && !this.modalOpen()) ? this.keys : {}, p = this.pos, e = this.els;
    var dir = (k.right ? 1 : 0) - (k.left ? 1 : 0);
    if (this.sitting != null) {
      if (dir !== 0 || k.jump) { this.sitting = null; this.sfx('stand'); this.setState({ sitting: null }); }
      else dir = 0;
    }
    p.x = Math.max(0, Math.min(WORLD_W - 170, p.x + dir * 230 * dt));
    if (dir !== 0) p.facing = dir;
    if (k.jump && p.y === 0 && p.vy === 0 && !p.held) { p.vy = 640; p.held = true; }
    if (!k.jump) p.held = false;
    if (p.y > 0 || p.vy > 0) {
      p.vy -= 1800 * dt;
      p.y += p.vy * dt;
      if (p.y <= 0) { p.y = 0; p.vy = 0; }
    }
    var cam = this.camFor(p.x);
    if (e.world) e.world.style.transform = 'translateX(' + (-cam) + 'px)';
    if (e.far) e.far.style.transform = 'translateX(' + (-cam * 0.45) + 'px)';
    if (e.cloud) e.cloud.style.transform = 'translateX(' + (-cam * 0.2) + 'px)';
    if (e.player) e.player.style.left = Math.round(p.x) + 'px';
    if (e.halo) e.halo.style.left = Math.round(p.x + 10) + 'px';
    var drop = this.sitting != null ? (SEATS[this.sitting].type === 'bench' ? 4 : 16) : 0;
    if (e.lift) e.lift.style.transform = 'translateY(' + (drop - Math.round(p.y)) + 'px)';
    if (e.shadow) e.shadow.style.width = Math.max(30, Math.round(70 - p.y * 0.3)) + 'px';

    var S = this.statics(), me = p.x + 85, near = -1;
    this.roster().forEach(function (f, i) { if (f.online && Math.abs((f.x || 0) + 85 - me) < 95) near = i; });
    var moving = dir !== 0, air = p.y > 0;
    this.syncPos(t, moving);
    var tree = -1, lamp = -1, pond = false;
    S.treesW.forEach(function (t, i) { if (me > t.x0 + 10 && me < t.x1 - 10) tree = i; });
    S.lampsW.forEach(function (l, i) { if (Math.abs(l.cx - me) < 130) lamp = i; });
    S.pondsW.forEach(function (r) { if (me > r[0] && me < r[1]) pond = true; });
    var s = this.state || {};
    var jumpedNow = air && !this.wasAir;
    this.wasAir = air;
    if (jumpedNow) this.sfx('jump');
    if (moving && !air && (!this.lastStepT || t - this.lastStepT > 340)) { this.lastStepT = t; this.sfx('step'); }
    var seatNear = -1;
    if (this.sitting == null) SEATS.forEach(function (seat, i) { if (Math.abs(seat.x - me) < 70) seatNear = i; });
    var burst = null;
    if (tree >= 0 && (tree !== this.lastTree || jumpedNow)) { this.burstN = (this.burstN || 0) + 1; burst = { burstTree: tree, burstN: this.burstN }; this.sfx('snow'); }
    this.lastTree = tree;
    if (burst || s.near !== near || s.moving !== moving || s.facing !== p.facing || s.air !== air || s.nearLamp !== lamp || s.onPond !== (pond && !air) || s.seatNear !== seatNear) {
      this.setState(Object.assign({ near: near, moving: moving, facing: p.facing, air: air, nearLamp: lamp, onPond: pond && !air, seatNear: seatNear, px: Math.round(p.x), py: Math.round(p.y) }, burst || {}));
    }
  }
  keyName(e) {
    var key = e.key;
    if (key === 'ArrowLeft') return 'left';
    if (key === 'ArrowRight') return 'right';
    if (key === 'ArrowUp' || key === ' ' || key === 'Spacebar') return 'jump';
    return null;
  }
  // ---------- realtime (Firebase) ----------
  async initNet() {
    var cfg = (typeof window !== 'undefined') ? window.FIREBASE_CONFIG : null;
    if (!cfg || !cfg.apiKey || String(cfg.apiKey).indexOf('YOUR_') === 0) { this.setState({ netMode: 'solo' }); return; }
    try {
      var base = 'https://www.gstatic.com/firebasejs/' + FB_VERSION + '/';
      var mods = await Promise.all([import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-database.js')]);
      var app = mods[0].initializeApp(cfg), auth = mods[1].getAuth(app), db = mods[2].getDatabase(app);
      var self = this;
      this.fb = { db: db, D: mods[2] };
      mods[1].onAuthStateChanged(auth, function (user) { if (user && !self.myUid) { self.myUid = user.uid; self.onSignedIn(); } });
      await mods[1].signInAnonymously(auth);
    } catch (err) {
      console.error('[모임방] 온라인 연결 실패', err);
      this.setState({ netMode: 'error' });
    }
  }
  onSignedIn() {
    var self = this, D = this.fb.D, db = this.fb.db;
    D.onValue(D.ref(db, 'players'), function (snap) { self.setState({ players: snap.val() || {} }); });
    D.onValue(D.ref(db, 'replies'), function (snap) { self.setState({ repliesDb: snap.val() || {} }); });
    D.onValue(D.query(D.ref(db, 'chat'), D.orderByChild('at'), D.limitToLast(40)), function (snap) {
      var val = snap.val() || {}, now = Date.now(), first = !self.chatLoaded;
      if (!self.chatSeen) self.chatSeen = {};
      var arr = Object.keys(val).map(function (id) { return Object.assign({ id: id }, val[id]); })
        .filter(function (m) { return m && m.text; })
        .sort(function (a, b) { return (a.at || 0) - (b.at || 0); });
      arr.forEach(function (m) { if (self.chatSeen[m.id] == null) self.chatSeen[m.id] = first ? 0 : now; });
      self.chatLoaded = true;
      if (!first && arr.length && self.chatSeen[arr[arr.length - 1].id] === now && arr[arr.length - 1].uid !== self.myUid) self.sfx('open');
      self.setState({ chat: arr });
    });
    this.setState({ netMode: 'online', myUid: this.myUid });
    D.get(D.ref(db, 'players/' + this.myUid)).then(function (snap) {
      var me = snap.val();
      if (self.state && self.state.screen === 'room') { self.publishMe(); return; }
      if (!me || !me.name) return;
      if (typeof me.x === 'number' && self.pos) self.pos.x = me.x;
      self.setState({ nick: me.name || '', line: me.line || '', cfg: Object.assign({}, DEFAULT_CFG, me.cfg || {}), returning: true, screen: 'room', started: true, px: Math.round(self.pos ? self.pos.x : START_X) });
      self.publishMe();
      self.showToast('다시 왔구나! 저장된 캐릭터로 입장했어요');
    });
  }
  publishMe() {
    if (!this.fb || !this.myUid) return;
    var st = this.state || {}, D = this.fb.D, r = D.ref(this.fb.db, 'players/' + this.myUid);
    var data = {
      name: (st.nick || '').trim() || '나', line: (st.line || '').trim() || '반가워!',
      cfg: Object.assign({}, DEFAULT_CFG, st.cfg || {}),
      x: Math.round(this.pos.x), y: 0, facing: this.pos.facing || 1, moving: false, sitting: false, sitType: null,
      online: true, updatedAt: D.serverTimestamp()
    };
    var existing = st.players && st.players[this.myUid];
    if (!existing || !existing.createdAt) data.createdAt = D.serverTimestamp();
    D.update(r, data);
    D.onDisconnect(r).update({ online: false, moving: false });
    this.saveLocal();
  }
  saveLocal() {
    var st = this.state || {};
    try { window.localStorage.setItem('yr_me', JSON.stringify({ nick: st.nick || '', line: st.line || '', cfg: Object.assign({}, DEFAULT_CFG, st.cfg || {}), x: Math.round(this.pos ? this.pos.x : START_X) })); } catch (err) {}
  }
  ensureMusic() {
    if (this.musicTimer || (this.state && this.state.soundOff) || !(this.state && this.state.screen === 'room')) return;
    this.audioInit(); this.musicStart();
  }
  syncPos(t, moving) {
    if (!this.fb || !this.myUid || !this.state || this.state.screen !== 'room') return;
    var p = this.pos, sitting = this.sitting != null;
    var sig = Math.round(p.x) + '|' + Math.round(p.y / 6) + '|' + p.facing + '|' + moving + '|' + sitting;
    if (sig === this.lastSig || (this.lastSync && t - this.lastSync < 100)) return;
    this.lastSig = sig; this.lastSync = t;
    if (!moving) this.saveLocal();
    var D = this.fb.D;
    D.update(D.ref(this.fb.db, 'players/' + this.myUid), {
      x: Math.round(p.x), y: Math.round(p.y), facing: p.facing, moving: moving, sitting: sitting,
      sitType: sitting ? SEATS[this.sitting].type : null, online: true, updatedAt: D.serverTimestamp()
    });
  }
  roster() {
    var st = this.state || {}, me = this.myUid, ps = st.players || {}, out = [];
    Object.keys(ps).forEach(function (uid) {
      var o = ps[uid];
      if (uid === me || !o || !o.name || !o.cfg) return;
      out.push(Object.assign({ uid: uid }, o));
    });
    out.sort(function (a, b) { return (a.createdAt || 0) - (b.createdAt || 0); });
    return out;
  }
  charFor(uid, cfg) {
    if (!this._spr) this._spr = {};
    var full = Object.assign({}, DEFAULT_CFG, cfg || {}), key = JSON.stringify(full), hit = this._spr[uid];
    if (!hit || hit.key !== key) { hit = { key: key, ch: buildCharacter(full, 5) }; this._spr[uid] = hit; }
    return hit.ch;
  }
  allReplies() {
    var st = this.state || {}, self = this;
    if (st.netMode !== 'online') return st.replies || {};
    var db = st.repliesDb || {}, out = {};
    Object.keys(db).forEach(function (k) {
      var bucket = db[k] || {};
      out[k] = Object.keys(bucket).map(function (id) { return bucket[id]; }).filter(function (r) { return r && r.text; })
        .sort(function (a, b) { return (a.at || 0) - (b.at || 0); })
        .map(function (r) { return { name: r.name, text: r.text, mine: r.uid === self.myUid }; });
    });
    return out;
  }
  myKey() { return this.myUid || 'me'; }
  recentChat(uid) {
    var list = (this.state && this.state.chat) || [], seen = this.chatSeen || {}, now = Date.now();
    for (var i = list.length - 1; i >= 0; i--) {
      var m = list[i];
      if (m.uid === uid) return (seen[m.id] && now - seen[m.id] < 6000) ? m.text : null;
    }
    return null;
  }
  sendChat(text) {
    var st = this.state || {}, who = (st.nick || '나').trim() || '나';
    if (!this.chatSeen) this.chatSeen = {};
    if (this.fb && this.myUid) {
      var D = this.fb.D;
      D.push(D.ref(this.fb.db, 'chat'), { uid: this.myUid, name: who, text: text, at: D.serverTimestamp() });
    } else {
      var id = 'local' + Date.now();
      this.chatSeen[id] = Date.now();
      this.setState({ chat: (st.chat || []).concat([{ id: id, uid: this.myKey(), name: who, text: text, at: Date.now() }]).slice(-40) });
    }
    this.sfx('post');
  }
  statics() {
    if (this._s) return this._s;
    var P = 7;
    function sprite(map, pal, p) {
      var out = [];
      for (var y = 0; y < map.length; y++) for (var x = 0; x < map[y].length; x++) {
        var ch = map[y][x];
        if (ch !== '.' && pal[ch]) out.push((x * p) + 'px ' + (y * p) + 'px 0 0 ' + pal[ch]);
      }
      return out.join(', ');
    }
    var heads = {
      short: ['....oooooo....', '..oohHHHhhoo..', '.ohhHhhhhhhho.', 'ohhhhhhhhhhhho', 'ohddhhhhhhddho', 'ohhsssssssshho'],
      spiky: ['..o.oo..oo.o..', '.ohohhoohhoho.', '.ohhHHhhhhhho.', 'ohhhhhhhhhhhho', 'ohdhhdhhdhhdho', 'ohssssssssssho'],
      bun: ['.....oooo.....', '....ohHhho....', '..oooohhoooo..', '.ohhHHhhhhhho.', 'ohddhhhhhhddho', 'ohhsssssssshho'],
      beanie: ['.....owwo.....', '...oottttoo...', '.ottTttttttto.', 'otttttttttttto', 'owwwwwwwwwwwwo', 'ohhsssssssshho']
    };
    var faces = {
      plain: ['ohssessssessho', 'ohssessssessho'],
      glasses: ['ohgggsssgggsho', 'ohgegsssgegsho']
    };
    var lowers = {
      short: ['osbssssssssbso', '.osssssssssso.', '..oSSSSSSSSo..', '..occcccccco..', '.osccccccccso.', '.osCccccccCso.', '..oCCCCCCCCo..'],
      long: ['ohbssssssssbho', 'ohhsssssssshho', 'ohhoSSSSSSohho', 'ohhoccccccohho', '.odsccccccsdo.', '.osCccccccCso.', '..oCCCCCCCCo..']
    };
    var legs = ['..oppppppppo..', '...opo..opo...', '..offo..offo..', '..oooo..oooo..'];
    function shade(hex, amt) {
      var n = parseInt(hex.slice(1), 16);
      var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
      function f(v) { return Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt))); }
      return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
    }
    function sprite(map, pal, p) {
      var out = [];
      for (var y = 0; y < map.length; y++) for (var x = 0; x < map[y].length; x++) {
        var ch = map[y][x];
        if (ch !== '.') out.push((x * p) + 'px ' + (y * p) + 'px 0 0 ' + pal[ch]);
      }
      return out.join(', ');
    }
    function make(f) {
      var pal = {
        o: '#1D1B22', e: '#1D1B22', w: '#FFFFFF', f: '#2E2A33', g: '#1D1B22',
        b: '#F2A3A3',
        h: f.hair, H: shade(f.hair, 0.35), d: shade(f.hair, -0.3),
        s: f.skin, S: shade(f.skin, -0.14),
        c: f.shirt, C: shade(f.shirt, -0.2),
        p: f.pants, t: f.hat || '#D64545', T: shade(f.hat || '#D64545', 0.3)
      };
      var map = heads[f.style].concat(faces[f.glasses ? 'glasses' : 'plain'], lowers[f.long ? 'long' : 'short'], legs);
      return sprite(map, pal, P);
    }
    var list = [
      { name: '콩떡', line: '올해 목표: 무사히 살아남기. 성공!', style: 'beanie', hair: '#5A3A2A', skin: '#F6D3B5', shirt: '#E5574A', pants: '#3D4A6B', hat: '#C93C3C', x: 300 },
      { name: '귤', line: '겨울엔 귤 까먹는 게 제일 행복해', style: 'short', long: true, hair: '#B5652F', skin: '#F8DCC2', shirt: '#F29A3A', pants: '#5B4A3A', x: 760 },
      { name: '모모', line: '2027엔 꼭 운전면허 딴다', style: 'spiky', glasses: true, hair: '#2A2730', skin: '#E9B98F', shirt: '#6FA3DB', pants: '#2F3B55', x: 1250 },
      { name: '뭉치', line: '새해엔 일찍 자기... 아마도', style: 'bun', hair: '#6B4A33', skin: '#C98D62', shirt: '#7FBF78', pants: '#4A3F36', x: 2000 },
      { name: '호두', line: '올해 제일 잘한 일: 너네 만난 거', style: 'short', glasses: true, hair: '#1F1C1E', skin: '#F4CFAE', shirt: '#B48ED9', pants: '#3A3550', x: 2500 },
      { name: '젤리', line: '연말 파티 언제 해? 나 시간 많아', style: 'beanie', long: true, hair: '#D9B26A', skin: '#F8DCC2', shirt: '#F4D35E', pants: '#5A6B8C', hat: '#4F86C9', x: 3060 }
    ];
    var friendCfgs = [
      { hair: 'spiky', hairColor: '#4A3428', skin: '#F6D3B5', eyes: 'happy', mouth: 'open', beard: 'none', top: 'hoodie', topColor: '#E5574A', bottom: 'pants', bottomColor: '#3D4A6B', shoes: '#3A2E2E', acc: 'santa', accColor: '#C93C3C' },
      { hair: 'long', hairColor: '#B5652F', skin: '#F8DCC2', eyes: 'dot', mouth: 'smile', beard: 'none', top: 'dress', topColor: '#F29A3A', bottom: 'skirt', bottomColor: '#F29A3A', shoes: '#7A4A2E', acc: 'bow', accColor: '#3F8F5A' },
      { hair: 'sidepart', hairColor: '#1F1C1E', skin: '#E9B98F', eyes: 'glasses', mouth: 'smile', beard: 'none', top: 'collar', topColor: '#6FA3DB', bottom: 'pants', bottomColor: '#2E2A33', shoes: '#3A2E2E', acc: 'none', accColor: '#C93C3C' },
      { hair: 'twinbuns', hairColor: '#7A4A2A', skin: '#C98D62', eyes: 'happy', mouth: 'cat', beard: 'none', top: 'overalls', topColor: '#F4D35E', bottom: 'shorts', bottomColor: '#5B4A3A', shoes: '#E9E9EE', acc: 'earmuffs', accColor: '#F4A3BE' },
      { hair: 'curly', hairColor: '#2A2224', skin: '#F4CFAE', eyes: 'sleepy', mouth: 'smile', beard: 'mustache', top: 'sweater', topColor: '#B48ED9', bottom: 'pants', bottomColor: '#5A6B8C', shoes: '#3A2E2E', acc: 'scarf', accColor: '#F4D35E' },
      { hair: 'pigtails', hairColor: '#D9B26A', skin: '#FBE3CF', eyes: 'dot', mouth: 'open', beard: 'none', top: 'tee', topColor: '#F4D35E', bottom: 'skirt', bottomColor: '#4F86C9', shoes: '#C93C3C', acc: 'antlers', accColor: '#C93C3C' }
    ];
    var friends = []; friendCfgs = [];
    var playerShadow = make({ style: 'short', hair: '#3A2E4A', skin: '#F6D3B5', shirt: '#F4A3BE', pants: '#3D4A6B' });
    var sideHead = ['....oooooo....', '..oohHHHhhoo..', '.ohhHhhhhhhho.', 'ohhhhhhhhhhhho', 'ohhhhhhddsssso', 'ohhhhhdsssssso', 'ohhhhsssssseso', 'ohhhhsssssseso', 'ohhhssssssbsso', '.ohsssssssssso', '..oSSSSSSSSo..'];
    var sideArms = { mid: ['...occcccco...', '...occcCcco...', '...occcscco...', '...oCCCCCCo...'], back: ['...occcccco...', '...oCccccco...', '...osccccco...', '...oCCCCCCo...'], fwd: ['...occcccco...', '...occcccCo...', '...occcccso...', '...oCCCCCCo...'] };
    var sideHip = ['...opppppo....'];
    var sideLegs = { pass: ['....opppo.....', '....offffo....', '....oooooo....'], c1: ['...oPo.opo....', '..offo.offo...', '..oooo.oooo...'], c2: ['...opo.oPo....', '..offo.offo...', '..oooo.oooo...'] };
    var playerPal = { style: 'short', hair: '#3A2E4A', skin: '#F6D3B5', shirt: '#F4A3BE', pants: '#3D4A6B' };
    function palOf(f) {
      return {
        o: '#1D1B22', e: '#1D1B22', w: '#FFFFFF', f: '#2E2A33', g: '#1D1B22', b: '#F2A3A3',
        h: f.hair, H: shade(f.hair, 0.35), d: shade(f.hair, -0.3),
        s: f.skin, S: shade(f.skin, -0.14), c: f.shirt, C: shade(f.shirt, -0.2),
        p: f.pants, P: shade(f.pants, -0.35), t: f.hat || '#D64545', T: shade(f.hat || '#D64545', 0.3)
      };
    }
    function sideFrame(arm, leg) { return sprite(sideHead.concat(sideArms[arm], sideHip, sideLegs[leg]), palOf(playerPal), P); }
    var sideTops = {
      beanie: ['.....owwo.....', '...oottttoo...', '.ottTttttttto.', 'otttttttttttto', 'owwwwwwwwwwwwo'],
      spiky: heads.spiky.slice(0, 4),
      bun: heads.bun.slice(0, 4)
    };
    function buildChar(cfg, p) {
      var pal = palOf(cfg);
      var front = sprite(heads[cfg.style].concat(faces[cfg.glasses ? 'glasses' : 'plain'], lowers[cfg.long ? 'long' : 'short'], legs), pal, p);
      var sh = sideHead.slice();
      var top = sideTops[cfg.style];
      if (top) for (var i = 0; i < top.length; i++) sh[i] = top[i];
      if (cfg.glasses) { sh[6] = 'ohhhhsssgggggo'; sh[7] = 'ohhhhsssggegso'; }
      function fr(arm, leg) { return sprite(sh.concat(sideArms[arm], sideHip, sideLegs[leg]), pal, p); }
      return { front: front, s1: fr('back', 'c1'), s2: fr('mid', 'pass'), s3: fr('fwd', 'c2') };
    }
    var playerSide1 = sideFrame('back', 'c1');
    var playerSide2 = sideFrame('mid', 'pass');
    var playerSide3 = sideFrame('fwd', 'c2');
    var seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    var farW = Math.round(VIEW_W + (WORLD_W - VIEW_W) * 0.45);
    var cloudW = Math.round(VIEW_W + (WORLD_W - VIEW_W) * 0.2);
    function cols(width, w, fn) { var out = []; for (var i = 0; i * w < width; i++) out.push(fn(i * w + w / 2, i)); return out; }
    function q8(v) { return Math.round(v / 8) * 8; }
    var OUT = '#1C2230';

    // sky
    var dotStars = [], crossStars = [];
    for (var a = 0; a < 40; a++) dotStars.push({ x: Math.round(rnd() * 1270), y: 50 + Math.round(rnd() * 270), o: (0.5 + rnd() * 0.5).toFixed(2) });
    for (var a2 = 0; a2 < 16; a2++) crossStars.push({ x: 20 + Math.round(rnd() * 1240), y: 60 + Math.round(rnd() * 250), delay: -(rnd() * 3).toFixed(2) });
    var sunset = cols(cloudW, 8, function (x) {
      var jag = q8(14 + 12 * Math.sin(x / 47) + 8 * Math.sin(x / 13 + 1));
      var h = 110 - Math.max(0, jag);
      return { h: h, a: 16 + (Math.floor(x / 40) % 2) * 8, b: 48 + (Math.floor(x / 64) % 2) * 8 };
    });
    var suns = [{ x: 460 }, { x: 1600 }];
    var sun = sprite(['....yyyy....', '..yyyyyyyy..', '.yyyyyyyyyy.', 'yyyyyyyyyyyy'], { y: '#FFE27A' }, 8);
    var cloudBank = cols(cloudW, 8, function (x) {
      var period = 1150, l = (x % period) / period;
      var env = l < 0.42 ? Math.sin(l / 0.42 * Math.PI) : 0;
      var bumps = 0.6 + 0.4 * Math.abs(Math.sin(x / 38));
      var h = q8(env * 96 * bumps);
      return { h: h, m: Math.max(16, h - 24) };
    });
    var clouds = [];
    for (var ci = 0; ci < 6; ci++) clouds.push({ x: ci * 300 + 80 + Math.round(rnd() * 120), y: 150 + Math.round(rnd() * 120), delay: -Math.round(rnd() * 10) });
    var cloudShadow = sprite(['....wwww....', '..wwwwwwww..', '.wwwwwwwwww.', 'wwwwwwwwwwww', 'llllllllllll'], { w: '#F2F0F7', l: '#A7ADDC' }, 9);

    // far
    function pineRow(width, period, base, amp, seedShift) {
      return cols(width, 8, function (x) {
        var idx = Math.floor((x + seedShift) / period), l = ((x + seedShift) % period) / period;
        var peak = 1 - Math.abs(2 * l - 1);
        var hgt = q8(base + peak * (amp + (idx * 29 % 3) * 10));
        return { h: hgt, cap: peak > 0.78 ? 8 : 0 };
      });
    }
    var pinesBack = pineRow(farW, 40, 40, 60, 0);
    var pinesFront = pineRow(farW, 56, 24, 70, 21);
    var houses = [{ x: 260 }, { x: 980 }, { x: 1560 }, { x: 2120 }];
    var houseShadow = sprite(['...........ooo....', '.....wwwwwwoxo....', '...wwwwwwwwwwwww..', '..wwwwwwwwwwwwwww.', '.owwwwwwwwwwwwwwwo', 'oRRRRRRRRRRRRRRRRo', '.obbbbbbbbbbbbbbo.', '.obbyyybbbbyyybbo.', '.obbyYybbbbyYybbo.', '.obbyyybbbbyyybbo.', '.obbbbbbddbbbbbbo.', '.obbbbbbddbbbbbbo.', '.oooooooooooooooo.'], { o: OUT, w: '#EEF2FA', x: '#6A3A30', R: '#6E2E24', b: '#8B4A36', y: '#FFC94D', Y: '#FFF1A8', d: '#4A2A20' }, 5);
    var field = cols(farW, 16, function (x) { return { h: q8(108 + 14 * Math.sin(x / 160) + 8 * Math.sin(x / 57)) }; });

    // lamps
    var lampHeadMap = ['...oo...', '.oooooo.', 'oooooooo', '.o....o.', '.o....o.', '.o....o.', '.o....o.', 'oooooooo', '..oooo..'];
    var lampHead = sprite(lampHeadMap, { o: '#23232E' }, 4);
    var lamps = [230, 1250, 1900, 2720, 3220].map(function (x) { return { x: x, bx: x - 6, hx: x - 66, hx2: x - 12, gx: x - 2 }; });

    // snowy pine
    var pineRows = ['..........o..........', '.........owo.........', '........owwwo........', '.......owggGwo.......', '.......ogggGGo.......', '......oggggGGGo......', '.......owwwwwo.......', '.....owwgggGGwwo.....', '.....owggggGGGwo.....', '....ogggggggGGGGo....', '....ogggggggGGGGo....', '...oggggggggGGGGGo...', '.....owwwwwwwwwo.....', '...owwggggggGGGwwo...', '..owggggggggGGGGGwo..', '..oggggggggggGGGGGo..', '.ogggggggggggGGGGGGo.', '.ogggggggggggGGGGGGo.', '...owwwwwwwwwwwwwo...', '.owwwgggggggGGGGwwwo.', 'owgggggggggggGGGGGGwo', 'oggggggggggggGGGGGGGo', 'ooooooooooooooooooooo', '........obbbo........', '........obbbo........', '........obbbo........', '........obbbo........', '........ooooo........'];
    var pineShadow = sprite(pineRows, { o: OUT, g: '#2E6B4B', G: '#235640', w: '#EEF2FA', b: '#7A4A2E' }, 6);
    var pines = [{ x: -40 }, { x: 1440 }, { x: 2560 }, { x: 3470 }].map(function (t) { return { x: t.x, y: 692 - pineRows.length * 6 }; });

    // big snowy tree
    function bigTreeMap() {
      var W = 30, H = 31;
      var blobs = [[15, 6, 6], [8, 10, 6], [22, 10, 6], [10, 15, 6.5], [20, 15, 6.5], [15, 12, 7]];
      var fill = [];
      for (var y = 0; y < 22; y++) { fill.push([]); for (var x = 0; x < W; x++) { var on = 0; blobs.forEach(function (b) { if (Math.pow(x - b[0], 2) + Math.pow(y - b[1], 2) <= b[2] * b[2]) on = 1; }); fill[y].push(on); } }
      var rows = [];
      for (var y2 = 0; y2 < H; y2++) {
        var r = '';
        for (var x2 = 0; x2 < W; x2++) {
          var f = y2 < 22 && fill[y2][x2];
          if (f) {
            var up = y2 > 0 && fill[y2 - 1][x2], dn = y2 < 21 && fill[y2 + 1][x2];
            if (!up || !dn || !fill[y2][x2 - 1] || !fill[y2][x2 + 1]) { r += 'o'; continue; }
            var up2 = y2 > 1 && fill[y2 - 2][x2], up3 = y2 > 2 && fill[y2 - 3][x2];
            if (!up2 || (!up3 && (x2 + y2) % 2 === 0)) { r += 'w'; continue; }
            if ((x2 * 7 + y2 * 3) % 11 === 0 && y2 > 6) { r += 'w'; continue; }
            r += (x2 > 18 && y2 > 9) || y2 > 17 ? 'G' : ((x2 + y2) % 5 === 0 ? 'L' : 'g');
            continue;
          }
          var flare = y2 >= 27 ? Math.min(3, y2 - 26) : 0, lo = 12 - flare, hi = 17 + flare;
          if (y2 >= 16 && x2 >= lo && x2 <= hi) { r += (x2 === lo || x2 === hi || y2 === H - 1) ? 'o' : (x2 >= hi - 1 ? 'B' : 'b'); continue; }
          r += '.';
        }
        rows.push(r);
      }
      return rows;
    }
    var bigTreeRows = bigTreeMap();
    var bigTreeShadow = sprite(bigTreeRows, { o: OUT, g: '#2F7A4A', G: '#25603D', L: '#3F9157', w: '#EEF2FA', b: '#7A4A2E', B: '#5E3722' }, 7);
    var bigTreeW = 30 * 7, bigTreeH = bigTreeRows.length * 7;
    var bigTrees = [{ x: 720 }, { x: 2180 }, { x: 3020 }].map(function (t) { return { x: t.x, y: 692 - bigTreeH }; });
    var treeWire = [], treeBulbs = [];
    [[50, 70, 170, 56, 22], [64, 112, 160, 100, 20]].forEach(function (arc, ai) {
      var x0 = arc[0], y0 = arc[1], x1 = arc[2], y1 = arc[3], sag = arc[4];
      for (var i = 0; i <= 24; i++) {
        var tt = i / 24, x = x0 + (x1 - x0) * tt, y = y0 + (y1 - y0) * tt + sag * 4 * tt * (1 - tt);
        treeWire.push({ x: Math.round(x / 4) * 4, y: Math.round(y / 4) * 4 });
        if (i % 6 === 3) treeBulbs.push({ x: Math.round(x / 4) * 4 - 5, y: Math.round(y / 4) * 4 - 2, delay: -((i * 0.3 + ai * 0.7) % 1.8).toFixed(2) });
      }
    });

    // fences
    var fences = [{ x: 1320, n: 8 }, { x: 3330, n: 10 }].map(function (f) {
      var pk = [];
      for (var i = 0; i < f.n; i++) pk.push({ x: f.x + i * 30, sx: f.x + i * 30 - 2 });
      return { x: f.x, w: f.n * 30 - 8, pickets: pk };
    });

    // bushes and lanterns
    var bushShadow = sprite(['.....ooo..ooo.....', '...oowwwoowwwoo...', '..owwwwwwwwwwwwo..', '.owwgwwwggwwwgwwo.', 'oggggrggggggrggggo', 'ogrgggggrgggggrggo', 'oGgggGggggGggggGgo', '.oGGGGGGGGGGGGGGo.', '..oooooooooooooo..'], { o: OUT, g: '#2E6B4B', G: '#22533B', w: '#EEF2FA', r: '#D8423A' }, 5);
    var bushes = [];
    seed = 41;
    for (var bx = 40; bx < WORLD_W - 60; bx += 200 + Math.round(rnd() * 120)) bushes.push({ x: bx });
    var lanternShadow = sprite(['...oo...', '..oooo..', '.oooooo.', '.oyyyyo.', '.oyYYyo.', '.oyYYyo.', '.oyyyyo.', '.oooooo.', 'oooooooo'], { o: '#23232E', y: '#FFC94D', Y: '#FFF1A8' }, 5);
    var lanterns = [{ x: 1010 }, { x: 1780 }, { x: 2960 }];

    // ground
    var snowTop = cols(WORLD_W, 8, function (x, i) { return { h: (i % 5 === 0 || i % 7 === 0) ? 8 : (i % 3 === 0 ? 4 : 0) }; });
    var starMap = ['..y..', '.yyy.', 'yyyyy', '.yyy.', 'y...y'];
    var flowerMap = ['.w.', 'wyw', '.w.'];
    var dStar = sprite(starMap, { y: '#5E2F1C' }, 4);
    var dFlower = sprite(flowerMap, { w: '#FFFFFF', y: '#F7C64F' }, 4);
    var dirtDeco = cols(WORLD_W, 64, function (x, i) { return { x: x - 10, shadow: i % 2 ? dStar : dFlower }; });
    var ponds = [{ x: 560, w: 520 }, { x: 2440, w: 420 }].map(function (p) {
      var lines = [], glints = [];
      for (var i = 0; i < 12; i++) lines.push({ x: p.x + 20 + Math.round(rnd() * (p.w - 80)), y: 740 + Math.round(rnd() * 50), w: 16 + Math.round(rnd() * 3) * 8 });
      for (var g = 60; g < p.w - 40; g += 100) glints.push({ x: p.x + g, delay: -((g / 100) * 0.4).toFixed(2) });
      return { x: p.x, w: p.w, lines: lines, glints: glints };
    });

    var flakes = [];
    for (var j = 0; j < 30; j++) flakes.push({ x: (j * 97 + 13) % 1270, s: (j % 3 === 0) ? 6 : 4, delay: -((j * 1.37) % 12), dur: 11 + (j % 5) });


    // ---- overlays mapped from the scene image (1536x1024) onto the 3-tile world
    var SX = 1200 / 1536, SY = 802 / 1024;
    function tiles(x) { return [x * SX, 2400 - x * SX, 2400 + x * SX]; }
    var starPts = [[395,27,6],[781,37,6],[1345,37,6],[99,44,14],[1086,46,15],[550,68,6],[292,75,6],[1252,75,6],[1478,79,15],[927,81,6],[693,109,15],[460,120,14],[1404,120,6],[51,125,6],[1185,137,6],[173,145,14],[349,176,6],[1022,184,6],[72,224,6],[1107,235,14],[1490,231,6],[506,240,6],[394,279,14],[1445,299,13],[1223,301,6],[57,322,6],[301,337,6],[1059,353,6],[496,378,6]];
    var starsW = [];
    seed = 77;
    starPts.forEach(function (pt) {
      tiles(pt[0]).forEach(function (X) {
        var big = pt[2] > 10, sz = big ? 6 : 4;
        starsW.push({ x: Math.round(X - sz / 2), y: Math.round(pt[1] * SY - sz / 2), s: sz, g: big ? 10 : 6, g2: big ? 3 : 1, delay: -(rnd() * 4).toFixed(2), dur: (2 + rnd() * 3).toFixed(2) });
      });
    });
    var cloudDefs = [{ x: 128, y: 220, w: 131, h: 66, src: 'assets/cloud-a.png' }, { x: 1277, y: 178, w: 125, h: 62, src: 'assets/cloud-b.png' }];
    var cloudsW = [];
    cloudDefs.forEach(function (c, ci) {
      var w = Math.round(c.w * SX), h = Math.round(c.h * SY), y = Math.round(c.y * SY);
      [[c.x * SX, 1], [2400 - (c.x + c.w) * SX, -1], [2400 + c.x * SX, 1]].forEach(function (t, ti) {
        cloudsW.push({ x: Math.round(t[0]), y: y, w: w, h: h, src: c.src, flip: t[1], delay: -(ci * 7 + ti * 5), dur: 20 + ci * 6 + ti * 3 });
      });
    });
    var smokeW = [];
    tiles(282).forEach(function (X, ti) {
      [0, 0.9, 1.8].forEach(function (d, k) { smokeW.push({ x: Math.round(X - 4 + k * 2), y: Math.round(588 * SY), s: 8 + k * 2, delay: -(d + ti * 0.3).toFixed(2) }); });
    });
    var windowsW = [];
    [[324, 664], [1103, 662]].forEach(function (w, wi) { tiles(w[0]).forEach(function (X, ti) { windowsW.push({ x: Math.round(X - 13), y: Math.round(w[1] * SY - 11), delay: -(wi * 1.3 + ti * 0.7).toFixed(2) }); }); });
    var lampPts = [[199, 628], [616, 630], [1318, 628]];
    var lampsW = [];
    lampPts.forEach(function (l, li) { tiles(l[0]).forEach(function (X, ti) { lampsW.push({ cx: Math.round(X), x: Math.round(X - 85), y: Math.round(l[1] * SY - 85), delay: -(li * 0.8 + ti * 0.5).toFixed(2) }); }); });
    var bulbsW = [];
    [[765, 657, 30], [872, 617, 30], [815, 705, 30], [883, 688, 30], [662, 851, 60]].forEach(function (b, bi) {
      tiles(b[0]).forEach(function (X, ti) { bulbsW.push({ x: Math.round(X - b[2] / 2), y: Math.round(b[1] * SY - b[2] / 2), s: b[2], delay: -(bi * 0.37 + ti * 0.2).toFixed(2) }); });
    });
    var glintsW = [];
    [[264, 945], [363, 940], [541, 945], [650, 940]].forEach(function (g, gi) { tiles(g[0]).forEach(function (X, ti) { glintsW.push({ x: Math.round(X - 13), y: Math.round(g[1] * SY), delay: -(gi * 0.4 + ti * 0.3).toFixed(2) }); }); });
    var pondsW = [];
    [[188, 708]].forEach(function (pr) {
      [[pr[0] * SX, pr[1] * SX], [2400 - pr[1] * SX, 2400 - pr[0] * SX], [2400 + pr[0] * SX, 2400 + pr[1] * SX]].forEach(function (r) { pondsW.push(r); });
    });
    var treeBoxes = [[650, 510, 985, 770], [0, 525, 112, 770], [1366, 535, 1536, 770]];
    var treesW = [];
    seed = 99;
    treeBoxes.forEach(function (b) {
      [[b[0] * SX, b[2] * SX], [2400 - b[2] * SX, 2400 - b[0] * SX], [2400 + b[0] * SX, 2400 + b[2] * SX]].forEach(function (r) {
        var x0 = r[0], x1 = r[1], top = b[1] * SY, bottom = b[3] * SY, fl = [];
        for (var i = 0; i < 16; i++) {
          var fy = top + 20 + rnd() * (bottom - top - 40);
          fl.push({ x: Math.round(x0 + 10 + rnd() * (x1 - x0 - 20)), y: Math.round(fy), s: rnd() < 0.4 ? 8 : 5, fall: Math.round(690 - fy + rnd() * 10), drift: Math.round((rnd() - 0.5) * 50), delay: (rnd() * 0.35).toFixed(2) });
        }
        treesW.push({ x0: x0, x1: x1, flakes: fl });
      });
    });
    var skyFlakes = [];
    for (var sfi = 0; sfi < 30; sfi++) skyFlakes.push({ x: (sfi * 97 + 13) % 1270, s: (sfi % 3 === 0) ? 6 : 4, delay: -((sfi * 1.37) % 12), dur: 11 + (sfi % 5) });
    var benchG = [];
    for (var by = 0; by < 15; by++) { benchG.push([]); for (var bx2 = 0; bx2 < 32; bx2++) benchG[by].push('.'); }
    function bset(x0, y0, x1, y1, c) { for (var yy = y0; yy <= y1; yy++) for (var xx = x0; xx <= x1; xx++) benchG[yy + 1][xx + 1] = c; }
    bset(3, 0, 4, 9, 'n'); bset(25, 0, 26, 9, 'n');
    bset(1, 1, 28, 2, 'b'); bset(1, 4, 28, 5, 'b'); bset(1, 2, 28, 2, 'B'); bset(1, 5, 28, 5, 'B');
    bset(5, 0, 24, 0, 'w');
    bset(0, 7, 29, 8, 'b'); bset(0, 9, 29, 9, 'B'); bset(2, 6, 27, 6, 'w');
    bset(2, 10, 3, 12, 'n'); bset(26, 10, 27, 12, 'n');
    var benchO = benchG.map(function (r) { return r.slice(); });
    for (var oy = 0; oy < 15; oy++) for (var ox = 0; ox < 32; ox++) if (benchG[oy][ox] === '.' && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (d) { var yy = oy + d[1], xx = ox + d[0]; return yy >= 0 && yy < 15 && xx >= 0 && xx < 32 && benchG[yy][xx] !== '.'; })) benchO[oy][ox] = 'o';
    var benchRows = benchO.map(function (r) { return r.join(''); });
    var bpal = { o: '#1B1719', b: '#B07A4A', B: '#8A5A34', n: '#6B4226', w: '#F4F7FF' };
    var benchShadow = pixShadow(benchRows, bpal, 4);
    var benchFront = pixShadow(benchRows.map(function (r, i) { return i >= 7 && i <= 11 ? r : r.replace(/./g, '.'); }), bpal, 4);

    this._s = {
      benchShadow: benchShadow, benchFront: benchFront,
      friendCfgs: friendCfgs,
      buildChar: buildChar,
      friends: friends, playerShadow: playerShadow, playerSide1: playerSide1, playerSide2: playerSide2, playerSide3: playerSide3,
      dotStars: dotStars, crossStars: crossStars, sunset: sunset, suns: suns, sun: sun, cloudBank: cloudBank, clouds: clouds, cloudShadow: cloudShadow, cloudW: cloudW,
      pinesBack: pinesBack, pinesFront: pinesFront, houses: houses, houseShadow: houseShadow, field: field, farW: farW,
      lamps: lamps, lampHead: lampHead, pines: pines, pineShadow: pineShadow, pineRows: pineRows,
      bigTrees: bigTrees, bigTreeShadow: bigTreeShadow, bigTreeW: bigTreeW, bigTreeH: bigTreeH, bigTreeRows: bigTreeRows, treeWire: treeWire, treeBulbs: treeBulbs,
      fences: fences, bushes: bushes, bushShadow: bushShadow, lanterns: lanterns, lanternShadow: lanternShadow,
      snowTop: snowTop, dirtDeco: dirtDeco, ponds: ponds, flakes: skyFlakes,
      starsW: starsW, cloudsW: cloudsW, smokeW: smokeW, windowsW: windowsW, lampsW: lampsW, bulbsW: bulbsW, glintsW: glintsW, pondsW: pondsW, treesW: treesW
    };
    return this._s;
  }
  renderVals() {
    var self = this;
    if (!this.keys) this.keys = {};
    if (!this.els) this.els = {};
    var st = this.state || {};
    var S = this.statics();
    var accent = this.props.accent ?? '#FFD54A';
    var px = st.px ?? START_X, py = st.py ?? 0;
    var cam = this.camFor(px);
    function tailFor(fill) {
      var map = ['owwwo', 'owwo', 'owo', 'oo', 'o'], out = [];
      for (var ty = 0; ty < map.length; ty++) for (var tx = 0; tx < map[ty].length; tx++) out.push((tx * 3) + 'px ' + (ty * 3) + 'px 0 0.4px ' + (map[ty][tx] === 'o' ? '#1B1719' : fill));
      return out.join(', ');
    }
    var tailWhite = tailFor('#FFFFFF'), tailAccent = tailFor(accent);
    var replies = this.allReplies();
    var roster = this.roster();
    var friends = roster.map(function (o, i) {
      var near = st.near === i;
      var rl = replies[o.uid] || [];
      var ch = self.charFor(o.uid, o.cfg);
      var walking = !!o.moving && !o.sitting && !!o.online;
      var fx = Math.round(typeof o.x === 'number' ? o.x : START_X);
      var said = self.recentChat(o.uid);
      var f = { name: o.name, line: said || o.line || '반가워!', saying: !!said, x: fx, delay: (i % 3) * 0.4,
        shadow: o.sitting ? ch.sit : ch.front, s1: ch.s1, s2: ch.s2, s3: ch.s3, walking: walking, still: !walking,
        bodyCls: walking ? 'walk' : (o.sitting || (o.y || 0) > 0 ? 'still' : 'bob'), flip: o.facing || 1,
        dy: (o.sitting ? (o.sitType === 'bench' ? 4 : 16) : 0) - Math.round(o.y || 0),
        op: 1, nameText: o.online ? o.name : o.name + ' · 자리 비움' };
      return Object.assign(f, { open: function () { self.openThread(o.uid); }, hasReplies: rl.length > 0, replyCount: rl.length, hx: fx + 10, bubbleBg: f.saying ? '#FFF3C4' : (near ? accent : '#FFFFFF'), tail: near ? tailAccent : tailWhite, lift: near ? -6 : 0 });
    });
    var started = !!st.started;
    var screen = st.screen || 'entry';
    var cfg = Object.assign({}, DEFAULT_CFG, st.cfg || {});
    var nick = st.nick ?? '', line = st.line ?? '';
    var key = JSON.stringify(cfg);
    if (this._charKey !== key) {
      this._charKey = key;
      this._char = { room: buildCharacter(cfg, 5), big: buildCharacter(cfg, 8), mini: buildCharacter(cfg, 2.5) };
    }
    var ch = this._char;
    function setCfg(k, v) { return function () {
      var c = Object.assign({}, DEFAULT_CFG, self.state.cfg || {}); c[k] = v;
      if (k === 'species') {
        if (v === 'human') { if (c.hair === 'none') c.hair = 'short'; }
        else { c.hair = 'none'; if (SPECIES_DEFAULT_FUR[v]) c.fur = SPECIES_DEFAULT_FUR[v]; }
      }
      self.setState({ cfg: c });
    }; }
    function chipGroup(label, k) {
      return { label: label, items: OPTS[k].map(function (o) { var on = cfg[k] === o[0]; return { label: o[1], pick: setCfg(k, o[0]), pressed: on ? 'true' : 'false', bg: on ? accent : '#FFFFFF', sh: on ? '#0E2238' : '#B8C2D6' }; }) };
    }
    function swatchGroup(label, k) {
      return { label: label, items: OPTS[k].map(function (o) { var on = cfg[k] === o[0]; return { color: o[0], name: label + ' ' + o[1], pick: setCfg(k, o[0]), pressed: on ? 'true' : 'false', ring: on ? '3px solid #0E2238' : '0px solid transparent' }; }) };
    }
    function focusStage() { setTimeout(function () { if (self.rootEl) { try { self.rootEl.focus({ preventScroll: true }); } catch (err) {} } }, 30); }
    function setRef(name) { return function (el) { self.els[name] = el; }; }
    var vals = {
      accent: accent, friends: friends,
      worldW: WORLD_W, camWorld: -cam, camFar: -cam * 0.45, camCloud: -cam * 0.2,
      count: roster.filter(function (o) { return o.online; }).length + 1,
      px: px, py: py,
      facing: st.facing ?? 1,
      bodyCls: st.air ? 'still' : (st.moving ? 'walk' : 'bob'),
      showSide: !!(st.moving || st.air) && st.sitting == null, showFront: !(st.moving || st.air) || st.sitting != null,
      frame1: st.air ? 'on' : 'f1', frame2: st.air ? 'off' : 'f2', frame3: st.air ? 'off' : 'f3',
      showDust: !!(st.moving && !st.air),
      shadowW: Math.max(30, Math.round(70 - py * 0.3)),
      started: started, notStarted: !started,
      tailWhite: tailWhite,
      benchShadow: S.benchShadow, benchFront: S.benchFront,
      benchesW: SEATS.map(function (seat, i) { return { left: seat.x - 64, active: st.sitting === i, bench: seat.type === 'bench' }; }).filter(function (b) { return b.bench; }),
      miniFront: ch.mini.front,
      friendCount: roster.length, noFriends: roster.length === 0,
      dday: (function () { var now = new Date(), ny = new Date(now.getFullYear() + 1, 0, 1); var d = Math.ceil((ny - now) / 86400000); return now.getMonth() === 0 && now.getDate() === 1 ? 'HAPPY NEW YEAR' : 'D-' + d; })(),
      garland: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(function (i) { return { c: ['#FFE066', '#FF8A7A', '#9BE38C', '#8FCBE8'][i % 4], d: -((i * 0.37) % 1.6).toFixed(2) }; }),
      hollyShadow: pixShadow(['.gg...gg.', 'ggggrgggg', '.gggrrgg.', '..g.rr.g.'], { g: '#3F8F5A', r: '#E0446A' }, 4),
      stampTree: pixShadow(['...y...', '..ggg..', '.ggrgg.', 'ggggggg', '.gyggrg', 'ggggggg', '...b...'], { y: '#FFD54A', g: '#3F8F5A', r: '#E0446A', b: '#7A4A2E' }, 4), haloX: px + 10, haloOpacity: this.props.halo ?? 0.35,
      isEntry: screen === 'entry', isCustom: screen === 'custom', inRoom: screen === 'room',
      nick: nick, line: line, nickCount: Array.from(nick).length, lineCount: Array.from(line).length,
      entryError: !!st.entryError,
      myName: nick.trim() || '나', myLine: line.trim() || '반가워!',
      bigFront: ch.big.front, miniSide1: ch.mini.s1, miniSide2: ch.mini.s2, miniSide3: ch.mini.s3,
      previewStars: [{ x: 30, y: 150, d: 0 }, { x: 290, y: 120, d: -1 }, { x: 60, y: 300, d: -2 }, { x: 300, y: 260, d: -0.5 }, { x: 250, y: 190, d: -1.6 }, { x: 40, y: 220, d: -2.4 }],
      tabs: TABS.map(function (t) { var on = (st.tab || 'species') === t.id; return { label: t.label, pick: function () { self.setState({ tab: t.id }); }, pressed: on ? 'true' : 'false', bg: on ? '#0E2238' : '#FFFFFF', fg: on ? '#FFFFFF' : '#0E2238' }; }),
      chipGroups: (TABS.filter(function (t) { return t.id === (st.tab || 'species'); })[0]).chips.map(function (c) { return chipGroup(c[1], c[0]); }),
      swatchGroups: (TABS.filter(function (t) { return t.id === (st.tab || 'species'); })[0]).swatches.map(function (c) { return swatchGroup(c[1], c[0]); }),
      onNick: function (e) { self.setState({ nick: Array.from(e.target.value).slice(0, 8).join(''), entryError: false }); },
      onLine: function (e) { self.setState({ line: Array.from(e.target.value).slice(0, 24).join('') }); },
      onEntryKey: function (e) { if (e.key === 'Enter' && !(e.nativeEvent && e.nativeEvent.isComposing)) { e.preventDefault(); vals.goCustom(); } },
      goCustom: function () {
        var n = (self.state && self.state.nick || '').trim();
        if (!n) { self.setState({ entryError: true }); return; }
        self.keys = {};
        self.setState({ screen: 'custom' });
      },
      goEntry: function () { self.setState({ screen: 'entry' }); },
      randomize: function () {
        function pick(k) { var o = OPTS[k]; return o[Math.floor(Math.random() * o.length)][0]; }
        var c = {}; Object.keys(OPTS).forEach(function (k) { c[k] = pick(k); });
        self.setState({ cfg: c });
      },
      enterRoom: function () { self.setState({ screen: 'room', started: true }); focusStage(); },
      refWorld: setRef('world'), refFar: setRef('far'), refCloud: setRef('cloud'),
      refPlayer: setRef('player'), refHalo: setRef('halo'), refLift: setRef('lift'), refShadow: setRef('shadow'),
      setRoot: function (el) { self.rootEl = el; },
      start: function () { self.setState({ started: true }); if (self.rootEl) self.rootEl.focus(); },
      onKeyDown: function (e) {
        if (!self.state || self.state.screen !== 'room') return;
        self.ensureMusic();
        if (e.target && e.target.tagName === 'INPUT') return;
        if (e.key === 'Escape') { if (self.state.chatOpen) vals.closeChat(); else if (self.state.thread != null) vals.closeThread(); else if (self.state.photo) vals.closePhoto(); else if (self.state.inviteOpen) vals.closeInvite(); return; }
        if (self.modalOpen()) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); self.toggleSit(); return; }
        if (e.key === 'Enter') { e.preventDefault(); vals.openChat(); return; }
        var n = self.keyName(e);
        if (!n) return;
        e.preventDefault();
        self.keys[n] = true;
        if (!(self.state && self.state.started)) self.setState({ started: true });
      },
      onKeyUp: function (e) {
        if (!self.state || self.state.screen !== 'room') return;
        var n = self.keyName(e);
        if (!n) return;
        e.preventDefault();
        self.keys[n] = false;
      },
      onBlur: function (e) {
        var to = e && e.relatedTarget;
        if (to && self.rootEl && self.rootEl.contains(to)) return;
        self.keys = {};
      },
      focusRoot: function () {
        if (!self.state || self.state.screen !== 'room') return;
        self.ensureMusic();
        if (self.rootEl && document.activeElement !== self.rootEl) {
          try { self.rootEl.focus({ preventScroll: true }); } catch (err) {}
        }
      }
    };
    vals.treesW = S.treesW.map(function (t, i) { return { flakes: t.flakes, cls: st.burstTree === i ? (st.burstN % 2 ? 'dropA' : 'dropB') : 'idle' }; });
    vals.lampsW = S.lampsW.map(function (l, i) { return Object.assign({}, l, { op: st.nearLamp === i ? 1 : 0.55 }); });
    vals.onPond = !!st.onPond && st.sitting == null;
    // responsive stage
    vals.viewW = VIEW_W;
    vals.flakes = (S.flakes || []).map(function (f) { return Object.assign({}, f, { x: Math.round(f.x * VIEW_W / 1270) }); });
    var viewH = st.viewH || 800, portrait = !!st.portrait;
    var worldTop = portrait ? Math.max(0, Math.round((viewH - 800) * 0.55)) : 0;
    vals.viewH = viewH; vals.worldTop = worldTop; vals.worldTopPx = worldTop - 2;
    vals.stageBg = portrait ? 'linear-gradient(#024F79 0px, #024F79 ' + worldTop + 'px, #6E3424 ' + (worldTop + 800) + 'px, #3A1E14 100%)' : '#1B4A6E';
    vals.tapeTop = worldTop + 4; vals.captionTop = worldTop + 704;
    vals.cdTop = portrait ? Math.max(90, Math.round(worldTop * 0.62)) : 54;
    vals.hintTop = portrait ? Math.max(176, worldTop + 150) : 176;
    vals.sitTop = vals.hintTop + 40;
    vals.rsvpPad = VIEW_W < 900 ? 0 : 28; vals.rsvpBorder = VIEW_W < 900 ? 'none' : '3px dashed #C9B998';
    vals.showRotate = false;
    vals.dismissRotate = function () { self.setState({ rotateDismissed: true }); };
    var docEl = (typeof document !== 'undefined') ? document.documentElement : null;
    vals.canFullscreen = !!(docEl && (docEl.requestFullscreen || docEl.webkitRequestFullscreen)) && !(typeof document !== 'undefined' && document.fullscreenElement);
    vals.goFullscreen = function () {
      var el = document.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (!req) return;
      Promise.resolve(req.call(el)).then(function () {
        try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {}); } catch (err) {}
        self.setState({ rotateDismissed: true });
      }).catch(function () {});
    };
    // countdown
    var now = new Date(st.now || Date.now()), target = new Date(now.getFullYear() + 1, 0, 1), diff = target - now;
    var justNY = now.getMonth() === 0 && now.getDate() === 1;
    function two(n) { return String(n).padStart(2, '0'); }
    var dd = Math.floor(diff / 86400000), hh = Math.floor(diff / 3600000) % 24, mm = Math.floor(diff / 60000) % 60, ss = Math.floor(diff / 1000) % 60;
    var modal = st.thread != null || !!st.photo || !!st.inviteOpen;
    vals.showCountdown = screen === 'room' && !st.photo;
    vals.cdRunning = !justNY; vals.cdDone = justNY;
    vals.cdTitle = justNY ? now.getFullYear() + '년이 밝았어요!' : (now.getFullYear() + 1) + '년까지';
    vals.cdParts = [{ v: String(dd), l: '일', sep: false }, { v: two(hh), l: '시간', sep: true }, { v: two(mm), l: '분', sep: true }, { v: two(ss), l: '초', sep: true }];
    // HUD + prompts
    vals.showHud = screen === 'room' && !st.photo;
    vals.hintText = st.isTouch ? '버튼으로 걷고 점프 · 채팅 버튼으로 대화 · 말풍선을 누르면 댓글' : '← → 걷기 · SPACE 점프 · ↓ 앉기 · ENTER 채팅 · 말풍선 클릭으로 댓글';
    // chat
    var myChat = this.recentChat(this.myKey());
    vals.myBubble = myChat || vals.myLine; vals.myBubbleBg = myChat ? '#FFF3C4' : '#FFFFFF';
    vals.chatOpen = !!st.chatOpen;
    vals.showHint = !st.chatOpen;
    vals.chatTop = vals.hintTop;
    var chatAll = st.chat || [], myK = this.myKey();
    var lastFive = chatAll.slice(-5);
    vals.chatLog = lastFive.map(function (m, i) { return { name: m.name, text: m.text, op: (0.55 + 0.45 * (i + 1) / lastFive.length).toFixed(2), nameColor: m.uid === myK ? '#FFD54A' : '#9FD3FF' }; });
    vals.showChatLog = screen === 'room' && !st.photo && lastFive.length > 0;
    vals.chatDraft = st.chatDraft || '';
    vals.setChatInput = function (el) { self.chatInputEl = el; };
    vals.openChat = function () {
      if (!self.state || self.state.screen !== 'room') return;
      self.keys = {};
      self.setState({ chatOpen: true });
      setTimeout(function () { if (self.chatInputEl) { try { self.chatInputEl.focus(); } catch (err) {} } }, 30);
    };
    vals.closeChat = function () { self.setState({ chatOpen: false, chatDraft: '' }); focusStage(); };
    vals.onChatDraft = function (e) { self.setState({ chatDraft: Array.from(e.target.value).slice(0, 60).join('') }); };
    vals.sendChat = function () {
      var text = ((self.state && self.state.chatDraft) || '').trim();
      if (text) self.sendChat(text);
      self.setState({ chatOpen: false, chatDraft: '' }); focusStage();
    };
    vals.onChatKey = function (e) {
      if (e.key === 'Escape') { vals.closeChat(); return; }
      if (e.key === 'Enter' && !(e.nativeEvent && e.nativeEvent.isComposing) && !e.isComposing) { e.preventDefault(); vals.sendChat(); }
    };
    var seatIdx = st.sitting != null ? st.sitting : (st.seatNear != null ? st.seatNear : -1);
    vals.showSitPrompt = screen === 'room' && !modal && seatIdx >= 0 && !st.isTouch;
    vals.sitPrompt = st.sitting != null ? '← → 를 누르면 일어나요' : (SEATS[seatIdx] && SEATS[seatIdx].type === 'pond' ? '↓ 연못가에 앉기' : '↓ 벤치에 앉기');
    vals.sitShort = st.sitting != null ? '일어나기' : '앉기';
    vals.toggleSit = function () { self.toggleSit(); };
    // sound
    vals.soundLabel = st.soundOff ? '소리 꺼짐' : '소리 켜짐';
    vals.soundPressed = st.soundOff ? 'false' : 'true';
    vals.toggleSound = function () {
      var off = !(self.state && self.state.soundOff);
      self.setState({ soundOff: off });
      if (off) self.musicStop(); else { self.audioInit(); self.musicStart(); }
    };
    var baseEnter = vals.enterRoom;
    vals.enterRoom = function () {
      baseEnter();
      if (!(self.state && self.state.soundOff)) { self.audioInit(); self.musicStart(); }
      if (self.fb && self.myUid) self.publishMe();
      else if (self.state && self.state.netMode !== 'online') self.showToast('온라인 설정 전이라 나만 보이는 모드예요');
      self.saveLocal();
    };
    // touch
    function hold(name, on) { return function (e) { if (e && e.preventDefault) e.preventDefault(); self.keys[name] = on; }; }
    vals.showTouch = screen === 'room' && !!st.isTouch && !modal;
    vals.touchTalk = st.near != null && st.near >= 0;
    vals.touchSit = seatIdx >= 0;
    vals.tLeftDown = hold('left', true); vals.tLeftUp = hold('left', false);
    vals.tRightDown = hold('right', true); vals.tRightUp = hold('right', false);
    vals.tJumpDown = hold('jump', true); vals.tJumpUp = hold('jump', false);
    vals.openNear = function () { var n = self.state && self.state.near, rs = self.roster(); if (n != null && n >= 0 && rs[n]) self.openThread(rs[n].uid); };
    // replies
    var myKey = this.myKey();
    var mine = replies[myKey] || [];
    vals.meHasReplies = mine.length > 0; vals.meReplyCount = mine.length;
    vals.openMine = function () { self.openThread(self.myKey()); };
    vals.threadOpen = st.thread != null;
    var tKey = st.thread, tMine = tKey === myKey, tWho = roster.filter(function (o) { return o.uid === tKey; })[0];
    vals.threadName = tMine ? '나' : (tWho ? tWho.name : '');
    vals.threadLine = tMine ? vals.myLine : (tWho ? tWho.line : '');
    var tl = tKey ? (replies[tKey] || []) : [];
    vals.threadEmpty = tl.length === 0;
    vals.threadReplies = tl.map(function (r) { return { name: r.name, text: r.text, tagBg: r.mine ? accent : '#FFFFFF' }; });
    vals.replyDraft = st.replyDraft || '';
    vals.onReplyDraft = function (e) { self.setState({ replyDraft: Array.from(e.target.value).slice(0, 40).join('') }); };
    vals.submitReply = function () {
      var text = (self.state.replyDraft || '').trim(); if (!text || self.state.thread == null) return;
      var key = self.state.thread, who = (self.state.nick || '나').trim() || '나';
      if (self.fb && self.myUid) {
        var D = self.fb.D;
        D.push(D.ref(self.fb.db, 'replies/' + key), { name: who, text: text, uid: self.myUid, at: D.serverTimestamp() });
      } else {
        var all = Object.assign({}, self.state.replies || {});
        all[key] = (all[key] || []).concat([{ name: who, text: text, mine: true }]);
        self.setState({ replies: all });
      }
      self.sfx('post'); self.setState({ replyDraft: '' });
    };
    vals.onReplyKey = function (e) {
      if (e.key === 'Escape') { vals.closeThread(); return; }
      if (e.key === 'Enter' && !(e.nativeEvent && e.nativeEvent.isComposing)) { e.preventDefault(); vals.submitReply(); }
    };
    vals.closeThread = function () { self.setState({ thread: null }); focusStage(); };
    // photo
    vals.photoOpen = !!st.photo;
    vals.flashCls = (st.flashN || 0) % 2 ? 'flashA' : 'flashB';
    vals.photoDate = this.photoDate();
    vals.takePhoto = function () { self.keys = {}; self.audioInit(); self.sfx('shutter'); self.setState({ photo: true, photoUrl: '', flashN: ((self.state && self.state.flashN) || 0) + 1 }); };
    vals.savePhoto = function () { self.savePhoto(); };
    vals.closePhoto = function () { self.setState({ photo: false, photoUrl: '' }); focusStage(); };
    vals.hasPhotoUrl = !!st.photoUrl; vals.photoUrl = st.photoUrl || '';
    // invite
    vals.inviteUrl = INVITE_URL;
    vals.inviteOpen = !!st.inviteOpen;
    vals.copyInvite = function () {
      var done = function () { self.showToast('초대 링크를 복사했어요! 친구에게 보내 주세요'); };
      var fail = function () { self.setState({ inviteOpen: true }); };
      try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(INVITE_URL).then(done, fail); else fail(); } catch (err) { fail(); }
    };
    vals.closeInvite = function () { self.setState({ inviteOpen: false }); };
    vals.selectAll = function (e) { try { e.target.select(); } catch (err) {} };
    vals.hasToast = !!st.toast; vals.toastText = st.toast || '';

    vals.playerShadow = st.sitting != null ? ch.room.sit : ch.room.front; vals.playerSide1 = ch.room.s1; vals.playerSide2 = ch.room.s2; vals.playerSide3 = ch.room.s3;
    ['starsW', 'cloudsW', 'smokeW', 'windowsW', 'bulbsW', 'glintsW', 'dotStars', 'crossStars', 'sunset', 'suns', 'sun', 'cloudBank', 'clouds', 'cloudShadow', 'cloudW', 'pinesBack', 'pinesFront', 'houses', 'houseShadow', 'field', 'farW',
     'lamps', 'lampHead', 'pines', 'pineShadow', 'bigTrees', 'bigTreeShadow', 'bigTreeW', 'bigTreeH', 'treeWire', 'treeBulbs', 'fences', 'bushes', 'bushShadow',
     'lanterns', 'lanternShadow', 'snowTop', 'dirtDeco', 'ponds'].forEach(function (k) { vals[k] = S[k]; });
    return vals;
  }
}


App.prototype.render = function () {
  const v = this.renderVals();
  return html`<div class="stage" tabindex="0" ref=${v.setRoot} onKeyDown=${v.onKeyDown} onKeyUp=${v.onKeyUp} onBlur=${v.onBlur} onPointerDown=${v.focusRoot} style="width: ${v.viewW}px; height: ${v.viewH}px; position: relative; overflow: hidden; background: ${v.stageBg}; font-family: 'Jua', sans-serif; color: #24304F">

  
  <div ref=${v.refWorld} style="position: absolute; left: 0px; top: ${v.worldTopPx}px; width: ${v.worldW}px; height: 802px; transform: translateX(${v.camWorld}px); will-change: transform">
    <img src="assets/winter-world.webp" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 3600px; height: 802px; display: block" />
    
    <div aria-hidden="true" style="position: absolute; left: 0; top: -280px; width: 3600px; height: 280px; background-image: url(assets/winter-world.webp); background-size: 3600px 802px; background-position: 0 0; transform: scaleY(-1)"></div>
    <div aria-hidden="true" style="position: absolute; left: 0; top: -560px; width: 3600px; height: 280px; background-image: url(assets/winter-world.webp); background-size: 3600px 802px; background-position: 0 0"></div>
    <div aria-hidden="true" style="position: absolute; left: 0; top: -840px; width: 3600px; height: 280px; background-image: url(assets/winter-world.webp); background-size: 3600px 802px; background-position: 0 0; transform: scaleY(-1)"></div>
    <div aria-hidden="true" style="position: absolute; left: 0; top: -1120px; width: 3600px; height: 280px; background-image: url(assets/winter-world.webp); background-size: 3600px 802px; background-position: 0 0"></div>
    <div aria-hidden="true" style="position: absolute; left: 0; top: 800px; width: 3600px; height: 1400px; border-top: 6px solid #5E2F1C; box-sizing: border-box; background-image: linear-gradient(rgba(24,12,8,0) 0px, rgba(24,12,8,.35) 260px, rgba(24,12,8,.6) 700px), url(assets/dirt-tile.png); background-size: auto, 96px 96px; image-rendering: pixelated"></div>

    
    ${(v.cloudsW || []).map((c, $index) => html`
      <div class="drift" style="position: absolute; left: ${c.x}px; top: ${c.y}px; width: ${c.w}px; height: ${c.h}px; animation-delay: ${c.delay}s; animation-duration: ${c.dur}s">
        <img src=${c.src} alt="" aria-hidden="true" style="width: ${c.w}px; height: ${c.h}px; display: block; transform: scaleX(${c.flip})" />
      </div>
    `)}
    
    ${(v.starsW || []).map((s, $index) => html`
      <div class="tw" style="position: absolute; left: ${s.x}px; top: ${s.y}px; width: ${s.s}px; height: ${s.s}px; background: #FFFFFF; box-shadow: 0 0 ${s.g}px ${s.g2}px rgba(255,255,255,.75); animation-delay: ${s.delay}s; animation-duration: ${s.dur}s"></div>
    `)}
    
    ${(v.smokeW || []).map((m, $index) => html`
      <div class="smoke" style="position: absolute; left: ${m.x}px; top: ${m.y}px; width: ${m.s}px; height: ${m.s}px; background: #D9DEEC; animation-delay: ${m.delay}s"></div>
    `)}
    
    ${(v.windowsW || []).map((w, $index) => html`
      <div class="flicker" style="position: absolute; left: ${w.x}px; top: ${w.y}px; width: 26px; height: 22px; background: rgba(255,214,110,.35); box-shadow: 0 0 18px 8px rgba(255,201,77,.45); animation-delay: ${w.delay}s"></div>
    `)}
    
    ${(v.lampsW || []).map((l, $index) => html`
      <div class="pulse" style="position: absolute; left: ${l.x}px; top: ${l.y}px; width: 170px; height: 170px; border-radius: 50%; background: radial-gradient(circle, rgba(255,226,140,.75) 0%, rgba(255,214,110,.28) 32%, rgba(255,214,110,0) 68%); opacity: ${l.op}; transition: opacity .4s; animation-delay: ${l.delay}s"></div>
    `)}
    
    ${(v.bulbsW || []).map((b, $index) => html`
      <div class="glow" style="position: absolute; left: ${b.x}px; top: ${b.y}px; width: ${b.s}px; height: ${b.s}px; border-radius: 50%; background: radial-gradient(circle, rgba(255,244,190,.95) 0%, rgba(255,190,80,.55) 40%, rgba(255,190,80,0) 70%); animation-delay: ${b.delay}s"></div>
    `)}
    
    ${(v.glintsW || []).map((g, $index) => html`
      <div class="shimmer" style="position: absolute; left: ${g.x}px; top: ${g.y}px; width: 26px; height: 5px; background: #FFE58A; box-shadow: 6px 10px 0 #FFD45C, -4px 20px 0 #FFE58A, 3px 30px 0 rgba(255,212,92,.7); animation-delay: ${g.delay}s"></div>
    `)}
    
    ${(v.treesW || []).map((t, $index) => html`
      ${(t.flakes || []).map((f, $index) => html`
        <div class=${t.cls} style="position: absolute; left: ${f.x}px; top: ${f.y}px; width: ${f.s}px; height: ${f.s}px; background: #F4F7FF; --fall: ${f.fall}px; --drift: ${f.drift}px; animation-delay: ${f.delay}s"></div>
      `)}
    `)}

    
    <div aria-hidden="true" style="position: absolute; left: 0; top: 470px; width: ${v.worldW}px; height: 320px; opacity: ${v.haloOpacity}; filter: blur(18px); mix-blend-mode: screen; pointer-events: none">
      ${(v.friends || []).map((f, $index) => html`
        <div style="position: absolute; left: ${f.hx}px; top: 48px; width: 150px; height: 212px; border-radius: 50%; background: #FFF1CC"></div>
      `)}
      ${v.inRoom ? html`
        <div ref=${v.refHalo} style="position: absolute; left: ${v.haloX}px; top: 48px; width: 150px; height: 212px; border-radius: 50%; background: #FFF1CC"></div>
      ` : null}
    </div>

    
    ${(v.benchesW || []).map((b, $index) => html`
      <div aria-hidden="true" style="position: absolute; left: ${b.left}px; top: 648px; width: 4px; height: 4px; box-shadow: ${v.benchShadow}"></div>
    `)}

    
    ${(v.friends || []).map((f, $index) => html`
      <div style="position: absolute; left: ${f.x}px; top: 456px; width: 170px; height: 296px; padding-bottom: 42px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; opacity: ${f.op}; transition: left .14s linear">
        <div style="display: flex; flex-direction: column; align-items: center; transform: translateY(${f.lift}px)">
        <button type="button" class="bubble-btn" onClick=${f.open} aria-label="${f.name}의 한마디에 댓글 달기"><div class="pxb"><div class="pxb-in" style="background: ${f.bubbleBg}">${f.line}${f.hasReplies ? html`<span class="reply-tag">댓글 ${f.replyCount}</span>` : null}</div></div></button>
        <div class="pxtail"><div style="position: absolute; left: 0; top: 0; width: 3px; height: 3px; box-shadow: ${f.tail}"></div></div>
        </div>
        <div class="pxname">${f.nameText}</div>
        <div style="transform: translateY(${f.dy}px)">
          <div class=${f.bodyCls} style="position: relative; width: 130px; height: 155px; animation-delay: ${f.delay}s">
            ${f.still ? html`
              <div role="img" aria-label="${f.name} 캐릭터" style="position: absolute; left: 0; top: 0; width: 5px; height: 5px; box-shadow: ${f.shadow}"></div>
            ` : null}
            ${f.walking ? html`
              <div role="img" aria-label="걷고 있는 ${f.name} 캐릭터" style="position: absolute; left: 0; top: 0; width: 130px; height: 155px; transform: scaleX(${f.flip})">
                <div class="f1" style="position: absolute; left: 0; top: 0; width: 5px; height: 5px; box-shadow: ${f.s1}"></div>
                <div class="f2" style="position: absolute; left: 0; top: 0; width: 5px; height: 5px; box-shadow: ${f.s2}"></div>
                <div class="f3" style="position: absolute; left: 0; top: 0; width: 5px; height: 5px; box-shadow: ${f.s3}"></div>
              </div>
            ` : null}
          </div>
        </div>
        <div style="width: 70px; height: 7px; background: rgba(36,48,79,.25); margin-top: 1px"></div>
      </div>
    `)}

    
    ${v.inRoom ? html`
    <div ref=${v.refPlayer} style="position: absolute; left: ${v.px}px; top: 456px; width: 170px; height: 296px; padding-bottom: 42px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; z-index: 5">
      <div ref=${v.refLift} style="display: flex; flex-direction: column; align-items: center; transform: translateY(-${v.py}px)">
        <button type="button" class="bubble-btn" onClick=${v.openMine} aria-label="내 한마디에 달린 댓글 보기"><div class="pxb"><div class="pxb-in" style="background: ${v.myBubbleBg}">${v.myBubble}${v.meHasReplies ? html`<span class="reply-tag">댓글 ${v.meReplyCount}</span>` : null}</div></div></button>
        <div class="pxtail"><div style="position: absolute; left: 0; top: 0; width: 3px; height: 3px; box-shadow: ${v.tailWhite}"></div></div>
        <div class="pxname"><span style="font-family: 'Press Start 2P', monospace; font-size: 8px; background: ${v.accent}; color: #1B1719; text-shadow: none; padding: 3px 4px; border: 2px solid #1B1719">ME</span>${v.myName}</div>
        <div class=${v.bodyCls} style="position: relative; width: 130px; height: 155px">
          ${v.showFront ? html`
            <div role="img" aria-label="내 캐릭터" style="position: absolute; left: 0; top: 0; width: 5px; height: 5px; box-shadow: ${v.playerShadow}"></div>
          ` : null}
          ${v.showSide ? html`
            <div role="img" aria-label="걷고 있는 내 캐릭터" style="position: absolute; left: 0; top: 0; width: 130px; height: 155px; transform: scaleX(${v.facing})">
              <div class=${v.frame1} style="position: absolute; left: 0; top: 0; width: 5px; height: 5px; box-shadow: ${v.playerSide1}"></div>
              <div class=${v.frame2} style="position: absolute; left: 0; top: 0; width: 5px; height: 5px; box-shadow: ${v.playerSide2}"></div>
              <div class=${v.frame3} style="position: absolute; left: 0; top: 0; width: 5px; height: 5px; box-shadow: ${v.playerSide3}"></div>
              ${v.showDust ? html`
                <div class="dust" style="position: absolute; left: 28px; top: 142px; width: 8px; height: 8px; background: #E6DCEB"></div>
                <div class="dust" style="position: absolute; left: 20px; top: 134px; width: 6px; height: 6px; background: #E6DCEB; animation-delay: .05s"></div>
              ` : null}
            </div>
          ` : null}
        </div>
      </div>
      ${v.onPond ? html`
        <div class="ring" style="position: absolute; left: 35px; top: 286px; width: 100px; height: 18px; border: 3px solid #A8D8FF; border-radius: 50%; box-sizing: border-box"></div>
        <div class="ring" style="position: absolute; left: 35px; top: 286px; width: 100px; height: 18px; border: 3px solid #A8D8FF; border-radius: 50%; box-sizing: border-box; animation-delay: -.6s"></div>
      ` : null}
      <div ref=${v.refShadow} style="width: ${v.shadowW}px; height: 7px; background: rgba(36,48,79,.25); margin-top: 1px"></div>
    </div>
    ` : null}
  </div>

  
  <div class="shoot" style="position: absolute; left: 980px; top: 40px; width: 110px; height: 3px; background: linear-gradient(90deg, rgba(255,255,255,0), #FFFFFF); transform: rotate(-24deg)"></div>
  <div class="shoot" style="position: absolute; left: 420px; top: 90px; width: 90px; height: 3px; background: linear-gradient(90deg, rgba(255,255,255,0), #FFFFFF); transform: rotate(-24deg); animation-delay: -5.5s"></div>
  
  ${v.showCountdown ? html`
    <div aria-live="off" style="position: absolute; left: 0; top: ${v.cdTop}px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 10px; pointer-events: none">
      <div class="pxname" style="font-size: 17px; margin: 0">${v.cdTitle}</div>
      ${v.cdRunning ? html`
        <div style="display: flex; gap: 10px; align-items: flex-start">
          ${(v.cdParts || []).map((c, $index) => html`
            ${c.sep ? html`
              <div class="cd-num" style="padding: 0 2px">:</div>
            ` : null}
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
              <div class="cd-num">${c.v}</div>
              <div style="font-size: 13px; color: #DCE6F6; text-shadow: 1px 1px 0 #0E2238">${c.l}</div>
            </div>
          `)}
        </div>
      ` : null}
      ${v.cdDone ? html`
        <div class="cd-num" style="font-size: 34px">HAPPY NEW YEAR</div>
      ` : null}
    </div>
  ` : null}
  
  ${(v.flakes || []).map((f, $index) => html`
    <div class="flake" style="position: absolute; left: ${f.x}px; top: -20px; width: ${f.s}px; height: ${f.s}px; background: #FFFFFF; opacity: .85; animation-delay: ${f.delay}s; animation-duration: ${f.dur}s"></div>
  `)}

  
  ${v.showHud ? html`
    <div style="position: absolute; left: calc(50% - 300px); top: ${v.hintTop}px; width: 600px; display: flex; justify-content: center; pointer-events: none">
      ${v.showHint ? html`
        <div style="padding: 7px 14px; background: rgba(14,34,56,.6); color: #FFF4D6; font-size: 14px">${v.hintText}</div>
      ` : null}
    </div>
    <div style="position: absolute; left: 24px; top: 20px; display: flex; align-items: center; gap: 10px; background: rgba(14,34,56,.85); color: #FFFFFF; padding: 10px 16px; font-family: 'Press Start 2P', monospace; font-size: 12px">
      <span style="width: 8px; height: 8px; background: #7FE08A"></span>
      PLAYERS ${v.count}
    </div>
    <div style="position: absolute; right: 20px; top: 16px; display: flex; align-items: center; gap: 8px">
      <button type="button" class="pxbtn hud-btn" onClick=${v.copyInvite}>초대하기</button>
      <button type="button" class="pxbtn hud-btn" onClick=${v.takePhoto}>사진 찍기</button>
      <button type="button" class="pxbtn hud-btn" onClick=${v.toggleSound} aria-pressed=${v.soundPressed}>${v.soundLabel}</button>
      <button type="button" class="pxbtn hud-btn" onClick=${v.goCustom}>꾸미기</button>
      ${v.canFullscreen ? html`
        <button type="button" class="pxbtn hud-btn" onClick=${v.goFullscreen}>전체 화면</button>
      ` : null}
    </div>
    ${v.showSitPrompt ? html`
      <div style="position: absolute; left: calc(50% - 150px); top: ${v.sitTop}px; width: 300px; display: flex; justify-content: center; pointer-events: none">
        <div class="blink" style="padding: 6px 12px; background: ${v.accent}; border: 3px solid #0E2238; color: #0E2238; font-size: 15px">${v.sitPrompt}</div>
      </div>
    ` : null}
  ` : null}

  
  ${v.showTouch ? html`
    <div style="position: absolute; left: 28px; bottom: 28px; display: flex; gap: 16px; z-index: 15">
      <button type="button" class="pxbtn touch-btn" aria-label="왼쪽으로 걷기" onPointerDown=${v.tLeftDown} onPointerUp=${v.tLeftUp} onPointerLeave=${v.tLeftUp} onPointerCancel=${v.tLeftUp}>◀</button>
      <button type="button" class="pxbtn touch-btn" aria-label="오른쪽으로 걷기" onPointerDown=${v.tRightDown} onPointerUp=${v.tRightUp} onPointerLeave=${v.tRightUp} onPointerCancel=${v.tRightUp}>▶</button>
    </div>
    <div style="position: absolute; right: 28px; bottom: 28px; display: flex; gap: 16px; align-items: flex-end; z-index: 15">
      <button type="button" class="pxbtn touch-btn" style="width: 120px; font-size: 22px" onClick=${v.openChat}>채팅</button>
      ${v.touchTalk ? html`
        <button type="button" class="pxbtn touch-btn" style="width: 120px; font-size: 22px" onClick=${v.openNear}>댓글</button>
      ` : null}
      ${v.touchSit ? html`
        <button type="button" class="pxbtn touch-btn" style="width: 120px; font-size: 22px" onClick=${v.toggleSit}>${v.sitShort}</button>
      ` : null}
      <button type="button" class="pxbtn touch-btn" style="width: 140px; background: ${v.accent}; font-size: 22px" aria-label="점프" onPointerDown=${v.tJumpDown} onPointerUp=${v.tJumpUp} onPointerLeave=${v.tJumpUp} onPointerCancel=${v.tJumpUp}>점프</button>
    </div>
  ` : null}

  
  ${v.showChatLog ? html`
    <div aria-live="polite" style="position: absolute; left: 24px; top: 72px; width: 380px; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; pointer-events: none; z-index: 8">
      ${(v.chatLog || []).map((m, $index) => html`
        <div style="max-width: 380px; padding: 4px 10px; background: rgba(8,22,40,.66); color: #FFF4D6; font-size: 14px; line-height: 1.35; opacity: ${m.op}"><span style="color: ${m.nameColor}">${m.name}</span> ${m.text}</div>
      `)}
    </div>
  ` : null}
  ${v.chatOpen ? html`
    <div style="position: absolute; left: calc(50% - 290px); top: ${v.chatTop}px; width: 580px; display: flex; gap: 8px; z-index: 35">
      <label for="chat-input" style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)">채팅 입력</label>
      <input id="chat-input" ref=${v.setChatInput} type="text" value=${v.chatDraft} onInput=${v.onChatDraft} onKeyDown=${v.onChatKey} placeholder="메시지를 입력하고 Enter (최대 60자)" style="flex: 1; min-width: 0; height: 52px; padding: 0 14px; font-family: 'Jua', sans-serif; font-size: 18px; border: 3px solid #0E2238; background: #FFFFFF; color: #0E2238; box-sizing: border-box" />
      <button type="button" class="pxbtn" onClick=${v.sendChat} style="height: 52px; padding: 0 18px; background: ${v.accent}; border: 3px solid #0E2238; box-shadow: 0 4px 0 #0E2238; color: #0E2238; font-family: 'Jua', sans-serif; font-size: 18px">보내기</button>
      <button type="button" class="pxbtn" onClick=${v.closeChat} aria-label="채팅 닫기" style="width: 52px; height: 52px; background: #FFFFFF; border: 3px solid #0E2238; font-family: 'Press Start 2P', monospace; font-size: 12px; color: #0E2238">X</button>
    </div>
  ` : null}

  
  ${v.threadOpen ? html`
    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow-y: auto; padding: 24px 0; box-sizing: border-box; background: rgba(8,22,40,.55); display: flex; align-items: safe center; justify-content: center; z-index: 30">
      <div role="dialog" aria-label="댓글" class="invite-in" style="width: 620px; background: #FFF8EA; border: 4px solid #0E2238; box-shadow: 10px 10px 0 rgba(8,22,40,.6); padding: 26px 28px; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px; color: #0E2238">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 22px">${v.threadName}의 한마디</span>
          <button type="button" class="pxbtn" onClick=${v.closeThread} aria-label="닫기" style="width: 44px; height: 44px; background: #FFFFFF; border: 3px solid #0E2238; font-family: 'Press Start 2P', monospace; font-size: 12px; color: #0E2238">X</button>
        </div>
        <div class="pxb" style="max-width: none; align-self: flex-start"><div class="pxb-in" style="background: #FFFFFF; font-size: 18px; text-align: left">${v.threadLine}</div></div>
        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto; padding: 4px 2px">
          ${v.threadEmpty ? html`
            <p style="margin: 0; font-size: 15px; color: #6B7790">아직 댓글이 없어요. 첫 댓글을 남겨 보세요!</p>
          ` : null}
          ${(v.threadReplies || []).map((r, $index) => html`
            <div style="display: flex; gap: 10px; align-items: flex-start">
              <span style="flex: none; padding: 3px 8px; background: ${r.tagBg}; border: 2px solid #0E2238; font-size: 14px">${r.name}</span>
              <span style="font-size: 16px; line-height: 1.5; padding-top: 2px">${r.text}</span>
            </div>
          `)}
        </div>
        <div style="display: flex; gap: 10px">
          <label for="thread-input" style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)">댓글 입력</label>
          <input id="thread-input" type="text" value=${v.replyDraft} onInput=${v.onReplyDraft} onKeyDown=${v.onReplyKey} placeholder="댓글을 남겨 보세요 (최대 40자)" style="flex: 1; min-width: 0; height: 50px; padding: 0 14px; font-family: 'Jua', sans-serif; font-size: 18px; border: 3px solid #0E2238; background: #FFFFFF; color: #0E2238; box-sizing: border-box" />
          <button type="button" class="pxbtn" onClick=${v.submitReply} style="height: 50px; padding: 0 20px; background: ${v.accent}; border: 3px solid #0E2238; box-shadow: 0 4px 0 #0E2238; color: #0E2238; font-family: 'Jua', sans-serif; font-size: 18px">댓글 달기</button>
        </div>
      </div>
    </div>
  ` : null}

  
  ${v.photoOpen ? html`
    <div class=${v.flashCls} style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: #FFFFFF; pointer-events: none; z-index: 27"></div>
    <div style="position: absolute; left: 0; top: ${v.worldTop}px; width: 100%; height: 800px; z-index: 26; pointer-events: none; box-sizing: border-box; border: 22px solid #FFF8EA; border-bottom-width: 96px; outline: 4px solid #0E2238; outline-offset: -26px"></div>
    <div aria-hidden="true" style="position: absolute; left: 70px; top: ${v.tapeTop}px; width: 90px; height: 30px; background: rgba(255,214,110,.75); transform: rotate(-6deg); z-index: 28"></div>
    <div aria-hidden="true" style="position: absolute; right: 70px; top: ${v.tapeTop}px; width: 90px; height: 30px; background: rgba(143,203,232,.75); transform: rotate(5deg); z-index: 28"></div>
    <div style="position: absolute; left: 22px; top: ${v.captionTop}px; right: 22px; height: 96px; padding: 0 26px; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; z-index: 28; color: #0E2238">
      <div style="display: flex; flex-direction: column; gap: 6px">
        <span style="font-size: 24px">2026 연말 단체사진</span>
        <span style="font-size: 14px; color: #6B5A3A">${v.photoDate} · 우리들의 연말 모임방 · ${v.count}명</span>
      </div>
      <div style="display: flex; gap: 10px">
        <button type="button" class="pxbtn" onClick=${v.savePhoto} style="height: 50px; padding: 0 20px; background: ${v.accent}; border: 3px solid #0E2238; box-shadow: 0 4px 0 #0E2238; color: #0E2238; font-family: 'Jua', sans-serif; font-size: 18px">이미지로 저장</button>
        <button type="button" class="pxbtn" onClick=${v.closePhoto} style="height: 50px; padding: 0 20px; background: #FFFFFF; border: 3px solid #0E2238; box-shadow: 0 4px 0 #0E2238; color: #0E2238; font-family: 'Jua', sans-serif; font-size: 18px">닫기</button>
      </div>
    </div>
    ${v.hasPhotoUrl ? html`
      <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: rgba(8,22,40,.7); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 29">
        <img src=${v.photoUrl} alt="2026 연말 단체사진" style="width: 800px; height: 500px; border: 4px solid #0E2238; display: block" />
        <p style="margin: 0; color: #FFF4D6; font-size: 17px">저장이 안 되면 사진을 우클릭하거나 길게 눌러서 저장해 주세요</p>
        <button type="button" class="pxbtn" onClick=${v.closePhoto} style="height: 48px; padding: 0 22px; background: #FFFFFF; border: 3px solid #0E2238; color: #0E2238; font-family: 'Jua', sans-serif; font-size: 18px">닫기</button>
      </div>
    ` : null}
  ` : null}

  
  ${v.inviteOpen ? html`
    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow-y: auto; padding: 24px 0; box-sizing: border-box; background: rgba(8,22,40,.55); display: flex; align-items: safe center; justify-content: center; z-index: 40">
      <div role="dialog" aria-label="초대 링크" style="width: 620px; background: #FFF8EA; border: 4px solid #0E2238; box-shadow: 10px 10px 0 rgba(8,22,40,.6); padding: 26px 28px; box-sizing: border-box; display: flex; flex-direction: column; gap: 14px; color: #0E2238">
        <span style="font-size: 22px">친구 초대 링크</span>
        <label for="invite-url" style="font-size: 15px; color: #46546E">아래 링크를 복사해서 친구에게 보내 주세요</label>
        <input id="invite-url" type="text" readonly=${true} value=${v.inviteUrl} onFocus=${v.selectAll} style="height: 50px; padding: 0 12px; font-family: 'Jua', sans-serif; font-size: 16px; border: 3px solid #0E2238; background: #FFFFFF; color: #0E2238; box-sizing: border-box" />
        <p style="margin: 0; font-size: 14px; color: #6B7790">친구가 링크로 들어오려면 이 페이지의 공유가 켜져 있어야 해요.</p>
        <button type="button" class="pxbtn" onClick=${v.closeInvite} style="align-self: flex-end; height: 48px; padding: 0 22px; background: ${v.accent}; border: 3px solid #0E2238; color: #0E2238; font-family: 'Jua', sans-serif; font-size: 18px">닫기</button>
      </div>
    </div>
  ` : null}

  
  ${v.hasToast ? html`
    <div role="status" style="position: absolute; left: calc(50% - 300px); top: 700px; width: 600px; display: flex; justify-content: center; z-index: 45; pointer-events: none">
      <div class="invite-in" style="padding: 10px 18px; background: #0E2238; color: #FFF4D6; border: 3px solid #FFF4D6; font-size: 16px">${v.toastText}</div>
    </div>
  ` : null}

  
  ${v.isEntry ? html`
    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow-y: auto; padding: 24px 0; box-sizing: border-box; background: rgba(8,22,40,.55); display: flex; align-items: safe center; justify-content: center; z-index: 20">
      <div class="invite-in" style="position: relative; width: min(900px, calc(100% - 40px)); margin: auto 0; padding: 14px; background: repeating-linear-gradient(135deg, #D6453D 0 14px, #FFF8EA 14px 28px, #3F8F5A 28px 42px, #FFF8EA 42px 56px); border: 4px solid #0E2238; box-shadow: 10px 10px 0 rgba(8,22,40,.6); box-sizing: border-box">

        
        <div aria-hidden="true" style="position: absolute; left: 24px; top: -10px; right: 24px; height: 24px; display: flex; justify-content: space-between; align-items: flex-start">
          ${(v.garland || []).map((b, $index) => html`
            <div style="display: flex; flex-direction: column; align-items: center">
              <div style="width: 4px; height: 6px; background: #0E2238"></div>
              <div class="glow" style="width: 10px; height: 12px; background: ${b.c}; border: 2px solid #0E2238; box-shadow: 0 0 10px 3px rgba(255,214,90,.7); animation-delay: ${b.d}s"></div>
            </div>
          `)}
        </div>

        <div style="position: relative; display: flex; flex-wrap: wrap; gap: 32px; background: #FFF8EA; border: 4px solid #0E2238; padding: 34px 36px 30px; box-sizing: border-box; color: #0E2238">
          
          <div aria-hidden="true" style="position: absolute; left: 10px; top: 10px; width: 4px; height: 4px; box-shadow: ${v.hollyShadow}"></div>
          <div aria-hidden="true" style="position: absolute; right: 46px; bottom: 12px; width: 4px; height: 4px; box-shadow: ${v.hollyShadow}"></div>

          
          <div style="flex: 1 1 380px; min-width: 0; display: flex; flex-direction: column; gap: 16px">
            <div style="display: flex; justify-content: space-between; align-items: flex-start">
              <span style="font-family: 'Press Start 2P', monospace; font-size: 11px; color: #D6453D; letter-spacing: 1px">INVITATION · 1/2</span>
              
              <div aria-hidden="true" style="width: 76px; height: 88px; margin: -12px -6px 0 0; background: #FFFFFF; border: 3px dashed #0E2238; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; transform: rotate(6deg)">
                <div style="position: relative; width: 28px; height: 36px">
                  <div style="position: absolute; left: 0; top: 0; width: 4px; height: 4px; box-shadow: ${v.stampTree}"></div>
                </div>
                <span style="font-family: 'Press Start 2P', monospace; font-size: 9px; color: #D6453D">2026</span>
              </div>
            </div>
            <h1 style="margin: 0; font-family: 'Jua', sans-serif; font-size: 34px; font-weight: 400"><strong>연말에 모이는 이유는 늘 비슷하니까</strong></h1>
            <p style="margin: 0; font-size: 17px; line-height: 1.5; color: #46546E">올 한 해 고생한 우리끼리, 작은 모임방에 모여서 한마디씩 남기고 가요.</p>

            <div style="display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; background: #FFFFFF; border: 3px solid #0E2238">
              <div style="display: flex; gap: 12px; font-size: 17px"><span style="width: 64px; color: #8A6A3A">언제</span><span>2026년 12월 31일, 한 해의 마지막 밤</span></div>
              <div style="display: flex; gap: 12px; font-size: 17px"><span style="width: 64px; color: #8A6A3A">어디서</span><span>눈 내리는 우리들의 연말 모임방</span></div>
              <div style="display: flex; gap: 12px; align-items: center; font-size: 17px"><span style="width: 64px; color: #8A6A3A">새해까지</span><span style="font-family: 'Press Start 2P', monospace; font-size: 14px; color: #D6453D">${v.dday}</span></div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px">
              <span style="font-size: 16px; color: #46546E">먼저 와 있는 친구들 · ${v.friendCount}명</span>
              ${v.noFriends ? html`
                <span style="font-size: 15px; color: #8A6A3A">아직 아무도 없어요. 첫 번째 손님이 되어 주세요!</span>
              ` : null}
              <div style="display: flex; align-items: flex-end; gap: 2px; height: 66px">
                ${(v.friends || []).map((f, $index) => html`
                  <div class="bob" title=${f.name} style="position: relative; width: 52px; height: 62px; animation-delay: ${f.delay}s">
                    <div style="position: absolute; left: 0; top: 0; width: 130px; height: 155px; transform: scale(.4); transform-origin: 0 0">
                      <div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 5px; height: 5px; box-shadow: ${f.shadow}"></div>
                    </div>
                  </div>
                `)}
              </div>
            </div>
          </div>

          
          <div style="flex: 1 1 300px; min-width: 0; display: flex; flex-direction: column; gap: 14px; padding-left: ${v.rsvpPad}px; border-left: ${v.rsvpBorder}">
            <span style="font-family: 'Press Start 2P', monospace; font-size: 11px; color: #3F8F5A">RSVP</span>
            <div style="display: flex; flex-direction: column; gap: 6px">
              <label for="entry-nick" style="font-size: 17px">닉네임</label>
              <input id="entry-nick" type="text" value=${v.nick} onInput=${v.onNick} onKeyDown=${v.onEntryKey} placeholder="예: 콩떡" style="height: 50px; padding: 0 14px; font-family: 'Jua', sans-serif; font-size: 20px; border: 3px solid #0E2238; background: #FFFFFF; color: #0E2238; box-sizing: border-box" />
              <span style="align-self: flex-end; font-size: 13px; color: #556380">${v.nickCount} / 8</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px">
              <label for="entry-line" style="font-size: 17px">한마디</label>
              <input id="entry-line" type="text" value=${v.line} onInput=${v.onLine} onKeyDown=${v.onEntryKey} placeholder="예: 올해도 다들 고마웠어!" style="height: 50px; padding: 0 14px; font-family: 'Jua', sans-serif; font-size: 20px; border: 3px solid #0E2238; background: #FFFFFF; color: #0E2238; box-sizing: border-box" />
              <span style="align-self: flex-end; font-size: 13px; color: #556380">${v.lineCount} / 24</span>
            </div>

            
            <div style="display: flex; align-items: flex-end; gap: 12px; padding: 12px; background: #1F4A6B; border: 3px solid #0E2238">
              <div style="display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 0">
                <div class="pxb" style="max-width: 200px"><div class="pxb-in" style="background: #FFFFFF; font-size: 13px">${v.myLine}</div></div>
                <div class="pxtail"><div style="position: absolute; left: 0; top: 0; width: 3px; height: 3px; box-shadow: ${v.tailWhite}"></div></div>
                <div class="pxname" style="font-size: 14px">${v.myName}</div>
                <div class="bob" style="position: relative; width: 65px; height: 78px">
                  <div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2.5px; height: 2.5px; box-shadow: ${v.miniFront}"></div>
                </div>
              </div>
            </div>

            ${v.entryError ? html`
              <p style="margin: 0; font-size: 15px; color: #B3261E">닉네임을 먼저 적어 주세요</p>
            ` : null}
            <button type="button" class="pxbtn" onClick=${v.goCustom} style="height: 56px; background: ${v.accent}; border: 4px solid #0E2238; box-shadow: 0 6px 0 #0E2238; color: #0E2238; font-family: 'Jua', sans-serif; font-size: 21px">캐릭터 꾸미러 가기 ▶</button>
            <button type="button" class="pxbtn" onClick=${v.copyInvite} style="min-height: 44px; background: transparent; border: none; color: #3F6E9E; font-family: 'Jua', sans-serif; font-size: 16px; text-decoration: underline">친구 초대 링크 복사하기</button>
          </div>
        </div>
      </div>
    </div>
  ` : null}

  
  ${v.isCustom ? html`
    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow-y: auto; padding: 24px 0; box-sizing: border-box; background: rgba(8,22,40,.55); display: flex; align-items: safe center; justify-content: center; z-index: 20">
      <div style="width: min(1080px, calc(100% - 40px)); margin: auto 0; flex-wrap: wrap; justify-content: center; background: #F4F7FF; border: 4px solid #0E2238; box-shadow: 10px 10px 0 rgba(8,22,40,.6); padding: 28px 32px; box-sizing: border-box; display: flex; gap: 32px; color: #0E2238">

        
        <div style="width: 340px; flex: none; display: flex; flex-direction: column; gap: 12px">
          <div style="position: relative; width: 340px; height: 500px; background: linear-gradient(#1F4A6B 0 360px, #F3F6FD 360px 400px, #BCC6E6 400px 408px, #8C4A2D 408px); border: 4px solid #0E2238; box-sizing: border-box; overflow: hidden">
            ${(v.previewStars || []).map((s, $index) => html`
              <div class="tw" style="position: absolute; left: ${s.x}px; top: ${s.y}px; width: 4px; height: 4px; background: #FFFFFF; animation-delay: ${s.d}s"></div>
            `)}
            <div style="position: absolute; left: 0; top: 10px; width: 332px; display: flex; flex-direction: column; align-items: center">
              <div class="pxb" style="max-width: 280px"><div class="pxb-in" style="background: #FFFFFF">${v.myLine}</div></div>
        <div class="pxtail"><div style="position: absolute; left: 0; top: 0; width: 3px; height: 3px; box-shadow: ${v.tailWhite}"></div></div>
              <div class="pxname" style="font-size: 18px"><span style="font-family: 'Press Start 2P', monospace; font-size: 8px; background: ${v.accent}; color: #1B1719; text-shadow: none; padding: 3px 4px; border: 2px solid #1B1719">ME</span>${v.myName}</div>
              <div class="bob" style="position: relative; width: 208px; height: 248px">
                <div role="img" aria-label="꾸미는 중인 내 캐릭터" style="position: absolute; left: 0; top: 0; width: 8px; height: 8px; box-shadow: ${v.bigFront}"></div>
              </div>
            </div>
            <div style="position: absolute; right: 14px; top: 410px; display: flex; align-items: flex-end; gap: 8px; color: #FFF4D6; font-size: 13px">
              걷는 모습
              <div class="walk" style="position: relative; width: 65px; height: 78px">
                <div class="f1" style="position: absolute; left: 0; top: 0; width: 2.5px; height: 2.5px; box-shadow: ${v.miniSide1}"></div>
                <div class="f2" style="position: absolute; left: 0; top: 0; width: 2.5px; height: 2.5px; box-shadow: ${v.miniSide2}"></div>
                <div class="f3" style="position: absolute; left: 0; top: 0; width: 2.5px; height: 2.5px; box-shadow: ${v.miniSide3}"></div>
              </div>
            </div>
          </div>
        </div>

        
        <div style="flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; gap: 14px">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <span style="font-family: 'Press Start 2P', monospace; font-size: 11px; color: #2F5E8C">STEP 2 / 2</span>
            <button type="button" class="pxbtn" onClick=${v.randomize} style="min-height: 44px; padding: 0 16px; background: #FFFFFF; border: 3px solid #0E2238; box-shadow: 0 4px 0 #0E2238; color: #0E2238; font-family: 'Jua', sans-serif; font-size: 16px">랜덤으로 꾸미기</button>
          </div>
          <h2 style="margin: 0; font-family: 'Jua', sans-serif; font-size: 30px; font-weight: 400">내 캐릭터 꾸미기</h2>
          <div role="tablist" aria-label="꾸미기 항목" style="display: flex; gap: 8px; border-bottom: 3px solid #0E2238; padding-bottom: 10px">
            ${(v.tabs || []).map((t, $index) => html`
              <button type="button" role="tab" class="pxbtn" onClick=${t.pick} aria-selected=${t.pressed} style="min-height: 44px; padding: 0 20px; background: ${t.bg}; color: ${t.fg}; border: 3px solid #0E2238; font-family: 'Jua', sans-serif; font-size: 18px">${t.label}</button>
            `)}
          </div>

          ${(v.chipGroups || []).map((g, $index) => html`
            <div style="display: flex; align-items: center; gap: 14px">
              <span style="width: 78px; flex: none; font-size: 16px; color: #46546E">${g.label}</span>
              <div style="display: flex; flex-wrap: wrap; gap: 8px">
                ${(g.items || []).map((it, $index) => html`
                  <button type="button" class="pxbtn" onClick=${it.pick} aria-pressed=${it.pressed} style="min-height: 44px; padding: 0 12px; background: ${it.bg}; border: 3px solid #0E2238; color: #0E2238; font-family: 'Jua', sans-serif; font-size: 16px; box-shadow: 0 4px 0 ${it.sh}">${it.label}</button>
                `)}
              </div>
            </div>
          `)}

          ${(v.swatchGroups || []).map((g, $index) => html`
            <div style="display: flex; align-items: center; gap: 14px">
              <span style="width: 78px; flex: none; font-size: 16px; color: #46546E">${g.label}</span>
              <div style="display: flex; flex-wrap: wrap; gap: 10px">
                ${(g.items || []).map((it, $index) => html`
                  <button type="button" class="pxbtn" onClick=${it.pick} aria-label=${it.name} aria-pressed=${it.pressed} style="width: 44px; height: 44px; background: ${it.color}; border: 3px solid #0E2238; outline: ${it.ring}; outline-offset: 3px"></button>
                `)}
              </div>
            </div>
          `)}

          <div style="display: flex; gap: 12px; margin-top: auto; padding-top: 8px">
            <button type="button" class="pxbtn" onClick=${v.goEntry} style="height: 56px; padding: 0 22px; background: #FFFFFF; border: 4px solid #0E2238; box-shadow: 0 6px 0 #0E2238; color: #0E2238; font-family: 'Jua', sans-serif; font-size: 19px">◀ 이름 다시 쓰기</button>
            <button type="button" class="pxbtn" onClick=${v.enterRoom} style="flex: 1; height: 56px; background: ${v.accent}; border: 4px solid #0E2238; box-shadow: 0 6px 0 #0E2238; color: #0E2238; font-family: 'Jua', sans-serif; font-size: 22px">이 모습으로 입장하기 ▶</button>
          </div>
        </div>
      </div>
    </div>
  ` : null}
  
  ${v.showRotate ? html`
    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: rgba(8,22,40,.88); display: flex; align-items: center; justify-content: center; z-index: 60">
      <div style="width: 760px; background: #FFF8EA; border: 6px solid #0E2238; box-shadow: 12px 12px 0 rgba(8,22,40,.6); padding: 44px 48px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; gap: 26px; color: #0E2238; text-align: center">
        <div aria-hidden="true" class="tilt" style="width: 120px; height: 200px; border: 8px solid #0E2238; border-radius: 18px; background: #1F4A6B; box-sizing: border-box; display: flex; align-items: center; justify-content: center">
          <div style="width: 40px; height: 40px; background: #FFD54A; border: 4px solid #0E2238"></div>
        </div>
        <span style="font-size: 44px">휴대폰을 가로로 돌려 주세요</span>
        <span style="font-size: 28px; line-height: 1.5; color: #46546E">가로로 보면 모임방이 화면 가득 보여요</span>
        <div style="display: flex; gap: 18px">
          ${v.canFullscreen ? html`
            <button type="button" class="pxbtn" onClick=${v.goFullscreen} style="height: 84px; padding: 0 34px; background: ${v.accent}; border: 5px solid #0E2238; box-shadow: 0 7px 0 #0E2238; color: #0E2238; font-family: 'Jua', sans-serif; font-size: 30px">가로 전체 화면으로 보기</button>
          ` : null}
          <button type="button" class="pxbtn" onClick=${v.dismissRotate} style="height: 84px; padding: 0 34px; background: #FFFFFF; border: 5px solid #0E2238; box-shadow: 0 7px 0 #0E2238; color: #0E2238; font-family: 'Jua', sans-serif; font-size: 30px">그냥 볼래요</button>
        </div>
      </div>
    </div>
  ` : null}
</div>`;
};

render(html`<${App} />`, document.getElementById('app'));
