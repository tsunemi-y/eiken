/* =========================================================
   えいけんマイクラ 5きゅう - たんごデータ
   パス単5級の じゅんばん(1〜150)どおりに ならんでいます。
   ========================================================= */

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
  { en: "watch", ja: "うでどけい", kana: ["みる"], emoji: "⌚", ex: "This watch is new.", exJa: "この うでどけいは あたらしいです。" },
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
  { en: "player", ja: "せんしゅ,する人", kana: ["するひと"], emoji: "🏃", ex: "He is a soccer player.", exJa: "かれは サッカーせんしゅです。" },
  { en: "man", ja: "おとこの人,だんせい", kana: ["おとこのひと"], emoji: "👨", ex: "That man is my teacher.", exJa: "あの おとこの人は わたしの せんせいです。" },
  { en: "woman", ja: "おんなの人,じょせい", kana: ["おんなのひと"], emoji: "👩", ex: "That woman is a doctor.", exJa: "あの おんなの人は いしゃです。" },
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

  // ===== 151〜160 =====
  { en: "green", ja: "みどりの,みどり", emoji: "🟢", ex: "I like green.", exJa: "わたしは みどりが すきです。" },
  { en: "yellow", ja: "きいろの,きいろ", emoji: "🟡", ex: "I like yellow.", exJa: "わたしは きいろが すきです。" },
  { en: "brown", ja: "ちゃいろ,ちゃいろの", emoji: "🟤", ex: "My dog is brown.", exJa: "わたしの いぬは ちゃいろです。" },
  { en: "music", ja: "おんがく", emoji: "🎵", ex: "I like music.", exJa: "わたしは おんがくが すきです。" },
  { en: "piano", ja: "ピアノ", emoji: "🎹", ex: "I play the piano.", exJa: "わたしは ピアノを ひきます。" },
  { en: "song", ja: "うた", emoji: "🎶", ex: "I like this song.", exJa: "わたしは この うたが すきです。" },
  { en: "CD", ja: "シーディー", emoji: "💿", ex: "I have a CD.", exJa: "わたしは シーディーを もっています。" },
  { en: "violin", ja: "バイオリン", emoji: "🎻", ex: "I play the violin.", exJa: "わたしは バイオリンを ひきます。" },
  { en: "guitar", ja: "ギター", emoji: "🎸", ex: "I play the guitar.", exJa: "わたしは ギターを ひきます。" },
  { en: "show", ja: "みせる,しめす,ショー,ばんぐみ", emoji: "🎪", ex: "I watch a TV show.", exJa: "わたしは テレビばんぐみを みます。" },

  // ===== 161〜170 =====
  { en: "spring", ja: "はる", emoji: "🌸", ex: "I like spring.", exJa: "わたしは はるが すきです。" },
  { en: "summer", ja: "なつ", emoji: "🌻", ex: "I like summer.", exJa: "わたしは なつが すきです。" },
  { en: "fall", ja: "あき,おちる", emoji: "🍂", ex: "I like fall.", exJa: "わたしは あきが すきです。" },
  { en: "winter", ja: "ふゆ", emoji: "⛄", ex: "I like winter.", exJa: "わたしは ふゆが すきです。" },
  { en: "birthday", ja: "たんじょうび", emoji: "🎂", ex: "Happy birthday!", exJa: "たんじょうび おめでとう!" },
  { en: "festival", ja: "まつり,しゅくじつ", emoji: "🎉", ex: "I like this festival.", exJa: "わたしは この まつりが すきです。" },
  { en: "present", ja: "プレゼント,おくりもの", emoji: "🎁", ex: "This is a present for you.", exJa: "これは あなたへの プレゼントです。" },
  { en: "dollar", ja: "ドル", emoji: "💵", ex: "It is five dollars.", exJa: "5ドルです。" },
  { en: "English", ja: "えいご,えいごの", emoji: "🇬🇧", ex: "I study English.", exJa: "わたしは えいごを べんきょうします。" },
  { en: "Japanese", ja: "にほんご,にほんじん,にほんの", emoji: "🇯🇵", ex: "I speak Japanese.", exJa: "わたしは にほんごを はなします。" },

  // ===== 171〜180 =====
  { en: "Australia", ja: "オーストラリア", emoji: "🇦🇺", ex: "I want to go to Australia.", exJa: "わたしは オーストラリアへ いきたいです。" },
  { en: "Japan", ja: "にほん", emoji: "🗾", ex: "I live in Japan.", exJa: "わたしは にほんに すんでいます。" },
  { en: "Canada", ja: "カナダ", emoji: "🇨🇦", ex: "My uncle lives in Canada.", exJa: "わたしの おじは カナダに すんでいます。" },
  { en: "country", ja: "くに,いなか", emoji: "🌍", ex: "Japan is my country.", exJa: "にほんは わたしの くにです。" },
  { en: "hand", ja: "て,てわたす", emoji: "✋", ex: "Raise your hand.", exJa: "てを あげて。" },
  { en: "hair", ja: "かみのけ", emoji: "💇", ex: "My hair is long.", exJa: "わたしの かみは ながいです。" },
  { en: "leg", ja: "あし(脚)", kana: ["あし"], emoji: "🦵", ex: "My legs are long.", exJa: "わたしの あしは ながいです。" },
  { en: "face", ja: "かお,ひょうめん,めんする", emoji: "😀", ex: "Wash your face.", exJa: "かおを あらって。" },
  { en: "head", ja: "あたま,とうぶ", emoji: "🧠", ex: "My head hurts.", exJa: "あたまが いたいです。" },
  { en: "mouth", ja: "くち", emoji: "👄", ex: "Open your mouth.", exJa: "くちを あけて。" },

  // ===== 181〜190 =====
  { en: "finger", ja: "ゆび", emoji: "☝️", ex: "I have ten fingers.", exJa: "わたしは ゆびが 10ぽん あります。" },
  { en: "teeth", ja: "は(toothの ふくすうけい)", emoji: "🦷", ex: "Brush your teeth.", exJa: "はを みがいて。" },
  { en: "am", ja: "～である", emoji: "🟰", ex: "I am happy.", exJa: "わたしは うれしいです。" },
  { en: "are", ja: "～である,いる,ある", emoji: "🟰", ex: "You are kind.", exJa: "あなたは しんせつです。" },
  { en: "is", ja: "～である,いる,ある", emoji: "🟰", ex: "She is a teacher.", exJa: "かのじょは せんせいです。" },
  { en: "do", ja: "～をする,～しますか(does)", emoji: "❓", ex: "Do you like dogs?", exJa: "いぬが すきですか。" },
  { en: "like", ja: "このむ,すき,～のような", emoji: "👍", ex: "I like cats.", exJa: "わたしは ねこが すきです。" },
  { en: "have", ja: "もっている,かっている,のむ,たべる", emoji: "🖐️", ex: "I have a pen.", exJa: "わたしは ペンを もっています。" },
  { en: "go", ja: "いく", emoji: "🚶", ex: "I go to school.", exJa: "わたしは がっこうへ いきます。" },
  { en: "come", ja: "くる", emoji: "🙋", ex: "Come here.", exJa: "ここに きて。" },

  // ===== 191〜200 =====
  { en: "play", ja: "あそぶ,する,えんそうする,スポーツをする", emoji: "⚽", ex: "I play soccer.", exJa: "わたしは サッカーを します。" },
  { en: "want", ja: "～がほしい,～したい", emoji: "🙏", ex: "I want a new bike.", exJa: "わたしは あたらしい じてんしゃが ほしいです。" },
  { en: "make", ja: "つくる,～にする", emoji: "🛠️", ex: "I make a cake.", exJa: "わたしは ケーキを つくります。" },
  { en: "open", ja: "あける,ひらく,あいている", emoji: "🔓", ex: "Open the door.", exJa: "ドアを あけて。" },
  { en: "close", ja: "とじる,しめる,せっきんした", emoji: "🔒", ex: "Close the door.", exJa: "ドアを しめて。" },
  { en: "see", ja: "みる,あう,みえる", kana: ["みる"], emoji: "👀", ex: "I see a bird.", exJa: "とりが みえます。" },
  { en: "eat", ja: "たべる", emoji: "🍽️", ex: "I eat breakfast.", exJa: "わたしは あさごはんを たべます。" },
  { en: "read", ja: "よむ", emoji: "📖", ex: "I read a book.", exJa: "わたしは ほんを よみます。" },
  { en: "look", ja: "みる,～にみえる", kana: ["みる"], emoji: "👁️", ex: "Look at this.", exJa: "これを みて。" },
  { en: "watch", ja: "じっとみる", kana: ["みる"], emoji: "📺", ex: "I watch TV.", exJa: "わたしは テレビを みます。" },

  // ===== 201〜210 =====
  { en: "know", ja: "しっている", emoji: "🧠", ex: "I know his name.", exJa: "わたしは かれの なまえを しっています。" },
  { en: "speak", ja: "はなす", kana: ["はなす"], emoji: "🗣️", ex: "I speak English.", exJa: "わたしは えいごを はなします。" },
  { en: "use", ja: "つかう,りよう", emoji: "🔧", ex: "I use a computer.", exJa: "わたしは コンピューターを つかいます。" },
  { en: "wash", ja: "あらう", emoji: "🧼", ex: "I wash my hands.", exJa: "わたしは てを あらいます。" },
  { en: "run", ja: "はしる,ながれる", emoji: "🏃", ex: "I run fast.", exJa: "わたしは はやく はしります。" },
  { en: "write", ja: "かく", emoji: "✍️", ex: "I write a letter.", exJa: "わたしは てがみを かきます。" },
  { en: "take", ja: "とる,しゃしんをとる,のる", emoji: "📸", ex: "I take a picture.", exJa: "わたしは しゃしんを とります。" },
  { en: "live", ja: "すむ,いきる", emoji: "🏠", ex: "I live in Tokyo.", exJa: "わたしは とうきょうに すんでいます。" },
  { en: "sing", ja: "うたう", emoji: "🎤", ex: "I sing a song.", exJa: "わたしは うたを うたいます。" },
  { en: "get", ja: "てにいれる,うけとる", emoji: "🎁", ex: "I get a present.", exJa: "わたしは プレゼントを もらいます。" },

  // ===== 211〜220 =====
  { en: "study", ja: "べんきょうする", kana: ["べんきょう"], emoji: "📖", ex: "I study English.", exJa: "わたしは えいごを べんきょうします。" },
  { en: "walk", ja: "あるく,さんぽ", emoji: "🚶", ex: "I walk to school.", exJa: "わたしは あるいて がっこうへ いきます。" },
  { en: "listen", ja: "きく,みみをかたむける", kana: ["きく"], emoji: "👂", ex: "I listen to music.", exJa: "わたしは おんがくを ききます。" },
  { en: "drink", ja: "のむ,のみもの", emoji: "🥤", ex: "I drink milk.", exJa: "わたしは ぎゅうにゅうを のみます。" },
  { en: "swim", ja: "およぐ", emoji: "🏊", ex: "I can swim.", exJa: "わたしは およげます。" },
  { en: "meet", ja: "あう,であう", emoji: "🤝", ex: "I meet my friend.", exJa: "わたしは ともだちに あいます。" },
  { en: "cook", ja: "りょうりする,コック", kana: ["りょうり"], emoji: "🍳", ex: "I cook dinner.", exJa: "わたしは ばんごはんを つくります。" },
  { en: "start", ja: "しゅっぱつする,はじめる", kana: ["はじめる"], emoji: "🏁", ex: "The class starts at nine.", exJa: "じゅぎょうは 9じに はじまります。" },
  { en: "talk", ja: "はなす,はなし", kana: ["はなす"], emoji: "💬", ex: "I talk with my friend.", exJa: "わたしは ともだちと はなします。" },
  { en: "teach", ja: "おしえる", emoji: "🧑‍🏫", ex: "My mother teaches math.", exJa: "わたしの ははは さんすうを おしえています。" },

  // ===== 221〜230 =====
  { en: "clean", ja: "きれいにする,そうじする,せいけつな", kana: ["そうじ", "そうじする", "きれい"], emoji: "🧹", ex: "I clean my room.", exJa: "わたしは へやを そうじします。" },
  { en: "help", ja: "たすける,てつだう,たすけ", kana: ["てつだう", "たすける"], emoji: "🤝", ex: "I help my mother.", exJa: "わたしは ははを てつだいます。" },
  { en: "love", ja: "あいする,あい", emoji: "❤️", ex: "I love my family.", exJa: "わたしは かぞくが だいすきです。" },
  { en: "sit", ja: "すわる", emoji: "🪑", ex: "Please sit down.", exJa: "すわって ください。" },
  { en: "stand", ja: "たつ,たっている,うりば", emoji: "🧍", ex: "Please stand up.", exJa: "たって ください。" },
  { en: "work", ja: "はたらく,べんきょうする,しごと", emoji: "💼", ex: "My father works hard.", exJa: "わたしの ちちは いっしょうけんめい はたらきます。" },
  { en: "jump", ja: "とぶ,はねる", emoji: "🤸", ex: "I can jump high.", exJa: "わたしは たかく ジャンプできます。" },
  { en: "brush", ja: "みがく,ブラシ", emoji: "🪥", ex: "I brush my teeth.", exJa: "わたしは はを みがきます。" },
  { en: "dance", ja: "おどる,ダンス", kana: ["ダンス", "おどり"], emoji: "💃", ex: "I like to dance.", exJa: "わたしは おどるのが すきです。" },
  { en: "fly", ja: "とぶ,ひこうきでいく,ハエ", emoji: "✈️", ex: "Birds can fly.", exJa: "とりは とべます。" },

  // ===== 231〜240 =====
  { en: "skate", ja: "スケートをする", emoji: "⛸️", ex: "I like to skate.", exJa: "わたしは スケートが すきです。" },
  { en: "stop", ja: "とまる,とめる,やめる", kana: ["とめる", "やめる"], emoji: "🛑", ex: "Stop here.", exJa: "ここで とまって。" },
  { en: "enjoy", ja: "たのしむ", emoji: "😊", ex: "I enjoy this game.", exJa: "わたしは この ゲームを たのしみます。" },
  { en: "practice", ja: "れんしゅうする,れんしゅう", kana: ["れんしゅう"], emoji: "🎯", ex: "I practice soccer every day.", exJa: "わたしは まいにち サッカーを れんしゅうします。" },
  { en: "put", ja: "おく", emoji: "📥", ex: "Put your bag here.", exJa: "かばんを ここに おいて。" },
  { en: "good", ja: "よい", emoji: "👍", ex: "This is a good book.", exJa: "これは よい ほんです。" },
  { en: "old", ja: "ふるい,としをとった", emoji: "🕰️", ex: "This book is old.", exJa: "この ほんは ふるいです。" },
  { en: "new", ja: "あたらしい", emoji: "✨", ex: "I have a new bag.", exJa: "わたしは あたらしい かばんを もっています。" },
  { en: "fine", ja: "はれた,げんきな,すばらしい", emoji: "☀️", ex: "I am fine, thank you.", exJa: "げんきです、ありがとう。" },
  { en: "nice", ja: "やさしい,よい,すてきな", kana: ["いい", "よい"], emoji: "😊", ex: "You are nice.", exJa: "あなたは すてきです。" },

  // ===== 241〜250 =====
  { en: "right", ja: "ただしい,みぎの,けんり", emoji: "✅", ex: "That's right.", exJa: "そのとおりです。" },
  { en: "big", ja: "おおきい", emoji: "🐘", ex: "The elephant is big.", exJa: "ぞうは おおきいです。" },
  { en: "small", ja: "ちいさい", emoji: "🐭", ex: "The mouse is small.", exJa: "ねずみは ちいさいです。" },
  { en: "little", ja: "ちいさい,すこしの,ほとんどない", emoji: "🤏", ex: "I have a little water.", exJa: "わたしは すこし みずを もっています。" },
  { en: "long", ja: "ながい", emoji: "🐍", ex: "The snake is long.", exJa: "へびは ながいです。" },
  { en: "short", ja: "みじかい,せがひくい", emoji: "📏", ex: "My hair is short.", exJa: "わたしの かみは みじかいです。" },
  { en: "high", ja: "たかい,たかく", emoji: "⛰️", ex: "The mountain is high.", exJa: "やまは たかいです。" },
  { en: "cute", ja: "かわいい", kana: ["かわいい"], emoji: "🥰", ex: "The dog is cute.", exJa: "いぬは かわいいです。" },
  { en: "next", ja: "つぎに,となりの", emoji: "➡️", ex: "See you next week.", exJa: "また らいしゅう。" },
  { en: "great", ja: "いだいな,じゅうだいな,すばらしい", kana: ["すごい"], emoji: "🌟", ex: "That's great!", exJa: "すばらしい!" },

  // ===== 251〜260 =====
  { en: "hungry", ja: "おなかがすいた", emoji: "😋", ex: "I am hungry.", exJa: "わたしは おなかが すいています。" },
  { en: "cold", ja: "さむい,つめたい,かぜ", emoji: "🥶", ex: "It is cold today.", exJa: "きょうは さむいです。" },
  { en: "hot", ja: "あつい,からい", emoji: "🥵", ex: "It is hot today.", exJa: "きょうは あついです。" },
  { en: "favorite", ja: "おきにいりの", emoji: "⭐", ex: "This is my favorite book.", exJa: "これは わたしの おきにいりの ほんです。" },
  { en: "ready", ja: "じゅんびのできた", emoji: "✅", ex: "I am ready.", exJa: "じゅんび できました。" },
  { en: "beautiful", ja: "うつくしい,すばらしい", kana: ["きれい", "きれいな"], emoji: "🌅", ex: "The sunset is beautiful.", exJa: "ゆうやけは うつくしいです。" },
  { en: "Chinese", ja: "ちゅうごくじん,ちゅうごくご,ちゅうごくの", emoji: "🇨🇳", ex: "I study Chinese.", exJa: "わたしは ちゅうごくごを べんきょうします。" },
  { en: "last", ja: "さいごの,このまえの,さいごに", emoji: "🔚", ex: "I saw him last week.", exJa: "せんしゅう かれに あいました。" },
  { en: "wonderful", ja: "すばらしい,おどろくべき", kana: ["すごい"], emoji: "🤩", ex: "That's wonderful!", exJa: "すばらしい!" },
  { en: "not", ja: "～でない,～しない", emoji: "❌", ex: "I am not hungry.", exJa: "わたしは おなかが すいていません。" },

  // ===== 261〜270 =====
  { en: "here", ja: "ここに,ここで,ここへ", emoji: "📍", ex: "Come here.", exJa: "ここに きて。" },
  { en: "very", ja: "ひじょうに,たいへん,とても", emoji: "❗", ex: "I am very happy.", exJa: "わたしは とても うれしいです。" },
  { en: "too", ja: "～もまた,あまりに～すぎる", emoji: "➕", ex: "I like it too.", exJa: "わたしも すきです。" },
  { en: "often", ja: "たびたび,よく,しばしば", emoji: "🔁", ex: "I often play soccer.", exJa: "わたしは よく サッカーを します。" },
  { en: "now", ja: "いま", emoji: "⏱️", ex: "I am busy now.", exJa: "わたしは いま いそがしいです。" },
  { en: "there", ja: "そこに,そこで", emoji: "📌", ex: "Put it there.", exJa: "そこに おいて。" },
  { en: "o'clock", ja: "～じ", emoji: "🕐", ex: "It is nine o'clock.", exJa: "9じです。" },
  { en: "up", ja: "うえへ,あがって,きりつして", emoji: "⬆️", ex: "Stand up.", exJa: "たって。" },
  { en: "down", ja: "したへ", emoji: "⬇️", ex: "Sit down.", exJa: "すわって。" },
  { en: "fast", ja: "はやく,はやい", emoji: "⚡", ex: "He runs fast.", exJa: "かれは はやく はしります。" },

  // ===== 271〜280 =====
  { en: "really", ja: "ほんとうに,じっさいに", emoji: "❗", ex: "I really like it.", exJa: "わたしは ほんとうに すきです。" },
  { en: "usually", ja: "たいてい,ふつう", emoji: "🔁", ex: "I usually walk to school.", exJa: "わたしは たいてい あるいて がっこうへ いきます。" },
  { en: "well", ja: "じょうずに,うまく,よく", emoji: "👍", ex: "You sing well.", exJa: "あなたは じょうずに うたいます。" },
  { en: "out", ja: "そとへ,そとに", emoji: "🚪", ex: "Let's go out.", exJa: "そとへ いきましょう。" },
  { en: "sometimes", ja: "ときどき", emoji: "🔁", ex: "I sometimes play tennis.", exJa: "わたしは ときどき テニスを します。" },
  { en: "always", ja: "いつも,つねに", emoji: "🔁", ex: "I always eat breakfast.", exJa: "わたしは いつも あさごはんを たべます。" },
  { en: "just", ja: "ちょうど,たったいま,ちょっと", emoji: "☝️", ex: "It's just five o'clock.", exJa: "ちょうど 5じです。" },
  { en: "only", ja: "ただ(～だけ)", emoji: "☝️", ex: "I have only one pen.", exJa: "わたしは ペンを 1ぽんだけ もっています。" },
  { en: "around", ja: "～のまわりに,～ごろに,あちこちに", emoji: "🔄", ex: "I look around.", exJa: "わたしは あたりを みまわします。" },
  { en: "also", ja: "～もまた,そのうえ", emoji: "➕", ex: "I also like cats.", exJa: "わたしも ねこが すきです。" },

  // ===== 281〜290 =====
  { en: "then", ja: "そのとき,それから", emoji: "➡️", ex: "I eat breakfast, then I go to school.", exJa: "あさごはんを たべて、それから がっこうへ いきます。" },
  { en: "in", ja: "～のなかに", emoji: "📦", ex: "The cat is in the box.", exJa: "ねこは はこの なかに います。" },
  { en: "to", ja: "～へ,～に,～まで", emoji: "➡️", ex: "I go to school.", exJa: "わたしは がっこうへ いきます。" },
  { en: "at", ja: "～で,～に", emoji: "📍", ex: "I am at school.", exJa: "わたしは がっこうに います。" },
  { en: "on", ja: "～のうえに,～に,～で", emoji: "📦", ex: "The book is on the desk.", exJa: "ほんは つくえの うえに あります。" },
  { en: "for", ja: "～のために,～のあいだ", emoji: "🎁", ex: "This is for you.", exJa: "これは あなたの ためです。" },
  { en: "of", ja: "～の,～のうちで", emoji: "📦", ex: "This is a picture of my dog.", exJa: "これは わたしの いぬの しゃしんです。" },
  { en: "by", ja: "～のそば,～によって,～までに", emoji: "📍", ex: "I go to school by bus.", exJa: "わたしは バスで がっこうへ いきます。" },
  { en: "with", ja: "～といっしょに,～をもって", emoji: "🤝", ex: "I play with my friend.", exJa: "わたしは ともだちと あそびます。" },
  { en: "from", ja: "～から,～しゅっしんで", emoji: "➡️", ex: "I am from Japan.", exJa: "わたしは にほんの しゅっしんです。" },

  // ===== 291〜300 =====
  { en: "under", ja: "～のしたに", emoji: "📦", ex: "The cat is under the table.", exJa: "ねこは テーブルの したに います。" },
  { en: "after", ja: "～のあとで,～のあとに", emoji: "➡️", ex: "I play soccer after school.", exJa: "わたしは がっこうの あとで サッカーを します。" },
  { en: "before", ja: "いぜんに,～のまえに", emoji: "⬅️", ex: "Wash your hands before dinner.", exJa: "ばんごはんの まえに てを あらって。" },
  { en: "about", ja: "～について,およそ,やく～", emoji: "💬", ex: "I know about dogs.", exJa: "わたしは いぬについて しっています。" },
  { en: "near", ja: "～のちかくに,～にちかい", emoji: "📍", ex: "My house is near the park.", exJa: "わたしの いえは こうえんの ちかくです。" },
  { en: "the", ja: "その,あの", emoji: "👉", ex: "Look at the sky.", exJa: "そらを みて。" },
  { en: "a", ja: "ひとつの,ひとりの(an)", emoji: "1️⃣", ex: "I have a pen.", exJa: "わたしは ペンを もっています。" },
  { en: "and", ja: "～と、そして", emoji: "➕", ex: "I like dogs and cats.", exJa: "わたしは いぬと ねこが すきです。" },
  { en: "or", ja: "～か,それとも", emoji: "🔀", ex: "Tea or coffee?", exJa: "おちゃか コーヒー、どちらに しますか。" },
  { en: "but", ja: "しかし,けれども", emoji: "↔️", ex: "I like cats, but I like dogs too.", exJa: "わたしは ねこが すきですが、いぬも すきです。" },

  // ===== 301〜310 =====
  { en: "so", ja: "それで,だから,とても,そのように", emoji: "➡️", ex: "I am tired, so I go to bed.", exJa: "つかれたので、ねます。" },
  { en: "can", ja: "～できる,～してもよい", emoji: "💪", ex: "I can swim.", exJa: "わたしは およげます。" },
  { en: "what", ja: "何,何の", kana: ["なに", "なにの"], emoji: "❓", ex: "What is this?", exJa: "これは なんですか。" },
  { en: "how", ja: "どのように,どれくらい,なんと", emoji: "❓", ex: "How are you?", exJa: "げんきですか。" },
  { en: "where", ja: "どこで,どこに,どこへ", emoji: "❓", ex: "Where is my bag?", exJa: "わたしの かばんは どこですか。" },
  { en: "when", ja: "いつ,(～する)ときに", emoji: "❓", ex: "When is your birthday?", exJa: "たんじょうびは いつですか。" },
  { en: "who", ja: "だれ", emoji: "❓", ex: "Who is this?", exJa: "これは だれですか。" },
  { en: "whose", ja: "だれの,だれのもの", emoji: "❓", ex: "Whose bag is this?", exJa: "これは だれの かばんですか。" },
  { en: "which", ja: "どちら,どちらの", emoji: "❓", ex: "Which is yours?", exJa: "どちらが あなたのですか。" },
  { en: "why", ja: "なぜ,どうして", emoji: "❓", ex: "Why are you sad?", exJa: "なぜ かなしいのですか。" },

  // ===== 311〜320 =====
  { en: "everyone", ja: "だれでも,みんな", emoji: "👨‍👩‍👧‍👦", ex: "Everyone likes this song.", exJa: "みんな この うたが すきです。" },
  { en: "one", ja: "1つ,1人,もの", kana: ["ひとつ", "ひとり"], emoji: "1️⃣", ex: "I have one apple.", exJa: "わたしは りんごを 1つ もっています。" },
  { en: "every", ja: "あらゆる,～ごとに,すべての", emoji: "💯", ex: "I study every day.", exJa: "わたしは まいにち べんきょうします。" },
  { en: "some", ja: "いくつか,いくらか,多少", kana: ["たしょう"], emoji: "🔢", ex: "I have some pens.", exJa: "わたしは ペンを いくつか もっています。" },
  { en: "many", ja: "多くの,たくさんの", kana: ["おおくの"], emoji: "🔢", ex: "I have many friends.", exJa: "わたしは ともだちが たくさん います。" },
  { en: "all", ja: "すべての,全部,あらゆる", kana: ["ぜんぶ"], emoji: "💯", ex: "I know all the answers.", exJa: "わたしは こたえを ぜんぶ しっています。" },
  { en: "any", ja: "いくらかの,少しも,どんな～でも", kana: ["すこしも"], emoji: "❓", ex: "Do you have any pens?", exJa: "ペンを もっていますか。" },
  { en: "Mr.", ja: "～さん,～先生(男性)", kana: ["せんせい", "さん"], emoji: "🧑", ex: "This is Mr. Smith.", exJa: "こちらは スミスさんです。" },
  { en: "Ms.", ja: "～さん,～先生(女性)", kana: ["せんせい", "さん"], emoji: "👩", ex: "This is Ms. Smith.", exJa: "こちらは スミスさんです。" },
  { en: "chair", ja: "いす", emoji: "🪑", ex: "Sit on the chair.", exJa: "いすに すわって。" },

  // ===== 321〜330 =====
  { en: "magazine", ja: "雑誌", kana: ["ざっし"], emoji: "📰", ex: "I read a magazine.", exJa: "わたしは ざっしを よみます。" },
  { en: "phone", ja: "電話", kana: ["でんわ"], emoji: "📞", ex: "This is my phone.", exJa: "これは わたしの でんわです。" },
  { en: "bathroom", ja: "浴室,トイレ", kana: ["よくしつ"], emoji: "🚽", ex: "Where is the bathroom?", exJa: "トイレは どこですか。" },
  { en: "hat", ja: "帽子(ふちのある)", kana: ["ぼうし"], emoji: "🎩", ex: "I have a new hat.", exJa: "わたしは あたらしい ぼうしを もっています。" },
  { en: "cup", ja: "カップ,茶わん", kana: ["ちゃわん"], emoji: "☕", ex: "This is my cup.", exJa: "これは わたしの カップです。" },
  { en: "kitchen", ja: "台所", kana: ["だいどころ"], emoji: "🍳", ex: "My mother is in the kitchen.", exJa: "おかあさんは だいどころに います。" },
  { en: "desk", ja: "つくえ", emoji: "🪑", ex: "My desk is clean.", exJa: "わたしの つくえは きれいです。" },
  { en: "basket", ja: "かご", emoji: "🧺", ex: "I have a basket.", exJa: "わたしは かごを もっています。" },
  { en: "garden", ja: "庭,庭園", kana: ["にわ", "ていえん"], emoji: "🌷", ex: "I like this garden.", exJa: "わたしは この にわが すきです。" },
  { en: "bedroom", ja: "寝室", kana: ["しんしつ"], emoji: "🛏️", ex: "This is my bedroom.", exJa: "これは わたしの しんしつです。" },

  // ===== 331〜340 =====
  { en: "newspaper", ja: "新聞", kana: ["しんぶん"], emoji: "📰", ex: "My father reads the newspaper.", exJa: "おとうさんは しんぶんを よみます。" },
  { en: "shirt", ja: "ワイシャツ,シャツ", emoji: "👔", ex: "I like this shirt.", exJa: "わたしは この シャツが すきです。" },
  { en: "DVD", ja: "DVD", emoji: "📀", ex: "I watch a DVD.", exJa: "わたしは DVDを みます。" },
  { en: "floor", ja: "ゆか,階", kana: ["かい", "ゆか"], emoji: "🏢", ex: "My room is on the third floor.", exJa: "わたしの へやは 3かいです。" },
  { en: "glove", ja: "手袋,グローブ", kana: ["てぶくろ"], emoji: "🧤", ex: "I have new gloves.", exJa: "わたしは あたらしい てぶくろを もっています。" },
  { en: "living room", ja: "居間,リビングルーム", kana: ["いま"], emoji: "🛋️", ex: "We watch TV in the living room.", exJa: "わたしたちは リビングで テレビを みます。" },
  { en: "shoe", ja: "靴", kana: ["くつ"], emoji: "👟", ex: "I have new shoes.", exJa: "わたしは あたらしい くつを もっています。" },
  { en: "jacket", ja: "上着,ジャケット", kana: ["うわぎ"], emoji: "🧥", ex: "I like this jacket.", exJa: "わたしは この うわぎが すきです。" },
  { en: "postcard", ja: "はがき,絵はがき", kana: ["えはがき"], emoji: "💌", ex: "I write a postcard.", exJa: "わたしは はがきを かきます。" },
  { en: "shower", ja: "シャワー,にわか雨", kana: ["にわかあめ"], emoji: "🚿", ex: "I take a shower.", exJa: "わたしは シャワーを あびます。" },

  // ===== 341〜350 =====
  { en: "sofa", ja: "ソファー", emoji: "🛋️", ex: "I sit on the sofa.", exJa: "わたしは ソファーに すわります。" },
  { en: "album", ja: "アルバム", emoji: "📸", ex: "This is my photo album.", exJa: "これは わたしの アルバムです。" },
  { en: "card", ja: "カード,トランプ,はがき", emoji: "🃏", ex: "I play cards.", exJa: "わたしは トランプを します。" },
  { en: "curtain", ja: "カーテン", emoji: "🪟", ex: "Close the curtain.", exJa: "カーテンを しめて。" },
  { en: "diary", ja: "日記,日記帳", kana: ["にっき", "にっきちょう"], emoji: "📔", ex: "I write in my diary.", exJa: "わたしは にっきを かきます。" },
  { en: "dining room", ja: "食堂,ダイニングルーム", kana: ["しょくどう"], emoji: "🍽️", ex: "We eat in the dining room.", exJa: "わたしたちは ダイニングで たべます。" },
  { en: "radio", ja: "ラジオ", emoji: "📻", ex: "I listen to the radio.", exJa: "わたしは ラジオを ききます。" },
  { en: "towel", ja: "タオル", emoji: "🧻", ex: "This is my towel.", exJa: "これは わたしの タオルです。" },
  { en: "backpack", ja: "バックパック,リュック", emoji: "🎒", ex: "I have a new backpack.", exJa: "わたしは あたらしい リュックを もっています。" },
  { en: "calendar", ja: "カレンダー", emoji: "📅", ex: "Look at the calendar.", exJa: "カレンダーを みて。" },

  // ===== 351〜360 =====
  { en: "coat", ja: "コート(衣服の)", kana: ["こーと"], emoji: "🧥", ex: "I wear a coat in winter.", exJa: "わたしは ふゆに コートを きます。" },
  { en: "pocket", ja: "ポケット", emoji: "👖", ex: "I have a pen in my pocket.", exJa: "ポケットに ペンが あります。" },
  { en: "skirt", ja: "スカート", emoji: "👗", ex: "I like this skirt.", exJa: "わたしは この スカートが すきです。" },
  { en: "toy", ja: "おもちゃ", kana: ["おもちゃ"], emoji: "🧸", ex: "I like this toy.", exJa: "わたしは この おもちゃが すきです。" },
  { en: "wall", ja: "壁,へい", kana: ["かべ"], emoji: "🧱", ex: "There is a picture on the wall.", exJa: "かべに えが あります。" },
  { en: "minute", ja: "分,瞬間", kana: ["ふん", "しゅんかん"], emoji: "⏱️", ex: "Wait a minute.", exJa: "ちょっと まって。" },
  { en: "pencil case", ja: "ふでばこ", emoji: "🖊️", ex: "This is my pencil case.", exJa: "これは わたしの ふでばこです。" },
  { en: "lesson", ja: "授業,けいこ,(教科書の)課", kana: ["じゅぎょう", "か"], emoji: "📚", ex: "I have a piano lesson.", exJa: "わたしは ピアノの レッスンが あります。" },
  { en: "page", ja: "(本の)ページ", kana: ["ぺーじ", "ページ"], emoji: "📄", ex: "Open your book to page ten.", exJa: "本ほんの 10ページを ひらいて。" },
  { en: "pool", ja: "プール,水たまり", kana: ["みずたまり"], emoji: "🏊", ex: "I swim in the pool.", exJa: "わたしは プールで およぎます。" },

  // ===== 361〜370 =====
  { en: "cafeteria", ja: "カフェテリア", emoji: "🍴", ex: "We eat at the cafeteria.", exJa: "わたしたちは カフェテリアで たべます。" },
  { en: "test", ja: "テスト,試験", kana: ["しけん", "テスト"], emoji: "📋", ex: "I have a test today.", exJa: "きょう テストが あります。" },
  { en: "PE", ja: "体育,体育科", kana: ["たいいく"], emoji: "🏃", ex: "I like PE class.", exJa: "わたしは たいいくが すきです。" },
  { en: "ruler", ja: "定規", kana: ["じょうぎ"], emoji: "📏", ex: "I use a ruler.", exJa: "わたしは じょうぎを つかいます。" },
  { en: "blackboard", ja: "黒板", kana: ["こくばん"], emoji: "⬛", ex: "Look at the blackboard.", exJa: "こくばんを みて。" },
  { en: "ground", ja: "地面,グラウンド,運動場", kana: ["じめん", "うんどうじょう", "グラウンド"], emoji: "🏟️", ex: "We play on the ground.", exJa: "わたしたちは グラウンドで あそびます。" },
  { en: "history", ja: "歴史", kana: ["れきし"], emoji: "📜", ex: "I like history.", exJa: "わたしは れきしが すきです。" },
  { en: "idea", ja: "考え,アイデア,見当", kana: ["かんがえ", "けんとう", "アイデア"], emoji: "💡", ex: "That's a good idea.", exJa: "それは いい かんがえですね。" },
  { en: "children", ja: "子どもたち(childの複数形)", kana: ["こどもたち", "こども"], emoji: "🧒", ex: "Many children are here.", exJa: "たくさんの 子どもが ここに います。" },
  { en: "doctor", ja: "医者", kana: ["いしゃ"], emoji: "🧑‍⚕️", ex: "My mother is a doctor.", exJa: "わたしの おかあさんは いしゃです。" },

  // ===== 371〜380 =====
  { en: "pilot", ja: "パイロット", emoji: "🧑‍✈️", ex: "I want to be a pilot.", exJa: "わたしは パイロットに なりたいです。" },
  { en: "waiter", ja: "ウェイター,給仕", kana: ["きゅうじ"], emoji: "🧑‍🍳", ex: "He is a waiter.", exJa: "かれは ウェイターです。" },
  { en: "cook", ja: "料理する,コック", kana: ["りょうりする", "りょうり"], emoji: "🍳", ex: "My father is a cook.", exJa: "わたしの おとうさんは りょうりにんです。" },
  { en: "lady", ja: "ご婦人,女のかた", kana: ["ごふじん", "おんなのかた", "おんなのひと"], emoji: "👩", ex: "That lady is my teacher.", exJa: "あの ご婦人は わたしの 先生せんせいです。" },
  { en: "police officer", ja: "警察官", kana: ["けいさつかん"], emoji: "👮", ex: "He is a police officer.", exJa: "かれは けいさつかんです。" },
  { en: "dancer", ja: "ダンサー,踊る人", kana: ["おどるひと"], emoji: "💃", ex: "She is a great dancer.", exJa: "かのじょは すばらしい ダンサーです。" },
  { en: "nurse", ja: "看護師,看護士", kana: ["かんごし"], emoji: "🧑‍⚕️", ex: "She is a nurse.", exJa: "かのじょは かんごしです。" },
  { en: "pianist", ja: "ピアニスト", emoji: "🎹", ex: "He is a famous pianist.", exJa: "かれは ゆうめいな ピアニストです。" },
  { en: "driver", ja: "運転手,運転者", kana: ["うんてんしゅ", "うんてんしゃ"], emoji: "🚗", ex: "My father is a bus driver.", exJa: "わたしの おとうさんは バスの うんてんしゅです。" },
  { en: "firefighter", ja: "消防士", kana: ["しょうぼうし"], emoji: "🧑‍🚒", ex: "He is a firefighter.", exJa: "かれは しょうぼうしです。" },

  // ===== 381〜390 =====
  { en: "store", ja: "店,店をかまえる,蓄える", kana: ["みせ"], emoji: "🏪", ex: "I go to the store.", exJa: "わたしは みせへ いきます。" },
  { en: "supermarket", ja: "スーパーマーケット", emoji: "🛒", ex: "I go to the supermarket.", exJa: "わたしは スーパーへ いきます。" },
  { en: "office", ja: "事務所,会社,職場", kana: ["じむしょ", "かいしゃ", "しょくば"], emoji: "🏢", ex: "My father works at an office.", exJa: "おとうさんは かいしゃで はたらいています。" },
  { en: "department store", ja: "デパート,百貨店", kana: ["ひゃっかてん"], emoji: "🏬", ex: "I go to the department store.", exJa: "わたしは デパートへ いきます。" },
  { en: "ship", ja: "船(大型の)", kana: ["ふね"], emoji: "🚢", ex: "I see a ship.", exJa: "ふねが みえます。" },
  { en: "ticket", ja: "切符,券,チケット", kana: ["きっぷ", "けん"], emoji: "🎫", ex: "I have a ticket.", exJa: "わたしは きっぷを もっています。" },
  { en: "airport", ja: "空港,飛行場", kana: ["くうこう", "ひこうじょう"], emoji: "✈️", ex: "I go to the airport.", exJa: "わたしは くうこうへ いきます。" },
  { en: "bookstore", ja: "書店", kana: ["しょてん"], emoji: "📚", ex: "I go to the bookstore.", exJa: "わたしは しょてんへ いきます。" },
  { en: "bridge", ja: "橋", kana: ["はし"], emoji: "🌉", ex: "This bridge is long.", exJa: "この はしは ながいです。" },
  { en: "building", ja: "建物,ビル", kana: ["たてもの"], emoji: "🏢", ex: "That building is tall.", exJa: "あの たてものは たかいです。" },

  // ===== 391〜400 =====
  { en: "tower", ja: "塔,タワー", kana: ["とう"], emoji: "🗼", ex: "I see a tower.", exJa: "タワーが みえます。" },
  { en: "bank", ja: "銀行,土手", kana: ["ぎんこう", "どて"], emoji: "🏦", ex: "I go to the bank.", exJa: "わたしは ぎんこうへ いきます。" },
  { en: "bus stop", ja: "バス停", kana: ["ばすてい"], emoji: "🚏", ex: "I wait at the bus stop.", exJa: "わたしは バスていで まちます。" },
  { en: "gas station", ja: "ガソリンスタンド", emoji: "⛽", ex: "There is a gas station.", exJa: "ガソリンスタンドが あります。" },
  { en: "hotel", ja: "ホテル", emoji: "🏨", ex: "We stay at a hotel.", exJa: "わたしたちは ホテルに とまります。" },
  { en: "plane", ja: "飛行機", kana: ["ひこうき"], emoji: "✈️", ex: "I go by plane.", exJa: "わたしは ひこうきで いきます。" },
  { en: "post office", ja: "郵便局", kana: ["ゆうびんきょく"], emoji: "🏤", ex: "I go to the post office.", exJa: "わたしは ゆうびんきょくへ いきます。" },
  { en: "police station", ja: "警察署", kana: ["けいさつしょ"], emoji: "🚓", ex: "The police station is near here.", exJa: "けいさつしょは この ちかくです。" },
  { en: "taxi", ja: "タクシー", emoji: "🚕", ex: "We take a taxi.", exJa: "タクシーに のります。" },
  { en: "tea", ja: "お茶,紅茶", kana: ["おちゃ", "こうちゃ"], emoji: "🍵", ex: "I drink tea.", exJa: "わたしは おちゃを のみます。" },

  // ===== 401〜410 =====
  { en: "pizza", ja: "ピザ", emoji: "🍕", ex: "I like pizza.", exJa: "わたしは ピザが すきです。" },
  { en: "plate", ja: "皿,プレート,料理", kana: ["さら", "りょうり"], emoji: "🍽️", ex: "Put it on the plate.", exJa: "おさらに のせて。" },
  { en: "potato", ja: "じゃがいも", emoji: "🥔", ex: "I like potatoes.", exJa: "わたしは じゃがいもが すきです。" },
  { en: "cookie", ja: "クッキー", emoji: "🍪", ex: "I eat a cookie.", exJa: "わたしは クッキーを たべます。" },
  { en: "fruit", ja: "くだもの", emoji: "🍉", ex: "I like fruit.", exJa: "わたしは くだものが すきです。" },
  { en: "spoon", ja: "スプーン", emoji: "🥄", ex: "I use a spoon.", exJa: "わたしは スプーンを つかいます。" },
  { en: "bread", ja: "パン", emoji: "🍞", ex: "I eat bread.", exJa: "わたしは パンを たべます。" },
  { en: "dish", ja: "皿,料理", kana: ["さら", "りょうり"], emoji: "🍽️", ex: "This dish is delicious.", exJa: "この りょうりは おいしいです。" },
  { en: "grape", ja: "ブドウ", emoji: "🍇", ex: "I like grapes.", exJa: "わたしは ぶどうが すきです。" },
  { en: "strawberry", ja: "イチゴ", emoji: "🍓", ex: "I like strawberries.", exJa: "わたしは いちごが すきです。" },

  // ===== 411〜420 =====
  { en: "banana", ja: "バナナ", emoji: "🍌", ex: "I eat a banana.", exJa: "わたしは バナナを たべます。" },
  { en: "chocolate", ja: "チョコレート", emoji: "🍫", ex: "I like chocolate.", exJa: "わたしは チョコレートが すきです。" },
  { en: "dessert", ja: "デザート(食後の)", kana: ["でざーと"], emoji: "🍰", ex: "I want a dessert.", exJa: "わたしは デザートが ほしいです。" },
  { en: "hamburger", ja: "ハンバーガー,ハンバーグ", emoji: "🍔", ex: "I eat a hamburger.", exJa: "わたしは ハンバーガーを たべます。" },
  { en: "jam", ja: "ジャム", emoji: "🍯", ex: "I like strawberry jam.", exJa: "わたしは いちごジャムが すきです。" },
  { en: "lunchtime", ja: "昼食時間,ランチタイム", kana: ["ちゅうしょくじかん"], emoji: "🍱", ex: "It is lunchtime.", exJa: "ひるごはんの じかんです。" },
  { en: "meat", ja: "肉", kana: ["にく", "おにく"], emoji: "🍖", ex: "I like meat.", exJa: "わたしは にくが すきです。" },
  { en: "tomato", ja: "トマト", emoji: "🍅", ex: "I like tomatoes.", exJa: "わたしは トマトが すきです。" },
  { en: "vegetable", ja: "野菜", kana: ["やさい"], emoji: "🥦", ex: "Eat your vegetables.", exJa: "やさいを たべなさい。" },
  { en: "carrot", ja: "にんじん", emoji: "🥕", ex: "I like carrots.", exJa: "わたしは にんじんが すきです。" },

  // ===== 421〜430 =====
  { en: "chopstick", ja: "はし(食事用の)", kana: ["はし"], emoji: "🥢", ex: "I use chopsticks.", exJa: "わたしは はしを つかいます。" },
  { en: "cucumber", ja: "きゅうり", emoji: "🥒", ex: "I like cucumbers.", exJa: "わたしは きゅうりが すきです。" },
  { en: "fork", ja: "フォーク", emoji: "🍴", ex: "I use a fork.", exJa: "わたしは フォークを つかいます。" },
  { en: "glass", ja: "グラス,コップ,めがね", kana: ["コップ", "グラス"], emoji: "🥛", ex: "I want a glass of water.", exJa: "みずを 1ぱい ほしいです。" },
  { en: "onion", ja: "タマネギ", emoji: "🧅", ex: "I don't like onions.", exJa: "わたしは たまねぎが すきではありません。" },
  { en: "soup", ja: "スープ", emoji: "🍲", ex: "The soup is hot.", exJa: "スープは あついです。" },
  { en: "pie", ja: "パイ", emoji: "🥧", ex: "I like apple pie.", exJa: "わたしは アップルパイが すきです。" },
  { en: "pumpkin", ja: "かぼちゃ", emoji: "🎃", ex: "I like pumpkin soup.", exJa: "わたしは かぼちゃスープが すきです。" },
  { en: "salad", ja: "サラダ", emoji: "🥗", ex: "I eat salad.", exJa: "わたしは サラダを たべます。" },
  { en: "grandmother", ja: "祖母", kana: ["そぼ"], emoji: "👵", ex: "My grandmother is kind.", exJa: "わたしの おばあさんは やさしいです。" },

  // ===== 431〜440 =====
  { en: "grandfather", ja: "祖父", kana: ["そふ"], emoji: "👴", ex: "My grandfather is 70.", exJa: "わたしの おじいさんは 70さいです。" },
  { en: "racket", ja: "ラケット", emoji: "🎾", ex: "I have a new racket.", exJa: "わたしは あたらしい ラケットを もっています。" },
  { en: "score", ja: "点数,得点,スコア,得点する", kana: ["てんすう", "とくてん", "スコア"], emoji: "🔢", ex: "What is the score?", exJa: "てんすうは いくつですか。" },
  { en: "softball", ja: "ソフトボール", emoji: "⚾", ex: "I play softball.", exJa: "わたしは ソフトボールを します。" },
  { en: "bicycle", ja: "自転車", kana: ["じてんしゃ"], emoji: "🚲", ex: "I ride a bicycle.", exJa: "わたしは じてんしゃに のります。" },
  { en: "football", ja: "サッカー,ラグビー,アメフト", emoji: "🏈", ex: "I like football.", exJa: "わたしは アメフトが すきです。" },
  { en: "badminton", ja: "バドミントン", emoji: "🏸", ex: "I play badminton.", exJa: "わたしは バドミントンを します。" },
  { en: "flower", ja: "花", kana: ["はな"], emoji: "🌸", ex: "This flower is beautiful.", exJa: "この はなは うつくしいです。" },
  { en: "snow", ja: "雪,雪が降る", kana: ["ゆき", "ゆきがふる"], emoji: "❄️", ex: "It is snowy today.", exJa: "きょうは ゆきです。" },
  { en: "hamster", ja: "ハムスター", emoji: "🐹", ex: "I have a hamster.", exJa: "わたしは ハムスターを かっています。" },

  // ===== 441〜450 =====
  { en: "river", ja: "川", kana: ["かわ"], emoji: "🌊", ex: "This river is long.", exJa: "この かわは ながいです。" },
  { en: "rose", ja: "バラ(の花)", kana: ["ばら"], emoji: "🌹", ex: "I like roses.", exJa: "わたしは バラが すきです。" },
  { en: "sea", ja: "海", kana: ["うみ"], emoji: "🌊", ex: "I like the sea.", exJa: "わたしは うみが すきです。" },
  { en: "sky", ja: "空", kana: ["そら"], emoji: "☁️", ex: "The sky is blue.", exJa: "そらは あおいです。" },
  { en: "weather", ja: "天気,天候", kana: ["てんき", "てんこう"], emoji: "⛅", ex: "How is the weather today?", exJa: "きょうの てんきは どうですか。" },
  { en: "beach", ja: "砂浜,浜辺", kana: ["すなはま", "はまべ"], emoji: "🏖️", ex: "I like the beach.", exJa: "わたしは はまべが すきです。" },
  { en: "dolphin", ja: "イルカ", emoji: "🐬", ex: "I like dolphins.", exJa: "わたしは イルカが すきです。" },
  { en: "elephant", ja: "ゾウ", emoji: "🐘", ex: "The elephant is big.", exJa: "ぞうは おおきいです。" },
  { en: "sheep", ja: "ひつじ", emoji: "🐑", ex: "I see sheep.", exJa: "ひつじが みえます。" },
  { en: "monkey", ja: "サル", emoji: "🐒", ex: "The monkey is funny.", exJa: "さるは おもしろいです。" },

  // ===== 451〜460 =====
  { en: "purple", ja: "紫の,紫色", kana: ["むらさき", "むらさきいろ"], emoji: "🟣", ex: "I like purple.", exJa: "わたしは むらさきが すきです。" },
  { en: "concert", ja: "音楽会,演奏会,コンサート", kana: ["おんがくかい", "えんそうかい"], emoji: "🎤", ex: "I go to a concert.", exJa: "わたしは コンサートへ いきます。" },
  { en: "flute", ja: "フルート", emoji: "🎶", ex: "I play the flute.", exJa: "わたしは フルートを ふきます。" },
  { en: "party", ja: "パーティー,集団,政党", kana: ["ぱーてぃー", "しゅうだん", "せいとう"], emoji: "🎉", ex: "I have a birthday party.", exJa: "わたしは たんじょうびパーティーを します。" },
  { en: "meter", ja: "メートル", emoji: "📏", ex: "This is one meter long.", exJa: "これは 1メートルの ながさです。" },
  { en: "yen", ja: "円", kana: ["えん"], emoji: "💴", ex: "It is one hundred yen.", exJa: "100えんです。" },
  { en: "kilogram", ja: "キログラム", emoji: "⚖️", ex: "It is two kilograms.", exJa: "2キログラムです。" },
  { en: "centimeter", ja: "センチメートル", emoji: "📏", ex: "It is ten centimeters.", exJa: "10センチメートルです。" },
  { en: "cent", ja: "セント", emoji: "💵", ex: "It is fifty cents.", exJa: "50セントです。" },
  { en: "French", ja: "フランス人,フランス語,フランスの", kana: ["ふらんすじん", "ふらんすご", "ふらんすの"], emoji: "🇫🇷", ex: "I study French.", exJa: "わたしは フランスごを べんきょうします。" },

  // ===== 461〜470 =====
  { en: "Singapore", ja: "シンガポール", emoji: "🇸🇬", ex: "I want to go to Singapore.", exJa: "わたしは シンガポールへ いきたいです。" },
  { en: "world", ja: "世界", kana: ["せかい"], emoji: "🌍", ex: "I want to see the world.", exJa: "わたしは せかいを みたいです。" },
  { en: "foot", ja: "足,フィート,ふもと", kana: ["あし", "ふぃーと"], emoji: "🦶", ex: "My foot is big.", exJa: "わたしの あしは おおきいです。" },
  { en: "ear", ja: "耳", kana: ["みみ"], emoji: "👂", ex: "The rabbit has long ears.", exJa: "うさぎは みみが ながいです。" },
  { en: "shoulder", ja: "肩", kana: ["かた"], emoji: "🤷", ex: "My shoulder hurts.", exJa: "かたが いたいです。" },
  { en: "buy", ja: "～を買う", kana: ["かう"], emoji: "🛍️", ex: "I buy a book.", exJa: "わたしは 本ほんを かいます。" },
  { en: "cut", ja: "～を切る", kana: ["きる"], emoji: "✂️", ex: "I cut the paper.", exJa: "わたしは かみを きります。" },
  { en: "sleep", ja: "眠る,眠り,睡眠", kana: ["ねむる", "ねむり", "すいみん"], emoji: "😴", ex: "I sleep at nine.", exJa: "わたしは 9じに ねます。" },
  { en: "need", ja: "～を必要とする,必要", kana: ["ひつようとする", "ひつよう"], emoji: "🙏", ex: "I need a new pen.", exJa: "わたしは あたらしい ペンが ひつようです。" },
  { en: "paint", ja: "ペンキをぬる,絵を描く,ペンキ,絵の具", kana: ["ぺんきをぬる", "えをかく", "えのぐ"], emoji: "🎨", ex: "I paint a picture.", exJa: "わたしは えを かきます。" },

  // ===== 471〜480 =====
  { en: "rain", ja: "雨が降る,雨", kana: ["あめがふる", "あめ"], emoji: "🌧️", ex: "It rains a lot in June.", exJa: "6がつは よく あめが ふります。" },
  { en: "call", ja: "呼ぶ,～と…呼ぶ,電話をかける", kana: ["よぶ", "でんわをかける"], emoji: "📞", ex: "I call my friend.", exJa: "わたしは ともだちに でんわします。" },
  { en: "camp", ja: "キャンプする,キャンプ", emoji: "⛺", ex: "We camp in the mountains.", exJa: "わたしたちは やまで キャンプします。" },
  { en: "find", ja: "～を見つける,～だとわかる", kana: ["みつける", "わかる"], emoji: "🔍", ex: "I find my key.", exJa: "わたしは かぎを みつけます。" },
  { en: "ski", ja: "スキーをする,スキーの板", kana: ["すきーをする", "すきーのいた"], emoji: "⛷️", ex: "I ski in winter.", exJa: "わたしは ふゆに スキーを します。" },
  { en: "think", ja: "考える,思う", kana: ["かんがえる", "おもう"], emoji: "🤔", ex: "I think so.", exJa: "わたしも そう おもいます。" },
  { en: "tall", ja: "背が高い,～の背の高さの", kana: ["せがたかい"], emoji: "🦒", ex: "The giraffe is tall.", exJa: "きりんは せが たかいです。" },
  { en: "easy", ja: "やさしい,簡単な,気楽な", kana: ["かんたんな", "きらくな", "かんたん", "やさしい"], emoji: "😀", ex: "This test is easy.", exJa: "この テストは かんたんです。" },
  { en: "happy", ja: "幸せな,うれしい", kana: ["しあわせな", "しあわせ", "うれしい"], emoji: "😊", ex: "I am happy.", exJa: "わたしは うれしいです。" },
  { en: "pretty", ja: "かわいい,きれいな", kana: ["きれい"], emoji: "🌸", ex: "This flower is pretty.", exJa: "この はなは きれいです。" },

  // ===== 481〜490 =====
  { en: "sunny", ja: "晴れの,日当たりのよい,快活な", kana: ["はれの", "はれ"], emoji: "☀️", ex: "It is sunny today.", exJa: "きょうは はれです。" },
  { en: "cloudy", ja: "曇った,くもりの", kana: ["くもった"], emoji: "☁️", ex: "It is cloudy today.", exJa: "きょうは くもりです。" },
  { en: "rainy", ja: "雨の,雨降りの", kana: ["あめの", "あめふりの"], emoji: "🌧️", ex: "It is rainy today.", exJa: "きょうは あめです。" },
  { en: "windy", ja: "風の強い,風の吹く", kana: ["かぜがつよい"], emoji: "🌬️", ex: "It is windy today.", exJa: "きょうは かぜが つよいです。" },
  { en: "snowy", ja: "雪の降る,雪の多い", kana: ["ゆきのふる", "ゆきのおおい"], emoji: "❄️", ex: "It is snowy today.", exJa: "きょうは ゆきです。" },
  { en: "young", ja: "若い", kana: ["わかい"], emoji: "👶", ex: "My father is young.", exJa: "わたしの ちちは わかいです。" },
  { en: "large", ja: "大きい,広い", kana: ["おおきい", "ひろい"], emoji: "🐘", ex: "This room is large.", exJa: "この へやは ひろいです。" },
  { en: "slow", ja: "遅い,ゆっくりと", kana: ["おそい"], emoji: "🐢", ex: "The turtle is slow.", exJa: "かめは おそいです。" },
  { en: "fast", ja: "速く,速い", kana: ["はやく", "はやい"], emoji: "⚡", ex: "He runs fast.", exJa: "かれは はやく はしります。" },
  { en: "busy", ja: "忙しい,混雑した", kana: ["いそがしい"], emoji: "🏃‍♀️", ex: "My mother is busy.", exJa: "おかあさんは いそがしいです。" },

  // ===== 491〜500 =====
  { en: "soft", ja: "やわらかい,おだやかな", emoji: "🧸", ex: "This bed is soft.", exJa: "この ベッドは やわらかいです。" },
  { en: "sweet", ja: "甘い,甘いもの", kana: ["あまい", "あまいもの"], emoji: "🍬", ex: "This cake is sweet.", exJa: "この ケーキは あまいです。" },
  { en: "warm", ja: "暖かい,温かい", kana: ["あたたかい"], emoji: "🧣", ex: "It is warm today.", exJa: "きょうは あたたかいです。" },
  { en: "sleepy", ja: "眠い,眠そうな", kana: ["ねむい", "ねむそうな"], emoji: "😪", ex: "I am sleepy.", exJa: "わたしは ねむいです。" },
  { en: "Italian", ja: "イタリア人の,イタリア語の", kana: ["いたりあじんの", "いたりあごの"], emoji: "🇮🇹", ex: "I like Italian food.", exJa: "わたしは イタリアりょうりが すきです。" },
  { en: "together", ja: "いっしょに", emoji: "🤝", ex: "We play together.", exJa: "わたしたちは いっしょに あそびます。" },
  { en: "Mrs.", ja: "～夫人,～さん,～先生", kana: ["ふじん", "せんせい", "さん"], emoji: "👩", ex: "This is Mrs. Smith.", exJa: "こちらは スミスさんです。" },
  { en: "a.m.", ja: "午前", kana: ["ごぜん"], emoji: "🌅", ex: "It is seven a.m.", exJa: "ごぜん7じです。" },
  { en: "one", ja: "1", emoji: "1️⃣", ex: "I have one apple.", exJa: "わたしは りんごを 1つ もっています。" },
  { en: "two", ja: "2", emoji: "2️⃣", ex: "I have two dogs.", exJa: "わたしは いぬを 2ひき かっています。" },

  // ===== 501〜510 =====
  { en: "three", ja: "3", emoji: "3️⃣", ex: "I have three pens.", exJa: "わたしは ペンを 3ぼん もっています。" },
  { en: "four", ja: "4", emoji: "4️⃣", ex: "I am four years old.", exJa: "わたしは 4さいです。" },
  { en: "five", ja: "5", emoji: "5️⃣", ex: "I have five balls.", exJa: "わたしは ボールを 5つ もっています。" },
  { en: "six", ja: "6", emoji: "6️⃣", ex: "It is six o'clock.", exJa: "6じです。" },
  { en: "seven", ja: "7", emoji: "7️⃣", ex: "I have seven books.", exJa: "わたしは 本ほんを 7さつ もっています。" },
  { en: "eight", ja: "8", emoji: "8️⃣", ex: "I am eight years old.", exJa: "わたしは 8さいです。" },
  { en: "nine", ja: "9", emoji: "9️⃣", ex: "It is nine o'clock.", exJa: "9じです。" },
  { en: "ten", ja: "10", emoji: "🔟", ex: "I have ten fingers.", exJa: "わたしは ゆびが 10ぽん あります。" },
  { en: "eleven", ja: "11", emoji: "🔢", ex: "I am eleven years old.", exJa: "わたしは 11さいです。" },
  { en: "twelve", ja: "12", emoji: "🔢", ex: "There are twelve months.", exJa: "1ねんは 12かげつです。" },

  // ===== 511〜520 =====
  { en: "thirteen", ja: "13", emoji: "🔢", ex: "I am thirteen.", exJa: "わたしは 13さいです。" },
  { en: "fourteen", ja: "14", emoji: "🔢", ex: "I have fourteen pencils.", exJa: "えんぴつを 14ほん もっています。" },
  { en: "fifteen", ja: "15", emoji: "🔢", ex: "It is fifteen minutes.", exJa: "15ふんです。" },
  { en: "sixteen", ja: "16", emoji: "🔢", ex: "I have sixteen cards.", exJa: "カードを 16まい もっています。" },
  { en: "seventeen", ja: "17", emoji: "🔢", ex: "There are seventeen students.", exJa: "せいとが 17にん います。" },
  { en: "eighteen", ja: "18", emoji: "🔢", ex: "I am eighteen.", exJa: "わたしは 18さいです。" },
  { en: "nineteen", ja: "19", emoji: "🔢", ex: "It is nineteen dollars.", exJa: "19ドルです。" },
  { en: "twenty", ja: "20", emoji: "🔢", ex: "I have twenty stickers.", exJa: "シールを 20まい もっています。" },
  { en: "thirty", ja: "30", emoji: "🔢", ex: "It is thirty minutes.", exJa: "30ぷんです。" },
  { en: "forty", ja: "40", emoji: "🔢", ex: "There are forty people.", exJa: "40にん います。" },

  // ===== 521〜530 =====
  { en: "fifty", ja: "50", emoji: "🔢", ex: "It is fifty yen.", exJa: "50えんです。" },
  { en: "sixty", ja: "60", emoji: "🔢", ex: "There are sixty minutes in an hour.", exJa: "1じかんは 60ぷんです。" },
  { en: "seventy", ja: "70", emoji: "🔢", ex: "It is seventy dollars.", exJa: "70ドルです。" },
  { en: "eighty", ja: "80", emoji: "🔢", ex: "It is eighty yen.", exJa: "80えんです。" },
  { en: "ninety", ja: "90", emoji: "🔢", ex: "It is ninety dollars.", exJa: "90ドルです。" },
  { en: "hundred", ja: "100", emoji: "💯", ex: "I have one hundred yen.", exJa: "100えん もっています。" },
  { en: "thousand", ja: "1000,1000の", emoji: "🔢", ex: "It is one thousand yen.", exJa: "1000えんです。" },
  { en: "first", ja: "最初,最初の,最初に,1番目の", kana: ["さいしょ", "さいしょの", "いちばんめの", "1ばんめ", "1ばんめの"], emoji: "🥇", ex: "This is my first time.", exJa: "これが はじめてです。" },
  { en: "second", ja: "2番目,第2の,秒", kana: ["にばんめ", "だいにの", "びょう", "2ばんめ", "2ばんめの"], emoji: "🥈", ex: "This is my second book.", exJa: "これは 2さつめの 本ほんです。" },
  { en: "third", ja: "3番目,第3の", kana: ["さんばんめ", "だいさんの", "3ばんめ", "3ばんめの"], emoji: "🥉", ex: "This is my third try.", exJa: "これで 3かいめです。" },

  // ===== 531〜540 =====
  { en: "fourth", ja: "4番目の", kana: ["よんばんめの", "4ばんめ", "4ばんめの"], emoji: "🔢", ex: "I am in fourth grade.", exJa: "わたしは 4ねんせいです。" },
  { en: "fifth", ja: "5番目の", kana: ["ごばんめの", "5ばんめ", "5ばんめの"], emoji: "🔢", ex: "This is the fifth question.", exJa: "これは 5もんめです。" },
  { en: "sixth", ja: "6番目の", kana: ["ろくばんめの", "6ばんめ", "6ばんめの"], emoji: "🔢", ex: "This is the sixth day.", exJa: "きょうで 6にちめです。" },
  { en: "seventh", ja: "7番目の", kana: ["ななばんめの", "7ばんめ", "7ばんめの"], emoji: "🔢", ex: "Today is the seventh.", exJa: "きょうは 7かです。" },
  { en: "eighth", ja: "8番目の", kana: ["はちばんめの", "8ばんめ", "8ばんめの"], emoji: "🔢", ex: "Today is the eighth.", exJa: "きょうは 8かです。" },
  { en: "ninth", ja: "9番目の", kana: ["きゅうばんめの", "9ばんめ", "9ばんめの"], emoji: "🔢", ex: "Today is the ninth.", exJa: "きょうは 9かです。" },
  { en: "tenth", ja: "10番目の", kana: ["じゅうばんめの", "10ばんめ", "10ばんめの"], emoji: "🔢", ex: "Today is the tenth.", exJa: "きょうは 10かです。" },
  { en: "eleventh", ja: "11番目の", kana: ["じゅういちばんめの", "11ばんめ", "11ばんめの"], emoji: "🔢", ex: "Today is the eleventh.", exJa: "きょうは 11にちです。" },
  { en: "twelfth", ja: "12番目の", kana: ["じゅうにばんめの", "12ばんめ", "12ばんめの"], emoji: "🔢", ex: "Today is the twelfth.", exJa: "きょうは 12にちです。" },
  { en: "I", ja: "私は", kana: ["わたしは"], emoji: "🙋", ex: "I am a student.", exJa: "わたしは せいとです。" },

  // ===== 541〜550 =====
  { en: "my", ja: "私の", kana: ["わたしの"], emoji: "🙋", ex: "This is my bag.", exJa: "これは わたしの かばんです。" },
  { en: "me", ja: "私を[に]", kana: ["わたしを", "わたしに"], emoji: "🙋", ex: "Look at me.", exJa: "わたしを みて。" },
  { en: "mine", ja: "私のもの", kana: ["わたしのもの"], emoji: "🙋", ex: "This pen is mine.", exJa: "この ペンは わたしのです。" },
  { en: "you", ja: "あなたは,あなたたちは(主格)", kana: ["あなたは", "あなたたちは"], emoji: "🧑", ex: "You are kind.", exJa: "あなたは しんせつです。" },
  { en: "your", ja: "あなたの", emoji: "🧑", ex: "This is your book.", exJa: "これは あなたの 本ほんです。" },
  { en: "you", ja: "あなたに[を](目的格)", kana: ["あなたに", "あなたを"], emoji: "🧑", ex: "I know you.", exJa: "わたしは あなたを しっています。" },
  { en: "yours", ja: "あなた(がた)のもの", emoji: "🧑", ex: "This bag is yours.", exJa: "この かばんは あなたのです。" },
  { en: "he", ja: "彼は", kana: ["かれは"], emoji: "👦", ex: "He is my brother.", exJa: "かれは わたしの きょうだいです。" },
  { en: "his", ja: "彼の(所有格)", kana: ["かれの"], emoji: "👦", ex: "This is his bike.", exJa: "これは かれの じてんしゃです。" },
  { en: "him", ja: "彼を[に]", kana: ["かれを", "かれに"], emoji: "👦", ex: "I know him.", exJa: "わたしは かれを しっています。" },

  // ===== 551〜560 =====
  { en: "his", ja: "彼のもの(所有代名詞)", kana: ["かれのもの"], emoji: "👦", ex: "This bike is his.", exJa: "この じてんしゃは かれのです。" },
  { en: "she", ja: "彼女は", kana: ["かのじょは"], emoji: "👧", ex: "She is my sister.", exJa: "かのじょは わたしの しまいです。" },
  { en: "her", ja: "彼女の(所有格)", kana: ["かのじょの"], emoji: "👧", ex: "This is her bag.", exJa: "これは かのじょの かばんです。" },
  { en: "her", ja: "彼女を[に](目的格)", kana: ["かのじょを", "かのじょに"], emoji: "👧", ex: "I know her.", exJa: "わたしは かのじょを しっています。" },
  { en: "hers", ja: "彼女のもの", kana: ["かのじょのもの"], emoji: "👧", ex: "This bag is hers.", exJa: "この かばんは かのじょのです。" },
  { en: "it", ja: "それは(主格)", kana: ["それは"], emoji: "📦", ex: "I like it.", exJa: "わたしは それが すきです。" },
  { en: "its", ja: "その", emoji: "📦", ex: "The dog wags its tail.", exJa: "いぬは しっぽを ふります。" },
  { en: "it", ja: "それを[に](目的格)", kana: ["それを", "それに"], emoji: "📦", ex: "I have it.", exJa: "わたしは それを もっています。" },
  { en: "we", ja: "私たちは", kana: ["わたしたちは"], emoji: "👨‍👩‍👧", ex: "We are friends.", exJa: "わたしたちは ともだちです。" },
  { en: "our", ja: "私たちの", kana: ["わたしたちの"], emoji: "👨‍👩‍👧", ex: "This is our school.", exJa: "これは わたしたちの がっこうです。" },

  // ===== 561〜570 =====
  { en: "us", ja: "私たちを[に]", kana: ["わたしたちを", "わたしたちに"], emoji: "👨‍👩‍👧", ex: "Help us.", exJa: "わたしたちを たすけて。" },
  { en: "ours", ja: "私たちのもの", kana: ["わたしたちのもの"], emoji: "👨‍👩‍👧", ex: "This house is ours.", exJa: "この いえは わたしたちのです。" },
  { en: "they", ja: "彼らは,彼女たちは,それらは", kana: ["かれらは", "かのじょたちは", "それらは"], emoji: "👥", ex: "They are my friends.", exJa: "かれらは わたしの ともだちです。" },
  { en: "their", ja: "彼らの,それらの", kana: ["かれらの", "それらの"], emoji: "👥", ex: "This is their house.", exJa: "これは かれらの いえです。" },
  { en: "them", ja: "彼らに[を],それらに[を]", kana: ["かれらに", "かれらを", "それらに"], emoji: "👥", ex: "I know them.", exJa: "わたしは かれらを しっています。" },
  { en: "theirs", ja: "彼らのもの,それらのもの", kana: ["かれらのもの", "それらのもの"], emoji: "👥", ex: "This bag is theirs.", exJa: "この かばんは かれらのです。" },
  { en: "this", ja: "これ,この", emoji: "👉", ex: "This is my pen.", exJa: "これは わたしの ペンです。" },
  { en: "that", ja: "あれ,あの", emoji: "👈", ex: "That is a cat.", exJa: "あれは ねこです。" },
  { en: "these", ja: "これら,これらの", emoji: "👉", ex: "These are my books.", exJa: "これらは わたしの 本ほんです。" },
  { en: "those", ja: "あれら,それら,あれらの", emoji: "👈", ex: "Those are my shoes.", exJa: "あれらは わたしの くつです。" },
  { en: "come from", ja: "～の出身である", kana: ["しゅっしんである"], emoji: "🌍", ex: "I come from Japan.", exJa: "わたしは にほんの しゅっしんです。" },
  { en: "come to", ja: "～に来る", kana: ["くる", "にくる"], emoji: "➡️", ex: "Come to my house.", exJa: "わたしの いえに きて。" },
  { en: "do one's homework", ja: "宿題をする", kana: ["しゅくだいをする"], emoji: "📝", ex: "I do my homework.", exJa: "わたしは しゅくだいを します。" },
  { en: "get up", ja: "起きる,立ち上がる", kana: ["おきる", "たちあがる"], emoji: "⏰", ex: "I get up at seven.", exJa: "わたしは 7じに おきます。" },

  // ===== 571〜580 =====
  { en: "go doing", ja: "～しに行く", kana: ["しにいく"], emoji: "🚶", ex: "I go fishing.", exJa: "わたしは つりに いきます。" },
  { en: "go home", ja: "家に帰る", kana: ["いえにかえる"], emoji: "🏠", ex: "I go home at five.", exJa: "わたしは 5じに いえに かえります。" },
  { en: "go to", ja: "～へ行く", kana: ["いく", "へいく"], emoji: "➡️", ex: "I go to school.", exJa: "わたしは がっこうへ いきます。" },
  { en: "like doing", ja: "～することが好きである", kana: ["することがすきである", "するのがすき"], emoji: "❤️", ex: "I like swimming.", exJa: "わたしは およぐことが すきです。" },
  { en: "listen to", ja: "～を聞く", kana: ["きく", "をきく"], emoji: "👂", ex: "I listen to music.", exJa: "わたしは おんがくを ききます。" },
  { en: "live in", ja: "～に住んでいる", kana: ["すんでいる", "にすんでいる"], emoji: "🏠", ex: "I live in Tokyo.", exJa: "わたしは とうきょうに すんでいます。" },
  { en: "look at", ja: "～を見る", kana: ["みる", "をみる"], emoji: "👀", ex: "Look at this.", exJa: "これを みて。" },
  { en: "sit down", ja: "座る", kana: ["すわる"], emoji: "🪑", ex: "Please sit down.", exJa: "すわって ください。" },
  { en: "sleep in bed", ja: "ベッドで眠る", kana: ["べっどでねむる"], emoji: "🛏️", ex: "I sleep in bed.", exJa: "わたしは ベッドで ねます。" },
  { en: "speak to", ja: "～と話す", kana: ["はなす", "とはなす"], emoji: "🗣️", ex: "I speak to my teacher.", exJa: "わたしは 先生せんせいと はなします。" },

  // ===== 581〜590 =====
  { en: "stand up", ja: "立ち上がる", kana: ["たちあがる"], emoji: "🧍", ex: "Please stand up.", exJa: "たって ください。" },
  { en: "take a picture", ja: "写真を撮る", kana: ["しゃしんをとる"], emoji: "📸", ex: "I take a picture.", exJa: "わたしは しゃしんを とります。" },
  { en: "take a shower", ja: "シャワーを浴びる", kana: ["しゃわーをあびる"], emoji: "🚿", ex: "I take a shower.", exJa: "わたしは シャワーを あびます。" },
  { en: "talk about", ja: "～について話す", kana: ["についてはなす"], emoji: "💬", ex: "I talk about my dog.", exJa: "わたしは いぬについて はなします。" },
  { en: "a cup of", ja: "1杯の～", kana: ["いっぱいの"], emoji: "☕", ex: "I want a cup of tea.", exJa: "わたしは おちゃが 1ぱい ほしいです。" },
  { en: "a glass of", ja: "コップ一杯の～", kana: ["こっぷいっぱいの"], emoji: "🥛", ex: "I want a glass of water.", exJa: "わたしは みずが 1ぱい ほしいです。" },
  { en: "a lot of", ja: "たくさんの～", emoji: "💯", ex: "I have a lot of books.", exJa: "わたしは 本ほんを たくさん もっています。" },
  { en: "after school", ja: "放課後", kana: ["ほうかご"], emoji: "🏫", ex: "I play soccer after school.", exJa: "わたしは ほうかご サッカーを します。" },
  { en: "at home", ja: "家で,家に", kana: ["いえで", "いえに"], emoji: "🏠", ex: "I study at home.", exJa: "わたしは いえで べんきょうします。" },
  { en: "at school", ja: "学校で", kana: ["がっこうで"], emoji: "🏫", ex: "I study at school.", exJa: "わたしは がっこうで べんきょうします。" },

  // ===== 591〜600 =====
  { en: "from A to B", ja: "AからBまで", emoji: "➡️", ex: "I walk from home to school.", exJa: "わたしは いえから がっこうまで あるきます。" },
  { en: "in the morning", ja: "朝に,午前中に", kana: ["あさに", "ごぜんちゅうに"], emoji: "🌅", ex: "I study in the morning.", exJa: "わたしは あさ べんきょうします。" },
  { en: "on TV", ja: "テレビで", emoji: "📺", ex: "I watch soccer on TV.", exJa: "わたしは テレビで サッカーを みます。" },
  { en: "on weekends", ja: "毎週末に", kana: ["まいしゅうまつに"], emoji: "🎉", ex: "I play tennis on weekends.", exJa: "わたしは まいしゅうまつ テニスを します。" },
  { en: "over there", ja: "向こうに,あそこに", kana: ["むこうに", "あそこに"], emoji: "📍", ex: "Look over there.", exJa: "あそこを みて。" },
  { en: "years old", ja: "～歳", kana: ["さい"], emoji: "🎂", ex: "I am eight years old.", exJa: "わたしは 8さいです。" },
];

/* =========================================================
   じかん・こよみ の てがき SVG ずかい
   マイクラふうの ブロックいろで、かどが かくかくした
   シンプルな せんがを コードで つくる(がぞう ファイルは つかわない)。
   ========================================================= */
const WD_COLORS = ["#FFD23C", "#5C6FE0", "#E0472E", "#2D9FE0", "#3E9E1E", "#D9B23C", "#9A9A9A"]; // 日月火水木金土(getDay じゅん)
const WD_LETTERS = ["日", "月", "火", "水", "木", "金", "土"];

function svgWeekStrip(highlightAll, highlightSet) {
  let cells = "";
  for (let i = 0; i < 7; i++) {
    const x = 6 + i * 27;
    const on = highlightAll || (highlightSet && highlightSet.has(i));
    const fill = on ? WD_COLORS[i] : "#3A3A3A";
    const stroke = on ? "#FFFFFF" : "#000000";
    cells += `<rect x="${x}" y="20" width="21" height="21" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    cells += `<text x="${x + 10.5}" y="35" font-size="11" fill="${on ? "#1A1A1A" : "#888"}" text-anchor="middle" font-family="sans-serif" font-weight="bold">${WD_LETTERS[i]}</text>`;
  }
  return `<svg viewBox="0 0 195 62" width="100%" height="62">${cells}</svg>`;
}

function svgSky(skyColors, groundColor, bodyX, bodyY, bodyColor, isMoon, showStars) {
  const bands = skyColors.map((c, i) => `<rect x="0" y="${i * (78 / skyColors.length)}" width="200" height="${78 / skyColors.length + 1}" fill="${c}"/>`).join("");
  const stars = showStars ? `<circle cx="35" cy="18" r="2" fill="#FFF"/><circle cx="165" cy="14" r="2" fill="#FFF"/><circle cx="60" cy="42" r="2" fill="#FFF"/><circle cx="145" cy="38" r="2" fill="#FFF"/><circle cx="20" cy="55" r="2" fill="#FFF"/>` : "";
  const body = isMoon
    ? `<circle cx="${bodyX}" cy="${bodyY}" r="16" fill="#F2F2F2"/><circle cx="${bodyX + 7}" cy="${bodyY - 4}" r="14" fill="${skyColors[skyColors.length - 1]}"/>`
    : `<circle cx="${bodyX}" cy="${bodyY}" r="17" fill="${bodyColor}" stroke="#00000033" stroke-width="1"/>`;
  return `<svg viewBox="0 0 200 108" width="100%" height="108">
    ${bands}
    <rect x="0" y="78" width="200" height="30" fill="${groundColor}"/>
    ${stars}
    ${body}
  </svg>`;
}

function svgClock(handDeg, wedgeDeg, sunAbove) {
  const cx = 70, cy = sunAbove ? 78 : 60, r = 50;
  const rad = (d) => ((d - 90) * Math.PI) / 180;
  const hx = cx + Math.cos(rad(handDeg)) * (r - 14);
  const hy = cy + Math.sin(rad(handDeg)) * (r - 14);
  let ticks = "";
  for (let i = 0; i < 12; i++) {
    const a = rad(i * 30);
    ticks += `<line x1="${cx + Math.cos(a) * (r - 7)}" y1="${cy + Math.sin(a) * (r - 7)}" x2="${cx + Math.cos(a) * r}" y2="${cy + Math.sin(a) * r}" stroke="#FFF" stroke-width="3"/>`;
  }
  let wedge = "";
  if (wedgeDeg > 0) {
    const a2 = rad(wedgeDeg);
    const x2 = cx + Math.cos(a2) * r, y2 = cy + Math.sin(a2) * r;
    wedge = `<path d="M${cx},${cy} L${cx},${cy - r} A${r},${r} 0 0 1 ${x2},${y2} Z" fill="#FCEE4B" opacity="0.55"/>`;
  }
  const sun = sunAbove ? `<circle cx="${cx}" cy="14" r="12" fill="#FFEB3B"/><line x1="${cx}" y1="-2" x2="${cx}" y2="4" stroke="#FFEB3B" stroke-width="3"/><line x1="${cx - 20}" y1="14" x2="${cx - 14}" y2="14" stroke="#FFEB3B" stroke-width="3"/><line x1="${cx + 14}" y1="14" x2="${cx + 20}" y2="14" stroke="#FFEB3B" stroke-width="3"/>` : "";
  return `<svg viewBox="0 0 140 ${sunAbove ? 136 : 118}" width="140" height="${sunAbove ? 136 : 118}">
    ${sun}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#2E2E2E" stroke="#FFF" stroke-width="4"/>
    ${wedge}
    ${ticks}
    <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="#FCEE4B" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="4" fill="#FCEE4B"/>
  </svg>`;
}

function svgMonthGrid() {
  let cells = "";
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 7; c++) {
      cells += `<rect x="${8 + c * 27}" y="${28 + r * 17}" width="23" height="13" fill="#4A4A4A" stroke="#000" stroke-width="1"/>`;
    }
  }
  return `<svg viewBox="0 0 200 100" width="100%" height="100">
    <rect x="0" y="0" width="200" height="24" fill="#E04B2E"/>
    <text x="100" y="16" font-size="12" fill="#FFF" text-anchor="middle" font-family="sans-serif" font-weight="bold">1かげつ</text>
    ${cells}
  </svg>`;
}

function svgYearWheel() {
  const cx = 70, cy = 68, r = 46;
  const seasonColors = ["#BFE6FF", "#BFE6FF", "#FFD3EC", "#FFD3EC", "#FFD3EC", "#FFF3A0", "#FFF3A0", "#FFF3A0", "#FFD199", "#FFD199", "#FFD199", "#BFE6FF"];
  let blocks = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    blocks += `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" fill="${seasonColors[i]}" stroke="#000" stroke-width="1.5"/>`;
  }
  return `<svg viewBox="0 0 140 136" width="140" height="136">
    <circle cx="${cx}" cy="${cy}" r="${r + 16}" fill="#2E2E2E" stroke="#000" stroke-width="1"/>
    ${blocks}
    <text x="${cx}" y="${cy + 4}" font-size="12" fill="#FFF" text-anchor="middle" font-family="sans-serif" font-weight="bold">1ねん</text>
  </svg>`;
}

function svgCalStrip(mode) {
  let cells = "";
  const hiIdx = mode === "today" ? 1 : mode === "tomorrow" ? 2 : -1;
  for (let i = 0; i < 3; i++) {
    const x = 12 + i * 62;
    const on = i === hiIdx;
    const fill = on ? "#FCEE4B" : "#4A4A4A";
    cells += `<rect x="${x}" y="8" width="50" height="50" fill="${fill}" stroke="#000" stroke-width="2"/>`;
    if (mode === "date" && i === 1) {
      cells += `<text x="${x + 25}" y="42" font-size="26" fill="#1A1A1A" text-anchor="middle" font-family="sans-serif" font-weight="bold">?</text>`;
    }
  }
  const arrow =
    mode === "tomorrow"
      ? `<polygon points="83,28 100,28 100,20 118,33 100,46 100,38 83,38" fill="#17DD62"/>`
      : "";
  return `<svg viewBox="0 0 198 66" width="100%" height="66">${cells}${arrow}</svg>`;
}

function svgDayArc() {
  return `<svg viewBox="0 0 200 108" width="100%" height="108">
    <rect x="0" y="0" width="200" height="78" fill="#4A78C4"/>
    <rect x="0" y="78" width="200" height="30" fill="#3E7A19"/>
    <path d="M18,78 Q100,6 182,78" fill="none" stroke="#FCEE4B" stroke-width="2" stroke-dasharray="5,5"/>
    <circle cx="18" cy="78" r="10" fill="#FFB870"/>
    <circle cx="100" cy="16" r="14" fill="#FFEB3B"/>
    <circle cx="182" cy="78" r="10" fill="#FF7B54"/>
    <circle cx="192" cy="94" r="8" fill="#F2F2F2"/>
  </svg>`;
}

/* =========================================================
   ぶんぽうご(頻度・前置詞・接続詞)の てがき SVG ずかい
   ========================================================= */
function svgFreqMeter(level) {
  let cells = "";
  for (let i = 0; i < 4; i++) {
    const on = i < level;
    cells += `<rect x="${10 + i * 46}" y="14" width="38" height="38" fill="${on ? "#17DD62" : "#3A3A3A"}" stroke="#000" stroke-width="2"/>`;
    if (on) cells += `<text x="${10 + i * 46 + 19}" y="39" font-size="18" text-anchor="middle" fill="#0A3B1E" font-weight="bold">✓</text>`;
  }
  return `<svg viewBox="0 0 200 66" width="100%" height="66">${cells}</svg>`;
}

function svgPrepBox(mode) {
  const bx = 65, by = 45, bw = 60, bh = 38, r = 12;
  let box = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#5A5A5A" stroke="#FFF" stroke-width="2"/>`;
  let ball = "";
  if (mode === "in") ball = `<circle cx="${bx + bw / 2}" cy="${by + bh / 2 + 4}" r="${r}" fill="#FCEE4B"/>`;
  else if (mode === "on") ball = `<circle cx="${bx + bw / 2}" cy="${by - r + 3}" r="${r}" fill="#FCEE4B"/>`;
  else if (mode === "under") ball = `<circle cx="${bx + bw / 2}" cy="${by + bh + r + 6}" r="${r}" fill="#FCEE4B"/>`;
  else if (mode === "near") ball = `<circle cx="${bx + bw + r + 16}" cy="${by + bh / 2}" r="${r}" fill="#FCEE4B"/>`;
  else if (mode === "with") {
    box = "";
    ball = `<circle cx="85" cy="64" r="${r}" fill="#FCEE4B"/><circle cx="115" cy="64" r="${r}" fill="#4AEDD9"/><line x1="97" y1="64" x2="103" y2="64" stroke="#FFF" stroke-width="3"/>`;
  }
  return `<svg viewBox="0 0 200 130" width="100%" height="130">${box}${ball}</svg>`;
}

function svgTimeline(mode) {
  const shade =
    mode === "before"
      ? `<rect x="10" y="24" width="90" height="32" fill="#17DD62" opacity="0.45"/>`
      : `<rect x="100" y="24" width="90" height="32" fill="#17DD62" opacity="0.45"/>`;
  return `<svg viewBox="0 0 200 70" width="100%" height="70">
    <line x1="10" y1="40" x2="190" y2="40" stroke="#FFF" stroke-width="3"/>
    ${shade}
    <circle cx="100" cy="40" r="9" fill="#FCEE4B" stroke="#000" stroke-width="2"/>
  </svg>`;
}

function svgFromPoint() {
  return `<svg viewBox="0 0 200 70" width="100%" height="70">
    <circle cx="30" cy="35" r="11" fill="#FCEE4B" stroke="#000" stroke-width="2"/>
    <line x1="44" y1="35" x2="165" y2="35" stroke="#17DD62" stroke-width="4"/>
    <polygon points="165,26 190,35 165,44" fill="#17DD62"/>
  </svg>`;
}

function svgAbout() {
  return `<svg viewBox="0 0 140 100" width="140" height="100">
    <circle cx="70" cy="50" r="35" fill="none" stroke="#FCEE4B" stroke-width="4" stroke-dasharray="7,6"/>
    <text x="70" y="60" font-size="28" fill="#FCEE4B" text-anchor="middle" font-weight="bold">≈</text>
  </svg>`;
}

function svgLogic(mode) {
  if (mode === "and") {
    return `<svg viewBox="0 0 200 90" width="100%" height="90">
      <circle cx="82" cy="45" r="34" fill="#FCEE4B" opacity="0.75"/>
      <circle cx="118" cy="45" r="34" fill="#4AEDD9" opacity="0.75"/>
      <text x="100" y="52" font-size="22" text-anchor="middle" fill="#000" font-weight="bold">+</text>
    </svg>`;
  }
  if (mode === "or") {
    return `<svg viewBox="0 0 200 90" width="100%" height="90">
      <circle cx="65" cy="45" r="30" fill="#FCEE4B" stroke="#000" stroke-width="2"/>
      <text x="65" y="52" font-size="16" text-anchor="middle" fill="#000" font-weight="bold">A</text>
      <text x="100" y="52" font-size="16" text-anchor="middle" fill="#FFF" font-weight="bold">or</text>
      <circle cx="135" cy="45" r="30" fill="#4AEDD9" stroke="#000" stroke-width="2"/>
      <text x="135" y="52" font-size="16" text-anchor="middle" fill="#000" font-weight="bold">B</text>
    </svg>`;
  }
  return `<svg viewBox="0 0 200 90" width="100%" height="90">
    <circle cx="55" cy="45" r="30" fill="#17DD62"/>
    <text x="55" y="55" font-size="28" text-anchor="middle">🙂</text>
    <line x1="98" y1="45" x2="138" y2="45" stroke="#FFF" stroke-width="3" stroke-dasharray="5,5"/>
    <text x="118" y="32" font-size="12" text-anchor="middle" fill="#FFF">but</text>
    <circle cx="165" cy="45" r="30" fill="#E03434"/>
    <text x="165" y="55" font-size="28" text-anchor="middle">🙁</text>
  </svg>`;
}

function svgQuestion(icon) {
  return `<svg viewBox="0 0 170 110" width="100%" height="110">
    <text x="55" y="80" font-size="70" text-anchor="middle" fill="#FCEE4B" font-weight="bold" font-family="sans-serif">?</text>
    <circle cx="128" cy="55" r="30" fill="#4A4A4A" stroke="#FFF" stroke-width="2"/>
    <text x="128" y="67" font-size="30" text-anchor="middle">${icon}</text>
  </svg>`;
}

function svgQuantity(highlightCount, dashed) {
  let cells = "";
  const total = 6;
  for (let i = 0; i < total; i++) {
    const x = 8 + i * 32;
    const on = !dashed && i < highlightCount;
    const fill = on ? "#17DD62" : "none";
    const stroke = dashed ? "#FCEE4B" : on ? "#0E9E44" : "#4A4A4A";
    const dash = dashed ? `stroke-dasharray="4,3"` : "";
    cells += `<circle cx="${x + 12}" cy="20" r="12" fill="${fill}" stroke="${stroke}" stroke-width="3" ${dash}/>`;
  }
  return `<svg viewBox="0 0 200 40" width="100%" height="40">${cells}</svg>`;
}

/* =========================================================
   イメージずかい
   week / year みたいな「絵に しにくい ことば」を
   目で わかるように します。
   ========================================================= */
const VISUALS = {
  // --- じかん・こよみ(てがき SVG) ---
  day:       { svg: svgDayArc(), label: "あさ→ひる→ゆうがた→よる で 1にち" },
  morning:   { svg: svgSky(["#FFD9A0", "#FFB870"], "#3E7A19", 100, 64, "#FFD23C", false, false), label: "1にちの さいしょ、たいようが のぼる" },
  afternoon: { svg: svgSky(["#6FC6FF", "#8FD6FF"], "#3E7A19", 100, 22, "#FFEB3B", false, false), label: "おひるすぎ、たいようが いちばん たかい" },
  evening:   { svg: svgSky(["#E0668C", "#FF9D5C"], "#3E7A19", 100, 64, "#FFEB3B", false, false), label: "ひが しずむ ころ" },
  night:     { svg: svgSky(["#0E1B3D", "#1B2A4A"], "#122015", 100, 34, null, true, true), label: "つきが でる、ねる じかん" },
  noon:      { svg: svgClock(0, 0, true), label: "ちょうど 12じ、たいようが まうえ" },
  hour:      { svg: svgClock(30, 30, false), label: "この 1きれぶんが 1じかん" },
  time:      { svg: svgClock(90, 0, false), label: "とけいが さす「じかん」" },
  date:      { svg: svgCalStrip("date"), label: "なんにち かの「ひづけ」" },
  today:     { svg: svgCalStrip("today"), label: "いまの ひ" },
  tomorrow:  { svg: svgCalStrip("tomorrow"), label: "きょうの つぎの ひ" },
  week:      { svg: svgWeekStrip(true), label: "にち・げつ・か・すい・もく・きん・ど = 7日で 1しゅう" },
  weekend:   { svg: svgWeekStrip(false, new Set([0, 6])), label: "1しゅうの おわり(ど・にち)" },
  month:     { svg: svgMonthGrid(), label: "たくさんの 日 あつまって 1かげつ(だいたい30日)" },
  year:      { svg: svgYearWheel(), label: "1がつ〜12がつ ぐるっと まわって 1ねん" },

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

  // --- ひんど(どのくらい よくする?) ---
  always:    { svg: svgFreqMeter(4), label: "4こ ぜんぶ = いつも(100%)" },
  usually:   { svg: svgFreqMeter(3), label: "4こ中 3こ = たいてい" },
  often:     { svg: svgFreqMeter(2), label: "4こ中 2こ = よく" },
  sometimes: { svg: svgFreqMeter(1), label: "4こ中 1こ = ときどき" },

  // --- ばしょ(なにが どこに ある?) ---
  in:        { svg: svgPrepBox("in"), label: "はこの なかに" },
  on:        { svg: svgPrepBox("on"), label: "はこの うえに" },
  under:     { svg: svgPrepBox("under"), label: "はこの したに" },
  near:      { svg: svgPrepBox("near"), label: "はこの ちかくに" },
  with:      { svg: svgPrepBox("with"), label: "ふたつが いっしょに" },
  from:      { svg: svgFromPoint(), label: "この てんから スタート" },
  about:     { svg: svgAbout(), label: "きっちりじゃなく、だいたい" },

  // --- じかんの まえ・あと ---
  before:    { svg: svgTimeline("before"), label: "きじゅんてんより まえ" },
  after:     { svg: svgTimeline("after"), label: "きじゅんてんより あと" },

  // --- つなぐ ことば ---
  and:       { svg: svgLogic("and"), label: "Aと Bの りょうほう" },
  or:        { svg: svgLogic("or"), label: "Aか Bか、どちらか" },
  but:       { svg: svgLogic("but"), label: "うれしい でも かなしい、はんたいの きもち" },

  // --- しつもんの ことば(5W1H) ---
  what:      { svg: svgQuestion("📦"), label: "なにか(もの)を たずねる" },
  who:       { svg: svgQuestion("🧑"), label: "だれか(人)を たずねる" },
  when:      { svg: svgQuestion("🕐"), label: "いつか(じかん)を たずねる" },
  where:     { svg: svgQuestion("📍"), label: "どこか(ばしょ)を たずねる" },
  why:       { svg: svgQuestion("💡"), label: "りゆうを たずねる" },
  how:       { svg: svgQuestion("🔧"), label: "やりかた・ようすを たずねる" },
  which:     { svg: svgQuestion("🔀"), label: "どちらかを たずねる" },
  whose:     { svg: svgQuestion("🖐️"), label: "だれの ものかを たずねる" },

  // --- どのくらい あるか ---
  all:       { svg: svgQuantity(6, false), label: "6こ ぜんぶ = すべて" },
  every:     { svg: svgQuantity(6, false), label: "6こ ぜんぶ = ひとつひとつ みんな" },
  many:      { svg: svgQuantity(4, false), label: "6こ中 4こ = おおい" },
  some:      { svg: svgQuantity(2, false), label: "6こ中 2こ = いくつか" },
  any:       { svg: svgQuantity(0, true), label: "きめて いない、どれでも" },
};

/* ---- ばんごうを ふる ---- */
WORD_LIST.forEach((w, i) => {
  w.id = i;
  w.no = i + 1;             // パス単の たんごばんごう
  if (VISUALS[w.en]) w.vis = VISUALS[w.en];
});

/* =========================================================
   A: れんしゅう はんい(パス単プリントの じゅんばんに あわせて
   15ごずつに くぎる。ぜんぶで 10はんい)
   ========================================================= */
/* ごうかくライン(必須)/ ボーナス(よゆうが あれば)の わけかた。
   パス単は「でるじゅん」だけど、代名詞・疑問詞・数字のような
   ぶんぽうの きほんが うしろの ほうに かたまっているので、
   316〜495ばん(かぐ・たてもの・しょくぎょう・とくていの
   食べ物・天気の けいようし など)を ボーナスあつかいにする。 */
const BONUS_RANGE_IDS = new Set([22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33]);

const RANGES = [];
for (let r = 0; r * 15 < WORD_LIST.length; r++) {
  const from = r * 15 + 1;
  const to = Math.min((r + 1) * 15, WORD_LIST.length);
  const id = r + 1;
  RANGES.push({ id, from, to, title: `${from}〜${to}ばん`, bonus: BONUS_RANGE_IDS.has(id) });
}
function wordsInRange(rangeId) {
  const r = RANGES[rangeId - 1];
  return WORD_LIST.filter((w) => w.no >= r.from && w.no <= r.to);
}
const CORE_WORD_IDS = new Set(
  RANGES.filter((r) => !r.bonus).flatMap((r) => wordsInRange(r.id).map((w) => w.id))
);

/* =========================================================
   B: ようびボックス(げつ〜にち の 7こ)
   JSの Date.getDay() の ばんごうに あわせる (0=にち,1=げつ...6=ど)
   ========================================================= */
const WEEKDAYS = [
  { day: 1, label: "げつ", icon: "🌙" },
  { day: 2, label: "か",   icon: "🔥" },
  { day: 3, label: "すい", icon: "💧" },
  { day: 4, label: "もく", icon: "🌳" },
  { day: 5, label: "きん", icon: "🪙" },
  { day: 6, label: "ど",   icon: "🪨" },
  { day: 0, label: "にち", icon: "☀️" },
];

/* =========================================================
   ランク(マイクラの ブロックが すすんでいく)
   300ごを 15だんかいに わけて、ほった かずで ランクが あがる。
   ========================================================= */
const TIERS = [
  { name: "くさはら",       icon: "🟩", color: "#5EA827" },
  { name: "もりのなか",     icon: "🌳", color: "#3E7A19" },
  { name: "すなはま",       icon: "🟨", color: "#D9C38A" },
  { name: "いしのどうくつ", icon: "⬜", color: "#9A9A9A" },
  { name: "せきたんこう",   icon: "⬛", color: "#4A4A4A" },
  { name: "どうこうせき",   icon: "🟧", color: "#C87137" },
  { name: "てつこうせき",   icon: "🤍", color: "#D8AF93" },
  { name: "きんこうせき",   icon: "🟨", color: "#FCEE4B" },
  { name: "レッドストーン", icon: "🟥", color: "#E03434" },
  { name: "ラピスラズリ",   icon: "🟦", color: "#2D5FCE" },
  { name: "エメラルド",     icon: "💚", color: "#17DD62" },
  { name: "ダイヤモンド",   icon: "💎", color: "#4AEDD9" },
  { name: "ネザー",         icon: "🔥", color: "#B02E26" },
  { name: "エンド",         icon: "🟪", color: "#8C5FCF" },
  { name: "エンダードラゴン", icon: "🐉", color: "#22162B" },
];

function tierInfo(count, total) {
  const perTier = total / TIERS.length;
  const idx = Math.min(TIERS.length - 1, Math.floor(count / perTier));
  const tier = TIERS[idx];
  const nextNeed = Math.ceil((idx + 1) * perTier);
  const inTierPct = idx === TIERS.length - 1 ? 100 : Math.min(100, ((count - idx * perTier) / perTier) * 100);
  return { idx, tier, nextTier: TIERS[idx + 1] || null, nextNeed, pct: inTierPct };
}

/* =========================================================
   にゅうりょくモードで「きいて 日本語を かく」のが むずかしい たんご

   ぜんちし・せつぞくし・be動詞・かんし など、
   えいごを きいても 日本語の いいかたが 1つに きまらない ことば。
   (of → 「の」? by → 「そば」? は 小2には むり)
   これらは にゅうりょくモードでも 4たくで 出す。
   「なに・だれ・どこ・いつ」や だいめいし(私は/彼の)は
   こたえが きまるので にゅうりょくの ままに しておく。
   ========================================================= */
const TYPE_HARD_EN = new Set([
  // be動詞・じょどうし・ひてい
  "am", "are", "is", "was", "were", "do", "does", "did", "not",
  // かんし
  "a", "an", "the",
  // ぜんちし
  "in", "on", "at", "to", "for", "of", "by", "with", "from",
  "under", "after", "before", "about", "near", "around", "into", "over",
  // せつぞくし
  "and", "or", "but", "so",
  // じょし みたいな ふくし
  "too", "also", "only", "just",
  // さししめす ことばの うち あいまいな もの
  "its", "some", "any", "every",
]);
function isTypeHard(w) { return TYPE_HARD_EN.has(w.en); }

/* =========================================================
   ぶんの あなうめ(えいけん5きゅう 大問1 と おなじ かたち)

   at / of / is / am のような きのうごは、たんご 1つだけ 見せても
   おぼえられない(「of = の」と おぼえても つかえない)。
   じっさいの 5きゅう 大問1も「短文の語句空所補充」なので、
   ぶんの なかの あなを うめる かたちで 出題する。

   ちらしの こたえ(まちがいの せんたくし)は、
   「文ぽうてきに ぜったい 入らない」ものを 1語ずつ てで えらんである。
   (ランダムに えらぶと「どちらでも 正しい」ぶんが できてしまうため)
   ========================================================= */
const CLOZE_DISTRACTORS = {
  // be動詞・じょどうし
  am:     ["are", "is", "do"],
  are:    ["am", "is", "do"],
  is:     ["am", "are", "do"],
  do:     ["am", "is", "are"],
  not:    ["no", "don't", "isn't"],
  // じょし みたいな ふくし
  too:    ["very", "so", "and"],
  just:   ["very", "too", "so"],
  only:   ["very", "too", "and"],
  around: ["at", "of", "and"],
  also:   ["am", "very", "and"],
  // ぜんちし
  in:     ["on", "under", "near"],
  to:     ["at", "of", "for"],
  at:     ["to", "from", "of"],
  on:     ["of", "to", "and"],
  for:    ["of", "in", "at"],
  of:     ["in", "at", "to"],
  by:     ["in", "of", "at"],
  with:   ["of", "at", "to"],
  from:   ["to", "at", "of"],
  under:  ["on", "in", "near"],
  after:  ["before", "in", "of"],
  before: ["after", "in", "of"],
  about:  ["to", "at", "by"],
  near:   ["to", "of", "from"],
  // かんし
  the:    ["a", "an", "of"],
  a:      ["an", "is", "in"],
  // せつぞくし
  and:    ["or", "but", "so"],
  or:     ["and", "but", "so"],
  but:    ["and", "or", "so"],
  so:     ["and", "or", "but"],
  // すうりょう・しじ
  every:  ["some", "any", "one"],
  some:   ["a", "an", "every"],
  its:    ["it", "is", "of"],
};

/* 例文を「まえ / あな / あと」に わける。
   その たんごが 例文に 出てこない ときは null。 */
function clozeParts(w) {
  if (!w.ex) return null;
  const esc = w.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp("(^|[^A-Za-z])(" + esc + ")([^A-Za-z]|$)", "i");
  const m = w.ex.match(re);
  if (!m) return null;
  const start = m.index + m[1].length;
  return {
    before: w.ex.slice(0, start),
    answer: m[2],
    after: w.ex.slice(start + m[2].length),
  };
}

/* あなうめの せんたくし(ただしい 1つ + まちがい 3つ)。
   てで きめた ちらしが あれば それ、なければ
   ちかい ばんごうの たんごから えらぶ。 */
function clozeChoices(w, shuffleFn) {
  const fixed = CLOZE_DISTRACTORS[w.en];
  let wrongs;
  if (fixed) {
    wrongs = fixed.slice(0, 3);
  } else {
    // じゅくご(go home など)には じゅくごを、たんごには たんごを あてる。
    // かたちが そろっていないと どれが こたえか 見ただけで わかってしまう。
    const isPhrase = /\s/.test(w.en);
    const same = (x) => /\s/.test(x.en) === isPhrase;
    // WORD_LIST には つづりが おなじ みだしが 2つある ものが あるので
    // en で じゅうふくを のぞく(her が 2こ ならぶのを ふせぐ)
    const seen = new Set([w.en.toLowerCase()]);
    const uniq = (list) => list.filter((x) => {
      const k = x.en.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const near = uniq(WORD_LIST.filter((x) => same(x) && Math.abs(x.no - w.no) <= 30));
    let pool = near;
    if (pool.length < 3) {
      pool = pool.concat(uniq(WORD_LIST.filter((x) => same(x))));
    }
    if (pool.length < 3) {
      pool = pool.concat(uniq(WORD_LIST.slice()));
    }
    wrongs = shuffleFn(pool).slice(0, 3).map((x) => x.en);
  }
  return shuffleFn([w.en, ...wrongs]);
}

/* =========================================================
   こたえの いいかえ(にゅうりょくモード ようの どうぎご)

   パス単の やくは 1つだけ だけど、子どもは べつの いいかたで
   かくことが おおい。(very → 「すごく」、often → 「ときどき」)
   ここに かいた ことばも せいかいに する。
   ========================================================= */
const JA_ALT = {
  // ようす・ふくし
  very: ["すごく", "めっちゃ", "ものすごく", "すごい", "とても"],
  really: ["ほんとに", "すごく", "まじで"],
  well: ["うまい", "じょうずな", "とくいな", "げんきな"],
  often: ["ときどき", "なんかいも", "よく"],
  sometimes: ["たまに", "ときには"],
  usually: ["いつも", "だいたい", "ふだん"],
  always: ["ずっと", "まいかい", "かならず"],
  just: ["いま", "ぴったり", "たったいま"],
  so: ["すごく", "そんなに", "なので"],
  too: ["も", "また", "すぎる", "よけい"],
  also: ["も", "また", "さらに"],
  only: ["だけ", "しか", "ただそれだけ"],
  again: ["もういちど", "もういっかい", "ふたたび"],
  together: ["みんなで", "いっしょ"],
  here: ["ここ", "こっち"],
  there: ["そこ", "あそこ", "そっち"],
  up: ["うえ", "うわ", "たちあがる"],
  down: ["した", "したの", "おりる"],
  out: ["そと", "そとの"],
  now: ["いま"],
  today: ["きょう"],
  // ぜんちし(4たくで 出すけど、いちらん・れんしゅうよう)
  in: ["なか", "なかに", "のなか"],
  on: ["うえ", "うえに", "のうえ"],
  under: ["した", "したに", "のした"],
  near: ["ちかく", "ちかくに", "そば"],
  with: ["いっしょ", "と", "とともに"],
  about: ["だいたい", "およそ", "について", "やく"],
  around: ["まわり", "まわりに", "ごろ", "あちこち"],
  after: ["あと", "あとで", "のあと"],
  before: ["まえ", "まえに", "のまえ"],
  from: ["から", "しゅっしん"],
  of: ["の"],
  by: ["そば", "そばに", "までに"],
  to: ["へ", "に", "まで"],
  at: ["で", "に"],
  for: ["ために", "のために", "あいだ"],
  and: ["と", "そして"],
  or: ["か", "それとも", "または"],
  but: ["しかし", "でも", "けれども"],
  not: ["ない", "でない", "しない"],
  // かず・りょう
  many: ["たくさん", "たくさんの", "おおい", "おおくの"],
  much: ["たくさん", "おおい"],
  some: ["いくつか", "すこし", "いくらか", "なんこか"],
  every: ["まいにち", "すべて", "すべての", "ぜんぶ", "あらゆる"],
  all: ["ぜんぶ", "すべて", "みんな"],
  one: ["ひとつ", "1つ", "いち"],
  // ぎもんし
  what: ["なに", "なん"],
  who: ["だれ", "どなた"],
  when: ["いつ"],
  where: ["どこ"],
  why: ["なぜ", "どうして", "なんで"],
  how: ["どうやって", "どのくらい", "どんなふうに"],
  which: ["どっち", "どれ", "どちら"],
  whose: ["だれの"],
  // うごき・ようす で いいかえが おおい もの
  like: ["すき", "すきです", "このむ"],
  have: ["もつ", "もっている", "たべる", "のむ", "かっている"],
  play: ["あそぶ", "する", "スポーツをする", "えんそうする"],
  see: ["みる", "みえる", "あう"],
  look: ["みる", "みえる"],
  take: ["とる", "のる", "もっていく"],
  make: ["つくる", "する"],
  want: ["ほしい", "したい", "ほしがる"],
  can: ["できる", "してもよい"],
  nice: ["すてき", "よい", "いい", "やさしい"],
  fine: ["げんき", "はれ", "いい", "すばらしい"],
  great: ["すごい", "すばらしい", "いだいな"],
  right: ["ただしい", "みぎ", "みぎの"],
  little: ["ちいさい", "すこし", "すこしの"],
  last: ["さいご", "このまえ", "さいごの"],
  cold: ["さむい", "つめたい"],
  fall: ["あき", "おちる"],
  show: ["みせる", "ばんぐみ", "しめす"],
  clean: ["そうじする", "きれい", "きれいにする"],
  work: ["はたらく", "しごと", "べんきょうする"],
  help: ["てつだう", "たすける", "てつだい"],
  stop: ["とまる", "とめる", "やめる"],
  open: ["あける", "ひらく", "あいている"],
  close: ["しめる", "とじる", "ちかい"],
  stand: ["たつ", "たっている"],
  fly: ["とぶ", "ハエ"],
};

/* =========================================================
   ボスを たおしたときの ドロップ(アイテム 100しゅるい)
   せいとうりつが たかいほど レアリティが たかく、
   1パックで もらえる こすうも ふえる
   ========================================================= */
const DROP_TIERS = [
  {
    key: "legendary", min: 1.00, pull: 5,
    name: "レジェンダリー", color: "#FCEE4B", glow: "#FFF9C4", label: "でんせつ",
    items: [
      { id: "L01", ic: "🐉", n: "エンダードラゴン" },
      { id: "L02", ic: "🥚", n: "ドラゴンのたまご" },
      { id: "L03", ic: "⭐", n: "ネザースター" },
      { id: "L04", ic: "🌟", n: "ビーコン" },
      { id: "L05", ic: "⚒️", n: "ネザライトのツルハシ" },
      { id: "L06", ic: "👑", n: "おうじゃの かんむり" },
      { id: "L07", ic: "🏆", n: "ワールドの トロフィー" },
      { id: "L08", ic: "🌈", n: "レインボービーコン" },
      { id: "L09", ic: "🗿", n: "こだいの ぞう" },
      { id: "L10", ic: "💫", n: "ながれぼし" },
      { id: "L11", ic: "🪽", n: "エリトラ" },
      { id: "L12", ic: "🌌", n: "エンドの そら" },
    ],
  },
  {
    key: "epic", min: 0.90, pull: 3,
    name: "エピック", color: "#B96BFF", glow: "#E7CCFF", label: "きわめてレア",
    items: [
      { id: "E01", ic: "💎", n: "ダイヤモンド" },
      { id: "E02", ic: "💠", n: "ダイヤブロック" },
      { id: "E03", ic: "⚔️", n: "ダイヤのけん" },
      { id: "E04", ic: "🛠️", n: "ダイヤのツルハシ" },
      { id: "E05", ic: "💚", n: "エメラルド" },
      { id: "E06", ic: "🧿", n: "エンダーアイ" },
      { id: "E07", ic: "🔮", n: "エンダーパール" },
      { id: "E08", ic: "🟪", n: "シュルカーボックス" },
      { id: "E09", ic: "🌀", n: "エンダーマン" },
      { id: "E10", ic: "🧟", n: "ゾンビ" },
      { id: "E11", ic: "💀", n: "スケルトン" },
      { id: "E12", ic: "🕷️", n: "クモ" },
      { id: "E13", ic: "👻", n: "ガスト" },
      { id: "E14", ic: "🔱", n: "トライデント" },
      { id: "E15", ic: "📖", n: "エンチャントのほん" },
      { id: "E16", ic: "🟥", n: "レッドストーンブロック" },
      { id: "E17", ic: "✨", n: "けいけんちオーブ" },
      { id: "E18", ic: "🏺", n: "こだいの つぼ" },
      { id: "E19", ic: "🦑", n: "イカ" },
      { id: "E20", ic: "⛓️", n: "くさりブロック" },
    ],
  },
  {
    key: "rare", min: 0.80, pull: 2,
    name: "レア", color: "#4AEDD9", glow: "#C4FFF8", label: "めずらしい",
    items: [
      { id: "R01", ic: "🟨", n: "きんインゴット" },
      { id: "R02", ic: "🔩", n: "てつインゴット" },
      { id: "R03", ic: "🔗", n: "くさり" },
      { id: "R04", ic: "🛡️", n: "たて" },
      { id: "R05", ic: "🏹", n: "ゆみ" },
      { id: "R06", ic: "🎯", n: "まと" },
      { id: "R07", ic: "🧭", n: "コンパス" },
      { id: "R08", ic: "⏰", n: "とけい" },
      { id: "R09", ic: "🗺️", n: "ちず" },
      { id: "R10", ic: "🔭", n: "スパイグラス" },
      { id: "R11", ic: "🧪", n: "ポーション" },
      { id: "R12", ic: "🍯", n: "ハチミツ" },
      { id: "R13", ic: "🐝", n: "ミツバチ" },
      { id: "R14", ic: "🐷", n: "ブタ" },
      { id: "R15", ic: "🐮", n: "ウシ" },
      { id: "R16", ic: "🐔", n: "ニワトリ" },
      { id: "R17", ic: "🐺", n: "オオカミ" },
      { id: "R18", ic: "🐱", n: "ネコ" },
      { id: "R19", ic: "🐴", n: "ウマ" },
      { id: "R20", ic: "🦊", n: "キツネ" },
      { id: "R21", ic: "🐑", n: "ヒツジ" },
      { id: "R22", ic: "🎃", n: "ジャック・オ・ランタン" },
      { id: "R23", ic: "🎆", n: "うちあげはなび" },
      { id: "R24", ic: "🎵", n: "レコード" },
      { id: "R25", ic: "🥁", n: "おんぷブロック" },
      { id: "R26", ic: "🚂", n: "トロッコ" },
      { id: "R27", ic: "⛵", n: "ボート" },
      { id: "R28", ic: "🧨", n: "TNT" },
    ],
  },
  {
    key: "common", min: 0.70, pull: 1,
    name: "コモン", color: "#B0B0B0", glow: "#E8E8E8", label: "ふつう",
    items: [
      { id: "C01", ic: "🟩", n: "くさブロック" },
      { id: "C02", ic: "🟫", n: "つちブロック" },
      { id: "C03", ic: "🪨", n: "まるいし" },
      { id: "C04", ic: "⬜", n: "いしブロック" },
      { id: "C05", ic: "🪵", n: "オークのき" },
      { id: "C06", ic: "🌲", n: "マツのき" },
      { id: "C07", ic: "🍃", n: "はっぱ" },
      { id: "C08", ic: "🏜️", n: "すな" },
      { id: "C09", ic: "🪟", n: "ガラス" },
      { id: "C10", ic: "🧱", n: "レンガ" },
      { id: "C11", ic: "⚫", n: "せきたん" },
      { id: "C12", ic: "🕯️", n: "たいまつ" },
      { id: "C13", ic: "🪜", n: "はしご" },
      { id: "C14", ic: "🚪", n: "きのドア" },
      { id: "C15", ic: "🛏️", n: "ベッド" },
      { id: "C16", ic: "🧵", n: "いと" },
      { id: "C17", ic: "🪶", n: "とりのはね" },
      { id: "C18", ic: "🐣", n: "ヒヨコ" },
      { id: "C19", ic: "🌾", n: "こむぎ" },
      { id: "C20", ic: "🥕", n: "ニンジン" },
      { id: "C21", ic: "🥔", n: "ジャガイモ" },
      { id: "C22", ic: "🍎", n: "リンゴ" },
      { id: "C23", ic: "🍞", n: "パン" },
      { id: "C24", ic: "🍖", n: "やきにく" },
      { id: "C25", ic: "🐟", n: "さかな" },
      { id: "C26", ic: "🦴", n: "ほね" },
      { id: "C27", ic: "🕸️", n: "クモのいと" },
      { id: "C28", ic: "🍄", n: "キノコ" },
      { id: "C29", ic: "🌵", n: "サボテン" },
      { id: "C30", ic: "🎋", n: "サトウキビ" },
      { id: "C31", ic: "🪣", n: "バケツ" },
      { id: "C32", ic: "🧊", n: "こおり" },
      { id: "C33", ic: "❄️", n: "ゆき" },
      { id: "C34", ic: "🔥", n: "ひ" },
      { id: "C35", ic: "🎣", n: "つりざお" },
      { id: "C36", ic: "⛏️", n: "いしのツルハシ" },
      { id: "C37", ic: "🗡️", n: "いしのけん" },
      { id: "C38", ic: "🪓", n: "いしのオノ" },
      { id: "C39", ic: "📦", n: "はこ" },
      { id: "C40", ic: "🪺", n: "とりのす" },
    ],
  },
];

const ALL_ITEMS = DROP_TIERS.flatMap((t) => t.items.map((i) => ({ ...i, tier: t })));
const ITEM_BY_ID = {};
ALL_ITEMS.forEach((i) => { ITEM_BY_ID[i.id] = i; });
const ITEM_TOTAL = ALL_ITEMS.length;

function tierForRate(rate) {
  return DROP_TIERS.find((t) => rate >= t.min) || null;
}

function shuffleArr(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/* パックを ひらく。レアリティが たかいほど アイテムが おおく 出る。
   owned(もっている アイテム)を わたすと、まだ もっていない ものから
   さきに 出す。ずかんが うまりやすく、おなじ ものばかりで がっかりしない。 */
function openPack(rate, owned) {
  const tier = tierForRate(rate);
  if (!tier) return null;
  const has = owned || {};
  const fresh = tier.items.filter((it) => !has[it.id]);
  const dup = tier.items.filter((it) => has[it.id]);
  const bag = [...shuffleArr(fresh), ...shuffleArr(dup)];
  return { tier, items: bag.slice(0, tier.pull) };
}

/* このもんだいすうで、そのレアリティに とどくのに ひつような せいかいすう */
function needForTier(tier, total) {
  return Math.max(1, Math.ceil(tier.min * total));
}

/* せいかいすう から いまの レアリティを もとめる(とどいて いなければ null) */
function tierForScore(score, total) {
  return DROP_TIERS.find((t) => score >= needForTier(t, total)) || null;
}
