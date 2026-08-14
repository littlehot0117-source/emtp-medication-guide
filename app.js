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
      question: "下列何者為 Midazolam (導美康) 用於持續性癲癇重積狀態的成人常規首劑給藥劑量與途徑？",
      options: [
        "2.5 - 5 mg 緩慢靜脈注射 (IV) 或 5 - 10 mg 肌肉注射 (IM)",
        "15 mg 快速靜脈推注 (IV)",
        "0.1 mg 緩慢靜脈注射 (IV)",
        "0.5 mg 肌肉注射 (IM)"
      ],
      correctIndex: 0,
      explanation: "Midazolam 用於成人癲癇發作時，常規劑量為 2.5 - 5 mg 緩慢靜脈推注 (IV)；或使用 5 - 10 mg 肌肉注射 (IM) 或鼻腔給藥 (IN)。"
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
      question: "關於 Tramadol (曲馬多) 在本院前救護常規中的使用途徑與配製，下列何者正確？",
      options: [
        "院前僅限行深部肌肉注射 (IM)，且不需稀釋",
        "必須稀釋至 10 mL 行快速靜脈推注 (IV)",
        "與生理食鹽水混合行點滴連續滴注 (IV Infusion)",
        "為了加速起效，首選骨內針路徑 (IO) 給藥"
      ],
      correctIndex: 0,
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

    document.getElementById("modal-drug-dosage").textContent = drug.dosage;
    document.getElementById("modal-drug-route").textContent = drug.route;
    document.getElementById("modal-drug-interval").textContent = drug.interval;
    document.getElementById("modal-drug-pediatric").textContent = drug.pediatricSpecial;
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
    
    const sortedDrugs = [...EMTP_DRUGS].sort((a, b) => a.nameEn.localeCompare(b.nameEn));
    
    sortedDrugs.forEach(drug => {
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
        // 依體重給予單次推注 (如 Fentanyl, Ketamine, Tramadol)
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
          volumeEl.textContent = "慢速注射 / IM 肌肉注射";
        }
      } 
      else if (props.type === "weight_infusion" || props.type === "weight_infusion_and_pediatric") {
        // 點滴維持輸注計算 (Epinephrine mcg/min)
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
      title: "成人致命性過敏傷病患救護流程",
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
    },
    acls: {
      title: "ACLS 致命心律 (VF/pVT/PEA/Asystole) 演算法",
      subtitle: "成人致命性心律緊急救護協定對照",
      steps: [
        {
          label: "步驟 1: 確認 OHCA",
          question: "患者心肺功能停止，CPR 啟動，分析心律：",
          desc: "給予高濃度氧氣，裝上 AED / 去顫器進行心律分析。",
          choices: [
            { text: "已準備好分析心律", nextStep: 1 }
          ]
        },
        {
          label: "步驟 2: 心律分析",
          question: "去顫器分析心律，結果是否為可電擊心律 (Shockable)？",
          desc: "• <strong>可電擊心律</strong>：心室顫動 (VF) 或無脈搏心室心搏過速 (pVT)。<br>• <strong>不可電擊心律</strong>：心搏停止 (Asystole) 或無脈搏電活動 (PEA)。",
          choices: [
            { text: "是 (VF / pVT 可電擊)", nextStep: 2 },
            { text: "否 (Asystole / PEA 不可電擊)", nextStep: 4 }
          ]
        },
        {
          label: "步驟 3: 電擊與 CPR (Shockable)",
          question: "執行電擊，並立即繼續 CPR：",
          desc: "• <strong>電擊去顫</strong>：給予 1 次電擊，電擊後立即繼續 CPR，不要評估心律。<br>• <strong>建立血管路徑</strong>：進行靜脈 (IV) 或骨內針 (IO) 建立。<br>• <strong>給藥時機 (Epi)</strong>：在第 2 次電擊後，CPR 期間給予 <strong>Epinephrine 1mg IV/IO</strong>，之後每 3 - 5 分鐘給予一次。",
          choices: [
            { text: "仍為 Shockable 心律 (電擊 3 次後仍持續)", nextStep: 3 },
            { text: "心律改變 / ROSC (恢復自主心跳)", nextStep: 5 }
          ]
        },
        {
          label: "步驟 4: 抗心律不整藥物",
          question: "頑固性 VF/pVT 處置：",
          desc: "• <strong>給予 Amiodarone</strong>：首劑 <strong>300 mg IV/IO</strong> 快速推注。若仍持續，次劑可給予 150 mg。<br>• <strong>替代藥物 Lidocaine</strong>：若無 Amiodarone，給予 Lidocaine 首劑 1.0 - 1.5 mg/kg IV/IO。<br>• <strong>排除尖端扭轉型室速 (TdP)</strong>：若為 TdP 則給予 <strong>Magnesium Sulfate 1 - 2 g IV/IO</strong>。<br>• 持續尋找可逆原因 (5H5T)。",
          choices: [
            { text: "繼續急救，重新分析心律", nextStep: 1 },
            { text: "恢復自主心跳 (ROSC)", nextStep: 5 }
          ]
        },
        {
          label: "步驟 5: 非電擊心律處置 (PEA/Asystole)",
          question: "不可電擊心律處置：",
          desc: "• <strong>立即繼續 CPR</strong> 2 分鐘。<br>• <strong>儘速給予 Epinephrine 1mg IV/IO</strong>，每 3 - 5 分鐘給予一次。<br>• 考慮建立進階氣道與二氧化碳監測 (EtCO2)。<br>• 積極尋找並排除可逆原因：低體溫、低血容、酸中毒、高/低血鉀、張力性氣胸、心包填塞、毒物、血栓等。",
          choices: [
            { text: "2 分鐘 CPR 結束，重新分析心律", nextStep: 1 },
            { text: "恢復自主心跳 (ROSC)", nextStep: 5 }
          ]
        },
        {
          label: "ROSC 復甦後照護",
          question: "患者恢復自主心跳 (ROSC)！進入後續照護：",
          desc: "• <strong>呼吸管理</strong>：維持 SpO2 92 - 98%，評估氣管插管。<br>• <strong>血壓控制</strong>：維持收縮壓 > 90 mmHg (必要時給予 Epinephrine 點滴輸注)。<br>• <strong>心電圖監測</strong>：做 12 導程 ECG 評估是否為 STEMI 送往適當醫院。<br>• 執行目標溫度管理 (TTM)。",
          choices: [],
          recommendation: "進入 ROSC 照護，維持器官灌流，持續監測生命徵象送醫。"
        }
      ]
    },
    brady: {
      title: "症狀性心搏過緩演算法",
      subtitle: "成人心率 < 50 bpm 處置對照",
      steps: [
        {
          label: "步驟 1: 臨床評估",
          question: "患者心率低於 50 bpm，進行初步臨床評估：",
          desc: "評估患者是否有以下【血液動力學不穩定】的症狀？<br>1. 低血壓 (Hypotension)<br>2. 急性神智改變 (Altered Mental Status)<br>3. 休克徵象 (Signs of Shock)<br>4. 缺血性胸痛 (Ischemic Chest Pain)<br>5. 急性心力衰竭 (Acute Heart Failure)",
          choices: [
            { text: "是 (有上述任何一項不穩定狀況)", nextStep: 1 },
            { text: "否 (血液動力學穩定，無上述症狀)", nextStep: 3 }
          ]
        },
        {
          label: "步驟 2: 第一線藥物治療",
          question: "給予首劑抗膽鹼藥物治療：",
          desc: "• <strong>給予 Atropine 1mg IV/IO</strong> 快速推注。<br>• 持續給予氧氣、監測 ECG、血壓與血氧。<br>• 注意：若為二度二期 (Mobitz II) 或三度房室阻滯伴寬 QRS 波，Atropine 通常無效，應儘速考慮起搏器。",
          choices: [
            { text: "Atropine 有效且症狀改善", nextStep: 4 },
            { text: "Atropine 無效，症狀持續不穩定", nextStep: 2 }
          ]
        },
        {
          label: "步驟 3: 二線處置 (起搏與升壓藥)",
          question: "Atropine 無效，啟動二線處置：",
          desc: "以下處置可同步或選擇執行：<br>1. <strong>經皮心臟起搏器 (TCP)</strong>：立即裝設並啟動心外節律器。<br>2. <strong>Epinephrine 點滴輸注</strong>：以 2 - 10 mcg/min IV/IO 連續輸注，依血壓調整滴速。<br>3. <strong>Dopamine 點滴輸注</strong>：以 5 - 20 mcg/kg/min IV/IO 輸注。",
          choices: [],
          recommendation: "立即啟動經皮起搏 (Pacing) 或給予腎上腺素點滴輸注，持續監測並準備後送。"
        },
        {
          label: "穩定狀態觀察",
          question: "患者血液動力學穩定：",
          desc: "目前無需給予急救藥物或起搏處置。請持續監測心律、血壓，建立靜脈通路，進行 12 導程心電圖檢查，並常規送醫評估。",
          choices: [],
          recommendation: "持續觀察生命徵象，做好隨時病情變化之急救準備。"
        },
        {
          label: "治療成功",
          question: "心搏過緩已得到有效控制：",
          desc: "患者心率已恢復，不穩定症狀改善。請在送醫途中持續監視心電圖、血壓與呼吸狀態，防範心搏過緩再次復發。",
          choices: [],
          recommendation: "維持靜脈通路與持續心電圖監視，送醫交付醫療團隊。"
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

    // 啟動首次渲染
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
