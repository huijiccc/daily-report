// ========================================
// 高精度数学计算模块
// ========================================
// 使用 math.js 的 evaluate 函数进行高精度计算
// 避免原生 Number 类型的精度溢出问题
// ========================================

// 高精度计算函数：使用 math.eval 计算表达式字符串
function $eval(expr) {
    return window.evalExpr ? window.evalExpr(expr) : eval(expr);
}

// 高精度 pow 函数
function $pow(base, exp) {
    return $evalBig(`${base} ^ ${exp}`);
}

// 高精度 floor 函数
function $floor(x) {
    return String($evalBig(`floor(${x})`));
}

// 高精度 max 函数
function $max(...args) {
    const hasBig = args.some(a => typeof a === 'string' && (a.includes('e') || a.length > 15));
    if (hasBig) {
        const bigArgs = args.map(a => String(a));
        return String($evalBig(`max(${bigArgs.join(', ')})`));
    }
    return $eval(`max(${args.join(', ')})`);
}

// 高精度 min 函数
function $min(...args) {
    const hasBig = args.some(a => typeof a === 'string' && (a.includes('e') || a.length > 15));
    if (hasBig) {
        const bigArgs = args.map(a => String(a));
        return String($evalBig(`min(${bigArgs.join(', ')})`));
    }
    return $eval(`min(${args.join(', ')})`);
}

// 高精度 log10 函数
function $log10(x) {
    if (typeof x === 'string' && (x.includes('e') || x.length > 15)) {
        return $evalBig(`log10(${x})`);
    }
    return $eval(`log10(${x})`);
}

// 高精度 ceil 函数
function $ceil(x) {
    return $eval(`ceil(${x})`);
}

function $evalBig(expr) {
    if (window.preciseMath) {
        const saved = window.Math;
        window.Math = window._nativeMath;
        try {
            const result = window.preciseMath.evaluate(expr);
            return window.preciseMath.format(result, { notation: 'exponential', precision: 16 });
        } catch (e) {
            console.error('$evalBig error:', e, expr);
            return '0';
        } finally {
            window.Math = saved;
        }
    }
    console.warn('$evalBig: preciseMath not available, expr:', expr);
    return '0';
}

// 高精度加法（返回字符串）
function $addBig(a, b) {
    return $evalBig(`${a} + ${b}`);
}

// 高精度减法（返回字符串）
function $subBig(a, b) {
    return $evalBig(`${a} - ${b}`);
}

function $gteBig(a, b) {
    if (a === null || a === undefined) a = 0;
    if (b === null || b === undefined) b = 0;
    try {
        const aStr = String(a);
        const bStr = String(b);
        const result = $evalBig(`${aStr} >= ${bStr}`);
        return result === 'true';
    } catch (e) {
        return false;
    }
}

function $gtBig(a, b) {
    if (a === null || a === undefined) a = 0;
    if (b === null || b === undefined) b = 0;
    try {
        const aStr = String(a);
        const bStr = String(b);
        const result = $evalBig(`${aStr} > ${bStr}`);
        return result === 'true';
    } catch (e) {
        return false;
    }
}

function $lteBig(a, b) {
    if (a === null || a === undefined) a = 0;
    if (b === null || b === undefined) b = 0;
    try {
        const aStr = String(a);
        const bStr = String(b);
        const result = $evalBig(`${aStr} <= ${bStr}`);
        return result === 'true';
    } catch (e) {
        return false;
    }
}

function formatBigNumber(num) {
    const str = String(num || 0);
    if (str === 'Infinity' || str === '-Infinity' || str === 'NaN') {
        return str;
    }
    if (str.includes('e') || str.includes('E')) {
        const match = str.match(/^(-?\d*\.?\d+)[eE]([+-]?\d+)$/);
        if (match) {
            const mantissa = parseFloat(match[1]).toPrecision(5);
            let exp = match[2];
            if (exp.startsWith('+')) exp = exp.substring(1);
            return mantissa + 'e' + exp;
        }
        return str;
    }
    if (str.length <= 10) return str;
    return str.slice(0, 5) + 'e' + (str.length - 5);
}

function formatPrecision(num) {
    if (num === null || num === undefined) return '0';
    const numStr = String(num);
    if (numStr === 'NaN' || numStr === 'Infinity' || numStr === '-Infinity') return numStr;
    const absNum = window._nativeMath.abs(parseFloat(numStr));
    if (absNum === 0) return '0';
    if (absNum >= 1e10 || absNum < 1e-5) {
        return parseFloat(numStr).toExponential(4);
    }
    const val = parseFloat(numStr);
    const rounded = Math.round(val * 10000) / 10000;
    if (Math.abs(val - rounded) < 0.00001) {
        return String(rounded);
    }
    return val.toFixed(4).replace(/\.?0+$/, '');
}

// ========================================
// 怪物数据模块
// ========================================
// 怪物数据 - 99组地图的怪物配置
// 每组包含5种不同类型的怪物，难度随组数递增
// ========================================
const monsterData = [
    // 1-15组：初级怪物区域，适合练气期修士
    ["草牙精", "石皮鼠", "枯木蛾", "泥爪蟾", "羽尾雀"],
    ["尖牙兔", "棘皮蛇", "风鸣蝉", "土蝼虫", "溪滑鳅"],
    ["锈爪狼", "裂嘴蛙", "断翅鸦", "毛足蚁", "沙壳虫"],
    ["野荆精", "灰皮狐", "浊水虾", "枯翼蝶", "岩背鼠"],
    ["刺毛獾", "腐叶虫", "浅滩螺", "哑声雀", "泥骨蚯"],
    ["铁角牛", "薄翼蚊", "黄纹蝎", "矮脚狈", "枯根怪"],
    ["赤眼鼠", "硬壳蟹", "风卷蛾", "土皮蛇", "溪牙鱼"],
    ["蓬毛狐", "尖刺蛾", "腐土蟾", "石纹蚁", "沙嘴鸥"],
    ["断角羊", "滑皮鳅", "枯羽鸦", "泥爪虫", "棘尾鼠"],
    ["青纹蛇", "粗毛獾", "浅水区", "哑翼蝶", "锈壳虾"],
    ["野棘精", "黄眼蛙", "风毛蚁", "土壳虫", "溪尾雀"],
    ["灰爪狼", "裂壳螺", "腐叶蛾", "石皮蟾", "沙羽鸦"],
    ["尖嘴鼠", "薄皮蛇", "枯水虾", "泥纹蝎", "羽翅蚊"],
    ["毛足狈", "赤皮蟹", "风断蝉", "土蝼蛙", "溪壳虫"],
    ["枯木精", "锈毛狐", "浊翼蝶", "石爪蚯", "沙嘴蟾"],
    
    // 16-30组：中级怪物区域，适合筑基期修士
    ["青纹狼", "赤尾狐", "风牙鼬", "土甲蟾", "水纹蛇"],
    ["焰爪鼠", "冰翼蛾", "雷纹蚁", "岩甲蟹", "云尾雀"],
    ["荆刺精", "腐骨蟾", "裂石蝎", "流沙鳅", "鸣风鸦"],
    ["铁背牛", "铜爪狈", "银纹虾", "金翼蝉", "木甲蚁"],
    ["玄毛獾", "紫眼蛙", "蓝纹蛇", "青翼蝶", "赤壳虫"],
    ["风卷狐", "雷劈鼠", "冰凝蟾", "焰烧蛇", "岩崩蟹"],
    ["枯骨精", "蚀肉蛾", "吮血蚁", "吞沙鳅", "唳天鸦"],
    ["水纹鼬", "火纹狼", "土纹狐", "风纹蝎", "雷纹蟾"],
    ["钢角羊", "铁壳螺", "铜翼蝶", "银爪虫", "金尾雀"],
    ["雾隐鼠", "云遮狐", "风藏鼬", "石隐蟾", "水匿蛇"],
    ["炎毛獾", "寒皮蟹", "雷翅蚊", "冰爪蝎", "风纹虾"],
    ["青木精", "赤火蚁", "黄土蟾", "白金蛇", "黑水鳅"],
    ["裂风狼", "轰雷鼠", "凝冰蛙", "焚焰蛇", "崩岩蟹"],
    ["缠荆怪", "蚀骨蛾", "吸血蝎", "吞石鳅", "啸天鸦"],
    ["星纹雀", "月纹蚁", "日纹蝶", "云纹蟹", "雾纹蛇"],
    
    // 31-45组：高级怪物区域，适合金丹期修士
    ["青焰狼", "赤雷狐", "风冰鼬", "土岩蟾", "水纹蛟"],
    ["焰尾貂", "冰翼蝠", "雷纹蝎", "岩甲犀", "云翼雀"],
    ["枯骨獠", "蚀肉蛛", "吮血蜈", "吞沙蚨", "唳天雕"],
    ["铁背犀", "铜爪熊", "银纹蟒", "金翼鹏", "木甲犀"],
    ["玄毛罴", "紫眼蟾", "蓝纹蛟", "青翼鸾", "赤壳蛛"],
    ["风卷罴", "雷劈貂", "冰凝犀", "焰烧蟒", "岩崩熊"],
    ["腐骨精", "蚀魂蛾", "吮魂蚁", "吞沙怪", "唳天鹰"],
    ["水纹貂", "火纹罴", "土纹熊", "风纹蜈", "雷纹犀"],
    ["钢角犀", "铁壳贝", "铜翼鸾", "银爪蛛", "金尾雕"],
    ["雾隐貂", "云遮熊", "风藏罴", "石隐犀", "水匿蛟"],
    ["炎毛熊", "寒皮贝", "雷翅雕", "冰爪蜈", "风纹蚨"],
    ["青木獠", "赤火蜈", "黄土犀", "白金蛟", "黑水蚨"],
    ["裂风罴", "轰雷貂", "凝冰犀", "焚焰蟒", "崩岩熊"],
    ["缠荆獠", "蚀骨蛛", "吸血蜈", "吞石蚨", "啸天雕"],
    ["星纹鸾", "月纹蛛", "日纹鹏", "云纹贝", "雾纹蛟"],
    
    // 46-60组：精英怪物区域，适合元婴期修士
    ["青焰罴", "赤雷熊", "风冰犀", "土岩兕", "水纹螭"],
    ["焰尾貅", "冰翼枭", "雷纹蚨", "岩甲兕", "云翼鹏"],
    ["枯骨魔", "蚀肉魅", "吮血魑", "吞沙魍", "唳天凰"],
    ["铁背兕", "铜爪罴", "银纹螭", "金翼凰", "木甲麟"],
    ["玄毛麟", "紫眼兕", "蓝纹螭", "青翼凰", "赤壳魅"],
    ["风卷麟", "雷劈貅", "冰凝兕", "焰烧螭", "岩崩罴"],
    ["腐骨獠", "蚀魂蛛", "吮魂蚨", "吞沙魔", "唳天鸾"],
    ["水纹貅", "火纹麟", "土纹罴", "风纹魑", "雷纹兕"],
    ["钢角兕", "铁壳麟", "铜翼凰", "银爪魅", "金尾鹏"],
    ["雾隐貅", "云遮麟", "风藏罴", "石隐兕", "水匿螭"],
    ["炎毛麟", "寒皮麟", "雷翅凰", "冰爪魑", "风纹魅"],
    ["青木魔", "赤火魑", "黄土兕", "白金螭", "黑水魅"],
    ["裂风麟", "轰雷貅", "凝冰兕", "焚焰螭", "崩岩罴"],
    ["缠荆魔", "蚀骨魅", "吸血魑", "吞石蚨", "啸天凰"],
    ["星纹凰", "月纹魅", "日纹鹏", "云纹麟", "雾纹螭"],
    
    // 61-75组：顶级怪物区域，适合化神期修士
    ["青焰麟", "赤雷兕", "风冰螭", "土岩虬", "水纹蛟螭"],
    ["焰尾狻", "冰翼鸾", "雷纹魅", "岩甲虬", "云翼凰"],
    ["枯骨煞", "蚀肉魉", "吮血魔", "吞沙妖", "唳天曦"],
    ["铁背虬", "铜爪麟", "银纹蛟螭", "金翼曦", "木甲虬"],
    ["玄毛虬", "紫眼虬", "蓝纹蛟螭", "青翼曦", "赤壳煞"],
    ["风卷虬", "雷劈狻", "冰凝虬", "焰烧蛟螭", "岩崩麟"],
    ["腐骨煞", "蚀魂魅", "吮魂魔", "吞沙妖", "唳天曦"],
    ["水纹狻", "火纹虬", "土纹麟", "风纹魔", "雷纹虬"],
    ["钢角虬", "铁壳曦", "铜翼曦", "银爪煞", "金尾凰"],
    ["雾隐狻", "云遮虬", "风藏麟", "石隐虬", "水匿蛟螭"],
    ["炎毛虬", "寒皮曦", "雷翅曦", "冰爪魔", "风纹煞"],
    ["青木煞", "赤火魔", "黄土虬", "白金蛟螭", "黑水妖"],
    ["裂风虬", "轰雷狻", "凝冰虬", "焚焰蛟螭", "崩岩麟"],
    ["缠荆煞", "蚀骨魔", "吸血妖", "吞石虬", "啸天曦"],
    ["星纹曦", "月纹煞", "日纹凰", "云纹虬", "雾纹蛟螭"],
    
    // 76-90组：神话怪物区域，上古神兽
    ["青焰虬", "赤雷蛟螭", "风冰虬", "土岩应龙", "水纹螭龙"],
    ["焰尾睚", "冰翼曦", "雷纹煞", "岩甲应龙", "云翼曦"],
    ["枯骨冥", "蚀肉幽", "吮血阴", "吞沙煞", "唳天烛龙"],
    ["铁背应龙", "铜爪虬", "银纹螭龙", "金翼烛龙", "木甲应龙"],
    ["玄毛应龙", "紫眼烛龙", "蓝纹螭龙", "青翼烛龙", "赤壳冥"],
    ["风卷应龙", "雷劈睚", "冰凝烛龙", "焰烧螭龙", "岩崩虬"],
    ["腐骨冥", "蚀魂幽", "吮魂阴", "吞沙煞", "唳天烛龙"],
    ["水纹睚", "火纹应龙", "土纹虬", "风纹阴", "雷纹烛龙"],
    ["钢角烛龙", "铁壳曦", "铜翼烛龙", "银爪冥", "金尾曦"],
    ["雾隐睚", "云遮应龙", "风藏虬", "石隐烛龙", "水匿螭龙"],
    ["炎毛应龙", "寒皮烛龙", "雷翅烛龙", "冰爪阴", "风纹冥"],
    ["青木冥", "赤火阴", "黄土烛龙", "白金螭龙", "黑水煞"],
    ["裂风应龙", "轰雷睚", "凝冰烛龙", "焚焰螭龙", "崩岩虬"],
    ["缠荆冥", "蚀骨阴", "吸血煞", "吞石应龙", "啸天烛龙"],
    ["星纹烛龙", "月纹冥", "日纹曦", "云纹应龙", "雾纹螭龙"],
    
    // 91-100组：终极Boss区域，上古圣尊魔化形态
    ["青焰烛龙", "赤雷应龙", "风冰螭龙", "土岩玄武", "水纹青龙"],
    ["焰尾穷奇", "冰翼毕方", "雷纹混沌", "岩甲梼杌", "云翼饕餮"],
    ["枯骨幽冥", "蚀肉九幽", "吮血玄冥", "吞沙太虚", "唳天东皇"],
    ["铁背玄武", "铜爪青龙", "银纹白虎", "金翼朱雀", "木甲麒麟"],
    ["玄毛麒麟", "紫眼东皇", "蓝纹鲲鹏", "青翼凤凰", "赤壳幽冥"],
    ["风卷鲲鹏", "雷劈穷奇", "冰凝玄武", "焰烧朱雀", "岩崩白虎"],
    ["腐骨九幽", "蚀魂玄冥", "吮魂太虚", "吞沙东皇", "唳天凤凰"],
    ["水纹穷奇", "火纹麒麟", "土纹鲲鹏", "风纹幽冥", "雷纹东皇"],
    ["星纹凤凰", "月纹玄冥", "日纹鲲鹏", "云纹麒麟", "雾纹东皇"],
    // 最终Boss：五大圣尊魔化形态
    ["太易圣尊·魔", "太初圣尊·魔", "太始圣尊·魔", "太素圣尊·魔", "太极圣尊·魔"]
];

// ========================================
// 境界系统配置
// ========================================
// 境界列表：从低到高的修炼境界
const realms = ["练气", "筑基", "金丹", "元婴", "化神"];

// 境界名称映射表：索引对应境界名称
const realmNames = {
    0: "练气",   // 第一境界：练气期，修炼基础
    1: "筑基",   // 第二境界：筑基期，打好根基
    2: "金丹",   // 第三境界：金丹期，凝聚金丹
    3: "元婴",   // 第四境界：元婴期，孕育元婴
    4: "化神"    // 第五境界：化神期，神魂合一
};

const pillInfo = [
    { type: 'attack', name: '天元丹', effect: '攻击', value: 1, isPercent: false },
    { type: 'health', name: '淬体丹', effect: '生命', value: 10, isPercent: false },
    { type: 'critDamage', name: '暴神丹', effect: '暴伤', value: 30, isPercent: true },
    { type: 'critRate', name: '灵犀丹', effect: '暴击率', value: 1, isPercent: true },
    { type: 'breakthrough', name: '破境丹', effect: '突破成功率', value: 0.01, isPercent: true, multiply100: true }
];

function showPillDetail(pillType) {
    const pill = pillInfo.find(p => p.type === pillType);
    if (!pill) return;
    const consumed = player.consumedPills[pill.type] || {};
    const grades = Object.keys(consumed).map(g => parseInt(g)).filter(g => !isNaN(g) && consumed[g] > 0).sort((a, b) => a - b);

    let detailHtml = `<span style="color:#ff0;">【 ${pill.name} 详情 】</span><br><br>`;
    grades.forEach(grade => {
        let multiplier = 1;
        let totalEffect = 0;
        for (let i = 0; i < consumed[grade]; i++) {
            totalEffect += multiplier * pill.value;
            multiplier *= 0.9;
            if (multiplier < 0.1) multiplier = 0.1;
        }
        const nextMultiplier = multiplier * 0.9 < 0.1 ? 0.1 : multiplier * 0.9;
        let nextEffect = nextMultiplier * pill.value;
        let effectDisplay = totalEffect.toFixed(2);
        if (pill.isPercent) {
            if (pill.multiply100) {
                effectDisplay = (totalEffect * 100).toFixed(1) + '%';
                nextEffect = (nextEffect * 100).toFixed(2) + '%';
            } else {
                effectDisplay = totalEffect.toFixed(1) + '%';
                nextEffect = nextEffect.toFixed(2) + '%';
            }
        } else {
            nextEffect = nextEffect.toFixed(2);
        }
        detailHtml += `<span style="color:#fff;">${grade}阶: 已服${consumed[grade]}颗, 总加成${effectDisplay}, 下颗+${nextEffect}</span><br>`;
    });

    showModal(detailHtml);
}

// ========================================
// UI边框工具函数
// ========================================
// 动态计算边框宽度
// 根据容器实际宽度自适应字符数
function getBoxWidth() {
    const terminal = document.querySelector('.terminal');
    if (!terminal) return 20;
    
    const containerWidth = terminal.clientWidth - 20;
    const testElement = document.createElement('span');
    testElement.style.fontFamily = 'monospace';
    testElement.style.fontSize = '19px';
    testElement.style.visibility = 'hidden';
    testElement.textContent = '─'.repeat(50);
    document.body.appendChild(testElement);
    const charWidth = testElement.getBoundingClientRect().width / 50;
    document.body.removeChild(testElement);
    
    const maxChars = $floor(containerWidth / charWidth);
    return $max(20, $min(maxChars, 50));
}

// 内层边框宽度
// 返回比外层少2个字符
function getInnerBoxWidth() {
    return getBoxWidth() - 2;
}

// 动态生成外层边框
// 使用Unicode制表符创建美观的边框样式
function generateBox() {
    const width = getBoxWidth();
    return {
        top: '┌' + '─'.repeat(width) + '┐',      // 顶部边框：┌──────┐
        bottom: '└' + '─'.repeat(width) + '┘',   // 底部边框：└──────┘
        line: ''                                   // 中间行（预留）
    };
}

// 生成内层边框
// 用于嵌套显示的内部边框
function generateInnerBox() {
    const width = getInnerBoxWidth();
    return {
        top: '┌' + '─'.repeat(width) + '┐',      // 顶部边框
        bottom: '└' + '─'.repeat(width) + '┘',   // 底部边框
        left: '│',                                 // 左侧边框
        right: '│'                                 // 右侧边框
    };
}

// 更新HTML中的固定边框宽度
function updateHtmlBoxWidth() {
    const width = getBoxWidth();
    const boxChars = '─'.repeat(width);
    const top = '┌' + boxChars + '┐';
    const bottom = '└' + boxChars + '┘';
    
    document.querySelectorAll('.text-line').forEach(el => {
        const text = el.textContent;
        if (text.startsWith('┌') && text.endsWith('┐')) {
            el.textContent = top;
        } else if (text.startsWith('└') && text.endsWith('┘')) {
            el.textContent = bottom;
        }
    });
}

// 初始化边框对象（全局变量）
let box = generateBox();
let innerBox = generateInnerBox();

// ========================================
// 修炼系统核心函数
// ========================================
// 计算升级/突破所需灵气
function getRequiredCultivation(innerLevel) {
    const levelStr = String(innerLevel - 1);
    if ($gteBig(levelStr, '1e100')) {
        return $evalBig(`${levelStr} * 100`);
    }
    return $evalBig(`floor(100 * 1.3^${levelStr})`);
}

// 计算玩家属性（核心属性计算函数）
// 综合考虑：修炼等级、境界、法宝、丹药、法则领悟度
function calculateCultivationStats() {
    // 获取玩家当前状态
    const innerLevel = player.innerLevel;      // 内部等级（小境界）
    const realmIndex = player.realmIndex;       // 境界索引（大境界）
    const weapon = player.weapon;               // 法宝对象
    
    // ========================================
    // 丹药加成计算
    // ========================================
    // 每阶丹药独立计算，同一阶效果递减（防止无限堆叠）
    const pillBonus = { attack: 0, health: 0, critDamage: 0, critRate: 0, breakthrough: 0 };
    const pillTypes = ['attack', 'health', 'critDamage', 'critRate', 'breakthrough'];
    
    // 遍历每种丹药类型
    pillTypes.forEach(type => {
        const consumed = player.consumedPills[type] || {};  // 获取该类型已服用的丹药记录
        let totalBonus = 0;
        
        // 按阶位计算加成（1-10阶）
        for (let grade = 1; grade <= 10; grade++) {
            if (consumed[grade] && consumed[grade] > 0) {
                let multiplier = 1;  // 初始倍率
                // 同阶丹药效果递减：第一颗100%，第二颗90%，最低10%
                for (let i = 0; i < consumed[grade]; i++) {
                    totalBonus += multiplier;
                    multiplier = $max(multiplier * 0.9, 0.1);  // 每颗递减10%，最低10%
                }
            }
        }
        
        // 根据丹药类型应用不同的加成系数
        if (type === 'attack') pillBonus.attack = $floor(totalBonus * 1);           // 攻击丹药：1点/颗
        if (type === 'health') pillBonus.health = $floor(totalBonus * 10);          // 生命丹药：10点/颗
        if (type === 'critDamage') pillBonus.critDamage = totalBonus * 30;              // 暴伤丹药：30%/颗
        if (type === 'critRate') pillBonus.critRate = totalBonus * 1;                   // 暴击丹药：1%/颗
        if (type === 'breakthrough') pillBonus.breakthrough = totalBonus * 0.01;        // 突破丹药：1%概率/颗
    });
    
    // ========================================
    // 法则领悟度计算
    // ========================================
    // 法则领悟度 = 基础领悟度 + 法宝加成（法宝每级增加10%效果）
    const lawAwareness = {
        hp: $evalBig(`(${player.laws.life} + ${weapon.lawLevels.life * 0.1}) / 4`),
        attack: $evalBig(`(${player.laws.strength} + ${weapon.lawLevels.strength * 0.1}) / 4`),
        defense: $evalBig(`(${player.laws.order} + ${weapon.lawLevels.order * 0.1}) / 4`),
        criticalRate: $evalBig(`(${player.laws.fate} + ${weapon.lawLevels.fate * 0.1 + weapon.critRateLevel * 0.2}) / 4`),
        criticalDamage: $evalBig(`(${player.laws.destruction} + ${weapon.lawLevels.destruction * 0.1}) / 4`)
    };
    
    // ========================================
    // 基础属性计算
    // ========================================
    // 基础属性 = 初始值 + 内部等级加成 + 法宝基础属性 + 丹药加成
    const baseHp = 100 + innerLevel * 10 + pillBonus.health;              // 基础生命值
    const baseAttack = 10 + innerLevel * 1 + weapon.attackLevel * 1 + pillBonus.attack;  // 基础攻击力
    const baseDefense = 5 + innerLevel * 0.5;                              // 基础防御力
    const baseSpeed = 10 + innerLevel * 1;                                 // 基础速度
    
    // ========================================
    const boundHerbBonus = player.boundHerb ? player.boundHerb.grade * 0.1 : 0;
    const power = (1 + innerLevel * 0.1) + weapon.powerLevel * 0.01 + boundHerbBonus;
    
    function calcAttribute(base, power, awareness) {
        if ($gteBig(awareness, '1e10')) {
            return $evalBig(`${base} * ${power} ^ ${awareness}`);
        }
        return $evalBig(`floor(${base} * ${power}^${awareness})`);
    }
    
    player.maxHp = calcAttribute(baseHp, power, lawAwareness.hp);
    player.attack = calcAttribute(baseAttack, power, lawAwareness.attack);
    player.defense = calcAttribute(baseDefense, power, lawAwareness.defense);
    player.speed = Math.min(baseSpeed, 100);
    
    if ($gteBig(lawAwareness.criticalRate, '1e10')) {
        player.criticalRate = $evalBig(`5 * 1.07^${lawAwareness.criticalRate}`);
    } else {
        player.criticalRate = $eval(`floor(5 * 1.07^${lawAwareness.criticalRate}) + ${pillBonus.critRate + weapon.critRateLevel * 0.2}`);
    }
    
    if ($gteBig(lawAwareness.criticalDamage, '1e10')) {
        player.criticalDamage = $evalBig(`150 * 1.07^${lawAwareness.criticalDamage}`);
    } else {
        player.criticalDamage = $eval(`floor(150 * 1.07^${lawAwareness.criticalDamage}) + ${weapon.critDamageLevel * 10 + pillBonus.critDamage}`);
    }
    player.power = power;
    
    player.pillBreakthroughBonus = pillBonus.breakthrough;
}

// ========================================
// 法则系统配置
// ========================================
// 法则配置表：定义五种法则及其效果
// 法则是修仙者领悟天地规则的能力，每种法则对应不同的属性加成
const laws = {
    life: { name: "生命法则", desc: "生命上限", key: "hp" },           // 生命法则：提升生命值上限
    strength: { name: "力量法则", desc: "攻击", key: "attack" },        // 力量法则：提升攻击力
    order: { name: "秩序法则", desc: "防御", key: "defense" },          // 秩序法则：提升防御力
    fate: { name: "命运法则", desc: "暴击概率", key: "criticalRate" },  // 命运法则：提升暴击概率
    destruction: { name: "毁灭法则", desc: "暴击伤害", key: "criticalDamage" }  // 毁灭法则：提升暴击伤害
};

function getLawFragmentCost(level) {
    const levelStr = String(level);
    if ($gteBig(levelStr, '1e100')) {
        return $evalBig(`${levelStr} * 10`);
    }
    return $evalBig(`10 * 1.25^${levelStr}`);
}

function upgradeLaw(lawKey) {
    const currentAwareness = String(player.laws[lawKey] || '0');
    
    const cost = getLawFragmentCost(currentAwareness);
    
    if ($gteBig(player.lawFragments, cost)) {
        player.lawFragments = $subBig(player.lawFragments, cost);
        if ($gteBig(currentAwareness, '1e15')) {
            player.laws[lawKey] = $evalBig(`${currentAwareness} * 1.01`);
        } else {
            player.laws[lawKey] = $addBig(currentAwareness, '1');
        }
        calculateCultivationStats();
        updateLawUI();
        updateStatusUI();
    } else {
        showModal(`<span style="color:#f00;">【 法则碎片不足 】</span><br><br>需要: ${formatLawLevel(cost)}<br>当前: ${formatNumber(player.lawFragments)}<br><br><button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>`);
    }
}

function calculateLawStats() {
    let lawBonus = {
        hp: '0',
        attack: '0',
        defense: '0',
        criticalRate: '0',
        criticalDamage: '0',
        speed: '0'
    };
    
    for (let key in player.laws) {
        const awareness = String(player.laws[key] || 0);
        const level = $evalBig(`floor(${awareness} / 10)`);
        
        switch(key) {
            case 'life':
                lawBonus.hp = $addBig(lawBonus.hp, $evalBig(`${level} * 20`));
                break;
            case 'strength':
                lawBonus.attack = $addBig(lawBonus.attack, $evalBig(`${level} * 2`));
                break;
            case 'order':
                lawBonus.defense = $addBig(lawBonus.defense, level);
                break;
            case 'fate':
                lawBonus.criticalRate = $addBig(lawBonus.criticalRate, level);
                break;
            case 'destruction':
                lawBonus.criticalDamage = $addBig(lawBonus.criticalDamage, $evalBig(`${level} * 5`));
                break;
        }
    }
    
    return lawBonus;
}

// ========================================
// 玩家默认数据模板
// ========================================
// 默认玩家数据结构
// 新建角色时使用此模板初始化玩家数据
const defaultPlayer = {
    // ========================================
    // 基础信息
    // ========================================
    name: "冒险者",           // 角色名称
    realmIndex: 0,           // 境界索引（0=练气，1=筑基，2=金丹，3=元婴，4=化神）
    level: 1,                // 外部等级（大境界等级）
    innerLevel: 1,           // 内部等级（小境界等级，每个大境界有多个小境界）
    
    // ========================================
    // 资源系统
    // ========================================
    cultivation: '0',          // 灵力值（修炼进度）
    spiritStone: '0',          // 灵石（基础货币）
    immortalStone: '0',        // 仙石（高级货币）
    vein: '0',                 // 环境灵气（影响修炼速度）
    veinStone: '0',            // 灵脉石（产出环境灵气）
    immortalVeinStone: '0',    // 仙脉石（产出灵石）
    treasure: '0',             // 天材地宝（特殊资源）
    
    // ========================================
    // 设施系统
    // ========================================
    gatheringArrayLevel: 0,  // 聚灵阵等级（提升灵气吸收效率）
    lastEnhanceCount: 10,    // 上次强化次数
    newbieGift: false,       // 新手礼包是否已领取
    lawFragments: '0',         // 法则碎片数量（字符串，支持超大数）
    
    // ========================================
    // 法则领悟度
    // ========================================
    // 五种法则的领悟度（字符串，支持超大数）
    laws: {
        life: '0',
        strength: '0',
        order: '0',
        fate: '0',
        destruction: '0'
    },
    
    // ========================================
    // 法宝系统
    // ========================================
    // 法宝是修仙者的本命神器，可提升各项属性
    weapon: {
        name: "悟道珠",      // 法宝名称
        weaponName: "青木剑", // 法器名称
        bookName: "青木长生经", // 功法名称
        powerLevel: 0,       // 位格等级（影响整体属性倍率）
        powerBonus: 0,       // 位格加成值
        // 法宝法则等级（提升对应法则效果）
        lawLevels: {
            life: 0,         // 生命法则等级
            strength: 0,     // 力量法则等级
            order: 0,        // 秩序法则等级
            fate: 0,         // 命运法则等级
            destruction: 0   // 毁灭法则等级
        },
        attackLevel: 0,      // 攻击强化等级
        critDamageLevel: 0,  // 暴击伤害强化等级
        critRateLevel: 0     // 暴击率强化等级
    },
    
    // ========================================
    // 背包系统
    // ========================================
    bag: [{ name: '小包裹', grade: 1, count: '1' }],
    bagLevel: 0,            // 背包容量等级
    
    // ========================================
    // 灵田系统
    // ========================================
    // 灵田用于种植灵药，共9个格子
    spiritField: [null, null, null, null, null, null, null, null, null],
    spiritFieldLevel: 0,    // 灵田等级
    highestHerbGrade: 1,    // 历史获得过的灵药最高等阶
    
    // ========================================
    // 丹炉系统
    // ========================================
    // 丹炉用于炼制丹药，共9个格子
    alchemyFurnace: [null, null, null, null, null, null, null, null, null],
    alchemyFurnaceLevel: 1, // 丹炉等级
    
    // ========================================
    // 丹药服用记录
    // ========================================
    // 记录各类型丹药的服用数量（按阶位统计）
    consumedPills: {
        attack: {},         // 攻击丹药 {阶位: 服用数量}
        health: {},         // 生命丹药
        critDamage: {},     // 暴伤丹药
        critRate: {},       // 暴击率丹药
        breakthrough: {}    // 突破丹药
    },
    
    boundHerb: null,        // 绑定的灵药（用于特殊加成）
    
    // ========================================
    // 阵法节点系统
    // ========================================
    // 五个阵法节点，可放置特殊灵药提升聚灵阵效果
    arrayNodes: [
        { name: '虚无空冥草', grade: 0 },  // 第一节点
        { name: '先天一炁芝', grade: 0 },  // 第二节点
        { name: '鸿蒙初形花', grade: 0 },  // 第三节点
        { name: '混元真质蕊', grade: 0 },  // 第四节点
        { name: '两仪混沌莲', grade: 0 }   // 第五节点
    ],
    
    // ========================================
    // 神通系统
    // ========================================
    // 五种神通，每种神通有不同效果
    divineAbilities: {
        qingmuRoumai: { level: 0, name: '木瘴蚀甲' },      // 第一神通：防御型
        cuiyeYuqi: { level: 0, name: '翠叶御气' },         // 第二神通：辅助型
        qingmuZhenshen: { level: 0, name: '青木真身' },    // 第三神通：变身型
        hunyuanGuiyi: { level: 0, name: '混元归一' },      // 第四神通：综合型
        zhutianWeiyi: { level: 0, name: '长生久视' }       // 第五神通：终极神通
    },
    
    // ========================================
    // 战斗属性
    // ========================================
    hp: 100,                // 当前生命值
    maxHp: 100,             // 最大生命值
    attack: 10,             // 攻击力
    defense: 5,             // 防御力
    speed: 10,              // 速度
    criticalRate: 5,        // 暴击率（%）
    criticalDamage: 150,    // 暴击伤害（%）
    
    // ========================================
    // 游戏状态
    // ========================================
    lastSaveTime: Date.now(),  // 上次保存时间
    battleHistory: [],         // 战斗历史记录
    unlockedMaps: [1],         // 已解锁的地图列表
    currentMap: 1,             // 当前所在地图
    voidDepth: 0,              // 虚空深度（特殊副本层数）
    voidAutoBattle: false,     // 虚空自动战斗开关
    bagAutoSort: false,        // 背包自动整理开关
    autoAddAuxiliary: false,   // 自动添加辅助材料开关
    alchemyTargetGrade: null,   // 炼丹目标阶位（null表示使用主药阶位）
    
    // ========================================
    // 作弊/调试模块
    // ========================================
    cheat: {
        offlineMultiplier: 1   // 离线收益倍率
    },
    showCheatModule: false     // 是否显示作弊模块
};

// ========================================
// 存档系统
// ========================================
// 玩家数据实例（从存档加载或使用默认值）
let player = loadGameData();

// 保存游戏数据到本地存储
// 将玩家数据序列化为JSON并存储到localStorage
function saveGameData() {
    player.lastSaveTime = Date.now();  // 更新保存时间戳
    const saveData = JSON.stringify(player);  // 序列化玩家数据
    localStorage.setItem('wenziguaji_save', saveData);  // 存储到本地
}

// ========================================
// 加载游戏数据
// ========================================
// 从本地存储加载游戏数据
// 包含存档兼容性处理，确保旧存档可以正常使用
function loadGameData() {
    const saveData = localStorage.getItem('wenziguaji_save');  // 尝试获取存档
    
    if (saveData) {
        try {
            const loaded = JSON.parse(saveData);  // 解析存档数据
            
            // 合并默认数据，确保新增字段存在（兼容旧版本存档）
            const merged = { ...defaultPlayer, ...loaded };
            
            // ========================================
            // 灵石仙石向下取整（兼容旧存档）
            // ========================================
            if (merged.spiritStone) {
                merged.spiritStone = $floor(String(merged.spiritStone));
            }
            if (merged.immortalStone) {
                merged.immortalStone = $floor(String(merged.immortalStone));
            }
            
            // ========================================
            // 神通数据兼容性处理
            // ========================================
            // 深度合并 divineAbilities，确保每个神通都有默认值
            if (loaded.divineAbilities) {
                merged.divineAbilities = {
                    ...defaultPlayer.divineAbilities,
                    ...loaded.divineAbilities
                };
                // 确保每个神通都有完整的结构
                Object.keys(defaultPlayer.divineAbilities).forEach(key => {
                    if (!merged.divineAbilities[key]) {
                        // 如果神通不存在，使用默认值
                        merged.divineAbilities[key] = { ...defaultPlayer.divineAbilities[key] };
                    } else if (typeof merged.divineAbilities[key].level === 'undefined') {
                        // 如果等级未定义，设为0
                        merged.divineAbilities[key].level = 0;
                    }
                    if (!merged.divineAbilities[key].name) {
                        // 如果名称未定义，使用默认名称
                        merged.divineAbilities[key].name = defaultPlayer.divineAbilities[key].name;
                    }
                });
            }
            
            // ========================================
            // 灵田数据兼容性处理
            // ========================================
            // 为旧存档中的灵田灵药添加 growth 字段
            if (merged.spiritField) {
                merged.spiritField.forEach(item => {
                    if (item) {
                        if (item.growth === undefined) {
                            if (item.plantTime) {
                                const fieldSpeedBonus = $pow('0.96', $subBig('0', String(merged.spiritFieldLevel || 0)));
                                const elapsed = $evalBig(`(Date.now() - ${item.plantTime}) * ${fieldSpeedBonus} / 1000`);
                                item.growth = elapsed;
                            } else {
                                item.growth = 0;
                            }
                        }
                        delete item.plantTime;
                    }
                });
            }
            
            // ========================================
            // 丹炉数据兼容性处理
            // ========================================
            // 兼容旧存档的丹炉数据
            if (!merged.alchemyFurnace) {
                merged.alchemyFurnace = [null, null, null, null, null, null, null, null, null];
            }
            if (merged.alchemyFurnaceLevel === undefined) {
                merged.alchemyFurnaceLevel = 1;
            }
            if (!merged.consumedPills) {
                // 初始化丹药服用记录
                merged.consumedPills = {
                    attack: {},
                    health: {},
                    critDamage: {},
                    critRate: {},
                    breakthrough: {}
                };
            }
            
            // ========================================
            // 其他字段兼容性处理
            // ========================================
            // 虚空系统兼容性
            if (merged.voidDepth === undefined) {
                merged.voidDepth = 0;           // 虚空深度默认为0
            }
            if (merged.voidAutoBattle === undefined) {
                merged.voidAutoBattle = false;  // 虚空自动战斗默认关闭
            }
            // 灵田和背包系统兼容性
            if (merged.spiritFieldLevel === undefined) {
                merged.spiritFieldLevel = 0;    // 灵田等级默认为0
            }
            if (merged.highestHerbGrade === undefined) {
                merged.highestHerbGrade = 1;    // 历史最高灵药等阶默认为1
            }
            if (merged.bagLevel === undefined) {
                merged.bagLevel = 0;            // 背包等级默认为0
            }
            if (merged.bagAutoSort === undefined) {
                merged.bagAutoSort = false;     // 背包自动整理默认关闭
            }
            if (merged.autoAddAuxiliary === undefined) {
                merged.autoAddAuxiliary = false; // 自动添加辅助材料默认关闭
            }
            
            // ========================================
            // 数据修复处理
            // ========================================
            // 修复旧存档的破境丹加成（旧版本数值过大，需要除以100）
            if (merged.pillBreakthroughBonus !== undefined && merged.pillBreakthroughBonus > 0.1) {
                merged.pillBreakthroughBonus = merged.pillBreakthroughBonus / 100;
            }
            
            // 兼容旧存档的lawFragments格式（从对象转为数值）
            // 旧版本法则碎片按类型分开存储，新版本合并为单一数值
            if (typeof merged.lawFragments === 'object' && merged.lawFragments !== null) {
                let totalFragments = 0;
                Object.values(merged.lawFragments).forEach(val => {
                    totalFragments += (typeof val === 'number' ? val : 0);
                });
                merged.lawFragments = String(totalFragments);  // 合并所有类型的法则碎片
            } else {
                merged.lawFragments = String(merged.lawFragments || 0);
            }
            
            // 移除已废弃的time法则（旧版本存在，新版本已移除）
            if (merged.laws && merged.laws.time !== undefined) {
                delete merged.laws.time;
            }
            
            // ========================================
            // 法宝系统兼容性处理
            // ========================================
            // 兼容旧存档的weapon新字段
            if (merged.weapon) {
                if (merged.weapon.attackLevel === undefined) merged.weapon.attackLevel = 0;
                if (merged.weapon.critDamageLevel === undefined) merged.weapon.critDamageLevel = 0;
                if (merged.weapon.critRateLevel === undefined) merged.weapon.critRateLevel = 0;
                if (!merged.weapon.weaponName) merged.weapon.weaponName = "青木剑";
                if (!merged.weapon.bookName) merged.weapon.bookName = "青木长生经";
            }
            
            // ========================================
            // 作弊模块兼容性处理
            // ========================================
            // 兼容旧存档的cheat对象和showCheatModule
            if (!merged.cheat) {
                merged.cheat = { offlineMultiplier: 1 };
            }
            if (merged.cheat.offlineMultiplier === undefined) {
                merged.cheat.offlineMultiplier = 1;
            }
            if (merged.showCheatModule === undefined) {
                merged.showCheatModule = false;
            }
            
            // ========================================
            // 离线结算处理
            // ========================================
            // 计算离线期间的收益并应用到玩家数据
            try {
                processOfflineRewards(merged);          // 处理离线奖励
            } catch (offlineErr) {
                console.error('离线结算异常:', offlineErr);
                alert('离线结算异常：' + offlineErr.message);
            }
            checkCultivationUpgrade(merged);        // 检查是否可以升级
            merged.lastSaveTime = Date.now();       // 更新保存时间
            localStorage.setItem('wenziguaji_save', JSON.stringify(merged));  // 保存更新后的存档
            return merged;
        } catch (e) {
            // 存档解析失败，返回默认数据
            console.error('加载存档失败:', e);
            alert('存档读取异常：' + e.message + '，将使用默认数据重新开始');
            return { ...defaultPlayer };
        }
    }
    
    // ========================================
    // 新建角色处理
    // ========================================
    // 没有存档时，创建新角色并弹出命名界面
    setTimeout(() => {
        showNameInputModal();  // 延迟100ms显示命名界面
    }, 100);
    return { ...defaultPlayer };
}

// ========================================
// 角色创建界面
// ========================================
// 角色命名界面
// 显示输入框让玩家输入角色名称
function showNameInputModal() {
    showModal(`
        <span style="color:#ff0;">【 初入修仙界 】</span><br><br>
        <div style="text-align:center;">
            <input type="text" id="playerNameInput" placeholder="请输入你的名字" 
                style="background:#333;color:#fff;border:1px solid #666;padding:8px;text-align:center;width:150px;font-size:14px;">
            <br><br>
            <button onclick="confirmPlayerName()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 20px;cursor:pointer;">开始修仙</button>
        </div>
    `, true);
}

// 确认角色名字
// 玩家输入名字后点击确认，保存名字并显示背景介绍
function confirmPlayerName() {
    const input = document.getElementById('playerNameInput');
    const name = input.value.trim();  // 获取并去除首尾空格
    if (name) {
        player.name = name;  // 设置玩家名称
    }
    closeModal();            // 关闭命名界面
    showIntroModal();        // 显示背景介绍
    updateStatusUI();        // 更新UI状态
    saveGameData();          // 保存游戏数据
}

// 背景介绍弹窗
// 显示游戏背景故事，引导玩家开始游戏
function showIntroModal() {
    showModal(`
        <span style="color:#ff0;">【 初入修仙界 】</span><br><br>
        <div style="text-align:left;line-height:1.8;">
            你是${player.name}，穿越而来，自偏僻小域偶得一线生机——隐世前辈坐化前的洞府中，不仅寻得无上功法《青木长生经》和两件法宝胚胎，更获一枚封存着少许物品的纳戒和留下的信息。<br><br>
            昔日浩渺修仙界五大圣尊堕魔为祸，万妖横行吞噬天地，世间修士尽皆陨落，唯余这片残墟与前辈拼死留存的传承。<br><br>
            你是这天地间仅存的修仙火种，前路满是凶险，仙途系于一身，先打开这，接过前辈的遗泽，开启你时修仙之路。
        </div>
        <br><br>
        <button onclick="closeModal();document.querySelector('#tab-bag').click();" style="background:#333;color:#fff;border:1px solid #666;padding:5px 20px;cursor:pointer;">我知道了</button>
    `, true);
}

// ========================================
// 离线结算系统
// ========================================
// 离线结算
// 计算玩家离线期间的各种收益（修炼、灵田、战斗等）
function processOfflineRewards(playerData) {
    const now = Date.now();
    const lastSave = playerData.lastSaveTime || now;
    const offlineSeconds = $floor((now - lastSave) / 1000);  // 离线秒数
    
    // 离线时间少于10秒不结算
    if (offlineSeconds < 10) return;
    
    // ========================================
    // 离线时间计算
    // ========================================
    // 最大计算30天，防止数值溢出
    const maxOfflineSeconds = 30 * 24 * 60 * 60; // 30天 = 2592000秒
    const offlineMult = playerData.cheat?.offlineMultiplier || 1;  // 离线收益倍率
    const effectiveOfflineSeconds = $min(offlineSeconds * offlineMult, maxOfflineSeconds);
    
    const offlineHours = effectiveOfflineSeconds / 3600;
    const offlineMinutes = effectiveOfflineSeconds / 60;
    
    let rewards = [];
    
    const oldVein = playerData.vein;
    const offlineCultivation = $evalBig(`floor(${calculateOfflineCultivation(playerData, effectiveOfflineSeconds)})`);
    const veinChange = $subBig(playerData.vein, oldVein);
    if ($gteBig(offlineCultivation, '1')) {
        playerData.cultivation = $addBig(playerData.cultivation, offlineCultivation);
        rewards.push(`灵力 +${formatNumber(offlineCultivation)}`);
    }
    if (!$lteBig(veinChange, '0')) {
        rewards.push(`环境灵气 +${formatNumber(veinChange)}`);
    } else if ($gteBig(veinChange, '0')) {
        rewards.push(`环境灵气 ${formatNumber(veinChange)}`);
    }
    
    // 离线结算后检查升级状态
    checkCultivationUpgrade(playerData);
    
    // ========================================
    // 灵田系统离线结算
    // ========================================
    // 灵田灵药成长离线结算
    const herbResult = processOfflineHerbGrowth(playerData, effectiveOfflineSeconds);
    if (herbResult.totalUpgrades > 0) {
        let herbText = `灵药升阶 x${herbResult.totalUpgrades}`;
        if (herbResult.upgradedItems.length > 0) {
            herbText += ` (${herbResult.upgradedItems.map(i => `${i.name}${i.grade}阶`).join(', ')})`;
        }
        rewards.push(herbText);
    }
    
    // ========================================
    // 仙脉/灵脉离线结算
    // ========================================
    const offlineSpiritStones = $evalBig(`floor(${calculateOfflineSpiritStones(playerData)})`);
    if ($gteBig(offlineSpiritStones, '1')) {
        playerData.spiritStone = $addBig(playerData.spiritStone, offlineSpiritStones);
        rewards.push(`仙脉产灵石 +${formatNumber(offlineSpiritStones)}`);
    }
    
    if ($gteBig(playerData.veinStone, '0.001')) {
        const offlineSeconds = (Date.now() - playerData.lastSaveTime) / 1000;
        const offlineMult = playerData.cheat?.offlineMultiplier || 1;
        const effectiveOfflineMinutes = $floor(offlineSeconds * offlineMult / 60);
        playerData.veinStone = $evalBig(`${playerData.veinStone} * 0.9997 ^ ${effectiveOfflineMinutes}`);
    }
    
    // ========================================
    // 战斗系统离线结算
    // ========================================
    // 根据战斗历史计算掉落
    if (playerData.battleHistory && playerData.battleHistory.length > 0) {
        const battleRewards = calculateOfflineBattleRewards(playerData, effectiveOfflineSeconds);
        if (battleRewards.items.length > 0) {
            battleRewards.items.forEach(item => {
                const existingItem = playerData.bag.find(bagItem => 
                    bagItem.name === item.name && bagItem.grade === item.grade
                );
                if (existingItem) {
                    existingItem.count = $addBig(existingItem.count, item.count);
                } else {
                    playerData.bag.push(item);
                }
                
                if (item.grade > playerData.highestHerbGrade) {
                    playerData.highestHerbGrade = item.grade;
                }
            });
            // 生成灵草掉落统计文本
            let herbText = `灵草 x${battleRewards.totalCount}`;
            const herbCounts = {};
            battleRewards.items.forEach(item => {
                const key = `${item.name}${item.grade}阶`;
                const count = typeof item.count === 'string' ? $evalBig(item.count) : item.count;
                herbCounts[key] = (herbCounts[key] || 0) + count;
            });
            const herbDetails = Object.entries(herbCounts).map(([name, count]) => `${name}x${formatLawLevel(count)}`);
            if (herbDetails.length > 0) {
                herbText += ` (${herbDetails.join(', ')})`;
            }
            rewards.push(herbText);
        }
        // 灵石奖励
        playerData.spiritStone = $addBig(playerData.spiritStone, String(battleRewards.spiritStones));
        if ($gtBig(battleRewards.spiritStones, 0)) {
            rewards.push(`灵石 +${formatNumber(battleRewards.spiritStones)}`);
        }
        playerData.immortalStone = $addBig(playerData.immortalStone, String(battleRewards.immortalStones));
        if ($gtBig(battleRewards.immortalStones, 0)) {
            rewards.push(`仙石 +${formatNumber(battleRewards.immortalStones)}`);
        }
        playerData.treasure = $addBig(playerData.treasure, String(battleRewards.treasure));
        if ($gtBig(battleRewards.treasure, 0)) {
            rewards.push(`天材地宝 +${formatNumber(battleRewards.treasure)}`);
        }
        // 法则碎片奖励
        if (battleRewards.lawFragments > 0) {
            playerData.lawFragments = $addBig(playerData.lawFragments, battleRewards.lawFragments);
            rewards.push(`法则碎片 +${formatNumber(battleRewards.lawFragments)}`);
        }
    }
    
    // ========================================
    // 显示离线奖励弹窗
    // ========================================
    // 显示离线奖励
    if (rewards.length > 0) {
        // 获取最近10场战斗历史用于统计
        const history = playerData.battleHistory.slice(-10);
        let battleDetails = '';
        if (history.length > 0) {
            // 计算平均怪物等级和战斗时长
            const avgLevel = parseFloat($evalBig(`${history.reduce((sum, h) => $addBig(String(sum), String(h.level)), '0')} / ${history.length}`)).toFixed(1);
            const hasKillsField = history.some(h => h.kills !== undefined);
            const totalKills = history.reduce((sum, h) => sum + (h.kills || 0), 0);
            const avgDuration = hasKillsField && totalKills > 0 ? parseFloat($evalBig(`${history.reduce((sum, h) => $addBig(String(sum), String(h.duration)), '0')} / ${totalKills}`)).toFixed(1) : parseFloat($evalBig(`${history.reduce((sum, h) => $addBig(String(sum), String(h.duration)), '0')} / ${history.length}`)).toFixed(1);
            const battleCount = $floor($evalBig(`${effectiveOfflineSeconds} / ${Math.max(parseFloat(avgDuration), 1)}`));
            battleDetails = `<br>【 战斗结算 】<br>• 预估战斗 ${formatHerbNumber(battleCount)} 场<br>• 平均怪物等级: ${formatHerbNumber($floor(avgLevel))}<br>• 平均战斗时间: ${avgDuration}秒`;
        }
        
        // 分类奖励：产出类和战斗掉落类
        const spiritRewards = rewards.filter(r => r.includes('仙脉') || r.includes('环境灵气') || r.includes('灵力') || r.includes('灵药'));
        const battleRewards = rewards.filter(r => (r.includes('战斗') || r.includes('天材') || r.includes('法则') || r.includes('仙石') || r.includes('灵石') || r.includes('灵草')) && !r.includes('仙脉'));
        
        // 延迟500ms显示弹窗，确保游戏界面已加载
        setTimeout(() => {
            let content = `<span style="color:#ff0;">【 离线奖励 】</span><br><br>
                离线时间: ${formatOfflineTime(effectiveOfflineSeconds)}<br><br>`;
            
            // 显示产出类奖励
            if (spiritRewards.length > 0) {
                content += `<span style="color:#afa;">【 产出 】</span><br>• ${spiritRewards.join('<br>• ')}<br><br>`;
            }
            
            // 显示战斗掉落类奖励
            if (battleRewards.length > 0) {
                content += `<span style="color:#afa;">【 战斗掉落 】</span><br>• ${battleRewards.join('<br>• ')}<br>`;
            }
            
            content += `${battleDetails}
                <br><br>
                <button onclick="closeModal();location.reload();" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">领取</button>`;
            
            showModal(content, true);
        }, 500);
    }
}

// ========================================
// 离线灵力计算函数
// ========================================
// 计算离线灵力增长（考虑环境灵气）
// 灵力增长受聚灵阵等级、灵草位阶、灵脉产出等因素影响
function calculateOfflineCultivation(playerData, offlineSeconds) {
    // ========================================
    // 灵压计算
    // ========================================
    // 灵压 = 1.07^聚灵阵等级 * 1.05^灵草位阶和
    // 灵压决定每秒吸收的灵气量
    let nodeBonus = 0;
    playerData.arrayNodes.forEach(node => {
        nodeBonus += node.grade;  // 累加所有阵法节点的灵草阶位
    });
    const spiritPressure = $pow(1.07, playerData.gatheringArrayLevel) * $pow(1.05, nodeBonus);
    const absorbPerSecond = spiritPressure;  // 每秒吸收灵气量
    
    // ========================================
    // 灵田加成计算
    // ========================================
    // 灵田中的灵药提供额外的修炼加成
    let fieldBonus = 0;
    playerData.spiritField.forEach(item => {
        if (item) fieldBonus += item.grade;  // 累加灵田中所有灵药的阶位
    });
    
    const fieldMultiplier = $pow(1.01, fieldBonus);  // 灵田加成倍率
    
    // ========================================
    // 灵脉产出计算
    // ========================================
    // 灵脉产出环境灵气：使用等比数列求和公式（考虑0.9997衰减和灵田加成）
    // 公式：veinStone * 0.2 * 加成 * (1 - 0.9997^分钟数) / (1 - 0.9997)
    const offlineMinutes = $floor(offlineSeconds / 60);
    let veinProduction = '0';
    if ($gteBig(playerData.veinStone, '0.001') && offlineMinutes > 0) {
        veinProduction = $evalBig(`${playerData.veinStone} * 0.2 * ${fieldMultiplier} * (1 - 0.9997 ^ ${offlineMinutes}) / (1 - 0.9997)`);
    }
    
    const totalCultivation = absorbPerSecond * offlineSeconds;
    const requiredVein = String(totalCultivation);
    
    const totalVein = $addBig(playerData.vein, veinProduction);
    
    if ($gteBig(totalVein, requiredVein)) {
        playerData.vein = $subBig(totalVein, requiredVein);
        return totalCultivation;
    } else {
        playerData.vein = '0';
        return totalVein;
    }
}

// ========================================
// 离线灵石产出计算
// ========================================
// 计算仙脉离线灵石产出
// 仙脉(immortalVeinStone)产出灵石，每分钟: immortalVeinStone * 0.01
function calculateOfflineSpiritStones(playerData) {
    const offlineSeconds = (Date.now() - playerData.lastSaveTime) / 1000;
    const offlineMult = playerData.cheat?.offlineMultiplier || 1;
    const effectiveOfflineMinutes = $floor(offlineSeconds * offlineMult / 60);
    if (effectiveOfflineMinutes <= 0) return '0';
    
    const immortalVeinStone = playerData.immortalVeinStone || '0';
    const production = $evalBig(`${immortalVeinStone} * 0.01 * ${effectiveOfflineMinutes}`);
    return production;
}

// ========================================
// 离线战斗奖励计算
// ========================================
// 计算离线战斗奖励
// 根据战斗历史模拟离线期间的战斗掉落
function calculateOfflineBattleRewards(playerData, offlineSeconds) {
    const history = playerData.battleHistory.slice(-10);  // 取最近10场战斗历史
    if (history.length === 0) return { items: [], spiritStones: 0, totalCount: 0, immortalStones: 0, treasure: 0, lawFragments: 0, battleCount: 0, avgLevel: 0 };
    
    // ========================================
    // 战斗统计计算
    // ========================================
    // 计算平均等级和平均耗时
    const avgLevel = history.reduce((sum, h) => sum + h.level, 0) / history.length;
    const hasKillsField = history.some(h => h.kills !== undefined);
    const totalKills = history.reduce((sum, h) => sum + (h.kills || 0), 0);
    const avgDuration = hasKillsField && totalKills > 0 ? history.reduce((sum, h) => sum + h.duration, 0) / totalKills : history.reduce((sum, h) => sum + h.duration, 0) / history.length;
    
    // 计算离线期间可以打多少场战斗
    const battleCount = $floor(offlineSeconds / $max(avgDuration, 1));
    
    // ========================================
    // 掉落计算（使用数学期望）
    // ========================================
    const items = [];           // 掉落物品列表
    let totalCount = 0;         // 物品总数量
    let spiritStones = 0;       // 灵石掉落
    let immortalStones = 0;     // 仙石掉落
    let treasure = 0;           // 天材地宝掉落
    let lawFragments = 0;       // 法则碎片掉落
    
    const monsterLevel = avgLevel;
    
    // 灵石掉落：1%概率，数学期望 = battleCount * 0.01 * 1.02^等级
    spiritStones = $floor($evalBig(`${battleCount} * 0.01 * ${$pow(1.02, monsterLevel)}`));
    
    // 仙石掉落：0.02%概率，数学期望 = battleCount * 0.0002 * 1.02^等级
    immortalStones = $floor($evalBig(`${battleCount} * 0.0002 * ${$pow(1.02, monsterLevel)}`));
    
    // 天材地宝掉落：100%概率（每场战斗必得）
    treasure = $floor($evalBig(`${battleCount} * ${$pow(1.03, monsterLevel)} * 10`));
    
    // 法则碎片掉落：5%概率，数学期望 = battleCount * 0.05 * 1.033^等级 * 5
    lawFragments = $floor($evalBig(`${battleCount} * 0.05 * ${$pow(1.033, monsterLevel)} * 5`));
    
    // 灵草掉落：数量用数学期望，预计算概率数组，每株从数组从高阶到低阶单独随机
    const herbCount = $floor($evalBig(`${battleCount} * 0.01`));
    
    // 预计算概率数组（用超大数计算，结果转普通数字）
    const gradeProbabilities = [];
    let g = 1;
    while (true) {
        const probStr = String($evalBig(`10 * 1.035^${monsterLevel} / 10^${g}`));
        const prob = Number(probStr);
        if (prob < 0.000001) {
            break;
        }
        gradeProbabilities.push(prob);
        g++;
    }
    
    // 生成每株灵草
    for (let i = 0; i < herbCount; i++) {
        // 五种仙草随机选择
        const immortalHerbs = [
            '虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'
        ];
        const herbName = immortalHerbs[Math.floor(Math.random() * immortalHerbs.length)];
        
        // 从高阶到低阶逐个判断（没随机到就降阶）
        let grade = gradeProbabilities.length;
        for (let idx = gradeProbabilities.length - 1; idx >= 0; idx--) {
            if (Math.random() < gradeProbabilities[idx]) {
                grade = idx + 1;
                break;
            }
        }
        
        if (grade > 0) {
            const existingItem = items.find(item => item.name === herbName && item.grade === grade);
            if (existingItem) {
                existingItem.count = $addBig(existingItem.count, '1');
            } else {
                items.push({ name: herbName, grade: grade, count: '1' });
            }
            totalCount++;
        }
    }
    
    return { items, spiritStones, immortalStones, treasure, lawFragments, totalCount, battleCount, avgLevel };
}

// ========================================
// 工具函数
// ========================================
// 格式化离线时间
// 将秒数转换为易读的时间格式（小时分钟秒）
function formatOfflineTime(seconds) {
    const hours = $floor($evalBig(`${seconds} / 3600`));
    const minutes = $floor($evalBig(`(${seconds} % 3600) / 60`));
    const secs = $evalBig(`${seconds} % 60`);
    
    if ($gteBig(hours, '1')) {
        return `${formatHerbNumber(hours)}小时${formatHerbNumber(minutes)}分${formatHerbNumber(secs)}秒`;
    } else if ($gteBig(minutes, '1')) {
        return `${formatHerbNumber(minutes)}分${formatHerbNumber(secs)}秒`;
    } else {
        return `${formatHerbNumber(secs)}秒`;
    }
}

// ========================================
// Base64编码/解码工具
// ========================================
// UTF-8字符串转Base64
// 用于存档导出时的编码
function utf8ToBase64(str) {
    try {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
        }));
    } catch (e) {
        console.error('Base64编码失败:', e);
        return null;
    }
}

// Base64转UTF-8字符串
// 用于存档导入时的解码
function base64ToUtf8(base64) {
    try {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return decodeURIComponent(Array.from(bytes).map(b => '%' + ('00' + b.toString(16)).slice(-2)).join(''));
    } catch (e) {
        console.error('Base64解码失败:', e);
        return null;
    }
}

// ========================================
// 存档导出系统
// ========================================
// 导出存档（Base64编码）
// 将当前游戏数据编码为可分享的存档码
function exportSaveData() {
    const saveData = JSON.stringify(player);  // 序列化玩家数据
    const base64Data = utf8ToBase64(saveData);  // 编码为Base64
    
    if (!base64Data) {
        // 编码失败提示
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">存档导出失败！</span>
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    let buttons = `<button onclick="copySaveCode()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">复制存档码</button>`;
    
    // 添加导出到文件按钮
    buttons += `<button onclick="exportSaveToFile()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">导出到文件</button>`;
    
    // 创建输入框显示存档码
    showModal(`<span style="color:#ff0;">【 导出存档 】</span><br><br>
        <textarea id="export-code" style="width:90%;height:150px;background:#111;color:#fff;border:1px solid #666;padding:5px;font-family:monospace;font-size:12px;" readonly>${base64Data}</textarea><br><br>
        ${buttons}
        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">关闭</button>
    `, true);
}

// 导出存档到文件（明文JSON格式）
function exportSaveToFile() {
    const saveData = JSON.stringify(player, null, 2);
    const fileName = '修仙挂机存档_' + Date.now() + '.txt';
    
    // 尝试使用Android接口
    if (typeof AndroidInterface !== 'undefined' && AndroidInterface.downloadFile) {
        try {
            AndroidInterface.downloadFile(saveData, fileName, 'text/plain');
            return;
        } catch (e) {
            // Android接口失败，继续使用浏览器方式
        }
    }
    
    // 浏览器端下载方式
    try {
        const blob = new Blob([saveData], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">导出失败: ${e.message}</span>
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
    }
}

// 复制存档码到剪贴板
function copySaveCode() {
    const textarea = document.getElementById('export-code');
    if (textarea) {
        textarea.select();  // 选中文本
        document.execCommand('copy');  // 执行复制
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            存档码已复制到剪贴板！
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
    }
}

// ========================================
// 存档导入系统
// ========================================
// 导入存档
// 显示输入框让玩家粘贴存档码或从文件导入
function importSaveData() {
    let importButtons = `<button onclick="confirmImportSave()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确认导入</button>`;
    
    // 添加从文件导入按钮
    importButtons += `<button onclick="importSaveFromFile()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">从文件导入</button>`;
    
    showModal(`<span style="color:#ff0;">【 导入存档 】</span><br><br>
        <textarea id="import-code" style="width:90%;height:150px;background:#111;color:#fff;border:1px solid #666;padding:5px;font-family:monospace;font-size:12px;" placeholder="请粘贴存档码..."></textarea><br><br>
        ${importButtons}
        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">取消</button>
    `, true);
}

// 从文件导入存档
function importSaveFromFile() {
    // 尝试使用Android接口
    if (typeof AndroidInterface !== 'undefined' && AndroidInterface.pickFile) {
        AndroidInterface.pickFile('text', 'fileContentCallback', 'fileErrorCallback');
        return;
    }
    
    // 浏览器端文件选择
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,text/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            if (content) {
                const textarea = document.getElementById('import-code');
                if (textarea) {
                    textarea.value = content;
                }
            }
        };
        reader.onerror = function() {
            showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
                <span style="color:#f66;">读取文件失败</span>
                <br><br>
                <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
            `, true);
        };
        reader.readAsText(file);
    };
    input.click();
}

// 文件导入成功回调（供Android调用）
function fileContentCallback(content) {
    if (content) {
        const textarea = document.getElementById('import-code');
        if (textarea) {
            textarea.value = content;
        }
    }
}

// 文件导入失败回调（供Android调用）
function fileErrorCallback(error) {
    showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
        <span style="color:#f66;">读取文件失败: ${error}</span>
        <br><br>
        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
    `, true);
}

// 确认导入存档
// 解析并验证存档码，加载存档数据
function confirmImportSave() {
    const textarea = document.getElementById('import-code');
    if (!textarea) return;
    
    let base64Data = textarea.value.trim();
    if (!base64Data) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            请输入存档码！
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    // 移除可能的空白字符和换行
    base64Data = base64Data.replace(/\s/g, '');
    
    // ========================================
    // 作弊模块开关命令检测
    // ========================================
    // 检查是否包含作弊开关命令（明文）
    const inputText = base64Data.trim();
    if (inputText === '开启作弊') {
        // 开启作弊模块
        showCheatModule = true;
        player.showCheatModule = true;
        saveGameData();
        closeModal();
        updateCheatUI();
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#afa;">作弊模块已开启！</span>
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    } else if (inputText === '关闭作弊') {
        // 关闭作弊模块
        showCheatModule = false;
        player.showCheatModule = false;
        saveGameData();
        closeModal();
        updateCheatUI();
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#afa;">作弊模块已关闭！</span>
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    // ========================================
    // 存档解码与验证
    // ========================================
    try {
        let saveData = null;
        
        const trimmedData = base64Data.trim();
        
        // 判断是否为明文JSON（以{开头或包含有效JSON结构）
        const isJsonLike = (str) => {
            const trimmed = str.trim();
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                try {
                    JSON.parse(trimmed);
                    return true;
                } catch (e) {
                    return false;
                }
            }
            return false;
        };
        
        // 如果看起来像JSON，优先尝试解析明文
        if (isJsonLike(trimmedData)) {
            try {
                saveData = trimmedData;
                JSON.parse(saveData);
            } catch (e1) {
                // 明文解析失败，尝试base64解码
                saveData = base64ToUtf8(trimmedData);
            }
        } else {
            // 不是JSON格式，尝试base64解码
            saveData = base64ToUtf8(trimmedData);
            
            // 如果base64解码失败，尝试直接解析（可能是未编码的JSON）
            if (!saveData) {
                try {
                    saveData = trimmedData;
                    JSON.parse(saveData);
                } catch (e2) {
                    showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
                        <span style="color:#f66;">存档码解码失败！</span><br>
                        <span style="color:#888;font-size:12px;">请确保完整复制存档码</span>
                        <br><br>
                        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
                    `, true);
                    return;
                }
            }
        }
        
        // 解析JSON数据
        let loaded;
        try {
            loaded = JSON.parse(saveData);
        } catch (jsonErr) {
            console.error('JSON解析失败:', jsonErr);
            showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
                <span style="color:#f66;">存档数据格式错误！</span><br>
                <span style="color:#888;font-size:12px;">存档可能已损坏</span>
                <br><br>
                <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
            `, true);
            return;
        }
        
        // 验证存档数据完整性
        if (!loaded.name && !loaded.bag && !loaded.realmIndex) {
            showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
                <span style="color:#f66;">存档数据无效！</span><br>
                <span style="color:#888;font-size:12px;">缺少必要的数据字段</span>
                <br><br>
                <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
            `, true);
            return;
        }
        
        // 合并默认数据并加载
        player = { ...defaultPlayer, ...loaded };
        
        // ========================================
        // 存档字段兼容性处理
        // ========================================
        // 确保必要字段存在
        if (!player.divineAbilities) {
            player.divineAbilities = { ...defaultPlayer.divineAbilities };
        }
        if (!player.cheat) {
            player.cheat = { ...defaultPlayer.cheat };
        }
        if (!player.currentMap) {
            player.currentMap = 1;
        }
        if (!player.laws) {
            player.laws = { ...defaultPlayer.laws };
        } else {
            // 确保所有法则字段都存在，并转换为字符串
            for (let key in defaultPlayer.laws) {
                if (player.laws[key] === undefined || player.laws[key] === null) {
                    player.laws[key] = '0';
                } else {
                    player.laws[key] = String(player.laws[key]);
                }
            }
            // 移除已废弃的time法则
            if (player.laws.time !== undefined) {
                delete player.laws.time;
            }
        }
        if (!player.battleHistory) {
            player.battleHistory = [];
        }
        
        // 兼容旧存档的lawFragments格式（从对象转为数值）
        if (typeof player.lawFragments === 'object' && player.lawFragments !== null) {
            let totalFragments = 0;
            Object.values(player.lawFragments).forEach(val => {
                totalFragments += (typeof val === 'number' ? val : 0);
            });
            player.lawFragments = String(totalFragments);
        } else {
            player.lawFragments = String(player.lawFragments || 0);
        }
        
        // 兼容旧存档的weapon新字段
        if (player.weapon) {
            if (player.weapon.attackLevel === undefined) player.weapon.attackLevel = 0;
            if (player.weapon.critDamageLevel === undefined) player.weapon.critDamageLevel = 0;
            if (player.weapon.critRateLevel === undefined) player.weapon.critRateLevel = 0;
        }
        
        // 兼容旧存档的cheat对象和showCheatModule
        if (!player.cheat) {
            player.cheat = { offlineMultiplier: 1 };
        }
        if (player.cheat.offlineMultiplier === undefined) {
            player.cheat.offlineMultiplier = 1;
        }
        if (player.showCheatModule === undefined) {
            player.showCheatModule = false;
        }
        
        // ========================================
        // 同步游戏状态
        // ========================================
        // 同步地图状态
        battleState.currentMap = player.currentMap || 1;
        
        // 保存导入的存档
        localStorage.setItem('wenziguaji_save', JSON.stringify(player));
        
        closeModal();
        
        // 导入存档后执行离线结算
        try {
            processOfflineRewards(player);
            player.lastSaveTime = Date.now();
            localStorage.setItem('wenziguaji_save', JSON.stringify(player));
        } catch (offlineErr) {
            console.error('导入存档离线结算异常:', offlineErr);
        }
        
        // 刷新所有界面
        calculateCultivationStats();  // 重新计算属性
        updateStatusUI();             // 更新状态栏
        updateBattleUI();             // 更新战斗界面
        updateCultivationUI();        // 更新修炼界面
        updateWeaponUI();             // 更新法宝界面
        updateEquipmentUI();          // 更新装备界面
        updateBagUI();                // 更新背包界面
        
        // 显示成功提示
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#afa;">存档导入成功！</span>
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
    } catch (e) {
        // 导入失败处理
        console.error('导入存档失败:', e);
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">导入失败：${e.message || '未知错误'}</span>
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
    }
}

// ========================================
// 存档清除系统
// ========================================
// 清除存档
// 显示确认弹窗，防止误操作
function clearSaveData() {
    showModal(`<span style="color:#ff0;">【 重置游戏 】</span><br><br>
        <span style="color:#f66;">确定要清除所有存档数据吗？</span><br>
        <span style="color:#f66;">此操作不可恢复！</span><br><br>
        <button onclick="confirmClearSave()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定重置</button>
        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">取消</button>
    `, true);
}

// 确认清除存档
// 执行清除操作并重置游戏状态
function confirmClearSave() {
    localStorage.removeItem('wenziguaji_save');  // 删除本地存档
    closeModal();
    player = { ...defaultPlayer };  // 重置为默认数据
    calculateCultivationStats();     // 重新计算属性
    player.hp = player.maxHp;        // 恢复满血
    updateStatusUI();                // 更新所有界面
    updateBattleUI();
    updateCultivationUI();
    updateWeaponUI();
    updateEquipmentUI();
    updateBagUI();
    showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
        游戏已重置！
        <br><br>
        <button onclick="closeModal();location.reload();" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
    `, true);
}

// ========================================
// 修炼系统初始化
// ========================================
// 初始化修炼系统
// 设置定时器处理灵气吸收、灵脉产出、灵药成长等
function initCultivationSystem() {
    calculateCultivationStats();  // 初始计算属性
    player.hp = player.maxHp;     // 初始满血
    
    // ========================================
    // 每分钟定时器：灵脉/仙脉产出
    // ========================================
    // 每分钟：灵脉产出环境灵气，仙脉产出灵石
    setInterval(() => {
        // 计算灵田总阶位加成
        let fieldBonus = 0;
        player.spiritField.forEach(item => {
            if (item) fieldBonus += item.grade;
        });
        
        const fieldMultiplier = $pow(1.01, fieldBonus);
        
        if ($gteBig(player.veinStone, '0.001')) {
            const release = $evalBig(`${player.veinStone} * 0.2 * ${fieldMultiplier}`);
            player.vein = $addBig(player.vein, release);
            player.veinStone = $evalBig(`${player.veinStone} * 0.9997`);
        }
        
        if ($gteBig(player.immortalVeinStone, '0.01')) {
            const release = $evalBig(`${player.immortalVeinStone} * 0.01`);
            player.spiritStone = $addBig(player.spiritStone, release);
        }
        
        // 更新界面
        updateCultivationUI();
        updateEquipmentUI();
        updateStatusUI();
    }, 60000);  // 60秒 = 1分钟
    
    // ========================================
    // 每秒定时器：灵气吸收
    // ========================================
    // 每秒：功法吸收灵气变成灵力
    setInterval(() => {
        // 灵压系数 = 1.07^聚灵阵等级 * 1.05^灵草位阶和
        let nodeBonus = 0;
        player.arrayNodes.forEach(node => {
            nodeBonus += node.grade;
        });
        const spiritPressure = $pow(1.07, player.gatheringArrayLevel) * $pow(1.05, nodeBonus);
        
        // 功法吸收环境灵气变成灵力，每秒1点，灵压提升吞吐量
        const baseAbsorb = 1 * spiritPressure;
        if ($gteBig(player.vein, String(baseAbsorb))) {
            player.vein = $subBig(player.vein, String(baseAbsorb));
            player.cultivation = $addBig(player.cultivation, String(baseAbsorb));
            checkCultivationUpgrade();
        } else if ($gteBig(player.vein, '0.001')) {
            player.cultivation = $addBig(player.cultivation, player.vein);
            player.vein = '0';
            checkCultivationUpgrade();
        }
        
        // 更新界面
        updateCultivationUI();
        updateEquipmentUI();
        updateStatusUI();
    }, 1000);  // 1秒
    
    // ========================================
    // 每秒定时器：灵药成长
    // ========================================
    // 每秒：灵田灵药成长（每秒+1*灵田倍率）
    setInterval(() => {
        herbGrowthTick();
    }, 1000);  // 1秒
}

// ========================================
// 修炼升级检测
// ========================================
// ========================================
// 修炼升级检测
// ========================================
// 检查是否可以升级
// 判断玩家是否达到升级或突破条件
function checkCultivationUpgrade(playerData) {
    const target = playerData || player;
    const required = getRequiredCultivation(target.innerLevel);
    
    if (target.realmIndex >= 4) {
        target.canUpgrade = $gteBig(target.cultivation, String(required));
        target.canBreakthrough = false;
    } else {
        target.canUpgrade = $gteBig(target.cultivation, String(required)) && target.level < 9;
        target.canBreakthrough = $gteBig(target.cultivation, String(required)) && target.level >= 9 && target.realmIndex < 4;
    }
}

// ========================================
// 升级/突破成功率计算
// ========================================
// 获取升级成功率
// 不同境界有不同的基础成功率，丹药可提升成功率
function getUpgradeSuccessRate() {
    const rates = [0.90, 0.88, 0.86, 0.84];  // 各境界基础成功率：练气90%，筑基88%，金丹86%，元婴84%
    const baseRate = rates[player.realmIndex] || 0.80;
    const pillBonus = (player.pillBreakthroughBonus || 0);  // 丹药加成
    return $min(baseRate + pillBonus, 1);  // 最高100%
}

// 获取突破成功率
// 突破比升级更难，成功率更低
function getBreakthroughSuccessRate() {
    const rates = [0.35, 0.28, 0.22, 0.17];  // 各境界突破成功率：练气35%，筑基28%，金丹22%，元婴17%
    const baseRate = rates[player.realmIndex] || 0.10;
    const pillBonus = (player.pillBreakthroughBonus || 0);  // 丹药加成
    return $min(baseRate + pillBonus, 1);  // 最高100%
}

// ========================================
// 升级系统
// ========================================
// 执行升级
// 消耗灵力尝试提升一个小境界
function doUpgrade() {
    // 前置条件检查
    if (!player.canUpgrade) return;
    if (player.realmIndex < 4 && player.level >= 9) return;  // 未达化神且已满9重，需要突破
    
    const required = getRequiredCultivation(player.innerLevel);
    const successRate = getUpgradeSuccessRate();
    const currentRealm = realmNames[player.realmIndex] || '练气';
    
    // 显示确认弹窗
    confirmModal(
        `消耗 ${formatNumber(required)} 灵力进行升级\n当前境界: ${currentRealm} ${player.level}重\n成功率: ${(successRate * 100).toFixed(1)}%\n\n是否确认升级？`,
        () => {
            if (!$gteBig(player.cultivation, String(required))) {
                player.canUpgrade = false;
                updateCultivationUI();
                showResultModal(false, '灵力不足，升级失败！');
                return;
            }
            
            player.cultivation = $subBig(player.cultivation, String(required));
            
            // 随机判定是否成功
            if (Math.random() < successRate) {
                // 升级成功
                player.level += 1;           // 大境界等级+1
                player.innerLevel += 1;      // 内部等级+1
                calculateCultivationStats(); // 重新计算属性
                player.hp = player.maxHp;    // 恢复满血
                checkCultivationUpgrade();   // 检查下次升级条件
                updateCultivationUI();
                updateStatusUI();
                saveGameData();
                const newRealm = realmNames[player.realmIndex] || '练气';
                showResultModal(true, `恭喜！境界突破至 ${newRealm} ${player.level}重`);
            } else {
                // 升级失败（灵力已扣除，等级不变）
                checkCultivationUpgrade();
                updateCultivationUI();
                updateStatusUI();
                saveGameData();
                showResultModal(false, '升级失败，灵力已扣除，下次继续努力！');
            }
        }
    );
}

// ========================================
// 突破系统
// ========================================
// 执行突破
// 消耗灵力尝试突破到下一个大境界
function doBreakthrough() {
    // 前置条件检查
    if (!player.canBreakthrough) return;
    if (player.level < 9) return;        // 必须9重才能突破
    if (player.realmIndex >= 4) return;  // 化神后无突破
    
    const required = getRequiredCultivation(player.innerLevel);
    const successRate = getBreakthroughSuccessRate();
    const currentRealm = realmNames[player.realmIndex] || '练气';
    const nextRealm = realmNames[player.realmIndex + 1] || '炼虚';
    
    // 显示确认弹窗
    confirmModal(
        `消耗 ${formatNumber(required)} 灵力进行突破\n当前境界: ${currentRealm} ${player.level}重\n目标境界: ${nextRealm} 1重\n成功率: ${(successRate * 100).toFixed(1)}%\n\n突破失败只会损失灵力，是否继续？`,
        () => {
            if (!$gteBig(player.cultivation, String(required))) {
                player.canBreakthrough = false;
                updateCultivationUI();
                showResultModal(false, '灵力不足，突破失败！');
                return;
            }
            
            player.cultivation = $subBig(player.cultivation, String(required));
            
            // 随机判定是否成功
            if (Math.random() < successRate) {
                // 突破成功
                player.realmIndex += 1;     // 境界提升
                player.level = 1;           // 重置为1重
                player.innerLevel += 10;    // 内部等级+10（一个大境界）
                calculateCultivationStats(); // 重新计算属性
                player.hp = player.maxHp;    // 恢复满血
                checkCultivationUpgrade();   // 检查下次升级条件
                updateCultivationUI();
                updateStatusUI();
                saveGameData();
                const newRealm = realmNames[player.realmIndex] || '练气';
                showResultModal(true, `恭喜！突破成功，进入 ${newRealm} 境界！`);
            } else {
                // 突破失败（灵力已扣除，境界不变）
                checkCultivationUpgrade();
                updateCultivationUI();
                updateStatusUI();
                saveGameData();
                showResultModal(false, '突破失败，灵力已扣除，下次继续努力！');
            }
        }
    );
}

// ========================================
// 属性查看系统
// ========================================
let attributesVisible = false;

// 切换属性显示
// 显示玩家的基础属性和加成详情
function toggleAttributes() {
    const innerLevel = player.innerLevel;
    
    // 基础属性（位格和法则加成之前）
    const baseHp = 100 + innerLevel * 10;
    const baseAttack = 10 + innerLevel * 1;
    const baseDefense = 5 + innerLevel * 0.5;
    const baseSpeed = 10 + innerLevel * 1;
    
    // 仅修炼加成的位格
    const cultivationPower = 1 + innerLevel * 0.1;
    
    // 绑定灵草信息
    const boundHerbBonus = player.boundHerb ? player.boundHerb.grade * 0.1 : 0;
    const boundHerbText = player.boundHerb 
        ? `${player.boundHerb.name}(${player.boundHerb.grade}阶)` 
        : '未绑定';
    
    // 显示属性详情弹窗
    showModal(`【 基础属性 】
生命: ${baseHp}
攻击: ${baseAttack}
防御: ${baseDefense}
攻速: ${baseSpeed}

【 位格加成 】
修炼位格: ${cultivationPower.toFixed(2)}

【 绑定灵草 】
${boundHerbText}
位格加成: +${boundHerbBonus.toFixed(1)}`);
}

// ========================================
// 弹窗系统
// ========================================
// 显示普通弹窗
// 参数：content - 内容，isHtml - 是否为HTML格式
function showModal(content, isHtml = false) {
    const modal = document.createElement('div');
    modal.id = 'customModal';
    // 设置弹窗样式：全屏遮罩，居中显示
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:9999;';
    // 点击遮罩关闭弹窗
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
    
    // 根据内容类型生成不同的HTML
    if (isHtml) {
        modal.innerHTML = `
            <div style="background:#000;border:2px solid #fff;padding:20px;color:#fff;font-family:monospace;max-width:900px;max-height:90vh;overflow-y:auto;text-align:center;">
                ${content}
            </div>
        `;
    } else {
        modal.innerHTML = `
            <div style="background:#000;border:2px solid #fff;padding:20px;color:#fff;font-family:monospace;max-width:900px;max-height:90vh;overflow-y:auto;">
                <pre style="white-space:pre-wrap;margin:0;">${content}</pre>
            </div>
        `;
    }
    document.body.appendChild(modal);
}

// 显示确认弹窗
// 参数：message - 提示信息，onConfirm - 确认回调函数
function confirmModal(message, onConfirm) {
    const modal = document.createElement('div');
    modal.id = 'customModal';
    // 设置弹窗样式
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:9999;';
    modal.innerHTML = `
        <div style="background:#000;border:2px solid #fff;padding:20px;color:#fff;font-family:monospace;text-align:center;min-width:300px;">
            <pre style="white-space:pre-wrap;margin:0 0 20px 0;color:#fff;">${message}</pre>
            <div style="display:flex;gap:20px;justify-content:center;">
                <button id="confirmBtn" style="background:#fff;color:#000;border:1px solid #fff;padding:8px 24px;cursor:pointer;font-family:monospace;font-weight:bold;">[确定]</button>
                <button id="cancelBtn" style="background:#333;color:#fff;border:1px solid #666;padding:8px 24px;cursor:pointer;font-family:monospace;">[取消]</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 绑定确定按钮事件
    document.getElementById('confirmBtn').addEventListener('click', function() {
        closeModal();
        if (typeof onConfirm === 'function') {
            setTimeout(onConfirm, 50);  // 延迟执行，确保弹窗已关闭
        }
    });
    // 绑定取消按钮事件
    document.getElementById('cancelBtn').addEventListener('click', function() {
        closeModal();
    });
}

// ========================================
// 结果弹窗
// ========================================
// 显示结果弹窗
// 参数：success - 是否成功，message - 提示信息，onClose - 关闭回调
function showResultModal(success, message, onClose) {
    // 根据成功/失败设置不同颜色
    const color = success ? '#fff' : '#f00';
    const borderColor = success ? '#fff' : '#f00';
    const title = success ? '【 成功 】' : '【 失败 】';
    
    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:9999;';
    modal.innerHTML = `
        <div style="background:#000;border:2px solid ${borderColor};padding:20px;color:${color};font-family:monospace;text-align:center;min-width:300px;">
            <pre style="white-space:pre-wrap;margin:0 0 20px 0;color:${color};">${title}

${message}</pre>
            <button id="resultConfirmBtn" style="background:${color};color:#000;border:1px solid ${borderColor};padding:8px 24px;cursor:pointer;font-family:monospace;font-weight:bold;">[确定]</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 绑定确定按钮事件
    document.getElementById('resultConfirmBtn').addEventListener('click', function() {
        closeModal();
        if (typeof onClose === 'function') {
            setTimeout(onClose, 50);
        }
    });
}

// ========================================
// 弹窗关闭
// ========================================
// 关闭所有弹窗
// 移除页面上所有的自定义弹窗
function closeModal() {
    const modals = document.querySelectorAll('#customModal');
    modals.forEach(modal => modal.remove());
}

// 显示游戏说明
function showGameGuide() {
    if (typeof AndroidInterface !== 'undefined' && AndroidInterface.readFile) {
        try {
            const content = AndroidInterface.readFile('游戏说明.txt');
            if (content) {
                displayGameGuide(content);
                return;
            }
        } catch (e) {
            console.warn('AndroidInterface.readFile failed:', e);
        }
    }
    
    fetch('游戏说明.txt')
        .then(response => response.text())
        .then(text => {
            displayGameGuide(text);
        })
        .catch(error => {
            showModal('<span style="color:#ff0;">【 系统提示 】</span><br><br><span style="color:#f66;">加载游戏说明失败</span><br><br><button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">关闭</button>', true);
        });
}

function displayGameGuide(text) {
    const lines = text.split('\n');
    let html = '<div style="max-height:70vh;overflow-y:auto;white-space:pre-wrap;font-size:12px;color:#fff;line-height:1.5;">';
    html += lines.map(line => {
        if (line.includes('====')) {
            return '';
        }
        return line + '<br>';
    }).join('');
    html += '</div>';
    html += '<br><button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">关闭</button>';
    showModal('<span style="color:#ff0;">【 游戏说明 】</span><br><br>' + html, true);
}

// ========================================
// 输入弹窗
// ========================================
// 显示输入弹窗
// 参数：title - 标题，defaultValue - 默认值，onConfirm - 确认回调
function showInputModal(title, defaultValue, onConfirm) {
    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:9999;';
    // 点击遮罩关闭
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
    modal.innerHTML = `
        <div style="background:#000;border:2px solid #fff;padding:20px;color:#fff;font-family:monospace;max-width:400px;text-align:center;">
            <div style="margin-bottom:15px;">${title}</div>
            <input type="text" id="modalInput" value="${defaultValue}" style="background:#111;border:1px solid #666;color:#fff;padding:8px;width:200px;text-align:center;font-family:monospace;">
            <div style="margin-top:15px;">
                <button onclick="confirmInput()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 20px;cursor:pointer;margin-right:10px;">确定</button>
                <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 20px;cursor:pointer;">取消</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const input = document.getElementById('modalInput');
    input.focus();   // 自动聚焦
    input.select();  // 自动选中
    // 保存回调函数到全局变量
    window._modalInputCallback = onConfirm;
}

// 确认输入
// 获取输入值并执行回调
function confirmInput() {
    const input = document.getElementById('modalInput');
    const value = input ? input.value : '';
    const callback = window._modalInputCallback;
    closeModal();
    if (callback) callback(value);
}

// ========================================
// 怪物属性查看
// ========================================
// 显示怪物属性
// 显示当前战斗中怪物的详细属性和技能信息
function showMonsterStats() {
    const m = battleState;
    let stats = `【 ${m.currentMonster} 属性 】
Lv.${Math.floor(m.monsterLevel)}
生命: ${formatNumber(m.monsterHp)}/${formatNumber(m.monsterMaxHp)}
攻击: ${formatNumber(m.monsterAtk)}
防御: ${formatNumber(m.monsterDef)}
暴击率: ${(m.monsterCritRate * 100).toFixed(1)}%
暴击伤害: ${(m.monsterCritDmg * 100).toFixed(0)}%
攻击速度: ${m.monsterSpeed.toFixed(1)}`;
    
    // 显示怪物技能（如果有）
    if (m.monsterSkills && m.monsterSkills.length > 0) {
        stats += `\n\n【 怪物技能 】`;
        m.monsterSkills.forEach(skillKey => {
            const skill = monsterSkills[skillKey];
            if (!skill) return;
            const triggerChance = skill.getTriggerChance ? skill.getTriggerChance(m.monsterLevel) : 0;
            stats += `\n• ${skill.name}: ${skill.desc}`;
            stats += `\n  触发概率: ${(triggerChance * 100).toFixed(1)}%`;
        });
    } else {
        stats += `\n\n【 怪物技能 】`;
        stats += `\n无特殊技能`;
    }
    
    closeModal();
    showModal(stats);
}

// ========================================
// 修炼界面更新
// ========================================
// 更新修炼界面
// 显示玩家状态、境界进度、神通等信息
function updateCultivationUI() {
    const cultivateContent = document.querySelector('#cultivate-content');
    if (!cultivateContent) return;
    
    // 获取当前境界信息
    const realmName = realmNames[player.realmIndex] || '练气';
    const innerLevel = player.innerLevel || 1;
    const required = getRequiredCultivation(innerLevel);
    const cultivation = player.cultivation || '0';
    
    let progress = 0;
    if (required > 0) {
        progress = $min(100, $floor($evalBig(`${cultivation} / ${required}`) * 100));
    }
    const filled = $max(0, $min(10, $floor(progress / 10)));
    const progressBar = '█'.repeat(filled) + '░'.repeat(10 - filled);
    
    // 计算基础属性加成（用于显示）
    const hpBonus = 100 + innerLevel * 10;
    const mpBonus = 50 + innerLevel * 5;
    const attackBonus = 10 + innerLevel * 1;
    const defenseBonus = 5 + innerLevel * 0.5;
    const speedBonus = 10 + innerLevel * 1;
    const powerBonus = 1 + innerLevel * 0.05;
    
    // 绑定灵草信息
    const boundHerbText = player.boundHerb 
        ? `${player.boundHerb.name}(${player.boundHerb.grade}阶)` 
        : '未绑定';
    
    const boundHerbBonus = player.boundHerb ? player.boundHerb.grade * 0.1 : 0;
    
    let ripenCost = '0';
    if (player.boundHerb) {
        const grade = player.boundHerb.grade + 1;
        if ($gteBig(String(grade), '1e100')) {
            ripenCost = $evalBig(`${grade} * 10`);
        } else {
            ripenCost = $evalBig(`floor(10 * 9.5^${grade})`);
        }
    }
    const canRipenHerb = player.boundHerb && $gteBig(player.vein, ripenCost);
    
    // 生成界面HTML
    const html = `
        <div class="text-line">${box.top}</div>
        <div class="text-line">${box.line} 姓名: <span onclick="renamePlayer()" style="cursor:pointer;">${player.name}</span> ${realmName}${player.level}重 ${box.line}</div>
        <div class="text-line">${box.line} 生命: ${formatNumber(player.maxHp)} ${box.line}</div>
        <div class="text-line">${box.line} 攻击: ${formatNumber(player.attack)} 防御: ${formatNumber(player.defense)} ${box.line}</div>
        <div class="text-line">${box.line} 攻速: ${player.speed.toFixed(1)} 位格: ${player.power.toFixed(2)} ${box.line}</div>
        <div class="text-line">${box.line} 暴击: ${formatLawLevel(player.criticalRate)}% 暴伤: ${formatLawLevel(player.criticalDamage)}% ${box.line}</div>
        <div class="text-line">${box.bottom}</div>
        <div class="text-line"></div>
        <div class="text-line">${box.top}</div>
        <div class="text-line">${box.line} <span onclick="renameBookName()" style="cursor:pointer;">【 ${player.weapon.bookName} 】</span> <button onclick="toggleAttributes()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">属性</button> <button onclick="showBindHerbSelection()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">绑定</button> ${box.line}</div>
        <div class="text-line">${box.line} 绑定灵草: ${boundHerbText} ${player.boundHerb 
            ? `<button onclick="showRipenHerbConfirm()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">催熟</button>` 
            : ''} ${box.line}</div>
        <div class="text-line">${box.line} 位格加成: +${boundHerbBonus.toFixed(1)} ${box.line}</div>
        <div class="text-line">${box.line} 境界: ${realmName} ${player.level}重 ${box.line}</div>
        <div class="text-line">${box.line} 进度: ${progressBar} ${formatHerbNumber(progress)}% ${box.line}</div>
        <div class="text-line">${box.line} 灵力: ${formatNumber(player.cultivation)}/${formatNumber(required)} ${box.line}</div>
        <div class="text-line">${box.line} ${player.level >= 9 && player.realmIndex < 4 
            ? `<button onclick="doBreakthrough()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">突破(${(getBreakthroughSuccessRate()*100).toFixed(0)}%)</button>` 
            : (player.canUpgrade ? `<button onclick="doUpgrade()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">升级(${(getUpgradeSuccessRate()*100).toFixed(0)}%)</button>` : '')} ${box.line}</div>
        <div class="text-line">${box.bottom}</div>
        <div class="text-line"></div>
        <div class="text-line">【 神通系统 】</div>
        <div class="text-line">${box.top}</div>
        ${generateDivineAbilityLine('cuiyeYuqi', 0, '翠叶御气')}
        ${generateDivineAbilityLine('qingmuRoumai', 1, '木瘴蚀甲')}
        ${generateDivineAbilityLine('hunyuanGuiyi', 2, '混元归一')}
        ${generateDivineAbilityLine('qingmuZhenshen', 3, '青木真身')}
        ${generateDivineAbilityLine('zhutianWeiyi', 4, '长生久视')}
        <div class="text-line">${box.bottom}</div>
    `;
    
    cultivateContent.innerHTML = html;
}

// ========================================
// 神通界面生成
// ========================================
// 生成神通显示行
// 参数：abilityKey - 神通键名，requiredRealm - 所需境界，abilityName - 神通名称
function generateDivineAbilityLine(abilityKey, requiredRealm, abilityName) {
    const isUnlocked = player.realmIndex >= requiredRealm;
    const realmNames = ['练气', '筑基', '金丹', '元婴', '化神'];
    
    // 防御性检查：确保神通数据存在
    if (!player.divineAbilities || !player.divineAbilities[abilityKey]) {
        return `<div class="text-line">${box.line}   ${box.line}</div><div class="text-line">${box.line} ${abilityName}: 数据异常 ${box.line}</div>`;
    }
    
    const level = player.divineAbilities[abilityKey].level || 0;
    
    if (isUnlocked) {
        // 已解锁：显示神通等级和详情按钮
        return `<div class="text-line">${box.line}   ${box.line}</div><div class="text-line">${box.line} ${abilityName}: Lv.${level} <button onclick="showDivineAbilityInfo('${abilityKey}')" style="background:#333;color:#fff;border:1px solid #666;padding:1px 5px;cursor:pointer;">详情</button> ${box.line}</div>`;
    } else {
        // 未解锁：显示解锁条件
        return `<div class="text-line">${box.line}   ${box.line}</div><div class="text-line">${box.line} ??? (${realmNames[requiredRealm]}解锁) <span style="color:#666;">???</span> ${box.line}</div>`;
    }
}

// ========================================
// 灵草绑定系统
// ========================================
// 显示绑定灵草选择
// 弹出选择框让玩家选择要绑定的灵草
function showBindHerbSelection() {
    // 筛选背包中的灵草（五种仙草）
    const herbs = player.bag.filter(item => 
        ['虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'].includes(item.name)
    );
    
    // 生成选项列表
    let options = '<div onclick="unbindHerb()" style="cursor:pointer;padding:8px;border:1px solid #666;margin:5px auto;max-width:200px;background:#333;">解除绑定</div>';
    
    if (herbs.length === 0) {
        options += '<div style="padding:8px;color:#666;">纳戒中没有灵草</div>';
    } else {
        herbs.forEach((item) => {
            const bagIndex = player.bag.indexOf(item);
            options += `<div onclick="bindHerb(${bagIndex})" style="cursor:pointer;padding:8px;border:1px solid #666;margin:5px auto;max-width:200px;">
                ${item.name} (${item.grade}阶) x${formatLawLevel(item.count)}
            </div>`;
        });
    }
    
    // 显示选择弹窗
    showModal(`<span style="color:#ff0;">【 选择绑定灵草 】</span><br><br>
        ${options}
        <br><button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">取消</button>
    `, true);
}

// ========================================
// 灵草绑定/解绑操作
// ========================================
function bindHerb(bagIndex) {
    const item = player.bag[bagIndex];
    if (!item || $lteBig(item.count, '0')) return;
    
    if (player.boundHerb) {
        const existingItem = player.bag.find(bagItem => 
            bagItem.name === player.boundHerb.name && bagItem.grade === player.boundHerb.grade
        );
        if (existingItem) {
            existingItem.count = $addBig(existingItem.count, '1');
        } else if (player.bag.length < getBagCapacity()) {
            player.bag.push({ name: player.boundHerb.name, grade: player.boundHerb.grade, count: '1' });
        }
    }
    
    player.boundHerb = { name: item.name, grade: item.grade };
    item.count = $subBig(item.count, '1');
    
    if ($lteBig(item.count, '0')) {
        player.bag.splice(bagIndex, 1);
    }
    
    closeModal();
    updateCultivationUI();
    updateBagUI();
    saveGameData();
}

function unbindHerb() {
    if (!player.boundHerb) return;
    
    const existingItem = player.bag.find(bagItem => 
        bagItem.name === player.boundHerb.name && bagItem.grade === player.boundHerb.grade
    );
    if (existingItem) {
        existingItem.count = $addBig(existingItem.count, '1');
    } else if (player.bag.length < getBagCapacity()) {
        player.bag.push({ name: player.boundHerb.name, grade: player.boundHerb.grade, count: '1' });
    }
    
    player.boundHerb = null;
    closeModal();
    updateCultivationUI();
    updateBagUI();
    saveGameData();
}

function ripenBoundHerb() {
    if (!player.boundHerb) return;
    
    const grade = player.boundHerb.grade + 1;
    let ripenCost;
    if ($gteBig(String(grade), '1e100')) {
        ripenCost = $evalBig(`${grade} * 10`);
    } else {
        ripenCost = $evalBig(`floor(10 * 9.5^${grade})`);
    }
    
    if (!$gteBig(player.vein, ripenCost)) {
        closeModal();
        return;
    }
    
    player.vein = $subBig(player.vein, ripenCost);
    player.boundHerb.grade++;
    
    closeModal();
    updateCultivationUI();
    saveGameData();
}

function showRipenHerbConfirm() {
    if (!player.boundHerb) return;
    
    const currentGrade = player.boundHerb.grade;
    const nextGrade = currentGrade + 1;
    let ripenCost;
    if ($gteBig(String(nextGrade), '1e100')) {
        ripenCost = $evalBig(`${nextGrade} * 10`);
    } else {
        ripenCost = $evalBig(`floor(10 * 9.5^${nextGrade})`);
    }
    const hasEnough = $gteBig(player.vein, ripenCost);
    
    if (!hasEnough) {
        showModal(`<span style="color:#ff0;">【 环境灵气不足 】</span><br>
            <br>当前环境灵气: ${formatNumber(player.vein)}
            <br>催熟消耗: ${formatNumber(ripenCost)}
            <br><br><button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `);
    } else {
        showModal(`<span style="color:#ff0;">【 灵草催熟 】</span><br><br>
            <br>当前等阶: ${currentGrade}阶
            <br>催熟后: ${nextGrade}阶
            <br>消耗环境灵气: ${formatNumber(ripenCost)}
            <br><br>
            <button onclick="confirmRipenHerb()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确认催熟</button>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">取消</button>
        `, true);
    }
}

function confirmRipenHerb() {
    if (!player.boundHerb) return;
    
    const grade = player.boundHerb.grade + 1;
    let ripenCost;
    if ($gteBig(String(grade), '1e100')) {
        ripenCost = $evalBig(`${grade} * 10`);
    } else {
        ripenCost = $evalBig(`floor(10 * 9.5^${grade})`);
    }
    
    if (!$gteBig(player.vein, ripenCost)) return;
    
    player.vein = $subBig(player.vein, ripenCost);
    player.boundHerb.grade++;
    
    if (player.boundHerb.grade > player.highestHerbGrade) {
        player.highestHerbGrade = player.boundHerb.grade;
    }
    
    closeModal();
    calculateCultivationStats();
    updateCultivationUI();
    updateStatusUI();
    saveGameData();
}

// ========================================
// 神通系统
// ========================================
// 显示神通详情
// 显示神通的描述、当前效果和升级选项
function showDivineAbilityInfo(abilityKey) {
    // 防御性检查：确保神通数据存在
    if (!player.divineAbilities || !player.divineAbilities[abilityKey]) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            神通数据异常，请尝试重新加载游戏。
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    const ability = player.divineAbilities[abilityKey];
    const level = ability.level || 0;
    
    let description = '';
    let currentEffect = '';
    
    // 根据神通类型生成描述和效果
    switch(abilityKey) {
        case 'qingmuRoumai':
            // 木瘴蚀甲：降低敌方防御减伤效果
            description = '木瘴蚀甲：敌方防御减伤效果降低为原来的0.9^等级';
            currentEffect = level > 0 ? `当前效果：敌方减伤效果×${parseFloat($pow(0.9, level)).toFixed(3)}` : '未学习';
            break;
        case 'cuiyeYuqi':
            // 翠叶御气：攻击附带额外伤害
            description = '翠叶御气：每次攻击附带等级×10%的额外伤害';
            currentEffect = level > 0 ? `当前效果：附加${level * 10}%额外伤害` : '未学习';
            break;
        case 'qingmuZhenshen':
            description = '青木真身：战前额外增加攻击力×10×等级的生命';
            currentEffect = level > 0 ? `当前效果：额外生命+${formatLawLevel($evalBig(`${player.attack} * 10 * ${level}`))}` : '未学习';
            break;
        case 'hunyuanGuiyi':
            description = '混元归一：攻击时附加当前生命×0.1×等级的伤害';
            currentEffect = level > 0 ? `当前效果：附加${formatLawLevel($evalBig(`${player.hp} * 0.1 * ${level}`))}伤害` : '未学习';
            break;
        case 'zhutianWeiyi':
            // 长生久视：预知战斗结果，选择最优解
            description = '长生久视：每次战斗模拟等级数量的战斗，选取胜利且用时最短的未来，避开死局';
            currentEffect = level > 0 ? `当前效果：模拟${level}次战斗，选择最快胜利结果` : '未学习';
            break;
    }
    
    // 检查升级所需灵草
    const nextLevel = level + 1;
    const herbs = findHerbsByGrade(nextLevel);
    
    // 生成升级按钮或提示
    let upgradeHtml = '';
    if (herbs.length > 0) {
        upgradeHtml = `<button onclick="showHerbSelectionForAbility('${abilityKey}', ${nextLevel})" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">升级</button>`;
    } else {
        upgradeHtml = `<span style="color:#f66;">纳戒中无${nextLevel}阶灵草</span>`;
    }
    
    // 显示神通详情弹窗
    showModal(`<span style="color:#ff0;">【 ${ability.name} 】</span><br>
        <br>等级: Lv.${level}
        <br><br>${description}
        <br><br>${currentEffect}
        <br><br>升级需求: ${nextLevel}阶灵草
        <br><br>${upgradeHtml}
        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">关闭</button>
    `, true);
}

// ========================================
// 灵草查找工具
// ========================================
// 查找指定等级的所有灵草
// 参数：grade - 所需灵草阶位
// 返回：符合条件的灵草列表（包含背包索引和物品信息）
function findHerbsByGrade(grade) {
    // 五种仙草名称
    const herbNames = ['虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'];
    const herbs = [];
    
    for (let i = 0; i < player.bag.length; i++) {
        const item = player.bag[i];
        if (herbNames.includes(item.name) && item.grade >= grade && $gteBig(item.count, '1')) {
            herbs.push({ index: i, item: item });
        }
    }
    return herbs;
}

// 显示灵草选择弹窗
function showHerbSelectionForAbility(abilityKey, grade) {
    closeModal(); // 先关闭之前的弹窗
    
    const herbs = findHerbsByGrade(grade);
    
    if (herbs.length === 0) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            纳戒中没有${grade}阶灵草！
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    let options = '';
    herbs.forEach((herb, idx) => {
        options += `<div id="herb-option-${idx}" onclick="selectHerbForAbility(${idx}, ${herb.index}, '${abilityKey}')" style="cursor:pointer;padding:8px;border:1px solid #666;margin:5px auto;max-width:200px;">
            ${herb.item.name} (${herb.item.grade}阶) x${formatLawLevel(herb.item.count)}
        </div>`;
    });
    
    showModal(`<span style="color:#ff0;">【 选择${grade}阶灵草升级 】</span><br><br>
        ${options}
        <br><div id="herb-confirm-area"></div>
        <br><button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">取消</button>
    `, true);
}

// 选择灵草
let selectedHerbIndex = null;
let selectedAbilityKey = null;

function selectHerbForAbility(optionIdx, bagIndex, abilityKey) {
    // 清除之前选中的样式
    document.querySelectorAll('[id^="herb-option-"]').forEach(el => {
        el.style.borderColor = '#666';
        el.style.backgroundColor = 'transparent';
    });
    
    // 高亮选中的
    const selected = document.getElementById(`herb-option-${optionIdx}`);
    if (selected) {
        selected.style.borderColor = '#ff0';
        selected.style.backgroundColor = '#333';
    }
    
    selectedHerbIndex = bagIndex;
    selectedAbilityKey = abilityKey;
    
    // 显示确定按钮
    const confirmArea = document.getElementById('herb-confirm-area');
    if (confirmArea) {
        confirmArea.innerHTML = `<button onclick="confirmUpgradeAbility()" style="background:#333;color:#fff;border:1px solid #666;padding:8px 20px;cursor:pointer;margin-top:10px;">确定升级</button>`;
    }
}

// 确认升级
function confirmUpgradeAbility() {
    if (selectedHerbIndex === null || selectedAbilityKey === null) return;
    
    upgradeDivineAbility(selectedAbilityKey, selectedHerbIndex);
    
    selectedHerbIndex = null;
    selectedAbilityKey = null;
    
    closeModal();
}

function findHerbInBag(grade) {
    const herbNames = ['虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'];
    for (let i = 0; i < player.bag.length; i++) {
        const item = player.bag[i];
        if (herbNames.includes(item.name) && item.grade === grade && $gteBig(item.count, '1')) {
            return i;
        }
    }
    return null;
}

function upgradeDivineAbility(abilityKey, bagIndex) {
    const ability = player.divineAbilities[abilityKey];
    const nextLevel = ability.level + 1;
    
    if (bagIndex === null || !player.bag[bagIndex]) return;
    
    const herb = player.bag[bagIndex];
    if (herb.grade < nextLevel) return;
    
    herb.count = $subBig(herb.count, '1');
    if ($lteBig(herb.count, '0')) {
        player.bag.splice(bagIndex, 1);
    }
    
    ability.level++;
    
    closeModal();
    updateCultivationUI();
    updateBagUI();
    saveGameData();
}

// 更新洞府界面
function updateEquipmentUI() {
    const equipmentContent = document.querySelector('#equipment-content');
    if (!equipmentContent) return;
    
    const level = player.gatheringArrayLevel;
    const levelStr = String(level);
    let gatheringArrayCost;
    if ($gteBig(levelStr, '1e100')) {
        gatheringArrayCost = $evalBig(`${levelStr} * 100`);
    } else {
        gatheringArrayCost = $evalBig(`floor(100 * 1.25^${levelStr})`);
    }
    
    let nodeBonus = 0;
    player.arrayNodes.forEach(node => {
        nodeBonus += node.grade;
    });
    
    const spiritPressure = $pow(1.07, player.gatheringArrayLevel) * $pow(1.05, nodeBonus);
    const canUpgrade = $gteBig(player.treasure, gatheringArrayCost);
    
    let fieldBonus = 0;
    player.spiritField.forEach(item => {
        if (item) fieldBonus += item.grade;
    });
    
    const fieldMultiplier = $pow(1.01, fieldBonus);
    
    const html = `
        <div class="text-line">${box.top}</div>
        <div class="text-line">【 灵脉 】</div>
        <div class="text-line">  ${innerBox.top}  </div>
        <div class="text-line">    灵石 数量 ${formatNumber(player.spiritStone)}    </div>
        <div class="text-line">    灵脉 ${formatNumber(player.veinStone)} 衰减0.03%/分    </div>
        <div class="text-line">    环境灵气: ${formatNumber(player.vein)}    </div>
        <div class="text-line">    产出: +${formatLawLevel($evalBig(`${player.veinStone} * 0.2 * ${fieldMultiplier}`))}环境灵气/分,    </div>
        <div class="text-line">    灵田加成: ×${formatPrecision(fieldMultiplier)}    </div>
        <div class="text-line">    <button onclick="depositStone()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">投入灵石</button>    </div>
        <div class="text-line">  ${innerBox.bottom}  </div>
        <div class="text-line">  ${innerBox.top}  </div>
        <div class="text-line">    仙石 数量 ${formatNumber(player.immortalStone)}    </div>
        <div class="text-line">    仙脉 ${formatNumber(player.immortalVeinStone)}    </div>
        <div class="text-line">    产出: +${formatLawLevel($evalBig(`${player.immortalVeinStone} * 0.01`))}灵石/分    </div>
        <div class="text-line">    <button onclick="depositImmortalVein()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">投入仙石</button>    </div>
        <div class="text-line">  ${innerBox.bottom}  </div>
        <div class="text-line">${box.bottom}</div>
        <div class="text-line"></div>
        <div class="text-line">${box.top}</div>
        <div class="text-line">【 聚灵阵 】</div>
        <div class="text-line">${box.line} 等级: ${formatLawLevel(player.gatheringArrayLevel)}  灵压: ${formatPrecision(spiritPressure)}倍 ${box.line}</div>
        <div class="text-line">${box.line} 阵眼阶位和: ${nodeBonus}  天材地宝: ${formatNumber(player.treasure)} ${box.line}</div>
        <div class="text-line">${box.line} <button onclick="upgradeGatheringArray()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">升级(消耗${formatLawLevel(gatheringArrayCost)})</button> ${box.line}</div>
        <div class="text-line">【 阵眼 】</div>
        ${generateArrayNodesUI()}
        <div class="text-line">${box.bottom}</div>
        <div class="text-line"></div>
        <div class="text-line">${box.top}</div>
        <div class="text-line">【 灵田 】</div>
        <div class="text-line">${box.line} 环境灵气产出加成: ×${formatPrecision(fieldMultiplier)} ${box.line}</div>
        <div class="text-line">${box.line} 灵田等级: ${formatLawLevel(player.spiritFieldLevel)}级 生长加速: ×${formatPrecision(1/$pow(0.96, player.spiritFieldLevel))} ${box.line}</div>
        <div class="text-line">${box.line} <button onclick="upgradeSpiritField()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">升级灵田(${formatLawLevel(getSpiritFieldCost(player.spiritFieldLevel))})</button> ${box.line}</div>
        <div class="text-line">${box.line} 历史最高灵药等阶: ${player.highestHerbGrade}阶 ${box.line}</div>
        ${generateSpiritFieldUI()}
        <div class="text-line">${box.bottom}</div>
    `;
    
    equipmentContent.innerHTML = html;
}

// ========================================
// 阵眼界面生成
// ========================================
// 生成阵眼UI
// 显示五个阵眼的状态，可点击绑定灵草
function generateArrayNodesUI() {
    const nodeNames = ['虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'];
    let table = '<table style="border-collapse:separate;border-spacing:3px;border:1px solid #333;color:#fff;font-family:monospace;text-align:center;margin-top:5px;">';
    table += '<tr>';
    
    // 遍历五个阵眼，生成对应的格子
    for (let i = 0; i < 5; i++) {
        const node = player.arrayNodes[i];
        const hasHerb = node.grade > 0;              // 是否已绑定灵草
        const shortName = nodeNames[i].slice(0, 4);  // 灵草简称（取前4字）
        
        // 生成阵眼格子，点击可绑定灵草
        table += `<td onclick="showArrayNodeSelection(${i})" style="border:1px solid #666;padding:5px;cursor:pointer;width:60px;height:50px;vertical-align:top;background:#222;">
            <div style="color:#fff;font-size:10px;">${shortName}</div>
            <div style="color:#fff;font-size:10px;">${hasHerb ? node.grade + '阶' : '未绑定'}</div>
        </td>`;
    }
    table += '</tr></table>';
    return table;
}

// ========================================
// 阵眼灵草选择
// ========================================
// 显示阵眼选择界面
// 让玩家选择要绑定到阵眼的灵草
function showArrayNodeSelection(nodeIndex) {
    const node = player.arrayNodes[nodeIndex];
    const nodeNames = ['虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'];
    const expectedName = nodeNames[nodeIndex];  // 该阵眼对应的灵草名称
    
    // 筛选纳戒中对应名称的灵植
    const herbs = player.bag.filter(item => item.name === expectedName);
    
    // 生成选项列表
    let options = '';
    // 显示当前绑定的灵草
    if (node.grade > 0) {
        options += `<div style="padding:8px;color:#afa;border:1px solid #666;margin:5px auto;max-width:200px;">
            当前: ${node.name} ${node.grade}阶
        </div>`;
    }
    
    // 显示可选灵草列表
    if (herbs.length === 0) {
        options += `<div style="padding:8px;color:#666;">纳戒中没有${expectedName}</div>`;
    } else {
        herbs.forEach((item) => {
            const isSelected = node.grade === item.grade;
            options += `<div onclick="bindArrayNode(${nodeIndex}, ${item.grade})" style="cursor:pointer;padding:8px;border:1px solid #${isSelected ? 'ff0' : '666'};margin:5px auto;max-width:200px;background:#${isSelected ? '444' : '333'};${isSelected ? 'color:#ff0;' : ''}">
                ${item.name} (${item.grade}阶) x${formatLawLevel(item.count)}
            </div>`;
        });
    }
    
    // 显示弹窗
    showModal(`<span style="color:#ff0;">【 ${expectedName}阵眼 】</span><br><br>
        ${options}
        <br>
        ${node.grade > 0 ? `<button onclick="unbindArrayNode(${nodeIndex})" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;margin-right:10px;">卸下</button>` : ''}
        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">关闭</button>
    `, true);
}

// ========================================
// 阵眼绑定/解绑操作
// ========================================
// 绑定阵眼（消耗纳戒物品）
// 将背包中的灵草绑定到阵眼，提升聚灵阵效果
function bindArrayNode(nodeIndex, grade) {
    const nodeNames = ['虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'];
    const expectedName = nodeNames[nodeIndex];
    
    if (player.arrayNodes[nodeIndex].grade > 0) {
        const oldGrade = player.arrayNodes[nodeIndex].grade;
        const existingItem = player.bag.find(item => item.name === expectedName && item.grade === oldGrade);
        if (existingItem) {
            existingItem.count = $addBig(existingItem.count, '1');
        } else {
            player.bag.push({ name: expectedName, grade: oldGrade, count: '1' });
        }
    }
    
    const bagItem = player.bag.find(item => item.name === expectedName && item.grade === grade);
    if (bagItem) {
        bagItem.count = $subBig(bagItem.count, '1');
        if ($lteBig(bagItem.count, '0')) {
            player.bag = player.bag.filter(item => !(item.name === expectedName && item.grade === grade));
        }
    }
    
    player.arrayNodes[nodeIndex].grade = grade;
    closeModal();
    updateEquipmentUI();
    saveGameData();
}

// 卸下阵眼物品
// 将阵眼中的灵草放回背包
function unbindArrayNode(nodeIndex) {
    const nodeNames = ['虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'];
    const expectedName = nodeNames[nodeIndex];
    const grade = player.arrayNodes[nodeIndex].grade;
    
    if (grade > 0) {
        const existingItem = player.bag.find(item => item.name === expectedName && item.grade === grade);
        if (existingItem) {
            existingItem.count = $addBig(existingItem.count, '1');
        } else {
            player.bag.push({ name: expectedName, grade: grade, count: '1' });
        }
        player.arrayNodes[nodeIndex].grade = 0;
    }
    
    closeModal();
    updateEquipmentUI();
    saveGameData();
}

// ========================================
// 灵田界面生成
// ========================================
// 生成灵田UI
// 显示3x3的灵田格子，用于种植灵药
function generateSpiritFieldUI() {
    let table = '<table style="border-collapse:collapse;border:1px solid #fff;color:#fff;font-family:monospace;text-align:center;margin:5px auto;">';
    
    // 生成3x3的灵田格子
    for (let i = 0; i < 3; i++) {
        table += '<tr>';
        for (let j = 0; j < 3; j++) {
            const slotIndex = i * 3 + j;
            const item = player.spiritField[slotIndex];
            
            if (item) {
                const progress = getHerbGrowthProgress(item);
                table += `<td onclick="showSpiritFieldItem(${slotIndex})" style="border:1px solid #666;padding:8px;cursor:pointer;width:112px;height:75px;vertical-align:top;">
                    <div style="color:#fff;font-size:15px;">${item.name.slice(0,5)}</div>
                    <div style="color:#fff;font-size:15px;">${item.grade}阶</div>
                    <div style="color:#fff;font-size:13px;">${formatHerbNumber(progress)}%</div>
                </td>`;
            } else {
                // 空格子，点击可种植
                table += `<td onclick="plantSpiritField(${slotIndex})" style="border:1px solid #333;padding:8px;cursor:pointer;width:112px;height:75px;color:#666;">
                    <div style="font-size:15px;">空</div>
                </td>`;
            }
        }
        table += '</tr>';
    }
    table += '</table>';
    return table;
}

// ========================================
// 灵田物品详情
// ========================================
// 显示灵田物品详情
// 显示灵药的阶位、成长进度、剩余时间等信息
function showSpiritFieldItem(slotIndex) {
    const item = player.spiritField[slotIndex];
    if (!item) return;
    
    const progress = getHerbGrowthProgress(item);
    const remaining = formatRemainingTime(item);
    const canUpgrade = item.grade < player.highestHerbGrade && progress >= 100;
    const upgradeTime = getHerbUpgradeTime(item.grade);
    const growth = formatHerbNumber($floor(item.growth ? String(item.growth) : '0'));
    const upgradeTimeFormatted = formatHerbNumber($floor(upgradeTime));
    
    // 计算下一阶信息
    let nextGradeInfo = '';
    if (item.grade < player.highestHerbGrade) {
        // 还未达到历史最高阶位
        if (progress >= 100) {
            nextGradeInfo = `<br><span style="color:#0f0;">即将升阶</span>`;
        } else {
            nextGradeInfo = `<br>下一阶: ${item.grade + 1}阶 (${remaining})`;
        }
    } else {
        // 已达到历史最高阶位，需要获取更高级灵药才能继续升阶
        nextGradeInfo = `<br><span style="color:#afa;">已达到当前上限 (历史最高: ${player.highestHerbGrade}阶)</span>`;
    }
    
    const upgradeButton = canUpgrade ? `<button onclick="doHerbUpgrade(${slotIndex});closeModal();" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">升阶</button>` : '';
    
    showModal(`<span onclick="closeModal()" style="cursor:pointer;color:#ff0;">【 ${item.name} 】</span><br>
        <br>等阶: ${item.grade}阶
        <br>灵田等级: ${formatLawLevel(player.spiritFieldLevel)}级
        <br>成长度: ${growth}/${upgradeTimeFormatted}
        <br>进度: ${formatHerbNumber(progress)}%
        ${nextGradeInfo}
        <br><br>
        ${upgradeButton}
        <button onclick="removeSpiritFieldItem(${slotIndex})" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">取出</button>
        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">关闭</button>
    `);
}

// ========================================
// 灵田物品取出
// ========================================
// 取出灵田物品
function removeSpiritFieldItem(slotIndex) {
    const item = player.spiritField[slotIndex];
    if (!item) return;
    
    const existingItem = player.bag.find(bagItem => bagItem.name === item.name && bagItem.grade === item.grade);
    if (existingItem) {
        existingItem.count = $addBig(existingItem.count, '1');
    } else if (player.bag.length < getBagCapacity()) {
        player.bag.push({ name: item.name, grade: item.grade, count: '1' });
    } else {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">纳戒已满！</span>
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    player.spiritField[slotIndex] = null;
    closeModal();
    updateEquipmentUI();
    updateBagUI();
}

// ========================================
// 灵药升阶
// ========================================
// 执行灵药升阶
// 当灵药成长进度达到100%时，提升阶位
function doHerbUpgrade(slotIndex) {
    const item = player.spiritField[slotIndex];
    if (!item) return;
    
    // 检查是否达到历史最高阶位
    if (item.grade >= player.highestHerbGrade) return;
    
    // 检查成长进度是否达到100%
    const progress = getHerbGrowthProgress(item);
    if (progress < 100) return;
    
    // 升阶：阶位+1，重置成长度
    const upgradeTime = getHerbUpgradeTime(item.grade);
    item.growth = $subBig(item.growth, upgradeTime);
    item.grade++;
    
    // 更新历史最高阶位记录
    if (item.grade > player.highestHerbGrade) {
        player.highestHerbGrade = item.grade;
    }
    
    closeModal();
    updateEquipmentUI();
    saveGameData();
}

// ========================================
// 灵田种植系统
// ========================================
// 种植灵田
// 显示选择界面，让玩家选择要种植的灵草
function plantSpiritField(slotIndex) {
    // 筛选纳戒中的灵草（五种仙草）
    const herbs = player.bag.filter(item => 
        ['虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'].includes(item.name)
    );
    
    if (herbs.length === 0) {
        // 没有可种植的灵草
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            没有可种植的灵草！
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    // 生成灵草选项列表
    let options = '';
    herbs.forEach((item, idx) => {
        const bagIndex = player.bag.indexOf(item);
        options += `<div onclick="doPlantSpiritField(${slotIndex}, ${bagIndex})" style="cursor:pointer;padding:5px;border:1px solid #666;margin:2px;">
            ${item.name} (${item.grade}阶) x${formatLawLevel(item.count)}
        </div>`;
    });
    
    showModal(`<span onclick="closeModal()" style="cursor:pointer;color:#ff0;">【 选择灵草种植 】</span><br>
        <br>${options}
        <br><button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">取消</button>
    `);
}

// ========================================
// 灵药成长时间计算
// ========================================
// 计算灵药升阶所需时间（毫秒）
// 公式：18小时 * 1.5^(阶位-1)
// 阶位越高，升阶所需成长度越长
// 返回秒数（不含灵田加速）
function getHerbUpgradeTime(grade) {
    const baseTime = 18 * 60 * 60; // 18小时（秒）
    return $evalBig(`${baseTime} * ${$pow(1.5, grade - 1)}`);
}

// ========================================
// 灵田灵药成长检测
// ========================================
// 每秒增加灵药成长度
function herbGrowthTick() {
    const fieldSpeedBonus = $pow('0.96', $subBig('0', String(player.spiritFieldLevel || 0)));
    const maxGrade = player.highestHerbGrade || 999999;
    let upgraded = false;

    player.spiritField.forEach((item) => {
        if (!item || item.growth === undefined || item.growth === null) return;

        item.growth = $addBig(String(item.growth), String(fieldSpeedBonus));

        if (item.grade < maxGrade) {
            const upgradeTime = getHerbUpgradeTime(item.grade);
            if ($gteBig(item.growth, upgradeTime)) {
                item.growth = $subBig(item.growth, upgradeTime);
                item.grade++;

                if (item.grade > player.highestHerbGrade) {
                    player.highestHerbGrade = item.grade;
                }
                upgraded = true;
            }
        }
    });

    if (upgraded) {
        updateEquipmentUI();
        saveGameData();
    }
}

// 检查灵田灵药成长（保留用于手动检查）
function checkSpiritFieldGrowth() {
    const maxGrade = player.highestHerbGrade || 999999;
    let upgraded = false;

    player.spiritField.forEach((item) => {
        if (!item || !item.growth) return;

        if (item.grade < maxGrade) {
            const upgradeTime = getHerbUpgradeTime(item.grade);
            if ($gteBig(item.growth, upgradeTime)) {
                item.growth = $subBig(item.growth, upgradeTime);
                item.grade++;

                if (item.grade > player.highestHerbGrade) {
                    player.highestHerbGrade = item.grade;
                }
                upgraded = true;
            }
        }
    });

    if (upgraded) {
        updateEquipmentUI();
        saveGameData();
    }
}

// ========================================
// 离线灵药成长处理
// ========================================
// 离线灵药成长处理
// 计算玩家离线期间的灵药成长（不处理升阶，等在线时再升阶）
function processOfflineHerbGrowth(playerData, offlineSeconds) {
    const fieldSpeedBonus = $pow('0.96', $subBig('0', String(playerData.spiritFieldLevel || 0)));
    
    playerData.spiritField.forEach((item) => {
        if (!item || !item.growth) return;
        item.growth = $addBig(String(item.growth), $evalBig(`${offlineSeconds} * ${fieldSpeedBonus}`));
    });
    
    return { totalUpgrades: 0, upgradedItems: [] };
}

// ========================================
// 灵药成长进度计算
// ========================================
// 计算灵药成长进度
// 返回0-100的进度百分比
function getHerbGrowthProgress(item) {
    if (!item || !item.growth) return 0;
    
    const upgradeTime = getHerbUpgradeTime(item.grade);
    return $min(100, $floor($evalBig(`${item.growth} / ${upgradeTime} * 100`)));
}

// 灵田数字格式化：大数字使用科学计数法，保留5个有效数字
function formatHerbNumber(num) {
    if (num === null || num === undefined) return '0';
    const str = String(num);
    if (str === 'NaN' || str === 'Infinity' || str === '-Infinity') return str;
    const numVal = parseFloat(str);
    if (isNaN(numVal) || !isFinite(numVal)) return str;
    if (Math.abs(numVal) >= 1e5) {
        return numVal.toExponential(5);
    }
    if (Math.abs(numVal) < 0.001 && numVal !== 0) {
        return numVal.toExponential(5);
    }
    return String(numVal);
}

// ========================================
// 剩余时间格式化
// ========================================
// 格式化剩余成长度
// 将剩余秒数转换为易读的"X时X分"格式
function formatRemainingTime(item) {
    if (!item || item.growth === undefined || item.growth === null) return '--';
    
    const maxGrade = player.highestHerbGrade || 999999;
    const fieldSpeedBonus = $pow('0.96', $subBig('0', String(player.spiritFieldLevel || 0)));
    const upgradeTime = getHerbUpgradeTime(item.grade);
    const remaining = $evalBig(`${upgradeTime} - ${item.growth}`);
    
    if ($lteBig(remaining, '0')) {
        if (item.grade >= maxGrade) {
            return '已满(不可升级)';
        }
        return '即将升阶';
    }
    
    const realRemaining = $evalBig(`${remaining} / ${fieldSpeedBonus}`);
    const hours = $floor($evalBig(`${realRemaining} / 3600`));
    const minutes = $floor($evalBig(`(${realRemaining} % 3600) / 60`));
    
    return `${formatHerbNumber(hours)}时${formatHerbNumber(minutes)}分`;
}

function doPlantSpiritField(slotIndex, bagIndex) {
    const item = player.bag[bagIndex];
    if (!item || $lteBig(item.count, '0')) return;
    
    if (item.grade > player.highestHerbGrade) {
        player.highestHerbGrade = item.grade;
    }
    
    player.spiritField[slotIndex] = { 
        name: item.name, 
        grade: item.grade,
        growth: 0
    };
    item.count = $subBig(item.count, '1');
    
    if ($lteBig(item.count, '0')) {
        player.bag.splice(bagIndex, 1);
    }
    
    closeModal();
    updateEquipmentUI();
    updateBagUI();
    saveGameData();
}

// ========================================
// 聚灵阵升级
// ========================================
// 升级聚灵阵
// 消耗天材地宝提升聚灵阵等级，增加灵压
function upgradeGatheringArray() {
    const levelStr = String(player.gatheringArrayLevel);
    let cost;
    if ($gteBig(levelStr, '1e100')) {
        cost = $evalBig(`${levelStr} * 100`);
    } else {
        cost = $evalBig(`floor(100 * 1.25^${levelStr})`);
    }
    
    if (!$gteBig(player.treasure, cost)) return;
    
    player.treasure = $subBig(player.treasure, cost);
    player.gatheringArrayLevel++;
    updateEquipmentUI();
    updateStatusUI();
}

// ========================================
// 灵脉投入系统
// ========================================
// 投入灵石到灵脉
// 将灵石转化为灵脉，产出环境灵气
function depositStone() {
    showInputModal('<span style="color:#0ff;">【 投入灵石 】</span>', formatNumber(player.spiritStone), (value) => {
        if (!value || !value.trim()) return;
        let depositStr = value.trim();
        
        if (!$gteBig(player.spiritStone, depositStr)) {
            depositStr = player.spiritStone;
        }
        
        if (!$gteBig(depositStr, '0')) {
            showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
                <span style="color:#f66;">灵石不足！</span>
                <br><br>
                <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
            `, true);
            return;
        }
        
        player.spiritStone = $subBig(player.spiritStone, depositStr);
        player.veinStone = $addBig(player.veinStone, depositStr);
        updateEquipmentUI();
        updateStatusUI();
    });
}

// 投入仙石到灵脉
function depositImmortalVein() {
    showInputModal('<span style="color:#ff0;">【 投入仙石 】</span>', formatNumber(player.immortalStone), (value) => {
        if (!value || !value.trim()) return;
        let depositStr = value.trim();
        
        if (!$gteBig(player.immortalStone, depositStr)) {
            depositStr = player.immortalStone;
        }
        
        if (!$gteBig(depositStr, '0')) {
            showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
                <span style="color:#f66;">仙石不足！</span>
                <br><br>
                <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
            `, true);
            return;
        }
        
        player.immortalStone = $subBig(player.immortalStone, depositStr);
        player.immortalVeinStone = $addBig(player.immortalVeinStone, depositStr);
        updateEquipmentUI();
        updateStatusUI();
    });
}

function updateLawUI() {
    const skillContent = document.querySelector('#skill-content');
    if (!skillContent) return;
    
    let html = `
        <div class="text-line">【 法则领悟 】</div>
        <div class="text-line">法则碎片: ${formatNumber(player.lawFragments)}</div>
    `;
    
    for (let key in laws) {
        const law = laws[key];
        const awareness = String(player.laws[key] || 0);
        const level = awareness;
        const nextCost = getLawFragmentCost(level);
        
        const awarenessNum = Number(awareness);
        const filledBlocks = awarenessNum < 1e15 ? $max(0, $min(10, $floor(awarenessNum / 10))) : 10;
        const progressBar = '█'.repeat(filledBlocks) + '░'.repeat(10 - filledBlocks);
        
        html += `
        <div class="text-line">${box.top}</div>
        <div class="text-line">${box.line} ${law.name}: ${formatLawLevel(awareness)}% ${law.desc} <button onclick="upgradeLaw('${key}')" style="background: #333; color: #fff; border: 1px solid #666; padding: 1px 4px; cursor: pointer;">领悟(消耗${formatLawLevel(nextCost)})</button> ${box.line}</div>
        <div class="text-line">${box.bottom}</div>
        `;
    }
    
    skillContent.innerHTML = html;
}

// ========================================
// 怪物技能配置
// ========================================
// 怪物技能配置
// 定义怪物可能拥有的特殊技能
const monsterSkills = {
    // 有两下子：下一次被攻击不致死
    youLiangXiaZi: {
        name: '有两下子',
        desc: '下一次被攻击不致死，怪物每次行动概率触发',
        // 触发概率随等级增加：1 - 0.9^log10(等级)
        getTriggerChance: (level) => 1 - $pow(0.9, $log10(level))
    },
    // 回光返照：受到伤害转为恢复
    huiGuangFanZhao: {
        name: '回光返照',
        desc: '触发后下一秒内受到的伤害逆转为血量恢复，血量低于30%时概率触发，每场战斗最多触发一次',
        getTriggerChance: (level) => 1 - $pow(0.9, $log10(level))
    },
    // 殊死一搏：临死前爆发
    shuSiYiBo: {
        name: '殊死一搏',
        desc: '血量低于20%时攻击触发，额外伤害+(剩余血量)*40%，然后自己受到同样伤害',
        getTriggerChance: () => 1  // 100%触发
    }
};

// ========================================
// 战斗状态管理
// ========================================
// 当前战斗状态
// 存储战斗中的所有临时数据
let battleState = {
    inBattle: false,              // 是否正在战斗中
    battleEnding: false,          // 战斗是否即将结束
    paused: false,                // 是否暂停
    currentMap: 1,                // 当前地图
    currentMonster: null,         // 当前怪物名称
    monsterHp: 0,                 // 怪物当前生命值
    monsterMaxHp: 0,              // 怪物最大生命值
    battleLog: [],                // 战斗日志
    attackScheduler: null,        // 攻击调度器
    playerNextAttackTime: 0,      // 玩家下次攻击时间
    monsterNextAttackTime: 0,     // 怪物下次攻击时间
    originalMaxHp: null,          // 原始最大生命值（青木真身加成前）
    lastActionTime: 0,            // 上次行动时间
    monsterSkills: [],            // 怪物拥有的技能列表
    monsterSkillStates: {         // 怪物技能状态
        youLiangXiaZiActive: false,      // 有两下子是否激活
        huiGuangFanZhaoUsed: false,      // 回光返照是否已使用
        huiGuangFanZhaoActive: false,    // 回光返照是否激活中
        huiGuangFanZhaoEndTime: 0,       // 回光返照结束时间
        shuSiYiBoUsed: false             // 殊死一搏是否已使用
    },
    lastBattleMonster: null,      // 上一场战斗的怪物信息（战斗结束后保留显示）
    lastBattlePlayerHp: null,     // 战斗结束时的玩家血量
    lastBattlePlayerMaxHp: null,  // 战斗结束时的玩家最大血量
    lastBattleMonsterHp: null      // 战斗结束时的怪物血量
};

// ========================================
// 战斗系统初始化
// ========================================
// 初始化战斗系统
// 设置标签页切换和自动战斗
function initBattleSystem() {
    // 绑定标签页切换事件
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            // 切换标签页激活状态
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('tab-' + targetId).classList.add('active');
            
            // 根据切换的标签页更新对应界面
            if (targetId === 'battle') {
                updateBattleUI();        // 战斗界面
            }
            if (targetId === 'cultivate') {
                updateCultivationUI();   // 修炼界面
            }
            if (targetId === 'skill') {
                updateLawUI();           // 法则界面
            }
            if (targetId === 'treasure') {
                updateWeaponUI();        // 法宝界面
            }
            if (targetId === 'equipment') {
                updateEquipmentUI();     // 洞府界面
            }
            if (targetId === 'bag') {
                updateBagUI();           // 纳戒界面
            }
            if (targetId === 'alchemy') {
                updateAlchemyUI();       // 炼丹界面
            }
            if (targetId === 'void') {
                updateVoidUI();          // 虚空界面
            }
        });
    });
    
    // 自动探索定时器：每秒检查是否需要开始新战斗
    setInterval(() => {
        if (!battleState.inBattle && !battleState.battleEnding) {
            startBattle();
        }
    }, 1000);
}

// ========================================
// 战斗开始
// ========================================
// 开始战斗
// 初始化战斗状态，生成怪物，开始战斗循环
function startBattle() {
    // 如果正在战斗中，不开始新战斗
    if (battleState.inBattle) return;
    
    // 清除之前的战斗循环
    if (battleState.attackScheduler) {
        clearTimeout(battleState.attackScheduler);
        battleState.attackScheduler = null;
    }
    
    // 重置玩家生命值
    player.hp = player.maxHp;
    
    // ========================================
    // 青木真身神通：战斗前临时生命加成
    // ========================================
    // 青木真身：战斗前一次性生命加成（临时）- 攻击力×10×等级
    const zhenshenLevel = player.divineAbilities.qingmuZhenshen.level;
    if (zhenshenLevel > 0) {
        const bonusHp = $evalBig(`${player.attack} * 10 * ${zhenshenLevel}`);
        battleState.originalMaxHp = player.maxHp;  // 保存原始maxHp
        player.hp = $addBig(String(player.hp), String(bonusHp));           // 增加当前生命
        player.maxHp = $addBig(String(player.maxHp), String(bonusHp));     // 增加最大生命
    } else {
        battleState.originalMaxHp = null;
    }
    
    // ========================================
    // 木瘴蚀甲神通：降低敌方防御效果
    // ========================================
    // 预计算木瘴蚀甲减伤削弱系数
    const qingmuLevel = player.divineAbilities.qingmuRoumai.level;
    battleState.muzhangReduction = qingmuLevel > 0 ? $pow(0.9, qingmuLevel) : 1;
    
    // 随机选择当前地图的一个怪物
    let monsterName;
    let monsterLevel;
    
    if (battleState.currentMap === 101) {
        const depth = player.voidDepth || 0;
        const depthIndex = Math.min(Math.floor(depth / 10), 3);
        const voidMonsterList = voidMonsters[depthIndex];
        if (!voidMonsterList || voidMonsterList.length === 0) {
            console.error('无效的虚空怪物数据:', depthIndex);
            return;
        }
        monsterName = voidMonsterList[Math.floor(Math.random() * voidMonsterList.length)];
        monsterLevel = 500 + depth;
    } else {
        const mapIndex = battleState.currentMap - 1;
        const mapMonsters = monsterData[mapIndex];
        if (!mapMonsters || mapMonsters.length === 0) {
            console.error('无效的地图数据:', battleState.currentMap, '，mapIndex:', mapIndex);
            if (!monsterData[0] || monsterData[0].length === 0) {
                console.error('连默认地图1也没有怪物数据!');
                battleState.inBattle = false;
                return;
            }
            battleState.currentMap = 1;
            player.currentMap = 1;
            const fallbackMonsters = monsterData[0];
            const monsterIndex = Math.floor(Math.random() * fallbackMonsters.length);
            monsterName = fallbackMonsters[monsterIndex];
            monsterLevel = monsterIndex + 1;
        } else {
            const monsterIndex = Math.floor(Math.random() * mapMonsters.length);
            monsterName = mapMonsters[monsterIndex];
            monsterLevel = (battleState.currentMap - 1) * 5 + monsterIndex + 1;
        }
    }
    
    // 基础属性（每项随机波动30%）
    const randomFluctuation = () => $evalBig(`0.7 + ${Math.random()} * 0.6`);
    
    const fluctuation = randomFluctuation();
    
    const baseHp = $floor($evalBig(`100 * ${$pow(1.16, monsterLevel - 1)} * ${fluctuation}`));
    const baseAtk = $floor($evalBig(`6 * ${$pow(1.147, monsterLevel - 1)} * ${fluctuation}`));
    const baseDef = $floor($evalBig(`3 * ${$pow(1.16, monsterLevel - 1)} * ${fluctuation}`));
    const baseSpeed = $evalBig(`10 * ${$pow(1.004, monsterLevel - 1)} * ${fluctuation}`);
    
    battleState.currentMonster = monsterName;
    battleState.monsterLevel = monsterLevel;
    battleState.monsterMaxHp = baseHp;
    battleState.monsterHp = battleState.monsterMaxHp;
    battleState.monsterAtk = baseAtk;
    battleState.monsterDef = baseDef;
    battleState.monsterCritRate = '0.05';
    battleState.monsterCritDmg = '2.0';
    battleState.monsterSpeed = Math.min(Number(baseSpeed), 100);
    
    battleState.inBattle = true;
    battleState.paused = false;
    
    // 清除上一场战斗的显示信息
    battleState.lastBattleMonster = null;
    battleState.lastBattlePlayerHp = null;
    battleState.lastBattlePlayerMaxHp = null;
    battleState.lastBattleMonsterHp = null;
    
    battleState.monsterSkills = [];
    battleState.monsterSkillStates = {
        youLiangXiaZiActive: false,
        huiGuangFanZhaoUsed: false,
        huiGuangFanZhaoActive: false,
        huiGuangFanZhaoEndTime: 0,
        shuSiYiBoUsed: false
    };
    
    const skillKeys = Object.keys(monsterSkills);
    const numSkills = 2 + $floor(Math.random() * 2);
    const shuffledSkills = skillKeys.sort(() => Math.random() - 0.5);
    for (let i = 0; i < numSkills; i++) {
        battleState.monsterSkills.push(shuffledSkills[i]);
    }
    
    addBattleLog(`[探索] 你遇到了一只 ${monsterName} (Lv.${Math.floor(monsterLevel)})`);
    
    // 青木真身日志
    if (zhenshenLevel > 0) {
        const zhenshenBonus = $evalBig(`${player.attack} * 10 * ${zhenshenLevel}`);
        addBattleLog(`[神通] 青木真身额外生命+${formatLawLevel(zhenshenBonus)}`);
    }
    
    // 更新战斗界面
    updateBattleUI();
    
    // 预计算整个战斗过程
    simulateBattle();
}

// 预计算战斗过程（支持诸天唯一神通）
function simulateBattle() {
    const zhutianLevel = player.divineAbilities.zhutianWeiyi.level;
    
    if (zhutianLevel > 0) {
        // 诸天唯一：模拟等级数量的战斗，选择胜利且用时最短的一次
        const simulations = [];
        for (let i = 0; i < zhutianLevel; i++) {
            const randomArray = Array.from({length: 1000}, () => Math.random());
            const result = simulateSingleBattle(randomArray);
            result.duration = result.actions.length;
            simulations.push(result);
        }
        
        // 选择胜利且用时最短的结果
        const winningSimulations = simulations.filter(s => s.playerWon);
        if (winningSimulations.length > 0) {
            winningSimulations.sort((a, b) => a.duration - b.duration);
            const bestResult = winningSimulations[0];
            battleState.battleActions = bestResult.actions;
            battleState.actionIndex = 0;
            battleState.isTimeout = false;
            addBattleLog(`[神通] 长生久视锚定胜利结果(${bestResult.duration}回合)`);
        } else {
            // 如果都输了，选择回合数最少的一次
            simulations.sort((a, b) => a.duration - b.duration);
            const lastSim = simulations[0];
            battleState.battleActions = lastSim.actions;
            battleState.actionIndex = 0;
            battleState.isTimeout = lastSim.timeout || false;
        }
    } else {
        // 正常模拟
        const result = simulateSingleBattle();
        battleState.battleActions = result.actions;
        battleState.actionIndex = 0;
        battleState.isTimeout = result.timeout || false;
    }
    
    // 开始播放战斗
    playNextAction();
}

// 模拟单次战斗（接受随机数数组参数）
function simulateSingleBattle(randomArray) {
    const actions = [];
    let currentPlayerHp = player.hp;
    let currentMonsterHp = battleState.monsterMaxHp;
    
    const playerAttacksPerSecond = $max(0.1, $pow(player.speed, '0.2222222222222222') - 0.668);
    const monsterAttacksPerSecond = $max(0.1, $pow(battleState.monsterSpeed, '0.2222222222222222') - 0.668);
    const playerInterval = 1000 / playerAttacksPerSecond;
    const monsterInterval = 1000 / monsterAttacksPerSecond;
    
    let playerNextAttack = 0;
    let monsterNextAttack = 0;
    let randomIndex = 0;
    
    const getNextRandom = () => {
        if (randomArray && randomIndex < randomArray.length) {
            return randomArray[randomIndex++];
        }
        return Math.random();
    };
    
    const monsterLevel = battleState.monsterLevel;
    const hasSkill = (skillKey) => battleState.monsterSkills.includes(skillKey);
    
    let simYouLiangXiaZiActive = false;
    let simHuiGuangFanZhaoUsed = false;
    let simHuiGuangFanZhaoActive = false;
    let simHuiGuangFanZhaoEndTime = 0;
    let simShuSiYiBoUsed = false;
    
    const maxBattleTime = 30000;
    
    while ($gtBig(currentPlayerHp, 0) && $gtBig(currentMonsterHp, 0)) {
        const currentTime = $min(playerNextAttack, monsterNextAttack);
        if ($gtBig(currentTime, maxBattleTime)) {
            actions.push({
                type: 'timeout',
                time: maxBattleTime
            });
            return { actions, playerWon: false, timeout: true };
        }
        
        if (simHuiGuangFanZhaoActive && currentTime > simHuiGuangFanZhaoEndTime) {
            simHuiGuangFanZhaoActive = false;
        }
        
        if (playerNextAttack <= monsterNextAttack) {
            let baseReduction = $pow(0.98, $log10($addBig(battleState.monsterDef, '1')));
            let actualReduction = baseReduction * battleState.muzhangReduction;
            let pDamage = $max(1, $floor($evalBig(`${player.attack} * ${actualReduction}`)));
            
            let pCrit = getNextRandom() * 100 < player.criticalRate;
            if (pCrit) pDamage = $floor($evalBig(`${pDamage} * ${player.criticalDamage}`));
            
            const cuiyeLevel = player.divineAbilities.cuiyeYuqi.level;
            const hunyuanLevel = player.divineAbilities.hunyuanGuiyi.level;
            let cuiyeDamage = 0;
            let hunyuanDamage = 0;
            if (cuiyeLevel > 0) {
                cuiyeDamage = $floor($evalBig(`${pDamage} * 0.1 * ${cuiyeLevel}`));
            }
            if (hunyuanLevel > 0) {
                hunyuanDamage = $floor($evalBig(`${player.hp} * 0.1 * ${hunyuanLevel}`));
            }
            const totalDamage = $addBig($addBig(pDamage, cuiyeDamage), hunyuanDamage);
            
            let youLiangXiaZiTriggered = false;
            let huiGuangFanZhaoTriggered = false;
            let huiGuangFanZhaoHeal = 0;
            
            if (hasSkill('youLiangXiaZi') && simYouLiangXiaZiActive) {
                const hpAfterDamage = $subBig(currentMonsterHp, totalDamage);
                if ($lteBig(hpAfterDamage, 0)) {
                    pDamage = $subBig(currentMonsterHp, '1');
                    youLiangXiaZiTriggered = true;
                    simYouLiangXiaZiActive = false;
                }
            }
            
            if (hasSkill('huiGuangFanZhao') && simHuiGuangFanZhaoActive) {
                huiGuangFanZhaoHeal = totalDamage;
                pDamage = 0;
                cuiyeDamage = 0;
                hunyuanDamage = 0;
            }
            
            if (hasSkill('huiGuangFanZhao') && !simHuiGuangFanZhaoUsed && !simHuiGuangFanZhaoActive) {
                const hpPercent = currentMonsterHp / battleState.monsterMaxHp;
                if (hpPercent < 0.3) {
                    const triggerChance = monsterSkills.huiGuangFanZhao.getTriggerChance(monsterLevel);
                    if (getNextRandom() < triggerChance) {
                        simHuiGuangFanZhaoUsed = true;
                        simHuiGuangFanZhaoActive = true;
                        simHuiGuangFanZhaoEndTime = playerNextAttack + 1000;
                        huiGuangFanZhaoTriggered = true;
                    }
                }
            }
            
            actions.push({
                type: 'player',
                damage: pDamage,
                crit: pCrit,
                time: playerNextAttack,
                youLiangXiaZiTriggered,
                huiGuangFanZhaoTriggered,
                huiGuangFanZhaoHeal,
                cuiyeDamage,
                hunyuanDamage
            });
            
            // 计算最终伤害并扣除怪物生命值
            const finalDamage = $addBig($addBig(pDamage, cuiyeDamage), hunyuanDamage);
            if ($gtBig(finalDamage, 0)) {
                currentMonsterHp = $subBig(currentMonsterHp, finalDamage);
            }
            // 回光返照恢复效果
            if ($gtBig(huiGuangFanZhaoHeal, 0)) {
                currentMonsterHp = $min(battleState.monsterMaxHp, $addBig(currentMonsterHp, huiGuangFanZhaoHeal));
            }
            playerNextAttack += playerInterval;  // 更新玩家下次攻击时间
        } else {
            // ========================================
            // 怪物攻击逻辑
            // ========================================
            // 计算怪物伤害（受玩家防御减免）
            let mDamage = $max(1, $floor($evalBig(`${battleState.monsterAtk} * ${$pow(0.98, $log10($addBig(String(player.defense), '1')))}`)));
            let mCrit = getNextRandom() < battleState.monsterCritRate;  // 暴击判定
            if (mCrit) mDamage = $floor($evalBig(`${mDamage} * ${battleState.monsterCritDmg}`));  // 暴击伤害加成
            
            let shuSiYiBoTriggered = false;      // 殊死一搏是否触发
            let shuSiYiBoSelfDamage = 0;         // 殊死一搏自身伤害
            let rawBonusDamage = 0;              // 殊死一搏原始伤害（用于显示）
            
            // 有两下子技能触发判定
            if (hasSkill('youLiangXiaZi') && !simYouLiangXiaZiActive) {
                const triggerChance = monsterSkills.youLiangXiaZi.getTriggerChance(monsterLevel);
                if (getNextRandom() < triggerChance) {
                    simYouLiangXiaZiActive = true;  // 激活有两下子
                    actions.push({
                        type: 'monsterSkill',
                        skillKey: 'youLiangXiaZi',
                        time: monsterNextAttack
                    });
                }
            }
            
            // 殊死一搏技能触发判定（血量低于20%时）
            if (hasSkill('shuSiYiBo')) {
                const hpPercent = currentMonsterHp / battleState.monsterMaxHp;
                if (hpPercent < 0.2) {
                    // 计算殊死一搏额外伤害（使用高精度计算）
                    rawBonusDamage = $max(0, $floor($evalBig(`${currentMonsterHp} * 0.4`)));
                    const defenseLog = $log10($addBig(String(player.defense), '1'));
                    const reductionFactor = $pow(0.98, defenseLog);
                    const bonusDamageAfterReduction = $max(1, $floor($evalBig(`${rawBonusDamage} * ${reductionFactor}`)));
                    mDamage = bonusDamageAfterReduction;  // 只造成额外伤害
                    shuSiYiBoSelfDamage = rawBonusDamage;  // 自身受到同等伤害
                    shuSiYiBoTriggered = true;
                }
            }
            
            // 回光返照与殊死一搏的交互
            let shuSiYiBoHealByHuiGuang = 0;
            if (shuSiYiBoSelfDamage > 0 && simHuiGuangFanZhaoActive) {
                // 回光返照激活时，殊死一搏自伤转为恢复
                shuSiYiBoHealByHuiGuang = shuSiYiBoSelfDamage;
                shuSiYiBoSelfDamage = 0;
            }
            
            // 殊死一搏时显示调试信息
            // if (shuSiYiBoTriggered) {
            //     const playerHpBeforeDamage = String(currentPlayerHp);
            //     const monsterHpBeforeAttack = String(currentMonsterHp);
            //     const rawDamage = String(rawBonusDamage);
            //     const totalDamage = String(mDamage);
            //     const reduction = String($subBig(rawDamage, totalDamage));
            //     const playerRemainingHp = String($subBig(playerHpBeforeDamage, totalDamage));
            //     alert(`【殊死一搏触发】
            // 玩家当前血量: ${playerHpBeforeDamage}
            // 怪物当前血量: ${monsterHpBeforeAttack}
            // 额外伤害(减伤前): ${rawDamage}
            // 减伤金额: ${reduction}
            // 受到总伤害: ${totalDamage}
            // 怪物自身伤害: ${String(shuSiYiBoSelfDamage)}
            // 玩家剩余血量: ${playerRemainingHp}`);
            // }
            
            // 记录怪物攻击动作
            actions.push({
                type: 'monster',
                damage: mDamage,
                crit: mCrit,
                time: monsterNextAttack,
                shuSiYiBoTriggered,
                shuSiYiBoSelfDamage,
                shuSiYiBoHealByHuiGuang
            });
            
            // 扣除玩家生命值
            currentPlayerHp = $subBig(currentPlayerHp, mDamage);
            // 殊死一搏自身伤害
            if ($gtBig(shuSiYiBoSelfDamage, 0)) {
                currentMonsterHp = $subBig(currentMonsterHp, shuSiYiBoSelfDamage);
            }
            // 回光返照恢复效果
            if ($gtBig(shuSiYiBoHealByHuiGuang, 0)) {
                currentMonsterHp = $min(battleState.monsterMaxHp, $addBig(currentMonsterHp, shuSiYiBoHealByHuiGuang));
            }
            monsterNextAttack += monsterInterval;  // 更新怪物下次攻击时间
        }
    }
    
    // ========================================
    // 战斗结束判定
    // ========================================
    const playerWon = $lteBig(currentMonsterHp, 0) && $gtBig(currentPlayerHp, 0);
    actions.push({
        type: 'end',
        playerWon: playerWon,
        time: $max(playerNextAttack, monsterNextAttack)
    });
    
    return { actions, playerWon };
}

// ========================================
// 战斗动作播放
// ========================================
// 播放下一个动作
// 根据预计算的战斗结果，逐帧播放战斗过程
function playNextAction() {
    if (!battleState.inBattle || !battleState.battleActions || battleState.paused) return;
    
    battleState.lastActionTime = Date.now();
    
    const action = battleState.battleActions[battleState.actionIndex];
    if (!action) return;
    
    // 战斗结束
    if (action.type === 'end') {
        endBattle(action.playerWon);
        return;
    }
    
    // 战斗超时（30秒未分胜负）
    if (action.type === 'timeout') {
        addBattleLog(`[战斗] 与妖兽缠斗三十息，青木长生经生生不息护持周身，彼此攻势尽数相抵，始终难分胜负，只得暂歇收手`);
        endBattle(false, true);
        return;
    }
    
    // 怪物技能触发
    if (action.type === 'monsterSkill') {
        const skill = monsterSkills[action.skillKey];
        if (action.skillKey === 'youLiangXiaZi') {
            battleState.monsterSkillStates.youLiangXiaZiActive = true;
            addBattleLog(`[怪物技能] ${battleState.currentMonster}发动【${skill.name}】，进入防御姿态！`);
        }
        battleState.actionIndex++;
        const nextAction = battleState.battleActions[battleState.actionIndex];
        if (nextAction) {
            const delay = $max(10, nextAction.time - action.time);
            battleState.attackScheduler = setTimeout(playNextAction, delay);
        }
        return;
    }
    
    // ========================================
    // 玩家攻击处理
    // ========================================
    if (action.type === 'player') {
        // 回光返照触发
        if (action.huiGuangFanZhaoTriggered) {
            addBattleLog(`[怪物技能] ${battleState.currentMonster}发动【回光返照】，下一秒内受到的伤害将逆转为恢复！`);
            battleState.monsterSkillStates.huiGuangFanZhaoActive = true;
            battleState.monsterSkillStates.huiGuangFanZhaoUsed = true;
        }
        
        // 回光返照恢复效果
        if (battleState.monsterSkillStates.huiGuangFanZhaoActive && $gtBig(action.huiGuangFanZhaoHeal, 0)) {
            battleState.monsterHp = $min(battleState.monsterMaxHp, $addBig(battleState.monsterHp, action.huiGuangFanZhaoHeal));
            addBattleLog(`[怪物技能] 【回光返照】效果触发，${battleState.currentMonster}恢复${formatLawLevel(action.huiGuangFanZhaoHeal)}点生命！`);
        } else if ($gtBig(action.damage, 0) || $gtBig(action.cuiyeDamage || 0, 0) || $gtBig(action.hunyuanDamage || 0, 0)) {
            // 正常伤害计算
            const totalDamage = $addBig($addBig(action.damage, action.cuiyeDamage || 0), action.hunyuanDamage || 0);
            battleState.monsterHp = $max(0, $subBig(battleState.monsterHp, totalDamage));
        }
        
        // 获取伤害数值
        const baseDamage = action.damage;
        const cuiyeDamage = action.cuiyeDamage || 0;
        const hunyuanDamage = action.hunyuanDamage || 0;
        
        const monster = battleState.currentMonster || '神秘生物';
        let logText;
        
        // 有两下子触发：致命一击被躲避
        if (action.youLiangXiaZiTriggered) {
            battleState.monsterSkillStates.youLiangXiaZiActive = false;
            addBattleLog(`[怪物技能] 【有两下子】效果触发，${monster}险险避过致命一击，仅剩1点生命！`);
        } else if ($gtBig(action.damage, 0) || $gtBig(baseDamage, 0)) {
            // 生成战斗日志（暴击或普通攻击）
            if (action.crit) {
                const critDescs = [
                    `以木元催动普攻，暴击${monster}，爆出${formatNumber(baseDamage)}点暴击伤害`,
                    `引先天木息灌注攻击，暴击${monster}，打出${formatLawLevel(baseDamage)}点暴击伤害`
                ];
                logText = `[战斗] ${critDescs[Math.floor(Math.random() * critDescs.length)]}`;
            } else {
                const normalDescs = [
                    `你挥出木气一击狠狠砸在${monster}身上，打出${formatLawLevel(baseDamage)}点伤害`,
                    `凝木为刃劈向${monster}，精准破开躯体，造成${formatLawLevel(baseDamage)}点伤害`,
                    `抬手凝出青木劲气拍向${monster}，造成${formatLawLevel(baseDamage)}点伤害`
                ];
                logText = `[战斗] ${normalDescs[Math.floor(Math.random() * normalDescs.length)]}`;
            }
            // 翠叶御气神通额外伤害
            if ($gtBig(cuiyeDamage, 0)) {
                logText += `，施展翠叶御气额外造成${formatLawLevel(cuiyeDamage)}点伤害`;
            }
            // 混元归一神通额外伤害
            if ($gtBig(hunyuanDamage, 0)) {
                logText += `，施展混元归一额外造成${formatLawLevel(hunyuanDamage)}点伤害`;
            }
            logText += `。`;
            addBattleLog(logText);
        }
    } else if (action.type === 'monster') {
        // ========================================
        // 怪物攻击处理
        // ========================================
        player.hp = $max(0, $subBig(player.hp, action.damage));  // 扣除玩家生命值
        
        // 殊死一搏触发
        if (action.shuSiYiBoTriggered) {
            if ($gtBig(action.shuSiYiBoHealByHuiGuang, 0)) {
                // 回光返照与殊死一搏交互：自伤转为恢复
                battleState.monsterHp = $min(battleState.monsterMaxHp, $addBig(battleState.monsterHp, action.shuSiYiBoHealByHuiGuang));
                addBattleLog(`[怪物技能] ${battleState.currentMonster}发动【殊死一搏】，伤害+${formatLawLevel(action.shuSiYiBoHealByHuiGuang)}，【回光返照】逆转自伤为恢复${formatLawLevel(action.shuSiYiBoHealByHuiGuang)}点生命！`);
            } else {
                // 正常殊死一搏：增加伤害但自身受伤
                battleState.monsterHp = $max(0, $subBig(battleState.monsterHp, action.shuSiYiBoSelfDamage));
                addBattleLog(`[怪物技能] ${battleState.currentMonster}发动【殊死一搏】，伤害+${formatLawLevel(action.shuSiYiBoSelfDamage)}，自身也受到${formatLawLevel(action.shuSiYiBoSelfDamage)}点伤害！`);
            }
        }
        
        // 生成怪物攻击日志
        const monster = battleState.currentMonster || '神秘生物';
        if (action.crit) {
            // 暴击攻击日志
            const critDescs = [
                `${monster}暴起发难，一记狠招直取要害，对你造成${formatLawLevel(action.damage)}点暴击伤害！`,
                `${monster}眼中凶光毕露，全力一击轰在你身上，冒出${formatLawLevel(action.damage)}点暴击伤害！`,
                `${monster}抓住破绽，以雷霆之势猛攻，打出${formatLawLevel(action.damage)}点暴击伤害！`,
                `${monster}怒吼一声，招式凌厉无比，对你造成${formatLawLevel(action.damage)}点暴击伤害！`,
                `${monster}蓄势待发，骤然暴起，一击命中要害，造成${formatLawLevel(action.damage)}点暴击伤害！`
            ];
            addBattleLog(`[战斗] ${critDescs[Math.floor(Math.random() * critDescs.length)]}`);
        } else if (action.damage > 0) {
            // 普通攻击日志
            const normalDescs = [
                `${monster}张牙舞爪向你扑来，造成${formatLawLevel(action.damage)}点伤害。`,
                `${monster}挥动利爪划过你的身体，造成${formatLawLevel(action.damage)}点伤害。`,
                `${monster}猛然发动攻击，你躲闪不及，受到${formatLawLevel(action.damage)}点伤害。`,
                `${monster}发出一声嘶吼，朝你发起猛攻，造成${formatLawLevel(action.damage)}点伤害。`,
                `${monster}趁机偷袭，一击得手，对你造成${formatLawLevel(action.damage)}点伤害。`,
                `${monster}步步紧逼，招招致命，你受到${formatLawLevel(action.damage)}点伤害。`,
                `${monster}身形一闪，从侧面发起攻击，造成${formatLawLevel(action.damage)}点伤害。`,
                `${monster}蓄力一击，正中你的身躯，造成${formatLawLevel(action.damage)}点伤害。`,
                `${monster}凶性大发，疯狂攻击，你受到${formatLawLevel(action.damage)}点伤害。`,
                `${monster}瞅准时机，一记快攻，对你造成${formatLawLevel(action.damage)}点伤害。`
            ];
            addBattleLog(`[战斗] ${normalDescs[Math.floor(Math.random() * normalDescs.length)]}`);
        }
    }
    
    updateBattleUI();  // 更新战斗界面
    
    battleState.actionIndex++;  // 移动到下一个动作
    const nextAction = battleState.battleActions[battleState.actionIndex];
    
    // 如果还有下一个动作，设置定时器播放
    if (nextAction) {
        const delay = $max(10, nextAction.time - action.time);
        battleState.attackScheduler = setTimeout(playNextAction, delay);
    }
}

// ========================================
// 战斗暂停/继续
// ========================================
// 暂停/继续战斗
// 切换战斗暂停状态
function togglePauseBattle() {
    if (!battleState.inBattle) return;
    
    battleState.paused = !battleState.paused;  // 切换暂停状态
    
    if (battleState.paused) {
        // 暂停：清除攻击调度器
        if (battleState.attackScheduler) {
            clearTimeout(battleState.attackScheduler);
            battleState.attackScheduler = null;
        }
        addBattleLog('[系统] 战斗已暂停');
    } else {
        // 继续：从下一个动作开始播放
        addBattleLog('[系统] 战斗继续');
        playNextAction();
    }
    
    updateBattleUI();
}

// ========================================
// 战斗结束处理
// ========================================
// 结束战斗
// 处理战斗结束后的奖励、状态恢复等
function endBattle(playerWon, isTimeout = false) {
    if (!battleState.inBattle) return;
    
    // ========================================
    // 记录战斗历史（用于离线结算）
    // ========================================
    const battleDuration = battleState.battleActions && battleState.battleActions.length > 0
        ? battleState.battleActions[battleState.battleActions.length - 1].time / 1000
        : 1;
    
    // 记录所有战斗（胜利和失败都记录），用于离线结算模拟
    if (!isTimeout) {
        player.battleHistory.push({
            level: battleState.monsterLevel,
            duration: $max(1, battleDuration),
            win: playerWon,
            kills: playerWon ? (battleState.monsters ? battleState.monsters.length : 1) : 0,
            timestamp: Date.now()
        });
        // 只保留最近10场战斗
        if (player.battleHistory.length > 10) {
            player.battleHistory.shift();
        }
    }
    
    // 重置战斗状态
    battleState.inBattle = false;
    battleState.battleEnding = true;
    battleState.battleActions = null;
    battleState.actionIndex = 0;
    
    // 保存上一场战斗的信息用于显示
    battleState.lastBattleMonster = battleState.currentMonster;
    battleState.lastBattlePlayerHp = player.hp;
    battleState.lastBattlePlayerMaxHp = player.maxHp;
    battleState.lastBattleMonsterHp = battleState.monsterHp;
    
    // 清除攻击调度器
    if (battleState.attackScheduler) {
        clearTimeout(battleState.attackScheduler);
        battleState.attackScheduler = null;
    }
    
    // ========================================
    // 超时处理
    // ========================================
    // 超时情况：不给予奖励，直接结束
    if (isTimeout) {
        addBattleLog(`[战斗] 与${battleState.currentMonster}缠斗三十息，青木长生经生生不息护持周身，彼此攻势尽数相抵，始终难分胜负，只得暂歇收手`);
        
        // 恢复青木真身的临时生命
        if (battleState.originalMaxHp) {
            player.maxHp = battleState.originalMaxHp;
            player.hp = $min(player.hp, player.maxHp);
            battleState.originalMaxHp = null;
        }
        
        // 虚空模式：平手后深入-1
        if (battleState.currentMap === 101 && player.voidAutoBattle) {
            if (player.voidDepth > 0) {
                player.voidDepth--;
                addBattleLog(`[系统] 虚空深入-1，当前: ${player.voidDepth}`);
            }
        }
        
        updateBattleUI();
        updateStatusUI();
        saveGameData();
        // 延迟重置战斗结束状态，防止自动探索立即开始新战斗
        setTimeout(() => {
            battleState.battleEnding = false;
        }, 500);
        return;
    }
    
    // ========================================
    // 战斗胜利处理
    // ========================================
    if (playerWon) {
        addBattleLog(`[战斗] 你击败了 ${battleState.currentMonster}！`);
        
        // 检查当前地图是否未解锁，胜利则解锁
        const currentMapNum = battleState.currentMap;
        if (!player.unlockedMaps.includes(currentMapNum)) {
            player.unlockedMaps.push(currentMapNum);
            player.unlockedMaps.sort((a, b) => a - b);
            addBattleLog(`[系统] 地图${currentMapNum} ${mapNames[currentMapNum - 1]} 已解锁！`);
        }
        
        addBattleLog(`[系统] 战斗胜利！`);
        
        // 虚空模式：胜利后深入+1
        if (battleState.currentMap === 101 && player.voidAutoBattle) {
            player.voidDepth++;
            addBattleLog(`[系统] 虚空深入+1，当前: ${player.voidDepth}`);
        }
        
        // 恢复一些生命值
        player.hp = $min(player.maxHp, player.hp + 20);
        
        // ========================================
        // 掉落物品计算
        // ========================================
        const monsterLevel = battleState.monsterLevel;
        
        // 灵石掉落：1%概率，数量 = 1.02^等级
        if (Math.random() < 0.01) {
            const amount = $floor($pow(1.02, monsterLevel));
            player.spiritStone = $addBig(player.spiritStone, String(amount));
            addBattleLog(`[掉落] 获得灵石 x${formatLawLevel(amount)}`);
        }
        
        if (Math.random() < 0.0002) {
            const amount = $floor($pow(1.02, monsterLevel));
            player.immortalStone = $addBig(player.immortalStone, String(amount));
            addBattleLog(`[掉落] 获得仙石 x${formatLawLevel(amount)}`);
        }
        
        const treasureAmount = $floor($evalBig(`${$pow(1.03, monsterLevel)} * 10`));
        player.treasure = $addBig(player.treasure, String(treasureAmount));
        addBattleLog(`[分解] 获取天材地宝 x${formatLawLevel(treasureAmount)}`);
        
        // 法则碎片掉落：5%概率，数量×5
        if (Math.random() < 0.05) {
            const amount = $floor($evalBig(`${$pow(1.033, monsterLevel)} * 5`));
            player.lawFragments = $addBig(player.lawFragments, String(amount));
            addBattleLog(`[掉落] 获得法则碎片 x${formatLawLevel(amount)}`);
        }
        
        // ========================================
        // 仙草掉落计算
        // ========================================
        // 仙草掉落：1%概率掉落其中一种，品质1-1000阶
        if (Math.random() < 0.01) {
            const immortalHerbs = [
                '虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'
            ];
            const herbName = immortalHerbs[Math.floor(Math.random() * immortalHerbs.length)];
            
            // 计算可能掉落的最高阶位（概率小于百万分之一则停止）
            let maxGrade = 1;
            let g = 1;
            while (true) {
                const probability = 10 * $pow(1.035, monsterLevel) / $pow(10, g);
                if (probability < 0.000001) {
                    break;
                }
                maxGrade = g;
                g++;
            }
            
            // 从最高阶开始随机，没随机到就降阶
            let grade = 0;
            for (let g = maxGrade; g >= 1; g--) {
                const probability = 10 * $pow(1.035, monsterLevel) / $pow(10, g);
                if (Math.random() < probability) {
                    grade = g;
                    break;
                }
            }
            
            // 如果成功掉落仙草
            if (grade > 0) {
                const existingItem = player.bag.find(item => item.name === herbName && item.grade === grade);
                if (existingItem) {
                    existingItem.count = $addBig(existingItem.count, '1');
                } else if (player.bag.length < getBagCapacity()) {
                    player.bag.push({ name: herbName, grade: grade, count: '1' });
                }
                
                if (grade > player.highestHerbGrade) {
                    player.highestHerbGrade = grade;
                }
                
                addBattleLog(`[掉落] 获得${herbName}(${grade}阶) x1`);
            }
        }
    } else {
        // ========================================
        // 战斗失败处理
        // ========================================
        addBattleLog(`[战斗] 你被 ${battleState.currentMonster} 击败了！`);
        addBattleLog(`[系统] 战斗失败，逃跑成功！`);
        
        // 虚空模式：失败后深入-1
        if (battleState.currentMap === 101 && player.voidAutoBattle) {
            if (player.voidDepth > 0) {
                player.voidDepth--;
                addBattleLog(`[系统] 虚空深入-1，当前: ${player.voidDepth}`);
            }
        }
    }
    
    // ========================================
    // 战斗结束后恢复
    // ========================================
    // 青木真身：战斗结束后恢复原始生命
    if (battleState.originalMaxHp) {
        player.maxHp = battleState.originalMaxHp;
        player.hp = player.maxHp;  // 战斗结束后恢复满血
        battleState.originalMaxHp = null;
    } else {
        player.hp = player.maxHp;  // 恢复满血
    }
    
    updateBattleUI();
    updateStatusUI();
    updateBagUI();
    
    // 保存游戏数据
    saveGameData();
    
    // 延迟重置战斗结束状态，防止自动探索立即开始新战斗
    setTimeout(() => {
        battleState.battleEnding = false;
    }, 500);
}

// 添加战斗日志
function addBattleLog(message) {
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 8);
    battleState.battleLog.unshift(`[${timeStr}] ${message}`);
    if (battleState.battleLog.length > 100) {
        battleState.battleLog.pop();
    }
}

function formatLawLevel(num) {
    if (num === null || num === undefined) return '0';
    const str = String(num);
    if (str === 'Infinity' || str === '-Infinity' || str === 'NaN') return str;
    
    if (str.includes('e') || str.includes('E')) {
        const match = str.match(/^(-?\d*\.?\d+)[eE]([+-]?\d+)$/);
        if (match) {
            const mantissa = parseFloat(match[1]);
            let exp = match[2];
            if (mantissa === 0) return '0';
            if (exp.startsWith('+')) exp = exp.substring(1);
            const expNum = parseInt(exp);
            if (expNum < 5) {
                const fullNum = mantissa * Math.pow(10, expNum);
                if (fullNum < 100000) {
                    return Math.floor(fullNum).toString();
                }
            }
            if (mantissa >= 10) {
                const digits = Math.floor(Math.log10(Math.abs(mantissa))) + 1;
                const normalizedMantissa = mantissa / Math.pow(10, digits - 1);
                const normalizedExp = expNum + digits - 1;
                return normalizedMantissa.toFixed(4) + 'e' + normalizedExp;
            }
            return mantissa.toPrecision(4) + 'e' + exp;
        }
        return str;
    }
    
    const numVal = parseFloat(str);
    if (numVal < 100000) {
        return Math.floor(numVal).toString();
    }
    return formatNumber(num);
}

function formatNumber(num) {
    if (num === null || num === undefined) {
        return '0';
    }
    const str = String(num);
    if (str === 'Infinity' || str === '-Infinity' || str === 'NaN') {
        return str;
    }
    if (str.includes('e') || str.includes('E')) {
        const match = str.match(/^(-?\d*\.?\d+)[eE]([+-]?\d+)$/);
        if (match) {
            const mantissa = parseFloat(match[1]);
            let exp = parseInt(match[2]);
            if (mantissa === 0) return '0';
            const value = mantissa * Math.pow(10, exp);
            if (value < 99999 && value > -99999) {
                const rounded = Math.round(value);
                if (Math.abs(value - rounded) < 0.0001) {
                    return String(rounded);
                }
                return value.toFixed(2);
            }
            const formattedMantissa = mantissa.toPrecision(5);
            return Number(formattedMantissa) + 'e' + exp;
        }
        return str;
    }
    if (str.length <= 5) {
        return str;
    }
    const numVal = parseFloat(str);
    if (!isNaN(numVal) && numVal < 99999 && numVal > -99999) {
        const rounded = Math.round(numVal);
        if (Math.abs(numVal - rounded) < 0.0001) {
            return String(rounded);
        }
        return numVal.toFixed(2);
    }
    if (str.length <= 10) {
        return str.slice(0, 5) + 'e' + (str.length - 5);
    }
    return formatBigNumber(num);
}

// 生成生命条
function generateHpBar(current, max) {
    const percent = max > 0 ? (current / max) * 100 : 0;
    const filled = $max(0, $min(7, $floor(percent / 13.33)));
    const empty = $max(0, 7 - filled);
    return '█'.repeat(filled) + '░'.repeat(empty);
}

// 切换地图
function changeMap(mapNumber) {
    if (mapNumber >= 1 && mapNumber <= 101) {
        if (mapNumber === 101) {
            if (!player.unlockedMaps.includes(55)) return;
            if (!player.unlockedMaps.includes(101)) {
                player.unlockedMaps.push(101);
                player.unlockedMaps.sort((a, b) => a - b);
            }
        }
        battleState.currentMap = mapNumber;
        player.currentMap = mapNumber;
        battleState.inBattle = false;
        closeModal();
        updateBattleUI();
        saveGameData();
    }
}

// 地图名称
const mapNames = [
    "青雾坡", "灵溪谷", "松风岭", "云渺滩", "翠玉坪",
    "落霞涧", "望月坡", "寒泉峪", "碧梧林", "流云渡",
    "丹霞岗", "清露泽", "苍柏塬", "幻雾泽", "紫菱洲",
    "天风峡", "玉镜湖", "栖霞坪", "玄石滩", "幽兰谷",
    "星落坡", "静云涧", "金粟林", "寒烟渡", "翠霞岭",
    "灵汐洲", "松涛峪", "月华坪", "凝露泽", "苍雾峡",
    "紫霞滩", "碧涧林", "云帆渡", "沧澜仙泽", "紫府灵墟",
    "玄霜秘境", "丹霞仙谷", "云荒古塬", "玉宸灵洲", "清霄寒涧",
    "苍梧仙林", "星澜幻泽", "瑶台玉坪", "天风仙峡", "月魄寒泉",
    "紫霞仙墟", "碧渊灵渡", "金霞古岗", "灵虚云泽", "玄溟仙滩",
    "栖霞灵谷", "云渺仙洲", "凝霜古林", "玉涧仙坡", "星穹秘境",
    "苍澜古渡", "紫霄灵峪", "清辉仙坪", "玄光幻泽", "瑶光仙峡",
    "金麟灵洲", "寒霄古涧", "云曦仙泽", "碧霞灵墟", "月华仙林",
    "丹霞古渡", "九霄云宸境", "鸿蒙紫墟境", "沧溟玉宸界", "玄霜清霄境",
    "丹霞紫府天", "云荒灵虚境", "玉澜星穹界", "清霄瑶台境", "苍梧玄溟天",
    "星澜紫霄境", "瑶台金麟界", "天风凝霜境", "月魄玄光天", "紫霞鸿蒙境",
    "碧渊云曦界", "金霞灵虚天", "灵虚沧澜境", "玄溟瑶光界", "栖霞九霄天",
    "云渺玉澜境", "凝霜金霞界", "玉涧星穹天", "混沌道源墟", "鸿蒙元宸天",
    "沧溟紫霄界", "玄霜太初境", "丹霞鸿蒙墟", "云荒道衍天", "玉澜元虚界",
    "清霄混沌境", "苍梧道源天", "瑶台元宸墟", "星澜太初界","无上大罗天", "无尽虚空"
];

function showMapSelection() {
    let table = '<table style="border-collapse:collapse;border:1px solid #fff;color:#fff;font-family:monospace;text-align:center;">';
    for (let i = 0; i < 20; i++) {
        table += '<tr>';
        for (let j = 0; j < 5; j++) {
            const mapNum = i * 5 + j + 1;
            if (mapNum > 100) break;
            const isUnlocked = player.unlockedMaps.includes(mapNum);
            const isCurrent = mapNum === battleState.currentMap;
            const color = isCurrent ? '#0f0' : (isUnlocked ? '#fff' : '#666');
            
            if (isUnlocked) {
                table += `<td onclick="changeMap(${mapNum})" style="border:1px solid #fff;padding:5px 10px;cursor:pointer;color:${color};">${mapNum.toString().padStart(3, '0')}<br>${mapNames[mapNum - 1]}</td>`;
            } else {
                const prevUnlocked = player.unlockedMaps.includes(mapNum - 1);
                if (prevUnlocked) {
                    table += `<td onclick="startChallenge(${mapNum})" style="border:1px solid #666;padding:5px 10px;cursor:pointer;color:#f66;">🔒<br>挑战</td>`;
                } else {
                    table += `<td style="border:1px solid #333;padding:5px 10px;color:#333;">🔒<br>--</td>`;
                }
            }
        }
        table += '</tr>';
    }
    table += '</table>';
    
    const isVoidUnlocked = player.unlockedMaps.includes(101);
    const isVoidCurrent = battleState.currentMap === 101;
    const voidColor = isVoidCurrent ? '#0f0' : (isVoidUnlocked ? '#fff' : '#666');
    
    let voidTd = '';
    if (isVoidUnlocked) {
        voidTd = `<td onclick="changeMap(101)" style="border:2px solid #fff;padding:25px 100px;cursor:pointer;background:#222;color:${voidColor};font-size:14px;">101<br>无尽虚空</td>`;
    } else if (player.unlockedMaps.includes(100)) {
        voidTd = `<td onclick="startChallenge(101)" style="border:2px solid #fff;padding:25px 100px;cursor:pointer;background:#222;color:#f66;font-size:14px;">🔒<br>挑战解锁</td>`;
    }
    
    if (voidTd) {
        table += `<br><table style="border-collapse:collapse;border:1px solid #f0f;"><tr>${voidTd}</tr></table>`;
    }
    
    closeModal();
    showModal(`<span onclick="closeModal()" style="cursor:pointer;color:#ff0;">【 地图选择 】</span><br>${table}<br><span style="color:#fff;">点击选择，绿字为当前</span><br><span style="color:#f66;">点击锁挑战解锁</span>`);
}

// 切换到未解锁的地图（进入挑战）
function startChallenge(mapNum) {
    if (mapNum === 101) {
        if (!player.unlockedMaps.includes(100)) {
            return;
        }
        if (!player.unlockedMaps.includes(101)) {
            player.unlockedMaps.push(101);
            player.unlockedMaps.sort((a, b) => a - b);
        }
        battleState.currentMap = mapNum;
        player.currentMap = mapNum;
        battleState.inBattle = false;
        closeModal();
        updateBattleUI();
        saveGameData();
    } else {
        const prevMap = mapNum - 1;
        if (!player.unlockedMaps.includes(prevMap)) {
            return;
        }
        battleState.currentMap = mapNum;
        player.currentMap = mapNum;
        battleState.inBattle = false;
        closeModal();
        updateBattleUI();
        saveGameData();
    }
}

// 虚空深入
function goVoidDeeper() {
    player.voidDepth++;
    player.voidAutoBattle = false;
    updateBattleUI();
    saveGameData();
}

// 虚空回退
function goVoidBack() {
    if (player.voidDepth > 0) {
        player.voidDepth--;
        player.voidAutoBattle = false;
        updateBattleUI();
        saveGameData();
    }
}

// 虚空自动深入开关
function toggleVoidAuto() {
    player.voidAutoBattle = !player.voidAutoBattle;
    updateBattleUI();
    saveGameData();
}

 // 更新战斗界面
function updateBattleUI() {
    const battleContent = document.querySelector('#battle-content');
    if (!battleContent) return;
    
    let html = '';
    
    // 地图选择区域
    let mapLine = `${box.line} 当前地图: ${battleState.currentMap} ${mapNames[battleState.currentMap - 1] || '未知'} <button onclick="showMapSelection()" style="background: #333; color: #fff; border: 1px solid #666; padding: 2px 8px; cursor: pointer;">选择地图</button> ${box.line}`;
    
    if (battleState.currentMap === 101) {
        const depth = player.voidDepth || 0;
        const displayLevel = depth;
        const autoBattle = player.voidAutoBattle || false;
        mapLine = `${box.line} 无尽虚空 深入: ${depth} <button onclick="goVoidDeeper()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 6px;cursor:pointer;">深入</button> <button onclick="goVoidBack()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 6px;cursor:pointer;">回退</button> <button onclick="toggleVoidAuto()" style="background:${autoBattle ? '#2a2' : '#333'};color:#fff;border:1px solid #666;padding:2px 6px;cursor:pointer;">${autoBattle ? '自动中' : '自动'}</button> <button onclick="showMapSelection()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 6px;cursor:pointer;">选图</button> ${box.line}`;
    }
    
    html += `
        <div class="text-line">${box.top}</div>
        <div class="text-line">${mapLine}</div>
        <div class="text-line">${box.bottom}</div>
        <div class="text-line"></div>
    `;
    
    if (battleState.inBattle) {
        // 战斗中
        const monsterHpBar = generateHpBar(battleState.monsterHp, battleState.monsterMaxHp);
        const playerHpBar = generateHpBar(player.hp, player.maxHp);
        const currentMonster = battleState.currentMonster || '未知生物';
        
        html += `
            <div class="text-line">${box.top}</div>
            <div class="text-line">${box.line}                      ${box.line}</div>
            <div class="text-line">${box.line}  遭遇 ${currentMonster} <button onclick="showMonsterStats()" style="background:#333;color:#fff;border:1px solid #666;padding:1px 5px;cursor:pointer;">属性</button> <button onclick="togglePauseBattle()" style="background:#333;color:#fff;border:1px solid #666;padding:1px 5px;cursor:pointer;">${battleState.paused ? '继续' : '暂停'}</button>   ${box.line}</div>
            <div class="text-line">${box.line}                      ${box.line}</div>
            <div class="text-line">${box.line} ${player.name}: ${playerHpBar} ${formatNumber(player.hp)}/${formatNumber(player.maxHp)} ${box.line}</div>
            <div class="text-line">${box.line} ${currentMonster}: ${monsterHpBar} ${formatNumber(battleState.monsterHp)}/${formatNumber(battleState.monsterMaxHp)} ${box.line}</div>
            <div class="text-line">${box.line}                      ${box.line}</div>
            <div class="text-line">${box.bottom}</div>
            <div class="text-line"></div>
            <div class="text-line">【 战斗日志 】</div>
        `;
        
        // 添加战斗日志
        battleState.battleLog.forEach(log => {
            html += `<div class="text-line" style="white-space:pre-wrap;word-break:break-all;overflow-wrap:anywhere;overflow-x:visible;">> ${log}</div>`;
        });
    } else {
        // 非战斗状态 - 显示上一场战斗的结果（格式与战斗中一致）
        const lastMonster = battleState.lastBattleMonster;
        if (lastMonster) {
            // 显示上一场战斗的信息
            const playerHpBar = generateHpBar(battleState.lastBattlePlayerHp, battleState.lastBattlePlayerMaxHp);
            const monsterHpBar = generateHpBar(battleState.lastBattleMonsterHp, battleState.monsterMaxHp || battleState.lastBattleMonsterHp);
            
            html += `
                <div class="text-line">${box.top}</div>
                <div class="text-line">${box.line}                      ${box.line}</div>
                <div class="text-line">${box.line}  遭遇 ${lastMonster} <button onclick="showMonsterStats()" style="background:#333;color:#fff;border:1px solid #666;padding:1px 5px;cursor:pointer;">属性</button> <button onclick="togglePauseBattle()" style="background:#333;color:#fff;border:1px solid #666;padding:1px 5px;cursor:pointer;">${battleState.paused ? '继续' : '暂停'}</button>   ${box.line}</div>
                <div class="text-line">${box.line}                      ${box.line}</div>
                <div class="text-line">${box.line} ${player.name}: ${playerHpBar} ${formatNumber(battleState.lastBattlePlayerHp)}/${formatNumber(battleState.lastBattlePlayerMaxHp)} ${box.line}</div>
                <div class="text-line">${box.line} ${lastMonster}: ${monsterHpBar} ${formatNumber(battleState.lastBattleMonsterHp)}/${formatNumber(battleState.monsterMaxHp || battleState.lastBattleMonsterHp)} ${box.line}</div>
                <div class="text-line">${box.line}                      ${box.line}</div>
                <div class="text-line">${box.bottom}</div>
                <div class="text-line"></div>
                <div class="text-line">【 战斗日志 】</div>
            `;
        } else {
            // 首次进入，没有战斗记录
            const playerHpBar = generateHpBar(player.hp, player.maxHp);
            
            html += `
                <div class="text-line">${box.top}</div>
                <div class="text-line">${box.line}                      ${box.line}</div>
                <div class="text-line">${box.line}  战斗准备就绪      ${box.line}</div>
                <div class="text-line">${box.line}                      ${box.line}</div>
                <div class="text-line">${box.line} ${player.name}: ${playerHpBar} ${formatNumber(player.hp)}/${formatNumber(player.maxHp)} ${box.line}</div>
                <div class="text-line">${box.line}                      ${box.line}</div>
                <div class="text-line">${box.bottom}</div>
                <div class="text-line"></div>
                <div class="text-line">【 战斗日志 】</div>
            `;
        }
        
        // 显示战斗日志
        if (battleState.battleLog.length > 0) {
            battleState.battleLog.forEach(log => {
                html += `<div class="text-line" style="white-space:pre-wrap;word-break:break-all;overflow-wrap:anywhere;overflow-x:visible;">> ${log}</div>`;
            });
        } else {
            html += `<div class="text-line">> [系统] 正在自动探索...</div>`;
        }
    }
    
    battleContent.innerHTML = html;
}

// 更新状态界面
function updateStatusUI() {
    const statusContent = document.querySelector('#status-content');
    if (!statusContent) return;
    
    const realmName = realmNames[player.realmIndex];
    
    const innerLevel = player.innerLevel;
    const baseHp = 100 + innerLevel * 10;
    const baseAttack = 10 + innerLevel * 1;
    const baseDefense = 5 + innerLevel * 0.5;
    const baseSpeed = 10 + innerLevel * 1;
    
    const html = `
        <div class="text-line">${box.top}</div>
        <div class="text-line">${box.line} 姓名: <span onclick="renamePlayer()" style="cursor:pointer;">${player.name}</span> ${realmName}${player.level}重 ${box.line}</div>
        <div class="text-line">${box.line} 生命: ${formatLawLevel(player.maxHp)} ${box.line}</div>
        <div class="text-line">${box.line} 攻击: ${formatLawLevel(player.attack)} 防御: ${formatLawLevel(player.defense)} ${box.line}</div>
        <div class="text-line">${box.line} 攻速: ${player.speed.toFixed(1)} 位格: ${player.power.toFixed(2)} ${box.line}</div>
        <div class="text-line">${box.line} 暴击: ${formatLawLevel(player.criticalRate)}% 暴伤: ${formatLawLevel(player.criticalDamage)}% ${box.line}</div>
        <div class="text-line">${box.bottom}</div>
        <div class="text-line"></div>
        <div class="text-line">【 详细属性介绍 】</div>
        <div class="text-line">${box.top}</div>
        <div class="text-line">${box.line} 生命: 基础值×位格^(法则领悟/4) ${box.line}</div>
        <div class="text-line">${box.line} 攻击: 基础值×位格^(法则领悟/4) ${box.line}</div>
        <div class="text-line">${box.line} 防御: 基础值×位格^(法则领悟/4) ${box.line}</div>
        <div class="text-line">${box.line} 攻速: 基础值，攻击频率=攻速^(2/9)-0.668 ${box.line}</div>
        <div class="text-line">${box.bottom}</div>
        <div class="text-line"></div>
        <div class="text-line">【 法则加成 】</div>
        <div class="text-line">${box.top}</div>
        <div class="text-line">${box.line} 生命法则: ${formatLawLevel(player.laws.life)}% ${player.weapon.lawLevels.life ? '+' + (player.weapon.lawLevels.life * 0.1).toFixed(1) + '%' : ''} ${box.line}</div>
        <div class="text-line">${box.line} 力量法则: ${formatLawLevel(player.laws.strength)}% ${player.weapon.lawLevels.strength ? '+' + (player.weapon.lawLevels.strength * 0.1).toFixed(1) + '%' : ''} ${box.line}</div>
        <div class="text-line">${box.line} 秩序法则: ${formatLawLevel(player.laws.order)}% ${player.weapon.lawLevels.order ? '+' + (player.weapon.lawLevels.order * 0.1).toFixed(1) + '%' : ''} ${box.line}</div>
        <div class="text-line">${box.line} 命运法则: ${formatLawLevel(player.laws.fate)}% ${player.weapon.lawLevels.fate ? '+' + (player.weapon.lawLevels.fate * 0.1).toFixed(1) + '%' : ''} ${box.line}</div>
        <div class="text-line">${box.line} 毁灭法则: ${formatLawLevel(player.laws.destruction)}% ${player.weapon.lawLevels.destruction ? '+' + (player.weapon.lawLevels.destruction * 0.1).toFixed(1) + '%' : ''} ${box.line}</div>
        <div class="text-line">${box.bottom}</div>
    `;
    
    statusContent.innerHTML = html;
}

function getTreasureCost(level) {
    const levelStr = String(level);
    if ($gteBig(levelStr, '1e100')) {
        return $evalBig(`${levelStr} * 100`);
    }
    return $evalBig(`floor(100 * 1.25^${levelStr})`);
}

// 计算灵田升级消耗
function getSpiritFieldCost(level) {
    const levelStr = String(level);
    if ($gteBig(levelStr, '1e100')) {
        return $evalBig(`${levelStr} * 100`);
    }
    return $evalBig(`floor(100 * 1.25^${levelStr})`);
}

function upgradeSpiritField() {
    const cost = getSpiritFieldCost(player.spiritFieldLevel);
    if (!$gteBig(player.treasure, cost)) {
        showModal(`<span style="color:#f00;">【 天材地宝不足 】</span><br><br>需要: ${formatLawLevel(cost)}<br>当前: ${formatNumber(player.treasure)}<br><br><button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>`);
        return;
    }
    player.treasure = $subBig(player.treasure, String(cost));
    player.spiritFieldLevel += 1;
    updateEquipmentUI();
    updateStatusUI();
    saveGameData();
}

// 获取纳戒容量
function getBagCapacity() {
    return 100 + player.bagLevel * 10;
}

function getBagLevelCost(level) {
    const levelStr = String(level);
    if ($gteBig(levelStr, '1e100')) {
        return $evalBig(`${levelStr} * 100`);
    }
    return $evalBig(`floor(100 * 1.25^${levelStr})`);
}

function upgradeBagLevel() {
    const cost = getBagLevelCost(player.bagLevel);
    if (!$gteBig(player.treasure, cost)) {
        showModal(`<span style="color:#f00;">【 天材地宝不足 】</span><br><br>需要: ${formatLawLevel(cost)}<br>当前: ${formatNumber(player.treasure)}<br><br><button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>`);
        return;
    }
    player.treasure = $subBig(player.treasure, String(cost));
    player.bagLevel += 1;
    updateEquipmentUI();
    updateStatusUI();
    updateBagUI();
    saveGameData();
}

// 计算强化成功率
function getEnhanceSuccessRate(level) {
    return $pow(0.7943282347242816, level);
}

// 强化位格
function enhancePower(count) {
    if (count === undefined) count = player.lastEnhanceCount;
    player.lastEnhanceCount = count;
    
    const cost = getTreasureCost(player.weapon.powerLevel);
    const totalCost = cost * count;
    
    if (!$gteBig(player.treasure, String(totalCost))) return;
    player.treasure = $subBig(player.treasure, String(totalCost));
    
    player.weapon.powerLevel += 1;
    player.weapon.powerBonus += 0.01;
    
    calculateCultivationStats();
    player.hp = player.maxHp;
    updateWeaponUI();
    updateStatusUI();
}

// 强化法则
function enhanceLaw(lawKey, count) {
    if (count === undefined) count = player.lastEnhanceCount;
    player.lastEnhanceCount = count;
    
    const cost = getTreasureCost(player.weapon.lawLevels[lawKey]);
    const totalCost = cost * count;
    
    if (!$gteBig(player.treasure, String(totalCost))) return;
    player.treasure = $subBig(player.treasure, String(totalCost));
    
    player.weapon.lawLevels[lawKey] += 1;
    
    calculateCultivationStats();
    player.hp = player.maxHp;
    updateWeaponUI();
    updateStatusUI();
}

// 强化武器攻击
function enhanceWeaponAttack() {
    const cost = getTreasureCost(player.weapon.attackLevel);
    if (!$gteBig(player.treasure, String(cost))) return;
    player.treasure = $subBig(player.treasure, String(cost));
    player.weapon.attackLevel += 1;
    calculateCultivationStats();
    player.hp = player.maxHp;
    updateWeaponUI();
    updateStatusUI();
}

// 强化武器暴击伤害
function enhanceWeaponCritDamage() {
    const cost = getTreasureCost(player.weapon.critDamageLevel);
    if (!$gteBig(player.treasure, String(cost))) return;
    player.treasure = $subBig(player.treasure, String(cost));
    player.weapon.critDamageLevel += 1;
    calculateCultivationStats();
    player.hp = player.maxHp;
    updateWeaponUI();
    updateStatusUI();
}

// 强化武器暴击率
function enhanceWeaponCritRate() {
    const cost = getTreasureCost(player.weapon.critRateLevel);
    if (!$gteBig(player.treasure, String(cost))) return;
    player.treasure = $subBig(player.treasure, String(cost));
    player.weapon.critRateLevel += 1;
    calculateCultivationStats();
    player.hp = player.maxHp;
    updateWeaponUI();
    updateStatusUI();
}

// 更新法宝界面
function updateWeaponUI() {
    const treasureContent = document.querySelector('#tab-treasure .content-box');
    if (!treasureContent) return;
    
    const weapon = player.weapon;
    const lawNames = {
        life: "生命法则",
        strength: "力量法则",
        order: "秩序法则",
        fate: "命运法则",
        destruction: "毁灭法则"
    };
    
    let html = `
        <div class="text-line">天材地宝: ${formatNumber(player.treasure)}</div>
    `;
    
    const powerCost = getTreasureCost(weapon.powerLevel);
    
    // 悟道珠
    html += `
        <div class="text-line">${box.top}</div>
        <div class="text-line">${box.line} <span onclick="renameWeapon()" style="cursor:pointer;">${weapon.name}</span> ${box.line}</div>
        <div class="text-line">${box.line} 位格 +${weapon.powerBonus.toFixed(2)} 强化: ${weapon.powerLevel}级 <button onclick="enhancePower(1)" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">强化(${formatLawLevel(powerCost)})</button> ${box.line}</div>
    `;
    const lawKeys = ['life', 'strength', 'order', 'fate', 'destruction'];
    for (const key of lawKeys) {
        const level = weapon.lawLevels[key];
        const cost = getTreasureCost(level);
        html += `
        <div class="text-line">${box.line}   ${box.line}</div>
        <div class="text-line">${box.line} ${lawNames[key]}: +${(level * 0.1).toFixed(1)}% 强化: ${level}级 <button onclick="enhanceLaw('${key}',1)" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">强化(${formatLawLevel(cost)})</button> ${box.line}</div>
        `;
    }
    
    html += `<div class="text-line">${box.bottom}</div>`;
    
    const attackCost = getTreasureCost(weapon.attackLevel);
    const critDamageCost = getTreasureCost(weapon.critDamageLevel);
    const critRateCost = getTreasureCost(weapon.critRateLevel);
    
    html += `
        <div class="text-line"></div>
        <div class="text-line">${box.top}</div>
        <div class="text-line">${box.line} <span onclick="renameWeaponName()" style="cursor:pointer;">${weapon.weaponName}</span> ${box.line}</div>
        <div class="text-line">${box.line} 攻击+${weapon.attackLevel} 强化: ${weapon.attackLevel}级 <button onclick="enhanceWeaponAttack()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">强化(${formatLawLevel(attackCost)})</button> ${box.line}</div>
        <div class="text-line">${box.line}   ${box.line}</div>
        <div class="text-line">${box.line} 暴伤+${weapon.critDamageLevel * 10}% 强化: ${weapon.critDamageLevel}级 <button onclick="enhanceWeaponCritDamage()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">强化(${formatLawLevel(critDamageCost)})</button> ${box.line}</div>
        <div class="text-line">${box.line}   ${box.line}</div>
        <div class="text-line">${box.line} 暴率+${(weapon.critRateLevel * 0.2).toFixed(1)}% 强化: ${weapon.critRateLevel}级 <button onclick="enhanceWeaponCritRate()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">强化(${formatLawLevel(critRateCost)})</button> ${box.line}</div>
        <div class="text-line">${box.bottom}</div>
    `;
    
    treasureContent.innerHTML = html;
}

// 更新炼丹界面
function updateAlchemyUI() {
    const alchemyContent = document.querySelector('#alchemy-content');
    if (!alchemyContent) return;
    
    const furnaceLevel = player.alchemyFurnaceLevel || 1;
    const levelStr = String(furnaceLevel - 1);
    let upgradeCost;
    if ($gteBig(levelStr, '1e100')) {
        upgradeCost = $evalBig(`${levelStr} * 100`);
    } else {
        upgradeCost = $evalBig(`floor(100 * 9^${levelStr})`);
    }
    const canUpgrade = $gteBig(player.treasure, upgradeCost);
    
    const mainHerb = player.alchemyFurnace[4];
    const auxiliaryHerbs = [];
    for (let i = 0; i < 9; i++) {
        if (i !== 4 && player.alchemyFurnace[i]) {
            auxiliaryHerbs.push({ index: i, item: player.alchemyFurnace[i] });
        }
    }
    
    let furnaceTable = '<table style="border-collapse:collapse;border:1px solid #fff;color:#fff;font-family:monospace;text-align:center;margin:5px auto;">';
    for (let i = 0; i < 3; i++) {
        furnaceTable += '<tr>';
        for (let j = 0; j < 3; j++) {
            const slotIndex = i * 3 + j;
            const item = player.alchemyFurnace[slotIndex];
            let label = '';
            if (slotIndex === 4) {
                label = '主药';
            } else if (slotIndex < 4) {
                label = `辅药${slotIndex + 1}`;
            } else {
                label = `辅药${slotIndex}`;
            }
            
            if (item) {
                furnaceTable += `<td onclick="showAlchemyHerb(${slotIndex})" style="border:1px solid #666;padding:8px;cursor:pointer;width:112px;height:75px;vertical-align:top;background:#222;">
                    <div style="color:#fff;font-size:15px;">${item.name.slice(0,5)}</div>
                    <div style="color:#fff;font-size:15px;">${item.grade}阶</div>
                    <div style="color:#aaa;font-size:13px;">${label}</div>
                </td>`;
            } else {
                furnaceTable += `<td onclick="addAlchemyHerb(${slotIndex})" style="border:1px solid #333;padding:8px;cursor:pointer;width:112px;height:75px;color:#666;">
                    <div style="font-size:15px;">${label}</div>
                    <div style="font-size:13px;">(空)</div>
                </td>`;
            }
        }
        furnaceTable += '</tr>';
    }
    furnaceTable += '</table>';
    
    let consumedPillsHtml = '<div class="text-line"></div><div class="text-line">【 已服用丹药 】</div>';
    let hasAnyPill = false;
    let firstPill = true;
    
    pillInfo.forEach(pill => {
        const consumed = player.consumedPills[pill.type] || {};
        let gradesInfo = '';
        let pillTotalEffect = 0;
        
        const grades = Object.keys(consumed).map(g => parseInt(g)).filter(g => !isNaN(g) && consumed[g] > 0).sort((a, b) => a - b);
        grades.forEach(grade => {
            hasAnyPill = true;
            let multiplier = 1;
            let totalEffect = 0;
            for (let i = 0; i < consumed[grade]; i++) {
                totalEffect += multiplier * pill.value;
                multiplier *= 0.9;
                if (multiplier < 0.1) multiplier = 0.1;
            }
            pillTotalEffect += totalEffect;
        });
        
        if (grades.length > 0) {
            let totalDisplay = pillTotalEffect.toFixed(2);
            if (pill.isPercent) {
                if (pill.multiply100) {
                    totalDisplay = (pillTotalEffect * 100).toFixed(1) + '%' + pill.effect;
                } else {
                    totalDisplay = pillTotalEffect.toFixed(1) + '%' + pill.effect;
                }
            } else {
                totalDisplay = '+' + totalDisplay + pill.effect;
            }
            if (!firstPill) {
                consumedPillsHtml += `<div class="text-line">${box.line} ${box.line}</div>`;
            }
            firstPill = false;
            consumedPillsHtml += `<div class="text-line" style="white-space:pre-wrap;word-break:break-all;overflow-wrap:anywhere;">${box.line} ${pill.name}[${totalDisplay}]: <button onclick="showPillDetail('${pill.type}')" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">详情</button> ${box.line}</div>`;
        }
    });
    
    if (!hasAnyPill) {
        consumedPillsHtml += `<div class="text-line">${box.line} 暂未服用任何丹药 ${box.line}</div>`;
    }
    
    const html = `
        <div class="text-line">${box.top}</div>
        <div class="text-line">【 丹炉 】等阶: ${formatLawLevel(furnaceLevel)} <button onclick="upgradeAlchemyFurnace()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;">升级(${formatLawLevel(upgradeCost)}天材地宝)</button> ${box.line}</div>
        ${furnaceTable}
        <div class="text-line"></div>
        <div class="text-line">${box.line} 主药: ${mainHerb ? mainHerb.name + '(' + mainHerb.grade + '阶)' : '未放置'} ${box.line}</div>
        ${mainHerb ? `<div class="text-line">${box.line} 目标阶位: ${(() => {
            const grade = mainHerb.grade;
            const grades = [];
            if (grade >= 1) grades.push(grade);
            if (grade > 1) grades.push(grade - 1);
            if (grade > 2) grades.push(grade - 2);
            let buttons = '';
            grades.forEach(g => {
                const isSelected = player.alchemyTargetGrade === g || (player.alchemyTargetGrade === null && g === grade);
                buttons += `<button onclick="setAlchemyTargetGrade(${g})" style="background:${isSelected ? '#4a4' : '#333'};color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;margin:2px;">${g}阶</button>`;
            });
            const currentTarget = player.alchemyTargetGrade !== null ? player.alchemyTargetGrade : grade;
            buttons += `<input type="number" id="alchemyCustomGrade" value="${currentTarget}" min="1" max="${grade}" style="background:#111;border:1px solid #666;color:#fff;padding:2px 5px;width:50px;text-align:center;margin-left:5px;" onchange="setAlchemyTargetGrade(parseInt(this.value))">阶`;
            return buttons;
        })()} ${box.line}</div>` : ''}
        <div class="text-line">${box.line} 辅药: ${auxiliaryHerbs.length}/8 ${box.line}</div>
        <div class="text-line"></div>
        <div class="text-line">${box.line} <button onclick="clearAuxiliaryHerbs()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 12px;cursor:pointer;">清空辅药</button> <button onclick="toggleAutoAddAuxiliary()" style="background:${player.autoAddAuxiliary ? '#4a4' : '#333'};color:#fff;border:1px solid #666;padding:5px 12px;cursor:pointer;">${player.autoAddAuxiliary ? '✓自动放辅药' : '○自动放辅药'}</button> <button onclick="alchemy()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 20px;cursor:pointer;">炼丹</button> ${box.line}</div>
        <div class="text-line">${box.bottom}</div>
        ${consumedPillsHtml}
    `;
    
    alchemyContent.innerHTML = html;
}

// 显示丹炉中的灵药详情
function showAlchemyHerb(slotIndex) {
    const item = player.alchemyFurnace[slotIndex];
    if (!item) return;
    
    let label = '';
    if (slotIndex === 4) {
        label = '主药';
    } else if (slotIndex < 4) {
        label = '辅药' + (slotIndex + 1);
    } else {
        label = '辅药' + slotIndex;
    }
    
    showModal(`<span onclick="closeModal()" style="cursor:pointer;color:#ff0;">【 ${item.name} 】</span><br><br>
        <br>类型: ${label}
        <br>等阶: ${item.grade}阶
        <br><br>
        <button onclick="closeModal();removeAlchemyHerb(${slotIndex});" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">取出</button>
        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">取消</button>
    `, true);
}

function removeAlchemyHerb(slotIndex) {
    const item = player.alchemyFurnace[slotIndex];
    if (!item) return;
    
    const existingItem = player.bag.find(bagItem => bagItem.name === item.name && bagItem.grade === item.grade);
    if (existingItem) {
        existingItem.count = $addBig(existingItem.count, '1');
    } else if (player.bag.length < getBagCapacity()) {
        player.bag.push({ name: item.name, grade: item.grade, count: '1' });
    } else {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">纳戒已满！</span>
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    player.alchemyFurnace[slotIndex] = null;
    updateAlchemyUI();
    updateBagUI();
    saveGameData();
}

// 往丹炉添加灵药
function addAlchemyHerb(slotIndex) {
    const herbs = player.bag.filter(item => 
        ['虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'].includes(item.name)
    );
    
    if (herbs.length === 0) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">纳戒中没有灵药！</span>
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    let options = herbs.map((item, idx) => 
        `<button onclick="closeModal();confirmAddAlchemyHerb(${slotIndex}, ${player.bag.indexOf(item)});" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;margin:3px;">${item.name}(${item.grade}阶)x${formatLawLevel(item.count)}</button>`
    ).join('<br>');
    
    showModal(`<span style="color:#ff0;">【 选择灵药 】</span><br><br>
        ${options}
        <br><br>
        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">取消</button>
    `, true);
}

// 确认添加灵药到丹炉
function confirmAddAlchemyHerb(slotIndex, bagIndex) {
    const item = player.bag[bagIndex];
    if (!item) return;
    
    if (slotIndex === 4 && player.alchemyFurnace[4]) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">主药槽已有灵药，请先取出！</span>
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    if (slotIndex !== 4) {
        const occupiedCount = player.alchemyFurnace.filter((_, i) => i !== 4 && i !== slotIndex && player.alchemyFurnace[i]).length;
        if (occupiedCount >= 8) {
            showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
                <span style="color:#f66;">辅药槽已满！</span>
                <br><br>
                <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
            `, true);
            return;
        }
    }
    
    player.alchemyFurnace[slotIndex] = { name: item.name, grade: item.grade };
    
    if (slotIndex === 4) {
        player.alchemyTargetGrade = null;
    }
    
    item.count = $subBig(item.count, '1');
    if ($lteBig(item.count, '0')) {
        player.bag.splice(bagIndex, 1);
    }
    
    updateAlchemyUI();
    updateBagUI();
    saveGameData();
}

function upgradeAlchemyFurnace() {
    const furnaceLevel = player.alchemyFurnaceLevel || 1;
    const levelStr = String(furnaceLevel - 1);
    let upgradeCost;
    if ($gteBig(levelStr, '1e100')) {
        upgradeCost = $evalBig(`${levelStr} * 100`);
    } else {
        upgradeCost = $evalBig(`floor(100 * 9^${levelStr})`);
    }
    
    if (!$gteBig(player.treasure, upgradeCost)) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">天材地宝不足！</span>
            <br>需要: ${formatLawLevel(upgradeCost)}
            <br>拥有: ${formatNumber(player.treasure)}
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    player.treasure = $subBig(player.treasure, upgradeCost);
    player.alchemyFurnaceLevel += 1;
    
    updateAlchemyUI();
    saveGameData();
    
    showModal(`<span style="color:#ff0;">【 升级成功 】</span><br><br>
        <span style="color:#afa;">丹炉升级至 ${formatLawLevel(player.alchemyFurnaceLevel)} 阶！</span>
        <br>现在可以放入 ${formatLawLevel(player.alchemyFurnaceLevel + 1)} 阶以下的主药
        <br><br>
        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
    `, true);
}

/**
 * 炼丹主函数
 * 检查炼丹条件，计算成功率，执行炼丹操作
 * 炼丹需要：1个主药（中心位置）+ 8个辅药（周围位置）
 */
function alchemy() {
    // 获取丹炉中心位置的主药
    const mainHerb = player.alchemyFurnace[4];
    if (!mainHerb) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">请先放置主药！</span>
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    // 如果开启了自动放入辅药功能，自动填充辅药槽位
    if (player.autoAddAuxiliary) {
        autoAddAuxiliaryHerbs();
    }
    
    // 获取所有辅药（排除中心位置的主药）
    const auxiliaryHerbs = player.alchemyFurnace.filter((_, i) => i !== 4 && player.alchemyFurnace[i]);
    const auxiliaryCount = auxiliaryHerbs.length;
    
    // 检查辅药数量是否足够（需要8个）
    if (auxiliaryCount < 8) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">需要8个辅药才能炼丹！</span>
            <br>当前辅药: ${auxiliaryCount}/8
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    // 计算辅药最低阶位要求（目标阶位-1，最低为1阶）
    const targetGrade = player.alchemyTargetGrade || mainHerb.grade;
    const minGrade = $max(1, targetGrade - 1);
    // 检查是否有阶位不足的辅药
    const invalidHerbs = auxiliaryHerbs.filter(h => h.grade < minGrade);
    if (invalidHerbs.length > 0) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">辅药阶位不足！</span>
            <br>主药等阶: ${mainHerb.grade}阶
            <br>辅药要求: >= ${minGrade}阶
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    // 计算炼丹成功率
    // 成功率 = 0.5^目标阶位 * 2^丹炉等级
    const furnaceLevel = player.alchemyFurnaceLevel || 1;
    const successRate = $pow(0.5, targetGrade) * $pow(2, furnaceLevel);
    const displayRate = $min(successRate, 1); // 最高100%
    
    const successPercent = (displayRate * 100).toFixed(1);
    
    const mainHerbInBag = player.bag.find(item => item.name === mainHerb.name && item.grade === mainHerb.grade && $gteBig(item.count, '1'));
    const availableMainHerb = mainHerbInBag ? String(mainHerbInBag.count) : '0';
    
    const herbTypes = ['虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'];
    const maxAuxGrade = $max(minGrade, mainHerb.grade - 1);
    let availableAuxHerbs = '0';
    herbTypes.forEach(herbName => {
        if (herbName === mainHerb.name) return;
        for (let grade = minGrade; grade <= maxAuxGrade; grade++) {
            const bagItem = player.bag.find(item => item.name === herbName && item.grade === grade && $gteBig(item.count, '1'));
            if (bagItem) {
                availableAuxHerbs = $addBig(availableAuxHerbs, String(bagItem.count));
            }
        }
    });
    
    const maxByAux = $evalBig(`floor(${availableAuxHerbs} / 8)`);
    const maxAlchemy = $lteBig(availableMainHerb, '0') ? '0' : ($gteBig($addBig(availableMainHerb, '1'), maxByAux) ? maxByAux : $addBig(availableMainHerb, '1'));
    
    // 丹药名称映射表（主药 -> 丹药）
    const pillNames = {
        '虚无空冥草': '破境丹',
        '先天一炁芝': '淬体丹',
        '鸿蒙初形花': '天元丹',
        '混元真质蕊': '暴神丹',
        '两仪混沌莲': '灵犀丹'
    };
    const pillName = pillNames[mainHerb.name] || '筑基丹';
    const pillFullName = pillName + '(' + targetGrade + '阶)';
    
    if (player.autoAddAuxiliary && $gteBig(maxAlchemy, '1')) {
        showInputModal(`<span style="color:#ff0;">【 炼丹次数 】</span><br><br>
            <span style="color:#fff;">将炼丹药: ${pillFullName}</span>
            <br><span style="color:#fff;">主药: ${mainHerb.name}(${mainHerb.grade}阶)</span>
            <br><span style="color:#fff;">辅药数量: ${auxiliaryCount}</span>
            <br><span style="color:#fff;">丹炉等阶: ${furnaceLevel}</span>
            <br><br><span style="color:#ff0;">成功率: ${successPercent}%</span>
            <br><span style="color:#aaa;">可用主药: ${formatLawLevel($addBig(availableMainHerb, '1'))}个 | 可用辅药: ${formatLawLevel(availableAuxHerbs)}个</span>
            <br><span style="color:#aaa;">最大炼制: ${formatLawLevel(maxAlchemy)}次</span>
        `, '1', (value) => {
            const count = parseInt(value);
            if (isNaN(count) || count < 1) return;
            if ($gteBig(String(count), $addBig(maxAlchemy, '1'))) {
                showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
                    <span style="color:#f66;">材料不足！</span>
                    <br>最大炼制次数: ${formatLawLevel(maxAlchemy)}
                    <br><br>
                    <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
                `, true);
                return;
            }
            doMultipleAlchemy(count);
        });
    } else {
        // 单次炼丹确认界面
        showModal(`<span style="color:#ff0;">【 炼丹确认 】</span><br><br>
            <span style="color:#fff;">将炼丹药: ${pillFullName}</span>
            <br><span style="color:#fff;">主药: ${mainHerb.name}(${mainHerb.grade}阶)</span>
            <br><span style="color:#fff;">辅药数量: ${auxiliaryCount}</span>
            <br><span style="color:#fff;">丹炉等阶: ${furnaceLevel}</span>
            <br><br><span style="color:#ff0;">成功率: ${successPercent}%</span>
            <br><br>
            <button onclick="closeModal();doAlchemy();" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">开始炼丹</button>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">取消</button>
        `, true);
    }
}

/**
 * 切换自动放入辅药状态
 * 开启后炼丹时会自动从背包中添加符合条件的辅药
 */
function toggleAutoAddAuxiliary() {
    player.autoAddAuxiliary = !player.autoAddAuxiliary;
    saveGameData();
    updateAlchemyUI();
}

/**
 * 设置炼丹目标阶位
 * @param {number} grade - 目标阶位
 */
function setAlchemyTargetGrade(grade) {
    const mainHerb = player.alchemyFurnace[4];
    const maxGrade = mainHerb ? mainHerb.grade : 10;
    if (grade < 1 || grade > maxGrade) {
        grade = Math.max(1, Math.min(grade, maxGrade));
    }
    player.alchemyTargetGrade = grade;
    updateAlchemyUI();
    saveGameData();
}

function clearAuxiliaryHerbs() {
    const itemsToRemove = [];
    
    for (let i = 0; i < 9; i++) {
        if (i !== 4 && player.alchemyFurnace[i]) {
            itemsToRemove.push({ index: i, item: player.alchemyFurnace[i] });
        }
    }
    
    if (itemsToRemove.length === 0) return;
    
    const bagCapacity = getBagCapacity();
    let emptySlots = bagCapacity - player.bag.length;
    
    for (const { index, item } of itemsToRemove) {
        if (emptySlots > 0) {
            const existingItem = player.bag.find(bagItem => bagItem.name === item.name && bagItem.grade === item.grade);
            if (existingItem) {
                existingItem.count = $addBig(existingItem.count, '1');
            } else {
                player.bag.push({ name: item.name, grade: item.grade, count: '1' });
                emptySlots--;
            }
            player.alchemyFurnace[index] = null;
        }
    }
    
    saveGameData();
    updateAlchemyUI();
    updateBagUI();
}

/**
 * 自动添加辅药函数
 * 从背包中自动选择符合条件的灵药作为辅药填入丹炉
 */
function autoAddAuxiliaryHerbs() {
    const mainHerb = player.alchemyFurnace[4];
    if (!mainHerb) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">请先放置主药！</span>
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    // 计算辅药最低阶位要求（根据目标阶位）
    const targetGrade = player.alchemyTargetGrade || mainHerb.grade;
    const minGrade = $max(1, targetGrade - 1);
    
    // 获取当前空缺的辅药槽位（排除中心位置4）
    const emptySlots = [];
    for (let i = 0; i < 9; i++) {
        if (i !== 4 && !player.alchemyFurnace[i]) {
            emptySlots.push(i);
        }
    }
    
    // 如果没有空槽位，提示用户
    if (emptySlots.length === 0) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">辅药槽已满！</span>
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    const herbTypes = ['虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'];
    const availableHerbs = [];
    const mainHerbName = mainHerb.name;
    const maxAuxGrade = $max(minGrade, mainHerb.grade - 1);
    const needExcludeMainHerb = mainHerb.grade === 1;
    
    for (const herbName of herbTypes) {
        if (needExcludeMainHerb && herbName === mainHerbName) continue;
        for (let grade = minGrade; grade <= maxAuxGrade; grade++) {
            const bagItem = player.bag.find(item => item.name === herbName && item.grade === grade && $gteBig(item.count, '1'));
            if (bagItem) {
                const count = $gteBig(bagItem.count, '100') ? 100 : Math.min(100, parseInt(String(bagItem.count)) || 1);
                for (let c = 0; c < count; c++) {
                    availableHerbs.push({ name: herbName, grade: grade, bagItem: bagItem });
                }
            }
        }
    }
    
    availableHerbs.sort((a, b) => a.grade - b.grade);
    
    if (availableHerbs.length === 0) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">没有符合条件的辅药！</span>
            <br>要求: ${minGrade}-${maxAuxGrade}阶
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    let addedCount = 0;
    for (let i = 0; i < emptySlots.length; i++) {
        if (availableHerbs.length > 0) {
            const herb = availableHerbs.shift();
            player.alchemyFurnace[emptySlots[i]] = { name: herb.name, grade: herb.grade };
            herb.bagItem.count = $subBig(herb.bagItem.count, '1');
            if ($lteBig(herb.bagItem.count, '0')) {
                const idx = player.bag.indexOf(herb.bagItem);
                if (idx > -1) player.bag.splice(idx, 1);
            }
            addedCount++;
        }
    }
    
    // 更新界面并保存
    updateAlchemyUI();
    updateBagUI();
    saveGameData();
    
    // 显示添加结果
    showModal(`<span style="color:#ff0;">【 自动添加成功 】</span><br><br>
        <span style="color:#afa;">已自动添加 ${addedCount} 个辅药</span>
        <br><br>
        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
    `, true);
}

/**
 * 执行单次炼丹
 * 根据成功率判定炼丹结果，成功则获得丹药，失败则材料损毁
 */
function doAlchemy() {
    // 获取主药信息
    const mainHerb = player.alchemyFurnace[4];
    const mainHerbName = mainHerb.name;
    const mainHerbGrade = mainHerb.grade;
    const targetGrade = player.alchemyTargetGrade || mainHerb.grade;
    const furnaceLevel = player.alchemyFurnaceLevel || 1;
    // 计算成功率
    const successRate = $pow(0.5, targetGrade) * $pow(2, furnaceLevel);
    
    // 随机判定是否成功
    const isSuccess = Math.random() < successRate;
    
    // 丹药名称映射表
    const pillNames = {
        '虚无空冥草': '破境丹',
        '先天一炁芝': '淬体丹',
        '鸿蒙初形花': '天元丹',
        '混元真质蕊': '暴神丹',
        '两仪混沌莲': '灵犀丹'
    };
    
    const pillName = pillNames[mainHerb.name] || '筑基丹';
    const pillGrade = targetGrade;
    const fullPillName = pillName + '(' + pillGrade + '阶)';
    
    const originalMainHerb = { name: mainHerbName, grade: mainHerbGrade };
    
    if (isSuccess) {
        const existingPill = player.bag.find(item => item.name === pillName && item.grade === pillGrade);
        if (existingPill) {
            existingPill.count = $addBig(existingPill.count, '1');
        } else if (player.bag.length < getBagCapacity()) {
            player.bag.push({ name: pillName, grade: pillGrade, count: '1' });
        } else {
            player.alchemyFurnace = [null, null, null, null, null, null, null, null, null];
            showModal(`<span style="color:#ff0;">【 炼丹成功 】</span><br><br>
                <span style="color:#afa;">恭喜！炼丹成功！</span>
                <br>获得: ${fullPillName}
                <br><span style="color:#f66;">纳戒已满，请清理空间</span>
                <br><br>
                <button onclick="closeModal();player.alchemyFurnace=[null,null,null,null,null,null,null,null,null];updateAlchemyUI();updateBagUI();saveGameData();" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
            `, true);
            return;
        }
        
        player.alchemyFurnace = [null, null, null, null, null, null, null, null, null];
        
        const herbInBag = player.bag.find(item => item.name === originalMainHerb.name && item.grade === originalMainHerb.grade && $gteBig(item.count, '1'));
        if (herbInBag) {
            herbInBag.count = $subBig(herbInBag.count, '1');
            if ($lteBig(herbInBag.count, '0')) {
                player.bag = player.bag.filter(item => !(item.name === originalMainHerb.name && item.grade === originalMainHerb.grade));
            }
            player.alchemyFurnace[4] = { name: originalMainHerb.name, grade: originalMainHerb.grade };
        }
        
        showModal(`<span style="color:#ff0;">【 炼丹成功 】</span><br><br>
            <span style="color:#afa;">恭喜！炼丹成功！</span>
            <br>获得: ${fullPillName}
            <br><br>
            <button onclick="closeModal();updateAlchemyUI();updateBagUI();saveGameData();" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
    } else {
        player.alchemyFurnace = [null, null, null, null, null, null, null, null, null];
        
        const herbInBag = player.bag.find(item => item.name === originalMainHerb.name && item.grade === originalMainHerb.grade && $gteBig(item.count, '1'));
        if (herbInBag) {
            herbInBag.count = $subBig(herbInBag.count, '1');
            if ($lteBig(herbInBag.count, '0')) {
                player.bag = player.bag.filter(item => !(item.name === originalMainHerb.name && item.grade === originalMainHerb.grade));
            }
            player.alchemyFurnace[4] = { name: originalMainHerb.name, grade: originalMainHerb.grade };
        }
        
        showModal(`<span style="color:#ff0;">【 炼丹失败 】</span><br><br>
            <span style="color:#f66;">炼丹失败，灵药全部损毁！</span>
            <br><br>
            <button onclick="closeModal();updateAlchemyUI();saveGameData();" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
    }
}

/**
 * 执行多次炼丹
 * 批量炼丹，自动消耗材料并统计成功/失败次数
 * @param {number} count - 炼丹次数
 */
function doMultipleAlchemy(count) {
    const mainHerb = player.alchemyFurnace[4];
    if (!mainHerb) return;
    
    // 获取主药信息
    const mainHerbName = mainHerb.name;
    const mainHerbGrade = mainHerb.grade;
    const targetGrade = player.alchemyTargetGrade || mainHerb.grade;
    const furnaceLevel = player.alchemyFurnaceLevel || 1;
    const successRate = $pow(0.5, targetGrade) * $pow(2, furnaceLevel);
    
    // 丹药名称映射表
    const pillNames = {
        '虚无空冥草': '破境丹',
        '先天一炁芝': '淬体丹',
        '鸿蒙初形花': '天元丹',
        '混元真质蕊': '暴神丹',
        '两仪混沌莲': '灵犀丹'
    };
    
    const pillName = pillNames[mainHerb.name] || '筑基丹';
    const pillGrade = targetGrade;
    const fullPillName = pillName + '(' + pillGrade + '阶)';
    
    let mainHerbInBag = player.bag.find(item => item.name === mainHerbName && item.grade === mainHerbGrade);
    const availableMainHerb = mainHerbInBag ? String(mainHerbInBag.count) : '0';
    const maxCount = $addBig(availableMainHerb, '1');
    
    if ($gteBig(String(count), $addBig(maxCount, '1'))) {
        showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
            <span style="color:#f66;">主药不足！</span>
            <br>可用: ${formatLawLevel(maxCount)}个
            <br><br>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
        `, true);
        return;
    }
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < count; i++) {
        const isSuccess = Math.random() < successRate;
        
        if (isSuccess) {
            successCount++;
        } else {
            failCount++;
        }
    }
    
    const existingPill = player.bag.find(item => item.name === pillName && item.grade === pillGrade);
    if (existingPill) {
        existingPill.count = $addBig(existingPill.count, String(successCount));
    } else if (player.bag.length < getBagCapacity()) {
        player.bag.push({ name: pillName, grade: pillGrade, count: String(successCount) });
    }
    
    const extraConsume = count - 1;
    if (extraConsume > 0 && mainHerbInBag) {
        mainHerbInBag.count = $subBig(mainHerbInBag.count, String(extraConsume));
        if ($lteBig(mainHerbInBag.count, '0')) {
            player.bag = player.bag.filter(item => !(item.name === mainHerbName && item.grade === mainHerbGrade));
        }
    }
    
    if (player.autoAddAuxiliary && extraConsume > 0) {
        const minGrade = $max(1, targetGrade - 1);
        const herbTypes = ['虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'];
        const totalAuxNeeded = String(extraConsume * 8);
        
        let consumed = '0';
        for (let grade = minGrade; grade <= 10 && $lteBig(consumed, totalAuxNeeded); grade++) {
            for (let herbName of herbTypes) {
                if (herbName === mainHerbName) continue;
                const herbInBag = player.bag.find(item => item.name === herbName && item.grade === grade && $gteBig(item.count, '1'));
                if (herbInBag) {
                    const remaining = $subBig(totalAuxNeeded, consumed);
                    const consume = $lteBig(herbInBag.count, remaining) ? herbInBag.count : remaining;
                    herbInBag.count = $subBig(herbInBag.count, String(consume));
                    consumed = $addBig(consumed, String(consume));
                    if ($lteBig(herbInBag.count, '0')) {
                        player.bag = player.bag.filter(item => !(item.name === herbName && item.grade === grade));
                    }
                }
            }
        }
    }
    
    // 清空丹炉
    player.alchemyFurnace = [null, null, null, null, null, null, null, null, null];
    
    // 构建结果消息
    let resultMessage = '';
    if (successCount > 0) {
        resultMessage += `<br>成功: ${successCount}次，获得 ${fullPillName} x${successCount}`;
    }
    if (failCount > 0) {
        resultMessage += `<br>失败: ${failCount}次`;
    }
    
    showModal(`<span style="color:#ff0;">【 炼丹结果 】</span><br><br>
        <span style="color:#fff;">总计炼丹: ${count} 次</span>
        ${resultMessage}
        <br><br>
        <button onclick="closeModal();updateAlchemyUI();updateBagUI();saveGameData();" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
    `, true);
}

/**
 * 无尽虚空怪物列表
 * 按深度分组，每10层更换一组怪物
 * 怪物等级 = 500 + 深度
 */
const voidMonsters = [
    ["域外虚始祖", "鸿蒙源空尊", "混沌宇极帝", "太虚界元圣", "星墟道归兽"],
    ["界宇初源尊", "天渊末空帝", "虚烬万化圣", "宇蚀归一祖", "空墟鸿蒙兽"],
    ["虚空万劫主", "域外恒寂帝", "鸿蒙末道尊", "混沌终墟祖", "太虚归零圣"],
    ["界宇寂灭神", "天渊空蚀皇", "虚烬归一道", "宇墟万劫兽", "星蚀恒寂尊"]
];

/**
 * 更新无尽虚空界面
 * 显示当前深度、怪物信息和操作按钮
 */
function updateVoidUI() {
    const voidContent = document.querySelector('#void-content');
    if (!voidContent) return;
    
    // 获取当前深入深度
    const depth = player.voidDepth || 0;
    // 怪物等级 = 基础等级500 + 深度
    const monsterLevel = 500 + depth;
    const displayLevel = monsterLevel - 500;
    const autoBattle = player.voidAutoBattle || false;
    
    // 根据深度选择怪物组（每10层换一组，最多4组）
    const monsterList = voidMonsters[Math.min(Math.floor(depth / 10), 3)];
    // 随机选择一个怪物名称
    const randomMonster = monsterList[Math.floor(Math.random() * monsterList.length)];
    
    // 构建界面HTML
    let html = `
        <div class="text-line">${box.top}</div>
        <div class="text-line">${box.line} 深入等级: ${depth} ${box.line}</div>
        <div class="text-line">${box.line} 区域等级: ${displayLevel} ${box.line}</div>
        <div class="text-line"></div>
        <div class="text-line">${box.line} 当前怪物: ${randomMonster} ${box.line}</div>
        <div class="text-line">${box.line} 等级: ${monsterLevel} ${box.line}</div>
        <div class="text-line"></div>
        <div class="text-line">${box.line} 
            <button onclick="goDeeper()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 10px;cursor:pointer;">深入</button>
            <button onclick="goBack()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 10px;cursor:pointer;">回退</button>
            <button onclick="toggleVoidAuto()" style="background:${autoBattle ? '#2a2' : '#333'};color:#fff;border:1px solid #666;padding:5px 10px;cursor:pointer;">${autoBattle ? '自动深入中' : '自动深入'}</button>
        ${box.line}</div>
        <div class="text-line"></div>
        <div class="text-line">${box.line} <button onclick="voidFight()" style="background:#833;color:#fff;border:1px solid #666;padding:8px 20px;cursor:pointer;">挑战</button> ${box.line}</div>
        <div class="text-line">${box.bottom}</div>
    `;
    
    voidContent.innerHTML = html;
}

/**
 * 深入虚空
 * 增加深入等级，怪物等级随之提升
 */
function goDeeper() {
    player.voidDepth++;
    updateVoidUI();
    saveGameData();
}

/**
 * 回退虚空
 * 减少深入等级（最低为0）
 */
function goBack() {
    if (player.voidDepth > 0) {
        player.voidDepth--;
        updateVoidUI();
        saveGameData();
    }
}

/**
 * 切换自动深入状态
 * 开启后战斗胜利会自动深入下一层
 */
function toggleVoidAuto() {
    player.voidAutoBattle = !player.voidAutoBattle;
    updateVoidUI();
    saveGameData();
}

/**
 * 开始虚空战斗
 * 设置当前地图为虚空（-1），跳转到战斗界面
 */
function voidFight() {
    const depth = player.voidDepth || 0;
    const monsterLevel = 500 + depth;
    // 根据深度选择怪物组
    const monsterList = voidMonsters[Math.min(Math.floor(depth / 10), 3)];
    // 随机选择怪物
    const monsterName = monsterList[Math.floor(Math.random() * monsterList.length)];
    
    // 设置当前地图为虚空（-1表示虚空）
    player.currentMap = -1;
    player.currentMonsterLevel = monsterLevel;
    player.currentMonsterName = monsterName;
    
    // 切换到战斗标签页
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="battle"]').classList.add('active');
    document.getElementById('tab-battle').classList.add('active');
    updateBattleUI();
}

/**
 * 更新纳戒（背包）界面
 * 显示物品列表、容量、升级按钮和自动排序功能
 */
function updateBagUI() {
    const bagContent = document.querySelector('#bag-content');
    if (!bagContent) return;
    
    // 如果开启自动排序，先排序
    if (player.bagAutoSort) {
        sortBag();
    }
    
    // 计算背包使用情况
    const usedSlots = player.bag.length;
    const bagCapacity = getBagCapacity();
    const rows = $ceil(bagCapacity / 5);
    
    // 构建物品表格（每行5个格子）
    let table = '<table style="border-collapse:collapse;border:1px solid #fff;color:#fff;font-family:monospace;text-align:center;width:350px;table-layout:fixed;">';
    for (let i = 0; i < rows; i++) {
        table += '<tr>';
        for (let j = 0; j < 5; j++) {
            const slotIndex = i * 5 + j;
            const item = player.bag[slotIndex];
            if (item) {
                table += `<td onclick="showItemInfo(${slotIndex})" style="border:1px solid #666;padding:8px 4px;cursor:pointer;font-size:12px;vertical-align:top;min-height:60px;overflow:hidden;word-break:break-all;">
                    <div style="color:#afa;">${item.name}</div>
                    <div style="color:#ff0;">${item.grade}阶</div>
                    <div style="color:#fff;">x${formatLawLevel(item.count)}</div>
                </td>`;
            } else {
                table += `<td style="border:1px solid #333;padding:8px 4px;color:#333;font-size:12px;min-height:60px;overflow:hidden;">
                    <div>空</div>
                    <div>&nbsp;</div>
                    <div>&nbsp;</div>
                </td>`;
            }
        }
        table += '</tr>';
    }
    table += '</table>';
    
    // 自动排序状态图标
    const autoSort = player.bagAutoSort ? '✅' : '❌';
    const bagLevelCost = getBagLevelCost(player.bagLevel);
    const canUpgrade = $gteBig(player.treasure, String(bagLevelCost));
    
    // 构建完整界面HTML
    const html = `
        <div class="text-line">${box.top}</div>
        <div class="text-line">${box.line} 纳戒: ${usedSlots}/${bagCapacity} 容量+10  天材地宝: ${formatNumber(player.treasure)} ${box.line}</div>
        <div class="text-line">${box.line} <button onclick="upgradeBagLevel()" style="background:#333;color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;font-size:12px;">升级(${formatLawLevel(bagLevelCost)})</button> <button onclick="toggleBagAutoSort()" style="background:${player.bagAutoSort ? '#2a2' : '#333'};color:#fff;border:1px solid #666;padding:2px 8px;cursor:pointer;font-size:12px;">自动排序 ${autoSort}</button> ${box.line}</div>
        <div class="text-line">${box.bottom}</div>
        <div class="text-line"></div>
        ${table}
    `;
    
    bagContent.innerHTML = html;
}

/**
 * 切换纳戒自动排序状态
 * 开启后物品会自动按规则排序
 */
function toggleBagAutoSort() {
    player.bagAutoSort = !player.bagAutoSort;
    if (player.bagAutoSort) {
        sortBag();
    }
    updateBagUI();
    saveGameData();
}

/**
 * 纳戒自动排序函数
 * 排序规则：灵草优先于丹药，按阶位从高到低，同阶位按固定顺序
 */
function sortBag() {
    // 灵草排序顺序
    const herbOrder = ['灵心草', '幽兰', '朱血藤', '银莲', '金果', '玉髓', '星尘花', '太初叶', '混元枝', '虚无根'];
    // 丹药排序顺序
    const pillOrder = ['天元丹', '淬体丹', '暴神丹', '灵犀丹', '破境丹'];
    const herbSet = new Set(herbOrder);
    const pillSet = new Set(pillOrder);
    
    // 判断物品类型的辅助函数
    const isHerb = (name) => herbSet.has(name);
    const isPill = (name) => pillSet.has(name);
    
    // 排序比较函数
    player.bag.sort((a, b) => {
        if (!a) return 1;
        if (!b) return -1;
        
        const aIsHerb = isHerb(a.name);
        const bIsHerb = isHerb(b.name);
        const aIsPill = isPill(a.name);
        const bIsPill = isPill(b.name);
        
        // 灵草排在前面
        if (aIsHerb && !bIsHerb) return -1;
        if (!aIsHerb && bIsHerb) return 1;
        // 丹药排在后面
        if (aIsPill && !bIsPill) return 1;
        if (!aIsPill && bIsPill) return -1;
        
        // 同类型按阶位从高到低排序
        if (a.grade !== b.grade) {
            return b.grade - a.grade;
        }
        
        // 灵草按固定顺序排序
        if (aIsHerb) {
            const aIndex = herbOrder.indexOf(a.name);
            const bIndex = herbOrder.indexOf(b.name);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
        }
        
        // 丹药按固定顺序排序
        if (aIsPill) {
            const aIndex = pillOrder.indexOf(a.name);
            const bIndex = pillOrder.indexOf(b.name);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
        }
        
        // 其他物品按名称排序
        return a.name.localeCompare(b.name);
    });
}

/**
 * 显示物品详情
 * 根据物品类型显示不同的信息界面
 * @param {number} slotIndex - 背包槽位索引
 */
function showItemInfo(slotIndex) {
    const item = player.bag[slotIndex];
    if (!item) return;
    
    // 特殊物品：小包裹（新手礼包）
    if (item.name === '小包裹') {
        showModal(`<span onclick="closeModal()" style="cursor:pointer;color:#ff0;">【 小包裹 】</span><br>
            <br>等阶: 1阶
            <br>数量: ${formatLawLevel(item.count)}
            <br><br>包含:<br>
            <span style="color:#0ff;">• 灵石 x100</span><br>
            <span style="color:#0ff;">• 仙石 x1</span><br>
            <span style="color:#0ff;">• 天材地宝 x1000</span><br>
            <span style="color:#0ff;">• 法则碎片 x150</span><br>
            <span style="color:#0ff;">• 虚无空冥草 x1</span><br>
            <span style="color:#0ff;">• 先天一炁芝 x1</span><br>
            <span style="color:#0ff;">• 鸿蒙初形花 x1</span><br>
            <span style="color:#0ff;">• 混元真质蕊 x1</span><br>
            <span style="color:#0ff;">• 两仪混沌莲 x1</span><br>
            <br>
            <button onclick="useItem(${slotIndex})" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">打开</button>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">关闭</button>
        `, true);
        return;
    }
    
    // 丹药信息映射表
    const pillNames = {
        '破境丹': { type: 'breakthrough', herb: '虚无空冥草' },
        '淬体丹': { type: 'health', herb: '先天一炁芝' },
        '天元丹': { type: 'attack', herb: '鸿蒙初形花' },
        '暴神丹': { type: 'critDamage', herb: '混元真质蕊' },
        '灵犀丹': { type: 'critRate', herb: '两仪混沌莲' }
    };
    
    // 如果是丹药，显示丹药详情
    if (pillNames[item.name]) {
        const pillInfo = pillNames[item.name];
        const pillType = pillInfo.type;
        let effectDesc = '';
        
        // 根据丹药类型设置效果描述
        if (pillType === 'breakthrough') {
            effectDesc = '增加突破升级成功率';
        } else if (pillType === 'health') {
            effectDesc = '增加生命';
        } else if (pillType === 'attack') {
            effectDesc = '增加攻击';
        } else if (pillType === 'critDamage') {
            effectDesc = '增加暴击伤害';
        } else if (pillType === 'critRate') {
            effectDesc = '增加暴击率';
        }
        
        showModal(`<span onclick="closeModal()" style="cursor:pointer;color:#ff0;">【 ${item.name} 】</span><br>
            <br>等阶: ${item.grade}阶
            <br>数量: ${formatLawLevel(item.count)}
            <br>主药: ${pillInfo.herb}
            <br>效果: ${effectDesc}
            <br><br>
            <button onclick="usePill(${slotIndex})" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">服用</button>
            <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">关闭</button>
        `, true);
        return;
    }
    
    const cultivationGain = $evalBig(`0.025 * 9.5 ^ ${item.grade}`);
    showModal(`<span onclick="closeModal()" style="cursor:pointer;color:#ff0;">【 ${item.name} 】</span><br>
        <br>等阶: ${item.grade}阶
        <br>数量: ${formatLawLevel(item.count)}
        <br>效果: 增加${formatNumber(cultivationGain)}灵力
        <br><br>
        <button onclick="useItem(${slotIndex})" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">使用</button>
        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">关闭</button>
    `, true);
}

/**
 * 使用物品
 * 处理小包裹和灵草类物品的使用
 * @param {number} slotIndex - 背包槽位索引
 */
function useItem(slotIndex) {
    const item = player.bag[slotIndex];
    if (!item || $lteBig(item.count, '0')) return;
    
    if (item.name === '小包裹') {
        // 添加礼包奖励
        player.spiritStone = $addBig(player.spiritStone, '100');
        player.immortalStone = $addBig(player.immortalStone, '1');
        player.treasure = $addBig(player.treasure, '1000');
        
        player.lawFragments = $addBig(player.lawFragments, '150');
        
        // 添加五种高级灵草各1个
        const herbs = ['虚无空冥草', '先天一炁芝', '鸿蒙初形花', '混元真质蕊', '两仪混沌莲'];
        herbs.forEach(herbName => {
            const existing = player.bag.find(i => i.name === herbName && i.grade === 1);
            if (existing) {
                existing.count = $addBig(existing.count, '1');
            } else {
                player.bag.push({ name: herbName, grade: 1, count: '1' });
            }
        });
        
        item.count = $subBig(item.count, '1');
        if ($lteBig(item.count, '0')) {
            player.bag.splice(slotIndex, 1);
        }
        
        player.newbieGift = true;
        
        closeModal();
        updateBagUI();
        updateEquipmentUI();
        updateStatusUI();
        updateLawUI();
        saveGameData();
        return;
    }
    
    if ($lteBig(item.count, '1')) {
        doUseItem(slotIndex, 1);
    } else {
        showInputModal('<span style="color:#ff0;">【 使用数量 】</span>', '1', (value) => {
            const count = parseInt(value);
            if (isNaN(count) || count < 1) return;
            doUseItem(slotIndex, count);
        });
    }
}

/**
 * 执行使用物品
 * 将灵草转化为灵力
 * @param {number} slotIndex - 背包槽位索引
 * @param {number} count - 使用数量
 */
function doUseItem(slotIndex, count) {
    const item = player.bag[slotIndex];
    if (!item || $lteBig(item.count, '0')) return;
    
    const availableCount = $gteBig(item.count, String(count)) ? count : parseInt(String(item.count).includes('e') ? parseFloat(String(item.count)).toString() : String(item.count).split('.')[0]);
    const useCount = Math.min(count, availableCount);
    const cultivationGain = $evalBig(`0.025 * 9.5 ^ ${item.grade} * ${useCount}`);
    player.cultivation = $addBig(player.cultivation, cultivationGain);
    item.count = $subBig(item.count, String(useCount));
    
    if ($lteBig(item.count, '0')) {
        player.bag.splice(slotIndex, 1);
    }
    
    closeModal();
    updateBagUI();
    updateCultivationUI();
    updateStatusUI();
    saveGameData();
}

/**
 * 服用丹药
 * 弹出数量选择界面后执行服用
 * @param {number} slotIndex - 背包槽位索引
 */
function usePill(slotIndex) {
    const item = player.bag[slotIndex];
    if (!item || $lteBig(item.count, '0')) return;
    
    if ($lteBig(item.count, '1')) {
        doUsePill(slotIndex, 1);
    } else {
        showInputModal('<span style="color:#ff0;">【 服用数量 】</span><br><br><span style="color:#888;">当前数量: ' + formatLawLevel(item.count) + '</span>', formatLawLevel(item.count), (value) => {
            const count = parseInt(value);
            if (isNaN(count) || count < 1) return;
            const actualSlot = player.bag.findIndex(i => i.name === item.name && i.grade === item.grade);
            if (actualSlot === -1) return;
            doUsePill(actualSlot, count);
        });
    }
}

/**
 * 执行服用丹药
 * 丹药效果有递减机制，服用越多效果越低
 * @param {number} slotIndex - 背包槽位索引
 * @param {number} count - 服用数量
 */
function doUsePill(slotIndex, count) {
    const item = player.bag[slotIndex];
    if (!item || $lteBig(item.count, '0')) return;
    
    // 丹药信息映射表（包含效果值）
    const pillNames = {
        '破境丹': { type: 'breakthrough', herb: '虚无空冥草', effectText: '突破升级成功率', effectValue: 0.01 },
        '淬体丹': { type: 'health', herb: '先天一炁芝', effectText: '生命', effectValue: 10 },
        '天元丹': { type: 'attack', herb: '鸿蒙初形花', effectText: '攻击', effectValue: 1 },
        '暴神丹': { type: 'critDamage', herb: '混元真质蕊', effectText: '暴击伤害', effectValue: 30 },
        '灵犀丹': { type: 'critRate', herb: '两仪混沌莲', effectText: '暴击率', effectValue: 1 }
    };
    
    const pillInfo = pillNames[item.name];
    if (!pillInfo) return;
    const pillType = pillInfo.type;
    
    // 初始化服用记录
    if (!player.consumedPills[pillType]) {
        player.consumedPills[pillType] = {};
    }
    
    if (!player.consumedPills[pillType][item.grade]) {
        player.consumedPills[pillType][item.grade] = 0;
    }
    
    const prevCount = player.consumedPills[pillType][item.grade];
    const availableCount = $gteBig(item.count, String(count)) ? count : parseInt(String(item.count).includes('e') ? parseFloat(String(item.count)).toString() : String(item.count).split('.')[0]);
    const useCount = Math.min(count, availableCount);
    player.consumedPills[pillType][item.grade] = Number(player.consumedPills[pillType][item.grade]) + useCount;
    
    item.count = $subBig(item.count, String(useCount));
    if ($lteBig(item.count, '0')) {
        player.bag.splice(slotIndex, 1);
    }
    
    // 计算累计效果（有递减机制）
    // 每次服用效果乘以0.9，最低0.1
    let multiplier = 1;
    let totalEffect = 0;
    const totalConsumed = Number(player.consumedPills[pillType][item.grade]);
    for (let i = 0; i < totalConsumed; i++) {
        totalEffect += multiplier * pillInfo.effectValue;
        multiplier = $max(multiplier * 0.9, 0.1);
    }
    
    // 更新界面
    closeModal();
    updateBagUI();
    calculateCultivationStats();
    updateCultivationUI();
    updateStatusUI();
    saveGameData();
    
    // 显示效果
    let totalEffectDisplay = totalEffect.toFixed(2);
    if (pillInfo.isPercent) {
        totalEffectDisplay = totalEffect.toFixed(1) + '%';
    }
    
    showModal(`<span style="color:#ff0;">【 服用成功 】</span><br><br>
        <span style="color:#afa;">服用 ${item.name}(${item.grade}阶) x${useCount} 成功！</span>
        <br>主药: ${pillInfo.herb}
        <br>${pillInfo.effectText}+${totalEffectDisplay}(累计)
        <br><br>
        <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
    `, true);
}

/**
 * 重命名法宝
 * 弹出输入框修改法宝名称
 */
function renameWeapon() {
    showInputModal('<span style="color:#ff0;">【 法宝命名 】</span>', player.weapon.name, (newName) => {
        if (newName && newName.trim()) {
            player.weapon.name = newName.trim();
            updateWeaponUI();
            saveGameData();
        }
    });
}

/**
 * 重命名玩家
 * 弹出输入框修改修炼者名称
 */
function renamePlayer() {
    showInputModal('<span style="color:#ff0;">【 修炼者命名 】</span>', player.name, (newName) => {
        if (newName && newName.trim()) {
            player.name = newName.trim();
            updateStatusUI();
            updateBattleUI();
            saveGameData();
        }
    });
}

/**
 * 重命名青木剑（法宝武器名）
 * 弹出输入框修改法宝武器名称
 */
function renameWeaponName() {
    showInputModal('<span style="color:#ff0;">【 法宝命名 】</span>', player.weapon.weaponName, (newName) => {
        if (newName && newName.trim()) {
            player.weapon.weaponName = newName.trim();
            updateTreasureUI();
            saveGameData();
        }
    });
}

/**
 * 重命名青木长生经（功法名）
 * 弹出输入框修改功法名称
 */
function renameBookName() {
    showInputModal('<span style="color:#ff0;">【 功法命名 】</span>', player.weapon.bookName, (newName) => {
        if (newName && newName.trim()) {
            player.weapon.bookName = newName.trim();
            updateStatusUI();
            saveGameData();
        }
    });
}

/* ==================== 游戏时长统计与初始化 ==================== */

// 游戏开始时间
let gameStartTime = Date.now();
// 是否显示作弊模块
let showCheatModule = player.showCheatModule || false;
// 累计游戏时长（秒）
let totalPlayTime = 0;

/**
 * 更新游戏时长显示
 * 计算并显示当前游戏时长
 */
function updateGameTime() {
    const elapsed = $floor((Date.now() - gameStartTime) / 1000) + totalPlayTime;
    const hours = $floor($evalBig(`${elapsed} / 3600`));
    const minutes = $floor($evalBig(`(${elapsed} % 3600) / 60`));
    const seconds = $evalBig(`${elapsed} % 60`);
    
    const timeStr = $gteBig(hours, '1') 
        ? `${formatHerbNumber(hours)}时${formatHerbNumber(minutes)}分${formatHerbNumber(seconds)}秒`
        : `${formatHerbNumber(minutes)}分${formatHerbNumber(seconds)}秒`;
    
    const gameTimeEl = document.getElementById('game-time');
    if (gameTimeEl) {
        gameTimeEl.textContent = timeStr;
    }
}

/**
 * 游戏初始化
 * DOM加载完成后执行，初始化所有游戏系统
 */
window.addEventListener('DOMContentLoaded', function() {
    // 生成UI边框
    box = generateBox();
    innerBox = generateInnerBox();
    // 更新HTML中的固定边框
    updateHtmlBoxWidth();
    // 从存档恢复当前地图
    if (player.currentMap) {
        battleState.currentMap = player.currentMap;
    }
    // 初始化战斗系统和修炼系统
    initBattleSystem();
    initCultivationSystem();
    // 更新所有界面
    updateStatusUI();
    updateBattleUI();
    updateCultivationUI();
    updateWeaponUI();
    updateEquipmentUI();
    updateBagUI();
    updateCheatUI();
    
    // 设置自动保存定时器（每30秒保存一次）
    setInterval(saveGameData, 30000);
    
    // 设置游戏时长更新定时器（每秒更新）
    setInterval(updateGameTime, 1000);
    
    // 每日第一次运行自动备份存档
    checkAndAutoBackup();
});

function checkAndAutoBackup() {
    const now = new Date();
    const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    const lastBackupDate = localStorage.getItem('wenziguaji_last_backup');
    
    if (lastBackupDate !== today) {
        const saveData = localStorage.getItem('wenziguaji_save');
        if (saveData) {
            try {
                // 直接使用Base64编码，与手动导出保持一致
                const base64Data = utf8ToBase64(saveData);
                const fileName = '修仙挂机存档/修仙挂机_' + today + '.txt';
                
                if (typeof AndroidInterface !== 'undefined' && AndroidInterface.downloadFile) {
                    try {
                        AndroidInterface.downloadFile(base64Data, fileName, 'text/plain');
                        console.log('💾 每日存档已保存到download文件夹：' + fileName);
                    } catch (androidError) {
                        console.warn('Android接口调用失败:', androidError);
                        const blob = new Blob([base64Data], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        console.log('💾 每日存档已保存（浏览器下载）：' + fileName);
                    }
                } else {
                    const blob = new Blob([base64Data], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    console.log('💾 每日存档已保存（浏览器下载）：' + fileName);
                }
                
                localStorage.setItem('wenziguaji_last_backup', today);
            } catch (error) {
                console.error('每日存档备份失败:', error);
            }
        }
    }
}

/**
 * 键盘快捷键处理
 * 数字键1-5对应不同的存档操作
 */
document.addEventListener('keydown', function(e) {
    // 如果在输入框中，不处理快捷键
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key) {
        case '1': // 快速存档
            saveGameData();
            showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
                <span style="color:#afa;">存档成功！</span>
                <br><br>
                <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
            `, true);
            break;
        case '2': // 快速读档
            player = loadGameData();
            calculateCultivationStats();
            updateStatusUI();
            updateBattleUI();
            updateCultivationUI();
            updateWeaponUI();
            updateEquipmentUI();
            updateBagUI();
            showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
                <span style="color:#afa;">读档成功！</span>
                <br><br>
                <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
            `, true);
            break;
        case '3': // 导出存档
            exportSaveData();
            break;
        case '4': // 导入存档
            importSaveData();
            break;
        case '5': // 清除存档
            clearSaveData();
            break;
    }
});

/**
 * 页面关闭前保存
 * 确保用户关闭页面时数据不会丢失
 */
window.addEventListener('beforeunload', function() {
    saveGameData();
});

/**
 * 页面可见性变化监听
 * 用于处理手机切后台恢复时的离线结算
 */
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // 页面从后台恢复，检查是否需要离线结算
        const now = Date.now();
        const lastSave = player.lastSaveTime || now;
        const offlineSeconds = $floor((now - lastSave) / 1000);
        
        // 离线时间超过10秒，执行离线结算
        if (offlineSeconds >= 10) {
            try {
                processOfflineRewards(player);
            } catch (offlineErr) {
                console.error('离线结算异常:', offlineErr);
                alert('离线结算异常：' + offlineErr.message);
            }
            player.lastSaveTime = now;
            saveGameData();
            
            // 刷新所有界面
            calculateCultivationStats();
            updateStatusUI();
            updateCultivationUI();
            updateBattleUI();
            updateWeaponUI();
            updateEquipmentUI();
            updateBagUI();
            
            // 离线结算后开启新战斗
            if (!battleState.inBattle) {
                startBattle();
            }
        }
        
        // 恢复战斗：如果战斗进行中但定时器可能已失效
        if (battleState.inBattle && !battleState.paused && !battleState.battleEnding) {
            // 检查是否超过2秒没有动作（说明定时器失效）
            const timeSinceLastAction = now - (battleState.lastActionTime || 0);
            if (timeSinceLastAction > 2000) {
                // 清除可能残留的定时器
                if (battleState.attackScheduler) {
                    clearTimeout(battleState.attackScheduler);
                    battleState.attackScheduler = null;
                }
                // 恢复战斗播放
                playNextAction();
            }
        }
    } else if (document.visibilityState === 'hidden') {
        // 页面切换到后台，保存游戏
        saveGameData();
    }
});

/**
 * 窗口大小改变监听
 * 重新计算UI边框尺寸
 */
window.addEventListener('resize', function() {
    box = generateBox();
    innerBox = generateInnerBox();
    updateHtmlBoxWidth();
    updateBattleUI();
    updateStatusUI();
});

/* ==================== 作弊模块 ==================== */

/**
 * 更新作弊模块显示
 * 控制作弊面板的显示/隐藏
 */
function updateCheatUI() {
    const cheatModule = document.getElementById('cheat-module');
    if (cheatModule) {
        cheatModule.style.display = showCheatModule ? 'block' : 'none';
    }
    
    // 显示当前离线时长倍率
    const offlineEl = document.getElementById('cheat-offline');
    if (offlineEl) offlineEl.textContent = player.cheat?.offlineMultiplier || 1;
}

/**
 * 修改离线时长倍率
 * 用于测试或加速游戏进度
 */
function changeOfflineMultiplier() {
    const current = player.cheat?.offlineMultiplier || 1;
    showInputModal('<span style="color:#ff0;">【 离线时长倍率 】</span>', current.toString(), (value) => {
        const newMult = parseFloat(value);
        // 验证输入值
        if (isNaN(newMult) || newMult < 1) {
            showModal(`<span style="color:#ff0;">【 系统提示 】</span><br><br>
                <span style="color:#f66;">请输入大于等于1的数值！</span>
                <br><br>
                <button onclick="closeModal()" style="background:#333;color:#fff;border:1px solid #666;padding:5px 15px;cursor:pointer;">确定</button>
            `, true);
            return;
        }
        // 保存新的倍率设置
        if (!player.cheat) player.cheat = { offlineMultiplier: 1 };
        player.cheat.offlineMultiplier = newMult;
        saveGameData();
        updateCheatUI();
    });
}
