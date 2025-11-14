import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Alert, AlertDescription } from '../ui/Alert.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/TextArea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Avatar, AvatarFallback } from '../ui/Avatar.jsx';
import { useJournal } from '../hooks/useJournal.js';
import { useAuth } from '../hooks/useAuth.js';
import {
  BookOpen, CheckCircle, Edit, Send, Loader2, X, Trash2, Calendar
} from 'lucide-react';


const DailyJournal = ({
  className = "border-green-200",
  showAsCard = true,
  compact = false,
  fullManagement = false
}) => {
  const { user } = useAuth();
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [activeTab, setActiveTab] = useState('write');
  const [editingEntry, setEditingEntry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    todayEntry,
    entries,
    loading: journalLoading,
    error: journalError,
    pagination,
    getTodayEntry,
    getJournalEntries,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    clearError
  } = useJournal();

  // Journal form state
  const [journalForm, setJournalForm] = useState({
    content: '',
    mood: '',
    moodScore: 5,
    wellnessScore: 78,
    sleepHours: 8,
    stressLevel: 5
  });

  const moodOptions = [
    { emoji: '😊', label: 'Happy', value: 'happy', color: 'bg-green-100 text-green-800' },
    { emoji: '😐', label: 'Neutral', value: 'neutral', color: 'bg-yellow-100 text-yellow-800' },
    { emoji: '😔', label: 'Sad', value: 'sad', color: 'bg-blue-100 text-blue-800' },
    { emoji: '😰', label: 'Anxious', value: 'anxious', color: 'bg-orange-100 text-orange-800' },
    { emoji: '😡', label: 'Stressed', value: 'stressed', color: 'bg-red-100 text-red-800' }
  ];

  // Load data on component mount
  useEffect(() => {
    getTodayEntry();
    if (fullManagement) {
      getJournalEntries({ page: currentPage, limit: 10 });
    }
  }, [currentPage, fullManagement]);

  // Helper functions
  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: '😊',
      neutral: '😐',
      sad: '😔',
      anxious: '😰',
      stressed: '😡'
    };
    return moodMap[mood] || '😐';
  };

  const getMoodColor = (mood) => {
    const colorMap = {
      happy: 'bg-green-100 text-green-800',
      neutral: 'bg-yellow-100 text-yellow-800',
      sad: 'bg-blue-100 text-blue-800',
      anxious: 'bg-orange-100 text-orange-800',
      stressed: 'bg-red-100 text-red-800'
    };
    return colorMap[mood] || 'bg-gray-100 text-gray-800';
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setJournalForm({
      content: entry.content,
      mood: entry.mood,
      moodScore: entry.moodScore,
      wellnessScore: entry.wellnessScore,
      sleepHours: entry.sleepHours,
      stressLevel: entry.stressLevel
    });
    setShowJournalForm(true);
    setActiveTab('write');
  };

  const handleDeleteEntry = async (entryId) => {
    // Validate entryId
    if (!entryId || typeof entryId !== 'string' || entryId.length !== 24) {
      console.error('Invalid entry ID:', entryId);
      alert('Invalid journal entry ID. Please refresh the page and try again.');
      return;
    }

    // Check if entry exists in current entries list
    const entryExists = entries.some(entry => entry._id === entryId);
    if (!entryExists) {
      console.warn('Entry not found in current entries list:', entryId);
      alert('This journal entry is no longer available. The page will refresh to show current data.');
      // Refresh data
      await Promise.all([
        getJournalEntries({ page: currentPage, limit: 10 }),
        getTodayEntry(),
        getWeeklyProgress()
      ]);
      return;
    }

    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        console.log('Attempting to delete entry with ID:', entryId);
        await deleteJournalEntry(entryId);
        console.log('Successfully deleted entry, refreshing data...');

        // Refresh all data to ensure consistency
        await Promise.all([
          getJournalEntries({ page: currentPage, limit: 10 }),
          getTodayEntry(),
          getWeeklyProgress()
        ]);

        console.log('Data refreshed after deletion');
        alert('Journal entry deleted successfully!');
      } catch (err) {
        console.error('Failed to delete entry:', err);
        // Show user-friendly error message
        const errorMessage = err.message || 'Failed to delete the journal entry. It may have already been deleted or you may not have permission to delete it.';
        alert(errorMessage);
      }
    }
  };

  const handleJournalSubmit = async (e) => {
    e.preventDefault();

    try {
      const entryData = {
        content: journalForm.content,
        mood: journalForm.mood,
        moodScore: parseInt(journalForm.moodScore),
        wellnessScore: parseInt(journalForm.wellnessScore),
        sleepHours: parseFloat(journalForm.sleepHours),
        stressLevel: parseInt(journalForm.stressLevel)
      };

      if (editingEntry) {
        await updateJournalEntry(editingEntry._id, entryData);
      } else {
        await createJournalEntry(entryData);
      }

      // Reset form
      setJournalForm({
        content: '',
        mood: '',
        moodScore: 5,
        wellnessScore: 78,
        sleepHours: 8,
        stressLevel: 5
      });

      setShowJournalForm(false);
      setEditingEntry(null);
      // Refresh data
      getTodayEntry();
      if (fullManagement) {
        getJournalEntries({ page: currentPage, limit: 10 });
      }
    } catch (err) {
      console.error('Failed to save journal entry:', err);
    }
  };

  const JournalContent = () => {
    if (fullManagement) {
      return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">Write Journal</TabsTrigger>
            <TabsTrigger value="view">View All Journals</TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="space-y-4 mt-4">
            {todayEntry && !editingEntry ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-3" />
                <h3 className="text-lg font-medium mb-2">Journal Complete!</h3>
                <p className="text-gray-600 text-sm mb-4">
                  You've already written your journal entry for today.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                  <span>{todayEntry.mood && getMoodEmoji(todayEntry.mood)}</span>
                  <span>Mood: {todayEntry.moodScore}/10</span>
                  <span>•</span>
                  <span>Wellness: {todayEntry.wellnessScore}%</span>
                </div>
                <Button
                  onClick={() => handleEditEntry(todayEntry)}
                  variant="outline"
                  className="mr-2"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Today's Entry
                </Button>
                <Button
                  onClick={() => setActiveTab('view')}
                  variant="outline"
                >
                  View All Entries
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium mb-2">
                  {editingEntry ? 'Edit Journal Entry' : 'Write Today\'s Journal'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {editingEntry ? 'Update your journal entry.' : 'Take a few minutes to reflect on your day.'}
                </p>
                <Button
                  onClick={() => setShowJournalForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {editingEntry ? 'Edit Entry' : 'Write Journal'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="view" className="space-y-4 mt-4">
            {journalLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading journal entries...</span>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Journal Entries Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start your wellness journey by writing your first journal entry.
                </p>
                <Button onClick={() => setActiveTab('write')}>
                  Write First Entry
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Card key={entry._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {user?.firstName?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getTimeAgo(entry.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getMoodColor(entry.mood)}>
                            {getMoodEmoji(entry.mood)} {entry.mood}
                          </Badge>
                          <Badge variant="outline">
                            Score: {entry.wellnessScore}%
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{entry.content}</p>

                      <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-2 mb-3">
                        {entry.sleepHours && (
                          <div>Sleep: {entry.sleepHours} hours</div>
                        )}
                        {entry.stressLevel && (
                          <div>Stress Level: {entry.stressLevel}/10</div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditEntry(entry)}>
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteEntry(entry._id)}>
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Page {currentPage} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === pagination.pages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      );
    }

    // Simple mode (original functionality)
    return (
      <div className="space-y-4">
        {todayEntry ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-3" />
            <h3 className="text-lg font-medium mb-2">Journal Complete!</h3>
            <p className="text-gray-600 text-sm mb-4">
              You've already written your journal entry for today.
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-2">Write Today's Journal</h3>
            <p className="text-gray-600 text-sm mb-4">
              Take a few minutes to reflect on your day, emotions, and experiences.
            </p>
            <Button
              onClick={() => setShowJournalForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Write Journal
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (!showAsCard) {
    return (
      <>
        <JournalContent />

        {/* Journal Form Modal */}
        {showJournalForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  {editingEntry ? 'Edit Journal Entry' : 'Write Today\'s Journal'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowJournalForm(false);
                    setEditingEntry(null);
                    clearError();
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                {journalError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{journalError}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleJournalSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">How are you feeling today?</label>
                      <Select
                        value={journalForm.mood}
                        onValueChange={(value) => setJournalForm({ ...journalForm, mood: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your mood" />
                        </SelectTrigger>
                        <SelectContent>
                          {moodOptions.map((mood) => (
                            <SelectItem key={mood.value} value={mood.value}>
                              <span className="flex items-center gap-2">
                                <span>{mood.emoji}</span>
                                <span>{mood.label}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Mood Score (1-10)</label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={journalForm.moodScore}
                        onChange={(e) => setJournalForm({ ...journalForm, moodScore: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Today's Journal Entry</label>
                    <Textarea
                      placeholder="Write about your day, thoughts, feelings, or anything you'd like to reflect on..."
                      value={journalForm.content}
                      onChange={(e) => setJournalForm({ ...journalForm, content: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Wellness Score (0-100)</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={journalForm.wellnessScore}
                        onChange={(e) => setJournalForm({ ...journalForm, wellnessScore: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Hours of Sleep</label>
                      <Input
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={journalForm.sleepHours}
                        onChange={(e) => setJournalForm({ ...journalForm, sleepHours: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Stress Level (1-10)</label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={journalForm.stressLevel}
                        onChange={(e) => setJournalForm({ ...journalForm, stressLevel: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={journalLoading}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      {journalLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Save Journal Entry
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowJournalForm(false);
                        setEditingEntry(null);
                        clearError();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            Daily Journal
          </CardTitle>
          <CardDescription>Reflect on your day and track your mental wellness</CardDescription>
        </CardHeader>
        <CardContent>
          <JournalContent />
        </CardContent>
      </Card>

      {/* Journal Form Modal */}
      {showJournalForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                {editingEntry ? 'Edit Journal Entry' : 'Write Today\'s Journal'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowJournalForm(false);
                  setEditingEntry(null);
                  clearError();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {journalError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{journalError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleJournalSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">How are you feeling today?</label>
                    <Select
                      value={journalForm.mood}
                      onValueChange={(value) => setJournalForm({ ...journalForm, mood: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your mood" />
                      </SelectTrigger>
                      <SelectContent>
                        {moodOptions.map((mood) => (
                          <SelectItem key={mood.value} value={mood.value}>
                            <span className="flex items-center gap-2">
                              <span>{mood.emoji}</span>
                              <span>{mood.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Mood Score (1-10)</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={journalForm.moodScore}
                      onChange={(e) => setJournalForm({ ...journalForm, moodScore: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Today's Journal Entry</label>
                  <Textarea
                    placeholder="Write about your day, thoughts, feelings, or anything you'd like to reflect on..."
                    value={journalForm.content}
                    onChange={(e) => setJournalForm({ ...journalForm, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Wellness Score (0-100)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={journalForm.wellnessScore}
                      onChange={(e) => setJournalForm({ ...journalForm, wellnessScore: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Hours of Sleep</label>
                    <Input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={journalForm.sleepHours}
                      onChange={(e) => setJournalForm({ ...journalForm, sleepHours: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Stress Level (1-10)</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={journalForm.stressLevel}
                      onChange={(e) => setJournalForm({ ...journalForm, stressLevel: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={journalLoading}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    {journalLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Save Journal Entry
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowJournalForm(false);
                      setEditingEntry(null);
                      clearError();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DailyJournal;