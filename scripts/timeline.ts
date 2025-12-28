type TimelineEvent = {
  year: number;
  title: string;
  description: string;
  category: string;
  date: string; // e.g. "OCT 01"
  linkUrl?: string;
  linkText?: string;
};

// Category 到 CSS 類別的映射
const categoryToClass: Record<string, string> = {
  '工作經歷': 'cat-work',
  '日常': 'cat-daily',
  '學業': 'cat-study',
  '專案/報告': 'cat-project',
};

// 轉義 HTML 特殊字符
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 解析 CSV 行（處理引號和逗號）
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // 雙引號轉義
        current += '"';
        i++;
      } else {
        // 切換引號狀態
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // 欄位分隔符
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current); // 最後一個欄位
  return result;
}

// 讀取並解析 CSV 檔案
async function loadTimelineEvents(): Promise<TimelineEvent[]> {
  try {
    console.log('開始載入 CSV 檔案...');
    const response = await fetch('data/timeline.csv');
    if (!response.ok) {
      throw new Error(`無法載入 CSV 檔案: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log('CSV 檔案載入成功，長度:', csvText.length);
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    console.log('CSV 行數:', lines.length);
    
    if (lines.length < 2) {
      throw new Error('CSV 檔案格式錯誤：至少需要標題行和一行數據');
    }
    
    // 解析標題行
    const headers = parseCSVLine(lines[0]);
    const expectedHeaders = ['year', 'title', 'description', 'category', 'date', 'link_url', 'link_text'];
    
    // 驗證標題
    if (headers.length !== expectedHeaders.length) {
      console.warn(`CSV 標題欄位數量不符，預期 ${expectedHeaders.length} 個，實際 ${headers.length} 個`);
    }
    
    // 解析數據行
    const events: TimelineEvent[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length < 5) {
        console.warn(`第 ${i + 1} 行數據不完整，已跳過`);
        continue;
      }
      
      const year = parseInt(values[0]?.trim() || '0', 10);
      if (isNaN(year)) {
        console.warn(`第 ${i + 1} 行年份無效，已跳過`);
        continue;
      }
      
      events.push({
        year,
        title: values[1]?.trim() || '',
        description: values[2]?.trim() || '',
        category: values[3]?.trim() || '',
        date: values[4]?.trim() || '',
        linkUrl: values[5]?.trim() || undefined,
        linkText: values[6]?.trim() || undefined,
      });
    }
    
    console.log('成功解析', events.length, '個事件');
    return events;
  } catch (error) {
    console.error('載入 timeline 事件時發生錯誤:', error);
    const container = document.getElementById('timeline-events');
    if (container) {
      container.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #dc3545;">
          <p>無法載入時間軸事件</p>
          <p style="font-size: 0.9rem; color: #6c757d;">${error instanceof Error ? error.message : '未知錯誤'}</p>
        </div>
      `;
    }
    return [];
  }
}

// 將 category 轉換為 CSS 類別名稱
function getCategoryClass(category: string): string {
  return categoryToClass[category] || '';
}

// 創建 timeline 事件 HTML
function createTimelineEventHTML(event: TimelineEvent): string {
  const categoryClass = getCategoryClass(event.category);
  const [mon, day] = event.date.split(' ');
  
  // 處理連結
  let linkHTML = '';
  if (event.linkUrl && event.linkText) {
    linkHTML = ` <a href="${escapeHtml(event.linkUrl)}" target="_blank">${escapeHtml(event.linkText)}</a>`;
  }
  
  return `
    <div class="timeline-event ${categoryClass}">
      <div class="event-header">
        <div>
          <div class="timeline-year">${event.year}</div>
          <div class="timeline-title">${escapeHtml(event.title)}</div>
        </div>
      </div>
      <div class="timeline-description">${escapeHtml(event.description)}${linkHTML}</div>
      <div class="event-date">
        <div>${day || ''}</div>
      </div>
      <div class="event-category">${escapeHtml(event.category)}</div>
    </div>
  `;
}

// 渲染 timeline
async function renderTimeline(): Promise<void> {
  const container = document.getElementById('timeline-events');
  if (!container) {
    console.error('找不到 timeline-events 容器');
    return;
  }
  
  // 顯示載入中訊息
  container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #6c757d;">載入中...</div>';
  
  // 載入事件
  const events = await loadTimelineEvents();
  
  if (events.length === 0) {
    container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #6c757d;">沒有事件資料</div>';
    return;
  }
  
  // 清空容器
  container.innerHTML = '';
  
  // 按年份降序排序（最新的在前）
  const sorted = [...events].sort((a, b) => {
    // 先按年份排序
    if (b.year !== a.year) {
      return b.year - a.year;
    }
    // 同年份按日期排序（需要解析月份）
    const monthOrder: Record<string, number> = {
      'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAY': 5, 'JUN': 6,
      'JUL': 7, 'AUG': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12
    };
    const aMonth = a.date.split(' ')[0];
    const bMonth = b.date.split(' ')[0];
    const aDay = parseInt(a.date.split(' ')[1] || '0', 10);
    const bDay = parseInt(b.date.split(' ')[1] || '0', 10);
    
    if (monthOrder[bMonth] !== monthOrder[aMonth]) {
      return (monthOrder[bMonth] || 0) - (monthOrder[aMonth] || 0);
    }
    return bDay - aDay;
  });
  
  // 渲染事件
  sorted.forEach((ev) => {
    container.insertAdjacentHTML('beforeend', createTimelineEventHTML(ev));
  });
  
  updateFilterCounts(events);
}

// 更新篩選器計數
function updateFilterCounts(events: TimelineEvent[]): void {
  const buttons = document.querySelectorAll<HTMLLabelElement>('.filter-btn');
  const counts = events.reduce<Record<string, number>>((acc, ev) => {
    acc.all = (acc.all || 0) + 1;
    acc[ev.category] = (acc[ev.category] || 0) + 1;
    return acc;
  }, { all: 0 });

  buttons.forEach((btn) => {
    const forAttr = btn.getAttribute('for');
    if (!forAttr) return;
    
    // 從 for 屬性提取類別名稱
    let category = 'all';
    if (forAttr === 'filter-all') {
      category = 'all';
    } else if (forAttr === 'filter-work') {
      category = '工作經歷';
    } else if (forAttr === 'filter-study') {
      category = '學業';
    } else if (forAttr === 'filter-project') {
      category = '專案/報告';
    } else if (forAttr === 'filter-daily') {
      category = '日常';
    }
    
    const count = category === 'all' ? counts.all : (counts[category] || 0);
    // 如果按鈕內有計數元素，更新它
    const countSpan = btn.querySelector('.count');
    if (countSpan) {
      countSpan.textContent = String(count);
    }
  });
}

// 初始化 timeline
export async function initTimeline(): Promise<void> {
  console.log('開始初始化 timeline...');
  try {
    await renderTimeline();
    console.log('Timeline 初始化完成');
  } catch (error) {
    console.error('Timeline 初始化失敗:', error);
    throw error;
  }
}
