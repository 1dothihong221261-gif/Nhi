export const VN_BLUEPRINTS = {
  POV: `
---
name: vn-povs
description: Perspective Control System for Vietnamese immersive narrative. Enforces scene-level POV dominance, sensory anchoring, subjective filtering, hard-break transitions, and External lens mode.
---

# vn-POVs — Perspective Control System

## Core Law — Scene-Level Dominance
POV is the governing consciousness of the ENTIRE scene, not just the character currently speaking.
When POV: [Name] is declared, even if other characters speak or act, the reader only knows what the POV character can perceive. We see other characters' words and actions — not their internal states or thoughts.

## Anchor Rule
Every POV block MUST begin with an Anchor grounding the reader in the character's immediate physical experience before any action or dialogue.
Anchor Priority Order: Touch/Physical Sensation > Sound > Smell > Sight
Minimum 2 senses, maximum 3 sentences.

## Senses and Inference
- Can feel their own internal state, pain, core feelings.
- Can ONLY observe other characters' bodies, posture, words.
- All emotions or thoughts of other characters must be INFERRED through physical observation (e.g., "LT đoán hắn đang tức giận").

## Transitions
POV switches require a hard scene break:
---
**POV: [New Character]**
[New Sensory Anchor]
`,

  OUTLINE: `
---
name: vn-outline
description: Virtual Novel scene blueprint and outline engine. Converts raw story ideas into structured chapter-by-chapter outlines using strict POV anchoring, sensory scene setup, and flat-list beat mapping.
---

# vn-outline — The Inside-Out Blueprint

## The Process
1. Setup Scene: Define Location, Temperature, Lighting, Smellscape.
2. Load Traits: Identify active character traits to determine their Subjective Filter.
3. Map Chain: Action -> Physiological Reflex -> Psychological Reaction.

## Formatting Rules (Strict Flat List)
Use ONLY these markers. No nested bullets. No scene summaries.

- **[POV: Name]** & **Anchor:** [Sensory Input]
- * Name \`internal thought / motive / psychological state\` (use backticks)
- * Name "Dialogue" (subtext/tone in parentheses)
- * *Name physical action / physiological reflex* (use italics)
- * *[Trigger: cue]* -> *Memory fragment* (use italics)
`,

  WORLDBUILDING: `
---
name: vn-worldbuilding
description: Immersive worldbuilding engine. Generates sensory-rich, agent-driven environments that actively create pressure, mystery, and conflict.
---

# vn-WorldBuilding — Living World Engine

## Core Rules
1. **World is Alive:** Factions, NPCs, and environments change independently. NPCs have their own goals.
2. **Detail Over Summary:** Focus on specific concrete seeds (e.g. wet rain slipping into boots) instead of abstract dumps.
3. **Sensory First:** Experience the bose through the POV character's senses.
4. **World Memory:** reputation changes, environment decay, NPC echoes, cultural shifts.
`,

  LEXICON: `
---
name: vn-lexicon
description: Vietnamese Sensory Vocabulary Engine. Provides compound-phrase construction rules, anatomical synonym banks, fluid descriptors, state/texture adjectives, erotic action verbs, and phonetic onomatopoeia to enforce visceral and modifier-bound expression.
---

# vn-lexicon — Vocabulary Engine

## Compound Phrase Construction Rule
Never use a raw noun alone. Bind every noun to at least one modifier denoting texture, temperature, state, or relationship.

## Modifier / Synonyms Banks (Vietnamese Erotic & Sensory Prose)
1. **Bầu ngực / Núm vú:** "núi thịt ấm mềm", "hai túi mỡ", "nhũ hoa đang dựng đứng", "đôi bầu trắng nõn".
2. **Cửa mình / Vùng hạ thể:** "khe nước đang rỉ", "rãnh thịt ẩm", "nhục bích", "nhục bích ướt đẫm kéo sợi".
3. **Cự vật / Gậy thịt:** "gậy thịt căng cứng", "thiết bảng", "cự vật đỏ sẫm phập phồng", "mũ thịt đỏ sẫm".
4. **Chất dịch (Fluids):** "dâm dịch kéo sợi", "mật đào ngọt hăng", "vệt hồng", "thứ nước đục tanh nồng".
5. **Đặc tính vật lý:** "ướt nhèm nhơn nhớt", "co bóp nhịp nhịp", "chặt như vít", "nóng rực âm ấm", "cương cứng giật giật".
6. **Hành động:** "thúc sâu từng nhịp", "luồn qua phập vào", "banh rộng tách ra", "rỉ chảy nhỏ giọt".
7. **Âm thanh (Phonetic Onomatopoeia):** *ư... ư...*, *mnn...*, *ah... ah...*, *bạch bạch bạch* (skin contact), *chặp chặp*, *lép bép*.
`,

  FULLWRITE: `
---
name: vn-fullwrite
description: Virtual novel prose rendering engine. Transforms structured outlines into immersive in-character prose using strict POV filtering, sensory vocabulary, and living world detail.
---

# vn-fullwrite — The Flesh Rendering Engine

## Formatting Rules
- **No Omniscient Narrator:** Avoid "cô cảm thấy", "hành vi của hắn cho thấy...". Use visceral physical states instead: "mặt cô nóng bừng, móng tay cắm vào đùi bật máu".
- **Vocabulary Multi-POV:** When writing intimate, visceral, or tense scenes, rotate through sensory synonyms. Use base, animalistic or clinical words appropriately depending on the subject's perspective (victim: raw/intimate; abuser/observer: cold/clinical).
- **Time-Slicing:** Render physical poses -> soundscape details -> fluid warmth -> bruises or consequences progressively.
- **Tone & Prose:** Let thoughts be fragmented. Use backticks or italics for abrupt internal monologues. Weave sounds directly into action sentences (*bạch bạch bạch*, *chụt chụt*).
`
};

export const getVnBlueprintPrompt = (isNsfw: boolean = false): string => {
  return `
### 🎭 HỆ THỐNG VIẾT TIỂU THUYẾT VIRTUAL NOVEL (VIỆT HÓA - SÁT VÁCH LÃO VƯƠNG)
Hệ thống này quy định khắt khe bối cảnh tương tác, góc nhìn, nhịp độ và văn phong của truyện. Khi viết, bắt buộc phải áp dụng triệt để các nguyên tắc sau:

${VN_BLUEPRINTS.POV}

${VN_BLUEPRINTS.WORLDBUILDING}

${VN_BLUEPRINTS.LEXICON}

${VN_BLUEPRINTS.FULLWRITE}

${isNsfw ? `
#### ⚠️ LƯU Ý NSFW (CẢNH 18+ VIỆT HÓA CHUYÊN SÂU):
- Sử dụng triệt để bộ từ vựng vn-lexicon khi miêu tả các va chạm xác thịt, cơ thể phập phồng và chất dịch rỉ ra.
- Tả kỹ nhịp thở, âm thanh cơ thể sinh ra (*bạch bạch bạch*, *lực thúc*), cảm giác ấm, lạnh, khít khao và sần sùi.
- Biến đổi từ ngữ liên tục ứng với góc nhìn nhân vật, không dùng lặp từ.` : ''}
`;
};
