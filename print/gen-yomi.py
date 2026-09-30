import random, html
W = [
 # (en, kana, ja, cat)
 ("spring","スプリング","はる","s"),("summer","サマー","なつ","s"),("fall","フォール","あき","s"),("winter","ウィンター","ふゆ","s"),
 ("January","ジャニュアリー","1がつ","m"),("February","フェブルアリー","2がつ","m"),("March","マーチ","3がつ","m"),("April","エイプリル","4がつ","m"),
 ("May","メイ","5がつ","m"),("June","ジューン","6がつ","m"),("July","ジュライ","7がつ","m"),("August","オーガスト","8がつ","m"),
 ("September","セプテンバー","9がつ","m"),("October","オクトーバー","10がつ","m"),("November","ノベンバー","11がつ","m"),("December","ディセンバー","12がつ","m"),
 ("Sunday","サンデー","にちようび","d"),("Monday","マンデー","げつようび","d"),("Tuesday","チューズデー","かようび","d"),("Wednesday","ウェンズデー","すいようび","d"),
 ("Thursday","サーズデー","もくようび","d"),("Friday","フライデー","きんようび","d"),("Saturday","サタデー","どようび","d"),
 ("what","ワット","なに","q"),("who","フー","だれ","q"),("where","ウェア","どこ","q"),("when","ウェン","いつ","q"),
 ("whose","フーズ","だれの","q"),("which","ウィッチ","どちら","q"),("why","ワイ","なぜ","q"),("how","ハウ","どう・どのように","q"),
 ("what time","ワット タイム","なんじ","q"),("what day","ワット デイ","なんようび","q"),("what color","ワット カラー","なにいろ","q"),
 ("how many","ハウ メニー","いくつ","q"),("how old","ハウ オールド","なんさい","q"),("how much","ハウ マッチ","いくら","q"),
]
# ならびを まぜる。なかまどうし(曜日・月…)が となりや 上下で つづかないように する
COLS = 3
def ok(seq):
    for i,w in enumerate(seq):
        if i>0 and seq[i-1][3]==w[3] and w[3]!="q": return False          # よこ・つぎの ばんごう
        if i>=COLS and seq[i-COLS][3]==w[3] and w[3]!="q": return False    # 上下
        # 月どうし・曜日どうしで 番号が つづく ならびも さける
    names=[w[0] for w in seq]
    for i in range(len(seq)-1):
        a,b=seq[i],seq[i+1]
        if a[0].split()[0]==b[0].split()[0]: return False               # what と what time が となり
    return True
rnd = random.Random(20261004)
while True:
    seq = W[:]; rnd.shuffle(seq)
    if ok(seq): break
e = html.escape
qcells = "".join(f'<div class="qc"><span class="no">{i+1}</span><span class="en">{e(w[0])}</span><span class="chk">よみ□ いみ□</span></div>' for i,w in enumerate(seq))
acells = "".join(f'<div class="ac"><span class="no">{i+1}</span><span class="en">{e(w[0])}</span><span class="kana">{w[1]}</span><span class="ja">{w[2]}</span></div>' for i,w in enumerate(seq))
tpl = open("/home/user/eiken/print/yomi-tpl.html").read()
open("/home/user/eiken/print/yomi.html","w").write(tpl.replace("{{Q}}",qcells).replace("{{A}}",acells).replace("{{N}}",str(len(seq))))
print(len(seq), [w[0] for w in seq])
