/**
 * 高級救護技術員 (EMT-P) 常用急救藥物資料庫
 * 欄位規範：
 * 1. 適應症 (indications)
 * 2. 禁忌症 (contraindications)
 * 3. 藥物劑量 (dosage)
 * 4. 藥物途徑 (route)
 * 5. 間隔時間 (interval)
 * 6. 兒童特殊情境 (pediatricSpecial)
 * 7. 稀釋配製方法 (preparation)
 * 8. 注意事項 (precautions)
 */
const EMTP_DRUGS = [
  {
    id: "epinephrine",
    nameEn: "Epinephrine",
    nameZh: "腎上腺素",
    brandName: "Bosmin",
    category: "vasopressor",
    categoryZh: "強心升壓劑 / 支氣管擴張劑",
    highAlert: true,
    indications: [
      "心肺功能停止 (OHCA/IHCA) 引起的 PEA、Asystole、VF、無脈搏 VT",
      "嚴重過敏性休克 (Anaphylaxis)",
      "伴隨低血壓之嚴重症狀性心搏過緩",
      "嚴重哮喘 (Severe Asthma) 或幼兒急性喉氣管支氣管炎 (Croup)"
    ],
    contraindications: [
      "心肺復甦術 (CPR) 與嚴重過敏性休克現場無絕對禁忌症",
      "對於有自發性心跳者，需極度小心控制劑量以防惡性心律不整"
    ],
    dosage: "• OHCA: 1 mg\n• 過敏性休克: 0.3 - 0.5 mg\n• 症狀性心搏過緩/休克點滴輸注: 2 - 10 mcg/min (滴速依血壓微調)",
    route: "靜脈注射 (IV) / 骨內途徑 (IO) / 肌肉注射 (IM)",
    interval: "• OHCA: 每 3 - 5 分鐘一次\n• 過敏性休克: 必要時每 5 - 15 分鐘可重複\n• 點滴輸注: 連續性維持點滴",
    pediatricSpecial: "• OHCA: 0.01 mg/kg (即 1:10,000 稀釋液 0.1 mL/kg) IV/IO，每 3-5 分鐘一次。\n• 過敏性休克: 0.01 mg/kg (1:1,000 原液) IM，單次最大劑量 0.3 mg。\n• 嚴重哮喘/喉炎霧化吸入: 0.5 mL (1:1,000) 加 3 mL 生理食鹽水吸入。",
    preparation: "• 靜脈推注 (1:10,000): 取 Epinephrine 1 mg (1 mL) 加入 9 mL 生理食鹽水 (NS) 稀釋至 10 mL。\n• 點滴輸注: 將 Epinephrine 1 mg 放入 250 mL D5W 或 NS 中（濃度為 4 mcg/mL）。",
    precautions: [
      "應儘量由粗大靜脈或骨內途徑 (IO) 給藥，避免外漏導致組織壞死。",
      "鹼性藥物（如 NaHCO3）會使 Epinephrine 去活性，切勿在同一管路中同時輸注。"
    ],
    calcProps: {
      type: "weight_infusion_and_pediatric",
      concentration: "4 mcg/mL (1mg in 250mL)",
      standardDoseMcg: 1000,
      standardVolMl: 250,
      pediatricOhcaDosePerKg: 0.01,
      pediatricOhcaVolPerKg: 0.1,
      infusionUnit: "mcg/min",
      defaultInfusionRate: 5
    }
  },
  {
    id: "amiodarone",
    nameEn: "Amiodarone",
    nameZh: "臟安 / 胺碘酮",
    brandName: "Cordarone",
    category: "antiarrhythmic",
    categoryZh: "抗心律不整藥物 (Class III)",
    highAlert: true,
    indications: [
      "對 CPR、去顫及升壓劑無反應的 VF 或無脈搏 VT",
      "具有血液動力學穩定性的單型性心室心搏過速 (Stable Monomorphic VT)",
      "控制快速心房顫動 / 心房撲動的心室速率"
    ],
    contraindications: [
      "心因性休克 (Cardiogenic Shock)",
      "嚴重竇性心搏過緩 (Severe Sinus Bradycardia)",
      "二度或三度房室傳導阻滯且無裝設節律器者"
    ],
    dosage: "• OHCA (VF/pVT): 首劑 300 mg，次劑 150 mg\n• 有脈搏的穩定 VT: 150 mg 慢速滴注",
    route: "靜脈注射 (IV) / 骨內途徑 (IO)",
    interval: "• OHCA: 首劑給藥後，若 VF/pVT 持續，間隔 3 - 5 分鐘給予次劑\n• 點滴輸注: 首劑 150 mg 於 10 分鐘內滴完，後續可以 1 mg/min 維持點滴輸注",
    pediatricSpecial: "• OHCA: 5 mg/kg IV/IO 快速推注（單次最大劑量 300 mg），若 VF/pVT 持續可重複，最大累積劑量 15 mg/kg。\n• 有脈搏穩定 VT/SVT: 5 mg/kg 加入 D5W 中，於 20-60 分鐘內慢速滴注。",
    preparation: "• 快速推注：直接以原液注射或以 D5W 稀釋至 20-30 mL 注射。\n• 滴注：Amiodarone 150 mg (3 mL) 加入 100 mL D5W（注意：稀釋液僅限用 D5W，不可與 NS 混合）。",
    precautions: [
      "快速注射可能引發嚴重的低血壓及心搏過緩，在有脈搏患者身上必須慢速滴注至少 10 分鐘。",
      "僅能使用 5% 葡萄糖注射液 (D5W) 進行稀釋。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 5,
      mgPerMl: 50,
      maxPediatricDose: 300
    }
  },
  {
    id: "adenosine",
    nameEn: "Adenosine",
    nameZh: "腺苷",
    brandName: "Adenocard",
    category: "antiarrhythmic",
    categoryZh: "抗心律不整藥物",
    highAlert: false,
    indications: [
      "治療穩定、窄 QRS 波之陣發性室上性心搏過速 (PSVT)",
      "輔助診斷窄/寬 QRS 波單型性心搏過速"
    ],
    contraindications: [
      "二度或三度房室傳導阻滯、病竇症候群 (SSS) 且無起搏器者",
      "支氣管哮喘 (Asthma) 或嚴重 COPD 歷史（易誘發嚴重支氣管收縮）",
      "不規則的寬 QRS 波心搏過速（如 WPW 伴隨 Afib，使用會引發 VF）"
    ],
    dosage: "• 首劑: 6 mg (快速推注)\n• 次劑: 12 mg (快速推注)\n• 註：若經由中心靜脈導管 (CVC) 給藥，首劑需減半為 3 mg",
    route: "快速靜脈注射 (Rapid IV push)",
    interval: "首劑給藥後 1 - 2 分鐘內若未轉復，給予次劑",
    pediatricSpecial: "• 首劑: 0.1 mg/kg IV 快速推注（單次最大劑量 6 mg），隨即快速沖水。\n• 次劑: 若未轉復，給予 0.2 mg/kg IV 快速推注（單次最大劑量 12 mg）。",
    preparation: "• 原液直接快速推注，給藥時必須選擇「最靠近心臟之近端靜脈管路」，並使用雙向三路接頭 (Three-way stopcock) 聯動生理食鹽水快速沖洗 (20 mL)。",
    precautions: [
      "半衰期極短（少於 10 秒），故必須極快速推注與沖水，否則無效。",
      "給藥後心電圖可能出現短暫的心搏停止 (Asystole，通常持續數秒) 或 VPC，應先向患者解釋可能會有一時的胸悶、瀕死感。",
      "服用 Theophylline 者劑量需增加；服用 Dipyridamole 或 Tegretol 者，首劑需減半。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricFirstDosePerKg: 0.1,
      pediatricSecondDosePerKg: 0.2,
      mgPerMl: 3,
      maxPediatricDose: 6,
      maxPediatricSecondDose: 12
    }
  },
  {
    id: "atropine",
    nameEn: "Atropine Sulfate",
    nameZh: "阿托平",
    brandName: "Atropine",
    category: "anticholinergic",
    categoryZh: "抗膽鹼劑 / 節律加快劑",
    highAlert: false,
    indications: [
      "有血液動力學症狀的心搏過緩 (Symptomatic Bradycardia)",
      "有機磷農藥或神經毒氣過量中毒之特異性解毒"
    ],
    contraindications: [
      "心肺復甦時無絕對禁忌",
      "對於 Mobitz II 或三度房室傳導阻滯伴寬 QRS 波無效，且可能惡化阻滯"
    ],
    dosage: "• 症狀性心搏過緩: 1 mg\n• 有機磷中毒: 2 - 5 mg",
    route: "靜脈注射 (IV) / 骨內注射 (IO)",
    interval: "• 症狀性心搏過緩: 每 3 - 5 分鐘一次，最大總劑量為 3 mg\n• 有機磷中毒: 每 3 - 5 分鐘重複一次 (直到達成阿托平化)",
    pediatricSpecial: "• 兒科心搏過緩: 0.02 mg/kg IV/IO。\n• 單次最低劑量 0.1 mg；單次最大劑量：兒童 0.5 mg、青少年 1 mg。\n• 總最大量：兒童 1 mg、青少年 2 mg。",
    preparation: "• 原液直接 IV 推注。成人規格通常為 1 mL 裝 (1 mg/mL 或 0.5 mg/mL)。",
    precautions: [
      "靜脈注射劑量若小於 0.5 mg（成人）或 0.1 mg（兒童），可能引發反射性心搏過緩（中樞性迷走刺激效果）。",
      "新生兒心搏過緩主要因缺氧引起，首要治療為氧氣與通氣治療，非 Atropine。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 0.02,
      minPediatricDose: 0.1,
      maxPediatricDose: 0.5,
      mgPerMl: 1
    }
  },
  {
    id: "midazolam",
    nameEn: "Midazolam",
    nameZh: "導美康 / 咪達唑侖",
    brandName: "Dormicum",
    category: "sedative",
    categoryZh: "苯二氮䓬類鎮靜安眠藥 (四級管制藥物)",
    highAlert: true,
    indications: [
      "持續性癲癇重積狀態 (Status Epilepticus)",
      "行氣管插管、心臟同步電擊轉復或經皮起搏 (Pacing) 前之防護鎮靜",
      "躁動或譫妄患者之保護性約束鎮靜"
    ],
    contraindications: [
      "嚴重低血壓或未建立人工氣道之休克狀態",
      "急性狹角性青光眼",
      "對 Benzodiazepines 過敏者"
    ],
    dosage: "• 癲癇控制: 2.5 - 5 mg (IV/IO) 或 5 - 10 mg (IM/IN)\n• 插管前或行動前鎮靜: 1 - 2.5 mg 緩慢注射",
    route: "靜脈注射 (IV) / 骨內注射 (IO) / 肌肉注射 (IM) / 鼻腔給藥 (IN)",
    interval: "• 癲癇重積: 必要時隔 10 分鐘可重複給藥一次",
    pediatricSpecial: "• 癲癇發作: 0.1 - 0.2 mg/kg IM/IN（最大單次 5 mg）或 0.1 mg/kg 緩慢 IV/IO（最大單次 2-4 mg）。",
    preparation: "• 常見規格為 5 mg / 1 mL 或 15 mg / 3 mL。靜脈注射建議稀釋（如 5 mg 稀釋至 5 mL 或 10 mL）以便微量滴定。",
    precautions: [
      "對老年人或合併使用鎮痛藥者，呼吸抑制與低血壓的風險會成倍增加，劑量需減半並極緩慢注射。",
      "解毒劑為 Flumazenil (Anexate)。"
    ],
    calcProps: {
      type: "weight_bolus",
      mgPerMl: 5,
      standardDosePerKg: 0.1,
      doseUnit: "mg/kg",
      maxSingleDose: 5
    }
  },
  {
    id: "txa",
    nameEn: "Tranexamic Acid (TXA)",
    nameZh: "斷血炎 / 傳明酸",
    brandName: "Transamin",
    category: "hemostatic",
    categoryZh: "抗纖維蛋白溶解劑 / 止血藥",
    highAlert: false,
    indications: [
      "嚴重創傷出血、出血性休克（SBP < 90 mmHg 或 HR > 110 bpm）且受傷在 3 小時內者",
      "產後大出血 (PPH) 且呈進行性出血者"
    ],
    contraindications: [
      "受傷時間已超過 3 小時（給藥反而會增加死亡率）",
      "活動性血栓栓塞性疾病（如深部靜脈血栓、肺栓塞、急性腦梗塞）"
    ],
    dosage: "• 首劑: 1 g (1000 mg) 靜脈滴注",
    route: "靜脈滴注 (IV Drip) / 骨內滴注 (IO Drip)",
    interval: "• 院前通常僅給予首劑一次（後續維持劑量 1 g 於入院後連續輸注 8 小時）",
    pediatricSpecial: "• 嚴重出血: 15 - 30 mg/kg (最大劑量 1000 mg) 加入生理食鹽水中，於 10 - 20 分鐘內靜脈滴注。",
    preparation: "• 常見規格為 250 mg/5 mL 或 500 mg/5 mL。取 1 g (如 500 mg 規格兩支共 10 mL) 直接注入 100 mL 生理食鹽水袋中，於 10 分鐘內滴完。",
    precautions: [
      "靜脈推注速度過快可能引發暫時性低血壓。必須控制在 10 分鐘內緩慢滴完，切忌快速推注。",
      "不可與青黴素或輸血成品在同一條管路中混合輸注。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 15,
      mgPerMl: 100,
      maxPediatricDose: 1000
    }
  },
  {
    id: "nitroglycerin",
    nameEn: "Nitroglycerin (NTG)",
    nameZh: "硝化甘油",
    brandName: "Nitrostat",
    category: "vasodilator",
    categoryZh: "血管舒張劑",
    highAlert: false,
    indications: [
      "懷疑心肌梗塞之缺血性心絞痛 (ACS)",
      "急性心因性肺水腫 / 充血性心衰竭伴隨嚴重高血壓者"
    ],
    contraindications: [
      "收縮壓 (SBP) < 90 mmHg，或較基線血壓下降達 30 mmHg 以上",
      "懷疑右心室心肌梗塞（極度依賴前負荷維持心輸出量）",
      "心搏過緩 (< 50 bpm) 或無起搏保護的快速性心搏過速 (> 100 bpm)",
      "24 - 48 小時內曾服用壯陽藥（威而鋼、樂威壯、犀利士，會導致災難性低血壓）"
    ],
    dosage: "• 舌下含片: 0.4 mg\n• 點滴輸注: 5 - 10 mcg/min 起始，依血壓微調",
    route: "舌下含服 (SL) / 靜脈點滴 (IV Drip)",
    interval: "• 舌下含片: 每 3 - 5 分鐘含服一次，單次事件最多 3 次（每次給藥前必須重新測量血壓）",
    pediatricSpecial: "• 兒科院前無使用指引，極少於兒科院前急救中使用。",
    preparation: "• 舌下含片: 原顆置於舌下任其融化吸收，不可吞服或咬碎。\n• 靜脈點滴: 50 mg 加入 250 mL D5W 或 NS 中（濃度為 200 mcg/mL），必須使用專用非 PVC 避光避吸附點滴套與輸液幫浦。",
    precautions: [
      "給藥前必須建立好可靠的靜脈通路，以便低血壓時及時給予輸液補充。",
      "含藥後可能引發劇烈頭痛、面部潮紅及反射性心搏過緩。"
    ],
    calcProps: {
      type: "weight_infusion",
      concentration: "200 mcg/mL (50mg in 250mL)",
      standardDoseMcg: 50000,
      standardVolMl: 250,
      infusionUnit: "mcg/min",
      defaultInfusionRate: 10
    }
  },
  {
    id: "aspirin",
    nameEn: "Aspirin",
    nameZh: "阿斯匹靈",
    brandName: "Bokey",
    category: "antiplatelet",
    categoryZh: "抗血小板聚集劑",
    highAlert: false,
    indications: [
      "疑似急性冠心症 (ACS / STEMI / NSTEMI) 且伴隨缺血性胸痛者"
    ],
    contraindications: [
      "已知對 Aspirin 或 NSAIDs 藥物過敏者（曾誘發嚴重氣喘）",
      "活動性消化道出血或其他活動性出血",
      "懷疑主動脈剝離 (Aortic Dissection)"
    ],
    dosage: "• 常規劑量: 160 mg 至 325 mg",
    route: "口服 (必須要求患者嚼碎後吞服，以利口腔黏膜快速吸收)",
    interval: "單次給藥一次",
    pediatricSpecial: "• 兒科院前無適應症（禁用，避免誘發兒科雷氏症候群 Reye's Syndrome）。",
    preparation: "• 直接口服嚼碎。不可使用腸溶衣錠，否則起效過慢。若只有腸溶片，必須徹底嚼碎。",
    precautions: [
      "即使患者已在長期服用低劑量保栓通或阿斯匹靈，急性發作時仍應給予院前嚼服劑量。",
      "給藥不需考量血壓高低，但需注意氣喘史。"
    ],
    calcProps: {
      type: "fixed_dose",
      standardAdultDose: "160 - 325 mg 嚼服"
    }
  },
  {
    id: "naloxone",
    nameEn: "Naloxone Hydrochloride",
    nameZh: "納洛酮",
    brandName: "Narcan",
    category: "antidote",
    categoryZh: "阿片類藥物特異性拮抗劑 / 解毒劑",
    highAlert: false,
    indications: [
      "懷疑阿片類藥物（嗎啡、海洛因、芬太尼等）中毒引起的呼吸抑制 (RR < 12) 且伴隨意識障礙及針尖樣瞳孔"
    ],
    contraindications: [
      "對 Naloxone 過敏者（若診斷有疑慮，給予通常無害）"
    ],
    dosage: "• 靜脈/肌肉/皮下/鼻腔給藥: 0.4 mg - 2.0 mg\n• 鼻腔吸入 (IN): 2.0 - 4.0 mg",
    route: "靜脈注射 (IV) / 骨內注射 (IO) / 肌肉注射 (IM) / 皮下注射 (SC) / 鼻腔給藥 (IN)",
    interval: "每 2 - 3 分鐘可重複給藥一次，直至呼吸速率與潮氣量恢復正常",
    pediatricSpecial: "• 0.1 mg/kg IV/IO/IM，單次最大 2 mg。若無改善，可每 2-3 分鐘重複一次。",
    preparation: "• 常見規格為 0.4 mg / 1 mL 針劑。靜脈注射可直接推注或以 NS 稀釋至 10 mL 以便微量滴定（避免誘發嚴重的戒斷症狀）。",
    precautions: [
      "對長期藥物成癮者，快速逆轉可能誘發嚴重的「急性戒斷症候群」，表現為極度躁動、口乾、高血壓、反射性心律不整甚至肺水腫，因此建議小劑量滴定給藥至呼吸改善即可。",
      "Naloxone 的半衰期 (約 30-90 分鐘) 常短於所拮抗的毒物，患者可能在清醒一段時間後再次陷入昏迷，必須持續監測。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 0.1,
      mgPerMl: 0.4,
      maxPediatricDose: 2
    }
  },
  {
    id: "glucose",
    nameEn: "Glucose (D50W / D10W)",
    nameZh: "葡萄糖注射液",
    brandName: "D50W / D10W",
    category: "electrolyte",
    categoryZh: "碳水化合物 / 血糖補充劑",
    highAlert: false,
    indications: [
      "確診低血糖症 (血糖值 < 60-70 mg/dL，或現場無法測量血糖但高度懷疑低血糖伴意識障礙者)"
    ],
    contraindications: [
      "血糖正常或高血糖患者",
      "疑似腦中風且血糖值正常者（高血糖會加重腦缺血損傷）"
    ],
    dosage: "• D50W: 20 - 50 mL\n• D10W: 100 - 250 mL",
    route: "靜脈注射 (IV)",
    interval: "給藥後 10 - 15 分鐘重新測量血糖，若仍呈低血糖且意識未恢復，可重複給藥一次",
    pediatricSpecial: "• 兒科首選 D10W，劑量為 2 - 5 mL/kg (0.2-0.5 g/kg) 靜脈滴注。禁用高滲透壓之 D50W 以免破壞兒科細小血管。\n• 新生兒: 僅可使用 D10W，劑量為 2 mL/kg。",
    preparation: "• D50W 通常為 20 mL/支 (10g) 或 50 mL/支。必須確保靜脈管路完全在血管內，否則外漏會造成嚴重皮下組織壞死。\n• 若手邊僅有 D50W 但需用於兒科，可以 1 mL D5W 混合 4 mL 滅菌蒸餾水或 NS 稀釋成 D10W 使用。",
    precautions: [
      "給藥前必須 100% 確認靜脈管路通暢，推注過程中需反覆抽吸確認有回血。",
      "給藥後應在 10-15 分鐘後重新測量血糖，並評估患者意識狀態是否有改善。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 5,
      mgPerMl: 0.1,
      maxPediatricDose: 250
    }
  },
  {
    id: "tramadol",
    nameEn: "Tramadol Hydrochloride",
    nameZh: "曲馬多 / 特美痛",
    brandName: "Tramal",
    category: "analgesic",
    categoryZh: "弱阿片類鎮痛藥 / 中樞止痛劑 (四級管制藥物)",
    highAlert: false,
    indications: [
      "中度至重度急性疼痛（如嚴重創傷、骨折、重度燒燙傷）",
      "無法使用非類古醇消炎止痛藥 (NSAIDs) 或其他止痛藥效果不佳者"
    ],
    contraindications: [
      "已知對 Tramadol 或其他阿片類藥物過敏者",
      "12 歲以下兒童（禁用，代謝變異可能引發致命性呼吸抑制）",
      "急性酒精、安眠藥、鎮痛劑或其他精神藥物中毒者",
      "併用單胺氧化酶抑制劑 (MAOI) 治療中或停藥未滿 14 天者",
      "癲癇未受控制的患者（會降低癲癇發作閾值）"
    ],
    dosage: "• 常規劑量: 50 - 100 mg (以原液深部肌肉注射給藥，單次最大劑量 100 mg，每日最大 400 mg)",
    route: "肌肉注射 (IM，僅限深部肌肉注射)",
    interval: "院前通常僅給予單次劑量一次",
    pediatricSpecial: "• 12 歲以上兒童: 1 - 2 mg/kg IM 肌肉注射，單次最大劑量 100 mg。\n• 12 歲以下兒童: 院前禁用。",
    preparation: "• 常見規格為 100 mg / 2 mL 安瓿。不需稀釋，直接以原液行深部肌肉注射 (IM)。",
    precautions: [
      "本系統協定院前僅限肌肉注射 (IM) 給藥。靜脈注射 (IV) 易引發嚴重的噁心、嘔吐與頭暈，甚至引發短暫低血壓，故本救護常規不予採用。",
      "會降低癲癇發作閾值，對於有癲癇病史、腦部外傷或併用降低癲癇閾值藥物者需極小心。",
      "肌肉注射起效時間 (約 20-30 分鐘) 較靜脈注射慢，需向患者說明並密切監測生命徵象。"
    ],
    calcProps: {
      type: "weight_bolus",
      mgPerMl: 50,
      standardDosePerKg: 1.5,
      doseUnit: "mg/kg",
      maxSingleDose: 100
    }
  }
];

// 將資料庫導出，供網頁 app 使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EMTP_DRUGS;
}
