'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import DrawingCanvas from './DrawingCanvas';
import { SimulatedAI, getRandomWord } from '@/lib/gameLogic';

type GameState = 'idle' | 'playing' | 'won' | 'lost';

interface GuessRecord {
  guess: string;
  confidence: number;
  isCorrect: boolean;
  timestamp: number;
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentWord, setCurrentWord] = useState<{ word: string; category: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [drawingProgress, setDrawingProgress] = useState(0);
  const [showWord, setShowWord] = useState(false);
  
  const aiRef = useRef<SimulatedAI | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const guessTimerRef = useRef<NodeJS.Timeout | null>(null);
  const strokeCountRef = useRef(0);

  const categoryNames: Record<string, string> = {
    animals: '动物',
    food: '食物',
    objects: '物品',
    nature: '自然',
    people: '人物',
    activities: '活动'
  };

  // Start a new game
  const startGame = useCallback(() => {
    const wordInfo = getRandomWord();
    setCurrentWord(wordInfo);
    setGameState('playing');
    setTimeLeft(60);
    setGuesses([]);
    setDrawingProgress(0);
    setShowWord(false);
    strokeCountRef.current = 0;
    
    aiRef.current = new SimulatedAI(wordInfo.word);
  }, []);

  // Handle drawing progress
  const handleDraw = useCallback(() => {
    if (gameState !== 'playing') return;
    
    strokeCountRef.current++;
    // Progress increases with strokes, max 100
    const newProgress = Math.min(100, strokeCountRef.current * 2);
    setDrawingProgress(newProgress);
  }, [gameState]);

  // AI makes a guess
  const makeAIGuess = useCallback(() => {
    if (!aiRef.current || gameState !== 'playing') return;
    
    const result = aiRef.current.makeGuess(drawingProgress);
    
    setGuesses(prev => [...prev, {
      ...result,
      timestamp: Date.now()
    }]);

    if (result.isCorrect) {
      // AI guessed correctly!
      setGameState('won');
      const timeBonus = timeLeft * 10;
      const roundBonus = round * 50;
      setScore(prev => prev + timeBonus + roundBonus);
    }
  }, [gameState, drawingProgress, timeLeft, round]);

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // AI guessing timer - guesses every 2-4 seconds when there's drawing progress
  useEffect(() => {
    if (gameState !== 'playing' || drawingProgress < 10) {
      if (guessTimerRef.current) clearTimeout(guessTimerRef.current);
      return;
    }

    const scheduleNextGuess = () => {
      const delay = 2000 + Math.random() * 2000; // 2-4 seconds
      guessTimerRef.current = setTimeout(() => {
        makeAIGuess();
        if (gameState === 'playing') {
          scheduleNextGuess();
        }
      }, delay);
    };

    scheduleNextGuess();

    return () => {
      if (guessTimerRef.current) clearTimeout(guessTimerRef.current);
    };
  }, [gameState, drawingProgress, makeAIGuess]);

  // Next round
  const nextRound = useCallback(() => {
    setRound(prev => prev + 1);
    startGame();
  }, [startGame]);

  // Reset game
  const resetGame = useCallback(() => {
    setScore(0);
    setRound(1);
    startGame();
  }, [startGame]);

  // Get hint
  const getHint = useCallback(() => {
    if (!aiRef.current) return;
    // Using hint costs points
    setScore(prev => Math.max(0, prev - 50));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
            AI 你画我猜
          </h1>
          <p className="text-white/80">画出题目，让AI来猜！</p>
        </div>

        {/* Game Stats Bar */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6 flex justify-between items-center">
          <div className="flex gap-6">
            <div className="text-white">
              <span className="text-sm opacity-80">得分</span>
              <p className="text-2xl font-bold">{score}</p>
            </div>
            <div className="text-white">
              <span className="text-sm opacity-80">回合</span>
              <p className="text-2xl font-bold">{round}</p>
            </div>
          </div>
          
          {gameState === 'playing' && (
            <div className={`text-white text-center ${timeLeft <= 10 ? 'animate-pulse text-red-300' : ''}`}>
              <span className="text-sm opacity-80">剩余时间</span>
              <p className="text-3xl font-bold">{timeLeft}s</p>
            </div>
          )}

          <div className="text-white text-right">
            <span className="text-sm opacity-80">绘画进度</span>
            <div className="w-32 h-3 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-400 transition-all duration-300"
                style={{ width: `${drawingProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Drawing Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              {gameState === 'idle' ? (
                <div className="flex flex-col items-center justify-center h-[500px]">
                  <div className="text-6xl mb-6">🎨</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">准备好了吗？</h2>
                  <p className="text-gray-600 mb-8 text-center max-w-md">
                    系统会给你一个词语，你需要把它画出来。<br/>
                    AI会尝试猜出你画的是什么！
                  </p>
                  <button
                    onClick={startGame}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                  >
                    开始游戏
                  </button>
                </div>
              ) : (
                <>
                  {/* Word to draw */}
                  {currentWord && (
                    <div className="mb-4 text-center">
                      <p className="text-sm text-gray-500 mb-1">
                        请画出 ({categoryNames[currentWord.category]})
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <p className={`text-3xl font-bold ${showWord ? 'text-purple-600' : 'text-purple-600'}`}>
                          {showWord || gameState !== 'playing' ? currentWord.word : '🔒 点击显示'}
                        </p>
                        {gameState === 'playing' && !showWord && (
                          <button
                            onClick={() => setShowWord(true)}
                            className="px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                          >
                            显示题目
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <DrawingCanvas 
                    onDraw={handleDraw}
                    disabled={gameState !== 'playing'}
                  />

                  {/* Game Over Overlay */}
                  {(gameState === 'won' || gameState === 'lost') && (
                    <div className="mt-6 text-center">
                      <div className={`text-2xl font-bold mb-4 ${gameState === 'won' ? 'text-green-500' : 'text-red-500'}`}>
                        {gameState === 'won' ? '🎉 AI猜对了！' : '⏰ 时间到！'}
                      </div>
                      <p className="text-gray-600 mb-4">
                        正确答案: <span className="font-bold text-purple-600">{currentWord?.word}</span>
                      </p>
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={nextRound}
                          className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-xl hover:opacity-90"
                        >
                          下一题
                        </button>
                        <button
                          onClick={resetGame}
                          className="px-6 py-3 bg-gray-500 text-white font-bold rounded-xl hover:opacity-90"
                        >
                          重新开始
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* AI Guesses Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-6 h-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🤖</span> AI的猜测
              </h3>
              
              {gameState === 'idle' ? (
                <div className="text-center text-gray-400 py-12">
                  <div className="text-4xl mb-3">💭</div>
                  <p>开始游戏后，AI会尝试猜出你画的内容</p>
                </div>
              ) : guesses.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <div className="text-4xl mb-3 animate-bounce">✏️</div>
                  <p>开始画画吧！<br/>AI正在观察...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {guesses.slice().reverse().map((guess, index) => (
                    <div
                      key={guesses.length - 1 - index}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        guess.isCorrect
                          ? 'bg-green-50 border-green-400'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-bold text-lg ${
                          guess.isCorrect ? 'text-green-600' : 'text-gray-700'
                        }`}>
                          {guess.isCorrect && '✅ '}{guess.guess}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          guess.confidence >= 70 
                            ? 'bg-green-100 text-green-600'
                            : guess.confidence >= 40
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {guess.confidence}% 确信
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats */}
              {guesses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    AI已猜测 {guesses.length} 次
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white text-center text-sm">
          <p>💡 提示: 画得越清晰，AI猜对的概率越高！尽量在时间内让AI猜出你画的内容。</p>
        </div>
      </div>
    </div>
  );
}
