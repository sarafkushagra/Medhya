import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { AlertTriangle, UserPlus, ArrowRight, X } from 'lucide-react';

const ProfileCompletionCheck = ({ children, requireComplete = false }) => {
  const { user, loading, checkProfileCompletion } = useAuth();
  const navigate = useNavigate();
  const [profileStatus, setProfileStatus] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [dismissedWarning, setDismissedWarning] = useState(false);
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);

  // Only check profile completion once on first load
  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!user || loading || hasCheckedProfile) return;

      try {
        setCheckingProfile(true);
        const status = await checkProfileCompletion();
        if (status) {
          setProfileStatus(status);
          setHasCheckedProfile(true);
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfileStatus();
  }, [hasCheckedProfile]); // Only depend on hasCheckedProfile to prevent re-runs

  const handleCheckStatus = async () => {
    if (!user) return;

    try {
      setCheckingProfile(true);
      const status = await checkProfileCompletion();
      if (status) {
        setProfileStatus(status);
        setHasCheckedProfile(true);
      }
    } catch (error) {
      console.error('Error checking profile status:', error);
    } finally {
      setCheckingProfile(false);
    }
  };

  const handleDismissWarning = () => {
    setDismissedWarning(true);
  };

  // Show loading while checking (only on first load)
  if (loading || (checkingProfile && !hasCheckedProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking profile status...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }


  // If we don't require completion, render children with a warning
  return (
    <>
      {children}
      {!profileStatus?.isProfileComplete && !dismissedWarning && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="w-80 shadow-lg border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800 mb-1">Complete Your Profile</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Complete your profile to access all features and get personalized support.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => navigate('/complete-profile')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Complete Now
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={handleCheckStatus}
                      disabled={checkingProfile}
                      className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                    >
                      {checkingProfile ? 'Checking...' : 'Check Status'}
                    </Button>
                  </div>
                </div>
                <button
                  onClick={handleDismissWarning}
                  className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 hover:bg-yellow-100 rounded"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ProfileCompletionCheck;
