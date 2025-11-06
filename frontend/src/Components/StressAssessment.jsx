
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Alert, AlertDescription } from '../ui/Alert';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { useAssessment } from '../hooks/useAssessment';
import { CheckCircle, AlertCircle, Clock, TrendingUp, BarChart3, Trash2 } from 'lucide-react';

const StressAssessment = ({ isPopup = false, onAssessmentComplete }) => {
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
    getTodayAssessments,
    getAssessmentStats,
    deleteAssessment,
    clearError
  } = useAssessment();

  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        await Promise.allSettled([
          getAssessmentHistory(),
          getFiveDayAverages(),
          getAssessmentStats(),
          getTodayAssessments()
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadData();
  }, []);

  const handleStartAssessment = async (type) => {
    try {
      clearError();
      await getQuestions(type);
      setCurrentAssessment(type);
      setCurrentQuestion(0);
      setResponses([]);
      setShowQuiz(true);
    } catch (error) {
      console.error('Failed to start assessment:', error);
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
      await submitAssessment(currentAssessment, responses);
      setShowQuiz(false);
      setCurrentAssessment(null);

      // Refresh data
      getAssessmentHistory();
      getFiveDayAverages();
      getAssessmentStats();
      getTodayAssessments();

      // Notify parent component
      if (onAssessmentComplete) {
        onAssessmentComplete();
      }
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    }
  };

  const handleDeleteAssessment = async (id) => {
    if (window.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      try {
        await deleteAssessment(id);
        // Data will be refreshed automatically in the deleteAssessment function
      } catch (error) {
        console.error('Failed to delete assessment:', error);
      }
    }
  };

  const getScoreInterpretation = (score, type) => {
    if (type === 'GAD-7') {
      if (score <= 4) return { level: 'Minimal', color: 'bg-green-100 text-green-800' };
      if (score <= 9) return { level: 'Mild', color: 'bg-yellow-100 text-yellow-800' };
      if (score <= 14) return { level: 'Moderate', color: 'bg-orange-100 text-orange-800' };
      return { level: 'Severe', color: 'bg-red-100 text-red-800' };
    } else if (type === 'PHQ-9') {
      if (score <= 4) return { level: 'Minimal', color: 'bg-green-100 text-green-800' };
      if (score <= 9) return { level: 'Mild', color: 'bg-yellow-100 text-yellow-800' };
      if (score <= 14) return { level: 'Moderate', color: 'bg-orange-100 text-orange-800' };
      if (score <= 19) return { level: 'Moderately Severe', color: 'bg-red-100 text-red-800' };
      return { level: 'Severe', color: 'bg-red-100 text-red-800' };
    }
    return { level: 'Unknown', color: 'bg-gray-100 text-gray-800' };
  };

  const renderQuiz = () => {
    if (!showQuiz) return null;
    if (!questions || questions.length === 0) {
      return (
        <div className="flex items-center justify-center py-8">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-6">
              <div className="text-center">
                <p>Loading questions...</p>
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
              <CardTitle className="text-xl">
                {currentAssessment} Assessment
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowQuiz(false);
                    setCurrentAssessment(null);
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* 5-Day Averages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            5-Day Averages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fiveDayAverages && fiveDayAverages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fiveDayAverages.map((average) => {
                const interpretation = getScoreInterpretation(average.fiveDayAverage, average.type);
                return (
                  <div key={average.type} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{average.type}</h4>
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
              <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No averages available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete some assessments to see your 5-day averages.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-6 border rounded-lg">
              <h4 className="font-semibold mb-2">Anxiety Assessment (GAD-7)</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Assess your anxiety levels over the past 2 weeks
              </p>
              {todayAssessments['GAD-7'] && todayAssessments['GAD-7'].score !== undefined ? (
                <div className="space-y-2">
                  <Button disabled className="w-full">
                    Already Completed Today
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Score: {todayAssessments['GAD-7'].score}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={() => handleStartAssessment('GAD-7')}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Start GAD-7'}
                </Button>
              )}
            </div>
            <div className="text-center p-6 border rounded-lg">
              <h4 className="font-semibold mb-2">Depression Assessment (PHQ-9)</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Assess your depression levels over the past 2 weeks
              </p>
              {todayAssessments['PHQ-9'] && todayAssessments['PHQ-9'].score !== undefined ? (
                <div className="space-y-2">
                  <Button disabled className="w-full">
                    Already Completed Today
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Score: {todayAssessments['PHQ-9'].score}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={() => handleStartAssessment('PHQ-9')}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Start PHQ-9'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Assessment Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats && stats.totalAssessments > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalAssessments}</div>
                <div className="text-sm text-muted-foreground">Total Assessments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.highestScore}</div>
                <div className="text-sm text-muted-foreground">Highest Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.lowestScore}</div>
                <div className="text-sm text-muted-foreground">Lowest Score</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No statistics available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete some assessments to see your statistics.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderHistory = () => {
    const filteredAssessments = (assessmentHistory || []).filter(
      assessment => activeTab === 'all' || assessment.type === activeTab
    );

    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
          >
            All
          </Button>
          <Button
            variant={activeTab === 'GAD-7' ? 'default' : 'outline'}
            onClick={() => setActiveTab('GAD-7')}
          >
            GAD-7
          </Button>
          <Button
            variant={activeTab === 'PHQ-9' ? 'default' : 'outline'}
            onClick={() => setActiveTab('PHQ-9')}
          >
            PHQ-9
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Loading history...</p>
            </div>
          </div>
        ) : filteredAssessments.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No assessments found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {activeTab === 'all'
                ? 'You haven\'t completed any assessments yet.'
                : `You haven\'t completed any ${activeTab} assessments yet.`}
            </p>
            <Button onClick={() => setActiveTab('overview')}>
              Take Your First Assessment
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAssessments.map((assessment) => {
              const interpretation = getScoreInterpretation(assessment.score, assessment.type);
              return (
                <Card key={assessment._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{assessment.type}</h4>
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

  if (loading && !showQuiz) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Stress Assessment</h2>
          <p className="text-muted-foreground">
            Monitor your mental health with validated assessments
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

export default StressAssessment;
