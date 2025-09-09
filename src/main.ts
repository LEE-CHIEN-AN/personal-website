// 時間軸事件介面定義
interface TimelineEvent {
    year: number;
    title: string;
    description: string;
}

// 預設的時間軸事件資料
const timelineEvents: TimelineEvent[] = [
    {
        year: 2004,
        title: "誕生",
        description: "我來到這個世界，故事開始。"
    },
    {
        year: 2023,
        title: "北上台北",
        description: "離鄉背井，踏上新大地，開啟挑戰。"
    },
    {
        year: 2025,
        title: "暑期實習",
        description: "加入 CAE 專案，探索永續校園與數位雙生。"
    }
];

// 建立時間軸事件卡片的 HTML
function createTimelineEventHTML(event: TimelineEvent): string {
    return `
        <div class="timeline-event">
            <div class="timeline-year">${event.year}</div>
            <div class="timeline-title">${event.title}</div>
            <div class="timeline-description">${event.description}</div>
        </div>
    `;
}

// 渲染時間軸
function renderTimeline(): void {
    const timelineContainer = document.getElementById('timeline-events');
    
    if (!timelineContainer) {
        console.error('找不到時間軸容器元素');
        return;
    }
    
    // 清空現有內容
    timelineContainer.innerHTML = '';
    
    // 按年份排序事件（從舊到新）
    const sortedEvents = [...timelineEvents].sort((a, b) => a.year - b.year);
    
    // 渲染每個事件
    sortedEvents.forEach(event => {
        const eventHTML = createTimelineEventHTML(event);
        timelineContainer.insertAdjacentHTML('beforeend', eventHTML);
    });
}

// 初始化應用程式
function initApp(): void {
    console.log('李倢安的冒險年表應用程式啟動中...');
    
    // 等待 DOM 載入完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderTimeline);
    } else {
        renderTimeline();
    }
    
    console.log('時間軸渲染完成！');
}

// 啟動應用程式
initApp();

// 匯出供外部使用（如果需要）
export { TimelineEvent, timelineEvents, renderTimeline };

