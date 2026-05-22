import React, { useState } from 'react';
import { Character, CharacterAppearance } from '../types';
import { useStory } from '../state/StoryContext';

interface Props {
  characters: Character[];
}

export const CharacterList: React.FC<Props> = ({ characters }) => {
  const { updateCharacter } = useStory();
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [detailTab, setDetailTab] = useState<'info' | 'psych' | 'stats'>('info');

  const [editingChar, setEditingChar] = useState<Character | null>(null);
  const [editFormData, setEditFormData] = useState<Character | null>(null);
  const [editTab, setEditTab] = useState<'basic' | 'appearance' | 'rpg'>('basic');
  const [traitsText, setTraitsText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [inventoryText, setInventoryText] = useState('');

  const handleSaveEdit = () => {
    if (!editFormData) return;
    if (!editFormData.name.trim()) {
        alert("Tên nhân vật không được để trống!");
        return;
    }
    
    const updatedChar: Character = {
        ...editFormData,
        traits: traitsText ? traitsText.split(',').map(t => t.trim()).filter(t => t.length > 0) : [],
        skills: skillsText ? skillsText.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
        inventory: inventoryText ? inventoryText.split(',').map(i => i.trim()).filter(i => i.length > 0) : []
    };
    
    updateCharacter(updatedChar);
    setEditFormData(null);
    setEditingChar(null);
  };

  const handleAppearanceChange = (key: keyof CharacterAppearance, value: string) => {
    if (!editFormData) return;
    const currentApp = getSafeAppearance(editFormData);
    setEditFormData({
      ...editFormData,
      appearance: {
        ...currentApp,
        [key]: value
      }
    });
  };

  if (characters.length === 0) {
    return <div className="text-gray-500 italic text-sm p-4">Chưa tìm thấy nhân vật nào. Hãy viết thêm và dùng chức năng "Quét thực thể" để AI phân tích.</div>;
  }

  // Safe checks for new schema vs old schema characters
  const getSafeAppearance = (char: Character) => {
      if (typeof char.appearance === 'string') return { general: char.appearance, face: '', body: '', hair: '', clothing: '' };
      return char.appearance || { general: "Chưa có thông tin", face: '', body: '', hair: '', clothing: '' };
  };

  return (
    <>
      <div className="space-y-4 p-4 pb-20">
        {characters.map(char => (
          <div 
            key={char.id} 
            onClick={() => setSelectedChar(char)}
            className="group relative bg-gray-850 border border-gray-700 rounded-lg p-3 hover:border-primary-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-primary-900/10 hover:-translate-y-0.5"
            title="Nhấn để xem chi tiết Profile"
          >
            {/* FIXED HEADER: Name takes priority, Role is constrained */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-bold text-sm text-gray-200 group-hover:text-primary-400 transition-colors line-clamp-2 leading-tight">
                  {char.name}
              </h4>
              <div className="flex items-center gap-1.5 shrink-0">
                <span 
                  className="max-w-[80px] truncate text-[10px] px-1.5 py-0.5 rounded-full bg-gray-900 text-gray-400 border border-gray-800 group-hover:border-primary-500/50 group-hover:text-primary-400 transition-colors"
                  title={char.role}
                >
                  {char.role}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingChar(char);
                    setEditFormData({ ...char });
                    setTraitsText(char.traits ? char.traits.join(', ') : '');
                    setSkillsText(char.skills ? char.skills.join(', ') : '');
                    setInventoryText(char.inventory ? char.inventory.join(', ') : '');
                    setEditTab('basic');
                  }}
                  className="px-1.5 py-0.5 rounded bg-gray-800 hover:bg-gray-750 text-gray-400 hover:text-white transition-colors text-[9px] font-bold border border-gray-700 flex items-center gap-0.5 shadow-sm"
                  title="Chỉnh sửa nhân vật"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                  </svg>
                  SỬA
                </button>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 line-clamp-2 mb-3 h-8 leading-relaxed">
                {char.core_personality ? `[${char.core_personality}] ` : ''}{char.description}
            </p>
            
            {char.status && (
                <div className="mb-2 text-[10px] text-yellow-500 bg-yellow-900/10 px-2 py-1 rounded border border-yellow-900/30 truncate">
                    Trạng thái: {char.status}
                </div>
            )}
            
            <div className="flex flex-wrap gap-1 mb-1 overflow-hidden h-5">
              {char.traits.slice(0, 3).map((trait, i) => (
                <span key={i} className="text-[10px] bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded border border-gray-800 whitespace-nowrap">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CHARACTER DETAIL MODAL */}
      {selectedChar && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 animate-fadeIn"
            onClick={() => setSelectedChar(null)}
        >
            <div 
                className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-800 flex justify-between items-start bg-gray-850/50">
                    <div className="pr-8 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight">{selectedChar.name}</h3>
                        </div>
                        <span className="inline-block text-xs font-bold px-2 py-1 rounded bg-primary-900/30 text-primary-400 border border-primary-900/50 uppercase tracking-wider mt-1">
                            {selectedChar.role}
                        </span>
                    </div>
                    <button 
                        onClick={() => setSelectedChar(null)}
                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded transition-colors text-xs font-bold uppercase"
                    >
                        ĐÓNG
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800 bg-gray-800/30">
                    <button onClick={() => setDetailTab('info')} className={`flex-1 py-3 text-xs font-bold uppercase ${detailTab === 'info' ? 'text-primary-400 border-b-2 border-primary-500' : 'text-gray-500 hover:text-white'}`}>Hồ Sơ</button>
                    <button onClick={() => setDetailTab('psych')} className={`flex-1 py-3 text-xs font-bold uppercase ${detailTab === 'psych' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 hover:text-white'}`}>Tâm Lý</button>
                    <button onClick={() => setDetailTab('stats')} className={`flex-1 py-3 text-xs font-bold uppercase ${detailTab === 'stats' ? 'text-yellow-400 border-b-2 border-yellow-500' : 'text-gray-500 hover:text-white'}`}>Trạng thái</button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
                    
                    {detailTab === 'info' && (
                        <div className="space-y-4 animate-fadeIn">
                             {/* Description */}
                             <div className="text-sm text-gray-300 leading-7 whitespace-pre-wrap">
                                {selectedChar.description}
                            </div>

                            {/* Appearance Box */}
                            <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800 space-y-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-800 pb-1">
                                    Ngoại hình
                                </label>
                                {(() => {
                                    const app = getSafeAppearance(selectedChar);
                                    return (
                                        <>
                                            <p className="text-sm text-gray-300 italic">{app.general}</p>
                                            {app.face && <div className="flex gap-2 text-xs"><span className="text-gray-500 w-16 shrink-0">Khuôn mặt:</span> <span className="text-gray-300">{app.face}</span></div>}
                                            {app.hair && <div className="flex gap-2 text-xs"><span className="text-gray-500 w-16 shrink-0">Tóc:</span> <span className="text-gray-300">{app.hair}</span></div>}
                                            {app.body && <div className="flex gap-2 text-xs"><span className="text-gray-500 w-16 shrink-0">Dáng:</span> <span className="text-gray-300">{app.body}</span></div>}
                                            {app.clothing && <div className="flex gap-2 text-xs"><span className="text-gray-500 w-16 shrink-0">Phục trang:</span> <span className="text-gray-300">{app.clothing}</span></div>}
                                        </>
                                    );
                                })()}
                            </div>
                            
                            {selectedChar.voiceSample && (
                                <div className="bg-gray-800/30 p-3 rounded border border-gray-700 italic text-gray-400 text-xs">
                                    <span className="text-gray-500 not-italic font-bold mr-2">Voice:</span> 
                                    "{selectedChar.voiceSample}"
                                </div>
                            )}
                        </div>
                    )}

                    {detailTab === 'psych' && (
                        <div className="animate-fadeIn space-y-4">
                            <div className="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20 mb-4">
                                <h4 className="text-xs font-bold text-purple-400 uppercase mb-2">Tính cách cốt lõi</h4>
                                <p className="text-sm text-gray-300">{selectedChar.core_personality || "Chưa xác định"}</p>
                            </div>
                            
                            <div className="text-center text-gray-600 text-[10px] italic py-4">
                                Các chỉ số Big Five được AI sử dụng ngầm để mô phỏng hành vi.
                            </div>
                        </div>
                    )}

                    {detailTab === 'stats' && (
                         <div className="animate-fadeIn space-y-4">
                             {/* Short Status from Extractor */}
                             <div className="bg-yellow-900/10 p-4 rounded-lg border border-yellow-900/30 mb-4">
                                <h4 className="text-xs font-bold text-yellow-500 uppercase mb-2">Trạng thái hiện tại</h4>
                                <p className="text-sm text-gray-300">{selectedChar.status || "Bình thường"}</p>
                             </div>
                             
                             <div className="text-center text-gray-600 text-[10px] italic py-4">
                                Ma trận cảm xúc được AI sử dụng ngầm để điều hướng hội thoại.
                             </div>
                         </div>
                    )}
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-gray-800 bg-gray-850/30">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {selectedChar.traits.map((t, i) => (
                            <span key={i} className="text-[10px] px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-400">
                                #{t}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* CHARACTER EDIT MODAL */}
      {editFormData && (
        <div 
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 animate-fadeIn"
            onClick={() => {
                setEditFormData(null);
                setEditingChar(null);
            }}
        >
            <div 
                className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-gray-800 flex justify-between items-center bg-gray-850/50">
                    <div>
                        <h3 className="text-lg font-serif font-bold text-white leading-tight">Chỉnh sửa Nhân vật</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Cập nhật đặc điểm và hồ sơ của {editFormData.name}</p>
                    </div>
                    <button 
                        onClick={() => {
                            setEditFormData(null);
                            setEditingChar(null);
                        }}
                        className="p-1 px-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded transition-colors text-[10px] font-bold uppercase"
                    >
                        HỦY
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800 bg-gray-800/30 shrink-0">
                    <button 
                        onClick={() => setEditTab('basic')} 
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${editTab === 'basic' ? 'text-primary-400 border-b-2 border-primary-500 bg-gray-800/20' : 'text-gray-500 hover:text-white'}`}
                    >
                        Cơ bản
                    </button>
                    <button 
                        onClick={() => setEditTab('appearance')} 
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${editTab === 'appearance' ? 'text-purple-400 border-b-2 border-purple-500 bg-gray-800/20' : 'text-gray-500 hover:text-white'}`}
                    >
                        Ngoại hình
                    </button>
                    <button 
                        onClick={() => setEditTab('rpg')} 
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${editTab === 'rpg' ? 'text-yellow-400 border-b-2 border-yellow-500 bg-gray-800/20' : 'text-gray-500 hover:text-white'}`}
                    >
                        RPG / Hệ thống
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                    {editTab === 'basic' && (
                        <div className="space-y-3 animate-fadeIn">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tên nhân vật</label>
                                    <input 
                                        type="text" 
                                        value={editFormData.name} 
                                        onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Vai trò</label>
                                    <input 
                                        type="text" 
                                        value={editFormData.role} 
                                        onChange={e => setEditFormData({ ...editFormData, role: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">MBTI</label>
                                    <input 
                                        type="text" 
                                        value={editFormData.mbti || ""} 
                                        onChange={e => setEditFormData({ ...editFormData, mbti: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                        placeholder="VD: INFJ, INTJ..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Trạng thái hiện tại</label>
                                    <input 
                                        type="text" 
                                        value={editFormData.status || ""} 
                                        onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                        placeholder="VD: Bình thường, bị thương..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tính cách cốt lõi</label>
                                <input 
                                    type="text" 
                                    value={editFormData.core_personality || ""} 
                                    onChange={e => setEditFormData({ ...editFormData, core_personality: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                    placeholder="VD: Lạnh lùng, bên ngoài cứng rắn bên trong ấm áp..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Mô tả / Tiểu sử</label>
                                <textarea 
                                    value={editFormData.description} 
                                    onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none h-24 resize-y leading-relaxed"
                                    placeholder="Mô tả tóm tắt lai lịch, mối quan hệ..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Thẻ tính cách (Traits - Cách nhau bởi dấu phẩy)</label>
                                <input 
                                    type="text" 
                                    value={traitsText} 
                                    onChange={e => setTraitsText(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                    placeholder="VD: lạnh lùng, trung thành, tàn nhẫn"
                                />
                            </div>
                        </div>
                    )}

                    {editTab === 'appearance' && (
                        <div className="space-y-3 animate-fadeIn">
                            {(() => {
                                const app = getSafeAppearance(editFormData);
                                return (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Ngoại hình chung</label>
                                            <textarea 
                                                value={app.general} 
                                                onChange={e => handleAppearanceChange('general', e.target.value)}
                                                className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none h-20 resize-y leading-relaxed"
                                                placeholder="VD: Cao ráo, luôn mặc y phục trắng..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Khuôn mặt</label>
                                                <input 
                                                    type="text" 
                                                    value={app.face} 
                                                    onChange={e => handleAppearanceChange('face', e.target.value)}
                                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                                    placeholder="VD: Đẹp sắc sảo, mắt màu lục..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Kiểu tóc</label>
                                                <input 
                                                    type="text" 
                                                    value={app.hair} 
                                                    onChange={e => handleAppearanceChange('hair', e.target.value)}
                                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                                    placeholder="VD: Đen dài búi trâm phượng..."
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Thân hình / Vóc dáng</label>
                                                <input 
                                                    type="text" 
                                                    value={app.body || ""} 
                                                    onChange={e => handleAppearanceChange('body', e.target.value)}
                                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                                    placeholder="VD: Mảnh khảnh, cao 1m7..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Phục trang</label>
                                                <input 
                                                    type="text" 
                                                    value={app.clothing} 
                                                    onChange={e => handleAppearanceChange('clothing', e.target.value)}
                                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                                    placeholder="VD: Trường bào đạo sĩ..."
                                                />
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Mẫu giọng nói (Voice Sample)</label>
                                <input 
                                    type="text" 
                                    value={editFormData.voiceSample || ""} 
                                    onChange={e => setEditFormData({ ...editFormData, voiceSample: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                    placeholder="VD: 'Ta không quan tâm người là ai, hãy rời khỏi đây!'"
                                />
                            </div>
                        </div>
                    )}

                    {editTab === 'rpg' && (
                        <div className="space-y-3 animate-fadeIn">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Công pháp / Cảnh giới / Phẩm cấp</label>
                                <input 
                                    type="text" 
                                    value={editFormData.cultivation || ""} 
                                    onChange={e => setEditFormData({ ...editFormData, cultivation: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                    placeholder="VD: Trúc Cơ Kỳ, Ma Pháp Sư Tam Cấp..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Kỹ năng / Chiêu thức (Cách nhau bởi dấu phẩy)</label>
                                <textarea 
                                    value={skillsText} 
                                    onChange={e => setSkillsText(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none h-20 resize-y leading-relaxed"
                                    placeholder="VD: Hỏa Cầu Thuật, Ngự Kiếm Phi Hành, Kim Thân Quyết..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Túi hành trang / Bảo vật (Cách nhau bởi dấu phẩy)</label>
                                <textarea 
                                    value={inventoryText} 
                                    onChange={e => setInventoryText(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-xs text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none h-20 resize-y leading-relaxed"
                                    placeholder="VD: Túi Trữ Vật, Trọng Kiếm, Linh Đan..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 bg-gray-850/50 flex justify-end gap-2 shrink-0">
                    <button 
                        onClick={() => {
                            setEditFormData(null);
                            setEditingChar(null);
                        }}
                        className="px-4 py-2 text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors"
                    >
                        HỦY
                    </button>
                    <button 
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded text-xs font-black uppercase shadow-lg shadow-primary-900/20 transition-all flex items-center gap-1.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        LƯU THAY ĐỔI
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};