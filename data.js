/**
 * 高級救護技術員 (EMT-P) 常用急救藥物資料庫
 * 參考來源：台灣緊急醫療救護法規、ACLS 2020 指南、各縣市預立醫療醫囑
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
    mechanism: "作用於 α1, β1, β2 受體，引起血管收縮（提升血壓）、增加心肌收縮力與心跳速率、並舒張支氣管平滑肌。",
    indications: [
      "心肺功能停止 (OHCA/IHCA) 引起的無脈搏電活動 (PEA)、心搏停止 (Asystole)、心室顫動 (VF)、無脈搏心室心搏過速 (pVT)",
      "嚴重過敏性休克 (Anaphylaxis)",
      "伴隨低血壓之嚴重症狀性心搏過緩 (Symptomatic Bradycardia)",
      "嚴重哮喘 (Severe Asthma) 或幼兒急性喉氣管支氣管炎 (Croup)"
    ],
    contraindications: [
      "心肺復甦術 (CPR) 與嚴重過敏性休克現場無絕對禁忌症",
      "對於有自發性心跳 (ROSC) 者，需極度小心控制劑量以防惡性心律不整"
    ],
    adultDosage: "• OHCA: 1 mg (1:10,000 稀釋) IV/IO 靜脈注射，每 3-5 分鐘一次。\n• 過敏性休克: 0.3 - 0.5 mg (1:1,000 原液) IM 肌肉注射。\n• 症狀性心搏過緩/休克輸注: 2 - 10 mcg/min IV/IO 滴注，依血壓調整。",
    pediatricDosage: "• OHCA: 0.01 mg/kg (即 1:10,000 稀釋液 0.1 mL/kg) IV/IO，每 3-5 分鐘一次。\n• 過敏性休克: 0.01 mg/kg (1:1,000 原液) IM，單次最大劑量 0.3 mg。\n• 嚴重哮喘/哮吼霧化吸入: 0.5 mL (1:1,000) 加上 3 mL 生理食鹽水吸入。",
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
      pediatricOhcaDosePerKg: 0.01, // mg/kg
      pediatricOhcaVolPerKg: 0.1, // mL/kg of 1:10000
      infusionUnit: "mcg/min",
      defaultInfusionRate: 5 // mcg/min
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
    mechanism: "延長心肌細胞動作電位期間及不反應期，阻斷鈉、鉀、鈣離子通道，並具有輕微的抗交感神經（α、β受體）阻斷作用。",
    indications: [
      "對 CPR、去顫 (Defibrillation) 及升壓劑無反應的 VF 或無脈搏 VT (pVT)",
      "具有血液動力學穩定性的單型性心室心搏過速 (Stable Monomorphic VT)",
      "控制快速心房顫動 (Afib) / 心房撲動 (Aflutter) 的心室速率"
    ],
    contraindications: [
      "心因性休克 (Cardiogenic Shock)",
      "嚴重竇性心搏過緩 (Severe Sinus Bradycardia)",
      "二度或三度房室傳導阻滯 (AV Block) 且無裝設節律器者"
    ],
    adultDosage: "• OHCA (VF/pVT): 第一劑 300 mg (2支) IV/IO 快速推注；若仍持續，第二劑給予 150 mg IV/IO 推注。\n• 有脈搏的穩定 VT / 頻發性 VPC: 150 mg 加入 100 mL D5W 中，於 10 分鐘內靜脈滴注 (15 mg/min)；後續可維持 1 mg/min 輸注 6 小時。",
    pediatricDosage: "• OHCA (VF/pVT): 5 mg/kg IV/IO 快速推注（單次最大劑量 300 mg），可重複至最大累積劑量 15 mg/kg。\n• 有脈搏的室上性/室性心搏過速: 5 mg/kg 加入 D5W 中，於 20-60 分鐘內靜脈滴注。",
    preparation: "• 快速推注：直接以原液注射或以 D5W 稀釋至 20-30 mL 注射。\n• 滴注：Amiodarone 150 mg (3 mL) 加入 100 mL D5W（注意：稀釋液僅限用 D5W，不可與 NS 混合易產生沉澱）。",
    precautions: [
      "快速注射可能引發嚴重的低血壓及心搏過緩，在有脈搏患者身上必須慢速滴注至少 10 分鐘。",
      "僅能使用 5% 葡萄糖注射液 (D5W) 進行稀釋。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 5, // mg/kg
      mgPerMl: 50, // 150mg/3ml
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
    mechanism: "減慢房室結 (AV Node) 的傳導，中斷房室結折返迴路，能使多數折返型室上性心搏過速 (SVT) 恢復成竇性心律。",
    indications: [
      "治療穩定、窄 QRS 波之陣發性室上性心搏過速 (PSVT)",
      "可用於診斷未明之穩定、寬 QRS 波單型性心搏過速 (可能為 SVT 伴隨傳導偏差)"
    ],
    contraindications: [
      "二度或三度房室傳導阻滯 (AV Block) 或病竇症候群 (SSS) 且無節律器者",
      "支氣管哮喘 (Asthma) 或嚴重慢性阻塞性肺病 (COPD)（可能引發嚴重支氣管收縮）",
      "不規則的寬 QRS 波心搏過速（可能為 Afib 伴預激綜合症 WPW，給予 Adenosine 可能導致 VF）"
    ],
    adultDosage: "• 第一劑: 6 mg IV 快速推注（1-2 秒內），並立即使用 20 mL 生理食鹽水快速沖洗 (Flush)。\n• 第二劑: 若 1-2 分鐘內未轉復，給予 12 mg IV 快速推注，同樣伴隨快速沖洗。\n• 註：若患者裝置有中心靜脈導管，首劑減至 3 mg。",
    pediatricDosage: "• 第一劑: 0.1 mg/kg IV 快速推注（最大劑量 6 mg），隨即快速沖洗。\n• 第二劑: 若未轉復，給予 0.2 mg/kg IV 快速推注（最大劑量 12 mg）。",
    preparation: "• 原液直接快速推注，給藥時必須選擇「最靠近心臟之近端靜脈管路」，並使用雙向三路接頭 (Three-way stopcock) 聯動生理食鹽水沖洗。",
    precautions: [
      "半衰期極短（少於 10 秒），故必須極快速推注與沖水，否則無效。",
      "給藥後心電圖可能出現短暫的心搏停止 (Asystole，通常持續數秒) 或 VPC，應先向患者解釋可能會有一時的胸悶、瀕死感。",
      "服用 Theophylline 者劑量需增加；服用 Dipyridamole 或 Tegretol 者，首劑需減半。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricFirstDosePerKg: 0.1, // mg/kg
      pediatricSecondDosePerKg: 0.2,
      mgPerMl: 3, // 6mg/2ml
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
    mechanism: "阻斷副交感神經的 M 膽鹼受體，解除迷走神經對心臟的抑制作用，從而使心跳加快，並減少腺體分泌與鬆弛平滑肌。",
    indications: [
      "有血液動力學症狀的心搏過緩 (Symptomatic Bradycardia)",
      "有機磷農藥 (Organophosphate) 或神經毒氣中毒之解毒治療（需大劑量）"
    ],
    contraindications: [
      "心肺復甦時無絕對禁忌。",
      "對二度二度 (Mobitz II) 或三度房室阻滯伴隨寬 QRS 波患者無效，甚至可能因加速心房率而惡化房室阻滯（此時應直接使用 Pacing 或 Dopamine）。"
    ],
    adultDosage: "• 症狀性心搏過緩: 1 mg IV/IO，每 3-5 分鐘一次，最大總劑量為 3 mg。\n• 有機磷中毒: 2 - 5 mg IV，每 3-5 分鐘重複，直到達成「阿托平化」（氣管分泌物變乾、囉音消失、瞳孔散大、心率 > 80 bpm）。",
    pediatricDosage: "• 兒科心搏過緩: 0.02 mg/kg IV/IO（單次最低劑量 0.1 mg，最大單次劑量：兒童 0.5 mg、青少年 1 mg），總最大量：兒童 1 mg、青少年 2 mg。",
    preparation: "• 原液直接 IV 推注。成人規格通常為 1 mL 裝 (1 mg/mL 或 0.5 mg/mL)。",
    precautions: [
      "靜脈注射劑量若小於 0.5 mg（成人）或 0.1 mg（兒童），可能引發反射性心搏過緩（中樞性迷走刺激效果）。",
      "新生兒心搏過緩主要因缺氧引起，首要治療為氧氣與通氣治療，非 Atropine。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 0.02, // mg/kg
      minPediatricDose: 0.1,
      maxPediatricDose: 0.5,
      mgPerMl: 1 // 通常 1mg/ml
    }
  },
  {
    id: "dopamine",
    nameEn: "Dopamine",
    nameZh: "多巴胺",
    brandName: "Intropin",
    category: "vasopressor",
    categoryZh: "交感神經興奮劑 / 升壓劑",
    highAlert: true,
    mechanism: "依劑量產生不同效果：\n- 中劑量 (2-10 mcg/kg/min): 主要刺激 β1 受體，增加心肌收縮力與心輸出量。\n- 高劑量 (>10 mcg/kg/min): 刺激 α1 受體，造成全身血管收縮，提升血壓。",
    indications: [
      "有症狀的心搏過緩且對 Atropine 無反應者（第二線治療）",
      "心因性、敗血性或分配性休克導致之低血壓（收縮壓 70-100 mmHg 且伴隨休克徵象）"
    ],
    contraindications: [
      "嗜鉻細胞瘤 (Pheochromocytoma)",
      "未經糾正的快速性心律不整（如 Afib RVR、VT）",
      "低血容量性休克（應首要補充輸液而非使用升壓劑）"
    ],
    adultDosage: "• 2 - 20 mcg/kg/min IV/IO 靜脈滴注，起始劑量通常為 2-5 mcg/kg/min，根據血壓及臨床反應每 5-10 分鐘調整滴速。",
    pediatricDosage: "• 同成人：2 - 20 mcg/kg/min IV/IO 靜脈滴注，依效果調整。",
    preparation: "• 標準配製: Dopamine 200 mg (通常為 5 mL 裝一支) 加入 250 mL 生理食鹽水或 D5W 中，配製成濃度為 800 mcg/mL 的溶液。",
    precautions: [
      "必須使用點滴控制幫浦或精密輸液套給藥，防範劑量誤差。",
      "局部外漏會引起嚴重組織壞死與壞疽；若發生外漏，可用 Regitine 稀釋液局部浸潤注射解毒。"
    ],
    calcProps: {
      type: "weight_infusion",
      concentration: "800 mcg/mL (200mg in 250mL)",
      standardDoseMcg: 200000,
      standardVolMl: 250,
      infusionUnit: "mcg/kg/min",
      defaultInfusionRate: 5 // mcg/kg/min
    }
  },
  {
    id: "fentanyl",
    nameEn: "Fentanyl Citrate",
    nameZh: "芬太尼",
    brandName: "Sublimaze",
    category: "analgesic",
    categoryZh: "合成阿片類鎮痛藥 (二級管制藥物)",
    highAlert: true,
    mechanism: "強效阿片受體 (μ-opioid) 興奮劑，其止痛效力約為嗎啡的 50-100 倍，具有極佳的脂溶性，起效迅速且對心血管系統影響較嗎啡小（較少引起低血壓）。",
    indications: [
      "中度至重度急性疼痛控制（如創傷性骨折、嚴重燒燙傷）",
      "急性心肌梗塞 (AMI) 劇烈胸痛且對 NTG 無效者",
      "插管時之誘導鎮痛與鎮靜配合"
    ],
    contraindications: [
      "呼吸抑制 (Respiratory Depression) 且無人工通氣支持者",
      "重度腦部外傷或顱內壓增高 (ICP) 且未建立呼吸器控制者",
      "已知對 Fentanyl 過敏者"
    ],
    adultDosage: "• 止痛: 1 - 2 mcg/kg slow IV/IO/IN（通常單次給予 50 - 100 mcg），於 1-2 分鐘內慢速推注，必要時每 5-10 分鐘可重複，單次上限 100 mcg。",
    pediatricDosage: "• 止痛: 1 - 2 mcg/kg slow IV/IO/IN，必要時可重複，需嚴密監控呼吸。",
    preparation: "• 原液通常為 100 mcg / 2 mL (即 50 mcg/mL)。可直接原液慢速推注，或以 NS 稀釋至 10 mL 慢速給予。",
    precautions: [
      "注射速度過快可能引發「胸壁僵硬 (Chest wall rigidity)」，導致無法換氣，需用插管/肌鬆劑或 Naloxone 緩解。",
      "隨時準備好 BVM（甦醒球）與 Naloxone 隨侍在側，以防突發性呼吸暫停。"
    ],
    calcProps: {
      type: "weight_bolus",
      mgPerMl: 0.05, // 50 mcg/ml = 0.05 mg/ml
      standardDosePerKg: 1.5, // mcg/kg
      doseUnit: "mcg/kg",
      maxSingleDose: 100 // mcg
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
    mechanism: "結合並活化中樞神經系統的 GABA-A 受體，增加氯離子通道開放，導致神經細胞超極化，產生強效的鎮靜、抗驚厥、肌肉鬆弛及順行性遺忘效果。",
    indications: [
      "持續性癲癇重積狀態 (Status Epilepticus)",
      "進行氣管插管、心臟電擊轉復 (Cardioversion) 或 pacing 前之鎮靜保護",
      "躁動患者之保護性約束配合鎮靜"
    ],
    contraindications: [
      "嚴重低血壓或休克狀態（除非已建立人工氣道並控制血流動力）",
      "急性狹角性青光眼",
      "已知對 Benzodiazepines 過敏者"
    ],
    adultDosage: "• 癲癇發作: 2.5 - 5 mg slow IV/IO (經 2 分鐘推注)；或 5 - 10 mg IM 肌肉注射或 IN 鼻腔給藥，必要時 10 分鐘後重複。\n• 行動前鎮靜: 1 - 2.5 mg slow IV 緩慢滴定。",
    pediatricDosage: "• 癲癇發作: 0.1 - 0.2 mg/kg IM/IN（最大單次 5 mg）或 0.1 mg/kg slow IV/IO（最大單次 2-4 mg）。",
    preparation: "• 常見規格為 5 mg / 1 mL 或 15 mg / 3 mL。靜脈注射建議稀釋（如 5 mg 稀釋至 5 mL 或 10 mL）以便微量滴定。",
    precautions: [
      "對老年人或合併使用嗎啡/芬太尼者，呼吸抑制與低血壓的風險會成倍增加，劑量需減半並極緩慢注射。",
      "解毒劑為 Flumazenil (Anexate)。"
    ],
    calcProps: {
      type: "weight_bolus",
      mgPerMl: 5, // 5mg/ml
      standardDosePerKg: 0.1, // mg/kg
      doseUnit: "mg/kg",
      maxSingleDose: 5 // mg
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
    mechanism: "競爭性阻斷纖維蛋白溶酶原上的離胺酸結合部位，防止纖維蛋白溶酶活化，進而抑制纖維蛋白分解，穩定血栓以達止血效果。",
    indications: [
      "嚴重創傷且伴有顯著出血、出血性休克（收縮壓 < 90 mmHg 或心率 > 110 bpm）且受傷時間在 3 小時內者",
      "產後大出血 (PPH) 且呈進行性出血者"
    ],
    contraindications: [
      "受傷時間已超過 3 小時（研究顯示受傷超過 3 小時後給予 TXA 會增加死亡率）",
      "活動性血栓栓塞性疾病（如 DVT、PE、腦梗塞）"
    ],
    adultDosage: "• 首劑: 1 g (1000 mg) 加入 100 mL NS 或 D5W 中，於 10 分鐘內靜脈滴注。後續於醫院內繼續以 1 g 放入 250 mL 點滴中輸注 8 小時。",
    pediatricDosage: "• 嚴重出血: 15 - 30 mg/kg (最大劑量 1000 mg) 加入 NS 中，於 10-20 分鐘內靜脈滴注。",
    preparation: "• 常見規格為 250 mg/5 mL 或 500 mg/5 mL。取 1 g (如 500 mg 規格兩支共 10 mL) 直接注入 100 mL 生理食鹽水袋中滴注。",
    precautions: [
      "靜脈推注速度過快可能引發暫時性低血壓。必須控制在 10 分鐘內緩慢滴完，切忌快速推注。",
      "不可與青黴素或輸血成品在同一條管路中混合輸注。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 15, // mg/kg
      mgPerMl: 100, // 500mg/5ml = 100mg/ml
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
    mechanism: "鬆弛血管平滑肌（主要擴張靜脈，高劑量時亦擴張動脈），減少回心血量（降低前負荷）及心臟後負荷，減少心肌耗氧量，並擴張冠狀動脈提升心肌血流。",
    indications: [
      "懷疑心肌梗塞之缺血性胸痛 (Ischemic Chest Pain / ACS)",
      "急性心因性肺水腫 / 充血性心衰竭 (CHF) 伴隨高血壓者"
    ],
    contraindications: [
      "收縮壓 (SBP) < 90 mmHg，或較基線血壓下降超過 30 mmHg",
      "右心室梗塞 (Right Ventricular Infarction)（此類患者極度依賴前負荷維持心輸出量）",
      "心搏過緩 (< 50 bpm) 或無起搏保護的快速性心搏過速 (> 100 bpm)",
      "24 小時內曾服用 Sildenafil (Viagra)、Vardenafil (Levitra)，或 48 小時內曾服用 Tadalafil (Cialis)（會導致災難性低血壓）"
    ],
    adultDosage: "• 舌下含片 (SL): 0.4 mg 舌下含服，每 3-5 分鐘一次，最多 3 次。每次給藥前必須重新測量血壓。\n• 靜脈點滴: 5 - 10 mcg/min 起始，每 3-5 分鐘增加 5-10 mcg/min，直至症狀緩解或血壓達標。",
    pediatricDosage: "• 兒科極少於院前使用。滴注劑量通常為 0.25 - 5 mcg/kg/min，不推薦院前給予舌下含片。",
    preparation: "• 舌下含片: 原顆置於舌下任其融化吸收，不可吞服或咬碎。\n• 靜脈點滴: 50 mg 加入 250 mL D5W 或 NS 中（濃度為 200 mcg/mL），必須使用專用非 PVC 避光避吸附點滴套與輸液幫浦。",
    precautions: [
      "給藥前必須建立好可靠的靜脈通路，以便低血壓時及時給予輸液補充。",
      "含藥後可能引發劇烈頭痛、面部潮紅及反射性心搏過速。"
    ],
    calcProps: {
      type: "weight_infusion",
      concentration: "200 mcg/mL (50mg in 250mL)",
      standardDoseMcg: 50000,
      standardVolMl: 250,
      infusionUnit: "mcg/min",
      defaultInfusionRate: 10 // mcg/min
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
    mechanism: "不可逆地抑制血小板的環氧化酶-1 (COX-1)，進而抑制血栓素 A2 (TXA2) 的合成，阻止血小板聚集，預防已形成的冠狀動脈血栓進一步擴大。",
    indications: [
      "新發作胸痛、心電圖呈現疑似急性冠心症 (ACS / STEMI / NSTEMI) 症狀的患者"
    ],
    contraindications: [
      "已知對 Aspirin 或 NSAIDs 過敏（誘發嚴重氣喘）",
      "活動性消化道出血或其他嚴重的急性內出血",
      "懷疑主動脈剝離 (Aortic Dissection)"
    ],
    adultDosage: "• 160 mg 至 325 mg 口服。為了使藥物最快由口腔黏膜吸收，必須要求患者「嚼碎後吞服」（Chew and swallow），院前常用規格為 100 mg &times; 3 顆 或 300 mg &times; 1 顆。",
    pediatricDosage: "• 兒科院前急救無適應症（可能引發雷氏症候群 Reye's Syndrome）。",
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
    mechanism: "競爭性拮抗中樞與周邊的 μ, κ, δ 阿片受體，能完全逆轉阿片類物質（如海洛因、嗎啡、芬太尼、可待因）所致的呼吸抑制、鎮靜與低血壓。",
    indications: [
      "懷疑阿片類藥物過量中毒，表現為呼吸抑制（呼吸速率 < 12 次/分）、意識障礙、且瞳孔呈針尖樣 (Pinpoint Pupils)"
    ],
    contraindications: [
      "對 Naloxone 過敏者。無其他絕對禁忌，若診斷有疑慮，給予 Naloxone 通常無害。"
    ],
    adultDosage: "• 0.4 mg - 2.0 mg IV/IO/IM/SC 或鼻腔吸入 (IN)。每 2-3 分鐘可重複給藥一次，直至呼吸恢復正常（目標是恢復自主呼吸而非完全清醒）。\n• 鼻腔給藥 (IN): 2.0 - 4.0 mg（使用專用霧化噴頭，每側鼻孔 1-2 mL）。",
    pediatricDosage: "• 0.1 mg/kg IV/IO/IM，單次最大 2 mg。若無改善，可每 2-3 分鐘重複一次。",
    preparation: "• 常見規格為 0.4 mg / 1 mL 針劑。靜脈注射可直接推注或以 NS 稀釋至 10 mL 以便微量滴定（避免誘發嚴重的戒斷症狀）。",
    precautions: [
      "對長期藥物成癮者，快速逆轉可能誘發嚴重的「急性戒斷症候群」，表現為極度躁動、嘔吐、高血壓、反射性心律不整甚至肺水腫，因此建議小劑量滴定給藥至呼吸改善即可。",
      "Naloxone 的半衰期 (約 30-90 分鐘) 常短於所拮抗的毒物，患者可能在清醒一段時間後再次陷入昏迷，必須持續監測。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 0.1, // mg/kg
      mgPerMl: 0.4,
      maxPediatricDose: 2
    }
  },
  {
    id: "sodium_bicarb",
    nameEn: "Sodium Bicarbonate 8.4%",
    nameZh: "碳酸氫鈉 / 重碳酸鈉",
    brandName: "NaHCO3 (Bicarbon)",
    category: "electrolyte",
    categoryZh: "鹼化劑 / 電解質溶液",
    highAlert: false,
    mechanism: "提供重碳酸根離子 (HCO3-)，直接中和血液中的氫離子，提升 pH 值。在三環抗憂鬱劑 (TCA) 中毒時，能增加血清鈉濃度並鹼化血液，防止心肌鈉通道阻斷引發的致命心律不整。",
    indications: [
      "已知或強烈懷疑高鉀血症 (Hyperkalemia) 引起之嚴重症狀或心電圖改變",
      "三環抗憂鬱劑 (TCA) 或阿斯匹靈過量中毒伴隨 QRS 增寬 (> 120 ms) 或心律不整",
      "長時間心跳停止 (OHCA > 15-20 分鐘) 且有良好通氣支持下的嚴重代謝性酸中毒"
    ],
    contraindications: [
      "嚴重的吸入性或呼吸性酸中毒（因 NaHCO3 反應後會產生 CO2，若無法有效排出將加重細胞內酸中毒）",
      "低鉀血症 (Hypokalemia)（鹼化會使鉀離子進一步移入細胞內）"
    ],
    adultDosage: "• 1 mEq/kg IV/IO 緩慢推注（通常首劑給予 50 mL，即 1 支或 1 瓶 8.4% 溶液），可根據動脈血氣分析 (ABG) 或臨床反應重複給予半劑量。",
    pediatricDosage: "• 1 mEq/kg IV/IO 緩慢推注。注意：對於新生兒或嬰兒，必須使用 4.2% 的稀釋液（以等量 sterile water 或 D5W 稀釋 8.4% 原液），以防高滲透壓導致顱內出血。",
    preparation: "• 台灣臨床最常見為 8.4% 規格（1 mEq/mL，通常是 50 mL 瓶裝）。直接靜脈注射，不可稀釋於酸性點滴中。",
    precautions: [
      "給藥後必須用生理食鹽水徹底沖洗管路，再給予其他藥物（特別是 Calcium, Epinephrine, Dopamine），否則會形成碳酸鈣沉澱或使藥物失效。",
      "極度高滲透壓，若漏出靜脈會造成嚴重的組織壞死。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 1, // mEq/kg
      mgPerMl: 1, // 1 mEq/mL
      maxPediatricDose: 50
    }
  },
  {
    id: "calcium_chloride",
    nameEn: "Calcium Chloride 10%",
    nameZh: "氯化鈣",
    brandName: "Calcium Chloride",
    category: "electrolyte",
    categoryZh: "電解質 / 鈣鹽",
    highAlert: true,
    mechanism: "提供鈣離子，穩定心肌細胞膜以對抗高鉀血症引起的心臟毒性；增加心肌收縮力；並作為鈣離子通道阻斷劑中毒的解毒劑。",
    indications: [
      "高鉀血症 (Hyperkalemia) 伴隨心電圖異常（如高尖 T 波、QRS 寬大、竇性正弦波）",
      "低鈣血症 (Hypocalcemia)",
      "鈣離子通道阻斷劑 (CCB) 中毒引起的休克或心搏過緩"
    ],
    contraindications: [
      "洋地黃 (Digoxin) 中毒者（鈣離子可能促發嚴重的洋地黃引發致命性心律不整，「石頭心」效應）",
      "高鈣血症"
    ],
    adultDosage: "• 500 - 1000 mg (即 10% 溶液 5 - 10 mL) slow IV/IO，於 2-5 分鐘內慢速推注。必要時 10-20 分鐘後可重複一次。",
    pediatricDosage: "• 20 mg/kg (0.2 mL/kg of 10% 溶液) slow IV/IO，單次最大劑量 1000 mg，緩慢推注。",
    preparation: "• 10% Calcium Chloride 針劑 (10 mL 裝含 1 g 氯化鈣)。必須經由粗大靜脈緩慢推注，且確認回血良好。",
    precautions: [
      "不可與 NaHCO3 同管注射，會產生沉澱。",
      "注射速度過快會引發發熱感、血壓驟降、心搏過緩甚至心跳停止。",
      "外漏會造成極嚴重的化學性灼傷與組織壞死，一旦外漏應立即停藥並局部冰敷。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 20, // mg/kg
      mgPerMl: 100, // 1g/10ml = 100mg/ml
      maxPediatricDose: 1000
    }
  },
  {
    id: "magnesium_sulfate",
    nameEn: "Magnesium Sulfate",
    nameZh: "硫酸鎂",
    brandName: "Magnesium Sulfate",
    category: "electrolyte",
    categoryZh: "電解質 / 抗驚厥劑",
    highAlert: true,
    mechanism: "生理性鈣離子拮抗劑，能穩定細胞膜，抑制中樞神經系統並降低運動終板對乙醯膽鹼的敏感度；也是心肌鈉/鉀幫浦的重要輔因子，能有效終止尖端扭轉型室速 (TdP)。",
    indications: [
      "心肺停止伴隨尖端扭轉型心室心搏過速 (Torsades de Pointes / TdP)",
      "有脈搏之穩定 TdP 伴隨 QT 延長者",
      "重度子癇症 (Severe Pre-eclampsia) 或子癇症 (Eclampsia) 的抽搐預防與控制",
      "吸入性支氣管擴張劑無效之嚴重急性哮喘 (Severe Asthma)"
    ],
    contraindications: [
      "心臟傳導阻滯 (Heart Block)",
      "心肌無力症 (Myasthenia Gravis)",
      "嚴重腎功能衰竭（可能蓄積導致高鎂血症）"
    ],
    adultDosage: "• OHCA (TdP): 1 - 2 g IV/IO 快速推注（以 10 mL NS 稀釋，1-2 分鐘內推完）。\n• 有脈搏的 TdP/哮喘: 1 - 2 g 稀釋於 50-100 mL D5W 或 NS 中，於 5-20 分鐘內靜脈滴注。\n• 子癇症抽搐: 4 - 6 g 稀釋於 100 mL NS 中，於 15-20 分鐘內靜脈滴注，隨後以 1-2 g/hr 維持滴注。",
    pediatricDosage: "• TdP 或嚴重氣喘: 25 - 50 mg/kg (單次最大 2 g) 稀釋於 D5W 或 NS 中，於 10-20 分鐘內靜脈滴注（OHCA 時可較快推注）。",
    preparation: "• 常見規格為 10% (1g/10mL) 或 50% (10g/20mL 等)。靜脈給藥必須予以適當稀釋（一般不大於 20% 濃度，滴注稀釋至 1-2% 尤佳）。",
    precautions: [
      "快速注射可能引發顯著的低血壓、潮紅、呼吸抑制與深腱反射消失。",
      "若發生過量中毒（表現為腱反射消失、呼吸減慢），解毒劑為 10% Calcium Gluconate 或 Calcium Chloride 10 mL IV 緩慢推注。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 25, // mg/kg
      mgPerMl: 100, // 10% is 100mg/ml
      maxPediatricDose: 2000
    }
  },
  {
    id: "ketamine",
    nameEn: "Ketamine Hydrochloride",
    nameZh: "凱他敏 / 氯胺酮",
    brandName: "Ketanest / Ketalar",
    category: "anesthetic",
    categoryZh: "分離性麻醉劑 / 鎮痛劑 (三級管制藥物)",
    highAlert: true,
    mechanism: "阻斷中樞 N-甲基-D-天門冬胺酸 (NMDA) 受體，選擇性阻斷大腦聯絡通路，產生「分離性麻醉」效果。具有交感神經興奮作用（使血壓、心率上升）並能顯著舒張支氣管平滑肌。",
    indications: [
      "困難插管 (RSI / DSI) 前的麻醉誘導劑（特別適用於伴隨氣喘或低血壓患者）",
      "嚴重急性躁動或譫妄患者之保護性鎮靜",
      "重度創傷之院前急性疼痛控制（亞麻醉劑量）"
    ],
    contraindications: [
      "嚴重高血壓或主動脈剝離（因刺激交感可能惡化病情）",
      "已知對 Ketamine 過敏者"
    ],
    adultDosage: "• 麻醉誘導/插管: 1 - 2 mg/kg IV/IO 緩慢推注（約 60 秒內），或 4 - 5 mg/kg IM 肌肉注射。\n• 躁動鎮靜: 4 mg/kg IM 肌肉注射，或 1-2 mg/kg IV 緩慢推注。\n• 院前止痛: 0.1 - 0.3 mg/kg IV/IO 慢速推注，每 10-15 分鐘可重複。",
    pediatricDosage: "• 麻醉誘導: 1 - 2 mg/kg IV 慢速推注，或 4 - 5 mg/kg IM。\n• 止痛: 0.1 - 0.2 mg/kg IV 慢速推注。",
    preparation: "• 常見規格為 500 mg / 10 mL (50 mg/mL)。止痛時建議以 NS 稀釋（如取 1 mL 稀釋至 10 mL，濃度變為 5 mg/mL），以便微量緩慢推注。",
    precautions: [
      "快速推注可能導致暫時性呼吸暫停或喉痙攣 (Laryngospasm)，必須準備好氣道管理設備。",
      "麻醉復甦期可能出現幻覺、惡夢及躁動（「復甦期譫妄」），成人可給予微量 Midazolam 預防。"
    ],
    calcProps: {
      type: "weight_bolus",
      mgPerMl: 50, // 50mg/ml
      standardDosePerKg: 1.5, // mg/kg for induction
      doseUnit: "mg/kg",
      maxSingleDose: 150 // mg
    }
  },
  {
    id: "lidocaine",
    nameEn: "Lidocaine Hydrochloride",
    nameZh: "利多卡因",
    brandName: "Xylocaine 2%",
    category: "antiarrhythmic",
    categoryZh: "抗心律不整藥物 (Class Ib) / 局部麻醉劑",
    highAlert: true,
    mechanism: "阻斷心肌細胞活化狀態的鈉通道，縮短動作電位期間，提高心室顫動閾值，主要抑制心室異位節律與自動能，對心房影響極小。",
    indications: [
      "Amiodarone 無法取得或禁忌時，用於心肺復甦（CPR）對去顫無反應之 VF/pVT（Amiodarone 替代藥物）",
      "ROSC 後，用於預防 VF/pVT 復發的維持滴注（若先前 OHCA 時使用 Lidocaine 轉復成功）",
      "骨內針 (IO) 置入引起的局部骨髓腔劇痛控制"
    ],
    contraindications: [
      "二度二度或三度房室傳導阻滯 (AV Block)",
      "病竇症候群 (SSS)",
      "已知對醯胺類 (Amide) 局部麻醉藥過敏者"
    ],
    adultDosage: "• OHCA (VF/pVT): 第一劑 1.0 - 1.5 mg/kg IV/IO 快速推注；若仍持續，每 5-10 分鐘可給予 0.5 - 0.75 mg/kg，最大總劑量 3.0 mg/kg。\n• ROSC 維持點滴: 1 - 4 mg/min (15-60 mcg/kg/min) 靜脈滴注。\n• IO 止痛: 20 - 40 mg (1-2 mL of 2% 溶液) 緩慢注入 IO 腔內，留置 60 秒後再推注點滴。",
    pediatricDosage: "• OHCA: 1 mg/kg IV/IO 快速推注（最大單次 100 mg），隨後可滴注 20 - 50 mcg/kg/min 維持。\n• IO 止痛: 0.5 mg/kg (最大 40 mg) 緩慢注入骨內腔。",
    preparation: "• 院前常備為 2% 規格 (20 mg/mL)。\n• 維持點滴: 1 g 放入 250 mL NS 或 D5W 中，濃度為 4 mg/mL。",
    precautions: [
      "過量給藥會引發「利多卡因毒性反應」，首要影響中樞神經系統：口舌麻木、頭暈、肌肉顫動、癲癇發作，嚴重者導致心搏過緩、低血壓及心跳停止。",
      "老年人或心衰竭、肝功能不全者，維持滴注劑量需減半。"
    ],
    calcProps: {
      type: "weight_infusion_and_pediatric",
      concentration: "4 mg/mL (1g in 250mL)",
      standardDoseMcg: 1000000,
      standardVolMl: 250,
      pediatricOhcaDosePerKg: 1, // mg/kg
      mgPerMl: 20, // 2% 20mg/ml
      infusionUnit: "mcg/kg/min",
      defaultInfusionRate: 30 // mcg/kg/min
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
    mechanism: "直接提供葡萄糖分子，迅速提升血液中的葡萄糖濃度，恢復大腦及周邊組織細胞的能量代謝。",
    indications: [
      "確診低血糖症 (血糖值 < 60-70 mg/dL，或無血糖機但高度懷疑低血糖且有意識障礙者)"
    ],
    contraindications: [
      "血糖正常或高血糖患者",
      "疑似腦中風 (Stroke) 且血糖正常者（高血糖會加重缺血性腦損傷）"
    ],
    adultDosage: "• D50W: 20 - 50 mL (10 - 25 g) IV 靜脈推注。\n• D10W: 100 - 250 mL IV 靜脈滴注（適合老年人或管路管徑細小者，降低靜脈炎風險）。",
    pediatricDosage: "• 兒科首選 D10W（2-5 mL/kg，即 0.2-0.5 g/kg）IV 靜脈滴注。避免使用 D50W。\n• 新生兒: 僅可使用 D10W 2 mL/kg (0.2 g/kg) IV。",
    preparation: "• D50W 通常為 20 mL/支 (10g) 或 50 mL/支。必須確保靜脈管路完全在血管內，否則外漏會造成嚴重皮下組織壞死。\n• 若手邊僅有 D50W 但需用於兒科，可以 1 mL D5W 混合 4 mL 滅菌蒸餾水或 NS 稀釋成 D10W 使用。",
    precautions: [
      "給藥前必須 100% 確認靜脈管路通暢，推注過程中需反覆抽吸確認有回血。",
      "給藥後應在 10-15 分鐘後重新測量血糖，並評估患者意識狀態是否有改善。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 5, // mL/kg of D10W
      mgPerMl: 0.1, // D10W is 100mg/ml
      maxPediatricDose: 250 // mL of D10W
    }
  },
  {
    id: "methylprednisolone",
    nameEn: "Methylprednisolone",
    nameZh: "甲強龍 / 類固醇",
    brandName: "Solu-Medrol",
    category: "corticosteroid",
    categoryZh: "糖皮質激素 / 抗發炎抗過敏劑",
    highAlert: false,
    mechanism: "強效合成糖皮質激素，具有極強的抗發炎、免疫抑制及抗過敏作用。能穩定細胞膜，減少發炎介質釋放，降低微血管通透性，並增加支氣管平滑肌對 β2 受體興奮劑的敏感度。",
    indications: [
      "重度過敏性休克 (Anaphylaxis) 的後續防範（防止遲發性雙相反應）",
      "對吸入性支氣管擴張劑反應不佳的急性重度哮喘 (Severe Asthma) 或慢性阻塞性肺病急性發作 (COPD Exacerbation)"
    ],
    contraindications: [
      "院前急救單次使用無絕對禁忌。",
      "全身性黴菌感染或已知對類固醇過敏者。"
    ],
    adultDosage: "• 通常給予 125 mg IV/IO 靜脈推注（緩慢推注大於 3-5 分鐘）。",
    pediatricDosage: "• 2 mg/kg IV/IO 緩慢推注（最大劑量 125 mg）。",
    preparation: "• 標準規格為 Act-O-Vial 雙腔瓶。按下頂部活塞將溶劑壓入粉劑腔內，搖勻溶解後抽取使用。",
    precautions: [
      "起效需 1-2 小時，因此在急性過敏性休克中絕對不能替代 Epinephrine 的首線地位。",
      "大劑量快速推注可能引發短暫的會陰部灼熱感或心律不整。"
    ],
    calcProps: {
      type: "pediatric_only",
      pediatricOhcaDosePerKg: 2, // mg/kg
      mgPerMl: 62.5, // 125mg/2ml
      maxPediatricDose: 125
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
    mechanism: "具備雙重機轉：(1) 弱 μ-阿片受體興奮劑，(2) 抑制中樞神經元對血清素 (5-HT) 與去甲腎上腺素 (NE) 的再回收，增強下行抑制性疼痛路徑。",
    indications: [
      "中度至重度急性疼痛（如創傷、骨折、重度燒燙傷）",
      "無法使用非類固醇消炎止痛藥 (NSAIDs) 或其他止痛藥效果不佳者"
    ],
    contraindications: [
      "已知對 Tramadol 或其他阿片類藥物過敏者",
      "12 歲以下兒童（禁用，代謝變異可能引發致命性呼吸抑制）",
      "急性酒精、安眠藥、鎮痛劑或其他精神藥物中毒者",
      "併用單胺氧化酶抑制劑 (MAOI) 治療中或停藥未滿 14 天者（易引發血清素症候群）",
      "癲癇未受控制的患者（會降低癲癇發作閾值）"
    ],
    adultDosage: "• 常規劑量: 50 - 100 mg IM (深部肌肉注射)。單次最大劑量 100 mg，每日最大劑量 400 mg。",
    pediatricDosage: "• 12 歲以上兒童: 1 - 2 mg/kg IM (肌肉注射)，單次最大劑量 100 mg。\n• 12 歲以下兒童: 院前禁用。",
    preparation: "• 常見規格為 100 mg / 2 mL 安瓿。不需稀釋，直接以原液行深部肌肉注射 (IM)。",
    precautions: [
      "本系統協定院前僅限肌肉注射 (IM) 給藥。靜脈注射 (IV) 易引發嚴重的噁心、嘔吐與頭暈，甚至引發短暫低血壓，故本救護常規不予採用。",
      "會降低癲癇發作閾值，對於有癲癇病史、腦部外傷或併用降低癲癇閾值藥物者需極小心。",
      "肌肉注射起效時間 (約 20-30 分鐘) 較靜脈注射慢，需向患者說明並密切監測生命徵象。"
    ],
    calcProps: {
      type: "weight_bolus",
      mgPerMl: 50, // 100mg/2ml = 50mg/ml
      standardDosePerKg: 1.5, // mg/kg
      doseUnit: "mg/kg",
      maxSingleDose: 100 // mg
    }
  }
];

// 將資料庫導出，供網頁 app 使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EMTP_DRUGS;
}
