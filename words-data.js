/* =========================================================
   えいけんマイクラ 5きゅう - たんごデータ
   パス単5級の じゅんばん(1〜150)どおりに ならんでいます。
   10ごずつ「ワールド」に わけられます(じどうけいさん)。
   ========================================================= */

/* ---- ワールド(ゾーン)のテーマ:マイクラの ブロックが すすんでいく ---- */
const ZONE_THEMES = [
  { name: "くさはら",       icon: "🟩", color: "#5EA827", dark: "#3E7A19" },
  { name: "もりのなか",     icon: "🌳", color: "#6B8E23", dark: "#4A631A" },
  { name: "すなはま",       icon: "🟨", color: "#D9C38A", dark: "#B09A62" },
  { name: "いしのどうくつ", icon: "⬜", color: "#9A9A9A", dark: "#6E6E6E" },
  { name: "せきたんこう",   icon: "⬛", color: "#4A4A4A", dark: "#2C2C2C" },
  { name: "どうこうせき",   icon: "🟧", color: "#C87137", dark: "#94511F" },
  { name: "てつこうせき",   icon: "🤍", color: "#D8AF93", dark: "#A57F63" },
  { name: "きんこうせき",   icon: "🟨", color: "#FCEE4B", dark: "#C2B41C" },
  { name: "レッドストーン", icon: "🟥", color: "#E03434", dark: "#9E1D1D" },
  { name: "ラピスラズリ",   icon: "🟦", color: "#2D5FCE", dark: "#1B3E92" },
  { name: "エメラルド",     icon: "💚", color: "#17DD62", dark: "#0E9E44" },
  { name: "ダイヤモンド",   icon: "💎", color: "#4AEDD9", dark: "#26AA9B" },
  { name: "ネザー",         icon: "🔥", color: "#B02E26", dark: "#6E1712" },
  { name: "エンド",         icon: "🟪", color: "#8C5FCF", dark: "#5C3A8C" },
  { name: "エンダードラゴン", icon: "🐉", color: "#22162B", dark: "#120B17" },
];

const WORD_LIST = [
  // ===== 1〜10 =====
  { en: "house", ja: "いえ,じゅうたく", emoji: "🏠", ex: "This is my house.", exJa: "これは わたしの いえです。" },
  { en: "book", ja: "ほん", emoji: "📕", ex: "I read a book.", exJa: "わたしは ほんを よみます。" },
  { en: "room", ja: "へや", emoji: "🚪", ex: "This is my room.", exJa: "これは わたしの へやです。" },
  { en: "home", ja: "いえ,かてい / いえへ", emoji: "🏡", ex: "I go home at five.", exJa: "わたしは 5じに いえへ かえります。" },
  { en: "table", ja: "テーブル", emoji: "🪑", ex: "The cat is on the table.", exJa: "ねこが テーブルの うえに います。" },
  { en: "picture", ja: "え,しゃしん", emoji: "🖼️", ex: "I like this picture.", exJa: "わたしは この えが すきです。" },
  { en: "computer", ja: "コンピューター", emoji: "💻", ex: "I use a computer.", exJa: "わたしは コンピューターを つかいます。" },
  { en: "box", ja: "はこ", emoji: "📦", ex: "What is in the box?", exJa: "はこの なかに なにが ありますか。" },
  { en: "TV", ja: "テレビ", emoji: "📺", ex: "I watch TV every day.", exJa: "わたしは まいにち テレビを みます。" },
  { en: "cap", ja: "ぼうし,ふた", emoji: "🧢", ex: "I have a blue cap.", exJa: "わたしは あおい ぼうしを もっています。" },

  // ===== 11〜20 =====
  { en: "bag", ja: "バッグ,かばん,ふくろ", emoji: "👜", ex: "My bag is new.", exJa: "わたしの かばんは あたらしいです。" },
  { en: "letter", ja: "てがみ,もじ", emoji: "✉️", ex: "I write a letter.", exJa: "わたしは てがみを かきます。" },
  { en: "bed", ja: "ベッド", emoji: "🛏️", ex: "The cat is on my bed.", exJa: "ねこが わたしの ベッドに います。" },
  { en: "camera", ja: "カメラ", emoji: "📷", ex: "This is my camera.", exJa: "これは わたしの カメラです。" },
  { en: "door", ja: "ドア,と", emoji: "🚪", ex: "Please open the door.", exJa: "ドアを あけて ください。" },
  { en: "pet", ja: "ペット", emoji: "🐕‍🦺", ex: "I have a pet.", exJa: "わたしは ペットを かっています。" },
  { en: "T-shirt", ja: "Ｔシャツ", emoji: "👕", ex: "I like this T-shirt.", exJa: "わたしは この Tシャツが すきです。" },
  { en: "window", ja: "まど", emoji: "🪟", ex: "Please close the window.", exJa: "まどを しめて ください。" },
  { en: "e-mail", ja: "でんしメール,Eメール", emoji: "📧", ex: "I write an e-mail.", exJa: "わたしは Eメールを かきます。" },
  { en: "bath", ja: "ふろ", emoji: "🛁", ex: "I take a bath at eight.", exJa: "わたしは 8じに おふろに はいります。" },

  // ===== 21〜30 =====
  { en: "watch", ja: "うでどけい", emoji: "⌚", ex: "This watch is new.", exJa: "この うでどけいは あたらしいです。" },
  { en: "comic book", ja: "マンガぼん", emoji: "🦸", ex: "I read comic books.", exJa: "わたしは マンガを よみます。" },
  { en: "umbrella", ja: "かさ", emoji: "☂️", ex: "I have an umbrella.", exJa: "わたしは かさを もっています。" },
  { en: "today", ja: "きょう", emoji: "📅", ex: "Today is Monday.", exJa: "きょうは げつようびです。" },
  { en: "tomorrow", ja: "あした", emoji: "📆", ex: "See you tomorrow.", exJa: "また あした。" },
  { en: "day", ja: "ひ,1にち", emoji: "☀️", ex: "It is a nice day.", exJa: "いい ひ ですね。" },
  { en: "morning", ja: "あさ,ごぜん", emoji: "🌅", ex: "Good morning!", exJa: "おはよう ございます!" },
  { en: "afternoon", ja: "ごご", emoji: "🌤️", ex: "Good afternoon!", exJa: "こんにちは!" },
  { en: "evening", ja: "ゆうがた,ばん", emoji: "🌆", ex: "Good evening!", exJa: "こんばんは!" },
  { en: "night", ja: "よる", emoji: "🌙", ex: "Good night!", exJa: "おやすみなさい!" },

  // ===== 31〜40 =====
  { en: "time", ja: "じかん,じこく", emoji: "⏰", ex: "What time is it?", exJa: "なんじですか。" },
  { en: "hour", ja: "1じかん", emoji: "🕐", ex: "I study for one hour.", exJa: "わたしは 1じかん べんきょうします。" },
  { en: "noon", ja: "しょうご", emoji: "🕛", ex: "I eat lunch at noon.", exJa: "わたしは しょうごに ひるごはんを たべます。" },
  { en: "date", ja: "ひづけ", emoji: "🗒️", ex: "What is the date today?", exJa: "きょうは なんにちですか。" },
  { en: "week", ja: "しゅう,1しゅうかん", emoji: "🗓️", ex: "See you next week.", exJa: "また らいしゅう。" },
  { en: "weekend", ja: "しゅうまつ", emoji: "🎉", ex: "I play soccer on weekends.", exJa: "わたしは しゅうまつに サッカーを します。" },
  { en: "year", ja: "とし,がくねん,～さい", emoji: "🎊", ex: "I am eight years old.", exJa: "わたしは 8さいです。" },
  { en: "school", ja: "がっこう", emoji: "🏫", ex: "I go to school by bus.", exJa: "わたしは バスで がっこうへ いきます。" },
  { en: "textbook", ja: "きょうかしょ", emoji: "📗", ex: "Open your textbook.", exJa: "きょうかしょを ひらいて。" },
  { en: "class", ja: "じゅぎょう,クラス", emoji: "🧑‍🏫", ex: "I like English class.", exJa: "わたしは えいごの じゅぎょうが すきです。" },

  // ===== 41〜50 =====
  { en: "pen", ja: "ペン", emoji: "🖊️", ex: "This is my pen.", exJa: "これは わたしの ペンです。" },
  { en: "homework", ja: "しゅくだい", emoji: "📝", ex: "I do my homework.", exJa: "わたしは しゅくだいを します。" },
  { en: "name", ja: "なまえ", emoji: "🏷️", ex: "My name is Ken.", exJa: "わたしの なまえは ケンです。" },
  { en: "math", ja: "すうがく,さんすう", emoji: "🧮", ex: "I like math.", exJa: "わたしは さんすうが すきです。" },
  { en: "student", ja: "せいと,がくせい", emoji: "🧑‍🎓", ex: "I am a student.", exJa: "わたしは せいとです。" },
  { en: "teacher", ja: "せんせい,きょうし", emoji: "🧑‍🏫", ex: "My teacher is kind.", exJa: "わたしの せんせいは やさしいです。" },
  { en: "pencil", ja: "えんぴつ", emoji: "✏️", ex: "I have two pencils.", exJa: "わたしは えんぴつを 2ほん もっています。" },
  { en: "club", ja: "クラブ,ぶ", emoji: "🎽", ex: "I am in the soccer club.", exJa: "わたしは サッカーぶに はいっています。" },
  { en: "eraser", ja: "けしゴム", emoji: "🧽", ex: "This is my eraser.", exJa: "これは わたしの けしゴムです。" },
  { en: "dictionary", ja: "じしょ,じてん", emoji: "📔", ex: "I use a dictionary.", exJa: "わたしは じしょを つかいます。" },

  // ===== 51〜60 =====
  { en: "gym", ja: "たいいくかん,たいいく", emoji: "🏋️", ex: "We play in the gym.", exJa: "わたしたちは たいいくかんで あそびます。" },
  { en: "science", ja: "かがく,りか", emoji: "🔬", ex: "I like science.", exJa: "わたしは りかが すきです。" },
  { en: "classroom", ja: "きょうしつ", emoji: "🪑", ex: "This is our classroom.", exJa: "これは わたしたちの きょうしつです。" },
  { en: "notebook", ja: "ノート", emoji: "📓", ex: "I write in my notebook.", exJa: "わたしは ノートに かきます。" },
  { en: "art", ja: "げいじゅつ,びじゅつ", emoji: "🎨", ex: "I like art class.", exJa: "わたしは びじゅつが すきです。" },
  { en: "classmate", ja: "どうきゅうせい", emoji: "🧑‍🤝‍🧑", ex: "He is my classmate.", exJa: "かれは わたしの どうきゅうせいです。" },
  { en: "number", ja: "かず,すうじ,ばんごう", emoji: "🔢", ex: "What is your number?", exJa: "あなたの ばんごうは なんばんですか。" },
  { en: "subject", ja: "かもく,きょうか", emoji: "🧾", ex: "My favorite subject is math.", exJa: "わたしの すきな かもくは さんすうです。" },
  { en: "story", ja: "ものがたり,はなし", emoji: "📜", ex: "I like this story.", exJa: "わたしは この ものがたりが すきです。" },
  { en: "friend", ja: "ともだち", emoji: "👫", ex: "She is my friend.", exJa: "かのじょは わたしの ともだちです。" },

  // ===== 61〜70 =====
  { en: "boy", ja: "おとこのこ", emoji: "👦", ex: "That boy is my brother.", exJa: "あの おとこのこは わたしの きょうだいです。" },
  { en: "girl", ja: "おんなのこ", emoji: "👧", ex: "That girl is my friend.", exJa: "あの おんなのこは わたしの ともだちです。" },
  { en: "player", ja: "せんしゅ,する人", emoji: "🏃", ex: "He is a soccer player.", exJa: "かれは サッカーせんしゅです。" },
  { en: "man", ja: "おとこの人,だんせい", emoji: "👨", ex: "That man is my teacher.", exJa: "あの おとこの人は わたしの せんせいです。" },
  { en: "woman", ja: "おんなの人,じょせい", emoji: "👩", ex: "That woman is a doctor.", exJa: "あの おんなの人は いしゃです。" },
  { en: "people", ja: "ひとびと,こくみん", emoji: "👥", ex: "Many people are here.", exJa: "たくさんの 人が ここに います。" },
  { en: "singer", ja: "かしゅ", emoji: "🎤", ex: "She is a famous singer.", exJa: "かのじょは ゆうめいな かしゅです。" },
  { en: "park", ja: "こうえん", emoji: "🏞️", ex: "I play in the park.", exJa: "わたしは こうえんで あそびます。" },
  { en: "train", ja: "れっしゃ,でんしゃ", emoji: "🚃", ex: "I go by train.", exJa: "わたしは でんしゃで いきます。" },
  { en: "bus", ja: "バス", emoji: "🚌", ex: "I take the bus.", exJa: "わたしは バスに のります。" },

  // ===== 71〜80 =====
  { en: "library", ja: "としょかん,としょしつ", emoji: "📚", ex: "I study in the library.", exJa: "わたしは としょかんで べんきょうします。" },
  { en: "car", ja: "くるま,じどうしゃ", emoji: "🚗", ex: "My father has a car.", exJa: "わたしの ちちは くるまを もっています。" },
  { en: "movie", ja: "えいが", emoji: "🎬", ex: "I like this movie.", exJa: "わたしは この えいがが すきです。" },
  { en: "restaurant", ja: "レストラン,りょうりてん", emoji: "🍴", ex: "We eat at a restaurant.", exJa: "わたしたちは レストランで たべます。" },
  { en: "station", ja: "えき", emoji: "🚉", ex: "I go to the station.", exJa: "わたしは えきへ いきます。" },
  { en: "shop", ja: "みせ", emoji: "🏪", ex: "This shop is new.", exJa: "この みせは あたらしいです。" },
  { en: "zoo", ja: "どうぶつえん", emoji: "🦁", ex: "I go to the zoo.", exJa: "わたしは どうぶつえんへ いきます。" },
  { en: "city", ja: "とし,し", emoji: "🏙️", ex: "I live in a big city.", exJa: "わたしは おおきな まちに すんでいます。" },
  { en: "museum", ja: "はくぶつかん,びじゅつかん", emoji: "🏛️", ex: "I go to the museum.", exJa: "わたしは はくぶつかんへ いきます。" },
  { en: "hospital", ja: "びょういん", emoji: "🏥", ex: "My mother works at a hospital.", exJa: "わたしの ははは びょういんで はたらいています。" },

  // ===== 81〜90 =====
  { en: "street", ja: "とおり,がいろ", emoji: "🛣️", ex: "This street is long.", exJa: "この とおりは ながいです。" },
  { en: "breakfast", ja: "ちょうしょく,あさごはん", emoji: "🥞", ex: "I eat breakfast at seven.", exJa: "わたしは 7じに あさごはんを たべます。" },
  { en: "lunch", ja: "ちゅうしょく,ひるごはん", emoji: "🍱", ex: "I have lunch at school.", exJa: "わたしは がっこうで ひるごはんを たべます。" },
  { en: "dinner", ja: "ゆうしょく,ばんごはん", emoji: "🍽️", ex: "We eat dinner together.", exJa: "わたしたちは いっしょに ばんごはんを たべます。" },
  { en: "cake", ja: "ケーキ", emoji: "🍰", ex: "I like chocolate cake.", exJa: "わたしは チョコレートケーキが すきです。" },
  { en: "apple", ja: "リンゴ", emoji: "🍎", ex: "I eat an apple.", exJa: "わたしは リンゴを たべます。" },
  { en: "food", ja: "たべもの", emoji: "🍲", ex: "My favorite food is curry.", exJa: "わたしの すきな たべものは カレーです。" },
  { en: "ice cream", ja: "アイスクリーム", emoji: "🍦", ex: "I want ice cream.", exJa: "わたしは アイスクリームが ほしいです。" },
  { en: "sandwich", ja: "サンドイッチ", emoji: "🥪", ex: "I eat a sandwich.", exJa: "わたしは サンドイッチを たべます。" },
  { en: "rice", ja: "こめ,ごはん", emoji: "🍚", ex: "I eat rice every day.", exJa: "わたしは まいにち ごはんを たべます。" },

  // ===== 91〜100 =====
  { en: "coffee", ja: "コーヒー", emoji: "☕", ex: "My father drinks coffee.", exJa: "わたしの ちちは コーヒーを のみます。" },
  { en: "milk", ja: "ミルク,ぎゅうにゅう", emoji: "🥛", ex: "I drink milk.", exJa: "わたしは ぎゅうにゅうを のみます。" },
  { en: "juice", ja: "ジュース", emoji: "🧃", ex: "I like orange juice.", exJa: "わたしは オレンジジュースが すきです。" },
  { en: "curry", ja: "カレー", emoji: "🍛", ex: "I like curry.", exJa: "わたしは カレーが すきです。" },
  { en: "egg", ja: "たまご", emoji: "🥚", ex: "I eat two eggs.", exJa: "わたしは たまごを 2こ たべます。" },
  { en: "orange", ja: "オレンジ / オレンジいろ", emoji: "🍊", ex: "I like oranges.", exJa: "わたしは オレンジが すきです。" },
  { en: "brother", ja: "あに,おとうと,きょうだい", emoji: "👬", ex: "I have a brother.", exJa: "わたしには きょうだいが います。" },
  { en: "sister", ja: "あね,いもうと,しまい", emoji: "👭", ex: "My sister is ten.", exJa: "わたしの しまいは 10さいです。" },
  { en: "father", ja: "ちち", emoji: "🧔", ex: "My father is a teacher.", exJa: "わたしの ちちは せんせいです。" },
  { en: "mother", ja: "はは", emoji: "👩‍🦰", ex: "My mother is kind.", exJa: "わたしの ははは やさしいです。" },

  // ===== 101〜110 =====
  { en: "family", ja: "かぞく", emoji: "👨‍👩‍👧‍👦", ex: "I love my family.", exJa: "わたしは かぞくが だいすきです。" },
  { en: "aunt", ja: "おば", emoji: "👩‍🦳", ex: "My aunt lives in Tokyo.", exJa: "わたしの おばは とうきょうに すんでいます。" },
  { en: "uncle", ja: "おじ", emoji: "👨‍🦳", ex: "My uncle is a cook.", exJa: "わたしの おじは りょうりにんです。" },
  { en: "daughter", ja: "むすめ", emoji: "🧒", ex: "This is my daughter.", exJa: "これは わたしの むすめです。" },
  { en: "son", ja: "むすこ", emoji: "👦", ex: "This is my son.", exJa: "これは わたしの むすこです。" },
  { en: "tennis", ja: "テニス", emoji: "🎾", ex: "I play tennis on Sundays.", exJa: "わたしは にちようびに テニスを します。" },
  { en: "baseball", ja: "やきゅう", emoji: "⚾", ex: "I like baseball.", exJa: "わたしは やきゅうが すきです。" },
  { en: "game", ja: "ゲーム,しあい", emoji: "🎮", ex: "Let's play a game.", exJa: "ゲームを しましょう。" },
  { en: "soccer", ja: "サッカー", emoji: "⚽", ex: "I play soccer after school.", exJa: "わたしは ほうかご サッカーを します。" },
  { en: "sport", ja: "スポーツ", emoji: "🏅", ex: "My favorite sport is soccer.", exJa: "わたしの すきな スポーツは サッカーです。" },

  // ===== 111〜120 =====
  { en: "bike", ja: "じてんしゃ", emoji: "🚲", ex: "I go by bike.", exJa: "わたしは じてんしゃで いきます。" },
  { en: "basketball", ja: "バスケットボール", emoji: "🏀", ex: "I play basketball.", exJa: "わたしは バスケットボールを します。" },
  { en: "team", ja: "チーム", emoji: "🧑‍🤝‍🧑", ex: "I am on the soccer team.", exJa: "わたしは サッカーチームに はいっています。" },
  { en: "volleyball", ja: "バレーボール", emoji: "🏐", ex: "She plays volleyball.", exJa: "かのじょは バレーボールを します。" },
  { en: "ball", ja: "ボール", emoji: "🥎", ex: "I have a new ball.", exJa: "わたしは あたらしい ボールを もっています。" },
  { en: "dog", ja: "いぬ", emoji: "🐶", ex: "I have a dog.", exJa: "わたしは いぬを かっています。" },
  { en: "bird", ja: "とり", emoji: "🐦", ex: "I see a bird.", exJa: "とりが みえます。" },
  { en: "cat", ja: "ねこ", emoji: "🐱", ex: "My cat is white.", exJa: "わたしの ねこは しろいです。" },
  { en: "tree", ja: "き", emoji: "🌳", ex: "The tree is very big.", exJa: "その きは とても おおきいです。" },
  { en: "animal", ja: "どうぶつ", emoji: "🐾", ex: "I like animals.", exJa: "わたしは どうぶつが すきです。" },

  // ===== 121〜130 =====
  { en: "fish", ja: "さかな", emoji: "🐟", ex: "I like fish.", exJa: "わたしは さかなが すきです。" },
  { en: "mountain", ja: "やま", emoji: "⛰️", ex: "That mountain is high.", exJa: "あの やまは たかいです。" },
  { en: "rabbit", ja: "うさぎ", emoji: "🐰", ex: "The rabbit is cute.", exJa: "うさぎは かわいいです。" },
  { en: "water", ja: "みず", emoji: "💧", ex: "I drink water.", exJa: "わたしは みずを のみます。" },
  { en: "Sunday", ja: "にちようび", emoji: "☀️", ex: "I play tennis on Sunday.", exJa: "わたしは にちようびに テニスを します。" },
  { en: "Monday", ja: "げつようび", emoji: "🌙", ex: "I go to school on Monday.", exJa: "わたしは げつようびに がっこうへ いきます。" },
  { en: "Tuesday", ja: "かようび", emoji: "🔥", ex: "We have music on Tuesday.", exJa: "かようびに おんがくが あります。" },
  { en: "Wednesday", ja: "すいようび", emoji: "💧", ex: "I swim on Wednesday.", exJa: "わたしは すいようびに およぎます。" },
  { en: "Thursday", ja: "もくようび", emoji: "🌳", ex: "We have art on Thursday.", exJa: "もくようびに びじゅつが あります。" },
  { en: "Friday", ja: "きんようび", emoji: "🪙", ex: "I like Friday.", exJa: "わたしは きんようびが すきです。" },

  // ===== 131〜140 =====
  { en: "Saturday", ja: "どようび", emoji: "🪨", ex: "I play soccer on Saturday.", exJa: "わたしは どようびに サッカーを します。" },
  { en: "month", ja: "つき(こよみの),1かげつ", emoji: "🗓️", ex: "This month is May.", exJa: "こんげつは 5がつです。" },
  { en: "January", ja: "1がつ", emoji: "🎍", ex: "It is cold in January.", exJa: "1がつは さむいです。" },
  { en: "February", ja: "2がつ", emoji: "👹", ex: "My birthday is in February.", exJa: "わたしの たんじょうびは 2がつです。" },
  { en: "March", ja: "3がつ", emoji: "🎎", ex: "It is warm in March.", exJa: "3がつは あたたかいです。" },
  { en: "April", ja: "4がつ", emoji: "🌸", ex: "School starts in April.", exJa: "がっこうは 4がつに はじまります。" },
  { en: "May", ja: "5がつ", emoji: "🎏", ex: "I like May.", exJa: "わたしは 5がつが すきです。" },
  { en: "June", ja: "6がつ", emoji: "☔", ex: "It rains in June.", exJa: "6がつは あめが ふります。" },
  { en: "July", ja: "7がつ", emoji: "🎋", ex: "It is hot in July.", exJa: "7がつは あついです。" },
  { en: "August", ja: "8がつ", emoji: "🎆", ex: "I swim in August.", exJa: "わたしは 8がつに およぎます。" },

  // ===== 141〜150 =====
  { en: "September", ja: "9がつ", emoji: "🌕", ex: "School starts in September.", exJa: "がっこうは 9がつに はじまります。" },
  { en: "October", ja: "10がつ", emoji: "🎃", ex: "The test is in October.", exJa: "テストは 10がつです。" },
  { en: "November", ja: "11がつ", emoji: "🍁", ex: "It is cool in November.", exJa: "11がつは すずしいです。" },
  { en: "December", ja: "12がつ", emoji: "🎄", ex: "It is cold in December.", exJa: "12がつは さむいです。" },
  { en: "color", ja: "いろ", emoji: "🌈", ex: "What color do you like?", exJa: "なにいろが すきですか。" },
  { en: "blue", ja: "あおい,あお", emoji: "🔵", ex: "The sky is blue.", exJa: "そらは あおいです。" },
  { en: "black", ja: "くろい,くろ", emoji: "⚫", ex: "I have a black bag.", exJa: "わたしは くろい かばんを もっています。" },
  { en: "red", ja: "あかい,あか", emoji: "🔴", ex: "I like red.", exJa: "わたしは あかが すきです。" },
  { en: "white", ja: "しろい,しろ", emoji: "⚪", ex: "The snow is white.", exJa: "ゆきは しろいです。" },
  { en: "pink", ja: "ピンクいろ", emoji: "🩷", ex: "I like pink.", exJa: "わたしは ピンクが すきです。" },
];

/* =========================================================
   イメージずかい
   week / year みたいな「絵に しにくい ことば」を
   ブロックを ならべて 目で わかるように します。
   ========================================================= */
const VISUALS = {
  // --- じかん ---
  day:       { icons: ["🌅","☀️","🌆","🌙"], label: "あさ→ひる→ゆうがた→よる = 1にち" },
  morning:   { icons: ["🌅","☀️","🌆","🌙"], hi: [0],       label: "1にちの さいしょ" },
  afternoon: { icons: ["🌅","☀️","🌆","🌙"], hi: [1],       label: "おひるの あと" },
  evening:   { icons: ["🌅","☀️","🌆","🌙"], hi: [2],       label: "ひが しずむ ころ" },
  night:     { icons: ["🌅","☀️","🌆","🌙"], hi: [3],       label: "ねる じかん" },
  noon:      { icons: ["🌅","☀️","🌆","🌙"], hi: [1],       label: "ちょうど 12じ" },
  hour:      { icons: ["🕐","🕑","🕒","🕓"], hi: [0],       label: "1つぶん = 1じかん" },
  time:      { icons: ["🕐","🕒","🕕","🕘"], label: "とけいが さす「じかん」" },
  date:      { icons: ["1️⃣","2️⃣","3️⃣","4️⃣"], hi: [2],    label: "なんにち かの「ひづけ」" },
  week:      { icons: ["☀️","🌙","🔥","💧","🌳","🪙","🪨"], label: "にち・げつ・か・すい・もく・きん・ど = 7日で 1しゅう" },
  weekend:   { icons: ["☀️","🌙","🔥","💧","🌳","🪙","🪨"], hi: [0, 6], label: "1しゅうの おわり(ど・にち)" },
  month:     { icons: ["🗓️","🗓️","🗓️","🗓️"], hi: [0],     label: "1まいぶん = 1かげつ(30日ぐらい)" },
  year:      { icons: ["🎍","👹","🎎","🌸","🎏","☔","🎋","🎆","🌕","🎃","🍁","🎄"], label: "1がつ〜12がつ ぜんぶで 1ねん" },
  today:     { icons: ["⬅️","📅","➡️"], hi: [1],            label: "いまの ひ" },
  tomorrow:  { icons: ["⬅️","📅","➡️"], hi: [2],            label: "きょうの つぎの ひ" },

  // --- 人・あつまり ---
  people:    { icons: ["👦","👧","👨","👩","👴","👵"], label: "たくさんの 人" },
  family:    { icons: ["👴","👩","🧔","👦"], label: "おなじ いえに いる 人たち" },
  team:      { icons: ["👦","👧","👦","👧"], label: "いっしょに たたかう なかま" },
  classmate: { icons: ["🧑‍🏫","👦","👧","👦"], hi: [1, 2, 3], label: "おなじ クラスの ともだち" },
  player:    { icons: ["⚽","🏃","🏆"], label: "スポーツを する 人" },
  friend:    { icons: ["👦","🤝","👧"], label: "なかよしの 人" },

  // --- がっこう ---
  class:     { icons: ["🧑‍🏫","👦","👧","👦"], label: "みんなで べんきょうする じかん" },
  subject:   { icons: ["🧮","🔬","🎨","🎵"], label: "さんすう・りか・びじゅつ… の なかま" },
  club:      { icons: ["⚽","🎾","🎨","🎵"], label: "ほうかごに する かつどう" },
  gym:       { icons: ["🏫","🏀","🏃","🤸"], label: "たいいくを する ばしょ" },
  homework:  { icons: ["🏫","➡️","🏠","📝"], label: "いえで やる べんきょう" },
  name:      { icons: ["🏷️","🅚","🅔","🅝"], label: "「ケン」みたいな よびな" },
  number:    { icons: ["1️⃣","2️⃣","3️⃣","4️⃣"], label: "かず・すうじ" },
  story:     { icons: ["📜","🐉","🏰","✨"], label: "おはなし・ものがたり" },

  // --- ようす・まとまり ---
  food:      { icons: ["🍚","🍞","🍎","🍰"], label: "たべる もの ぜんぶ" },
  animal:    { icons: ["🐶","🐱","🐰","🐦"], label: "いきものの なかま" },
  sport:     { icons: ["⚽","⚾","🎾","🏀"], label: "スポーツの なかま" },
  color:     { icons: ["🔴","🔵","🟡","🟢"], label: "いろの なかま" },
  game:      { icons: ["🎮","⚽","🏆"], label: "あそび・しあい" },
  home:      { icons: ["🏠","👨‍👩‍👧‍👦","❤️"], label: "かえる ばしょ・かぞくの いえ" },
  city:      { icons: ["🏙️","🏢","🚗","🏪"], label: "たてものが たくさんの まち" },
  street:    { icons: ["🏠","🛣️","🏪"], label: "たてものの あいだの みち" },
};

/* ---- ゾーンは 10ごずつ じどうで わりあて ---- */
WORD_LIST.forEach((w, i) => {
  w.id = i;
  w.no = i + 1;             // パス単の たんごばんごう
  w.zone = Math.floor(i / 10) + 1;
  if (VISUALS[w.en]) w.vis = VISUALS[w.en];
});

const TOTAL_ZONES = Math.ceil(WORD_LIST.length / 10);

function zoneTheme(zoneId) {
  return ZONE_THEMES[(zoneId - 1) % ZONE_THEMES.length];
}

/* =========================================================
   チャプター(パス単プリントと おなじ 30ごずつの まとまり)
   1チャプター = 3ゾーン
   ========================================================= */
const CHAPTERS = [];
for (let c = 0; c * 30 < WORD_LIST.length; c++) {
  const from = c * 30 + 1;
  const to = Math.min((c + 1) * 30, WORD_LIST.length);
  CHAPTERS.push({
    id: c + 1,
    from,
    to,
    title: `${from}〜${to}ばん`,
    zones: Array.from(
      { length: Math.ceil((to - from + 1) / 10) },
      (_, i) => Math.floor((from - 1) / 10) + 1 + i
    ),
  });
}

function wordsInChapter(chapterId) {
  const ch = CHAPTERS[chapterId - 1];
  return WORD_LIST.filter((w) => w.no >= ch.from && w.no <= ch.to);
}
