import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Alert, AlertDescription } from '../ui/Alert';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { useAssessment } from '../hooks/useAssessment';
import { CheckCircle, AlertCircle, Clock, TrendingUp, BarChart3, Trash2, Brain } from 'lucide-react';

const NeuroAssessment = ({ onAssessmentComplete }) => {
  const {
    questions,
    loading,
    error,
    assessmentHistory,
    fiveDayAverages,
    todayAssessments,
    stats,
    getQuestions,
    submitAssessment,
    getAssessmentHistory,
    getFiveDayAverages,
    getTodayAssessment,
    getAssessmentStats,
    deleteAssessment,
    clearError
  } = useAssessment();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const dataLoadedRef = useRef(false);
  const maxRetries = 3;

  useEffect(() => {
    // Load initial data for Neuro assessments only - with reduced concurrent calls
    const loadData = async () => {
      if (dataLoadedRef.current) return; // Prevent multiple loads

      try {
       
        // Load data sequentially to avoid overwhelming the server
        await getAssessmentHistory('Neuro', 10);
        await new Promise(resolve => setTimeout(resolve, 300)); // Increased delay

        await getFiveDayAverages();
        await new Promise(resolve => setTimeout(resolve, 300)); // Increased delay

        await getAssessmentStats('Neuro', 30);
        await new Promise(resolve => setTimeout(resolve, 300)); // Increased delay

        await getTodayAssessment('Neuro');

        dataLoadedRef.current = true;
        setRetryCount(0); // Reset retry count on success
      } catch (error) {
        console.error('Error loading initial Neuro data:', error);
        // Retry logic
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            dataLoadedRef.current = false; // Allow retry
          }, 2000); // Wait 2 seconds before retry
        } else {
          console.error('Max retries reached. Unable to load Neuro assessment data.');
        }
      }
    };

    loadData();
  }, [getAssessmentHistory, getFiveDayAverages, getAssessmentStats, getTodayAssessment, retryCount]);

  const handleStartAssessment = async () => {
    try {
      clearError();
      await getQuestions('Neuro');
      setCurrentQuestion(0);
      setResponses([]);
      setShowQuiz(true);
    } catch (error) {
      console.error('Failed to start Neuro assessment:', error);
    }
  };

  const handleAnswer = (value) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Assessment completed
      handleSubmitAssessment();
    }
  };

  const handleSubmitAssessment = async () => {
    try {
      await submitAssessment('Neuro', responses);
      setShowQuiz(false);

      // Refresh data
      getAssessmentHistory('Neuro', 10);
      getFiveDayAverages();
      getAssessmentStats('Neuro', 30);
      getTodayAssessment('Neuro');

      // Notify parent component
      if (onAssessmentComplete) {
        onAssessmentComplete();
      }
    } catch (error) {
      console.error('Failed to submit Neuro assessment:', error);
    }
  };

  const handleDeleteAssessment = async (id) => {
    if (window.confirm('Are you sure you want to delete this Neuro assessment? This action cannot be undone.')) {
      try {
        await deleteAssessment(id);
        // Data will be refreshed automatically in the deleteAssessment function
      } catch (error) {
        console.error('Failed to delete assessment:', error);
      }
    }
  };

  const getScoreInterpretation = (score) => {
    if (score <= 9) return { level: 'Minimal', color: 'bg-green-100 text-green-800' };
    if (score <= 19) return { level: 'Mild', color: 'bg-yellow-100 text-yellow-800' };
    if (score <= 29) return { level: 'Moderate', color: 'bg-orange-100 text-orange-800' };
    if (score <= 39) return { level: 'Moderately Severe', color: 'bg-red-100 text-red-800' };
    return { level: 'Severe', color: 'bg-red-100 text-red-800' };
  };

  const renderQuiz = () => {
    if (!showQuiz) return null;
    if (!questions || questions.length === 0) {
      return (
        <div className="flex items-center justify-center py-8">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-6">
              <div className="text-center">
                <Brain className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                <p>Loading Neuro assessment questions...</p>
                {loading && <p>Please wait...</p>}
                {error && <p className="text-red-500">{error}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    if (!questions[currentQuestion]) return null;

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="flex items-center justify-center py-4">
        <Card className="w-full max-w-2xl max-h-[70vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                Neuro Assessment
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowQuiz(false);
                    setCurrentQuestion(0);
                    setResponses([]);
                  }}
                >
                  Cancel
                </Button>
                <Badge variant="outline">
                  {currentQuestion + 1} of {questions.length}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {question.questionText}
              </h3>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto p-4 text-left"
                    onClick={() => handleAnswer(option.value)}
                  >
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        Score: {option.value}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOverview = () => {
    // Filter data for Neuro assessments only
    const neuroAverages = fiveDayAverages?.filter(avg => avg.type === 'Neuro') || [];
    const neuroStats = stats ? {
      ...stats,
      totalAssessments: assessmentHistory?.filter(a => a.type === 'Neuro').length || 0,
      averageScore: assessmentHistory?.filter(a => a.type === 'Neuro').reduce((sum, a) => sum + a.score, 0) / (assessmentHistory?.filter(a => a.type === 'Neuro').length || 1),
      highestScore: Math.max(...(assessmentHistory?.filter(a => a.type === 'Neuro').map(a => a.score) || [0])),
      lowestScore: Math.min(...(assessmentHistory?.filter(a => a.type === 'Neuro').map(a => a.score) || [0]))
    } : null;

    return (
      <div className="space-y-6">
        {/* 5-Day Averages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              5-Day Neuro Assessment Averages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {neuroAverages.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {neuroAverages.map((average) => {
                  const interpretation = getScoreInterpretation(average.fiveDayAverage);
                  return (
                    <div key={average.type} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Brain className="w-4 h-4 text-blue-500" />
                          Neuro Assessment
                        </h4>
                        <Badge className={interpretation.color}>
                          {interpretation.level}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">{average.fiveDayAverage.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">
                        Last 5 scores: {average.lastFiveScores.join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No Neuro averages available</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete some Neuro assessments to see your 5-day averages.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              Neuro Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                Neurological Health Assessment
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Assess your neurological health indicators and cognitive function
              </p>
              {todayAssessments['Neuro'] && todayAssessments['Neuro'].score !== undefined ? (
                <div className="space-y-2">
                  <Button disabled className="w-full">
                    Already Completed Today
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Score: {todayAssessments['Neuro'].score}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleStartAssessment}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Start Neuro Assessment'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Neuro Assessment Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {neuroStats && neuroStats.totalAssessments > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{neuroStats.totalAssessments}</div>
                  <div className="text-sm text-muted-foreground">Total Assessments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{neuroStats.averageScore.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{neuroStats.highestScore}</div>
                  <div className="text-sm text-muted-foreground">Highest Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{neuroStats.lowestScore}</div>
                  <div className="text-sm text-muted-foreground">Lowest Score</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No Neuro statistics available</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete some Neuro assessments to see your statistics.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderHistory = () => {
    const neuroAssessments = (assessmentHistory || []).filter(
      assessment => assessment.type === 'Neuro'
    );

    return (
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Brain className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p>Loading Neuro assessment history...</p>
            </div>
          </div>
        ) : neuroAssessments.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No Neuro assessments found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You haven't completed any Neuro assessments yet.
            </p>
            <Button onClick={handleStartAssessment}>
              Take Your First Neuro Assessment
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {neuroAssessments.map((assessment) => {
              const interpretation = getScoreInterpretation(assessment.score);
              return (
                <Card key={assessment._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Brain className="w-4 h-4 text-blue-500" />
                            Neuro Assessment
                          </h4>
                          <Badge className={interpretation.color}>
                            {interpretation.level}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(assessment.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold">{assessment.score}</div>
                          <div className="text-sm text-muted-foreground">Score</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAssessment(assessment._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (loading && !showQuiz && !dataLoadedRef.current) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p>Loading Neuro Assessment...</p>
          {retryCount > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Retrying... ({retryCount}/{maxRetries})
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error && !dataLoadedRef.current && retryCount >= maxRetries) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 mb-4">Failed to load Neuro assessment data</p>
          <Button
            onClick={() => {
              dataLoadedRef.current = false;
              setRetryCount(0);
            }}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-500" />
            Neuro Assessment
          </h2>
          <p className="text-muted-foreground">
            Monitor your neurological health and cognitive function
          </p>
        </div>
      </div>

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showQuiz ? (
        renderQuiz()
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            {renderOverview()}
          </TabsContent>
          <TabsContent value="history" className="space-y-4">
            {renderHistory()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default NeuroAssessment;