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
          pageTitle.textContent = "急救流程";
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
      title: "成人緩脈與頻脈救護流程 (115.03 決議)",
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
    ,
    trauma: {
      title: "「創傷」救護流程 (115.03.20 決議)",
      subtitle: "嘉義縣消防局緊急醫療救護協定對照",
      steps: [
        {
          label: "步驟 1: 現場評估與外出血控制",
          question: "接獲創傷患者，進行現場初步評估與止血處置：",
          desc: "• **初步評估與急救**：控制外出血、保護頸椎、詢問主訴、執行初步評估與急救 [註1]。<br>• **止血原則**：使用「直接加壓止血」及「包紮止血」等方式。如果肢體處經外出血控制後依然持續出血，得考慮使用**止血帶**（到院需主動告知醫護人員綁上時間與部位）[註1]。",
          choices: [
            { text: "完成止血與初步評估，進行下一步", nextStep: 1 }
          ],
          guidelines: "<strong>【註1: 外出血控制】</strong><br>1. 外出血控制是指使用「直接加壓止血」及「包紮止血」等止血方式。<br>2. 如果肢體處經外出血控制後依然持續出血，得考慮使用止血帶.使用後救護技術員應於到院時主動告知醫護人員，傷患使用止血帶之肢體及綁上止血帶的時間。<br>3. 「得考慮」文意：係指救護技術員在時間允許下得依現場情況、患者傷情、處置能力（如現場救護人力、裝備等）等綜合考量後判斷是否實施該項急救處置。"
        },
        {
          label: "步驟 2: 機轉與病史詢問",
          question: "了解受傷機轉與病史詢問：",
          desc: "• 評估患者是否符合**重大創傷指標** [註2]（如 GCS < 13、收縮壓 < 90 mmHg、呼吸次數 < 10 或 >= 30 次/分、穿刺傷或重物輾壓、嚴重骨折、截肢、高能量撞擊、高處墜落 >= 6公尺、特殊狀況如懷孕 > 20周等）。",
          choices: [
            { text: "完成機轉與病史評估，進行下一步", nextStep: 2 }
          ],
          guidelines: "<strong>【註2: 重大創傷患者指標】</strong><br>1. 昏迷指數 GCS < 13 分。<br>2. 收縮壓 < 90 mmHg。<br>3. 呼吸次數 < 10 次或 >= 30 次或未給氧時血氧值 < 90%。<br>4. 頭、頸、軀幹、上臂或大腿之穿刺傷或重物輾壓傷。<br>5. 嚴重骨折：多於 1 處長骨骨折、連枷胸、骨盆骨折、開放性或凹陷性顱骨折。<br>6. 手腕或腳踝以上截肢性外傷。<br>7. 肢體癱瘓。<br>8. 墜落高度相當於 2 層樓頂或 6 公尺以上。<br>9. 高能量撞擊之證據：汽機車車速 >= 50 km/h、內部乘員空間凹陷 >= 30cm、同車有人死亡、被彈出車外、行人或騎士被高速汽機車撞擊/輾壓/彈飛。<br>10. 爆炸傷。<br>11. 特殊病患及狀況：懷孕超過 20 周、病患有出血性疾病或服用抗凝血劑。<br>12. 燒燙傷（2度18%以上/3度10%以上/顏面或會陰）且合併其它創傷者。"
        },
        {
          label: "步驟 3: 高危險機轉與休克評估",
          question: "評估患者是否有高危險機轉或出血性休克徵候？",
          desc: "• <strong>出血性休克徵候</strong> [註3]：心跳加快 (>= 100 次/分鐘)、呼吸加快、濕冷的皮膚、意識改變、血壓降低、臉色蒼白。",
          choices: [
            { text: "是 (有高危險機轉或休克徵候)", nextStep: 3 },
            { text: "否 (完全無上述休克指標)", nextStep: 4 }
          ],
          guidelines: "<strong>【註3: 出血性休克徵候】</strong><br>心跳加快(>= 100 次/分鐘)、呼吸加快、濕冷的皮膚、意識改變、血壓降低、臉色蒼白。"
        },
        {
          label: "步驟 4: 休克進階處置 (靜脈輸液/骨針/TXA)",
          question: "患者處於出血性休克狀態，實施休克急救：",
          desc: "• **靜脈管路與輸液**：建立有 18 號以上大口徑靜脈管路，體重 >= 40kg 輸注生理食鹽水 1L（或維持 SBP >= 90-100mmHg，有頭部外傷提高至 100-110mmHg）；體重 < 40kg 給予 20 mL/kg [註4]。<br>• **骨內輸液 (IO)**：嘗試靜脈通路 1 次失敗後，可考慮建立骨內管路 [註5] (T2 僅限於 TP 在現場且須給藥時始得操作)。<br>• **傳明酸滴注 (P)**：高級救護技術員考慮給予 **Tranexamic acid (TXA) 1000 mg** 加入生理食鹽水，滴注約 10 分鐘（創傷發生 3 小時內，且無法經由壓迫止血之創傷出血性休克）[註6]。",
          choices: [
            { text: "已完成休克處置，進行下一步", nextStep: 4 }
          ],
          guidelines: "<strong>【註4: 大口徑靜脈輸液】</strong><br>體重 >= 40kg 輸液治療為最初給予 1 公升，或維持收縮壓在至少 90-100mmHg (有頭部外傷可提高至 100-110mmHg) 以上即可。如果目視體重 < 40kg，則每公斤體重給予 20 mL 的輸液，得重複一次。<br><strong>【註5: 骨內管路 (IO)】</strong><br>高級救護技術員若經嘗試建立靜脈路徑 1 次無法成功，可考慮建立骨內輸液管路。<br><strong>【註6: TXA 使用細節】</strong><br>適應症為創傷發生 3 小時以內，且無法經由壓迫止血之創傷出血性休克（如穿刺傷或高度懷疑胸腹骨盆腔內出血）。禁忌症為正接受 (凝血酶 thrombin) 止血藥給藥的患者、對其過敏者。使用劑量：抽取 1000 mg TXA，滴注時間約 10 分鐘。"
        },
        {
          label: "步驟 5: 固定與保護 (頸圈/長背板)",
          question: "評估是否需要肢體固定及使用頸圈、長背板：",
          desc: "• **頸圈使用時機**：符合「老、大、頭、昏、變、麻、機」任何一項指標，必須使用頸圈限制移動並保護頸椎 [註7]。<br>• **長背板使用時機**：疑似頸椎、胸椎、腰椎損傷或生命徵象不穩定之肢體骨折 [註7]。<br>• **運送姿勢**：以配戴硬式頸圈合併半坐臥或是平躺姿勢送醫為原則，提醒患者避免搖晃頭部並使用固定帶 [註7]。",
          choices: [
            { text: "固定處置完成，進行下一步", nextStep: 5 }
          ],
          guidelines: "<strong>【註7: 頸圈與長背板評估指標】</strong><br>• **老**：老年人（>= 65 歲肩頸外傷疼痛）。<br>• **大**：身上有明顯大傷（長骨/骨盆骨折）。<br>• **頭**：頭頸明顯外傷或疼痛。<br>• **昏**：意識不清 (GCS 非滿分)。<br>• **變**：脊椎有明顯變形。<br>• **麻**：神經學異常（肢體發麻或無力）。<br>• **機**：危險受傷機轉（墜落 >= 2公尺、跳水、高速減速 >= 50km/h、拋出車外、翻車）。<br>• **長背板時機**：疑頸椎受傷、胸腰椎損傷、生命徵象不穩定之肢體骨折。無上述脊椎傷害證據或清醒能自行走者得不用。"
        },
        {
          label: "步驟 6: 初評處置完成與進階氣胸評估",
          question: "完成初步評估與處置，進行創傷超音波與氣胸排除：",
          desc: "• **外傷超音波 EFAST (P)**：高級救護技術員考慮操作創傷超音波 EFAST，評估是否有胸腔/腹腔/心包膜出血或氣胸 [註8]。<br>• **針刺減壓 (P)**：若有張力性氣胸徵象（胸部外傷且有皮下氣腫、嚴重呼吸窘迫、患側呼吸音消失、SBP < 90mmHg），得申請線上指導使用**針刺減壓法** [註9]。",
          choices: [
            { text: "進階氣胸評估完成，進行下一步", nextStep: 6 }
          ],
          guidelines: "<strong>【註8: 外傷超音波 EFAST】</strong><br>當懷疑體腔出血、氣胸或其他急症（如主動脈剝離），得於院前操作超音波尋找游離液體/空氣，依病況決定是否施予進階處置或改變後送醫院。<br><strong>【註9: 針刺減壓法】</strong><br>適應症為患者 >= 18 歲且有胸部外傷併皮下氣腫、嚴重呼吸衰竭、患側呼吸音變小/聽不到、收縮壓 < 90mmHg、EFAST顯示游離空氣。針刺減壓法：使用至少 8 公分大號針頭 (10-16 號) 由第 5 肋間與腋中線前緣交叉點，或鎖骨中線及第 2 肋間交叉點沿第 3 肋骨上緣與胸壁成 90 度扎入，感覺阻力消失 (Pop) 拔出針芯，將軟管留在原位固定持續排氣。"
        },
        {
          label: "步驟 7: 到院前疼痛評估與止痛",
          question: "到院前完成二度評估與疼痛控制：",
          desc: "• **二度評估**：到院前完成二度評估，對清醒且能自我表達的創傷患者進行疼痛評估 (使用 NRS 或 VAS 量表) [註10]。<br>• **到院前止痛 (P)**：因急性外傷導致疼痛、GCS >= 14 且**無頭部創傷或休克**者，VAS 評估 6-10 分或重度疼痛，高級技術員考慮給予 **Tramadol 50 mg IM 肌肉緩慢注射**（限年齡 >= 18 歲）[註 11]。",
          choices: [
            { text: "疼痛評估與給藥完成，進行下一步", nextStep: 7 }
          ],
          guidelines: "<strong>【註10: 疼痛評估】</strong><br>評估包含哪裡痛、怎麼痛、疼痛時間、疼痛程度。9 歲以上採用 0-10 數字評定量表 (NRS)；3-8 歲採用臉譜量表。<br><strong>【註11: 到院前止痛 Tramadol】</strong><br>• 劑量：年齡 >= 18 歲，50mg 肌肉緩慢注射。注意不可靜脈注射以防副作用。<br>• 副作用：注射後約 15 分鐘產生藥效，可能出現頭暈、噁心及嘔吐。<br>• 禁忌症：對其過敏者。<br>• 給藥後 10 分鐘應在送醫途中再次評估疼痛程度並記錄，到院後主動向醫護交班劑量與改善狀況。<br>• 管制藥管理：雙人複誦、箱櫃上鎖、每日清點與記錄。"
        },
        {
          label: "步驟 8: 選擇適當醫院與送醫",
          question: "選擇適當醫院並後送：",
          desc: "• **醫院選擇**：若傷患符合重大創傷指標，中級以上技術員得考慮將傷患送往**創傷中心**或有**創傷小組**之急救責任醫院 [註12]。<br>• **送醫照護**：送醫途中全程監視心律，密切注意患者生命徵象 [註6]。",
          choices: [],
          recommendation: "依重大創傷協定後送至創傷責任醫院，到院主動向醫護交班止血帶綁上時間、TXA劑量、Tramadol 止痛時間與疼痛變化。",
          guidelines: "<strong>【註12: 重大創傷後送醫院】</strong><br>符合重大創傷指標之患者，中級以上技術員得考慮送往創傷中心或有創傷小組之急救責任醫院，以爭取黃金搶救時間。"
        }
      ]
    }
    ,
    ohca: {
      title: "成人「無脈搏」救護流程 (115.03.20 決議)",
      subtitle: "嘉義縣消防局緊急醫療救護協定對照",
      steps: [
        {
          label: "步驟 1: 評估無意識與適當呼吸",
          question: "評估病患是否無意識及無適當呼吸，並觸摸頸動脈：",
          desc: "• <strong>初步檢查</strong>：確認患者是否有自主意識與呼吸。<br>• <strong>摸頸動脈</strong>：檢查是否摸得到頸動脈？ [註1]",
          choices: [
            { text: "是 (摸得到頸動脈)", nextStep: 1 },
            { text: "否 (摸不到頸動脈)", nextStep: 2 }
          ],
          guidelines: "<strong>【要旨與說明】</strong><br>本流程註解內*之操作僅限於本局高級救護隊、專責救護隊或經考核通過之 EMT-P 操作。<br><strong>【註1: 高品質心肺復甦術(HPCPR)】</strong><br>• 進行高品質心肺復甦術(HPCPR)：用力壓、快快壓、胸回彈、莫中斷。<br>• 以自動心臟電擊器 (AED) 或手動去顫器評估心律。<br>• 若現場有機械式胸外按壓儀器 (mCPR)，得考慮架設 mCPR 以節省人力。<br>• 「得考慮」文意：係指救護技術員在時間允許下得依現場情況、患者傷情、處置能力等綜合考量後判斷是否實施該項急救處置。"
        },
        {
          label: "步驟 2: 給予 BVM 與復甦治療",
          question: "患者摸得到頸動脈，給予支持性復甦治療：",
          desc: "• **復甦處置**：給予袋瓣式甦醒球 (BVM) 通氣與呼吸支持，評估並尋找發病原因。",
          choices: [],
          recommendation: "依有脈搏傷病患救護流程進行處置與送醫。"
        },
        {
          label: "步驟 2: 啟動 CPR 與心律分析",
          question: "開始高品質 CPR 並連接去顫器分析心律：",
          desc: "• **心律分析結果為？** [註1]",
          choices: [
            { text: "VF / pVT (可電擊心律)", nextStep: 3 },
            { text: "Asystole / PEA (不可電擊心律)", nextStep: 7 }
          ]
        },
        {
          label: "步驟 3: 第 1 次去顫電擊 (Shockable)",
          question: "執行第 1 次去顫電擊，電擊後立即 CPR：",
          desc: "• <strong>去顫電擊</strong>：執行第 1 次去顫電擊 (AED 或手動)。<br>• **電擊後處置**：立即 CPR 2 分鐘，建立呼吸道，並監視 ETCO2 [註2]。<br>• **建立給藥路徑 (P)**：高級技術員於周邊血管建立 IV/IO 給藥路徑 [註3]。",
          choices: [
            { text: "2 分鐘 CPR 結束，重新分析心律", nextStep: 4 }
          ],
          guidelines: "<strong>【註2: SGA 與 ETCO2】</strong><br>• 繼續 HPCPR。置入聲門上呼吸道 (SGA) 後，得同時持續胸部按壓及每 6 秒給予 1 次通氣。SGA/輔助呼吸道置入不應干擾 CPR 與 AED 分析電擊。<br>• 建立進階/確切呼吸道後，若有監測儀，考慮使用以監測潮氣末二氧化碳 (ETCO2) 數值。若監測 ETCO2 < 10mmHg，應注意改善 CPR 品質。<br><strong>【註3: 周邊血管路徑與骨針】</strong><br>• 高級技術員在場時、得考慮於周邊血管建立給藥路徑 (IV 或 IO)。<br>• 骨針 (IO)：若嘗試建立靜脈路徑 1 次無法成功或研判難以執行，且患者無下針處感染/燒傷、下針肢體骨折、曾受手術、骨質疏鬆等禁忌症，TP 得考慮建立骨針注射給藥。T2 僅限於 TP 在場且須給藥時，始得操作骨針。"
        },
        {
          label: "步驟 4: 可電擊心律評估 (第 2 次)",
          question: "評估第 2 次心律分析結果是否仍為可電擊心律？",
          desc: "分析心律為 VF/pVT，或是已轉為不可電擊心律/ROSC [註4]？",
          choices: [
            { text: "是 (仍為可電擊心律 VF/pVT)", nextStep: 5 },
            { text: "否 (不可電擊心律 或 ROSC)", nextStep: 10 }
          ],
          guidelines: "<strong>【註4: 流程銜接說明】</strong><br>分析心律結果為不可電擊心律、或為心律改變，應檢查頸動脈：若為 Asystole/PEA 接續不可電擊流程；若恢復自發性循環 ROSC 則接續復甦後照護流程。"
        },
        {
          label: "步驟 5: 第 2 次去顫電擊",
          question: "執行第 2 次去顫電擊，電擊後立即 CPR：",
          desc: "• <strong>去顫電擊</strong>：給予第 2 次去顫電擊 (AED 或手動)。<br>• **電擊後處置**：立即 CPR 2 分鐘，架設 mCPR [註5]。<br>• **藥物與進階氣道 (P)**：給予 <strong>Epinephrine 1mg IV/IO</strong>（每 3-5 分鐘重複），並進行進階呼吸道處置與 ETCO2 監測 [註6]。",
          choices: [
            { text: "2 分鐘 CPR 結束，重新分析心律", nextStep: 6 }
          ],
          guidelines: "<strong>【註5: 機械式按壓機 mCPR】</strong><br>若有 mCPR 機，得考慮架設 mCPR，應在離開現場前架設完畢後離場。使用後，注意每兩分鐘重新評估心律與脈搏。<br><strong>【註6: Epinephrine 給藥與氣道】</strong><br>高級技術員建立給藥路徑完成後，盡早給予 Epinephrine 1mg 靜脈或骨內推注，且持續每 3-5 分鐘重複。得考慮建立確切呼吸道如氣管內管，但最多嘗試 1 次，若失敗應採用其他呼吸道處置。"
        },
        {
          label: "步驟 6: 可電擊心律評估 (第 3 次)",
          question: "評估第 3 次心律分析結果是否仍為可電擊心律？",
          desc: "分析心律為 VF/pVT，或是已轉為不可電擊心律/ROSC？",
          choices: [
            { text: "是 (仍為可電擊心律 VF/pVT)", nextStep: 9 },
            { text: "否 (不可電擊心律 或 ROSC)", nextStep: 10 }
          ]
        },
        {
          label: "步驟 2: 不可電擊心律處置 (Asystole/PEA)",
          question: "心律分析為 Asystole/PEA，盡早給予藥物：",
          desc: "• **盡早給藥 (P)**：盡早給予首劑 <strong>Epinephrine 1mg IV/IO</strong>，並每 3-5 分鐘重複。<br>• **急救處置**：CPR 2 分鐘，建立呼吸道與監測 ETCO2 [註2]，架設 mCPR [註5]。<br>• **進階處置 (P)**：高級技術員建立給藥路徑，進行進階呼吸道處置與監測 [註6]。",
          choices: [
            { text: "2 分鐘 CPR 結束，評估心律", nextStep: 8 }
          ]
        },
        {
          label: "步驟 3: Asystole/PEA 心律評估",
          question: "評估 CPR 2 分鐘後的分析心律是否轉為可電擊心律？",
          desc: "分析心律是否轉為可電擊心律 (VF/pVT) [註8]？",
          choices: [
            { text: "是 (轉為可電擊心律 VF/pVT)", nextStep: 3 },
            { text: "否 (仍為不可電擊心律 或 ROSC)", nextStep: 10 }
          ],
          guidelines: "<strong>【註8: 流程接續】</strong><br>不可電擊心律如果轉為可電擊心律，接續流程實施電擊去顫，接續完成未完成之程序。"
        },
        {
          label: "步驟 7: 第 3 次去顫電擊與給藥",
          question: "執行第 3 次去顫電擊，電擊後立即 CPR：",
          desc: "• <strong>去顫電擊</strong>：給予第 3 次去顫電擊 (AED 或手動)。<br>• **電擊後處置**：立即 CPR 2 分鐘，架設 mCPR [註5]。<br>• **抗心律不整藥物 (P)**：高級技術員考慮給予 <strong>Amiodarone 300mg IV/IO push</strong>。若 2 分鐘後仍為可電擊心律，可考慮再給予 150mg push [註7]。",
          choices: [
            { text: "2 分鐘 CPR 結束，評估 ROSC", nextStep: 10 }
          ],
          guidelines: "<strong>【註7: Amiodarone 與頑固心律處置】</strong><br>• 電擊 3 次後，EMT-P 得考慮 Amiodarone 300mg IV/IO 推注，持續 CPR，若 2 分鐘後仍為可電擊心律，考慮追加 150mg。<br>• 頑固性 VF/pVT：在器材允許且不影響 CPR 下，得考慮操作 Vector change (VC) 去顫或雙重連續型去顫電擊 (DSED)，需通過線上指導始得進行。"
        },
        {
          label: "步驟 8: 評估自主循環恢復 (ROSC)",
          question: "評估病患是否已恢復自發性循環 (ROSC)？",
          desc: "• **評估指標** [註9]：觸摸是否有自發性脈搏或血壓、恢復自發性適當呼吸、無胸外按壓時出現持續性自主活動、ETCO2 遽增且能維持 40mmHg 以上。",
          choices: [
            { text: "是 (恢復自主循環 ROSC)", nextStep: 11 },
            { text: "否 (未恢復自主循環)", nextStep: 12 }
          ],
          guidelines: "<strong>【註9: ROSC 定義】</strong><br>恢復自發性循環 (ROSC) 符合下列之一：1. 恢復自發性脈搏或血壓。 2. 恢復自發性適當呼吸。 3. 無胸外按壓時仍有持續性的可自主活動。 4. 若已建立進階氣道且有 ETCO2 監測時，ETCO2 遽增且能維持 40mmHg 以上。"
        },
        {
          label: "復甦後照護 (ROSC Care)",
          question: "執行復甦後照護 (ROSC Care) 與通氣控制：",
          desc: "• **通氣支持**：無適當呼吸者給予正壓給氧，有適當呼吸者給予非再吸入面罩 [註10]。氣管內管不可輕易拔除。<br>• **給氧規格**：給氧速率每 6 秒 1 次，每次 1 秒且胸部起伏，SpO2 >= 90%，若有監測，維持 ETCO2 於 35~45 mmHg [註10]。<br>• **後送**：儘速送醫。",
          choices: [],
          recommendation: "依 ROSC 後照護流程送醫，持續監測生命徵象與心律，隨時防範再次心跳停止。",
          guidelines: "<strong>【註10: 復甦後照護細則】</strong><br>• 無適當呼吸或呼吸動力不足，給予正壓給氧；有適當呼吸則給予非再吸入式面罩。<br>• 如病人有放置氣管內管，即便有嘔吐反射，亦不可輕易拔管，因病人不穩定，有可能隨時再心肺功能停止。<br>• 給氧速率為每 6 秒給氧 1 次，每次 1 秒且胸部有起伏，SPO2 >= 90%。若有 ETCO2 監測，使 ETCO2 維持在 35~45mmHg。<br>• 儘速送醫。"
        },
        {
          label: "送醫途中與車內照護",
          question: "快速後送與車內監測處置：",
          desc: "• **車內照護**：持續 CPR、正壓給氧與監測，AED 全程開啟監測，每 3-5 分鐘重複 Epinephrine 1mg [註11]。<br>• **啟動葉克膜 (ECPR)**：若病患符合「Bystander CPR、初始可電擊、無臥床或末期疾病、年齡 70 歲以下」，可在無線電中向醫院請求啟動**葉克膜小組** [註11]。",
          choices: [],
          recommendation: "送送醫途中全時監視心律，回報指揮中心。若病患符合 ECPR 啟動的 4 大黃金標準，請主動透過無線電向接收醫院通報啟動「葉克膜小組」！",
          guidelines: "<strong>【註11: 送醫車內照護與葉克膜】</strong><br>• 送醫途中車內照護：持續 CPR、正壓給氧與生命徵象監測，救護人員得考慮於 AED 分析心律的同時檢查脈搏。<br>• AED 應於送醫中途全程開啟以監測心律，若有建議電擊則實施去顫。<br>• 若 EMT-P 在後艙則持續 3-5 分鐘重複給予 Epinephrine 1mg 靜脈或骨內推注。回報救災救護指揮中心。<br>• 院前啟動葉克膜：若 OHCA 患者送往可進行葉克膜之醫院，且符合以下條件，在無線電回報時可請醫院評估是否啟動「葉克膜小組」：(1)有 Bystander CPR/DACPR。 (2)患者初始心律為可電擊心律(pVT/VF)。 (3)無臥床或末期疾病。 (4)年齡 70 歲以下。"
        }
      ]
    }
    ,
    fbao: {
      title: "「異物哽塞」救護流程 (115.03.20 決議)",
      subtitle: "嘉義縣消防局緊急醫療救護協定對照",
      steps: [
        {
          label: "步驟 1: 評估哽塞嚴重度",
          question: "評估疑似呼吸道異物哽塞患者的嚴重度：",
          desc: "• **要旨項目**：疑似異物哽塞患者，在呼吸道異物未排除前，<strong>不使用 SGA 與氣管內管</strong>，得使用口咽呼吸道。<br>• **阻塞評估**：是否為【嚴重呼吸道哽塞】？ [註1]（如咳嗽聲減弱/無咳、吸氣性喘鳴、發紺、無法說話、全身癱軟）",
          choices: [
            { text: "是 (嚴重呼吸道哽塞)", nextStep: 1 },
            { text: "否 (輕度哽塞 / 自主咳嗽)", nextStep: 2 }
          ],
          guidelines: "<strong>【註1: 嚴重呼吸道阻塞判斷】</strong><br>清醒病人可依照下列情形判斷為「嚴重呼吸道阻塞」：<br>1. 咳嗽聲逐漸減弱或沒有咳嗽。<br>2. 呼吸更加困難或沒有呼吸。<br>3. 呼吸時有高頻雜音 (喘鳴聲 Stridor; 頸部出現吸氣期的高頻雜音)。<br>4. 發紺。<br>5. 不能說話。<br>6. 全身癱軟。"
        },
        {
          label: "步驟 2: 意識狀態評估 (嚴重哽塞)",
          question: "評估嚴重哽塞患者目前的意識狀態：",
          desc: "評估患者目前是否清醒（意識清醒）？",
          choices: [
            { text: "是 (意識清醒)", nextStep: 3 },
            { text: "否 (意識不清 / 昏迷)", nextStep: 5 }
          ]
        },
        {
          label: "步驟 2: 鼓勵咳嗽與觀察 (輕度哽塞)",
          question: "輕度哽塞患者鼓勵咳嗽與觀察：",
          desc: "• <strong>自主咳嗽</strong>：鼓勵病人咳嗽將異物排除，全程注意患者變化 [註4]。<br>• <strong>途中評估</strong>：有無途中惡化為嚴重哽塞？",
          choices: [
            { text: "是 (途中惡化為嚴重哽塞)", nextStep: 3 },
            { text: "否 (維持輕度哽塞無惡化)", nextStep: 8 }
          ],
          guidelines: "<strong>【註4: 輕度哽塞處置】</strong><br>鼓勵病人咳嗽將異物排除，病人持續無法自主咳出異物時：<br>1. 若症狀惡化成「嚴重呼吸道阻塞」，則進入步驟 5 給予實施「拍背擠腹法」。<br>2. 若持續無法咳出異物但無上述情形，則應儘速送醫。"
        },
        {
          label: "步驟 3: 執行拍背擠腹法",
          question: "對清醒之嚴重哽塞患者執行哈姆立克法：",
          desc: "• <strong>操作流程</strong>：實施 <strong>5 次背部拍擊</strong>；完成後改在病人後面使用 <strong>5 次腹部推擠</strong> [註2]。隨時留意是否有異物吐出。<br>• <strong>特殊病患</strong>：若為懷孕後期或肥胖者無法實施腹部推擠，應考慮實施**胸部按壓** [註2]。<br>• <strong>操作結果</strong>：異物是否已成功排除？",
          choices: [
            { text: "是 (異物已排除)", nextStep: 8 },
            { text: "否 (異物仍未排除)", nextStep: 4 }
          ],
          guidelines: "<strong>【註2: 拍背擠腹法步驟】</strong><br>1. 立即詢問病人或家屬「病人噎到了嗎？」。<br>2. 若病人點頭表示或無法發聲時，應實施 5 次背部拍擊；完成後改在病人後面使用 5 次腹部推擠。<br>3. 操作時隨時留意是否有異物吐出，重複步驟直到病人意識喪失或異物被排除為止。<br>4. 若無法實施腹部推擠應考慮胸部按壓，例如：懷孕後期或肥胖者。"
        },
        {
          label: "步驟 4: 異物未排除評估",
          question: "哈姆立克法後異物仍未排出，評估患者意識：",
          desc: "患者目前是否仍然清醒？",
          choices: [
            { text: "是 (意識清醒，重複施作)", nextStep: 3 },
            { text: "否 (意識改變 / 喪失意識)", nextStep: 5 }
          ],
          guidelines: "<strong>【註3: 清醒者重複施作與惡化處置】</strong><br>• 病人惡化成嚴重哽塞後施行拍背擠腹法後異物仍未排出，但意識仍然清醒，得重複 1 次拍背擠腹法。<br>• 若仍未改善則應進入步驟 13 儘速送醫，不要逗留現場並全程注意病人變化。<br>• 若病人於送醫途中意識改變則應進入步驟 9（開始壓胸並正壓通氣）。"
        },
        {
          label: "步驟 5: 開始壓胸並正壓通氣",
          question: "嚴重哽塞且意識不清，立即將病人放平執行按壓：",
          desc: "• **按壓方式**：直接進行與 CPR 同方式之胸部按壓，<strong>按壓時應持續觀察口中是否出現異物</strong>。如有可見異物應將頭轉側並以手指掏除 [註5]。<br>• **通氣測試**：掏除後通氣測試。若氣吹不進去，重新打開呼吸道再吹氣 1 次 [註5]。<br>• <strong>按壓後結果評估</strong>：異物是否已排除？",
          choices: [
            { text: "是 (異物已排除)", nextStep: 8 },
            { text: "否 (按壓2分鐘/5循環後未排除)", nextStep: 6 }
          ],
          guidelines: "<strong>【註5: 意識不清壓胸與通氣細則】</strong><br>• 將病人放平直接進行與 CPR 同方式之胸部按壓。<br>• 胸部按壓時應持續觀察口中是否出現原物，如有可見異物應將病人頭轉側並以手指掏除異物，並給予通氣測試確認異物是否完全排除。<br>• 正壓通氣若氣吹不進去或胸部沒有升起時，重新打開呼吸道，再吹氣 1 次。<br>• 胸部按壓五循環或兩分鐘後如未排除異物，可能惡化為 OHCA 應檢查頸動脈並考慮啟動 AED 或手動去顫器，監視生命徵象並立即後送。"
        },
        {
          label: "步驟 6: 進階哽塞處置 (喉頭鏡探查與夾取)",
          question: "執行進階異物哽塞處置，並檢查頸動脈：",
          desc: "• **喉頭鏡探查 (P)**：高級救護技術員在場時，考慮以**喉頭鏡**查看口咽部是否有可見異物，如有，以**異物夾 (Magill forceps)** 嘗試夾出 [註6]。<br>• **檢查頸動脈**：觸摸患者**頸動脈是否摸得到？** [註7]",
          choices: [
            { text: "是 (頸動脈摸得到)", nextStep: 8 },
            { text: "否 (頸動脈摸不到)", nextStep: 7 }
          ],
          guidelines: "<strong>【註6: 進階哽塞處置】</strong><br>若有 EMT-P 在場，得考慮進行進階異物哽塞處置：以喉頭鏡查看口咽部是否可見異物，如有則以異物夾嘗試將之夾出，並詳記於救護紀錄表中。<br><strong>【註7: 頸動脈監視】</strong><br>若病人為意識不清，送醫途中執行壓胸時應隨時注意檢查病人頸動脈搏，若惡化摸不到頸動脈則進入無脈搏流程。"
        },
        {
          label: "步驟 7: 啟動無脈搏流程",
          question: "患者摸不到頸動脈，立即轉入 OHCA 流程：",
          desc: "• 患者已惡化為 OHCA。請立即轉入【成人無脈搏救護流程】！",
          choices: [],
          recommendation: "依【成人無脈搏救護流程】進行急救與 AED 連接，並儘速後送送醫。"
        },
        {
          label: "步驟 8: 送醫處置與後送",
          question: "異物排除成功，執行送醫處置與車內照護：",
          desc: "• **送醫處置**：依初步評估施行必要處置，如給予高濃度氧氣治療、正壓給氧、口咽及抽吸等，注意勿因處置過久延誤送醫 [註8]。<br>• **後送**：上擔架床，移入車內照護送醫。",
          choices: [],
          recommendation: "送醫途中密切監測生命徵象，維持呼吸道通暢，注意勿因現場處置過久延誤送醫。",
          guidelines: "<strong>【註8: 送醫必要處置】</strong><br>給予必要之處置，注意勿因處置過久延誤送醫。"
        }
      ]
    }
    ,
    pesticide: {
      title: "成人「疑似農藥中毒」救護流程 (115.03.20 決議)",
      subtitle: "嘉義縣消防局緊急醫療救護協定對照",
      steps: [
        {
          label: "步驟 1: 現場安全與防護",
          question: "評估現場安全、救護員自我防護及環境去汙：",
          desc: "• **現場安全**：若懷疑農藥中毒，應有適當防護裝備或由著有防護裝備之人員先行。確認現場環境安全，評估病患前<strong>打開所有窗戶</strong>，儘快將病患移至通風處。<br>• **自我防護**：處理傷病患必須預防自己 (EMT 本身) 受到污染。得移除病患受污染的衣服並清除皮膚上的可疑物質 [註1]。<br>• **農藥搜集**：儘可能將相關可能的農藥瓶或包裝帶至醫院。",
          choices: [
            { text: "完成現場去污與安全評估，進行下一步", nextStep: 1 }
          ],
          guidelines: "<strong>【要旨與說明】</strong><br>1. 現場或病史有提及農藥或現場有跡象懷疑農藥中毒時即建議使用本流程。<br>2. 儘可能將相關可能的農藥帶至醫院。<br><strong>【註1: 自我防護與去汙細則】</strong><br>• 處理傷病患必須預防自己(EMT 本身)受到污染。<br>• 可移除傷病患受到污染的衣服。<br>• 可清除皮膚上的可疑物質。"
        },
        {
          label: "步驟 2: 初步評估與毒物諮詢",
          question: "執行初步評估、生命徵象監測與病史詢問：",
          desc: "• **生命監測**：維持患者生命徵象。<br>• **毒物諮詢**：毒藥物查詢可洽詢救災救護指揮中心，由中心聯絡相關單位，或打「台北榮總毒物諮詢中心」 (02)2871-7121 諮詢 [註2]。",
          choices: [
            { text: "評估完成，進行中毒症狀判定", nextStep: 2 }
          ],
          guidelines: "<strong>【註2: 毒藥物諮詢管道】</strong><br>1. 維持患者生命徵象。<br>2. 毒藥物查詢可洽詢救災救護指揮中心，由中心連絡相關單位。「台北榮總毒物諮詢中心」，電話(02)2871-7121。"
        },
        {
          label: "步驟 3: 中毒症狀評估 (3B / SLUDGE)",
          question: "評估病患是否出現 3B 毒蕈鹼樣症狀或 SLUDGE 中毒症狀？",
          desc: "• **3B 症狀**：1. **Bronchorrhea**（支氣管分泌物過多，產生大量水分與黏液）、2. **Bronchospasm**（支氣管痙攣）、3. **Bradycardia**（心搏過緩，可能引發心搏停止）。<br>• **SLUDGE 症狀**：流口水 (Salivation)、流眼淚 (Lacrimation)、失禁 (Urination)、排便 (Defecation)、腸胃不適 (Gastrointestinal upset)、嘔吐 (Emesis)。<br>• 疑似為嚴重有機磷或胺基甲酸鹽中毒合併呼吸窘迫。",
          choices: [
            { text: "是 (有3B/SLUDGE症狀且合併呼吸窘迫)", nextStep: 3 },
            { text: "否 (無上述明顯中毒症狀)", nextStep: 4 }
          ],
          guidelines: "<strong>【農藥分類參考】</strong><br>• **有機磷**：中文名稱常以「松」字結尾，如馬拉松 (Malathion)、大滅松 (Dimethoate)、陶斯松 (Chlorpyrifos)。<br>• **胺基甲酸鹽**：中文名稱多帶有「扶」、「利」、「得」或「威」，如納乃得 (Methomyl)、加保利 (Carbaryl)、加保扶 (Carbofuran/好年冬)。"
        },
        {
          label: "步驟 4: Atropine 給藥治療",
          question: "符合嚴重中毒，尋求線上醫療指導給予解毒藥：",
          desc: "• **給藥指引 (P)**：高級技術員經判斷疑似為嚴重有機磷、胺基甲酸鹽中毒時，得考慮進行線上醫療指導，給予 Atropine 治療 [註3]。<br>• **使用劑量**：起始劑量為 <strong>1 mg IV 注射</strong>。若症狀未有改善，可考慮 <strong>5 分鐘後再次給予 1 mg IV 注射</strong>。若皆無改善，則應循車內照護流程儘速送醫 [註3]。<br>• **癲癇處理 (P)**：若病患因農藥中毒引起癲癇重積症狀，EMT-P 可依據【抽搐流程】給予 Midazolam 治療 [註3]。",
          choices: [
            { text: "給藥與處置完成，準備後送", nextStep: 4 }
          ],
          guidelines: "<strong>【註3: 處置與 Atropine 治療】</strong><br>• 施行必要處置以維持患者呼吸道、呼吸及循環。<br>• Atropine 起始劑量為 1 mg IV 注射，若患者症狀未有改善，可考慮 5 分鐘後再次給予 Atropine 1 mg IV 注射。若皆無改善，則應循車內照護流程儘速送醫。<br>• 若患者因農藥中毒引起癲癇重積症狀，EMT-P 可依據【抽搐流程】給予 Midazolam 治療。"
        },
        {
          label: "步驟 5: 必要處置與上擔架床",
          question: "執行必要處置並準備上擔架床：",
          desc: "• 依初步評估施行必要處置（如呼吸、循環維持），準備將傷病患上擔架床 [註3]。",
          choices: [
            { text: "病患已移上擔架床，送入車內", nextStep: 5 }
          ]
        },
        {
          label: "步驟 6: 車內照護與後送安全",
          question: "執行車內照護與通報：",
          desc: "• **車內通風**：若有刺鼻味道，應**打開救護車窗戶通風** [註4]。<br>• **防窒息處置**：小心處理患者嘔吐物，若有嘔吐情形，**考慮以左側躺後送** [註4]。<br>• **醫院預報**：儘早將毒物相關訊息，通知醫院進行防護準備 [註4]。",
          choices: [],
          recommendation: "送醫途中全程監測生命徵象。因應嘔吐風險，優先考慮以左側躺後送。到達醫院前務必以無線電提前預報，讓院方做好個人防護裝備準備，防止急診二次污染！",
          guidelines: "<strong>【註4: 送醫途中與車內安全】</strong><br>• 若有刺鼻味道應打開救護車窗戶通風。<br>• 小心處理傷病患嘔吐物，若傷病患有嘔吐情形，考慮以左側躺後送。<br>• 盡早將毒物相關訊息，通知醫院進行防護準備。"
        }
      ]
    }
    ,
    chestpain: {
      title: "胸悶/痛病護流程 (114.03.20 決議)",
      subtitle: "嘉義縣消防局緊急醫療救護協定對照",
      steps: [
        {
          label: "步驟 1: 評估適用對象",
          question: "評估病患是否適用胸悶/痛急救流程：",
          desc: "• <strong>適用要件</strong>：18 歲以上，且符合下列條件之一者 [註1]：<br>1. 12 小時內有胸悶或胸痛。<br>2. 有心臟病史、喘、噁心 (嘔吐)、冒冷汗等症狀中符合 <strong>任意 2 項</strong>。",
          choices: [
            { text: "是 (符合適用對象)", nextStep: 1 },
            { text: "否 (不符合對象)", nextStep: 8 }
          ],
          guidelines: "<strong>【註1: 適用對象判定】</strong><br>18 歲以上，符合下列情形之一者，適用本流程：<br>一、12 小時內有胸悶或胸痛。<br>二、有心臟病史、喘、噁心（嘔吐）、冒冷汗等任 2 項。"
        },
        {
          label: "步驟 2: 初步評估與病史詢問",
          question: "執行初步評估、現病史詢問 (OPQRST) 與輔助處置：",
          desc: "• **給氧處置**：血氧值 < 94% 時得考慮給予氧氣治療 [註2]。<br>• **靜脈注射**：收縮壓 < 90 mmHg 或有休克徵象，且無體液過多徵象（濕囉音、水腫）時，考慮建立周邊 IV 給予輸液 [註2]。<br>• **協助自備 NTG (P)**：若無 NTG 禁忌症（如收縮壓 < 90、心律 < 50 或 > 100、服用壯陽藥等），中級以上技術員得考慮協助病患服用其自備之硝化甘油 (NTG) 舌下含片，每 5 分鐘一次，最多 3 次 [註2]。",
          choices: [
            { text: "完成初步處置與 NTG 給藥，進行下一步", nextStep: 2 }
          ],
          guidelines: "<strong>【註2: 現病史與 NTG 禁忌症】</strong><br>• **現病史詢問 (OPQRST)**：<br>1. Origin: 症狀發生當時的情況。<br>2. Provoke: 有無加劇或緩解此一症狀的因素。<br>3. Quality: 性質。<br>4. Region: 位置以及有無轉移。<br>5. Severity: 嚴重度。<br>6. Time: 持續時間與頻率。<br>• **NTG 服用禁忌症：**<br>1. 收縮壓 < 90mmHg。<br>2. 脈搏 < 50 次/分 或 > 100 次/分。<br>3. 24 小時內曾服用威而鋼 (Viagra) 或 48 小時內用過犀利士 (Cialis) 等壯陽類藥物。<br>4. 對 NTG 過敏。"
        },
        {
          label: "步驟 3: 評估病患狀況是否穩定",
          question: "評估病患目前的狀況與生命徵象是否穩定？",
          desc: "• **穩定性評估**：病人若呈現意識改變、呼吸窘迫、休克等症狀，視為不穩定徵候，應先給予必要處置，待生命徵象穩定後再行心電圖施作 [註3]。",
          choices: [
            { text: "是 (患者狀況穩定)", nextStep: 3 },
            { text: "否 (患者不穩定，直接後送)", nextStep: 8 }
          ],
          guidelines: "<strong>【註3: 不穩定徵候處置】</strong><br>病人呈現意識改變、呼吸窘迫、休克等症狀視為不穩定徵候，應先給予必要處置，待穩定病患生命徵象後得考慮施作心電圖。"
        },
        {
          label: "步驟 4: 詢問病人是否同意執行檢查",
          question: "詢問病人是否同意執行心電圖檢查：",
          desc: "向病人或家屬說明，徵求同意執行到院前 12 導程心電圖檢查。",
          choices: [
            { text: "是 (病患同意執行)", nextStep: 4 },
            { text: "否 (病患拒絕執行)", nextStep: 8 }
          ]
        },
        {
          label: "步驟 5: 執行心電圖並上傳判讀",
          question: "執行到院前 12 導程心電圖及群組傳輸判讀：",
          desc: "• **施作心電圖**：執行 12 導程心電圖檢查。<br>• **資料上傳**：將心電圖傳送至指定通訊軟體群組，供群組醫師或急診室判讀 [註4]。",
          choices: [
            { text: "完成傳輸，確認判讀結果", nextStep: 5 }
          ]
        },
        {
          label: "步驟 6: 判讀是否為 STEMI？",
          question: "確認心電圖判讀結果是否為 STEMI？",
          desc: "• **STEMI 判讀標準** [註4]：12 導程心電圖經由指定群組醫師或本縣急救責任醫院急診室判讀有 ST 段上升或 STEMI 表現。",
          choices: [
            { text: "是 (判讀為 STEMI)", nextStep: 6 },
            { text: "否 (判讀非 STEMI)", nextStep: 7 }
          ],
          guidelines: "<strong>【註4: STEMI 判讀標準說明】</strong><br>本救護流程所述 STEMI（ST 段上升型心肌梗塞）係指病人院前 12 導程心電圖經判讀後符合下列之一者：<br>1. 指定通訊軟體群組內醫師判讀該病人心電圖有 ST 段上升或 STEMI。<br>2. 本縣急救責任醫院急診室判讀該病人心電圖有 ST 段上升或 STEMI。"
        },
        {
          label: "步驟 7: 急性心肌梗塞給藥處置",
          question: "STEMI 確診，高級技術員考慮給予急性心肌梗塞藥物：",
          desc: "• **Aspirin 給藥 (P)**：高級救護技術員考慮給予 **Aspirin (阿斯匹靈) 300mg 口服**，需確認無過敏、無出血、胸痛無後背撕裂痛等禁忌症，並請病人或家屬簽署用藥同意書 [註5]。<br>• **個案登錄**：登錄疑似心肌梗塞患者，作為品管追蹤案例 [註7]。",
          choices: [
            { text: "給藥與品管登錄完成，選擇送醫", nextStep: 9 }
          ],
          guidelines: "<strong>【註5: Aspirin 給藥細則與禁忌症】</strong><br>抗血小板藥物：病人符合以下要件時，高級救護技術員得考慮給予 Aspirin 300mg 口服：<br>(一) 年齡 >= 18 歲。<br>(二) 對於 Aspirin 無過敏反應。<br>(三) 無活動性病理性出血（如主動脈剝離、消化性潰瘍、顱內出血病史、出血點、大片瘀血等）。<br>(四) 病患沒有嚴重貧血、凝血缺陷或服用抗凝血劑。<br>(五) 病人胸痛無延伸至後背痛或撕裂痛。<br>請病人或家屬簽具「嘉義縣急性心肌梗塞線上指導醫療流程用藥同意書」。"
        },
        {
          label: "步驟 7: 個案登錄與送醫",
          question: "判定非 STEMI，個案登錄並進行常規送醫：",
          desc: "• **品管登錄**：於救護紀錄表或平板備註欄填寫「疑似心肌梗塞患者」以列入品管追蹤 [註7]。<br>• **送醫照護**：進行常規後送與二度評估。",
          choices: [
            { text: "登錄完成，選擇送醫", nextStep: 8 }
          ]
        },
        {
          label: "步驟 8: 選擇適當醫院與送醫",
          question: "到院前完成二評並送醫：",
          desc: "• **二度評估**：到院前完成二度評估。<br>• **送醫照護**：送醫途中密切監視生命徵象，注意有無惡化。",
          choices: [],
          recommendation: "常規後送，隨時注意患者症狀變化，注意勿因處置過久延誤送醫。",
          guidelines: "<strong>【註7: 品管追蹤細則】</strong><br>個案列入登錄請於救護紀錄表或救護平板之備註欄填寫「疑似心肌梗塞患者」，作為品管追蹤案例。"
        },
        {
          label: "步驟 8: STEMI 後送處置",
          question: "確診 STEMI 患者送醫與醫院選擇：",
          desc: "• **醫院選擇**：必須直接後送往具備心導管處置能力之適當責任醫院 [註6]。<br>• **送醫照護**：到院前完成二評，送醫途中全時監測生命徵象，回報指揮中心與醫院準備收治。",
          choices: [],
          recommendation: "STEMI 確診，必須後送心導管醫院（長庚、大林慈濟、中榮嘉義分院、聖馬爾定、嘉基、部立嘉義醫院、北港附設醫院、柳營奇美）。到院後主動向醫護交班 Aspirin 300mg 服藥狀況及用藥同意書！",
          guidelines: "<strong>【註6: 心導管醫院名單】</strong><br>本救護流程稱適當醫院 (心導管醫院) 係指可執行心導管處置能力之醫院：<br>1. 嘉義長庚醫院。<br>2. 大林慈濟醫院。<br>3. 台中榮民總醫院嘉義分院。<br>4. 聖馬爾定醫院。<br>5. 嘉義基督教醫院。<br>6. 衛生福利部嘉義醫院。<br>7. 中國醫藥大學北港附設醫院。<br>8. 柳營奇美醫院。<br><strong>【註7: 品管追蹤】</strong><br>個案列入登錄請於救護紀錄表或救護平板之備註欄填寫「疑似心肌梗塞患者」，作為品管追蹤案例。"
        }
      ]
    }
    ,
    stroke: {
      title: "疑似腦中風緊急救護流程",
      subtitle: "嘉義縣消防局緊急醫療救護協定對照",
      steps: [
        {
          label: "步驟 1: 評估適用對象",
          question: "評估病患是否適用疑似腦中風救護流程：",
          desc: "• <strong>適用對象</strong>：意識清醒之成人傷病患，主訴為<strong>肢體無力</strong>或<strong>癲癇/抽搐</strong>；或發現有<strong>半邊肢體無力、口齒不清、步態不穩、頭痛或頭暈</strong>等疑似「腦中風」之症狀 [註1]。<br>• <strong>意識不清/昏迷</strong>：若病患主訴昏迷、頭痛/頭暈、昏倒/路倒等，也應視情況評估 [註1]。",
          choices: [
            { text: "是 (符合上述疑似症狀)", nextStep: 1 },
            { text: "否 (完全無中風跡象)", nextStep: 5 }
          ],
          guidelines: "<strong>【註1: 疑似中風指標與創傷評估】</strong><br>1. 腦中風可能造成的視覺或神經學症狀外，主訴肢體無力或癲癇/抽搐時也應評估。昏迷、頭痛、頭暈、路倒亦需視情況評估。<br>2. 腦中風主要為供應腦部氧氣與養分的頸動脈與椎動脈阻塞或破裂，導致腦流量產生不足，功能受損。病理可分為缺血性與出血性腦中風。<br>3. 中風患者可能因無力或昏眩導致跌倒或車禍創傷。技術員在進行評估時，除必要創傷處置外，亦應依本流程進行評估處置。"
        },
        {
          label: "步驟 2: 辛辛那提中風指標 (CPSS) 評估",
          question: "執行 CPSS 測試，並記錄最後正常時間：",
          desc: "• **最後正常時間**：記錄病患最後一次正常表現的時間當作開始腦中風的病程 [註2]。<br>• **辛辛那提中風指標 (CPSS) 內容** [註2]：<br>1. <strong>嘴角上揚 (露牙笑)</strong>：正常兩頰均衡移動；不正常一邊臉部動得不如對側。<br>2. <strong>手臂支撐 (閉眼伸手臂10秒)</strong>：正常雙臂均衡移動；不正常一邊手臂垂落不對稱。<br>3. <strong>語言異常 (說「股市上萬點、台灣走出去」)</strong>：正常咬字正確；不正常口吃、用字不對或無法說話。<br>• <strong>判讀結果</strong>：上述理學檢查中，是否至少有 1 項為新發作的不正常表現？",
          choices: [
            { text: "是 (CPSS 指標異常，疑似中風)", nextStep: 2 },
            { text: "否 (指標均正常 / 懷疑危急)", nextStep: 4 }
          ],
          guidelines: "<strong>【註2: CPSS 指標判讀規則】</strong><br>嘴角上揚、手臂支撐、語言異常這三項理學檢查項目中，如有任何一項不正常且是新的發作時，即屬「不正常」，病患為腦中風的可能性達 72%；若三項均有時，可能性可高達 85%。"
        },
        {
          label: "步驟 3: 檢測血糖值",
          question: "檢測血糖值 (限中級以上救護技術員操作)：",
          desc: "• <strong>檢測血糖</strong>：檢測血糖以排除低血糖引起的偽中風表現。<br>• <strong>血糖結果</strong>：血糖值是否低於 <strong>60 mg/dl</strong> (或顯示 'Low')？",
          choices: [
            { text: "是 (血糖值 < 60 mg/dl)", nextStep: 3 },
            { text: "否 (血糖值 >= 60 mg/dl)", nextStep: 6 }
          ]
        },
        {
          label: "步驟 4: 低血糖給糖處置",
          question: "血糖小於 60mg/dl，立即執行給糖處置 (限中級以上)：",
          desc: "• **立即給糖**：中級以上技術員應立即給糖，但應注意避免病患嗆到 [註3]。<br>• **葡萄糖注射 (P)**：若後送距離較遠，可考慮給予葡萄糖液靜脈注射；**但 D50W 僅限高級救護技術員 (EMT-P) 在預立醫囑下使用** [註3]。",
          choices: [
            { text: "給糖處置完成，重新評估並送醫", nextStep: 6 }
          ],
          guidelines: "<strong>【註3: 低血糖給糖細則】</strong><br>若血糖檢測小於 60mg/dl 或顯示 'Low'，中級以上技術員應立即給糖，避免病患嗆到。後送遠可給葡萄糖液靜脈注射；D50W 僅限高級救護技術員在預立醫囑下使用。"
        },
        {
          label: "步驟 3: 評估是否為危急個案",
          question: "評估病患是否屬於非創傷危急個案：",
          desc: "• 檢查患者生命徵象，評估是否屬於危急個案。",
          choices: [
            { text: "是 (危急個案 / 生命徵象不穩)", nextStep: 6 },
            { text: "否 (非危急個案)", nextStep: 5 }
          ]
        },
        {
          label: "步驟 4: 二度評估與常規後送",
          question: "非危急個案，執行常規送醫：",
          desc: "• 到院前完成二度評估，移上擔架床，移入車內送醫。",
          choices: [],
          recommendation: "常規送醫。途中隨時監測生命徵象與神經系統功能變化。"
        },
        {
          label: "步驟 4: 中風管理與送醫責任醫院選擇",
          question: "執行中風體位管理與rt-PA責任醫院選擇：",
          desc: "• **必要處置**：依初步評估施行必要處置。若懷疑急性中風嚴重者造成腦壓上升（**庫興三合症 Triad**：血壓上升、心跳變慢、呼吸不規則），**送醫時應將床頭抬高 30~40 度**以促進頭部靜脈回流降低腦壓；若呼吸 < 10次/分且意識改變，考慮 BVM 正壓呼吸 [註4]。<br>• **送醫選擇**：若中風發作在 <strong>3 小時內</strong>，應儘速送至有能力施行**血栓溶解劑 (rt-PA) 治療**之**中度級以上急救責任醫院**，並主動通報病史 [註5]。",
          choices: [
            { text: "處置完成，移上擔架床", nextStep: 7 }
          ],
          guidelines: "<strong>【註4: 庫興三合症與體位調整】</strong><br>• 急性中風嚴重者造成腦壓上升。其生命徵象會有血壓上升、心跳變慢、呼吸不規則（Cushing Triad）。<br>• 送醫時需將床頭抬高 30 度-40 度以促進頭部靜脈回流、減低腦壓。呼吸 < 10 次/分且意識改變考慮以 BVM 正壓呼吸。<br><strong>【註5: 黃金 3 小時與血栓溶解】</strong><br>急性腦中風發作 < 3 小時，路程許可下，建議送至能施行血栓溶解劑治療之中度級以上急救責任醫院。3 小時內施打溶解劑能大幅改善中風預後。"
        },
        {
          label: "步驟 5: 擔架床與送醫車內照護",
          question: "移上擔架床，車內照護送醫：",
          desc: "• **上擔架床**：抬上擔架床並固定 [註4]。<br>• **車內照護**：送醫途中執行車內照護通用流程，密切注意患者變化 [註5]。",
          choices: [],
          recommendation: "懷疑腦中風，床頭抬高 30-40 度。發作 < 3 小時內，請以無線電向中度級以上責任醫院通報中風團隊準備收治！",
          guidelines: "<strong>【註5: 途中通訊】</strong><br>應詢問最近一次神經功能正常的時間，發作小於 3 小時內通知醫院啟動腦中風醫療團隊準備。"
        }
      ]
    }
    ,
    hypoglycemia: {
      title: "成人疑似低血糖流程 (114.03.20 決議)",
      subtitle: "嘉義縣消防局緊急醫療救護協定對照",
      steps: [
        {
          label: "步驟 1: 評估適用對象與症狀",
          question: "評估病患是否符合測量血糖與低血糖流程：",
          desc: "• <strong>量測血糖要件</strong>：有生命徵象之病患，且主訴為<strong>昏迷(意識不清)、肢體無力(中風)、癲癇/抽搐、路倒</strong>等四大類之一；或有低血糖相關疑似症狀如頭暈、冒冷汗、心悸等 [註1]。",
          choices: [
            { text: "是 (符合測量血糖條件)", nextStep: 1 },
            { text: "否 (不符合低血糖條件)", nextStep: 3 }
          ],
          guidelines: "<strong>【註1: 量測血糖要件細則】</strong><br>• 目前本縣測量血糖條件為主訴昏迷(意識不清)、肢體無力(中風)、癲癇/抽搐、路倒等四大類。<br>• 因低血糖的症狀常常與神經學的症狀類似，如頭暈、冒冷汗、心悸等。現場救護人員得視情況予以測量血糖。"
        },
        {
          label: "步驟 2: 檢測血糖值",
          question: "執行血糖機檢測血糖程序：",
          desc: "• **檢測程序** [註2]：1. 向家屬解釋、2. 打開血糖機備妥試紙、3. 選擇無傷口指尖、4. 酒精棉消毒、5. 乾燥後以針扎指尖、6. 滴血並加壓止血、7. 判讀數值。<br>• <strong>血糖分析結果</strong>：血糖值是否低於 <strong>60 mg/dl</strong> 或顯示 <strong>'Low'</strong>？",
          choices: [
            { text: "是 (血糖 < 60 mg/dl / Low)", nextStep: 2 },
            { text: "否 (血糖 >= 60 mg/dl)", nextStep: 3 }
          ],
          guidelines: "<strong>【註2: 檢測血糖程序細則】</strong><br>一、向病患或家屬解釋檢查血糖之原因。<br>二、打開血糖機開關，備好檢測試紙。<br>三、選擇病患無皮膚缺損及傷口的指尖。<br>四、以酒精棉消毒傷病患指尖。<br>五、待消毒部位乾燥後，以探針扎指尖。<br>六、將血滴於試紙上，再以酒精棉於指尖處加壓止血。<br>七、判讀血糖值，並將顯示之數值記錄在救護紀錄表上。"
        },
        {
          label: "步驟 3: 低血糖處置 (給糖/D10W/D50W)",
          question: "血糖小於 60mg/dl，執行低血糖緊急處置：",
          desc: "• **建立靜脈與 D10W**：低血糖患者應嘗試建立靜脈管路並給予 **D10W 500ml 快速滴注** [註3]；若為**洗腎或四肢腫脹患者**，D10W 僅給予 <strong>250ml</strong> 即可 [註3]。<br>• **無靜脈管路**：若無法建立靜脈管路給予葡萄糖注射，則使用**糖粉或糖漿塗抹於病患牙齦上**，並注意維持呼吸道通暢 [註3]。<br>• **TP 進階給藥 (P)**：高級救護技術員考慮直接給予 **D50W 共 40ml 靜脈推注**，之後再給予 D10W 500ml 滴注 [註3]。",
          choices: [
            { text: "處置與給藥完成，進入送醫流程", nextStep: 3 }
          ],
          guidelines: "<strong>【註3: 葡萄糖注射與塗抹細則】</strong><br>• 低血糖患者應嘗試建立靜脈管路，若無法建立靜脈管路給予葡萄糖注射時，則使用糖粉或糖漿塗抹於病患牙齦上並注意呼吸道通暢。<br>• 若病患為洗腎或四肢腫脹患者，則 D10W 可給予 250ml 即可，D50W 不需調整。<br>• TP 施打 D50W 後，於送醫途中應再次評估患者生命徵象並予記錄。"
        },
        {
          label: "步驟 4: 救護車車內照護送醫",
          question: "執行救護車緊急照護流程並後送：",
          desc: "• **生命徵象監測**：送醫途中密切監視生命徵象變化。<br>• **TP 再次評估 (P)**：若施打 D50W 後，於送醫途中應再次評估患者生命徵象並予記錄 [註3]。",
          choices: [],
          recommendation: "常規送醫。途中持續注意患者意識恢復狀況，並再次量測血糖值確認上升情形。"
        }
      ]
    }
    ,
    dyspnea: {
      title: "成人呼吸困難病患救護流程 (113.03.12 決議)",
      subtitle: "嘉義縣消防局緊急醫療救護協定對照",
      steps: [
        {
          label: "步驟 1: 評估適用對象",
          question: "評估非創傷患者是否判定為呼吸困難病患：",
          desc: "• <strong>適用要件</strong>：初評後未見「無適當呼吸」，且主訴為<strong>喘、呼吸不適或困難、張口呼吸、端坐呼吸、冒冷汗</strong>等症狀 [註1]。<br>• <strong>理學特徵</strong>：呼吸速率異常（深、淺、快、慢）、呼吸作功增加（如使用肋間肌或鎖骨上呼吸輔助肌內縮），且聽診有明顯異常呼吸音（喘鳴、哮鳴等）[註1]。",
          choices: [
            { text: "是 (判定為呼吸困難患者)", nextStep: 1 },
            { text: "否 (無呼吸困難症狀)", nextStep: 5 }
          ],
          guidelines: "<strong>【註1: 呼吸困難判定說明】</strong><br>• 常見原因：呼吸道阻塞、氣喘、COPD、肺炎、肺栓塞、肺積水、過度換氣等。到院前應設法維持傷病患適當的「血氧值」，持續監視反覆評估並決定是否提升呼吸處置等級。<br>• 得考慮文意：技術員在時間允許下依現場情況、傷情、處置量能等綜合考量後判斷是否實施處置。"
        },
        {
          label: "步驟 2: 缺氧與重症篩檢",
          question: "評估病患是否有以下其中之一之缺氧與重症情形？",
          desc: "1. **缺氧發紺現象**。<br>2. **呼吸速率異常**：呼吸速率 <strong>< 10 次/分鐘</strong> 或 <strong>>= 30 次/分鐘</strong>。<br>3. **血氧濃度 (SpO2) < 94%**。",
          choices: [
            { text: "是 (符合任一缺氧/異常指標)", nextStep: 3 },
            { text: "否 (無缺氧發紺且血氧 >= 94%)", nextStep: 2 }
          ]
        },
        {
          label: "步驟 3: 穩定呼吸給氧處置",
          question: "給予穩定患者給氧治療：",
          desc: "• **給氧原則**：考慮給予輔助呼吸道及抽吸，並給予適當氧氣治療方式以維持 **SpO2 >= 94%** [註2]。<br>• **特殊患者處置**：<br>1. **COPD 患者**：維持血氧值在 **90%~94%** 即可，過高會抑制其自發性呼吸 [註2]。<br>2. **巴拉刈農藥中毒**：不建議常規施予氧氣治療（會加速肺部纖維化），但若 SpO2 < 90% 仍需給予適當氧氣以維持生命徵象穩定 [註2]。<br>3. **過度換氣者**：無發紺且 SpO2 >= 96% 可給一般面罩 1~2 L/min，引導重新吸入二氧化碳 [註2]。",
          choices: [
            { text: "給氧處置完成，進入送醫流程", nextStep: 4 }
          ],
          guidelines: "<strong>【註2: 選擇適當給氧方式】</strong><br>• 常規給氧流速：鼻導管 1-4 L/min；一般面罩 6-10 L/min；非再吸入式面罩 (NRM) 15 L/min；袋瓣式甦醒球 (BVM) 15 L/min。目標為維持 SpO2 >= 94%。<br>• CO 中毒/火場/溺水/發紺：直接給予 NRM 15 L/min。<br>• 氣切造口給氧：應將一般面罩或 NRM 套在氣切口上方給氧。"
        },
        {
          label: "步驟 3: 嚴重缺氧處置與解痙給藥",
          question: "嚴重缺氧處置、輔助呼吸與支氣管擴張劑：",
          desc: "• **輔助給氧**：給予輔助氣道及抽吸，給予適當給氧方式以維持 SpO2 於 90%~94% [註2]。<br>• **呼吸衰竭處置**：若出現「呼吸速率 <10 或 >=30 次/分」、「血氧 < 90% 且呼吸動力不足」、「意識改變及發紺」任一項時，應以 **BVM正壓給氧**，每 1 分鐘重評呼吸與頸動脈。<br>• **支氣管擴張劑 (P)**：高級救護技術員 (EMT-P) 聽診有哮鳴音 (Wheezing) 時考慮給藥 [註3]。<br>1. **自備 MDI (M)**：清醒患者有自備吸入短效擴張劑 MDI (如 Berotec MDI)，中級以上技術員協助給予 [註3]。<br>2. **霧化吸入 (P)**：EMT-P 聽診後給予支氣管擴張劑一瓶單一劑量溶於 N/S 至 4mL，無效隔 5 分鐘後得給第 2 瓶 [註3]。<br>3. **傳染病用藥**：若為法定傳染病，考慮用 MDI 2 劑，間隔 1 分鐘；送醫 > 20 分鐘每 20 分鐘重複 [註3]。<br>• **心跳禁忌**：若心跳 **> 150 次/分**，應避免使用擴張劑 [註3]。",
          choices: [
            { text: "輔助處置與給藥完成，進入送醫流程", nextStep: 4 }
          ],
          guidelines: "<strong>【註3: 支氣管擴張劑與呼吸衰竭處置】</strong><br>• 擴張劑禁忌症：心跳大於 150 次/分鐘避免使用。已用過者應協助盡速就醫。<br>• 霧化吸入：1瓶單一劑量溶於 N/S 至 4mL，無效間隔 5 分鐘再給第 2 瓶。<br>• 法定傳染病：用 MDI (吸入劑) 2劑，間隔 1 分鐘，送醫 >20 分鐘每 20 分鐘重複。<br>• 呼吸衰竭表現：1. 呼吸速率 <10 或 >=30 次/分；2. SPO2 < 90% 且呼吸動力不足；3. 意識改變及發紺。應給予 BVM 正壓給氧並每 1 分鐘檢查呼吸與頸動脈。"
        },
        {
          label: "步驟 4: 必要處置與送醫責任醫院",
          question: "依初步評估施行必要之處置並後送：",
          desc: "• **處置原則**：依評估施行必要之處置，維持呼吸與血氧。<br>• **送醫照護**：到院前完成二評，選擇適當責任醫院送醫照護。",
          choices: [],
          recommendation: "送醫途中密切監測 SpO2。若有使用 BVM 正壓呼吸或支氣管擴張劑，到院時務必向急診醫護交班患者的自發性呼吸速率與雙肺聽診呼吸音！"
        },
        {
          label: "步驟 5: 常規送醫照護",
          question: "執行常規送醫照護：",
          desc: "• 到院前完成二評，移上擔架床，執行常規車內生命監測與照護。",
          choices: [],
          recommendation: "進行常規後送，密切監視生命徵象。"
        }
      ]
    }
    ,
    seizure: {
      title: "抽搐救護流程 (114.03.20 決議)",
      subtitle: "嘉義縣消防局緊急醫療救護協定對照",
      steps: [
        {
          label: "步驟 1: 評估適用對象與現場安全",
          question: "評估病患是否剛發生或持續抽搐，並執行防護：",
          desc: "• **適用主訴**：主訴癲癇、抽筋或羊癲瘋發作的病人 [要旨]。<br>• **防護處置**：排除碰撞風險及呼吸道阻塞，<strong>不要約束</strong>，避免造成二次傷害。記錄抽搐型態，必要時立即請求支援 [要旨]。",
          choices: [
            { text: "完成現場防護與初評，進行下一步", nextStep: 1 }
          ],
          guidelines: "<strong>【要旨與說明】</strong><br>• 本操作流程之處置僅適用本局高級救護隊及專責救護隊 EMT-P。<br>• 癲癇重積狀態定義：當病人一次癲癇發作超過 5 分鐘，或在 5 分鐘內癲癇發作超過 1 次且每次發作之間意識未能恢復至正常意識狀態。<br>• 病人發生癲癇重積狀態將危及生命。EMT 發現時應視情況請求支援，進行緊急處置，以避免腦部缺氧、橫紋肌溶解、代謝性酸中毒、肺水腫、續發性創傷等。<br>• 若抽搐發作環境可能導致相關創傷，EMT 應依創傷程序處置。<br><strong>【註1: 名詞定義】</strong><br>1. 發作 (Seizure)：大腦灰質細胞突發性不正常放電所造成的臨床症狀，常伴隨意識障礙及異常動作。<br>2. 抽搐 (Convulsion)：發作時發生全身或局部肌肉的抽動。<br>3. 癲癇 (Epilepsy)：陣發性多次之發作。"
        },
        {
          label: "步驟 2: 檢測血糖值",
          question: "以血糖機檢測血糖值：",
          desc: "• <strong>量測安全性</strong>：若病人持續抽搐或評估有採血困難，**可不給予檢測血糖**以避免針扎危險 [註2]。<br>• <strong>血糖值分析結果</strong>：血糖值是否低於 <strong>60 mg/dl</strong>？",
          choices: [
            { text: "是 (血糖 < 60 mg/dl)", nextStep: 2 },
            { text: "否 (血糖 >= 60 mg/dl，或未施測)", nextStep: 3 }
          ],
          guidelines: "<strong>【註2: 血糖檢測安全與低血糖指引】</strong><br>1. 病人持續抽搐或評估有採血的困難，可不給予檢測血糖，以避免針扎的危險。<br>2. 血糖值 < 60mg/dl，請依【疑似低血糖流程】處置。"
        },
        {
          label: "步驟 3: 參考低血糖流程",
          question: "病患血糖值小於 60 mg/dl，進入低血糖流程：",
          desc: "• 請立即轉入【成人疑似低血糖流程】處置！",
          choices: [],
          recommendation: "依【低血糖流程】嘗試建立靜脈給予 D10W 快速滴注或給予 D50W 靜脈推注。"
        },
        {
          label: "步驟 3: 評估是否持續抽搐",
          question: "評估患者目前是否持續抽搐？",
          desc: "分析患者目前是處於癲癇發作狀態，或是發作已停止？",
          choices: [
            { text: "是 (持續抽搐中 / 疑似重積狀態)", nextStep: 4 },
            { text: "否 (已停止抽搐)", nextStep: 5 }
          ]
        },
        {
          label: "步驟 4: 癲癇重積處置與 Midazolam 給藥",
          question: "患者處於持續抽搐/重積狀態，執行維持與給藥：",
          desc: "• **呼吸道維持**：持續抽搐時，**維持呼吸道即可**，以避免呼吸道阻塞 [註3]。<br>• **Midazolam 給藥 (P)**：高級救護技術員符合癲癇重積狀態時，得考慮給予 **Midazolam 肌肉注射 (IM)** [註4]。<br>• **注射劑量**：<br>1. **年齡 >= 18 歲**：給予 <strong>5 mg 肌肉注射</strong>。<br>2. **年齡 >= 70 歲**：劑量減半（給予 <strong>2.5 mg</strong>）[註4]。<br>• **重複注射**：給藥後約 2 分鐘生效。若 **5 分鐘後仍有抽搐**，可重複施打 1 次相同劑量，到院前總劑量最高不超過 **10 mg** [註4]。<br>• **禁忌症**：對 benzodiazepines 過敏、已知嚴重肝功能不全的病人 [註4]。<br>• **輸液路徑**：視情況建立 1 條用生理食鹽水溶液之周邊血管路徑。孕婦癲癇發作亦適用上述處置。",
          choices: [
            { text: "給藥處置完成，準備送醫", nextStep: 5 }
          ],
          guidelines: "<strong>【註3: 呼吸道維護細則】</strong><br>病人持續抽搐時維持呼吸道即可以避免呼吸道阻塞，若已停止抽搐時必要時給予呼吸道處置(抽吸、口咽呼吸道、鼻咽呼吸道)及適當之氧氣治療。<br><strong>【註4: Midazolam 用藥管理安全】</strong><br>• 劑量：年齡 >= 18 歲，5 mg IM；年齡 >= 70 歲，2.5 mg IM。2分鐘生效，5分鐘無效可重複，總量上限 10 mg。<br>• 監測：密切監測病人生命徵象，尤其是呼吸狀況，必要時放置進階呼吸道。<br>• 管制藥管理：現場雙人核對（主手抽藥、副手複誦藥名劑量），到院後主動向醫護交接，救護記錄表詳實記載並交由醫療指導醫師簽核。箱櫃上鎖保存，專人管理，每日清點記錄。"
        },
        {
          label: "步驟 5: 必要處置與後送",
          question: "執行必要處置並送醫通報：",
          desc: "• **必要處置**：若已停止抽搐，必要時給予抽吸、口咽或鼻咽管，並給予適當氧氣治療 [註3]。<br>• **送醫照護**：依評估施行必要之處置，到院前聯絡急救責任醫院，儘速送醫。",
          choices: [],
          recommendation: "後送送醫。若有使用 Midazolam，到院務必向急診交班給藥時間、劑量與患者目前的呼吸與抽搐頻率變化！"
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
        choicesContainer.className = "wizard-choices-row";
        choicesContainer.removeAttribute("style");
        
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
            <div class="sq-btn-content">
              <i class="fa-solid ${iconClass}" style="color: ${iconColor};"></i>
              <span>${choice.text}</span>
            </div>
          `;
          
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
