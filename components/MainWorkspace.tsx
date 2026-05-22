
import React, { useState } from 'react';
import { useStory } from '../state/StoryContext';
import { Sidebar } from './Sidebar';
import { Editor } from './Editor';
import { StorySettingsModal } from './StorySettingsModal';

export const MainWorkspace: React.FC = () => {
    const { story, generateContinue, isGenerating, generationStatus, tokenStats, userInstruction, setUserInstruction, updateStorySettings } = useStory();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State cho Mobile Sidebar
    const [isMobilePanelCollapsed, setIsMobilePanelCollapsed] = useState(true); // State cho Mobile Collapse (mặc định thu gọn)

    const handleGenerate = async () => {
        await generateContinue();
        setUserInstruction('');
    };

    const toggleNsfw = () => {
        if (story) {
            updateStorySettings({ nsfw: !story.nsfw });
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-950 text-slate-200 selection:bg-primary-500/30 selection:text-white">
            {/* Mobile Overlay Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 z-40 md:hidden transition-opacity animate-fadeIn"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar 
                onOpenSettings={() => setIsSettingsOpen(true)} 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col relative z-0 w-full overflow-hidden">
                {/* Mobile Top Header Navigation */}
                <div className="md:hidden h-14 shrink-0 bg-gray-900 border-b border-gray-800 px-4 flex items-center justify-between z-30 select-none shadow-md">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-750 text-gray-400 hover:text-white rounded border border-gray-750 transition-colors text-xs font-bold uppercase"
                    >
                        MENU
                    </button>
                    <span className="text-sm font-serif font-bold text-gray-200 truncate max-w-[150px] px-2" title={story?.title}>
                        {story?.title}
                    </span>
                    <div className="flex gap-1.5">
                        {story?.vnBlueprintMode && (
                            <button 
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent('toggle-vn-bible'));
                                }}
                                className="px-2.5 py-1.5 bg-primary-950/40 text-primary-400 hover:text-primary-300 border border-primary-900/35 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
                                title="Mở Cẩm nang VN"
                            >
                                📘 VN
                            </button>
                        )}
                        <button 
                            onClick={toggleNsfw}
                            className={`text-[9.5px] font-black px-2 py-1.5 rounded border transition-all ${
                                story?.nsfw 
                                ? 'bg-red-950/40 text-red-400 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.15)]' 
                                : 'text-gray-500 border-gray-800 hover:text-gray-400'
                            }`}
                        >
                            18+
                        </button>
                    </div>
                </div>

                <Editor />
                
                {/* Floating Action / AI Director Control - MOBILE ONLY (md:hidden) */}
                <div className="md:hidden absolute bottom-4 right-4 z-20 w-[calc(100%-2rem)] flex flex-col gap-2 transition-all duration-300">
                     <div className="bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl transition-all hover:border-primary-500/30 group overflow-hidden">
                        
                        {/* Header / Toggle Area */}
                        <div 
                            className={`flex justify-between items-center p-3 cursor-pointer select-none ${!isMobilePanelCollapsed ? 'border-b border-white/5 bg-gray-800/30' : ''}`}
                        >
                            <div 
                                onClick={() => setIsMobilePanelCollapsed(!isMobilePanelCollapsed)}
                                className="flex-1 flex items-center gap-2"
                            >
                                <label className="block text-xs font-bold text-primary-400 uppercase tracking-wide cursor-pointer">
                                    Kịch bản / Chỉ đạo AI
                                </label>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); toggleNsfw(); }}
                                    className={`text-[9px] font-black px-2 py-0.5 rounded border transition-all ${
                                        story?.nsfw 
                                        ? 'bg-red-900/40 text-red-400 border-red-500/50' 
                                        : 'text-gray-600 border-gray-700'
                                    }`}
                                >
                                    18+
                                </button>

                                <button 
                                    onClick={() => setIsMobilePanelCollapsed(!isMobilePanelCollapsed)}
                                    className="text-gray-400 hover:text-white transition-transform duration-300 text-xs font-bold"
                                >
                                    {isMobilePanelCollapsed ? "MỞ" : "ĐÓNG"}
                                </button>
                            </div>
                        </div>

                        {/* Collapsible Content */}
                        {!isMobilePanelCollapsed && (
                            <div className="p-3 pt-2 animate-fadeIn">
                                <textarea
                                    value={userInstruction}
                                    onChange={(e) => setUserInstruction(e.target.value)}
                                    disabled={isGenerating}
                                    placeholder="VD: Một kẻ thù bí ẩn xuất hiện từ bóng tối..."
                                    className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none h-16 transition-colors custom-scrollbar"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.ctrlKey && !isGenerating) {
                                            handleGenerate();
                                        }
                                    }}
                                />
                                
                                <div className="flex justify-between items-center mt-2">
                                     <div className="text-[10px] text-gray-500 flex flex-col">
                                        <span className="text-gray-600 mt-0.5 font-mono">
                                            Token: <span className="text-primary-400">{tokenStats.current}</span>
                                        </span>
                                     </div>
                                     <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white text-xs shadow-lg border border-white/5 transition-all uppercase
                                        ${isGenerating 
                                            ? 'bg-gray-700 cursor-not-allowed opacity-80' 
                                            : 'bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 hover:shadow-primary-500/25'
                                        }`}
                                     >
                                        {isGenerating ? (generationStatus || 'ĐANG VIẾT...') : 'VIẾT TIẾP'}
                                     </button>
                                </div>
                            </div>
                        )}
                     </div>
                </div>
            </main>
            <StorySettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
}
