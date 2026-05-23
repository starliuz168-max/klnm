import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI SDK on the backend safely
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log('GoogleGenAI SDK initialized successfully on backend server.');
  } catch (error) {
    console.error('Failed to initialize GoogleGenAI:', error);
  }
} else {
  console.warn('GEMINI_API_KEY environment variable is not defined. AI help features will run in mock fallback mode.');
}

// REST API endpoint for AI Task Generation
app.post('/api/ai/generate', async (req, res) => {
  const { categoryLabel } = req.body;
  if (!categoryLabel) {
    return res.status(400).json({ error: 'categoryLabel is required' });
  }

  // Fallback data in case Gemini key is missing or calls fail
  const getFallback = (cat: string) => {
    switch (cat) {
      case '跑腿':
      case '跑腿代买':
        return {
          title: '代买网红咖啡送至静安寺写字楼',
          description: '下午开会犯困，急需两杯M Stand限时特调生椰冷萃（大杯、微冰、无糖）。由于店铺排队极其严重，接单后请在店内排队购买并送至国际金融中心C座。',
          requirements: [
            '1. 请在下午15:00之前派送，保证咖啡温度。',
            '2. 必须自备隔热防护袋，汤汁切勿倾洒。',
            '3. 派送至12楼前台，到达后提前5分钟拨打联系电话，不要按门铃。',
            '4. 物主已付清商品费重，小费和配送费已包含在内。'
          ]
        };
      case '家政':
      case '家政保洁':
        return {
          title: '两室一厅公寓日常清扫除尘',
          description: '周末出差归来，家里积满灰尘。主要是客厅地板拖洗、主卧被套更换、露台绿植浇水以及宠物零食补充。无重油污清理，普通清扫器具均备齐。',
          requirements: [
            '1. 自备或使用房东提供的无纺布拖布进行两次除尘拖地。',
            '2. 对洗手池和马桶进行基础除垢，去除异味。',
            '3. 露台十余盆多肉植物和一盆发财树适量浇水。',
            '4. 全程注意个人卫生，戴好保护手套和鞋套。'
          ]
        };
      case '宠物':
      case '宠物照看':
      case '宠物代遛':
        return {
          title: '帮忙上门喂猫兼给金毛铲屎',
          description: '邻近居民因短途回老家2天，家里有1只大橘和1条成年温软金毛犬。需要你上门一次，检查食盆，倒干净水，并给家里的猫咪清洁两个猫砂盆，带走垃圾。',
          requirements: [
            '1. 进屋必须当面拍猫咪和金毛的10秒安全状态视频给主人确认。',
            '2. 猫粮和狗狗狗粮按刻度盘准确盛放，并在水池续纯净水。',
            '3. 清理两个中号猫砂盆，收集结团物进封口塑料袋带走丢弃。',
            '4. 顺手遛一下金毛，在小区花园内遛足15分钟，自备拾便袋。'
          ]
        };
      case '组装':
      case '维修':
      case '搬家':
      case '家修组装':
        return {
          title: '组装宜家简易书柜与收纳筐一对',
          description: '购买了宜家经典的毕利（BILLY）五层大书柜以及一对配套的编织收纳筐。有完整纸面图纸和全部配螺丝针脚，单人一小时内即可稳稳组装完成。',
          requirements: [
            '1. 配送和自行组装需自备普通手持螺丝双头刀、小木锤。',
            '2. 对照原版说明书紧密连接，不可硬凿硬敲防止木板崩裂。',
            '3. 组装完毕后协助搬移到卧室墙角固定，带走拆卸下的所有废旧纸箱。',
            '4. 如果有组装相关经验或者熟练工优先入选。'
          ]
        };
      default:
        return {
          title: `急需帮忙代办关于「${categoryLabel}」的小事`,
          description: `因为临时时间冲突走不开，急需靠谱人手代办日常小事务，事情内容不繁琐但需要足够的耐心、诚信与安全意识，多谢牛马老哥搭把手！`,
          requirements: [
            '1. 需要办事态度认真细致，提前5分钟沟通具体细节。',
            '2. 整个线下过程通过平台拍照或电话同步，保持充分透明。',
            '3. 注意个人信息与隐私安全保护，按时合规完成。',
            '4. 如果发生变故，随时给发布人留言，切勿自作主张。'
          ]
        };
    }
  };

  if (!ai) {
    console.log('Skipping Gemini call (no API key). Returning realistic default mockup data.');
    return res.json(getFallback(categoryLabel));
  }

  try {
    const prompt = `你是一个有趣的现代同城生活打零工App“快乐牛马-同城小事有人帮”的AI任务标题与说明生成器。
用户刚刚选择了任务分类: "${categoryLabel}"。
请根据这一个分类，随机发挥，生成一个切合实际且超级真实有趣的、发生在上海的同城轻任务(任务包含：小标题、详细描述说明和4条具体要求点)。
格式必须非常自然、像真实的众包跑腿、家政、维修、宠物遛犬、临时帮忙等小任务单子，要求幽默有趣，且符合公共道德安全！

请生成并直接返回如下JSON格式的对象：
{
  "title": "任务的标题，必须直观生动、带上地点或背景细节，例如：代买三份午餐送至写字楼、徐汇滨江代遛金毛狗 30分钟、静安寺附近日式美甲工作室日常除尘，30字以内",
  "description": "任务的具体需求细节描述，介绍缘由、怎么配合。150字以内",
  "requirements": [
    "第1条具体要求，语气正规诚恳，字数精炼",
    "第2条具体要求",
    "第3条具体要求",
    "第4条具体要求"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            requirements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['title', 'description', 'requirements']
        }
      }
    });

    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);
    return res.json(parsed);

  } catch (error) {
    console.error('Gemini generate content failed:', error);
    // Silent failover to custom realistic response mockup
    return res.json(getFallback(categoryLabel));
  }
});

// REST API endpoint for Interactive AI Chat Dialogue with Draft Adoption
app.post('/api/ai/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages is required and must be an array' });
  }

  // Fallback mocks for simulated chat when GEMINI_API_KEY is missing or fails
  const mockChatReply = (userMsg: string) => {
    const msgLower = userMsg.toLowerCase();
    if (msgLower.includes('排队') || msgLower.includes('排') || msgLower.includes('queue')) {
      return {
        text: "老铁！排队代办这差事我给你润色好啦！现在网红店排队多，雇主老板一键采用这个单子必火！",
        draft: {
          title: "代排网红吉事果排队并顺丰送到写字楼",
          category: "run",
          description: "帮我去静安寺久光百货负一楼的网红烘焙店代排队，购买现烤手作吉事果2盒。由于高峰期排队约45分钟，请到手后第一时间配送送达恒隆广场写字楼，保持酥脆温热！",
          budget: 45
        }
      };
    } else if (msgLower.includes('狗') || msgLower.includes('猫') || msgLower.includes('宠')) {
      return {
        text: "宠物代遛来啦！现在的雇主最心疼家里的毛孩子了。你看这个拟定如何，诚意拉满！",
        draft: {
          title: "徐汇滨江代遛萨摩耶30分钟 (体能消耗者)",
          category: "pet",
          description: "家有超高精力萨摩耶，急需一位跑步健将带着在徐汇滨江步道散步、慢跑30分钟。请务必自备并系好牵引绳，不乱捡食地上垃圾。遛完用湿纸巾将狗狗四爪及肚皮擦拭干净，并在碗中倒入纯净水。",
          budget: 35
        }
      };
    } else if (msgLower.includes('搬家') || msgLower.includes('搬') || msgLower.includes('装') || msgLower.includes('移')) {
      return {
        text: "搬家装配找牛马妥妥靠谱！我为您准备了一份非常合理的家具组装及短途搬家求助模板：",
        draft: {
          title: "协助搬运两件大行李箱并拼装宜家简易书柜",
          category: "install",
          description: "因周末租房搬迁，需搭把手将两只28寸满载行李箱从1楼搬到3楼无电梯公寓。并协助将宜家最新款简易收纳书柜拼装完毕。有图纸和全套螺丝，自备十字螺丝刀最佳。",
          budget: 120
        }
      };
    } else if (msgLower.includes('文案') || msgLower.includes('写') || msgLower.includes('写字')) {
      return {
        text: "文案PPT、打字打酱油！这模板给你整好了，高雅且极具效率感：",
        draft: {
          title: "急需同城高手做一份汇报PPT基础美化",
          category: "writeup",
          description: "关于一个餐饮初创品牌的商业汇报计划，已有完整大纲和500字文稿。需要熟悉PPT/Keynote的牛马伙伴，帮忙排版一套10页的简洁风演示PPT，提供设计素材包。",
          budget: 150
        }
      };
    } else {
      return {
        text: "老铁好！我是快乐牛马AI智囊！无论你想【帮忙跑腿】、【打扫卫生】、【代遛毛孩子】还是【组装家具】，直接把你的大白话需求发给我，我会秒级帮你自动润色，起草完美的发布任务模板：\n\n例如，你可以试着对我说：\n👉 “写个帮忙搬家的”\n👉 “想找人代遛萨摩耶狗”\n👉 “写一个到网红咖啡代排队的”\n\n打工不易，牛马学技，但只要大家伙抱团互助，没有解决不了的同城小事！告诉我你需要什么，老底子保准给你写得明明白白！",
        draft: null
      };
    }
  };

  if (!ai) {
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    return res.json(mockChatReply(lastUserMessage));
  }

  try {
    const formattedHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const prompt = `你是一个名叫“快乐牛马-AI智囊”的搞笑温和、非常接地气又体贴的AI同城任务智囊。
你服务于一款名为“快乐牛马”的同城代办打零工app（提供跑腿、家政、宠物照顾、家具组装修理、临时帮忙等服务）。
主要帮助“接单牛马”（自由职业/兼职伙伴）和“发单雇主”进行沟通、任务起草和日常排忧解难。

你需要深度解析用户的最近询问。
- 如果用户表达了具体想让人干什么的意愿（如：想发单、需要让人干活、搬家、排队、扫地、遛猫狗等），请在回复中为他精心【润色起草一份正规的同城互助任务】。并提供一键采用相关的结构化字段。
- 否则，请进行温暖而幽默的风趣同城段子唠嗑，多使用“老铁”、“牛马老哥”、“雇主老板”等词汇，提供幽默打工人语录来温暖人心、活跃氛围（最长不超过200字）。

为了让发单用户能一键采用并整合成草稿：
你的返回格式必须为合法的 JSON 对象，内容包含：
{
  "text": "回复给用户的说话内容。如果是推荐或写好的任务说明，可以在这以易读的排版形式说明（支持换行符\\n），语气一定要幽默温暖，给老铁加油打气！",
  "draft": {
    "title": "润色完成后的任务标题（如：“徐汇滨江代遛金毛 30分钟”、“静安寺代排烘焙店并配送送达”），如果判定用户不是要起草发单任务，这里返回null",
    "category": "任务匹配最合适分类，只能是这五种之一：'install'(搬家组装维修), 'run'(跑腿代买占位), 'clean'(家政保洁), 'pet'(遛狗喂猫等宠物)，或'help'(临时帮忙)。如果用户不对应起草任何任务，这些字段返回null",
    "description": "200字以内的深度详细任务详情与要求，包含具体配合说明、注意事项、个人卫生等。如果不需要起草任务，这里返回null",
    "budget": 任务的合理小费/报酬预算（建议为安全起步 30-200 之间的合理整数价格，例如：40, 60, 120），如果不适用，这里返回null
  }
}

用户最近的回复历史如下：
${formattedHistory}

你当前的系统时间是 ${new Date().toISOString()}。

直接并仅返回这一个 JSON 对象（不要包含 \`\`\`json markdown 标签，直接以对象大括号开始，确保它是可以通过 JSON.parse 解析的原生JSON字串）：`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);
    return res.json(parsed);

  } catch (error) {
    console.error('Gemini chat generate content failed:', error);
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    return res.json(mockChatReply(lastUserMessage));
  }
});

// Start our custom server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Happy Workhorse Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
