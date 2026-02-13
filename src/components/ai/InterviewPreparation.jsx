import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, Loader2, Brain, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function InterviewPreparation({ resumeData }) {
  const [jobDescription, setJobDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [mockMode, setMockMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [analyzingAnswer, setAnalyzingAnswer] = useState(false);

  const generateQuestions = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate comprehensive interview questions based on this job description and resume:

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
Name: ${resumeData?.contact?.fullName}
Summary: ${resumeData?.summary}
Experience: ${JSON.stringify(resumeData?.experience)}
Education: ${JSON.stringify(resumeData?.education)}
Skills: ${resumeData?.skills?.join(', ')}

Generate 15 interview questions across these categories:
1. **Behavioral** (5 questions) - STAR method questions about past experiences
2. **Technical** (5 questions) - Role-specific technical/skill questions
3. **Situational** (5 questions) - Hypothetical scenarios related to the job

For each question, provide:
- The question text
- Category (behavioral/technical/situational)
- Difficulty level (easy/medium/hard)
- Key points to cover in a good answer
- Common mistakes to avoid

Make questions specific to the job requirements and candidate background.`,
        response_json_schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  category: { type: "string" },
                  difficulty: { type: "string" },
                  keyPoints: { type: "array", items: { type: "string" } },
                  commonMistakes: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      setQuestions(result.questions || []);
      toast.success(`Generated ${result.questions?.length} questions!`);
    } catch (error) {
      console.error('Question generation error:', error);
      toast.error('Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  };

  const analyzeAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please provide your answer');
      return;
    }

    setAnalyzingAnswer(true);
    try {
      const question = questions[currentQuestion];
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this interview answer and provide detailed feedback:

QUESTION: ${question.question}
CATEGORY: ${question.category}
KEY POINTS TO COVER: ${question.keyPoints.join(', ')}
COMMON MISTAKES: ${question.commonMistakes.join(', ')}

CANDIDATE'S ANSWER:
${userAnswer}

Provide detailed feedback including:
1. Overall score (1-10)
2. Strengths in the answer
3. Areas for improvement
4. Missing key points
5. Structure/delivery suggestions
6. An improved version of the answer

Be constructive and specific.`,
        response_json_schema: {
          type: "object",
          properties: {
            score: { type: "number" },
            strengths: { type: "array", items: { type: "string" } },
            improvements: { type: "array", items: { type: "string" } },
            missingPoints: { type: "array", items: { type: "string" } },
            deliverySuggestions: { type: "string" },
            improvedAnswer: { type: "string" }
          }
        }
      });

      setFeedback(result);
      toast.success('Feedback ready!');
    } catch (error) {
      console.error('Answer analysis error:', error);
      toast.error('Failed to analyze answer');
    } finally {
      setAnalyzingAnswer(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer('');
      setFeedback(null);
    } else {
      setMockMode(false);
      toast.success('Mock interview complete!');
    }
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  const categoryColors = {
    behavioral: 'bg-blue-100 text-blue-800',
    technical: 'bg-purple-100 text-purple-800',
    situational: 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Interview Preparation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!mockMode ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Target Job Description</label>
                <Textarea
                  placeholder="Paste the job description you're preparing for..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <Button
                onClick={generateQuestions}
                disabled={generating}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Interview Questions
                  </>
                )}
              </Button>

              {questions.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {questions.length} Questions Generated
                    </h3>
                    <Button
                      onClick={() => setMockMode(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Start Mock Interview
                    </Button>
                  </div>

                  <Tabs defaultValue="all">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                      <TabsTrigger value="technical">Technical</TabsTrigger>
                      <TabsTrigger value="situational">Situational</TabsTrigger>
                    </TabsList>

                    {['all', 'behavioral', 'technical', 'situational'].map((tab) => (
                      <TabsContent key={tab} value={tab} className="space-y-2">
                        {questions
                          .filter((q) => tab === 'all' || q.category === tab)
                          .map((q, idx) => (
                            <Card key={idx} className="p-3">
                              <div className="flex items-start gap-2 mb-2">
                                <Badge className={categoryColors[q.category]}>
                                  {q.category}
                                </Badge>
                                <Badge className={difficultyColors[q.difficulty]}>
                                  {q.difficulty}
                                </Badge>
                              </div>
                              <p className="font-medium mb-2">{q.question}</p>
                              <details className="text-xs text-muted-foreground">
                                <summary className="cursor-pointer hover:text-foreground">
                                  Show tips
                                </summary>
                                <div className="mt-2 space-y-1">
                                  <p className="font-medium">Key points to cover:</p>
                                  <ul className="list-disc list-inside">
                                    {q.keyPoints.map((point, i) => (
                                      <li key={i}>{point}</li>
                                    ))}
                                  </ul>
                                </div>
                              </details>
                            </Card>
                          ))}
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-red-500 animate-pulse" />
                  <span className="font-semibold">Mock Interview Mode</span>
                </div>
                <Badge variant="outline">
                  Question {currentQuestion + 1} of {questions.length}
                </Badge>
              </div>

              <Card className="p-4 bg-primary/5">
                <div className="flex gap-2 mb-3">
                  <Badge className={categoryColors[questions[currentQuestion].category]}>
                    {questions[currentQuestion].category}
                  </Badge>
                  <Badge className={difficultyColors[questions[currentQuestion].difficulty]}>
                    {questions[currentQuestion].difficulty}
                  </Badge>
                </div>
                <p className="text-lg font-medium">
                  {questions[currentQuestion].question}
                </p>
              </Card>

              <div>
                <label className="block text-sm font-medium mb-2">Your Answer</label>
                <Textarea
                  placeholder="Type your answer here... (Use the STAR method for behavioral questions: Situation, Task, Action, Result)"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={analyzeAnswer}
                  disabled={analyzingAnswer}
                  className="flex-1"
                >
                  {analyzingAnswer ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Get Feedback
                    </>
                  )}
                </Button>
                <Button onClick={nextQuestion} variant="outline">
                  Skip / Next
                </Button>
              </div>

              {feedback && (
                <Card className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      AI Feedback
                      <Badge className="ml-auto text-lg">{feedback.score}/10</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {feedback.strengths?.length > 0 && (
                      <div>
                        <p className="font-semibold text-sm flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Strengths
                        </p>
                        <ul className="space-y-1">
                          {feedback.strengths.map((s, idx) => (
                            <li key={idx} className="text-sm flex gap-2">
                              <span className="text-green-600">✓</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {feedback.improvements?.length > 0 && (
                      <div>
                        <p className="font-semibold text-sm flex items-center gap-2 mb-1">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          Areas for Improvement
                        </p>
                        <ul className="space-y-1">
                          {feedback.improvements.map((i, idx) => (
                            <li key={idx} className="text-sm flex gap-2">
                              <span className="text-orange-600">•</span>
                              <span>{i}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {feedback.missingPoints?.length > 0 && (
                      <div>
                        <p className="font-semibold text-sm mb-1">Missing Key Points:</p>
                        <ul className="space-y-1">
                          {feedback.missingPoints.map((p, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">
                              • {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {feedback.deliverySuggestions && (
                      <div>
                        <p className="font-semibold text-sm mb-1">Delivery Tips:</p>
                        <Card className="p-3 bg-background text-sm">
                          {feedback.deliverySuggestions}
                        </Card>
                      </div>
                    )}

                    {feedback.improvedAnswer && (
                      <div>
                        <p className="font-semibold text-sm mb-1">Improved Version:</p>
                        <Card className="p-3 bg-background text-sm">
                          {feedback.improvedAnswer}
                        </Card>
                      </div>
                    )}

                    <Button onClick={nextQuestion} className="w-full">
                      {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}