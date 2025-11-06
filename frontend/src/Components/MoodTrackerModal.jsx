import React, { useState, useEffect } from 'react';
import { X, Smile, Meh, Frown, Heart } from 'lucide-react';
import { Button } from '../ui/Button';

const MoodTrackerModal = ({ isOpen, onClose, onSubmit, todaysMood = null }) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodOptions = [
    { value: 'excellent', emoji: '😊', label: 'Excellent', color: 'text-green-500' },
    { value: 'good', emoji: '🙂', label: 'Good', color: 'text-blue-500' },
    { value: 'neutral', emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
    { value: 'bad', emoji: '😞', label: 'Bad', color: 'text-orange-500' },
    { value: 'terrible', emoji: '😢', label: 'Terrible', color: 'text-red-500' }
  ];

  useEffect(() => {
    if (todaysMood) {
      setSelectedMood(todaysMood.mood);
      setNote(todaysMood.note || '');
    } else {
      setSelectedMood('');
      setNote('');
    }
  }, [todaysMood, isOpen]);

  const handleSubmit = async () => {
    if (!selectedMood) return;

    setIsSubmitting(true);
    try {
      const moodData = {
        mood: selectedMood,
        moodEmoji: moodOptions.find(m => m.value === selectedMood)?.emoji || '',
        note: note.trim()
      };

      await onSubmit(moodData);
      onClose();
    } catch (error) {
      console.error('Error submitting mood:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {todaysMood ? 'Update Today\'s Mood' : 'How are you feeling today?'}
              </h2>
              <p className="text-sm text-slate-500">
                {todaysMood ? 'Update your mood for today' : 'Track your daily mood to monitor your wellbeing'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Mood Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Select your mood
          </label>
          <div className="grid grid-cols-5 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                  selectedMood === mood.value
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className={`text-xs font-medium ${mood.color}`}>
                  {mood.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Note Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Add a note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How are you feeling? What's on your mind?"
            className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-slate-500 mt-1">
            {note.length}/500 characters
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            disabled={!selectedMood || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : todaysMood ? 'Update Mood' : 'Save Mood'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MoodTrackerModal;