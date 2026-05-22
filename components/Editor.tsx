

import React, { useState, useEffect } from 'react';
import { useStory } from '../state/StoryContext';

export const Editor: React.FC = () => {
  const { 
    story, 
    activeChapterId, 
    updateChapterContent, 
    isGenerating,
    generationStatus,
    updateStorySettings,
    generateRewrite
  } = useStory();

  const [isEditMode, setIsEditMode] = useState(true);
  const [showAiEdit, setShowAiEdit] = useState(false);
  const [rewriteInstruction, setRewriteInstruction] = useState('');
  const [showVnBible, setShowVnBible] = useState(true);
  const [activeVnTab, setActiveVnTab] = useState<'pov' | 'lexicon' | 'outline' | 'fullwrite'>('lexicon');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setShowVnBible(false);
    }
  }, []);

  useEffect(() => {
    const handleToggleVnBible = () => {
      setShowVnBible(prev => !prev);
    };
    window.addEventListener('toggle-vn-bible', handleToggleVnBible);
    return () => {
      window.removeEventListener('toggle-vn-bible', handleToggleVnBible);
    };
  }, []);

  const activeChapter = story?.chapters.find(c => c.id === activeChapterId);

  if (!activeChapter) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-950">
            <p>Chọn một chương từ thanh bên để bắt đầu viết.</p>
        </div>
    );
  }

  const toggleNsfw = () => {
    if (story) {
        updateStorySettings({ nsfw: !story.nsfw });
    }
  };

  const handleRewrite = async () => {
      if (!rewriteInstruction.trim()) return;
      setShowAiEdit(false);
      await generateRewrite(rewriteInstruction);
      setRewriteInstruction('');
  };

  const showFeedback = (msg: string) => {
      setCopyStatus(msg);
      setTimeout(() => setCopyStatus(null), 1500);
  };

  const handleCopyText = (text: string) => {
      navigator.clipboard.writeText(text);
      showFeedback('Đã sao chép!');
  };

  const insertTextAtCursor = (text: string) => {
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const content = activeChapter.content;
          const newContent = content.substring(0, start) + text + content.substring(end);
          updateChapterContent(activeChapter.id, newContent);
          // Set focus back and move cursor
          setTimeout(() => {
              textarea.focus();
              textarea.selectionStart = textarea.selectionEnd = start + text.length;
          }, 50);
          showFeedback('Đã chèn!');
      } else {
          // Fallback to clipboard if editor is hidden
          handleCopyText(text);
      }
  };

  // VN Blueprint Resource data
  const VN_LEXICON_SECTIONS = [
    {
      title: "Bầu ngực & Eo mông",
      items: [
        { label: "Bầu ngực mềm", text: "núi thịt ấm mềm" },
        { label: "Mực Trắng nõn", text: "đôi bầu trắng nõn nở nang" },
        { label: "Núm vú hồng", text: "nhũ hoa dựng đứng ửng hồng" },
        { label: "Thịt căng bóp", text: "túi thịt nảy bừng đàn hồi" },
        { label: "Eo mông trun", text: "vòng eo thon thắt chặt dốc mông đầy đặn" }
      ]
    },
    {
      title: "Hạ thể & Cự vật (18+)",
      items: [
        { label: "Kính mật", text: "khe rãnh ấm nồng nhầy nhụa nước" },
        { label: "Dịch ấm tuôn", text: "dâm dịch trong suốt bắt đầu rỉ từng giọt kéo sợi" },
        { label: "Nhục bích khít", text: "nhục bích đỏ bừng co rút thít bóp chặt chẽ" },
        { label: "Cự vật căng bành", text: "gậy thịt nóng bỏng giật giật vồng gân phập phồng" },
        { label: "Mũ quy đầu đỏ", text: "quy đầu đỏ thẫm bóng nhẫy nước dịch khẽ run" }
      ]
    },
    {
      title: "Từ cảm giác & Hành động",
      items: [
        { label: "Ướt nhơn nhớt", text: "nhơm nhớt nhơn nhớt ẩm mịn" },
        { label: "Thúc mạnh lút", text: "thúc một cú lút cán phập sâu vào tận cùng" },
        { label: "Co bóp chặt", text: "vặn xiết siết chặt co bóp theo từng đợt run rẩy" },
        { label: "Rỉ ra róc rách", text: "rỉ chảy loang lổ thứ trơn tuột nồng tanh ngọt hăng" },
        { label: "Tiếng sột soạt", text: "tiếng rên sột soạt, da thịt mướt mát va chạm liên hồi *bạch bạch bạch*" }
      ]
    }
  ];

  const VN_POV_RULES = [
    { title: "Dominance", desc: "Không bao giờ để lộ tâm lý hoặc suy nghĩ của nhân vật phụ. Toàn bộ cảnh vật lọc qua bộ lọc chủ quan của nhân vật POV." },
    { title: "Ưu tiên Xúc giác", desc: "Mở đầu phân đoạn bắt buộc dùng Xúc giác/Xúc cảm thể xác rồi mới tới Thính giác, Khứu giác và Thị giác." },
    { title: "POV Switching", desc: "Chuyển POV bắt buộc có ngắt cảnh '---' và định nghĩa POV mới rõ ràng." }
  ];

  const VN_OUTLINE_TEMPLATES = [
    {
      name: "Khung phân đoạn POV chuẩn",
      text: `---
**[POV: Tên_Người_Lọc]**
*Anchor:* [Cảm nhận da thịt dính mồ hôi / Gió buốt thổi qua kẽ tai / Mùi máu hay xạ hương nồng nặc]

* Nhân vật phụ "Bộc lộ lời thoại hội thoại..." (vọng âm thanh)
* *Tên_Người_Lọc giật bắn bắp đùi, nhịp tim thít ngực nghẹn thở*
* Tên_Người_Lọc \`Hắn điên rồi, sao có thể kéo tôi vào chuyện này?\``
    }
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-950 h-full w-full">
      
      {/* LEFT WRITING PANELS */}
      <div className="flex-1 overflow-y-auto relative scroll-smooth flex flex-col h-full bg-gray-950">
        
        {/* --- FLOATING TOOLBAR --- */}
        <div className="sticky top-4 right-4 z-40 flex justify-end px-2 md:px-8 pointer-events-none mb-2 animate-fadeIn">
            <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-lg p-1 sm:p-1.5 shadow-xl transition-all relative">
               
               {/* VN Blueprint Trigger */}
               {story?.vnBlueprintMode && (
                   <button 
                      onClick={() => setShowVnBible(!showVnBible)}
                      className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded transition-all border ${
                          showVnBible 
                          ? 'bg-primary-900/40 text-primary-300 border-primary-500/50 shadow-sm' 
                          : 'bg-gray-800/50 text-gray-400 border-transparent hover:text-white'
                      }`}
                      title="Mở Cẩm nang VN & Từ vựng cảm quan"
                   >
                      <span>📘 <span className="hidden xs:inline sm:inline">Cẩm nang</span> VN</span>
                   </button>
               )}

               {story?.vnBlueprintMode && <div className="w-px h-4 bg-gray-700 mx-0.5 animate-pulse"></div>}

               {/* NSFW Toggle shortcut - Hidden on mobile because it's in top navigation */}
               <button 
                  onClick={toggleNsfw}
                  className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded transition-all border ${
                      story?.nsfw 
                      ? 'bg-red-900/40 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                      : 'bg-gray-800/50 text-gray-650 border-transparent hover:text-gray-405'
                  }`}
                  title={story?.nsfw ? "Chế độ NSFW đang BẬT" : "Bật chế độ NSFW"}
               >
                  18+
               </button>

               <div className="hidden md:block w-px h-4 bg-gray-700 mx-0.5"></div>

               {/* AI Edit Trigger */}
               <button
                  onClick={() => setShowAiEdit(!showAiEdit)}
                  disabled={isGenerating}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded transition-all border ${
                      showAiEdit
                      ? 'bg-purple-900/40 text-purple-300 border-purple-500/50'
                      : 'bg-gray-800/50 text-purple-400 border-transparent hover:text-purple-350'
                  }`}
               >
                  <span className="text-[10px]">✨</span>
                  <span className="hidden sm:inline"> Sửa bằng AI</span>
                  <span className="sm:hidden"> Sửa AI</span>
               </button>

               {/* AI Edit Popover */}
               {showAiEdit && (
                   <div className="absolute top-full right-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-3 z-[60] animate-fadeIn">
                       <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Bạn muốn sửa gì?</label>
                       <textarea 
                          value={rewriteInstruction}
                          onChange={(e) => setRewriteInstruction(e.target.value)}
                          className="w-full h-24 bg-black/40 border border-gray-600 rounded p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 mb-2 resize-none"
                          placeholder="VD: Viết lại đoạn này theo văn phong gợi cảm, miêu tả sắc bén hơn..."
                          autoFocus
                       />
                       <div className="flex justify-end gap-2">
                           <button 
                              onClick={() => setShowAiEdit(false)}
                              className="text-xs text-gray-400 hover:text-white px-2 py-1"
                           >
                              Hủy
                           </button>
                           <button 
                              onClick={handleRewrite}
                              className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1 bg-gradient-to-r from-purple-600 to-purple-500 rounded shadow hover:shadow-purple-500/20"
                           >
                              Thực hiện
                           </button>
                       </div>
                   </div>
               )}

               <div className="w-px h-4 bg-gray-700 mx-0.5"></div>

               {/* Mode Toggle */}
               <button 
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded transition-all border ${
                      isEditMode 
                      ? 'bg-primary-900/30 text-primary-300 border-primary-900/40' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800 border-transparent'
                  }`}
               >
                  {isEditMode ? (
                      <>
                          <span className="hidden sm:inline">Sửa thủ công</span>
                          <span className="sm:hidden">Viết</span>
                      </>
                  ) : (
                      <>
                          <span className="hidden sm:inline">Chế độ Đọc</span>
                          <span className="sm:hidden">Đọc</span>
                      </>
                  )}
               </button>
            </div>
        </div>

        <div className="max-w-3xl w-full mx-auto py-10 px-4 md:py-12 md:px-8 flex-1">
          {/* Title Input */}
          {isEditMode ? (
              <input 
                  type="text" 
                  value={activeChapter.title} 
                  onChange={(e) => {
                      // Handled by sidebar name triggers by default
                  }} 
                  className="w-full bg-transparent text-2xl md:text-4xl font-serif font-bold text-gray-100 mb-6 focus:outline-none border-b border-transparent focus:border-gray-800 transition-colors mt-6 md:mt-0"
                  placeholder="Tiêu đề chương"
              />
          ) : (
              <h1 className="text-2xl md:text-4xl font-serif font-bold text-white mb-6 mt-6 md:mt-0 pb-1 border-b border-transparent">
                  {activeChapter.title}
              </h1>
          )}
          
          {/* Content Area */}
          <div className="grid relative text-base md:text-lg leading-relaxed font-serif pb-32">
              
              <div 
                  className={`col-start-1 row-start-1 whitespace-pre-wrap p-0 border-none m-0 w-full overflow-hidden break-words
                  ${isEditMode 
                      ? 'invisible pointer-events-none' // Ghost mode
                      : 'visible text-gray-300'         // Read mode
                  }`}
              >
                  {activeChapter.content + '\u200b'}
              </div>

              <textarea
                  value={activeChapter.content}
                  onChange={(e) => updateChapterContent(activeChapter.id, e.target.value)}
                  placeholder="Bắt đầu viết kiệt tác của bạn..."
                  className={`col-start-1 row-start-1 w-full h-full bg-transparent text-gray-300 focus:outline-none resize-none overflow-hidden placeholder-gray-700 transition-opacity p-0 border-none m-0 break-words
                  ${isGenerating ? 'opacity-80' : 'opacity-100'}
                  ${!isEditMode ? 'hidden' : 'block'} 
                  `}
                  spellCheck={false}
                  readOnly={isGenerating || !isEditMode} 
              />
              
              {isGenerating && (
                  <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none z-10" />
              )}
          </div>
          
          {isGenerating && (
            <div className="fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur border border-primary-500/30 text-primary-400 px-6 py-2 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-bounce-slight">
              <span className="text-sm font-medium tracking-wide">{generationStatus || 'AI đang viết...'}</span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR: BLUEPRINT CANH SANG TAC */}
      {showVnBible && story?.vnBlueprintMode && (
          <>
              {/* Mobile overlay backdrop for Cẩm nang VN */}
              <div 
                  className="fixed inset-0 bg-black/80 z-[45] lg:hidden transition-opacity animate-fadeIn"
                  onClick={() => setShowVnBible(false)}
              />
              <div className="fixed inset-y-0 right-0 z-[50] w-80 h-full bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden lg:relative lg:translate-x-0 lg:z-0 lg:h-full animate-slideIn">
                  <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/80 shrink-0">
                      <div>
                          <h3 className="text-sm font-black text-primary-400 flex items-center gap-1.5">
                              🎭 CẨM NANG VN (BETA)
                          </h3>
                          <p className="text-[10px] text-gray-500 font-bold uppercase w-48 truncate">Sát Vách Lão Vương Blueprint</p>
                      </div>
                      <button onClick={() => setShowVnBible(false)} className="text-gray-400 hover:text-white p-1 text-lg font-bold leading-none">&times;</button>
                  </div>

              {/* Tab Selector */}
              <div className="flex border-b border-gray-850 bg-gray-900/40 shrink-0 text-[10px]">
                  <button onClick={() => setActiveVnTab('lexicon')} className={`flex-1 py-2 font-bold transition-all ${activeVnTab === 'lexicon' ? 'text-primary-400 border-b-2 border-primary-500 bg-gray-900/20' : 'text-gray-500 hover:text-gray-300'}`}>TỪ VỰNG</button>
                  <button onClick={() => setActiveVnTab('pov')} className={`flex-1 py-2 font-bold transition-all ${activeVnTab === 'pov' ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-900/20' : 'text-gray-500 hover:text-gray-300'}`}>GÓC NHÌN</button>
                  <button onClick={() => setActiveVnTab('outline')} className={`flex-1 py-2 font-bold transition-all ${activeVnTab === 'outline' ? 'text-pink-400 border-b-2 border-pink-500 bg-gray-900/20' : 'text-gray-500 hover:text-gray-300'}`}>DÀN Ý</button>
              </div>

              {/* Scrollable pane */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  
                  {copyStatus && (
                      <div className="bg-green-900/40 border border-green-500/50 text-green-400 text-xs text-center py-1.5 rounded animate-fadeIn shrink-0">
                           {copyStatus}
                      </div>
                  )}

                  {activeVnTab === 'lexicon' && (
                      <div className="space-y-4 animate-fadeIn">
                          <p className="text-[10px] text-gray-500 italic leading-tight">Click cụm từ để chèn nhanh vào con trỏ bản thảo.</p>
                          {VN_LEXICON_SECTIONS.map((sec, idx) => (
                              <div key={idx} className="space-y-1.5">
                                  <h4 className="text-[10.5px] font-black text-gray-400 uppercase tracking-wide border-b border-gray-800/50 pb-1">{sec.title}</h4>
                                  <div className="flex flex-wrap gap-1.5">
                                      {sec.items.map((item, itemIdx) => (
                                          <button 
                                              key={itemIdx}
                                              onClick={() => insertTextAtCursor(item.text)}
                                              className="text-[11px] text-gray-300 bg-gray-800/80 hover:bg-primary-900/30 hover:text-primary-300 border border-gray-750 hover:border-primary-500/35 rounded px-2.5 py-1 transition-all text-left font-serif"
                                              title={`Chèn: "${item.text}"`}
                                          >
                                              {item.label}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}

                  {activeVnTab === 'pov' && (
                      <div className="space-y-3.5 animate-fadeIn">
                          <div className="p-3 bg-blue-950/20 border border-blue-900/30 rounded-lg">
                              <h4 className="text-xs font-bold text-blue-400 uppercase mb-1">Mỏ Neo Cảm Giác (Sensory Anchor)</h4>
                              <p className="text-[11px] text-gray-400 leading-normal mb-1">Bắt đầu mỗi cảnh, hãy mô tả cơ thể trước cảnh vật:</p>
                              <span className="text-[11px] text-blue-300 font-bold block">Chạm (Xúc giác) &gt; Nghe (Thính) &gt; Ngửi (Khứu) &gt; Nhìn (Thị).</span>
                          </div>
                          <div className="space-y-3">
                              {VN_POV_RULES.map((rule, idx) => (
                                  <div key={idx} className="space-y-0.5 border-l-2 border-gray-800 pl-2.5">
                                      <h5 className="text-xs font-bold text-gray-300">{rule.title}</h5>
                                      <p className="text-[11px] text-gray-400/90 leading-relaxed">{rule.desc}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {activeVnTab === 'outline' && (
                      <div className="space-y-3.5 animate-fadeIn">
                          <p className="text-[11px] text-gray-500 leading-normal">Hệ thống gợi ý viết văn bản theo từng nốt phẳng (vn-outline). Bấm chèn mẫu dàn ý bên dưới:</p>
                          {VN_OUTLINE_TEMPLATES.map((tmpl, idx) => (
                              <div key={idx} className="border border-gray-800 rounded-lg overflow-hidden bg-black/20">
                                  <div className="bg-gray-800 p-2 text-xs font-bold text-gray-300 flex justify-between items-center">
                                      <span>{tmpl.name}</span>
                                      <button 
                                          onClick={() => insertTextAtCursor(tmpl.text)}
                                          className="text-[10px] text-primary-400 font-bold hover:text-primary-300 uppercase shrink-0"
                                      >
                                          + Chèn mẫu
                                      </button>
                                  </div>
                                  <pre className="text-[10px] text-pink-400/80 p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all font-mono">
                                      {tmpl.text}
                                  </pre>
                              </div>
                          ))}
                      </div>
                  )}

              </div>
              <div className="p-4 border-t border-gray-800 bg-gray-950 shrink-0 text-[10px] text-gray-600 flex justify-between uppercase font-bold">
                  <span>Aetheria Engine</span>
                  <span className="text-primary-500">Active</span>
              </div>
          </div>
          </>
      )}

    </div>
  );
};