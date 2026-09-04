const lessons = [
  {
    id: 'sip',
    title: {
      en: 'What is an SIP?',
      ta: 'SIP என்றால் என்ன?',
      hi: 'SIP क्या है?',
      bn: 'SIP কী?',
      mr: 'SIP म्हणजे काय?',
      te: 'SIP అంటే ఏమిటి?',
      ur: 'SIP کیا ہے؟',
      fr: "Qu'est-ce qu'un SIP ?"
    },
    body: {
      en: 'An SIP invests a fixed amount at regular intervals. It can help build investing discipline over time.',
      ta: 'SIP என்பது குறிப்பிட்ட தொகையை இடைவெளிகளுடன் முதலீடு செய்வது. இது நீண்ட கால முதலீட்டு ஒழுக்கத்தை உருவாக்க உதவும்.',
      hi: 'SIP नियमित अंतराल पर एक निश्चित राशि का निवेश करता है। यह समय के साथ निवेश अनुशासन बनाने में मदद करता है।',
      bn: 'SIP নিয়মিত ব্যবধানে একটি নির্দিষ্ট পরিমাণ অর্থ বিনিয়োগ করে। এটি সময়ের সাথে সাথে বিনিয়োগের শৃঙ্খলা তৈরি করতে সহায়তা করে।',
      mr: 'SIP नियमित अंतराने ठराविक रक्कम गुंतवते. यामुळे गुंतवणुकीची शिस्त अंगी बाणण्यास मदत होते.',
      te: 'SIP క్రమబద్ధమైన వ్యవధిలో స్థిరమైన మొత్తాన్ని పెట్టుబడి పెడుతుంది. ఇది దీర్ఘకాలిక పెట్టుబడి క్రమశిక్షణను నిర్మించడంలో సహాయపడుతుంది.',
      ur: 'SIP باقاعدہ وقفوں سے ایک مقررہ رقم کی سرمایہ کاری کرتا ہے۔ یہ وقت کے ساتھ ساتھ سرمایہ کاری کا نظم و ضبط بنانے میں مدد کرتا ہے۔',
      fr: 'Un SIP investit un montant fixe à intervalles réguliers. Il permet de bâtir une discipline d’investissement durable.'
    }
  },
  {
    id: 'index',
    title: {
      en: 'What is an index fund?',
      ta: 'Index Fund என்றால் என்ன?',
      hi: 'इंडेक्स फंड क्या है?',
      bn: 'ইনডেক্স ফান্ড কী?',
      mr: 'इंडेक्स फंड म्हणजे काय?',
      te: 'ఇండెక్స్ ఫండ్ అంటే ఏమిటి?',
      ur: 'انڈیکس فنڈ کیا ہے؟',
      fr: "Qu'est-ce qu'un fonds indiciel ?"
    },
    body: {
      en: 'An index fund aims to track a market index rather than selecting individual stocks.',
      ta: 'Index Fund ஒரு சந்தை குறியீட்டை பின்தொடர முயற்சிக்கிறது; தனிப்பட்ட பங்குகளைத் தேர்வு செய்வது இதன் நோக்கம் அல்ல.',
      hi: 'एक इंडेक्स फंड व्यक्तिगत शेयरों का चयन करने के बजाय बाज़ार सूचकांक (जैसे Nifty 50) को ट्रैक करता है।',
      bn: 'একটি ইনডেক্স ফান্ড পৃথক স্টক নির্বাচন না করে একটি বাজার সূচক (যেমন Nifty 50) ট্র্যাক করে।',
      mr: 'इंडेक्स फंड वैयक्तिक समभागांची निवड करण्याऐवजी संपूर्ण बाजार निर्देशांकाचा मागोवा घेतो.',
      te: 'ఇండెక్స్ ఫండ్ వ్యక్తిగత స్టాక్‌లను ఎంచుకోవడానికి బదులుగా మార్కెట్ సూచీని అనుసరిస్తుంది.',
      ur: 'انڈیکس فنڈ انفرادی اسٹاکس منتخب کرنے کے بجائے مارکیٹ انڈیکس کی پیروی کرتا ہے۔',
      fr: 'Un fonds indiciel vise à répliquer un indice de marché plutôt que de sélectionner des actions individuelles.'
    }
  },
  {
    id: 'fo',
    title: {
      en: 'Why is F&O risky?',
      ta: 'F&O ஏன் ஆபத்தானது?',
      hi: 'F&O में अधिक जोखिम क्यों है?',
      bn: 'F&O কেন ঝুঁকিপূর্ণ?',
      mr: 'F&O मध्ये जास्त जोखीम का असते?',
      te: 'F&O ఎందుకు ప్రమాదకరమైనది?',
      ur: 'F&O کیوں خطرناک ہے؟',
      fr: 'Pourquoi le F&O est-il risqué ?'
    },
    body: {
      en: 'Leverage can magnify both gains and losses. A small market move can have a much larger effect on your capital.',
      ta: 'Leverage லாபத்தையும் இழப்பையும் பெரிதாக்கலாம். சந்தையில் சிறிய மாற்றமும் உங்கள் மூலதனத்தில் பெரிய தாக்கத்தை ஏற்படுத்தலாம்.',
      hi: 'लीवरेज मुनाफे और नुकसान दोनों को बढ़ा देता है। बाज़ार की एक छोटी सी गिरावट भी आपकी पूंजी पर गहरा असर डाल सकती है।',
      bn: 'লিভারেজ লাভ এবং ক্ষতি উভয়কেই বাড়িয়ে তুলতে পারে। সামান্য বাজার পরিবর্তনের ফলেও ব্যাপক মূলধন ক্ষতি হতে পারে।',
      mr: 'लिव्हरेज नफा आणि तोटा दोन्ही वाढवते. बाजारातील लहान घसरणही तुमच्या भांडवलावर मोठा परिणाम करू शकते.',
      te: 'లివరేజ్ లాభాలను మరియు నష్టాలను రెండింటినీ పెంచుతుంది. మార్కెట్ యొక్క స్వల్ప కదలిక కూడా మీ మూలధనంపై తీవ్ర ప్రభావం చూపుతుంది.',
      ur: 'لیوریج منافع اور نقصان دونوں کو بڑھا دیتا ہے۔ مارکیٹ کی معمولی حرکت بھی آپ کے سرمائے پر بہت بڑا اثر ڈال سکتی ہے۔',
      fr: "L'effet de levier amplifie les gains mais aussi les pertes. Une faible variation de marché peut avoir un impact majeur sur votre capital."
    }
  },
  {
    id: 'drawdown',
    title: {
      en: 'What is drawdown?',
      ta: 'Drawdown என்றால் என்ன?',
      hi: 'ड्राडाउन (Drawdown) क्या है?',
      bn: 'ড্রডাউন (Drawdown) কী?',
      mr: 'ड्रॉडडाउन (Drawdown) म्हणजे काय?',
      te: 'డ్రాడౌన్ (Drawdown) అంటే ఏమిటి?',
      ur: 'ڈرا ڈاؤن (Drawdown) کیا ہے؟',
      fr: "Qu'est-ce que le drawdown ?"
    },
    body: {
      en: 'Drawdown measures how far an investment falls from a previous peak. It helps make downside risk visible.',
      ta: 'Drawdown என்பது முந்தைய உச்ச நிலையிலிருந்து முதலீடு எவ்வளவு குறைகிறது என்பதை காட்டுகிறது.',
      hi: 'ड्राडाउन यह मापता है कि पिछला शिखर छूने के बाद निवेश में कितनी अधिकतम गिरावट आई। यह जोखिम को समझने में मदद करता है।',
      bn: 'ড্রডাউন পরিমাপ করে যে একটি বিনিয়োগ পূর্ববর্তী শীর্ষস্থান থেকে কতটা নিচে নেমেছে। এটি ঝুঁকি বোঝার জন্য সহায়ক।',
      mr: 'ड्रॉडडाउन हे मोजते की पूर्वीच्या शिखरावरून गुंतवणूक किती खाली घसरली आहे. यामुळे तोट्याची जोखीम स्पष्ट होते.',
      te: 'డ్రాడౌన్ అనేది మునుపటి గరిష్ట స్థాయి నుండి పెట్టుబడి ఎంతవరకు పడిపోయిందో కొలుస్తుంది.',
      ur: 'ڈرا ڈاؤن یہ ماپتا ہے کہ سرمایہ کاری اپنی پچھلی بلندی سے کتنا نیچے گرتی ہے۔ یہ خطرے کو سمجھنے میں مدد کرتا ہے۔',
      fr: "Le drawdown mesure la baisse d'un investissement depuis son plus haut historique, rendant visible le risque de perte temporaire."
    }
  },
  {
    id: 'diversification',
    title: {
      en: 'Why diversify?',
      ta: 'Diversification ஏன்?',
      hi: 'विविधीकरण (Diversification) क्यों ज़रूरी है?',
      bn: 'বৈচিত্র্যকরণ (Diversification) কেন জরুরি?',
      mr: 'डायव्हर्सिफिकेशन (Diversification) का आवश्यक आहे?',
      te: 'వైవిధ్యీకరణ (Diversification) ఎందుకు అవసరం?',
      ur: 'تنوع (Diversification) کیوں ضروری ہے؟',
      fr: 'Pourquoi diversifier ?'
    },
    body: {
      en: 'Diversification spreads exposure across assets or strategies so one outcome does not determine the entire portfolio.',
      ta: 'Diversification பல சொத்துகள் அல்லது உத்திகளில் ஆபத்தைப் பகிர்ந்து கொள்ள உதவுகிறது.',
      hi: 'विविधीकरण जोखिम को विभिन्न परिसंपत्तियों या रणनीतियों में बांटता है ताकि एक बुरा परिणाम पूरे पोर्टफोलियो को बर्बाद न करे।',
      bn: 'বৈচিত্র্যকরণ বিভিন্ন সম্পদ বা কৌশলের মধ্যে ঝুঁকি ছড়িয়ে দেয় যাতে একটি ব্যর্থতা পুরো পোর্টফোলিওকে প্রভাবিত না করে।',
      mr: 'डायव्हर्सिफिकेशनमुळे जोखीम विविध मालमत्तांमध्ये विभागली जाते, जेणेकरून एका चुकीच्या निकालाने संपूर्ण पोर्टफोलिओ धोक्यात येत नाही.',
      te: 'వైవిధ్యీకరణ వివిధ ఆస్తులు లేదా వ్యూహాలలో రిస్క్‌ను విస్తరిస్తుంది, తద్వారా ఒకే వైఫల్యం మొత్తం పోర్ట్‌ఫోలియోను దెబ్బతీయదు.',
      ur: 'تنوع مختلف اثاثوں میں خطرے کو پھیلاتا ہے تاکہ کوئی ایک منفی نتیجہ پورے پورٹ فولیو کو متاثر نہ کرے۔',
      fr: "La diversification répartit l'exposition sur plusieurs actifs pour éviter qu'un seul événement défavorable ne compromette l'ensemble du portefeuille."
    }
  }
];

export function getLessons(req, res) {
  res.json({ lessons });
}
