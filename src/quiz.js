import React, { useState } from 'react';
import "./css/quiz.css";

function Quiz() {
  // 测验数据
  const questions = [
    {
      question: "React是什么？",
      options: [
        "一个JavaScript框架",
        "一个数据库管理系统",
        "一个编程语言",
        "一个UI库"
      ],
      correctAnswer: 3 // 选项索引从0开始
    },
    {
      question: "JSX是什么？",
      options: [
        "一种数据库查询语言",
        "JavaScript的扩展语法",
        "一种新的编程语言",
        "一种样式表语言"
      ],
      correctAnswer: 1
    },
    {
      question: "React组件名称必须以什么开头？",
      options: [
        "小写字母",
        "数字",
        "下划线",
        "大写字母"
      ],
      correctAnswer: 3
    }
  ];

  // 状态管理
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  // 处理答案选择
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (!submitted) {
      const newAnswers = [...userAnswers];
      newAnswers[questionIndex] = optionIndex;
      setUserAnswers(newAnswers);
    }
  };

  // 计算正确率
  const calculateScore = () => {
    const correctCount = questions.reduce((count, question, index) => {
      return count + (userAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    return Math.round((correctCount / questions.length) * 100);
  };

  // 提交处理
  const handleSubmit = () => {
    setSubmitted(true);
  };

  // 重置测验
  const handleReset = () => {
    setUserAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
  };

  return (
    <div className="quiz-container">
      <h1>知识测验</h1>
      
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="question-card">
          <h2>{qIndex + 1}. {question.question}</h2>
          
          <div className="options-container">
            {question.options.map((option, oIndex) => (
              <div 
                key={oIndex} 
                className={`option ${userAnswers[qIndex] === oIndex ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(qIndex, oIndex)}
              >
                <span className="option-letter">{String.fromCharCode(65 + oIndex)}.</span>
                {option}
                {submitted && userAnswers[qIndex] === oIndex && (
                  <span className="feedback">
                    {oIndex === question.correctAnswer ? " ✓ 正确" : " ✗ 错误"}
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {submitted && (
            <div className="correct-answer">
              正确答案: {String.fromCharCode(65 + question.correctAnswer)}. {
                question.options[question.correctAnswer]
              }
            </div>
          )}
        </div>
      ))}
      
      {!submitted ? (
        <button 
          onClick={handleSubmit} 
          disabled={userAnswers.some(answer => answer === null)}
          className="submit-btn"
        >
          提交答案
        </button>
      ) : (
        <div className="results">
          <h2>您的得分: {calculateScore()}%</h2>
          <button onClick={handleReset} className="reset-btn">
            重新测验
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;