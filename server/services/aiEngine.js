// Deterministic, context-aware AI engine — no API key required.
// Analyses the ACTUAL simulation data passed in and generates
// meaningful responses grounded in real numbers across all 8 supported languages:
// en, ta, hi, bn, mr, te, ur, fr.

const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`;

const I18N = {
  en: {
    noSim: "It looks like you haven't run a simulation yet. Set your strategy and inputs on the left panel and click **Run simulation** — I'll be able to answer questions about your specific results once they're ready.",
    disclaimer: "*📚 All responses are educational and illustrative — not personalized financial advice.*",
    applyRunPrompt: "Click **Apply & Run** to test this scenario.",
    durChange: (c, n) => `Changing your investment horizon from **${c} years** to **${n} years** will alter your outcome distribution. Longer periods allow more time for compounding, while shorter horizons have less recovery runway after market downturns.`,
    durReason: (c, n) => `Change duration from ${c} to ${n} years`,
    invChange: (c, n) => `Changing your initial investment from **${fmt(c)}** to **${fmt(n)}** scales your capital base proportionally.`,
    invReason: (c, n) => `Change initial investment from ${fmt(c)} to ${fmt(n)}`,
    sipChange: (c, n) => `Adjusting your monthly SIP from **${fmt(c)}** to **${fmt(n)}** alters your regular capital accumulation over time.`,
    sipReason: (c, n) => `Change monthly SIP from ${fmt(c)} to ${fmt(n)}`,
    levChange: (c, n) => `Changing leverage from **${c}×** to **${n}×** directly scales your exposure to market swings and drawdown risk.`,
    levReason: (c, n) => `Change leverage from ${c}× to ${n}×`,
    stratChange: (c, n) => `Switching strategy from **${c.toUpperCase()}** to **${n.toUpperCase()}** changes your risk-return dynamics.`,
    stratReason: (c, n) => `Switch strategy to ${n.toUpperCase()}`,
    riskHighWhy: (lossP, dd, totalInv) => `Your simulated probability of loss is **${lossP}%** because historical market cycles contain prolonged drawdowns (up to **${dd}%**). If negative years cluster early in your horizon, compounding does not have sufficient time to recover before the simulation concludes on your ${fmt(totalInv)} capital.`,
    simpleExplain: (strat, totalInv, median, lossP, profitP) => `In plain terms: You are investing a total of **${fmt(totalInv)}** under a **${strat.toUpperCase()}** strategy. In 10,000 simulated market scenarios, **${profitP}%** ended with a profit, while **${lossP}%** ended with less money than you started with. The typical (median) outcome was **${fmt(median)}**.`,
    reduceDd: (dd, strat) => `To reduce the maximum drawdown (currently **${dd}%**): 1) Extend your investment duration to give market dips time to recover; 2) Maintain disciplined monthly SIP averaging; 3) If using F&O, lower or eliminate leverage multiplier.`,
    saferStrat: (strat) => strat === 'sip'
      ? `You are already using a disciplined SIP strategy, which is the most resilient among the options. Further safety can be achieved by extending duration from your current horizon.`
      : `Switching to a disciplined index SIP eliminates derivative leverage risks, narrowing downside drawdown and improving historical recovery probability.`,
    biggestRiskQ: (lossP, dd) => `The primary risk in your current setup is a **${lossP}% probability of capital loss** alongside a peak-to-trough drawdown risk of **${dd}%**.`,
    overviewHeader: "Here is your simulation risk overview:\n",
    tryAsking: "\nTry asking me:\n• *\"Why is my probability of loss high?\"*\n• *\"What happens if I invest for 10 years?\"*\n• *\"How can I reduce drawdown?\"*\n• *\"Compare this with a safer strategy\"*\n• *\"Explain this in simple words\"*\n\n"
  },

  ta: {
    noSim: "நீங்கள் இன்னும் சிமுலேஷனை இயக்கவில்லை. இடதுபுறத்தில் உத்தியைத் தேர்ந்தெடுத்து **சிமுலேஷன் இயக்கு** என்பதைக் கிளிக் செய்யவும்.",
    disclaimer: "*📚 இந்த பதில்கள் கல்வி நோக்கிலானவை — தனிப்பட்ட நிதி ஆலோசனை அல்ல.*",
    applyRunPrompt: "இந்த சூழலை சோதிக்க **பயன்படுத்தி சிமுலேட் செய்** என்பதைக் கிளிக் செய்க.",
    durChange: (c, n) => `முதலீட்டுக் காலத்தை **${c} ஆண்டுகளில்** இருந்து **${n} ஆண்டுகளாக** மாற்றுவது கூட்டு வளர்ச்சிக்கு அதிக அவகாசம் தரும்.`,
    durReason: (c, n) => `கால அளவை ${c}-லிருந்து ${n} ஆண்டுகளாக மாற்றுக`,
    invChange: (c, n) => `ஆரம்ப முதலீட்டை **${fmt(c)}** இலிருந்து **${fmt(n)}** ஆக மாற்றுவது உங்கள் முதலீட்டு தளத்தை மாற்றும்.`,
    invReason: (c, n) => `ஆரம்ப முதலீட்டை ${fmt(c)}-லிருந்து ${fmt(n)} ஆக மாற்றுக`,
    sipChange: (c, n) => `மாதாந்திர SIP தொகையை **${fmt(c)}** இலிருந்து **${fmt(n)}** ஆக மாற்றுவது மூலதன வளர்ச்சியை அதிகரிக்கும்.`,
    sipReason: (c, n) => `மாதாந்திர SIP-யை ${fmt(c)}-லிருந்து ${fmt(n)} ஆக மாற்றுக`,
    levChange: (c, n) => `லெவரேஜை **${c}×** இலிருந்து **${n}×** ஆக மாற்றுவது சந்தை ஏற்ற இறக்க அபாயத்தை மாற்றியமைக்கும்.`,
    levReason: (c, n) => `லெவரேஜை ${c}× இலிருந்து ${n}× ஆக மாற்றுக`,
    stratChange: (c, n) => `உத்தியை **${c.toUpperCase()}** இலிருந்து **${n.toUpperCase()}** ஆக மாற்றுவது இடர் அமைப்பை மாற்றும்.`,
    stratReason: (c, n) => `உத்தியை ${n.toUpperCase()} ஆக மாற்றுக`,
    riskHighWhy: (lossP, dd, totalInv) => `வரலாற்று ரீதியாக Nifty 50 குறியீட்டில் தொடர் வீழ்ச்சிகள் (${dd}% வரை) ஏற்பட்டுள்ளதால் உங்கள் இழப்பு நிகழ்தகவு **${lossP}%** ஆக உள்ளது. தொடக்க ஆண்டுகளில் சரிவு ஏற்பட்டால் ${fmt(totalInv)} மூலதனம் மீள அவகாசம் தேவைப்படும்.`,
    simpleExplain: (strat, totalInv, median, lossP, profitP) => `எளிய விளக்கம்: நீங்கள் **${strat.toUpperCase()}** முறையில் மொத்தம் **${fmt(totalInv)}** முதலீடு செய்கிறீர்கள். 10,000 சோதனைகளில், **${profitP}%** லாபத்துடனும், **${lossP}%** நஷ்டத்துடனும் முடிந்தது. சராசரி முடிவு **${fmt(median)}**.`,
    reduceDd: (dd, strat) => `அதிகபட்ச வீழ்ச்சியை (${dd}%) குறைக்க: 1) முதலீட்டுக் காலத்தை நீட்டிக்கவும்; 2) ஒழுங்கான மாதாந்திர SIP முறையைப் பின்பற்றவும்; 3) F&O லெவரேஜை தவிர்க்கவும்.`,
    saferStrat: (strat) => strat === 'sip'
      ? `நீங்கள் ஏற்கனவே மிகவும் பாதுகாப்பான SIP உத்தியைப் பயன்படுத்துகிறீர்கள்.`
      : `F&O-விலிருந்து SIP முறைக்கு மாறுவது லெவரேஜ் அபாயங்களை நீக்கி பாதுகாப்பை மேம்படுத்தும்.`,
    biggestRiskQ: (lossP, dd) => `உங்கள் தற்போதைய அமைப்பின் முக்கிய ஆபத்து **${lossP}% இழப்பு நிகழ்தகவு** மற்றும் **${dd}% அதிகபட்ச வீழ்ச்சி** ஆகும்.`,
    overviewHeader: "உங்கள் சிமுலேஷன் இடர் சுருக்கம்:\n",
    tryAsking: "\nஎன்னிடம் கேளுங்கள்:\n• *\"என் இழப்பு நிகழ்தகவு ஏன் அதிகம்?\"*\n• *\"10 ஆண்டுகள் முதலீடு செய்தால் என்ன நடக்கும்?\"*\n• *\"வீழ்ச்சியை எவ்வாறு குறைக்கலாம்?\"*\n• *\"பாதுகாப்பான உத்தியுடன் ஒப்பிடுங்கள்\"*\n\n"
  },

  hi: {
    noSim: "ऐसा लगता है कि आपने अभी तक सिमुलेशन नहीं चलाया है। बाईं ओर विवरण भरें और **सिमुलेशन चलाएं** पर क्लिक करें।",
    disclaimer: "*📚 सभी उत्तर केवल शैक्षणिक उद्देश्य हेतु हैं — व्यक्तिगत वित्तीय सलाह नहीं।*",
    applyRunPrompt: "इस परिदृश्य का परीक्षण करने के लिए **लागू करें और सिमुलेट करें** पर क्लिक करें।",
    durChange: (c, n) => `निवेश अवधि को **${c} वर्ष** से **${n} वर्ष** करने से कम्पाउंडिंग के लिए अधिक समय मिलेगा।`,
    durReason: (c, n) => `अवधि को ${c} से ${n} वर्ष में बदलें`,
    invChange: (c, n) => `प्रारंभिक निवेश को **${fmt(c)}** से **${fmt(n)}** में बदलने से पूंजी आधार बढ़ेगा।`,
    invReason: (c, n) => `प्रारंभिक निवेश को ${fmt(c)} से ${fmt(n)} में बदलें`,
    sipChange: (c, n) => `मासिक SIP को **${fmt(c)}** से **${fmt(n)}** करने से नियमित पूंजी संचय बढ़ेगा।`,
    sipReason: (c, n) => `मासिक SIP को ${fmt(c)} से ${fmt(n)} में बदलें`,
    levChange: (c, n) => `लीवरेज को **${c}×** से **${n}×** करने से जोखिम सीधे परिवर्तित होगा।`,
    levReason: (c, n) => `लीवरेज को ${c}× से ${n}× में बदलें`,
    stratChange: (c, n) => `रणनीति को **${c.toUpperCase()}** से **${n.toUpperCase()}** में बदलने से जोखिम प्रोफाइल बदलेगी।`,
    stratReason: (c, n) => `रणनीति को ${n.toUpperCase()} में बदलें`,
    riskHighWhy: (lossP, dd, totalInv) => `ऐतिहासिक Nifty 50 में बाज़ार गिरावट (${dd}% तक) आने के कारण आपकी नुकसान संभावना **${lossP}%** है। शुरुआती वर्षों में मंदी आने पर ${fmt(totalInv)} पूंजी को उबरने के लिए समय चाहिए।`,
    simpleExplain: (strat, totalInv, median, lossP, profitP) => `सरल शब्दों में: आप **${strat.toUpperCase()}** में कुल **${fmt(totalInv)}** का निवेश कर रहे हैं। 10,000 सिमुलेशन में से **${profitP}%** मुनाफे में रहे और **${lossP}%** में घाटा हुआ। मध्यमान परिणाम **${fmt(median)}** रहा।`,
    reduceDd: (dd, strat) => `गिरावट (Drawdown ${dd}%) कम करने के उपाय: 1) निवेश की अवधि बढ़ाएं; 2) अनुशासित SIP बनाए रखें; 3) F&O लीवरेज घटाएं या समाप्त करें।`,
    saferStrat: (strat) => strat === 'sip'
      ? `आप पहले से ही अनुशासित SIP का उपयोग कर रहे हैं जो सबसे लचीली रणनीति है।`
      : `अनुशासित SIP रणनीति पर स्विच करने से डेरिवेटिव लीवरेज का जोखिम खत्म हो जाएगा।`,
    biggestRiskQ: (lossP, dd) => `आपके मौजूदा सेटअप में सबसे बड़ा जोखिम **${lossP}% पूंजी हानि की संभावना** और **${dd}% अधिकतम गिरावट** है।`,
    overviewHeader: "आपके सिमुलेशन जोखिम का अवलोकन:\n",
    tryAsking: "\nआप मुझसे पूछ सकते हैं:\n• *\"मेरे नुकसान की संभावना अधिक क्यों है?\"*\n• *\"यदि मैं 10 साल निवेश करूँ तो क्या होगा?\"*\n• *\"गिरावट कैसे कम करें?\"*\n• *\"सुरक्षित रणनीति से तुलना करें\"*\n\n"
  },

  bn: {
    noSim: "মনে হচ্ছে আপনি এখনও কোনো সিমুলেশন চালাননি। বামপাশে ইনপুট সেট করুন এবং **সিমুলেশন চালান**-এ ক্লিক করুন।",
    disclaimer: "*📚 সমস্ত প্রতিক্রিয়া শিক্ষামূলক — কোনো ব্যক্তিগত আর্থিক পরামর্শ নয়।*",
    applyRunPrompt: "এই পরিস্থিতি পরীক্ষা করতে **প্রয়োগ করে সিমুলেশন চালান**-এ ক্লিক করুন।",
    durChange: (c, n) => `বিনিয়োগের মেয়াদ **${c} বছর** থেকে **${n} বছরে** পরিবর্তন করলে চক্রবৃদ্ধি আয়ের পর্যাপ্ত সুযোগ মিলবে।`,
    durReason: (c, n) => `মেয়াদ ${c} থেকে ${n} বছরে পরিবর্তন করুন`,
    invChange: (c, n) => `প্রাথমিক বিনিয়োগ **${fmt(c)}** থেকে **${fmt(n)}**-এ পরিবর্তন করলে মূলধন ভিত্তি পরিবর্তিত হবে।`,
    invReason: (c, n) => `প্রাথমিক বিনিয়োগ ${fmt(c)} থেকে ${fmt(n)}-এ পরিবর্তন করুন`,
    sipChange: (c, n) => `মাসিক SIP **${fmt(c)}** থেকে **${fmt(n)}**-এ সমন্বয় করলে দীর্ঘমেয়াদে অর্থ সঞ্চয় বাড়বে।`,
    sipReason: (c, n) => `মাসিক SIP ${fmt(c)} থেকে ${fmt(n)}-এ পরিবর্তন করুন`,
    levChange: (c, n) => `লিভারেজ **${c}×** থেকে **${n}×** পরিবর্তন করলে ঝুঁকি সরাসরি পরিবর্তিত হবে।`,
    levReason: (c, n) => `লিভারেজ ${c}× থেকে ${n}× পরিবর্তন করুন`,
    stratChange: (c, n) => `কৌশল **${c.toUpperCase()}** থেকে **${n.toUpperCase()}**-এ পরিবর্তন করলে ঝুঁকির মাত্রা পরিবর্তিত হবে।`,
    stratReason: (c, n) => `কৌশল ${n.toUpperCase()}-এ পরিবর্তন করুন`,
    riskHighWhy: (lossP, dd, totalInv) => `ঐতিহাসিক Nifty 50 সূচকে তীব্র পতন (${dd}% পর্যন্ত) থাকার কারণে আপনার ক্ষতির সম্ভাবনা **${lossP}%**। বিনিয়োগের শুরুর দিকে বাজার পড়লে ${fmt(totalInv)} মূলধন ফিরে পেতে সময় লাগে।`,
    simpleExplain: (strat, totalInv, median, lossP, profitP) => `সহজ ভাষায়: আপনি **${strat.toUpperCase()}** কৌশলে মোট **${fmt(totalInv)}** বিনিয়োগ করছেন। ১০,০০০ সিমুলেশনে **${profitP}%** পথ লাভে এবং **${lossP}%** পথ ক্ষতিতে শেষ হয়েছে। গড় ফলাফল **${fmt(median)}**।`,
    reduceDd: (dd, strat) => `পতন (Drawdown ${dd}%) কমানোর উপায়: ১) বিনিয়োগের মেয়াদ বাড়ান; ২) নিয়মিত SIP বজায় রাখুন; ৩) F&O লিভারেজ এড়িয়ে চলুন।`,
    saferStrat: (strat) => strat === 'sip'
      ? `আপনি ইতিমধ্যেই সুশৃঙ্খল SIP কৌশল ব্যবহার করছেন যা সবচেয়ে নিরাপদ।`
      : `একটি সুশৃঙ্খল SIP কৌশলে চলে আসলে ডেরিভেটিভ লিভারেজ ঝুঁকি দূর হবে।`,
    biggestRiskQ: (lossP, dd) => `প্রধান ঝুঁকি হলো **${lossP}% ক্ষতির সম্ভাবনা** এবং **${dd}% সর্বোচ্চ ড্রডাউন**।`,
    overviewHeader: "আপনার সিমুলেশন ঝুঁকির সারসংক্ষেপ:\n",
    tryAsking: "\nজিজ্ঞাসা করতে পারেন:\n• *\"আমার ক্ষতির সম্ভাবনা বেশি কেন?\"*\n• *\"১০ বছর বিনিয়োগ করলে কি হবে?\"*\n• *\"পতন কিভাবে কমাবো?\"*\n• *\"নিরাপদ কৌশলের সাথে তুলনা করুন\"*\n\n"
  },

  mr: {
    noSim: "तुम्ही अद्याप कोणतेही सिम्युलेशन चालवलेले दिसत नाही. डावीकडे माहिती भरा आणि **सिम्युलेशन चालवा** वर क्लिक करा.",
    disclaimer: "*📚 सर्व उत्तरे शैक्षणिक उद्देशासाठी आहेत — वैयक्तिक आर्थिक सल्ला नाही.*",
    applyRunPrompt: "ही परिस्थिती तपासण्यासाठी **लागू करा आणि सिम्युलेट करा** वर क्लिक करा.",
    durChange: (c, n) => `गुंतवणुकीचा कालावधी **${c} वर्षांवरून** **${n} वर्षे** केल्यास चक्रवाढ वाढीस अधिक वेळ मिळेल.`,
    durReason: (c, n) => `कालावधी ${c} वरून ${n} वर्षे करा`,
    invChange: (c, n) => `सुरुवातीची गुंतवणूक **${fmt(c)}** वरून **${fmt(n)}** केल्यास भांडवली पाया बदलेल.`,
    invReason: (c, n) => `सुरुवातीची गुंतवणूक ${fmt(c)} वरून ${fmt(n)} करा`,
    sipChange: (c, n) => `मासिक SIP **${fmt(c)}** वरून **${fmt(n)}** केल्यास भांडवल संचय वेगाने होईल.`,
    sipReason: (c, n) => `मासिक SIP ${fmt(c)} वरून ${fmt(n)} करा`,
    levChange: (c, n) => `लिव्हरेज **${c}×** वरून **${n}×** केल्यास बाजारातील चढ-उतारांचा धोका थेट बदलेल.`,
    levReason: (c, n) => `लिव्हरेज ${c}× वरून ${n}× करा`,
    stratChange: (c, n) => `धोरण **${c.toUpperCase()}** वरून **${n.toUpperCase()}** केल्यास जोखीम बदलेल.`,
    stratReason: (c, n) => `धोरण ${n.toUpperCase()} करा`,
    riskHighWhy: (lossP, dd, totalInv) => `Nifty 50 च्या इतिहासात मोठ्या घसरणी (${dd}% पर्यंत) झाल्यामुळे नुकसानीची शक्यता **${lossP}%** आहे. सुरुवातीला मंदी आल्यास ${fmt(totalInv)} भांडवल भरून निघण्यासाठी वेळ लागतो.`,
    simpleExplain: (strat, totalInv, median, lossP, profitP) => `सोप्या शब्दांत: तुम्ही **${strat.toUpperCase()}** अंतर्गत एकूण **${fmt(totalInv)}** गुंतवत आहात. १०,००० चाचण्यांमध्ये **${profitP}%** नफ्यात आणि **${lossP}%** तोट्यात संपल्या. सरासरी निकाल **${fmt(median)}** राहिला.`,
    reduceDd: (dd, strat) => `घसरण (Drawdown ${dd}%) कमी करण्याचे मार्ग: १) कालावधी वाढवा; २) नियमित मासिक SIP ठेवा; ३) F&O मधील लिव्हरेज कमी करा.`,
    saferStrat: (strat) => strat === 'sip'
      ? `तुम्ही आधीच शिस्तबद्ध SIP वापरत आहात जे सर्वात सुरक्षित आहे.`
      : `शिस्तबद्ध इंडेक्स SIP वर स्विच केल्याने लिव्हरेजचा धोका दूर होईल.`,
    biggestRiskQ: (lossP, dd) => `तुमच्या सध्याच्या रचनेतील सर्वात मोठी जोखीम **${lossP}% तोट्याची शक्यता** आणि **${dd}% कमाल घसरण** आहे.`,
    overviewHeader: "तुमचा सिम्युलेशन जोखीम आढावा:\n",
    tryAsking: "\nतुम्ही विचारू शकता:\n• *\"माझ्या नुकसानीची शक्यता जास्त का आहे?\"*\n• *\"१० वर्षे गुंतवणूक केल्यास काय होईल?\"*\n• *\"घसरण कशी कमी करावी?\"*\n• *\"सुरक्षित धोरणाशी तुलना करा\"*\n\n"
  },

  te: {
    noSim: "మీరు ఇంకా సిమ్యులేషన్‌ను అమలు చేయలేదు. ఎడమవైపు వివరాలు నమోదు చేసి **సిమ్యులేషన్ ప్రారంభించండి** పై క్లిక్ చేయండి.",
    disclaimer: "*📚 అన్ని సమాధానాలు విద్యా ప్రయోజనాల కోసం మాత్రమే — వ్యక్తిగత ఆర్థిక సలహా కాదు.*",
    applyRunPrompt: "ఈ దృశ్యాన్ని పరీక్షించడానికి **వర్తింపజేసి సిమ్యులేట్ చేయండి** పై క్లిక్ చేయండి.",
    durChange: (c, n) => `పెట్టుబడి కాలాన్ని **${c} సంవత్సరాల** నుండి **${n} సంవత్సరాలకు** మార్చడం వల్ల కాంపౌండింగ్ సమయం పెరుగుతుంది.`,
    durReason: (c, n) => `వ్యవధిని ${c} నుండి ${n} సంవత్సరాలకు మార్చండి`,
    invChange: (c, n) => `ప్రారంభ పెట్టుబడిని **${fmt(c)}** నుండి **${fmt(n)}** కి మార్చడం మూలధనాన్ని పెంచుతుంది.`,
    invReason: (c, n) => `ప్రారంభ పెట్టుబడిని ${fmt(c)} నుండి ${fmt(n)} కి మార్చండి`,
    sipChange: (c, n) => `నెలవారీ SIPని **${fmt(c)}** నుండి **${fmt(n)}** కి మార్చడం వల్ల క్రమబద్ధమైన మూలధనం పెరుగుతుంది.`,
    sipReason: (c, n) => `నెలవారీ SIPని ${fmt(c)} నుండి ${fmt(n)} కి మార్చండి`,
    levChange: (c, n) => `లివరేజ్‌ని **${c}×** నుండి **${n}×** కి మార్చడం నష్ట భయాన్ని నేరుగా ప్రభావితం చేస్తుంది.`,
    levReason: (c, n) => `లివరేజ్‌ని ${c}× నుండి ${n}× కి మార్చండి`,
    stratChange: (c, n) => `వ్యూహాన్ని **${c.toUpperCase()}** నుండి **${n.toUpperCase()}** కి మార్చడం రిస్క్ డైనమిక్స్‌ను మారుస్తుంది.`,
    stratReason: (c, n) => `వ్యూహాన్ని ${n.toUpperCase()} కి మార్చండి`,
    riskHighWhy: (lossP, dd, totalInv) => `Nifty 50 చరిత్రలో మార్కెట్ పతనాలు (${dd}% వరకు) నమోదు కావడంతో మీ నష్ట సంభావ్యత **${lossP}%** గా ఉంది. ప్రారంభంలో క్షీణత ఎదురైతే ${fmt(totalInv)} మూలధనం తిరిగి పొందడానికి సమయం పడుతుంది.`,
    simpleExplain: (strat, totalInv, median, lossP, profitP) => `సులభంగా చెప్పాలంటే: మీరు **${strat.toUpperCase()}** వ్యూహంలో మొత్తం **${fmt(totalInv)}** పెట్టుబడి పెడుతున్నారు. 10,000 సిమ్యులేషన్లలో **${profitP}%** లాభంతో మరియు **${lossP}%** నష్టంతో ముగిశాయి. మధ్యస్థ ఫలితం **${fmt(median)}**.`,
    reduceDd: (dd, strat) => `గరిష్ట క్షీణత (${dd}%) తగ్గించే మార్గాలు: 1) కాలపరిమితిని పెంచండి; 2) క్రమశిక్షణతో కూడిన SIP నిర్వహించండి; 3) F&O లివరేజ్ తగ్గించండి.`,
    saferStrat: (strat) => strat === 'sip'
      ? `మీరు ఇప్పటికే సురక్షితమైన క్రమబద్ధమైన SIP వ్యూహాన్ని ఉపయోగిస్తున్నారు.`
      : `క్రమబద్ధమైన SIP కి మారడం డెరివేటివ్స్ లివరేజ్ నష్టాన్ని తొలగిస్తుంది.`,
    biggestRiskQ: (lossP, dd) => `మీ ప్రస్తుత వ్యూహంలో ప్రధాన రిస్క్ **${lossP}% నష్ట సంభావ్యత** మరియు **${dd}% గరిష్ట క్షీణత**.`,
    overviewHeader: "మీ సిమ్యులేషన్ రిస్క్ వివరాలు:\n",
    tryAsking: "\nనన్ను అడగండి:\n• *\"నా నష్ట సంభావ్యత ఎందుకు ఎక్కువ?\"*\n• *\"10 సంవత్సరాలు పెట్టుబడి పెడితే ఏమవుతుంది?\"*\n• *\"క్షీణతను ఎలా తగ్గించాలి?\"*\n• *\"సురక్షిత వ్యూహంతో పోల్చండి\"*\n\n"
  },

  ur: {
    noSim: "ایسا لگتا ہے کہ آپ نے ابھی تک سیمیولیشن نہیں چلایا ہے۔ بائیں جانب تفصیلات درج کریں اور **سیمیولیشن چلائیں** پر کلک کریں۔",
    disclaimer: "*📚 تمام جوابات تعلیمی مقصد کے لیے ہیں — ذاتی مالیاتی مشورہ نہیں۔*",
    applyRunPrompt: "اس منظر نامے کو جانچنے کے لیے **لاگو کریں اور سیمیولیٹ کریں** پر کلک کریں۔",
    durChange: (c, n) => `سرمایہ کاری کی مدت کو **${c} سال** سے **${n} سال** کرنے سے کمپاؤنڈنگ کا وقت بڑھے گا۔`,
    durReason: (c, n) => `مدت ${c} سے ${n} سال کریں`,
    invChange: (c, n) => `ابتدائی سرمایہ کاری کو **${fmt(c)}** سے **${fmt(n)}** میں تبدیل کرنے سے سرمایہ کا حجم بڑھے گا۔`,
    invReason: (c, n) => `ابتدائی سرمایہ کاری ${fmt(c)} سے ${fmt(n)} کریں`,
    sipChange: (c, n) => `ماہانہ SIP کو **${fmt(c)}** سے **${fmt(n)}** کرنے سے باقاعدہ جمع پونجی میں اضافہ ہوگا۔`,
    sipReason: (c, n) => `ماہانہ SIP ${fmt(c)} سے ${fmt(n)} کریں`,
    levChange: (c, n) => `لیوریج کو **${c}×** سے **${n}×** کرنے سے خطرہ براہ راست تبدیل ہوگا۔`,
    levReason: (c, n) => `لیوریج ${c}× سے ${n}× کریں`,
    stratChange: (c, n) => `حکمت عملی کو **${c.toUpperCase()}** سے **${n.toUpperCase()}** کرنے سے خطرے کا توازن بدلے گا۔`,
    stratReason: (c, n) => `حکمت عملی ${n.toUpperCase()} کریں`,
    riskHighWhy: (lossP, dd, totalInv) => `تاریخی طور پر Nifty 50 میں مارکیٹ کی گراوٹ (${dd}% تک) کی وجہ سے آپ کے نقصان کا امکان **${lossP}%** ہے۔ ابتدائی سالوں میں مندی کی صورت میں ${fmt(totalInv)} سرمائے کو بحال ہونے میں وقت درکار ہوتا ہے۔`,
    simpleExplain: (strat, totalInv, median, lossP, profitP) => `آسان الفاظ میں: آپ **${strat.toUpperCase()}** کے تحت کل **${fmt(totalInv)}** کی سرمایہ کاری کر رہے ہیں۔ 10,000 سیمیولیشنز میں سے **${profitP}%** منافع پر اور **${lossP}%** نقصان پر ختم ہوئیں۔ درمیانی نتیجہ **${fmt(median)}** رہا۔`,
    reduceDd: (dd, strat) => `گراوٹ (${dd}%) کم کرنے کے طریقے: 1) مدت میں اضافہ کریں؛ 2) ماہانہ SIP برقرار رکھیں؛ 3) F&O لیوریج کم یا ختم کریں۔`,
    saferStrat: (strat) => strat === 'sip'
      ? `آپ پہلے ہی ایک محفوظ اور منظم SIP حکمت عملی استعمال کر رہے ہیں۔`
      : `منظم انڈیکس SIP پر منتقل ہونا ڈیریویٹوز لیوریج کے خطرے کو ختم کر دے گا۔`,
    biggestRiskQ: (lossP, dd) => `آپ کی موجودہ حکمت عملی میں سب سے بڑا خطرہ **${lossP}% نقصان کا امکان** اور **${dd}% زیادہ سے زیادہ گراوٹ** ہے۔`,
    overviewHeader: "آپ کے سیمیولیشن خطرے کا جائزہ:\n",
    tryAsking: "\nآپ مجھ سے پوچھ سکتے ہیں:\n• *\"میرے نقصان کا امکان زیادہ کیوں ہے؟\"*\n• *\"اگر میں 10 سال سرمایہ کاری کروں تو کیا ہوگا؟\"*\n• *\"گراوٹ کیسے کم کی جائے؟\"*\n• *\"محفوظ حکمت عملی سے موازنہ کریں\"*\n\n"
  },

  fr: {
    noSim: "Il semble que vous n'ayez pas encore lancé de simulation. Définissez vos paramètres à gauche et cliquez sur **Lancer la simulation** pour explorer vos résultats.",
    disclaimer: "*📚 Réponses à titre purement éducatif et illustratif — ne constitue pas un conseil financier personnalisé.*",
    applyRunPrompt: "Cliquez sur **Appliquer et relancer** pour tester ce scénario.",
    durChange: (c, n) => `Faire passer votre horizon d'investissement de **${c} ans** à **${n} ans** modifie la distribution des résultats. Un horizon plus long favorise la capitalisation composée.`,
    durReason: (c, n) => `Modifier la durée de ${c} à ${n} ans`,
    invChange: (c, n) => `Ajuster votre investissement initial de **${fmt(c)}** à **${fmt(n)}** redimensionne proportionnellement votre capital de départ.`,
    invReason: (c, n) => `Modifier l'investissement initial de ${fmt(c)} à ${fmt(n)}`,
    sipChange: (c, n) => `Ajuster votre versement mensuel SIP de **${fmt(c)}** à **${fmt(n)}** modifie l'accumulation progressive de votre capital.`,
    sipReason: (c, n) => `Modifier le SIP mensuel de ${fmt(c)} à ${fmt(n)}`,
    levChange: (c, n) => `Modifier le levier de **${c}×** à **${n}×** amplifie directement votre exposition à la volatilité et au drawdown.`,
    levReason: (c, n) => `Modifier le levier de ${c}× à ${n}×`,
    stratChange: (c, n) => `Passer de **${c.toUpperCase()}** à **${n.toUpperCase()}** modifie fondamentalement votre rapport risque/rendement.`,
    stratReason: (c, n) => `Passer à la stratégie ${n.toUpperCase()}`,
    riskHighWhy: (lossP, dd, totalInv) => `Votre probabilité de perte simulée est de **${lossP}%** car l'historique du Nifty 50 comporte des corrections majeures (jusqu'à **${dd}%**). Si des années négatives surviennent au début, la capitalisation n'a pas le temps de reconstituer le capital de ${fmt(totalInv)}.`,
    simpleExplain: (strat, totalInv, median, lossP, profitP) => `En résumé : Vous investissez au total **${fmt(totalInv)}** dans une stratégie **${strat.toUpperCase()}**. Sur 10 000 trajectoires simulées, **${profitP}%** se sont conclues par un gain et **${lossP}%** par une perte en capital. Le résultat médian atteint **${fmt(median)}**.`,
    reduceDd: (dd, strat) => `Pour réduire le drawdown maximal (${dd}%) : 1) Allongez la durée d'investissement ; 2) Maintenez un SIP indiciel régulier ; 3) En F&O, réduisez ou supprimez l'effet de levier.`,
    saferStrat: (strat) => strat === 'sip'
      ? `Vous utilisez déjà une stratégie SIP disciplinée, qui constitue l'approche la plus résiliente.`
      : `Adopter une stratégie indicielle SIP supprime les risques liés à l'effet de levier et améliore significativement la résilience.`,
    biggestRiskQ: (lossP, dd) => `Le risque principal réside dans une **probabilité de perte de ${lossP}%** associée à un drawdown maximal potentiel de **${dd}%**.`,
    overviewHeader: "Voici l'aperçu du risque de votre simulation :\n",
    tryAsking: "\nVous pouvez me demander :\n• *\"Pourquoi ma probabilité de perte est-elle élevée ?\"*\n• *\"Que se passe-t-il si j'investis sur 10 ans ?\"*\n• *\"Comment réduire le drawdown ?\"*\n• *\"Comparer avec une stratégie plus sûre\"*\n\n"
  }
};

function getDict(lang) {
  return I18N[lang] || I18N.en;
}

// ── Chat ──────────────────────────────────────────────────────────────
export function generateChatResponse(context, userMessage, lang = 'en') {
  const dict = getDict(lang);
  const msg = (userMessage || '').toLowerCase().trim();
  const r = context?.result;
  const form = context?.form;
  const strategy = context?.strategy || 'sip';
  const stress = context?.stressScenario;

  if (!r) {
    return { response: dict.noSim };
  }

  const lossP = r.probabilityOfLoss;
  const profitP = r.probabilityOfProfit;
  const median = r.medianOutcome;
  const dd = parseFloat(r.maxDrawdown);
  const p5 = r.percentile5;
  const p95 = r.percentile95;
  const totalInv = r.totalInvested;

  // 1. Detect "what if" duration changes
  const relDurMatch = msg.match(/(?:increase|extend|decrease|reduce|वाढवा|कमी|அதிகரி|குறை|बढ़ाएं|घटाएं|বাড়ান|কমান|పెంచండి|తగ్గించండి|بڑھائیں|کم|augmenter|réduire)\s+(?:duration|horizon|period|years?)?\s*(?:by)?\s*(\d+)\s*(?:years?|yrs?|वर्ष|ஆண்டு|বছর|సంవత్సరం|سال|ans?)?/i);
  if (relDurMatch) {
    const delta = parseInt(relDurMatch[1], 10);
    const isDecrease = /\b(decrease|reduce|less|cut|कमी|குறை|घटाएं|কমান|తగ్గించండి|کم|réduire)\b/i.test(msg);
    const currentDur = Number(form?.durationYears || 5);
    const newDur = isDecrease ? Math.max(1, currentDur - delta) : Math.min(30, currentDur + delta);
    if (newDur !== currentDur) {
      return {
        response: `${dict.durChange(currentDur, newDur)}\n\n${dict.applyRunPrompt}\n\n${dict.disclaimer}`,
        suggestedChanges: {
          field: 'durationYears',
          newValue: newDur,
          reason: dict.durReason(currentDur, newDur)
        }
      };
    }
  }

  const durationMatch = msg.match(/(?:what\s+(?:if|happens?|would)|change.*to|invest\s+for|try|duration\s+(?:to|of|is)|\b(?:10|15|20|25|30|3|5|7)\s*(?:years?|yrs?|वर्ष|ஆண்டுகள்|বছর|సంవత్సరాలు|سال|ans?))\s*(\d+)?/i);
  const numInMsg = msg.match(/\b([1-9]|[12]\d|30)\s*(?:years?|yrs?|वर्ष|ஆண்டுகள்|বছর|సంవత్సరాలు|سال|ans?)\b/i);
  if (numInMsg || durationMatch) {
    const matched = numInMsg ? parseInt(numInMsg[1], 10) : parseInt(durationMatch[1], 10);
    if (matched && matched >= 1 && matched <= 30 && matched !== Number(form?.durationYears)) {
      return {
        response: `${dict.durChange(form?.durationYears, matched)}\n\n${dict.applyRunPrompt}\n\n${dict.disclaimer}`,
        suggestedChanges: {
          field: 'durationYears',
          newValue: matched,
          reason: dict.durReason(form?.durationYears, matched)
        }
      };
    }
  }

  // 2. Detect "what if" investment changes
  const investMatch = msg.match(/(?:invest|add|put|start with|initial|निवेश|முதலீடு|বিনিয়োগ|गुंतवणूक|పెట్టుబడి|سرمایہ|investir)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*(?:\.\d+)?)\s*(?:lakh|lac|l|k)?/i);
  if (investMatch && !msg.includes('month') && !msg.includes('sip')) {
    let rawVal = parseFloat(investMatch[1].replace(/,/g, ''));
    if (/lakh|lac|\bl\b/i.test(msg)) rawVal *= 100000;
    else if (/\bk\b/i.test(msg)) rawVal *= 1000;
    const currentInv = Number(form?.initialInvestment || 0);
    if (rawVal >= 1000 && rawVal <= 10000000 && rawVal !== currentInv) {
      return {
        response: `${dict.invChange(currentInv, rawVal)}\n\n${dict.applyRunPrompt}\n\n${dict.disclaimer}`,
        suggestedChanges: {
          field: 'initialInvestment',
          newValue: rawVal,
          reason: dict.invReason(currentInv, rawVal)
        }
      };
    }
  }

  // 3. Detect monthly SIP changes
  const sipMatch = msg.match(/(?:sip|monthly|மாதாந்திர|मासिक|প্রতি মাসে|నెలవారీ|ماہانہ|mensuel)\s*(?:of|to|is)?\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*(?:\.\d+)?)\s*(?:k|lakh|lac)?/i);
  if (sipMatch) {
    let rawSip = parseFloat(sipMatch[1].replace(/,/g, ''));
    if (/lakh|lac/i.test(msg)) rawSip *= 100000;
    else if (/\bk\b/i.test(msg)) rawSip *= 1000;
    const currentSip = Number(form?.monthlyInvestment || 0);
    if (rawSip >= 0 && rawSip <= 1000000 && rawSip !== currentSip) {
      return {
        response: `${dict.sipChange(currentSip, rawSip)}\n\n${dict.applyRunPrompt}\n\n${dict.disclaimer}`,
        suggestedChanges: {
          field: 'monthlyInvestment',
          newValue: rawSip,
          reason: dict.sipReason(currentSip, rawSip)
        }
      };
    }
  }

  // 4. Detect leverage changes
  const levMatch = msg.match(/(?:leverage|multiplier|லெவரேஜ்|लीवरेज|লিভারেজ|लिव्हरेज|లివరేజ్|لیوریج|levier)\s*(?:to|of|is)?\s*(\d+(?:\.\d+)?)\s*(?:x|×)?/i);
  if (levMatch && strategy === 'fno') {
    const newLev = parseFloat(levMatch[1]);
    const currentLev = Number(form?.leverage || 1);
    if (newLev >= 1 && newLev <= 5 && newLev !== currentLev) {
      return {
        response: `${dict.levChange(currentLev, newLev)}\n\n${dict.applyRunPrompt}\n\n${dict.disclaimer}`,
        suggestedChanges: {
          field: 'leverage',
          newValue: newLev,
          reason: dict.levReason(currentLev, newLev)
        }
      };
    }
  }

  // 5. Detect strategy switches
  if (msg.includes('switch to sip') || msg.includes('change to sip') || msg.includes('try sip') || (msg.includes('sip') && msg.includes('safer') && strategy !== 'sip')) {
    return {
      response: `${dict.stratChange(strategy, 'sip')}\n\n${dict.applyRunPrompt}\n\n${dict.disclaimer}`,
      suggestedChanges: {
        field: 'strategy',
        newValue: 'sip',
        reason: dict.stratReason(strategy, 'sip')
      }
    };
  }

  // 6. Intent matching
  if (msg.includes('why') && (msg.includes('loss') || msg.includes('high') || msg.includesஇழப்பு || msg.includes('நஷ்டம்') || msg.includes('नुकसान') || msg.includes('ক্ষতি') || msg.includes('तोटा') || msg.includes('నష్టం') || msg.includes('perte'))) {
    return { response: `${dict.riskHighWhy(lossP, dd, totalInv)}\n\n${dict.disclaimer}` };
  }

  if (msg.includes('simple') || msg.includes('explain') || msg.includes('words') || msg.includes('விளக்கு') || msg.includes('सरल') || msg.includes('সহজ') || msg.includes('सोप्या') || msg.includes('సులభ') || msg.includes('سادہ') || msg.includes('simple')) {
    return { response: `${dict.simpleExplain(strategy, totalInv, median, lossP, profitP)}\n\n${dict.disclaimer}` };
  }

  if (msg.includes('drawdown') || msg.includes('reduce') || msg.includes('வீழ்ச்சி') || msg.includes('गिरावट') || msg.includes('পতন') || msg.includes('घसरण') || msg.includes('క్షీణత') || msg.includes('گراوٹ')) {
    return { response: `${dict.reduceDd(dd, strategy)}\n\n${dict.disclaimer}` };
  }

  if (msg.includes('safe') || msg.includes('compare') || msg.includes('பாதுகாப்ப') || msg.includes('सुरक्षित') || msg.includes('নিরাপদ') || msg.includes('సురక్షిత') || msg.includes('محفوظ') || msg.includes('sûr')) {
    return { response: `${dict.saferStrat(strategy)}\n\n${dict.disclaimer}` };
  }

  if (msg.includes('biggest risk') || msg.includes('main risk') || msg.includes('ஆபத்து') || msg.includes('जोखिम') || msg.includes('خطرہ') || msg.includes('risque')) {
    return { response: `${dict.biggestRiskQ(lossP, dd)}\n\n${dict.disclaimer}` };
  }

  // Default response with current numbers
  let resp = `${dict.overviewHeader}`;
  resp += `• **Strategy**: ${strategy.toUpperCase()}\n`;
  resp += `• **Loss Probability**: ${lossP}% | **Profit Probability**: ${profitP}%\n`;
  resp += `• **Median Outcome**: ${fmt(median)} on ${fmt(totalInv)} invested\n`;
  resp += `• **5th to 95th Range**: ${fmt(p5)} to ${fmt(p95)}\n`;
  resp += `• **Max Drawdown**: ${dd}%\n`;
  if (stress && stress.label) resp += `• **Active Stress Scenario**: ${stress.label}\n`;
  resp += `${dict.tryAsking}`;
  resp += `${dict.disclaimer}`;

  return { response: resp };
}

// ── Scenario Interpreter ──────────────────────────────────────────────
export function generateScenarioInterpretation(simulationResult, strategy, form, stressScenario, lang = 'en') {
  const r = simulationResult;
  if (!r) return null;

  const hasStress = !!(stressScenario && stressScenario.probabilityOfLoss !== undefined);
  const lossP = hasStress ? stressScenario.probabilityOfLoss : r.probabilityOfLoss;
  const dd = hasStress ? parseFloat(stressScenario.maxDrawdown) : parseFloat(r.maxDrawdown);
  const p5 = hasStress && stressScenario.percentile5 !== undefined ? stressScenario.percentile5 : r.percentile5;
  const p95 = hasStress && stressScenario.percentile95 !== undefined ? stressScenario.percentile95 : r.percentile95;
  const totalInv = r.totalInvested;
  const duration = Number(form?.durationYears) || 5;
  const sLabel = stressScenario?.label || stressScenario?.scenarioLabel || 'Macro Shock';
  const worstLossPct = totalInv > 0 ? ((1 - p5 / totalInv) * 100).toFixed(1) : '0';

  const LOCALIZED_INTERP = {
    en: {
      biggestRisk: hasStress
        ? `Under the ${sLabel} stress scenario, probability of loss escalates to ${lossP}%, with drawdown expanding to ${dd}%.`
        : lossP > 35
          ? `High probability of loss (${lossP}%) — significant simulated paths finished below your invested capital of ${fmt(totalInv)}.`
          : `Contained loss probability (${lossP}%) with maximum drawdown bounded at ${dd}%.`,
      riskCause: strategy === 'fno'
        ? `Leverage (${form?.leverage || 1}×) amplifies underlying volatility, compounding downside drawdown.`
        : `Historical market cycles and sequential resampling of negative return years over a ${duration}-year period.`,
      worstCase: `In the worst 5% of simulated scenarios, your portfolio ended at approximately **${fmt(p5)}** on a total investment of ${fmt(totalInv)}${p5 < totalInv ? ` (a ${worstLossPct}% loss)` : ''}. The peak simulated drawdown reached **${dd}%**.`,
      assumptions: [
        'Returns are drawn via bootstrap resampling from 2000–2025 Nifty 50 historical annual returns.',
        '10,000 independent Monte Carlo paths are evaluated without assuming an artificial normal distribution.',
        strategy === 'fno'
          ? `F&O leverage (${form?.leverage || 1}×) is modeled as a direct return multiplier floored at -95%.`
          : 'Systematic contributions are assumed to occur continuously without interruption.',
        'Taxes, transaction charges, and fund expense ratios are not deducted from simulated balances.'
      ],
      improvement: [
        'Extending investment duration allows compounding to average out historical market downturns.',
        strategy !== 'fno' ? 'Increasing monthly SIP contributions dollar-cost averages across market cycles.' : 'Reducing leverage significantly lowers drawdown depth.',
        'Maintaining a disciplined systematic allocation rather than attempting market timing.'
      ],
      worsening: [
        'Shortening duration leaves less runway to recover from consecutive negative return years.',
        strategy === 'fno' ? 'Higher leverage increases the probability of permanent capital impairment.' : 'Switching to leveraged derivatives amplifies downside drawdown.',
        'Panic selling during severe market drawdowns locks in temporary paper losses.'
      ]
    },

    ta: {
      biggestRisk: hasStress
        ? `${sLabel} அழுத்த சோதனையில், இழப்பு நிகழ்தகவு ${lossP}% ஆகவும், வீழ்ச்சி ${dd}% ஆகவும் உயர்கிறது.`
        : lossP > 35
          ? `அதிக இழப்பு நிகழ்தகவு (${lossP}%) — உருவகப்படுத்தப்பட்ட முடிவுகளில் கணிசமானவை உங்கள் ${fmt(totalInv)} முதலீட்டுக்கு கீழே உள்ளன.`
          : `கட்டுப்படுத்தப்பட்ட இழப்பு நிகழ்தகவு (${lossP}%) மற்றும் அதிகபட்ச வீழ்ச்சி ${dd}%.`,
      riskCause: strategy === 'fno'
        ? `லெவரேஜ் (${form?.leverage || 1}×) சந்தை மாறுபாடுகளை பெருக்கி, இழப்பை அதிகரிக்கிறது.`
        : `${duration} ஆண்டுகளில் Nifty 50 வரலாற்று சந்தை சுழற்சிகள் மற்றும் சரிவுகளின் கூட்டுத் தாக்கம்.`,
      worstCase: `மோசமான 5% காட்சிகளில், போர்ட்ஃபோலியோ மதிப்பு சுமார் **${fmt(p5)}** ஆக முடிந்தது (முதலீடு ${fmt(totalInv)}). அதிகபட்ச வீழ்ச்சி **${dd}%** ஐ எட்டியது.`,
      assumptions: [
        '2000–2025 Nifty 50 வரலாற்று வருவாய் தரவுகளில் இருந்து பூட்ஸ்ட்ராப் மாதிரிகள் எடுக்கப்படுகின்றன.',
        '10,000 சுயாதீன மான்டே கார்லோ வழிகள் கணக்கிடப்படுகின்றன.',
        strategy === 'fno'
          ? `F&O லெவரேஜ் நேரடி வருவாய் பெருக்கியாக மாதிரியாக்கப்படுகிறது.`
          : 'மாதாந்திர முதலீடுகள் தடையின்றி தொடர்ந்து நடைபெறுவதாகக் கருதப்படுகிறது.',
        'வரிகள் மற்றும் தரகு கட்டணங்கள் இதிலிருந்து கழிக்கப்படவில்லை.'
      ],
      improvement: [
        'முதலீட்டுக் காலத்தை நீட்டிப்பது சரிவுகளிலிருந்து மீள கூடுதல் அவகாசம் அளிக்கும்.',
        strategy !== 'fno' ? 'மாதாந்திர SIP தொகையை அதிகரிப்பது சராசரி விலையை சமன் செய்யும்.' : 'லெவரேஜை குறைப்பது வீழ்ச்சி ஆழத்தை கட்டுப்படுத்தும்.',
        'சந்தை நேரத்தை கணிக்காமல் முறையான முதலீட்டை தொடர்வது.'
      ],
      worsening: [
        'கால அளவைக் குறைப்பது சரிவுகளிலிருந்து மீள்வதற்கான வாய்ப்பைக் குறைக்கும்.',
        strategy === 'fno' ? 'அதிக லெவரேஜ் நிரந்தர மூலதன இழப்புக்கான வாய்ப்பை அதிகரிக்கும்.' : 'லெவரேஜ் உத்திகளுக்கு மாறுவது இடரை அதிகரிக்கும்.',
        'சந்தை வீழ்ச்சியின் போது அச்சத்தில் பங்குகளை விற்பது நிரந்தர இழப்பை ஏற்படுத்தும்.'
      ]
    },

    hi: {
      biggestRisk: hasStress
        ? `${sLabel} स्ट्रेस टेस्ट में नुकसान की संभावना बढ़कर ${lossP}% और गिरावट ${dd}% तक पहुंच जाती है।`
        : lossP > 35
          ? `उच्च नुकसान संभावना (${lossP}%) — कई परिदृश्य आपकी कुल ${fmt(totalInv)} पूंजी से नीचे समाप्त हुए।`
          : `नियंत्रित नुकसान संभावना (${lossP}%) और अधिकतम गिरावट ${dd}% पर सीमित है।`,
      riskCause: strategy === 'fno'
        ? `लीवरेज (${form?.leverage || 1}×) बाज़ार के उतार-चढ़ाव और नुकसान को कई गुना बढ़ा देता है।`
        : `${duration} वर्षों में Nifty 50 के ऐतिहासिक बाज़ार चक्रों और मंदी के दौर का प्रभाव।`,
      worstCase: `सबसे खराब 5% परिदृश्यों में आपका पोर्टफोलियो कुल ${fmt(totalInv)} के निवेश पर लगभग **${fmt(p5)}** पर समाप्त हुआ। अधिकतम गिरावट **${dd}%** दर्ज की गई।`,
      assumptions: [
        'रिटर्न 2000–2025 Nifty 50 ऐतिहासिक आंकड़ों से बूटस्ट्रैप पद्धति द्वारा लिए गए हैं।',
        '10,000 स्वतंत्र मोंटे कार्लो पथों का निष्पक्ष विश्लेषण किया गया है।',
        strategy === 'fno'
          ? `F&O लीवरेज (${form?.leverage || 1}×) को रिटर्न मल्टीप्लायर के रूप में माना गया है।`
          : 'मासिक SIP योगदान पूरे समय बिना किसी रुकावट के जारी रहता है।',
        'टैक्स और ब्रोकरेज शुल्क को सिमुलेशन में शामिल नहीं किया गया है।'
      ],
      improvement: [
        'अवधि बढ़ाने से बाज़ार की गिरावट से उबरने के लिए पर्याप्त समय मिलता है।',
        strategy !== 'fno' ? 'मासिक SIP बढ़ाने से लागत का औसत बेहतर होता है।' : 'लीवरेज घटाने से गिरावट का जोखिम काफी कम हो जाता है।',
        'बाज़ार का अनुमान लगाने के बजाय अनुशासित निवेश बनाए रखना।'
      ],
      worsening: [
        'अवधि कम करने से मंदी के वर्षों से उबरने का समय नहीं मिल पाता।',
        strategy === 'fno' ? 'अधिक लीवरेज पूंजी डूबने की संभावना को काफी बढ़ा देता है।' : 'डेरिवेटिव्स अपनाने से अस्थिरता बढ़ जाती है।',
        'गिरावट के समय घबराकर पोर्टफोलियो बेचना अस्थायी नुकसान को स्थायी बना देता है।'
      ]
    },

    bn: {
      biggestRisk: hasStress
        ? `${sLabel} স্ট্রেস পরিস্থিতিতে ক্ষতির সম্ভাবনা বেড়ে ${lossP}% এবং সর্বোচ্চ পতন ${dd}% হয়।`
        : lossP > 35
          ? `উচ্চ ক্ষতির সম্ভাবনা (${lossP}%) — উল্লেখযোগ্য সংখ্যক ফলাফল আপনার ${fmt(totalInv)} মূলধনের নিচে শেষ হয়েছে।`
          : `নিয়ন্ত্রিত ক্ষতির সম্ভাবনা (${lossP}%) এবং সর্বোচ্চ পতন ${dd}%-এ সীমাবদ্ধ।`,
      riskCause: strategy === 'fno'
        ? `লিভারেজ (${form?.leverage || 1}×) বাজারের অস্থিরতা ও নিম্নমুখী ঝুঁকিকে বাড়িয়ে তোলে।`
        : `${duration} বছরের মেয়াদে Nifty 50-এর ঐতিহাসিক মন্দার চক্রের সামগ্রিক প্রভাব।`,
      worstCase: `সবচেয়ে খারাপ ৫% পরিস্থিতিতে ${fmt(totalInv)} বিনিয়োগের বিপরীতে পোর্টফোলিও মূল্য দাঁড়িয়েছে প্রায় **${fmt(p5)}**। সর্বোচ্চ পতন ছিল **${dd}%**।`,
      assumptions: [
        '২০০০–২০২৫ Nifty 50 ঐতিহাসিক রিটার্ন থেকে বুটস্ট্র্যাপ পদ্ধতিতে ডেটা সংগৃহীত।',
        '১০,০০০ স্বাধীন মন্টে কার্লো পাথ মূল্যায়ন করা হয়েছে।',
        strategy === 'fno'
          ? `F&O লিভারেজ সরাসরি রিটার্ন গুণক হিসেবে প্রয়োগ করা হয়েছে।`
          : 'নিয়মিত মাসিক বিনিয়োগ সম্পূর্ণ মেয়াদে অব্যাহত থাকে বলে ধরা হয়েছে।',
        'ট্যাক্স এবং ব্রোকারেজ ফি হিসাব থেকে বাদ রাখা হয়নি।'
      ],
      improvement: [
        'বিনিয়োগের মেয়াদ বাড়ালে বাজার মন্দা কাটিয়ে ওঠার সুযোগ বাড়ে।',
        strategy !== 'fno' ? 'মাসিক SIP বাড়ালে গড় ক্রয়মূল্য সুবিধাজনক হয়।' : 'লিভারেজ কমালে পতনের গভীরতা উল্লেখযোগ্যভাবে হ্রাস পায়।',
        'বাজারের সময় অনুমান না করে নিয়মতান্ত্রিক বিনিয়োগ বজায় রাখা।'
      ],
      worsening: [
        'মেয়াদ কমিয়ে দিলে মন্দা থেকে ঘুরে দাঁড়ানোর সময় পাওয়া যায় না।',
        strategy === 'fno' ? 'উচ্চ লিভারেজ স্থায়ী মূলধন হারানোর ঝুঁকি তৈরি করে।' : 'লিভারেজড কৌশলে পরিবর্তন ঝুঁকি বহুগুণ বাড়ায়।',
        'মার্কেট পতনের সময় আতঙ্কে বিক্রি করে দিলে ক্ষতি স্থায়ী রূপ নেয়।'
      ]
    },

    mr: {
      biggestRisk: hasStress
        ? `${sLabel} स्ट्रेस टेस्ट अंतर्गत नुकसानीची शक्यता ${lossP}% आणि घसरण ${dd}% पर्यंत वाढते.`
        : lossP > 35
          ? `जास्त तोट्याची शक्यता (${lossP}%) — अनेक निकाल तुमच्या ${fmt(totalInv)} भांडवलापेक्षा खाली आले आहेत.`
          : `मर्यादित जोखीम (${lossP}% तोटा शक्यता) आणि कमाल घसरण ${dd}% वर मर्यादित आहे.`,
      riskCause: strategy === 'fno'
        ? `लिव्हरेज (${form?.leverage || 1}×) बाजारातील चढ-उतार आणि तोट्याचे प्रमाण वाढवते.`
        : `${duration} वर्षांतील Nifty 50 च्या ऐतिहासिक चक्रांचा आणि घसरणीचा संचयी परिणाम.`,
      worstCase: `सर्वात वाईट ५% परिस्थितींमध्ये, एकूण ${fmt(totalInv)} च्या गुंतवणुकीवर पोर्टफोलिओ सुमारे **${fmt(p5)}** वर आला. कमाल घसरण **${dd}%** होती.`,
      assumptions: [
        '२०००–२०२५ Nifty 50 च्या ऐतिहासिक परताव्यावरून बूटस्ट्रॅप नमुने घेतलेले आहेत.',
        '१०,००० स्वतंत्र माँटे कार्लो मार्गांचे विश्लेषण करण्यात आले आहे.',
        strategy === 'fno'
          ? `F&O लिव्हरेज थेट परतावा गुणक म्हणून लागू केले आहे.`
          : 'मासिक SIP गुंतवणूक संपूर्ण कालावधीत नियमित सुरू राहते असे गृहीत धरले आहे.',
        'कर आणि ब्रोकरेज शुल्क सिमुलेशनमधून वजा केलेले नाही.'
      ],
      improvement: [
        'कालावधी वाढवल्याने मंदीतून सावरण्यासाठी पुरेसा वेळ मिळतो.',
        strategy !== 'fno' ? 'मासिक SIP वाढवल्याने खर्चाची सरासरी सुधारते.' : 'लिव्हरेज कमी केल्यास घसरणीचा धोका खूप कमी होतो.',
        'बाजाराचा अंदाज न बांधता शिस्तबद्ध गुंतवणूक सुरू ठेवणे.'
      ],
      worsening: [
        'कालावधी कमी केल्यास तोट्यातून सावरण्यास वेळ मिळत नाही.',
        strategy === 'fno' ? 'जास्त लिव्हरेजमुळे कायमस्वरूपी भांडवल नष्ट होण्याची शक्यता वाढते.' : 'डेरिव्हेटिव्ह्ज वापरल्याने जोखीम वाढते.',
        'घसरणीच्या वेळी घाबरून गुंतवणूक विकल्यास तोटा पक्का होतो.'
      ]
    },

    te: {
      biggestRisk: hasStress
        ? `${sLabel} స్ట్రెస్ టెస్ట్‌లో నష్ట సంభావ్యత ${lossP}% కి మరియు గరిష్ట క్షీణత ${dd}% కి పెరుగుతుంది.`
        : lossP > 35
          ? `అధిక నష్ట సంభావ్యత (${lossP}%) — చాలా ఫలితాలు మీ ${fmt(totalInv)} పెట్టుబడి కంటే తక్కువగా ముగిశాయి.`
          : `నియంత్రిత నష్ట సంభావ్యత (${lossP}%) మరియు గరిష్ట క్షీణత ${dd}% వద్ద పరిమితమైంది.`,
      riskCause: strategy === 'fno'
        ? `లివరేజ్ (${form?.leverage || 1}×) మార్కెట్ హెచ్చుతగ్గులను పెంచి నష్టాన్ని తీవ్రతరం చేస్తుంది.`
        : `${duration} సంవత్సరాల కాలంలో Nifty 50 చారిత్రక మార్కెట్ చక్రాల ప్రతికూల ప్రభావం.`,
      worstCase: `అత్యంత ప్రతికూలమైన 5% సందర్భాలలో, ${fmt(totalInv)} పెట్టుబడిపై పోర్ట్‌ఫోలియో విలువ సుమారు **${fmt(p5)}** కి తగ్గింది. గరిష్ట క్షీణత **${dd}%** కి చేరింది.`,
      assumptions: [
        '2000–2025 Nifty 50 చారిత్రక డేటా ఆధారంగా బూట్‌స్ట్రాప్ నమూనాలు తీసుకోబడ్డాయి.',
        '10,000 స్వతంత్ర మాంటే కార్లో మార్గాలు విశ్లేషించబడ్డాయి.',
        strategy === 'fno'
          ? `F&O లివరేజ్ నేరుగా రాబడి గుణకంగా పరిగణించబడింది.`
          : 'నెలవారీ SIP పెట్టుబడులు నిరంతరాయంగా కొనసాగుతాయని భావించబడింది.',
        'పన్నులు మరియు బ్రోకరేజ్ రుసుములు ఇందులో మినహాయించబడలేదు.'
      ],
      improvement: [
        'వ్యవధిని పెంచడం ద్వారా మార్కెట్ మాంద్యం నుండి కోలుకోవడానికి తగినంత సమయం లభిస్తుంది.',
        strategy !== 'fno' ? 'నెలవారీ SIP పెంచడం ద్వారా సగటు కొనుగోలు ప్రయోజనం చేకూరుతుంది.' : 'లివరేజ్ తగ్గించడం పతన తీవ్రతను అరికడుతుంది.',
        'మార్కెట్ టైమింగ్ ప్రయత్నించకుండా క్రమశిక్షణతో కూడిన పెట్టుబడిని కొనసాగించడం.'
      ],
      worsening: [
        'వ్యవధిని తగ్గించడం వల్ల నష్టాల నుండి బయటపడే అవకాశం తగ్గుతుంది.',
        strategy === 'fno' ? 'ఎక్కువ లివరేజ్ శాశ్వత మూలధన నష్టానికి దారితీస్తుంది.' : 'లివరేజ్ వ్యూహాలకు మారడం తీవ్రమైన అస్థిరతకు దారితీస్తుంది.',
        'మార్కెట్ పతనాల సమయంలో భయపడి విక్రయించడం వల్ల నష్టాలు స్థిరపడతాయి.'
      ]
    },

    ur: {
      biggestRisk: hasStress
        ? `${sLabel} اسٹریس ٹیسٹ میں نقصان کا امکان بڑھ کر ${lossP}% اور زیادہ سے زیادہ گراوٹ ${dd}% ہو جاتی ہے۔`
        : lossP > 35
          ? `نقصان کا زیادہ امکان (${lossP}%) — متعدد نتائج آپ کے لگائے ہوئے ${fmt(totalInv)} سرمائے سے کم رہے۔`
          : `قابو میں نقصان کا امکان (${lossP}%) اور زیادہ سے زیادہ گراوٹ ${dd}% تک محدود ہے۔`,
      riskCause: strategy === 'fno'
        ? `لیوریج (${form?.leverage || 1}×) مارکیٹ کے اتار چڑھاؤ اور نقصان کو کئی گنا بڑھا دیتی ہے۔`
        : `${duration} سالوں میں Nifty 50 کے تاریخی بحرانوں اور مندی کے ادوار کا اثر۔`,
      worstCase: `بدترین 5% منظر ناموں میں، پورٹ فولیو کل ${fmt(totalInv)} پر تقریباً **${fmt(p5)}** پر ختم ہوا۔ زیادہ سے زیادہ گراوٹ **${dd}%** ریکارڈ کی گئی۔`,
      assumptions: [
        '2000–2025 Nifty 50 تاریخی منافع سے بوٹسٹریپ طریقہ کار کے ذریعے ڈیٹا حاصل کیا گیا۔',
        '10,000 آزاد مونٹی کارلو راستوں کا تجزیہ کیا گیا۔',
        strategy === 'fno'
          ? `F&O لیوریج کو براہ راست منافع کے ملٹی پلائر کے طور پر ماڈل کیا گیا ہے۔`
          : 'ماہانہ SIP بغیر کسی تعطل کے جاری رہنے کا فرض کیا گیا ہے۔',
        'ٹیکس اور بروکریج فیس کو اس میں شامل نہیں کیا گیا ہے۔'
      ],
      improvement: [
        'مدت میں اضافہ مارکیٹ کے جھٹکوں سے بحالی کے لیے کافی وقت فراہم کرتا ہے۔',
        strategy !== 'fno' ? 'ماہانہ SIP بڑھانا لاگت کو اوسط رکھنے میں مدد کرتا ہے۔' : 'لیوریج کم کرنا گراوٹ کی شدت کو گھٹاتا ہے۔',
        'مارکیٹ کا وقت جانچنے کے بجائے باقاعدہ سرمایہ کاری کو ترجیح دینا۔'
      ],
      worsening: [
        'مدت کم کرنے سے منفی سالوں سے نکلنے کی مہلت نہیں ملتی۔',
        strategy === 'fno' ? 'زیادہ لیوریج مستقل سرمایہ کاری کے نقصان کا سبب بنتی ہے۔' : 'ڈیریویٹوز کی طرف منتقلی اتار چڑھاؤ کو بڑھاتی ہے۔',
        'گراوٹ کے دوران گھبرا کر حصص بیچنا عارضی نقصان کو مستقل نقصان بنا دیتا ہے۔'
      ]
    },

    fr: {
      biggestRisk: hasStress
        ? `Sous le scénario de stress ${sLabel}, la probabilité de perte grimpe à ${lossP}%, avec un drawdown maximal s'étendant à ${dd}%.`
        : lossP > 35
          ? `Probabilité de perte élevée (${lossP}%) — une part significative des trajectoires s'est conclue sous votre capital investi de ${fmt(totalInv)}.`
          : `Risque contenu avec une probabilité de perte de ${lossP}% et un drawdown maximal borné à ${dd}%.`,
      riskCause: strategy === 'fno'
        ? `L'effet de levier (${form?.leverage || 1}×) amplifie directement la volatilité et accélère l'érosion du capital en phase de baisse.`
        : `L'enchaînement de cycles historiques défavorables du Nifty 50 sur un horizon de ${duration} ans.`,
      worstCase: `Dans les 5% des pires scénarios simulés, votre portefeuille a terminé à environ **${fmt(p5)}** pour un investissement total de ${fmt(totalInv)}${p5 < totalInv ? ` (soit une perte de ${worstLossPct}%)` : ''}. Le drawdown maximal simulé a atteint **${dd}%**.`,
      assumptions: [
        'Les rendements sont tirés par rééchantillonnage bootstrap à partir des rendements historiques du Nifty 50 (2000–2025).',
        '10 000 trajectoires indépendantes Monte Carlo sont simulées sans présumer d’une loi normale artificielle.',
        strategy === 'fno'
          ? `Le levier F&O (${form?.leverage || 1}×) est modélisé comme un multiplicateur direct de rendement plancher à -95%.`
          : 'Les versements mensuels sont supposés réguliers et ininterrompus.',
        'Les taxes, frais de courtage et ratios de dépenses ne sont pas déduits des soldes simulés.'
      ],
      improvement: [
        "Allonger la durée d'investissement permet aux rendements composés d'atténuer les krachs historiques.",
        strategy !== 'fno' ? "Augmenter les versements mensuels SIP lisse le prix d'achat moyen." : 'Réduire le levier diminue drastiquement la profondeur du drawdown.',
        "Maintenir une discipline systématique plutôt que de chercher à anticiper les points d'entrée du marché."
      ],
      worsening: [
        "Raccourcir la durée laisse moins de temps pour récupérer d'années consécutives de rendements négatifs.",
        strategy === 'fno' ? 'Un levier plus élevé décuple la probabilité de perte définitive en capital.' : 'Basculer vers des instruments dérivés à fort levier amplifie la volatilité baissière.',
        'La capitulation ou vente panique lors des phases de correction sévère matérialise des pertes temporaires.'
      ]
    }
  };

  const selected = LOCALIZED_INTERP[lang] || LOCALIZED_INTERP.en;
  return {
    biggestRisk: selected.biggestRisk,
    riskCause: selected.riskCause,
    worstCaseInterpretation: selected.worstCase,
    keyAssumptions: selected.assumptions,
    improvementFactors: selected.improvement,
    worseningFactors: selected.worsening
  };
}

// ── Risk Summary ──────────────────────────────────────────────────────
export function generateRiskSummary(simulationResult, strategy, form, stressScenario, lang = 'en') {
  const r = simulationResult;
  if (!r) return null;

  const hasStress = !!(stressScenario && stressScenario.probabilityOfLoss !== undefined);
  const lossP = hasStress ? stressScenario.probabilityOfLoss : r.probabilityOfLoss;
  const dd = hasStress ? parseFloat(stressScenario.maxDrawdown) : parseFloat(r.maxDrawdown);
  const p5 = hasStress && stressScenario.percentile5 !== undefined ? stressScenario.percentile5 : r.percentile5;
  const p95 = hasStress && stressScenario.percentile95 !== undefined ? stressScenario.percentile95 : r.percentile95;
  const median = hasStress && stressScenario.medianOutcome !== undefined ? stressScenario.medianOutcome : r.medianOutcome;
  const totalInv = r.totalInvested;
  const profitP = hasStress ? stressScenario.probabilityOfProfit : r.probabilityOfProfit;
  const duration = Number(form?.durationYears) || 5;
  const sLabel = stressScenario?.label || stressScenario?.scenarioLabel || 'Macro Shock';

  // Universal risk level enum: 'Low', 'Moderate', 'High'
  let riskLevel;
  if (lossP > 35 || dd > 55) riskLevel = 'High';
  else if (lossP > 15 || dd > 35) riskLevel = 'Moderate';
  else riskLevel = 'Low';

  const SUMMARIES = {
    en: {
      biggestRiskFactor: hasStress
        ? `Under the ${sLabel} scenario, loss probability is ${lossP}% and max drawdown reaches ${dd}%.`
        : lossP > dd
          ? `${lossP}% of simulated scenarios finish below your total invested capital of ${fmt(totalInv)}.`
          : `Maximum drawdown of ${dd}% indicates that the portfolio could experience a severe peak-to-trough decline.`,
      positiveSignal: profitP > 80
        ? `${profitP}% of simulated scenarios ended with positive returns above total invested capital.`
        : `Median outcome of ${fmt(median)} represents a ${((median / totalInv - 1) * 100).toFixed(0)}% gain above invested capital.`,
      caution: dd > 45
        ? `A ${dd}% drawdown is emotionally demanding — many investors abandon strategies during such drawdowns.`
        : `With a ${lossP}% loss probability, approximately 1 in ${Math.round(100 / (lossP || 1))} paths finish below invested principal.`,
      explanation: `This ${strategy.toUpperCase()} scenario simulates ${fmt(Number(form?.initialInvestment || 0))} initial investment over ${duration} year${duration > 1 ? 's' : ''}. Out of 10,000 simulated paths, ${profitP}% were profitable and ${lossP}% finished below invested capital. Overall risk classification is ${riskLevel}.`
    },

    ta: {
      biggestRiskFactor: hasStress
        ? `${sLabel} சோதனையில், இழப்பு வாய்ப்பு ${lossP}% ஆகவும், அதிகபட்ச வீழ்ச்சி ${dd}% ஆகவும் உள்ளது.`
        : lossP > dd
          ? `10,000 சோதனைகளில் ${lossP}% உங்கள் மொத்த முதலீடான ${fmt(totalInv)} ஐ விட குறைவான முடிவை அடைந்தன.`
          : `அதிகபட்ச வீழ்ச்சி ${dd}% என்பது முதலீட்டில் ஏற்படக்கூடிய உச்சக்கட்ட சரிவைக் காட்டுகிறது.`,
      positiveSignal: profitP > 80
        ? `${profitP}% சிமுலேஷன் வழிகள் மொத்த முதலீட்டுக்கு மேல் லாபத்துடன் முடிவடைந்தன.`
        : `சராசரி முடிவு ${fmt(median)} என்பது உங்கள் முதலீட்டை விட ${((median / totalInv - 1) * 100).toFixed(0)}% கூடுதலாகும்.`,
      caution: dd > 45
        ? `${dd}% வீழ்ச்சி என்பது மனதளவில் சவாலானது — இத்தகைய வீழ்ச்சிகளில் பலர் முதலீட்டை பாதியில் கைவிடுகின்றனர்.`
        : `${lossP}% இழப்பு வாய்ப்பில், சுமார் ${Math.round(100 / (lossP || 1))} வழிகளில் 1 வழி முதலீட்டுக்கு கீழே முடிகிறது.`,
      explanation: `இந்த ${strategy.toUpperCase()} உருவகப்படுத்துதல் ${duration} ஆண்டுகளில் ${fmt(totalInv)} முதலீட்டை ஆய்வு செய்கிறது. 10,000 வழிகளில், ${profitP}% லாபமாகவும் ${lossP}% இழப்பாகவும் முடிந்தது. சராசரி முடிவு ${fmt(median)}. ஒட்டுமொத்த இடர் நிலை: ${riskLevel}.`
    },

    hi: {
      biggestRiskFactor: hasStress
        ? `${sLabel} स्ट्रेस टेस्ट में नुकसान की संभावना ${lossP}% और अधिकतम गिरावट ${dd}% तक पहुंचती है।`
        : lossP > dd
          ? `${lossP}% सिमुलेशन आपकी कुल निवेशित पूंजी ${fmt(totalInv)} से नीचे समाप्त हुए।`
          : `अधिकतम गिरावट ${dd}% यह दर्शाती है कि पोर्टफोलियो में गंभीर गिरावट आ सकती है।`,
      positiveSignal: profitP > 80
        ? `${profitP}% सिमुलेशन पथ कुल निवेशित पूंजी से अधिक सकारात्मक रिटर्न के साथ समाप्त हुए।`
        : `मध्यमान परिणाम ${fmt(median)} निवेशित पूंजी पर ${((median / totalInv - 1) * 100).toFixed(0)}% लाभ को दर्शाता है।`,
      caution: dd > 45
        ? `${dd}% की गिरावट भावनात्मक रूप से कठिन होती है — कई निवेशक ऐसी गिरावट के दौरान रणनीति छोड़ देते हैं।`
        : `${lossP}% नुकसान संभावना के साथ, लगभग हर ${Math.round(100 / (lossP || 1))} में से 1 पथ मूलधन से नीचे रहता है।`,
      explanation: `यह ${strategy.toUpperCase()} परिदृश्य ${duration} वर्षों में कुल ${fmt(totalInv)} के निवेश का अनुकरण करता है। 10,000 सिमुलेशन पथों में से ${profitP}% लाभकारी रहे और ${lossP}% में नुकसान हुआ। समग्र जोखिम वर्गीकरण: ${riskLevel}.`
    },

    bn: {
      biggestRiskFactor: hasStress
        ? `${sLabel} পরিস্থিতিতে ক্ষতির সম্ভাবনা ${lossP}% এবং সর্বোচ্চ পতন ${dd}%।`
        : lossP > dd
          ? `${lossP}% সিমুলেটেড ফলাফল আপনার মোট বিনিয়োগকৃত মূলধন ${fmt(totalInv)}-এর নিচে শেষ হয়েছে।`
          : `সর্বোচ্চ পতন ${dd}% ইঙ্গিত দেয় যে পোর্টফোলিওতে তীব্র সাময়িক পতন ঘটতে পারে।`,
      positiveSignal: profitP > 80
        ? `${profitP}% সিমুলেশন লাভজনকভাবে ইতিবাচক রিটার্ন সহ শেষ হয়েছে।`
        : `গড় ফলাফল ${fmt(median)} মোট বিনিয়োগের ওপর ${((median / totalInv - 1) * 100).toFixed(0)}% লাভ নির্দেশ করে।`,
      caution: dd > 45
        ? `${dd}% ড্রডাউন মানসিকভাবে কঠিন — অনেক বিনিয়োগকারী এমন পতনের সময় বিনিয়োগ ছেড়ে দেন।`
        : `${lossP}% ক্ষতির সম্ভাবনায় গড়ে প্রতি ${Math.round(100 / (lossP || 1))}টির মধ্যে ১টি পথ মূলধনের নিচে থাকে।`,
      explanation: `এই ${strategy.toUpperCase()} পরিস্থিতি ${duration} বছরে মোট ${fmt(totalInv)} বিনিয়োগ বিশ্লেষণ করে। ১০,০০০ পথের মধ্যে ${profitP}% লাভজনক এবং ${lossP}% ক্ষতির সম্মুখীন হয়েছে। গড় ফলাফল ${fmt(median)}। সামগ্রিক ঝুঁকি: ${riskLevel}।`
    },

    mr: {
      biggestRiskFactor: hasStress
        ? `${sLabel} परिस्थितीत तोट्याची शक्यता ${lossP}% आणि कमाल घसरण ${dd}% पर्यंत पोहोचते.`
        : lossP > dd
          ? `${lossP}% निकाल तुमच्या एकूण गुंतवलेल्या भांडवलाच्या (${fmt(totalInv)}) खाली संपले आहेत.`
          : `कमाल घसरण ${dd}% दर्शवते की पोर्टफोलिओमध्ये मोठी तात्पुरती घसरण होऊ शकते.`,
      positiveSignal: profitP > 80
        ? `${profitP}% सिम्युलेशन मार्ग नफ्यासह अनुकूल परताव्यावर संपले.`
        : `मध्यमान निकाल ${fmt(median)} हा गुंतवलेल्या भांडवलावर ${((median / totalInv - 1) * 100).toFixed(0)}% नफा दर्शवतो.`,
      caution: dd > 45
        ? `${dd}% घसरण मानसिकदृष्ट्या आव्हानात्मक असते — अनेक गुंतवणूकदार अशा वेळी गुंतवणूक काढून घेतात.`
        : `${lossP}% तोट्याच्या शक्यतेसह, अंदाजे दर ${Math.round(100 / (lossP || 1))} पैकी १ मार्ग मुद्दलापेक्षा खाली राहतो.`,
      explanation: `हे ${strategy.toUpperCase()} सिम्युलेशन ${duration} वर्षांत एकूण ${fmt(totalInv)} गुंतवणुकीचे विश्लेषण करते. १०,००० मार्गांपैकी ${profitP}% नफ्यात आणि ${lossP}% तोट्यात राहिले. एकंदरीत जोखीम पातळी: ${riskLevel}.`
    },

    te: {
      biggestRiskFactor: hasStress
        ? `${sLabel} దృశ్యంలో నష్ట సంభావ్యత ${lossP}% మరియు గరిష్ట క్షీణత ${dd}% వరకు చేరుకుంటుంది.`
        : lossP > dd
          ? `${lossP}% ఫలితాలు మీ మొత్తం పెట్టుబడి ${fmt(totalInv)} కంటే తక్కువగా ముగిశాయి.`
          : `గరిష్ట క్షీణత ${dd}% పోర్ట్‌ఫోలియో తీవ్రమైన ఒడిదుడుకులను ఎదుర్కొంటుందని సూచిస్తుంది.`,
      positiveSignal: profitP > 80
        ? `${profitP}% సిమ్యులేషన్ మార్గాలు లాభదాయకంగా అనుకూల ఫలితాలతో ముగిశాయి.`
        : `మధ్యస్థ ఫలితం ${fmt(median)} మొత్తం పెట్టుబడిపై ${((median / totalInv - 1) * 100).toFixed(0)}% లాభాన్ని సూచిస్తుంది.`,
      caution: dd > 45
        ? `${dd}% క్షీణత మానసికంగా కష్టమైనది — ఇటువంటి క్షీణతలలో చాలామంది పెట్టుబడిని విరమించుకుంటారు.`
        : `${lossP}% నష్ట సంభావ్యతతో, దాదాపు ప్రతి ${Math.round(100 / (lossP || 1))} మార్గాల్లో 1 మార్గం మూలధనం కంటే తక్కువగా ముగుస్తుంది.`,
      explanation: `ఈ ${strategy.toUpperCase()} సిమ్యులేషన్ ${duration} సంవత్సరాలలో ${fmt(totalInv)} పెట్టుబడిని లెక్కిస్తుంది. 10,000 మార్గాలలో ${profitP}% లాభంతో మరియు ${lossP}% నష్టంతో ముగిశాయి. మొత్తం రిస్క్ స్థాయి: ${riskLevel}.`
    },

    ur: {
      biggestRiskFactor: hasStress
        ? `${sLabel} ٹیسٹ کے تحت نقصان کا امکان ${lossP}% اور زیادہ سے زیادہ گراوٹ ${dd}% ہے۔`
        : lossP > dd
          ? `${lossP}% سیمیولیٹڈ راستے آپ کے کل لگائے گئے ${fmt(totalInv)} سرمائے سے کم پر ختم ہوئے۔`
          : `زیادہ سے زیادہ ${dd}% کی گراوٹ ظاہر کرتی ہے کہ پورٹ فولیو کو شدید دباؤ کا سامنا کرنا پڑ سکتا ہے۔`,
      positiveSignal: profitP > 80
        ? `${profitP}% سیمیولیشن راستے مثبت اور منافع بخش نتائج کے ساتھ مکمل ہوئے۔`
        : `درمیانی نتیجہ ${fmt(median)} کل سرمائے پر ${((median / totalInv - 1) * 100).toFixed(0)}% منافع ظاہر کرتا ہے۔`,
      caution: dd > 45
        ? `${dd}% گراوٹ کا سامنا کرنا مشکل ہوتا ہے — بہت سے سرمایہ کار ایسی صورت میں ہمت ہار جاتے ہیں۔`
        : `${lossP}% نقصان کے امکان کے ساتھ، تقریباً ہر ${Math.round(100 / (lossP || 1))} میں سے 1 راستہ اصل رقم سے نیچے رہتا ہے۔`,
      explanation: `یہ ${strategy.toUpperCase()} سیمیولیشن ${duration} سال میں ${fmt(totalInv)} کی سرمایہ کاری کا جائزہ لیتا ہے۔ 10,000 راستوں میں سے ${profitP}% منافع بخش اور ${lossP}% نقصان میں رہے۔ مجموعی خطرے کی درجہ بندی: ${riskLevel}۔`
    },

    fr: {
      biggestRiskFactor: hasStress
        ? `Sous le scénario de stress ${sLabel}, la probabilité de perte est de ${lossP}% et le drawdown atteint ${dd}%.`
        : lossP > dd
          ? `${lossP}% des trajectoires simulées terminent sous votre capital total investi de ${fmt(totalInv)}.`
          : `Un drawdown maximal de ${dd}% indique que le portefeuille peut connaître une sévère contraction de sa valeur.`,
      positiveSignal: profitP > 80
        ? `${profitP}% des scénarios simulés se sont conclus par une performance positive au-dessus du capital.`
        : `Le résultat médian de ${fmt(median)} représente un gain de ${((median / totalInv - 1) * 100).toFixed(0)}% au-delà de votre capital investi.`,
      caution: dd > 45
        ? `Un drawdown de ${dd}% est éprouvant psychologiquement — de nombreux investisseurs abandonnent leur stratégie dans ces phases.`
        : `Avec une probabilité de perte de ${lossP}%, environ 1 trajectoire sur ${Math.round(100 / (lossP || 1))} termine sous le capital initial.`,
      explanation: `Ce scénario ${strategy.toUpperCase()} simule ${fmt(Number(form?.initialInvestment || 0))} sur ${duration} an${duration > 1 ? 's' : ''}. Sur 10 000 trajectoires, ${profitP}% ont été profitables et ${lossP}% ont fini en perte. Niveau global de risque : ${riskLevel}.`
    }
  };

  const selected = SUMMARIES[lang] || SUMMARIES.en;
  return {
    riskLevel,
    biggestRiskFactor: selected.biggestRiskFactor,
    positiveSignal: selected.positiveSignal,
    caution: selected.caution,
    explanation: selected.explanation
  };
}
