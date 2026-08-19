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
const RANGES = [];
for (let r = 0; r * 15 < WORD_LIST.length; r++) {
  const from = r * 15 + 1;
  const to = Math.min((r + 1) * 15, WORD_LIST.length);
  RANGES.push({ id: r + 1, from, to, title: `${from}〜${to}ばん` });
}
function wordsInRange(rangeId) {
  const r = RANGES[rangeId - 1];
  return WORD_LIST.filter((w) => w.no >= r.from && w.no <= r.to);
}

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
