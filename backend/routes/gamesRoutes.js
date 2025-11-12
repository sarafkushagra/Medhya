import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middlewares/auth.js';
import GameScore from '../models/gameScoreModel.js';

const router = express.Router();

// POST /games/score - Submit cognitive test scores
router.post('/score', protect, async (req, res) => {
  try {
    const { scores } = req.body;
    const userId = req.user._id;

    if (!scores || !Array.isArray(scores)) {
      return res.status(400).json({
        success: false,
        message: 'Scores array is required'
      });
    }

    // Save each score to database
    const savedScores = [];
    for (const scoreData of scores) {
      const gameScore = new GameScore({
        user_id: userId,
        test_name: scoreData.test_name,
        score: scoreData.score,
        time_taken: scoreData.time_taken,
        accuracy: scoreData.accuracy,
        date_played: new Date()
      });

      const savedScore = await gameScore.save();
      savedScores.push(savedScore);
    }

    // Calculate overall risk score based on game scores
    let totalScore = 0;
    let totalTime = 0;
    let riskFactors = {};

    scores.forEach(score => {
      const gameScore = score.score;
      const time = score.time_taken;

      totalScore += gameScore;
      totalTime += time;

      // Determine risk factors based on game performance
      if (score.test_name === 'trail-making' && gameScore < 50) {
        riskFactors.cognitive_flexibility = 'Low performance in trail making test suggests potential cognitive flexibility issues';
      }
      if (score.test_name === 'word-recall' && gameScore < 60) {
        riskFactors.memory = 'Poor word recall performance indicates potential memory concerns';
      }
      if (score.test_name === 'stroop' && gameScore < 40) {
        riskFactors.attention = 'Low Stroop test score suggests attention and processing speed issues';
      }
      if (score.test_name === 'depression' && gameScore < 50) {
        riskFactors.mood = 'Low mood indicators in depression assessment';
      }
    });

    const averageScore = totalScore / scores.length;
    const averageTime = totalTime / scores.length;

    // Determine risk level
    let riskLevel = 'Low';
    let riskScore = averageScore;

    if (averageScore < 40) {
      riskLevel = 'High';
    } else if (averageScore < 60) {
      riskLevel = 'Medium';
    }

    // Generate recommendations
    const recommendations = [];
    if (riskLevel === 'High') {
      recommendations.push('Immediate consultation with a mental health professional is recommended');
      recommendations.push('Consider cognitive behavioral therapy or counseling support');
    } else if (riskLevel === 'Medium') {
      recommendations.push('Monitor cognitive function regularly');
      recommendations.push('Engage in brain-training exercises and maintain healthy lifestyle habits');
    } else {
      recommendations.push('Continue maintaining healthy cognitive habits');
      recommendations.push('Regular mental health check-ups are beneficial');
    }

    // Create report object
    const report = {
      user_id: userId,
      created_at: new Date().toISOString(),
      risk_level: riskLevel,
      risk_score: Math.round(riskScore),
      explanation: riskFactors,
      game_scores: scores.map(score => ({
        test_name: score.test_name,
        score: score.score,
        time_taken: score.time_taken,
        accuracy: score.accuracy
      })),
      recommendations: recommendations,
      overall_score: Math.round(averageScore),
      average_time: Math.round(averageTime)
    };

    res.status(200).json({
      success: true,
      message: 'Cognitive assessment completed successfully',
      report: report
    });

  } catch (error) {
    console.error('Error submitting game scores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process cognitive assessment'
    });
  }
});

// GET /games/daily/:date - Get games played on a specific date
router.get('/daily/:date', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const dateParam = req.params.date;

    // Parse date (expecting YYYY-MM-DD format)
    const date = new Date(dateParam);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const gameScores = await GameScore.find({
      user_id: userId,
      date_played: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ date_played: -1 });

    res.status(200).json({
      success: true,
      date: dateParam,
      games_played: gameScores.length,
      scores: gameScores
    });

  } catch (error) {
    console.error('Error fetching daily games:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily game data'
    });
  }
});

// GET /games/history - Get user's game history with pagination
router.get('/history', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const gameScores = await GameScore.find({ user_id: userId })
      .sort({ date_played: -1 })
      .skip(skip)
      .limit(limit);

    const total = await GameScore.countDocuments({ user_id: userId });

    res.status(200).json({
      success: true,
      scores: gameScores,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching game history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch game history'
    });
  }
});

// GET /games/stats - Get user's game statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total games played
    const totalGames = await GameScore.countDocuments({ user_id: userId });

    // Get games played today
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const gamesToday = await GameScore.countDocuments({
      user_id: userId,
      date_played: { $gte: startOfDay }
    });

    // Get average scores by game type
    const gameStats = await GameScore.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$test_name',
          averageScore: { $avg: '$score' },
          averageTime: { $avg: '$time_taken' },
          gamesPlayed: { $sum: 1 },
          bestScore: { $max: '$score' }
        }
      }
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await GameScore.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId),
          date_played: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date_played' }
          },
          gamesPlayed: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total_games: totalGames,
        games_today: gamesToday,
        game_breakdown: gameStats,
        recent_activity: recentActivity
      }
    });

  } catch (error) {
    console.error('Error fetching game stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch game statistics'
    });
  }
});

export default router;