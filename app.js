/**
 * EMT-P 緊急藥物電子書與計算工具 - 主邏輯應用程式
 */

const app = {
  // 狀態管理
  state: {
    currentSection: "ebook-section",
    activeCategory: "all",
    bookmarks: [],
    notes: {},
    calcMode: "adult", // adult | pediatric
    selectedCalcDrug: null,
    quiz: {
      active: false,
      questions: [],
      currentIndex: 0,
      score: 0,
      selectedAnswerIndex: null
    },
    wizard: {
      protocolId: "anaphylaxis",
      currentStepIndex: 0,
      history: []
    }
  },

  // 靜態測驗問題庫 (共 10 題，全數與 11 種保留藥物對齊)
  quizPool: [
    {
      question: "下列何者為 Epinephrine (腎上腺素) 的主要藥理機轉？",
      options: [
        "主要作用於 α1, β1, β2 受體，收縮血管、增強心肌收縮力並舒張支氣管",
        "選擇性阻斷鈉離子通道，延長動作電位時間",
        "阻斷副交感神經 M 膽鹼受體，解除迷走神經對心臟的抑制",
        "特異性拮抗阿片樣受體，逆轉呼吸抑制"
      ],
      correctIndex: 0,
      explanation: "Epinephrine 是非選擇性的腎上腺素受體激動劑，作用於 α1 (血管收縮)、β1 (強心) 及 β2 (支氣管擴張) 受體，是 OHCA 及過敏性休克的第一線急救藥。"
    },
    {
      question: "對於 OHCA (心肺功能停止) 的 VF/pVT 頑固性心律，Amiodarone 的首劑建議劑量為何？",
      options: [
        "150 mg IV Push",
        "300 mg IV Push",
        "1 mg IV Push",
        "150 mg 稀釋於 100 mL D5W 中慢速滴注 10 分鐘"
      ],
      correctIndex: 1,
      explanation: "在 ACLS 致命心律 (VF/pVT) 演算法中，Amiodarone 用於去顫與升壓藥無效後，首劑為 300 mg IV/IO push，第二劑可再給 150 mg IV/IO push。而有脈搏的穩定 VT 才是用 150 mg 慢速滴注。"
    },
    {
      question: "當給予 Adenosine 治療穩定型 PSVT 時，下列哪項操作是正確的？",
      options: [
        "應選擇遠端靜脈（如手背靜脈）以確保安全",
        "給藥速度應緩慢滴注至少 10 分鐘以上",
        "必須極快速推注 (Rapid IV push)，並立即用 20 mL 生理食鹽水快速沖洗",
        "支氣管氣喘 (Asthma) 患者是首選對象"
      ],
      correctIndex: 2,
      explanation: "Adenosine 的半衰期小於 10 秒，必須在最靠近心臟的近端靜脈管路中，以雙向三路接頭 (Three-way) 快速推注給藥，隨後立即以大量生理食鹽水沖水。支氣管氣喘為其相對/絕對禁忌症。"
    },
    {
      question: "Atropine Sulfate 用於有血液動力學症狀的心搏過緩患者時，成人的最大累積劑量上限是多少？",
      options: [
        "1 mg",
        "2 mg",
        "3 mg",
        "無上限，直到心率大於 60 bpm"
      ],
      correctIndex: 2,
      explanation: "Atropine 用於成人症狀性心搏過緩時，單次劑量為 1 mg IV，每 3-5 分鐘可重複，最大總累積劑量限制為 3 mg。超過此劑量可能產生完全的抗膽鹼阻斷作用。"
    },
    {
      question: "關於 TXA (傳明酸 / 斷血炎) 於嚴重創傷出血患者的院前給藥，下列敘述何者錯誤？",
      options: [
        "傷病患收縮壓應小於 90 mmHg 或心率大於 110 bpm",
        "受傷時間必須在 3 小時內，超過 3 小時給藥會增加死亡率",
        "首劑建議劑量為 1 g 加入 100 mL 生理食鹽水中於 10 分鐘內滴完",
        "為了加速止血，應以原液在 1 分鐘內直接靜脈推注完畢"
      ],
      correctIndex: 3,
      explanation: "TXA 快速靜脈推注可能引發暫時性低血壓。院前建議劑量為 1 g 加入 100 mL NS 或 D5W 中，慢速點滴滴注 10 分鐘，切忌快速推注。"
    },
    {
      question: "在給予 Nitroglycerin (NTG) 舌下含片之前，必須排除的絕對禁忌症不包括下列何者？",
      options: [
        "收縮壓 (SBP) 低於 90 mmHg",
        "患者於 24-48 小時內曾服用威而鋼或犀利士等壯陽藥",
        "懷疑右心室心肌梗塞 (RV Infarction)",
        "患者伴隨嚴重的呼吸困難與雙下肢水腫"
      ],
      correctIndex: 3,
      explanation: "NTG 的三大禁忌症為：低血壓 (SBP < 90 mmHg)、右心梗塞（極度依赖前負荷）以及近期使用壯陽藥。而呼吸困難與水腫（疑似心衰竭肺水腫）通常是 NTG 的適應症之一，而非禁忌症。"
    },
    {
      question: "當懷疑患者阿片類藥物過量中毒且伴隨呼吸抑制 (RR < 12) 時，給予 Naloxone (納洛酮) 的目的為何？",
      options: [
        "預防癲癇大發作",
        "拮抗阿片樣受體，逆轉呼吸抑制與意識障礙",
        "升高血壓並增強心肌收縮力",
        "直接溶解栓塞血管中的纖維蛋白"
      ],
      correctIndex: 1,
      explanation: "Naloxone 是特異性阿片樣受體拮抗劑，能競爭性阻斷嗎啡、海洛因、芬太尼等藥物與受體結合，從而逆轉呼吸抑制與深昏迷。"
    },
    {
      question: "當高級救護技術員 (EMT-P) 評估成人癲癇重積狀態，欲給予 Midazolam 進行控制時，下列哪項給藥劑量與途徑是合理的？",
      options: [
        "直接靜脈注射 (IV) 15 mg 快速推注",
        "肌肉注射 (IM) 或鼻腔給藥 (IN) 5 - 10 mg；或緩慢靜脈注射 (IV) 2.5 - 5 mg",
        "口服嚼碎 160 mg",
        "稀釋於 250 mL D5W 中以 100 mcg/min 點滴微量注射"
      ],
      correctIndex: 1,
      explanation: "Midazolam 控制癲癇時，靜脈注射 (IV) 應緩慢注射 (2.5 - 5 mg) 以免過快引發呼吸抑制；若無靜脈通路，可肌肉注射 (IM) 或鼻腔噴入 (IN) 5 - 10 mg。"
    },
    {
      question: "對於兒科低血糖患者，現場執行葡萄糖注射液治療時，下列何種規格與劑量最安全？",
      options: [
        "直接注射高濃度 D50W 2 mL/kg",
        "給予 D10W 2 - 5 mL/kg 靜脈滴注，禁用高滲透壓之 D50W 以免破壞幼兒血管",
        "必須配合 EpiPen 連續肌肉注射",
        "給予 Atropine 0.02 mg/kg 共同滴注"
      ],
      correctIndex: 1,
      explanation: "兒科細小血管容易因高濃度滲透壓而壞死或產生靜脈炎。兒科低血糖治療首選 D10W 2-5 mL/kg 靜脈滴注，新生兒給予 D10W 2 mL/kg，在院前禁用高濃度的 D50W 直推。"
    },
    {
      question: "根據本系統之急救用藥安全協定，為何 Tramadol (曲馬多) 的給藥途徑僅留下肌肉注射 (IM)？",
      options: [
        "因為 Tramadol 沒有靜脈注射劑型",
        "因為靜脈注射 (IV) 易引發嚴重的噁心、嘔吐、頭暈，甚至引發短暫低血壓，院前救護應予避開",
        "為了加速起效，首選骨內針路徑 (IO) 給藥",
        "為了預防雷氏症候群 (Reye's Syndrome)"
      ],
      correctIndex: 1,
      explanation: "根據本院前救護協定，為了防範靜脈推注速度過快引發嚴重的噁心、嘔吐與低血壓，Tramadol 僅限行深部肌肉注射 (IM)，不需稀釋直接原液注射。"
    }
  ],

  // 初始化應用程式
  init: function() {
    this.loadLocalStorage();
    this.renderDrugList();
    this.initNavigation();
    this.initSearch();
    this.initFilters();
    this.initCalculator();
    this.initQuiz();
    this.initModals();
    this.checkFirstLoadDisclaimer();
    
    // 初始化計算器藥物下拉選單
    this.populateCalculatorDrugs();
  },

  // 載入本地儲存
  loadLocalStorage: function() {
    try {
      const storedBookmarks = localStorage.getItem("emtp_bookmarks");
      if (storedBookmarks) {
        this.state.bookmarks = JSON.parse(storedBookmarks);
      }
      
      const storedNotes = localStorage.getItem("emtp_notes");
      if (storedNotes) {
        this.state.notes = JSON.parse(storedNotes);
      }
    } catch (e) {
      console.error("讀取 LocalStorage 失敗", e);
    }
  },

  // 儲存至本地儲存
  saveLocalStorage: function() {
    try {
      localStorage.setItem("emtp_bookmarks", JSON.stringify(this.state.bookmarks));
      localStorage.setItem("emtp_notes", JSON.stringify(this.state.notes));
    } catch (e) {
      console.error("寫入 LocalStorage 失敗", e);
    }
  },

  // 顯示 Toast 訊息
  showToast: function(msg) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-message");
    toastMsg.textContent = msg;
    toast.classList.add("show");
    
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  },

  // 檢查免責聲明
  checkFirstLoadDisclaimer: function() {
    const accepted = localStorage.getItem("emtp_disclaimer_accepted");
    if (!accepted) {
      document.getElementById("disclaimer-modal").classList.add("active");
    }
  },

  // 初始化所有彈窗事件
  initModals: function() {
    const detailModal = document.getElementById("drug-detail-modal");
    const disclaimerModal = document.getElementById("disclaimer-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const closeDiscBtn = document.getElementById("close-disclaimer-btn");
    const acceptDiscBtn = document.getElementById("accept-disclaimer-btn");
    const saveNoteBtn = document.getElementById("save-notes-btn");

    // 關閉詳情彈窗
    closeModalBtn.addEventListener("click", () => {
      detailModal.classList.remove("active");
    });

    // 點選遮罩關閉詳情彈窗
    detailModal.addEventListener("click", (e) => {
      if (e.target === detailModal) {
        detailModal.classList.remove("active");
      }
    });

    // 免責聲明事件
    closeDiscBtn.addEventListener("click", () => {
      disclaimerModal.classList.remove("active");
    });
    
    acceptDiscBtn.addEventListener("click", () => {
      localStorage.setItem("emtp_disclaimer_accepted", "true");
      disclaimerModal.classList.remove("active");
      this.showToast("已同意並啟用全功能手冊");
    });

    // 筆記儲存事件
    saveNoteBtn.addEventListener("click", () => {
      const drugId = saveNoteBtn.getAttribute("data-drug-id");
      const text = document.getElementById("modal-notes-area").value.trim();
      
      if (drugId) {
        if (text) {
          this.state.notes[drugId] = text;
        } else {
          delete this.state.notes[drugId];
        }
        this.saveLocalStorage();
        this.showToast("備忘錄儲存成功！");
        
        // 若在書籤頁，更新渲染
        if (this.state.currentSection === "bookmarks-section") {
          this.renderBookmarksSection();
        }
      }
    });
  },

  // 初始化分頁導覽
  initNavigation: function() {
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".page-section");
    const pageTitle = document.getElementById("page-title");
    const searchContainer = document.querySelector(".search-container");

    navItems.forEach(item => {
      item.addEventListener("click", () => {
        const targetSection = item.getAttribute("data-target");
        
        // 更新 active 狀態
        navItems.forEach(n => n.classList.remove("active"));
        item.classList.add("active");
        
        sections.forEach(s => s.classList.remove("active"));
        const activeSection = document.getElementById(targetSection);
        if (activeSection) {
          activeSection.classList.add("active");
        }

        // 更新狀態
        this.state.currentSection = targetSection;

        // 頁面特定邏輯
        if (targetSection === "ebook-section") {
          pageTitle.textContent = "藥物電子書";
          searchContainer.style.display = "block";
          this.renderDrugList();
        } else if (targetSection === "calc-section") {
          pageTitle.textContent = "急救劑量計算機";
          searchContainer.style.display = "none";
        } else if (targetSection === "protocols-section") {
          pageTitle.textContent = "急救流程對照";
          searchContainer.style.display = "none";
          this.initProtocolsView();
        } else if (targetSection === "quiz-section") {
          pageTitle.textContent = "藥理自我挑戰";
          searchContainer.style.display = "none";
        } else if (targetSection === "bookmarks-section") {
          pageTitle.textContent = "書籤與臨床筆記";
          searchContainer.style.display = "none";
          this.renderBookmarksSection();
        }
      });
    });

    // 主題切換按鈕
    const themeBtn = document.getElementById("theme-toggle");
    themeBtn.addEventListener("click", () => {
      const html = document.documentElement;
      const currentTheme = html.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      
      html.setAttribute("data-theme", newTheme);
      themeBtn.innerHTML = newTheme === "dark" 
        ? '<i class="fa-solid fa-sun"></i> <span>切換主題</span>' 
        : '<i class="fa-solid fa-moon"></i> <span>切換主題</span>';
        
      this.showToast(`已切換為 ${newTheme === "dark" ? "深色" : "明亮"} 模式`);
    });
  },

  // 搜尋功能初始化
  initSearch: function() {
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      this.renderDrugList(query);
    });
  },

  // 分類過濾按鈕初始化
  initFilters: function() {
    const categoryBtns = document.querySelectorAll(".filter-pill");
    categoryBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        categoryBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        this.state.activeCategory = btn.getAttribute("data-category");
        this.renderDrugList(document.getElementById("search-input").value.toLowerCase().trim());
      });
    });
  },

  // 渲染主藥物列表 (依英文首字母 A-Z 排序)
  renderDrugList: function(searchQuery = "") {
    const listContainer = document.getElementById("drug-list");
    listContainer.innerHTML = "";

    // 篩選符合條件的藥物
    const filteredDrugs = EMTP_DRUGS.filter(drug => {
      // 1. 分類篩選
      const matchesCategory = this.state.activeCategory === "all" || drug.category === this.state.activeCategory;
      
      // 2. 搜尋字詞篩選
      const matchesSearch = searchQuery === "" || 
        drug.nameEn.toLowerCase().includes(searchQuery) ||
        drug.nameZh.includes(searchQuery) ||
        drug.brandName.toLowerCase().includes(searchQuery) ||
        drug.categoryZh.includes(searchQuery);

      return matchesCategory && matchesSearch;
    });

    // 依英文首字母順序排列
    filteredDrugs.sort((a, b) => a.nameEn.localeCompare(b.nameEn));

    if (filteredDrugs.length === 0) {
      listContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; margin-bottom: 12px;"></i>
          <p>找不到符合條件的急救藥物。</p>
        </div>
      `;
      return;
    }

    filteredDrugs.forEach(drug => {
      const isBookmarked = this.state.bookmarks.includes(drug.id);
      
      const card = document.createElement("div");
      card.className = `drug-card ${drug.highAlert ? 'high-alert' : ''}`;
      card.innerHTML = `
        <div class="card-header">
          <div class="drug-names">
            <h3>${drug.nameEn}</h3>
            <div class="zh-name">${drug.nameZh}</div>
          </div>
          <span class="alert-badge">高警訊</span>
        </div>
        <div class="card-body">
          <div class="brand-label">商品名: ${drug.brandName}</div>
          <span class="card-tag">${drug.categoryZh.split(' / ')[0]}</span>
        </div>
        <div class="card-footer">
          <div class="dosage-peek">${drug.dosage.split('\n')[0].replace('• ', '')}</div>
          <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-drug-id="${drug.id}">
            <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-star"></i>
          </button>
        </div>
      `;

      // 點擊卡片開啟詳情彈窗，排除點擊收藏按鈕
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".bookmark-btn")) {
          this.showDrugDetail(drug.id);
        }
      });

      // 收藏按鈕事件
      const bookBtn = card.querySelector(".bookmark-btn");
      bookBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleBookmark(drug.id, bookBtn);
      });

      listContainer.appendChild(card);
    });
  },

  // 收藏/取消收藏邏輯
  toggleBookmark: function(drugId, buttonEl) {
    const index = this.state.bookmarks.indexOf(drugId);
    if (index === -1) {
      this.state.bookmarks.push(drugId);
      buttonEl.classList.add("active");
      buttonEl.querySelector("i").className = "fa-solid fa-star";
      this.showToast("已加入收藏書籤");
    } else {
      this.state.bookmarks.splice(index, 1);
      buttonEl.classList.remove("active");
      buttonEl.querySelector("i").className = "fa-regular fa-star";
      this.showToast("已從收藏書籤移除");
    }
    this.saveLocalStorage();

    // 若在書籤頁面，操作後需重新渲染該頁
    if (this.state.currentSection === "bookmarks-section") {
      this.renderBookmarksSection();
    }
  },

  // 顯示藥物詳細資料
  showDrugDetail: function(drugId) {
    const drug = EMTP_DRUGS.find(d => d.id === drugId);
    if (!drug) return;

    // 填充 Modal 內容
    document.getElementById("modal-drug-title").innerHTML = `${drug.nameEn} <span id="modal-drug-zh">${drug.nameZh}</span>`;
    document.getElementById("modal-drug-brand").textContent = `常用商品名：${drug.brandName}`;
    document.getElementById("modal-drug-category").textContent = drug.categoryZh;
    
    const alertBadge = document.getElementById("modal-drug-alert");
    if (drug.highAlert) {
      alertBadge.style.display = "inline-block";
    } else {
      alertBadge.style.display = "none";
    }

    document.getElementById("modal-drug-dosage").textContent = drug.dosage;
    document.getElementById("modal-drug-route").textContent = drug.route;
    document.getElementById("modal-drug-interval").textContent = drug.interval;
    document.getElementById("modal-drug-pediatric").textContent = drug.pediatricSpecial;
    document.getElementById("modal-drug-prep").textContent = drug.preparation;

    // 填充清單型資料
    const renderList = (elementId, array) => {
      const container = document.getElementById(elementId);
      container.innerHTML = "";
      if (array && array.length > 0) {
        array.forEach(item => {
          const li = document.createElement("li");
          li.textContent = item;
          container.appendChild(li);
        });
      }
    };

    renderList("modal-drug-indications", drug.indications);
    renderList("modal-drug-contraindications", drug.contraindications);
    renderList("modal-drug-precautions", drug.precautions);

    // 載入筆記
    const notesArea = document.getElementById("modal-notes-area");
    notesArea.value = this.state.notes[drugId] || "";

    // 設定儲存按鈕綁定的 ID
    const saveNoteBtn = document.getElementById("save-notes-btn");
    saveNoteBtn.setAttribute("data-drug-id", drugId);

    // 顯示彈窗
    document.getElementById("drug-detail-modal").classList.add("active");
  },

  // 渲染書籤頁面 (依首字母 A-Z 排序)
  renderBookmarksSection: function() {
    const markedList = document.getElementById("bookmarked-drugs-list");
    const emptyView = document.getElementById("bookmarks-empty-view");
    markedList.innerHTML = "";

    if (this.state.bookmarks.length === 0) {
      emptyView.style.display = "flex";
      markedList.style.display = "none";
      return;
    }

    emptyView.style.display = "none";
    markedList.style.display = "grid";

    // 獲取收藏的藥物實體並排序
    const bookmarkedDrugs = EMTP_DRUGS.filter(d => this.state.bookmarks.includes(d.id));
    bookmarkedDrugs.sort((a, b) => a.nameEn.localeCompare(b.nameEn));

    bookmarkedDrugs.forEach(drug => {
      const noteText = this.state.notes[drug.id] || "";
      const card = document.createElement("div");
      card.className = `drug-card ${drug.highAlert ? 'high-alert' : ''}`;
      card.innerHTML = `
        <div class="card-header">
          <div class="drug-names">
            <h3>${drug.nameEn}</h3>
            <div class="zh-name">${drug.nameZh}</div>
          </div>
          <span class="alert-badge">高警訊</span>
        </div>
        <div class="card-body">
          <div class="brand-label">商品名: ${drug.brandName}</div>
          <span class="card-tag">${drug.categoryZh.split(' / ')[0]}</span>
        </div>
        <div class="card-footer">
          <div class="dosage-peek">${drug.dosage.split('\n')[0].replace('• ', '')}</div>
          <button class="bookmark-btn active" data-drug-id="${drug.id}">
            <i class="fa-solid fa-star"></i>
          </button>
        </div>
      `;

      card.addEventListener("click", (e) => {
        if (!e.target.closest(".bookmark-btn")) {
          this.showDrugDetail(drug.id);
        }
      });

      const bookBtn = card.querySelector(".bookmark-btn");
      bookBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleBookmark(drug.id, bookBtn);
      });

      // 附加書籤頁的筆記卡片預覽
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "8px";
      container.appendChild(card);

      if (noteText) {
        const notePreview = document.createElement("div");
        notePreview.className = "note-preview-badge";
        notePreview.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> <strong>備忘錄提示：</strong><p>${noteText}</p>`;
        container.appendChild(notePreview);
      }

      markedList.appendChild(container);
    });
  },

  // ==================== 計算器邏輯 ====================
  initCalculator: function() {
    const adultTab = document.getElementById("calc-tab-adult");
    const pedTab = document.getElementById("calc-tab-pediatric");
    const pedAgeGroup = document.getElementById("pediatric-age-group");
    const weightInput = document.getElementById("patient-weight");
    const pedAgeSelect = document.getElementById("ped-age");
    const drugSelect = document.getElementById("calc-drug-select");
    const infusionDoseInput = document.getElementById("infusion-dose-rate");

    // 切換成人/兒科
    adultTab.addEventListener("click", () => {
      this.state.calcMode = "adult";
      adultTab.classList.add("active");
      pedTab.classList.remove("active");
      pedAgeGroup.style.display = "none";
      
      // 還原常規成人體重
      weightInput.value = 70;
      this.calculateDosage();
    });

    pedTab.addEventListener("click", () => {
      this.state.calcMode = "pediatric";
      pedTab.classList.add("active");
      adultTab.classList.remove("active");
      pedAgeGroup.style.display = "block";
      
      // 自動預估一歲體重
      pedAgeSelect.value = "1";
      weightInput.value = 10;
      this.calculateDosage();
    });

    // 兒科年齡選擇聯動體重
    pedAgeSelect.addEventListener("change", (e) => {
      const age = parseInt(e.target.value);
      if (age) {
        // APLS公式: Weight = (Age * 2) + 8
        const estimatedWeight = (age * 2) + 8;
        weightInput.value = estimatedWeight;
        this.calculateDosage();
      }
    });

    // 體重輸入變更
    weightInput.addEventListener("input", () => {
      this.calculateDosage();
    });

    // 藥物變更
    drugSelect.addEventListener("change", (e) => {
      const drugId = e.target.value;
      this.state.selectedCalcDrug = EMTP_DRUGS.find(d => d.id === drugId) || null;
      
      // 判斷是否需要點滴微調參數
      const infusionGroup = document.getElementById("infusion-rate-group");
      if (this.state.selectedCalcDrug && this.state.selectedCalcDrug.calcProps && 
         (this.state.selectedCalcDrug.calcProps.type === "weight_infusion" || this.state.selectedCalcDrug.calcProps.type === "weight_infusion_and_pediatric")) {
        infusionGroup.style.display = "block";
        document.getElementById("infusion-dose-label").textContent = `給藥滴注速率 (${this.state.selectedCalcDrug.calcProps.infusionUnit})`;
        document.getElementById("infusion-dose-unit").textContent = this.state.selectedCalcDrug.calcProps.infusionUnit;
        infusionDoseInput.value = this.state.selectedCalcDrug.calcProps.defaultInfusionRate;
      } else {
        infusionGroup.style.display = "none";
      }

      this.calculateDosage();
    });

    // 點滴速率變更
    infusionDoseInput.addEventListener("input", () => {
      this.calculateDosage();
    });
  },

  // 填充計算器藥物品種
  populateCalculatorDrugs: function() {
    const select = document.getElementById("calc-drug-select");
    select.innerHTML = `<option value="">-- 請選擇藥物 --</option>`;
    
    const sortedDrugs = [...EMTP_DRUGS].sort((a, b) => a.nameEn.localeCompare(b.nameEn));
    
    sortedDrugs.forEach(drug => {
      const opt = document.createElement("option");
      opt.value = drug.id;
      opt.textContent = `${drug.nameEn} (${drug.nameZh})`;
      select.appendChild(opt);
    });
  },

  // 執行臨床劑量計算
  calculateDosage: function() {
    const placeholder = document.getElementById("calc-results-placeholder");
    const display = document.getElementById("calc-results-display");
    
    if (!this.state.selectedCalcDrug) {
      placeholder.style.display = "flex";
      display.style.display = "none";
      return;
    }

    placeholder.style.display = "none";
    display.style.display = "flex";

    const drug = this.state.selectedCalcDrug;
    const weight = parseFloat(document.getElementById("patient-weight").value) || 0;
    const isPediatric = this.state.calcMode === "pediatric";

    document.getElementById("calc-res-drug-name").innerHTML = `${drug.nameEn} ${drug.nameZh}`;
    document.getElementById("calc-res-brand").textContent = `常用商品名: ${drug.brandName} (${drug.categoryZh.split(' / ')[0]})`;
    document.getElementById("calc-res-weight").textContent = `${weight} kg`;
    document.getElementById("calc-res-prep").textContent = drug.preparation;

    const targetDoseEl = document.getElementById("calc-res-target-dose");
    const volumeLabelEl = document.getElementById("calc-res-volume-label");
    const volumeEl = document.getElementById("calc-res-volume");

    if (weight <= 0) {
      targetDoseEl.textContent = "體重輸入無效";
      volumeEl.textContent = "--";
      return;
    }

    const props = drug.calcProps;
    if (!props) {
      // 固定的藥物 (例如 Aspirin)
      targetDoseEl.textContent = drug.dosage;
      volumeLabelEl.textContent = "給藥途徑";
      volumeEl.textContent = "口服口含";
      return;
    }

    // 計算主體
    if (isPediatric) {
      // ===== 兒科計算分支 =====
      if (props.pediatricOhcaDosePerKg) {
        let calculatedDose = props.pediatricOhcaDosePerKg * weight;
        let unit = "mg";
        
        // 限幅最大兒科劑量
        if (props.maxPediatricDose && calculatedDose > props.maxPediatricDose) {
          calculatedDose = props.maxPediatricDose;
        }

        // Epinephrine 特殊處理 (稀釋法體積計算)
        if (drug.id === "epinephrine") {
          const calculatedVol = props.pediatricOhcaVolPerKg * weight;
          targetDoseEl.textContent = `${calculatedDose.toFixed(3)} mg (Epi 1:10,000)`;
          volumeLabelEl.textContent = "稀釋液抽取容積 (1:10,000)";
          volumeEl.innerHTML = `${calculatedVol.toFixed(1)} mL <span class="result-badge">原液 1mg 稀釋至 10mL 後抽取</span>`;
        } else {
          // 其他兒科有劑量計算的藥物
          const mgPerMl = props.mgPerMl || 1;
          const volMl = calculatedDose / mgPerMl;
          targetDoseEl.textContent = `${calculatedDose.toFixed(2)} ${unit}`;
          volumeLabelEl.textContent = "建議抽取注射容積";
          volumeEl.innerHTML = `${volMl.toFixed(2)} mL <span class="result-badge">原液注射</span>`;
        }
      }
      else if (props.pediatricFirstDosePerKg) {
        // Adenosine 兒科
        const firstDose = props.pediatricFirstDosePerKg * weight;
        const secondDose = props.pediatricSecondDosePerKg * weight;
        const mgPerMl = props.mgPerMl;
        
        const fd = Math.min(firstDose, props.maxPediatricDose);
        const sd = Math.min(secondDose, props.maxPediatricSecondDose);

        targetDoseEl.innerHTML = `首劑: ${fd.toFixed(2)} mg<br>次劑: ${sd.toFixed(2)} mg`;
        volumeLabelEl.textContent = "注射容積 (首劑 / 次劑)";
        volumeEl.innerHTML = `${(fd/mgPerMl).toFixed(1)} mL / ${(sd/mgPerMl).toFixed(1)} mL <span class="result-badge">近端快速推注後沖水</span>`;
      }
      else {
        targetDoseEl.textContent = "此藥物無預設兒科計算公式";
        volumeLabelEl.textContent = "臨床建議";
        volumeEl.textContent = "請參照兒科特殊情境說明手動調整。";
      }
    } 
    else {
      // ===== 成人計算分支 =====
      if (props.type === "weight_bolus") {
        // 依體重推注 (如 Midazolam, Tramadol)
        const targetDose = props.standardDosePerKg * weight;
        const finalDose = props.maxSingleDose ? Math.min(targetDose, props.maxSingleDose) : targetDose;
        const volMl = finalDose / props.mgPerMl;
        
        targetDoseEl.textContent = `${finalDose.toFixed(1)} mg (${props.standardDosePerKg} mg/kg)`;
        volumeLabelEl.textContent = "建議抽取注射容積";
        volumeEl.innerHTML = `${volMl.toFixed(1)} mL <span class="result-badge">原液注射</span>`;
      } 
      else if (props.type === "weight_infusion" || props.type === "weight_infusion_and_pediatric") {
        // 連續滴注 (Epinephrine, Nitroglycerin)
        const userInfRate = parseFloat(document.getElementById("infusion-dose-rate").value) || 0;
        
        targetDoseEl.textContent = `${userInfRate} ${props.infusionUnit}`;
        
        // 計算滴速
        let rateMlHr = 0;
        let concentrationMcgMl = 0;

        if (drug.id === "epinephrine") {
          concentrationMcgMl = 4; // 1mg in 250ml = 4mcg/ml
          rateMlHr = (userInfRate * 60) / concentrationMcgMl;
        } else if (drug.id === "nitroglycerin") {
          concentrationMcgMl = 200; // 50mg in 250ml = 200mcg/ml
          rateMlHr = (userInfRate * 60) / concentrationMcgMl;
        }

        const dropsMin = rateMlHr;

        volumeLabelEl.textContent = "滴速計算結果 (精密輸液 60 gtt/mL)";
        volumeEl.innerHTML = `${rateMlHr.toFixed(1)} mL/hr <span class="result-badge">${dropsMin.toFixed(0)} 滴/分</span>`;
      } 
      else {
        // 固定成人給藥的藥物
        targetDoseEl.textContent = drug.dosage.split('\n')[0].replace('• ', '');
        volumeLabelEl.textContent = "臨床提示";
        volumeEl.textContent = "固定劑量給藥，不需依體重調整";
      }
    }
  },

  // ==================== 流程精靈資料庫 ====================
  protocolsData: {
    anaphylaxis: {
      title: "成人致命性過敏傷病患救護流程 (115.03.20 決議)",
      subtitle: "嘉義縣消防局緊急醫療救護協定對照",
      steps: [
        {
          label: "步驟 1: 初步評估",
          question: "出現過敏反應經初步評估並詢問病史，患者是否有下列任一狀況？",
          desc: "1. 有嚴重呼吸道腫脹症狀 (如血管水腫、喉部水腫、聲音沙啞、喘鳴、哮喘)<br>2. 有休克症狀 (如意識不清、低血壓、臉色蒼白、冷汗、CRT > 2秒)",
          choices: [
            { text: "是 (符合上述狀況之一)", nextStep: 1 },
            { text: "否 (完全無上述狀況)", nextStep: 5 }
          ],
          guidelines: "<strong>【要旨說明】</strong><br>1. 非創傷傷病患者主訴出現過敏反應者，適用此流程。<br>2. 若為注射(含叮咬)造成之過敏性休克致死案例，多在數分鐘至 1 小時內發生；食物造成的嚴重過敏致死多發生在半小時至 4 小時內；6 小時後並沒有死亡案例。所以第一線 EMS/急診的處理非常重要。<br><strong>【註1: 典型的過敏性反應】</strong><br>通常侵犯皮膚、呼吸、心臟血管或腸胃系統中的兩個以上，且在暴露於過敏源後很快發生。類過敏反應不是由 IgE 引起，但與過敏反應有相似臨床症候。<br><strong>【註2: 嚴重呼吸道腫脹症狀】</strong><br>• 血管水腫：眼瞼、臉或嘴唇腫脹，如口咽部腫脹或舌頭水腫。<br>• 上呼吸道水腫：聲音沙啞或喘鳴 (stridor)。<br>• 下呼吸道水腫 (氣喘)：哮喘 (wheezing)。<br><strong>【註3: 心臟血管系統侵犯】</strong><br>血管擴張造成相對性低血容，微血管通透性增加，嚴重時表現為暈厥、心悸、低血壓或休克 (如意識不清、臉色蒼白、四肢濕冷、呼吸淺快、心搏過速、微血管充填時間 > 2 秒)。"
        },
        {
          label: "步驟 2: 心臟停止評估",
          question: "評估患者目前是否已心臟停止？",
          desc: "檢查是否有自主意識、呼吸與大動脈搏動。",
          choices: [
            { text: "是 (已心臟停止 / 無生命徵象)", nextStep: 6 },
            { text: "否 (仍有生命徵象)", nextStep: 2 }
          ]
        },
        {
          label: "步驟 3: 緊急處置與給藥",
          question: "病患有過敏性休克且有生命徵象，立即實施下列處置：",
          desc: "• <strong>1. 給氧與呼吸支持</strong>：依情況適當給氧，必要時以袋瓣式甦醒球 (BVM) 正壓通氣，並監測血氧 [註7]。<br>• <strong>2. 協助自備 EpiPen</strong>：若患者有自備腎上腺素注射筆，中級技術員 (EMT-2) 即可協助在大腿外側進行肌肉注射，戳入大腿維持 10 秒 [註4]。<br>• <strong>3. 高級技術員給藥 (P)</strong>：EMT-P 應<strong>直接給予 Epinephrine 0.5mg (1:1000 原液) 肌肉注射 (IM)</strong> 於上臂三角肌或大腿中段前外側；需要時 5~15 分鐘後可再給一次 [註5]。<br>• <strong>4. 大量靜脈輸液</strong>：建立大口徑靜脈留置針給予大量輸液以對抗休克 [註7]。",
          choices: [
            { text: "已完成給藥與初步處置，進行下一步", nextStep: 3 }
          ],
          guidelines: "<strong>【註4: 協助使用腎上腺素注射筆】</strong><br>• 如出現嚴重過敏反應但仍有生命徵象者，以大腿外側為注射部位，打開安全蓋，尖端對準大腿外側戳在大腿上 10 秒鐘肌肉注射。<br>• 距離第 1 次注射 EpiPen 超過 5 分鐘後仍有嚴重呼吸道腫脹或休克，且現場有 2 支以上 EpiPen，可透過指揮中心與線上醫導醫師決策，再施打肌肉注射一次。<br>• EpiPen 為民眾自行攜帶，救護車上不放置。<br><strong>【註5: Paramedic 肌肉注射】</strong><br>• EMT-P 出現嚴重過敏反應仍有生命徵象者，得直接肌肉注射 Epinephrine 0.5mg (1:1000)。若症狀改善幅度不足，得再注射一次，並考慮進行快速滴注。"
        },
        {
          label: "步驟 4: 過敏源檢查 (蜂螫)",
          question: "此致命性過敏反應是否為蜂螫造成？",
          desc: "檢查暴露部位之皮膚或衣物，詢問發病病史。",
          choices: [
            { text: "是 (蜂螫造成)", nextStep: 4 },
            { text: "否 (其他過敏源/未知原因)", nextStep: 7 }
          ]
        },
        {
          label: "步驟 5: 移除蜂針與毒囊",
          question: "檢視傷口並進行蜂針移除：",
          desc: "• <strong>移除蜂針</strong>：為避免毒囊之毒液持續注入體內，應檢視遭蜂螫之傷口，並將殘留皮膚之蜂針移除 [註6]。<br>• <strong>刮除方式</strong>：移除毒囊時<strong>應避免使用手指或鑷子</strong>等可能會擠壓毒囊的方法，建議可<strong>使用紙板或卡片刮除毒囊</strong> [註6]。",
          choices: [
            { text: "已完成蜂針刮除處置，進行下一步", nextStep: 7 }
          ],
          guidelines: "<strong>【註6: 移除蜂針細節】</strong><br>因為毒囊在被螫後仍會繼續收縮排毒，因此必須儘速刮除。使用卡片（如身分證、健保卡）或硬紙板以平角貼著皮膚輕輕刮去蜂針，不可直接用手指捏起，否則會把毒囊內剩餘毒液全部擠入體內。"
        },
        {
          label: "非致命性過敏反應",
          question: "評估為非致命性過敏狀況：",
          desc: "病患目前無嚴重的呼吸道腫脹，亦無血液動力學不穩定之休克表現。應提供常規給氧，持續評估並常規送醫。",
          choices: [],
          recommendation: "維持氣道與給氧，並密切監測生命徵象，提防隨時發生的遲發性過敏反應。"
        },
        {
          label: "心臟停止緊急救護",
          question: "立即啟動高品質 CPR 與心臟停止救護流程！",
          desc: "病患已無呼吸與脈搏。請立即執行去顫電擊 (若適用)，並進入【非創傷病患心臟停止緊急救護流程】處置！",
          choices: [],
          recommendation: "依非創傷 OHCA 協定急救。每 3-5 分鐘給予 Epinephrine 1mg IV/IO，積極尋找插管、給氧與心律轉復時機。"
        },
        {
          label: "送醫與持續評估",
          question: "救護車後送與心律持續監視：",
          desc: "• <strong>持續監視心律</strong>與 SpO2 [註7]。<br>• <strong>再次給藥評估</strong>：若送醫途中症狀改善幅度不足，且距離首次給藥超過 5-15 分鐘，可重複肌肉注射 Epinephrine 0.5mg 一次，並進行快速點滴注射。<br>• 與接收醫院進行無線電預報，做好急救交班準備。",
          choices: [],
          recommendation: "持續給氧、大口徑靜脈留置針滴注。若心律改變或病情惡化隨時回報指揮中心及醫療指導醫師。",
          guidelines: "<strong>【註7: 初評之必要處置】</strong><br>1. 依情況考慮給予高濃度氧氣治療或以袋瓣式甦醒球 (BVM) 給予正壓通氣，並持續監測血氧濃度。<br>2. 如出現休克徵狀則考慮以大口徑靜脈留置針給予大量輸液。<br>3. 送醫途中必須持續監視心律。"
        }
      ]
    }
    ,
    arrhythmia: {
      title: "成人緩脈與頻脈救護流程 (113.03 / 115.03 決議)",
      subtitle: "嘉義縣消防局緊急醫療救護協定對照",
      steps: [
        {
          label: "步驟 1: 初步評估與心電圖",
          question: "評估非創傷患者 (年齡 >= 18 歲)，主訴心律不整，並實施 12 導程 ECG 檢查：",
          desc: "• <strong>初步處置</strong>：監視呼吸道(A)、呼吸(B)、循環(C)，必要時給氧維持 SpO2 >= 94% [註1]。<br>• <strong>心電圖判讀結果為？</strong>",
          choices: [
            { text: "緩脈 (心律 < 50 次/分)", nextStep: 1 },
            { text: "頻脈 (心律 >= 150 次/分)", nextStep: 2 }
          ],
          guidelines: "<strong>【要旨與說明】</strong><br>1. 本操作流程之建議處置僅適用本局高級救護隊、專責救護隊或經認證之 EMT-P 操作，且操作人員之 ACLS 證照須維持於效期之內。<br>2. EMT-P 於初步評估時若發現病人且脈搏或心律次數 < 50 次/分 或 >= 150 次/分時，懷疑為心因性時即建議操作 12 導程心電圖後使用本流程操作進行。<br>3. 心律不整病人通常以「不穩定」及「有症狀」來描述。<br><strong>【註1: 相關急救處置如下】</strong><br>• 若呼吸道不通暢，考慮建立呼吸道，必要時給予抽吸。<br>• 必要時給氧，維持 SpO2 >= 94%。<br>• 若有設備，接上心律監視器，並操作 12 導程心電圖。"
        },
        {
          label: "步驟 2: 緩脈不穩定評估",
          question: "評估緩脈患者 (心律 < 50 次/分) 是否有【不穩定徵候】？",
          desc: "檢查是否有以下任一徵候 [註2]：<br>1. 急性意識改變<br>2. 缺血性胸痛<br>3. 呼吸喘 (SpO2 < 90%) 或呼吸衰竭<br>4. 有典型休克徵象與症狀<br>5. 低血壓",
          choices: [
            { text: "是 (有不穩定徵候)", nextStep: 3 },
            { text: "否 (穩定無不穩定徵候)", nextStep: 4 }
          ],
          guidelines: "<strong>【註2: 不穩定徵候定義】</strong><br>包括：一、急性意識改變；二、缺血性胸痛；三、呼吸喘(SpO2 < 90%)或呼吸衰竭；四、有典型休克徵象與症狀；五、低血壓。"
        },
        {
          label: "步驟 2: 頻脈不穩定評估",
          question: "評估頻脈患者 (心律 >= 150 次/分) 是否有【不穩定徵候】？",
          desc: "檢查是否有以下任一徵候 [註2]：<br>1. 急性意識改變<br>2. 缺血性胸痛<br>3. 呼吸喘 (SpO2 < 90%) 或呼吸衰竭<br>4. 有典型休克徵象與症狀<br>5. 低血壓",
          choices: [
            { text: "是 (有不穩定徵候)", nextStep: 5 },
            { text: "否 (穩定無不穩定徵候)", nextStep: 6 }
          ],
          guidelines: "<strong>【註2: 不穩定徵候定義】</strong><br>包括：一、急性意識改變；二、缺血性胸痛；三、呼吸喘(SpO2 < 90%)或呼吸衰竭；四、有典型休克徵象與症狀；五、低血壓。"
        },
        {
          label: "步驟 3: 緩脈不穩定處置 (Atropine / TCP)",
          question: "緩脈不穩定，準備執行給藥或起搏器：",
          desc: "• <strong>尋求線上醫療指導使用 Atropine 或經皮心臟節律器 TCP</strong> [註3]。<br>• <strong>Atropine 使用方法</strong>：初始劑量 1 mg 靜脈推注，每 3-5 分鐘可重複施打，最大總量不超過 3 mg。<br>• <strong>注意 Atropine 禁忌症</strong>（如 ACS、青光眼、QRS > 0.12 秒等）。",
          choices: [
            { text: "處置完成，進入送醫流程", nextStep: 8 }
          ],
          guidelines: "<strong>【註3: Atropine 與 TCP 說明】</strong><br><strong>Atropine 禁忌症：</strong><br>1. 經群組判讀為急性冠心症 (ACS) 患者。<br>2. 對 Atropine 過敏。<br>3. 有青光眼。<br>4. 心臟移植患者可能無效。<br>5. QRS > 0.12 秒。<br><strong>經皮心臟節律器 (TCP) 注意事項：</strong><br>1. 操作前向患者或家屬做適當解釋，待其同意後再尋求線上醫療指導。<br>2. <strong>評估脈搏應摸「股動脈」來確認機械性擷取</strong>；不可評估頸動脈，因電刺激會造成可能類似頸動脈搏動的肌肉抽動。<br>3. 心律調節時間過長 (超過 30 分鐘) 可能會導致灼傷。"
        },
        {
          label: "步驟 3: 穩定緩脈送醫",
          question: "緩脈患者穩定無不穩定徵候：",
          desc: "目前無需特殊給藥或起搏處置。進入送醫照護流程。",
          choices: [
            { text: "進入送醫流程", nextStep: 8 }
          ]
        },
        {
          label: "步驟 3: 不穩定頻脈處置 (同步整流)",
          question: "頻脈不穩定，準備進行同步心臟整流：",
          desc: "• <strong>尋求線上醫療指導進行同步心臟整流</strong> [註5]。<br>• 進行同步整流前應向患者或家屬給予適當之說明。<br>• 同步整流能量應依線上醫療指導指示之能量。<br>• 2025 AHA 建議同步整流能量原則，QRS 寬且規律：100 焦耳。",
          choices: [
            { text: "整流完成，進入送醫流程", nextStep: 8 }
          ],
          guidelines: "<strong>【註5: 同步心臟整流說明】</strong><br>若患者心電圖依「嘉義縣院前 EKG 群組」判讀為心室頻脈 (VT) 且有不穩定徵候，器材允許下得考慮尋求線上醫療指導後始進行同步心臟整流。同步整流操作流程依各電擊器規範所定，EMT-P 應熟悉相關操作，指導醫師得不定期前往考核。若有使用同步心臟整流，應將情形紀錄於救護紀錄表中。"
        },
        {
          label: "步驟 3: 穩定頻脈評估 (QRS 寬度)",
          question: "評估頻脈患者的 QRS 寬度：",
          desc: "是否為寬的 QRS 波 (QRS 寬度 >= 0.12 秒)？",
          choices: [
            { text: "是 (QRS >= 0.12 秒)", nextStep: 8 },
            { text: "否 (QRS < 0.12 秒 / 疑似 PSVT/SVT)", nextStep: 7 }
          ]
        },
        {
          label: "步驟 4: 迷走神經刺激術",
          question: "窄 QRS 且穩定頻脈，考慮迷走神經刺激術：",
          desc: "• <strong>環境允許下得考慮進行迷走神經刺激術</strong> [註4]：<br>1. 請病人試著**咳嗽**。<br>2. 請病人試著**憋氣後腹部用力**（每次不超過 10 秒）。<br>3. 使用 **Modified Valsalva Maneuver**。<br>• 若使用迷走神經刺激術，需記錄在救護紀錄表中。",
          choices: [
            { text: "處置完成，進入送醫流程", nextStep: 8 }
          ],
          guidelines: "<strong>【註4: Modified Valsalva 操作細節】</strong><br>1. 使用 10 c.c 針筒吹氣 15 秒。<br>2. 把病人躺平後，再把腳抬高 45 度約 15 秒。<br>3. 將病人腳放平後，再監測是否回復竇性心律。"
        },
        {
          label: "送醫照護與監測",
          question: "執行送醫照護流程：",
          desc: "• <strong>施行必要處置</strong>：1. 依評估施行必要之處置。 2. 全程監視心律且密切注意患者生命徵象。<br>• <strong>建立靜脈輸液</strong>：視情況於送醫途中建立靜脈輸液 [註6]。",
          choices: [],
          recommendation: "送醫途中全時監視心律，密切注意患者生命徵象變化。若有使用 Atropine 或 TCP，應將情形紀錄於救護紀錄表中。",
          guidelines: "<strong>【註6: 送醫說明】</strong><br>病人症狀可能隨時惡化或改變，送醫途中應全時監視心律，並注意患者生命徵象是否改變，得考慮於送醫途中建立靜脈輸液。"
        }
      ]
    }
  },

  // ==================== 急救流程精靈控制 ====================
  initProtocolsView: function() {
    const pills = document.querySelectorAll(".protocol-selector .filter-pill");
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        
        const protocolId = pill.getAttribute("data-protocol");
        this.state.wizard.protocolId = protocolId;
        this.resetWizard();
      });
    });

    const resetBtn = document.getElementById("wizard-btn-reset");
    resetBtn.addEventListener("click", () => {
      this.resetWizard();
    });

    const nextBtn = document.getElementById("wizard-btn-next");
    nextBtn.addEventListener("click", () => {
      const proto = this.protocolsData[this.state.wizard.protocolId];
      const currentStep = proto.steps[this.state.wizard.currentStepIndex];
      // 如果是一步走完沒有選擇題，但有下一步 (單向繼續)
      if (currentStep.choices && currentStep.choices.length === 1) {
        this.handleWizardChoice(currentStep.choices[0].nextStep);
      }
    });

    // 啟動首次渲染，預設維持過敏流程
    this.resetWizard();
  },

  // 渲染當前步驟
  renderWizardStep: function() {
    const protocolId = this.state.wizard.protocolId;
    const proto = this.protocolsData[protocolId];
    const stepIndex = this.state.wizard.currentStepIndex;
    const step = proto.steps[stepIndex];

    // 更新標題
    document.getElementById("wizard-proto-title").textContent = proto.title;
    document.getElementById("wizard-proto-subtitle").textContent = proto.subtitle;

    // 更新步驟標籤與進度條
    document.getElementById("wizard-step-label").textContent = step.label;
    const progressPercent = Math.min(((stepIndex + 1) / proto.steps.length) * 100, 100);
    document.getElementById("wizard-progress-fill").style.width = `${progressPercent}%`;

    // 更新問題/描述
    document.getElementById("wizard-question-title").innerHTML = step.question;
    document.getElementById("wizard-question-desc").innerHTML = step.desc;

    // 渲染選項按鈕
    const choicesContainer = document.getElementById("wizard-choices-container");
    choicesContainer.innerHTML = "";

    const nextBtn = document.getElementById("wizard-btn-next");
    nextBtn.style.display = "none";

    if (step.choices && step.choices.length > 0) {
      if (step.choices.length === 1) {
        // 單向流程 (「下一步」)，隱藏選項按鈕，改為直接按最下方的繼續按鈕
        nextBtn.style.display = "inline-block";
        nextBtn.innerHTML = `${step.choices[0].text} <i class="fa-solid fa-arrow-right"></i>`;
      } else if (step.choices.length === 2) {
        // 二選一 (左右對開正方形/矩形卡片)
        choicesContainer.style.display = "flex";
        choicesContainer.style.gap = "16px";
        choicesContainer.style.flexDirection = "row";
        
        step.choices.forEach((choice, index) => {
          const btn = document.createElement("button");
          btn.className = "wizard-square-btn";
          
          // 判斷圖標與顏色
          let iconClass = "fa-circle-question";
          let iconColor = "var(--color-primary)";
          if (choice.text.includes("是") || choice.text.includes("可電擊")) {
            iconClass = "fa-circle-check";
            iconColor = "var(--color-success)";
          } else if (choice.text.includes("否") || choice.text.includes("不可電擊")) {
            iconClass = "fa-circle-xmark";
            iconColor = "var(--color-danger)";
          }
          
          btn.innerHTML = `
            <div class="sq-btn-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; height: 110px; width: 100%; border-radius: 12px; border: 2px solid var(--border-color); background: rgba(255, 255, 255, 0.03); color: var(--text-primary); transition: all 0.2s ease; cursor: pointer; padding: 12px; text-align: center;">
              <i class="fa-solid ${iconClass}" style="font-size: 1.8rem; color: ${iconColor};"></i>
              <span style="font-weight: 600; font-size: 0.95rem; line-height: 1.3;">${choice.text}</span>
            </div>
          `;
          
          // 加入 Hover 與點擊效果
          const btnContent = btn.querySelector(".sq-btn-content");
          btn.style.flex = "1";
          btn.style.border = "none";
          btn.style.background = "none";
          btn.style.padding = "0";
          btn.style.cursor = "pointer";
          
          btn.addEventListener("mouseenter", () => {
            btnContent.style.borderColor = "var(--color-primary)";
            btnContent.style.background = "rgba(59, 130, 246, 0.08)";
            btnContent.style.transform = "translateY(-2px)";
          });
          
          btn.addEventListener("mouseleave", () => {
            btnContent.style.borderColor = "var(--border-color)";
            btnContent.style.background = "rgba(255, 255, 255, 0.03)";
            btnContent.style.transform = "translateY(0)";
          });
          
          btn.addEventListener("click", () => {
            this.handleWizardChoice(choice.nextStep);
          });
          
          choicesContainer.appendChild(btn);
        });
      } else {
        // 多個選項 (恢復垂直堆疊)
        choicesContainer.style.display = "grid";
        choicesContainer.style.gap = "8px";
        choicesContainer.style.flexDirection = "unset";
        
        step.choices.forEach(choice => {
          const btn = document.createElement("button");
          btn.className = "quiz-opt-btn";
          btn.style.textAlign = "left";
          btn.style.marginBottom = "8px";
          btn.innerHTML = `<i class="fa-regular fa-circle-question" style="color: var(--color-primary); margin-right: 8px;"></i> ${choice.text}`;
          btn.addEventListener("click", () => {
            this.handleWizardChoice(choice.nextStep);
          });
          choicesContainer.appendChild(btn);
        });
      }
    }

    // 顯示建議處置面板 (如果為葉節點或特別註明)
    const recBox = document.getElementById("wizard-recommendation-box");
    const recText = document.getElementById("wizard-recommendation-text");
    if (step.recommendation) {
      recBox.style.display = "block";
      recText.innerHTML = step.recommendation;
    } else {
      recBox.style.display = "none";
    }

    // 顯示臨床註解面板
    const guiBox = document.getElementById("wizard-guidelines-box");
    const guiText = document.getElementById("wizard-guidelines-text");
    if (step.guidelines) {
      guiBox.style.display = "block";
      guiText.innerHTML = step.guidelines;
    } else {
      guiBox.style.display = "none";
    }
  },

  // 處理選項點擊
  handleWizardChoice: function(nextStepIndex) {
    this.state.wizard.history.push(this.state.wizard.currentStepIndex);
    this.state.wizard.currentStepIndex = nextStepIndex;
    this.renderWizardStep();
  },

  // 重設精靈
  resetWizard: function() {
    this.state.wizard.currentStepIndex = 0;
    this.state.wizard.history = [];
    this.renderWizardStep();
  },

  // ==================== QUIZ SYSTEM ====================
  initQuiz: function() {
    const startBtn = document.getElementById("start-quiz-btn");
    const nextBtn = document.getElementById("next-quiz-btn");
    const restartBtn = document.getElementById("restart-quiz-btn");

    startBtn.addEventListener("click", () => {
      this.startQuiz();
    });

    nextBtn.addEventListener("click", () => {
      this.nextQuizQuestion();
    });

    restartBtn.addEventListener("click", () => {
      this.startQuiz();
    });
  },

  // 開始測驗
  startQuiz: function() {
    const shuffled = [...this.quizPool].sort(() => 0.5 - Math.random());
    this.state.quiz = {
      active: true,
      questions: shuffled.slice(0, 10),
      currentIndex: 0,
      score: 0,
      selectedAnswerIndex: null
    };

    document.getElementById("quiz-start-screen").style.display = "none";
    document.getElementById("quiz-result-screen").style.display = "none";
    document.getElementById("quiz-play-screen").style.display = "flex";

    this.renderQuizQuestion();
  },

  // 渲染當前題目
  renderQuizQuestion: function() {
    const qState = this.state.quiz;
    const currentQ = qState.questions[qState.currentIndex];

    // 更新進度與分數
    document.getElementById("quiz-current-num").textContent = qState.currentIndex + 1;
    document.getElementById("quiz-current-score").textContent = `${qState.score * 10}`;
    
    // 進度條
    const progressPercent = ((qState.currentIndex) / 10) * 100;
    document.getElementById("quiz-progress-fill").style.width = `${progressPercent}%`;

    // 題目文字
    document.getElementById("quiz-question-text").textContent = currentQ.question;

    // 選項
    const optionsContainer = document.getElementById("quiz-options-container");
    optionsContainer.innerHTML = "";

    currentQ.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `<span style="font-weight: 700; margin-right: 12px;">${String.fromCharCode(65 + idx)}.</span> ${opt}`;
      
      btn.addEventListener("click", () => {
        if (qState.selectedAnswerIndex === null) {
          this.handleQuizAnswer(idx);
        }
      });
      
      optionsContainer.appendChild(btn);
    });

    // 隱藏反饋與下一步按鈕
    document.getElementById("quiz-feedback-box").style.display = "none";
    document.getElementById("next-quiz-btn").style.display = "none";
    qState.selectedAnswerIndex = null;
  },

  // 處理答題
  handleQuizAnswer: function(selectedIndex) {
    const qState = this.state.quiz;
    qState.selectedAnswerIndex = selectedIndex;
    const currentQ = qState.questions[qState.currentIndex];
    const optionButtons = document.querySelectorAll("#quiz-options-container .option-btn");
    
    // 答對或答錯的視覺效果
    if (selectedIndex === currentQ.correctIndex) {
      optionButtons[selectedIndex].classList.add("correct");
      optionButtons[selectedIndex].insertAdjacentHTML('beforeend', ' <i class="fa-solid fa-circle-check" style="float: right; margin-top: 2px;"></i>');
      qState.score++;
    } else {
      optionButtons[selectedIndex].classList.add("wrong");
      optionButtons[selectedIndex].insertAdjacentHTML('beforeend', ' <i class="fa-solid fa-circle-xmark" style="float: right; margin-top: 2px;"></i>');
      
      // 標註正確答案
      optionButtons[currentQ.correctIndex].classList.add("correct");
    }

    // 禁用所有按鈕
    optionButtons.forEach(btn => btn.disabled = true);

    // 顯示解析
    const feedbackBox = document.getElementById("quiz-feedback-box");
    const feedbackText = document.getElementById("quiz-feedback-text");
    feedbackText.textContent = currentQ.explanation;
    feedbackBox.style.display = "block";

    // 顯示下一步按鈕
    const nextBtn = document.getElementById("next-quiz-btn");
    if (qState.currentIndex === 9) {
      nextBtn.innerHTML = `查看結算成果 <i class="fa-solid fa-flag-checkered"></i>`;
    } else {
      nextBtn.innerHTML = `下一題 <i class="fa-solid fa-arrow-right"></i>`;
    }
    nextBtn.style.display = "block";
  },

  // 下一題或進入結算
  nextQuizQuestion: function() {
    const qState = this.state.quiz;
    if (qState.currentIndex < 9) {
      qState.currentIndex++;
      this.renderQuizQuestion();
    } else {
      this.showQuizResult();
    }
  },

  // 結算成果
  showQuizResult: function() {
    this.state.quiz.active = false;
    const finalScore = this.state.quiz.score * 10;
    
    document.getElementById("quiz-play-screen").style.display = "none";
    document.getElementById("quiz-result-screen").style.display = "block";
    document.getElementById("quiz-final-score").textContent = finalScore;

    const msgEl = document.getElementById("quiz-final-message");
    const trophyIcon = document.querySelector(".quiz-score-card i");

    if (finalScore === 100) {
      msgEl.textContent = "太完美了！您獲得了 100 分！您是當之無愧的急救藥理大師，臨床給藥精準無誤！";
      trophyIcon.className = "fa-solid fa-trophy";
      trophyIcon.style.color = "#f59e0b"; // 金牌
    } else if (finalScore >= 80) {
      msgEl.textContent = `表現優異 (${finalScore} 分)！您對 EMT-P 藥物有非常深刻的理解，能在臨床救護中做出迅速且精確的決策！`;
      trophyIcon.className = "fa-solid fa-medal";
      trophyIcon.style.color = "#94a3b8"; // 銀牌
    } else if (finalScore >= 60) {
      msgEl.textContent = `及格！獲得了 ${finalScore} 分。基本概念健全，但建議再次複習部分高警訊藥物或稀釋步驟以策安全。`;
      trophyIcon.className = "fa-solid fa-award";
      trophyIcon.style.color = "#b45309"; // 銅牌
    } else {
      msgEl.textContent = `只獲得了 ${finalScore} 分。臨床給藥關乎人命，建議您細心研讀「藥物電子書」中的適應症與劑量，再次挑戰！`;
      trophyIcon.className = "fa-solid fa-circle-exclamation";
      trophyIcon.style.color = "#f43f5e"; // 警示
    }
  }
};

// 網頁加載完成後啟動
document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
