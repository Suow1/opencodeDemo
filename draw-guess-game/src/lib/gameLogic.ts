// Word categories for the drawing game
export const wordCategories = {
  animals: [
    '猫', '狗', '鸟', '鱼', '兔子', '老虎', '狮子', '大象', '熊猫', '猴子',
    '蛇', '马', '牛', '羊', '猪', '鸡', '鸭', '蝴蝶', '蜜蜂', '乌龟'
  ],
  food: [
    '苹果', '香蕉', '西瓜', '草莓', '蛋糕', '披萨', '汉堡', '冰淇淋', '面包', '鸡蛋',
    '米饭', '面条', '饺子', '包子', '葡萄', '橙子', '胡萝卜', '西红柿', '玉米', '薯条'
  ],
  objects: [
    '房子', '汽车', '飞机', '轮船', '自行车', '电视', '电脑', '手机', '书', '钟表',
    '伞', '眼镜', '帽子', '鞋子', '椅子', '桌子', '灯泡', '钥匙', '杯子', '相机'
  ],
  nature: [
    '太阳', '月亮', '星星', '云朵', '彩虹', '山', '河流', '大海', '树', '花',
    '草', '雪花', '雨滴', '闪电', '火', '沙漠', '瀑布', '火山', '岛屿', '森林'
  ],
  people: [
    '医生', '警察', '老师', '厨师', '消防员', '宇航员', '农民', '画家', '歌手', '运动员',
    '护士', '司机', '飞行员', '科学家', '工人', '学生', '舞蹈家', '魔术师', '小丑', '超人'
  ],
  activities: [
    '跑步', '游泳', '踢足球', '打篮球', '弹钢琴', '画画', '唱歌', '跳舞', '钓鱼', '滑雪',
    '骑马', '开车', '飞行', '做饭', '睡觉', '读书', '写字', '打电话', '拍照', '购物'
  ]
};

// Get all words as a flat array
export const getAllWords = (): string[] => {
  return Object.values(wordCategories).flat();
};

// Get a random word from all categories
export const getRandomWord = (): { word: string; category: string } => {
  const categories = Object.keys(wordCategories) as (keyof typeof wordCategories)[];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const words = wordCategories[randomCategory];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  
  return { word: randomWord, category: randomCategory };
};

// Get words from a specific category
export const getWordsByCategory = (category: keyof typeof wordCategories): string[] => {
  return wordCategories[category] || [];
};

// Simulated AI Guesser class
export class SimulatedAI {
  private targetWord: string;
  private allWords: string[];
  private guessedWords: Set<string>;
  private guessCount: number;
  private maxGuesses: number;
  private hintLevel: number;

  constructor(targetWord: string) {
    this.targetWord = targetWord;
    this.allWords = getAllWords();
    this.guessedWords = new Set();
    this.guessCount = 0;
    this.maxGuesses = 15;
    this.hintLevel = 0;
  }

  // Get similar words based on the target word's category
  private getSimilarWords(): string[] {
    for (const [category, words] of Object.entries(wordCategories)) {
      if (words.includes(this.targetWord)) {
        return words.filter(w => w !== this.targetWord);
      }
    }
    return [];
  }

  // Generate a guess based on drawing progress
  makeGuess(drawingProgress: number): { guess: string; confidence: number; isCorrect: boolean } {
    this.guessCount++;
    
    // Calculate base probability of correct guess
    // Increases with drawing progress and guess count
    const progressFactor = drawingProgress / 100;
    const guessFactor = this.guessCount / this.maxGuesses;
    const correctProbability = Math.min(0.95, progressFactor * 0.3 + guessFactor * 0.7);
    
    // Determine if this guess should be correct
    const shouldBeCorrect = Math.random() < correctProbability && this.guessCount >= 3;
    
    if (shouldBeCorrect) {
      return {
        guess: this.targetWord,
        confidence: Math.floor(80 + Math.random() * 20),
        isCorrect: true
      };
    }

    // Generate a wrong guess
    let possibleGuesses: string[];
    
    if (this.guessCount <= 2) {
      // Early guesses: random words
      possibleGuesses = this.allWords.filter(w => !this.guessedWords.has(w) && w !== this.targetWord);
    } else if (this.guessCount <= 5) {
      // Middle guesses: mix of random and similar
      const similar = this.getSimilarWords();
      possibleGuesses = [...similar, ...this.allWords.slice(0, 20)]
        .filter(w => !this.guessedWords.has(w) && w !== this.targetWord);
    } else {
      // Later guesses: mostly similar words (getting "warmer")
      possibleGuesses = this.getSimilarWords()
        .filter(w => !this.guessedWords.has(w));
      
      if (possibleGuesses.length === 0) {
        possibleGuesses = this.allWords.filter(w => !this.guessedWords.has(w) && w !== this.targetWord);
      }
    }

    if (possibleGuesses.length === 0) {
      // If we've guessed everything, give the correct answer
      return {
        guess: this.targetWord,
        confidence: 95,
        isCorrect: true
      };
    }

    const guess = possibleGuesses[Math.floor(Math.random() * possibleGuesses.length)];
    this.guessedWords.add(guess);

    // Calculate confidence based on progress
    const confidence = Math.floor(30 + progressFactor * 40 + Math.random() * 20);

    return {
      guess,
      confidence: Math.min(75, confidence),
      isCorrect: false
    };
  }

  // Get a hint about the target word
  getHint(): string {
    this.hintLevel++;
    
    switch (this.hintLevel) {
      case 1:
        // Category hint
        for (const [category, words] of Object.entries(wordCategories)) {
          if (words.includes(this.targetWord)) {
            const categoryNames: Record<string, string> = {
              animals: '动物',
              food: '食物',
              objects: '物品',
              nature: '自然',
              people: '人物',
              activities: '活动'
            };
            return `这是一个${categoryNames[category]}`;
          }
        }
        return '提示不可用';
      
      case 2:
        // Length hint
        return `这个词有 ${this.targetWord.length} 个字`;
      
      case 3:
        // First character hint
        return `第一个字是"${this.targetWord[0]}"`;
      
      default:
        // More characters
        const revealCount = Math.min(this.hintLevel - 2, this.targetWord.length - 1);
        return `开头是"${this.targetWord.substring(0, revealCount)}"`;
    }
  }

  reset(newWord: string) {
    this.targetWord = newWord;
    this.guessedWords.clear();
    this.guessCount = 0;
    this.hintLevel = 0;
  }
}
