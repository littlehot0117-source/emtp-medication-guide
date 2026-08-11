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
    }
  },

  // 靜態測驗問題庫
  quizPool: [
    {
      question: "下列何者為 Epinephrine (腎上腺素) 的主要藥理機轉？",
      options: [
        "主要作用於 α1, β1, β2 受體，收縮血管、增強心肌收縮力並舒張支氣管",
        "選擇性阻斷鈉離子通道，延長動作電位時間",
        "阻斷副交感神經 M 膽鹼受體，解除迷走神經對心臟的抑制",
        "特異性拮抗中樞阿片受體，恢復自主呼吸"
      ],
      correctIndex: 0,
      explanation: "Epinephrine (腎上腺素) 為擬交感神經藥物，同時興奮 α1（血管收縮）、β1（心跳加快、收縮力增強）及 β2 受體（支氣管舒張）。"
    },
    {
      question: "高級救護技術員執行心肺復甦術，對去顫無反應之 VF/pVT 時，Amiodarone (臟安) 的第一劑靜脈注射劑量為何？",
      options: [
        "150 mg",
        "300 mg",
        "1 mg",
        "6 mg"
      ],
      correctIndex: 1,
      explanation: "根據 ACLS 規範，對於 VF/pVT 頑固性心律不整，Amiodarone 的首劑推注劑量為 300 mg (通常為 2 支)；若無改善，次劑為 150 mg。"
    },
    {
      question: "下列關於 Adenosine (腺苷) 的臨床使用注意事項，何者錯誤？",
      options: [
        "半衰期極短（小於 10 秒），故需極快速推注並立即以 20 mL NS 沖水",
        "給藥時應選擇最靠近心臟的近端靜脈管路",
        "若患者有支氣管哮喘 (Asthma) 或嚴重 COPD，仍是首選且安全的藥物",
        "給藥後心電圖可能短暫出現心搏停止 (Asystole) 數秒，應向患者預先解釋"
      ],
      correctIndex: 2,
      explanation: "Adenosine 會引起顯著的支氣管平滑肌收縮，故支氣管哮喘 (Asthma) 或嚴重 COPD 患者為其相對/絕對禁忌症。"
    },
    {
      question: "在疑似有機磷農藥中毒的現場，高級救護技術員常用何種藥物進行「阿托平化」(Atropinization) 治療？",
      options: [
        "Atropine (阿托平)",
        "Naloxone (納洛酮)",
        "Sodium Bicarbonate (碳酸氫鈉)",
        "Calcium Chloride (氯化鈣)"
      ],
      correctIndex: 0,
      explanation: "Atropine 具有強大的抗膽鹼作用，有機磷中毒時需給予大劑量 (2-5 mg) Atropine 重複推注，直到氣管分泌物變乾、囉音消失為止。"
    },
    {
      question: "嚴重創傷大出血現場，TXA (斷血炎) 應於受傷後幾小時內給予，才能有效降低出血性休克患者的死亡率？",
      options: [
        "1 小時內",
        "3 小時內",
        "6 小時內",
        "12 小時內"
      ],
      correctIndex: 1,
      explanation: "CRASH-2 大型研究顯示，TXA 必須在創傷後 3 小時內給予方能降低死亡率；超過 3 小時給藥反而會增加血栓風險與死亡率。"
    },
    {
      question: "下列何種情況【不是】給予 Nitroglycerin (NTG) 舌下含片的禁忌症？",
      options: [
        "收縮壓 (SBP) 低於 90 mmHg",
        "懷疑右心室梗塞的患者",
        "24 小時內服用過 Sildenafil (威而鋼)",
        "心率每分鐘 85 次"
      ],
      correctIndex: 3,
      explanation: "NTG 禁忌症包含收縮壓 < 90 mmHg、右心室梗塞（依賴前負荷）、24小時內服用壯陽藥；心率 85 bpm 屬於正常範圍，非禁忌。"
    },
    {
      question: "當懷疑患者海洛因等阿片類藥物過量中毒，出現呼吸抑制、昏迷及針尖樣瞳孔時，應給予何種拮抗劑？",
      options: [
        "Atropine (阿托平)",
        "Naloxone (納洛酮)",
        "Midazolam (導美康)",
        "Calcium Chloride (氯化鈣)"
      ],
      correctIndex: 1,
      explanation: "Naloxone (納洛酮) 為阿片類藥物（海洛因、嗎啡、芬太尼等）的特異性競爭性拮抗劑，能迅速逆轉呼吸抑制。"
    },
    {
      question: "在高血鉀引發致命性心律不整（如心電圖正弦波形）的 OHCA 現場，給予何種藥物可以最快發揮穩定心肌細胞膜的作用？",
      options: [
        "10% Calcium Chloride (氯化鈣)",
        "Sodium Bicarbonate (碳酸氫鈉)",
        "Amiodarone (臟安)",
        "Epinephrine (腎上腺素)"
      ],
      correctIndex: 0,
      explanation: "鈣離子（如 10% 氯化鈣）能迅速穩定心肌細胞膜電位，拮抗高血鉀引起的心臟毒性，一般於 2-5 分鐘內起效。"
    },
    {
      question: "兒科心肺功能停止 (OHCA) 現場給予 Epinephrine (1:10,000) 的靜脈/骨內注射劑量為何？",
      options: [
        "0.1 mg/kg (即 1:10,000 稀釋液 1 mL/kg)",
        "0.01 mg/kg (即 1:10,000 稀釋液 0.1 mL/kg)",
        "1 mg 固定劑量",
        "0.5 mg 固定劑量"
      ],
      correctIndex: 1,
      explanation: "兒科 CPR 的腎上腺素劑量為 0.01 mg/kg。若使用 1:10,000 稀釋液（0.1 mg/mL），對應容積即為 0.1 mL/kg。"
    },
    {
      question: "有關 Magnesium Sulfate (硫酸鎂) 在心肺停止現場的適應症，主要是針對哪一種心律不整？",
      options: [
        "心室顫動 (VF)",
        "尖端扭轉型心室心搏過速 (Torsades de Pointes / TdP)",
        "無脈搏電活動 (PEA)",
        "心搏停止 (Asystole)"
      ],
      correctIndex: 1,
      explanation: "硫酸鎂是治療尖端扭轉型心室心搏過速 (TdP) 的首選藥物，能穩定心肌細胞膜，防止致命的心室顫動發生。"
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
    const closeDetail = document.getElementById("close-modal-btn");
    const detailModal = document.getElementById("drug-detail-modal");
    
    closeDetail.addEventListener("click", () => {
      detailModal.classList.remove("active");
    });
    
    // 點擊背景關閉
    detailModal.addEventListener("click", (e) => {
      if (e.target === detailModal) {
        detailModal.classList.remove("active");
      }
    });

    // 免責聲明事件
    const discModal = document.getElementById("disclaimer-modal");
    const closeDisc = document.getElementById("close-disclaimer-btn");
    const acceptDisc = document.getElementById("accept-disclaimer-btn");
    const openDisc = document.getElementById("open-disclaimer-btn");

    closeDisc.addEventListener("click", () => {
      discModal.classList.remove("active");
    });

    acceptDisc.addEventListener("click", () => {
      localStorage.setItem("emtp_disclaimer_accepted", "true");
      discModal.classList.remove("active");
      this.showToast("條款已同意，感謝您的使用！");
    });

    openDisc.addEventListener("click", () => {
      discModal.classList.add("active");
    });
    
    // 筆記儲存按鈕
    const saveNoteBtn = document.getElementById("save-notes-btn");
    saveNoteBtn.addEventListener("click", () => {
      const drugId = saveNoteBtn.getAttribute("data-drug-id");
      const noteText = document.getElementById("modal-notes-area").value.trim();
      
      if (drugId) {
        if (noteText) {
          this.state.notes[drugId] = noteText;
        } else {
          delete this.state.notes[drugId];
        }
        this.saveLocalStorage();
        this.showToast("臨床筆記儲存成功！");
        
        // 若在書籤頁面，需重新渲染筆記列表
        if (this.state.currentSection === "bookmarks-section") {
          this.renderBookmarksSection();
        }
      }
    });
  },

  // 導覽選單初始化
  initNavigation: function() {
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".page-section");
    const pageTitle = document.getElementById("page-title");
    const searchContainer = document.getElementById("global-search-container");

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

  // 分類篩選按鈕初始化
  initFilters: function() {
    const pills = document.querySelectorAll(".filter-pill");
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        
        this.state.activeCategory = pill.getAttribute("data-category");
        this.renderDrugList(document.getElementById("search-input").value.toLowerCase().trim());
      });
    });
  },

  // 渲染主藥物列表
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
          <div class="dosage-peek">${drug.adultDosage.split('\n')[0].replace('• ', '')}</div>
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
    let bookmarked = false;

    if (index > -1) {
      this.state.bookmarks.splice(index, 1);
      buttonEl.classList.remove("active");
      buttonEl.querySelector("i").className = "fa-regular fa-star";
      this.showToast("已從書籤中移除");
    } else {
      this.state.bookmarks.push(drugId);
      buttonEl.classList.add("active");
      buttonEl.querySelector("i").className = "fa-solid fa-star";
      this.showToast("已加入我的書籤");
      bookmarked = true;
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

    document.getElementById("modal-drug-mechanism").textContent = drug.mechanism;
    document.getElementById("modal-drug-adult").textContent = drug.adultDosage;
    document.getElementById("modal-drug-pediatric").textContent = drug.pediatricDosage;
    document.getElementById("modal-drug-prep").textContent = drug.preparation;

    // 填充清單型資料
    const renderList = (elementId, array) => {
      const container = document.getElementById(elementId);
      container.innerHTML = "";
      array.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        container.appendChild(li);
      });
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

  // 渲染書籤頁面
  renderBookmarksSection: function() {
    const markedList = document.getElementById("bookmarked-drugs-list");
    const emptyView = document.getElementById("bookmarks-empty-view");
    markedList.innerHTML = "";

    const bookmarkedDrugs = EMTP_DRUGS.filter(d => this.state.bookmarks.includes(d.id));
    bookmarkedDrugs.sort((a, b) => a.nameEn.localeCompare(b.nameEn));

    if (bookmarkedDrugs.length === 0) {
      emptyView.style.display = "flex";
      markedList.style.display = "none";
    } else {
      emptyView.style.display = "none";
      markedList.style.display = "grid";

      bookmarkedDrugs.forEach(drug => {
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
            <div class="dosage-peek">${drug.adultDosage.split('\n')[0].replace('• ', '')}</div>
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

        markedList.appendChild(card);
      });
    }

    // 渲染心得列表
    const notesContainer = document.getElementById("saved-notes-list");
    notesContainer.innerHTML = "";

    const notesIds = Object.keys(this.state.notes);
    notesIds.sort((a, b) => {
      const drugA = EMTP_DRUGS.find(d => d.id === a);
      const drugB = EMTP_DRUGS.find(d => d.id === b);
      if (!drugA) return 1;
      if (!drugB) return -1;
      return drugA.nameEn.localeCompare(drugB.nameEn);
    });
    if (notesIds.length === 0) {
      notesContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">目前尚無撰寫的臨床備忘錄。</p>`;
      return;
    }

    notesIds.forEach(id => {
      const drug = EMTP_DRUGS.find(d => d.id === id);
      if (!drug) return;

      const noteCard = document.createElement("div");
      noteCard.className = "note-item-card";
      noteCard.innerHTML = `
        <div class="note-item-header">
          <span class="note-item-title">${drug.nameEn} (${drug.nameZh})</span>
          <button class="disclaimer-btn" onclick="app.showDrugDetail('${drug.id}')" style="color: var(--color-accent);">查看藥物</button>
        </div>
        <div class="note-item-body">${this.state.notes[id]}</div>
      `;
      notesContainer.appendChild(noteCard);
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
    
    EMTP_DRUGS.forEach(drug => {
      const opt = document.createElement("option");
      opt.value = drug.id;
      opt.textContent = `${drug.nameEn} (${drug.nameZh})`;
      select.appendChild(opt);
    });
  },

  // 精確執行劑量計算
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
      targetDoseEl.textContent = drug.adultDosage;
      volumeLabelEl.textContent = "給藥途徑";
      volumeEl.textContent = "口服嚼服";
      return;
    }

    // 計算主體
    if (isPediatric) {
      // ===== 兒科計算分支 =====
      if (props.pediatricOhcaDosePerKg) {
        let calculatedDose = props.pediatricOhcaDosePerKg * weight;
        let unit = drug.id === "sodium_bicarb" ? "mEq" : "mg";
        
        // 限幅最大兒科劑量
        if (props.maxPediatricDose && calculatedDose > props.maxPediatricDose) {
          calculatedDose = props.maxPediatricDose;
        }

        targetDoseEl.textContent = `${calculatedDose.toFixed(2)} ${unit} (推薦: ${props.pediatricOhcaDosePerKg} ${unit}/kg)`;

        // 若有 mgPerMl 參數，換算 ml 體積
        if (props.mgPerMl) {
          let calculatedVol = calculatedDose / props.mgPerMl;
          volumeLabelEl.textContent = "建議給藥體積 (容積)";
          volumeEl.textContent = `${calculatedVol.toFixed(2)} mL`;
        } else if (drug.id === "epinephrine") {
          // Epinephrine 1:10000 為 0.1 mL/kg
          let calculatedVol = 0.1 * weight;
          volumeLabelEl.textContent = "建議 1:10,000 稀釋液體積";
          volumeEl.textContent = `${calculatedVol.toFixed(1)} mL`;
        } else {
          volumeLabelEl.textContent = "給藥路徑";
          volumeEl.textContent = "靜脈 / 骨內注射 (IV/IO)";
        }
      } else {
        // 該藥物無標準兒科劑量或兒科禁忌
        targetDoseEl.textContent = "兒科院前不推薦或無推薦劑量";
        targetDoseEl.className = "result-value danger";
        volumeLabelEl.textContent = "安全警示";
        volumeEl.textContent = "請遵循在線醫療控制醫師指示";
        volumeEl.className = "result-value danger";
      }
    } else {
      // ===== 成人計算分支 =====
      targetDoseEl.className = "result-value";
      volumeEl.className = "result-value";

      if (props.type === "weight_bolus") {
        // 依體重給予單次靜脈推注 (如 Fentanyl 1.5 mcg/kg, Ketamine 1.5 mg/kg)
        let calculatedDose = props.standardDosePerKg * weight;
        let doseUnit = props.doseUnit;
        
        // 限制成人最大單次劑量
        if (props.maxSingleDose && calculatedDose > props.maxSingleDose) {
          calculatedDose = props.maxSingleDose;
        }

        targetDoseEl.textContent = `${calculatedDose.toFixed(1)} ${doseUnit} (${props.standardDosePerKg} ${doseUnit}/kg)`;
        
        // 劑量換算容積
        if (props.mgPerMl) {
          let finalDoseMg = doseUnit === "mcg" ? calculatedDose / 1000 : calculatedDose;
          let calculatedVol = finalDoseMg / props.mgPerMl;
          volumeLabelEl.textContent = "精確注射容積 (原液)";
          volumeEl.textContent = `${calculatedVol.toFixed(2)} mL`;
        } else {
          volumeLabelEl.textContent = "途徑";
          volumeEl.textContent = "IV/IO 慢速注射";
        }
      } 
      else if (props.type === "weight_infusion" || props.type === "weight_infusion_and_pediatric") {
        // 點滴維持輸注計算 (Dopamine mcg/kg/min, Epinephrine mcg/min)
        const userInfRate = parseFloat(document.getElementById("infusion-dose-rate").value) || 0;
        
        targetDoseEl.textContent = `${userInfRate} ${props.infusionUnit}`;
        
        // 計算滴速
        // Dopamine 公式: Rate(mL/hr) = (mcg/kg/min * kg * 60 min) / 濃度(mcg/mL)
        // Epinephrine 公式: Rate(mL/hr) = (mcg/min * 60 min) / 濃度(mcg/mL)
        let rateMlHr = 0;
        let concentrationMcgMl = 0;

        if (drug.id === "dopamine") {
          concentrationMcgMl = 800; // 200mg in 250ml = 800mcg/ml
          rateMlHr = (userInfRate * weight * 60) / concentrationMcgMl;
        } else if (drug.id === "epinephrine") {
          concentrationMcgMl = 4; // 1mg in 250ml = 4mcg/ml
          rateMlHr = (userInfRate * 60) / concentrationMcgMl;
        } else if (drug.id === "nitroglycerin") {
          concentrationMcgMl = 200; // 50mg in 250ml = 200mcg/ml
          rateMlHr = (userInfRate * 60) / concentrationMcgMl;
        } else if (drug.id === "lidocaine") {
          concentrationMcgMl = 4000; // 1g in 250ml = 4mg/ml = 4000mcg/ml
          rateMlHr = (userInfRate * weight * 60) / concentrationMcgMl;
        }

        // 精密微量滴數 (60 gtt/mL) 時, mL/hr = drops/min (gtt/min)
        const dropsMin = rateMlHr;

        volumeLabelEl.textContent = "滴速計算結果 (精密輸液 60 gtt/mL)";
        volumeEl.innerHTML = `${rateMlHr.toFixed(1)} mL/hr <span class="result-badge">${dropsMin.toFixed(0)} 滴/分</span>`;
      } 
      else {
        // 剩餘的是固定成人給藥的藥物
        targetDoseEl.textContent = drug.adultDosage.split('\n')[0].replace('• ', '');
        volumeLabelEl.textContent = "臨床提示";
        volumeEl.textContent = "固定劑量給藥，不需依體重調整";
      }
    }
  },

  // ==================== 急救流程圖控制 ====================
  initProtocolsView: function() {
    const btnAcls = document.getElementById("proto-btn-acls");
    const btnBrady = document.getElementById("proto-btn-brady");
    const cardAcls = document.getElementById("proto-acls-card");
    const cardBrady = document.getElementById("proto-brady-card");

    btnAcls.addEventListener("click", () => {
      btnAcls.classList.add("active");
      btnBrady.classList.remove("active");
      cardAcls.style.display = "block";
      cardBrady.style.display = "none";
    });

    btnBrady.addEventListener("click", () => {
      btnBrady.classList.add("active");
      btnAcls.classList.remove("active");
      cardBrady.style.display = "block";
      cardAcls.style.display = "none";
    });
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
    // 隨機洗牌，選 10 題
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

    // 隱藏解析與下一步按鈕
    document.getElementById("quiz-feedback-box").style.display = "none";
    document.getElementById("next-quiz-btn").style.display = "none";
    qState.selectedAnswerIndex = null;
  },

  // 處理答題
  handleQuizAnswer: function(selectedIndex) {
    const qState = this.state.quiz;
    const currentQ = qState.questions[qState.currentIndex];
    qState.selectedAnswerIndex = selectedIndex;

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
