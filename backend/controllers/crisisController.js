import CrisisAlert from "../models/crisisAlertModel.js";

export const createCrisisAlert = async (req, res) => {
  try {
    const alert = new CrisisAlert(req.body);
    await alert.save();
  
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listCrisisAlerts = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.severity) query.severity = req.query.severity;
    const alerts = await CrisisAlert.find(query).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCrisisAnalytics = async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get crisis alerts within the time range
    const crisisAlerts = await CrisisAlert.find({
      createdAt: { $gte: startDate }
    });

    // Aggregate by type
    const typeStats = {};
    crisisAlerts.forEach(alert => {
      if (!typeStats[alert.type]) {
        typeStats[alert.type] = {
          count: 0,
          severityBreakdown: { critical: 0, high: 0, medium: 0, low: 0 }
        };
      }
      typeStats[alert.type].count++;
      typeStats[alert.type].severityBreakdown[alert.severity]++;
    });

    // Aggregate by severity
    const severityStats = { critical: 0, high: 0, medium: 0, low: 0 };
    crisisAlerts.forEach(alert => {
      severityStats[alert.severity]++;
    });

    // Aggregate by source
    const sourceStats = {};
    crisisAlerts.forEach(alert => {
      if (!sourceStats[alert.source]) {
        sourceStats[alert.source] = 0;
      }
      sourceStats[alert.source]++;
    });

    res.status(200).json({
      status: 'success',
      data: {
        timeRange,
        summary: {
          totalAlerts: crisisAlerts.length,
          uniqueTypes: Object.keys(typeStats).length,
          dateRange: {
            start: startDate.toISOString().split('T')[0],
            end: now.toISOString().split('T')[0]
          }
        },
        typeBreakdown: typeStats,
        severityBreakdown: severityStats,
        sourceBreakdown: sourceStats
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCrisisStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const alert = await CrisisAlert.findByIdAndUpdate(id, { status }, { new: true });
    if (!alert) return res.status(404).json({ error: "Alert not found" });
  
    res.json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


