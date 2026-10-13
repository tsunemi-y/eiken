# アルファベット なぞりがき(年長・つりずき むけ)の HTML を つくる
# 4せんの いちは Andika の じっそく(大文字 0.72em / x-height 0.51em / 下 0.24em)に あわせている
import html

LETTERS = [
    ("A", "anchor", "いかり", "⚓"), ("B", "boat", "ボート", "🚤"), ("C", "crab", "カニ", "🦀"),
    ("D", "dolphin", "イルカ", "🐬"), ("E", "eel", "ウナギ", "svg:eel"), ("F", "fish", "さかな", "🐟"),
    ("G", "goldfish", "きんぎょ", "svg:goldfish"), ("H", "hook", "つりばり", "🪝"), ("I", "ice", "こおり", "🧊"),
    ("J", "jellyfish", "クラゲ", "🪼"), ("K", "kayak", "カヤック", "🛶"), ("L", "lobster", "ロブスター", "🦞"),
    ("M", "mackerel", "サバ", "svg:saba"), ("N", "net", "あみ", "🥅"), ("O", "octopus", "タコ", "🐙"),
    ("P", "pufferfish", "フグ", "🐡"), ("Q", "queen", "じょおう", "👑"), ("R", "rod", "つりざお", "🎣"),
    ("S", "shark", "サメ", "🦈"), ("T", "tuna", "マグロ", "svg:maguro"), ("U", "umbrella", "パラソル", "⛱️"),
    ("V", "vest", "ライフジャケット", "🦺"), ("W", "whale", "クジラ", "🐋"), ("X", "x-ray fish", "すけすけの さかな", "svg:xray"),
    ("Y", "yellowtail", "ブリ", "svg:hamachi"), ("Z", "zebrafish", "ゼブラフィッシュ", "svg:zebra"),
]

F = 22.0                 # もじの おおきさ(mm)
TOP, XH, BASE, DESC = 0.76, 0.51, 0.0, 0.24
PAD = 1.6
ROW_H = PAD * 2 + (TOP + DESC) * F
CELL = 24.0
TRACE = ["#12263a", "#9aa8b6", "#bcc7d1", "#d5dde4", None, None]   # おてほん・なぞり3つ・じぶんで2つ

def staff(ch, cells=TRACE, cell=CELL, f=F):
    rh = PAD * 2 + (TOP + DESC) * f
    w = cell * len(cells)
    y_top = PAD
    y_x = PAD + (TOP - XH) * f
    y_base = PAD + TOP * f
    y_desc = PAD + (TOP + DESC) * f
    out = [f'<svg class="staff" viewBox="0 0 {w:.1f} {rh:.1f}" width="{w:.1f}mm" height="{rh:.1f}mm" xmlns="http://www.w3.org/2000/svg">']
    out.append(f'<line x1="0" x2="{w}" y1="{y_top}" y2="{y_top}" class="l1"/>')
    out.append(f'<line x1="0" x2="{w}" y1="{y_x}" y2="{y_x}" class="l2"/>')
    out.append(f'<line x1="0" x2="{w}" y1="{y_base}" y2="{y_base}" class="l3"/>')
    out.append(f'<line x1="0" x2="{w}" y1="{y_desc}" y2="{y_desc}" class="l4"/>')
    for i, col in enumerate(cells):
        cx = cell * i + cell / 2
        if i:
            out.append(f'<line x1="{cell*i}" x2="{cell*i}" y1="{y_top}" y2="{y_desc}" class="sep"/>')
        if col:
            out.append(f'<text x="{cx:.1f}" y="{y_base:.2f}" font-size="{f}" fill="{col}">{html.escape(ch)}</text>')
    out.append('</svg>')
    return "".join(out)

def pic(p):
    if p.startswith("svg:"):
        return f'<div class="pic" data-fish="{p[4:]}"></div>'
    return f'<div class="pic emo">{p}</div>'

OUTLINE_FISH = ('<svg class="color-fish" viewBox="0 0 64 30" xmlns="http://www.w3.org/2000/svg">'
                '<path d="M4 15 C12 3, 38 3, 50 15 C38 27, 12 27, 4 15 Z M48 15 L61 6 L58 15 L61 24 Z" fill="none" stroke="#5c7cfa" stroke-width="1.3" stroke-linejoin="round"/>'
                '<circle cx="12" cy="13" r="1.8" fill="#5c7cfa"/></svg>')

def block(L, word, ja, p):
    w = html.escape(word)
    first = w[0]
    return f'''<div class="block">
  <div class="left">
    {pic(p)}
    <div class="word"><b>{first}</b>{w[1:]}</div>
    <div class="ja">{ja}</div>
    <div class="reward">{OUTLINE_FISH}<span>できたら ぬってね</span></div>
  </div>
  <div class="rows">
    <div class="row"><span class="tag">おおもじ</span>{staff(L)}</div>
    <div class="row"><span class="tag">こもじ</span>{staff(L.lower())}</div>
  </div>
</div>'''

pages = []
chunks = [LETTERS[i:i + 4] for i in range(0, 26, 4)]
for n, ch in enumerate(chunks, 1):
    rng = f"{ch[0][0]}〜{ch[-1][0]}"
    body = "\n".join(block(*x) for x in ch)
    extra = ""
    if n == len(chunks):
        up1, up2 = "ABCDEFGHIJKLM", "NOPQRSTUVWXYZ"
        cells_small = ["#b4c0cc"] * 13
        def line(s):
            # 1もじずつ ちがう もじを ならべる ため、staff を 1もじごとに つなぐ
            return "".join(staff(c, ["#b4c0cc"], cell=13.6, f=11.5) for c in s)
        extra = f'''<div class="review">
  <h2>🏆 さいごに ぜんぶ なぞろう!</h2>
  <div class="rv">{line(up1)}</div><div class="rv">{line(up2)}</div>
  <div class="rv">{line(up1.lower())}</div><div class="rv">{line(up2.lower())}</div>
</div>'''
    pages.append(f'''<section class="page">
  <header><h1>🎣 アルファベット なぞりがき <span class="no">{n}</span> <span class="rng">{rng}</span></h1>
  <div class="name">なまえ <span></span></div></header>
  <p class="how">いちばん ひだりの くろい もじを 見て、うすい もじを なぞろう。さいごの 2つは じぶんで かいてね。<span class="red">あかい せん</span>の うえに のせるよ!</p>
  {body}
  {extra}
</section>''')

tpl = open("/home/user/eiken/print/abc-tpl.html", encoding="utf-8").read()
open("/home/user/eiken/print/abc.html", "w", encoding="utf-8").write(tpl.replace("{{PAGES}}", "\n".join(pages)))
print(len(pages), "pages")
