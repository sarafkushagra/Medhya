import React, { useState, useEffect } from 'react';
import ResourceContent from './ResourceContent.jsx';
import NeuroAssessment from './NeuroAssessment.jsx';
import NeuroAssessmentGraph from './NeuroAssessmentGraph.jsx';
const NeuroDashboard = () => {
 
  // Full Dashboard Content for Complete Profiles
  const FullDashboardContent = () => (
    <div className="space-y-6">
      {/* Resources Content */}
      <ResourceContent />
      <NeuroAssessment/>
      <NeuroAssessmentGraph/>

    </div>
  );

  return (
    <div className="space-y-6">
      <FullDashboardContent />


    </div>
  );
};

export default NeuroDashboard;