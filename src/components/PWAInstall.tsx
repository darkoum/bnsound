import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Typography,
} from '@mui/material';
import {
  GetApp,
  Close,
  PhoneIphone,
} from '@mui/icons-material';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstall: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed (standalone mode)
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show install prompt
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isStandalone || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <>
      {/* Install Banner */}
      {showInstallPrompt && deferredPrompt && (
        <Snackbar
          open={showInstallPrompt}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ 
            bottom: { xs: 16, sm: 24 },
            '& .MuiSnackbarContent-root': {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              padding: 0,
            }
          }}
        >
          <Alert
            severity="info"
            icon={<PhoneIphone />}
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleInstallClick}
                  startIcon={<GetApp />}
                  sx={{ 
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  ติดตั้ง
                </Button>
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={handleDismiss}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            }
            sx={{
              backgroundColor: 'rgba(102, 126, 234, 0.95)',
              color: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: '320px',
              '& .MuiAlert-icon': {
                color: 'white',
              },
              '& .MuiAlert-message': {
                flex: 1,
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              ติดตั้ง BN Sound System
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              เข้าถึงได้ง่ายขึ้น ใช้งานแบบออฟไลน์ได้
            </Typography>
          </Alert>
        </Snackbar>
      )}

      {/* iOS Install Instructions - ใช้ iOSPWAGuide แทน */}
      {/iPad|iPhone|iPod/.test(navigator.userAgent) && !isStandalone && (
        <Snackbar
          open={!sessionStorage.getItem('ios-install-dismissed')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={12000}
          onClose={() => sessionStorage.setItem('ios-install-dismissed', 'true')}
          sx={{ 
            bottom: { xs: 16, sm: 24 },
            '& .MuiSnackbarContent-root': {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              padding: 0,
            }
          }}
        >
          <Alert
            severity="success"
            icon={<PhoneIphone />}
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    sessionStorage.setItem('ios-install-dismissed', 'true');
                    // จะแสดง iOSPWAGuide ใน Layout component
                  }}
                  sx={{ 
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.8rem',
                  }}
                >
                  ดูวิธีติดตั้ง
                </Button>
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={() => sessionStorage.setItem('ios-install-dismissed', 'true')}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            }
            sx={{
              background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
              color: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(52, 211, 153, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: '320px',
              '& .MuiAlert-icon': {
                color: 'white',
              },
              '& .MuiAlert-message': {
                flex: 1,
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              📱 ติดตั้งแอปบน iPhone
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              ใช้งานเร็วขึ้น เหมือนแอปจริง และใช้ได้แม้ไม่มีเน็ต!
            </Typography>
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default PWAInstall; 